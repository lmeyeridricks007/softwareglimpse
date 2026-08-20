/**
 * ContentPromotionOpportunityAgent types.
 * Realistic distribution plans for SG assets — not backlink-only.
 * Report only; never posts; community-safe.
 */

import { z } from "zod";
import { IsoDateTimeSchema } from "@/domain/schemas/primitives";
import {
  OpportunityScoreBandSchema,
  ValueBandSchema,
} from "@/domain/schemas/authority-intelligence";

export const CONTENT_PROMOTION_AGENT = {
  id: "content-promotion-opportunity-agent",
  label: "ContentPromotionOpportunityAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
  postsToChannels: false as const,
  generatesAssets: false as const,
  requiresLiveWebSearch: true as const,
} as const;

export const COMMUNITY_UNSAFE_REJECT =
  "REJECT — COMMUNITY UNSAFE" as const;

export const PromotionChannelKindSchema = z.enum([
  "LINKEDIN",
  "REDDIT",
  "PROFESSIONAL_COMMUNITY",
  "SLACK_COMMUNITY",
  "DISCORD_COMMUNITY",
  "NEWSLETTER",
  "PODCAST",
  "YOUTUBE",
  "INDUSTRY_FORUM",
  "QA_PLATFORM",
  "FOUNDER_COMMUNITY",
  "REVOPS_COMMUNITY",
  "SALES_COMMUNITY",
  "SAAS_COMMUNITY",
  "PRODUCT_LAUNCH_PLATFORM",
  "EMAIL_NEWSLETTER_OWNED",
  "VENDOR_ECOSYSTEM",
  "EVENT",
  "WEBINAR",
  "PARTNERSHIP",
  "DIGITAL_PR",
  "CONSUMER_SOCIAL",
]);
export type PromotionChannelKind = z.infer<typeof PromotionChannelKindSchema>;

export const ChannelFitSchema = z.enum(["strong", "good", "weak", "avoid"]);
export type ChannelFit = z.infer<typeof ChannelFitSchema>;

export const PaidFreeSchema = z.enum(["free", "paid", "mixed"]);
export type PaidFree = z.infer<typeof PaidFreeSchema>;

export const EffortSchema = z.enum(["S", "M", "L", "XL"]);
export type Effort = z.infer<typeof EffortSchema>;

export const RepurposingKindSchema = z.enum([
  "linkedin-carousel",
  "short-video",
  "diagram",
  "data-snippet",
  "newsletter-piece",
  "reddit-discussion",
  "podcast-talking-point",
  "downloadable-checklist",
  "comparison-graphic",
  "webinar-outline",
  "thread",
]);
export type RepurposingKind = z.infer<typeof RepurposingKindSchema>;

export const PromotionChannelSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  kind: PromotionChannelKindSchema,
  url: z.string().url().optional(),
  audience: z.string().min(1),
  notes: z.string().min(1),
  defaultFit: ChannelFitSchema,
  paidFree: PaidFreeSchema,
  communityRules: z.string().optional(),
  verifiedAt: IsoDateTimeSchema.optional(),
  discoveryQuery: z.string().optional(),
});
export type PromotionChannel = z.infer<typeof PromotionChannelSchema>;

export const PriorityAssetSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  path: z.string().min(1),
  kind: z.enum(["tool", "resource", "guide", "hub"]),
  priorityTier: z.enum(["P0", "P1", "P2"]),
  whyPriority: z.string().min(1),
  audienceHints: z.array(z.string()).default([]),
  inputSignals: z.array(z.string()).default([]),
});
export type PriorityAsset = z.infer<typeof PriorityAssetSchema>;

export const PromotionPlanSchema = z.object({
  id: z.string().min(1),
  priority: z.number().int().min(1).optional(),
  scoreBand: OpportunityScoreBandSchema,
  assetId: z.string().min(1),
  assetName: z.string().min(1),
  assetPath: z.string().min(1),
  audience: z.string().min(1),
  primaryChannels: z.array(z.string()).min(1),
  weakChannels: z.array(z.string()).default([]),
  promotionAngle: z.string().min(1),
  badAngleExample: z.string().optional(),
  repurposingIdeas: z.array(RepurposingKindSchema).min(1),
  expectedOutcome: z.string().min(1),
  effort: EffortSchema,
  paidFree: PaidFreeSchema,
  measurement: z.array(z.string()).min(1),
  relatedPartnerships: z.array(z.string()).default([]),
  relatedPaidTests: z.array(z.string()).default([]),
  relatedPrIdeas: z.array(z.string()).default([]),
  communitySafetyNotes: z.string().optional(),
});
export type PromotionPlan = z.infer<typeof PromotionPlanSchema>;

export const ToolLaunchPlanSchema = z.object({
  id: z.string().min(1),
  toolSlug: z.string().min(1),
  toolName: z.string().min(1),
  toolPath: z.string().min(1),
  launchNarrative: z.string().min(1),
  channels: z.array(z.string()).min(1),
  sequence: z.array(z.string()).min(1),
  productHuntFit: z.enum(["yes", "maybe", "no"]),
  productHuntNotes: z.string().optional(),
  effort: EffortSchema,
  measurement: z.array(z.string()).min(1),
});
export type ToolLaunchPlan = z.infer<typeof ToolLaunchPlanSchema>;

export const PromotionRejectSchema = z.object({
  id: z.string().min(1),
  tactic: z.string().min(1),
  reason: z.string().min(1),
  notes: z.string().optional(),
});
export type PromotionReject = z.infer<typeof PromotionRejectSchema>;

export const ConsumedInputsSchema = z.object({
  contentMap: z.string().optional(),
  rankingOpportunities: z.string().optional(),
  contentQuality: z.string().optional(),
  earnedBacklinks: z.string().optional(),
  paidPromotion: z.string().optional(),
  digitalPr: z.string().optional(),
  partnerships: z.string().optional(),
  notes: z.array(z.string()).default([]),
});
export type ConsumedInputs = z.infer<typeof ConsumedInputsSchema>;

export const ContentPromotionReportSchema = z.object({
  version: z.string(),
  generatedAt: IsoDateTimeSchema,
  topic: z.string(),
  postsToChannels: z.literal(false),
  generatesAssets: z.literal(false),
  consumedInputs: ConsumedInputsSchema,
  channelsCatalogued: z.number().int(),
  plans: z.array(PromotionPlanSchema),
  launchPlans: z.array(ToolLaunchPlanSchema),
  rejectedTactics: z.array(PromotionRejectSchema),
  queriesRun: z.array(z.string()),
  limitations: z.array(z.string()),
});
export type ContentPromotionReport = z.infer<
  typeof ContentPromotionReportSchema
>;
