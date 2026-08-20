/**
 * EarnedBacklinkOpportunityAgent — live-web earned / free backlink discovery.
 *
 * Requires approved external web/search capability (hits must be live-verified).
 * Does NOT invent opportunities, send outreach, or mutate production content.
 */

import { z } from "zod";
import { IsoDateTimeSchema } from "@/domain/schemas/primitives";
import {
  AuthorityOpportunityTypeSchema,
  DifficultyBandSchema,
  EffortBandSchema,
  LikelihoodBandSchema,
  OpportunityScoreBandSchema,
  ValueBandSchema,
} from "@/domain/schemas/authority-intelligence";

export const EARNED_BACKLINK_AGENT = {
  id: "earned-backlink-opportunity-agent",
  label: "EarnedBacklinkOpportunityAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
  sendsOutreach: false as const,
  requiresLiveWebSearch: true as const,
} as const;

export const CompetitorGapClassSchema = z.enum([
  "DIRECT_REPLACEMENT",
  "COMPLEMENTARY",
  "NOT_RELEVANT",
]);
export type CompetitorGapClass = z.infer<typeof CompetitorGapClassSchema>;

export const EarnedRejectReasonSchema = z.enum([
  "Irrelevant",
  "Spammy",
  "Paid link scheme",
  "Low quality",
  "No editorial value",
  "No actual submission route",
  "Outdated",
  "Vendor-locked competitor asset",
  "Direct competitor selling same artifact",
  "Own property / not third-party",
  "Insufficient live verification",
]);
export type EarnedRejectReason = z.infer<typeof EarnedRejectReasonSchema>;

/** Raw live-verified search hit (must come from real web search / fetch). */
export const LiveSearchHitSchema = z.object({
  url: z.string().url(),
  domain: z.string().min(1),
  organization: z.string().min(1),
  title: z.string().min(1),
  type: AuthorityOpportunityTypeSchema,
  discoveryQuery: z.string().min(1),
  verifiedAt: IsoDateTimeSchema,
  pageSummary: z.string().min(1),
  /** Honest fit narrative — required for accept */
  whyTheyMightLink: z.string().min(1),
  relevantSgPage: z.string().optional(),
  seoValue: ValueBandSchema,
  referralValue: ValueBandSchema,
  difficulty: DifficultyBandSchema,
  effort: EffortBandSchema,
  likelihood: LikelihoodBandSchema.default("medium"),
  contactPath: z.string().optional(),
  submissionPath: z.string().optional(),
  competitorGapClass: CompetitorGapClassSchema.optional(),
  competitorAssetUrl: z.string().optional(),
  /** Preliminary human/agent decision before scoring */
  provisionalDecision: z.enum(["accept", "reject"]),
  rejectReason: EarnedRejectReasonSchema.optional(),
  rejectNotes: z.string().optional(),
  evidenceNotes: z.array(z.string()).default([]),
});
export type LiveSearchHit = z.infer<typeof LiveSearchHitSchema>;

export const EarnedBacklinkOpportunitySchema = z.object({
  id: z.string().min(1),
  priority: z.number().int().min(1).optional(),
  scoreBand: OpportunityScoreBandSchema,
  scoreNormalized: z.number().int().min(0).max(100),
  site: z.string().min(1),
  domain: z.string().min(1),
  opportunityUrl: z.string().url(),
  opportunityTitle: z.string().min(1),
  type: AuthorityOpportunityTypeSchema,
  relevantSgPage: z.string().optional(),
  whyTheyMightLink: z.string().min(1),
  seoValue: ValueBandSchema,
  referralValue: ValueBandSchema,
  difficulty: DifficultyBandSchema,
  effort: EffortBandSchema,
  likelihood: LikelihoodBandSchema,
  contactPath: z.string().optional(),
  submissionPath: z.string().optional(),
  /** Absolute URL of the SG page to request a link to */
  targetPageUrl: z.string().url().optional(),
  targetPageName: z.string().optional(),
  /** Direct URL to open for submit/contribute/contact (usually the opportunity page) */
  submitOrContactUrl: z.string().url().optional(),
  /** Step-by-step how to submit or request */
  howToSubmitOrRequest: z.string().optional(),
  /** Human-ready ask / pitch (do not auto-send) */
  suggestedAsk: z.string().optional(),
  competitorGapClass: CompetitorGapClassSchema.optional(),
  discoveryQuery: z.string(),
  verifiedAt: IsoDateTimeSchema,
  status: z.enum(["qualified", "recommended", "needs-contact-path", "deferred"]),
  evidenceNotes: z.array(z.string()).default([]),
});
export type EarnedBacklinkOpportunity = z.infer<
  typeof EarnedBacklinkOpportunitySchema
>;

export const EarnedRejectedOpportunitySchema = z.object({
  id: z.string().min(1),
  site: z.string().min(1),
  domain: z.string().min(1),
  opportunityUrl: z.string(),
  opportunityTitle: z.string(),
  type: AuthorityOpportunityTypeSchema,
  reason: EarnedRejectReasonSchema,
  notes: z.string().optional(),
  discoveryQuery: z.string(),
  verifiedAt: IsoDateTimeSchema,
});
export type EarnedRejectedOpportunity = z.infer<
  typeof EarnedRejectedOpportunitySchema
>;

export const EarnedBacklinkReportSchema = z.object({
  version: z.string(),
  generatedAt: IsoDateTimeSchema,
  topic: z.string(),
  liveSearchRequired: z.literal(true),
  hitsInvestigated: z.number().int().min(0),
  accepted: z.array(EarnedBacklinkOpportunitySchema),
  rejected: z.array(EarnedRejectedOpportunitySchema),
  top50: z.array(EarnedBacklinkOpportunitySchema),
  queriesRun: z.array(z.string()),
  limitations: z.array(z.string()),
});
export type EarnedBacklinkReport = z.infer<typeof EarnedBacklinkReportSchema>;
