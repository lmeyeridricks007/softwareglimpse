"use client";

import Link from "next/link";
import { trackSearchEvent } from "@/services/search/analytics";
import type { SearchFilterType, SearchTypeCount } from "@/services/search/types";
import { cn } from "@/lib/cn";

type Props = {
  query: string;
  total: number;
  counts: SearchTypeCount[];
  activeType: SearchFilterType;
};

export function SearchFilters({ query, total, counts, activeType }: Props) {
  const chips: Array<{ type: SearchFilterType; label: string; count: number }> =
    [
      { type: "all", label: "All", count: total },
      ...counts.map((c) => ({
        type: c.type as SearchFilterType,
        label: c.label,
        count: c.count,
      })),
    ];

  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--sg-color-text-muted)]" aria-live="polite">
        <span className="font-semibold text-[var(--sg-color-text)]">{total}</span>{" "}
        {total === 1 ? "result" : "results"} for “{query}”
      </p>
      <div
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        role="tablist"
        aria-label="Filter by result type"
      >
        {chips.map((chip) => {
          const href =
            chip.type === "all"
              ? `/search/?q=${encodeURIComponent(query)}`
              : `/search/?q=${encodeURIComponent(query)}&type=${chip.type}`;
          const active = activeType === chip.type;
          return (
            <Link
              key={chip.type}
              href={href}
              role="tab"
              aria-selected={active}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-[var(--sg-radius-pill)] border px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-[var(--sg-color-primary)] bg-[var(--sg-color-primary)] text-white"
                  : "border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-[var(--sg-color-text-muted)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]",
              )}
              onClick={() =>
                trackSearchEvent("search_filter_used", {
                  query,
                  filter: chip.type,
                })
              }
            >
              {chip.label}
              <span className={cn(active ? "text-white/80" : "text-[var(--sg-color-text-muted)]")}>
                {chip.count}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
