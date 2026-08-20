"use client";

import type { CategoryFinderClientKit } from "@/data/config/tools/category-tool-kit-types";
import { SiVendorScorecardApp } from "./si/si-vendor-scorecard-app";
import type { PricingSnapshot } from "@/services/pricing";
import type { ScorecardResearchCatalog } from "@/services/vendor-scorecard/engine";

type ProductOption = {
  slug: string;
  name: string;
  logo: { src: string; alt: string } | null;
  startingPriceLabel: string | null;
  reviewScore: number | null;
  reviewApproved: boolean;
};

type Props = {
  kit: CategoryFinderClientKit;
  research: ScorecardResearchCatalog;
  productOptions: ProductOption[];
  pricingSnapshots: PricingSnapshot[];
  publishedComparisonSlugs: string[];
};

export function CategoryVendorScorecardApp({
  kit,
  research,
  productOptions,
  pricingSnapshots,
  publishedComparisonSlugs,
}: Props) {
  const methodologyCriteria =
    kit.methodologyCriteria.length > 0
      ? kit.methodologyCriteria
      : kit.capabilityOptions.map((option) => ({
          slug: option.value,
          label: option.label,
          defaultImportance: "medium" as const,
        }));

  return (
    <SiVendorScorecardApp
      research={research}
      productOptions={productOptions}
      pricingSnapshots={pricingSnapshots}
      publishedComparisonSlugs={publishedComparisonSlugs}
      runtime={{
        categorySlug: kit.categorySlug,
        requirementsHref: kit.requirementsHref,
        costHref: `${kit.costHref}?from=scorecard`,
        finderHref: kit.finderHref,
        methodologyCriteria,
      }}
    />
  );
}
