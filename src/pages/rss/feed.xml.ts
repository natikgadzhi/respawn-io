import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { config } from "../../../blog.config";
import { getRawExcerpt, sortPostsByDate } from "../../lib/content-utils";
import { titleCase } from "../../lib/titleCase";

/** Convert post markdown body to simple HTML suitable for RSS readers. */
async function bodyToHTML(body: string): Promise<string> {
  const result = await unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeStringify).process(body);
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
        link: `/posts/${post.id}/`,
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
    customData: `<language>en-us</language>`,
  });
}
