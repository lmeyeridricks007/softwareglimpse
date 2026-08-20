import { z } from "zod";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";

/**
 * Official Asset Discovery — recommendations only.
 * Does not publish, download, rehost, or mutate ResearchMedia / page content.
 * Video candidates may later map into ResearchMedia via the existing
 * feature/capability/use-case/requirement/industry media research pipelines.
 */

export const ASSET_DISCOVERY_VERSION = "1.0.0";

/** Canonical asset taxonomy (discovery recommendations). */
export const AssetTypeSchema = z.enum([
  "official-product-video",
  "official-feature-demo",
  "official-workflow-demo",
  "official-tutorial",
  "official-webinar",
  "official-customer-story",
  "official-screenshot",
  "official-ui-image",
  "official-product-tour",
  "official-diagram",
  "official-architecture-diagram",
  "official-workflow-diagram",
  "official-pricing-visual",
  "official-integration-diagram",
  "official-logo",
  "official-brand-asset",
  "official-pdf-guide",
  "authoritative-reference-visual",
  "softwareglimpse-original-visual-opportunity",
]);

export type AssetType = z.infer<typeof AssetTypeSchema>;

export const MediaFormatSchema = z.enum([
  "video",
  "image",
  "diagram",
  "pdf",
  "interactive",
  "page",
  "embed",
]);

export type MediaFormat = z.infer<typeof MediaFormatSchema>;

/**
 * Source authority for asset discovery.
 * Prefer primary vendor / government / standards over secondary.
 * Distinct from ResearchSourceType — maps where useful.
 */
export const AssetSourceTypeSchema = z.enum([
  "vendor-official-site",
  "vendor-documentation",
  "vendor-help-center",
  "vendor-youtube",
  "vendor-vimeo",
  "vendor-academy",
  "vendor-webinar",
  "vendor-trust-center",
  "vendor-pricing",
  "vendor-brand-center",
  "vendor-customer-story",
  "government",
  "regulator",
  "standards-body",
  "authoritative-primary",
  "secondary",
]);

export type AssetSourceType = z.infer<typeof AssetSourceTypeSchema>;

export const AssetNeedTypeSchema = z.enum([
  "overview-demo",
  "feature-demo",
  "workflow-demo",
  "setup-tutorial",
  "implementation-guide",
  "reporting-visual",
  "pricing-evidence",
  "integration-diagram",
  "architecture-diagram",
  "workflow-diagram",
  "ui-screenshot",
  "brand-logo",
  "customer-story",
  "webinar",
  "pdf-guide",
  "authoritative-reference",
  "teaching-diagram",
  "product-tour",
]);

export type AssetNeedType = z.infer<typeof AssetNeedTypeSchema>;

export const AssetImportanceSchema = z.enum([
  "critical",
  "high",
  "medium",
  "low",
]);

export type AssetImportance = z.infer<typeof AssetImportanceSchema>;

export const AssetPurposeSchema = z.enum([
  "explain",
  "demonstrate",
  "compare",
  "evidence",
  "trust",
  "navigation",
  "conversion",
]);

export type AssetPurpose = z.infer<typeof AssetPurposeSchema>;

export const AssetOpportunityStatusSchema = z.enum([
  "open",
  "searching",
  "candidate-found",
  "recommended",
  "deferred",
  "satisfied-existing",
  "closed",
]);

export type AssetOpportunityStatus = z.infer<
  typeof AssetOpportunityStatusSchema
>;

export const AssetDiscoveryPageTypeSchema = z.enum([
  "product-review",
  "guide",
  "article",
  "comparison",
  "best",
  "product-guide",
  "industry",
  "use-case",
  "capability",
  "requirement",
  "feature",
  "implementation-guide",
  "resource",
]);

export type AssetDiscoveryPageType = z.infer<
  typeof AssetDiscoveryPageTypeSchema
>;

export const AssetOpportunitySchema = z.object({
  id: z.string().min(1),
  pageId: z.string().min(1),
  route: z.string().min(1),
  pageType: AssetDiscoveryPageTypeSchema,
  sectionId: z.string().min(1).optional(),
  sectionTitle: z.string().min(1).optional(),
  productId: SlugSchema.optional(),
  industryId: SlugSchema.optional(),
  useCaseId: SlugSchema.optional(),
  capabilityId: z.string().min(1).optional(),
  requirementId: z.string().min(1).optional(),
  featureId: z.string().min(1).optional(),
  needType: AssetNeedTypeSchema,
  description: z.string().min(1),
  preferredAssetTypes: z.array(AssetTypeSchema).min(1),
  importance: AssetImportanceSchema.default("medium"),
  purpose: AssetPurposeSchema.default("explain"),
  status: AssetOpportunityStatusSchema.default("open"),
  /** Existing ResearchMedia / screenshot / figure ids already covering this need. */
  existingAssetIds: z.array(z.string().min(1)).default([]),
});

