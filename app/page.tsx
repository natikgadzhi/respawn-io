import { Metadata } from "next";

import { config as blogConfig } from "blog.config";
import generateFeeds from "lib/feed";

import { compareDesc } from 'date-fns'
import { allPosts } from "contentlayer/generated";

import Posts from "components/posts";


async function getPosts() {
  const posts = allPosts.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))
  // FIXME: Extract into a separate CLI tool
  await generateFeeds(posts);

  return posts
}

export const metadata: Metadata = {
  title: blogConfig.title,
  description: blogConfig.description,

  openGraph: {
    title: blogConfig.title,
  },
  twitter: {
    title: blogConfig.title
  },

  alternates: {
    canonical: blogConfig.baseURL
  }
};

export default async function Page() {
  const posts = await getPosts();

  return (
    <>
      <Posts posts={posts} />
    </>
  );
}


