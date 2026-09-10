/**
 * Digital PR / Backlink Opportunity Engine — analysis + drafts only.
 * Never buys links, spam-submits, bulk-emails, or invents external metrics.
 */

export const LINK_OPPORTUNITY_ENGINE_VERSION = "1.3.0";

export type BacklinkExportValidity =
  | "REAL"
  | "FIXTURE"
  | "SAMPLE"
  | "TEST"
  | "EXAMPLE"
  | "REJECTED"
  | "NOT_CONNECTED";

export type BacklinkExportMeta = {
  provider: "ahrefs" | "semrush" | "other" | "unknown";
  sourcePath: string;
  /** Basename of the selected file. */
  filename: string;
  label: string | null;
  importedAt: string;
  /** YYYY-MM-DD when inferable from filename or mtime. */
  exportDate: string | null;
  rowCount: number;
  /** Columns/metrics actually present in the export — never invented. */
  metricsAvailable: string[];
  validity: BacklinkExportValidity;
  rejectionReasons: string[];
  notes: string[];
};
export const DigitalPrProspectType = [
  "JOURNALIST",
  "SAAS_PUBLICATION",
  "BUSINESS_PUBLICATION",
  "BLOG",
  "CONSULTANT",
  "NEWSLETTER",
  "RESOURCE_PAGE",
  "DATA_CITATION",
  "PODCAST",
  "ACADEMIC",
  "OTHER",
] as const;
export type DigitalPrProspectType = (typeof DigitalPrProspectType)[number];

export const DigitalPrOutreachStatus = [
  "IDENTIFIED",
  "QUALIFIED",
  "CONTACTED",
  "REPLIED",
  "LINK_EARNED",
  "DECLINED",
  "NO_RESPONSE",
  "NOT_RELEVANT",
] as const;
export type DigitalPrOutreachStatus = (typeof DigitalPrOutreachStatus)[number];

export type LinkableAssetScoreDimensions = {
  uniqueness: number;
  dataDepth: number;
  freshness: number;
  citationValue: number;
  journalistUsefulness: number;
  seoRelevance: number;
};

export type ScoredLinkableAsset = {
  id: string;
  name: string;
  path: string;
  kind: string;
  cluster: string | null;
  linkability: string;
  whyLinkable: string;
  dimensions: LinkableAssetScoreDimensions;
  /** 0–100 prioritization score from dimensions — not a ranking prediction. */
  assetScore: number;
  promotionAngles: string[];
};

export type ReferringDomainRow = {
  domain: string;
  /** Target URL on competitor or SoftwareGlimpse that received the link. */
  targetUrl: string;
  sourceUrl?: string;
  anchorText?: string;
  /** Only when present in export — never invented. */
  domainRating?: number;
  domainAuthority?: number;
  organicTraffic?: number;
  firstSeen?: string;
  lastSeen?: string;
  isDofollow?: boolean;
};

export type LoadedBacklinkExport = {
  meta: BacklinkExportMeta;
  rows: ReferringDomainRow[];
};

export type CompetitorPagePair = {
  softwareGlimpsePath: string;
  softwareGlimpseTitle: string;
  competitorUrls: string[];
  theme: string;
};

export type CompetitorLinkGap = {
  softwareGlimpsePath: string;
  competitorUrl: string;
  domainsLinkingToCompetitor: number;
  domainsAlsoLinkingToSoftwareGlimpse: number;
  domainsNotLinkingToSoftwareGlimpse: number;
  competitorCountReceivingLink: number;
  topicalRelevance: number;
  /** Only when export supplied DR/DA — otherwise null. */
  authorityMetricAverage: number | null;
  opportunityScore: number;
  sampleDomains: string[];
  notes: string[];
};

export type LinkProspect = {
  id: string;
  domain: string;
  prospectType: DigitalPrProspectType;
  prospectUrl: string;
  organizationHint: string | null;
  softwareGlimpseAssetPath: string;
  softwareGlimpseAssetName: string;
  triggeredByCompetitorUrl: string | null;
  topicalRelevance: number;
  authorityScore: number | null;
  competitorLinkEvidence: number;
  assetFit: number;
  editorialLikelihood: number;
  trafficIfAvailable: number | null;
  relationshipStatus: DigitalPrOutreachStatus;
  opportunityScore: number;
  scoreNotes: string[];
  pitch: LinkPitchAngle;
  outreachDraft: string | null;
};

export type LinkPitchAngle = {
  whyRelevant: string;
  assetFit: string;
  triggeringResource: string | null;
  suggestedAngle: string;
  personalizationEvidence: string[];
  outreachApproach: string;
};

export type DigitalPrTrackingRecord = {
  id: string;
  prospectId: string;
  domain: string;
  status: DigitalPrOutreachStatus;
  targetUrl: string;
  earnedLinkUrl: string | null;
  assetPath: string;
  relationshipNotes: string | null;
  updatedAt: string;
  createdAt: string;
};

/** Computed only from REAL export rows — never invented. */
export type BacklinkExportMetricsSummary = {
  referringDomains: number;
  backlinks: number;
  linkedPages: number;
  topicalRelevanceAverage: number | null;
  newReferringDomains: number | null;
  lostReferringDomains: number | null;
  newLostAvailable: boolean;
  linksToResearchAssets: number;
  linksToCommercialPages: number;
  sampleResearchTargets: string[];
  sampleCommercialTargets: string[];
  topReferringDomains: Array<{ domain: string; links: number }>;
  notes: string[];
};

export type LinkOpportunityReport = {
  engineVersion: string;
  generatedAt: string;
  methodologyNotes: string[];
  complianceNotes: string[];
  exportMeta: BacklinkExportMeta | null;
  /** Present only when a REAL (or test-allowed) export was analyzed. */
  exportMetrics: BacklinkExportMetricsSummary | null;
  assets: ScoredLinkableAsset[];
  /**
   * Prioritized outreach opportunities for EXISTING assets.
   * Draft only — never auto-sent; never counted as earned links.
   */
  assetOutreachPriorities: import("./asset-outreach").AssetOutreachOpportunity[];
  competitorPairsConfigured: number;
  gaps: CompetitorLinkGap[];
  prospects: LinkProspect[];
  tracking: DigitalPrTrackingRecord[];
  linksEarned: DigitalPrTrackingRecord[];
  summary: {
    assetCount: number;
    topAssetScore: number | null;
    gapCount: number;
    prospectCount: number;
    /** Prospects that passed quality filters (IDENTIFIED or QUALIFIED). */
    qualifiedCount: number;
    /** Prospects with relationshipStatus QUALIFIED (draft-eligible). */
    draftEligibleCount: number;
    contactedCount: number;
    linksEarnedCount: number;
    exportAvailable: boolean;
    /** Production validity of the selected export. */
    exportValidity: BacklinkExportValidity;
    /** Fixture/sample/example prospects included in this report — must be 0 in production. */
    fixtureProspectCount: number;
    rejectedExportCount: number;
    referringDomains: number | null;
    backlinks: number | null;
    linkedPages: number | null;
    linksToResearchAssets: number | null;
    linksToCommercialPages: number | null;
    newReferringDomains: number | null;
    lostReferringDomains: number | null;
  };
};
