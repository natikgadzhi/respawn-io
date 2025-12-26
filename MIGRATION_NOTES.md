# Content Migration Fix - December 25, 2024

## Problem 1: UnknownContentCollectionError

The Astro content collection loader was encountering `UnknownContentCollectionError` for several posts, including:
- airbyte-2024-in-review
- app-icons-in-swiftui
- contentlayer-with-excalidraw
- iso6392-locale-in-swift
- swift-docc-publishing-workflow
- the-natik-user-guide

### Root Cause
These posts had both:
1. A markdown/MDX file: `src/content/posts/[name].md(x)`
2. A directory with the same name: `src/content/posts/[name]/`

The directory contained images for that post. Astro's glob loader was attempting to process both the file and the directory as content entries, causing conflicts when trying to render the directory as a post.

### Solution
1. Created a new directory structure: `src/content/posts/_assets/`
2. Moved all conflicting asset directories into `_assets/`:
   - `src/content/posts/airbyte-2024-in-review/` → `src/content/posts/_assets/airbyte-2024-in-review/`
   - `src/content/posts/app-icons-in-swiftui/` → `src/content/posts/_assets/app-icons-in-swiftui/`
   - `src/content/posts/contentlayer-with-excalidraw/` → `src/content/posts/_assets/contentlayer-with-excalidraw/`
   - `src/content/posts/iso6392-locale-in-swift/` → `src/content/posts/_assets/iso6392-locale-in-swift/`
   - `src/content/posts/swift-docc-publishing-workflow/` → `src/content/posts/_assets/swift-docc-publishing-workflow/`
   - `src/content/posts/the-natik-user-guide/` → `src/content/posts/_assets/the-natik-user-guide/`
   - `src/content/posts/assets/` → `src/content/posts/_assets/general-assets/`
3. Updated image references in all affected posts to use `_assets/[name]/` paths
4. The underscore prefix ensures the directory is clearly marked as non-content

### Files Changed
- Moved 7 asset directories to `src/content/posts/_assets/`
- Updated image paths in:
  - `airbyte-2024-in-review.mdx`
  - `app-icons-in-swiftui.md`
  - `contentlayer-with-excalidraw.mdx`
  - `iso6392-locale-in-swift.md`
  - `swift-docc-publishing-workflow.md`
  - `the-natik-user-guide.mdx`

### Build Script Compatibility
The existing `scripts/copy-images.sh` continues to work correctly:
- It recursively finds all `.png` and `.jpg` files in `src/content/posts/`
- Images are now copied from `src/content/posts/_assets/` to `public/_assets/`
- Astro processes these images and optimizes them during build

---

## Problem 2: RSS Feed Generation Failure

The RSS feed generation was failing with `ERR_UNSUPPORTED_ESM_URL_SCHEME` error because the script was trying to use `astro:content` outside of Astro's build context.

### Root Cause
The old `scripts/rss.ts` was written for the Next.js + Contentlayer setup and tried to import `getCollection` from `astro:content` in a standalone tsx script. This doesn't work because Astro's content collections are only available during Astro's build process.

### Solution
1. Installed `@astrojs/rss` package
2. Created new RSS endpoint at `src/pages/rss/feed.xml.ts` that generates RSS feed as part of Astro's build process
3. Updated `package.json` to remove the separate `pnpm run rss` step from the build command
4. Renamed old RSS script to `scripts/rss.ts.old` for reference

### Files Changed
- Added: `src/pages/rss/feed.xml.ts` - New RSS endpoint using Astro's content API
- Modified: `package.json` - Removed separate RSS generation step
- Added: `@astrojs/rss` dependency
- Renamed: `scripts/rss.ts` → `scripts/rss.ts.old`

### RSS Feed Format
The new RSS feed maintains compatibility with the old format:
- Includes full HTML content for each post (similar to old behavior)
- Filters out drafts and work-in-progress posts
- Uses same metadata (title, description, author, dates)
- Available at `/rss/feed.xml`

**Note:** The old setup also generated `atom.xml` and `feed.json`. If these are needed, additional endpoints can be created, but the current RSS feed should be sufficient for most feed readers.

---

## Verification

✅ Build completes successfully: `pnpm run build`
✅ All 83 pages generated without errors
✅ No more `UnknownContentCollectionError`
✅ Images are correctly optimized and linked in the built HTML
✅ RSS feed generates successfully at `/rss/feed.xml`
✅ Previously problematic posts now render correctly:
  - `/posts/airbyte-2024-in-review/`
  - `/posts/app-icons-in-swiftui/`
  - `/posts/contentlayer-with-excalidraw/`
  - `/posts/iso6392-locale-in-swift/`
  - `/posts/swift-docc-publishing-workflow/`
  - `/posts/the-natik-user-guide/`

---

## Problem 3: Excalidraw Embed Path Error

After moving asset directories, the excalidraw rehype plugin was still looking for files in the old `assets/` directory, causing `ENOENT` errors when trying to embed excalidraw diagrams.

### Root Cause
The `lib/rehypeExcalidraw.ts` plugin had a hardcoded path:
```typescript
const assetsDir = join(parentDir, "assets");
```

This needed to be updated to match the new `_assets/general-assets/` directory structure where the excalidraw SVG files were moved.

### Solution
Updated `lib/rehypeExcalidraw.ts` line 42 to use the new assets path:
```typescript
const assetsDir = join(parentDir, "_assets/general-assets");
```

### Files Changed
- Modified: `lib/rehypeExcalidraw.ts` - Updated assets directory path

### Affected Posts
- `contentlayer-with-excalidraw.mdx`
- `hello-world.md`

Both posts now successfully embed excalidraw diagrams with light/dark theme variants.

---

## Future Considerations

1. **Atom and JSON feeds**: If needed, create additional endpoints:
   - `src/pages/rss/atom.xml.ts`
   - `src/pages/rss/feed.json.ts`

2. **RSS feed size**: The current feed includes full HTML content and is ~30MB. Consider:
   - Limiting number of posts in feed
   - Using descriptions only instead of full content
   - Creating separate "full content" and "summary" feeds

3. **Image organization**: Consider documenting the `_assets` pattern in README or creating a script to help move future post assets automatically.

4. **OG Image generation**: The build shows a warning about missing data store for OG images. This should be addressed separately.