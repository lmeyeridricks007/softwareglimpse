import type { SeoOpportunity } from "@/domain";

export type GapReport = {
  scope: "product" | "category";
  slug: string;
  opportunities: SeoOpportunity[];
  missingTypes: string[];
};

export function buildProductGapReport(
  productSlug: string,
  opportunities: SeoOpportunity[],
): GapReport {
  const related = opportunities.filter((o) =>
    o.productSlugs.includes(productSlug),
  );
  const gapTypes = [
    "comparison-opportunity",
    "alternatives-opportunity",
    "pricing-opportunity",
    "missing-content",
    "use-case-opportunity",
  ] as const;
  return {
    scope: "product",
    slug: productSlug,
    opportunities: related,
    missingTypes: gapTypes.filter((t) => related.some((o) => o.type === t)),
  };
}

export function buildCategoryGapReport(
  categorySlug: string,
  opportunities: SeoOpportunity[],
): GapReport {
  const related = opportunities.filter((o) =>
    o.categorySlugs.includes(categorySlug),
  );
  return {
    scope: "category",
    slug: categorySlug,
    opportunities: related,
    missingTypes: [
      ...new Set(
        related
          .filter((o) =>
            [
              "missing-content",
              "use-case-opportunity",
              "comparison-opportunity",
            ].includes(o.type),
          )
          .map((o) => o.type),
      ),
    ],
  };
}
