"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { withSingleArrow } from "@/components/category/hub-icons";
import { ProductLogo } from "@/components/software/product-logo";
import { FeatureChecklist } from "@/components/software/software-card";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { CategoryHubProductCard } from "@/services/category-hub";

const PAGE_SIZE = 10;

type SortMode = "top-rated" | "best-picks" | "recent" | "az";

type Props = {
  title: string;
  items: CategoryHubProductCard[];
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
};

export function CategoryProductGrid({
  title,
  items,
  viewAllHref,
  viewAllLabel,
  className,
}: Props) {
  const hasBestPicks = items.some((item) => item.isBestPick);
  const interactive = items.length > PAGE_SIZE;

  const [sort, setSort] = useState<SortMode>("top-rated");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [sort, query]);

  useEffect(() => {
    if (sort === "best-picks" && !hasBestPicks) {
      setSort("top-rated");
    }
  }, [sort, hasBestPicks]);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = items.filter((item) => {
    if (sort === "best-picks" && !item.isBestPick) return false;
    if (!normalizedQuery) return true;
    const hay = [
      item.name,
      item.positioning ?? "",
      item.bestFor ?? "",
      ...item.strengths,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(normalizedQuery);
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "az") return a.name.localeCompare(b.name);
    if (sort === "recent") {
      const aTime = a.updatedAt ?? "";
      const bTime = b.updatedAt ?? "";
      if (bTime !== aTime) return bTime.localeCompare(aTime);
      return a.name.localeCompare(b.name);
    }
    // top-rated + best-picks: score desc, then name
    const scoreA = a.overallScore ?? -1;
    const scoreB = b.overallScore ?? -1;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return a.name.localeCompare(b.name);
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = interactive
    ? sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    : sorted;
  const rangeStart =
    sorted.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, sorted.length);

  return (
    <section
      id="software"
      aria-labelledby="product-grid-heading"
      className={cn("scroll-mt-28", className)}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2
            id="product-grid-heading"
            className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-text)]"
          >
            {title}
          </h2>
          {interactive ? (
            <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
              Sort, search, and browse {items.length} catalogue products.
            </p>
          ) : null}
        </div>
        {viewAllHref && items.length > 0 ? (
          <Link
            href={viewAllHref}
            className="text-sm font-medium text-[var(--sg-color-primary)] underline-offset-2 hover:underline"
          >
            {withSingleArrow(viewAllLabel ?? "View all")}
          </Link>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="mt-5 max-w-2xl text-sm text-[var(--sg-color-text-muted)] sm:text-base">
          We&apos;re still adding primary products in this category. Use
          Finder or Compare to explore options from the wider catalogue.
        </p>
      ) : (
        <>
          {interactive ? (
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Sort products"
              >
                <SortChip
                  active={sort === "top-rated"}
                  label="Top rated"
                  onClick={() => setSort("top-rated")}
                />
                {hasBestPicks ? (
                  <SortChip
                    active={sort === "best-picks"}
                    label="Best picks"
                    onClick={() => setSort("best-picks")}
                  />
                ) : null}
                <SortChip
                  active={sort === "recent"}
                  label="Recently updated"
                  onClick={() => setSort("recent")}
                />
                <SortChip
                  active={sort === "az"}
                  label="A–Z"
                  onClick={() => setSort("az")}
                />
              </div>

              <label className="relative block w-full sm:max-w-xs">
                <span className="sr-only">Search products</span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name or fit…"
                  className="h-9 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 text-sm text-[var(--sg-color-text)] outline-none placeholder:text-[var(--sg-color-text-muted)] focus:border-[var(--sg-color-primary)]"
                />
              </label>
            </div>
          ) : null}

          {interactive ? (
            <p
              className="mt-3 text-sm text-[var(--sg-color-text-muted)]"
              aria-live="polite"
            >
              {sorted.length === 0 ? (
                <>No products match your search.</>
              ) : (
                <>
                  Showing{" "}
                  <span className="font-medium text-[var(--sg-color-text)]">
                    {rangeStart}–{rangeEnd}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-[var(--sg-color-text)]">
                    {sorted.length}
                  </span>
                  {normalizedQuery || sort === "best-picks"
                    ? " matching"
                    : ""}{" "}
                  {sorted.length === 1 ? "product" : "products"}
                </>
              )}
            </p>
          ) : null}

          {pageItems.length === 0 ? (
            <p className="mt-5 text-sm text-[var(--sg-color-text-muted)]">
              Try a different search or sort, or browse the full catalogue link
              above.
            </p>
          ) : (
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
              {pageItems.map((item) => (
                <li key={item.slug}>
                  <ProductCard item={item} />
                </li>
              ))}
            </ul>
          )}

          {interactive && totalPages > 1 ? (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <p className="text-sm text-[var(--sg-color-text-muted)]">
                Page{" "}
                <span className="font-medium text-[var(--sg-color-text)]">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-medium text-[var(--sg-color-text)]">
                  {totalPages}
                </span>
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

function ProductCard({ item }: { item: CategoryHubProductCard }) {
  return (
    <Card className="flex h-full flex-col p-4">
      <div className="flex items-center gap-3">
        <ProductLogo name={item.name} logo={item.logo} size="md" />
        <p className="min-w-0 truncate font-semibold text-[var(--sg-color-text)]">
          {item.name}
        </p>
      </div>

      {item.positioning ? (
        <span
          className="mt-2.5 inline-flex w-fit max-w-full items-center truncate rounded-[var(--sg-radius-md)] bg-[var(--sg-color-primary-soft)] px-2 py-0.5 text-[11px] font-medium tracking-wide text-[var(--sg-color-primary-hover)]"
          title={item.positioning}
        >
          {item.positioning}
        </span>
      ) : null}

      {item.bestFor ? (
        <p className="mt-3 text-sm text-[var(--sg-color-text-muted)]">
          <span className="font-medium text-[var(--sg-color-text)]">
            Best for:{" "}
          </span>
          {item.bestFor}
        </p>
      ) : null}

      {item.strengths.length > 0 ? (
        <div className="mt-3">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--sg-color-text-muted)]">
            Key strengths
          </p>
          <FeatureChecklist items={item.strengths} className="mt-1" />
        </div>
      ) : null}

      {item.pricingTeaser ? (
        <p className="mt-3 text-sm font-medium text-[var(--sg-color-text)]">
          {item.pricingTeaser}
          {item.pricingVerifiedAt ? (
            <span className="ml-1 text-xs font-normal text-[var(--sg-color-text-muted)]">
              (verified {item.pricingVerifiedAt.slice(0, 10)})
            </span>
          ) : null}
        </p>
      ) : null}

      <div className="mt-auto flex flex-wrap gap-2 pt-4">
        <ButtonLink href={item.reviewHref} size="sm">
          Read review
        </ButtonLink>
        <ButtonLink href={item.compareHref} variant="outline" size="sm">
          Compare
        </ButtonLink>
      </div>
    </Card>
  );
}

function SortChip({
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
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-[var(--sg-radius-md)] px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-[var(--sg-color-primary)] text-white shadow-[var(--sg-shadow-sm)]"
          : "border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] text-[var(--sg-color-text-muted)] hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]",
      )}
    >
      {label}
    </button>
  );
}
