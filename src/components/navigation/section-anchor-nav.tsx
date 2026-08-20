"use client";

import { useEffect, useState } from "react";
import {
  Boxes,
  Building2,
  CircleHelp,
  ClipboardList,
  Clock,
  Compass,
  GitCompare,
  LayoutGrid,
  ListChecks,
  Puzzle,
  Scale,
  Sparkles,
  Star,
  Tags,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";

export type SectionNavItem = {
  id: string;
  label: string;
  /** Optional lucide icon name key resolved on the client. */
  icon?: string;
};

const ICON_MAP: Record<string, LucideIcon> = {
  overview: LayoutGrid,
  explore: Compass,
  features: Sparkles,
  pricing: Wallet,
  "pros-cons": ListChecks,
  choose: ListChecks,
  "use-cases": Tags,
  capabilities: Sparkles,
  industries: Building2,
  resources: ClipboardList,
  checklist: ClipboardList,
  users: Users,
  alternatives: Boxes,
  comparisons: GitCompare,
  faq: CircleHelp,
  methodology: Scale,
  star: Star,
  clock: Clock,
  puzzle: Puzzle,
};

/** Soft accent colors so category/local nav icons are not monochrome. */
const ICON_TONE: Record<string, string> = {
  overview: "text-sky-600",
  explore: "text-violet-600",
  software: "text-amber-600",
  star: "text-amber-600",
  compare: "text-fuchsia-600",
  comparisons: "text-fuchsia-600",
  "use-cases": "text-emerald-600",
  capabilities: "text-violet-600",
  "business-types": "text-sky-600",
  users: "text-sky-600",
  industries: "text-teal-600",
  resources: "text-cyan-700",
  checklist: "text-cyan-700",
  pricing: "text-orange-600",
  guides: "text-blue-600",
  features: "text-blue-600",
  tools: "text-indigo-600",
  puzzle: "text-indigo-600",
  faq: "text-rose-600",
};

type Props = {
  items: SectionNavItem[];
  ariaLabel?: string;
  className?: string;
};

/**
 * Sticky horizontal section anchors with scroll-spy.
 * Icons are resolved by string key so Server Components can pass plain data.
 */
export function SectionAnchorNav({
  items,
  ariaLabel = "On this page",
  className,
}: Props) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;

    const observers: IntersectionObserver[] = [];
    const visible = new Map<string, number>();

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (!el) continue;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;
          visible.set(
            item.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
          let bestId = items[0]?.id ?? "";
          let best = -1;
          for (const [id, ratio] of visible) {
            if (ratio > best) {
              best = ratio;
              bestId = id;
            }
          }
          if (best > 0) setActive(bestId);
        },
        { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] },
      );
      observer.observe(el);
      observers.push(observer);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "sticky top-16 z-20 -mx-4 border-y border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]/95 px-4 backdrop-blur-sm sm:-mx-6 sm:px-6",
        className,
      )}
    >
      <ul className="flex gap-1 overflow-x-auto py-2">
        {items.map((item) => {
          const Icon = ICON_MAP[item.icon ?? item.id];
          const isActive = active === item.id;
          return (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-[var(--sg-radius-md)] px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--sg-color-primary-soft)] text-[var(--sg-color-primary-hover)]"
                    : "text-[var(--sg-color-text-muted)] hover:bg-[var(--sg-color-surface-muted)] hover:text-[var(--sg-color-text)]",
                )}
                aria-current={isActive ? "location" : undefined}
              >
                {Icon ? (
                  <Icon
                    className={cn(
                      "size-3.5",
                      isActive
                        ? "text-[var(--sg-color-primary)]"
                        : ICON_TONE[item.icon ?? item.id] ??
                            "text-[var(--sg-color-text-muted)]",
                    )}
                    aria-hidden
                  />
                ) : null}
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
