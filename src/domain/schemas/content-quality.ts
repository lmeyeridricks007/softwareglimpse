import { z } from "zod";
import { IsoDateTimeSchema } from "./primitives";

/**
 * Content Quality Evaluation — dimensional scoring for public editorial pages.
 * Complements site-audit (validity / readiness / issue ledger).
 * Evaluate only — never rewrite, publish, or mutate content.
 */

export const CONTENT_QUALITY_EVALUATOR_VERSION = "1.0.0";

/** Dimension score: 0 missing → 5 excellent. Integer only. */
export const DimensionScoreValueSchema = z.number().int().min(0).max(5);

export type DimensionScoreValue = z.infer<typeof DimensionScoreValueSchema>;

export const QualityBandSchema = z.enum([
  "excellent",
  "strong",
  "good-but-improvable",
  "weak",
  "poor",
  "critical-incomplete",
]);

export type QualityBand = z.infer<typeof QualityBandSchema>;

export const ContentQualityPageTypeSchema = z.enum([
  "article",
  "guide",
  "product-review",
  "comparison",
  "best",
  "product-guide",
  "industry",
  "use-case",
  "capability",
  "requirement",
  "feature",
  "implementation-guide",
  "resource",
  "tool-landing",
]);

export type ContentQualityPageType = z.infer<
  typeof ContentQualityPageTypeSchema
>;

export const ContentQualityDimensionIdSchema = z.enum([
  "user-intent-fit",
  "content-completeness",
  "subject-depth",
  "original-value",
  "evidence-source-quality",
  "research-freshness",
  "decision-support",
  "actionability",
  "structure-readability",
  "visual-media-support",
  "internal-linking",
  "journey-next-step",
  "trust-transparency",
  "content-differentiation",
  "page-type-specific",
]);

export type ContentQualityDimensionId = z.infer<
  typeof ContentQualityDimensionIdSchema
>;

export const QualityEvidenceSchema = z.object({
  label: z.string().min(1),
  detail: z.string().min(1).optional(),
  path: z.string().optional(),
  present: z.boolean().optional(),
});

export type QualityEvidence = z.infer<typeof QualityEvidenceSchema>;

export const QualityRecommendationSchema = z.object({
  summary: z.string().min(1),
  priority: z.enum(["critical", "major", "quick-win", "optional"]).default("major"),
  relatedDimension: ContentQualityDimensionIdSchema.optional(),
});

export type QualityRecommendation = z.infer<typeof QualityRecommendationSchema>;

export const DimensionAssessmentSchema = z.object({
  id: ContentQualityDimensionIdSchema,
  label: z.string().min(1),
  score: DimensionScoreValueSchema,
  weight: z.number().positive(),
  reason: z.string().min(1),
  evidence: z.array(QualityEvidenceSchema).default([]),
  gap: z.string().optional(),
  recommendations: z.array(QualityRecommendationSchema).default([]),
});

export type DimensionAssessment = z.infer<typeof DimensionAssessmentSchema>;

export const ContentQualityAssessmentSchema = z.object({
  contentId: z.string().min(1),
  route: z.string().min(1),
  pageType: ContentQualityPageTypeSchema,
  title: z.string().optional(),
  overallScore: z.number().int().min(0).max(100),
  qualityBand: QualityBandSchema,
  dimensions: z.array(DimensionAssessmentSchema).min(1),
  strengths: z.array(z.string().min(1)).default([]),
  weaknesses: z.array(z.string().min(1)).default([]),
  criticalGaps: z.array(z.string().min(1)).default([]),
  quickWins: z.array(z.string().min(1)).default([]),
  majorImprovements: z.array(z.string().min(1)).default([]),
  researchGaps: z.array(z.string().min(1)).default([]),
  linkingGaps: z.array(z.string().min(1)).default([]),
  mediaGaps: z.array(z.string().min(1)).default([]),
  toolOpportunities: z.array(z.string().min(1)).default([]),
  resourceOpportunities: z.array(z.string().min(1)).default([]),
  evaluatedAt: IsoDateTimeSchema,
  evaluatorVersion: z.string().min(1),
  profileId: z.string().min(1),
  notes: z.array(z.string().min(1)).default([]),
});

