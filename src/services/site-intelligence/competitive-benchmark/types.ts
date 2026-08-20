/**
 * Competitor website analysis — externally observable signals only.
 * Never invents traffic, DA, conversion, or revenue.
 */
import type { CompetitorDomainType } from "../serp-competitors/types";

export type EvaluationDimensionId =
  | "search-intent-alignment"
  | "content-depth"
  | "content-structure"
  | "original-value"
  | "evidence"
  | "product-screenshots"
  | "video"
  | "tools"
  | "calculators"
  | "templates-resources"
  | "comparison-depth"
  | "review-quality"
  | "pricing-detail"
  | "freshness"
  | "author-trust"
  | "source-transparency"
  | "internal-links"
  | "ux"
  | "mobile"
  | "performance-proxies"
  | "structured-data"
  | "content-differentiation";

export type DimensionScore = {
  id: EvaluationDimensionId;
  score: number | null;
  band: "strong" | "adequate" | "weak" | "unknown";
  reason: string;
  observable: boolean;
  confidence: "high" | "medium" | "low";
};

export type PageObservationSource =
  | "live-html"
  | "fixture"
  | "serp-metadata"
  | "local-sg";

export type PageObservation = {
  url: string;
  domain: string;
  title: string;
  query?: string;
  pageType: string;
  source: PageObservationSource;
  fetchedAt: string;
  statusCode?: number;
  htmlBytes?: number;
  wordCount?: number;
  h1Count?: number;
  h2Count?: number;
  h3Count?: number;
  listCount?: number;
  tableCount?: number;
  imageCount?: number;
  imagesWithAlt?: number;
  videoEmbedCount?: number;
  formCount?: number;
  internalLinkCount?: number;
  externalLinkCount?: number;
  hasViewportMeta?: boolean;
  hasJsonLd?: boolean;
  jsonLdTypes?: string[];
  hasAuthorSignal?: boolean;
  hasDateSignal?: boolean;
  hasPricingSignal?: boolean;
  hasComparisonTable?: boolean;
  hasProsCons?: boolean;
  hasMethodology?: boolean;
  hasDisclosure?: boolean;
  hasChecklist?: boolean;
  hasCalculatorSignal?: boolean;
  hasToolSignal?: boolean;
  hasDownloadSignal?: boolean;
  hasScreenshotSignal?: boolean;
  ttfbMs?: number;
  notes?: string[];
  error?: string;
};

export type ScoredPage = {
  observation: PageObservation;
  dimensions: DimensionScore[];
  overall: number | null;
};

export type QueryClusterId =
  | "best-list"
  | "comparison"
  | "review"
  | "evaluation-checklist"
  | "migration-implementation"
  | "category-guide"
  | "other";

export type SampledQueryCluster = {
  id: QueryClusterId;
  label: string;
  queries: string[];
  softwareGlimpsePage: string | null;
  domains: Array<{
    domain: string;
    type: CompetitorDomainType;
    significance: string;
    samplePages: Array<{ url: string; title: string; rank: number; query: string }>;
  }>;
};

export type CompetitorProfile = {
  domain: string;
  type: CompetitorDomainType;
  significance: string;
  pagesAnalyzed: ScoredPage[];
  mainStrengths: string[];
  mainWeaknesses: string[];
  whyRanksLikely: string[];
  topicsStrong: string[];
  topicsWeak: string[];
  learnFrom: string[];
  doNotCopy: string[];
  notes: string[];
};

export type PageBenchmarkRow = {
  label: string;
  domain: string;
  url: string;
  dimensions: Record<string, number | null>;
  notes: string[];
};

export type QueryBenchmark = {
  query: string;
  clusterId: QueryClusterId;
  softwareGlimpsePage: string | null;
  rows: PageBenchmarkRow[];
};

export type CompetitiveBenchmarkReport = {
  generatedAt: string;
  cluster: string;
  serpSource: string;
  observationMode: "live" | "fixture" | "mixed";
  domainsSampled: number;
  pagesSampled: number;
  clusters: SampledQueryCluster[];
  profiles: CompetitorProfile[];
  benchmarks: QueryBenchmark[];
  softwareGlimpseNotes: string[];
  disclaimers: string[];
  notes: string[];
};
