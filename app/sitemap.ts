import { MetadataRoute } from 'next';
import { allPosts, allDailies } from 'contentlayer/generated';
import { compareDesc } from 'date-fns';

import { config } from 'blog.config';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = allPosts
    .filter((post) => !post.draft)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  const daily = allDailies
    .filter((d) => !d.draft)
    .sort((a, b) => compareDesc(new Date(a.slug), new Date(b.slug)));

  const index = [
    {
      url: config.baseURL,
      lastModified: new Date(posts[0].modified),
      changeFrequency: 'daily'
    },
    {
      url: `${config.baseURL}/daily`,
      lastModified: new Date(daily[0].slug),
      changeFrequency: 'daily'
    }
  ];

  return index.concat(posts.map((post) => ({
    url: post.absoluteURL,
    lastModified: new Date(post.modified),
    changeFrequency: 'daily'
  })));
}
