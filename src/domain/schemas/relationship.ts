import { z } from "zod";
import { SlugSchema } from "./primitives";

/**
 * Typed knowledge-graph edges.
 * Symmetric types (competes-with, alternative-to, related-to) resolve inverses automatically.
 */
export const RelationshipTypeSchema = z.enum([
  "belongs-to-category",
  "belongs-to-subcategory",
  "supports-use-case",
  "best-for-audience",
  "relevant-to-business-type",
  "competes-with",
  "alternative-to",
  "integrates-with",
  "related-to",
]);

export type RelationshipType = z.infer<typeof RelationshipTypeSchema>;

export const SYMMETRIC_RELATIONSHIP_TYPES: readonly RelationshipType[] = [
  "competes-with",
  "alternative-to",
  "related-to",
] as const;

export function isSymmetricRelationship(type: RelationshipType): boolean {
  return (SYMMETRIC_RELATIONSHIP_TYPES as readonly string[]).includes(type);
}

export const RelationshipStrengthSchema = z.enum(["low", "medium", "high"]);

export const SoftwareRelationshipSchema = z
  .object({
    id: z.string().min(1),
    source: SlugSchema,
    target: SlugSchema,
    type: RelationshipTypeSchema,
    strength: RelationshipStrengthSchema.default("medium"),
    reason: z.string().min(1).optional(),
    reasonCode: z.string().min(1).optional(),
  })
  .superRefine((value, ctx) => {
    if (
      value.source === value.target &&
      (value.type === "competes-with" ||
        value.type === "alternative-to" ||
        value.type === "related-to")
    ) {
      ctx.addIssue({
        code: "custom",
        message: `Self-relationship of type ${value.type} is not allowed`,
        path: ["target"],
      });
    }
  });

export type SoftwareRelationship = z.infer<typeof SoftwareRelationshipSchema>;
