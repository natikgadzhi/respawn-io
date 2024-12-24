import { LinkedH2, LinkedH3 } from "components/headerLinks";
import Image from "next/image";
import Link from "next/link";
import { titleCase } from "./titleCase";

import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  // While post titles are title cased automatically in `post.formattedTitle`,
  // the <Article /> will just pass the whole body of the post into MDX, and
  // the body of the post has the title in h1 in the first line.
  //
  // Plus, we generally want titles to be title cased, so why not.
  // TODO: Do we want this for h2 as well?
  h1: ({ children }) => <h1>{titleCase(children)}</h1>,
  h2: LinkedH2,
  h3: LinkedH3,
  a: ({ href, children }) => (
    <Link className="underline underline-offst-2" href={href as string}>
      {children}
    </Link>
  ),
  img: ({ src, alt }) => (
    <span className="inline-block relative w-full pb-[56.25%] max-h-[800px]">
      <Image
        src={`/${src}`}
        alt={alt}
        fill={true}
        style={{ objectFit: "contain", margin: "0px" }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </span>
  ),
};
