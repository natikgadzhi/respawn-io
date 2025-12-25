import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    created: z.coerce.date(),
    modified: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    workInProgress: z.boolean().default(false),
    meta_description: z.string().nullable().optional(),
    meta_keywords: z.string().nullable().optional(),
    og_image_hide_description: z.boolean().default(false),
  }),
});

const daily = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().optional(),
    tags: z.array(z.string()).default([]),
    created: z.coerce.date().optional(),
    modified: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    meta_description: z.string().nullable().optional(),
  }),
});

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }),
});

const tags = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

export const collections = { posts, daily, pages, tags };
