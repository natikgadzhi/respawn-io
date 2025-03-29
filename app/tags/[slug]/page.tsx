import { allTags, allPosts } from "contentlayer/generated";
import { compareDesc } from "date-fns";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { config as blogConfig } from "../../../blog.config";
import { MDXRenderer } from "components/mdx-renderer";

import { PostsList } from "components/posts";

type Params = Promise<{ slug: string }>;

// Get all unique tags from posts, including both .md tag files and inline tags
function getAllUniqueTags() {
  const inlineTags = allPosts
    .flatMap((post) => post.tags || [])
    .map((tag) => tag.toLowerCase());
  const mdTags = allTags.map((tag) => tag.title.toLowerCase());
  return Array.from(new Set([...inlineTags, ...mdTags]));
}

// Generate static paths using all unique tags, not just the
// ones that have markdown files with them.
export async function generateStaticParams() {
  const allUniqueTags = getAllUniqueTags();
  return allUniqueTags.map((tag) => ({
    slug: tag.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const tag = allTags.find((tag) => tag.slug === slug);
  const tagTitle = tag ? tag.title : slug;
  const canonicalURL = `${blogConfig.baseURL}/tags/${slug}`;

  return {
    title: `#${tagTitle} - ${blogConfig.title}`,
    description:
      tag?.description ||
      `Posts tagged with #${tagTitle} in ${blogConfig.title}`,
    alternates: {
      canonical: canonicalURL,
    },
    openGraph: {
      title: `#${tagTitle} - ${blogConfig.title}`,
      description: tag?.description || `Posts tagged with #${tagTitle}`,
      url: canonicalURL,
      type: "website",
    },
    twitter: {
      title: `#${tagTitle} - ${blogConfig.title}`,
      description: tag?.description || `Posts tagged with #${tagTitle}`,
      card: "summary",
    },
  };
}

// Renders a page with all the posts for a given tag.
// If the tags is not a .md registered tag, will just use the slug as the tag string
//
export default async function TagPage({ params }: { params: Params }) {
  // Await the params Promise to get the actual slug
  const { slug } = await params;
  const tag = allTags.find((tag) => tag.slug === slug);

  const posts = allPosts
    .filter((post) =>
      post.tags?.includes(tag ? tag.title.toLowerCase() : slug),
    )
    .sort((a, b) => compareDesc(new Date(a.created), new Date(b.created)));

  // If the tag is not a valid Tag object (not a persisted md file) and there are no posts tagged with this tag slug either,
  // bail out to 404.
  if (!tag && posts.length == 0) {
    notFound();
  }

  return (
    <>
      <h1 className="text-3xl font-bold font-mono mb-4">
        #{tag ? tag.title : slug}
      </h1>

      {tag?.body.code && (
        <div className="prose dark:prose-invert max-w-none mb-8">
          <MDXRenderer code={tag.body.code} />
        </div>
      )}

      <PostsList posts={posts} />
    </>
  );
}
