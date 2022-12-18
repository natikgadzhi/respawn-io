import { Feed } from "feed";
import { config } from "../blog.config";
import fs from "fs";

import { Post } from "./posts";

export default async function generateFeeds(posts:Array<Post>) {
  const date = new Date();

  const author = {
    name: config.author.name,
    email: config.author.email,
    link: config.author.twitterURL,
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
    updated: date,
    generator: "Next.js using Feed for Node.js",
    feedLinks: {
      rss2: `${config.baseURL}/rss/feed.xml`,
      json: `${config.baseURL}/rss/feed.json`,
      atom: `${config.baseURL}/rss/atom.xml`,
    },
    author,
  });

  posts.forEach((post) => {
    const url = `${config.baseURL}/posts/${post.slug}`;

    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.excerpt,
      content: post.content,
      author: [author],
      contributor: [author],
      date: new Date(post.date),
    });
  });

  fs.mkdirSync("./public/rss", { recursive: true });
  fs.writeFileSync("./public/rss/feed.xml", feed.rss2());
  fs.writeFileSync("./public/rss/atom.xml", feed.atom1());
  fs.writeFileSync("./public/rss/feed.json", feed.json1());
}
