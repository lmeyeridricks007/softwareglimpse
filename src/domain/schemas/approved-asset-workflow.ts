import { z } from "zod";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";
import {
  AssetRecommendationActionSchema,
  AssetTypeSchema,
  MediaFormatSchema,
  OfficialSourceVerificationResultSchema,
  UsageRightsStatusSchema,
} from "./asset-discovery";
import {
  OfficialSourceKindSchema,
  ResearchMediaPlacementSchema,
  ResearchMediaProviderSchema,
} from "./product-media";

/**
 * Approved Asset Workflow — discovery ≠ approval.
 * Converts selected DiscoveredAsset recommendations into canonical
 * ResearchMedia / ResearchSource only after explicit editorial gates.
 * Never auto-imports the discovery corpus.
 */

export const APPROVED_ASSET_WORKFLOW_VERSION = "1.0.0";

/**
 * Editorial approval lifecycle (distinct from ResearchMedia.status mapping).
 *
 * DISCOVERED → SOURCE VERIFIED → RELEVANCE REVIEWED → USAGE REVIEWED
 *   → MAPPED → EDITORIALLY APPROVED → ACTIVE
 */
export const AssetApprovalLifecycleStageSchema = z.enum([
  "DISCOVERED",
  "SOURCE_VERIFIED",
  "RELEVANCE_REVIEWED",
  "USAGE_REVIEWED",
  "MAPPED",
  "EDITORIALLY_APPROVED",
  "ACTIVE",
  "REJECTED",
]);

export type AssetApprovalLifecycleStage = z.infer<
  typeof AssetApprovalLifecycleStageSchema
>;

/**
 * Post-approval usage tracking — tells future audits whether a
 * recommendation was actioned on pages.
 */
export const AssetUsageStateSchema = z.enum([
  "approved",
  "active",
  "embedded",
  "linked",
  "not-used",
]);

export type AssetUsageState = z.infer<typeof AssetUsageStateSchema>;

export const AssetPlacementRecommendationSchema = z.object({
  id: z.string().min(1),
  /** Canonical ResearchMedia id once imported; optional while candidate-only. */
  mediaId: z.string().min(1).optional(),
  candidateId: z.string().min(1),
  pageRoute: z.string().min(1),
  pageType: z.string().min(1),
  sectionId: z.string().min(1),
  sectionTitle: z.string().min(1),
  subsection: z.string().min(1).optional(),
  /** High-level ResearchMedia placement bucket when applicable. */
  mediaPlacement: ResearchMediaPlacementSchema.optional(),
  recommendedUse: AssetRecommendationActionSchema,
  reason: z.string().min(1),
  status: z
    .enum(["recommended", "applied", "rejected", "superseded"])
    .default("recommended"),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema.optional(),
});

export type AssetPlacementRecommendation = z.infer<
  typeof AssetPlacementRecommendationSchema
>;

export const AssetEntityMappingSchema = z.object({
  productIds: z.array(SlugSchema).default([]),
  featureIds: z.array(z.string().min(1)).default([]),
  capabilityIds: z.array(z.string().min(1)).default([]),
  requirementIds: z.array(z.string().min(1)).default([]),
  useCaseIds: z.array(SlugSchema).default([]),
  industryIds: z.array(SlugSchema).default([]),
  guideIds: z.array(SlugSchema).default([]),
});

export type AssetEntityMapping = z.infer<typeof AssetEntityMappingSchema>;

/**
 * Approval-queue candidate. Lives outside enrichment until import.
 * Discovery reports feed this queue — they do not write ResearchMedia.
 */
export const ApprovedAssetCandidateSchema = z.object({
  id: z.string().min(1),
  workflowVersion: z.string().min(1).default(APPROVED_ASSET_WORKFLOW_VERSION),
  /** Originating DiscoveredAsset / software recommendation id when known. */
  discoveredAssetId: z.string().min(1).optional(),
  opportunityId: z.string().min(1).optional(),
  title: z.string().min(1),
  sourceUrl: z.string().url(),
  canonicalSourceUrl: z.string().url().optional(),
  assetType: AssetTypeSchema,
  mediaFormat: MediaFormatSchema,
  provider: ResearchMediaProviderSchema.optional(),
  providerId: z.string().min(1).optional(),
  sourceOrganization: z.string().min(1).optional(),
  channelName: z.string().min(1).optional(),
  stage: AssetApprovalLifecycleStageSchema.default("DISCOVERED"),
  usageState: AssetUsageStateSchema.default("not-used"),
  /** True only after SOURCE_VERIFIED gate. */
  officialSource: z.boolean().default(false),
  officialSourceKind: OfficialSourceKindSchema.optional(),
  sourceVerification: OfficialSourceVerificationResultSchema.optional(),
  relevanceNotes: z.string().optional(),
  relevancePassed: z.boolean().optional(),
  usageRightsStatus: UsageRightsStatusSchema.optional(),
  usageRecommendation: AssetRecommendationActionSchema.optional(),
  usageReviewNotes: z.string().optional(),
  mapping: AssetEntityMappingSchema.default({}),
  whatThisShows: z.array(z.string().min(1)).default([]),
  limitations: z.array(z.string().min(1)).default([]),
  editorialCommentary: z.string().optional(),
  /** Set when import reused an existing ResearchMedia record. */
  reusedMediaId: z.string().min(1).optional(),
  /** Set when import created/updated ResearchMedia. */
  importedMediaId: z.string().min(1).optional(),
  /** Set when import created/updated ResearchSource (non-video). */
  importedSourceId: z.string().min(1).optional(),
  placementIds: z.array(z.string().min(1)).default([]),
  rejectedReason: z.string().optional(),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
  stageHistory: z
    .array(
      z.object({
        stage: AssetApprovalLifecycleStageSchema,
        at: IsoDateTimeSchema,
        note: z.string().optional(),
        actor: z.string().optional(),
      }),
    )
    .default([]),
});

export type ApprovedAssetCandidate = z.infer<
  typeof ApprovedAssetCandidateSchema
>;

export const ApprovedAssetImportResultSchema = z.object({
  ok: z.boolean(),
  candidateId: z.string().min(1),
  action: z.enum([
    "created-media",
    "updated-media",
    "reused-media",
    "created-source",
    "updated-source",
    "reused-source",
    "blocked",
    "dry-run",
  ]),
  mediaId: z.string().optional(),
  sourceId: z.string().optional(),
  duplicateOfMediaId: z.string().optional(),
  message: z.string().min(1),
  persisted: z.boolean().default(false),
  activated: z.boolean().default(false),
});

export type ApprovedAssetImportResult = z.infer<
  typeof ApprovedAssetImportResultSchema
>;
