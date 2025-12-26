import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { config } from '../../../blog.config';
import { sortPostsByDate, getRawExcerpt } from '../../lib/content-utils';
import { titleCase } from '../../lib/titleCase';
import { markdownToHTML } from '../../../lib/markdownToHTML-astro';

export async function GET(context: APIContext) {
  const allPosts = await getCollection('posts');

  const posts = sortPostsByDate(
    allPosts.filter((post) => {
      // Exclude both drafts and work in progress posts from RSS
      return !post.data.draft && !post.data.workInProgress;
    })
  );

  const items = await Promise.all(
    posts.map(async (post) => {
      const formattedTitle = titleCase(post.data.title);
      const rawExcerpt = getRawExcerpt(post.data.excerpt);
      const content = await markdownToHTML(post);

      return {
        title: formattedTitle,
        description: rawExcerpt,
        content: content,
        link: `/posts/${post.id}/`,
        pubDate: post.data.created,
        author: config.author.email,
      };
    })
  );

  return rss({
    title: config.title,
    description: config.description,
    site: context.site || config.baseURL,
    items: items,
    customData: `<language>en-us</language>`,
  });
}
