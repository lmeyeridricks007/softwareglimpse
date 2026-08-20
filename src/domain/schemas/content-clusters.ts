import { z } from "zod";
import {
  SupportingTopicTypeSchema,
  SupportRelationTypeSchema,
  UserJourneyStageSchema,
} from "./guide";
import { SlugSchema } from "./primitives";

export const AnchorContentTypeSchema = z.enum([
  "category",
  "software",
  "best",
  "comparison",
  "alternatives",
  "pricing",
  "tool",
  "use-case",
]);

export type AnchorContentType = z.infer<typeof AnchorContentTypeSchema>;

export const AnchorRefSchema = z.object({
  contentId: z.string().min(1),
  type: AnchorContentTypeSchema,
  slug: SlugSchema,
  path: z.string().startsWith("/"),
  title: z.string().min(1),
  published: z.boolean().default(false),
});

export type AnchorRef = z.infer<typeof AnchorRefSchema>;

export const KnowledgeAreaSlugSchema = z.enum([
  "fundamentals",
  "selection",
  "pricing",
  "features",
  "implementation",
  "migration",
  "usage",
  "troubleshooting",
  "strategy",
  "integrations",
]);

export type KnowledgeAreaSlug = z.infer<typeof KnowledgeAreaSlugSchema>;

export const TopicPlacementRecommendationSchema = z.enum([
  "NEW_PAGE",
  "EXPAND_EXISTING_PAGE",
  "ADD_SECTION",
  "MERGE_WITH_EXISTING",
  "NO_ACTION",
  "REJECT",
  "MANUAL_REVIEW",
]);

export type TopicPlacementRecommendation = z.infer<
  typeof TopicPlacementRecommendationSchema
>;

export const TopicPriorityClassSchema = z.enum([
  "CORE",
  "SECONDARY",
  "OPTIONAL",
  "NOT_RECOMMENDED",
]);

export type TopicPriorityClass = z.infer<typeof TopicPriorityClassSchema>;

export const TopicCandidateReadinessSchema = z.enum([
  "ready",
  "research-required",
  "duplicate",
  "not-recommended",
  "exists",
]);

export type TopicCandidateReadiness = z.infer<
  typeof TopicCandidateReadinessSchema
>;

export const SupportingTopicConceptSchema = z.object({
  id: z.string().min(1),
  titleConcept: z.string().min(1),
  suggestedSlug: SlugSchema,
  topicType: SupportingTopicTypeSchema,
  journeyStage: UserJourneyStageSchema,
  knowledgeAreaSlug: KnowledgeAreaSlugSchema,
  priorityClass: TopicPriorityClassSchema.default("SECONDARY"),
  productSlugs: z.array(SlugSchema).default([]),
  /** ContentIds this concept should support. */
  supportsContentIds: z.array(z.string().min(1)).default([]),
  supportRelationType: SupportRelationTypeSchema.default("supports-anchor"),
  nextActionContentId: z.string().min(1).optional(),
  nextActionLabel: z.string().optional(),
  intentClusterKeys: z.array(z.string()).default([]),
  /** Why this topic deserves a page (or not). */
  standaloneSignals: z
    .object({
      multipleSubquestions: z.boolean().default(false),
      distinctSearchIntent: z.boolean().default(false),
      decisionImportance: z.boolean().default(false),
      internalLinkUsefulness: z.boolean().default(false),
      meaningfulDepth: z.boolean().default(false),
    })
    .default({
      multipleSubquestions: false,
      distinctSearchIntent: false,
      decisionImportance: false,
      internalLinkUsefulness: false,
      meaningfulDepth: false,
    }),
  notes: z.array(z.string()).default([]),
});

export type SupportingTopicConcept = z.infer<
  typeof SupportingTopicConceptSchema
>;

export const CategoryKnowledgeAreaSchema = z.object({
  slug: KnowledgeAreaSlugSchema,
  label: z.string().min(1),
  description: z.string().optional(),
  /** Soft target for CORE coverage reporting — not a generation quota. */
  targetCoreCount: z.number().int().nonnegative().default(1),
});

export type CategoryKnowledgeArea = z.infer<typeof CategoryKnowledgeAreaSchema>;

