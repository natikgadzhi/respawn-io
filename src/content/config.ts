import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({
    pattern: ["**/*.{md,mdx}", "!**/*.excalidraw.md"],
    base: "src/content/posts",
  }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    created: z.coerce.date(),
    modified: z.coerce.date(),
    tags: z
      .array(z.string())
      .nullable()
      .default([])
      .transform((val) => val ?? []),
    draft: z.boolean().default(false),
    workInProgress: z.boolean().default(false),
    meta_description: z.string().nullable().optional(),
    meta_keywords: z.string().nullable().optional(),
    og_image_hide_description: z.boolean().default(false),
  }),
});

const daily = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/daily" }),
  schema: z.object({
    title: z.string().optional(),
    tags: z
      .array(z.string())
      .nullable()
      .default([])
      .transform((val) => val ?? []),
    created: z.coerce.date().optional(),
    modified: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    meta_description: z.string().nullable().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pages" }),
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }),
});

const tags = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/tags" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { posts, daily, pages, tags };
