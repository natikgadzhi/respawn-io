import type { CollectionEntry } from "astro:content";
import { titleCase } from "./titleCase";

const baseURL = "https://respawn.io";

export function getPostUrl(slug: string): string {
  return `/posts/${slug}`;
}

export function getPostAbsoluteUrl(slug: string): string {
  return `${baseURL}/posts/${slug}`;
}

export function getDailyUrl(slug: string): string {
  return `/daily/${slug}`;
}

export function getDailyAbsoluteUrl(slug: string): string {
  return `${baseURL}/daily/${slug}`;
}

export function getTagUrl(slug: string): string {
  return `/tags/${slug}`;
}

export function getTagAbsoluteUrl(slug: string): string {
  return `${baseURL}/tags/${slug}`;
}

export function getOgImageUrl(slug: string): string {
  return `/og-images/${slug}.png`;
}

export function getFormattedTitle(title: string): string {
  return titleCase(title);
}

export function getRawExcerpt(excerpt: string): string {
  return excerpt
    .replace(/\*\*(.*?)\*\*/g, "$1") // Remove ** tags
    .replace(/\*(.*?)\*/g, "$1") // Remove * tags
    .replace(/__(.*?)__/g, "$1") // Remove __ tags
    .replace(/_(.*?)_/g, "$1") // Remove _ tags
    .replace(/~~(.*?)~~/g, "$1"); // Remove ~~ tags
}

export function sortPostsByDate(posts: CollectionEntry<"posts">[]): CollectionEntry<"posts">[] {
  return posts.sort((a, b) => b.data.created.getTime() - a.data.created.getTime());
}

export function sortDailyByDate(daily: CollectionEntry<"daily">[]): CollectionEntry<"daily">[] {
  return daily.sort((a, b) => {
    // Sort by ID (filename), which is in YYYY-MM-DD format
    // Reverse sort for most recent first
    return b.id.localeCompare(a.id);
  });
}

export function getAllTags(posts: CollectionEntry<"posts">[]): string[] {
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.data.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
