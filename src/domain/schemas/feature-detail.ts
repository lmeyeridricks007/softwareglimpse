import { z } from "zod";
import { SlugSchema } from "./primitives";

/**
 * Presentation profile for Feature Detail pages.
 * Product support / plans / screenshots / limits come from catalogue
 * enrichment at build time — never hard-code product claims here.
 */

export const FeatureDetailTypeSchema = z.enum([
  "boolean",
  "tiered",
  "quantitative",
  "configurable",
  "integration",
  "usage-limited",
]);

export type FeatureDetailType = z.infer<typeof FeatureDetailTypeSchema>;

export const FeatureDimensionValueTypeSchema = z.enum([
  "support-status",
  "plan",
  "limit",
  "text",
]);

export type FeatureDimensionValueType = z.infer<
  typeof FeatureDimensionValueTypeSchema
>;

/**
 * How a matrix dimension resolves for each product.
 * - primary: enrichment support for canonicalFeatureSlug
 * - related-feature: enrichment support for relatedFeatureSlug
 * - min-plan: first planSlug on primary feature support
 * - notes-limit: only when verified limit text exists in notes (never invent)
 */
export const FeatureDimensionSourceSchema = z.enum([
  "primary",
  "related-feature",
  "min-plan",
  "notes-limit",
]);

export type FeatureDimensionSource = z.infer<
  typeof FeatureDimensionSourceSchema
>;

export const FeatureEvaluationDimensionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  valueType: FeatureDimensionValueTypeSchema.default("support-status"),
  source: FeatureDimensionSourceSchema.default("primary"),
  relatedFeatureSlug: SlugSchema.optional(),
  importance: z.enum(["critical", "high", "important", "optional"]).optional(),
});

export type FeatureEvaluationDimension = z.infer<
  typeof FeatureEvaluationDimensionSchema
>;

export const FeatureNeedGuidanceSchema = z.object({
  needIf: z.array(z.string().min(1)).default([]),
  mayNotNeedIf: z.array(z.string().min(1)).default([]),
});

export type FeatureNeedGuidance = z.infer<typeof FeatureNeedGuidanceSchema>;

export const FeatureRequirementMappingSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  /** How directly this feature satisfies the requirement. */
  supportLevel: z
    .enum(["direct", "partial", "depends", "indirect"])
    .default("direct"),
  /** Public requirement detail slug when a page exists. */
  requirementSlug: SlugSchema.optional(),
  href: z.string().optional(),
});

export type FeatureRequirementMapping = z.infer<
  typeof FeatureRequirementMappingSchema
>;

export const FeatureUseCaseRelevanceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  relevanceLabel: z.string().min(1),
  href: z.string().optional(),
  icon: z.string().optional(),
});

export type FeatureUseCaseRelevance = z.infer<
  typeof FeatureUseCaseRelevanceSchema
>;

export const FeatureIndustryRelevanceSchema = z.object({
  industrySlug: SlugSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  href: z.string().optional(),
  icon: z.string().optional(),
});

export type FeatureIndustryRelevance = z.infer<
  typeof FeatureIndustryRelevanceSchema
>;

/**
 * Optional industry overlay — reuses generic feature evidence with
 * industry-specific framing. Never invent product support here.
 */
export const IndustryFeatureContextSchema = z.object({
  industrySlug: SlugSchema,
  importanceSummary: z.string().min(1).optional(),
  tradeoffs: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .default([]),
  useCaseRelationships: z.array(FeatureUseCaseRelevanceSchema).default([]),
  eyebrowOverride: z.string().optional(),
  taglineOverride: z.string().optional(),
  displayTitleOverride: z.string().optional(),
});

export type IndustryFeatureContext = z.infer<
  typeof IndustryFeatureContextSchema
>;

export const FeatureFaqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export type FeatureFaqItem = z.infer<typeof FeatureFaqItemSchema>;

/** Concrete buyer situation — educational, not a product recommendation. */
export const FeatureWorkedExampleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  situation: z.string().min(1),
  whatGoodLooksLike: z.string().min(1),
  whatToAskVendors: z.string().min(1),
});

export type FeatureWorkedExample = z.infer<typeof FeatureWorkedExampleSchema>;

export const FeatureDetailVisualSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().min(1).optional(),
});

