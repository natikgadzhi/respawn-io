import { config as blogConfig } from "./blog.config"
import { defineDocumentType, makeSource } from "contentlayer/source-files"

import rehypePrettyCode, { type Options } from "rehype-pretty-code"
import remarkFigureCaption from "@microflash/remark-figure-caption"
import remarkGfm from "remark-gfm";

import wikilinks from "remark-wiki-link"

const hrefTemplate = (permalink: string) => `${blogConfig.baseURL}/posts/${permalink}`
const pageResolver = (name: string) => [name]

const prettyCodeOptions: Partial<Options> = {
  theme: {
    light: "github-light",
    dark: "github-dark"
  }
}

const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `_posts/*.md`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
    excerpt: {
      type: "string",
      description: "The excerpt of the post",
      required: true,
    },
    date: {
      type: "date",
      description: "The date of the post",
      required: true,
    },
    created: {
      type: "date",
      description: "The creation date for the post",
      required: false
    },
    modified: {
      type: "date",
      description: "The last update date for the post",
      required: true,
    },
    draft: {
      type: "boolean",
      description: "Whether the post is a draft",
      required: false,
    }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => `${doc._raw.sourceFileName.replace(/\.md$/, "")}`,
    },
    url: {
      type: "string",
      resolve: (doc) => `/posts/${doc._raw.sourceFileName.replace(/\.md$/, "")}`,
    },
    absoluteURL: {
      type: "string",
      resolve: (doc) => `${blogConfig.baseURL}/posts/${doc._raw.sourceFileName.replace(/\.md$/, "")}`,
    },
    ogImageURL: {
      type: "string",
      resolve: (doc) => `/posts/${doc._raw.sourceFileName.replace(/\.md$/, "")}/og-image.png`,
    },
  },
}));

const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `_pages/*.md`,
  contentType: "mdx",
}));

export default makeSource({
  disableImportAliasWarning: true,
  contentDirPath: "content/",
  documentTypes: [Post, Page],

  mdx: {
    remarkPlugins: [
      remarkGfm,
      [remarkFigureCaption, {captionClassName: "text-center italic"}],
      [wikilinks, {pageResolver, hrefTemplate}]
    ],
    rehypePlugins: [
      [rehypePrettyCode, prettyCodeOptions]
    ]
  }
});
