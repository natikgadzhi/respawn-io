
import { makeSource } from "contentlayer/source-files"

import { remarkPlugins, rehypePlugins } from "./lib/unifiedPlugins";

import { Post } from "./lib/post.contentlayer";
import { Page } from "./lib/page.contentlayer";
import { Daily } from "./lib/daily.contentlayer";

export default makeSource({
  disableImportAliasWarning: true,
  contentDirPath: "content/",
  documentTypes: [Post, Page, Daily],
  mdx: {
    // @ts-ignore
    remarkPlugins: remarkPlugins,
    // @ts-ignore
    rehypePlugins: rehypePlugins
  }
});
