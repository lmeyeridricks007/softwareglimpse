import { z } from "zod";
import {
  AnchorRefSchema,
  ClusterAreaCoverageSchema,
  KnowledgeAreaSlugSchema,
  SupportingTopicCandidateSchema,
  TopicPlacementRecommendationSchema,
} from "./content-clusters";
import {
  UserJourneyStageSchema,
} from "./guide";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";

export const ProductGuideEligibilitySchema = z.enum([
  "GUIDES_NOT_NEEDED",
  "GUIDES_OPTIONAL",
  "GUIDES_RECOMMENDED",
  "GUIDES_HIGH_PRIORITY",
]);

export type ProductGuideEligibility = z.infer<
  typeof ProductGuideEligibilitySchema
>;

export const KnowledgeGapSchema = z.object({
  id: z.string().min(1),
  kind: z.enum([
    "missing-core-topic",
    "anchor-unsupported",
    "journey-imbalance",
    "tool-without-education",
    "feature-without-explainer",
  ]),
  severity: z.enum(["high", "medium", "low"]).default("medium"),
  message: z.string().min(1),
  relatedTopicIds: z.array(z.string()).default([]),
  relatedContentIds: z.array(z.string()).default([]),
});

export type KnowledgeGap = z.infer<typeof KnowledgeGapSchema>;

export const AnchorSupportCoverageSchema = z.object({
  contentId: z.string().min(1),
  title: z.string().min(1),
  path: z.string().optional(),
  supportingGuideCount: z.number().int().nonnegative().default(0),
  supportingGuideSlugs: z.array(SlugSchema).default([]),
  missingCoreTopicIds: z.array(z.string()).default([]),
});

export type AnchorSupportCoverage = z.infer<typeof AnchorSupportCoverageSchema>;

export const JourneyCoverageAuditSchema = z.object({
  stage: UserJourneyStageSchema,
  status: z.enum(["NONE", "WEAK", "PARTIAL", "GOOD", "STRONG"]),
  guideCount: z.number().int().nonnegative().default(0),
  candidateCount: z.number().int().nonnegative().default(0),
});

export type JourneyCoverageAudit = z.infer<typeof JourneyCoverageAuditSchema>;

export const CategoryKnowledgePlanSchema = z.object({
  id: z.string().min(1),
  categorySlug: SlugSchema,
  plannerId: z
    .literal("category-knowledge-planner-agent")
    .default("category-knowledge-planner-agent"),
  plannerVersion: z.string().min(1).default("1.0.0"),
  methodologyVersion: z.string().min(1).default("1.0.0"),
  knowledgeAreas: z.array(
    z.object({
      slug: KnowledgeAreaSlugSchema,
      label: z.string().min(1),
      applicable: z.boolean().default(true),
      reason: z.string().optional(),
      targetCoreCount: z.number().int().nonnegative().default(1),
    }),
  ),
  topicCandidates: z.array(SupportingTopicCandidateSchema).default([]),
  anchors: z.array(AnchorRefSchema).default([]),
  anchorCoverage: z.array(AnchorSupportCoverageSchema).default([]),
  coverage: z.array(ClusterAreaCoverageSchema).default([]),
  journeyAudit: z.array(JourneyCoverageAuditSchema).default([]),
  gaps: z.array(KnowledgeGapSchema).default([]),
  summary: z.object({
    coreCount: z.number().int().nonnegative(),
    secondaryCount: z.number().int().nonnegative(),
    optionalCount: z.number().int().nonnegative(),
    existingCount: z.number().int().nonnegative(),
    newPageCount: z.number().int().nonnegative(),
    expandCount: z.number().int().nonnegative(),
    sectionCount: z.number().int().nonnegative(),
    rejectedCount: z.number().int().nonnegative(),
    seoEvidence: z.enum(["NONE", "PARTIAL", "AVAILABLE"]).default("NONE"),
  }),
  warnings: z.array(z.string()).default([]),
  generatedAt: IsoDateTimeSchema,
});

export type CategoryKnowledgePlan = z.infer<typeof CategoryKnowledgePlanSchema>;

export const ProductKnowledgePlanSchema = z.object({
  id: z.string().min(1),
  productSlug: SlugSchema,
  categorySlug: SlugSchema.optional(),
  plannerId: z
    .literal("product-knowledge-planner-agent")
    .default("product-knowledge-planner-agent"),
  plannerVersion: z.string().min(1).default("1.0.0"),
  eligibility: ProductGuideEligibilitySchema,
  eligibilityReasons: z.array(z.string()).default([]),
  signals: z.object({
    productPublished: z.boolean().default(false),
    researchReady: z.boolean().default(false),
    strategicImportance: z.enum(["low", "medium", "high"]).default("low"),
    complexity: z.enum(["low", "medium", "high"]).default("low"),
    seoQueryCount: z.number().int().nonnegative().default(0),
    seoImpressions: z.number().nonnegative().default(0),
    legacyContentHints: z.number().int().nonnegative().default(0),
    uniqueFeatureCount: z.number().int().nonnegative().default(0),
    /** Explicitly tracked so tests can assert affiliate never drives eligibility alone */
    affiliateCommissionUsed: z.literal(false).default(false),
  }),
  topicCandidates: z.array(SupportingTopicCandidateSchema).default([]),
  rejected: z
    .array(
      z.object({
        titleConcept: z.string().min(1),
        reason: z.string().min(1),
        canonicalTarget: z.string().optional(),
      }),
    )
    .default([]),
  categoryGuides: z
    .array(
      z.object({
        slug: SlugSchema,
        title: z.string().min(1),
        status: z.string().min(1),
      }),
    )
    .default([]),
  generatedAt: IsoDateTimeSchema,
});

export type ProductKnowledgePlan = z.infer<typeof ProductKnowledgePlanSchema>;

export const SupportingContentDecisionSchema = z.object({
  candidateId: z.string().min(1),
  recommendation: TopicPlacementRecommendationSchema,
  primaryAnchorContentId: z.string().optional(),
  expandTargetSlug: SlugSchema.optional(),
  reasons: z.array(z.string()).default([]),
  nextAgentId: z
    .enum([
      "guide-agent",
      "refresh-agent",
      "internal-link-agent",
      "qa-agent",
      "none",
    ])
    .default("none"),
  workflowAction: z
    .enum([
      "create-guide",
      "refresh-existing",
      "add-section",
      "manual-review",
      "reject",
      "noop",
    ])
    .default("noop"),
  plannerVersion: z.string().min(1).default("1.0.0"),
});

export type SupportingContentDecision = z.infer<
  typeof SupportingContentDecisionSchema
>;

export const SupportingContentWorkflowInputSchema = z.object({
  supportingTopicId: z.string().min(1),
  categorySlug: SlugSchema.optional(),
  productSlug: SlugSchema.optional(),
  dryRun: z.boolean().default(false),
});

export type SupportingContentWorkflowInput = z.infer<
  typeof SupportingContentWorkflowInputSchema
>;

/** Deterministic SEO/editorial intent → agent mapping (no LLM). */
export const IntentRouteSchema = z.object({
  intentKey: z.string().min(1),
  agentId: z.string().min(1),
  pageType: z.string().min(1),
  reason: z.string().min(1),
});

export type IntentRoute = z.infer<typeof IntentRouteSchema>;
