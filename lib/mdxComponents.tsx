import { LinkedH2, LinkedH3 } from "components/headerLinks";
import { Aside, WithAside } from "components/aside";
import Image from "next/image";
import Script from "next/script";
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
  
  img: ({ src, alt, className }) => {

    const ignorePatterns = ["https://media0.giphy.com/media/", "data:image/svg+xml;base64,"];

    if (ignorePatterns.some(pattern => src.startsWith(pattern))) {
      return (
        <img src={src} alt={alt} className={`${className} mx-auto block`} />
      )
    }

    return (
      <span className="inline-block relative w-full pb-[56.25%] max-h-[800px]">
        <Image
          src={`/${src}`}
          alt={alt}
          fill={true}
          className={className}
          style={{ objectFit: "contain", margin: "0px" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </span>
    )
  },
  
  // Handle iframe elements with correct React property casing
  iframe: (props: any) => {
    // Create a new props object with properly cased React properties
    const safeProps = {
      ...props,
      frameBorder: props.frameBorder || "0",
      allowFullScreen: props.allowFullScreen || true,
    };
    
    // Handle any HTML-style lowercase attributes that might be in the MDX
    if ('frameborder' in props) {
      safeProps.frameBorder = props.frameborder;
      delete safeProps.frameborder;
    }
    
    if ('allowfullscreen' in props) {
      safeProps.allowFullScreen = props.allowfullscreen;
      delete safeProps.allowfullscreen;
    }
    
    return <iframe {...safeProps} />;
  },
  
  Script: ({ src }) => <Script src={src} />,
  Aside,
  WithAside,
};
