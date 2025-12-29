// Provides a utility function to convert markdown to HTML for RSS feeds.
// This is simpler than the Astro markdown pipeline since RSS readers
// don't support syntax highlighting or interactive diagrams.

import type { CollectionEntry } from "astro:content";
import { resolve } from "node:path";
// Remark plugins for RSS
import remarkFigureCaption from "@microflash/remark-figure-caption";
import rehypeStringify from "rehype-stringify";
import callouts from "remark-callouts";
import remarkEmbedImages from "remark-embed-images";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import wikilinks from "remark-wiki-link";
import { unified } from "unified";
import { VFile } from "vfile";

import { config } from "../../blog.config";

// RSS feeds are generated at build time, always use production URL
const rootURL = config.baseURL;

// Handle links for both posts and daily notes
const hrefTemplate = (permalink: string) => {
  if (permalink.startsWith("daily/")) {
    const dailySlug = permalink.replace("daily/", "");
    return `${rootURL}/daily/${dailySlug}`;
  }
  return `${rootURL}/posts/${permalink}`;
};
const pageResolver = (name: string) => [name];

const wrapInArticle = (html: string) => `<article>${html}</article>`;

export async function markdownToHTML(post: CollectionEntry<"posts">) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkEmbedImages)
    .use(remarkGfm)
    .use(remarkFigureCaption, {
      captionClassName: "text-center italic mx-auto block",
    })
    .use(wikilinks, { pageResolver, hrefTemplate, aliasDivider: "|" })
    .use(callouts)
    .use(remarkRehype)
    .use(rehypeStringify);

  const file = new VFile({
    value: post.body,
    path: resolve("src/content/posts", `${post.id}`),
  });

  const result = await processor.process(file);
  return wrapInArticle(result.value.toString());
}
