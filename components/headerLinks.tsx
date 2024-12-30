import type { ReactNode } from "react";
import Link from "next/link";

const makeID = (input: ReactNode | string) => {
  return input.toString().toLowerCase().replace(/[^\w]/g, "-");
};

type HeaderProps = {
  children: React.ReactNode;
  className?: string;
};

// Base styles for all linked headers
const baseHeaderStyles = `
  group relative
  before:content-['#']
  before:absolute
  before:-left-5
  before:opacity-0
  before:transition-opacity
  before:duration-100
  hover:before:opacity-100
`;

// Common link styles for header anchors
const headerLinkStyles = `
  no-underline
  hover:no-underline
  not-prose
`;

export const LinkedH2 = ({ children, className }: HeaderProps) => {
  const id = makeID(children);
  return (
    <h2 id={id} className={`${baseHeaderStyles} ${className || ""}`}>
      <Link href={`#${id}`} className={headerLinkStyles}>
        {children}
      </Link>
    </h2>
  );
};

export const LinkedH3 = ({ children, className }: HeaderProps) => {
  const id = makeID(children);
  return (
    <h3 id={id} className={`${baseHeaderStyles} ${className || ""}`}>
      <Link href={`#${id}`} className={headerLinkStyles}>
        {children}
      </Link>
    </h3>
  );
};

export const LinkedH4 = ({ children, className }: HeaderProps) => {
  const id = makeID(children);
  return (
    <h4 id={id} className={`${baseHeaderStyles} ${className || ""}`}>
      <Link href={`#${id}`} className={headerLinkStyles}>
        {children}
      </Link>
    </h4>
  );
};