export type ContentQualityAssessment = z.infer<
  typeof ContentQualityAssessmentSchema
>;

/**
 * Normalized inspection surface for evaluation.
 * Fixtures and live loaders both map into this shape.
 * Does not mutate source content.
 */
export const PageIntentKindSchema = z.enum([
  "informational",
  "commercial",
  "implementation",
  "comparison",
  "mixed",
]);

export type PageIntentKind = z.infer<typeof PageIntentKindSchema>;

export const EvidenceSignalsSchema = z.object({
  primarySourceCount: z.number().int().nonnegative().default(0),
  officialDocCount: z.number().int().nonnegative().default(0),
  pricingSourceCount: z.number().int().nonnegative().default(0),
  screenshotCount: z.number().int().nonnegative().default(0),
  officialVideoCount: z.number().int().nonnegative().default(0),
  factRefCount: z.number().int().nonnegative().default(0),
  verificationDatesPresent: z.boolean().default(false),
  unsupportedClaimFlags: z.number().int().nonnegative().default(0),
});

export const FreshnessSignalsSchema = z.object({
  lastReviewedAt: z.string().optional(),
  sourcesVerifiedAt: z.string().optional(),
  pricingFresh: z.boolean().optional(),
  staleClaimFlags: z.number().int().nonnegative().default(0),
  brokenSourceFlags: z.number().int().nonnegative().default(0),
  obsoleteScreenshotFlags: z.number().int().nonnegative().default(0),
  withinPolicy: z.boolean().optional(),
});

export const StructureSignalsSchema = z.object({
  hasQuickAnswer: z.boolean().default(false),
  headingCount: z.number().int().nonnegative().default(0),
  hasLogicalSequence: z.boolean().default(true),
  usesTablesOrCards: z.boolean().default(false),
  bloatedIntro: z.boolean().default(false),
  excessiveFaqDuplication: z.boolean().default(false),
  repetitive: z.boolean().default(false),
});

export const MediaSignalsSchema = z.object({
  teachingVisualCount: z.number().int().nonnegative().default(0),
  decorativeOnly: z.boolean().default(false),
  workflowDiagram: z.boolean().default(false),
  comparisonMatrix: z.boolean().default(false),
  checklistVisual: z.boolean().default(false),
  subjectNeedsVisuals: z.boolean().default(true),
});

export const LinkingSignalsSchema = z.object({
  parentHubLink: z.boolean().default(false),
  supportingContentLinks: z.number().int().nonnegative().default(0),
  productLinks: z.number().int().nonnegative().default(0),
  toolLinks: z.number().int().nonnegative().default(0),
  resourceLinks: z.number().int().nonnegative().default(0),
  nextStepLink: z.boolean().default(false),
  orphanRisk: z.boolean().default(false),
  lowQualityLinkSpam: z.boolean().default(false),
});

export const JourneySignalsSchema = z.object({
  stage: z.string().optional(),
  nextStepFitsStage: z.boolean().optional(),
  nextStepLabel: z.string().optional(),
  missingNextStep: z.boolean().default(false),
});

export const TrustSignalsSchema = z.object({
  authorOrEditorialOwnership: z.boolean().default(false),
  methodologyReferenced: z.boolean().default(false),
  updatedDateVisible: z.boolean().default(false),
  sourceTransparency: z.boolean().default(false),
  affiliateDisclosure: z.boolean().default(false),
  limitationsNoted: z.boolean().default(false),
  confidenceStated: z.boolean().default(false),
});

export const DifferentiationSignalsSchema = z.object({
  distinctPurpose: z.boolean().default(true),
  duplicateIntentRisk: z.boolean().default(false),
  nearDuplicateOf: z.string().optional(),
  genericCategoryCopy: z.boolean().default(false),
  onlyH1Changed: z.boolean().default(false),
  semanticOverlapWith: z.array(z.string().min(1)).default([]),
});

