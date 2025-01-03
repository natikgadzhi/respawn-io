import { type Post, allPosts } from "contentlayer/generated";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import { format, parseISO } from "date-fns";
import { mdxComponents } from "lib/mdxComponents";
import { getMDXComponent } from "next-contentlayer2/hooks";

import Article from "components/article";
import { TagsList } from "components/tags";

import { config } from "blog.config";

type PostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata(
  { params }: PostPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const post = allPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return {
    metadataBase: new URL(config.baseURL),
    title: post.formattedTitle,
    description: post.meta_description === undefined ? post.rawExcerpt : post.meta_description,
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
          url: post.ogImageURL,
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
  return allPosts.map((post) => {
    slug: post.slug;
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const post = allPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  const MDXContent = getMDXComponent(post.body.code);

  return (
    <>
      <Article>
        <MDXContent components={mdxComponents} />

        <div className="text-2xl font-regular mt-20 mb-8 relative flex items-center justify-center">
          <div className="border-t border-gray-300 dark:border-gray-700 flex-grow"></div>
          <div className="px-4">⌘ ⌘ ⌘</div>
          <div className="border-t border-gray-300 dark:border-gray-700 flex-grow"></div>
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
