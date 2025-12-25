# Migration Plan: Next.js → Astro

## Executive Summary

**Recommendation: Migrate to Astro**

After analyzing the current Next.js implementation, Astro is the optimal choice because:

1. **Near-zero changes to content processing** - Can reuse the entire unified/remark/rehype plugin pipeline
2. **Content Collections API** - Direct replacement for Contentlayer with better TypeScript support
3. **Built for static sites** - Simpler than Next.js without unnecessary framework overhead
4. **Build-time flexibility** - Can run Puppeteer scripts for OG images and RSS generation
5. **Same URL structure** - File-based routing maintains existing URLs
6. **Better performance** - Smaller JS bundles, faster builds, optional hydration

## Current State Analysis

### What Next.js Provides (That We Don't Need)

- ❌ Server-side rendering (SSR) - Everything is static
- ❌ API routes - No backend needed
- ❌ React Server Components - Pure static content
- ❌ Image optimization CDN - Can use Astro's built-in Sharp integration
- ❌ Edge runtime - No dynamic behavior
- ❌ Incremental Static Regeneration - Content only changes at build time

### What We Actually Use

- ✅ Static Site Generation (SSG)
- ✅ File-based routing
- ✅ Metadata/SEO management
- ✅ MDX processing
- ✅ Build-time scripts (OG images, RSS)
- ✅ Image optimization

**Conclusion**: Next.js is significant overkill. We're using ~20% of its features.

---

## Why Not Hugo or Jekyll?

### Hugo
**Pros**: Blazing fast, single binary, no JavaScript
**Cons**:
- Go templates vs familiar JSX-like syntax
- Wikilinks need custom Hugo hooks (more complex)
- Mermaid/Excalidraw require complete rewrite (no unified ecosystem)
- OG image generation difficult (no native Puppeteer support in Go)
- Less flexible markdown processing

**Verdict**: Would require rewriting all custom markdown processing. Migration effort: **HIGH**

### Jekyll
**Pros**: Simple, mature, Ruby ecosystem
**Cons**:
- Ruby dependency (less common in modern tooling)
- Slower builds than Hugo or Astro
- Plugin ecosystem less active
- Would still need to rewrite unified plugins to Ruby
- OG images still need external tooling

**Verdict**: Would require rewriting plugins. Migration effort: **HIGH**

### Why Astro Wins

| Feature | Next.js | Astro | Hugo | Jekyll |
|---------|---------|-------|------|--------|
| **Unified plugins** | ✅ Native | ✅ Native | ❌ Rewrite | ❌ Rewrite |
| **Wikilinks** | ✅ remark-wiki-link | ✅ Same plugin | ⚠️ Custom hook | ⚠️ Custom plugin |
| **Mermaid** | ✅ Rehype plugin | ✅ Same plugin | ⚠️ Shortcode | ⚠️ Custom plugin |
| **OG Images** | ✅ Puppeteer script | ✅ Same script | ❌ Complex | ❌ Complex |
| **RSS** | ✅ Custom script | ✅ Built-in + script | ✅ Built-in | ✅ Built-in |
| **TypeScript** | ✅ Full | ✅ Full | ❌ N/A | ❌ N/A |
| **Content Collections** | ✅ Contentlayer | ✅ Native API | ⚠️ Archetypes | ⚠️ Collections |
| **Build complexity** | 🔴 High | 🟢 Medium | 🟢 Low | 🟡 Medium |
| **Migration effort** | N/A | 🟢 Low | 🔴 High | 🔴 High |
| **Bundle size** | 🔴 ~250KB | 🟢 ~5KB | 🟢 0KB | 🟢 0KB |
| **Build speed** | 🟡 Medium | 🟢 Fast | 🟢 Very fast | 🔴 Slow |

---

## Migration Strategy

### Phase 1: Preparation & Setup (Day 1)

**1.1 Create Astro Project**
```bash
npm create astro@latest astro-migration -- --template minimal --typescript strictest
cd astro-migration
```

