import { remark } from 'remark'
import html from 'remark-html'
import wikilinks from 'remark-wiki-link'

import {config} from '../blog.config'

const template = (permalink) => `${config.baseURL}/posts/${permalink}`
const resolver = (name) => [name.split('/').slice(1).join('/').replace(/ /g, '_').toLowerCase()]

export default async function markdownToHtml(markdown) {
  const result = await remark()
    .use(html)
    .use(wikilinks, { pageResolver: resolver, hrefTemplate: template})
    .process(markdown)

  return result.toString()
}
