import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import type { APIContext, ImageMetadata } from "astro";
import type { Element, Root } from "hast";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { config } from "../../../blog.config";
import { getRawExcerpt, sortPostsByDate } from "../../lib/content-utils";
import { titleCase } from "../../lib/titleCase";

// Post images are referenced as `_assets/...` relative paths in markdown.
// On the site Astro rewrites them to built asset URLs; this pipeline doesn't,
// so map every content image to its emitted URL and rewrite feed srcs to
// absolute production URLs.
const contentImages = import.meta.glob<{ default: ImageMetadata }>(
  "/src/content/posts/_assets/**/*.{png,jpg,jpeg,gif,webp}",
  { eager: true },
);

function rehypeAbsoluteImages() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName !== "img" || typeof node.properties.src !== "string") return;
      const src = node.properties.src;
      if (/^(https?:)?\/\//.test(src)) return;
      const image = contentImages[`/src/content/posts/${src.replace(/^\.\//, "")}`];
      if (image) {
        node.properties.src = new URL(image.default.src, config.baseURL).href;
      }
    });
  };
}

/** Convert post markdown body to simple HTML suitable for RSS readers. */
async function bodyToHTML(body: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeAbsoluteImages)
    .use(rehypeStringify)
    .process(body);
  return `<article>${result.value.toString()}</article>`;
}

export async function GET(context: APIContext) {
  const allPosts = await getCollection("posts");

  const posts = sortPostsByDate(
    allPosts.filter((post) => {
      // Exclude both drafts and work in progress posts from RSS
      return !post.data.draft && !post.data.workInProgress;
    }),
  );

  const items = await Promise.all(
    posts.map(async (post) => {
      const formattedTitle = titleCase(post.data.title);
      const rawExcerpt = getRawExcerpt(post.data.excerpt);
      const content = post.body ? await bodyToHTML(post.body) : "";

      return {
        title: formattedTitle,
        description: rawExcerpt,
        content: content,
        link: `/posts/${post.id}`,
        pubDate: post.data.created,
        author: config.author.email,
      };
    }),
  );

  return rss({
    title: config.title,
    description: config.description,
    site: context.site || config.baseURL,
    items: items,
    // The site builds with `build.format: "file"`, so canonical URLs have no
    // trailing slash. @astrojs/rss appends one by default, which makes every
    // feed-reader click take an extra Cloudflare 308 redirect and makes guids
    // disagree with the pages' canonical URLs — turn it off so item links/guids
    // match the canonical form.
    trailingSlash: false,
    customData: `<language>en-us</language>`,
  });
}
