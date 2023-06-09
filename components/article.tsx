// Applies the shared tailwind prose styles to all spots
// where I need to render large chunks of text

type Props = {
  children: React.ReactNode;
};

const Article = ({ children }: Props) => {
  return (
    <article
      className="prose prose-stone dark:prose-invert
            prose-li:leading-relaxed prose-p:leading-relaxed

            prose-h2:pt-8

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

            mb-32">
      {children}
    </article>
  );
};

export default Article;
