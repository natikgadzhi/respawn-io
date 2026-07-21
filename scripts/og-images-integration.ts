import * as fs from "node:fs";
import * as path from "node:path";
import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import matter from "gray-matter";
import { chromium } from "playwright";

const WIDTH = 1200;
const HEIGHT = 630;
const POSTS_DIR = "src/content/posts";
const CACHE_DIR = "public/og-images";
const OUTPUT_DIR = "og-images";

interface PostFrontmatter {
  title: string;
  excerpt?: string;
  created: Date;
  draft?: boolean;
  og_image_hide_description?: boolean;
}

interface PostData {
  slug: string;
  data: PostFrontmatter;
  filePath: string;
  absoluteURL: string;
  formattedTitle: string;
  rawExcerpt: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function generateHTML(post: PostData, showExcerpt: boolean, showURL: boolean): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: ${WIDTH}px;
      height: ${HEIGHT}px;
      background: #fffcf0;
      font-family: 'Georgia', 'Times New Roman', serif;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .container {
      padding: 64px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    h1 {
      font-size: 52px;
      font-weight: 700;
      line-height: 1.15;
      color: #100f0f;
      letter-spacing: -0.02em;
      max-width: 900px;
    }

    p.excerpt {
      font-size: 28px;
      line-height: 1.5;
      color: #6f6e69;
      margin-top: 24px;
      max-width: 900px;
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

async function generateOGImages(dir: URL, logger: AstroIntegrationLogger) {
  logger.info("Starting OG image generation...");

  // Use public/og-images as cache for incremental builds and dev mode
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  // Final output goes to dist/og-images
  const distOutputDir = path.join(dir.pathname, OUTPUT_DIR);
  fs.mkdirSync(distOutputDir, { recursive: true });

  // Read posts directly from markdown files
  const postFiles = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const posts = postFiles.map((file) => {
    const filePath = path.join(POSTS_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content);
    const slug = file.replace(/\.(md|mdx)$/, "");
    return { slug, data: data as PostFrontmatter, filePath };
  });

  if (posts.length === 0) {
    logger.warn("No posts found");
    return;
  }

  logger.info(`Found ${posts.length} posts`);

  // Launch browser (Playwright uses the browser installed by `playwright install chromium`)
  const browser = await chromium.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: WIDTH, height: HEIGHT });

  let generated = 0;
  let skipped = 0;

  for (const post of posts) {
    // Skip drafts
    if (post.data.draft) {
      logger.info(`Skipping draft: ${post.slug}`);
      skipped++;
      continue;
    }

    const cachePath = path.join(CACHE_DIR, `${post.slug}.png`);

    // Check if image already exists in cache (for incremental builds)
    if (fs.existsSync(cachePath)) {
      const imageStat = fs.statSync(cachePath);
      const postStat = fs.statSync(post.filePath);

      if (imageStat.mtimeMs >= postStat.mtimeMs) {
        // Copy from cache to dist
        fs.copyFileSync(cachePath, path.join(distOutputDir, `${post.slug}.png`));
        logger.info(`Using cached OG image: ${post.slug}`);
        skipped++;
        continue;
      }
    }

    // Generate HTML for the OG image
    const showExcerpt = !post.data.og_image_hide_description;
    const showURL = true;

    // Format title and excerpt
    const formattedTitle = post.data.title || post.slug;
    const rawExcerpt = post.data.excerpt || "";
    const absoluteURL = `respawn.io/posts/${post.slug}`;

    const postData: PostData = {
      slug: post.slug,
      data: post.data,
      filePath: post.filePath,
      absoluteURL,
      formattedTitle,
      rawExcerpt,
    };

    const html = generateHTML(postData, showExcerpt, showURL);

    await page.setContent(html, { waitUntil: "networkidle" });
    const screenshot = await page.screenshot({ type: "png" });

    // Save to cache
    fs.writeFileSync(cachePath, screenshot);

    // Copy to dist
    fs.copyFileSync(cachePath, path.join(distOutputDir, `${post.slug}.png`));

    logger.info(`Generated OG image: ${post.slug}`);
    generated++;
  }

  await browser.close();

  logger.info(`OG images: ${generated} generated, ${skipped} skipped`);
}

export default function ogImagesIntegration(): AstroIntegration {
  return {
    name: "og-images",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        try {
          await generateOGImages(dir, logger);
        } catch (e) {
          logger.warn(
            `OG image generation failed (Playwright may not be installed): ${(e as Error).message.slice(0, 120)}`,
          );
        }
      },
    },
  };
}
