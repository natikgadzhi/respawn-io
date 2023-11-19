import { Metadata } from "next";

import { config as blogConfig } from "blog.config";
import { allPosts } from "contentlayer/generated";
import { compareDesc } from "date-fns";

import { PostsList } from "components/posts";

const getPosts = async () => {
  const env_name = process.env.ENV_NAME;
  const posts = allPosts
    .filter((post) => env_name == "localhost" || !post.draft)
    .sort((a, b) => compareDesc(new Date(a.created), new Date(b.created)));

  return posts;
}

// twitter and openGraph keys will be merged from defaults in layout.tsx
export const metadata: Metadata = {
  title: blogConfig.title,
  description: blogConfig.description
};

export default async function Page() {
  const posts = await getPosts();

  return (
    <>
      <PostsList posts={posts} />
    </>
  );
}