export const CategoryKnowledgeMapSchema = z.object({
  id: z.string().min(1),
  categorySlug: SlugSchema,
  version: z.string().min(1).default("1.0.0"),
  areas: z.array(CategoryKnowledgeAreaSchema).min(1),
  /** Declared CORE/SECONDARY concepts for the category. */
  topics: z.array(SupportingTopicConceptSchema).default([]),
  /** Tool slug → concept ids that should support it. */
  toolSupportTopicIds: z.record(z.string(), z.array(z.string())).default({}),
  /** Best-page slug → concept ids. */
  bestSupportTopicIds: z.record(z.string(), z.array(z.string())).default({}),
  notes: z.array(z.string()).default([]),
});

export type CategoryKnowledgeMap = z.infer<typeof CategoryKnowledgeMapSchema>;

export const SupportingTopicCandidateSchema = z.object({
  id: z.string().min(1),
  titleConcept: z.string().min(1),
  suggestedSlug: SlugSchema,
  categorySlug: SlugSchema,
  productSlugs: z.array(SlugSchema).default([]),
  topicType: SupportingTopicTypeSchema,
  journeyStage: UserJourneyStageSchema,
  knowledgeAreaSlug: KnowledgeAreaSlugSchema,
  targetIntent: z.string().min(1),
  supports: z.array(
    z.object({
      contentId: z.string().min(1),
      relationType: SupportRelationTypeSchema,
    }),
  ),
  evidence: z.object({
    seoQueryCount: z.number().int().nonnegative().default(0),
    seoImpressions: z.number().nonnegative().default(0),
    knowledgeGap: z.boolean().default(false),
    userJourneyValue: z.number().min(0).max(10).default(0),
    multiAnchorValue: z.number().int().nonnegative().default(0),
    notes: z.array(z.string()).default([]),
  }),
  scores: z.object({
    journeyValue: z.number().min(0).max(10),
    searchEvidence: z.number().min(0).max(10),
    anchorSupport: z.number().min(0).max(10),
    knowledgeGap: z.number().min(0).max(10),
    strategicRelevance: z.number().min(0).max(10),
    effortPenalty: z.number().min(0).max(10),
    total: z.number(),
  }),
  priorityClass: TopicPriorityClassSchema,
  placement: TopicPlacementRecommendationSchema,
  placementReason: z.string().min(1),
  readiness: TopicCandidateReadinessSchema,
  existingGuideSlug: SlugSchema.optional(),
  expandTargetSlug: SlugSchema.optional(),
  priority: z.number(),
});

export type SupportingTopicCandidate = z.infer<
  typeof SupportingTopicCandidateSchema
>;

export const ClusterAreaCoverageSchema = z.object({
  knowledgeAreaSlug: KnowledgeAreaSlugSchema,
  label: z.string().min(1),
  targetCoreCount: z.number().int().nonnegative(),
  existingCoreCount: z.number().int().nonnegative(),
  existingSecondaryCount: z.number().int().nonnegative(),
  missingCoreTopicIds: z.array(z.string()).default([]),
});

export type ClusterAreaCoverage = z.infer<typeof ClusterAreaCoverageSchema>;

export const ContentClusterSchema = z.object({
  id: z.string().min(1),
  categorySlug: SlugSchema,
  anchors: z.array(AnchorRefSchema).default([]),
  existingGuideSlugs: z.array(SlugSchema).default([]),
  candidates: z.array(SupportingTopicCandidateSchema).default([]),
  coverage: z.array(ClusterAreaCoverageSchema).default([]),
  journeyCoverage: z.record(z.string(), z.number().int().nonnegative()).default(
    {},
  ),
  generatedAt: z.string().min(1),
});

export type ContentCluster = z.infer<typeof ContentClusterSchema>;

/** Optional category-definition attachment for onboarding. */
export const SupportingKnowledgePlanSchema = z.object({
  areas: z.array(KnowledgeAreaSlugSchema).default([]),
  coreTopicIds: z.array(z.string()).default([]),
  candidateCount: z.number().int().nonnegative().default(0),
  readyCount: z.number().int().nonnegative().default(0),
  notes: z.array(z.string()).default([]),
});

export type SupportingKnowledgePlan = z.infer<
  typeof SupportingKnowledgePlanSchema
>;
