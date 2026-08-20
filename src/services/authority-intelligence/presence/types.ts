/**
 * PresenceOpportunityAgent — directories & listings for visibility (not paid SEO links).
 */

import { z } from "zod";
import { IsoDateTimeSchema } from "@/domain/schemas/primitives";
import {
  OpportunityScoreBandSchema,
  ValueBandSchema,
} from "@/domain/schemas/authority-intelligence";

export const PRESENCE_AGENT = {
  id: "presence-opportunity-agent",
  label: "PresenceOpportunityAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
  submitsListings: false as const,
  requiresLiveWebSearch: true as const,
} as const;

export const PresenceKindSchema = z.enum([
  "REVIEW_DIRECTORY",
  "SAAS_DIRECTORY",
  "ALTERNATIVES_DIRECTORY",
  "LAUNCH_PLATFORM",
  "MARKETPLACE",
  "OTHER",
]);
export type PresenceKind = z.infer<typeof PresenceKindSchema>;

export const PresenceLiveHitSchema = z.object({
  url: z.string().url(),
  domain: z.string().min(1),
  organization: z.string().min(1),
  kind: PresenceKindSchema,
  opportunity: z.string().min(1),
  audience: z.string().min(1),
  visibilityValue: ValueBandSchema,
  seoLinkPrimary: z.boolean().default(false),
  costNotes: z.string().min(1),
  claimPath: z.string().min(1),
  whyWorthwhile: z.string().min(1),
  discoveryQuery: z.string().min(1),
  verifiedAt: IsoDateTimeSchema,
  pageSummary: z.string().min(1),
  provisionalDecision: z.enum(["accept", "reject"]),
  rejectReason: z.string().optional(),
});
export type PresenceLiveHit = z.infer<typeof PresenceLiveHitSchema>;

export const PresenceOpportunitySchema = z.object({
  id: z.string().min(1),
  priority: z.number().int().min(1).optional(),
  scoreBand: OpportunityScoreBandSchema,
  organization: z.string(),
  domain: z.string(),
  kind: PresenceKindSchema,
  opportunity: z.string(),
  audience: z.string(),
  visibilityValue: ValueBandSchema,
  costNotes: z.string(),
  claimPath: z.string(),
  whyWorthwhile: z.string(),
  sourceUrl: z.string().url(),
  verifiedAt: IsoDateTimeSchema,
});
export type PresenceOpportunity = z.infer<typeof PresenceOpportunitySchema>;

export const PresenceRejectSchema = z.object({
  id: z.string().min(1),
  organization: z.string(),
  reason: z.string(),
  sourceUrl: z.string(),
  notes: z.string().optional(),
});
export type PresenceReject = z.infer<typeof PresenceRejectSchema>;

export const PresenceReportSchema = z.object({
  version: z.string(),
  generatedAt: IsoDateTimeSchema,
  hitsInvestigated: z.number().int(),
  accepted: z.array(PresenceOpportunitySchema),
  rejected: z.array(PresenceRejectSchema),
  queriesRun: z.array(z.string()),
  limitations: z.array(z.string()),
});
export type PresenceReport = z.infer<typeof PresenceReportSchema>;
