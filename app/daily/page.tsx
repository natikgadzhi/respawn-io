import { allDailies, type Daily } from "contentlayer/generated";

import { Metadata } from "next";

import { config } from "blog.config";
import { compareDesc, format, parse } from "date-fns";
import { getMDXComponent } from "next-contentlayer/hooks";
import { mdxComponents } from "lib/mdxComponents";

const getDailyNotes = async () => {
  const env_name = process.env.ENV_NAME;
  const daily = allDailies
      .filter((d) => env_name == "localhost" || !d.draft)
      .sort((a, b) => compareDesc(new Date(a.slug), new Date(b.slug)));
  return daily;
};

const formatDate = (date: string) => {
  return format(parse(date, "yyyy-MM-dd", new Date()), "MMMM do");
};

export const metadata: Metadata = {
  title: "TIL and Daily Notes: " + config.title,
  description: config.daily.description,
};

// A component to render a single daily note.
function DailyNote({ daily }: { daily: Daily }) {
  const MDXContent = getMDXComponent(daily.body.code);
  return (
    <>
      <h4 className="pr-1 md:pr-2 inline">
        { `${formatDate(daily.slug)}:` }
      </h4>

      {( daily.title && daily.title.length > 0 ) && (<strong className="pr-1 md:pr-2">
        { daily.title }
      </strong>)}

      <MDXContent components={mdxComponents} />
    </>
  )
};

export default async function Page() {
  const dailies = await getDailyNotes();

  return (
      <>
      <section className="prose prose-slate dark:prose-invert">
        <h1 className="text-xl md:text-2xl font-bold">Daily Notes</h1>
        <p className="text-md md:text-lg">
          { config.daily.description }
        </p>

        <ul className="list-none pl-0">
          {dailies.map((daily) => (
            <li key={daily._id} className="text-md md:text-lg pl-0 pt-5">
              <DailyNote  daily={daily} />
            </li>
          ))}
        </ul>
      </section>
      </>
  );
}
