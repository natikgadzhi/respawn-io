import { ImageResponse } from "next/server";
import { NextRequest } from "next/server";

import { allPosts } from "contentlayer/generated";

import OpengraphImage from "app/posts/[slug]/og-image.png/image";

export const runtime = "edge";

export async function GET(req: NextRequest, { params }: { params: { slug: string }}) {
  try {
    const regular = fetch(
      new URL("assets/fonts/JetBrainsMono-Regular.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    const bold = fetch(
      new URL("assets/fonts/JetBrainsMono-ExtraBold.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    const post = allPosts.find((post) => post.slug === params.slug);

    const { searchParams } = new URL(req.url);
    const width = searchParams.has("w")
      ? parseInt(searchParams.get("w") as string)
      : 1200;
    const height = searchParams.has("h")
      ? parseInt(searchParams.get("h") as string)
      : 630;

    return new ImageResponse(
      (
        <OpengraphImage
          post={post}
          width={width}
          height={height}
        />
      ),
      {
        width: width,
        height: height,
        fonts: [
          {
            name: "Jetbrains Mono",
            data: await regular,
            style: "normal",
            weight: 400,
          },
          {
            name: "Jetbrains Mono",
            data: await bold,
            style: "normal",
            weight: 800,
          },
        ],
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
