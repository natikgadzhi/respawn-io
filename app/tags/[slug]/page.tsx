import { allTags, allPosts, allDailies } from "contentlayer/generated";
import { compareDesc, format, parse } from "date-fns";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { config as blogConfig } from "../../../blog.config";
import { MDXRenderer } from "components/mdx-renderer";
import Link from "next/link";
import { LinkedH4 } from "components/headerLinks";

import { PostsList } from "components/posts";

type Params = Promise<{ slug: string }>;

// Get all unique tags from posts and dailies, including both .md tag files and inline tags
function getAllUniqueTags() {
  const postTags = allPosts
    .flatMap((post) => post.tags || [])
    .map((tag) => tag.toLowerCase());
  
  const dailyTags = allDailies
    .flatMap((daily) => daily.tags || [])
    .map((tag) => tag.toLowerCase());
    
  const mdTags = allTags.map((tag) => tag.title.toLowerCase());
  
  return Array.from(new Set([...postTags, ...dailyTags, ...mdTags]));
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
// Format date for daily notes
const formatDate = (date: string) => {
  return format(parse(date, "yyyy-MM-dd", new Date()), "MMMM do");
};

export default async function TagPage({ params }: { params: Params }) {
  // Await the params Promise to get the actual slug
  const { slug } = await params;
  const tag = allTags.find((tag) => tag.slug === slug);
  const tagName = tag ? tag.title.toLowerCase() : slug;

  // Get posts with this tag
  const posts = allPosts
    .filter((post) => post.tags?.includes(tagName))
    .sort((a, b) => compareDesc(new Date(a.created), new Date(b.created)));

  // Get dailies with this tag  
  const dailies = allDailies
    .filter((daily) => daily.tags?.includes(tagName))
    .sort((a, b) => compareDesc(new Date(a.slug), new Date(b.slug)));

  // If the tag is not a valid Tag object and there are no posts or dailies tagged with this tag slug,
  // bail out to 404.
  if (!tag && posts.length === 0 && dailies.length === 0) {
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

      {posts.length > 0 && <PostsList posts={posts} />}

      {dailies.length > 0 && (
        <>
          {posts.length > 0 && <hr className="my-10" />}
          
          <section className="mt-6 md:mt-8 prose dark:prose-invert">
            <h2 className="text-2xl font-extrabold tracking-tighter mb-6">Daily Notes</h2>
            <ul className="list-none pl-0 space-y-12">
              {dailies.map((daily) => (
                <li key={daily._id} className="text-md md:text-lg pl-0 pt-5">
                  <Link href={`/daily/${daily.slug}`} className="no-underline hover:underline">
                    <LinkedH4 className="pr-1 md:pr-2 inline">{`${formatDate(daily.slug)}:`}</LinkedH4>
                    {daily.title && daily.title.length > 0 && (
                      <strong className="pr-1 md:pr-2">{daily.title}</strong>
                    )}
                  </Link>
                  
                  <div className="mt-2">
                    <MDXRenderer code={daily.body.code} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </>
  );
}
