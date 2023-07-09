import { allDailies } from "contentlayer/generated";

import { Metadata } from "next";

import { config as blogConfig } from "blog.config";
import { compareDesc, format, parse } from "date-fns";

const getDailyNotes = async () => {
  const env_name = process.env.ENV_NAME;
  const daily = allDailies
      .filter((d) => env_name == "localhost" || !d.draft)
      .sort((a, b) => compareDesc(new Date(a._raw.sourceFileName), new Date(b._raw.sourceFileName)));
  return daily;
};

const formatDate = (date: string) => {
  return format(parse(date, "yyyy-MM-dd", new Date()), "MMMM do");
};

export const metadata: Metadata = {
  title: "TIL and Daily Notes: " + blogConfig.title,
  description: "Quick notes on things I learned that day. Mostly coding, and some a-ha moment in working with people, or tricks to get projects done on time.",
};

export default async function Page() {
  const dailies = await getDailyNotes();

  return (
      <>
      <section className="prose prose-slate dark:prose-invert">
        <h1 className="text-xl md:text-2xl font-bold">Daily Notes</h1>

        <p className="text-md md:text-lg">
          Quick notes on things I learned that day. Mostly coding, and some a-ha moment in working with people, or tricks to get projects done on time.
        </p>

        <ul>
          {dailies.map((daily) => (
            <li key={daily._id} className="text-md md:text-lg">
              <strong className="pr-1 md:pr-2">
                { `${formatDate(daily.slug)}:` }
              </strong>
              <span className="pr-1 md:pr-2">
                { daily.title }
              </span>
            </li>
          ))}
          </ul>
      </section>
      </>
  );
}