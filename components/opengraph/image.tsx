import DateFormatter from "../date-formatter";

type Props = {
  title: String;
  description: String;
  postURL: string;
  width: number;
  height: number;
};

const OpengraphImage = ({ title, description, postURL, width, height }: Props) => {
  return (
    <>
      <div
        style={{
          width: width,
          height: height,
          fontFamily: '"Jetbrains Mono"',
          backgroundImage: "linear-gradient(90deg, #cbd5e1 0%, #f8fafc 100%)",
        }}
        tw="flex flex-col justify-start w-full h-full p-12 bg-slate-50">

        <h1 style={{
          backgroundImage: "linear-gradient(90deg, #1d4ed8 0%, #581c87 100%)",
          backgroundClip: "text",
          /* @ts-ignore */
          "-webkit-background-clip": "text",
          color: "transparent",
        }}
          tw="text-7xl break-keep font-extrabold mb-8">
          {title}
        </h1>

        <p tw="mt-4 text-2xl text-black">{description}</p>

        <div tw="flex mt-auto flex-row justify-between items-baseline w-full">
          <a
            href={postURL}
            tw="text-2xl text-blue-700 ml-auto">
            {postURL}
          </a>
        </div>
      </div>
    </>
  );
};

export default OpengraphImage;