export type AssetOpportunity = z.infer<typeof AssetOpportunitySchema>;

export const UsageRightsStatusSchema = z.enum([
  "safe-to-embed",
  "safe-to-link",
  "potentially-reusable-with-permission",
  "better-create-original-visual",
  "usage-rights-unclear-link-only",
  "do-not-use",
]);

export type UsageRightsStatus = z.infer<typeof UsageRightsStatusSchema>;

export const AssetRecommendationActionSchema = z.enum([
  "embed",
  "link",
  "cite",
  "use-as-evidence",
  "create-original-visual-based-on-source",
  "do-not-use",
]);

export type AssetRecommendationAction = z.infer<
  typeof AssetRecommendationActionSchema
>;

export const FreshnessStatusSchema = z.enum([
  "fresh",
  "acceptable",
  "stale",
  "unknown",
]);

export type FreshnessStatus = z.infer<typeof FreshnessStatusSchema>;

/** 0–5 integer dimension scores for asset usefulness. */
export const AssetQualityScoreSchema = z.object({
  relevance: z.number().int().min(0).max(5),
  specificity: z.number().int().min(0).max(5),
  officialSourceConfidence: z.number().int().min(0).max(5),
  freshness: z.number().int().min(0).max(5),
  visualClarity: z.number().int().min(0).max(5),
  buyerUsefulness: z.number().int().min(0).max(5),
  evidenceUsefulness: z.number().int().min(0).max(5),
  embeddingUsability: z.number().int().min(0).max(5),
  /** Weighted 0–100 integer — never fabricated decimals. */
  overall: z.number().int().min(0).max(100),
});

export type AssetQualityScore = z.infer<typeof AssetQualityScoreSchema>;

/**
 * Discovered asset recommendation.
 * Prefer bridging into ResearchMedia for videos rather than duplicating storage.
 * Never invent sourceUrl — only record URLs from search results, registry, or
 * researcher-supplied candidates.
 */
export const DiscoveredAssetSchema = z.object({
  id: z.string().min(1),
  opportunityId: z.string().min(1).optional(),
  title: z.string().min(1),
  sourceUrl: z.string().url(),
  canonicalSourceUrl: z.string().url().optional(),
  assetType: AssetTypeSchema,
  mediaFormat: MediaFormatSchema,
  sourceType: AssetSourceTypeSchema,
  sourceOrganization: z.string().min(1).optional(),
  /**
   * True only after verification against vendor registry / channel evidence.
   * Never set true from title/snippet alone.
   */
  officialSource: z.boolean().default(false),
  officialVerificationNotes: z.array(z.string().min(1)).default([]),
  productIds: z.array(SlugSchema).default([]),
  featureIds: z.array(z.string().min(1)).default([]),
  capabilityIds: z.array(z.string().min(1)).default([]),
  requirementIds: z.array(z.string().min(1)).default([]),
  useCaseIds: z.array(SlugSchema).default([]),
  industryIds: z.array(SlugSchema).default([]),
  whatItShows: z.array(z.string().min(1)).default([]),
  potentialUses: z.array(z.string().min(1)).default([]),
  embedAvailable: z.boolean().optional(),
  directLinkAvailable: z.boolean().default(true),
  usageRightsStatus: UsageRightsStatusSchema.default(
    "usage-rights-unclear-link-only",
  ),
  publishedAt: IsoDateTimeSchema.optional(),
  lastVerifiedAt: IsoDateTimeSchema.optional(),
  freshnessStatus: FreshnessStatusSchema.default("unknown"),
  qualityAssessment: AssetQualityScoreSchema.optional(),
  recommendation: AssetRecommendationActionSchema,
  reason: z.string().min(1),
  /**
   * When true, a ResearchMedia pipeline record may be created later —
   * this framework never auto-persists enrichment.
   */
  researchMediaBridgeSuggested: z.boolean().default(false),
});

export type DiscoveredAsset = z.infer<typeof DiscoveredAssetSchema>;

export const AssetSearchTaskSchema = z.object({
  id: z.string().min(1),
  opportunityId: z.string().min(1),
  query: z.string().min(1),
  preferredSourceTypes: z.array(AssetSourceTypeSchema).default([]),
  preferredDomains: z.array(z.string().min(1)).default([]),
  siteFilter: z.string().min(1).optional(),
  notes: z.string().optional(),
});

export type AssetSearchTask = z.infer<typeof AssetSearchTaskSchema>;

/**
 * Canonical vendor official-source metadata for discovery / verification.
 * Prefer this over hardcoding domains inside page-specific agents.
 */
