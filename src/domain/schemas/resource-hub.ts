import { z } from "zod";
import { SlugSchema } from "./primitives";

/**
 * Presentation profile for downloadable CRM Resources (`/resources/[slug]/`).
 * Complements Resource taxonomy — actionable artifacts, not product rankings.
 */

export const ResourceKindSchema = z.enum([
  "checklist",
  "template",
  "scorecard",
  "worksheet",
  "planner",
]);

export type ResourceKind = z.infer<typeof ResourceKindSchema>;

export const ResourceStageSchema = z.enum([
  "choose",
  "implement",
  "compare",
  "security",
  "optimize",
]);

export type ResourceStage = z.infer<typeof ResourceStageSchema>;

export const ResourceHubVisualSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().min(1).optional(),
});

export type ResourceHubVisual = z.infer<typeof ResourceHubVisualSchema>;

export const ResourceHubChallengeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  pain: z.string().min(1),
  crmHelps: z.string().min(1),
});

export type ResourceHubChallenge = z.infer<typeof ResourceHubChallengeSchema>;

export const ResourceHubOutcomeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export type ResourceHubOutcome = z.infer<typeof ResourceHubOutcomeSchema>;

export const ResourceHubWorkflowStepSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  detail: z.string().min(1),
});

export type ResourceHubWorkflowStep = z.infer<
  typeof ResourceHubWorkflowStepSchema
>;

export const ResourceHubFaqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export type ResourceHubFaqItem = z.infer<typeof ResourceHubFaqItemSchema>;

export const ResourceHubGlanceSchema = z.object({
  primaryGoal: z.string().min(1).optional(),
  typicalTeam: z.string().min(1).optional(),
  commonPriorities: z.array(z.string().min(1)).default([]),
});

export type ResourceHubGlance = z.infer<typeof ResourceHubGlanceSchema>;

export const ResourceHubPrioritySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1).optional(),
  href: z.string().optional(),
});

export type ResourceHubPriority = z.infer<typeof ResourceHubPrioritySchema>;

export const ResourceArtifactItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  detail: z.string().min(1).optional(),
  /** Why this check matters (evaluation-style rows). */
  whyItMatters: z.string().min(1).optional(),
  /** Must-have vs nice-to-have for printable/Excel artifacts. */
  required: z.boolean().optional(),
  /** Concrete test/scenario to run in demo or trial. */
  testScenario: z.string().min(1).optional(),
  owner: z.string().min(1).optional(),
  doneWhen: z.string().min(1).optional(),
});

export type ResourceArtifactItem = z.infer<typeof ResourceArtifactItemSchema>;

export const ResourceArtifactSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  intro: z.string().min(1).optional(),
  /** Optional accent for section headers in PDF/preview (hex or named). */
  accent: z.string().min(1).optional(),
  items: z.array(ResourceArtifactItemSchema).min(1),
});

export type ResourceArtifactSection = z.infer<
  typeof ResourceArtifactSectionSchema
>;

export const ResourceWhatsInsideCardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1).optional(),
});

export type ResourceWhatsInsideCard = z.infer<
  typeof ResourceWhatsInsideCardSchema
>;

export const ResourceWorkedExampleVendorSchema = z.object({
  name: z.string().min(1),
  result: z.enum(["PASS", "PARTIAL", "FAIL", "NOT_TESTED"]),
  note: z.string().min(1),
});

export type ResourceWorkedExampleVendor = z.infer<
  typeof ResourceWorkedExampleVendorSchema
>;

export const ResourceWorkedExampleSchema = z.object({
  title: z.string().min(1).default("Worked example"),
  requirement: z.string().min(1),
  vendors: z.array(ResourceWorkedExampleVendorSchema).min(1),
  evidence: z.string().min(1).optional(),
  disclaimer: z
    .string()
    .min(1)
    .default(
      "Hypothetical Vendor A / Vendor B scenario for teaching the artifact — not a SoftwareGlimpse case study.",
    ),
});

export type ResourceWorkedExample = z.infer<typeof ResourceWorkedExampleSchema>;

export const ResourceDownloadFileSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1),
  format: z.enum(["md", "csv", "pdf", "xlsx"]).default("md"),
});

export type ResourceDownloadFile = z.infer<typeof ResourceDownloadFileSchema>;

export const ResourceHubProfileSchema = z.object({
  resourceSlug: SlugSchema,
  displayTitle: z.string().min(1).optional(),
  badgeLabel: z.string().min(1).optional(),
  toolkitLabel: z.string().min(1).optional(),
  tagline: z.string().min(1).optional(),
  /** Short supporting sentence under the value proposition (hero). */
  heroExplanation: z.string().optional(),
  overview: z.string().optional(),
  whoThisIsFor: z.string().optional(),
  whatMattersIntro: z.string().optional(),
  howToUse: z.string().optional(),
  /** @deprecated Prefer workedExampleStructured — keep as plain fallback. */
  workedExample: z.string().optional(),
  workedExampleSecondary: z.string().optional(),
  workedExampleStructured: ResourceWorkedExampleSchema.optional(),
  glance: ResourceHubGlanceSchema.optional(),
  whatsInside: z.array(ResourceWhatsInsideCardSchema).default([]),
  evidenceRules: z
    .object({
      countsAs: z.array(z.string().min(1)).default([]),
      doesNotCount: z.array(z.string().min(1)).default([]),
    })
    .optional(),
  challenges: z.array(ResourceHubChallengeSchema).default([]),
  outcomes: z.array(ResourceHubOutcomeSchema).default([]),
  priorities: z.array(ResourceHubPrioritySchema).default([]),
  workflowSteps: z.array(ResourceHubWorkflowStepSchema).default([]),
  artifactSections: z.array(ResourceArtifactSectionSchema).default([]),
  downloadFiles: z.array(ResourceDownloadFileSchema).default([]),
  faq: z.array(ResourceHubFaqItemSchema).default([]),
  heroVisual: ResourceHubVisualSchema.optional(),
  needsVisual: ResourceHubVisualSchema.optional(),
  workflowVisual: ResourceHubVisualSchema.optional(),
  relatedResourceSlugs: z.array(SlugSchema).default([]),
  useBefore: z.array(SlugSchema).default([]),
  useWith: z.array(SlugSchema).default([]),
  useNext: z.array(SlugSchema).default([]),
  journeySlugs: z.array(SlugSchema).default([]),
  featuredGuideHrefs: z.array(z.string().min(1)).default([]),
  relatedToolHrefs: z
    .array(
      z.object({
        href: z.string().min(1),
        label: z.string().min(1),
      }),
    )
    .default([]),
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
  categorySlug: SlugSchema.default("crm"),
  lastReviewedAt: z.string().optional(),
});

export type ResourceHubProfile = z.infer<typeof ResourceHubProfileSchema>;
