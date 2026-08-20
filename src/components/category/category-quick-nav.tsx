"use client";

import { SectionAnchorNav, type SectionNavItem } from "@/components/navigation/section-anchor-nav";
import { cn } from "@/lib/cn";

type Props = {
  items: SectionNavItem[];
  className?: string;
};

/** Sticky category section nav — only destinations that exist on the page. */
export function CategoryQuickNav({ items, className }: Props) {
  if (items.length === 0) return null;
  return (
    <SectionAnchorNav
      items={items}
      ariaLabel="Category sections"
      className={cn("mt-6 rounded-[var(--sg-radius-lg)]", className)}
    />
  );
}
