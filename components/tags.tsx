import Link from "next/link";

interface TagsListProps {
  tags: string[];
  showCounts?: boolean;
  counts?: Record<string, number>;
  className?: string;
}

export function TagsList({ tags, showCounts = false, counts = {}, className = "" }: TagsListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={`text-sm md:text-base flex flex-wrap not-prose ${className}`}>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tags/${tag.toLowerCase()}`}
          className="underline-offset-2 hover:underline pr-3"
        >
          #{tag}
          {showCounts && counts[tag] && counts[tag] > 1 ? ` (${counts[tag]})` : ""}
        </Link>
      ))}
    </div>
  );
} 