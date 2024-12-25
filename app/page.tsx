import type { Metadata } from "next";

import { config as blogConfig } from "blog.config";
import { allPosts } from "contentlayer/generated";
import { compareDesc } from "date-fns";
import { getTagsWithCounts } from "lib/tagHelpers";

import Link from "next/link";

import { PostsList } from "components/posts";

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

  return (
    <>
      <BlogTagsList />
      <PostsList posts={posts} />
    </>
  );
}

function BlogTagsList() {
  const tagsWithCounts = getTagsWithCounts(allPosts);

  return (
    <>
      {tagsWithCounts.length > 0 && (
        <div className="mt-8">
          <div className="text-sm md:text-base flex flex-wrap">
            {tagsWithCounts.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="underline-offset-2 hover:underline pr-3"
              >
                #{tag}
                {count > 1 ? ` (${count})` : ""}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
