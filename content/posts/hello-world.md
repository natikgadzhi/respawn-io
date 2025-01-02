---
title: New site! Obsidian, Next.js, and Vercel
excerpt: "I had a couple hours on a Thursday night, and wanted to clean up my website. The result is this: a blog built with Obsidian, Markdown, Next.js, Contentlayer, and a few hacks to glue things together."
created: 2022-06-16
modified: 2025-01-02
og_image_hide_description: true
tags:
  - coding
  - obsidian
  - contentlayer
---

# Obsidian, Next.js, and Vercel

> [!warning]
> `Contentlayer` was stuck at `0.3.4` for some time. That version was behind and broken compatibility with a few things.
> For now, there is `contentlayer2` with `0.5.3` at the time of this update that works well with `Next 14.2`, and seems to work for folks on `Next 15` and `React 19`.

Here's how this thing works:

- The [source repository is open](https://github.com/natikgadzhi/respawn-io).
- It's based off Next.js static gen blog starter kit. Tailwind for markup. First time I use either of those. But hey, I have an [execute program typescript](https://www.executeprogram.com/courses/typescript) course sitting for 6 months, and I need to spike on a few typescript things at work anyway.
- I'm using [Obsidian](https://obsidian.md/) for my notes, and decided to try and use it to write the blog, too. I then `ln -s path/to/obsidian/vault/respawn.io/*` to the `content` directory. This should work for any static site generator.
- **Markdown** is rendered using [`contentlayer`](https://www.contentlayer.dev/) and it's great.
- **Analytics** is on Vercel's side, out of the box.
- Opengraph images are [generated with `@vercel/og`](https://github.com/natikgadzhi/respawn-io/commit/ab9ee315b62c094da27cb4e5cc7226d042fb2b19). This feels like dark magic and I have no idea how it works, but hey, it works. Here's an example for this post:

<img src="https://respawn.io/posts/hello-world/og-image.png" width="1200" height="630" />

- **RSS feed** is rendered with `feed` library using a script in `scripts/rss.ts`, invoked with `tsx`. Images in the RSS feed are base64-encoded and inlined.

## Caveats

- **Images** are generally stored in the content directory, side by side with a post.
  - All `.png` images are copied over from `./content/**/*.png` to `./public/` in a build step by `scripts/copy-images.sh`. That way, both the compiled website, and Obsidian vault can have nice images without too much hassle with paths.

## Same Markup, Different Presentations

Over the months, I've changed a few things, and mostly it was fun to hack on. I want most of the Obsidian features to work seamlessly in the notes that I publish. Links, callouts, footnotes, perhaps tables, images. Some of that is now solved, but there are more things on that todo list:
- [x] Content for pages, posts, and daily notes is [[contentlayer-with-multiple-data-types|generated with `Contentlayer`]].
- [x] There's some additional code that allows for MDX processing of the fields in the front matter of posts.
- [x] **Callouts**. Early on, I've had a custom `<Callout>` component that I've fed to MDX, but that would mean that the note in Obsidian has the Callout block that doesn't actually represent a Markdown callout, or a callout block Obsidian would understand. So I've switched to Obsidian-friendly callout format [in this commit](https://github.com/natikgadzhi/respawn-io/commit/831f421c7f34a101b6a49dee4db8136e3b0d0349)
- [x]  **TODOs**. `remark-gfm` mostly takes care of that, so I can have todo items with checkboxes in both Obsidian, and in the rendered blog with GitHub-flavored Markdown syntax.
- [ ] **Footnotes**. I want to be able to have footnotes that render as an _aside_ on desktops, but that show up in the usual footnotes section on smaller screens.
- [x] **Tables**. Obsidian 1.5 made a great UI on top of Markdown tables, so you can actually use them. I'd love to use tables in my posts, but that might be tricky in mobile layouts, though.
- [x] **Diagrams**. Obsidian supports Mermaid diagrams out of the box, and adding them to the site is relatively straightforward. Tweaking their sizes and color schemes to support light mode and dark mode is a little bit tricky, though.

## Content Types

- [x] **Daily notes**. I've added daily notes to be able to write and send quick, small notes, and not think twice about them — and they're fun. But now I think it's time to set up the routing, so I can link to one specific daily note.
- [x] **Tags and topics**. There's enough content to add topics, and support "native" Obsidian tags.


### UPD 2025: Diagrams

Here's an example Mermaid diagram that would render both in Obsidian and in the post correctly. It's rendered in both light and dark mode, and the right one isshown conditionally!

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```
