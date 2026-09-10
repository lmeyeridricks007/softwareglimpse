import { z } from "zod";
import { IsoDateSchema, IsoDateTimeSchema } from "./primitives";

/**
 * Content distribution — draft generation only.
 * Never auto-posts. Source material must be genuine SoftwareGlimpse work.
 */

export const DistributionCampaignTypeSchema = z.enum([
  "research_insight",
  "verified_price_change",
  "product_testing",
  "comparison_finding",
  "data_insight",
]);
export type DistributionCampaignType = z.infer<
  typeof DistributionCampaignTypeSchema
>;

export const DistributionChannelSchema = z.enum([
  "linkedin_company",
  "linkedin_personal",
  "facebook",
  "instagram_carousel",
  "newsletter",
  "reddit",
  "short_video",
]);
export type DistributionChannel = z.infer<typeof DistributionChannelSchema>;

export const DistributionVisualKindSchema = z.enum([
  "chart",
  "stat_card",
  "carousel",
  "comparison_visual",
]);
export type DistributionVisualKind = z.infer<
  typeof DistributionVisualKindSchema
>;

export const SupportingDatumSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  sampleSize: z.number().int().nonnegative().optional(),
  unit: z.string().optional(),
  note: z.string().optional(),
});
export type SupportingDatum = z.infer<typeof SupportingDatumSchema>;

export const DistributionCampaignSchema = z.object({
  id: z.string().min(1),
  sourceAsset: z.string().min(1),
  keyFinding: z.string().min(1),
  supportingData: z.array(SupportingDatumSchema).default([]),
  sourceURL: z.string().min(1),
  publicationDate: IsoDateSchema.or(IsoDateTimeSchema),
  campaignType: DistributionCampaignTypeSchema,
  /** Human-readable title for packs */
  title: z.string().min(1),
  limitations: z.array(z.string()).default([]),
  utmCampaign: z.string().min(1),
  generatedAt: IsoDateTimeSchema,
});
export type DistributionCampaign = z.infer<typeof DistributionCampaignSchema>;

export const DistributionVisualSpecSchema = z.object({
  kind: DistributionVisualKindSchema,
  title: z.string().min(1),
  /** On-pixel text — must obey social-visuals rule (no affiliate lectures). */
  onPixelLines: z.array(z.string()).default([]),
  dataPoints: z.array(SupportingDatumSchema).default([]),
  captionSuggestion: z.string().optional(),
  /** Explicit bans reminder for designers */
  bannedOnPixel: z.array(z.string()).default([]),
});
export type DistributionVisualSpec = z.infer<
  typeof DistributionVisualSpecSchema
>;

export const ChannelDraftSchema = z.object({
  channel: DistributionChannelSchema,
  campaignId: z.string().min(1),
  headline: z.string().optional(),
  body: z.string().min(1),
  hashtags: z.array(z.string()).default([]),
  ctaUrl: z.string().optional(),
  slides: z.array(z.string()).optional(),
  visualSpecs: z.array(DistributionVisualSpecSchema).default([]),
  requiresHumanApproval: z.literal(true),
  autoPost: z.literal(false),
  notes: z.array(z.string()).default([]),
});
export type ChannelDraft = z.infer<typeof ChannelDraftSchema>;

export const NewsletterEditionSchema = z.object({
  id: z.string().min(1),
  title: z.literal("SoftwareGlimpse Weekly"),
  weekLabel: z.string().min(1),
  generatedAt: IsoDateTimeSchema,
  sections: z.array(
    z.object({
      id: z.enum([
        "pricing_changes",
        "data_insight",
        "software_worth_watching",
        "comparison_of_the_week",
        "research_update",
      ]),
      heading: z.string().min(1),
      body: z.string().min(1),
      sourceURL: z.string().optional(),
      omittedReason: z.string().optional(),
    }),
  ),
  /** Sections with genuine content only */
  includedSectionIds: z.array(z.string()),
});
export type NewsletterEdition = z.infer<typeof NewsletterEditionSchema>;

export const DistributionTrackingStatusSchema = z.enum([
  "drafted",
  "approved",
  "posted_manually",
  "measured",
  "archived",
]);
export type DistributionTrackingStatus = z.infer<
  typeof DistributionTrackingStatusSchema
>;

export const DistributionMeasurementSchema = z.object({
  sessions: z.number().nonnegative().optional(),
  signups: z.number().nonnegative().optional(),
  affiliateClicks: z.number().nonnegative().optional(),
  engagement: z.number().nonnegative().optional(),
  /** Where numbers came from — never invent */
  sourceNotes: z.array(z.string()).default([]),
  recordedAt: IsoDateTimeSchema.optional(),
});
export type DistributionMeasurement = z.infer<
  typeof DistributionMeasurementSchema
>;

export const DistributionTrackingRecordSchema = z.object({
  id: z.string().min(1),
  campaignId: z.string().min(1),
  channel: DistributionChannelSchema.optional(),
  utmCampaign: z.string().min(1),
  trackedUrl: z.string().min(1),
  status: DistributionTrackingStatusSchema,
  measurement: DistributionMeasurementSchema.optional(),
  updatedAt: IsoDateTimeSchema,
  createdAt: IsoDateTimeSchema,
});
export type DistributionTrackingRecord = z.infer<
  typeof DistributionTrackingRecordSchema
>;
