/**
 * DigitalPROpportunityAgent types.
 * Identify reference-worthy research/assets journalists may want to cite.
 * Never invents statistics. Never sends pitches. Report only.
 */

import { z } from "zod";
import { IsoDateTimeSchema } from "@/domain/schemas/primitives";
import {
  OpportunityScoreBandSchema,
  ValueBandSchema,
} from "@/domain/schemas/authority-intelligence";

export const DIGITAL_PR_AGENT = {
  id: "digital-pr-opportunity-agent",
  label: "DigitalPROpportunityAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
  sendsOutreach: false as const,
  inventsStatistics: false as const,
  requiresLiveWebSearch: true as const,
} as const;

export const PrIdeaStatusSchema = z.enum([
  "ready",
  "near-ready",
  "needs-new-research",
  "deferred",
]);
export type PrIdeaStatus = z.infer<typeof PrIdeaStatusSchema>;

export const PrEffortSchema = z.enum(["S", "M", "L", "XL"]);
export type PrEffort = z.infer<typeof PrEffortSchema>;

export const LinkabilityDimensionsSchema = z.object({
  originality: ValueBandSchema,
  dataUniqueness: ValueBandSchema,
  newsworthiness: ValueBandSchema,
  timeliness: ValueBandSchema,
  visualPotential: ValueBandSchema,
  citationPotential: ValueBandSchema,
  audienceFit: ValueBandSchema,
  reproducibility: ValueBandSchema,
});
export type LinkabilityDimensions = z.infer<typeof LinkabilityDimensionsSchema>;

export const VisualAssetRecSchema = z.object({
  kind: z.enum([
    "chart",
    "interactive-calculator",
    "downloadable-dataset",
    "methodology",
    "visual-comparison",
    "embeddable-chart",
    "map",
    "benchmark-table",
  ]),
  description: z.string().min(1),
  embeddable: z.boolean().default(false),
  attributionRequired: z.boolean().default(true),
  /** Never require followed links as a condition for use */
  followLinkRequired: z.literal(false).default(false),
});
export type VisualAssetRec = z.infer<typeof VisualAssetRecSchema>;

export const PublicationMatchSchema = z.object({
  publication: z.string().min(1),
  url: z.string().url(),
  recentCoverageAngle: z.string().min(1),
  /** Only real named people from live verification — omit if unknown */
  journalistOrAuthor: z.string().optional(),
  verifiedAt: IsoDateTimeSchema,
  discoveryQuery: z.string().min(1),
});
export type PublicationMatch = z.infer<typeof PublicationMatchSchema>;

export const ExpertCommentaryChannelSchema = z.object({
  platform: z.string().min(1),
  url: z.string().url(),
  notes: z.string().min(1),
  costNotes: z.string().optional(),
  verifiedAt: IsoDateTimeSchema,
  discoveryQuery: z.string().min(1),
});
export type ExpertCommentaryChannel = z.infer<
  typeof ExpertCommentaryChannelSchema
>;

export const SeasonalHookSchema = z.object({
  hook: z.string().min(1),
  window: z.string().min(1),
  relatedPrIdeaIds: z.array(z.string()).default([]),
  sourceUrl: z.string().url().optional(),
  verifiedAt: IsoDateTimeSchema,
  notes: z.string().optional(),
});
export type SeasonalHook = z.infer<typeof SeasonalHookSchema>;

export const DataInventoryItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  pathOrSource: z.string().min(1),
  dimensions: z.array(z.string()).min(1),
  approximateScale: z.string().min(1),
  citeableAs: z.string().min(1),
  notCiteableAs: z.string().min(1),
});
export type DataInventoryItem = z.infer<typeof DataInventoryItemSchema>;

export const DigitalPrIdeaSchema = z.object({
  id: z.string().min(1),
  priority: z.number().int().min(1).optional(),
  title: z.string().min(1),
  summary: z.string().min(1),
  status: PrIdeaStatusSchema,
  scoreBand: OpportunityScoreBandSchema,
  scoreNormalized: z.number().int().min(0).max(100),
  linkability: LinkabilityDimensionsSchema,
  dataRequired: z.array(z.string()).min(1),
  existingDataAvailable: z.array(z.string()).min(1),
  newResearchNeeded: z.array(z.string()).default([]),
  dataInventoryIds: z.array(z.string()).default([]),
  targetAudiences: z.array(z.string()).min(1),
  potentialPublications: z.array(z.string()).min(1),
  publicationMatchIds: z.array(z.string()).default([]),
  timeliness: z.string().min(1),
  effort: PrEffortSchema,
  recommendedNextAction: z.string().min(1),
  landingPages: z.array(z.string()).default([]),
  visuals: z.array(VisualAssetRecSchema).default([]),
  inventsStatistics: z.literal(false),
  limitations: z.array(z.string()).default([]),
});
export type DigitalPrIdea = z.infer<typeof DigitalPrIdeaSchema>;

export const DigitalPrReportSchema = z.object({
  version: z.string(),
  generatedAt: IsoDateTimeSchema,
  topic: z.string(),
  liveSearchRequired: z.literal(true),
  inventsStatistics: z.literal(false),
  sendsOutreach: z.literal(false),
  dataInventory: z.array(DataInventoryItemSchema),
  ideas: z.array(DigitalPrIdeaSchema),
  publicationMatches: z.array(PublicationMatchSchema),
  expertCommentary: z.array(ExpertCommentaryChannelSchema),
  seasonalHooks: z.array(SeasonalHookSchema),
  deferredIdeas: z.array(
    z.object({
      title: z.string(),
      reason: z.string(),
    }),
  ),
  queriesRun: z.array(z.string()),
  limitations: z.array(z.string()),
});
export type DigitalPrReport = z.infer<typeof DigitalPrReportSchema>;
