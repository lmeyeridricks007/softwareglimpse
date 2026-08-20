import { z } from "zod";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";

/**
 * Research media (videos) for product research — supplements screenshots/docs,
 * never replaces independent SoftwareGlimpse analysis.
 *
 * Canonical name: ResearchMedia (ProductMedia is retained as a type alias).
 * Do not store raw iframe HTML from external sources.
 * Screenshots remain on ProductResearchEnrichment.screenshots — not duplicated here.
 */

export const ResearchMediaTypeSchema = z.enum([
  "official-video",
  "official-webinar",
  "official-tutorial",
  /**
   * Vendor-published customer story — proves a story exists, not typical ROI
   * or product superiority. Label distinctly in UI.
   */
  "official-customer-case-study",
  /** First-party SoftwareGlimpse analysis — labeled differently in UI. */
  "softwareglimpse-video",
]);

export type ResearchMediaType = z.infer<typeof ResearchMediaTypeSchema>;

/** @deprecated Prefer ResearchMediaTypeSchema */
export const ProductMediaTypeSchema = ResearchMediaTypeSchema;
export type ProductMediaType = ResearchMediaType;

export const ResearchMediaProviderSchema = z.enum([
  "youtube",
  "vimeo",
  "vendor-hosted",
]);

export type ResearchMediaProvider = z.infer<typeof ResearchMediaProviderSchema>;

/** @deprecated Prefer ResearchMediaProviderSchema */
export const ProductMediaProviderSchema = ResearchMediaProviderSchema;
export type ProductMediaProvider = ResearchMediaProvider;

/**
 * Feature / product media research lifecycle (never auto-publish):
 *
 * discovered → verified → classified → needs-review → active|published
 *
 * - discovered: potential official video registered (officialSource must be false)
 * - verified: researcher confirmed official vendor source (officialSource=true)
 * - classified: feature / dimension / whatThisShows mapped (still not public)
 * - needs-review: editorial review queue
 * - active|published: explicitly activated for public UI
 *
 * candidate/draft retained as legacy aliases of early pipeline stages.
 * embedding-disabled = show source link only; unavailable = hide from public UI
 */
export const ResearchMediaStatusSchema = z.enum([
  "draft",
  "discovered",
  "candidate",
  "verified",
  "classified",
  "needs-review",
  "published",
  "active",
  "unavailable",
  "embedding-disabled",
  "rejected",
]);

export type ResearchMediaStatus = z.infer<typeof ResearchMediaStatusSchema>;

/** @deprecated Prefer ResearchMediaStatusSchema */
export const ProductMediaStatusSchema = ResearchMediaStatusSchema;
export type ProductMediaStatus = ResearchMediaStatus;

export const ResearchMediaPlacementSchema = z.enum([
  "overview",
  "features",
  "use-cases",
  "screenshots",
  "implementation",
  "evidence",
]);

export type ResearchMediaPlacement = z.infer<typeof ResearchMediaPlacementSchema>;

/** @deprecated Prefer ResearchMediaPlacementSchema */
export const ProductMediaPlacementSchema = ResearchMediaPlacementSchema;
export type ProductMediaPlacement = ResearchMediaPlacement;

export const OfficialSourceKindSchema = z.enum([
  "vendor-channel",
  "vendor-training",
  "vendor-help",
  "vendor-website",
]);

export type OfficialSourceKind = z.infer<typeof OfficialSourceKindSchema>;

/**
 * Governance refresh flags — never auto-delete research history.
 * Callers set status / hide public display; records remain for audit.
 */
export const ResearchMediaRefreshFlagSchema = z.enum([
  "source-unavailable",
  "embedding-disabled",
  "product-materially-changed",
  "linked-feature-changed",
  "beyond-review-threshold",
  "source-no-longer-official",
  /** Demo UI appears outdated vs current product surfaces. */
  "stale-ui",
  /** Canonical source URL / provider id changed — re-verify identity. */
  "source-changed",
  /** industryIds / mediaContext / relevance may no longer be accurate. */
  "industry-relationship-needs-review",
]);

export type ResearchMediaRefreshFlag = z.infer<
  typeof ResearchMediaRefreshFlagSchema
>;

export const ResearchMediaSourceHealthSchema = z.enum([
  "live",
  "unavailable",
  "unknown",
]);

export type ResearchMediaSourceHealth = z.infer<
  typeof ResearchMediaSourceHealthSchema
