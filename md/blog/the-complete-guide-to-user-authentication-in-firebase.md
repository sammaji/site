---
title: "The Complete Guide to User Authentication in Firebase"
published_at: 2023-02-10T11:09:32.999Z
tags: ["Firebase", "JavaScript", "Web Development", "webdev"]
---

In this blog, we'll cover how to implement a simple login signup functionality using firebase. We'll be using [modular JavaScript SDK](https://firebase.google.com/docs/web/learn-more?authuser=0&hl=en#modular-version), which (according to the documentation) provides a reduced SDK size and greater efficiency with modern JavaScript build tools such as [Webpack](https://webpack.js.org/) or [Rollup](https://rollupjs.org/).

### Why use firebase?

Although there are other options like Auth0, Cognito, Okta, etc., firebase just stands out as it is free and very easy to use.

### Installation and Setup

Setting up a firebase project is pretty straightforward.

- Go to your [firebase console](https://console.firebase.google.com/).
- Select "Add project". Enter your project name and continue.
- Now when you are inside your project, create a firebase app.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1676026616346/79e0cd30-b0b3-4001-b9ae-992c97b9187a.png)

- Copy the firebase config settings.

To install firebase in your project, just run one of these commands:

```bash
npm install firebase
yarn add firebase

# optionally you can install the firebase-cli
npm i firebase-tools
yarn add firebase-tools
```

### Signing in a new user

Create a new file called `firebase.js` and add your firebase config settings. Then you can create a firebase app instance using the `initializeApp` function.

We can use the firebase app instance to create a firebase auth instance using `getAuth` function which will take your firebase app as a parameter. We'll use this auth instance to log in / sign in / sign out users.

```javascript
import { initializeApp } from "firbase/app"
import { getAuth } from "firebase/auth"

/**
 * config settings for firebase
 * these setting will not work as I will delete the project
 * copy your own settings and put it in .env file
 */
const firebaseConfig = {
  apiKey: "AIzaSyCxoi3v425fyZ3WO1r4N7U-zCFWbliU4eQ",
  authDomain: "test-fireba-9108e.firebaseapp.com",
  projectId: "test-fireba-9108e",
  storageBucket: "test-fireba-9108e.appspot.com",
  messagingSenderId: "759607951227",
  appId: "1:759607951227:web:c2c071782154578f6107de"
}
const firebaseApp = initializeApp(firebaseConfig)
const firebaseAuth = getAuth(firebaseApp)
```

Ideally, you would want to use a `.env` file, where you'll put all your config settings as environment variables. If you are putting your code in a public repository, make sure you are not sending your `.env` file there. This will prevent others from accessing your API keys and other sensitive information.

```javascript
// .env file
API_KEY=AIzaSyCxoi3v425fyZ3WO1r4N7U-zCFWbliU4eQ
AUTH_DOMAIN=test-fireba-9108e.firebaseapp.com

// firebase.js
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN
}
```

Signing in a new user is very easy in firebase. We need to create a user with \`createUserWithEmailAndPassword\` function. This will return a promise that when resolved will return an `UserCredentail` object. That `UserCredentail` object will have a `user` property that will store all information regarding our users, if they are signed in.

We can also wrap the code in a function so that we can use it somewhere else (maybe on a button click).

```javascript
import { createUserWithEmailAndPassword } from "firebase/auth"

export const SignUp = async (email, password) => {
  // firebaseAuth - the firebase auth instance we created previously
  // email, password - string values for email and password
  createUserWithEmailAndPassword(firebaseAuth, email, password)
  .then(userCred => {
    // userCred.user will have all information
    // regarding our user, if they are signed-in
    console.log(userCred.user?.email)
  }
}
```

Now you can set up a simple UI with inputs and buttons, and call the `SignUp` function on button click. You can also add some client-side email/password validation. Also, it's best to wrap the code in a `catch` block and display proper error messages. These are very easy to implement, so I'll leave it on you.

### Logging in an existing user

In firebase, log-in is very similar to sign-in. Just instead of calling `createUserWithEmailAndPassword` , we'll call `signInWithEmailAndPassword` .

```javascript
import { signInWithEmailAndPassword } from "firebase/auth"

export const LogIn = async (email, password) => {
  // firebaseAuth - the firebase auth instance we created previously
  // email, password - string values for email and password
  signInWithEmailAndPassword(firebaseAuth, email, password)
  .then(userCred => {
    // userCred.user will have all information
    // regarding our user, if they are signed-in
    console.log(userCred.user)
  }
}
```

### Sign Out

Sign-out is pretty simple. Just call the `signOut` function and pass in the firebase auth instance

```javascript
import { getAuth, signOut } from "firebase/auth";

export signOut(firebaseAuth)
.then(() => {
  // Sign-out successful.
}).catch((error) => {
  // show your error messages
});
```

Thanks for reading the blog! Hope you enjoyed it.
