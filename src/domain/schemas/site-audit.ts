import { z } from "zod";
import { IsoDateTimeSchema, SlugSchema } from "./primitives";

/** Distinct from draft QA — site/product/category/content/workflow/migration. */
export const AuditScopeKindSchema = z.enum([
  "site",
  "category",
  "product",
  "content",
  "workflow",
  "migration",
  "batch",
]);

export type AuditScopeKind = z.infer<typeof AuditScopeKindSchema>;

export const AuditScopeSchema = z.object({
  kind: AuditScopeKindSchema,
  id: z.string().optional(),
  label: z.string().optional(),
});

export type AuditScope = z.infer<typeof AuditScopeSchema>;

export const AuditLevelSchema = z.enum(["validity", "readiness", "quality"]);

export type AuditLevel = z.infer<typeof AuditLevelSchema>;

export const AuditSeveritySchema = z.enum([
  "critical",
  "high",
  "medium",
  "low",
  "info",
]);

export type AuditSeverity = z.infer<typeof AuditSeveritySchema>;

/**
 * Site-audit issue types. Extends draft QA concepts without collapsing layers.
 * Prefer these stable codes over inventing near-duplicates.
 */
export const AuditIssueTypeSchema = z.enum([
  // Validity
  "INVALID_SCHEMA",
  "MISSING_REQUIRED_DATA",
  "BROKEN_REFERENCE",
  "DUPLICATE_ID",
  "DUPLICATE_SLUG",
  "INVALID_STATE",
  "INVALID_RELATIONSHIP",
  "MISSING_RELATIONSHIP",
  // Research / facts
  "UNSUPPORTED_FACT",
  "UNVERIFIED_NUMBER",
  "STALE_CRITICAL_FACT",
  "CONFLICTING_FACTS",
  "RESEARCH_GAP",
  "SOURCE_QUALITY",
  "SOURCE_DIVERSITY",
  // Pricing
  "PRICING_GAP",
  "PRICING_PROSE_MISMATCH",
  "PRICING_STALE",
  // Editorial
  "FAKE_TESTING_CLAIM",
  "EDITORIAL_METHOD_MISMATCH",
  "METHODOLOGY_REFRESH_RECOMMENDED",
  "INVALID_SCORE",
  "RANKING_INTEGRITY",
  "AFFILIATE_BIAS",
  "THIN_CONTENT",
  "INCONSISTENT_PRODUCT_DATA",
  "INCONSISTENT_EDITORIAL_POSITION",
  "COMPARISON_IMBALANCE",
  "COMPARISON_EVIDENCE_IMBALANCE",
  "BEST_PAGE_COVERAGE_GAP",
  "EVALUATION_GAP",
  "MISSING_ALT_CONTEXT",
  "GENERIC_AI_PROSE",
  "UNSUPPORTED_SUPERLATIVE",
  "USER_REVIEW_CLAIM",
  "REPETITION",
  "TEMPLATE_DUPLICATION",
  // Links / SEO
  "BROKEN_INTERNAL_LINK",
  "ORPHAN_CONTENT",
  "LINK_CONCENTRATION",
  "DUPLICATE_INTENT",
  "CANNIBALIZATION",
  "INVALID_CANONICAL",
  "SEO_METADATA_INVALID",
  "STRUCTURED_DATA_ISSUE",
  "TITLE_ISSUE",
  "META_DESCRIPTION_ISSUE",
  "H1_TITLE_MISMATCH",
  "PAGE_PURPOSE_MISMATCH",
  // Affiliate / disclosure / promotions
  "MISSING_DISCLOSURE",
  "CTA_BUDGET_EXCEEDED",
  "RAW_AFFILIATE_URL",
  "AFFILIATE_LINK_HEALTH",
  "MISSING_AFFILIATE_DESTINATION",
  "MALFORMED_AFFILIATE_URL",
  "INACTIVE_AFFILIATE_USED",
  "MULTIPLE_DEFAULT_DESTINATIONS",
  "EXPIRED_PROMOTION_VISIBLE",
  "UNVERIFIED_PROMOTION",
  "STALE_PROMOTION",
  "BROKEN_PROMOTION_DESTINATION",
  "PROMOTION_PRICE_CONFLICT",
  "PROMOTION_CONFLICT",
  "MISSING_CTA_FALLBACK",
  // Supporting content clusters
  "SUPPORTING_KNOWLEDGE_GAP",
  "ANCHOR_SUPPORT_GAP",
  "SUPPORT_CONTENT_DUPLICATE",
  "SUPPORT_CONTENT_ORPHAN",
  // Migration
  "MIGRATION_GAP",
  "INVALID_REDIRECT",
  "REDIRECT_CHAIN",
  "LEGACY_TRAFFIC_RISK",
  // Category / product ecosystem
  "CATEGORY_GAP",
  "CATEGORY_IMBALANCE",
  "PRODUCT_ECOSYSTEM_GAP",
  // Ops
  "OUTDATED_CONTENT",
  "SCHEDULED_UNSAFE",
  "WORKFLOW_STUCK",
  "APPROVAL_BACKLOG",
  "ONBOARDING_GAP",
  "CATALOGUE_QUALITY",
  "SEARCH_DECAY",
  "HIGH_IMPRESSION_WEAK_PAGE",
  "UNPUBLISHED_LINK_TARGET",
  // Site foundation / legal / consent
  "MISSING_PRIVACY_POLICY",
  "MISSING_TERMS",
  "MISSING_COOKIE_POLICY",
  "MISSING_AFFILIATE_DISCLOSURE",
  "MISSING_CONTACT",
  "MISSING_EDITORIAL_METHODOLOGY",
  "LEGAL_CONFIGURATION_INCOMPLETE",
  "UNCLASSIFIED_COOKIE",
  "CONSENT_SCRIPT_BYPASS",
  "NEWSLETTER_WITHOUT_CONSENT_COPY",
  "NEWSLETTER_UNSUBSCRIBE_MISSING",
  "COOKIE_SETTINGS_UNAVAILABLE",
  "OUTDATED_LEGAL_POLICY",
  "SITE_LAUNCH_NOT_READY",
]);

