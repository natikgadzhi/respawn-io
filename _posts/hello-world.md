---
title: "New site! Obsidian, Next.js, and Vercel"
excerpt:
  "I had a couple hours on a Thursday night, and wanted to clean up my website."
date: 2022-06-16
modified: 2022-12-19
---

# Obsidian, Next.js, and Vercel

Here's how this thing works:

- The [source repository is open](https://github.com/natikgadzhi/respawn-io).
- It's based off Next.js static gen blog starter kit. Tailwind for markup. First time I use either of those. But hey, I have an [execute program typescript](https://www.executeprogram.com/courses/typescript) course sitting for 6 months, and I need to spike on a few typescript things at work anyway.
- I'm using [Obsidian](https://obsidian.md/) for my notes, and decided to try and use it to write the blog, too. I then `ln path/to/obsidian/vault/respawn.io/*` to my `_posts` dir. This should work for any static site generator.

  Since it's just a hard link, I can author the posts in Obsidian and edit them later, then just push it up, and Vercel will spin up a new build.

  Another approach would be to point `postsDirectory` to a subdirectory in the Obsidian vault. While you can get away without hardlinks, you might run into issues with links between notes and linking assets later.

- Markdown is rendered using [`next-mdx-remote`](https://github.com/hashicorp/next-mdx-remote), so I can use `next/image`, or other callout, diagrams, or chart blocks.
- Fathom analytics with [`fathom-client`](https://github.com/derrickreimer/fathom-client). The way it's plugged in the code is crap, but it works out of the box with Next routing.
- Opengraph images are [generated with `@vercel/og`](https://github.com/natikgadzhi/respawn-io/commit/ab9ee315b62c094da27cb4e5cc7226d042fb2b19). This feels like dark magic and I have no idea how it works, but hey, it works. Here's an example for this post:

<Image src="https://respawn.io/api/opengraph/post?title=New site! Obsidian, Next.js, and Vercel&description=I had a couple hours on a Thursday night, and wanted to clean up my website.&slug=hello-world" width="1200" height="630" />