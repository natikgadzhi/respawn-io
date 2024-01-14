// Provides a utility function to convert a markdown to HTML, 
// without MDX component support

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

import { unifiedPlugins } from './unifiedPlugins';

const wrapInArticle = (html: string) => `<article>${html}</article>`;

export async function markdownToHTML(markdown: string) {
  const processor = unified();
  const plugins = [remarkParse, remarkRehype,...unifiedPlugins, rehypeStringify];

  plugins.forEach(plugin => {
    if(Array.isArray(plugin)) {
      processor.use(plugin[0], plugin[1]);
    } else {
      // @ts-ignore
      processor.use(plugin);
    }
  });

  const result = await processor.process(markdown);
  return wrapInArticle(result.toString());
}


