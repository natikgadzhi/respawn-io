import fs from 'fs'
import { join } from 'path'
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
export function getPostFiles(): Array<string> {
  return fs.readdirSync(postsDirectory)
}

export function getPostFromFile(filename: string): Post {
  const fullPath = join(postsDirectory, filename)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    content,
    date: data.date
  }
}

export function getAllPosts(): Array<Post> {
  const files = getPostFiles()
  const posts = files
    .map((file) => getPostFromFile(file))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}

export function getPostBySlug(slug: string): Post {
  const posts = getAllPosts()
  return posts.find((post) => post.slug === slug)
}
