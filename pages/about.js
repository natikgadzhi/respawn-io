import fs from 'fs'
import { join } from 'path'

import Head from 'next/head'

import { MDXRemote } from 'next-mdx-remote'

import Container from '../components/container'
import Layout from '../components/layout'
import Header from '../components/header'
import Article from '../components/article'

import { getPostMDXSource } from '../lib/posts'
import { config } from '../blog.config'

export default function About({ source }) {
  return (
    <>
      <Layout>
        <Head>
          <title>{ config.title }</title>
        </Head>
        <Container>
          <Header />
          <Article>
            <MDXRemote {...source} />
          </Article>
        </Container>
      </Layout>
    </>
  )
}


export async function getStaticProps() {
  const aboutPath = join(process.cwd(), '_about.md')
  const source = await getPostMDXSource(fs.readFileSync(aboutPath, 'utf8'))
  return {
    props: {
      source: source
    },
  }
}