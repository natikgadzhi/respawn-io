import { makeSource } from "contentlayer2/source-files";

import { rehypePlugins, remarkPlugins } from "./lib/unifiedPlugins";

import { Daily } from "./lib/daily.contentlayer";
import { Page } from "./lib/page.contentlayer";
import { Post } from "./lib/post.contentlayer";
import { Tag } from "./lib/tag.contentlayer";

export default makeSource({
  disableImportAliasWarning: true,
  contentDirPath: "content/",
  documentTypes: [Post, Page, Daily, Tag],
  mdx: {
    // @ts-ignore
    remarkPlugins: remarkPlugins,
    // @ts-ignore
    rehypePlugins: rehypePlugins,
  },
});
