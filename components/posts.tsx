import Link from 'next/link'
import DateFormatter from './date-formatter'
import { Post } from '../lib/posts'

type Props = {
  posts: Array<Post>
}

const Posts = ({ posts }: Props) => {
  return (
    <section>
      <ul>
        {posts.map((post) => (
          <li className="mb-8 md:my-14" key={`${post.slug}`}>
            <div className="flex flex-col md:flex-row justify-between items-baseline">
              <h3 className="text-2xl mb-2 leading-snug tracking-tight font-semibold">
                <Link href={`/posts/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>
              <div className="text-md whitespace-nowrap text-blue-700">
                <DateFormatter dateString={post.date} />
              </div>
            </div>
            <p className="text-md leading-relaxed">
              {post.excerpt}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Posts
