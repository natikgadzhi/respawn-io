/**
 * Astro Integration for OG Image Generation
 *
 * Generates static OG images for all posts using Puppeteer at build time.
 * Uses the astro:build:done hook to access content collections after build.
 */

import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";
import type { AstroIntegration } from "astro";

const OUTPUT_DIR = "./public/og-images";
const WIDTH = 1200;
const HEIGHT = 630;
const BASE_URL = "https://respawn.io";

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
 * Title case a string
 */
function titleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

/**
 * Remove markdown formatting from excerpt
 */
function getRawExcerpt(excerpt: string): string {
  return excerpt
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove ** tags
    .replace(/\*(.*?)\*/g, "$1") // Remove * tags
    .replace(/__(.*?)__/g, "$1") // Remove __ tags
    .replace(/_(.*?)_/g, "$1") // Remove _ tags
    .replace(/~~(.*?)~~/g, "$1"); // Remove ~~ tags
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
  const showExcerpt =
    post.formattedTitle.length < 60 && !post.og_image_hide_description;
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
    ${showExcerpt ? `<p class="excerpt">${escapeHtml(post.rawExcerpt)}</p>` : ""}
    ${
      showURL
        ? `
    <div class="footer">
      <span class="url">${escapeHtml(post.absoluteURL)}</span>
    </div>
    `
        : ""
    }
  </div>
</body>
</html>
`;
}

async function generateOGImages(dir: URL, logger: any) {
  logger.info("Starting OG image generation...");

  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Read the data store JSON file that Astro creates
  const dataStorePath = path.join(dir.pathname, "data-store.json");

  if (!fs.existsSync(dataStorePath)) {
    logger.warn("Data store not found, skipping OG image generation");
    return;
  }

  const dataStore = JSON.parse(fs.readFileSync(dataStorePath, "utf-8"));

  // Extract posts from the data store
  const posts = Object.entries(dataStore.collections?.posts?.entries || {})
    .map(([id, entry]: [string, any]) => ({
      slug: id,
      data: entry.data,
    }));

  if (posts.length === 0) {
    logger.warn("No posts found in data store");
    return;
  }

  // Launch browser
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: HEIGHT });

  let generated = 0;
  let skipped = 0;

  for (const post of posts) {
    // Skip drafts
    if (post.data.draft) {
      logger.info(`Skipping draft: ${post.slug}`);
      skipped++;
      continue;
    }

    const outputPath = path.join(OUTPUT_DIR, `${post.slug}.png`);

    // Check if image already exists (for incremental builds)
    if (fs.existsSync(outputPath)) {
      const stat = fs.statSync(outputPath);
      const postModified = new Date(post.data.modified);

      // Skip if image is newer than post
      if (stat.mtime > postModified) {
        logger.info(`Skipping (up to date): ${post.slug}`);
        skipped++;
        continue;
      }
    }

    try {
      const formattedTitle = titleCase(post.data.title);
      const rawExcerpt = getRawExcerpt(post.data.excerpt);
      const absoluteURL = `${BASE_URL}/posts/${post.slug}`;

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

      logger.info(`Generated: ${post.slug}`);
      generated++;
    } catch (error) {
      logger.error(`Error generating ${post.slug}: ${error}`);
    }
  }

  await browser.close();

  logger.info(`OG Images Done! Generated: ${generated}, Skipped: ${skipped}`);
}

export default function ogImagesIntegration(): AstroIntegration {
  return {
    name: "og-images",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        await generateOGImages(dir, logger);
      },
    },
  };
}
