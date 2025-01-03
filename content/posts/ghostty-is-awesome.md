---
created: 2024-12-31
modified: 2024-12-31
title: Ghostty is awesome
excerpt: "`@mitchellh`'s new terminal app is pretty great."
meta_description: Switching from iTerm to Ghostty and configuring minimal keybinds.
tags:
  - terminal
  - ghostty
  - open-source
---

# Ghostty is awesome

I've used iTerm2 for as long as I can remember myself using a Mac. I'd say iTerm and I are on good terms in our relationship.

<WithAside>
At some point, I tried switching to `vim` and thought, wow, I want something faster — so I tinkered with [Alacritty](https://github.com/alacritty/alacritty) and [Kitty](https://github.com/kovidgoyal/kitty), and they're both good. But I could never quite switch to them completely.
<Aside>
I missed the memo — Alacritty got a rewrite in Rust? Huh! 👏 🦀
</Aside>
</WithAside>

Then there's the Warp (ugh) abomination and Wave (promising, but niche).I just want a great, fast terminal that has a quick terminal window.

[Mitchell Hashimoto](https://mitchellh.com/) [released Ghostty 1.0](https://ghostty.org/), and it's absolutely awesome! It's all I asked for. Fast, snappy, intuitive, very easily configurable, and has `toggle_quick_terminal` built-in already.

<WithAside>
Here's my [config](https://github.com/natikgadzhi/dotfiles/blob/main/.config/ghostty/config):

<Aside>
    Someone made a very cool [Ghostty configuration app for Mac](https://github.com/zerebos/ghostty-config).
</Aside>
</WithAside>

```shell
# ~/.config/ghostty/config

# The syntax is "key = value". The whitespace around the
# equals doesn't matter.

keybind = ctrl+z=close_surface
keybind = ctrl+d=new_split:right
keybind = ctrl+v=new_split:down
keybind = ctrl+shift+.=reload_config

# Global keybinds work system-wide as long as
# Ghostty application is running.
keybind = global:ctrl+`=toggle_quick_terminal


font-family = "JetBrains Mono"
font-size = 16

# Run ghostty +list-themes to browse available themes.
theme = andromeda
cursor-style = block

# You might now want this, I'm using Fish, but you're likely on Zsh.
shell-integration = fish
shell-integration-features = cursor, sudo, title

macos-titlebar-style = tabs
macos-option-as-alt = true

# Auto-update Ghostty when a new release is available.
auto-update = download

# gpg pinentry freaks out if $TERM is not set
term = xterm-256color
```

## Configuration caveats

**You probably will want a system-wide command to open your terminal even if Ghostty is not running**. I'm using `skhd` for this:

```bash
shift + ctrl - esc: osascript -e 'tell application "Ghostty" to activate'
```

If you're using Raycast, you might just set an Application shortcut for Ghostty and that would do the same thing.

> [!note]
> Ghostty has configuration actions, like `ghostty +list-themes`, but I have not yet found a way to run Ghostty and tell it to open the quick terminal window instead of the standard window. I.e. run Ghostty without opening windows, and then programmatically trigger `toggle_quick_terminal`.

**Ghostty is using OS-native tabs on MacOS**. If you're still using Yabai (tiling window manager), it freaks out when you make a new tab and you have to retile. Honestly, it's probably time to switch to Raycast for tiling, but alternatively, you could probably get away with `unconsumed:` keybind modifier in Ghostty, and then catch the same keybind in `skhd` and retile on it, after sleeping for 0.2 seconds or something. Hacky.

## Open source!

Unsurprisingly Ghostty is open source under Apache 2 License, and it's written in Zig. Just like with Zed, I'm very excited that if I need any changes to my favorite text editor or terminal, I can, in theory, just go and work on them myself, and learn a lot in the process. If you want to play around with Zig, here's a [bunch of `contributor friendly` issues](https://github.com/ghostty-org/ghostty/issues?q=is:issue%20state:open%20label:%22contributor%20friendly%22).