export type FeatureDetailVisual = z.infer<typeof FeatureDetailVisualSchema>;

export const FeatureDetailChallengeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  pain: z.string().min(1),
  crmHelps: z.string().min(1),
});

export type FeatureDetailChallenge = z.infer<
  typeof FeatureDetailChallengeSchema
>;

export const FeatureDetailOutcomeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export type FeatureDetailOutcome = z.infer<typeof FeatureDetailOutcomeSchema>;

export const FeatureDetailWorkflowStepSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  detail: z.string().min(1),
});

export type FeatureDetailWorkflowStep = z.infer<
  typeof FeatureDetailWorkflowStepSchema
>;

export const FeatureDetailProfileSchema = z.object({
  /** Public URL slug (may differ from catalogue slug). */
  slug: SlugSchema,
  /** Catalogue / enrichment feature slug used for evidence lookup. */
  canonicalFeatureSlug: SlugSchema,
  name: z.string().min(1),
  displayTitle: z.string().min(1).optional(),
  eyebrow: z.string().min(1).optional(),
  tagline: z.string().min(1).optional(),
  definition: z.string().min(1),
  /** Hub-style educational overview (depth layer). */
  overview: z.string().min(1).optional(),
  whoThisIsFor: z.string().min(1).optional(),
  whatMattersIntro: z.string().min(1).optional(),
  /** Semantic distinctions — what this feature is NOT. */
  notTheSameAs: z.array(z.string().min(1)).default([]),
  supportsBullets: z.array(z.string().min(1)).default([]),
  featureType: FeatureDetailTypeSchema.default("configurable"),
  featureTypeLabel: z.string().min(1).optional(),
  typicalBuyerNeed: z.string().min(1).optional(),
  commonLimitation: z.string().min(1).optional(),
  categorySlug: SlugSchema.default("crm"),
  primaryCapabilitySlug: SlugSchema.optional(),
  primaryCapabilityName: z.string().min(1).optional(),
  primaryCapabilityHref: z.string().optional(),
  relatedRequirementName: z.string().min(1).optional(),
  relatedRequirementDescription: z.string().optional(),
  /** Public requirement detail slug when a page exists. */
  relatedRequirementSlug: SlugSchema.optional(),
  evaluationDimensions: z.array(FeatureEvaluationDimensionSchema).default([]),
  needGuidance: FeatureNeedGuidanceSchema.optional(),
  requirementMappings: z.array(FeatureRequirementMappingSchema).default([]),
  relatedFeatureSlugs: z.array(SlugSchema).default([]),
  relatedCapabilitySlugs: z.array(SlugSchema).default([]),
  useCaseRelevance: z.array(FeatureUseCaseRelevanceSchema).default([]),
  industryRelevance: z.array(FeatureIndustryRelevanceSchema).default([]),
  industryContexts: z.array(IndustryFeatureContextSchema).default([]),
  challenges: z.array(FeatureDetailChallengeSchema).default([]),
  outcomes: z.array(FeatureDetailOutcomeSchema).default([]),
  workflowSteps: z.array(FeatureDetailWorkflowStepSchema).default([]),
  heroVisual: FeatureDetailVisualSchema.optional(),
  needsVisual: FeatureDetailVisualSchema.optional(),
  workflowVisual: FeatureDetailVisualSchema.optional(),
  implementationThemes: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        description: z.string().min(1),
        /** Dimension id used to surface product differences. */
        dimensionId: z.string().min(1).optional(),
        icon: z.string().optional(),
      }),
    )
    .default([]),
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
  workedExamples: z.array(FeatureWorkedExampleSchema).default([]),
  vendorQuestions: z.array(z.string().min(1)).default([]),
  faq: z.array(FeatureFaqItemSchema).default([]),
  screenshotMatchTerms: z.array(z.string().min(1)).default([]),
  screenshotTabs: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        matchTerms: z.array(z.string().min(1)).default([]),
      }),
    )
    .default([]),
  finderHref: z.string().optional(),
  calculatorHref: z.string().optional(),
  compareHref: z.string().optional(),
  methodologyHref: z.string().optional(),
  lastReviewedAt: z.string().optional(),
});

export type FeatureDetailProfile = z.infer<typeof FeatureDetailProfileSchema>;
