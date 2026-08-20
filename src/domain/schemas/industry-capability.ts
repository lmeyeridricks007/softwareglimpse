import { z } from "zod";
import { SlugSchema } from "./primitives";

/**
 * Presentation profile for Industry × Capability detail pages.
 * Capability identity aligns with canonical feature slugs.
 * Product support / scores / screenshots come from catalogue + enrichment
 * at build time — never hard-coded product claims in this profile.
 */

export const CapabilityRequirementPrioritySchema = z.enum([
  "core",
  "advanced",
  "optional",
]);

export type CapabilityRequirementPriority = z.infer<
  typeof CapabilityRequirementPrioritySchema
>;

export const IndustryCapabilityRequirementSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  priority: CapabilityRequirementPrioritySchema.default("core"),
  /** Canonical feature slug this requirement maps to (for evidence cells). */
  featureSlug: SlugSchema.optional(),
  /** Public requirement detail slug when a Requirement page exists. */
  requirementSlug: SlugSchema.optional(),
  icon: z.string().min(1).optional(),
  href: z.string().optional(),
});

export type IndustryCapabilityRequirement = z.infer<
  typeof IndustryCapabilityRequirementSchema
>;

export const IndustryCapabilityUseCaseFitSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  /** Descriptive importance — only when configured (never invented). */
  importanceLabel: z.string().min(1).optional(),
  icon: z.string().min(1).optional(),
  /** Industry use-case detail slug when a page exists. */
  useCaseSlug: SlugSchema.optional(),
  href: z.string().optional(),
});

export type IndustryCapabilityUseCaseFit = z.infer<
  typeof IndustryCapabilityUseCaseFitSchema
>;

export const IndustryCapabilityTradeoffSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1).optional(),
});

export type IndustryCapabilityTradeoff = z.infer<
  typeof IndustryCapabilityTradeoffSchema
>;

export const IndustryCapabilityOutcomeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});

export type IndustryCapabilityOutcome = z.infer<
  typeof IndustryCapabilityOutcomeSchema
>;

export const IndustryCapabilityImplementationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1).optional(),
});

export type IndustryCapabilityImplementation = z.infer<
  typeof IndustryCapabilityImplementationSchema
>;

export const IndustryCapabilityFaqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export type IndustryCapabilityFaqItem = z.infer<
  typeof IndustryCapabilityFaqItemSchema
>;

export const IndustryCapabilityGlanceSchema = z.object({
  /** Only set when industry weighting/config supports it. */
  importanceLabel: z.string().min(1).optional(),
  coreObjective: z.string().min(1).optional(),
  importantRequirementLabels: z.array(z.string().min(1)).default([]),
});

export type IndustryCapabilityGlance = z.infer<
  typeof IndustryCapabilityGlanceSchema
>;

export const IndustryCapabilityProfileSchema = z.object({
  industrySlug: SlugSchema,
  /** Canonical feature slug (capability identity). */
  capabilitySlug: SlugSchema,
  displayName: z.string().min(1).optional(),
  /** Hero H1 override. */
  displayTitle: z.string().min(1).optional(),
  eyebrow: z.string().min(1).optional(),
  tagline: z.string().min(1).optional(),
  whyItMatters: z.array(z.string().min(1)).default([]),
  weakProcessRisks: z.array(z.string().min(1)).default([]),
  glance: IndustryCapabilityGlanceSchema.optional(),
  /** What we evaluate — shown in hero visual. */
  evaluationDimensions: z.array(z.string().min(1)).default([]),
  requirements: z.array(IndustryCapabilityRequirementSchema).default([]),
  /** Feature slugs for the requirement-by-requirement matrix. */
  matrixFeatureSlugs: z.array(SlugSchema).default([]),
  /** Feature slug used for approved criterion assessment lookup. */
  criterionSlug: SlugSchema.optional(),
  relatedCapabilitySlugs: z.array(SlugSchema).default([]),
  useCaseFits: z.array(IndustryCapabilityUseCaseFitSchema).default([]),
  tradeoffs: z.array(IndustryCapabilityTradeoffSchema).default([]),
  outcomes: z.array(IndustryCapabilityOutcomeSchema).default([]),
  vendorQuestions: z.array(z.string().min(1)).default([]),
  implementation: z
    .array(IndustryCapabilityImplementationSchema)
    .default([]),
  faq: z.array(IndustryCapabilityFaqItemSchema).default([]),
  /** Keywords used to match enrichment screenshots (caption/id/annotation). */
  screenshotMatchTerms: z.array(z.string().min(1)).default([]),
  finderHref: z.string().optional(),
  calculatorHref: z.string().optional(),
  compareHref: z.string().optional(),
  methodologyHref: z.string().optional(),
  categorySlug: SlugSchema.default("crm"),
  lastReviewedAt: z.string().optional(),
});

export type IndustryCapabilityProfile = z.infer<
  typeof IndustryCapabilityProfileSchema
>;
