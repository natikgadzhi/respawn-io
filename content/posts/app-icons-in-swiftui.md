---
tags:
  - swift
  - swiftui
created: 2024-01-06
modified: 2024-01-06
title: How to make an app icon in SwiftUI
excerpt: You can make iOS and Mac app icons directly with SwiftUI, without any design tools like Figma!
---
# How to make an app icon in SwiftUI

I'm making a little hobby app for myself. Generalist and all, working in design tools is always a struggle for me, but I wanted a nice icon. Well, I thought I'd experiment with putting together an icon as a SwiftUI view, and see if I can export it easily. It worked out pretty nicely. Here's how it works:

1. **Make an icon in a SwiftUI view**, i.e. `IconView(size: CGFloat)` Bonus points: you'll be able to re-use it across your app.
2. **Make a wrapper view** that will handle exporting the icon in a PNG image.
3. Export the icon.
4. Use a service to make an `AppIcon.appiconset` from your icon.

<iframe width="560" height="315" style={{margin: '0 auto'}} src="https://www.youtube-nocookie.com/embed/QbYwE9_gjp0?si=9C1xqVfweMRXdVoL" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>

## An Icon in a SwiftUI View

The first part is to make an `IconView` I made mine resizeable so I can use it on other screens in the app like this:

```swift
struct IconView: View {
    // IconView is square. All sizes in the view will scale to this.
    var size: CGFloat

    var body: some View {
        ZStack {
            // The background layer.
            Color.iconBackground
            
            // Slight gradient, will us the radiating light.
            RadialGradient(gradient: Gradient(colors: [Color.white.opacity(0.175), Color.iconBackground]),
                           center: .center,
                           startRadius: 0,
                           endRadius:  size * 2)
            // Two SF Symbol icons grouped one on fop of the other.
            // Using `Group` allows us to reposition them together on the background if needed.
            Group {
                Image(systemName: "bookmark.fill")
                    .font(.system(size: size * 0.8))
                    .fontWeight(.thin)
                    .foregroundStyle(Color.bookmark)
                    // Using overlay with a linear gradient allows you to gradient-fill the icon, using the `mask()` modifier
                    .overlay(
                        LinearGradient(
                            colors: [Color.red.opacity(0.05), Color.red.opacity(0.3)],
                            startPoint: .topLeading, endPoint: .bottomTrailing )
                            .mask {
                                Image(systemName: "bookmark.fill")
                                    .font(.system(size: size * 0.8))
                                    .fontWeight(.thin)
                            }
                    )

                Image(systemName: "text.quote")
                    .font(.system(size: size * 0.3))
                    .foregroundStyle(.black.opacity(0.8))
                    .offset(y: -size * 0.1)
            }
        }
        // iOS app icons don't necessarily need rounded corners.
        // But if you're using this icon elsewhere in the app, this will look nice enough.
        .clipShape(RoundedRectangle(cornerRadius: max(size * 0.025, 10), style: .circular))
        .frame(width: size, height: size)
    }
}
```

## Exporting a PNG of an Icon from within a SwiftUI View

You can export any View as an `UIImage`, and then save it. A few caveats:
- If you want to later use this as an icon, you should set the size of the view that you export appropriately, i.e. in this case, we'll export an `IconView(size: 1024)`, which will be exported as a `2048x2048` PNG image, which we will then convert into an `appiconset`.
- The snippet is designed to run on macOS. I run it as a Mac Catalyst app _preview_. The snippet below saves the icon into the `Pictures` directory. You can save the file into any directory you have access to. 

```swift

struct IconExportView: View {
    var body: some View {
        VStack {
            // This is just a preview, and strictly speaking not necessary.
            iconView()
                .padding()
            // A button to trigger the export. 
            Button("Save Icon") {
                self.exportImage()
            }
            .buttonStyle(.borderedProminent)
        }
    }
    
    /// Make an `IconView` of size `1024`.
    func iconView() -> IconView {
        return IconView(size: 1024)
    }
    
    /// Grab a snapshot of a target view as a ``UIImage``.
    @MainActor func snapshot(of target: some View) -> UIImage? {
        let controller = UIHostingController(rootView: target)
        let view = controller.view
        let targetSize = controller.view.intrinsicContentSize
        view?.bounds = CGRect(origin: .zero, size: targetSize)
        view?.backgroundColor = .clear

        let renderer = ImageRenderer(content: target)
        renderer.scale = UIScreen.main.scale // Adjust the scale for higher resolution
        return renderer.uiImage
    }

    @MainActor func exportImage() {
        print("Saving!")
        
        // 1. Grab the view as an image
        if let image = self.snapshot(of: iconView()) {
            if let imageData = image.pngData() {
                // This snippet exports the image into `Pictures` folder,
                // but you can set any directory the app has access to.
                let pictures = FileManager.default.urls(for: .picturesDirectory, in: .userDomainMask).first!
                let fileName = "icon-from-swiftUI.png"
                let fileURL = pictures.appendingPathComponent(fileName)
                
                do {
                    try imageData.write(to: fileURL)
                } catch {
                    print("Could not save the view into a PNG: \(error.localizedDescription)")
                }
            } else {
                print("Could not save the view into a PNG")
            }
        }
    }
}
```

![`IconExportView` as a Mac Catalyst app preview](app-icons-in-swiftui/app-icons-in-swiftui-export.png)
> [!note]
> In theory, you could save the `UIImage` data and present a share sheet to export it into anything you want. Saving into a directory from within a Mac Catalyst app is just the fastest way I've found, personally. Using `Pictures` is just the first thing that came to my mind and was in the list of autocompletions.


## Make an `appiconset` with CandyIcons asset generator

There are a bunch of services and apps that take an image, and generate an app asset bundle for you, but they're not all equal. I've tried a few, and [CandyIcons](https://www.candyicons.com/free-tools/app-icon-assets-generator) seems to work best.  It automatically makes a mac app icon with rounded corners, and the output icon quality looks great.

---

The full code for this flow is in [the Scrapes repo](https://github.com/natikgadzhi/Scrapes). 