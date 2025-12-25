# respawn.io

Source code for [respawn.io](https://respawn.io) (also served on [natik.dev](https://natik.dev)). Built with Next.js 16, Tailwind, and Contentlayer.

## Features

- **Content pipeline** via Contentlayer. See [Contentlayer with multiple data types](https://respawn.io/posts/contentlayer-with-multiple-data-types).
- **Mermaid diagrams** rendered at build time with Puppeteer. See [Mermaid Diagrams in MDX](https://respawn.io/posts/contentlayer-mermaid-diagrams).
- **OG images** generated at build time with Puppeteer (no edge runtime required).
- **RSS/Atom/JSON feeds** for all published posts.
- **MDX support** with `next/image`, `next/link`, and markdown image tags.
- **Draft posts** via `draft: true` in front matter.

## Docker Deployment

The site is deployed as a standalone Docker container. Build and run:

```bash
# Build for respawn.io (default)
docker build -t respawn-io .

# Build for a different domain
docker build --build-arg SITE_URL=https://natik.dev -t natik-dev .

# Run the container
docker run -p 3000:3000 respawn-io
```

### Multi-Domain Support

The site supports serving on multiple domains with proper SEO:

| Config | Value | Purpose |
|--------|-------|---------|
| `baseURL` | `https://respawn.io` | Canonical URL (always, for SEO) |
| `siteURL` | From `SITE_URL` build arg | Serving URL (og:url, RSS, sitemap) |

Since Next.js bakes metadata into static pages at build time, `SITE_URL` must be passed as a Docker build argument, not a runtime environment variable.

## Local Development

```bash
pnpm install
pnpm run dev
```

## Using This for Your Own Site

Feel free to use any of the code as a starting point:

- I use Obsidian as the editor, but any markdown editor works.
- Update `blog.config.ts` with your own URLs, analytics IDs, and author info.
- The `content/` directory contains posts and daily notes.

## License

The source code in this repository is [licensed under](/LICENSE) MIT. The
contents of `_posts` directory, and the articles as they are available on
https://respawn.io are licensed under
[Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
