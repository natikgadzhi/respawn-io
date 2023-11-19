import Link, { LinkProps } from "next/link";
import { LinkIcon } from "components/icons";
import { ReactNode } from "react";

const makeID = (input: ReactNode | string) => {
  return input.toString().toLowerCase().replace(/[^\w]/g, "-");
}

type HeaderProps = {
  children: React.ReactNode;
  className?: string;
}

type HeaderLinkProps = {
  id: string;
  linkPosition?: string;
};

const defaultLinkProps = {
  id: "",
  linkPosition: "-left-10 top-9",
}

export const HeaderLink = ({ id, linkPosition}: HeaderLinkProps = defaultLinkProps) => (
  <Link
    href={`#${id}`}
    className={`not-prose hidden md:inline-block absolute ${linkPosition} p-1
      opacity-70 hover:opacity-100 transition-opacity duration-100
      hover:outline hover:outline-offset-1 hover:outline-1 hover:rounded-md
    hover:outline-stone-500 hover:dark:outline-blue-100`}>
    <LinkIcon />
  </Link>
);

export const LinkedH2 = ({children, className}: HeaderProps) => {
  const id = makeID(children);
  return (
    <>
      <h2 id={id} className={`${className} relative`}>
        <HeaderLink id={id} linkPosition="-left-10 top-9" />
        {children}
      </h2>
    </>
  );
};

export const LinkedH3 = ({ children, className }: HeaderProps) => {
  const id = makeID(children);
  return (
    <>
      <h3 id={id} className={`${className} relative`}>
        <HeaderLink id={id} linkPosition="-left-10 top-1" />
        {children}
      </h3>
    </>
  );
};

export const LinkedH4 = ({ children, className }: HeaderProps) => {
  const id = makeID(children);
  return (
    <>
      <h4 id={id} className={`${className} relative`}>
        <HeaderLink id={id} linkPosition="-left-10 -top-1" />
        {children}
      </h4>
    </>
  );
};
