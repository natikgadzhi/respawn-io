# Migrate respawn.io to Cloudflare Pages

## Current state

- Astro static site, built with `pnpm run build`, output in `dist/`
- Docker image: node builder stage (with Playwright for mermaid + Puppeteer for OG images) → nginx:alpine serving static files
- CI: GitHub Actions builds Docker image on push to main, pushes to Docker Hub, creates deploy PR in homelab repo
- Served by nginx in K3s cluster with custom `nginx.conf` handling:
  - Clean URLs (`.html` → 301 redirect to clean path)
  - `/sitemap.xml` → `sitemap-index.xml` rewrite
  - Gzip compression
  - Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
  - Cache headers (1y for static assets, 1h for HTML)
  - 404 page
  - Hidden file blocking

## Target state

- Same Astro static build, deployed to Cloudflare Pages
- Build runs in GitHub Actions (not CF Pages build environment) because the build needs Playwright/Chromium for rehype-mermaid and Puppeteer for OG images
- Deploy to CF Pages via `wrangler pages deploy dist/`
- nginx.conf behavior replicated via `_headers` and `_redirects` files

## Implementation steps

### 1. Add `public/_redirects` file

Cloudflare Pages serves `_redirects` from the output directory. Since Astro copies `public/` into `dist/`, place it in `public/`.

```
/sitemap.xml /sitemap-index.xml 200
```

Note: CF Pages handles clean URLs natively (strips `.html`), so no redirect rules needed for that. CF Pages also serves `404.html` automatically.

### 2. Add `public/_headers` file

Replicate nginx security and cache headers:

```
/*
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin

/*.jpg
  Cache-Control: public, max-age=31536000, immutable
/*.jpeg
  Cache-Control: public, max-age=31536000, immutable
/*.png
  Cache-Control: public, max-age=31536000, immutable
/*.gif
  Cache-Control: public, max-age=31536000, immutable
/*.ico
  Cache-Control: public, max-age=31536000, immutable
/*.css
  Cache-Control: public, max-age=31536000, immutable
/*.js
  Cache-Control: public, max-age=31536000, immutable
/*.svg
  Cache-Control: public, max-age=31536000, immutable
/*.woff
  Cache-Control: public, max-age=31536000, immutable
/*.woff2
  Cache-Control: public, max-age=31536000, immutable
/*.webp
  Cache-Control: public, max-age=31536000, immutable
```

Note: CF handles gzip/brotli compression automatically.

### 3. Create Cloudflare Pages project

Create the project via wrangler CLI:

```bash
npx wrangler pages project create respawn-io --production-branch main
```

### 4. Add GitHub Actions workflow for CF Pages deploy

Create `.github/workflows/cloudflare-pages.yml` that:
1. Installs pnpm + dependencies
2. Installs Playwright Chromium (for mermaid rendering)
3. Runs `pnpm run build`
4. Deploys `dist/` to CF Pages via `wrangler pages deploy`

Requires these GitHub secrets:
- `CLOUDFLARE_ACCOUNT_ID`: `bf66d24a4833747eaf8249f8a9238470`
- `CLOUDFLARE_API_TOKEN`: needs Pages write permission

### 5. Keep existing Docker workflow (for now)

Don't remove the Docker build or homelab deploy workflow yet. Run both in parallel until DNS is pointed and the CF Pages deployment is verified. The Docker workflow can be removed later.

### 6. DNS cutover (manual)

Once CF Pages deployment is verified:
1. Point `respawn.io` and `natik.dev` DNS to Cloudflare Pages
2. Add custom domains in CF Pages dashboard
3. Verify the site works
4. Remove Docker workflow and homelab deployment
