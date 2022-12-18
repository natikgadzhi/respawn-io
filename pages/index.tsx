import Head from "next/head";

import Container from "../components/container";
import Layout from "../components/layout";
import Header from "../components/header/header";
import Posts from "../components/posts";

import { config } from "../blog.config";
import { Post, getAllPosts } from "../lib/posts";
import generateFeeds from "../lib/feed";

type Props = {
  allPosts: Array<Post>;
}

export default function Index({ allPosts }: Props) {
  return (
    <>
      <Layout>
        <Head>
          <title>{config.title}</title>
          <meta name="description" content={config.meta.description} />
          <meta property="og:image" content={config.meta.ogImage} />
          <link rel="canonical" href={config.baseURL} />
        </Head>
        <Container>
          <Header />
          <Posts posts={allPosts} />
        </Container>
      </Layout>
    </>
  );
}

export async function getStaticProps() {
  const allPosts = getAllPosts();

  // pre-generate all feeds when generating the index page.
  // this will only work as long as the index page has all the posts. So I'll need to clean it out later.
  // But I'm not dealing with CJS vs ESM today.
  await generateFeeds(allPosts);

  return {
    props: { allPosts },
  };
}