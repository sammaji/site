---
title: "Vite: The Fast, Simple, and Efficient Build Tool for Web Developers"
published_at: 2023-02-26T11:30:35.636Z
tags: ["vite", "Build tool", "Web Development", "webdev", "Hot Module Replacement"]
---

If you're a developer who's looking for a faster, simpler and more efficient way to build web applications, then Vite might be just what you need.

In this blog post, we'll learn to use Vite, and how it can help you build your web applications more quickly and efficiently. We'll also cover topics like **Hot Module Replacement**, **Tree Shaking**, **SWC** and so on.

## What is Vite?

Vite is a modern build tool for web development that emphasizes speed and simplicity. It uses native ES modules to deliver lightning-fast performance during development and leverages features like **hot module replacement** and **tree shaking** to optimize the size and performance of your production builds. Vite is designed to be easy to use, with a simple configuration and a low learning curve, making it an ideal tool for web developers who want to build fast and efficient web applications without getting bogged down in complex configuration and setup.

## Getting Started

Getting started with Vite is a breeze. All you need to do is run a few commands.

```bash
npm create vite@latest app-name
yarn create vite app-name
```

Then go ahead and select the template you want. For example, we want to create a react project with JavaScript. Go ahead and select `react` and then `JavaScript + SWC`.

This will create an empty project with no dependencies installed. You need to do it manually.

```bash
# go to project directory
cd app-name

# install dependencies
npm ci
yarn
```

Now you are good to go.

## Development Server

When you're working on your application during development, you'll typically use a development server to serve your files. The development server is designed to make it easy to test your code as you're writing it. To start your development server in Vite, all you have to do is run `npm run dev` or `yarn dev`. Here are some of the key features of the development server:

### **Fast Build Times**

The development server can build and serve your application quickly, so you can test your changes in real-time.

### **Hot Module Replacement**

Hot module replacement (HMR) is a technique used to improve the developer experience by allowing you to see your changes in real-time without having to refresh the page.

Traditionally, when you make changes to your code, you need to refresh the page to see the updates. This can be time-consuming and disruptive to your workflow. With HMR, the changes you make to your code are automatically injected into the running application, without the need for a page refresh.

HMR works by detecting which modules in your code have changed and then updating them in the running application. This means that you can see your changes instantly, without losing your current state or having to navigate back to where you were in the application.

HMR is especially useful in larger applications, where navigating to a specific page or state can take time. With HMR, you can make changes to your code and see the results in real-time, without having to spend time navigating back to the relevant page or state.

### **Debugging Tools**:

The development server often comes with built-in debugging tools, like error messages and console logs, to help you find and fix issues in your code.

The development server is not intended for use in a production environment, as it is optimized for speed and ease-of-use, rather than performance and security.

## Production Build

When you're ready to deploy your application to a live environment, you'll typically use a production build. A production build is a version of your application that has been optimized for performance and security.

To create your production build, run the command:

```bash
# create your production build (for vite)
npm run build
yarn build

# start a server for viewing your production build
npm run preview
yarn preview
```

Here are some of the key features of a production build:

### **Minified Code**

The code in a production build is typically minified. This is done by removing comments and blank spaces. It also changes function names and variable names to something smaller. This is done to reduce the bundle size and make it load faster in the browser.

```javascript
/* ORIGINAL CODE*/
// this function prints a message to the console
const printMessage = (message) => {
    console.log(message);
}
/* MINIFIED CODE */
const p=s=>{console.log(s)};
```

### **Tree Shaking**

Tree shaking is a technique used to remove unused code from your application, also known as dead code elimination. The term "tree shaking" comes from the idea of shaking a tree to remove dead leaves or branches.

When you build a web application, you typically include a lot of code that you don't actually need. This could be code that you wrote but never ended up using, or code that you imported from a library but only used a small portion of. This unused code takes up space in your application, which can slow down its performance.

Tree shaking works by analyzing your code to determine which parts are actually being used. It then removes the unused code from your application, resulting in a smaller and more efficient codebase. This process can dramatically reduce the size of your application, leading to faster load times and improved performance.

Tree shaking is typically done as part of the build process for your application. Many modern module bundlers, such as Webpack and Rollup, include built-in support for tree shaking (Vite uses Rollup under the hood). When you run your application through one of these tools, it will automatically analyze your code and remove any unused portions.

It's important to note that not all code can be tree shaken. Some code may be dynamically loaded at runtime or may have complex dependencies that make it difficult to determine whether it's being used. In these cases, you may need to manually remove unused code or optimize your application in other ways.

### **Caching**

The assets in a production build are often cached by the browser, which means that they can be loaded more quickly for returning visitors.

A production build is designed to be used in a live environment, where performance and security are top priorities. Vite configures all of these for you so you don't have to worry about manually configuring it.

## What is SWC?

SWC is a rust-based compiler that claims to be "**20x faster than Babel** on a single thread and **70x faster** on four cores". If you want to use babel instead, just select `JavaScript + SWC` or `TypeScript + SWC`.

Keep in mind that meta-frameworks like **Next** and tools like **Parcel** and **Deno** use SWC.

## Module Bundlers - Quick Introduction

Vite is designed to be easy to use and configure, but this simplicity can also be a disadvantage if you need more fine-grained control over your build process. Some developers may find that Vite's configuration options are too limited for their needs. If you want more fine-grained control, you need to use module bundlers.

Module bundlers are tools used in web development to combine multiple modules of JavaScript code into a single file, known as a bundle. This process is commonly referred to as "bundling". Some popular module bundlers for web development include Webpack, Rollup and Snowpack. Keep in mind Vite uses Rollup under the hood.
