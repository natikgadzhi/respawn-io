import { format, parseISO } from "date-fns";
import { Post } from "contentlayer/generated";

import Link from "next/link";

type Props = {
  posts: Array<Post>;
};

const Posts = ({ posts }: Props) => {
  return (
    <section>
      <ul>
        {posts.map((post) => (
          <li className="mb-8 md:my-14" key={`${post.slug}`}>
            <div className="flex flex-col md:flex-row justify-between items-baseline">
              <h3 className="text-2xl mb-2 mr-2 leading-snug tracking-tight font-semibold">
                <Link href={post.url}>{post.title}</Link>
              </h3>
              <div className="text-md whitespace-nowrap text-blue-700 dark:text-sky-400">
                { format(parseISO(post.date), 'MMM do yyyy')}
              </div>
            </div>
            <p className="text-md leading-relaxed">{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Posts;
