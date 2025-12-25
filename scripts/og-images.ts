/**
 * Build-time OG Image Generator for Astro
 *
 * Generates static OG images for all posts using Puppeteer.
 * Images are saved to public/og-images/{slug}.png
 *
 * Usage: pnpm run og-images
 */

import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";
import { getCollection } from "astro:content";
import { config } from "../blog.config.ts";
import { titleCase } from "../src/lib/titleCase.ts";
import { getRawExcerpt, getPostAbsoluteUrl } from "../src/lib/content-utils.ts";

const OUTPUT_DIR = "./public/og-images";
const WIDTH = 1200;
const HEIGHT = 630;

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Generate the HTML template for an OG image
 */
function generateHTML(post: {
  formattedTitle: string;
  rawExcerpt: string;
  absoluteURL: string;
  og_image_hide_description?: boolean;
}): string {
  const showExcerpt = post.formattedTitle.length < 60 && !post.og_image_hide_description;
  const showURL = post.formattedTitle.length < 60;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    .container {
      width: 100%;
      height: 100%;
      background-color: #F9F5E9;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 48px 96px;
    }

    h1 {
      color: #000000;
      font-size: 72px;
      font-weight: 900;
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin-bottom: 32px;
      text-shadow: 0px 0px 3px rgba(0,0,0,0.1);
      word-break: break-word;
    }

    .excerpt {
      font-size: 36px;
      font-weight: 700;
      line-height: 1.4;
      color: #333;
      margin-top: 16px;
    }

    .footer {
      margin-top: auto;
      display: flex;
      justify-content: flex-end;
      align-items: baseline;
      width: 100%;
    }

    .url {
      font-size: 24px;
      color: #1d4ed8;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>${escapeHtml(post.formattedTitle)}</h1>
    ${showExcerpt ? `<p class="excerpt">${escapeHtml(post.rawExcerpt)}</p>` : ''}
    ${showURL ? `
    <div class="footer">
      <span class="url">${escapeHtml(post.absoluteURL)}</span>
    </div>
    ` : ''}
  </div>
</body>
</html>
`;
}

async function generateOGImages() {
  console.log("[OG Images] Starting generation...");

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Get all posts from Astro content collections
  const allPosts = await getCollection('posts');

  // Launch browser
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT });

  let generated = 0;
  let skipped = 0;

  for (const post of allPosts) {
    // Skip drafts
    if (post.data.draft) {
      console.log(`[OG Images] Skipping draft: ${post.slug}`);
      skipped++;
      continue;
    }

    const outputPath = path.join(OUTPUT_DIR, `${post.slug}.png`);

    // Check if image already exists (for incremental builds)
    if (fs.existsSync(outputPath)) {
      const stat = fs.statSync(outputPath);
      const postModified = post.data.modified;

      // Skip if image is newer than post
      if (stat.mtime > postModified) {
        console.log(`[OG Images] Skipping (up to date): ${post.slug}`);
        skipped++;
        continue;
      }
    }

    try {
      const formattedTitle = titleCase(post.data.title);
      const rawExcerpt = getRawExcerpt(post.data.excerpt);
      const absoluteURL = getPostAbsoluteUrl(post.slug);

      const html = generateHTML({
        formattedTitle,
        rawExcerpt,
        absoluteURL,
        og_image_hide_description: post.data.og_image_hide_description,
      });

      await page.setContent(html, { waitUntil: "domcontentloaded" });
      await page.screenshot({
        path: outputPath,
        type: "png",
      });

      console.log(`[OG Images] Generated: ${post.slug}`);
      generated++;
    } catch (error) {
      console.error(`[OG Images] Error generating ${post.slug}:`, error);
    }
  }

  await browser.close();

  console.log(`[OG Images] Done! Generated: ${generated}, Skipped: ${skipped}`);
}

generateOGImages()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error("[OG Images] Fatal error:", err);
    process.exit(1);
  });
