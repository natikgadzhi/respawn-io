/**
 * Visual + markup regression check: compares a set of pages on a preview
 * deployment against the production site.
 *
 * Usage: PREVIEW_URL=https://<hash>.respawn-io.pages.dev node --experimental-strip-types scripts/visual-diff.ts
 *
 * Screenshots both versions of each page, diffs them with pixelmatch, and
 * compares normalized HTML markup. Writes a markdown summary and per-page
 * artifacts (screenshots + visual diff) to OUT_DIR (default: visual-diff-report).
 *
 * Informational by design: always exits 0. Content-driven differences (a new
 * post on the preview shows up on index pages) are expected — a human reads
 * the report on the PR.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import pixelmatch from "pixelmatch";
import { chromium, type Page } from "playwright";
import { PNG } from "pngjs";

const PREVIEW_URL = process.env.PREVIEW_URL?.replace(/\/$/, "");
const PROD_URL = (process.env.PROD_URL ?? "https://respawn.io").replace(/\/$/, "");
const OUT_DIR = process.env.OUT_DIR ?? "visual-diff-report";

// Representative pages: each layout, plus posts exercising the trickier
// pipeline features (mermaid, excalidraw, images, callouts, code blocks).
const PAGES = [
  "/",
  "/about",
  "/daily",
  "/posts/contentlayer-mermaid-diagrams",
  "/posts/contentlayer-with-excalidraw",
  "/posts/the-natik-user-guide",
  "/posts/app-icons-in-swiftui",
  "/tags/astro",
];

const VIEWPORT = { width: 1280, height: 720 };
// Pixel color distance threshold for pixelmatch (0-1); 0.1 is the usual default.
const PIXEL_THRESHOLD = 0.1;
// Pages whose visual diff exceeds this fraction of pixels get flagged and a diff image.
const FLAG_RATIO = 0.0002;

interface PageResult {
  path: string;
  pixelDiffRatio: number;
  markupChangedLines: number;
  markupTotalLines: number;
  error?: string;
}

function slugify(pagePath: string): string {
  return pagePath === "/" ? "home" : pagePath.replace(/^\//, "").replace(/\//g, "-");
}

/** Normalize built HTML so hashed asset names and version strings don't count as changes. */
function normalizeMarkup(html: string): string[] {
  return html
    .replace(/\/_astro\/[\w.-]+\.(js|css|webp|png|jpg|svg|woff2)/g, "/_astro/ASSET")
    .replace(/<meta name="generator"[^>]*>/g, "")
    .replace(/astro-[a-z0-9]{8}/g, "astro-SCOPE")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/** Count lines whose occurrence differs between the two documents. */
function countChangedLines(a: string[], b: string[]): number {
  const counts = new Map<string, number>();
  for (const line of a) counts.set(line, (counts.get(line) ?? 0) + 1);
  for (const line of b) counts.set(line, (counts.get(line) ?? 0) - 1);
  let changed = 0;
  for (const count of counts.values()) changed += Math.abs(count);
  return changed;
}

async function screenshot(page: Page, url: string): Promise<Buffer> {
  await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
  // Let fonts and any late layout settle.
  await page.waitForTimeout(500);
  return page.screenshot({ fullPage: true, animations: "disabled" });
}

/** Pad both images to the same dimensions so pixelmatch can compare them. */
function padToMatch(a: PNG, b: PNG): { a: PNG; b: PNG } {
  const width = Math.max(a.width, b.width);
  const height = Math.max(a.height, b.height);
  const pad = (src: PNG): PNG => {
    if (src.width === width && src.height === height) return src;
    const out = new PNG({ width, height, fill: true });
    out.data.fill(255);
    PNG.bitblt(src, out, 0, 0, src.width, src.height, 0, 0);
    return out;
  };
  return { a: pad(a), b: pad(b) };
}

async function comparePage(page: Page, pagePath: string): Promise<PageResult> {
  const slug = slugify(pagePath);

  const prodShot = await screenshot(page, `${PROD_URL}${pagePath}`);
  const previewShot = await screenshot(page, `${PREVIEW_URL}${pagePath}`);

  const { a: prodPng, b: previewPng } = padToMatch(PNG.sync.read(prodShot), PNG.sync.read(previewShot));
  const { width, height } = prodPng;
  const diffPng = new PNG({ width, height });
  const diffPixels = pixelmatch(prodPng.data, previewPng.data, diffPng.data, width, height, {
    threshold: PIXEL_THRESHOLD,
  });
  const pixelDiffRatio = diffPixels / (width * height);

  const [prodHtml, previewHtml] = await Promise.all(
    [`${PROD_URL}${pagePath}`, `${PREVIEW_URL}${pagePath}`].map(async (url) => {
      const res = await fetch(url);
      return res.text();
    }),
  );
  const prodLines = normalizeMarkup(prodHtml);
  const previewLines = normalizeMarkup(previewHtml);
  const markupChangedLines = countChangedLines(prodLines, previewLines);

  if (pixelDiffRatio > FLAG_RATIO) {
    fs.writeFileSync(path.join(OUT_DIR, `${slug}.prod.png`), PNG.sync.write(prodPng));
    fs.writeFileSync(path.join(OUT_DIR, `${slug}.preview.png`), PNG.sync.write(previewPng));
    fs.writeFileSync(path.join(OUT_DIR, `${slug}.diff.png`), PNG.sync.write(diffPng));
  }

  return {
    path: pagePath,
    pixelDiffRatio,
    markupChangedLines,
    markupTotalLines: Math.max(prodLines.length, previewLines.length),
  };
}

async function main(): Promise<void> {
  if (!PREVIEW_URL) {
    console.error("PREVIEW_URL environment variable is required");
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // CHROMIUM_PATH lets local environments point at a system Chromium instead
  // of the Playwright-managed download.
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
  const page = await browser.newPage({ viewport: VIEWPORT, reducedMotion: "reduce" });

  const results: PageResult[] = [];
  for (const pagePath of PAGES) {
    try {
      results.push(await comparePage(page, pagePath));
      console.log(`compared ${pagePath}`);
    } catch (e) {
      results.push({
        path: pagePath,
        pixelDiffRatio: Number.NaN,
        markupChangedLines: 0,
        markupTotalLines: 0,
        error: (e as Error).message.slice(0, 200),
      });
      console.error(`failed ${pagePath}: ${(e as Error).message.slice(0, 200)}`);
    }
  }

  await browser.close();

  const lines = [
    `Comparing preview (${PREVIEW_URL}) against production (${PROD_URL}).`,
    "",
    "| Page | Pixel diff | Markup lines changed | |",
    "|---|---|---|---|",
  ];
  for (const r of results) {
    if (r.error) {
      lines.push(`| \`${r.path}\` | — | — | ⚠️ ${r.error} |`);
      continue;
    }
    const pct = (r.pixelDiffRatio * 100).toFixed(2);
    const flag = r.pixelDiffRatio > FLAG_RATIO || r.markupChangedLines > 0 ? "👀" : "✅";
    lines.push(`| \`${r.path}\` | ${pct}% | ${r.markupChangedLines} of ~${r.markupTotalLines} | ${flag} |`);
  }
  lines.push(
    "",
    "Pages flagged 👀 have screenshots and a visual diff in the workflow artifact.",
    "Content differences (e.g. a new post appearing on index pages) are expected to flag — use judgment.",
  );

  const summary = lines.join("\n");
  fs.writeFileSync(path.join(OUT_DIR, "summary.md"), summary);
  console.log(`\n${summary}`);
}

await main();
