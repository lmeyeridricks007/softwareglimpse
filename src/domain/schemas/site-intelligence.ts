import { z } from "zod";
import { IsoDateTimeSchema } from "./primitives";

/**
 * Site Intelligence — multi-score website quality / competitiveness / opportunity.
 * Evaluate only — never mutates production content, SEO config, or rankings.
 * Scores are not ranking predictions.
 */

export const SITE_INTELLIGENCE_VERSION = "1.0.0";

export const SiteIntelligenceBandSchema = z.enum([
  "excellent",
  "strong",
  "good",
  "fair",
  "weak",
  "critical",
]);
export type SiteIntelligenceBand = z.infer<typeof SiteIntelligenceBandSchema>;

export const RankingOpportunityBandSchema = z.enum([
  "very-low",
  "low",
  "moderate",
  "good",
  "strong",
]);
export type RankingOpportunityBand = z.infer<
  typeof RankingOpportunityBandSchema
>;

export const ConfidenceLevelSchema = z.enum(["high", "medium", "low"]);
export type ConfidenceLevel = z.infer<typeof ConfidenceLevelSchema>;

export const PageImportanceWeightSchema = z.enum([
  "pillar",
  "high-commercial",
  "supporting",
  "long-tail",
]);
export type PageImportanceWeight = z.infer<typeof PageImportanceWeightSchema>;

export const ScoreAvailabilitySchema = z.enum([
  "scored",
  "unavailable",
  "data-not-available",
]);
export type ScoreAvailability = z.infer<typeof ScoreAvailabilitySchema>;

export const EvidenceItemSchema = z.object({
  label: z.string().min(1),
  detail: z.string().optional(),
  sourceSystem: z.string().optional(),
  sourceId: z.string().optional(),
  present: z.boolean().optional(),
});
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;

export const DimensionScoreSchema = z.object({
  id: z.string().min(1),
  score: z.number().int().min(0).max(100),
  weight: z.number().positive(),
  reason: z.string().min(1),
  evidence: z.array(EvidenceItemSchema).default([]),
  partial: z.boolean().optional(),
});
export type DimensionScore = z.infer<typeof DimensionScoreSchema>;

export const ConfidenceBlockSchema = z.object({
  level: ConfidenceLevelSchema,
  reasons: z.array(z.string().min(1)).min(1),
});
export type ConfidenceBlock = z.infer<typeof ConfidenceBlockSchema>;

export const ScoredComponentSchema = z.object({
  id: z.enum([
    "technical-seo-health",
    "content-quality",
    "website-experience",
    "content-ecosystem-strength",
    "competitive-content-strength",
    "search-visibility",
    "ranking-opportunity",
    "overall-website-quality",
  ]),
  availability: ScoreAvailabilitySchema,
  score: z.number().int().min(0).max(100).nullable(),
  band: SiteIntelligenceBandSchema.nullable().optional(),
  opportunityBand: RankingOpportunityBandSchema.nullable().optional(),
  dimensions: z.array(DimensionScoreSchema).default([]),
  confidence: ConfidenceBlockSchema,
  evidence: z.array(EvidenceItemSchema).default([]),
  notes: z.array(z.string()).default([]),
  strongerThan: z.array(z.string()).default([]),
  weakerThan: z.array(z.string()).default([]),
});
export type ScoredComponent = z.infer<typeof ScoredComponentSchema>;

export const AuthorityLimitationsSchema = z.object({
  status: z.enum(["available", "unavailable"]),
  confidence: ConfidenceLevelSchema,
  notes: z.array(z.string()).default([]),
  knownGaps: z.array(z.string()).default([]),
  impactOnOpportunity: z.enum([
    "neutral-unknown",
    "constraining",
    "supporting",
  ]),
});
export type AuthorityLimitations = z.infer<typeof AuthorityLimitationsSchema>;

