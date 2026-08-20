"use client";

import { useMemo, useState } from "react";
import { ComparisonCard } from "@/components/comparison/hub/comparison-card";
import type { CompareHubCard } from "@/services/compare-hub";
import { cn } from "@/lib/cn";

type Props = {
  comparisons: CompareHubCard[];
  filterCategories: Array<{ slug: string; name: string }>;
  initialCategory?: string | null;
  /** Hide outer heading when nested in a shared discovery band. */
  hideHeading?: boolean;
  className?: string;
};

export function ComparisonGrid({
  comparisons,
  filterCategories,
  initialCategory = null,
  hideHeading = false,
  className,
}: Props) {
  const [category, setCategory] = useState<string | null>(initialCategory);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return comparisons.filter((c) => {
      if (category && c.categorySlug !== category) return false;
      if (!q) return true;
      const hay = [
        c.title,
        c.summary ?? "",
        c.productA.name,
        c.productB.name,
        c.categoryLabel ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [comparisons, category, query]);

  return (
    <div id="published-comparisons" className={cn("scroll-mt-28", className)}>
      {!hideHeading ? (
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
              Published software comparisons
            </h2>
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              Only approved comparisons appear here.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
            {comparisons.length > 0
              ? "Published comparisons"
              : "Published comparisons"}
          </h2>
          <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
            Only approved comparisons appear here.
          </p>
        </div>
      )}

      {filterCategories.length > 0 || comparisons.length > 3 ? (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {filterCategories.length > 0 ? (
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Filter by category"
            >
              <FilterChip
                active={category == null}
                label="All"
                onClick={() => setCategory(null)}
              />
              {filterCategories.map((c) => (
                <FilterChip
                  key={c.slug}
                  active={category === c.slug}
                  label={c.name}
                  onClick={() => setCategory(c.slug)}
                />
              ))}
            </div>
          ) : null}
          {comparisons.length > 3 ? (
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search comparisons..."
              className="h-10 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] px-3 text-sm sm:max-w-xs"
              aria-label="Search comparisons"
            />
          ) : null}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="mt-4 rounded-[var(--sg-radius-xl)] border border-dashed border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-4 py-5">
          <p className="text-sm font-medium text-[var(--sg-color-text)]">
            {comparisons.length === 0
              ? "Published comparisons will appear here as research is completed."
              : "No comparisons match your filters."}
          </p>
          <p className="mt-1.5 text-sm text-[var(--sg-color-text-muted)]">
            Use the builder above to pick two products now.
          </p>
          {category || query ? (
            <button
              type="button"
              className="mt-2 text-sm font-semibold text-[var(--sg-color-primary)]"
              onClick={() => {
                setCategory(null);
                setQuery("");
              }}
            >
              Clear filters
            </button>
          ) : null}
        </div>
      ) : (
        <ul
          className={cn(
            "mt-4 grid gap-3",
            filtered.length === 1 ? "max-w-sm" : "sm:grid-cols-2",
          )}
        >
          {filtered.map((c) => (
            <li key={c.slug}>
              <ComparisonCard comparison={c} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-[var(--sg-radius-pill)] px-3 py-1.5 text-sm font-medium",
        active
          ? "bg-[var(--sg-color-primary)] text-white"
          : "border border-[var(--sg-color-border)] text-[var(--sg-color-text-muted)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]",
      )}
    >
      {label}
    </button>
  );
}