>;

/**
 * Industry / workflow display context — classification only.
 * Never infer industry-specific from generic CRM marketing.
 */
export const ResearchMediaContextSchema = z.enum([
  "industry-specific",
  "industry-edition",
  "general-workflow",
  "customer-case-study",
]);

export type ResearchMediaContext = z.infer<typeof ResearchMediaContextSchema>;

/**
 * Researcher judgment of industry relevance for Industry hub surfaces.
 * Weak relevance must not surface prominently (see-in-action / stories).
 */
export const IndustryMediaRelevanceSchema = z.enum([
  "exact-industry-specific",
  "strongly-relevant-general",
  "weak",
]);

export type IndustryMediaRelevance = z.infer<typeof IndustryMediaRelevanceSchema>;

/**
 * Claims official video may reasonably support as evidence.
 * Explicitly excludes pricing, security certs, performance, and comparative superiority.
 */
export const ResearchMediaEvidenceClaimKindSchema = z.enum([
  "feature-existence",
  "workflow-demo",
  "ui-layout",
  "setup-tutorial",
]);

export type ResearchMediaEvidenceClaimKind = z.infer<
  typeof ResearchMediaEvidenceClaimKindSchema
>;

/** @deprecated Prefer ResearchMediaEvidenceClaimKindSchema */
export const ProductMediaEvidenceClaimKindSchema =
  ResearchMediaEvidenceClaimKindSchema;
export type ProductMediaEvidenceClaimKind = ResearchMediaEvidenceClaimKind;

export const DEFAULT_VIDEO_LIMITATIONS = [
  "pricing",
  "comparative superiority",
  "security or compliance certification",
  "implementation effort or total cost of ownership",
] as const;

