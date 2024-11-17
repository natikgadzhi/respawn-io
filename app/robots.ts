import { config } from 'blog.config'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    host: config.baseURL,
    sitemap: `${config.baseURL}/sitemap.xml`
  }
}
