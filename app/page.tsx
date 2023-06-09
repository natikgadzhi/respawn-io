import { Metadata } from "next";

import Container from "components/container";
import Header from "components/header/header";
import Posts from "components/posts";

import { config as blogConfig } from "blog.config";
import generateFeeds from "lib/feed";

import { compareDesc } from 'date-fns'
import { allPosts } from "contentlayer/generated";

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
      <Container>
        <Header />
        <Posts posts={posts} />
      </Container>
    </>
  );
}


