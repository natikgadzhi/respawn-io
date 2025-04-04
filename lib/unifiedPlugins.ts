// Unified Plugins we'll use in a constant available to re-import.
//
// The reason they're extracted is that we need to support parsing markdown
// in both ContentLayer context in the standard rendering flow, and
// separately in `markdownToHTML` for the RSS feed, because I have ho clue
// how to render React into a String without causing Vercel to loose it's
// shit about importing react-dom-server.
//

import rehypeShiki from "@shikijs/rehype";
import rehypeMermaid from "./rehypeMermaid";
import rehypeExcalidraw from "./rehypeExcalidraw";
import { config } from "../blog.config";

// Using two color themes explicitly will make Shiki render
// two code blocks of each theme, and you can toggle between them in CSS.
const shikiOptions = {
  themes: {
    light: "catppuccin-latte",
    dark: "github-dark",
  },
};

// remark-figure-caption makes nice captions under images, and supports
// grabbing the markdown image comment, i.e. ![path](caption) into them.
import remarkFigureCaption from "@microflash/remark-figure-caption";

// GFM for extended markdown, including todo items and such.
import remarkGfm from "remark-gfm";

// Callouts support, i.e. `>[!note]`.
import callouts from "remark-callouts";

// Links between pages. Converts links from the source markdown code in
// Obsidian (that are valid in Obsidian) into links that are valid on the
// website.
import wikilinks from "remark-wiki-link";

const rootURL = process.env.ENV_NAME === "localhost" ? "http://localhost:3000" : config.baseURL;

// TODO: This will NOT work for links in daily posts, though.
//
// The resolver will not attempt to check if the link actually exists, which
// is a problem. A potential fix is to make this a little bit bigger,
// and verify that said link is in fact valid to a `Post` or a `Daily` or a
// `Tag`.
const hrefTemplate = (permalink: string) => `${rootURL}/posts/${permalink}`;
const pageResolver = (name: string) => [name];

export const remarkPlugins = [
  remarkGfm,
  [remarkFigureCaption, { captionClassName: "text-center italic mx-auto block" }],
  [wikilinks, { pageResolver, hrefTemplate, aliasDivider: "|" }],
  callouts,
];

export const rehypePlugins = [
  [rehypeMermaid, { 
    background: "transparent", 
    className: "mermaid-diagram",
  }],
  [rehypeExcalidraw, {
    className: "excalidraw-diagram",
  }],
  [rehypeShiki, shikiOptions],
];
