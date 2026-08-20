import { z } from "zod";
import { SlugSchema } from "./primitives";

/**
 * Presentation profile for Industry × Use Case detail pages.
 * Decision-oriented: capability priorities + requirements + product fit.
 * Product claims/scores/pricing/screenshots come from catalogue + enrichment.
 */

export const UseCaseImportanceSchema = z.enum([
  "critical",
  "high",
  "important",
  "optional",
]);

export type UseCaseImportance = z.infer<typeof UseCaseImportanceSchema>;

export const IndustryUseCaseCapabilitySchema = z.object({
  /** Canonical feature / capability slug. */
  capabilitySlug: SlugSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  importance: UseCaseImportanceSchema.default("important"),
  /** Optional ordinal weight 1–100 for priority bars — only when configured. */
  weight: z.number().int().min(1).max(100).optional(),
  icon: z.string().min(1).optional(),
  /** Link to industry capability page when it exists. */
  href: z.string().optional(),
  /** Methodology criterion slug for approved score lookup. */
  criterionSlug: SlugSchema.optional(),
});

export type IndustryUseCaseCapability = z.infer<
  typeof IndustryUseCaseCapabilitySchema
>;

export const IndustryUseCaseRequirementSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  capabilitySlug: SlugSchema,
  priority: z.enum(["must-have", "important", "advanced"]).default("important"),
  featureSlug: SlugSchema.optional(),
  /** Public requirement detail slug when a page exists. */
  requirementSlug: SlugSchema.optional(),
  href: z.string().optional(),
});

export type IndustryUseCaseRequirement = z.infer<
  typeof IndustryUseCaseRequirementSchema
>;

export const IndustryUseCaseScenarioSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  priorities: z.array(z.string().min(1)).default([]),
  /** Capability slugs used to pick a suggested product from evidence. */
  focusCapabilitySlugs: z.array(SlugSchema).default([]),
  icon: z.string().min(1).optional(),
});

export type IndustryUseCaseScenario = z.infer<
  typeof IndustryUseCaseScenarioSchema
>;

export const IndustryUseCaseTradeoffSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1).optional(),
});

export type IndustryUseCaseTradeoff = z.infer<
  typeof IndustryUseCaseTradeoffSchema
>;

export const IndustryUseCaseImplementationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1).optional(),
});

export type IndustryUseCaseImplementation = z.infer<
  typeof IndustryUseCaseImplementationSchema
>;

export const IndustryUseCaseFaqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export type IndustryUseCaseFaqItem = z.infer<
  typeof IndustryUseCaseFaqItemSchema
>;

export const IndustryUseCaseGlanceSchema = z.object({
  typicalObjective: z.string().min(1).optional(),
  teamTypes: z.array(z.string().min(1)).default([]),
  topPriorityLabels: z.array(z.string().min(1)).default([]),
});

export type IndustryUseCaseGlance = z.infer<typeof IndustryUseCaseGlanceSchema>;

/**
 * Executive summary slot — filled from evidence at build time.
 * selection drives which product is chosen; never hard-code a winner slug
 * unless selection = "fixed" with productSlug (rare, editorial override).
 */
export const IndustryUseCaseSummarySlotSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  selection: z.enum([
    "best-overall-fit",
    "best-simplicity",
    "best-complex",
    "best-small-team",
    "best-value",
  ]),
  /** Capability slugs that define this slot's ranking focus. */
  focusCapabilitySlugs: z.array(SlugSchema).default([]),
});

export type IndustryUseCaseSummarySlot = z.infer<
  typeof IndustryUseCaseSummarySlotSchema
>;

export const IndustryUseCaseProfileSchema = z.object({
  industrySlug: SlugSchema,
  useCaseSlug: SlugSchema,
  /** Hub presentation id when different from URL slug (e.g. advisory). */
  hubUseCaseId: z.string().min(1).optional(),
  displayName: z.string().min(1),
  displayTitle: z.string().min(1).optional(),
  eyebrow: z.string().min(1).optional(),
  tagline: z.string().min(1).optional(),
  decisionNuance: z.string().optional(),
  glance: IndustryUseCaseGlanceSchema.optional(),
  capabilities: z.array(IndustryUseCaseCapabilitySchema).default([]),
  requirements: z.array(IndustryUseCaseRequirementSchema).default([]),
  summarySlots: z.array(IndustryUseCaseSummarySlotSchema).default([]),
  scenarios: z.array(IndustryUseCaseScenarioSchema).default([]),
  tradeoffs: z.array(IndustryUseCaseTradeoffSchema).default([]),
  implementation: z
    .array(IndustryUseCaseImplementationSchema)
    .default([]),
  vendorQuestions: z
    .array(
      z.object({
        group: z.string().min(1),
        questions: z.array(z.string().min(1)).default([]),
      }),
    )
    .default([]),
  relatedUseCaseSlugs: z.array(SlugSchema).default([]),
  relatedCapabilitySlugs: z.array(SlugSchema).default([]),
  faq: z.array(IndustryUseCaseFaqItemSchema).default([]),
  /** Catalogue use-case slug(s) for product membership filtering. */
  catalogueUseCaseSlugs: z.array(SlugSchema).default([]),
  /** Finder primary use-case slug when deep-linking. */
  finderUseCaseSlug: SlugSchema.optional(),
  screenshotMatchTerms: z.array(z.string().min(1)).default([]),
  matrixFeatureSlugs: z.array(SlugSchema).default([]),
  finderHref: z.string().optional(),
  calculatorHref: z.string().optional(),
  compareHref: z.string().optional(),
  methodologyHref: z.string().optional(),
  categorySlug: SlugSchema.default("crm"),
  lastReviewedAt: z.string().optional(),
});

export type IndustryUseCaseProfile = z.infer<
  typeof IndustryUseCaseProfileSchema
>;
