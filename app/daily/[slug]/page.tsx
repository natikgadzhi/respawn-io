import { allDailies } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { config } from "../../../blog.config";
import { getMDXComponent } from "next-contentlayer2/hooks";
import { mdxComponents } from "lib/mdxComponents";
import { format, parse } from "date-fns";

type DailyPageParams = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const env_name = process.env.ENV_NAME;
  return allDailies
    .filter((daily) => env_name === "localhost" || !daily.draft)
    .map((daily) => ({
      slug: daily.slug,
    }));
}

export async function generateMetadata({ params }: DailyPageParams): Promise<Metadata> {
  const daily = allDailies.find((d) => d.slug === params.slug);
  if (!daily) return notFound();

  const formattedDate = format(parse(daily.slug, "yyyy-MM-dd", new Date()), "MMMM do, yyyy");
  const title = daily.title ? `${daily.title} - ${formattedDate}` : formattedDate;
  const canonicalURL = `${config.baseURL}/daily/${daily.slug}`;

  return {
    title: `${title} - ${config.title}`,
    description: daily.title || `Daily TIL note from ${formattedDate}`,
    alternates: {
      canonical: canonicalURL,
    },
    openGraph: {
      title: `${title} - ${config.title}`,
      description: daily.title || `Daily TIL note from ${formattedDate}`,
      url: canonicalURL,
      type: "article",
      publishedTime: daily.created || daily.slug,
      modifiedTime: daily.modified || daily.slug,
      tags: daily.tags,
    },
    twitter: {
      title: `${title} - ${config.title}`,
      description: daily.title || `Daily note from ${formattedDate}`,
      card: "summary",
    },
  };
}

export default async function DailyPage({ params }: DailyPageParams) {
  const daily = allDailies.find((d) => d.slug === params.slug);
  if (!daily) return notFound();

  const formattedDate = format(parse(daily.slug, "yyyy-MM-dd", new Date()), "MMMM do, yyyy");
  const MDXContent = getMDXComponent(daily.body.code);

  return (
    <article className="prose dark:prose-invert">
      <header className="mb-8">
        <time className="text-sm text-gray-600 dark:text-gray-400">{formattedDate}</time>
        {daily.title && <h1 className="mt-2">{daily.title}</h1>}
      </header>

      <MDXContent components={mdxComponents} />

      {daily.tags && daily.tags.length > 0 && (
        <footer className="mt-8">
          <div className="flex gap-2">
            {daily.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        </footer>
      )}
    </article>
  );
} 