import Link from "next/link";
import Image from "next/image";
import { LinkedH2, LinkedH3 } from "components/headerLinks";

import type { MDXComponents } from "mdx/types";


export const mdxComponents: MDXComponents = {
  h2: LinkedH2,
  h3: LinkedH3,
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
};
