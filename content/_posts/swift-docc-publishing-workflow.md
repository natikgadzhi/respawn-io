---
title: Generating and Publishing Swift DocC Package Documentation on Github Pages
excerpt: Using SwiftPM docc plugin to build and export your package docs, and then automating publication to github pages
date: 2023-06-09
created: 2023-06-09
modified: 2023-06-09
---

# Generating and Publishing Swift DocC Package Documentation on Github Pages

Swift DocC is great. I love how it encourages you to write some basic documentation while you're coding, and how it enables you to link up your symbols so that your documentation is easier to follow, both in Xcode suggestions, and in the documentation viewer app.

The neat part is that DocC generates the documentation archive that is just a website, and you can host it pretty much anywhere you want. The official documentation is perhaps a bit scarce, only [outlining how to host it on an Apache server](https://developer.apple.com/documentation/xcode/distributing-documentation-to-external-developers#Host-a-documentation-archive-on-your-website), but that's just the beginning — docc is much more flexible than that.

In this article, we'll set up a workflow to generate a new documentation archive for one of SwiftPM packages itself, and for hosting it on GitHub Pages, using a GitHub Action.

### Generating DocC documentation

Apple mostly talks about how to generate DocC archives with Xcode (Product → Build Documentation Archive). Xcode is great for authoring and building documentation, **but you can also use SwiftPM and `swift-docc-plugin` to generate documentation for your packages without Xcode**.

Step one is to add [`swift-docc-plugin`](https://github.com/apple/swift-docc-plugin) to your package definition in `Package.swift`:

```swift
// Add package dependency on swift-docc-plugin
package.dependencies.append(
    .package(
        url: "https://github.com/apple/swift-docc-plugin",
        from: "1.0.0"
    )
)
```



- Add swift-docc-plugin as a dependency on your package.
- Use this command to generate the documentation archive.
- Previewing documentation.
- Generating for a static website.
- Embedding your documentation in a Github Pages website.


