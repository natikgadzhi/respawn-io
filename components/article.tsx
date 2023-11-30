// Applies the shared tailwind prose styles to all spots
// where I need to render large chunks of text

type Props = {
  children: React.ReactNode;
};

const Article = ({ children }: Props) => {
  return (
    <article
      className="prose prose-slate dark:prose-invert
            prose-li:leading-relaxed prose-p:leading-relaxed

            text-stone-950
            dark:text-gray-50
            prose-h2:pt-8
            lg:prose-p:mb-10

            prose-a:text-blue-700
            prose-a:dark:text-sky-400

            prose-blockquote:border-blue-700
            prose-blockquote:dark:border-sky-400
            prose-blockquote:boder-l-8

            prose-blockquote:font-normal
            prose-blockquote:not-italic
            prose-quoteless

            md:prose-lg lg:prose-xl

            prose-pre:not-prose
            prose-pre:text-sm

            mb-32">
      {children}
    </article>
  );
};

export default Article;
