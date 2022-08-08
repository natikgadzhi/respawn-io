import fs from 'fs'
import path, { join } from 'path'
import matter from 'gray-matter'

const postsDirectory = join(process.cwd(), '_posts')

interface Post {
  slug: string,
  title: string,
  excerpt: string,
  content: string,
  date: Date
}

// returns an array of posts file names
export function getPostSlugs(): Array<string> {
  return fs.readdirSync(postsDirectory)
    .map(path => path.replace(/\.md$/, ''))
}

export function getPostBySlug(slug: string): Post {
  const fullPath = join(postsDirectory, slug + '.md')
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    title: data.title,
    excerpt: data.excerpt,
    content: content,
    date: data.date,
    slug: slug,
    ...data
  }
}

export function getAllPosts(): Array<Post> {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((file) => getPostBySlug(file))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}
