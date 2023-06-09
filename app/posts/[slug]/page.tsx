import { Metadata, ResolvingMetadata } from "next";
import { allPosts, type Post } from "contentlayer/generated";

import { format, parseISO } from "date-fns";
import { getMDXComponent, useMDXComponent } from "next-contentlayer/hooks";
import { mdxComponents } from "lib/mdxComponents";

import Container from "components/container";
import Header from "components/header/header";
import Article from "components/article";

type Params = {
  params: {
    slug: string;
  };
};

type Props = {
  params: {
    slug: string
  }
}

export async function generateMetadata( { params }: Props, parent: ResolvingMetadata ): Promise<Metadata> {
  const post = allPosts.find((post) => post.slug === params.slug);
  return {
    title: post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.ogImageURL,
          width: 1200,
          height: 630,
          alt: `${post.title}. ${post.excerpt}`,
        }
      ]
    },
    twitter: {
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: post.absoluteURL
    }
  }
}

export async function generateStaticParams() {
  return allPosts.map((post) => { slug: post.slug });
}

export default async function Post( { params }: Params ) {
  const post = allPosts.find((post) => post.slug === params.slug);
  const MDXContent = getMDXComponent(post.body.code);

  return (
    <>
      <Container>
        <Header />
        <Article>
          <MDXContent components={mdxComponents} />

          <div className="text-2xl font-regular text-center my-20">⌘ ⌘ ⌘</div>
          <div>
            <span>
              Originally published on&nbsp;
              {format(parseISO(post.date), "MMM do yyyy")}
            </span>
            {post.date != post.modified && (
              <span className="ml-2">
                Last update on&nbsp;
                {format(parseISO(post.modified), "MMM do yyyy")}
              </span>
            )}
          </div>
        </Article>
      </Container>
    </>
  );
}
