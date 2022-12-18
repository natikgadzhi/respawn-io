import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Head from "next/head";
import Image from "next/image";

import { config } from "../../blog.config";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { getPostBySlug, getAllPosts, getPostMDXSource, Post as PostType } from "../../lib/posts";

import Container from "../../components/container";
import Header from "../../components/header/header";
import Layout from "../../components/layout";
import Article from "../../components/article";
import Callout from "../../components/callout";
import DateFormatter from "../../components/date-formatter";

const MDXComponents = {
  img: Image,
  Callout
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

  return (
    <Layout>
      <Container>
        <Header />
        {router.isFallback ? (
          <h1>Loading…</h1>
        ) : (
          <>
            <Head>
              <title>{post.title}</title>
              <meta name="description" content={post.excerpt} />
              <link
                rel="canonical"
                href={`${config.baseURL}/posts/${post.slug}`}
              />
            </Head>

            <Article>
              <MDXRemote {...source} components={MDXComponents} />

              <div className="py-12 text-sm">
                <span>
                  Originally published on&nbsp;
                  <DateFormatter dateString={post.date} />.
                </span>

                {post.date != post.modified && (
                  <span>
                    Last update on&nbsp;
                    <DateFormatter dateString={post.modified} />.
                  </span>
                )}
              </div>
            </Article>
          </>
        )}
      </Container>
    </Layout>
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
