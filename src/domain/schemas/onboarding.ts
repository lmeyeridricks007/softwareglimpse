import { z } from "zod";
import { canonicalizeComparisonSlug } from "../comparison-slug";
import { ResearchDomainSchema } from "./research-source";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";
import {
  ProductLifecycleSchema,
  SoftwareEntityTypeSchema,
} from "./software";

export const OnboardingSourceSchema = z.enum([
  "affiliate-catalogue",
  "manual",
  "migration",
  "existing-content",
]);

export type OnboardingSource = z.infer<typeof OnboardingSourceSchema>;

export const OnboardingModeSchema = z.enum(["new", "reconcile"]);

export type OnboardingMode = z.infer<typeof OnboardingModeSchema>;

export const OnboardingStageIdSchema = z.enum([
  "intake",
  "identity",
  "duplication-check",
  "taxonomy",
  "research-planning",
  "research",
  "enrichment",
  "relationship-resolution",
  "editorial-readiness",
  "pricing-readiness",
  "content-mapping",
  "internal-link-planning",
  "validation",
  "onboarding-summary",
]);

export type OnboardingStageId = z.infer<typeof OnboardingStageIdSchema>;

export const ONBOARDING_STAGE_ORDER: readonly OnboardingStageId[] = [
  "intake",
  "identity",
  "duplication-check",
  "taxonomy",
  "research-planning",
  "research",
  "enrichment",
  "relationship-resolution",
  "editorial-readiness",
  "pricing-readiness",
  "content-mapping",
  "internal-link-planning",
  "validation",
  "onboarding-summary",
] as const;

export const OnboardingStageStatusSchema = z.enum([
  "pending",
  "running",
  "completed",
  "skipped",
  "blocked",
  "failed",
]);

export type OnboardingStageStatus = z.infer<typeof OnboardingStageStatusSchema>;

export const OnboardingRunStatusSchema = z.enum([
  "created",
  "validating",
  "classifying",
  "researching",
  "enriching",
  "relationships",
  "planning-content",
  "review-required",
  "ready",
  "blocked",
  "failed",
]);

export type OnboardingRunStatus = z.infer<typeof OnboardingRunStatusSchema>;

export const OnboardingBlockerCodeSchema = z.enum([
  "UNKNOWN_IDENTITY",
  "POSSIBLE_DUPLICATE",
  "NOT_STANDARD_SOFTWARE",
  "CATEGORY_MISSING",
  "CATEGORY_NOT_READY",
  "CATEGORY_GAP",
  "RESEARCH_INCOMPLETE",
  "RESEARCH_PROVIDER_UNAVAILABLE",
  "PRICING_UNSUPPORTED",
  "RELATIONSHIP_REVIEW",
  "MIGRATION_CONFLICT",
  "EDITORIAL_DATA_MISSING",
  "DISCONTINUED_PRODUCT",
  "INVALID_STAGE_TRANSITION",
  "TASK_DEPENDENCY_CYCLE",
]);

export type OnboardingBlockerCode = z.infer<typeof OnboardingBlockerCodeSchema>;

export const OnboardingSeveritySchema = z.enum(["blocker", "warning"]);

export type OnboardingSeverity = z.infer<typeof OnboardingSeveritySchema>;

export const OnboardingIssueSchema = z.object({
  code: OnboardingBlockerCodeSchema,
  severity: OnboardingSeveritySchema,
  message: z.string().min(1),
  stageId: OnboardingStageIdSchema.optional(),
});

export type OnboardingIssue = z.infer<typeof OnboardingIssueSchema>;

export const DuplicateOutcomeSchema = z.enum([
  "NEW",
  "EXISTING",
  "POSSIBLE_DUPLICATE",
  "RENAMED_PRODUCT",
]);

export type DuplicateOutcome = z.infer<typeof DuplicateOutcomeSchema>;

export const TaxonomyConfidenceSchema = z.enum(["high", "medium", "low"]);

export type TaxonomyConfidence = z.infer<typeof TaxonomyConfidenceSchema>;

export const TaxonomyAssignmentSchema = z.object({
  slug: SlugSchema,
  role: z.enum([
    "primary",
    "secondary",
    "subcategory",
    "industry",
    "use-case",
    "business-type",
    "team-type",
  ]),
  confidence: TaxonomyConfidenceSchema,
  reason: z.string().optional(),
});

export type TaxonomyAssignment = z.infer<typeof TaxonomyAssignmentSchema>;

export const CategoryGapSchema = z.object({
  productSlug: SlugSchema,
  candidateLabel: z.string().min(1),
  reason: z.string().min(1),
  similarCategorySlugs: z.array(SlugSchema).default([]),
});

export type CategoryGap = z.infer<typeof CategoryGapSchema>;

export const ResearchPlanSchema = z.object({
  productSlug: SlugSchema,
  primaryCategorySlug: SlugSchema,
  requiredDomains: z.array(ResearchDomainSchema).min(1),
  optionalDomains: z.array(ResearchDomainSchema).default([]),
  notes: z.array(z.string()).default([]),
});

