import Container from '../components/container'
import Layout from '../components/layout'
import Header from '../components/header'
import Posts from '../components/posts'
import { getAllPosts } from '../lib/api'
import Head from 'next/head'

import { config } from '../blog.config'

export default function Index({ allPosts }) {
  return (
    <>
      <Layout>
        <Head>
          <title>{ config.title }</title>
        </Head>
        <Container>
          <Header />
          <Posts posts={allPosts} />
        </Container>
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const allPosts = getAllPosts([
    'title',
    'date',
    'slug',
    'author',
    'coverImage',
    'excerpt',
  ])

  return {
    props: { allPosts },
  }
}
