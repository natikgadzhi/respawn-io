import { Metadata } from "next";

import { config as blogConfig } from "blog.config";
import { allPosts } from "contentlayer/generated";
import { compareDesc } from "date-fns";

import Posts from "components/posts";

const getPosts = async () => {
  const env_name = process.env.ENV_NAME;
  const posts = allPosts
    .filter((post) => env_name == "localhost" || !post.draft)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return posts;
}

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
