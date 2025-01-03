import type { Post } from "contentlayer/generated";
import { format, parseISO } from "date-fns";
import { mdxComponents } from "lib/mdxComponents";
import { getMDXComponent } from "next-contentlayer2/hooks";
import Link from "next/link";

type PostsListProps = {
  posts: Array<Post>;
};

type PostDescriptionProps = {
  post: Post;
};

export const PostDescription = ({ post }: PostDescriptionProps) => {
  const MDXContent = getMDXComponent(post.excerpt.code);
  return <MDXContent components={mdxComponents} />;
};

const PostTitle = ({ post }: PostDescriptionProps) => {
  const MDXContent = getMDXComponent(post.title.code);
  return <MDXContent components={mdxComponents} />;
};

export const PostsList = ({ posts }: PostsListProps) => {
  return (
    <section className="mt-6 md:mt-8">
      <ul className="post-list space-y-8 md:space-y-12">
        {posts.map((post) => (
          <li className="post-item" key={`${post.slug}`}>
            <div className="flex flex-col gap-1 md:flex-row md:gap-0 md:justify-between md:items-baseline">
              <h3 className="text-xl md:text-2xl font-chonkymedium leading-snug tracking-tight md:mr-4">
                <Link href={post.url}>
                  <PostTitle post={post} />
                </Link>
              </h3>
              <time 
                dateTime={post.created} 
                className="text-sm md:text-base text-blue-700 dark:text-sky-400 whitespace-nowrap"
              >
                {format(parseISO(post.created), "MMM do yyyy")}
              </time>
            </div>
            <div className="mt-2 md:mt-3 text-base md:text-lg text-gray-600 dark:text-gray-300">
              <PostDescription post={post} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
