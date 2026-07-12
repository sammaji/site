---
title: "Build and deploy a chat application using Socket.io and Redis."
published_at: 2024-08-26T10:37:34.985Z
tags: ["SocketIO", "render", "GCP", "JavaScript", "Web Development"]
---

In this tutorial, we will be building a chat application using web sockets. Web sockets are really useful when you want to build applications that require real-time transfer of data.

By the end of this tutorial, you will be able to setup your own socket server, send and receive messages in real time, store data in Redis and deploy your application on render and google cloud run.

## What we will be building?

We will be building a chat application. To keep it short, we will only setup the server. You can use your own front end framework and follow along.

In this chat application, there will be rooms and users can join a room and start chatting. To keep everything simple, we will assume the usernames are not unique. However each room can have only one user with a specific username.

## Setup a socket server.

First we need to install the required dependencies.

```bash
npm i express cors socket.io -D @types/node
```

We will be using the `http` module to setup our socket server. Since our app will be running in the terminal, we will have to allow all origins.

```typescript
import express from "express";
import cors from "cors"
import { Server } from "socket.io";
import { createServer } from "http"

const app = express();
const server = createServer(app);

// create a socket server.
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  }
});

// listen to connections errors
io.engine.on("connection_error", console.log)

app.use(cors())

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

## Setting up Redis.

We will be using redis to store our messages along with room and user information. You can use [upstash](https://upstash.com/) redis (free). Create a new redis instance in your upstash dashboard. After creation you will receive a redis url which you can use to connect to your redis instance.

Install any redis client of your choice. I'll be using `ioredis`.

```bash
npm i ioredis
```

Next, we will initialize our redis client and connect it to our redis server using the connection url we got.

```typescript
/** /src/index.ts */
import { Redis } from "ioredis"

if (!process.env.REDIS_URL) throw new Error("REDIS_URL env variable is not set");
const redis = new Redis(process.env.REDIS_URL);

// listen to connection events.
redis.on("connect", () => console.log("Redis connected"))
redis.on("error", console.log)
```

## Handling events.

Users can create rooms or join existing rooms. Rooms are identified by unique room ids. Each member has a username which is unique inside a room, and not globally.

We can keep track of all the active rooms in our server, by storing their room ids inside a redis set.

For our purpose, usernames are only unique inside a room. So, we store them in a set along with the room id. This ensures that the combination of the room id along with the member id is unique globally.

We can setup socket event for creating room. When we create a room, we also add the member that requested its creation into the room.

```typescript
io.on("connection", () => {
    // ...
    socket.on("create:room", async (message) => {
        console.log("create:room", message)

        const doesRoomExist = await redis.sismember("rooms", message.roomId)
        if (doesRoomExist === 1) return socket.emit("error", { message: "Room already exist."})
 
        const roomStatus = await redis.sadd("rooms", message.roomId)
        const memStatus = await redis.sadd("members", message.roomId + "::" + message.username)
    
        if (roomStatus === 0 || memStatus === 0) return socket.emit("error", { message: "Room creation failed." })

        socket.join(message.roomId)
        io.sockets.in(message.roomId).emit("create:room:success", message)
        io.sockets.in(message.roomId).emit("add:member:success", message)
  })
}
```

To add new member into an existing room, we first need to check if the member already exists in that room.

```typescript
io.on("connection", () => {
    // ...
    socket.on("add:member", async (message) => {
        console.log("add:member", message)

        const doesRoomExist = await redis.sismember("rooms", message.roomId)
        if (doesRoomExist === 0) return socket.emit("error", { message: "Room does not exist." })

        const doesMemExist = await redis.sismember("members", message.roomId + "::" + message.username)
        if (doesMemExist === 1) return socket.emit("error", { message: "Username already exists, please choose another username." })

        const memStatus = await redis.sadd("members", message.roomId + "::" + message.username)
        if (memStatus === 0) return socket.emit("error", { message: "User creation failed." })

        socket.join(message.roomId)
        io.sockets.in(message.roomId).emit("add:member:success", message)
  })

    socket.on("remove:member", async (message) => {
        console.log("remove:member", message)

        const doesRoomExist = await redis.sismember("rooms", message.roomId)
        if (doesRoomExist === 0) return socket.emit("error", { message: "Room does not exist." })

        await redis.srem("members", message.roomId + "::" + message.username)

        socket.leave(message.roomId)
        io.sockets.in(message.roomId).emit("remove:member:success", message)
      })
}
```

Finally, we create the chat event.

```typescript
io.on("connection", () => {
    socket.on("create:chat", (message) => {
    console.log("create:chat", message)
    redis.lpush("chat::" + message.roomId, message.username + "::" + message.message)
    io.sockets.in(message.roomId).emit("create:chat:success", message)
  })
}
```

## Deployment.

Socket server requires persistent connections, it won't work in serverless environments. So you can't deploy your socket server in vercel.

You can deploy it in many places like Render, [fly.io](https://fly.io/?ref=https%3A%2F%2Fsammaji.hashnode.dev) or Google Cloud Run.

### Render

Deploying on render simple. If you have a dockerfile, it will automatically build your project from that dockerfile. Render has a free tier, but keep in mind there will be cold start in the free tier.

Here's my dockerfile.

```dockerfile
# syntax=docker/dockerfile:1
ARG NODE_VERSION=20.13.1
ARG PNPM_VERSION=9.4.0

FROM node:${NODE_VERSION}-bookworm AS base

## set shell to bash
SHELL [ "/usr/bin/bash", "-c" ]
WORKDIR /usr/src/app

## install pnpm.
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

# ------------
FROM base AS deps
# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.local/share/pnpm/store to speed up subsequent builds.
# Leverage bind mounts to package.json and pnpm-lock.yaml to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile

# -----------
FROM deps AS build
## downloading dev dependencies.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
    --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# -------------
FROM base AS final
ENV NODE_ENV=production
USER node
COPY package.json .

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000
ENTRYPOINT [ "pnpm" ]
CMD ["run", "start"]
```

### Google Cloud Run

If you want a free alternative to render and avoid cold starts, you should use Google Cloud Run. The steps to deploy on cloud run is beyond the scope of this article, but here's a short list of things you need to do.

1.  Build you docker image from the dockerfile provided below.
2.  Create an artifact repository using Google Artifact Registry service.
3.  Rename your docker image into the format `<region>-docker.pkg.dev/<artifact-repository-name>/<image-name>:<tag-name>`
4.  Push your image to your artifact repository.
5.  Deploy the image to Google Cloud Run. Make sure to set the minimum active instances to one, to avoid cold starts.

That's it for this tutorial.

Thanks for reading ❣️
