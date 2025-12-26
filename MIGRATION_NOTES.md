
---

## Problem 4: Docker Deployment Migration

The Dockerfile was configured for Next.js standalone build and needed to be updated for Astro's static site output.

### Changes Made

1. **Removed Next.js specific dependencies**:
   - Removed `libc6-compat` (Next.js specific)
   - Removed `build:content` step (Contentlayer)
   - Removed Next.js standalone server

2. **Updated build process**:
   - Build now runs `pnpm run build` which includes image copying and Astro build
   - Added bash installation for build scripts
   - Added Chromium dependencies for Puppeteer (mermaid and OG images)

3. **Replaced Node.js server with nginx**:
   - Changed from `node:alpine` + serve to `nginx:alpine`
   - Created `nginx.conf` with production-ready configuration
   - Enabled gzip compression
   - Added security headers (X-Frame-Options, X-Content-Type-Options, etc.)
   - Configured aggressive caching for static assets (1 year)
   - Set up proper content type handling

### Files Changed
- Modified: `Dockerfile` - Complete rewrite for Astro + nginx
- Added: `nginx.conf` - Production nginx configuration
- Modified: `.github/workflows/docker.yml` - Already configured correctly with SHA and latest tags

### Nginx Features
- **Compression**: gzip enabled for text files, minimum 1KB
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy
- **Caching**: 1 year for immutable assets, 1 hour for HTML
- **Clean URLs**: Handles `/path/` and `/path` correctly
- **Port**: Configurable via ENV (defaults to 3000)

### Testing
```bash
docker build -t respawn-io:astro .
docker run -d -p 4322:3000 respawn-io:astro
```

All pages verified working:
- ✅ Homepage (/)
- ✅ Blog posts (/posts/*)
- ✅ About page (/about/)
- ✅ Daily notes (/daily/)
- ✅ RSS feed (/rss/feed.xml)
- ✅ Tags pages (/tags/*)

---

## Migration Complete ✅

The migration from Next.js to Astro is now complete with all content issues resolved and production deployment configured.

### Summary of Changes
1. ✅ Fixed content collection directory conflicts
2. ✅ Migrated RSS feed generation to Astro
3. ✅ Fixed excalidraw embed paths
4. ✅ Fixed daily notes sorting (reverse chronological)
5. ✅ Updated Docker deployment with nginx
6. ✅ Added image centering in posts
7. ✅ Fixed about page content loading

### Production Ready
- Static site builds successfully (83 pages)
- All images optimized and served correctly
- RSS feed generates with full content
- Docker image uses production-grade nginx
- GitHub Actions workflow configured for automated builds

