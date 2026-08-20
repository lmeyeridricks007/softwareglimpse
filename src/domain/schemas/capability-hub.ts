import { z } from "zod";
import { SlugSchema } from "./primitives";

/**
 * Presentation profile for global Capability hubs (`/capabilities/[slug]/`).
 * Complements Capability taxonomy — does not invent product rankings or prices.
 */

export const CapabilityHubPrioritySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1).optional(),
  href: z.string().optional(),
});

export type CapabilityHubPriority = z.infer<typeof CapabilityHubPrioritySchema>;

export const CapabilityHubScenarioSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  bestWhen: z.string().min(1),
  icon: z.string().min(1).optional(),
  href: z.string().optional(),
});

export type CapabilityHubScenario = z.infer<typeof CapabilityHubScenarioSchema>;

export const CapabilityHubBuyingStepSchema = z.object({
  step: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().optional(),
  href: z.string().optional(),
  ctaLabel: z.string().optional(),
});

export type CapabilityHubBuyingStep = z.infer<
  typeof CapabilityHubBuyingStepSchema
>;

export const CapabilityHubFaqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export type CapabilityHubFaqItem = z.infer<typeof CapabilityHubFaqItemSchema>;

export const CapabilityHubGlanceSchema = z.object({
  primaryGoal: z.string().min(1).optional(),
  typicalTeam: z.string().min(1).optional(),
  commonPriorities: z.array(z.string().min(1)).default([]),
});

export type CapabilityHubGlance = z.infer<typeof CapabilityHubGlanceSchema>;

export const CapabilityHubChallengeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  pain: z.string().min(1),
  crmHelps: z.string().min(1),
});

export type CapabilityHubChallenge = z.infer<
  typeof CapabilityHubChallengeSchema
>;

export const CapabilityHubOutcomeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export type CapabilityHubOutcome = z.infer<typeof CapabilityHubOutcomeSchema>;

export const CapabilityHubNeedSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(["must", "nice"]),
  href: z.string().optional(),
});

export type CapabilityHubNeed = z.infer<typeof CapabilityHubNeedSchema>;

export const CapabilityHubWorkflowStepSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  detail: z.string().min(1),
});

export type CapabilityHubWorkflowStep = z.infer<
  typeof CapabilityHubWorkflowStepSchema
>;

export const CapabilityHubVisualSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().min(1).optional(),
});

export type CapabilityHubVisual = z.infer<typeof CapabilityHubVisualSchema>;

export const CapabilityHubProfileSchema = z.object({
  capabilitySlug: SlugSchema,
  displayTitle: z.string().min(1).optional(),
  badgeLabel: z.string().min(1).optional(),
  tagline: z.string().min(1).optional(),
  overview: z.string().optional(),
  whoThisIsFor: z.string().optional(),
  whatMattersIntro: z.string().optional(),
  workedExample: z.string().optional(),
  workedExampleSecondary: z.string().optional(),
  glance: CapabilityHubGlanceSchema.optional(),
  challenges: z.array(CapabilityHubChallengeSchema).default([]),
  outcomes: z.array(CapabilityHubOutcomeSchema).default([]),
  /** Must/nice evaluation needs for this capability. */
  capabilityNeeds: z.array(CapabilityHubNeedSchema).default([]),
  workflowSteps: z.array(CapabilityHubWorkflowStepSchema).default([]),
  priorities: z.array(CapabilityHubPrioritySchema).default([]),
  scenarios: z.array(CapabilityHubScenarioSchema).default([]),
  buyingFramework: z.array(CapabilityHubBuyingStepSchema).default([]),
  buyingGuideHref: z.string().optional(),
  faq: z.array(CapabilityHubFaqItemSchema).default([]),
  heroVisual: CapabilityHubVisualSchema.optional(),
  needsVisual: CapabilityHubVisualSchema.optional(),
  workflowVisual: CapabilityHubVisualSchema.optional(),
  relatedCapabilitySlugs: z.array(SlugSchema).default([]),
  relatedUseCaseSlugs: z.array(SlugSchema).default([]),
  relatedRequirementSlugs: z.array(SlugSchema).default([]),
  relatedFeatureSlugs: z.array(SlugSchema).default([]),
  featuredGuideHrefs: z.array(z.string().min(1)).default([]),
  featuredComparisonSlugs: z.array(SlugSchema).default([]),
  primaryCta: z
    .object({
      href: z.string().min(1),
      label: z.string().min(1),
    })
    .optional(),
  secondaryCta: z
    .object({
      href: z.string().min(1),
      label: z.string().min(1),
    })
    .optional(),
  finderHref: z.string().optional(),
  calculatorHref: z.string().optional(),
  compareHref: z.string().optional(),
  catalogueHref: z.string().optional(),
  categorySlug: SlugSchema.default("crm"),
  lastReviewedAt: z.string().optional(),
});

export type CapabilityHubProfile = z.infer<typeof CapabilityHubProfileSchema>;
