import { defineDocumentType } from "contentlayer/source-files";

// Daily are short TIL notes.
export const Daily = defineDocumentType(() => ({
    name: "Daily",
    filePathPattern: `daily/*.md`,
    contentType: "mdx",
    fields: {
      title: {
        required: false,
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
