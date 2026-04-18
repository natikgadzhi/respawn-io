import type { APIRoute } from "astro";
import { config } from "../../blog.config";

const robots = `User-agent: *
Allow: /

Sitemap: ${new URL("/sitemap-index.xml", config.baseURL).toString()}
`;

export const GET: APIRoute = () =>
  new Response(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