export const OfficialVideoChannelSchema = z.object({
  provider: z.enum(["youtube", "vimeo"]),
  /** Channel handle, custom URL slug, or numeric id when known. */
  channelId: z.string().min(1).optional(),
  channelName: z.string().min(1),
  channelUrl: z.string().url().optional(),
  verified: z.boolean().default(false),
  notes: z.string().optional(),
});

export type OfficialVideoChannel = z.infer<typeof OfficialVideoChannelSchema>;

export const VendorOfficialSourceRegistryEntrySchema = z.object({
  productSlug: SlugSchema,
  productName: z.string().min(1),
  organizationName: z.string().min(1),
  officialDomains: z.array(z.string().min(1)).min(1),
  documentationDomains: z.array(z.string().min(1)).default([]),
  helpCenterDomains: z.array(z.string().min(1)).default([]),
  academyDomains: z.array(z.string().min(1)).default([]),
  trustCenterDomains: z.array(z.string().min(1)).default([]),
  brandCenterUrls: z.array(z.string().url()).default([]),
  pricingPaths: z.array(z.string().min(1)).default([]),
  officialVideoChannels: z.array(OfficialVideoChannelSchema).default([]),
  notes: z.array(z.string().min(1)).default([]),
});

export type VendorOfficialSourceRegistryEntry = z.infer<
  typeof VendorOfficialSourceRegistryEntrySchema
>;

export const OfficialSourceVerificationResultSchema = z.object({
  sourceUrl: z.string().url(),
  officialSource: z.boolean(),
  sourceType: AssetSourceTypeSchema,
  matchedDomain: z.string().optional(),
  matchedChannel: z.string().optional(),
  confidence: z.enum(["high", "medium", "low", "none"]),
  checks: z.array(
    z.object({
      id: z.string().min(1),
      passed: z.boolean(),
      detail: z.string().min(1),
    }),
  ),
  notes: z.array(z.string().min(1)).default([]),
});

export type OfficialSourceVerificationResult = z.infer<
  typeof OfficialSourceVerificationResultSchema
>;

/**
 * Normalized page inspection surface for asset needs analysis.
 * Parallel to PageQualitySnapshot — media-focused, evaluate only.
 */
export const PageAssetSnapshotSchema = z.object({
  pageId: z.string().min(1),
  route: z.string().min(1),
  pageType: AssetDiscoveryPageTypeSchema,
  title: z.string().min(1),
  summary: z.string().optional(),
  productIds: z.array(SlugSchema).default([]),
  industryIds: z.array(SlugSchema).default([]),
  useCaseIds: z.array(SlugSchema).default([]),
  capabilityIds: z.array(z.string().min(1)).default([]),
  requirementIds: z.array(z.string().min(1)).default([]),
  featureIds: z.array(z.string().min(1)).default([]),
  sections: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        kind: z
          .enum([
            "overview",
            "features",
            "workflow",
            "implementation",
            "pricing",
            "evidence",
            "integrations",
            "security",
            "comparison",
            "teaching",
            "faq",
            "other",
          ])
          .default("other"),
        topics: z.array(z.string().min(1)).default([]),
        hasVisual: z.boolean().default(false),
        hasOfficialVideo: z.boolean().default(false),
        hasScreenshot: z.boolean().default(false),
        claimHeavy: z.boolean().default(false),
      }),
    )
    .default([]),
  existingOfficialVideoCount: z.number().int().nonnegative().default(0),
  existingScreenshotCount: z.number().int().nonnegative().default(0),
  existingFigureCount: z.number().int().nonnegative().default(0),
  existingOfficialSourceCount: z.number().int().nonnegative().default(0),
  existingMediaIds: z.array(z.string().min(1)).default([]),
  topicType: z.string().optional(),
  notes: z.array(z.string().min(1)).default([]),
});

export type PageAssetSnapshot = z.infer<typeof PageAssetSnapshotSchema>;
export type PageAssetSnapshotInput = z.input<typeof PageAssetSnapshotSchema>;

export const AssetDiscoveryReportSchema = z.object({
  id: z.string().min(1),
  pageId: z.string().min(1),
  route: z.string().min(1),
  pageType: AssetDiscoveryPageTypeSchema,
  title: z.string().min(1),
  generatedAt: IsoDateTimeSchema,
  frameworkVersion: z.string().min(1),
  opportunities: z.array(AssetOpportunitySchema).default([]),
  searchTasks: z.array(AssetSearchTaskSchema).default([]),
  discoveredAssets: z.array(DiscoveredAssetSchema).default([]),
  summary: z.object({
    opportunityCount: z.number().int().nonnegative(),
    openOpportunityCount: z.number().int().nonnegative(),
    satisfiedExistingCount: z.number().int().nonnegative(),
    searchTaskCount: z.number().int().nonnegative(),
    discoveredAssetCount: z.number().int().nonnegative(),
    officialVerifiedCount: z.number().int().nonnegative(),
    embedRecommendedCount: z.number().int().nonnegative(),
    linkRecommendedCount: z.number().int().nonnegative(),
    createOriginalCount: z.number().int().nonnegative(),
  }),
  limitations: z.array(z.string().min(1)).default([]),
  notes: z.array(z.string().min(1)).default([]),
});

