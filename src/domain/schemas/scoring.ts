import { z } from "zod";
import { SlugSchema } from "./primitives";

/**
 * Category-specific editorial scoring dimensions.
 * Do not force irrelevant ratings onto every product category.
 */
export const ScoringCriterionSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  description: z.string().optional(),
  categorySlug: SlugSchema,
  displayOrder: z.number().int().nonnegative().default(0),
  weightPotential: z.number().positive().optional(),
});

export type ScoringCriterion = z.infer<typeof ScoringCriterionSchema>;