export type AuditIssueType = z.infer<typeof AuditIssueTypeSchema>;

export const AuditIssueStateSchema = z.enum([
  "open",
  "accepted",
  "dismissed",
  "in-progress",
  "resolved",
  "reopened",
]);

export type AuditIssueState = z.infer<typeof AuditIssueStateSchema>;

export const RemediationClassSchema = z.enum([
  "AUTO_SAFE",
  "AGENT_SAFE",
  "MANUAL_REVIEW",
]);

export type RemediationClass = z.infer<typeof RemediationClassSchema>;

export const RemediationActionSchema = z.enum([
  "research-refresh",
  "editorial-refresh",
  "run-review-agent",
  "run-pricing-agent",
  "run-comparison-agent",
  "run-alternatives-agent",
  "add-internal-links",
  "relationship-review",
  "migration-review",
  "archive",
  "noindex",
  "manual-review",
  "fix-canonical",
  "fix-redirect",
  "fix-disclosure",
  "workflow-resume",
  "category-onboard",
  "none",
]);

export type RemediationAction = z.infer<typeof RemediationActionSchema>;

export const PublicationReadinessSchema = z.enum([
  "PUBLISHABLE",
  "PUBLISHABLE_WITH_WARNINGS",
  "NOT_PUBLISHABLE",
]);

export type PublicationReadiness = z.infer<typeof PublicationReadinessSchema>;

export const AuditIssueSchema = z.object({
  id: z.string().min(1),
  type: AuditIssueTypeSchema,
  severity: AuditSeveritySchema,
  level: AuditLevelSchema,
  message: z.string().min(1),
  evidence: z.string().optional(),
  path: z.string().optional(),
  section: z.string().optional(),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  categorySlug: SlugSchema.optional(),
  productSlug: SlugSchema.optional(),
  contentId: z.string().optional(),
  remediationAction: RemediationActionSchema.default("manual-review"),
  remediationClass: RemediationClassSchema.default("MANUAL_REVIEW"),
  state: AuditIssueStateSchema.default("open"),
  firstSeenAt: IsoDateTimeSchema,
  lastSeenAt: IsoDateTimeSchema,
  resolvedAt: IsoDateTimeSchema.optional(),
  trafficBoost: z.boolean().default(false),
  commercialBoost: z.boolean().default(false),
});

export type AuditIssue = z.infer<typeof AuditIssueSchema>;

