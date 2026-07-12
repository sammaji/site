---
title: "Everything about Data Fetching & the JavaScript Fetch API."
published_at: 2024-03-12T14:54:13.360Z
tags: ["JavaScript", "Tutorial", "Web Development"]
---

The lifeblood of modern web applications is data. They rely on fetching information from various sources to deliver dynamic and interactive experiences. This is where the [JavaScript Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) comes in – a powerful tool that simplifies how you retrieve data across networks.

## Making a fetch request.

Fetch is a [promise](https://javascript.info/promise-basics) based api. To make a fetch request, use the `fetch()` function. It takes two arguments - first, the URL endpoint you want to send the request to. The second argument is optional and you can put additional properties, like headers, body, etc.

Here's an example of using the `fetch()` function:

```javascript
const makeReq = async () => {
    const res = await fetch('https://dummyjson.com/todos');
    const json = await res.json();
    console.log(json);
}

makeReq();
```

In the above example, we make a HTTP `GET` request to https://dummyjson.com/todos. We get a response object back, containing all the information we need. The `json()` method is used to convert the body of the response object into JSON.

## Post request with Headers.

The default request type is `GET`. But, you can make other types of requests too. Here is an example of a `POST` request, with some custom headers and a body.

```javascript
fetch('https://dummyjson.com/todos/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept-Type': 'application/json'
    },
  body: JSON.stringify({
    todo: 'example todo',
    completed: false,
    userId: 5,
  })
})
```

The method property is used to define the type of the HTTP request. It can be `GET`, `POST`, `PUT`, `PATCH`, `DELETE` and `OPTION` . The body contains the payload you want to send. We convert our object into a string, as the body can only be a string, buffer or blob. You can't put a body if you are making a `get` request.

The `headers` property will accept all the headers. In our example we included two headers. Many apis, will require you to put api keys or access token in the headers.

## HTTP status codes.

When we get an HTTP response from a server, it contains a status code, indicating whether the request was successful or not. For example, a status code of 404 means the resource you are requesting does not exist. A status code 422 might mean you haven't provided something the server needs. A status code of 401 means you are not authorised to access the resource. In general:

- status code between 200-299 means success.
- status code between 400-499 means client side error, error from your side.
- status code between 500-599 means server side error, error from the server.

The `fetch()` api doesn't throw any error even for error status codes. You have to do it manually.

```javascript
const makeReq = async () => {
    const res = await fetch('https://dummyjson.com/todos');
    if (res.ok) {  // true for status codes <400
        const json = await res.json();
        console.log(json);
    }
    else {
        console.error("failed to fetch todos");
    }
}

makeReq();
```

## Cancelling Fetch Request

You can cancel a fetch request using `AbortController`. The `AbortController` interface represents a controller object that allows you to abort one or more requests as and when desired. It has a `signal` property which returns an `AbortSignal` object. If you pass this object in your fetch request, then you can abort that request.

Here's an example:

```javascript
const controller = new AbortController();

const start_download = async () =>
  await fetch("url", { signal: controller.signal });

const stop_download = async () => controller.abort();

// start download
const btn_startDownload = document.getElementById("#btn_start_download");
btn_startDownload?.onclick(() => {
  alert("starting download...");
  start_download()
    .then((data) => alert("download finished!!"))
    .catch(() => alert("can't download"));
});

// cancel download
const btn_cancelDownload = document.getElementById("#btn_cancel_download");
btn_cancelDownload?.onclick(() => {
  stop_download();
  alert("downloading stopped!!");
});
```

If you run this code, you will notice that the "can't download" message will be shown when your download is cancelled or request is aborted. The reason is when, a request is aborted, a `DOMException`, named `AbortError` is thrown. If the fetch request is already complete, no error is thrown.

We can modify our code to not display any error message when the request is successfully aborted.

```javascript
const btn_startDownload = document.getElementById("#btn_start_download");
btn_startDownload?.onclick(() => {
  alert("starting download...");
  start_download()
    .then((data) => alert("download finished!!"))
    .catch((error) => {
      // no error messages when request is aborted
      if (error.name === "AbortError") return;
      alert("cancelled download!");
    });
});
```

That's all you need to know about the fetch api. Thanks for reading ❣️
