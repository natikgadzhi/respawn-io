import { config as blogConfig } from "./blog.config"
import { makeSource } from "contentlayer/source-files"

import rehypePrettyCode, { type Options } from "rehype-pretty-code"
import remarkFigureCaption from "@microflash/remark-figure-caption"
import remarkGfm from "remark-gfm";

import wikilinks from "remark-wiki-link";

import { Post } from "./lib/post.contentlayer";
import { Page } from "./lib/page.contentlayer";
import { Daily } from "./lib/daily.contentlayer";

const hrefTemplate = (permalink: string) => `${blogConfig.baseURL}/posts/${permalink}`
const pageResolver = (name: string) => [name]

const prettyCodeOptions: Partial<Options> = {
  theme: {
    light: "github-light",
    dark: "github-dark"
  }
}

export default makeSource({
  disableImportAliasWarning: true,
  contentDirPath: "content/",
  documentTypes: [Post, Page, Daily],
  mdx: {
    remarkPlugins: [
      remarkGfm,
      [remarkFigureCaption, {captionClassName: "text-center italic"}],
      [wikilinks, {pageResolver, hrefTemplate, aliasDivider: "|"}]
    ],
    rehypePlugins: [
      [rehypePrettyCode, prettyCodeOptions]
    ]
  }
});