**1.2 Install Dependencies**
```bash
npm install -D \
  @astrojs/mdx \
  @astrojs/sitemap \
  unified \
  remark-gfm \
  remark-wiki-link \
  remark-figure-caption \
  remark-callouts \
  remark-embed-images \
  rehype-mermaid \
  shiki \
  @shikijs/rehype \
  @mermaid-js/mermaid-cli \
  puppeteer \
  feed \
  sharp
```

**1.3 Configure Astro**
Create `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { remarkPlugins, rehypePlugins } from './lib/unifiedPlugins';

export default defineConfig({
  site: 'https://respawn.io',
  integrations: [
    mdx(),
    sitemap()
  ],
  markdown: {
    remarkPlugins,
    rehypePlugins,
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      }
    }
  }
});
```

### Phase 2: Content Migration (Day 1-2)

**2.1 Copy Content Files**
```bash
# No changes needed - content stays the same!
cp -r content/ astro-migration/src/content/
```

**2.2 Define Content Collections**
Create `src/content/config.ts`:
```typescript
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    created: z.date(),
    modified: z.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    workInProgress: z.boolean().default(false),
    meta_description: z.string().optional(),
    og_image_hide_description: z.boolean().default(false)
  })
});

const daily = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    tags: z.array(z.string()).default([]),
    created: z.date(),
    modified: z.date().optional(),
    draft: z.boolean().default(false)
  })
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional()
  })
});

const tags = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string()
  })
});

export const collections = { posts, daily, pages, tags };
```

**Benefits over Contentlayer**:
- Native Astro feature (no extra package)
- Better TypeScript inference
- Simpler configuration
- Faster builds

### Phase 3: Markdown Processing (Day 2)

**3.1 Copy Unified Plugins**
```bash
# Copy existing plugins with minimal changes
cp lib/unifiedPlugins.ts astro-migration/lib/
cp lib/rehypeMermaid.ts astro-migration/lib/
cp lib/rehypeExcalidraw.ts astro-migration/lib/
cp lib/markdownToHTML.ts astro-migration/lib/
```

**Changes needed**: None! These are framework-agnostic.

**3.2 Verify Plugin Compatibility**
- ✅ `remark-wiki-link` - Works as-is
- ✅ `rehypeMermaid` - Works as-is
- ✅ `rehypeExcalidraw` - Works as-is
- ✅ `@shikijs/rehype` - Works as-is

### Phase 4: Routing & Pages (Day 2-3)

**4.1 Homepage**
`src/pages/index.astro`:
```astro
---
import { getCollection } from 'astro:content';
import Layout from '../layouts/Layout.astro';

const posts = (await getCollection('posts'))
  .filter(p => !p.data.draft && !p.data.workInProgress)
  .sort((a, b) => b.data.created - a.data.created);

const allTags = [...new Set(posts.flatMap(p => p.data.tags))];
---

<Layout title="Respawn.io">
  <div class="posts">
    {posts.map(post => (
      <article>
        <h2><a href={`/posts/${post.slug}`}>{post.data.title}</a></h2>
        <time>{post.data.created.toLocaleDateString()}</time>
        <p>{post.data.excerpt}</p>
      </article>
    ))}
  </div>

  <aside class="tags">
    {allTags.map(tag => (
      <a href={`/tags/${tag}`}>#{tag}</a>
    ))}
  </aside>
</Layout>
```

**4.2 Dynamic Post Pages**
`src/pages/posts/[slug].astro`:
```astro
---
import { getCollection } from 'astro:content';
import Layout from '../../layouts/Layout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post }
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<Layout
  title={post.data.title}
  description={post.data.excerpt}
  ogImage={`/og-images/${post.slug}.png`}
>
  <article>
    <h1>{post.data.title}</h1>
    <time>{post.data.created.toLocaleDateString()}</time>
    <Content />
  </article>
</Layout>
```

**4.3 Daily Notes**
`src/pages/daily/[slug].astro` - Similar pattern

**4.4 Tag Pages**
`src/pages/tags/[slug].astro` - Similar pattern

**4.5 About Page**
`src/pages/about.astro` - Static page

