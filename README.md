# respawn.io

This repo contains the source code for (yet another?) iteration of
[respawn.io](https://respawn.io) blog. That one uses Next.js and Tailwind.

A few more things under the hood:

- Simple posts layout with meta-information, open graph cards, and json-ld
  articles markup.
- RSS feed that includes all posts.
- MDX format support for posts, which allows me to use nice components like
  next/image, or embed tweets, etc.
- Support for generating opengraph images via `@vercel/og`, see
  [hello-world.md](https://respawn.io/posts/hello-world) for details.

If you want to use this code for your projects, please make sure to swap out the
analytics settings in `blog.config.js`.

## License

The source code in this repository is [licensed under](/LICENSE) MIT. The
contents of `_posts` directory, and the articles as they are available on
https://respawn.io are licensed under
[Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
