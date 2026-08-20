import { z } from "zod";

/**
 * WordPress → SoftwareGlimpse URL migration ledger entry.
 */
export const MigrationActionSchema = z.enum([
  "KEEP",
  "REWRITE",
  "REDIRECT",
  "MERGE",
  "REMOVE",
]);

export const MigrationRecordSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  sourceTitle: z.string().optional(),
  sourcePageType: z.string().optional(),
  action: MigrationActionSchema,
  target: z.string().optional(),
  redirectType: z.union([z.literal(301), z.literal(302), z.literal(410)]).optional(),
  canonical: z.string().optional(),
  contentDisposition: z
    .enum(["preserve", "rewrite", "merge-into-target", "archive", "drop"])
    .optional(),
  reason: z.string().optional(),
  newEquivalent: z.string().optional(),
  notes: z.string().optional(),
});

export type MigrationRecord = z.infer<typeof MigrationRecordSchema>;
export type MigrationAction = z.infer<typeof MigrationActionSchema>;
