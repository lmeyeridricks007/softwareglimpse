/**
 * PaidPromotionOpportunityAgent types.
 * Paid placements for referral/brand/visibility — NOT paid SEO links.
 */

import { z } from "zod";
import { IsoDateTimeSchema } from "@/domain/schemas/primitives";
import {
  AuthorityOpportunityTypeSchema,
  ExpectedLinkTreatmentSchema,
  OpportunityScoreBandSchema,
  ValueBandSchema,
} from "@/domain/schemas/authority-intelligence";

export const PAID_PROMOTION_AGENT = {
  id: "paid-promotion-opportunity-agent",
  label: "PaidPromotionOpportunityAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
  sendsOutreach: false as const,
  purchasesPlacements: false as const,
  requiresLiveWebSearch: true as const,
} as const;

export const LINK_SCHEME_AVOID_LABEL = "AVOID — LINK SCHEME RISK" as const;

export const BudgetTierSchema = z.enum([
  "€0",
  "€1–250",
  "€250–1,000",
  "€1,000–5,000",
  "€5,000+",
  "PRICE UNKNOWN",
]);
export type BudgetTier = z.infer<typeof BudgetTierSchema>;

export const PaidAvoidReasonSchema = z.enum([
  "AVOID — LINK SCHEME RISK",
  "Irrelevant",
  "Low quality",
  "Paid SEO link primary",
  "Wrong product fit",
  "No public sponsorship path",
]);
export type PaidAvoidReason = z.infer<typeof PaidAvoidReasonSchema>;

export const PaidLiveHitSchema = z.object({
  url: z.string().url(),
  domain: z.string().min(1),
  organization: z.string().min(1),
  channelName: z.string().min(1),
  audience: z.string().min(1),
  opportunity: z.string().min(1),
  type: AuthorityOpportunityTypeSchema,
  discoveryQuery: z.string().min(1),
  verifiedAt: IsoDateTimeSchema,
  pageSummary: z.string().min(1),
  whyWorthwhile: z.string().min(1),
  expectedLinkTreatment: ExpectedLinkTreatmentSchema,
  seoLinkValue: z.enum(["none", "low", "unknown"]),
  referralPotential: ValueBandSchema,
  brandValue: ValueBandSchema,
  leadValue: ValueBandSchema,
  audienceFit: ValueBandSchema,
  estimatedReach: z.string().optional(),
  costDisplay: z.string().min(1),
  budgetTier: BudgetTierSchema,
  costNotes: z.string().optional(),
  format: z.string().optional(),
  availability: z.string().optional(),
  targetSgPage: z.string().optional(),
  provisionalDecision: z.enum(["accept", "avoid"]),
  avoidReason: PaidAvoidReasonSchema.optional(),
  avoidNotes: z.string().optional(),
  evidenceNotes: z.array(z.string()).default([]),
});
export type PaidLiveHit = z.infer<typeof PaidLiveHitSchema>;

export const PaidPromotionOpportunitySchema = z.object({
  id: z.string().min(1),
  priority: z.number().int().min(1).optional(),
  scoreBand: OpportunityScoreBandSchema,
  scoreNormalized: z.number().int().min(0).max(100),
  siteChannel: z.string().min(1),
  domain: z.string().min(1),
  audience: z.string().min(1),
  opportunity: z.string().min(1),
  type: AuthorityOpportunityTypeSchema,
  costDisplay: z.string(),
  budgetTier: BudgetTierSchema,
  expectedLinkTreatment: ExpectedLinkTreatmentSchema,
  seoLinkValue: z.enum(["none", "low", "unknown"]),
  referralPotential: ValueBandSchema,
  brandValue: ValueBandSchema,
  leadValue: ValueBandSchema,
  audienceFit: ValueBandSchema,
  whyWorthwhile: z.string(),
  sourceUrl: z.string().url(),
  verifiedAt: IsoDateTimeSchema,
  targetSgPage: z.string().optional(),
  estimatedReach: z.string().optional(),
  format: z.string().optional(),
  status: z.enum(["recommended", "test-candidate", "deferred"]),
});
export type PaidPromotionOpportunity = z.infer<
  typeof PaidPromotionOpportunitySchema
>;

export const PaidAvoidOpportunitySchema = z.object({
  id: z.string().min(1),
  siteChannel: z.string(),
  domain: z.string(),
  opportunity: z.string(),
  sourceUrl: z.string(),
  reason: PaidAvoidReasonSchema,
  notes: z.string().optional(),
  verifiedAt: IsoDateTimeSchema,
});
export type PaidAvoidOpportunity = z.infer<typeof PaidAvoidOpportunitySchema>;

export const PaidExperimentSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  channel: z.string().min(1),
  goal: z.string().min(1),
  targetSgPage: z.string().min(1),
  budgetTier: BudgetTierSchema,
  estimatedCost: z.string(),
  measure: z.array(z.string()).min(1),
  relatedOpportunityIds: z.array(z.string()).default([]),
});
export type PaidExperiment = z.infer<typeof PaidExperimentSchema>;

export const PaidPromotionReportSchema = z.object({
  version: z.string(),
  generatedAt: IsoDateTimeSchema,
  topic: z.string(),
  liveSearchRequired: z.literal(true),
  purchasesPlacements: z.literal(false),
  hitsInvestigated: z.number().int(),
  accepted: z.array(PaidPromotionOpportunitySchema),
  avoided: z.array(PaidAvoidOpportunitySchema),
  byBudgetTier: z.record(z.string(), z.array(PaidPromotionOpportunitySchema)),
  experiments: z.array(PaidExperimentSchema),
  queriesRun: z.array(z.string()),
  limitations: z.array(z.string()),
});
export type PaidPromotionReport = z.infer<typeof PaidPromotionReportSchema>;
