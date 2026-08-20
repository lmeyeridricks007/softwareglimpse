import { z } from "zod";
import { SlugSchema } from "./primitives";

/**
 * Presentation profile for global Use Case hubs (`/use-cases/[slug]/`).
 * Complements UseCase taxonomy — does not invent product rankings or prices.
 */

export const UseCaseHubPrioritySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1).optional(),
  href: z.string().optional(),
});

export type UseCaseHubPriority = z.infer<typeof UseCaseHubPrioritySchema>;

export const UseCaseHubScenarioSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  bestWhen: z.string().min(1),
  icon: z.string().min(1).optional(),
  href: z.string().optional(),
});

export type UseCaseHubScenario = z.infer<typeof UseCaseHubScenarioSchema>;

export const UseCaseHubBuyingStepSchema = z.object({
  step: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().optional(),
  href: z.string().optional(),
  ctaLabel: z.string().optional(),
});

export type UseCaseHubBuyingStep = z.infer<typeof UseCaseHubBuyingStepSchema>;

export const UseCaseHubFaqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export type UseCaseHubFaqItem = z.infer<typeof UseCaseHubFaqItemSchema>;

export const UseCaseHubGlanceSchema = z.object({
  primaryGoal: z.string().min(1).optional(),
  typicalTeam: z.string().min(1).optional(),
  commonPriorities: z.array(z.string().min(1)).default([]),
});

export type UseCaseHubGlance = z.infer<typeof UseCaseHubGlanceSchema>;

export const UseCaseHubChallengeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  pain: z.string().min(1),
  crmHelps: z.string().min(1),
});

export type UseCaseHubChallenge = z.infer<typeof UseCaseHubChallengeSchema>;

export const UseCaseHubOutcomeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export type UseCaseHubOutcome = z.infer<typeof UseCaseHubOutcomeSchema>;

export const UseCaseHubCapabilityNeedSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(["must", "nice"]),
  href: z.string().optional(),
});

export type UseCaseHubCapabilityNeed = z.infer<
  typeof UseCaseHubCapabilityNeedSchema
>;

export const UseCaseHubWorkflowLinkSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  href: z.string().optional(),
  /** must | important | optional — requirement priority when applicable. */
  priority: z.enum(["must", "important", "optional"]).optional(),
});

export type UseCaseHubWorkflowLink = z.infer<typeof UseCaseHubWorkflowLinkSchema>;

export const UseCaseHubWorkflowStepSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  detail: z.string().min(1),
  /** Short goal statement for expandable step panels. */
  goal: z.string().min(1).optional(),
  capabilities: z.array(UseCaseHubWorkflowLinkSchema).default([]),
  requirements: z.array(UseCaseHubWorkflowLinkSchema).default([]),
  features: z.array(UseCaseHubWorkflowLinkSchema).default([]),
});

export type UseCaseHubWorkflowStep = z.infer<
  typeof UseCaseHubWorkflowStepSchema
>;

export const UseCaseHubVisualSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().min(1).optional(),
});

export type UseCaseHubVisual = z.infer<typeof UseCaseHubVisualSchema>;

export const UseCaseHubProfileSchema = z.object({
  useCaseSlug: SlugSchema,
  displayTitle: z.string().min(1).optional(),
  badgeLabel: z.string().min(1).optional(),
  tagline: z.string().min(1).optional(),
  overview: z.string().optional(),
  whoThisIsFor: z.string().optional(),
  whatMattersIntro: z.string().optional(),
  workedExample: z.string().optional(),
  workedExampleSecondary: z.string().optional(),
  glance: UseCaseHubGlanceSchema.optional(),
  challenges: z.array(UseCaseHubChallengeSchema).default([]),
  outcomes: z.array(UseCaseHubOutcomeSchema).default([]),
  capabilityNeeds: z.array(UseCaseHubCapabilityNeedSchema).default([]),
  workflowSteps: z.array(UseCaseHubWorkflowStepSchema).default([]),
  priorities: z.array(UseCaseHubPrioritySchema).default([]),
  scenarios: z.array(UseCaseHubScenarioSchema).default([]),
  buyingFramework: z.array(UseCaseHubBuyingStepSchema).default([]),
  buyingGuideHref: z.string().optional(),
  faq: z.array(UseCaseHubFaqItemSchema).default([]),
  heroVisual: UseCaseHubVisualSchema.optional(),
  needsVisual: UseCaseHubVisualSchema.optional(),
  workflowVisual: UseCaseHubVisualSchema.optional(),
  relatedUseCaseSlugs: z.array(SlugSchema).default([]),
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

export type UseCaseHubProfile = z.infer<typeof UseCaseHubProfileSchema>;
