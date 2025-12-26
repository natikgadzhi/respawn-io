import type { CollectionEntry } from 'astro:content';

export function getTagsWithCounts(posts: CollectionEntry<'posts'>[]) {
  const tagCounts = posts.reduce(
    (acc, post) => {
      if (!post.data.tags) return acc;

      post.data.tags.forEach((tag) => {
        const tagLower = tag.toLowerCase();
        acc[tagLower] = (acc[tagLower] || 0) + 1;
      });

      return acc;
    },
    {} as Record<string, number>,
  );

  return Object.entries(tagCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([tag, count]) => ({ tag, count }));
}

export function getPostsByTag(posts: CollectionEntry<'posts'>[], tagSlug: string): CollectionEntry<'posts'>[] {
  return posts.filter((post) =>
    post.data.tags.map((tagLabel) => tagLabel.toLowerCase()).includes(tagSlug.toLowerCase()),
  );
}
