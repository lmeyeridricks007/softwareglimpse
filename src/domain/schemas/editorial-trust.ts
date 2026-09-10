import { z } from "zod";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";

/**
 * Public editorial evidence levels.
 *
 * These must never be conflated:
 * - researched — product coverage based on structured research
 * - data_verified — key facts (especially pricing) have verification timestamps
 * - hands_on_tested — recorded hands-on testing with a test date
 *
 * AI/content pipeline processing alone never elevates evidence level.
 */
export const EvidenceLevelSchema = z.enum([
  "researched",
  "data_verified",
  "hands_on_tested",
]);

export type EvidenceLevel = z.infer<typeof EvidenceLevelSchema>;

export const EVIDENCE_LEVEL_LABELS: Record<EvidenceLevel, string> = {
  researched: "Research-based review",
  data_verified: "Data verified",
  hands_on_tested: "Hands-on tested",
};

export const EVIDENCE_LEVEL_ORDER: readonly EvidenceLevel[] = [
  "researched",
  "data_verified",
  "hands_on_tested",
] as const;

/**
 * Structured editorial trust metadata for reviews, comparisons, and guides.
 * Render only fields that contain real data — never fabricate dates, authors,
 * testing claims, or affiliate relationships.
 */
export const EditorialTrustMetadataSchema = z.object({
  authorId: z.string().min(1).optional(),
  reviewerId: z.string().min(1).optional(),
  researchDate: IsoDateTimeSchema.optional(),
  lastUpdated: IsoDateTimeSchema.optional(),
  pricingVerifiedAt: IsoDateTimeSchema.optional(),
  testedAt: IsoDateTimeSchema.optional(),
  evidenceLevel: EvidenceLevelSchema,
  methodologySlug: SlugSchema.optional(),
  methodologyVersion: z.string().min(1).optional(),
  sourceIds: z.array(z.string().min(1)).default([]),
  /** true / false when known; omit when unknown */
  affiliateRelationship: z.boolean().optional(),
  handsOnTesting: z.boolean().default(false),
});

export type EditorialTrustMetadata = z.infer<
  typeof EditorialTrustMetadataSchema
>;
