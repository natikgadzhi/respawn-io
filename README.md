# respawn.io

Source code for [respawn.io](https://respawn.io) (also served on [natik.dev](https://natik.dev)). Built with Astro, Tailwind, and Content Collections.

> **Note:** This site was previously built with Next.js and Contentlayer. That approach is now deprecated. If you're interested in the old setup, see [Contentlayer with multiple data types](https://respawn.io/posts/contentlayer-with-multiple-data-types).

## Features

- **Content Collections** with full TypeScript support for posts, daily notes, pages, and tags.
- **Mermaid diagrams** rendered at build time with Puppeteer.
- **OG images** generated at build time with Puppeteer (no edge runtime required).
- **RSS/Atom/JSON feeds** for all published posts.
- **MDX support** with optimized images and wikilinks.
- **Draft posts** via `draft: true` in front matter.
- **Minimal JavaScript** — static HTML with optional hydration for interactive components.

## Docker Deployment

The site is deployed as a standalone Docker container:

```bash
docker build -t respawn-io .
docker run -p 3000:3000 respawn-io
```

The same container can be served on multiple domains (e.g., `respawn.io` and `natik.dev`) via ingress. All absolute URLs in metadata point to the canonical domain (`respawn.io`), while relative links work on any domain.

## Local Development

```bash
pnpm install
pnpm run dev
```

## Build

```bash
pnpm run build
```

This runs the full build pipeline:
1. Copy images from content directories
2. Generate OG images with Puppeteer
3. Build the Astro site
4. Generate RSS/Atom/JSON feeds

## Using This for Your Own Site

Feel free to use any of the code as a starting point:

- I use Obsidian as the editor, but any markdown editor works.
- Update `astro.config.mjs` and site configuration with your own URLs and author info.
- The `src/content/` directory contains posts and daily notes.
- Content schema is defined in `src/content/config.ts`.

## Project Structure

```
├── src/
│   ├── content/       # Content collections (posts, daily, pages, tags)
│   ├── pages/         # File-based routing
│   ├── layouts/       # Page layouts
│   ├── components/    # Astro components
│   └── styles/        # Global styles
├── lib/               # Unified/remark/rehype plugins
├── scripts/           # Build scripts (OG images, RSS, etc.)
└── public/            # Static assets
```

## License

The source code in this repository is [licensed under](/LICENSE) MIT. The
contents of the content directories, and the articles as they are available on
https://respawn.io are licensed under
[Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/).