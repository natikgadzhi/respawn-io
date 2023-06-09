import { ImageResponse, ImageResponseOptions } from "next/server";
import { NextRequest } from "next/server";

import { allPosts } from "contentlayer/generated";

import OpengraphImage from "app/posts/[slug]/og-image.png/image";

export const runtime = "edge";

// Helper func to load a font from the file system
// and pass it into the `ImageResponseOptions` below.
const loadFont = async (fontName: string): Promise<ArrayBuffer> => {
  const res = await fetch(new URL(`assets/fonts/${fontName}`, import.meta.url));
  return await res.arrayBuffer();
};


// `ImageResponseOptions` are passed into `ImageResponse` alongside the
// component to actually draw the image. It contains width, height, and fonts.
const imageResponseOptions = async (width: number, height: number): Promise<ImageResponseOptions> => {
  return {
    width: width,
    height: height,
    fonts: [
      {
        name: "Jetbrains Mono",
        data: await loadFont("JetBrainsMono-Regular.ttf"),
        style: "normal",
        weight: 400,
      },
      {
        name: "Jetbrains Mono",
        data: await loadFont("JetBrainsMono-ExtraBold.ttf"),
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
