import fs from 'fs'
import { join } from 'path'

import Head from 'next/head'

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'

import Container from '../components/container'
import Layout from '../components/layout'
import Header from '../components/header/header'
import Article from '../components/article'

import { getPostMDXSource } from '../lib/posts'
import { config } from '../blog.config'


type Props = {
  source: MDXRemoteSerializeResult<Record<string, unknown>, Record<string, string>>
}

export default function About({ source }: Props) {
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