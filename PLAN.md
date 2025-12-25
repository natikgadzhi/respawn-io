# Plan: Remove Vercel Dependencies

This document outlines the migration plan to remove all Vercel platform dependencies from respawn.io and enable self-hosting via Docker.

## Current Vercel Dependencies

### 1. Analytics & Speed Insights
- **@vercel/analytics** (v1.6.1) - Page view and visitor tracking
- **@vercel/speed-insights** (v1.3.1) - Core Web Vitals monitoring

**Current usage in `app/layout.tsx`:**
```tsx
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
```

### 2. Deployment Configuration
- **vercel.json** - Build and install commands for Vercel
- **puppeteer-vercel.config.json** - Puppeteer Chrome path for Vercel environment
- **chrome-dependencies.txt** - System dependencies for Chrome on Vercel (Fedora/dnf)

### 3. OG Image Generation
- Uses `next/og` (Next.js built-in, NOT @vercel/og)
- Uses edge runtime (`export const runtime = "edge"`)
- **Note:** This works in standalone mode, no changes needed

### 4. Image Optimization
- Uses Next.js default image loader
- No Vercel-specific loader configured
- **Note:** Works with `sharp` in Docker, no changes needed

---

## Migration Plan

### Phase 1: Remove Vercel Analytics (Already Replaced)

**Status:** Counterscale is already integrated as an alternative

The site already uses [Counterscale](https://counterscale.dev/) - a privacy-friendly, self-hostable analytics solution running on Cloudflare. Configuration in `blog.config.ts`:

```ts
counterscale: {
  siteId: "respawn-io",
  url: "https://1ca90c7a.counterscale-a1l.pages.dev",
}
```

**Action:** Remove `@vercel/analytics` and `@vercel/speed-insights` packages and their usage.

For Core Web Vitals monitoring without Vercel:
- Counterscale can track basic performance metrics
- For detailed CWV monitoring, consider adding `web-vitals` library and sending to your analytics endpoint

### Phase 2: Remove Vercel Configuration Files

**Files to remove:**
- `vercel.json` - Vercel deployment configuration
- `puppeteer-vercel.config.json` - Vercel-specific Puppeteer paths

**File to keep:**
- `chrome-dependencies.txt` - Useful reference for Docker, but format needs updating for apt

### Phase 3: Create Docker Configuration

**New files:**
- `Dockerfile` - Multi-stage build for Next.js standalone
- `docker-compose.yml` - Easy local development and deployment
- `.dockerignore` - Optimize build context

**Docker strategy:**
1. Use multi-stage build for smaller image size
2. Build with `output: 'standalone'` in Next.js config
3. Include `sharp` for image optimization
4. No Puppeteer/Chrome needed (OG images use `next/og` which works standalone)

### Phase 4: Update Next.js Configuration

Add to `next.config.js`:
```js
output: 'standalone'
```

This enables:
- Standalone build output with all dependencies bundled
- Smaller Docker image (~100-150MB vs 1GB+)
- No need to copy `node_modules`

---

## Alternative Analytics Options

If you want to change from Counterscale in the future:

### Self-Hosted Options
1. **Plausible Analytics** - Privacy-friendly, self-hostable
2. **Umami** - Simple, self-hosted analytics
3. **Matomo** - Feature-rich, GDPR compliant
4. **GoatCounter** - Lightweight, open-source

### Third-Party Options
1. **Plausible Cloud** - Hosted version of Plausible
2. **Fathom Analytics** - Privacy-focused
3. **Simple Analytics** - No-cookie analytics

---

## Files Changed Summary

### Removed
- `vercel.json`
- `puppeteer-vercel.config.json`

### Modified
- `package.json` - Remove @vercel/* packages
- `app/layout.tsx` - Remove Vercel Analytics/SpeedInsights imports
- `next.config.js` - Add standalone output

### Added
- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`
- `PLAN.md` (this file)

---

## Running with Docker

After migration:

```bash
# Build the image
docker build -t respawn-io .

# Run the container
docker run -p 3000:3000 respawn-io

# Or use docker-compose
docker compose up
```

---

## Notes

- **OG Image Generation**: The `next/og` ImageResponse works in standalone mode. The edge runtime directive is a hint for deployment platforms but Next.js handles it appropriately in Node.js environments.

- **Image Optimization**: The Next.js image optimizer works with `sharp` which is included in the Docker image. Remote images from configured domains (giphy.com, respawn.io) will be optimized on-demand.

- **Static Assets**: The `public` folder and generated static files are copied to the standalone output.
