import Head from 'next/head'

import Container from '../components/container'
import Layout from '../components/layout'
import Header from '../components/header'
import Posts from '../components/posts'

import { config } from '../blog.config'
import { getAllPosts } from '../lib/api'

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
    'excerpt',
  ])

  return {
    props: { allPosts },
  }
}
