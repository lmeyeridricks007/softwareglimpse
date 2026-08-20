import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
} from "@/data/repositories/catalog";

export type AffectedPage = {
  path: string;
  pageType:
    | "software-review"
    | "comparison"
    | "alternatives"
    | "best"
    | "tool"
    | "pricing";
  slug: string;
};

/**
 * Resolve catalogue pages that depend on a product's research/editorial state.
 */
export function resolveAffectedPages(productSlug: string): AffectedPage[] {
  const pages: AffectedPage[] = [
    {
      path: `/software/${productSlug}/`,
      pageType: "software-review",
      slug: productSlug,
    },
    {
      path: `/pricing/${productSlug}/`,
      pageType: "pricing",
      slug: productSlug,
    },
    {
      path: "/tools/crm-cost-calculator/",
      pageType: "tool",
      slug: "crm-cost-calculator",
    },
  ];

  for (const comparison of getAllComparisonsUnfiltered()) {
    if (!comparison.productSlugs.includes(productSlug)) continue;
    pages.push({
      path: `/compare/${comparison.slug}/`,
      pageType: "comparison",
      slug: comparison.slug,
    });
  }

  for (const alt of getAllAlternativesUnfiltered()) {
    const involved =
      alt.sourceSlug === productSlug ||
      alt.alternatives.some((entry) => entry.targetSlug === productSlug);
    if (!involved) continue;
    pages.push({
      path: `/alternatives/${alt.slug}/`,
      pageType: "alternatives",
      slug: alt.slug,
    });
  }

  for (const best of getAllBestPagesUnfiltered()) {
    const inEligible = best.eligibleProductSlugs.includes(productSlug);
    const inRecs = best.recommendations.some(
      (r) => r.productSlug === productSlug,
    );
    const inUseCase = best.useCaseRecommendations.some(
      (r) => r.productSlug === productSlug,
    );
    if (!inEligible && !inRecs && !inUseCase) continue;
    pages.push({
      path: `/best/${best.slug}/`,
      pageType: "best",
      slug: best.slug,
    });
  }

  return pages;
}
