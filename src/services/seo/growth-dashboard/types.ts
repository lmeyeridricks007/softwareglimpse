/**
 * Growth Dashboard — internal measurement for
 * PRESERVE → IMPROVE → PROMOTE → RANK → EARN TRAFFIC.
 * Never fabricates GSC/affiliate/revenue metrics. No single vanity composite score.
 */

export const GROWTH_DASHBOARD_VERSION = "2.3.0";

/** Connection / trust of an integration for production north-star use. */
export type DataValidity =
  | "REAL"
  | "PARTIAL"
  | "FIXTURE"
  | "NOT_CONNECTED"
  | "STALE";

export type ConnectionStatus = "connected" | "partial" | "not_connected";

export type MetricValue =
  | { kind: "number"; value: number; note?: string }
  | { kind: "percent"; value: number; note?: string }
  | { kind: "text"; value: string; note?: string }
  | { kind: "not_connected"; label?: string };

export type NorthStarObjectiveStatus =
  | "on_track"
  | "building"
  | "behind"
  | "insufficient_trend"
  | "not_connected";

export type StatusConfidence = "high" | "medium" | "low";

export type TrendAvailability = "available" | "partial" | "unavailable";

/**
 * Primary objectives — never collapsed into one synthetic score.
 */
export type NorthStarObjective = {
  id:
    | "high_quality_pages"
    | "promoted_pages"
    | "page_one_rankings"
    | "organic_clicks"
    | "evidence"
    | "relevant_links";
  label: string;
  status: NorthStarObjectiveStatus;
  /** How strongly the status is supported by evidence. */
  confidence: StatusConfidence;
  /** ISO date or short freshness label for the primary input. */
  dataFreshness: string | null;
  trendAvailability: TrendAvailability;
  summary: string;
  evidence: string[];
  gaps: string[];
};

/** @deprecated Prefer NorthStarObjective — kept for transitional aliases. */
export type ScorecardPillarStatus = NorthStarObjectiveStatus | "strong" | "weak";
export type ScorecardPillar = NorthStarObjective & {
  /** Legacy alias — same as status mapping. */
  status: NorthStarObjectiveStatus;
};

export type CtrOpportunityRow = {
  path: string;
  impressions: number;
  position: number;
  actualCtr: number;
  expectedCtr: number;
  ctrGapPctPoints: number;
};

export type OrganicSearchSection = {
  status: ConnectionStatus;
  validity: DataValidity;
  sourceLabel: string | null;
  dataThroughDate: string | null;
  synthetic: boolean;
  /** Discovery — do not call "strong" from impressions alone. */
  discovery: {
    pagesWithImpressions: MetricValue;
    impressions: MetricValue;
  };
  ranking: {
    top10: MetricValue;
    band11to20: MetricValue;
    band21to50: MetricValue;
    deeperThan50: MetricValue;
    weightedPosition: MetricValue;
  };
  /**
   * Quality of the Top-10 set — count alone never implies on_track.
   * Used by the page-one north-star objective.
   */
  pageOneQuality: {
    top10Impressions: MetricValue;
    top10Clicks: MetricValue;
    /** Share of site impressions occurring on Top-10 pages. */
    top10ShareOfImpressions: MetricValue;
    /** @deprecated Prefer top10ShareOfImpressions — same value. */
    top10ImpressionShare: MetricValue;
    top10PagesWith100PlusImpressions: MetricValue;
    top10PagesWithClicks: MetricValue;
    top10CommercialPages: MetricValue;
    /** @deprecated Prefer top10CommercialPages — same value. */
    commercialTop10Pages: MetricValue;
    commercialTop10Share: MetricValue;
    /** Site CTR (retained for status scoring). */
    siteCtr: MetricValue;
    note: string;
  };
  ctrDetail: {
    siteCtr: MetricValue;
    /** Pages where expected vs actual CTR is meaningful (imp ≥ threshold). */
    comparedPageCount: MetricValue;
    highImpressionLowCtr: CtrOpportunityRow[];
    note: string;
  };
  traffic: {
    organicClicks: MetricValue;
    pagesWithClicks: MetricValue;
  };
  /** Flat fields retained for older consumers / tests. */
  clicks: MetricValue;
  impressions: MetricValue;
  ctr: MetricValue;
  averagePosition: MetricValue;
  pagesWithImpressions: MetricValue;
  pagesWithClicks: MetricValue;
  top10Count: MetricValue;
  top20Count: MetricValue;
  top50Count: MetricValue;
  trend: {
    status: ConnectionStatus;
    clicksDeltaPct: number | null;
    impressionsDeltaPct: number | null;
    ctrDeltaPct: number | null;
    positionDelta: number | null;
    note: string;
  };
};

export type LifecycleBucketCounts = {
  total: number;
  indexable: number;
  improve: number;
  improving: number;
  readyForPromotion: number;
  manualReview: number;
  retired: number;
};

export type ContentEstateSection = {
  status: ConnectionStatus;
  strategyLabel: string;
  totals: LifecycleBucketCounts;
  byType: {
    guides: LifecycleBucketCounts;
    comparisons: LifecycleBucketCounts;
    software: LifecycleBucketCounts;
    other: LifecycleBucketCounts;
  };
  notes: string[];
};

export type ImprovementVelocitySection = {
  status: ConnectionStatus;
  windowLabel: string;
  pagesImprovedThisWeek: MetricValue;
  pagesPromotedToIndexable: MetricValue;
  pagesQualityScoreImproved: MetricValue;
  averageQualityDelta: MetricValue;
  largestImprovements: Array<{
    url: string;
    scoreDelta: number;
    from: number;
    to: number;
  }>;
  qualityRegressions: MetricValue;
  promotionConversionRate: MetricValue;
  pagesRankingsImprovedAfterUpgrade: MetricValue;
  notes: string[];
};

