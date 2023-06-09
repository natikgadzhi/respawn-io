/* eslint-disable import/no-anonymous-default-export */
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

import { config as blogConfig } from "../../../blog.config";

import OpengraphImage from "../../../components/opengraph/image";

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  try {
    const regular = fetch(
      new URL("../../../assets/fonts/JetBrainsMono-Regular.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    const bold = fetch(
      new URL("../../../assets/fonts/JetBrainsMono-ExtraBold.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");
    const description = searchParams.get("description");
    const slug = searchParams.get("slug");
    const postURL = blogConfig.baseURL + "/posts/" + slug;

    if (!title || !description) {
      console.log("Missing title or description.");
      return new Response(`Missing title or description.`, { status: 404 });
    }

    const width = searchParams.has("w")
      ? parseInt(searchParams.get("w") as string)
      : 1200;
    const height = searchParams.has("h")
      ? parseInt(searchParams.get("h") as string)
      : 630;

    return new ImageResponse(
      (
        <OpengraphImage
          title={title}
          description={description}
          postURL={postURL}
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
