---
title: "New website! Obsidian, Next.js, and Vercel."
excerpt:
  "I had a couple hours on a Thursday night, and wanted to clean up my website."
date: "2022-06-16"
created: 2022-06-16
modified: 2022-06-30
---

Here's how this thing works:

- The [source repository is open](https://github.com/nategadzhi/respawn-io).
- It's based off Next.js static gen blog starter kit. Tailwind for markup. First time I use either of those. But hey, I have an [execute program typescript](https://www.executeprogram.com/courses/typescript) course sitting for 6 months, and I need to spike on a few typescript things at work anyway.
- I'm using [Obsidian.md](https://obsidian.md/) for my notes, and decided to try and use it to write the blog, too. I then `ln path/to/obsidian/vault/respawn.io/*` to my `_posts` dir. This should work for any static site generator, of course.

  Since it's just a hard link, I can author the posts in Obsidian and edit them later, then just push it up, and Vercel will spin up a new build.

  Another approach would be to point `postsDirectory` to a subdirectory in the Obsidian vault. While you can get away without hardlinks, you might run into issues with links between notes and linking assets later.
