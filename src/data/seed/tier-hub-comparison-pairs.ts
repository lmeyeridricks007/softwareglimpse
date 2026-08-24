/**
 * Intra-roster comparison pairs for thin tier category hubs.
 * Shells are generated at comparisons seed time with the correct categorySlug.
 */
export type TierHubComparisonPair = {
  categorySlug: string;
  productSlugs: readonly [string, string];
};

export const tierHubComparisonPairs: TierHubComparisonPair[] = [
  // reputation-reviews
  { categorySlug: "reputation-reviews", productSlugs: ["nicejob", "shore"] },
  { categorySlug: "reputation-reviews", productSlugs: ["nicejob", "wati"] },
  { categorySlug: "reputation-reviews", productSlugs: ["nicejob", "ueni"] },
  { categorySlug: "reputation-reviews", productSlugs: ["nicejob", "uniqode"] },
  { categorySlug: "reputation-reviews", productSlugs: ["shore", "wati"] },
  { categorySlug: "reputation-reviews", productSlugs: ["ueni", "uniqode"] },

  // field-service-operations
  {
    categorySlug: "field-service-operations",
    productSlugs: ["servicem8", "contractor-foreman"],
  },
  {
    categorySlug: "field-service-operations",
    productSlugs: ["servicem8", "connecteam"],
  },
  {
    categorySlug: "field-service-operations",
    productSlugs: ["servicem8", "shore"],
  },
  {
    categorySlug: "field-service-operations",
    productSlugs: ["connecteam", "jibble"],
  },
  {
    categorySlug: "field-service-operations",
    productSlugs: ["contractor-foreman", "connecteam"],
  },
];