**URL Structure**: Identical to current Next.js setup ✅

### Phase 5: Build Scripts (Day 3)

**5.1 OG Images**
Copy existing script with minor path adjustments:
```bash
cp scripts/og-images.ts astro-migration/scripts/
```

Update to use Astro's content collections:
```typescript
import { getCollection } from 'astro:content';

const posts = await getCollection('posts');
// Rest stays the same
```

**5.2 RSS Feeds**
Astro has built-in RSS support, but we can enhance it:

`src/pages/rss.xml.ts`:
```typescript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { markdownToHTML } from '../lib/markdownToHTML';

export async function GET(context) {
  const posts = (await getCollection('posts'))
    .filter(p => !p.data.draft && !p.data.workInProgress)
    .sort((a, b) => b.data.created - a.data.created);

  return rss({
    title: 'Respawn.io',
    description: 'Your description',
    site: context.site,
    items: await Promise.all(posts.map(async post => ({
      title: post.data.title,
      description: post.data.excerpt,
      link: `/posts/${post.slug}`,
      pubDate: post.data.created,
      content: await markdownToHTML(post.body)
    })))
  });
}
```

For Atom and JSON feeds, keep the existing script:
```bash
cp scripts/rss.ts astro-migration/scripts/
```

**5.3 Update Build Command**
`package.json`:
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "npm run copy-images && npm run og-images && astro build && npm run rss",
    "copy-images": "./scripts/copy-images.sh",
    "og-images": "tsx scripts/og-images.ts",
    "rss": "tsx scripts/rss.ts"
  }
}
```

### Phase 6: Styling & Components (Day 3-4)

**6.1 Copy Styles**
```bash
cp -r styles/ astro-migration/src/styles/
```

Astro supports:
- CSS files (import in components)
- Scoped CSS (`<style>` in `.astro` files)
- Sass/Less (with integration)

**6.2 Convert React Components to Astro**

**Before (React)**:
```tsx
// components/Header.tsx
export default function Header() {
  return (
    <header>
      <nav>...</nav>
    </header>
  );
}
```

**After (Astro)**:
```astro
<!-- components/Header.astro -->
<header>
  <nav>...</nav>
</header>
```

**For interactive components**: Use Astro Islands with React
```astro
---
import { ThemeToggle } from './ThemeToggle.tsx';
---

<ThemeToggle client:load />
```

Most components won't need interactivity.

### Phase 7: SEO & Metadata (Day 4)

**7.1 Layout with Metadata**
`src/layouts/Layout.astro`:
```astro
---
interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}

const { title, description, ogImage } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <link rel="canonical" href={canonicalURL} />

    <title>{title}</title>
    {description && <meta name="description" content={description} />}

    <!-- OpenGraph -->
    <meta property="og:title" content={title} />
    <meta property="og:type" content="article" />
    <meta property="og:url" content={canonicalURL} />
    {ogImage && <meta property="og:image" content={ogImage} />}

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    {ogImage && <meta name="twitter:image" content={ogImage} />}
  </head>
  <body>
    <slot />
  </body>
</html>
```

**7.2 Sitemap**
Already configured via `@astrojs/sitemap` integration.

**7.3 Robots.txt**
`public/robots.txt` - Static file (same as current)

### Phase 8: Images (Day 4)

**8.1 Image Component**
Astro has built-in image optimization:

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/image.png';
---

<Image src={myImage} alt="Description" />
```

For markdown images, Astro auto-optimizes them!

**8.2 Copy Images**
```bash
# Same script as current
cp scripts/copy-images.sh astro-migration/scripts/
```

### Phase 9: Testing & Validation (Day 5)

**9.1 Build & Compare**
```bash
npm run build
```

**9.2 Verify Output**
- [ ] All posts render correctly
- [ ] Wikilinks resolve
- [ ] Mermaid diagrams appear
- [ ] Excalidraw drawings appear
- [ ] Tags pages work
- [ ] Daily notes work
- [ ] RSS feeds generated
- [ ] OG images generated
- [ ] Sitemap exists
- [ ] URLs match exactly

