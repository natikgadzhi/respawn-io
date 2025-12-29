import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
// Remark plugins
import remarkFigureCaption from "@microflash/remark-figure-caption";
import { defineConfig } from "astro/config";
import callouts from "remark-callouts";
import remarkGfm from "remark-gfm";
import wikilinks from "remark-wiki-link";
// Rehype plugins
import rehypeExcalidraw from "./lib/rehypeExcalidraw.ts";
import rehypeMermaid from "rehype-mermaid";
import ogImagesIntegration from "./scripts/og-images-integration.ts";

const baseURL = "https://respawn.io";

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
  [
    remarkFigureCaption,
    { captionClassName: "text-center italic mx-auto block" },
  ],
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
  integrations: [mdx(), sitemap(), ogImagesIntegration()],
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
    },
  },
  build: {
    format: "file",
  },
});
