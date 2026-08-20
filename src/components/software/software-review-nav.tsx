"use client";

import {
  SectionAnchorNav,
  type SectionNavItem,
} from "@/components/navigation/section-anchor-nav";

export type ReviewNavItem = {
  id: string;
  label: string;
  icon?: string;
};

type Props = {
  items: ReviewNavItem[];
  className?: string;
};

export function SoftwareReviewNav({ items, className }: Props) {
  const navItems: SectionNavItem[] = items.map((item) => ({
    id: item.id,
    label: item.label,
    icon: item.icon ?? item.id,
  }));

  return (
    <SectionAnchorNav
      items={navItems}
      ariaLabel="On this review"
      className={className}
    />
  );
}
