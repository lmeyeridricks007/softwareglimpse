import { z } from "zod";
import { SlugSchema } from "./primitives";

/**
 * Presentation profile for Business Type (`/for/[slug]/`) pages.
 * Complements Audience taxonomy — does not invent product rankings or prices.
 * Catalogue product cards are filtered by tagged sizes/types at build time.
 */

export const AudienceHubPrioritySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1).optional(),
  href: z.string().optional(),
});

export type AudienceHubPriority = z.infer<typeof AudienceHubPrioritySchema>;

export const AudienceHubScenarioSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** Concrete “best when…” scenario — not a product recommendation. */
  bestWhen: z.string().min(1),
  icon: z.string().min(1).optional(),
  href: z.string().optional(),
});

export type AudienceHubScenario = z.infer<typeof AudienceHubScenarioSchema>;

export const AudienceHubFitSignalSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  kind: z.enum(["fit", "watch", "avoid"]),
});

export type AudienceHubFitSignal = z.infer<typeof AudienceHubFitSignalSchema>;

export const AudienceHubBuyingStepSchema = z.object({
  step: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().optional(),
  href: z.string().optional(),
  ctaLabel: z.string().optional(),
});

export type AudienceHubBuyingStep = z.infer<typeof AudienceHubBuyingStepSchema>;

export const AudienceHubFaqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export type AudienceHubFaqItem = z.infer<typeof AudienceHubFaqItemSchema>;

export const AudienceHubGlanceSchema = z.object({
  primaryGoal: z.string().min(1).optional(),
  typicalTeam: z.string().min(1).optional(),
  commonPriorities: z.array(z.string().min(1)).default([]),
});

export type AudienceHubGlance = z.infer<typeof AudienceHubGlanceSchema>;

export const AudienceHubChallengeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** What breaks today without shared process. */
  pain: z.string().min(1),
  /** How a well-used CRM addresses it — operational, not vendor pitch. */
  crmHelps: z.string().min(1),
});

export type AudienceHubChallenge = z.infer<typeof AudienceHubChallengeSchema>;

export const AudienceHubOutcomeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export type AudienceHubOutcome = z.infer<typeof AudienceHubOutcomeSchema>;

export const AudienceHubCapabilityNeedSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(["must", "nice"]),
  href: z.string().optional(),
});

export type AudienceHubCapabilityNeed = z.infer<
  typeof AudienceHubCapabilityNeedSchema
>;

export const AudienceHubWorkflowStepSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  detail: z.string().min(1),
});

export type AudienceHubWorkflowStep = z.infer<
  typeof AudienceHubWorkflowStepSchema
>;

export const AudienceHubProfileSchema = z.object({
  audienceSlug: SlugSchema,
  displayTitle: z.string().min(1).optional(),
  badgeLabel: z.string().min(1).optional(),
  tagline: z.string().min(1).optional(),
  overview: z.string().optional(),
  /** Longer “who this is for” narrative. */
  whoThisIsFor: z.string().optional(),
  whatMattersIntro: z.string().optional(),
  workedExample: z.string().optional(),
  /** Second worked example for depth. */
  workedExampleSecondary: z.string().optional(),
  glance: AudienceHubGlanceSchema.optional(),
  challenges: z.array(AudienceHubChallengeSchema).default([]),
  outcomes: z.array(AudienceHubOutcomeSchema).default([]),
  capabilityNeeds: z.array(AudienceHubCapabilityNeedSchema).default([]),
  workflowSteps: z.array(AudienceHubWorkflowStepSchema).default([]),
  priorities: z.array(AudienceHubPrioritySchema).default([]),
  scenarios: z.array(AudienceHubScenarioSchema).default([]),
  fitSignals: z.array(AudienceHubFitSignalSchema).default([]),
  buyingFramework: z.array(AudienceHubBuyingStepSchema).default([]),
  buyingGuideHref: z.string().optional(),
  faq: z.array(AudienceHubFaqItemSchema).default([]),
  relatedAudienceSlugs: z.array(SlugSchema).default([]),
  relatedUseCaseSlugs: z.array(SlugSchema).default([]),
  featuredGuideHrefs: z.array(z.string().min(1)).default([]),
  featuredComparisonSlugs: z.array(SlugSchema).default([]),
  /** Catalogue filter — products tagged with these sizes. */
  matchBusinessSizeSlugs: z.array(SlugSchema).default([]),
  matchBusinessTypeSlugs: z.array(SlugSchema).default([]),
  matchTeamTypeSlugs: z.array(SlugSchema).default([]),
  /** Optional body figure under needs / how CRM helps. */
  needsVisual: z
    .object({
      src: z.string().min(1),
      alt: z.string().min(1),
      caption: z.string().min(1).optional(),
    })
    .optional(),
  /** Optional body figure for day-in-the-life / workflow. */
  workflowVisual: z
    .object({
      src: z.string().min(1),
      alt: z.string().min(1),
      caption: z.string().min(1).optional(),
    })
    .optional(),
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
  bestHref: z.string().optional(),
  categorySlug: SlugSchema.default("crm"),
  visualKind: z
    .enum([
      "small-business",
      "startups",
      "enterprise",
      "freelancers",
      "agencies",
      "nonprofits",
      "growing-teams",
      "sales-teams",
      "default",
    ])
    .default("default"),
  sortOrder: z.number().int().nonnegative().default(0),
});

export type AudienceHubProfile = z.infer<typeof AudienceHubProfileSchema>;
