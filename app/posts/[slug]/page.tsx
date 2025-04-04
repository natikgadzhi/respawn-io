import { type Post, allPosts } from "contentlayer/generated";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { format, parseISO } from "date-fns";
import Article from "components/article";
import { TagsList } from "components/tags";
import { MDXRenderer } from "components/mdx-renderer";

import { config } from "blog.config";

type Params = Promise<{ slug: string }>;

export async function generateMetadata(
  { params }: { params: Params },
  _parent: ResolvingMetadata
) {
  const { slug } = await params;
  const post = allPosts.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  return {
    metadataBase: new URL(config.baseURL),
    title: post.formattedTitle,
    description:
      post.meta_description === undefined
        ? post.rawExcerpt
        : post.meta_description,
    keywords: post.meta_keywords,
    authors: [{ name: config.author.name, url: config.baseURL }],
    openGraph: {
      type: "article",
      url: post.absoluteURL,
      title: post.formattedTitle,
      description: post.rawExcerpt,
      publishedTime: post.modified,
      images: [
        {
          url: `/posts/${post.slug}/og-image.png?title=${encodeURIComponent(post.formattedTitle)}&url=${encodeURIComponent(post.absoluteURL)}&excerpt=${encodeURIComponent(post.rawExcerpt)}&hideDescription=${post.og_image_hide_description ? 'true' : 'false'}`,
          width: 1200,
          height: 630,
          alt: `${post.formattedTitle}. ${post.excerpt}`,
        },
      ],
      siteName: config.title,
    },
    twitter: {
      title: post.formattedTitle,
      description: post.rawExcerpt,
      creator: config.author.twitterHandle,
      site: config.author.twitterHandle,
      card: "summary_large_image",
    },
    alternates: {
      canonical: post.absoluteURL,
    },
  };
}

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: Params }) {
  // Await the params Promise to get the actual slug
  const { slug } = await params;
  const post = allPosts.find((post) => post.slug === slug);

  if (!post) {
    notFound();
  }

  // No longer using getMDXComponent here - it will be used in the client component

  return (
    <>
      <Article>
        <MDXRenderer code={post.body.code} />

        <div className="text-2xl font-regular mt-20 mb-8 relative flex items-center justify-center">
          <div className="border-t border-gray-300 dark:border-gray-700 grow"></div>
          <div className="px-4">⌘ ⌘ ⌘</div>
          <div className="border-t border-gray-300 dark:border-gray-700 grow"></div>
        </div>

        {post.tags && <TagsList tags={post.tags} className="mb-4" />}

        <div>
          Originally published on&nbsp;
          {format(parseISO(post.created), "MMM do yyyy")}.
        </div>
        {post.created !== post.modified && (
          <div>
            Last update on&nbsp;
            {format(parseISO(post.modified), "MMM do yyyy")}.
          </div>
        )}
      </Article>
    </>
  );
}
