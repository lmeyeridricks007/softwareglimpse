/**
 * Cross-site discovery search types.
 * Affiliate commission / status must never influence ranking.
 */

export const SEARCH_RESULT_TYPES = [
  "SOFTWARE",
  "COMPARISON",
  "GUIDE",
  "TOOL",
  "RESOURCE",
  "INDUSTRY",
  "USE_CASE",
  "CAPABILITY",
  "REQUIREMENT",
  "FEATURE",
  "CATEGORY",
  "BEST_PAGE",
] as const;

export type SearchResultType = (typeof SEARCH_RESULT_TYPES)[number];

/** Filter chips shown in the UI (subset / aliases of result types). */
export const SEARCH_FILTER_TYPES = [
  "all",
  "SOFTWARE",
  "COMPARISON",
  "GUIDE",
  "TOOL",
  "RESOURCE",
  "FEATURE",
  "REQUIREMENT",
  "USE_CASE",
  "INDUSTRY",
  "CAPABILITY",
  "CATEGORY",
  "BEST_PAGE",
] as const;

export type SearchFilterType = (typeof SEARCH_FILTER_TYPES)[number];

export type SearchDocumentLogo = {
  src: string;
  alt: string;
};

export type SearchDocument = {
  id: string;
  type: SearchResultType;
  title: string;
  slug: string;
  canonicalUrl: string;
  summary: string;
  /** Optional secondary label (category, resource kind, etc.). */
  badge?: string;
  categoryIds: string[];
  productIds: string[];
  capabilityIds: string[];
  requirementIds: string[];
  featureIds: string[];
  useCaseIds: string[];
  industryIds: string[];
  aliases: string[];
  searchTerms: string[];
  /** 0–100 base importance (type + editorial priority). */
  importance: number;
  /** Optional content-quality boost 0–100 when available. */
  contentQuality?: number;
  updatedAt?: string;
  published: boolean;
  indexable: boolean;
  logo?: SearchDocumentLogo;
  /** Second logo for comparisons. */
  logoB?: SearchDocumentLogo;
  /** Product-facing extras. */
  bestFor?: string;
  pricingTeaser?: string;
  verdict?: string;
  readingMinutes?: number;
  resourceFormats?: string[];
  toolMeta?: {
    free: boolean;
    noSignup: boolean;
    ctaLabel: string;
  };
  /** Quick links that exist for entity matches. */
  quickLinks?: Array<{ label: string; href: string }>;
};

export type ScoredSearchHit = {
  document: SearchDocument;
  score: number;
  matchReasons: string[];
};

export type SearchIntentKind =
  | "entity"
  | "comparison"
  | "pricing"
  | "tool"
  | "resource"
  | "feature"
  | "requirement"
  | "industry"
  | "best"
  | "generic";

export type SearchIntent = {
  kind: SearchIntentKind;
  productSlugs: string[];
  preferredTypes: SearchResultType[];
  normalizedQuery: string;
  tokens: string[];
};

export type SearchCorrection = {
  original: string;
  suggested: string;
  mode: "showing-for" | "did-you-mean";
};

export type SearchTypeCount = {
  type: SearchResultType;
  count: number;
  label: string;
};

export type SearchGroupId =
  | "top_match"
  | "software"
  | "comparisons"
  | "guides_resources"
  | "features_requirements"
  | "tools"
  | "taxonomy"
  | "other";

export type SearchResultGroup = {
  id: SearchGroupId;
  title: string;
  hits: ScoredSearchHit[];
  total: number;
  viewAllHref?: string;
};

export type SearchResponse = {
  query: string;
  normalizedQuery: string;
  total: number;
  counts: SearchTypeCount[];
  intent: SearchIntent;
  correction?: SearchCorrection;
  featured?: ScoredSearchHit;
  groups: SearchResultGroup[];
  hits: ScoredSearchHit[];
  relatedSearches: string[];
  sidebar: SearchSidebarModel;
};

export type SearchSidebarModel = {
  entityExplore?: {
    productName: string;
    productSlug: string;
    links: Array<{ label: string; href: string }>;
  };
  popularComparisons: Array<{
    title: string;
    href: string;
    logoA?: SearchDocumentLogo;
    logoB?: SearchDocumentLogo;
  }>;
  toolPromo?: {
    title: string;
    summary: string;
    href: string;
    ctaLabel: string;
  };
  relatedSearches: string[];
};

export type AutocompleteSuggestion = {
  type: SearchResultType;
  title: string;
  href: string;
  badge?: string;
};

export type AutocompleteResponse = {
  query: string;
  suggestions: AutocompleteSuggestion[];
  seeAllHref: string;
};

export type DiscoveryHubModel = {
  browse: Array<{ label: string; href: string; description: string }>;
  popularCategories: Array<{ name: string; href: string }>;
  popularTools: Array<{ name: string; href: string; summary: string }>;
  featuredGuides: Array<{ title: string; href: string; summary: string }>;
  featuredResources: Array<{ title: string; href: string; summary: string }>;
  tryQueries: string[];
};
