"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { ProductLogo } from "@/components/software/product-logo";
import { Button } from "@/components/ui/button";
import type { CompareHubProduct } from "@/services/compare-hub";
import { canonicalizeComparisonSlug } from "@/domain";
import { track } from "@/analytics/events";
import { cn } from "@/lib/cn";

type Props = {
  products: CompareHubProduct[];
  publishedSlugs: string[];
  initialCategory?: string | null;
  className?: string;
};

export function ComparisonBuilder({
  products,
  publishedSlugs,
  initialCategory = null,
  className,
}: Props) {
  const router = useRouter();
  const [productA, setProductA] = useState<string>("");
  const [productB, setProductB] = useState<string>("");
  const [category, setCategory] = useState<string>(initialCategory ?? "");
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of products) {
      if (p.categorySlug && p.categoryLabel) {
        map.set(p.categorySlug, p.categoryLabel);
      }
    }
    return [...map.entries()].map(([slug, name]) => ({ slug, name }));
  }, [products]);

  const filtered = useMemo(() => {
    if (!category) return products;
    return products.filter((p) => p.categorySlug === category);
  }, [products, category]);

  function onCompare() {
    setError(null);
    if (!productA || !productB) {
      setError("Select two different products to compare.");
      return;
    }
    if (productA === productB) {
      setError("Choose two different products.");
      return;
    }
    track({
      name: "comparison_started",
      properties: { productA, productB, category: category || null },
    });
    const slug = canonicalizeComparisonSlug([productA, productB]);
    if (publishedSlugs.includes(slug)) {
      router.push(`/compare/${slug}/`);
      return;
    }
    router.push(
      `/compare/build/?a=${encodeURIComponent(productA)}&b=${encodeURIComponent(productB)}`,
    );
  }

  return (
    <div
      id="comparison-builder"
      className={cn(
        "scroll-mt-28 rounded-[var(--sg-radius-xl)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-5 py-6 shadow-[var(--sg-shadow-sm)] sm:px-7 sm:py-7",
        className,
      )}
    >
      <h2 className="font-[family-name:var(--font-display)] text-[length:var(--sg-text-h2)] font-semibold text-[var(--sg-color-navy)]">
        Build your own comparison
      </h2>
      <p className="mt-1 text-sm text-[var(--sg-color-text-muted)]">
        Pick two products and compare them on the same criteria.
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_minmax(10rem,12rem)_auto] xl:items-end">
        <ProductSelect
          id="product-a"
          label="Product A"
          value={productA}
          onChange={(slug) => {
            setProductA(slug);
            track({
              name: "comparison_builder_product_a_selected",
              properties: { product: slug },
            });
          }}
          products={filtered.filter((p) => p.slug !== productB)}
        />
        <p className="hidden pb-2.5 text-center text-xs font-bold uppercase tracking-wide text-[var(--sg-color-text-muted)] xl:block">
          vs
        </p>
        <ProductSelect
          id="product-b"
          label="Product B"
          value={productB}
          onChange={(slug) => {
            setProductB(slug);
            track({
              name: "comparison_builder_product_b_selected",
              properties: { product: slug },
            });
          }}
          products={filtered.filter((p) => p.slug !== productA)}
        />
        {categories.length > 0 ? (
          <div>
            <label
              htmlFor="compare-category"
              className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]"
            >
              Category (optional)
            </label>
            <select
              id="compare-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] px-3 text-sm"
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <Button
          type="button"
          size="lg"
          className="h-11 w-full xl:w-auto"
          onClick={onCompare}
        >
          Compare now →
        </Button>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-[var(--sg-color-danger)]" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[var(--sg-color-text-muted)] sm:justify-start">
        {[
          "Compare up to 2 products",
          "Based on the same criteria",
          "Only verified research data",
        ].map((label) => (
          <li key={label} className="inline-flex items-center gap-1.5">
            <Check
              className="size-3.5 shrink-0 text-[var(--sg-color-success)]"
              aria-hidden
            />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductSelect({
  id,
  label,
  value,
  onChange,
  products,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (slug: string) => void;
  products: CompareHubProduct[];
}) {
  const selected = products.find((p) => p.slug === value);
  return (
    <div>
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wide text-[var(--sg-color-text-muted)]"
      >
        {label}
      </label>
      <div className="relative mt-1.5">
        {selected ? (
          <span className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2">
            <ProductLogo
              name={selected.name}
              logo={selected.logo}
              size="sm"
              className="!size-5 !text-[10px]"
            />
          </span>
        ) : null}
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-11 w-full rounded-[var(--sg-radius-md)] border border-[var(--sg-color-border)] bg-[var(--sg-color-surface)] py-2 pr-3 text-sm",
            selected ? "pl-9" : "pl-3",
          )}
        >
          <option value="">Search or select software…</option>
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
              {p.categoryLabel ? ` · ${p.categoryLabel}` : ""}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
