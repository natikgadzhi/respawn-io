import { config } from "blog.config";
import { allPages } from "contentlayer/generated";
import { mdxComponents } from "lib/mdxComponents";
import type { Metadata } from "next";
import { useMDXComponent } from "next-contentlayer2/hooks";

import Article from "components/article";

export const metadata: Metadata = {
  metadataBase: new URL(config.baseURL),
  title: config.title,
  description: config.meta.description,

  openGraph: {
    title: config.title,
    description: config.description,
    type: "website",
    locale: "en_US",
    siteName: config.title,
  },

  twitter: {
    title: config.title,
    creator: config.author.twitterHandle,
    site: config.author.twitterHandle,
    card: "summary_large_image",
  },

  alternates: {
    canonical: `${config.baseURL}/about`,
  },
};

export default function About() {
  const page = allPages.find((page) => page._raw.sourceFileName === "about.md");
  const MDXComponent = useMDXComponent(page.body.code);

  return (
    <>
      <Article>
        <MDXComponent components={mdxComponents} />
      </Article>
    </>
  );
}
