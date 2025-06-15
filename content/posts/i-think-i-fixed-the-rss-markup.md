---
created: 2024-01-14
modified: 2024-01-14
title: I Think I Fixed the RSS Content Markup?
excerpt: Turns out, rendering MDX in an RSS feed in Next.js is a PITA
tags:
  - coding
  - obsidian
  - contentlayer
---
# I Think I Fixed the RSS Content Markup?

Looking back at [[hello-world| when I just started writing]], I'm happy with where it ended up. Tinkering with it is a good adventure, but some things are way more painful than they have to be.

One of them is [figuring out how to render the formatted posts body in the RSS feed](https://twitter.com/pepicrft/status/1743955508552257862). The problem is that the post body is in MDX, and Contentlayer has opinions on how it can be rendered:

```js
// You grab the component based on a posts. body.
const MDXContent = getMDXComponent(post.body.code);
return (
    <MDXContent components={mdxComponents} />
)
```


That's great for pages composed of React components. But there's a problem. In a "_static_" Next.js site you can either pre-generate RSS feeds in a build-time script, or render the feed in a Next.js page, or an API route.

Neither of those approaches give you  a page that you can compose with React code.  Usually, you'd use `rss` or `feed` library and shove the result in a file, or an HTTP response.

To render that outside of a React context, you _can_ hypothetically to `ReactDOMServer.renderToString`, but Vercel does not like that.

## Workaround for MDX in RSS Is to, Well, Not Use MDX in RSS

Instead, I ended up extracting up the `remark` and `rehype` plugins I'm using into a reusable block, and [making a separate method that renders post markup with regular remark → rehype pipeline, without MDX](https://github.com/natikgadzhi/respawn-io/blob/f2b2881914ec592ac6a3c8bbd2de8a4b63bf2cbb/lib/markdownToHTML.ts).

Sprinkled with some `//@ts-ignore`, this works, except for custom MDX components, which, if we're honest, probably won't be a good fit for an RSS reader anyway. If you go that path, just make sure to have alternative Rehyp plugins that would clean out the custom component markup.

## Inlining Images in RSS

The other tricky problem in Obsidian + Next.js combo are paths to posts and assets. Because the site repository has posts in `./content/{type}/{slug}.md`, the relative path from the root is going to be different, so I had to preprocess them:
- `remark-wiki-links` has `hrefTemplate` that works great to preface the post paths.
- You can treat `<img>` as a custom MDX component and override image path in `src` (or use any rehype plugin to do a similar flow).

But, for the RSS feed and for a newsletter, you'd have to either set absolute asset URLs, or inline them. So I've set up `rehype-embed-images` replace image sources with base64 encoded images. That way, RSS readers should be able to pick them up.

## Just Use Jekyll

Seriously, there are a number of ways to build a blog the easy way. Author in Obsidian, iA Writer, Ulysses, whatever you want — just publish with something battle-tested and simple, like Jekyll. Or Obsidian Publish. Or _maybe_ Astro? I haven't tried that one yet. But Next.js for a blog is a bit of an overkill.

_Maybe_ edge opengraph images were worth it? Not quite sure.
