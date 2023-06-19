import { MetadataRoute } from 'next'
import { config } from 'blog.config'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    host: config.baseURL,
    sitemap: config.baseURL + '/sitemap.xml'
  }
}
