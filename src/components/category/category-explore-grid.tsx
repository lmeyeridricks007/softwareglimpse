import type { LucideIcon } from "lucide-react";
import {
  CategoryExplorePaths,
  type ExplorePathItem,
} from "./category-explore-paths";

export type ExploreCardItem = {
  href: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
};

/**
 * Legacy explore grid — maps simple cards into CategoryExplorePaths.
 * Prefer CategoryExplorePaths for new hubs.
 */
export function CategoryExploreGrid({
  title,
  items,
  className,
}: {
  title: string;
  items: ExploreCardItem[];
  className?: string;
}) {
  const mapped: ExplorePathItem[] = items.map((item, index) => ({
    id: item.href || String(index),
    title: item.title,
    description: item.description ?? "",
    href: item.href,
    ctaLabel: "Explore",
    tone: "blue",
    icon: undefined,
  }));

  return (
    <CategoryExplorePaths
      title={title}
      items={mapped}
      className={className}
    />
  );
}
