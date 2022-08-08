
// Applies the shared tailwind prose styles to all spots
// where I need to render large chunks of text

export default function Article({ children }) {
    return (
        <article className="prose prose-neutral
            prose-li:leading-relaxed prose-p:leading-relaxed

            prose-h2:italic
            prose-h2:pt-8

            md:prose-lg lg:prose-xl

            mb-32">
            { children }
        </article>
    )
}