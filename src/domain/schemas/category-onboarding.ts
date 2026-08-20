import { z } from "zod";
import { ResearchDomainSchema } from "./research-source";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";
import { MethodologySchema } from "./editorial";
import { SupportingKnowledgePlanSchema } from "./content-clusters";

/** Category lifecycle — distinct from page publish status. */
export const CategoryLifecycleSchema = z.enum([
  "candidate",
  "active",
  "deprecated",
  "merged",
  "archived",
]);

export type CategoryLifecycle = z.infer<typeof CategoryLifecycleSchema>;

export const CategoryOnboardingSourceSchema = z.enum([
  "manual",
  "catalogue-analysis",
  "category-gap",
  "migration",
]);

export type CategoryOnboardingSource = z.infer<
  typeof CategoryOnboardingSourceSchema
>;

export const CategoryDuplicateOutcomeSchema = z.enum([
  "NEW",
  "EXISTING",
  "POSSIBLE_DUPLICATE",
  "ALIAS",
  "SUBCATEGORY",
]);

export type CategoryDuplicateOutcome = z.infer<
  typeof CategoryDuplicateOutcomeSchema
>;

export const CategoryOnboardingStageIdSchema = z.enum([
  "intake",
  "identity",
  "duplication-check",
  "taxonomy",
  "scope-definition",
  "feature-model",
  "research-model",
  "editorial-methodology",
  "comparison-methodology",
  "pricing-model",
  "recommendation-model",
  "content-model",
  "tool-readiness",
  "membership",
  "validation",
  "onboarding-summary",
]);

export type CategoryOnboardingStageId = z.infer<
  typeof CategoryOnboardingStageIdSchema
>;

export const CATEGORY_ONBOARDING_STAGE_ORDER: readonly CategoryOnboardingStageId[] =
  [
    "intake",
    "identity",
    "duplication-check",
    "taxonomy",
    "scope-definition",
    "feature-model",
    "research-model",
    "editorial-methodology",
    "comparison-methodology",
    "pricing-model",
    "recommendation-model",
    "content-model",
    "tool-readiness",
    "membership",
    "validation",
    "onboarding-summary",
  ] as const;

export const CategoryOnboardingStageStatusSchema = z.enum([
  "pending",
  "running",
  "completed",
  "skipped",
  "blocked",
  "failed",
]);

export const CategoryOnboardingRunStatusSchema = z.enum([
  "created",
  "validating",
  "defining",
  "review-required",
  "ready",
  "ready-with-warnings",
  "blocked",
  "failed",
]);

export type CategoryOnboardingRunStatus = z.infer<
  typeof CategoryOnboardingRunStatusSchema
>;

export const CategoryBlockerCodeSchema = z.enum([
  "CATEGORY_DUPLICATE",
  "PARENT_CATEGORY_MISSING",
  "SCOPE_UNDEFINED",
  "NO_FEATURE_MODEL",
  "NO_RESEARCH_REQUIREMENTS",
  "NO_EDITORIAL_METHODOLOGY",
  "NO_COMPARISON_METHODOLOGY",
  "INSUFFICIENT_PRODUCT_COVERAGE",
  "PRICING_MODEL_UNSUPPORTED",
  "INVALID_WEIGHTS",
  "TAXONOMY_CYCLE",
  "UNKNOWN_FEATURE_REFERENCE",
  "INVALID_SEED_PRODUCT",
]);

export type CategoryBlockerCode = z.infer<typeof CategoryBlockerCodeSchema>;

export const CategoryIssueSchema = z.object({
  code: CategoryBlockerCodeSchema.or(z.string()),
  severity: z.enum(["blocker", "warning"]),
  message: z.string().min(1),
  stageId: CategoryOnboardingStageIdSchema.optional(),
});

export type CategoryIssue = z.infer<typeof CategoryIssueSchema>;

export const ScopeRuleSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  notes: z.string().optional(),
});

export type ScopeRule = z.infer<typeof ScopeRuleSchema>;

export const CategoryScopeSchema = z.object({
  definition: z.string().min(1),
  includes: z.array(ScopeRuleSchema).default([]),
  excludes: z.array(ScopeRuleSchema).default([]),
  adjacentCategorySlugs: z.array(SlugSchema).default([]),
  classificationNotes: z.array(z.string()).default([]),
});

export type CategoryScope = z.infer<typeof CategoryScopeSchema>;

export const FeatureImportanceSchema = z.enum([
  "core",
  "important",
  "optional",
  "specialist",
]);

export type FeatureImportance = z.infer<typeof FeatureImportanceSchema>;

export const CategoryFeatureDefinitionSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  importance: FeatureImportanceSchema.default("important"),
  comparisonRelevant: z.boolean().default(true),
  finderRelevant: z.boolean().default(false),
  researchGuidance: z.string().optional(),
  aliases: z.array(z.string()).default([]),
  parentFeatureSlug: SlugSchema.optional(),
});

export type CategoryFeatureDefinition = z.infer<
  typeof CategoryFeatureDefinitionSchema
>;

export const ResearchRequirementLevelSchema = z.enum([
  "required",
  "recommended",
  "optional",
]);

export const CategoryResearchRequirementSchema = z.object({
  domain: ResearchDomainSchema.or(z.string().min(1)),
  level: ResearchRequirementLevelSchema,
  featureSlugs: z.array(SlugSchema).default([]),
  notes: z.string().optional(),
});

export type CategoryResearchRequirement = z.infer<
  typeof CategoryResearchRequirementSchema
>;

export const PricingDimensionSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  description: z.string().optional(),
  enginePrimitive: z
    .enum([
      "flat",
      "per-seat",
      "per-unit",
      "tiered",
      "usage",
      "addon",
      "minimum",
      "custom",
      "unknown",
    ])
    .default("unknown"),
  unitHint: z.string().optional(),
  required: z.boolean().default(false),
});

export type PricingDimension = z.infer<typeof PricingDimensionSchema>;

export const PricingCapabilityStatusSchema = z.enum([
  "SUPPORTED",
  "PARTIAL",
  "UNSUPPORTED",
]);

export type PricingCapabilityStatus = z.infer<
  typeof PricingCapabilityStatusSchema
>;

export const ComparisonCriterionKindSchema = z.enum(["factual", "editorial"]);

export const CategoryComparisonCriterionSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  description: z.string().optional(),
  kind: ComparisonCriterionKindSchema,
  displayOrder: z.number().int().nonnegative().default(0),
  decisionImportance: z.enum(["high", "medium", "low"]).default("medium"),
  featureSlug: SlugSchema.optional(),
});

export type CategoryComparisonCriterion = z.infer<
  typeof CategoryComparisonCriterionSchema
>;

export const RecommendationDimensionSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  description: z.string().optional(),
  finderRelevant: z.boolean().default(true),
});

export type RecommendationDimension = z.infer<
  typeof RecommendationDimensionSchema
>;

export const FinderReadinessLevelSchema = z.enum([
  "NOT_READY",
  "DATA_MODEL_READY",
  "ENGINE_READY",
  "UI_READY",
]);

export type FinderReadinessLevel = z.infer<typeof FinderReadinessLevelSchema>;

export const CategoryUseCaseDefinitionSchema = z.object({
  slug: SlugSchema,
  name: z.string().min(1),
  description: z.string().optional(),
  pageEligibility: z
    .enum(["taxonomy-only", "content-candidate", "published"])
    .default("taxonomy-only"),
  audienceSlugs: z.array(SlugSchema).default([]),
});

export type CategoryUseCaseDefinition = z.infer<
  typeof CategoryUseCaseDefinitionSchema
>;

export const MembershipRoleSchema = z.enum([
  "primary",
  "secondary",
  "adjacent",
  "uncertain",
  "rejected",
]);

export type MembershipRole = z.infer<typeof MembershipRoleSchema>;

export const CategoryMembershipSchema = z.object({
  productSlug: SlugSchema,
  role: MembershipRoleSchema,
  confidence: z.enum(["high", "medium", "low"]).default("medium"),
  reason: z.string().min(1),
  existsInCatalogue: z.boolean().default(false),
});

export type CategoryMembership = z.infer<typeof CategoryMembershipSchema>;

export const CategoryContentCandidateSchema = z.object({
  id: z.string().min(1),
  pageType: z.enum([
    "category-hub",
    "best",
    "use-case-best",
    "software-review",
    "pricing",
    "comparison",
    "alternatives",
    "guide",
  ]),
  canonicalPath: z.string().startsWith("/"),
  status: z.enum([
    "ready-to-create",
    "blocked",
    "missing",
    "exists",
    "not-recommended",
  ]),
  reason: z.string().min(1),
  dependencies: z.array(z.string()).default([]),
  priority: z.number().int().min(0).max(100).default(50),
});

export type CategoryContentCandidate = z.infer<
  typeof CategoryContentCandidateSchema
>;

export const CategoryCoverageThresholdsSchema = z.object({
  hubMinProducts: z.number().int().positive().default(3),
  bestMinResearchedProducts: z.number().int().positive().default(4),
  comparisonMinCompetitors: z.number().int().positive().default(2),
  finderMinEnrichedProducts: z.number().int().positive().default(4),
});

