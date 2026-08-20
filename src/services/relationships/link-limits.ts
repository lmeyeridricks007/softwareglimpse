/**
 * Central internal-link limits and priority weights.
 */
export const INTERNAL_LINK_LIMITS = {
  relatedComparisons: 4,
  alternatives: 5,
  relatedGuides: 4,
  relatedTools: 3,
  relatedSoftware: 6,
  relatedCategories: 3,
} as const;

export type LinkPageType =
  | "category"
  | "software"
  | "comparison"
  | "alternatives"
  | "best"
  | "audience"
  | "tool"
  | "pricing"
  | "hub"
  | "guide";

/** Higher = more important when trimming. */
export const LINK_TYPE_PRIORITY: Record<LinkPageType, number> = {
  category: 100,
  best: 90,
  guide: 85,
  comparison: 80,
  alternatives: 70,
  software: 60,
  audience: 50,
  tool: 40,
  pricing: 30,
  hub: 20,
};
