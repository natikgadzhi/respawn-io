import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import { allPosts } from "contentlayer/generated";

import OpengraphImage from "./image";

export const runtime = "edge";

type Params = Promise<{ slug: string }>;

// GET /posts/:slug/og-image.png
//
// Generates the opengraph image using edge runtime `ImageResponse`
// https://nextjs.org/docs/api-reference/next/server#imageresponse
//
export async function GET(req: NextRequest, { params }: { params: Params }) {
  // Await the params Promise to get the actual slug
  const { slug } = await params;
  const post = allPosts.find((post) => post.slug === slug);

  // width and height have to be converted to integers
  const s = new URL(req.url).searchParams;
  const width = s.has("w") ? Number.parseInt(s.get("w") as string) : 1200;
  const height = s.has("h") ? Number.parseInt(s.get("h") as string) : 630;

  return new ImageResponse(
    <OpengraphImage post={post} width={width} height={height} />,
    {
      width: width,
      height: height,
    },
  );
}
