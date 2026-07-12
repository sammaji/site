---
title: "Write semantic HTML"
published_at: 2022-12-16T19:37:29.217Z
tags: ["semantichtml", "HTML tags ", "HTML5"]
---

If you are like me, you probably are using `div` everywhere. It's bad practice. Your code is both harder to read and not search engine optimized. Here's a list of all HTML tags that you should use to make your code more readable.

All the tags mentioned below work in a similar manner to `div` unless mentioned otherwise.

### 1\. Article

The `<article>` element specifies independent, self-contained content.

Use it when you wish to display something that makes sense on its own. Let's take this blog. The content of this blog does not need the Hashnode website to make sense. I can put it on my website and it would still make sense. Hence I'll use `<article>` here.

Generally used to write an article (of course), a blog, a tweet or something like that, product info and so on.

### 2\. Section

The `<section>` the element represents a generic standalone section of a document, which doesn't have a more specific semantic element to represent it. What that means is when you don't know what to use, use `<section>`.

### 3\. Nav

The `<nav>` tag is used to define a set of navigation links. According to W3Schools, the `<nav>` element is intended only for major blocks of navigation links.

Personally, I use them only to create a menu.

### 4\. Main

As the name suggests, the `<main>` tag specifies the "main" content. Also, it's best practice to not include elements like sidebars, navigation links, logos, headers and so on.

So, for this page, the blog (from the heading to the end) is the main element.

### 5\. Header

Use it to display introductory content like headings, logos and navigation links. Generally, `<header>` element is used inside a navbar or as a container for headings, icons and logos.

Let's say you want to create a product page. You'll use `<article>` for the product card, and use `<section>` for something like user comments or ratings or a section that shows similar products.

### 6\. Footer

A `<footer>` tag is generally used to provide extra information like additional links, contacts, copyright information, citation, project details and so on.

These are the ones you are gonna need the most. Of course, there is more! Will make a part 2 soon✌️

Also, don't overdo it.
