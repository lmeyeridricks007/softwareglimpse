import type { Metadata } from "next";
import { Suspense } from "react";
import {
  CompareBuildClient,
  type CompareBuildProduct,
} from "@/components/comparison/compare-build-client";
import { getSoftware, getAllComparisonsUnfiltered } from "@/data";
import {
  formatMoney,
  fromMajor,
  isCanonicalComparisonSlug,
  type CurrencyCode,
} from "@/domain";
import { isEntityIndexable } from "@/domain/quality-gates";
import { buildPageMetadata } from "@/seo/metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Build a software comparison",
    description:
      "Compare two software products using verified SoftwareGlimpse recommendations when available.",
    path: "/compare/build/",
    indexable: false,
  });
}

function priceLabel(product: {
  pricing?: { startingPriceMonthly?: number | null; currency?: string | null } | null;
}): string {
  const pricing = product.pricing;
  if (!pricing || pricing.startingPriceMonthly == null) return "Not yet verified";
  const currency = (pricing.currency ?? "USD") as CurrencyCode;
  return `${formatMoney(fromMajor(pricing.startingPriceMonthly, currency))}/user/mo`;
}

export default function CompareBuildPage() {
  const products: CompareBuildProduct[] = getSoftware().map((product) => ({
    slug: product.slug,
    name: product.name,
    logo: product.logo ?? null,
    primaryCategorySlug: product.primaryCategorySlug,
    bestFor: product.bestFor[0] ?? null,
    priceLabel: priceLabel(product),
  }));

  const publishedSlugs: string[] = [];
  for (const comparison of getAllComparisonsUnfiltered()) {
    if (!isEntityIndexable({ kind: "comparison", entity: comparison })) continue;
    if (!isCanonicalComparisonSlug(comparison.slug)) continue;
    publishedSlugs.push(comparison.slug);
  }

  return (
    <Suspense
      fallback={
        <p className="text-sm text-[var(--sg-color-text-muted)]" role="status">
          Opening comparison…
        </p>
      }
    >
      <CompareBuildClient products={products} publishedSlugs={publishedSlugs} />
    </Suspense>
  );
}
