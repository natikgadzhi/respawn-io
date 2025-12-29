/**
 * Astro Integration for copying content images to public directory
 *
 * Copies images from content directories (posts, daily) to public/
 * so they're available at the expected URLs during build and dev.
 */

import fs from "node:fs";
import path from "node:path";
import type { AstroIntegration } from "astro";
import sharp from "sharp";

const CONTENT_DIRS = ["./src/content/posts", "./src/content/daily"];
const PUBLIC_DIR = "./public";
const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif"];
const JPEG_QUALITY = 80;

interface CopyImagesOptions {
  optimize?: boolean;
}

/**
 * Recursively find all image files in a directory
 */
function findImages(dir: string): string[] {
  const images: string[] = [];

  if (!fs.existsSync(dir)) {
    return images;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      images.push(...findImages(fullPath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        images.push(fullPath);
      }
    }
  }

  return images;
}

/**
 * Copy and optionally optimize an image
 */
async function processImage(sourcePath: string, destPath: string, optimize: boolean): Promise<void> {
  fs.mkdirSync(path.dirname(destPath), { recursive: true });

  if (!optimize) {
    fs.copyFileSync(sourcePath, destPath);
    return;
  }

  const ext = path.extname(sourcePath).toLowerCase();

  // Only optimize JPEG and PNG files
  if (ext === ".jpg" || ext === ".jpeg") {
    await sharp(sourcePath).jpeg({ quality: JPEG_QUALITY }).toFile(destPath);
  } else if (ext === ".png") {
    await sharp(sourcePath).png({ quality: JPEG_QUALITY }).toFile(destPath);
  } else {
    // Copy other formats as-is (gif, etc.)
    fs.copyFileSync(sourcePath, destPath);
  }
}

/**
 * Copy images from content directories to public
 */
async function copyImages(optimize: boolean, logger?: { info: (msg: string) => void }): Promise<void> {
  const log = logger?.info.bind(logger) ?? console.log;
  let copied = 0;
  let skipped = 0;

  for (const contentDir of CONTENT_DIRS) {
    const images = findImages(contentDir);

    for (const imagePath of images) {
      // Convert src/content/posts/_assets/foo/bar.png -> public/posts/_assets/foo/bar.png
      const relativePath = imagePath.replace(/^\.\/src\/content\//, "");
      const destPath = path.join(PUBLIC_DIR, relativePath);

      // Check if destination exists and is newer than source (skip if up to date)
      if (fs.existsSync(destPath)) {
        const sourceStat = fs.statSync(imagePath);
        const destStat = fs.statSync(destPath);
        if (destStat.mtime >= sourceStat.mtime) {
          skipped++;
          continue;
        }
      }

      await processImage(imagePath, destPath, optimize);
      copied++;
    }
  }

  log(`Images: copied ${copied}, skipped ${skipped} (up to date)`);
}

export default function copyImagesIntegration(options: CopyImagesOptions = {}): AstroIntegration {
  const { optimize = true } = options;

  return {
    name: "copy-images",
    hooks: {
      // Copy images before build starts
      "astro:build:start": async ({ logger }) => {
        logger.info("Copying content images to public directory...");
        await copyImages(optimize, logger);
      },
      // Also copy for dev server
      "astro:server:start": async ({ logger }) => {
        logger.info("Copying content images to public directory...");
        await copyImages(optimize, logger);
      },
    },
  };
}
