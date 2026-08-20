"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import type { CompareHubProduct } from "@/services/compare-hub";
import { canonicalizeComparisonSlug } from "@/domain";
import { cn } from "@/lib/cn";

type Suggestion = {
  product: CompareHubProduct;
  compareWith: CompareHubProduct[];
};

type Props = {
  products: CompareHubProduct[];
  suggestions: Suggestion[];
  publishedSlugs: string[];
  className?: string;
};

export function ProductComparisonSuggestions({
  products,
  suggestions,
  publishedSlugs,
  className,
}: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(suggestions[0]?.product.slug ?? "");

  const active = useMemo(() => {
    const fromSuggestions = suggestions.find((s) => s.product.slug === selected);
    if (fromSuggestions) return fromSuggestions;
    const product = products.find((p) => p.slug === selected);
    if (!product) return null;
    const peers = products
      .filter(
        (p) =>
          p.slug !== product.slug &&
          (!product.categorySlug || p.categorySlug === product.categorySlug),
      )
      .slice(0, 5);
    return { product, compareWith: peers };
  }, [selected, suggestions, products]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.filter((p) => p.categorySlug === "crm").slice(0, 6);
    return products
      .filter((p) => p.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [products, query]);

  if (products.length === 0) return null;

  return (
    <div className={cn(className)}>
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        Start with a software product
      </h2>
      <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
        Already know one product? Jump to comparisons with alternatives.
      </p>

      <label className="sr-only" htmlFor="product-first-search">
        Search software
      </label>
      <input
        id="product-first-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search software..."
        className="mt-4 h-11 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 text-sm"
      />

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]">
        CRM products
      </p>
      <ul className="mt-2 overflow-hidden rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)]">
        {matches.map((p, i) => (
          <li
            key={p.slug}
            className={cn(
              i > 0 && "border-t border-[var(--sg-color-border)]",
            )}
          >
            <button
              type="button"
              onClick={() => setSelected(p.slug)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-[var(--sg-color-surface-muted)]/60",
                selected === p.slug && "bg-[var(--sg-color-primary-soft)]/50",
              )}
            >
              <ProductLogo
                name={p.name}
                logo={p.logo}
                size="sm"
                className="!size-7"
              />
              <span className="min-w-0 flex-1 font-medium text-[var(--sg-color-text)]">
                {p.name}
              </span>
              <ChevronRight
                className="size-4 text-[var(--sg-color-text-muted)]"
                aria-hidden
              />
            </button>
          </li>
        ))}
      </ul>

      {active ? (
        <div className="mt-4">
          <p className="text-sm font-semibold text-[var(--sg-color-navy)]">
            Compare {active.product.name} with:
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {active.compareWith.map((peer) => {
              const slug = canonicalizeComparisonSlug([
                active.product.slug,
                peer.slug,
              ]);
              const href = publishedSlugs.includes(slug)
                ? `/compare/${slug}/`
                : `/compare/build/?a=${encodeURIComponent(active.product.slug)}&b=${encodeURIComponent(peer.slug)}`;
              return (
                <li key={peer.slug}>
                  <Link
                    href={href}
                    className="inline-flex items-center gap-2 rounded-[var(--sg-radius-pill)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 py-1.5 text-sm font-medium transition hover:border-[var(--sg-color-primary)] hover:text-[var(--sg-color-primary)]"
                  >
                    <ProductLogo
                      name={peer.name}
                      logo={peer.logo}
                      size="sm"
                      className="!size-5"
                    />
                    {peer.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
