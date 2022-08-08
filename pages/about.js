import Container from '../components/container'
import Layout from '../components/layout'
import Header from '../components/header'
import Head from 'next/head'

import fs from 'fs'
import { join } from 'path'
import markdownStyles from '../components/markdown-styles.module.css'

import { getPostMDXSource } from '../lib/posts'
import { MDXRemote } from 'next-mdx-remote';

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
          <section className='prose'>
            <div className={markdownStyles['markdown']}>
              <MDXRemote {...source} />
            </div>
          </section>
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