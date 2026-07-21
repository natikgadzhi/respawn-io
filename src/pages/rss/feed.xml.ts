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

/**
 * Strip MDX's ESM `import`/`export` statements from a post body.
 *
 * The RSS pipeline below is plain markdown (remark-parse), so it doesn't
 * understand MDX. For `.mdx` posts whose body opens with `import x from "..."`,
 * those lines would otherwise render as a paragraph of literal source in the
 * feed (see #41). Astro's own MDX compiler drops them; this mirrors that.
 *
 * Lines inside fenced code blocks are left untouched, so tutorial posts that
 * *show* import/export code in a fence keep it. JSX component tags (`<Aside>`,
 * `<Script>`, …) don't need handling here — remark-rehype already drops raw
 * HTML, so their tags vanish while the prose inside them survives.
 *
 * Only applied to `.mdx` bodies: a real `.md` post could legitimately open a
 * prose line with the word "import"/"export", and those aren't ESM.
 */
function stripMdxEsm(body: string): string {
  const fence = /^\s*(```+|~~~+)/;
  const esm = /^\s*(import|export)\s/;
  let openFence: string | null = null;
  return body
    .split("\n")
    .filter((line) => {
      const fenceMatch = line.match(fence);
      if (fenceMatch) {
        const marker = fenceMatch[1][0];
        if (openFence === null) openFence = marker;
        else if (line.trimStart().startsWith(openFence)) openFence = null;
        return true;
      }
      // Drop top-level (non-fenced) ESM statement lines.
      return openFence !== null || !esm.test(line);
    })
    .join("\n");
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
      const body = post.filePath?.endsWith(".mdx") && post.body ? stripMdxEsm(post.body) : post.body;
      const content = body ? await bodyToHTML(body) : "";

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
