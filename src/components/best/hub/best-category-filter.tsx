"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Section } from "@/components/layout/section";
import { cn } from "@/lib/cn";

export type BestCategoryFilterItem = {
  slug: string;
  name: string;
  href: string;
  hasBestPage: boolean;
};

type Props = {
  categories: BestCategoryFilterItem[];
  bestHrefByCategory?: Record<string, string>;
  className?: string;
};

export function BestCategoryFilter({
  categories,
  bestHrefByCategory = {},
  className,
}: Props) {
  const [active, setActive] = useState<string>("all");

  const visible = useMemo(() => {
    const priority = categories.filter((c) => c.hasBestPage);
    const rest = categories.filter((c) => !c.hasBestPage);
    return [...priority, ...rest].slice(0, 6);
  }, [categories]);

  return (
    <Section
      id="browse-best"
      padding="sm"
      background="default"
      container="wide"
      className={cn("scroll-mt-24", className)}
      bordered
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        Browse Best Software
      </p>
      <div className="mt-3 -mx-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={cn(
            "shrink-0 rounded-[var(--sg-radius-pill)] px-4 py-2 text-sm font-semibold transition",
            active === "all"
              ? "bg-[var(--sg-color-primary)] text-white"
              : "border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-[var(--sg-color-text-muted)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]",
          )}
        >
          All
        </button>
        {visible.map((c) => {
          const href = bestHrefByCategory[c.slug] ?? c.href;
          const isActive = active === c.slug;
          return (
            <Link
              key={c.slug}
              href={href}
              onClick={() => setActive(c.slug)}
              className={cn(
                "shrink-0 rounded-[var(--sg-radius-pill)] px-4 py-2 text-sm font-semibold transition",
                isActive
                  ? "bg-[var(--sg-color-primary)] text-white"
                  : "border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-[var(--sg-color-text-muted)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]",
              )}
            >
              {c.name}
            </Link>
          );
        })}
        <Link
          href="/categories/"
          className="shrink-0 rounded-[var(--sg-radius-pill)] border border-dashed border-[var(--sg-color-border)] px-4 py-2 text-sm font-semibold text-[var(--sg-color-text-muted)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
        >
          More
        </Link>
      </div>
    </Section>
  );
}