export type ResearchPlan = z.infer<typeof ResearchPlanSchema>;

export const RelationshipCandidateStatusSchema = z.enum([
  "candidate",
  "approved",
  "rejected",
]);

export type RelationshipCandidateStatus = z.infer<
  typeof RelationshipCandidateStatusSchema
>;

export const RelationshipCandidateSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["competes-with", "alternative-to", "related-to"]),
  targetSlug: SlugSchema,
  confidence: TaxonomyConfidenceSchema,
  status: RelationshipCandidateStatusSchema.default("candidate"),
  origin: z.enum(["taxonomy", "graph", "research", "manual", "editorial"]),
  reason: z.string().min(1),
});

export type RelationshipCandidate = z.infer<typeof RelationshipCandidateSchema>;

export const PricingReadinessStatusSchema = z.enum([
  "FULL",
  "PARTIAL",
  "CUSTOM_QUOTE",
  "UNSUPPORTED_MODEL",
  "INSUFFICIENT_RESEARCH",
]);

export type PricingReadinessStatus = z.infer<
  typeof PricingReadinessStatusSchema
>;

export const FinderReadinessStatusSchema = z.enum([
  "ELIGIBLE",
  "NOT_ELIGIBLE",
  "NOT_APPLICABLE",
  "FUTURE",
]);

export type FinderReadinessStatus = z.infer<typeof FinderReadinessStatusSchema>;

export const PageCandidateStatusSchema = z.enum([
  "ready-to-create",
  "research-required",
  "relationship-review-required",
  "category-blocked",
  "duplicate",
  "not-recommended",
  "blocked",
]);

export type PageCandidateStatus = z.infer<typeof PageCandidateStatusSchema>;

export const OnboardingPageTypeSchema = z.enum([
  "software-review",
  "pricing",
  "alternatives",
  "comparison",
  "best-inclusion",
  "category-hub",
  "guide",
]);

export type OnboardingPageType = z.infer<typeof OnboardingPageTypeSchema>;

export const PageCandidateSchema = z.object({
  id: z.string().min(1),
  pageType: OnboardingPageTypeSchema,
  canonicalPath: z.string().startsWith("/"),
  canonicalIntent: z.string().min(1),
  productSlugs: z.array(SlugSchema).default([]),
  categorySlug: SlugSchema.optional(),
  audienceSlug: SlugSchema.optional(),
  reason: z.string().min(1),
  readiness: PageCandidateStatusSchema,
  priority: z.number().int().min(0).max(100).default(50),
  dependencies: z.array(z.string()).default([]),
  status: PageCandidateStatusSchema,
});

export type PageCandidate = z.infer<typeof PageCandidateSchema>;

export const InternalLinkCandidateSchema = z.object({
  sourceContentHint: z.string().min(1),
  targetContentHint: z.string().min(1),
  relationship: z.string().min(1),
  suggestedContext: z.string().optional(),
  anchorConcept: z.string().optional(),
  reason: z.string().min(1),
  priority: z.number().int().min(0).max(100).default(50),
  activeWhenPublished: z.boolean().default(true),
});

export type InternalLinkCandidate = z.infer<typeof InternalLinkCandidateSchema>;

export const AgentTypeSchema = z.enum([
  "research-agent",
  "software-review-agent",
  "pricing-page-agent",
  "comparison-agent",
  "alternatives-agent",
  /** @deprecated Prefer best-software-agent — kept for older handoff JSON. */
  "best-page-agent",
  "best-software-agent",
  "category-hub-agent",
  "use-case-agent",
  "use-case-page-agent",
  "guide-agent",
  "internal-link-agent",
  "refresh-agent",
  "qa-agent",
  "category-knowledge-planner-agent",
  "product-knowledge-planner-agent",
  "supporting-content-planner-agent",
]);

export type AgentType = z.infer<typeof AgentTypeSchema>;

export const AgentTaskStatusSchema = z.enum([
  "READY",
  "BLOCKED",
  "WAITING",
  "COMPLETE",
]);

export type AgentTaskStatus = z.infer<typeof AgentTaskStatusSchema>;

/**
 * Handoff contract for specialized agents (not implementations).
 * Orchestrator must not know agent internals.
 */
export const AgentHandoffTaskSchema = z.object({
  id: z.string().min(1),
  agentType: AgentTypeSchema,
  contentId: z.string().optional(),
  productIds: z.array(SlugSchema).default([]),
  categoryIds: z.array(SlugSchema).default([]),
  dependencies: z.array(z.string()).default([]),
  status: AgentTaskStatusSchema,
  statusReason: z.string().optional(),
  briefInput: z.record(z.string(), z.unknown()).default({}),
  effort: z.enum(["small", "medium", "large"]).default("medium"),
});

export type AgentHandoffTask = z.infer<typeof AgentHandoffTaskSchema>;

