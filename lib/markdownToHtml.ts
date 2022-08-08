import { remark } from 'remark'
import html from 'remark-html'
import wikilinks from 'remark-wiki-link'

import { config } from '../blog.config'

const hrefTemplate = (permalink: string) => `${config.baseURL}/posts/${permalink}`

const pageResolver = (name: string) => [name.split('/').slice(1).join('/').replace(/ /g, '_').toLowerCase()]


export default async function markdownToHtml(markdown:string): Promise<string> {
  const result = await remark()
    .use(html)
    .use(wikilinks, {
      pageResolver: pageResolver,
      hrefTemplate: hrefTemplate
    })
    .process(markdown)

  return result.toString()
}
