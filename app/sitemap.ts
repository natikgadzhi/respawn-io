import { allDailies, allPosts } from "contentlayer/generated";
import { compareDesc } from "date-fns";
import type { MetadataRoute } from "next";
import { getTagsWithCounts } from "lib/tagHelpers";

import { config } from "blog.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = allPosts
    .filter((post) => !post.draft)
    .sort((a, b) => compareDesc(new Date(a.created), new Date(b.created)));

  const daily = allDailies
    .filter((d) => !d.draft)
    .sort((a, b) => compareDesc(new Date(a.slug), new Date(b.slug)));

  const tags = getTagsWithCounts(posts);

  const index = [
    {
      url: config.baseURL,
      lastModified: new Date(posts[0].modified),
      changeFrequency: "daily",
    },
    {
      url: `${config.baseURL}/daily`,
      lastModified: new Date(daily[0].slug),
      changeFrequency: "daily",
    },
    {
      url: `${config.baseURL}/about`,
      lastModified: new Date(posts[0].modified),
      changeFrequency: "daily",
    },
  ];

  // @ts-ignore: Type 'string' is not assignable to type '"always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"'.
  const withPosts = index.concat(
    posts.map((post) => ({
      url: post.absoluteURL,
      lastModified: new Date(post.modified),
      changeFrequency: "daily",
    })),
  );

  // @ts-ignore
  const withTags = withPosts.concat(
    tags.map((tag) => ({
      url: `${config.baseURL}/tags/${tag.tag}`,
      lastModified: new Date(posts[0].modified ? posts[0].modified : posts[0].created),
      changeFrequency: "daily",
    })),
  );

  // @ts-ignore
  return withTags;
}