export type IndexingSection = {
  status: ConnectionStatus;
  validity: DataValidity;
  sourceLabel: string | null;
  /** Actual sitemap URL count — submitted/indexable denominator. */
  sitemapUrlCount: MetricValue;
  indexedUrls: MetricValue;
  discoveredNotIndexed: MetricValue;
  crawledNotIndexed: MetricValue;
  /**
   * Only when GSC indexed is comparable to sitemap. Otherwise not_connected
   * with an explicit label — never a false guides+compare proxy ratio.
   */
  indexationRatio: MetricValue;
  /** @deprecated Prefer sitemapUrlCount */
  indexableUrls: MetricValue;
  notes: string[];
};

export type OpportunityRow = {
  path: string;
  score: number | null;
  impressions: number | null;
  position: number | null;
  primaryAction: string | null;
  /** Query evidence string (DIRECT only trusted for rewrites). */
  queryEvidence?: string | null;
  queryConfidence?: string | null;
  relationshipSource?: string | null;
  actionConfidence?: string | null;
  note?: string;
};

export type OpportunitySection = {
  status: ConnectionStatus;
  validity: DataValidity;
  sourceLabel: string | null;
  dataThroughDate: string | null;
  generatedAt: string | null;
  synthetic: boolean;
  top20: OpportunityRow[];
  indexedImprovement: OpportunityRow[];
  improvePromotion: OpportunityRow[];
  entering11to20: OpportunityRow[];
  enteringTop10: OpportunityRow[];
  rankingDeclines: OpportunityRow[];
  notes: string[];
};

export type EvidenceTrendPoint = {
  label: string;
  handsOnTested: number;
  dataVerified: number;
  researchOnly: number;
  at: string | null;
};

export type ContentQualitySection = {
  status: ConnectionStatus;
  validity: DataValidity;
  handsOnTested: MetricValue;
  dataVerified: MetricValue;
  researchOnly: MetricValue;
  reviewsWithEvidence: MetricValue;
  stalePricingPages: MetricValue;
  pagesRequiringRefresh: MetricValue;
  /** Research-based / data-verified / hands-on over time when prior snapshot exists. */
  evidenceTrend: EvidenceTrendPoint[];
  notes: string[];
};

export type AuthoritySection = {
  status: ConnectionStatus;
  validity: DataValidity;
  referringDomains: MetricValue;
  backlinks: MetricValue;
  linkedPages: MetricValue;
  topicalRelevanceAverage: MetricValue;
  newReferringDomains: MetricValue;
  lostReferringDomains: MetricValue;
  linksToResearchAssets: MetricValue;
  linksToCommercialPages: MetricValue;
  qualityProspects: MetricValue;
  linksEarned: MetricValue;
  researchAssetsEarningLinks: MetricValue;
  /** Sample REAL backlink rows when export connected — never from fixtures. */
  sampleLinks: Array<{
    sourceDomain: string;
    targetUrl: string | null;
    topicalRelevance: string | null;
    status: string | null;
  }>;
  notes: string[];
};

export type ResearchSection = {
  status: ConnectionStatus;
  publishedReports: MetricValue;
  datasetCoverage: MetricValue;
  latestResearch: MetricValue;
  researchCitationsTracked: MetricValue;
  notes: string[];
};

export type AiVisibilitySection = {
  status: ConnectionStatus;
  validity: DataValidity;
  citations: MetricValue;
  uniqueCitedPages: MetricValue;
  platforms: MetricValue;
  topCitedContent: string[];
  notes: string[];
};

export type DistributionSection = {
  status: ConnectionStatus;
  campaigns: MetricValue;
  referralSessions: MetricValue;
  newsletterSignups: MetricValue;
  notes: string[];
};

export type CommercialSection = {
  status: ConnectionStatus;
  validity: DataValidity;
  affiliateClicks: MetricValue;
  conversions: MetricValue;
  matchedConversions: MetricValue;
  conversionRate: MetricValue;
  commission: MetricValue;
  revenue: MetricValue;
  unmatchedConversions: MetricValue;
  topConvertingSourcePages: string[];
  topProducts: string[];
  programmeCoverage: MetricValue;
  notes: string[];
};

export type WeeklyView = {
  improved: string[];
  declined: string[];
  topActions: string[];
  majorPricingChanges: string[];
  linksEarned: string[];
  newTestedProducts: string[];
  researchPublished: string[];
  notes: string[];
};

export type SourceInventoryRow = {
  id: string;
  label: string;
  status: ConnectionStatus;
  validity: DataValidity;
  path: string | null;
};

export type GrowthDashboardReport = {
  engineVersion: string;
  generatedAt: string;
  strategyLabel: string;
  complianceNotes: string[];
  /** Primary objectives — not a vanity composite. */
  scorecard: NorthStarObjective[];
  organicSearch: OrganicSearchSection;
  contentEstate: ContentEstateSection;
  improvementVelocity: ImprovementVelocitySection;
  indexing: IndexingSection;
  opportunity: OpportunitySection;
  contentQuality: ContentQualitySection;
  authority: AuthoritySection;
  research: ResearchSection;
  aiVisibility: AiVisibilitySection;
  distribution: DistributionSection;
  commercial: CommercialSection;
  weekly: WeeklyView;
  sourceInventory: SourceInventoryRow[];
};
