import { PostDescription } from "components/posts";
import type { Post } from "contentlayer/generated";

type Props = {
  post: Post;
  width: number;
  height: number;
};

export default function OpengraphImage({ post, width, height }: Props) {
  return (
    <>
      <div
        style={{
          width: width,
          height: height,
          fontFamily: '"Jetbrains Mono"',
          backgroundImage: "linear-gradient(90deg, #cbd5e1 0%, #f8fafc 100%)",
        }}
        tw="flex flex-col justify-start w-full h-full p-12 px-24 bg-slate-50"
      >
        <h1
          style={{
            backgroundImage: "linear-gradient(90deg, #1d4ed8 0%, #581c87 100%)",
            backgroundClip: "text",
            /* @ts-ignore */
            "-webkit-background-clip": "text",
            color: "transparent",
          }}
          tw="text-7xl break-keep font-extrabold mb-8"
        >
          {post.formattedTitle}
        </h1>

        {post.formattedTitle.length < 60 && (
          <p tw="mt-4 text-4xl font-extrabold leading-normal">
            <PostDescription post={post} />
          </p>
        )}

        {post.formattedTitle.length < 60 && (
          <div tw="flex mt-auto flex-row justify-between items-baseline w-full">
            <a href={post.absoluteURL} tw="text-2xl text-blue-700 ml-auto">
              {post.absoluteURL}
            </a>
          </div>
        )}
      </div>
    </>
  );
}
