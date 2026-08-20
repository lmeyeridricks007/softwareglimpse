import { z } from "zod";
import { SlugSchema } from "./primitives";

/**
 * Presentation profile for Requirement Detail pages.
 * Buyer-need oriented: maps requirements → features → product evidence.
 * Product claims come from enrichment at build time.
 */

export const RequirementFeatureRelationSchema = z.enum([
  "required",
  "strongly-supporting",
  "supporting",
  "optional",
]);

export type RequirementFeatureRelation = z.infer<
  typeof RequirementFeatureRelationSchema
>;

export const RequirementFeatureLinkSchema = z.object({
  featureSlug: SlugSchema,
  /** Public feature detail URL slug when it differs (e.g. multiple-pipelines). */
  featurePageSlug: SlugSchema.optional(),
  name: z.string().min(1),
  relationship: RequirementFeatureRelationSchema.default("supporting"),
  rationale: z.string().min(1),
  icon: z.string().optional(),
});

export type RequirementFeatureLink = z.infer<
  typeof RequirementFeatureLinkSchema
>;

export const RequirementEvaluationCriterionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  /** Feature slug(s) used to assess this criterion from enrichment. */
  featureSlugs: z.array(SlugSchema).default([]),
  importance: z
    .enum(["required", "important", "supporting"])
    .default("important"),
  icon: z.string().optional(),
});

export type RequirementEvaluationCriterion = z.infer<
  typeof RequirementEvaluationCriterionSchema
>;

export const RequirementNeedGuidanceSchema = z.object({
  needIf: z.array(z.string().min(1)).default([]),
  mayNotNeedIf: z.array(z.string().min(1)).default([]),
});

export type RequirementNeedGuidance = z.infer<
  typeof RequirementNeedGuidanceSchema
>;

export const RequirementWhyCardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().optional(),
});

export type RequirementWhyCard = z.infer<typeof RequirementWhyCardSchema>;

export const RequirementUseCaseLinkSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  importanceLabel: z.string().min(1),
  href: z.string().optional(),
  icon: z.string().optional(),
});

export type RequirementUseCaseLink = z.infer<
  typeof RequirementUseCaseLinkSchema
>;

export const RequirementIndustryContextSchema = z.object({
  industrySlug: SlugSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  href: z.string().optional(),
  importanceSummary: z.string().optional(),
  eyebrowOverride: z.string().optional(),
  displayTitleOverride: z.string().optional(),
  taglineOverride: z.string().optional(),
  useCaseRelationships: z.array(RequirementUseCaseLinkSchema).default([]),
  tradeoffs: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .default([]),
});

export type RequirementIndustryContext = z.infer<
  typeof RequirementIndustryContextSchema
>;

export const RequirementScenarioSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  priorities: z.array(z.string().min(1)).default([]),
  /** Criterion used to prefer a product when selecting scenario fit. */
  focusCriterionSlug: SlugSchema.optional(),
  icon: z.string().optional(),
});

export type RequirementScenario = z.infer<typeof RequirementScenarioSchema>;

export const RequirementSummarySlotSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  selection: z.enum([
    "best-overall",
    "best-simplicity",
    "best-complex",
    "best-value",
  ]),
});

export type RequirementSummarySlot = z.infer<
  typeof RequirementSummarySlotSchema
>;

export const RequirementFaqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export type RequirementFaqItem = z.infer<typeof RequirementFaqItemSchema>;

export const RequirementDetailVisualSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().min(1).optional(),
});

export type RequirementDetailVisual = z.infer<
  typeof RequirementDetailVisualSchema
>;

export const RequirementDetailChallengeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  pain: z.string().min(1),
  crmHelps: z.string().min(1),
});

export type RequirementDetailChallenge = z.infer<
  typeof RequirementDetailChallengeSchema
>;

export const RequirementDetailOutcomeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export type RequirementDetailOutcome = z.infer<
  typeof RequirementDetailOutcomeSchema
>;

export const RequirementAcceptanceNeedSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(["must", "nice"]),
  href: z.string().optional(),
});

export type RequirementAcceptanceNeed = z.infer<
  typeof RequirementAcceptanceNeedSchema
