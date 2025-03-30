import { PostDescription } from "components/posts";

type PostData = {
  formattedTitle: string;
  absoluteURL: string;
  excerpt: string;
  og_image_hide_description: boolean;
};

type Props = {
  post: PostData;
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
          tw="text-6xl break-keep font-extrabold mb-8"
        >
          {post.formattedTitle}
        </h1>

        {post.formattedTitle.length < 60 && !post.og_image_hide_description && (
          <p tw="mt-4 text-4xl font-extrabold leading-normal">
            {post.excerpt}
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
