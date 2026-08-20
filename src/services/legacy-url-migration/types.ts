/**
 * Legacy URL Migration Audit model.
 *
 * Inventory + recommendations only — does not emit Next.js redirects.
 * Distinct from domain `MigrationRecord` (hand-curated CRM ledger seed).
 */

export type LegacyRelationship =
  | "EXACT"
  | "EQUIVALENT"
  | "MERGED_INTO"
  | "SPLIT_INTO"
  | "NO_EQUIVALENT"
  | "DUPLICATE"
  | "UNKNOWN";

export type LegacyRecommendedAction =
  | "KEEP"
  | "301_REDIRECT"
  | "MERGE_AND_301"
  | "404"
  | "410"
  | "NOINDEX"
  | "REVIEW";

export type LegacyConfidence = "HIGH" | "MEDIUM" | "LOW";

export type LegacySeoRisk = "high" | "medium" | "low";

export type LegacyPageType =
  | "home"
  | "hub_or_legal"
  | "product_review"
  | "comparison"
  | "best_list"
  | "alternatives"
  | "guide_like"
  | "wp_category"
  | "wp_tag"
  | "wp_author"
  | "kadence_element"
  | "locale"
  | "media"
  | "other_article";

export type NewPageType =
  | "homepage"
  | "software"
  | "pricing"
  | "comparison"
  | "alternatives"
  | "best"
  | "guide"
  | "category"
  | "tool"
  | "company"
  | "legal"
  | "use_case"
  | "capability"
  | "requirement"
  | "feature"
  | "resource"
  | "audience"
  | "industry"
  | "software_hub"
  | "categories_hub"
  | "tools_hub"
  | "pricing_hub"
  | "compare_hub"
  | "compare_builder"
  | "guides_hub"
  | "use_cases_hub"
  | "capabilities_hub"
  | "requirements_hub"
  | "features_hub"
  | "resources_hub"
  | "audiences_hub"
  | "industries_hub"
  | "best_hub"
  | "alternatives_hub"
  | "search"
  | "newsletter_utility"
  | "privacy_utility"
  | string;

export type NewUrlInventoryRow = {
  url: string;
  path: string;
  routeType: "static" | "dynamic";
  pageType: NewPageType;
  title: string;
  canonical: string;
  indexable: boolean;
  publicationState: string;
  entityId?: string;
  parentHub?: string;
  lastModified?: string;
  inSitemap: boolean;
};

export type LegacyUrlMigrationRecord = {
  legacyUrl: string;
  legacyPath: string;
  legacyStatus?: number | null;
  legacyTitle?: string | null;
  legacyCanonical?: string | null;
  legacyH1?: string | null;
  legacyRobots?: string | null;
  legacyIndexable?: boolean;
  legacyPageType: LegacyPageType | string;
  legacyRedirectTarget?: string | null;
  sitemap?: string;
  lastmod?: string | null;

  newUrl?: string | null;
  newPath?: string | null;
  newTitle?: string | null;
  newPageType?: NewPageType | null;
  newIndexable?: boolean | null;

  relationship: LegacyRelationship;
  recommendedAction: LegacyRecommendedAction;
  confidence: LegacyConfidence;
  reason: string;
  seoRisk: LegacySeoRisk;
  notes?: string[];
};

export type LegacyMigrationAuditSummary = {
  generatedAt: string;
  sources: {
    legacyHost: string;
    sitemapIndex: string;
    childSitemaps: string[];
  };
  counts: {
    legacySitemapUniqueLocs: number;
    legacyLocaleUrls: number;
    legacyPrimaryEn: number;
    newPublicRoutes: number;
    newSitemapEligible: number;
    exactMatches: number;
    redirectCandidates: number;
    redirectCandidatesHighConfidence: number;
    retirementCandidates: number;
    manualReviewCandidates: number;
    newOnlyRoutes: number;
    highSeoRisk: number;
  };
  limitations: string[];
};
