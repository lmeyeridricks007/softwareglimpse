import type { ProductRecommendationSnapshot } from "./types";

/** Select products whose primary category matches `categorySlug`. */
export function selectCandidatesByCategory(
  products: ProductRecommendationSnapshot[],
  categorySlug: string,
): ProductRecommendationSnapshot[] {
  return products.filter((p) => p.primaryCategorySlug === categorySlug);
}

/** Select products whose primary category is CRM (SI with secondary crm excluded). */
export function selectCrmCandidates(
  products: ProductRecommendationSnapshot[],
): ProductRecommendationSnapshot[] {
  return selectCandidatesByCategory(products, "crm");
}
