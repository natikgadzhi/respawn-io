
// Applies the shared tailwind prose styles to all spots
// where I need to render large chunks of text

export default function Article({ children }) {
    return (
        <article className="prose prose-stone
            prose-li:leading-relaxed prose-p:leading-relaxed

            prose-h2:pt-8

            prose-a:text-blue-700

            prose-blockquote:border-blue-700
            prose-blockquote:boder-l-8

            prose-blockquote:font-normal
            prose-blockquote:not-italic
            prose-quoteless

            md:prose-lg lg:prose-xl

            mb-32">
            {children}
        </article>
    )
}