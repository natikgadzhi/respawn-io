import { defineDocumentType } from "contentlayer2/source-files";

// Page is a simple type to hold the content
// of a page. Currently used in `/about`.
export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: "pages/*.md",
  contentType: "mdx",
}));
