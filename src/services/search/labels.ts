import type { SearchResultType } from "./types";

export const SEARCH_TYPE_LABELS: Record<SearchResultType, string> = {
  SOFTWARE: "Software",
  COMPARISON: "Comparisons",
  GUIDE: "Guides",
  TOOL: "Tools",
  RESOURCE: "Resources",
  INDUSTRY: "Industries",
  USE_CASE: "Use Cases",
  CAPABILITY: "Capabilities",
  REQUIREMENT: "Requirements",
  FEATURE: "Features",
  CATEGORY: "Categories",
  BEST_PAGE: "Best Software",
};

export function getTypeLabel(type: SearchResultType): string {
  return SEARCH_TYPE_LABELS[type];
}
