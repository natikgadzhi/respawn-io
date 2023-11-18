import { Metadata } from "next"
import { config } from "blog.config"
import { allPages } from "contentlayer/generated"
import { useMDXComponent } from "next-contentlayer/hooks"
import { mdxComponents } from "lib/mdxComponents"

import Article from 'components/article'

export const metadata: Metadata = {
  title: config.title,
  description: config.meta.description,

  openGraph: {
    title: config.title,
    description: config.description,
    type: "website",
    locale: "en_US",
    siteName: config.title
  },

  twitter: {
    title: config.title,
    creator: config.author.twitterHandle,
    site: config.author.twitterHandle,
    card: "summary_large_image"
  },

  alternates: {
    canonical: `${config.baseURL}/about`
  }
};

export default function About() {
  const page = allPages.find((page) => page._raw.sourceFileName === "about.md")
  const MDXComponent = useMDXComponent(page.body.code)

  return (
    <>
      <Article>
        <MDXComponent components={mdxComponents} />
      </Article>
    </>
  )
}