**9.3 Performance Comparison**

Test with Lighthouse:
```bash
# Next.js
npm run build
# Check: dist size, build time, Lighthouse score

# Astro
npm run build
# Check: dist size, build time, Lighthouse score
```

Expected improvements:
- 📦 Bundle size: 250KB → 5-20KB
- ⚡ First Load: ~1s → ~200ms
- 🏗️ Build time: Similar or faster

### Phase 10: Deployment (Day 5)

**10.1 Update Docker**
`Dockerfile`:
```dockerfile
FROM node:20-alpine AS build

WORKDIR /app

# Install system dependencies (for Puppeteer)
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production
FROM node:20-alpine
WORKDIR /app

COPY --from=build /app/dist ./dist

RUN npm install -g http-server

EXPOSE 3000
CMD ["http-server", "dist", "-p", "3000"]
```

**10.2 CI/CD**
Update build commands in CI (GitHub Actions, etc.):
```yaml
- run: npm ci
- run: npm run build
```

---

## Migration Checklist

### Pre-Migration
- [ ] Backup current site (git tag)
- [ ] Document current URLs (for redirect validation)
- [ ] Test current build locally

### Migration
- [ ] Create Astro project
- [ ] Install dependencies
- [ ] Configure Astro + markdown plugins
- [ ] Define content collections
- [ ] Copy content files
- [ ] Copy unified plugins
- [ ] Create page routes
- [ ] Copy build scripts
- [ ] Update build scripts for Astro APIs
- [ ] Copy and adapt components
- [ ] Copy styles
- [ ] Create layouts
- [ ] Test OG image generation
- [ ] Test RSS generation
- [ ] Test Mermaid rendering
- [ ] Test Excalidraw rendering
- [ ] Test wikilinks
- [ ] Verify all URLs match
- [ ] Update Dockerfile
- [ ] Update CI/CD

### Post-Migration
- [ ] Performance audit (Lighthouse)
- [ ] Link validation (check for 404s)
- [ ] RSS feed validation
- [ ] Search Console (verify sitemap)
- [ ] Monitor analytics for drops

---

## Risk Assessment

### Low Risk ✅
- Content files (unchanged)
- Unified plugins (framework-agnostic)
- Build scripts (minimal changes)
- URL structure (maintained)

### Medium Risk ⚠️
- Component conversion (React → Astro)
  - *Mitigation*: Most components are presentational
- Styling migration
  - *Mitigation*: CSS is portable
- Content Collections API
  - *Mitigation*: Similar to Contentlayer, better typed

### High Risk ⚠️⚠️
- Build script integration
  - *Mitigation*: Test OG images and RSS early
- Image optimization differences
  - *Mitigation*: Astro's is simpler

---

## Expected Outcomes

### Benefits
1. **Simpler codebase**: Remove Next.js complexity
2. **Faster builds**: Less framework overhead
3. **Smaller bundles**: ~95% reduction in JS
4. **Better performance**: Less JavaScript to parse
5. **Easier maintenance**: Purpose-built for static sites
6. **Better DX**: Content Collections API is excellent

### Trade-offs
1. **Learning curve**: Team needs to learn Astro (minimal)
2. **Migration time**: ~5 days estimated
3. **Testing**: Need comprehensive validation

### Estimated Timeline
- **Planning**: 1 day (done!)
- **Migration**: 3-4 days
- **Testing**: 1-2 days
- **Total**: ~1 week

---

## Alternative: Stay with Next.js

If you prefer to keep Next.js but simplify:

1. Remove Contentlayer (use `fs` + gray-matter directly)
2. Remove unused Next.js features
3. Simplify build pipeline

**But**: You'd still have framework overhead for a static site.

---

## Recommendation

**Proceed with Astro migration.**

The minimal changes to content processing, combined with significant simplification of the framework layer, make this a low-risk, high-reward migration.

Next steps:
1. Create parallel Astro branch
2. Implement Phase 1-3 (setup + content)
3. Test markdown processing
4. If successful, continue to components
5. Keep Next.js as fallback until validation complete
