import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
// Remark plugins
import remarkFigureCaption from "@microflash/remark-figure-caption";
import { defineConfig } from "astro/config";
import fs from "node:fs";
import path from "node:path";
import rehypeMermaid from "rehype-mermaid";
import callouts from "remark-callouts";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import wikilinks from "remark-wiki-link";
import { config } from "./blog.config.ts";
// Build integrations
import copyImagesIntegration from "./scripts/copy-images-integration.ts";
import ogImagesIntegration from "./scripts/og-images-integration.ts";
// Rehype plugins
import rehypeExcalidraw from "./src/lib/rehypeExcalidraw.ts";
import remarkDek from "./src/lib/remarkDek.ts";
import remarkMark from "./src/lib/remarkMark.ts";

const baseURL = config.baseURL;

// Handle links for both posts and daily notes based on the link format
// If a link starts with "daily/", it links to a daily note, otherwise it's a post
const hrefTemplate = (permalink) => {
  if (permalink.startsWith("daily/")) {
    const dailySlug = permalink.replace("daily/", "");
    return `${baseURL}/daily/${dailySlug}`;
  }
  return `${baseURL}/posts/${permalink}`;
};
const pageResolver = (name) => [name];

const remarkPlugins = [
  remarkGfm,
  remarkDek,
  remarkMark,
  [remarkFigureCaption, { captionClassName: "text-center italic mx-auto block" }],
  [wikilinks, { pageResolver, hrefTemplate, aliasDivider: "|" }],
  callouts,
];

const rehypePlugins = [
  [
    rehypeMermaid,
    {
      strategy: "img-svg",
      dark: true,
    },
  ],
  [
    rehypeExcalidraw,
    {
      className: "excalidraw-diagram",
    },
  ],
];

function normalizeURL(url) {
  const pathname = url.pathname.replace(/\/$/, "");
  return `${url.origin}${pathname}` || url.origin;
}

function collectMarkdownFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectMarkdownFiles(fullPath);
    }

    if (!/\.(md|mdx)$/.test(entry.name) || entry.name.endsWith(".excalidraw.md")) {
      return [];
    }

    return [fullPath];
  });
}

function buildSitemapLastmodMap() {
  const lastmodMap = new Map();

  const contentSources = [
    {
      directory: path.join(process.cwd(), "src/content/posts"),
      routeBase: "/posts/",
    },
    {
      directory: path.join(process.cwd(), "src/content/daily"),
      routeBase: "/daily/",
    },
  ];

  for (const source of contentSources) {
    for (const filePath of collectMarkdownFiles(source.directory)) {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data } = matter(fileContents);

      if (data.draft) {
        continue;
      }

      const relativePath = path.relative(source.directory, filePath).replace(/\.(md|mdx)$/, "");
      let modified = data.modified ?? data.created;

      if (!modified && source.routeBase === "/daily/" && /^\d{4}-\d{2}-\d{2}$/.test(relativePath)) {
        modified = `${relativePath}T00:00:00.000Z`;
      }

      if (!modified) {
        continue;
      }

      const url = new URL(`${source.routeBase}${relativePath}`, baseURL);
      lastmodMap.set(normalizeURL(url), new Date(modified));
    }
  }

  return lastmodMap;
}

const sitemapLastmodMap = buildSitemapLastmodMap();

export default defineConfig({
  site: baseURL,
  integrations: [
    copyImagesIntegration(),
    mdx(),
    sitemap({
      serialize(item) {
        const lastmod = sitemapLastmodMap.get(normalizeURL(new URL(item.url)));

        if (lastmod) {
          item.lastmod = lastmod;
        }

        return item;
      },
    }),
    ogImagesIntegration(),
  ],
  markdown: {
    remarkPlugins,
    rehypePlugins,
    // Use Astro's built-in Shiki syntax highlighting
    syntaxHighlight: {
      type: "shiki",
      excludeLangs: ["mermaid"],
    },
    shikiConfig: {
      themes: {
        light: "catppuccin-latte",
        dark: "github-dark",
      },
      // Emit both themes as CSS variables so our media-query override can
      // pick between --shiki-light / --shiki-dark without fighting inline styles.
      defaultColor: false,
    },
  },
  build: {
    format: "file",
  },
});