export const ResearchMediaSchema = z.object({
  id: z.string().min(1),
  /** Primary product this media is stored under (enrichment productSlug). */
  productSlug: SlugSchema,
  /**
   * Optional multi-product reuse ids (knowledge-graph ready).
   * Prefer relationships via feature/requirement/capability ids for reuse.
   */
  productIds: z.array(SlugSchema).default([]),
  type: ResearchMediaTypeSchema,
  provider: ResearchMediaProviderSchema,
  /** Canonical watch / source URL (never an affiliate URL). */
  sourceUrl: z.string().url(),
  /** Provider-specific identifier (YouTube video id, Vimeo id, etc.). */
  videoId: z.string().min(1).optional(),
  /** Alias for videoId — accepted for ResearchMedia conceptual model. */
  providerId: z.string().min(1).optional(),
  /** Computed privacy-aware embed URL — never raw iframe HTML. */
  embedUrl: z.string().url().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  /** Vendor / org that owns the media (e.g. "Pipedrive"). */
  sourceOrganization: z.string().optional(),
  channelName: z.string().optional(),
  /**
   * Primary research UI requires true for official vendor demos.
   * Do not infer from title alone — set only after channel/host verification.
   */
  officialSource: z.boolean(),
  officialSourceKind: OfficialSourceKindSchema.optional(),
  publishedAt: IsoDateTimeSchema.optional(),
  verifiedAt: IsoDateTimeSchema,
  /** Last structural / remote health check (link validation / refresh). */
  lastCheckedAt: IsoDateTimeSchema.optional(),
  /**
   * Recorded source reachability. Prefer probe-backed updates over inference.
   * unavailable → hide from active public display; keep research history.
   */
  sourceHealth: ResearchMediaSourceHealthSchema.default("unknown"),
  /** Open governance flags — do not auto-delete the media record. */
  refreshFlags: z.array(ResearchMediaRefreshFlagSchema).default([]),
  /** Only when known — never fabricate. */
  durationSeconds: z.number().int().positive().optional(),
  /**
   * When false, show source link only (no iframe).
   * Prefer status "embedding-disabled" for explicit cases.
   */
  embeddingAllowed: z.boolean().default(true),
  capabilityIds: z.array(z.string().min(1)).default([]),
  featureIds: z.array(z.string().min(1)).default([]),
  requirementIds: z.array(z.string().min(1)).default([]),
  useCaseIds: z.array(z.string().min(1)).default([]),
  industryIds: z.array(z.string().min(1)).default([]),
  /**
   * Optional guide ids when media supports a guide teaching surface.
   * Prefer placement recommendations for page-specific guide sections;
   * use guideIds only for durable guide↔media relationships.
   */
  guideIds: z.array(SlugSchema).default([]),
  /** Research fact / claim ids this media supports. */
  evidenceRefs: z.array(z.string().min(1)).default([]),
  evidenceClaimIds: z.array(z.string().min(1)).default([]),
  evidenceClaimKinds: z
    .array(ResearchMediaEvidenceClaimKindSchema)
    .default([]),
  /**
   * Feature evaluation dimension ids this media visibly demonstrates
   * (e.g. FeatureEvaluationDimension.id on Feature Detail pages).
   * Empty = feature-level relationship only; does not claim plan/limits/etc.
   */
  demonstratedDimensionIds: z.array(z.string().min(1)).default([]),
  /**
   * Requirement evaluation criterion ids this media visibly demonstrates
   * (RequirementEvaluationCriterion.id). Never treat as full-requirement support.
   */
  requirementCriterionIds: z.array(z.string().min(1)).default([]),
  /**
   * Optional workflow-stage ids visibly demonstrated (capability / use-case /
   * industry hub workflow steps). Only set when grounded — never invent.
   */
  workflowStageIds: z.array(z.string().min(1)).default([]),
  /**
   * Display classification for Industry / Product hubs.
   * Prefer researcher-set values; do not auto-promote general demos to
   * industry-specific.
   */
  mediaContext: ResearchMediaContextSchema.optional(),
  /**
   * Optional industry edition / solution label when the demo shows a distinct
   * product family (e.g. "Financial Services Cloud"), not the base CRM alone.
   */
  industryEditionLabel: z.string().min(1).optional(),
  /**
   * Named customer organization when the media is an official customer story
   * and the vendor discloses the company. Never invent.
   */
  customerOrganization: z.string().min(1).optional(),
  /**
   * Researcher industry-relevance judgment for Industry hub ranking/surfaces.
   * Do not auto-promote weak → exact. Weak must not surface prominently.
   */
  industryRelevance: IndustryMediaRelevanceSchema.optional(),
  /**
   * Vendor-reported outcomes from customer case studies only.
   * Always treat as vendor claims — never SoftwareGlimpse facts.
   */
  reportedOutcomes: z.array(z.string().min(1)).default([]),
  placements: z.array(ResearchMediaPlacementSchema).default([]),
  /** Researcher purpose / why recorded. */
  purpose: z.string().optional(),
  /** Short caption: what this video demonstrates. */
  demonstratesCaption: z.string().optional(),
  /** Free-form SoftwareGlimpse editorial note. */
  editorialCommentary: z.string().optional(),
  /**
   * Grounded observations of what is visible/demonstrated.
   * Prefer this over whatToNotice for new records.
   */
  whatThisShows: z.array(z.string().min(1)).default([]),
  /**
   * Explicit non-claims (pricing, comparative superiority, etc.).
   * Empty → UI may show DEFAULT_VIDEO_LIMITATIONS for official demos.
   */
  limitations: z.array(z.string().min(1)).default([]),
  /**
   * @deprecated Prefer whatThisShows — kept for existing HubSpot records.
   */
  whatToNotice: z.array(z.string().min(1)).default([]),
  status: ResearchMediaStatusSchema.default("draft"),
});

export type ResearchMedia = z.infer<typeof ResearchMediaSchema>;

/** @deprecated Prefer ResearchMedia — same schema. */
export const ProductMediaSchema = ResearchMediaSchema;
export type ProductMedia = ResearchMedia;

/** Resolve display bullets for "What this shows". */
export function mediaWhatThisShows(media: ResearchMedia): string[] {
  if (media.whatThisShows.length > 0) return media.whatThisShows;
  return media.whatToNotice;
}

/** Resolve "What this does not establish" bullets. */
export function mediaLimitations(media: ResearchMedia): string[] {
  if (media.limitations.length > 0) return media.limitations;
  if (media.type === "softwareglimpse-video") return [];
  return [...DEFAULT_VIDEO_LIMITATIONS];
}

export function isSoftwareGlimpseAnalysisVideo(media: ResearchMedia): boolean {
  return media.type === "softwareglimpse-video";
}

export function isOfficialVendorMedia(media: ResearchMedia): boolean {
  return (
    media.officialSource === true &&
    media.type !== "softwareglimpse-video"
  );
}
