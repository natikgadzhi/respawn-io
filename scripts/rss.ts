import fs from "node:fs";
import { Feed } from "feed";
import { getCollection } from "astro:content";

import { markdownToHTML } from "../lib/markdownToHTML-astro.ts";
import { config } from "../blog.config.ts";
import { sortPostsByDate } from "../src/lib/content-utils.ts";
import { titleCase } from "../src/lib/titleCase.ts";
import { getRawExcerpt, getPostUrl, getPostAbsoluteUrl } from "../src/lib/content-utils.ts";

export default async function generateFeeds() {
  const allPosts = await getCollection('posts');

  const posts = sortPostsByDate(
    allPosts.filter((post) => {
      // Exclude both drafts and work in progress posts from RSS
      return !post.data.draft && !post.data.workInProgress;
    })
  );

  const author = {
    name: config.author.name,
    email: config.author.email,
    link: config.author.fediverseURL,
  };

  const siteURL = config.baseURL;

  const feed = new Feed({
    title: config.title,
    description: config.description,
    id: siteURL,
    link: siteURL,
    language: "en",
    image: `${siteURL}/images/logo.svg`,
    favicon: `${siteURL}/favicon.ico`,
    copyright: config.footer.copyright,
    updated: posts[0].data.modified,
    generator: "Astro using Feed for Node.js",
    feedLinks: {
      rss2: `${siteURL}/rss/feed.xml`,
      json: `${siteURL}/rss/feed.json`,
      atom: `${siteURL}/rss/atom.xml`,
    },
    author,
  });

  const feedItems = await Promise.all(
    posts.map(async (post) => {
      const postURL = getPostAbsoluteUrl(post.slug);
      const formattedTitle = titleCase(post.data.title);
      const rawExcerpt = getRawExcerpt(post.data.excerpt);

      return {
        title: formattedTitle,
        id: getPostUrl(post.slug),
        link: postURL,
        guid: postURL,
        description: rawExcerpt,
        content: await markdownToHTML(post),
        author: [author],
        contributor: [author],
        date: post.data.created,
      };
    }),
  );

  feedItems.forEach((item) => feed.addItem(item));

  fs.mkdirSync("./public/rss", { recursive: true });
  fs.writeFileSync("./public/rss/feed.xml", feed.rss2());
  fs.writeFileSync("./public/rss/atom.xml", feed.atom1());
  fs.writeFileSync("./public/rss/feed.json", feed.json1());
}

generateFeeds()
  .then(() => {
    console.log("[RSS] feeds generated");
  })
  .catch((err) => {
    console.error("[RSS] error generating feeds", err);
  });
