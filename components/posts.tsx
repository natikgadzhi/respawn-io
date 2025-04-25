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
  // Group posts by year
  const postsByYear = posts.reduce<Record<string, Post[]>>((acc, post) => {
    const year = parseISO(post.created).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {});

  // Sort years in descending order
  const sortedYears = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <section className="mt-6 md:mt-8">
      {sortedYears.map((year) => (
        <div key={year} className="mb-16">
          <h2 className="text-2xl font-extrabold tracking-tighter mb-6">{year}</h2>
          <ul className="post-list space-y-8 md:space-y-12">
            {postsByYear[year].map((post) => (
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
                <div className="mt-0.5 md:mt-0 text-md md:text-base">
                  <PostDescription post={post} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};
