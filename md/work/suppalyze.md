# Suppalyze

Suppalyze ([suppalyze.com](https://www.suppalyze.com)) is a supplements directory. Antony, the founder, is an expert on supplements. He wanted to build a directory of supplements for various usecases.

That was pretty straightforward to build. Built a landing page, auth, stripe subscription and CMS integration to proved a good experience for publishing new supplements.

What was not so straightforward was building a forum. Normally, you can just build a forum yourself if you had enough time. I didn't. And I half expected some integration of Discourse, ForumPress or any other forum software. But none had nextjs or any javascript integration. Well discourse did provide a self hostable api. But integrating the api with frontend would be tedious (reaction, tagging, markdown editor, loading & error states on everything, etc.) and time consuming. Time I did not have.

Given time, I could have deployed a PHP app on another subdomain and integrated it with my existing app. But it was not worth it. Even the ones written in PHP are not free or lacking some features.

Yes, it was my fault. Should have done more research.

The solution I came up with was to use github discussions in a hacky way. There's a tool called [giscus](https://giscus-component.vercel.app/react) which is a wrapper over github discussions api and lets you embed it anywhere in your website. It was a bit more tricky than this since, we needed to create three discussions groups per forum.

It had all the features of a forum — topics, nested comments, reactions, tagging, markdown editor, etc and its fast and free. Only limitation is you need a github account.
