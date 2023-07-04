import { Metadata } from "next";

import { config as blogConfig } from "blog.config";
import { getPosts } from "lib/posts";

import Posts from "components/posts";

export const metadata: Metadata = {
  title: blogConfig.title,
  description: blogConfig.description,

  openGraph: {
    title: blogConfig.title,
  },
  twitter: {
    title: blogConfig.title,
  },

  alternates: {
    canonical: blogConfig.baseURL,
    types: {
      'application/rss+xml': `${blogConfig.baseURL}'/rss/feed.xml`,
    },
  },
};

export default async function Page() {
  const posts = await getPosts();

  return (
    <>
      <Posts posts={posts} />
    </>
  );
}
