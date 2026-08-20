import { z } from "zod";
import { SlugSchema } from "./primitives";

/**
 * Presentation profile for Industry Hub pages.
 * Complements Industry taxonomy — does not replace catalogue research.
 * Product scores, pricing, and feature availability come from the catalogue
 * / enrichment model at build time — never hard-coded into this profile.
 */

export const IndustryResearchMaturitySchema = z.enum([
  "unresearched",
  "research-in-progress",
  "researched",
  "editorially-approved",
]);

export type IndustryResearchMaturity = z.infer<
  typeof IndustryResearchMaturitySchema
>;

export const IndustryHubPrioritySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  /** Lucide icon key resolved in UI. */
  icon: z.string().min(1).optional(),
  /** Optional capability detail slug when an Industry Capability page exists. */
  capabilitySlug: SlugSchema.optional(),
  /** Optional anchor or capability/compare href. */
  href: z.string().optional(),
});

export type IndustryHubPriority = z.infer<typeof IndustryHubPrioritySchema>;

export const IndustryHubUseCaseSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** “Best when…” buyer scenario — not a product recommendation. */
  bestWhen: z.string().min(1),
  icon: z.string().min(1).optional(),
  /** Industry use-case detail slug when a page exists. */
  useCaseSlug: SlugSchema.optional(),
  href: z.string().optional(),
});

export type IndustryHubUseCase = z.infer<typeof IndustryHubUseCaseSchema>;

export const IndustryHubCapabilityGroupSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** Canonical feature slugs — cells filled from enrichment evidence. */
  featureSlugs: z.array(SlugSchema).default([]),
});

export type IndustryHubCapabilityGroup = z.infer<
  typeof IndustryHubCapabilityGroupSchema
>;

export const IndustryHubImplementationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1).optional(),
});

export type IndustryHubImplementation = z.infer<
  typeof IndustryHubImplementationSchema
>;

export const IndustryHubQuestionSchema = z.object({
  question: z.string().min(1),
  /** Optional educational note — not a vendor capability claim. */
  answer: z.string().optional(),
});

export type IndustryHubQuestion = z.infer<typeof IndustryHubQuestionSchema>;

export const IndustryHubSecurityDimensionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  /** Buyer requirement detail slug when a Requirements page exists. */
  requirementSlug: SlugSchema.optional(),
  href: z.string().optional(),
});

export type IndustryHubSecurityDimension = z.infer<
  typeof IndustryHubSecurityDimensionSchema
>;

export const IndustryHubBuyingStepSchema = z.object({
  step: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().optional(),
  href: z.string().optional(),
  ctaLabel: z.string().optional(),
});

export type IndustryHubBuyingStep = z.infer<typeof IndustryHubBuyingStepSchema>;

export const IndustryHubFaqItemSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export type IndustryHubFaqItem = z.infer<typeof IndustryHubFaqItemSchema>;

export const IndustryHubGlanceSchema = z.object({
  primaryGoal: z.string().min(1).optional(),
  commonPriorities: z.array(z.string().min(1)).default([]),
  teamTypes: z.array(z.string().min(1)).default([]),
});

export type IndustryHubGlance = z.infer<typeof IndustryHubGlanceSchema>;

export const IndustryHubChallengeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  /** What breaks today without shared process. */
  pain: z.string().min(1),
  /** How a well-used CRM addresses it — operational, not vendor pitch. */
  crmHelps: z.string().min(1),
});

export type IndustryHubChallenge = z.infer<typeof IndustryHubChallengeSchema>;

export const IndustryHubOutcomeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export type IndustryHubOutcome = z.infer<typeof IndustryHubOutcomeSchema>;

export const IndustryHubCapabilityNeedSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(["must", "nice"]),
  href: z.string().optional(),
});

export type IndustryHubCapabilityNeed = z.infer<
  typeof IndustryHubCapabilityNeedSchema
>;

export const IndustryHubWorkflowStepSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  detail: z.string().min(1),
  /** Buyer objective for this step — shown as Objective in the workflow UI. */
  goal: z.string().min(1).optional(),
  /**
   * Concrete actions that happen in this step — shown as “In this step”.
   * Keep 2–5 short operational lines; avoid vendor pitches.
   */
  activities: z.array(z.string().min(1)).max(6).default([]),
  /** Related use-case slugs (resolved to labels/hrefs at page build). */
  useCaseSlugs: z.array(z.string().min(1)).default([]),
  /** Related capability slugs. */
  capabilitySlugs: z.array(z.string().min(1)).default([]),
  /** Related requirement slugs. */
  requirementSlugs: z.array(z.string().min(1)).default([]),
  /** Related feature slugs for structured product-support overlays. */
  featureSlugs: z.array(z.string().min(1)).default([]),
});

export type IndustryHubWorkflowStep = z.infer<
  typeof IndustryHubWorkflowStepSchema
>;

export const IndustryHubVisualSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().min(1).optional(),
});

export type IndustryHubVisual = z.infer<typeof IndustryHubVisualSchema>;

/**
 * Catalogue-only product fit note for an industry hub.
 * Scores/pricing/features are resolved at build time — never invent them here.
 */
export const IndustryHubProductFitSchema = z.object({
  productSlug: SlugSchema,
  /** Evidence-based operational why (from assessments / positioning). */
  why: z.string().min(1),
  /** Buyer scenario — when this product is worth evaluating. */
  bestWhen: z.string().min(1),
});

export type IndustryHubProductFit = z.infer<typeof IndustryHubProductFitSchema>;

export const IndustryHubProfileSchema = z.object({
  industrySlug: SlugSchema,
  /** Hero H1 override (e.g. "CRM software for Financial services"). */
  displayTitle: z.string().min(1).optional(),
  badgeLabel: z.string().min(1).optional(),
  tagline: z.string().min(1).optional(),
  overview: z.string().optional(),
  /** Longer “who this is for” narrative. */
  whoThisIsFor: z.string().optional(),
  whatMattersIntro: z.string().optional(),
  workedExample: z.string().optional(),
  workedExampleSecondary: z.string().optional(),
  glance: IndustryHubGlanceSchema.optional(),
  challenges: z.array(IndustryHubChallengeSchema).default([]),
  outcomes: z.array(IndustryHubOutcomeSchema).default([]),
  capabilityNeeds: z.array(IndustryHubCapabilityNeedSchema).default([]),
  workflowSteps: z.array(IndustryHubWorkflowStepSchema).default([]),
  priorities: z.array(IndustryHubPrioritySchema).default([]),
  useCases: z.array(IndustryHubUseCaseSchema).default([]),
  capabilityGroups: z.array(IndustryHubCapabilityGroupSchema).default([]),
  /** High-level capability slugs shown on product cards. */
  snapshotFeatureSlugs: z.array(SlugSchema).default([]),
  /**
   * Curated catalogue CRM shortlist with fit notes.
   * Product evidence (scores, logos) comes from the catalogue at build time.
   */
  productFitGuidance: z.array(IndustryHubProductFitSchema).default([]),
  implementationConsiderations: z
    .array(IndustryHubImplementationSchema)
    .default([]),
  evaluationQuestions: z.array(IndustryHubQuestionSchema).default([]),
  securityDimensions: z.array(IndustryHubSecurityDimensionSchema).default([]),
  securityDisclaimer: z.string().optional(),
  buyingFramework: z.array(IndustryHubBuyingStepSchema).default([]),
  buyingGuideHref: z.string().optional(),
  faq: z.array(IndustryHubFaqItemSchema).default([]),
  heroVisual: IndustryHubVisualSchema.optional(),
  needsVisual: IndustryHubVisualSchema.optional(),
  workflowVisual: IndustryHubVisualSchema.optional(),
  /** Preferred related industry slugs (must exist). */
  relatedIndustrySlugs: z.array(SlugSchema).default([]),
  /** Preferred comparison slugs (must exist). */
  featuredComparisonSlugs: z.array(SlugSchema).default([]),
  /** Preferred guide paths or slugs. */
  featuredGuideHrefs: z.array(z.string().min(1)).default([]),
  finderHref: z.string().optional(),
  calculatorHref: z.string().optional(),
  compareHref: z.string().optional(),
  catalogueHref: z.string().optional(),
  methodologyHref: z.string().optional(),
  categorySlug: SlugSchema.default("crm"),
  lastReviewedAt: z.string().optional(),
});

export type IndustryHubProfile = z.infer<typeof IndustryHubProfileSchema>;
