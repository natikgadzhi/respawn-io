import { type Tag, allTags, type Post, allPosts } from "contentlayer/generated";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { mdxComponents } from "lib/mdxComponents";
import { getMDXComponent } from "next-contentlayer2/hooks";

import { PostsList } from "components/posts";
import Article from "components/article";

type TagPageParams = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return allTags.map((tag) => {
    slug: tag.slug;
  });
}

// Renders a page with all the posts for a given tag.
// If the tags is not a .md registered tag, will just use the slug as the tag string
//
export default async function TagPage({ params }: TagPageParams) {
  const tag = allTags.find((tag) => tag.slug === params.slug);

  const posts = allPosts.filter((post) =>
    post.tags?.includes(tag ? tag.title.toLowerCase() : params.slug),
  );

  // If the tag is not a valid Tag object (not a persisted md file) and there are no posts tagged with this tag slug either,
  // bail out to 404.
  if (!tag && posts.length == 0) {
    notFound();
  }

  return (
    <>
      <h1 className="text-3xl font-bold font-mono">#{tag ? tag.title : params.slug}</h1>
      <PostsList posts={posts} />
    </>
  );
}
