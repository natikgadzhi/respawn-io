---
title: Building Swift DocC on GitHub Actions
excerpt: Using SwiftPM docc plugin to build and export your package docs, and then automating publication to github pages
date: 2023-06-09
created: 2023-06-09
modified: 2023-06-09
draft: false
---

# Building Swift DocC on GitHub Actions

Swift DocC is great. I love how it encourages you to write documentation while you're coding, and how it enables you to link up symbols so that the overall system is easier to grasp, both in Xcode suggestions, and in the documentation viewer app.

And the tutorials DocC makes are pretty good, too! I've been playing around with Swift, and considered building out a few ideas as DocC tutorials. No idea if that's going to work out. But on my journey, I've figured out how to build DocC doc archives, how to host them, and how to automate the whole flow.

### Generating DocC documentation

Apple mostly talks about how to generate DocC archives with Xcode (Product → Build Documentation Archive). Xcode is great for authoring and building documentation, but you can also use SwiftPM and `swift-docc-plugin` to generate documentation without Xcode (yep, that should work on Linux hosts, too).

Step one is to add [`swift-docc-plugin`](https://github.com/apple/swift-docc-plugin) to the package definition in `Package.swift`.

```swift
let package = Package(
	name: "SwiftPM",
	// Omitting products here..
    products: []
)

// Assuming you have a package object,
// you can just append a dependency like that:
package.dependencies.append(
    .package(
        url: "https://github.com/apple/swift-docc-plugin",
        from: "1.0.0"
    )
)
```

> In this specific example, I'll work on SwiftPM's own documentation. If you want to,you can clone `apple/swift-package-manager` and follow along.


**Step two**: once you have the plugin setup, you can generate the documentation archive in CLI like this:

```bash
# This will output DocC archive in .build/plugins/Swift-DocC/outputs
$ swift package --disable-sandbox generate-documentation \
	--target PackageDescription
```

![Xcode documentation viewer with `PackageDescription`](test.png)

You can drag and drop the archive to your
- Add swift-docc-plugin as a dependency on your package.
- Use this command to generate the documentation archive.
- Previewing documentation.
- Generating for a static website.
- Embedding your documentation in a Github Pages website.

