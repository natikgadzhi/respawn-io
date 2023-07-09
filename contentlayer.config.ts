import { config as blogConfig } from "./blog.config"
import { defineDocumentType, makeSource } from "contentlayer/source-files"

import rehypePrettyCode, { type Options } from "rehype-pretty-code"
import remarkFigureCaption from "@microflash/remark-figure-caption"
import remarkGfm from "remark-gfm";

import wikilinks from "remark-wiki-link";

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
  filePathPattern: `posts/*.md`,
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
    },
    meta_description: {
      type: "string",
      description: "The meta description of the post",
      required: false,
    },
    meta_keywords: {
      type: "string",
      description: "The meta keywords of the post",
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

// Page is a simple type to hold the content
// of a page. Currently used in `/about`.
const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `pages/*.md`,
  contentType: "mdx",
}));

// Daily are short TIL notes.
const Daily = defineDocumentType(() => ({
  name: "Daily",
  filePathPattern: `daily/*.md`,
  contentType: "mdx",
  fields: {
    title: {
      required: true,
      type: "string",
      description: "The title of the note",
    },

    // Obsidian likes creating these fields in Linters
    // but they are not used.
    created: {
      type: "date",
      required: false,
      description: "The creation date for the note",
    },
    modified: {
      type: "date",
      required: false,
      description: "The last update date for the note",
    },
    draft: {
      type: "boolean",
      required: false,
      description: "Whether the note is a draft"
    }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => `${doc._raw.sourceFileName.split(".")[0]}`
    }
  }
}));

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
