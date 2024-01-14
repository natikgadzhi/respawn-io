---
tags:
  - coding
  - obsidian
created: 2024-01-11
modified: 2024-01-11
title: Managing images between Obsidian and Nextjs
excerpt: Making images in posts look nice both in Obsidian, and on the built Next.js site
draft: true
---
# Managing images between Obsidian and Nextjs

In Obsidian, I put images in a directory with name matching the file name. Jekyll habits die hard. 

Wherever you put the images, for the `Next/Image` to pick them up, they need to be accessible within the build output path set for your Nextjs project (i.e. `public`), and something needs to copy them into the folder.

Or, you can just put your images in `public/images/*` in the first place, but that would mean that your favorite Markdown authoring app would have to know to consider all image paths relative to that directory too.

Here's a workaround that I came up with:
1. In Obsidian, put images within the directory that contains the note file itself.
2. An `<img>` MDX component that invokes `Next/Image` with an `src` relative to site root.
3. A build script `copy-images.js` that copies the images to the build output path.

You can then use `vercel` CLI to run the whole thing locally, and your images will be there, when you're authoring the notes in Obsidian, and when you preview the rendered blog!

