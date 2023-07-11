---
title: Automating Swift DocC with Github Actions
excerpt: Shipping your library's DocC documentation to GitHub Pages, and keeping it up to date with a GitHub action.
date: 2023-06-16
created: 2023-06-16
modified: 2023-06-16
---

# Automating Swift DocC with GitHub Actions

Some languages have nice documentation tooling: Yardoc for Ruby, Pydoc for Python, Godoc for Go. Swift has DocC, and it can export docs as a static website, too.

This is part 2 of [[swift-docc-publishing-workflow|Generating Swift DocC archives guide]]. In this post, you'll take the Vue.js app that Swift DocC builds, host it on GitHub Pages, and write a GitHub Action to automatically rebuild and update your docs when the source code changes.

### Setting up a GitHub Pages site for your documentation

On GitHub, go to your repository Settings → Pages, and set it to deploy from a branch. Select `gh-pages` branch, and `/docs` folder. If the `gh-pages` is not on the list of available branches — create it, and push it up.

```bash
$ git switch -c gh-pages
$ git push origin gh-pages
```


> **Note**: This guide assumes that you'll be hosting your docs on `github.io`, and your GitHub Pages site URL will look like `${username}.github.io/${repository}`.
> 
> If you'd like to deploy DocC site to a custom domain — that'll work, too, but you will need to not set `--hosting-base-path`.


### Manually deploying the documentation to GitHub Pages

For this example, I've [forked out `apple/swift-package-manager`](https://github.com/natikgadzhi/swift-package-manager). The code examples below work on that repository.

```shell
# Assuming you're in the Swift project directory (in this case, swift-package-manager itself), 
# and that your `Package.swift` already has a dependency on swift-docc-plugin.
# Runnig this will get output a `./docs` directory containing the site that we need.
$ swift package --allow-writing-to-directory ./docs \
	generate-documentation --target PackageDescription \
    --output-path ./docs \
    --disable-indexing \
    --transform-for-static-hosting \
    --hosting-base-path swift-package-manager

# Make a new gh-pages branch
$ git switch -c gh-pages
$ git add ./docs
$ git commit -m "Swift DocC site in ./docs"
$ git push origin gh-pages
```

It takes a few minutes to process, but when it's done, you'll get a [webpage like this one](https://natikgadzhi.github.io/swift-package-manager/documentation/packagedescription/).

> **Note**: Swift DocC site is only available in a subdirectory for your particular target: `/documentation/{targetName}`. It would be great to have a root web page, but I don't yet know how to craft that.

So far, you've generated Swift DocC documentation, exported it as a static website, and shipped it to GitHub pages. Now let's automate it, so every time you push an update to your library, you get the updated documentation website for free.

### Using a GitHub action to deploy documentation

Here's a workflow that will build DocC website, and push it to GitHub pages automatically:

```yaml
name: Build Swift DocC and publish on GitHub Pages

on:
  push:
    # If you wanted to only trigger this flow on certain branches,
    # specify them here in 
    # branches: 
    # alternatively, you can trigger docs only on new tags pushed:
    # tags:
    #   - '*'

# `concurrency` specifices how this action is run. 
# Setting concurrency group makes it so that only one build process runs at a time.
concurrency:
  group: "pages"
  cancel-in-progress: false

env:
  # Build target specifies which target in your Swift Package to build documentation for.
  # To build all targets, remove this env variable, 
  # and remove --target arg in the building step below.
  BUILD_TARGET: PackageDescription

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      with:
        fetch-depth: 0

    - name: Set up Swift environment
      uses: fwal/setup-swift@v1
      with:
        swift-version: '5.8'

    # Build the DocC website using swiftPM.
    - name: Build docs with SwiftPM
      run: |
        swift package --allow-writing-to-directory ./docs \
        generate-documentation --target ${BUILD_TARGET} \
        --output-path ./docs \
        --disable-indexing \
        --transform-for-static-hosting \
        --hosting-base-path swift-package-manager

    - name: Commit and push generated documentation
      run: |
        git config --local user.email "github-actions[bot]@users.noreply.github.com"
        git config --local user.name "github-actions[bot]"
        git switch gh-pages
        git add ./docs
        git commit -a -m "Generated Swift DocC"
        git push origin gh-pages

```


### Links

- Apple's own gh pages builder bash script for `swift-docc-plugin`: https://github.com/apple/swift-docc-plugin/blob/main/bin/update-gh-pages-documentation-site
- An overview of `swift-docc-plugin` arguments, as well as the github pages publishing flow: https://apple.github.io/swift-docc-plugin/documentation/swiftdoccplugin/publishing-to-github-pages/
- Example repository: https://github.com/natikgadzhi/swift-package-manager and the docs site: https://natikgadzhi.github.io/swift-package-manager/documentation/packagedescription/


