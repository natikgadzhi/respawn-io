import { allTags, allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { config as blogConfig } from "../../../blog.config";
import { getMDXComponent } from "next-contentlayer2/hooks";

import { PostsList } from "components/posts";

type TagPageParams = {
  params: {
    slug: string;
  };
};

// Get all unique tags from posts, including both .md tag files and inline tags
function getAllUniqueTags() {
  const inlineTags = allPosts.flatMap((post) => post.tags || []).map(tag => tag.toLowerCase());
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

export async function generateMetadata({ params }: TagPageParams): Promise<Metadata> {
  const tag = allTags.find((tag) => tag.slug === params.slug);
  const tagTitle = tag ? tag.title : params.slug;
  const canonicalURL = `${blogConfig.baseURL}/tags/${params.slug}`;

  return {
    title: `#${tagTitle} - ${blogConfig.title}`,
    description: tag?.description || `Posts tagged with #${tagTitle} in ${blogConfig.title}`,
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

  // If we have a tag with MDX content, get the component to render it
  const MDXContent = tag?.body.code ? getMDXComponent(tag.body.code) : null;

  return (
    <>
      <h1 className="text-3xl font-bold font-mono mb-4">#{tag ? tag.title : params.slug}</h1>
      
      {MDXContent && (
        <div className="prose dark:prose-invert max-w-none mb-8">
          <MDXContent />
        </div>
      )}

      <PostsList posts={posts} />
    </>
  );
}
