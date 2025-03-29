import type { Metadata } from "next";
import React from "react";

import { config as blogConfig } from "blog.config";
import { allPosts } from "contentlayer/generated";
import { compareDesc } from "date-fns";
import { getTagsWithCounts } from "lib/tagHelpers";

import { PostsList } from "components/posts";
import { TagsList } from "components/tags";

const getPosts = async () => {
  const env_name = process.env.ENV_NAME;
  const posts = allPosts
    .filter((post) => env_name === "localhost" || !post.draft)
    .sort((a, b) => compareDesc(new Date(a.created), new Date(b.created)));

  return posts;
};

// twitter and openGraph keys will be merged from defaults in layout.tsx
export const metadata: Metadata = {
  title: blogConfig.title,
  description: blogConfig.description,
};

export default async function Page() {
  const posts = await getPosts();
  const tagsWithCounts = getTagsWithCounts(allPosts);
  const tags = tagsWithCounts.map(({ tag }) => tag);
  const counts = Object.fromEntries(tagsWithCounts.map(({ tag, count }) => [tag, count]));

  return (
    <>
      {tagsWithCounts.length > 0 && (
        <TagsList tags={tags} showCounts={true} counts={counts} className="mt-8 md:mt-4" />
      )}
      <PostsList posts={posts} />
    </>
  );
}