export const PageTypeChecklistSchema = z.object({
  passed: z.array(z.string().min(1)).default([]),
  failed: z.array(z.string().min(1)).default([]),
});

export const PageQualitySnapshotSchema = z.object({
  contentId: z.string().min(1),
  route: z.string().min(1),
  pageType: ContentQualityPageTypeSchema,
  title: z.string().min(1),
  h1: z.string().optional(),
  summary: z.string().optional(),
  /** Declared / inferred primary intent for the page. */
  primaryIntent: PageIntentKindSchema,
  /** Detected secondary intents that may dilute focus. */
  secondaryIntents: z.array(PageIntentKindSchema).default([]),
  /** Expected template section ids present on the page. */
  presentSections: z.array(z.string().min(1)).default([]),
  /** Expected template section ids missing. */
  missingSections: z.array(z.string().min(1)).default([]),
  /** Depth signals (workflows, trade-offs, edge cases, examples, …). */
  depthSignals: z.array(z.string().min(1)).default([]),
  /** Original SoftwareGlimpse value (frameworks, scorecards, assessments, …). */
  originalValueSignals: z.array(z.string().min(1)).default([]),
  evidenceSignals: EvidenceSignalsSchema.optional(),
  freshness: FreshnessSignalsSchema.optional(),
  decisionSupportSignals: z.array(z.string().min(1)).default([]),
  actionSignals: z.array(z.string().min(1)).default([]),
  structure: StructureSignalsSchema.optional(),
  media: MediaSignalsSchema.optional(),
  linking: LinkingSignalsSchema.optional(),
  journey: JourneySignalsSchema.optional(),
  trust: TrustSignalsSchema.optional(),
  differentiation: DifferentiationSignalsSchema.optional(),
  /** Page-type checklist hits (profile-specific). */
  pageTypeChecklist: PageTypeChecklistSchema.optional(),
  /** Free-form notes for the evaluator / fixtures. */
  notes: z.array(z.string().min(1)).default([]),
});

export type PageQualitySnapshot = z.infer<typeof PageQualitySnapshotSchema>;
export type PageQualitySnapshotInput = z.input<typeof PageQualitySnapshotSchema>;

/** Fill optional nested groups so scorers always see concrete values. */
export function normalizePageQualitySnapshot(
  snap: PageQualitySnapshot,
): PageQualitySnapshot & {
  evidenceSignals: z.infer<typeof EvidenceSignalsSchema>;
  freshness: z.infer<typeof FreshnessSignalsSchema>;
  structure: z.infer<typeof StructureSignalsSchema>;
  media: z.infer<typeof MediaSignalsSchema>;
  linking: z.infer<typeof LinkingSignalsSchema>;
  journey: z.infer<typeof JourneySignalsSchema>;
  trust: z.infer<typeof TrustSignalsSchema>;
  differentiation: z.infer<typeof DifferentiationSignalsSchema>;
  pageTypeChecklist: z.infer<typeof PageTypeChecklistSchema>;
} {
  return {
    ...snap,
    evidenceSignals: EvidenceSignalsSchema.parse(snap.evidenceSignals ?? {}),
    freshness: FreshnessSignalsSchema.parse(snap.freshness ?? {}),
    structure: StructureSignalsSchema.parse(snap.structure ?? {}),
    media: MediaSignalsSchema.parse(snap.media ?? {}),
    linking: LinkingSignalsSchema.parse(snap.linking ?? {}),
    journey: JourneySignalsSchema.parse(snap.journey ?? {}),
    trust: TrustSignalsSchema.parse(snap.trust ?? {}),
    differentiation: DifferentiationSignalsSchema.parse(
      snap.differentiation ?? {},
    ),
    pageTypeChecklist: PageTypeChecklistSchema.parse(
      snap.pageTypeChecklist ?? {},
    ),
  };
}
