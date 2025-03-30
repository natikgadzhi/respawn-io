import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import OpengraphImage from "./image";

export const runtime = "edge";

type Params = Promise<{ slug: string }>;

// GET /posts/:slug/og-image.png
//
// Generates the opengraph image using edge runtime `ImageResponse`
// https://nextjs.org/docs/api-reference/next/server#imageresponse
//
export async function GET(req: NextRequest, { params }: { params: Params }) {
  // Get parameters from URL
  const s = new URL(req.url).searchParams;
  const width = s.has("w") ? Number.parseInt(s.get("w") as string) : 1200;
  const height = s.has("h") ? Number.parseInt(s.get("h") as string) : 630;
  
  // Get post data from URL parameters
  const formattedTitle = s.get("title") || "";
  const absoluteURL = s.get("url") || "";
  const excerpt = s.get("excerpt") || "";
  const hideDescription = s.get("hideDescription") === "true";

  // Create a lightweight post object with just the data we need
  const postData = {
    formattedTitle,
    absoluteURL,
    excerpt,
    og_image_hide_description: hideDescription
  };

  return new ImageResponse(
    <OpengraphImage post={postData} width={width} height={height} />,
    {
      width: width,
      height: height,
    },
  );
}
