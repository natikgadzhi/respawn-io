// Applies the shared tailwind prose styles to all spots
// where I need to render large chunks of text
type Props = {
  children: React.ReactNode;
};

const Article = ({ children }: Props) => {
  return (
    <article
      className="prose prose-slate
            dark:prose-invert

            prose-li:leading-relaxed
            prose-p:leading-relaxed

            text-stone-700
            dark:text-gray-300

            prose-h1:text-3xl

            prose-h2:pt-6
            prose-h2:text-2xl
            prose-h2:font-semibold

            prose-p3:pt-5

            prose-p:last-of-type:mb-0

            lg:prose-p:mb-8

            prose-a:text-blue-600
            prose-a:dark:text-sky-300

            prose-blockquote:border-blue-600
            prose-blockquote:dark:border-blue-400
            prose-blockquote:border-l-4

            prose-blockquote:font-normal
            prose-blockquote:not-italic
            prose-quoteless

            md:prose-base
            lg:prose-base

            prose-pre:not-prose
            prose-pre:text-sm

            mb-24"
    >
      {children}
    </article>
  );
};

export default Article;
