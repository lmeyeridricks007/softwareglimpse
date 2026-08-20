export const COMPARISON_PAGE_TABS = [
  {
    id: "overview",
    label: "Overview",
    icon: "overview",
    description: "Verdict, scorecard preview, and who each product fits.",
  },
  {
    id: "scorecard",
    label: "Scorecard",
    icon: "scorecard",
    description: "Criterion-by-criterion results with evidence.",
  },
  {
    id: "features",
    label: "Features",
    icon: "features",
    description: "Grouped feature comparison from verified product research.",
  },
  {
    id: "pricing",
    label: "Pricing",
    icon: "pricing",
    description: "Plans, free tiers, and estimated team cost.",
  },
  {
    id: "pros-cons",
    label: "Pros & Cons",
    icon: "pros-cons",
    description: "Strengths and trade-offs for each product.",
  },
  {
    id: "screenshots",
    label: "Screenshots",
    icon: "screenshots",
    description: "Verified product UI captures from research.",
  },
  {
    id: "evidence",
    label: "Evidence",
    icon: "evidence",
    description: "Sources and research transparency.",
  },
  {
    id: "faq",
    label: "FAQ",
    icon: "faq",
    description: "Common buyer questions about this comparison.",
  },
] as const;

export type ComparisonPageTabId = (typeof COMPARISON_PAGE_TABS)[number]["id"];

export function isComparisonPageTabId(value: string): value is ComparisonPageTabId {
  return COMPARISON_PAGE_TABS.some((t) => t.id === value);
}

export function getComparisonPageTab(id: ComparisonPageTabId) {
  return COMPARISON_PAGE_TABS.find((t) => t.id === id) ?? COMPARISON_PAGE_TABS[0];
}

export function comparisonTabHref(
  slug: string,
  tab: ComparisonPageTabId,
): string {
  if (tab === "overview") return `/compare/${slug}/`;
  return `/compare/${slug}/?tab=${tab}`;
}
