import { z } from "zod";
import { IsoDateTimeSchema } from "./primitives";

/**
 * Authority / Backlink / Promotion Intelligence
 *
 * Discover → Verify → Qualify → Recommend → Draft angles only.
 * Never sends outreach, submits forms, buys placements, or mutates production content.
 * Third-party DA/DR scores are optional external context — never treated as Google ranking metrics.
 */

export const AUTHORITY_INTELLIGENCE_VERSION = "1.0.0";

/** Canonical opportunity taxonomy */
export const AuthorityOpportunityTypeSchema = z.enum([
  "EARNED_EDITORIAL_LINK",
  "RESOURCE_PAGE",
  "REFERENCE_LINK",
  "DATA_CITATION",
  "TOOL_CITATION",
  "TEMPLATE_CITATION",
  "JOURNALIST_SOURCE",
  "EXPERT_CONTRIBUTION",
  "PODCAST",
  "NEWSLETTER",
  "GUEST_CONTRIBUTION",
  "PARTNERSHIP",
  "VENDOR_ECOSYSTEM",
  "INTEGRATION_PARTNER",
  "DIRECTORY",
  "SOFTWARE_DIRECTORY",
  "STARTUP_DIRECTORY",
  "PROFESSIONAL_DIRECTORY",
  "COMMUNITY",
  "FORUM",
  "ACADEMIC_EDUCATIONAL",
  "ASSOCIATION",
  "EVENT",
  "WEBINAR",
  "CONFERENCE",
  "SPONSORSHIP",
  "PAID_NEWSLETTER",
  "PAID_DIRECTORY",
  "PAID_CONTENT_DISTRIBUTION",
  "PAID_ADVERTISING",
  "PR_OUTREACH",
  "BROKEN_LINK_REPLACEMENT",
  "UNLINKED_MENTION",
  "COMPETITOR_LINK_GAP",
]);
export type AuthorityOpportunityType = z.infer<
  typeof AuthorityOpportunityTypeSchema
>;

export const AcquisitionTypeSchema = z.enum([
  "EARNED",
  "OWNED_PROFILE",
  "CONTRIBUTED",
  "PARTNERSHIP",
  "PAID",
  "UGC",
  "UNKNOWN",
]);
export type AcquisitionType = z.infer<typeof AcquisitionTypeSchema>;

export const ExpectedLinkTreatmentSchema = z.enum([
  "EDITORIAL",
  "SPONSORED",
  "NOFOLLOW",
  "UGC",
  "UNKNOWN",
]);
export type ExpectedLinkTreatment = z.infer<typeof ExpectedLinkTreatmentSchema>;

export const LikelyFollowStatusSchema = z.enum([
  "follow",
  "nofollow",
  "sponsored",
  "ugc",
  "unknown",
]);
export type LikelyFollowStatus = z.infer<typeof LikelyFollowStatusSchema>;

export const ValueBandSchema = z.enum([
  "excellent",
  "strong",
  "good",
  "low",
  "none",
  "unknown",
]);
export type ValueBand = z.infer<typeof ValueBandSchema>;

export const EffortBandSchema = z.enum([
  "trivial",
  "small",
  "medium",
  "large",
  "unknown",
]);
export type EffortBand = z.infer<typeof EffortBandSchema>;

export const DifficultyBandSchema = z.enum([
  "easy",
  "moderate",
  "hard",
  "very-hard",
  "unknown",
]);
export type DifficultyBand = z.infer<typeof DifficultyBandSchema>;

export const LikelihoodBandSchema = z.enum([
  "high",
  "medium",
  "low",
  "very-low",
  "unknown",
]);
export type LikelihoodBand = z.infer<typeof LikelihoodBandSchema>;

export const SourceQualityBandSchema = z.enum([
  "excellent",
  "strong",
  "good",
  "mixed",
  "weak",
  "unknown",
]);
export type SourceQualityBand = z.infer<typeof SourceQualityBandSchema>;

export const SpamRiskSchema = z.enum([
  "none",
  "low",
  "medium",
  "high",
  "link-spam-avoid",
]);
export type SpamRisk = z.infer<typeof SpamRiskSchema>;

/**
 * Transparent priority bands — not fake ranking precision.
 * AVOID = Google-compliance / link-spam rejection.
 */
export const OpportunityScoreBandSchema = z.enum([
  "EXCELLENT",
  "STRONG",
  "GOOD",
  "LOW",
  "AVOID",
]);
export type OpportunityScoreBand = z.infer<typeof OpportunityScoreBandSchema>;