export const AuditMetricsSchema = z.object({
  publishedPages: z.number().int().nonnegative().default(0),
  indexablePages: z.number().int().nonnegative().default(0),
  draftPages: z.number().int().nonnegative().default(0),
  scheduledPages: z.number().int().nonnegative().default(0),
  criticalIssues: z.number().int().nonnegative().default(0),
  highIssues: z.number().int().nonnegative().default(0),
  mediumIssues: z.number().int().nonnegative().default(0),
  lowIssues: z.number().int().nonnegative().default(0),
  infoIssues: z.number().int().nonnegative().default(0),
  researchStale: z.number().int().nonnegative().default(0),
  pricingStale: z.number().int().nonnegative().default(0),
  orphanPages: z.number().int().nonnegative().default(0),
  duplicateIntentWarnings: z.number().int().nonnegative().default(0),
  methodologyOutdated: z.number().int().nonnegative().default(0),
  blockersPublication: z.number().int().nonnegative().default(0),
});

export type AuditMetrics = z.infer<typeof AuditMetricsSchema>;

export const HealthComponentSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  score: z.number().min(0).max(100),
  weight: z.number().min(0).max(1),
  notes: z.array(z.string()).default([]),
});

export type HealthComponent = z.infer<typeof HealthComponentSchema>;

export const HealthScoreSchema = z.object({
  /** Internal only — never public. */
  score: z.number().min(0).max(100),
  components: z.array(HealthComponentSchema).default([]),
  formula: z.string().min(1),
});

export type HealthScore = z.infer<typeof HealthScoreSchema>;

export const RemediationItemSchema = z.object({
  rank: z.number().int().positive(),
  issueId: z.string().min(1),
  action: RemediationActionSchema,
  remediationClass: RemediationClassSchema,
  title: z.string().min(1),
  priorityScore: z.number(),
  reasons: z.array(z.string()).default([]),
});

export type RemediationItem = z.infer<typeof RemediationItemSchema>;

export const AuditResultSchema = z.object({
  id: z.string().min(1),
  scope: AuditScopeSchema,
  status: z.enum(["pass", "pass-with-warnings", "fail"]),
  blockers: z.array(AuditIssueSchema).default([]),
  warnings: z.array(AuditIssueSchema).default([]),
  opportunities: z.array(AuditIssueSchema).default([]),
  metrics: AuditMetricsSchema.default(() => ({
    publishedPages: 0,
    indexablePages: 0,
    draftPages: 0,
    scheduledPages: 0,
    criticalIssues: 0,
    highIssues: 0,
    mediumIssues: 0,
    lowIssues: 0,
    infoIssues: 0,
    researchStale: 0,
    pricingStale: 0,
    orphanPages: 0,
    duplicateIntentWarnings: 0,
    methodologyOutdated: 0,
    blockersPublication: 0,
  })),
  health: HealthScoreSchema.optional(),
  publicationReadiness: PublicationReadinessSchema.optional(),
  publicationReasons: z.array(z.string()).default([]),
  remediations: z.array(RemediationItemSchema).default([]),
  auditedAt: IsoDateTimeSchema,
  durationMs: z.number().nonnegative().optional(),
  notes: z.array(z.string()).default([]),
});

export type AuditResult = z.infer<typeof AuditResultSchema>;

export const AuditSnapshotSchema = z.object({
  id: z.string().min(1),
  label: z.string().optional(),
  resultId: z.string().min(1),
  metrics: AuditMetricsSchema,
  criticalCount: z.number().int().nonnegative(),
  highCount: z.number().int().nonnegative(),
  createdAt: IsoDateTimeSchema,
  isBaseline: z.boolean().default(false),
});

export type AuditSnapshot = z.infer<typeof AuditSnapshotSchema>;

export const AuditConfigSchema = z.object({
  taskCreationMinSeverity: AuditSeveritySchema.default("high"),
  orphanInboundLinkThreshold: z.number().int().nonnegative().default(1),
  qualitativeSample: z
    .enum(["none", "warnings", "high-traffic", "category", "random"])
    .default("none"),
  forceFresh: z.boolean().default(false),
  maxIssuesInReport: z.number().int().positive().default(200),
});

export type AuditConfig = z.infer<typeof AuditConfigSchema>;