export type AssetDiscoveryReport = z.infer<typeof AssetDiscoveryReportSchema>;

/** Priority: lower number = prefer earlier in search. */
export const ASSET_SOURCE_TYPE_PRIORITY: Record<AssetSourceType, number> = {
  "vendor-official-site": 1,
  "vendor-documentation": 2,
  "vendor-help-center": 2,
  "vendor-academy": 3,
  "vendor-trust-center": 3,
  "vendor-pricing": 3,
  "vendor-brand-center": 3,
  "vendor-youtube": 4,
  "vendor-vimeo": 4,
  "vendor-webinar": 4,
  "vendor-customer-story": 5,
  government: 2,
  regulator: 2,
  "standards-body": 2,
  "authoritative-primary": 3,
  secondary: 90,
};

export function getAssetSourcePriority(type: AssetSourceType): number {
  return ASSET_SOURCE_TYPE_PRIORITY[type] ?? 99;
}

/* -------------------------------------------------------------------------- */
/* SoftwareAssetDiscoveryAgent models                                         */
/* -------------------------------------------------------------------------- */

export const SOFTWARE_ASSET_DISCOVERY_AGENT_ID =
  "software-asset-discovery-agent" as const;
export const SOFTWARE_ASSET_DISCOVERY_AGENT_VERSION = "1.0.0";

/** Qualitative media coverage — not a count-only score. */
export const MediaCoverageRatingSchema = z.enum([
  "excellent",
  "strong",
  "adequate",
  "weak",
  "very-weak",
]);

export type MediaCoverageRating = z.infer<typeof MediaCoverageRatingSchema>;

/**
 * Editorial priority for software asset recommendations.
 * Distinct from usage-rights recommendation (embed/link/cite).
 */
export const SoftwareAssetRecommendationLevelSchema = z.enum([
  "add-now",
  "strong-opportunity",
  "optional",
  "source-only",
  "reuse-existing",
  "do-not-use",
]);

export type SoftwareAssetRecommendationLevel = z.infer<
  typeof SoftwareAssetRecommendationLevelSchema
>;

export const SoftwareHubSectionIdSchema = z.enum([
  "overview",
  "features",
  "pricing",
  "use-cases",
  "comparisons",
  "alternatives",
  "evidence",
  "methodology",
  "faq",
  "implementation",
  "screenshots",
  "industry",
]);

export type SoftwareHubSectionId = z.infer<typeof SoftwareHubSectionIdSchema>;

export const SoftwareAssetPlacementSchema = z.object({
  pageRoute: z.string().min(1),
  sectionId: SoftwareHubSectionIdSchema,
  sectionTitle: z.string().min(1),
  subsection: z.string().min(1).optional(),
  recommendedUse: z.string().min(1),
  why: z.string().min(1),
});

export type SoftwareAssetPlacement = z.infer<
  typeof SoftwareAssetPlacementSchema
>;

export const ExistingMediaCoverageItemSchema = z.object({
  mediaId: z.string().min(1),
  title: z.string().min(1),
  type: z.string().min(1),
  sourceUrl: z.string().optional(),
  officialSource: z.boolean().default(false),
  status: z.string().optional(),
  placements: z.array(z.string().min(1)).default([]),
  featureIds: z.array(z.string().min(1)).default([]),
  useCaseIds: z.array(z.string().min(1)).default([]),
  industryIds: z.array(z.string().min(1)).default([]),
  reuseNote: z.string().optional(),
});

export type ExistingMediaCoverageItem = z.infer<
  typeof ExistingMediaCoverageItemSchema
>;

export const StaleMediaFindingSchema = z.object({
  mediaId: z.string().min(1),
  title: z.string().min(1),
  kind: z.enum([
    "outdated-screenshot",
    "stale-ui",
    "unavailable-video",
    "embedding-disabled",
    "beyond-review-threshold",
    "source-no-longer-official",
    "old-product-name",
    "pricing-visual-stale",
  ]),
  detail: z.string().min(1),
  refreshRecommendation: z.string().min(1),
});

export type StaleMediaFinding = z.infer<typeof StaleMediaFindingSchema>;

export const OriginalVisualOpportunitySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  basedOnSourceHint: z.string().optional(),
  relatedFeatureIds: z.array(z.string().min(1)).default([]),
  relatedUseCaseIds: z.array(z.string().min(1)).default([]),
  sectionId: SoftwareHubSectionIdSchema.optional(),
  priority: z.enum(["high", "medium", "low"]).default("medium"),
});

export type OriginalVisualOpportunity = z.infer<
  typeof OriginalVisualOpportunitySchema
>;

export const SoftwareAssetRecommendationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  assetType: AssetTypeSchema,
  mediaFormat: MediaFormatSchema.optional(),
  sourceUrl: z.string().url().optional(),
  officialSource: z.boolean().default(false),
  sourceOrganization: z.string().optional(),
  whatItShows: z.array(z.string().min(1)).default([]),
  freshnessStatus: FreshnessStatusSchema.default("unknown"),
  embedStatus: z
    .enum(["embeddable", "link-only", "unknown", "not-applicable"])
    .default("unknown"),
  usageRecommendation: AssetRecommendationActionSchema.optional(),
  recommendationLevel: SoftwareAssetRecommendationLevelSchema,
  placement: SoftwareAssetPlacementSchema.optional(),
  productIds: z.array(SlugSchema).default([]),
  featureIds: z.array(z.string().min(1)).default([]),
  capabilityIds: z.array(z.string().min(1)).default([]),
  requirementIds: z.array(z.string().min(1)).default([]),
  useCaseIds: z.array(SlugSchema).default([]),
  industryIds: z.array(SlugSchema).default([]),
  /** When reusing ResearchMedia — do not duplicate. */
  reuseOfMediaId: z.string().min(1).optional(),
  reason: z.string().min(1),
  searchQueries: z.array(z.string().min(1)).default([]),
});

export type SoftwareAssetRecommendation = z.infer<
  typeof SoftwareAssetRecommendationSchema
>;

export const SoftwareSectionAuditSchema = z.object({
  sectionId: SoftwareHubSectionIdSchema,
  sectionTitle: z.string().min(1),
  current: z.array(z.string().min(1)).default([]),
  gaps: z.array(z.string().min(1)).default([]),
  proseHeavy: z.boolean().default(false),
  opportunities: z.array(SoftwareAssetRecommendationSchema).default([]),
});

export type SoftwareSectionAudit = z.infer<typeof SoftwareSectionAuditSchema>;

export const SoftwareProductAssetAuditSchema = z.object({
  agentId: z.literal(SOFTWARE_ASSET_DISCOVERY_AGENT_ID),
  agentVersion: z.string().min(1),
  productSlug: SlugSchema,
  productName: z.string().min(1),
  route: z.string().min(1),
  generatedAt: IsoDateTimeSchema,
  coverageRating: MediaCoverageRatingSchema,
  coverageReason: z.string().min(1),
  currentMedia: z.array(ExistingMediaCoverageItemSchema).default([]),
  currentScreenshotCount: z.number().int().nonnegative().default(0),
  currentOfficialVideoCount: z.number().int().nonnegative().default(0),
  currentOfficialSourceCount: z.number().int().nonnegative().default(0),
  sections: z.array(SoftwareSectionAuditSchema).default([]),
  recommendations: z.array(SoftwareAssetRecommendationSchema).default([]),
  staleAssets: z.array(StaleMediaFindingSchema).default([]),
  originalVisualOpportunities: z
    .array(OriginalVisualOpportunitySchema)
    .default([]),
  assetsToAvoid: z.array(SoftwareAssetRecommendationSchema).default([]),
  implementationOrder: z.array(z.string().min(1)).default([]),
  searchTasks: z.array(AssetSearchTaskSchema).default([]),
  majorFeaturesSearched: z.array(z.string().min(1)).default([]),
  useCasesSearched: z.array(z.string().min(1)).default([]),
  industriesSearched: z.array(z.string().min(1)).default([]),
  summary: z.object({
    addNow: z.number().int().nonnegative(),
    strongOpportunity: z.number().int().nonnegative(),
    optional: z.number().int().nonnegative(),
    sourceOnly: z.number().int().nonnegative(),
    reuseExisting: z.number().int().nonnegative(),
    doNotUse: z.number().int().nonnegative(),
    staleCount: z.number().int().nonnegative(),
    originalVisualCount: z.number().int().nonnegative(),
    openSearchTaskCount: z.number().int().nonnegative(),
  }),
  notes: z.array(z.string().min(1)).default([]),
});

export type SoftwareProductAssetAudit = z.infer<
  typeof SoftwareProductAssetAuditSchema
>;

