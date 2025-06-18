import { allDailies } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { config } from "../../../blog.config";
import { format, parse } from "date-fns";
import { MDXRenderer } from "components/mdx-renderer";
import { TagsList } from "components/tags";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const env_name = process.env.ENV_NAME;
  return allDailies
    .filter((daily) => env_name === "localhost" || !daily.draft)
    .map((daily) => ({
      slug: daily.slug,
    }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const daily = allDailies.find((d) => d.slug === slug);
  if (!daily) return notFound();

  const formattedDate = format(
    parse(daily.slug, "yyyy-MM-dd", new Date()),
    "MMMM do, yyyy",
  );
  const title = daily.title
    ? `${daily.title} - ${formattedDate}`
    : formattedDate;
  const canonicalURL = `${config.baseURL}/daily/${daily.slug}`;

  return {
    title: `${title} - ${config.title}`,
    description: daily.meta_description || daily.title || `Daily TIL note from ${formattedDate}`,
    alternates: {
      canonical: canonicalURL,
    },
    openGraph: {
      title: `${title} - ${config.title}`,
      description: daily.meta_description || daily.title || `Daily TIL note from ${formattedDate}`,
      url: canonicalURL,
      type: "article",
      publishedTime: daily.created || daily.slug,
      modifiedTime: daily.modified || daily.slug,
      tags: daily.tags,
    },
    twitter: {
      title: `${title} - ${config.title}`,
      description: daily.meta_description || daily.title || `Daily note from ${formattedDate}`,
      card: "summary",
    },
  };
}

export default async function DailyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const daily = allDailies.find((d) => d.slug === slug);
  if (!daily) return notFound();

  const formattedDate = format(
    parse(daily.slug, "yyyy-MM-dd", new Date()),
    "MMMM do, yyyy",
  );

  return (
    <article className="prose dark:prose-invert">
      <header className="mb-8">
        <time className="text-sm text-gray-600 dark:text-gray-400">
          {formattedDate}
        </time>
        {daily.title && <h1 className="mt-2">{daily.title}</h1>}
      </header>

      <MDXRenderer code={daily.body.code} />

      {daily.tags && daily.tags.length > 0 && (
        <footer className="mt-8">
          <TagsList tags={daily.tags} className="flex gap-2" />
        </footer>
      )}
    </article>
  );
}
