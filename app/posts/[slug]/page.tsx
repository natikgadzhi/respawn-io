import { type Post, allPosts } from "contentlayer/generated";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { format, parseISO } from "date-fns";
import { mdxComponents } from "lib/mdxComponents";
import { getMDXComponent } from "next-contentlayer2/hooks";

import Article from "components/article";

import { config } from "blog.config";

type PostPageProps = {
  params: {
    slug: string;
  };
};

function PostTags({ post }: { post: Post }) {
  return (
    <>
      {post.tags && post.tags.length > 0 && (
        <div className="text-sm lg:text-lg text-center mb-4">
          <span className="text-stone-400">Tagged with: </span>
          {post.tags.map((tag, index) => (
            <span key={tag}>
              <Link
                href={`/tags/${tag.toLowerCase()}`}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                #{tag}
              </Link>
              {index < post.tags.length - 1 && ", "}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

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

        <div className="text-2xl font-regular text-center my-20 relative">⌘ ⌘ ⌘</div>

        <PostTags post={post} />

        <div className="text-sm lg:text-lg text-center text-stone-400">
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
        </div>
      </Article>
    </>
  );
}