>;

export const RequirementWorkflowStepSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  detail: z.string().min(1),
});

export type RequirementWorkflowStep = z.infer<
  typeof RequirementWorkflowStepSchema
>;

/**
 * Practical vendor-demo test for a buyer requirement.
 * Driven by RequirementDefinition / RequirementDetailProfile — not hardcoded JSX.
 */
export const RequirementDemoTestSchema = z.object({
  requirementId: SlugSchema,
  objective: z.string().min(1),
  preconditions: z.array(z.string().min(1)).default([]),
  steps: z.array(z.string().min(1)).default([]),
  expectedOutcomes: z.array(z.string().min(1)).default([]),
  failureSignals: z.array(z.string().min(1)).default([]),
  questions: z.array(z.string().min(1)).default([]),
});

export type RequirementDemoTest = z.infer<typeof RequirementDemoTestSchema>;

export const RequirementDetailProfileSchema = z.object({
  slug: SlugSchema,
  name: z.string().min(1),
  displayTitle: z.string().min(1).optional(),
  eyebrow: z.string().min(1).optional(),
  tagline: z.string().min(1).optional(),
  shortAnswer: z.string().min(1).optional(),
  buyerNeedDescription: z.string().min(1),
  /** Hub-style educational overview (depth layer). */
  overview: z.string().min(1).optional(),
  whoThisIsFor: z.string().min(1).optional(),
  whatMattersIntro: z.string().min(1).optional(),
  workedExample: z.string().min(1).optional(),
  workedExampleSecondary: z.string().min(1).optional(),
  requirementType: z.string().min(1).optional(),
  requirementTypeLabel: z.string().min(1).optional(),
  typicalImportanceLabel: z.string().min(1).optional(),
  categorySlug: SlugSchema.default("crm"),
  primaryCapabilitySlug: SlugSchema.optional(),
  primaryCapabilityName: z.string().min(1).optional(),
  primaryCapabilityHref: z.string().optional(),
  featureLinks: z.array(RequirementFeatureLinkSchema).default([]),
  evaluationCriteria: z
    .array(RequirementEvaluationCriterionSchema)
    .default([]),
  needGuidance: RequirementNeedGuidanceSchema.optional(),
  whyItMatters: z.array(RequirementWhyCardSchema).default([]),
  challenges: z.array(RequirementDetailChallengeSchema).default([]),
  outcomes: z.array(RequirementDetailOutcomeSchema).default([]),
  acceptanceNeeds: z.array(RequirementAcceptanceNeedSchema).default([]),
  workflowSteps: z.array(RequirementWorkflowStepSchema).default([]),
  /** Practical vendor-demo checklist for this requirement. */
  demoTest: RequirementDemoTestSchema.optional(),
  heroVisual: RequirementDetailVisualSchema.optional(),
  needsVisual: RequirementDetailVisualSchema.optional(),
  workflowVisual: RequirementDetailVisualSchema.optional(),
  summarySlots: z.array(RequirementSummarySlotSchema).default([]),
  scenarios: z.array(RequirementScenarioSchema).default([]),
  useCaseLinks: z.array(RequirementUseCaseLinkSchema).default([]),
  industryContexts: z.array(RequirementIndustryContextSchema).default([]),
  relatedRequirementSlugs: z.array(SlugSchema).default([]),
  relatedCapabilitySlugs: z.array(SlugSchema).default([]),
  tradeoffs: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
        icon: z.string().optional(),
      }),
    )
    .default([]),
  vendorQuestions: z.array(z.string().min(1)).default([]),
  faq: z.array(RequirementFaqItemSchema).default([]),
  screenshotMatchTerms: z.array(z.string().min(1)).default([]),
  matrixFeatureSlugs: z.array(SlugSchema).default([]),
  finderHref: z.string().optional(),
  calculatorHref: z.string().optional(),
  compareHref: z.string().optional(),
  methodologyHref: z.string().optional(),
  lastReviewedAt: z.string().optional(),
});

export type RequirementDetailProfile = z.infer<
  typeof RequirementDetailProfileSchema
>;
