---
title: "Time for a rewrite!"
excerpt: It's December, I had a couple of days, and the blog was broken.
created: 2025-12-28
modified: 2025-12-28
draft: false
meta_description: "Mandatory annual blog rewrite from Contentlayer and NextJS to Astro"
meta_keywords: "contentlayer2, contentlayer, nextjs, astro, mermaid"
tags:
  - coding
  - contentlayer
  - astro
---

It's December, I had a couple of days, wanted to write. But the writing thing wasn't writing — because Contentlayer and NextJS have a tendency to not work if I don't touch it for a few months. Frontend people, how the fuck do you live like this?

Anyway. Clearly the only way out was to self-host the blog on a k8s cluster in my garage, and completely rewrite it while I'm at it, so here we are.

Some of the stuff in [[hello-world|Hello World]] no longer works (Obsidian as the main editor, mainly, because content paths changed), but the rest works great. Don't be me, don't try to duct tape dead open source libraries. Use ones that are nice, ergonomic, have a great community (ideally not being led by nazis, so, you know, drop rails). 

Astro is pretty great.
- Mermaid diagrams [work out of the box since Astro 5.5](https://astro.build/blog/astro-550/#better-support-for-diagramming-tools-in-markdown).
- Code highlights work out of the box as well. I haven't figured dark mode for them yet, but that's next.
- Dark mode for code highlights is now implemented using a custom theme.

Now, you'd think I have some notes on how to migrate from Contentlayer to Astro, but nope. I asked my friend Claude, and they helped me out for a few bucks. Worth it. I should've picked up the memo when Cramer was doing things with Astro two years ago.

Now I get to be on-call on my own Alertmanager over my own Prometheus with my own Blackbox and out of band monitoring thing, and be stressed about PG&E and Comcast playing dead. That's the life.
