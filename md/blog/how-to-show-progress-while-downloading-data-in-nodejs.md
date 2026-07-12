---
title: "How to show progress while downloading data in node.js"
published_at: 2024-04-27T05:47:26.781Z
tags: ["Node.js", "JavaScript", "Beginner Developers"]
---

What if you are downloading a large file and need to show the users the progress of the download. You can do that by downloading the data in chunks. This is called streaming. Unfortunately, `fetch` doesn't have any support for streaming.

We need to use the node `http` module. Here's an example.

```javascript
const Http = require('http');
const Fs   = require('fs');
const url = 'url'; // some large file
const path = 'save_path';

let downloaded = 0;
let percents = 0;
let size = 0;

const request = Http.request(url, (response) => {
  size = parseInt(response.headers['content-length']);
  
  response.on('data', (chunk) => {
    downloaded += chunk.length;
    percents = parseInt((downloaded / size) * 100);
    
    console.log(percents +'%', downloaded +'/'+size);
  });
  
  response.on('error', (error) => {
    console.log(error);
  });
  
  response.pipe(Fs.createWriteStream(path));
  
  setTimeout(() => {
    response.pause(); console.log('stream paused');
    
    setTimeout(() => {
      response.resume(); console.log('stream resumed');
    }, 5000);
  }, 5000);
}).end();
```
