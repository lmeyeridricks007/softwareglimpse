import type { ContentLifecycleKind } from "@/services/seo/content-lifecycle";

export const IMPROVE_LINKING_VERSION = "1.2.0";

/** Prefer these referrer kinds when planning inbound (order = preference). */
export type PreferReferrerKind =
  | "product"
  | "category"
  | "best"
  | "guide"
  | "comparison"
  | "use-case"
  | "industry"
  | "research"
  | "tool";

export type BatchPageRef = {
  pageType: string;
  slug: string;
  path: string;
  /** Quality score before this batch. */
  beforeQuality?: number;
  /** Quality score after enrich. */
  afterQuality?: number;
  materiallyImproved?: boolean;
  uniqueValueCount?: number;
  lifecycleState?: string;
  stillBlocked?: boolean;
};

export type LinkingEligibility = {
  path: string;
  eligible: boolean;
  qualityImproved: boolean;
  userValue: boolean;
  reasons: string[];
};

export type InboundOpportunity = {
  fromPath: string;
  fromKind: PreferReferrerKind | "other";
  fromTitle: string;
  toPath: string;
  reason: string;
  alreadyLinked: boolean;
  authorityScore: number;
};

export type PageLinkingPlan = {
  path: string;
  slug: string;
  kind: ContentLifecycleKind | "software" | "category" | "other";
  eligibility: LinkingEligibility;
  opportunities: InboundOpportunity[];
  /** Cap 3–8 selected for apply. */
  selected: InboundOpportunity[];
  outboundNextSteps: Array<{ href: string; label: string }>;
  hubPath: string | null;
};

export type LinkReadinessResult = {
  ok: boolean;
  path: string;
  meaningfulInbound: number;
  hasHubPath: boolean;
  hasOutboundNext: boolean;
  detail: string[];
};

/** Per-page before/after graph linking impact. */
export type PageLinkingImpact = {
  path: string;
  inboundBefore: number;
  inboundAfter: number | null;
  hubDepthBefore: number | null;
  hubDepthAfter: number | null;
  linkingSources: string[];
  anchors: string[];
  /** Unique anchors / total anchors (0–1). */
  anchorDiversity: number;
  /** True when page met link-readiness after apply (or was quality-promoted). */
  promotionImpact: boolean;
};

export type BatchLinkingMetrics = {
  batchId: string;
  generatedAt: string;
  orphansBefore: number;
  orphansAfter: number | null;
  inboundLinksGained: number | null;
  hubDepthSample: Array<{ path: string; depth: number | null }>;
  qualityPromotions: number;
  pagesPlanned: number;
  pagesApplied: number;
  opportunitiesSelected: number;
  skippedWeak: number;
  pages: PageLinkingImpact[];
};

export type BatchLinkingReport = {
  version: string;
  batchId: string;
  generatedAt: string;
  plans: PageLinkingPlan[];
  applied: Array<{
    toPath: string;
    fromPath: string;
    method: "guide_overlay" | "link_injection";
  }>;
  metrics: BatchLinkingMetrics;
  /** Lane ordering applied before planning (empty when prioritizeByLane=false). */
  pageLanes?: Array<{
    path: string;
    lane: string;
    overallScore: number;
    gscDemandScore: number;
    strategicScore: number;
    qualityGapScore: number;
    commercialScore: number;
    authorityScore: number;
    strategicOverride: boolean;
    reason: string;
  }>;
};
