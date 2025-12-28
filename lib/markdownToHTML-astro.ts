// Provides a utility function to convert a markdown to HTML,
// without MDX component support

import type { CollectionEntry } from "astro:content";
import { resolve } from "node:path";
import rehypeStringify from "rehype-stringify";
import remarkEmbedImages from "remark-embed-images";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { VFile } from "vfile";

import { rehypePlugins, remarkPlugins } from "./unifiedPlugins";

const wrapInArticle = (html: string) => `<article>${html}</article>`;

export async function markdownToHTML(post: CollectionEntry<"posts">) {
  const processor = unified();
  const plugins = [
    remarkParse,
    remarkEmbedImages,
    ...remarkPlugins,
    remarkRehype,
    ...rehypePlugins,
    rehypeStringify,
  ];

  plugins.forEach((plugin) => {
    if (Array.isArray(plugin)) {
      processor.use(plugin[0], plugin[1]);
    } else {
      // @ts-expect-error
      processor.use(plugin);
    }
  });

  const file = new VFile({
    value: post.body,
    path: resolve("src/content/posts", `${post.id}`),
  });

  // @ts-expect-error
  const result = await processor.process(file);
  // @ts-expect-error
  return wrapInArticle(result.value.toString());
}
