import { compareDesc } from "date-fns";
import { allPosts } from "contentlayer/generated";

// Returns all posts, sorted by date, descending,
// and filtering out drafts.
export async function getPosts() {
  const env_name = process.env.ENV_NAME;
  const posts = allPosts
    .filter((post) => env_name == "localhost" || !post.draft)
    .sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));

  return posts;
}
