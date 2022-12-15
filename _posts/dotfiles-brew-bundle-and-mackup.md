---
created: 2022-12-14
modified: 2022-12-14
date: 2022-12-14
title: "Setting up a New Mac with dotfiles, brew bundle, and mackup"
excerpt: "When you can't quite use the Migration Assistant, but not ready to geek out all the way with Ansible."
---

# dotfiles, brew bundle, and mackup

I was rather stubborn at having just one laptop for work and personal use, but finally decided it's time to separate the two activities out. So it was time to setup a new machine!

Everyone has their own little script to set things up. I just had a dotfiles repo that I mostly used to  to set things up on Linux boxes. [Here's how I cleaned it up](https://github.com/natikgadzhi/dotfiles): 

1. dotfiles with `dotbot` with settings for common unix software, the usual. This way, the first layer of the backup is applicable on "any platform".
2. `Brewfile` for `brew bundle install` downloads all the things, including apps from casks and Mac App Store. 
3. `mackup restore` grabs Mackup dump that has Mac-specific apps and settings.