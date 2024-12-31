import { ReactNode, Children } from "react";

type AsideProps = {
  children: ReactNode;
  className?: string;
};

// A wrapper component that keeps a paragraph and its aside together
export function WithAside({ children }: { children: ReactNode }) {
  // Expect exactly two children: the paragraph and the aside
  const [paragraph, aside] = Children.toArray(children);
  
  return (
    <div className="relative">
      {paragraph}
      {aside}
    </div>
  );
}

export function Aside({ children, className = "" }: AsideProps) {
  return (
    <aside
      className={`
        text-sm text-stone-600 dark:text-stone-400
        
        mt-4
        mx-8
        max-w-xl

        xl:mt-0
        xl:mx-0
        xl:text-left
        xl:max-w-none
        xl:absolute
        xl:-right-72
        xl:w-56
        xl:top-0
        xl:pl-8

        [&>p]:mt-0
        [&>p]:mb-0

        ${className}
      `}
    >
      {children}
    </aside>
  );
} 