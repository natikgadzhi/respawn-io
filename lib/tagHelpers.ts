import { type Tag, allTags } from "contentlayer/generated";
import { type Post, allPosts } from "contentlayer/generated";

export function getTagByName(tagName: String): Tag {
  return allTags.find((tag) => tag.title.toLocaleLowerCase() === tagName.toLowerCase());
}

export function getPostsByTag(tag: Tag): Array<Post> {
  return allPosts.filter((post) =>
    post.tags.map((tagLabel) => tagLabel.toLowerCase()).includes(tag.title.toLowerCase()),
  );
}

export function getTagsWithCounts(posts: Array<Post>) {
  const tagCounts = posts.reduce(
    (acc, post) => {
      if (!post.tags) return acc;

      post.tags.forEach((tag) => {
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
