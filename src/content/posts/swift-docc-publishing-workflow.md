---
title: Building Swift DocC as a Static Website
excerpt: Using swift-docc-plugin for SwiftPM to export your docs, and swift-docc-render to get a static website with your documentation.
created: 2023-06-09
modified: 2023-06-09
draft: false
tags:
  - swift
  - coding
---

# Building Swift DocC as a Static Website

Swift DocC is great. I love how it encourages you to write documentation while you're coding, and how it enables you to link up symbols so that the overall system is easier to grasp, both in Xcode suggestions, and in the documentation viewer app.

And the tutorials DocC makes are pretty good, too! I've been playing around with Swift, and considered building out a few ideas as DocC tutorials. No idea if that's going to work out. But on my journey, I've figured out how to build DocC doc archives, how to host them, and how to automate the whole flow.

Part one (this post) is how to build and export your documentation. Part two will cover hosting it on GitHub pages, and automating the publishing flow with GitHub actions.

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

> In this specific example, I'll work on SwiftPM's own documentation. If you'd like to, you can clone `apple/swift-package-manager` and follow along.


**Step two**: once you have the plugin setup, you can generate the documentation archive in CLI like this:

```bash
# This will output DocC archive in .build/plugins/Swift-DocC/outputs
$ swift package --disable-sandbox generate-documentation \
	--target PackageDescription
```

![Xcode documentation viewer with `PackageDescription`](_assets/swift-docc-publishing-workflow/docarchive.png)

**Step three**: you can _also_ export your documentation to be served as a static website, and there are multiple ways to do it:
- The minimal approach is that you can use `.htaccess` rules to [serve the archive as is](https://developer.apple.com/documentation/Xcode/distributing-documentation-to-external-developers#Host-a-documentation-archive-using-custom-routing).
- You can export the documentation bundle as a statically generated Vue web app. Instead of a `.docarchive`, you'll get a directory containing the web app:
```bash
swift package --allow-writing-to-directory ./docs \
    generate-documentation --target PackageDescription \
    --output-path ./docs \
    --transform-for-static-hosting \
    --hosting-base-path PackageDescription
```

To preview the resulting website on your local machine, run this:
```bash
swift package --disable-sandbox preview-documentation \
	--target PackageDescription
```

![](_assets/swift-docc-publishing-workflow/docc-local-preview.png)

You get filtering and search out of the box. Since the resulting directory is a static website, you can host it pretty much anywhere you want.

In the next part, I'll show you how to set up GitHub Pages to host the DocC archive, and how to automate building it anytime you push a new version of your code.

### Links
- [`swift-docc-plugin`](https://github.com/apple/swift-docc-plugin) is the SwiftPM plugin that you can use to build documentation without Xcode.
- [`swift-docc-render`](https://github.com/apple/swift-docc-render) is the renderer for Swift DocC archives that transforms your docs into a Vue.js app. If you want to tweak how the DocC web app looks or works, that's where you should start.