export const SoftwareOnboardingRequestSchema = z.object({
  name: z.string().min(1),
  slug: SlugSchema.optional(),
  website: z.string().url().optional(),
  source: OnboardingSourceSchema.default("manual"),
  affiliateProgramId: z.string().optional(),
  suggestedCategoryIds: z.array(SlugSchema).default([]),
  entityTypeHint: SoftwareEntityTypeSchema.optional(),
  aliases: z.array(z.string().min(1)).default([]),
  options: z
    .object({
      runResearch: z.boolean().default(true),
      createContentPlan: z.boolean().default(true),
      dryRun: z.boolean().default(false),
      resumeRunId: z.string().optional(),
      allowFixtures: z.boolean().default(true),
      autoApproveResearch: z.boolean().default(false),
      mergeResearch: z.boolean().default(false),
    })
    .default({
      runResearch: true,
      createContentPlan: true,
      dryRun: false,
      allowFixtures: true,
      autoApproveResearch: false,
      mergeResearch: false,
    }),
});

export type SoftwareOnboardingRequest = z.infer<
  typeof SoftwareOnboardingRequestSchema
>;

export const OnboardingStageResultSchema = z.object({
  stageId: OnboardingStageIdSchema,
  status: OnboardingStageStatusSchema,
  startedAt: IsoDateTimeSchema.optional(),
  completedAt: IsoDateTimeSchema.optional(),
  summary: z.string().optional(),
  issues: z.array(OnboardingIssueSchema).default([]),
  data: z.record(z.string(), z.unknown()).default({}),
});

export type OnboardingStageResult = z.infer<typeof OnboardingStageResultSchema>;

export const OnboardingScorecardSchema = z.object({
  productName: z.string().min(1),
  productSlug: SlugSchema,
  identity: z.enum(["PASS", "FAIL", "PARTIAL"]),
  entityType: SoftwareEntityTypeSchema,
  taxonomy: z.enum(["PASS", "FAIL", "PARTIAL", "GAP"]),
  researchPercent: z.number().min(0).max(100),
  pricing: PricingReadinessStatusSchema,
  relationships: z.enum(["PASS", "REVIEW_REQUIRED", "NONE"]),
  productPage: PageCandidateStatusSchema,
  pricingPage: PageCandidateStatusSchema,
  alternativesPage: PageCandidateStatusSchema,
  comparisonsReady: z.number().int().nonnegative(),
  comparisonsBlocked: z.number().int().nonnegative(),
  bestPageEligibility: z.enum(["READY", "NOT_READY", "NOT_APPLICABLE"]),
  internalLinking: z.enum(["READY", "PARTIAL", "BLOCKED"]),
  overall: z.enum([
    "READY",
    "READY_WITH_REVIEW",
    "BLOCKED",
    "FAILED",
    "RECONCILE_OK",
  ]),
  lines: z.array(z.string()).default([]),
});

export type OnboardingScorecard = z.infer<typeof OnboardingScorecardSchema>;

export const SoftwareOnboardingRunSchema = z.object({
  id: z.string().min(1),
  productSlug: SlugSchema.optional(),
  productId: z.string().optional(),
  request: SoftwareOnboardingRequestSchema,
  mode: OnboardingModeSchema.default("new"),
  status: OnboardingRunStatusSchema.default("created"),
  stages: z.array(OnboardingStageResultSchema).default([]),
  duplicateOutcome: DuplicateOutcomeSchema.optional(),
  entityType: SoftwareEntityTypeSchema.optional(),
  productLifecycle: ProductLifecycleSchema.optional(),
  taxonomy: z.array(TaxonomyAssignmentSchema).default([]),
  categoryGaps: z.array(CategoryGapSchema).default([]),
  researchPlan: ResearchPlanSchema.optional(),
  researchCompletenessPercent: z.number().min(0).max(100).optional(),
  relationshipCandidates: z.array(RelationshipCandidateSchema).default([]),
  pricingReadiness: PricingReadinessStatusSchema.optional(),
  finderReadiness: z
    .object({
      crmFinder: FinderReadinessStatusSchema,
      generalFinder: FinderReadinessStatusSchema,
      notes: z.array(z.string()).default([]),
    })
    .optional(),
  pageCandidates: z.array(PageCandidateSchema).default([]),
  internalLinkCandidates: z.array(InternalLinkCandidateSchema).default([]),
  agentTasks: z.array(AgentHandoffTaskSchema).default([]),
  issues: z.array(OnboardingIssueSchema).default([]),
  scorecard: OnboardingScorecardSchema.optional(),
  affiliateStatus: z.enum(["LINKED", "NONE", "CATALOGUE_HINT"]).default("NONE"),
  migrationNotes: z.array(z.string()).default([]),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
  completedAt: IsoDateTimeSchema.optional(),
});

export type SoftwareOnboardingRun = z.infer<typeof SoftwareOnboardingRunSchema>;

export function comparisonCandidateId(
  productA: string,
  productB: string,
): string {
  const slug = canonicalizeComparisonSlug([productA, productB]);
  return `page-candidate:comparison:${slug}`;
}

export function onboardingRunId(slug: string, nowMs = Date.now()): string {
  return `onboard-${slug}-${nowMs}`;
}