export const SoftwareAssetMasterRowSchema = z.object({
  productSlug: SlugSchema,
  productName: z.string().min(1),
  coverageRating: MediaCoverageRatingSchema,
  officialVideosFound: z.number().int().nonnegative(),
  screenshotOpportunities: z.number().int().nonnegative(),
  productTourOpportunities: z.number().int().nonnegative(),
  implementationMedia: z.number().int().nonnegative(),
  industryMedia: z.number().int().nonnegative(),
  priorityOpportunities: z.number().int().nonnegative(),
  staleAssets: z.number().int().nonnegative(),
  recommendedNextAction: z.string().min(1),
  reportPath: z.string().min(1),
});

export type SoftwareAssetMasterRow = z.infer<
  typeof SoftwareAssetMasterRowSchema
>;

export const SoftwareAssetMasterReportSchema = z.object({
  agentId: z.literal(SOFTWARE_ASSET_DISCOVERY_AGENT_ID),
  agentVersion: z.string().min(1),
  generatedAt: IsoDateTimeSchema,
  productsAudited: z.number().int().nonnegative(),
  rows: z.array(SoftwareAssetMasterRowSchema).default([]),
  totals: z.object({
    addNow: z.number().int().nonnegative(),
    strongOpportunity: z.number().int().nonnegative(),
    reuseExisting: z.number().int().nonnegative(),
    staleAssets: z.number().int().nonnegative(),
    originalVisualOpportunities: z.number().int().nonnegative(),
    officialVideosCatalogued: z.number().int().nonnegative(),
  }),
});

export type SoftwareAssetMasterReport = z.infer<
  typeof SoftwareAssetMasterReportSchema
>;

/* -------------------------------------------------------------------------- */
/* GuideAssetDiscoveryAgent models                                            */
/* -------------------------------------------------------------------------- */

export const GUIDE_ASSET_DISCOVERY_AGENT_ID =
  "guide-asset-discovery-agent" as const;
export const GUIDE_ASSET_DISCOVERY_AGENT_VERSION = "1.0.0";

export const GuideAssetGuideKindSchema = z.enum([
  "vendor-neutral-fundamental",
  "vendor-neutral-selection",
  "vendor-neutral-pricing",
  "product-implementation",
  "product-setup",
  "product-migration",
  "product-guide",
  "industry-guide",
  "use-case-guide",
  "feature-guide",
  "requirement-guide",
  "strategy-guide",
  "checklist-guide",
  "comparison-education",
  "other",
]);

export type GuideAssetGuideKind = z.infer<typeof GuideAssetGuideKindSchema>;

export const GuideAssetCategorySchema = z.enum([
  "official-product-demo",
  "official-tutorial",
  "official-screenshot",
  "official-documentation-diagram",
  "official-workflow-diagram",
  "official-webinar",
  "official-implementation-video",
  "official-migration-documentation",
  "official-checklist-pdf-source",
  "government-regulatory-diagram",
  "standards-body-diagram",
  "original-softwareglimpse-diagram",
  "original-checklist-visualization",
  "original-comparison-graphic",
  "tool-cta-visual",
]);

export type GuideAssetCategory = z.infer<typeof GuideAssetCategorySchema>;

export const GuideAssetRecommendationSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: GuideAssetCategorySchema,
  assetType: AssetTypeSchema.optional(),
  usageRecommendation: AssetRecommendationActionSchema,
  recommendationLevel: SoftwareAssetRecommendationLevelSchema,
  sectionId: z.string().min(1),
  sectionTitle: z.string().min(1),
  placementUse: z.string().min(1),
  why: z.string().min(1),
  productIds: z.array(SlugSchema).default([]),
  industryIds: z.array(SlugSchema).default([]),
  useCaseIds: z.array(SlugSchema).default([]),
  featureIds: z.array(z.string().min(1)).default([]),
  sourceUrl: z.string().url().optional(),
  searchQueries: z.array(z.string().min(1)).default([]),
  supportingSourceHints: z.array(z.string().min(1)).default([]),
  /** Links to Content Quality visual/media findings when present. */
  resolvesContentQualityIds: z.array(z.string().min(1)).default([]),
  requiresUsageReview: z.boolean().default(false),
});

export type GuideAssetRecommendation = z.infer<
  typeof GuideAssetRecommendationSchema
>;

export const GuideSectionAssetAuditSchema = z.object({
  sectionId: z.string().min(1),
  sectionTitle: z.string().min(1),
  blockType: z.string().optional(),
  hasTeachingVisual: z.boolean().default(false),
  visualWouldHelp: z.boolean().default(false),
  current: z.array(z.string().min(1)).default([]),
  recommendations: z.array(GuideAssetRecommendationSchema).default([]),
});

export type GuideSectionAssetAudit = z.infer<
  typeof GuideSectionAssetAuditSchema
>;

