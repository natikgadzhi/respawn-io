import { useRouter } from "next/router";
import ErrorPage from "next/error";

import { NextSeo, ArticleJsonLd } from "next-seo";

import { config } from "../../blog.config";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { getPostBySlug, getAllPosts, getPostMDXSource, Post as PostType } from "../../lib/posts";

import Image from "next/image"

import Container from "../../components/container";
import Header from "../../components/header/header";
import Layout from "../../components/layout";
import Article from "../../components/article";
import Callout from "../../components/callout";
import DateFormatter from "../../components/date-formatter";

const MDXComponents = {
  // FIXME: Passing img as a key to MDXComponents blows up a type check.
  // As I did not yet use images, that's fine for now.
  // img: Image,
  Callout,
  Image
}

type Props = {
  post: PostType,
  source: MDXRemoteSerializeResult<Record<string, unknown>, Record<string, string>>
}

type Params = {
  params: {
    slug: string
  }
}

export default function Post({ post, source }: Props) {
  const router = useRouter();
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  const ogImageURL = `${config.baseURL}/api/opengraph/post?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.excerpt)}&slug=${encodeURIComponent(post.slug)}`

  return (
    <>
      <NextSeo
        canonical = {`${config.baseURL}/posts/${post.slug}`}
        openGraph = {{
          title: post.title,
          description: post.excerpt,
          url: `${config.baseURL}/posts/${post.slug}`,
          type: "article",
          images: [{
            url: ogImageURL,
            width: 1200,
            height: 630,
            alt: `${post.title}. ${post.excerpt}`
          }],
          article: {
            publishedTime: post.date,
            modifiedTime: post.modified,
          }
        }}
      />
      <ArticleJsonLd
        type = "BlogPosting"
        url = {`${config.baseURL}/posts/${post.slug}`}
        title = {post.title}
        images = {[ogImageURL]}
        datePublished = {post.date}
        dateModified = {post.modified}
        authorName = {config.author.name}
        description = {post.excerpt}
      />
      <Layout>
        <Container>
          <Header />
          {router.isFallback ? (
            <h1>Loading…</h1>
          ) : (
            <Article>
              <MDXRemote {...source} components={MDXComponents} />


              <div className="text-2xl font-regular text-center my-20">
              ⌘ ⌘ ⌘
              </div>

              <div>
                <span>
                  Originally published on&nbsp;
                  <DateFormatter dateString={post.date} />.
                </span>

                {post.date != post.modified && (
                  <span className="ml-2">
                    Last update on&nbsp;
                    <DateFormatter dateString={post.modified} />.
                  </span>
                )}
              </div>
            </Article>
          )}
        </Container>
      </Layout>
    </>

  );
}

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug);

  const source = await getPostMDXSource(post.content);

  return {
    props: {
      post: {
        ...post,
      },
      source: source,
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts();

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      };
    }),
    fallback: false,
  };
}
