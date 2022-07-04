import Link from 'next/link'
import DateFormatter from '../components/date-formatter'

export default function Posts({ posts }) {
  return (
    <section>
      <ul>
        {posts.map((post) => (
          <li className="mb-8" key={`${post.slug}`}>
            <div className="flex flex-col md:flex-row justify-between">
              <h3 className="text-2xl mb-3 leading-snug">
                <Link href={`/posts/${post.slug}`}>
                  <a className="hover:underline">{post.title}</a>
                </Link>
              </h3>
              <div className="text-sm text-en whitespace-nowrap mt-3 mh-2">
                <DateFormatter dateString={post.date} />
              </div>
            </div>
            <p className="text-md leading-relaxed mb-4">{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