/** Finding severity from SEO audit agents — reused, not redefined. */
export const TechnicalFindingInputSchema = z.object({
  id: z.string().min(1),
  severity: z.enum(["P0", "P1", "P2", "P3"]),
  area: z.string().min(1),
  dimensionHint: z.string().optional(),
  problem: z.string().min(1),
  affectedPages: z.array(z.string()).default([]),
});
export type TechnicalFindingInput = z.infer<typeof TechnicalFindingInputSchema>;

export const TechnicalCheckInputSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["completed", "skipped", "failed"]),
  reason: z.string().optional(),
  agent: z.string().optional(),
});
export type TechnicalCheckInput = z.infer<typeof TechnicalCheckInputSchema>;

export const PageQualityInputSchema = z.object({
  route: z.string().min(1),
  pageType: z.string().min(1),
  overallScore: z.number().int().min(0).max(100),
  importance: PageImportanceWeightSchema,
  clusterId: z.string().optional(),
  criticalIntegrityFailure: z.boolean().optional(),
});
export type PageQualityInput = z.infer<typeof PageQualityInputSchema>;

export const ExperienceDimensionInputSchema = z.object({
  id: z.string().min(1),
  score: z.number().int().min(0).max(100),
  reason: z.string().min(1),
  evidence: z.array(EvidenceItemSchema).default([]),
});
export type ExperienceDimensionInput = z.infer<
  typeof ExperienceDimensionInputSchema
>;

export const EcosystemDimensionInputSchema = z.object({
  id: z.string().min(1),
  score: z.number().int().min(0).max(100),
  reason: z.string().min(1),
  evidence: z.array(EvidenceItemSchema).default([]),
});
export type EcosystemDimensionInput = z.infer<
  typeof EcosystemDimensionInputSchema
>;

export const CompetitorDimensionInputSchema = z.object({
  id: z.string().min(1),
  /** Relative 0–100 vs sampled competitors for this dimension. */
  score: z.number().int().min(0).max(100),
  reason: z.string().min(1),
  evidence: z.array(EvidenceItemSchema).default([]),
});
export type CompetitorDimensionInput = z.infer<
  typeof CompetitorDimensionInputSchema
>;

export const CompetitorPackInputSchema = z.object({
  clusterId: z.string().optional(),
  competitorsSampled: z.number().int().min(0),
  dimensions: z.array(CompetitorDimensionInputSchema).min(1),
  strongerThan: z.array(z.string()).default([]),
  weakerThan: z.array(z.string()).default([]),
  notes: z.array(z.string()).default([]),
  backlinkDataAvailable: z.boolean().default(false),
});
export type CompetitorPackInput = z.infer<typeof CompetitorPackInputSchema>;

export const SearchVisibilityMetricsInputSchema = z.object({
  synthetic: z.boolean().default(false),
  indexedPerformingCoverage: z.number().min(0).max(100),
  impressionsNorm: z.number().min(0).max(100),
  clicksNorm: z.number().min(0).max(100),
  ctrNorm: z.number().min(0).max(100),
  positionDistributionNorm: z.number().min(0).max(100),
  queryCoverageNorm: z.number().min(0).max(100),
  nonBrandClickShareNorm: z.number().min(0).max(100),
  notes: z.array(z.string()).default([]),
});
export type SearchVisibilityMetricsInput = z.infer<
  typeof SearchVisibilityMetricsInputSchema
>;

export const RankingOpportunityFactorInputSchema = z.object({
  id: z.string().min(1),
  score: z.number().int().min(0).max(100),
  reason: z.string().min(1),
});
export type RankingOpportunityFactorInput = z.infer<
  typeof RankingOpportunityFactorInputSchema
>;

