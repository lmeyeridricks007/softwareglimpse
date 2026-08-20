import { z } from "zod";
import { CriterionAssessmentSchema } from "./editorial";
import { SlugSchema } from "./primitives";

export const EditorialPageTypeSchema = z.enum([
  "software-review",
  "comparison",
  "alternatives",
  "best",
  "guide",
  "pricing",
  "category-hub",
  "use-case",
  "knowledge-plan",
]);

export type EditorialPageType = z.infer<typeof EditorialPageTypeSchema>;

/**
 * Page brief — contract for AI/deterministic generation.
 * Model receives only approved facts + assessments + allowed relationships.
 */
export const EditorialBriefSchema = z.object({
  id: z.string().min(1),
  pageType: EditorialPageTypeSchema,
  targetIntent: z.string().min(1),
  primaryKeyword: z.string().optional(),
  productSlug: SlugSchema.optional(),
  productSlugs: z.array(SlugSchema).default([]),
  audience: z.string().optional(),
  requiredSections: z.array(z.string().min(1)).default([]),
  facts: z
    .array(
      z.object({
        id: z.string().min(1),
        domain: z.string().min(1),
        claim: z.string().min(1),
        value: z.unknown().optional(),
      }),
    )
    .default([]),
  editorialAssessments: z.array(CriterionAssessmentSchema).default([]),
  allowedComparisons: z.array(SlugSchema).default([]),
  allowedAlternatives: z.array(SlugSchema).default([]),
  internalLinks: z
    .array(
      z.object({
        href: z.string().min(1),
        label: z.string().min(1),
        reason: z.string().optional(),
      }),
    )
    .default([]),
  prohibitedClaims: z.array(z.string().min(1)).default([]),
  approvedNumbers: z
    .array(
      z.object({
        kind: z.string().min(1),
        value: z.union([z.string(), z.number()]),
        factId: z.string().optional(),
      }),
    )
    .default([]),
  handsOnTestingAllowed: z.boolean().default(false),
  methodologyVersion: z.string().optional(),
  toneNotes: z.array(z.string().min(1)).default([]),
});

export type EditorialBrief = z.infer<typeof EditorialBriefSchema>;
