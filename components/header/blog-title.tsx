'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  title: string;
};

const BlogTitle = ({ title }: Props) => {
  const path = usePathname();

  return (
    <h2 className="inline-flex text-xl md:text-2xl font-bold tracking-tighter leading-tight">
      {path === "/" ? (
        title
      ) : (
        <Link href="/" className="hover:underline hover:decoration-2 underline-offset-4">
          {title}
        </Link>
      )}
    </h2>
  );
};

export default BlogTitle;
