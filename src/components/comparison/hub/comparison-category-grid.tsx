"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/category/category-icon";
import { ProductLogo } from "@/components/software/product-logo";
import type { CompareHubCategory } from "@/services/compare-hub";
import { track } from "@/analytics/events";
import { cn } from "@/lib/cn";

type Props = {
  categories: CompareHubCategory[];
  /** Compact list for side-by-side discovery band (mockup). */
  variant?: "grid" | "list";
  className?: string;
};

export function ComparisonCategoryGrid({
  categories,
  variant = "grid",
  className,
}: Props) {
  if (categories.length === 0) return null;

  if (variant === "list") {
    return (
      <div className={cn(className)}>
        <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
          Browse by category
        </h2>
        <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
          Jump into categories with product coverage.
        </p>
        <ul className="mt-4 divide-y divide-[var(--sg-color-border)] overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={cat.href}
                onClick={() =>
                  track({
                    name: "comparison_category_clicked",
                    properties: { category: cat.slug },
                  })
                }
                className="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-[var(--sg-color-surface-muted)]/60"
              >
                <CategoryIcon categoryId={cat.slug} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                    {cat.name}
                  </span>
                  <span className="block text-xs text-[var(--sg-color-text-muted)]">
                    {cat.comingSoon
                      ? "Comparisons coming soon"
                      : `${cat.comparisonCount} ${cat.comparisonCount === 1 ? "comparison" : "comparisons"}`}
                  </span>
                </span>
                {cat.popularProducts.slice(0, 2).map((p) => (
                  <ProductLogo
                    key={p.slug}
                    name={p.name}
                    logo={p.logo}
                    size="sm"
                    className="hidden !size-6 sm:inline-flex"
                  />
                ))}
                <ArrowRight
                  className="size-4 shrink-0 text-[var(--sg-color-text-muted)] transition group-hover:text-[var(--sg-color-primary)]"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        What do you want to compare?
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-[var(--sg-color-text-muted)]">
        Browse by category — published comparison counts grow as research is
        completed.
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={cat.href}
              onClick={() =>
                track({
                  name: "comparison_category_clicked",
                  properties: { category: cat.slug },
                })
              }
              className="group flex h-full flex-col rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] p-5 shadow-[var(--sg-shadow-sm)] transition hover:border-[var(--sg-color-primary)] hover:shadow-[var(--sg-shadow-md)]"
            >
              <CategoryIcon categoryId={cat.slug} size="md" />
              <h3 className="mt-3 font-semibold text-[var(--sg-color-text)] group-hover:text-[var(--sg-color-primary)]">
                {cat.name}
              </h3>
              {cat.description ? (
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-[var(--sg-color-text-muted)]">
                  {cat.description}
                </p>
              ) : (
                <span className="flex-1" />
              )}
              {cat.popularProducts.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {cat.popularProducts.map((p) => (
                    <li
                      key={p.slug}
                      className="inline-flex items-center gap-1.5 rounded-[var(--sg-radius-pill)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface-muted)] px-2 py-1 text-[11px] font-medium"
                    >
                      <ProductLogo
                        name={p.name}
                        logo={p.logo}
                        size="sm"
                        className="!size-4"
                      />
                      {p.name}
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="mt-3 text-xs font-medium text-[var(--sg-color-text-muted)]">
                {cat.comingSoon
                  ? "Comparisons coming soon"
                  : `${cat.comparisonCount} ${cat.comparisonCount === 1 ? "comparison" : "comparisons"}`}
              </p>
              <p className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[var(--sg-color-primary)]">
                {cat.comingSoon ? "Explore category" : "Explore comparisons"}
                <ArrowRight
                  className="size-3.5 transition-transform motion-safe:group-hover:translate-x-0.5"
                  aria-hidden
                />
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