export type CategoryCoverageThresholds = z.infer<
  typeof CategoryCoverageThresholdsSchema
>;

/**
 * Full category decision-domain definition (config versioned).
 */
export const CategoryDefinitionSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  shortDescription: z.string().min(1),
  parentSlug: SlugSchema.nullable().default(null),
  aliases: z.array(z.string()).default([]),
  lifecycle: CategoryLifecycleSchema.default("candidate"),
  configVersion: z.string().min(1).default("1.0.0"),
  scope: CategoryScopeSchema,
  features: z.array(CategoryFeatureDefinitionSchema).min(1),
  researchRequirements: z.array(CategoryResearchRequirementSchema).min(1),
  editorialMethodology: MethodologySchema,
  comparisonCriteria: z.array(CategoryComparisonCriterionSchema).min(1),
  pricingDimensions: z.array(PricingDimensionSchema).default([]),
  pricingCapability: PricingCapabilityStatusSchema.default("PARTIAL"),
  pricingCapabilityNotes: z.array(z.string()).default([]),
  recommendationDimensions: z.array(RecommendationDimensionSchema).default([]),
  finderReadiness: FinderReadinessLevelSchema.default("NOT_READY"),
  finderNotes: z.array(z.string()).default([]),
  useCases: z.array(CategoryUseCaseDefinitionSchema).default([]),
  audienceSlugs: z.array(SlugSchema).default([]),
  businessSizeSlugs: z.array(SlugSchema).default([]),
  businessTypeSlugs: z.array(SlugSchema).default([]),
  seedProductSlugs: z.array(SlugSchema).default([]),
  queryAliases: z.array(z.string()).default([]),
  coverageThresholds: CategoryCoverageThresholdsSchema.default({
    hubMinProducts: 3,
    bestMinResearchedProducts: 4,
    comparisonMinCompetitors: 2,
    finderMinEnrichedProducts: 4,
  }),
  /** Maps into software onboarding policy override. */
  requiredResearchDomains: z.array(ResearchDomainSchema).default([]),
  optionalResearchDomains: z.array(ResearchDomainSchema).default([]),
  pricingModelsSupported: z
    .array(
      z.enum([
        "per-seat",
        "flat",
        "contact-tiers",
        "usage",
        "credits",
        "custom",
        "hybrid",
      ]),
    )
    .default([]),
  notes: z.array(z.string()).default([]),
  /** Expected supporting knowledge areas for cluster planning (optional). */
  supportingKnowledgeAreas: z
    .array(
      z.enum([
        "fundamentals",
        "selection",
        "pricing",
        "features",
        "implementation",
        "migration",
        "usage",
        "troubleshooting",
        "strategy",
        "integrations",
      ]),
    )
    .default([]),
});

export type CategoryDefinition = z.infer<typeof CategoryDefinitionSchema>;

export const CategoryOnboardingRequestSchema = z.object({
  name: z.string().min(1),
  slug: SlugSchema.optional(),
  parentCategorySlug: SlugSchema.optional(),
  source: CategoryOnboardingSourceSchema.default("manual"),
  seedProductSlugs: z.array(SlugSchema).default([]),
  options: z
    .object({
      dryRun: z.boolean().default(false),
      reconcile: z.boolean().default(false),
      resumeRunId: z.string().optional(),
      activate: z.boolean().default(true),
    })
    .default({
      dryRun: false,
      reconcile: false,
      activate: true,
    }),
});

export type CategoryOnboardingRequest = z.infer<
  typeof CategoryOnboardingRequestSchema
>;

export const CategoryStageResultSchema = z.object({
  stageId: CategoryOnboardingStageIdSchema,
  status: CategoryOnboardingStageStatusSchema,
  startedAt: IsoDateTimeSchema.optional(),
  completedAt: IsoDateTimeSchema.optional(),
  summary: z.string().optional(),
  issues: z.array(CategoryIssueSchema).default([]),
  data: z.record(z.string(), z.unknown()).default({}),
});

export type CategoryStageResult = z.infer<typeof CategoryStageResultSchema>;