export const OpportunityStatusSchema = z.enum([
  "discovered",
  "verified",
  "qualified",
  "recommended",
  "drafted",
  "deferred",
  "dismissed",
  "avoid",
  "stale",
]);
export type OpportunityStatus = z.infer<typeof OpportunityStatusSchema>;

/** Human workflow tracking for authority visibility opportunities */
export const VisibilityTrackingStatusSchema = z.enum([
  "NEW",
  "CONTACTED",
  "IN_PROGRESS",
  "WON",
  "DECLINED",
  "EXPIRED",
  "DISMISSED",
  "LOST",
]);
export type VisibilityTrackingStatus = z.infer<
  typeof VisibilityTrackingStatusSchema
>;

/**
 * Record a link only when evidence exists — do not infer follow/rel.
 */
export const LinkAcquisitionRecordSchema = z.object({
  id: z.string().min(1),
  sourceUrl: z.string().url(),
  targetUrl: z.string().url(),
  anchorText: z.string().optional(),
  linkType: z.enum([
    "editorial",
    "resource",
    "directory",
    "sponsored",
    "ugc",
    "partner",
    "other",
  ]),
  /** Observed rel attribute only — never invent follow/nofollow */
  relAttribute: z.string().optional(),
  dateAcquired: z.string().min(1),
  acquisitionType: AcquisitionTypeSchema,
  costIfAny: z.string().optional(),
  opportunityId: z.string().optional(),
  evidenceNotes: z.array(z.string()).default([]),
  recordedAt: IsoDateTimeSchema,
});
export type LinkAcquisitionRecord = z.infer<typeof LinkAcquisitionRecordSchema>;

export const LinkableAssetKindSchema = z.enum([
  "tool",
  "resource",
  "guide",
  "comparison",
  "research",
  "dataset",
  "template",
  "glossary",
  "framework",
  "homepage",
  "hub",
  "other",
]);
export type LinkableAssetKind = z.infer<typeof LinkableAssetKindSchema>;

export const PromotionChannelKindSchema = z.enum([
  "backlink",
  "directory-listing",
  "newsletter",
  "podcast",
  "community",
  "journalist",
  "partner",
  "vendor-ecosystem",
  "event",
  "paid-exposure",
  "social-distribution",
  "content-asset-creation",
]);
export type PromotionChannelKind = z.infer<typeof PromotionChannelKindSchema>;

/** Optional third-party metrics — contextual only, never ranking truth. */
export const ExternalAuthorityMetricsSchema = z.object({
  provider: z.string().min(1),
  domainAuthority: z.number().min(0).max(100).optional(),
  domainRating: z.number().min(0).max(100).optional(),
  authorityScore: z.number().min(0).max(100).optional(),
  organicTrafficEstimate: z.number().min(0).optional(),
  referringDomainsEstimate: z.number().min(0).optional(),
  fetchedAt: IsoDateTimeSchema.optional(),
  notes: z.array(z.string()).default([]),
  /** Explicit disclaimer for report rendering */
  notGoogleRankingMetric: z.literal(true).default(true),
});
export type ExternalAuthorityMetrics = z.infer<
  typeof ExternalAuthorityMetricsSchema
>;

export const ScoreBreakdownSchema = z.object({
  relevance: z.number().int().min(0).max(100),
  editorialLegitimacy: z.number().int().min(0).max(100),
  audienceOverlap: z.number().int().min(0).max(100),
  referralValue: z.number().int().min(0).max(100),
  seoValue: z.number().int().min(0).max(100),
  targetPageFit: z.number().int().min(0).max(100),
  likelihood: z.number().int().min(0).max(100),
  effortPenalty: z.number().int().min(0).max(40),
  costPenalty: z.number().int().min(0).max(40),
  spamRiskPenalty: z.number().int().min(0).max(100),
  notes: z.array(z.string()).default([]),
});
export type ScoreBreakdown = z.infer<typeof ScoreBreakdownSchema>;