export const GuideAssetAuditSchema = z.object({
  agentId: z.literal(GUIDE_ASSET_DISCOVERY_AGENT_ID),
  agentVersion: z.string().min(1),
  guideSlug: SlugSchema,
  guideTitle: z.string().min(1),
  route: z.string().min(1),
  guideKind: GuideAssetGuideKindSchema,
  topicType: z.string().optional(),
  generatedAt: IsoDateTimeSchema,
  visualQuality: MediaCoverageRatingSchema,
  visualQualityReason: z.string().min(1),
  contentQualityVisualScore: z.number().int().min(0).max(5).optional(),
  contentQualityIssueIds: z.array(z.string().min(1)).default([]),
  currentFigureCount: z.number().int().nonnegative().default(0),
  hasHeroVisual: z.boolean().default(false),
  productIds: z.array(SlugSchema).default([]),
  industryIds: z.array(SlugSchema).default([]),
  sections: z.array(GuideSectionAssetAuditSchema).default([]),
  recommendations: z.array(GuideAssetRecommendationSchema).default([]),
  officialAssetsFound: z.array(z.string().min(1)).default([]),
  authoritativeSourcesFound: z.array(z.string().min(1)).default([]),
  originalVisualOpportunities: z.array(z.string().min(1)).default([]),
  videosWorthEmbedding: z.array(z.string().min(1)).default([]),
  imagesWorthReferencing: z.array(z.string().min(1)).default([]),
  assetsRequiringUsageReview: z.array(z.string().min(1)).default([]),
  assetsToAvoid: z.array(z.string().min(1)).default([]),
  implementationPriority: z.array(z.string().min(1)).default([]),
  searchTasks: z.array(AssetSearchTaskSchema).default([]),
  summary: z.object({
    videoOpportunities: z.number().int().nonnegative(),
    screenshotOpportunities: z.number().int().nonnegative(),
    diagramOpportunities: z.number().int().nonnegative(),
    officialSourceOpportunities: z.number().int().nonnegative(),
    originalVisualOpportunities: z.number().int().nonnegative(),
    authoritativeSourceOpportunities: z.number().int().nonnegative(),
    addNow: z.number().int().nonnegative(),
    strongOpportunity: z.number().int().nonnegative(),
    priorityScore: z.number().int().nonnegative(),
  }),
  notes: z.array(z.string().min(1)).default([]),
});

export type GuideAssetAudit = z.infer<typeof GuideAssetAuditSchema>;

export const GuideAssetMasterRowSchema = z.object({
  guideSlug: SlugSchema,
  guideTitle: z.string().min(1),
  guideKind: GuideAssetGuideKindSchema,
  visualQuality: MediaCoverageRatingSchema,
  contentQualityVisualScore: z.number().int().min(0).max(5).optional(),
  videoOpportunities: z.number().int().nonnegative(),
  screenshotOpportunities: z.number().int().nonnegative(),
  diagramOpportunities: z.number().int().nonnegative(),
  officialSourceOpportunities: z.number().int().nonnegative(),
  originalVisualOpportunities: z.number().int().nonnegative(),
  priority: z.number().int().nonnegative(),
  recommendedNextAction: z.string().min(1),
  reportPath: z.string().min(1),
});

export type GuideAssetMasterRow = z.infer<typeof GuideAssetMasterRowSchema>;

export const GuideAssetMasterReportSchema = z.object({
  agentId: z.literal(GUIDE_ASSET_DISCOVERY_AGENT_ID),
  agentVersion: z.string().min(1),
  generatedAt: IsoDateTimeSchema,
  guidesAudited: z.number().int().nonnegative(),
  rows: z.array(GuideAssetMasterRowSchema).default([]),
  topRecommendations: z.array(GuideAssetRecommendationSchema).default([]),
  totals: z.object({
    videoOpportunities: z.number().int().nonnegative(),
    screenshotOpportunities: z.number().int().nonnegative(),
    diagramOpportunities: z.number().int().nonnegative(),
    officialSourceOpportunities: z.number().int().nonnegative(),
    originalVisualOpportunities: z.number().int().nonnegative(),
    authoritativeSourceOpportunities: z.number().int().nonnegative(),
    addNow: z.number().int().nonnegative(),
    strongOpportunity: z.number().int().nonnegative(),
  }),
});

export type GuideAssetMasterReport = z.infer<
  typeof GuideAssetMasterReportSchema
>;

/* -------------------------------------------------------------------------- */
/* AssetOpportunityPrioritizationAgent models                                 */
/* -------------------------------------------------------------------------- */

export const ASSET_OPPORTUNITY_PRIORITIZATION_AGENT_ID =
  "asset-opportunity-prioritization-agent" as const;
export const ASSET_OPPORTUNITY_PRIORITIZATION_AGENT_VERSION = "1.0.0";

/** Impact bands — not asset-count bands. */
export const AssetEnrichmentPriorityBandSchema = z.enum([
  "A0",
  "A1",
  "A2",
  "A3",
]);

