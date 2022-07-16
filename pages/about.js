import Container from '../components/container'
import Layout from '../components/layout'
import Header from '../components/header'
import Head from 'next/head'


import fs from 'fs'
import { join } from 'path'
import markdownToHtml from '../lib/markdownToHtml'
import markdownStyles from '../components/markdown-styles.module.css'

import { config } from '../blog.config'

export default function About({ about }) {
  return (
    <>
      <Layout>
        <Head>
          <title>{ config.title }</title>
        </Head>
        <Container>
          <Header />
          <section className='prose'>
            <div
              className={markdownStyles['markdown']}
              dangerouslySetInnerHTML={{ __html: about }}
            />
          </section>
        </Container>
      </Layout>
    </>
  )
}


export async function getStaticProps() {
  const aboutPath = join(process.cwd(), '_about.md')
  const about = await markdownToHtml(fs.readFileSync(aboutPath, 'utf8'))
  return {
    props: {
      about: about
    },
  }
}