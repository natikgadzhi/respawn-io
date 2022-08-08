import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Head from 'next/head'

import Container from '../../components/container'
import Header from '../../components/header'
import Layout from '../../components/layout'
import DateFormatter from '../../components/date-formatter'
import markdownStyles from '../../components/markdown-styles.module.css'

import { getPostBySlug, getAllPosts, getPostMDXSource } from '../../lib/posts'

import { MDXRemote } from 'next-mdx-remote';

import Image from 'next/image';

const components = { img: Image };


export default function Post({ post, source }) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
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
              <title>
                {post.title}
              </title>
              <meta
                name="description"
                content={post.excerpt}
              />
            </Head>

            <article className="prose mb-32">
              <div className={markdownStyles['markdown']}>
                <MDXRemote {...source} components={components} />
              </div>

              <div className="mb-6 text-md">
                Originally published on&nbsp;
                <DateFormatter dateString={post.date} />.
              </div>
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug)

  const source = await getPostMDXSource(post.content)

  return {
    props: {
      post: {
        ...post,
      },
      source: source
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts()

  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: false,
  }
}