export const RankingOpportunityInputSchema = z.object({
  scopeKind: z.enum(["query", "topic", "cluster"]),
  scopeId: z.string().min(1),
  /** Optional explicit factors; engine fills defaults/neutrals when omitted. */
  factors: z.array(RankingOpportunityFactorInputSchema).optional(),
  intentFit: z.number().int().min(0).max(100).optional(),
  contentQuality: z.number().int().min(0).max(100).optional(),
  serpCompetitorStrengthInverse: z.number().int().min(0).max(100).optional(),
  topicalCoverage: z.number().int().min(0).max(100).optional(),
  differentiation: z.number().int().min(0).max(100).optional(),
  internalLinkSupport: z.number().int().min(0).max(100).optional(),
  evidenceDepth: z.number().int().min(0).max(100).optional(),
  freshness: z.number().int().min(0).max(100).optional(),
  currentVisibility: z.number().int().min(0).max(100).optional(),
  authorityGap: z.number().int().min(0).max(100).optional(),
});
export type RankingOpportunityInput = z.infer<
  typeof RankingOpportunityInputSchema
>;

export const SiteIntelligenceInputSchema = z.object({
  evaluatedAt: IsoDateTimeSchema.optional(),
  scopeLabel: z.string().default("site"),
  technicalFindings: z.array(TechnicalFindingInputSchema).default([]),
  technicalChecks: z.array(TechnicalCheckInputSchema).default([]),
  pages: z.array(PageQualityInputSchema).default([]),
  experienceDimensions: z.array(ExperienceDimensionInputSchema).default([]),
  ecosystemDimensions: z.array(EcosystemDimensionInputSchema).default([]),
  competitorPack: CompetitorPackInputSchema.nullable().default(null),
  searchVisibility: SearchVisibilityMetricsInputSchema.nullable().default(null),
  authority: AuthorityLimitationsSchema.optional(),
  rankingOpportunities: z.array(RankingOpportunityInputSchema).default([]),
});
export type SiteIntelligenceInput = z.infer<typeof SiteIntelligenceInputSchema>;

export const OverallBreakdownRowSchema = z.object({
  componentId: z.string(),
  score: z.number().int().min(0).max(100),
  weight: z.number().positive(),
  confidence: ConfidenceLevelSchema,
});
export type OverallBreakdownRow = z.infer<typeof OverallBreakdownRowSchema>;

export const PageFlagSchema = z.object({
  route: z.string(),
  flag: z.literal("unlikely-to-rank-without-substantial-improvement"),
  reasons: z.array(z.string()).min(1),
  contentScore: z.number().int().min(0).max(100),
  importance: PageImportanceWeightSchema,
});
export type PageFlag = z.infer<typeof PageFlagSchema>;

export const SiteIntelligenceAssessmentSchema = z.object({
  evaluatorVersion: z.string(),
  evaluatedAt: IsoDateTimeSchema,
  scopeLabel: z.string(),
  technicalSeoHealth: ScoredComponentSchema,
  contentQuality: ScoredComponentSchema,
  websiteExperience: ScoredComponentSchema,
  contentEcosystemStrength: ScoredComponentSchema,
  competitiveContentStrength: ScoredComponentSchema,
  searchVisibility: ScoredComponentSchema,
  rankingOpportunities: z.array(ScoredComponentSchema).default([]),
  overallWebsiteQuality: ScoredComponentSchema,
  overallBreakdown: z.array(OverallBreakdownRowSchema).default([]),
  authorityLimitations: AuthorityLimitationsSchema,
  pageTypeRollups: z
    .array(
      z.object({
        pageType: z.string(),
        pageCount: z.number().int().min(0),
        weightedScore: z.number().int().min(0).max(100),
      }),
    )
    .default([]),
  clusterRollups: z
    .array(
      z.object({
        clusterId: z.string(),
        pageCount: z.number().int().min(0),
        weightedScore: z.number().int().min(0).max(100),
      }),
    )
    .default([]),
  pageFlags: z.array(PageFlagSchema).default([]),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  nextImprovements: z.array(z.string()).default([]),
  disclaimer: z.string(),
});
export type SiteIntelligenceAssessment = z.infer<
  typeof SiteIntelligenceAssessmentSchema
>;
