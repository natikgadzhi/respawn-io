// Provides a utility function to convert a markdown to HTML, 
// without MDX component support

import { resolve } from 'path';

import { VFile } from 'vfile';

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkEmbedImages from "remark-embed-images";

import { remarkPlugins, rehypePlugins } from './unifiedPlugins';

import { type Post } from 'contentlayer/generated';

const wrapInArticle = (html: string) => `<article>${html}</article>`;

export async function markdownToHTML(post: Post) {
  const processor = unified();
  const plugins = [
    remarkParse,
    remarkEmbedImages,
    ...remarkPlugins,
    remarkRehype,
    ...rehypePlugins,
    rehypeStringify,
  ];

  plugins.forEach((plugin) => {
    if (Array.isArray(plugin)) {
      processor.use(plugin[0], plugin[1]);
    } else {
      // @ts-ignore
      processor.use(plugin);
    }
  });

  const file = new VFile({
    value: post.body.raw,
    path: resolve("content", post._raw.sourceFilePath),
    dirname: resolve("content", post._raw.sourceFileDir)
  });

  // @ts-ignore
  const result = await processor.process(file);
  // @ts-ignore
  return wrapInArticle(result.value.toString());
}



