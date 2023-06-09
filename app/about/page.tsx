import { Metadata } from "next"
import { config } from "blog.config"
import { allPages } from "contentlayer/generated"
import { useMDXComponent } from "next-contentlayer/hooks"
import { mdxComponents } from "lib/mdxComponents"

import Article from 'components/article'

export const metadata: Metadata = {
  title: config.title,
  openGraph: {
    title: config.title
  },
  twitter: {
    title: config.title
  },
  alternates: {
    canonical: `${config.baseURL}/about`
  }
};

export default function About() {
  const page = allPages.find((page) => page._raw.sourceFileName === "_about.md")
  const MDXComponent = useMDXComponent(page.body.code)

  return (
    <>
      <Article>
        <MDXComponent components={mdxComponents} />
      </Article>
    </>
  )
}
