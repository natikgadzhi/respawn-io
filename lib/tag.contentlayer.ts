import { defineDocumentType } from "contentlayer2/source-files";

// Tags represent a category / tag page with a title and a body.
export const Tag = defineDocumentType(() => ({
  name: "Tag",
  filePathPattern: "tags/*.md",
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
  },
  computedFields: {},
}));
