import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
// Remark plugins
import remarkFigureCaption from "@microflash/remark-figure-caption";
import { defineConfig } from "astro/config";
import rehypeMermaid from "rehype-mermaid";
import callouts from "remark-callouts";
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

export default defineConfig({
  site: baseURL,
  integrations: [
    copyImagesIntegration(),
    mdx(),
    // Emit clean URLs in the sitemap (strip .html) so they match the canonical
    // tags and nginx's 301 redirects — avoids Google flagging pages as
    // "Alternate page with proper canonical tag".
    sitemap({
      serialize(item) {
        // `/foo/index.html` → `/foo/`, `/foo.html` → `/foo`
        item.url = item.url.replace(/\/index\.html(\?|$)/, "/$1").replace(/\.html(\?|$)/, "$1");
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
