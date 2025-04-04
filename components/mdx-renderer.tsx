import { mdxComponents } from "lib/mdxComponents";
import { getMDXComponent } from "next-contentlayer2/hooks";

interface MDXRendererProps {
  code: string;
}

export function MDXRenderer({ code }: MDXRendererProps) {
  const MDXContent = getMDXComponent(code);
  return <MDXContent components={mdxComponents} />;
} 