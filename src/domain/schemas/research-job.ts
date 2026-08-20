import { z } from "zod";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";
import { ResearchDomainSchema } from "./research-source";

export const ResearchJobStatusSchema = z.enum([
  "queued",
  "discovering",
  "fetching",
  "extracting",
  "normalizing",
  "review-required",
  "approved",
  "failed",
]);

export type ResearchJobStatus = z.infer<typeof ResearchJobStatusSchema>;

export const ResearchJobSchema = z.object({
  id: z.string().min(1),
  productSlug: SlugSchema,
  domains: z.array(ResearchDomainSchema).min(1),
  status: ResearchJobStatusSchema.default("queued"),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema.optional(),
  completedAt: IsoDateTimeSchema.optional(),
  dryRun: z.boolean().default(false),
  allowFixtures: z.boolean().default(true),
  sourceIds: z.array(z.string()).default([]),
  snapshotIds: z.array(z.string()).default([]),
  factIds: z.array(z.string()).default([]),
  conflictIds: z.array(z.string()).default([]),
  errors: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export type ResearchJob = z.infer<typeof ResearchJobSchema>;
