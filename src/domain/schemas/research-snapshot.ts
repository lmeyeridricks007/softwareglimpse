import { z } from "zod";
import { IsoDateTimeSchema } from "./primitives";
import { ResearchDomainSchema } from "./research-source";

export const ResearchSnapshotSchema = z.object({
  id: z.string().min(1),
  sourceId: z.string().min(1),
  productSlug: z.string().min(1),
  retrievedAt: IsoDateTimeSchema,
  url: z.string().url().optional(),
  httpStatus: z.number().int().optional(),
  contentType: z.string().optional(),
  pageTitle: z.string().optional(),
  canonicalUrl: z.string().url().optional(),
  /** SHA-256 hex of normalized extracted text for change detection. */
  contentHash: z.string().min(8),
  /**
   * Cleaned plain text / markdown excerpt used for extraction.
   * Retention: keep extractedText for audit; avoid full raw HTML dumps.
   */
  extractedText: z.string().min(1),
  domains: z.array(ResearchDomainSchema).default([]),
  isFixture: z.boolean().default(false),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type ResearchSnapshot = z.infer<typeof ResearchSnapshotSchema>;
