import Link from "next/link";
import Image from "next/image";
import Callout from "components/callout";
import { LinkIcon } from "components/icons";

import type { MDXComponents } from "mdx/types";

const HeaderLink = ({ id }: { id: string }) => (
  <Link
    href={`#${id}`}
    className="not-prose hidden md:inline-block absolute -left-10 top-9 p-1
      opacity-70 hover:opacity-100 transition-opacity duration-100
      hover:outline hover:outline-offset-1 hover:outline-1 hover:rounded-md
    hover:outline-stone-500 hover:dark:outline-blue-100">
    <LinkIcon />
  </Link>
);

export const mdxComponents: MDXComponents = {
  h2: ({ children }) => {
    const id = children.toString().toLowerCase().replace(/[^\w]/g, "-");
    return (
      <>
        <h2 id={id} className="relative">
          <HeaderLink id={id} />
          {children}
        </h2>
      </>
    );
  },
  h3: ({ children }) => {
    const id = children.toString().toLowerCase().replace(/[^\w]/g, "-");
    return (
      <>
        <h3 id={id} className="relative">
          <HeaderLink id={id} />
          {children}
        </h3>
      </>
    );
  },
  a: ({ href, children }) => <Link href={href as string}>{children}</Link>,
  img: ({ src, alt }) => (
    <span className="inline-block relative w-full pb-[56.25%] max-h-[800px]">
      <Image
        src={"/" + src}
        alt={alt}
        fill={true}
        style={{ objectFit: "contain", margin: "0px" }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </span>
  ),
  Callout,
};
