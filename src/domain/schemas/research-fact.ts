import { z } from "zod";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";
import { ResearchDomainSchema } from "./research-source";

export const FactConfidenceSchema = z.enum(["high", "medium", "low"]);

export const FactStatusSchema = z.enum([
  "extracted",
  "normalized",
  "verified",
  "approved",
  "rejected",
  "stale",
  "conflict",
]);

export type FactStatus = z.infer<typeof FactStatusSchema>;

export const FactEvidenceSchema = z.object({
  sourceId: z.string().min(1),
  excerpt: z.string().max(500).optional(),
  locator: z.string().max(200).optional(),
});

export type FactEvidence = z.infer<typeof FactEvidenceSchema>;

/**
 * Typed research fact. Value stays structured (number/boolean/object/array),
 * not forced into strings.
 */
export const ResearchFactSchema = z.object({
  id: z.string().min(1),
  productSlug: SlugSchema,
  domain: ResearchDomainSchema,
  /** Dot-path into canonical software model, e.g. pricing.plans.0 or features.pipeline-management */
  field: z.string().min(1),
  value: z.unknown(),
  sourceIds: z.array(z.string().min(1)).min(1),
  evidence: z.array(FactEvidenceSchema).default([]),
  extractedAt: IsoDateTimeSchema,
  normalizedAt: IsoDateTimeSchema.optional(),
  verifiedAt: IsoDateTimeSchema.optional(),
  approvedAt: IsoDateTimeSchema.optional(),
  confidence: FactConfidenceSchema.default("medium"),
  status: FactStatusSchema.default("extracted"),
  /** true when produced from fixture/demo snapshots — never treat as live vendor truth */
  isFixture: z.boolean().default(false),
  notes: z.string().optional(),
});

export type ResearchFact = z.infer<typeof ResearchFactSchema>;

export const FactConflictSchema = z.object({
  id: z.string().min(1),
  productSlug: SlugSchema,
  field: z.string().min(1),
  factIds: z.array(z.string().min(1)).min(2),
  status: z.enum(["open", "resolved-by-priority", "resolved-manual", "rejected"]),
  preferredFactId: z.string().optional(),
  notes: z.string().optional(),
  detectedAt: IsoDateTimeSchema,
});

export type FactConflict = z.infer<typeof FactConflictSchema>;
