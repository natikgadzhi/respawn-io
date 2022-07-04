import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Head from 'next/head'

import Container from '../../components/container'
import Header from '../../components/header'
import Layout from '../../components/layout'
import DateFormatter from '../../components/date-formatter'
import markdownStyles from '../../components/markdown-styles.module.css'

import { getPostBySlug, getAllPosts } from '../../lib/posts'
import markdownToHtml from '../../lib/markdownToHtml'

export default function Post({ post, preview }) {
  const router = useRouter()
  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  return (
    <Layout preview={preview}>
      <Container>
        <Header />
        {router.isFallback ? (
          <h1>Loading…</h1>
        ) : (
          <>
            <article className="prose mb-32">
              <Head>
                <title>
                  {post.title}
                </title>
                <meta
                  name="description"
                  content={post.excerpt}
                />
              </Head>

              <div
                className={markdownStyles['markdown']}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

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
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'content',
  ])

  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

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
