/**
 * PartnershipOpportunityAgent types.
 * Genuine collaboration opportunities — not mass link exchange.
 * Report only; never contacts partners or misrepresents SG as an SI.
 */

import { z } from "zod";
import { IsoDateTimeSchema } from "@/domain/schemas/primitives";
import {
  OpportunityScoreBandSchema,
  ValueBandSchema,
} from "@/domain/schemas/authority-intelligence";

export const PARTNERSHIP_AGENT = {
  id: "partnership-opportunity-agent",
  label: "PartnershipOpportunityAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
  sendsOutreach: false as const,
  contactsPartners: false as const,
  requiresLiveWebSearch: true as const,
  misrepresentsAsImplementationPartner: false as const,
} as const;

export const LINK_EXCHANGE_REJECT_LABEL =
  "REJECT — MASS LINK EXCHANGE" as const;

export const PartnerTypeSchema = z.enum([
  "CRM_CONSULTANT",
  "CRM_IMPLEMENTATION_PARTNER",
  "REVOPS_CONSULTANCY",
  "SALES_CONSULTANCY",
  "DIGITAL_TRANSFORMATION_FIRM",
  "SAAS_CONSULTANT",
  "IT_ADVISORY",
  "BUSINESS_COACH",
  "STARTUP_ACCELERATOR",
  "SMB_ASSOCIATION",
  "TRAINING_PROVIDER",
  "TECHNOLOGY_COMMUNITY",
  "SOFTWARE_VENDOR",
  "INTEGRATION_PROVIDER",
  "INDUSTRY_ALLIANCE",
]);
export type PartnerType = z.infer<typeof PartnerTypeSchema>;

export const CollaborationModelSchema = z.enum([
  "CO_AUTHORED_GUIDE",
  "JOINT_WEBINAR",
  "EXPERT_INTERVIEW",
  "BENCHMARK_CONTRIBUTION",
  "TOOL_RESOURCE_SHARING",
  "IMPLEMENTATION_CHECKLIST_COLLAB",
  "DIRECTORY_RESOURCE_INCLUSION",
  "NEWSLETTER_EXCHANGE",
  "PODCAST_APPEARANCE",
  "DATA_PARTNERSHIP",
  "INDUSTRY_GUIDE_CONTRIBUTION",
  "EXPERT_QUOTE",
  "RESEARCH_CONTRIBUTION",
  "CONTENT_COLLABORATION",
  "WORKSHOP_HOSTING",
  "VENDOR_ECOSYSTEM_CONTENT",
]);
export type CollaborationModel = z.infer<typeof CollaborationModelSchema>;

export const DifficultySchema = z.enum([
  "low",
  "medium",
  "high",
  "very-high",
]);
export type Difficulty = z.infer<typeof DifficultySchema>;

export const PartnershipLiveHitSchema = z.object({
  url: z.string().url(),
  domain: z.string().min(1),
  organization: z.string().min(1),
  partnerType: PartnerTypeSchema,
  whyRelevant: z.string().min(1),
  collaborationIdea: z.string().min(1),
  collaborationModels: z.array(CollaborationModelSchema).min(1),
  whatWeOffer: z.string().min(1),
  whatTheyOffer: z.string().min(1),
  mutualValue: z.string().min(1),
  potentialLink: z.string().min(1),
  visibilityValue: ValueBandSchema,
  difficulty: DifficultySchema,
  contactPath: z.string().min(1),
  targetSgAssets: z.array(z.string()).default([]),
  discoveryQuery: z.string().min(1),
  verifiedAt: IsoDateTimeSchema,
  pageSummary: z.string().min(1),
  vendorEcosystemNotes: z.string().optional(),
  /** Never claim SG is an SI / certified implementation partner unless true */
  claimsImplementationPartnerStatus: z.boolean().default(false),
  provisionalDecision: z.enum(["accept", "reject"]),
  rejectReason: z
    .enum([
      "REJECT — MASS LINK EXCHANGE",
      "No mutual value",
      "Misrepresentation risk (SI/partner claim)",
      "Irrelevant",
      "Low quality",
      "No public collaboration path",
    ])
    .optional(),
  rejectNotes: z.string().optional(),
  evidenceNotes: z.array(z.string()).default([]),
});
export type PartnershipLiveHit = z.infer<typeof PartnershipLiveHitSchema>;

export const PartnershipOpportunitySchema = z.object({
  id: z.string().min(1),
  priority: z.number().int().min(1).optional(),
  scoreBand: OpportunityScoreBandSchema,
  scoreNormalized: z.number().int().min(0).max(100),
  organization: z.string().min(1),
  domain: z.string().min(1),
  partnerType: PartnerTypeSchema,
  whyRelevant: z.string().min(1),
  collaborationIdea: z.string().min(1),
  collaborationModels: z.array(CollaborationModelSchema),
  whatWeOffer: z.string().min(1),
  whatTheyOffer: z.string().min(1),
  mutualValue: z.string().min(1),
  potentialLink: z.string().min(1),
  visibilityValue: ValueBandSchema,
  difficulty: DifficultySchema,
  contactPath: z.string().min(1),
  sourceUrl: z.string().url(),
  verifiedAt: IsoDateTimeSchema,
  targetSgAssets: z.array(z.string()).default([]),
  vendorEcosystemNotes: z.string().optional(),
  status: z.enum(["recommended", "explore", "deferred"]),
});
export type PartnershipOpportunity = z.infer<
  typeof PartnershipOpportunitySchema
>;

export const PartnershipRejectSchema = z.object({
  id: z.string().min(1),
  organization: z.string(),
  domain: z.string(),
  opportunity: z.string(),
  sourceUrl: z.string(),
  reason: z.string(),
  notes: z.string().optional(),
  verifiedAt: IsoDateTimeSchema,
});
export type PartnershipReject = z.infer<typeof PartnershipRejectSchema>;

export const PartnershipReportSchema = z.object({
  version: z.string(),
  generatedAt: IsoDateTimeSchema,
  topic: z.string(),
  liveSearchRequired: z.literal(true),
  contactsPartners: z.literal(false),
  hitsInvestigated: z.number().int(),
  accepted: z.array(PartnershipOpportunitySchema),
  rejected: z.array(PartnershipRejectSchema),
  byPartnerType: z.record(z.string(), z.array(PartnershipOpportunitySchema)),
  queriesRun: z.array(z.string()),
  limitations: z.array(z.string()),
});
export type PartnershipReport = z.infer<typeof PartnershipReportSchema>;