export const CategoryScorecardSchema = z.object({
  categoryName: z.string().min(1),
  categorySlug: SlugSchema,
  identity: z.enum(["PASS", "FAIL", "PARTIAL"]),
  hierarchy: z.enum(["PASS", "FAIL", "PARTIAL"]),
  scope: z.enum(["PASS", "FAIL", "PARTIAL"]),
  features: z.enum(["PASS", "FAIL", "PARTIAL"]),
  researchModel: z.enum(["PASS", "FAIL", "PARTIAL"]),
  editorialMethodology: z.enum(["PASS", "FAIL", "PARTIAL"]),
  comparisonMethodology: z.enum(["PASS", "FAIL", "PARTIAL"]),
  pricingModel: z.enum(["PASS", "PARTIAL", "FAIL"]),
  useCases: z.enum(["PASS", "FAIL", "PARTIAL"]),
  contentArchitecture: z.enum(["PASS", "FAIL", "PARTIAL"]),
  finderReadiness: FinderReadinessLevelSchema,
  productCoverage: z.number().int().nonnegative(),
  overall: z.enum([
    "READY",
    "READY_WITH_WARNINGS",
    "READY_WITH_PRICING_GAP",
    "BLOCKED",
    "FAILED",
    "RECONCILE_OK",
  ]),
  lines: z.array(z.string()).default([]),
});

export type CategoryScorecard = z.infer<typeof CategoryScorecardSchema>;

export const CategoryAgentContextSchema = z.object({
  contextRef: z.string().min(1),
  category: z.object({
    slug: SlugSchema,
    name: z.string().min(1),
    parentSlug: SlugSchema.nullable(),
    shortDescription: z.string(),
    configVersion: z.string(),
    lifecycle: CategoryLifecycleSchema,
  }),
  featureDefinitions: z.array(CategoryFeatureDefinitionSchema),
  researchRequirements: z.array(CategoryResearchRequirementSchema),
  editorialMethodology: MethodologySchema,
  comparisonMethodology: z.array(CategoryComparisonCriterionSchema),
  pricingDimensions: z.array(PricingDimensionSchema),
  pricingCapability: PricingCapabilityStatusSchema,
  useCases: z.array(CategoryUseCaseDefinitionSchema),
  finderReadiness: FinderReadinessLevelSchema,
  supportingKnowledgePlan: SupportingKnowledgePlanSchema.optional(),
  knowledgeCoverage: z
    .object({
      coreCount: z.number().int().nonnegative().optional(),
      existingCount: z.number().int().nonnegative().optional(),
      newPageCount: z.number().int().nonnegative().optional(),
    })
    .optional(),
});

export type CategoryAgentContext = z.infer<typeof CategoryAgentContextSchema>;

export const CategoryAgentHandoffTaskSchema = z.object({
  id: z.string().min(1),
  agentType: z.enum([
    "category-hub-agent",
    "best-page-agent",
    "comparison-agent",
    "alternatives-agent",
    "software-review-agent",
    "pricing-page-agent",
    "research-agent",
    "qa-agent",
    "guide-agent",
    "category-knowledge-planner-agent",
    "product-knowledge-planner-agent",
    "supporting-content-planner-agent",
  ]),
  categoryId: SlugSchema,
  status: z.enum(["READY", "BLOCKED", "WAITING", "COMPLETE"]),
  statusReason: z.string().optional(),
  dependencies: z.array(z.string()).default([]),
  contextRef: z.string().min(1),
  briefInput: z.record(z.string(), z.unknown()).default({}),
});

export type CategoryAgentHandoffTask = z.infer<
  typeof CategoryAgentHandoffTaskSchema
>;

export const CategoryOnboardingRunSchema = z.object({
  id: z.string().min(1),
  categorySlug: SlugSchema.optional(),
  request: CategoryOnboardingRequestSchema,
  mode: z.enum(["new", "reconcile"]).default("new"),
  status: CategoryOnboardingRunStatusSchema.default("created"),
  stages: z.array(CategoryStageResultSchema).default([]),
  duplicateOutcome: CategoryDuplicateOutcomeSchema.optional(),
  definition: CategoryDefinitionSchema.optional(),
  memberships: z.array(CategoryMembershipSchema).default([]),
  contentCandidates: z.array(CategoryContentCandidateSchema).default([]),
  supportingKnowledgePlan: SupportingKnowledgePlanSchema.optional(),
  agentTasks: z.array(CategoryAgentHandoffTaskSchema).default([]),
  agentContext: CategoryAgentContextSchema.optional(),
  issues: z.array(CategoryIssueSchema).default([]),
  scorecard: CategoryScorecardSchema.optional(),
  activated: z.boolean().default(false),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
  completedAt: IsoDateTimeSchema.optional(),
});

export type CategoryOnboardingRun = z.infer<typeof CategoryOnboardingRunSchema>;

export function categoryOnboardingRunId(
  slug: string,
  nowMs = Date.now(),
): string {
  return `cat-onboard-${slug}-${nowMs}`;
}

export function categoryAgentContextRef(
  slug: string,
  version: string,
): string {
  return `category-agent-context:${slug}:v${version}`;
}
