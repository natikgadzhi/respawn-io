import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import wikilinks from 'remark-wiki-link'

import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'

import { config } from '../blog.config'

interface Post {
  slug: string,
  title: string,
  excerpt: string,
  content: string,
  date: Date
  modified: Date
}

const postsDirectory = join(process.cwd(), '_posts')
const hrefTemplate = (permalink: string) => `${config.baseURL}/posts/${permalink}`
const pageResolver = (name: string) => [name.split('/').slice(1).join('/').replace(/ /g, '_').toLowerCase()]



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
    date: data.date.toISOString().slice(0, 10),
    modified: data.modified.toISOString().slice(0, 10),
    slug: slug
  }
}

export function getAllPosts(): Array<Post> {
  const slugs = getPostSlugs()
  const posts = slugs
    .map((file) => getPostBySlug(file))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
  return posts
}


export async function getPostMDXSource(source: string): Promise<MDXRemoteSerializeResult> {
  const compiledMDX = await serialize(source, {
    mdxOptions: {
      remarkPlugins: [
        [wikilinks, {pageResolver, hrefTemplate}]
      ],
    }
  })
  return compiledMDX
}
