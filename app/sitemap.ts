import { MetadataRoute } from 'next'
import { allPosts } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = allPosts
    .filter((post) => !post.draft)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return posts.map((post) => ({
    url: post.url,
    lastModified: new Date(post.modified),
    changeFrequency: 'daily'
  }));
}
