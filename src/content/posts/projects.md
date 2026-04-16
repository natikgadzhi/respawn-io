---
title: Slopware of the month
excerpt: "Random bag of tools I've made for myself in just the last month"
created: 2026-04-15
modified: 2026-04-15
tags:
  - coding
  - open-source
---

Over just March and April, I've made a whole bunch of small CLI tools.
Some for work, some personal. It's insanely easy to make things like this now, and it's insanely difficult to scope them just right to not burn days and days on stuff you don't need.

I'm not bragging, I'm confessing. It's all slopware, use at your own risk.

```bash
brew tap natikgadzhi/taps
brew install {whatever}
```

- [`slack-cli`](https://github.com/natikgadzhi/slack-cli): read-only Slack CLI for fetching messages, threads, channel history, and search results from the terminal. Used pretty actively in a bunch of my Claude Code skills.
- [`gitbatch`](https://github.com/natikgadzhi/gitbatch): batch-updates multiple git repositories in parallel, with scheduled syncs and auto-stash support for dirty worktrees.
- [`notoma`](https://github.com/natikgadzhi/notoma): one-way sync from Notion to Obsidian, with incremental updates, attachment downloads, and database export support. I have a family Notion workspace that is on a year-long trial, and I sync things down from there.
- [`fm`](https://github.com/natikgadzhi/fm): FastMail CLI for reading and searching email. Another personal one - used in Claude Code skill to help me clean my inbox and not forget important emails.
