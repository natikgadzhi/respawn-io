import fs from "node:fs";
import { compareDesc } from "date-fns";
import { Feed } from "feed";

import { markdownToHTML } from "../lib/markdownToHTML";

import { allPosts } from "../.contentlayer/generated/index.mjs";
import { config } from "../blog.config";

export default async function generateFeeds() {
  const env_name = process.env.ENV_NAME;
  const posts = allPosts
    .filter((post) => {
      // In development, show all posts except drafts
      if (env_name === "localhost") {
        //@ts-ignore
        return !post.draft; 
      }
      
      // In production, exclude both drafts and work in progress posts from RSS
      //@ts-ignore
      return !post.draft && !post.workInProgress;
    })
    .sort((a, b) => compareDesc(new Date(a.created), new Date(b.created)));

  const author = {
    name: config.author.name,
    email: config.author.email,
    link: config.author.fediverseURL,
  };

  const feed = new Feed({
    title: config.title,
    description: config.description,
    id: config.baseURL,
    link: config.baseURL,
    language: "en",
    image: `${config.baseURL}/images/logo.svg`,
    favicon: `${config.baseURL}/favicon.ico`,
    copyright: config.footer.copyright,
    updated: new Date(posts[0].modified),
    generator: "Next.js using Feed for Node.js",
    feedLinks: {
      rss2: `${config.baseURL}/rss/feed.xml`,
      json: `${config.baseURL}/rss/feed.json`,
      atom: `${config.baseURL}/rss/atom.xml`,
    },
    author,
  });

  const feedItems = await Promise.all(
    posts.map(async (post) => {
      return {
        title: post.formattedTitle,
        id: post.url,
        link: post.absoluteURL,
        guid: post.absoluteURL,
        description: post.rawExcerpt,
        // @ts-ignore
        content: await markdownToHTML(post),
        author: [author],
        contributor: [author],
        date: new Date(post.created),
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
