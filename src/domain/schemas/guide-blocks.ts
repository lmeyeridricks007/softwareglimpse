import { z } from "zod";

/**
 * Structured content blocks for decision / educational guides.
 * Agents choose a recipe of blocks by topic intent — not a fixed H2 essay template.
 */

const BlockBase = {
  id: z.string().min(1),
  title: z.string().min(1).optional(),
};

/** Inline educational figure — unique artwork for the topic being explained. */
export const GuideFigureRefSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().optional(),
});

export type GuideFigureRef = z.infer<typeof GuideFigureRefSchema>;

const ChecklistItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  order: z.number().int().nonnegative().default(0),
});

export const GuideDirectAnswerBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("direct-answer"),
  body: z.string().min(1),
  bullets: z.array(z.string().min(1)).default([]),
});

export const GuideKeyTakeawaysBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("key-takeaways"),
  items: z
    .array(
      z.object({
        label: z.string().min(1),
        body: z.string().optional(),
      }),
    )
    .min(1),
});

export const GuideDecisionFrameworkBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("decision-framework"),
  steps: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        short: z.string().optional(),
      }),
    )
    .min(3),
  ctaHref: z.string().optional(),
  ctaLabel: z.string().optional(),
  figure: GuideFigureRefSchema.optional(),
});

export const GuideFigureBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("figure"),
  src: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().optional(),
});

export const GuideStepBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("step"),
  heading: z.string().min(1),
  body: z.string().min(1),
  tip: z.string().optional(),
  stepNumber: z.number().int().positive().optional(),
  scenarios: z
    .array(
      z.object({
        title: z.string().min(1),
        body: z.string().min(1),
      }),
    )
    .default([]),
  /** Topic-specific generated diagram — do not reuse another guide's asset. */
  figure: GuideFigureRefSchema.optional(),
});

export const GuideFeatureMatrixBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("feature-matrix"),
  rows: z
    .array(
      z.object({
        feature: z.string().min(1),
        mustHave: z.boolean(),
        niceToHave: z.boolean(),
        notes: z.string().optional(),
      }),
    )
    .min(1),
  figure: GuideFigureRefSchema.optional(),
});

export const GuideSizeMatchBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("size-match"),
  tiers: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        description: z.string().min(1),
        fitHints: z.array(z.string().min(1)).default([]),
      }),
    )
    .min(2),
  figure: GuideFigureRefSchema.optional(),
});

export const GuideIntegrationEcosystemBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("integration-ecosystem"),
  hubLabel: z.string().min(1).default("CRM"),
  systems: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
      }),
    )
    .min(3),
  body: z.string().optional(),
});

export const GuideCostBreakdownBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("cost-breakdown"),
  body: z.string().optional(),
  lines: z
    .array(
      z.object({
        label: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .min(1),
  calculatorHref: z.string().optional(),
  calculatorLabel: z.string().optional(),
});

export const GuideComparisonFrameworkBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("comparison-framework"),
  criteria: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        weight: z.number().positive(),
        description: z.string().min(1),
      }),
    )
    .min(3),
});

export const GuideCrmTypesBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("crm-types"),
  types: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        bestFor: z.string().min(1),
        avoidWhen: z.string().min(1),
      }),
    )
    .min(2),
});

export const GuideProductShortlistBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("product-shortlist"),
  body: z.string().optional(),
  /** Catalogue product slugs — never invent products in the agent. */
  productSlugs: z.array(z.string().min(1)).min(1),
  disclaimer: z.string().optional(),
});

export const GuideMistakesBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("mistakes"),
  items: z
    .array(
      z.object({
        title: z.string().min(1),
        body: z.string().min(1),
      }),
    )
    .min(1),
});

export const GuideChecklistBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("checklist"),
  items: z.array(ChecklistItemSchema).min(1),
  copyable: z.boolean().default(false),
});

export const GuideSelectionChecklistBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("selection-checklist"),
  dimensions: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        options: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
});

export const GuideTrialPlanBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("trial-plan"),
  days: z
    .array(
      z.object({
        day: z.number().int().positive(),
        focus: z.string().min(1),
        tasks: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(1),
});

export const GuideScorecardBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("scorecard"),
  criteria: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().min(1),
        weight: z.number().positive(),
      }),
    )
    .min(3),
  productSlugs: z.array(z.string().min(1)).default([]),
  body: z.string().optional(),
});

