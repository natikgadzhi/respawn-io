import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

import rehypeShiki from "@shikijs/rehype";
import rehypeMermaid from "./lib/rehypeMermaid.ts";
import rehypeExcalidraw from "./lib/rehypeExcalidraw.ts";

// Remark plugins
import remarkFigureCaption from "@microflash/remark-figure-caption";
import remarkGfm from "remark-gfm";
import callouts from "remark-callouts";
import wikilinks from "remark-wiki-link";

const baseURL = "https://respawn.io";

// Using two color themes explicitly will make Shiki render
// two code blocks of each theme, and you can toggle between them in CSS.
const shikiOptions = {
  themes: {
    light: "catppuccin-latte",
    dark: "github-dark",
  },
  inline: 'tailing-curly-colon',
};

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
  [remarkFigureCaption, { captionClassName: "text-center italic mx-auto block" }],
  [wikilinks, { pageResolver, hrefTemplate, aliasDivider: "|" }],
  callouts,
];

const rehypePlugins = [
  [rehypeMermaid, {
    background: "transparent",
    className: "mermaid-diagram",
  }],
  [rehypeExcalidraw, {
    className: "excalidraw-diagram",
  }],
  [rehypeShiki, shikiOptions],
];

export default defineConfig({
  site: baseURL,
  integrations: [
    mdx(),
    sitemap(),
    tailwind(),
  ],
  markdown: {
    remarkPlugins,
    rehypePlugins,
    // Disable default syntax highlighting since we use Shiki
    syntaxHighlight: false,
  },
});
