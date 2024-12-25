import { defineDocumentType } from "contentlayer2/source-files";
import { config } from "../blog.config";

// Tags represent a category / tag page with a title and a body.
export const Tag = defineDocumentType(() => ({
  name: "Tag",
  filePathPattern: "tags/*.md",
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The name of the tag",
      required: true,
    },
  },
  computedFields: {
    slug: {
      type: "string",
      description: "The slug of the tag",
      resolve: (doc) => `${doc._raw.sourceFileName.replace(/\.md$/, "")}`,
    },
    url: {
      type: "string",
      resolve: (doc) => `/tags/${doc._raw.sourceFileName.replace(/\.md$/, "")}`,
    },
    absoluteURL: {
      type: "string",
      resolve: (doc) => `${config.baseURL}/tags/${doc._raw.sourceFileName.replace(/\.md$/, "")}`,
    },
  },
}));
