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
          backgroundColor: "#F9F5E9", // Light beige, Claude-style
        }}
        tw="flex flex-col justify-start w-full h-full p-12 px-24"
      >
        <h1
          style={{
            color: "#000000",
            fontWeight: 1000, // Extra black weight for maximum boldness
            textShadow: "0px 0px 3px rgba(0,0,0,0.1)", // Subtle shadow for more presence
          }}
          tw="text-7xl break-keep font-black mb-8 tracking-tight"
        >
          {post.formattedTitle}
        </h1>

        {post.formattedTitle.length < 60 && !post.og_image_hide_description && (
          <p tw="mt-4 text-6xl font-extrabold leading-normal">{post.excerpt}</p>
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