export const AuthorityOpportunitySchema = z.object({
  id: z.string().min(1),
  type: AuthorityOpportunityTypeSchema,
  acquisitionType: AcquisitionTypeSchema,
  domain: z.string().min(1),
  organization: z.string().min(1),
  url: z.string().url().or(z.string().min(1)),
  opportunityUrl: z.string().optional(),

  targetSoftwareGlimpsePage: z.string().optional(),
  targetCluster: z.string().optional(),
  targetAssetIds: z.array(z.string()).default([]),

  relevance: ValueBandSchema,
  audienceFit: ValueBandSchema,

  opportunityDescription: z.string().min(1),
  reasonWhyTheyMightLink: z.string().min(1),
  suggestedPitchAngle: z.string().optional(),

  expectedLinkTreatment: ExpectedLinkTreatmentSchema,
  likelyFollowStatus: LikelyFollowStatusSchema,

  seoValue: ValueBandSchema,
  referralValue: ValueBandSchema,
  brandValue: ValueBandSchema,
  relationshipValue: ValueBandSchema,

  estimatedEffort: EffortBandSchema,
  estimatedCost: z.string().optional(),
  recurringCost: z.string().optional(),

  difficulty: DifficultyBandSchema,
  likelihood: LikelihoodBandSchema,

  sourceQuality: SourceQualityBandSchema,
  spamRisk: SpamRiskSchema,

  contactPath: z.string().optional(),
  submissionPath: z.string().optional(),

  promotionChannels: z.array(PromotionChannelKindSchema).default([]),
  externalMetrics: ExternalAuthorityMetricsSchema.optional(),

  scoreBand: OpportunityScoreBandSchema,
  scoreNormalized: z.number().int().min(0).max(100).optional(),
  scoreBreakdown: ScoreBreakdownSchema.optional(),

  complianceFlags: z.array(z.string()).default([]),
  discoveryQueries: z.array(z.string()).default([]),
  evidenceNotes: z.array(z.string()).default([]),

  discoveredAt: IsoDateTimeSchema,
  verifiedAt: IsoDateTimeSchema.optional(),
  status: OpportunityStatusSchema,

  /** Primary value is exposure/referral — not "buy a dofollow link" */
  primaryValueProposition: z
    .enum([
      "editorial-citation",
      "tool-or-resource-utility",
      "audience-exposure",
      "brand-awareness",
      "relationship-building",
      "directory-discoverability",
      "paid-exposure",
      "link-equity-purchase",
    ])
    .optional(),
});
export type AuthorityOpportunity = z.infer<typeof AuthorityOpportunitySchema>;

export const LinkableAssetSchema = z.object({
  id: z.string().min(1),
  kind: LinkableAssetKindSchema,
  name: z.string().min(1),
  path: z.string().min(1),
  cluster: z.string().optional(),
  linkability: ValueBandSchema,
  whyLinkable: z.string().min(1),
  promotionAngles: z.array(z.string()).default([]),
  status: z.enum(["available", "partial", "planned", "unknown"]).default("available"),
});
export type LinkableAsset = z.infer<typeof LinkableAssetSchema>;

export const OutreachAngleDraftSchema = z.object({
  opportunityId: z.string().min(1),
  angleTitle: z.string().min(1),
  pitchSummary: z.string().min(1),
  whyRelevant: z.string().min(1),
  suggestedAssetPaths: z.array(z.string()).default([]),
  doNotDo: z.array(z.string()).default([]),
  requiresHumanAction: z.literal(true).default(true),
});
export type OutreachAngleDraft = z.infer<typeof OutreachAngleDraftSchema>;

export const ContentAssetGapForLinksSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  linkMagnetPotential: ValueBandSchema,
  relatedOpportunityTypes: z.array(AuthorityOpportunityTypeSchema).default([]),
  suggestedCluster: z.string().optional(),
});
export type ContentAssetGapForLinks = z.infer<
  typeof ContentAssetGapForLinksSchema
>;

export const AuthorityIntelligenceReportSchema = z.object({
  version: z.string().min(1),
  generatedAt: IsoDateTimeSchema,
  mode: z.enum(["FAST", "FULL", "RECHECK"]),
  scope: z.string().min(1),
  mutatesProduction: z.literal(false),
  automatedOutreach: z.literal(false),
  linkableAssets: z.array(LinkableAssetSchema),
  opportunities: z.array(AuthorityOpportunitySchema),
  angles: z.array(OutreachAngleDraftSchema),
  contentGapsForLinks: z.array(ContentAssetGapForLinksSchema),
  summary: z.object({
    total: z.number().int().min(0),
    excellent: z.number().int().min(0),
    strong: z.number().int().min(0),
    good: z.number().int().min(0),
    low: z.number().int().min(0),
    avoid: z.number().int().min(0),
    freeFirst: z.number().int().min(0),
    paidExposureCandidates: z.number().int().min(0),
    linkableAssetCount: z.number().int().min(0),
  }),
  authorityLimitationsNotes: z.array(z.string()).default([]),
});
export type AuthorityIntelligenceReport = z.infer<
  typeof AuthorityIntelligenceReportSchema
>;