export type AssetEnrichmentPriorityBand = z.infer<
  typeof AssetEnrichmentPriorityBandSchema
>;

export const AssetImplementationBatchSchema = z.enum([
  "official-videos-to-embed",
  "official-docs-to-link",
  "screenshots-to-add",
  "existing-research-media-to-reuse",
  "original-diagrams-to-create",
  "original-workflow-visuals-to-create",
  "stale-media-to-replace",
  "template-fix",
]);

export type AssetImplementationBatch = z.infer<
  typeof AssetImplementationBatchSchema
>;

export const AssetContentClusterSchema = z.enum([
  "CRM Product Reviews",
  "CRM Guides",
  "Implementation",
  "Migration",
  "Industries",
  "Use Cases",
  "Capabilities",
  "Requirements",
  "Features",
  "Other",
]);

export type AssetContentCluster = z.infer<typeof AssetContentClusterSchema>;

export const AssetEnrichmentEffortSchema = z.enum([
  "trivial",
  "small",
  "medium",
  "large",
]);

export type AssetEnrichmentEffort = z.infer<typeof AssetEnrichmentEffortSchema>;

export const AssetEnrichmentBacklogItemSchema = z.object({
  id: z.string().min(1),
  priority: AssetEnrichmentPriorityBandSchema,
  page: z.string().min(1),
  pageRoute: z.string().min(1),
  pageType: z.string().min(1),
  section: z.string().min(1),
  asset: z.string().min(1),
  assetType: z.string().min(1),
  source: z.string().min(1),
  official: z.boolean(),
  recommendation: z.string().min(1),
  whatItAdds: z.string().min(1),
  relatedContentQualityIssue: z.string().optional(),
  researchEvidenceImpact: z.string().min(1),
  implementationEffort: AssetEnrichmentEffortSchema,
  usageConstraints: z.string().min(1),
  implementationBatch: AssetImplementationBatchSchema,
  productSlug: z.string().optional(),
  cluster: AssetContentClusterSchema,
  /** Qualitative impact score — never “more assets = higher”. */
  impactScore: z.number(),
  mapPriority: z.enum(["P0", "P1", "P2", "P3"]).optional(),
  mapNodeId: z.string().optional(),
  isTemplateFix: z.boolean().default(false),
  isOriginalVisual: z.boolean().default(false),
  isPageSpecific: z.boolean().default(true),
  systemicPatternId: z.string().optional(),
  origin: z.enum(["software", "guide", "systemic", "stale"]).default("software"),
  sourceOpportunityId: z.string().optional(),
});

export type AssetEnrichmentBacklogItem = z.infer<
  typeof AssetEnrichmentBacklogItemSchema
>;

export const SystemicAssetOpportunitySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  count: z.number().int().positive(),
  affectedRoutes: z.array(z.string().min(1)).default([]),
  pageTypes: z.array(z.string().min(1)).default([]),
  products: z.array(z.string().min(1)).default([]),
  recommendation: z.string().min(1),
  fixClass: z.literal("TEMPLATE FIX"),
  priority: AssetEnrichmentPriorityBandSchema,
  whatItAdds: z.string().min(1),
  implementationEffort: AssetEnrichmentEffortSchema,
});

export type SystemicAssetOpportunity = z.infer<
  typeof SystemicAssetOpportunitySchema
>;

export const AssetEnrichmentBacklogReportSchema = z.object({
  agentId: z.literal(ASSET_OPPORTUNITY_PRIORITIZATION_AGENT_ID),
  agentVersion: z.string().min(1),
  generatedAt: IsoDateTimeSchema,
  inputs: z.array(z.string().min(1)).default([]),
  items: z.array(AssetEnrichmentBacklogItemSchema).default([]),
  systemicOpportunities: z
    .array(SystemicAssetOpportunitySchema)
    .default([]),
  topActions: z.array(AssetEnrichmentBacklogItemSchema).default([]),
  summary: z.object({
    a0: z.number().int().nonnegative(),
    a1: z.number().int().nonnegative(),
    a2: z.number().int().nonnegative(),
    a3: z.number().int().nonnegative(),
    templateOpportunities: z.number().int().nonnegative(),
    pageSpecificOpportunities: z.number().int().nonnegative(),
    originalVisualOpportunities: z.number().int().nonnegative(),
    byImplementationBatch: z.record(z.string(), z.number().int().nonnegative()),
    byProduct: z.record(z.string(), z.number().int().nonnegative()),
    byCluster: z.record(z.string(), z.number().int().nonnegative()),
  }),
});

export type AssetEnrichmentBacklogReport = z.infer<
  typeof AssetEnrichmentBacklogReportSchema
>;
