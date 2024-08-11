import { defineDocumentType } from "contentlayer2/source-files";
import { config } from "../blog.config";
import { titleCase } from "./titleCase";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `posts/*.md`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
    tags: {
      type: "list",
      of: { type: "string" },
      description: "List of tags to for the post. May refer to an existing tag by title",
      required: false,
    },
    excerpt: {
      type: "mdx",
      description: "The excerpt of the post",
      required: true,
    },
    created: {
      type: "date",
      description: "The creation date for the post",
      required: true,
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
    },
    og_image_hide_description: {
      type: "boolean",
      description: "Whether to hide the description of the post in the og:image",
      required: false,
    },
  },
  computedFields: {
    formattedTitle: {
      type: "string",
      description: "Title Case Formatted Post Title",
      resolve: (doc) => titleCase(doc.title),
    },
    rawExcerpt: {
      type: "string",
      description: "Excerpt cleaned of markdown formatting.",
      resolve: (doc) =>
        doc.excerpt.raw
          .replace(/\*\*(.*?)\*\*/g, "$1") // Remove ** tags
          .replace(/\*(.*?)\*/g, "$1") // Remove * tags
          .replace(/__(.*?)__/g, "$1") // Remove __ tags
          .replace(/_(.*?)_/g, "$1") // Remove _ tags
          .replace(/~~(.*?)~~/g, "$1"), // Remove ~~ tags
    },
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
      resolve: (doc) => `${config.baseURL}/posts/${doc._raw.sourceFileName.replace(/\.md$/, "")}`,
    },
    ogImageURL: {
      type: "string",
      resolve: (doc) => `/posts/${doc._raw.sourceFileName.replace(/\.md$/, "")}/og-image.png`,
    },
  },
}));