export const GuideInteractiveCtaBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("interactive-cta"),
  body: z.string().min(1),
  href: z.string().min(1),
  ctaLabel: z.string().min(1),
  variant: z.enum(["finder", "calculator", "generic"]).default("generic"),
});

export const GuideExpertTipBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("expert-tip"),
  body: z.string().min(1),
});

export const GuideCalloutBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("callout"),
  body: z.string().min(1),
  tone: z.enum(["info", "warning", "success"]).default("info"),
});

export const GuideFaqBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("faq"),
  items: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      }),
    )
    .min(1),
});

export const GuideRelatedContentBlockSchema = z.object({
  ...BlockBase,
  type: z.literal("related-content"),
  links: z
    .array(
      z.object({
        href: z.string().min(1),
        label: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .min(1),
});

export const GuideContentBlockSchema = z.discriminatedUnion("type", [
  GuideDirectAnswerBlockSchema,
  GuideKeyTakeawaysBlockSchema,
  GuideDecisionFrameworkBlockSchema,
  GuideStepBlockSchema,
  GuideFeatureMatrixBlockSchema,
  GuideSizeMatchBlockSchema,
  GuideIntegrationEcosystemBlockSchema,
  GuideCostBreakdownBlockSchema,
  GuideComparisonFrameworkBlockSchema,
  GuideCrmTypesBlockSchema,
  GuideProductShortlistBlockSchema,
  GuideMistakesBlockSchema,
  GuideChecklistBlockSchema,
  GuideSelectionChecklistBlockSchema,
  GuideTrialPlanBlockSchema,
  GuideScorecardBlockSchema,
  GuideInteractiveCtaBlockSchema,
  GuideExpertTipBlockSchema,
  GuideCalloutBlockSchema,
  GuideFaqBlockSchema,
  GuideRelatedContentBlockSchema,
  GuideFigureBlockSchema,
]);

export type GuideContentBlock = z.infer<typeof GuideContentBlockSchema>;

/** Block recipes by supporting topic type — used by GuideAgent. */
export const GUIDE_BLOCK_RECIPES: Record<string, GuideContentBlock["type"][]> = {
  fundamental: [
    "direct-answer",
    "key-takeaways",
    "decision-framework",
    "step",
    "figure",
    "feature-matrix",
    "size-match",
    "crm-types",
    "mistakes",
    "faq",
    "related-content",
    "interactive-cta",
  ],
  "how-it-works": [
    "direct-answer",
    "decision-framework",
    "step",
    "expert-tip",
    "faq",
    "related-content",
  ],
  selection: [
    "direct-answer",
    "key-takeaways",
    "decision-framework",
    "selection-checklist",
    "step",
    "feature-matrix",
    "size-match",
    "integration-ecosystem",
    "cost-breakdown",
    "comparison-framework",
    "crm-types",
    "product-shortlist",
    "mistakes",
    "checklist",
    "trial-plan",
    "scorecard",
    "interactive-cta",
    "related-content",
    "faq",
  ],
  "buying-guide": [
    "direct-answer",
    "decision-framework",
    "feature-matrix",
    "cost-breakdown",
    "product-shortlist",
    "scorecard",
    "interactive-cta",
    "faq",
  ],
  "pricing-education": [
    "direct-answer",
    "cost-breakdown",
    "callout",
    "checklist",
    "interactive-cta",
    "faq",
    "related-content",
  ],
  implementation: [
    "direct-answer",
    "key-takeaways",
    "decision-framework",
    "figure",
    "feature-matrix",
    "checklist",
    "step",
    "mistakes",
    "faq",
    "related-content",
    "interactive-cta",
  ],
  /** Product day-0 setup — same teaching shape as implementation. */
  setup: [
    "direct-answer",
    "key-takeaways",
    "decision-framework",
    "figure",
    "feature-matrix",
    "checklist",
    "step",
    "mistakes",
    "faq",
    "related-content",
    "interactive-cta",
  ],
  migration: [
    "direct-answer",
    "decision-framework",
    "figure",
    "checklist",
    "step",
    "mistakes",
    "faq",
    "related-content",
  ],
  checklist: [
    "direct-answer",
    "checklist",
    "expert-tip",
    "interactive-cta",
    "related-content",
  ],
  "comparison-education": [
    "direct-answer",
    "key-takeaways",
    "decision-framework",
    "figure",
    "step",
    "feature-matrix",
    "mistakes",
    "faq",
    "related-content",
    "interactive-cta",
  ],
};
