import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { allPosts, type Post } from "contentlayer/generated";

import { format, parseISO } from "date-fns";
import { getMDXComponent } from "next-contentlayer2/hooks";
import { mdxComponents } from "lib/mdxComponents";

import Article from "components/article";

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

export default async function Post({ params }: PostPageProps) {
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
        <div className="text-sm lg:text-lg text-center text-stone-400">
          <div>
            Originally published on&nbsp;
            {format(parseISO(post.created), "MMM do yyyy")}.
          </div>
          {post.created != post.modified && (
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
