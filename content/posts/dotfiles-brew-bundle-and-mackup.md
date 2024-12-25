---
created: 2022-12-14
modified: 2023-07-24
title: "Setting up a New Mac with dotfiles, brew bundle, and mackup"
excerpt:
  "When you can't quite use the Migration Assistant, but not ready to geek out
  all the way with Ansible."
tags:
  - coding
---

# Setting up a New Mac with dotfiles, brew bundle, and mackup

I was rather stubborn at having just one laptop for work and personal use, but
finally decided it's time to separate the two activities out. So it was time to
setup a new machine!

Everyone has their own little script to set things up. I just had a dotfiles
repo that I mostly used to to set things up on Linux boxes.
[Here's how I cleaned it up](https://github.com/natikgadzhi/dotfiles):

1. dotfiles with `dotbot` with settings for common unix software, the usual.
   This way, the first layer of the backup is applicable on any POSIX platform.
2. `Brewfile` for `brew bundle install` downloads all the things, including apps
   from casks and Mac App Store.
   [Here's my current `Brewfile`](https://github.com/natikgadzhi/dotfiles/blob/main/Brewfile).
   UPD: turns out, it bundles `vscode` extensions in it, too — that's not
   necessarily the best way to manage your VSCode extensions.
3. `mackup restore` grabs Mackup dump that has Mac-specific apps and settings.

## Backing up the old machine

To setup a new machine with just the software and configuration that you need,
you first need to back it up from the old machine. Here's the minimal path to
get it to work with the dotfiles like mine:

### Backing up your dotfiles

First, you need to install `dotbot` and move your existing configuration files
into a dotfiles directory and push it up to a git or Mercurial repository.
[Here's the installation instructions on GitHub](https://github.com/anishathalye/dotbot#integrate-with-existing-dotfiles).

> If you already have a directory with dotfiles — great! You can restore them
> manually, sure, or you can still use `dotbot` install script to simplify it
> for you, or run arbitrary commands after copying the dotfiles over. The
> internal structure of your existing dotfiles does not matter, you can
> configure it for dotbot in `install.conf.yaml`.

```bash
# First off, you need to make a directory to collect all the important dotfiles.
# This example assumes a new directory, but you can just cd in yours if you have one already.
# This example is based on the one in dotbot GitHub, but tweaked for my personal directory structure.
mkdir -p ~/src/dotfiles
cd ~/src/dotfiles
git init # initialize repository if needed
git submodule add https://github.com/anishathalye/dotbot
git config -f .gitmodules submodule.dotbot.ignore dirty # ignore dirty commits in the submodule
cp dotbot/tools/git-submodule/install .
touch install.conf.yaml
```

```yaml
# install.conf.yaml
# This example is based on my install.conf.yaml at the time of the writing:
# https://github.com/natikgadzhi/dotfiles/blob/main/install.conf.yaml
#
# Here's the dotbot config guide: https://github.com/anishathalye/dotbot#configuration

# By default, create, relink, and rewrite each config file defined in this config.
- defaults:
    link:
      create: true
      relink: true
      force: true

# clean will prune any dead symlinks to any of the listed file paths below in the directory.
- clean: ["~"]

# links specify which configuration files from the dotfiles repository to
# link on a target system, and where they should be located on
# the target system, and in the repo.
- link:
    ~/.tmux.conf:
      path: .tmux.conf
    ~/.gitconfig:
      path: .gitconfig
    # Take all of the files and directories in .config dir of this repo,
    # and link them to the target system
    # at ~/.config.
    ~/.config/:
      glob: true
      path: .config/*
    ~/.gnupg/gpg-agent.conf:
      path: gpg-agent.conf
    ~/.ansible.cfg:
      path: .ansible.cfg
    # This is the neat part: dotbot configuration manages Mackup configuration.
    ~/.mackup.cfg:
      path: .mackup.cfg

    # These two launchctl agents are only required on Mac OS
    # to make gpg-agent play nice with ssh auth in apps that don't start
    # from shell with it's environment.
    ~/Library/LaunchAgents/homebrew.gpg.gpg-agent.plist:
      path: Library/LaunchAgents/homebrew.gpg.gpg-agent.plist
    ~/Library/LaunchAgents/link-ssh-auth-sock.plist:
      path: Library/LaunchAgents/link-ssh-auth-sock.plist

# If you want to run any commands right after the dotfiles setup is complete,
# you can do that here.
# For example:
# - chsh -s $(which fish) to setup your shell, assuming fish is installed.
# - vim +'PlugInstall --sync' +qa to istall vim plugins, assuming you use vim-plug to manage them.
- shell: []
```

### Making a `Brewfile`

Homebrew has a mechanism to dump all your installed packates into a `Brewfile`:

```bash
# brew bundle dump will make a Brewfile in the current directory,
# but you can explicitly give it a path with --file flag.
brew bundle dump --file ~/src/dotfiles/Brewfile --force
```

The resulting file will include:

- Homebrew native packages that you installed manually that are not dependencies
  of other packages. If you're making a new `Brewfile` on an existing system
  that has a few years of cruft on it, you might want to review your `Brewfile`
  and only keep the packages that you want on your new system(s).
- List of all `Casks` installed — that's why I prefer to install as much
  software as I can with Homebrew. A lot of applications
  [can be installed via Casks](https://github.com/Homebrew/homebrew-cask): Zoom,
  Firefox, Slack, Fantastical, Spotify to name a few.
- Homebew **also has a way to bundle all of the applications that you installed
  via Mac App Store** [called `mas`](https://github.com/mas-cli/mas). For App
  Store apps to be included, you will need to `brew install mas` before you
  `brew bundle dump`.

**Note:** `Brewfile` is in the `dotfiles` repository, but it will not be
symlinked into the target system with `dotbot`.

### Backing up various Mac-specific app settings with Mackup

[Mackup](https://github.com/lra/mackup) is a neat little backup utility for Mac
computers that can backup a lot of applicaation specific and system settings
that don't quite fit into `dotfiles`. I think it's intended to be used
standalone, and by default it would attempt to backup into Dropbox, if it
detects that it's available. But
[you can backup to any directory you want](https://github.com/lra/mackup#supported-storages),
and I prefer backing up into my dotfiles repository.

To only backup the app settings that you want, you can do the following:

1. `brew install mackup`
2. Create a `.mackup.cfg` file in your home directory. I prefer to backup this
   file with `dotbot` as well.
3. Run `mackup backup`.

Be careful about what you mackup. Some applications, like VSCode, prefer to sync
their configuration to a cloud on their own, and that can mess things up a
little bit — you'll end up with forever dirty dotfiles working copy.

Here's my configuration:

```cfg
[storage]
engine = file_system
path = src/dotfiles
directory = mackup

# These applications are managed by dotfiles themselves,
# No need to re-link them to mackup
[applications_to_ignore]
# I don't like symlinking vscode settings personally.
vscode
starship
netrc
yarn
neovim
tmux
fish
git
vim
zsh
mackup
ssh
gnupg
ansible
skhd
yabai
```

> As a nice example, `mackup` backs up your Xcode keyboard shortcuts!

## Restoring on a new Mac

Restoring is straightforward, and essentially walks the same steps as the
backup:

1. Get SSH keys to work so you can download your dotfiles.
2. `dotbot install` — that gets you the barebones of shell settings and other
   niceties. It also gets my `gpg` to work in my case.
3. `brew bundle install` will install all your Homebrew packages, casks, and App
   Store applications. This will require that you sign in with your Apple ID in
   the App Store app. You don't have to have the same iCloudID that you had when
   you purchased the apps, as long as the Apple ID that you're using has those
   apps purchased too.
4. `mackup restore` to get the rest of the apps and settings.

## What's not covered?

I'm still looking for a way to backup some Mac-specific system settings — please
@ me if you know how to get them backed up in an elegant way. Perhaps I should
shove them into the `shell` section of `dotbot` config for now:

- Mouse and Keyboard settings like key repeat interval and mouse sensitivity.
- Dock settings (put Dock in the left side, autohide: on).
- Screenshot directory settings, including creating a `~/Screenshots` and putting a shortcut to it to your Dock.
- Disable all interface sounds.
- Disable all/most UI animations.
- Disable Keyboard input autocorrect and auto-capitalization.
- Add Keyboard Input sources (yay Russian).
- System keyboard shortcuts like Spotlight and changing input sources.

I believe they all are possible to setup with `defaults write something something`, but I'm too lazy to do that.
