# respawn.io

This repo contains the source code for (yet another?) iteration of
[respawn.io](https://respawn.io) blog. That one uses Next, Tailwind, and Contentlayer.

A few more things under the hood:

- Content pipeline is handled by `contentlayer`. See [Contentlayer with multiple data types](http://respawn.io/posts/contentlayer-with-multiple-data-types).
- RSS feed that includes all posts.
- Mark posts as `draft: true` in front matter to hide them from the generated
  site.
- MDX support for posts, pre-configured to use `next/image` and `next/link`.
  Also supports Markdown image tags. Callouts support is pending.
- Support for generating opengraph images via `ImageResponse` in `edge runtime`, see
  [hello-world.md](https://respawn.io/posts/hello-world) for details.
- Uses Vercel built-in analytics with zero configuration.

## Using this for your own site

You're very welcome to use any of the code, or the whole repo as a starting point. A few recommendations:

- I'm using Obsidian as the editor of choice (and a backend, of sorts) for my posts, but you don't have to.
- Please **please please** make sure you change any analytics IDs in `blog.config.ts`.
- Use `pnpm run dev` to start both the contentlayer and dev server simultaneously.

## License

The source code in this repository is [licensed under](/LICENSE) MIT. The
contents of `_posts` directory, and the articles as they are available on
https://respawn.io are licensed under
[Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
