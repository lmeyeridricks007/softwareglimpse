/**
 * Canonical weights for Site Intelligence v1.0.0.
 * Documented in docs/site-intelligence/01-scoring-methodology.md
 */

export const TECHNICAL_DIMENSION_WEIGHTS: Record<string, number> = {
  crawlability: 0.12,
  indexability: 0.14,
  canonicals: 0.1,
  "robots-sitemaps": 0.08,
  "status-redirects": 0.1,
  metadata: 0.08,
  "structured-data": 0.08,
  "performance-cwv": 0.12,
  "media-implementation": 0.08,
  "outbound-hygiene": 0.05,
  "rendering-mobile": 0.05,
};

export const IMPORTANCE_WEIGHTS = {
  /** Pillars must not be drowned by long-tail volume. */
  pillar: 20,
  "high-commercial": 8,
  supporting: 3,
  "long-tail": 1,
} as const;

export const ECOSYSTEM_DIMENSION_WEIGHTS: Record<string, number> = {
  "pillar-coverage": 0.15,
  "supporting-coverage": 0.12,
  "entity-relationships": 0.1,
  "internal-linking": 0.12,
  "content-depth": 0.1,
  "tool-relationships": 0.08,
  "resource-relationships": 0.06,
  "buyer-journey": 0.1,
  "cluster-completeness": 0.1,
  "orphan-rate": 0.04,
  "duplication-control": 0.03,
};

export const COMPETITIVE_DIMENSION_WEIGHTS: Record<string, number> = {
  "topic-coverage": 0.12,
  "content-depth": 0.12,
  "original-research-value": 0.1,
  "tools-interactive": 0.1,
  "comparison-quality": 0.08,
  "review-depth": 0.08,
  "evidence-transparency": 0.08,
  media: 0.06,
  resources: 0.06,
  "internal-linking": 0.06,
  ux: 0.06,
  freshness: 0.04,
  "serp-alignment": 0.04,
};

export const VISIBILITY_FACTOR_WEIGHTS: Record<string, number> = {
  indexedPerformingCoverage: 0.15,
  impressionsNorm: 0.2,
  clicksNorm: 0.15,
  ctrNorm: 0.15,
  positionDistributionNorm: 0.15,
  queryCoverageNorm: 0.1,
  nonBrandClickShareNorm: 0.1,
};

export const RANKING_OPPORTUNITY_WEIGHTS: Record<string, number> = {
  "intent-fit": 0.14,
  "content-quality": 0.16,
  "serp-competitor-strength": 0.14,
  "topical-coverage": 0.1,
  differentiation: 0.1,
  "internal-link-support": 0.08,
  "evidence-depth": 0.08,
  freshness: 0.05,
  "current-visibility": 0.08,
  "authority-gap": 0.07,
};

/** Overall Website Quality — Ranking Opportunity + Visibility excluded. */
export const OVERALL_COMPONENT_WEIGHTS = {
  "technical-seo-health": 0.2,
  "content-quality": 0.3,
  "website-experience": 0.15,
  "content-ecosystem-strength": 0.2,
  "competitive-content-strength": 0.15,
} as const;

export const SEVERITY_DEDUCTION = {
  P0: { per: 25, cap: 80 },
  P1: { per: 12, cap: 60 },
  P2: { per: 5, cap: 40 },
  P3: { per: 2, cap: 20 },
} as const;

/** Map SEO audit areas → technical dimensions. */
export const AREA_TO_TECHNICAL_DIMENSION: Record<string, string> = {
  technical: "indexability",
  "internal-linking": "crawlability",
  "content-coverage": "indexability",
  "structured-data": "structured-data",
  performance: "performance-cwv",
  media: "media-implementation",
  outbound: "outbound-hygiene",
};
