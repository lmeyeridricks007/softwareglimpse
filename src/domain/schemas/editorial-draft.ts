import { z } from "zod";
import { EditorialPageTypeSchema } from "./editorial-brief";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";

export const EditorialDraftStatusSchema = z.enum([
  "generated",
  "validation-failed",
  "editorial-review",
  "approved",
  "rejected",
  "published",
  "superseded",
]);

export type EditorialDraftStatus = z.infer<typeof EditorialDraftStatusSchema>;

export const EditorialDraftSectionSchema = z.object({
  id: z.string().min(1),
  heading: z.string().min(1),
  body: z.string().min(1),
  factRefs: z.array(z.string().min(1)).default([]),
});

/**
 * Generated structured draft — never writes directly over published content.
 */
export const EditorialDraftSchema = z.object({
  id: z.string().min(1),
  briefId: z.string().min(1),
  pageType: EditorialPageTypeSchema,
  targetSlug: SlugSchema,
  provider: z.string().min(1),
  status: EditorialDraftStatusSchema.default("generated"),
  summary: z.string().optional(),
  verdict: z.string().optional(),
  pros: z.array(z.string().min(1)).default([]),
  cons: z.array(z.string().min(1)).default([]),
  sections: z.array(EditorialDraftSectionSchema).default([]),
  faq: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
        factRefs: z.array(z.string().min(1)).default([]),
      }),
    )
    .default([]),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  h1: z.string().optional(),
  factRefs: z
    .array(
      z.object({
        section: z.string().min(1),
        factIds: z.array(z.string().min(1)).default([]),
      }),
    )
    .default([]),
  validationErrors: z.array(z.string().min(1)).default([]),
  previousApprovedDraftId: z.string().optional(),
  rejectionReason: z.string().optional(),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema.optional(),
});

export type EditorialDraft = z.infer<typeof EditorialDraftSchema>;
