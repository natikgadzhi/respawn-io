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

export const PostsList = ({ posts }: PostsListProps) => {
  return (
    <section>
      <ul className="post-list">
        {posts.map((post) => (
          <li className="post-item mb-8 md:my-14" key={`${post.slug}`}>
            <div className="flex flex-col md:flex-row justify-between items-baseline">
              <h3 className="text-lg lg:text-xl mb-2 mr-2 leading-snug tracking-tight font-chonkymedium">
                <Link href={post.url}>{post.formattedTitle}</Link>
              </h3>
              <div className="text-md whitespace-nowrap text-blue-700 dark:text-sky-400">
                {format(parseISO(post.created), "MMM do yyyy")}
              </div>
            </div>
            <PostDescription post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
};
