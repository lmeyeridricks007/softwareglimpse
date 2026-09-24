"use client";

import { useSearchParams } from "next/navigation";
import { ComparisonBuilder } from "@/components/comparison/hub/comparison-builder";
import { ComparisonGrid } from "@/components/comparison/hub/comparison-grid";
import type { CompareHubCard, CompareHubProduct } from "@/services/compare-hub";

export function ComparisonBuilderFromQuery({
  products,
  publishedSlugs,
  validCategories,
}: {
  products: CompareHubProduct[];
  publishedSlugs: string[];
  validCategories: string[];
}) {
  const params = useSearchParams();
  const raw = params.get("category");
  const initialCategory = raw && validCategories.includes(raw) ? raw : null;
  return (
    <ComparisonBuilder
      key={initialCategory ?? "all"}
      products={products}
      publishedSlugs={publishedSlugs}
      initialCategory={initialCategory}
    />
  );
}

export function ComparisonGridFromQuery({
  comparisons,
  filterCategories,
}: {
  comparisons: CompareHubCard[];
  filterCategories: Array<{ slug: string; name: string }>;
}) {
  const params = useSearchParams();
  const raw = params.get("category");
  const initialCategory =
    raw && filterCategories.some((c) => c.slug === raw) ? raw : null;
  return (
    <ComparisonGrid
      key={initialCategory ?? "all"}
      comparisons={comparisons}
      filterCategories={filterCategories}
      initialCategory={initialCategory}
    />
  );
}
