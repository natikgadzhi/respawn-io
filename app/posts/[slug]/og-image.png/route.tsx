import { ImageResponse, ImageResponseOptions } from "next/server";
import { NextRequest } from "next/server";

import { allPosts } from "contentlayer/generated";

import OpengraphImage from "./image";

export const runtime = "edge";

// `ImageResponseOptions` are passed into `ImageResponse` alongside the
// component to actually draw the image. It contains width, height, and fonts.
async function imageResponseOptions(width: number, height: number): Promise<ImageResponseOptions> {
  return {
    width: width,
    height: height,
    fonts: [
      {
        name: "Jetbrains Mono",
        data: await fetch(new URL(`assets/fonts/JetBrainsMono-Regular.ttf`, import.meta.url))
          .then((res) => res.arrayBuffer()),
        style: "normal",
        weight: 400,
      },
      {
        name: "Jetbrains Mono",
        data: await fetch(new URL(`assets/fonts/JetBrainsMono-ExtraBold.ttf`, import.meta.url))
          .then((res) => res.arrayBuffer()),
        style: "normal",
        weight: 800,
      },
    ],
  }
}

// Since this api route is scoped to /posts/:slug, the params will have slug parameter.
type Params = {
  params: {
    slug: string;
  };
};

// GET /posts/:slug/og-image.png
//
// Generates the opengraph image using edge runtime `ImageResponse`
// https://nextjs.org/docs/api-reference/next/server#imageresponse
//
export async function GET(req: NextRequest, { params }: Params) {
  const post = allPosts.find((post) => post.slug === params.slug);

  // width and height have to be converted to integers
  const s = new URL(req.url).searchParams;
  const width = s.has("w") ? parseInt(s.get("w") as string) : 1200;
  const height = s.has("h") ? parseInt(s.get("h") as string) : 630;

  return new ImageResponse(
    <OpengraphImage post={post} width={width} height={height} />,
    await imageResponseOptions(width, height)
  );
}
