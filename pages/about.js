import Container from '../components/container'
import Layout from '../components/layout'
import Header from '../components/header'
import Head from 'next/head'

import { config } from '../blog.config'

export default function About() {
  return (
    <>
      <Layout>
        <Head>
          <title>{ config.title }</title>
        </Head>
        <Container>
          <Header />
          <section className='max-w-2xl mx-auto'>
            About
          </section>
        </Container>
      </Layout>
    </>
  )
}
