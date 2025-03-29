import type { Post } from "contentlayer/generated";
import { format, parseISO } from "date-fns";
import Link from "next/link";

type PostsListProps = {
  posts: Array<Post>;
};

type PostDescriptionProps = {
  post: Post;
};

// Safely render the post description without MDX
export const PostDescription = ({ post }: PostDescriptionProps) => {
  // For debugging purposes only
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`Rendering description for post: ${post.slug}`);
  }
  
  // Use the computed rawExcerpt which should already be stripped of markdown
  if (post.rawExcerpt) {
    return <p>{post.rawExcerpt}</p>;
  }
  
  // Fallback to raw excerpt if available
  if (post.excerpt && typeof post.excerpt === 'object' && post.excerpt.raw) {
    return <p>{post.excerpt.raw}</p>;
  }
  
  // Last resort fallback
  if (typeof post.excerpt === 'string') {
    return <p>{post.excerpt}</p>;
  }
  
  return <p>No excerpt available</p>;
};

// Safely render the post title without MDX
const PostTitle = ({ post }: PostDescriptionProps) => {
  // For debugging purposes only
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log(`Rendering title for post: ${post.slug}`);
  }
  
  // Use formattedTitle if available (which should be a string)
  if (post.formattedTitle) {
    return <>{post.formattedTitle}</>;
  }
  
  // Fallback to raw title if available
  if (post.title && typeof post.title === 'object' && post.title.raw) {
    return <>{post.title.raw}</>;
  }
  
  // Last resort fallback
  if (typeof post.title === 'string') {
    return <>{post.title}</>;
  }
  
  return <>Untitled</>;
};

export const PostsList = ({ posts }: PostsListProps) => {
  return (
    <section className="mt-6 md:mt-8">
      <ul className="post-list space-y-8 md:space-y-12">
        {posts.map((post) => (
          <li className="post-item" key={`${post.slug}`}>
            <div className="flex flex-col gap-1 md:flex-row md:gap-0 md:justify-between md:items-baseline">
              <h3 className="text-lg lg:text-xl font-chonkymedium leading-snug tracking-tight md:mr-4">
                <Link href={post.url}>
                  <PostTitle post={post} />
                </Link>
              </h3>
              <time 
                dateTime={post.created} 
                className="text-sm lg:text-base text-blue-700 dark:text-sky-400 whitespace-nowrap"
              >
                {format(parseISO(post.created), "MMM do yyyy")}
              </time>
            </div>
            <div className="mt-1 md:mt-2 text-md md:text-base">
              <PostDescription post={post} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
