import type {
  AuditIssueType,
  AuditSeverity,
  RemediationAction,
  RemediationClass,
} from "@/domain";

/**
 * Central severity defaults by issue type.
 * Traffic/commercial boosts may elevate remediation priority, not editorial ranking.
 */
export const defaultSeverityByType: Record<AuditIssueType, AuditSeverity> = {
  INVALID_SCHEMA: "critical",
  MISSING_REQUIRED_DATA: "high",
  BROKEN_REFERENCE: "high",
  DUPLICATE_ID: "critical",
  DUPLICATE_SLUG: "critical",
  INVALID_STATE: "high",
  INVALID_RELATIONSHIP: "medium",
  MISSING_RELATIONSHIP: "medium",
  UNSUPPORTED_FACT: "high",
  UNVERIFIED_NUMBER: "high",
  STALE_CRITICAL_FACT: "high",
  CONFLICTING_FACTS: "high",
  RESEARCH_GAP: "medium",
  SOURCE_QUALITY: "medium",
  SOURCE_DIVERSITY: "low",
  PRICING_GAP: "medium",
  PRICING_PROSE_MISMATCH: "high",
  PRICING_STALE: "high",
  FAKE_TESTING_CLAIM: "critical",
  EDITORIAL_METHOD_MISMATCH: "high",
  METHODOLOGY_REFRESH_RECOMMENDED: "medium",
  INVALID_SCORE: "high",
  RANKING_INTEGRITY: "high",
  AFFILIATE_BIAS: "critical",
  THIN_CONTENT: "medium",
  INCONSISTENT_PRODUCT_DATA: "high",
  INCONSISTENT_EDITORIAL_POSITION: "high",
  COMPARISON_IMBALANCE: "medium",
  COMPARISON_EVIDENCE_IMBALANCE: "high",
  BEST_PAGE_COVERAGE_GAP: "medium",
  EVALUATION_GAP: "medium",
  MISSING_ALT_CONTEXT: "medium",
  GENERIC_AI_PROSE: "low",
  UNSUPPORTED_SUPERLATIVE: "medium",
  USER_REVIEW_CLAIM: "medium",
  REPETITION: "low",
  TEMPLATE_DUPLICATION: "medium",
  BROKEN_INTERNAL_LINK: "high",
  ORPHAN_CONTENT: "medium",
  LINK_CONCENTRATION: "low",
  DUPLICATE_INTENT: "high",
  CANNIBALIZATION: "medium",
  INVALID_CANONICAL: "high",
  SEO_METADATA_INVALID: "medium",
  STRUCTURED_DATA_ISSUE: "medium",
  TITLE_ISSUE: "low",
  META_DESCRIPTION_ISSUE: "low",
  H1_TITLE_MISMATCH: "low",
  PAGE_PURPOSE_MISMATCH: "medium",
  MISSING_DISCLOSURE: "high",
  CTA_BUDGET_EXCEEDED: "medium",
  RAW_AFFILIATE_URL: "high",
  AFFILIATE_LINK_HEALTH: "high",
  MISSING_AFFILIATE_DESTINATION: "medium",
  MALFORMED_AFFILIATE_URL: "high",
  INACTIVE_AFFILIATE_USED: "high",
  MULTIPLE_DEFAULT_DESTINATIONS: "high",
  EXPIRED_PROMOTION_VISIBLE: "low",
  UNVERIFIED_PROMOTION: "medium",
  STALE_PROMOTION: "medium",
  BROKEN_PROMOTION_DESTINATION: "high",
  PROMOTION_PRICE_CONFLICT: "medium",
  PROMOTION_CONFLICT: "medium",
  MISSING_CTA_FALLBACK: "medium",
  SUPPORTING_KNOWLEDGE_GAP: "medium",
  ANCHOR_SUPPORT_GAP: "medium",
  SUPPORT_CONTENT_DUPLICATE: "medium",
  SUPPORT_CONTENT_ORPHAN: "low",
  MIGRATION_GAP: "medium",
  INVALID_REDIRECT: "high",
  REDIRECT_CHAIN: "medium",
  LEGACY_TRAFFIC_RISK: "medium",
  CATEGORY_GAP: "medium",
  CATEGORY_IMBALANCE: "info",
  PRODUCT_ECOSYSTEM_GAP: "medium",
  OUTDATED_CONTENT: "medium",
  SCHEDULED_UNSAFE: "critical",
  WORKFLOW_STUCK: "medium",
  APPROVAL_BACKLOG: "low",
  ONBOARDING_GAP: "medium",
  CATALOGUE_QUALITY: "high",
  SEARCH_DECAY: "medium",
  HIGH_IMPRESSION_WEAK_PAGE: "high",
  UNPUBLISHED_LINK_TARGET: "high",
  MISSING_PRIVACY_POLICY: "critical",
  MISSING_TERMS: "critical",
  MISSING_COOKIE_POLICY: "high",
  MISSING_AFFILIATE_DISCLOSURE: "critical",
  MISSING_CONTACT: "high",
  MISSING_EDITORIAL_METHODOLOGY: "high",
  LEGAL_CONFIGURATION_INCOMPLETE: "critical",
  UNCLASSIFIED_COOKIE: "high",
  CONSENT_SCRIPT_BYPASS: "critical",
  NEWSLETTER_WITHOUT_CONSENT_COPY: "high",
  NEWSLETTER_UNSUBSCRIBE_MISSING: "high",
  COOKIE_SETTINGS_UNAVAILABLE: "high",
  OUTDATED_LEGAL_POLICY: "medium",
  SITE_LAUNCH_NOT_READY: "critical",
};

export const defaultRemediationByType: Record<
  AuditIssueType,
  { action: RemediationAction; classification: RemediationClass }
> = {
  INVALID_SCHEMA: { action: "manual-review", classification: "MANUAL_REVIEW" },
  MISSING_REQUIRED_DATA: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  BROKEN_REFERENCE: { action: "manual-review", classification: "AUTO_SAFE" },
  DUPLICATE_ID: { action: "manual-review", classification: "MANUAL_REVIEW" },
  DUPLICATE_SLUG: { action: "fix-canonical", classification: "MANUAL_REVIEW" },
  INVALID_STATE: { action: "manual-review", classification: "MANUAL_REVIEW" },
  INVALID_RELATIONSHIP: {
    action: "relationship-review",
    classification: "MANUAL_REVIEW",
  },
  MISSING_RELATIONSHIP: {
    action: "relationship-review",
    classification: "AGENT_SAFE",
  },
  UNSUPPORTED_FACT: {
    action: "research-refresh",
    classification: "AGENT_SAFE",
  },
  UNVERIFIED_NUMBER: {
    action: "research-refresh",
    classification: "AGENT_SAFE",
  },
  STALE_CRITICAL_FACT: {
    action: "research-refresh",
    classification: "AGENT_SAFE",
  },
  CONFLICTING_FACTS: {
    action: "research-refresh",
    classification: "MANUAL_REVIEW",
  },
  RESEARCH_GAP: { action: "research-refresh", classification: "AGENT_SAFE" },
  SOURCE_QUALITY: { action: "research-refresh", classification: "MANUAL_REVIEW" },
  SOURCE_DIVERSITY: {
    action: "research-refresh",
    classification: "MANUAL_REVIEW",
  },
  PRICING_GAP: { action: "run-pricing-agent", classification: "AGENT_SAFE" },
  PRICING_PROSE_MISMATCH: {
    action: "run-pricing-agent",
    classification: "AGENT_SAFE",
  },
  PRICING_STALE: { action: "run-pricing-agent", classification: "AGENT_SAFE" },
  FAKE_TESTING_CLAIM: {
    action: "editorial-refresh",
    classification: "MANUAL_REVIEW",
  },
  EDITORIAL_METHOD_MISMATCH: {
    action: "editorial-refresh",
    classification: "MANUAL_REVIEW",
  },
  METHODOLOGY_REFRESH_RECOMMENDED: {
    action: "editorial-refresh",
    classification: "AGENT_SAFE",
  },
  INVALID_SCORE: { action: "manual-review", classification: "MANUAL_REVIEW" },
  RANKING_INTEGRITY: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  AFFILIATE_BIAS: { action: "manual-review", classification: "MANUAL_REVIEW" },
  THIN_CONTENT: { action: "run-review-agent", classification: "AGENT_SAFE" },
  INCONSISTENT_PRODUCT_DATA: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  INCONSISTENT_EDITORIAL_POSITION: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  COMPARISON_IMBALANCE: {
    action: "run-comparison-agent",
    classification: "AGENT_SAFE",
  },
  COMPARISON_EVIDENCE_IMBALANCE: {
    action: "run-comparison-agent",
    classification: "AGENT_SAFE",
  },
  BEST_PAGE_COVERAGE_GAP: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  EVALUATION_GAP: { action: "manual-review", classification: "MANUAL_REVIEW" },
  MISSING_ALT_CONTEXT: {
    action: "run-alternatives-agent",
    classification: "AGENT_SAFE",
  },
  GENERIC_AI_PROSE: {
    action: "editorial-refresh",
    classification: "AGENT_SAFE",
  },
  UNSUPPORTED_SUPERLATIVE: {
    action: "editorial-refresh",
    classification: "AGENT_SAFE",
  },
  USER_REVIEW_CLAIM: {
    action: "editorial-refresh",
    classification: "MANUAL_REVIEW",
  },
  REPETITION: { action: "editorial-refresh", classification: "AGENT_SAFE" },
  TEMPLATE_DUPLICATION: {
    action: "editorial-refresh",
    classification: "MANUAL_REVIEW",
  },
  BROKEN_INTERNAL_LINK: {
    action: "add-internal-links",
    classification: "AUTO_SAFE",
  },
  ORPHAN_CONTENT: {
    action: "add-internal-links",
    classification: "AGENT_SAFE",
  },
  LINK_CONCENTRATION: {
    action: "add-internal-links",
    classification: "MANUAL_REVIEW",
  },
  DUPLICATE_INTENT: {
    action: "fix-canonical",
    classification: "MANUAL_REVIEW",
  },
  CANNIBALIZATION: { action: "manual-review", classification: "MANUAL_REVIEW" },
  INVALID_CANONICAL: {
    action: "fix-canonical",
    classification: "AUTO_SAFE",
  },
  SEO_METADATA_INVALID: {
    action: "editorial-refresh",
    classification: "AGENT_SAFE",
  },
  STRUCTURED_DATA_ISSUE: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  TITLE_ISSUE: { action: "editorial-refresh", classification: "AGENT_SAFE" },
  META_DESCRIPTION_ISSUE: {
    action: "editorial-refresh",
    classification: "AGENT_SAFE",
  },
  H1_TITLE_MISMATCH: {
    action: "editorial-refresh",
    classification: "AGENT_SAFE",
  },
  PAGE_PURPOSE_MISMATCH: {
    action: "editorial-refresh",
    classification: "MANUAL_REVIEW",
  },
  MISSING_DISCLOSURE: {
    action: "fix-disclosure",
    classification: "AUTO_SAFE",
  },
  CTA_BUDGET_EXCEEDED: {
    action: "editorial-refresh",
    classification: "MANUAL_REVIEW",
  },
  RAW_AFFILIATE_URL: {
    action: "fix-disclosure",
    classification: "AUTO_SAFE",
  },
  AFFILIATE_LINK_HEALTH: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  MISSING_AFFILIATE_DESTINATION: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  MALFORMED_AFFILIATE_URL: {
    action: "manual-review",
    classification: "AUTO_SAFE",
  },
  INACTIVE_AFFILIATE_USED: {
    action: "manual-review",
    classification: "AUTO_SAFE",
  },
  MULTIPLE_DEFAULT_DESTINATIONS: {
    action: "fix-canonical",
    classification: "AUTO_SAFE",
  },
  EXPIRED_PROMOTION_VISIBLE: {
    action: "manual-review",
    classification: "AUTO_SAFE",
  },
  UNVERIFIED_PROMOTION: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  STALE_PROMOTION: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  BROKEN_PROMOTION_DESTINATION: {
    action: "manual-review",
    classification: "AUTO_SAFE",
  },
  PROMOTION_PRICE_CONFLICT: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  PROMOTION_CONFLICT: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  MISSING_CTA_FALLBACK: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  SUPPORTING_KNOWLEDGE_GAP: {
    action: "editorial-refresh",
    classification: "MANUAL_REVIEW",
  },
  ANCHOR_SUPPORT_GAP: {
    action: "add-internal-links",
    classification: "MANUAL_REVIEW",
  },
  SUPPORT_CONTENT_DUPLICATE: {
    action: "fix-canonical",
    classification: "MANUAL_REVIEW",
  },
  SUPPORT_CONTENT_ORPHAN: {
    action: "add-internal-links",
    classification: "AGENT_SAFE",
  },
  MIGRATION_GAP: { action: "migration-review", classification: "MANUAL_REVIEW" },
  INVALID_REDIRECT: {
    action: "fix-redirect",
    classification: "MANUAL_REVIEW",
  },
  REDIRECT_CHAIN: { action: "fix-redirect", classification: "MANUAL_REVIEW" },
  LEGACY_TRAFFIC_RISK: {
    action: "migration-review",
    classification: "MANUAL_REVIEW",
  },
  CATEGORY_GAP: { action: "category-onboard", classification: "MANUAL_REVIEW" },
  CATEGORY_IMBALANCE: { action: "none", classification: "MANUAL_REVIEW" },
  PRODUCT_ECOSYSTEM_GAP: {
    action: "run-review-agent",
    classification: "AGENT_SAFE",
  },
  OUTDATED_CONTENT: {
    action: "editorial-refresh",
    classification: "AGENT_SAFE",
  },
  SCHEDULED_UNSAFE: { action: "manual-review", classification: "MANUAL_REVIEW" },
  WORKFLOW_STUCK: { action: "workflow-resume", classification: "MANUAL_REVIEW" },
  APPROVAL_BACKLOG: { action: "manual-review", classification: "MANUAL_REVIEW" },
  ONBOARDING_GAP: { action: "manual-review", classification: "MANUAL_REVIEW" },
  CATALOGUE_QUALITY: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  SEARCH_DECAY: { action: "editorial-refresh", classification: "AGENT_SAFE" },
  HIGH_IMPRESSION_WEAK_PAGE: {
    action: "editorial-refresh",
    classification: "AGENT_SAFE",
  },
  UNPUBLISHED_LINK_TARGET: {
    action: "add-internal-links",
    classification: "AUTO_SAFE",
  },
  MISSING_PRIVACY_POLICY: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  MISSING_TERMS: { action: "manual-review", classification: "MANUAL_REVIEW" },
  MISSING_COOKIE_POLICY: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  MISSING_AFFILIATE_DISCLOSURE: {
    action: "fix-disclosure",
    classification: "MANUAL_REVIEW",
  },
  MISSING_CONTACT: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  MISSING_EDITORIAL_METHODOLOGY: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  LEGAL_CONFIGURATION_INCOMPLETE: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  UNCLASSIFIED_COOKIE: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  CONSENT_SCRIPT_BYPASS: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  NEWSLETTER_WITHOUT_CONSENT_COPY: {
    action: "fix-disclosure",
    classification: "MANUAL_REVIEW",
  },
  NEWSLETTER_UNSUBSCRIBE_MISSING: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  COOKIE_SETTINGS_UNAVAILABLE: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  OUTDATED_LEGAL_POLICY: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
  SITE_LAUNCH_NOT_READY: {
    action: "manual-review",
    classification: "MANUAL_REVIEW",
  },
};

/** Generic AI prose patterns — configurable, not blind bans. */
export const genericAiPhrases = [
  /game-?changing/i,
  /revolutionary/i,
  /robust solution/i,
  /\bseamlessly\b/i,
  /in today's fast-paced world/i,
  /whether you're a .{5,40},/i,
  /unlock the (full )?potential/i,
  /cutting-edge/i,
];

export const handsOnPatterns = [
  /\bwe tested\b/i,
  /\bwe tried\b/i,
  /\bin our testing\b/i,
  /\bhands-?on testing\b/i,
  /\bour team used\b/i,
  /\bwe used for weeks\b/i,
];

export const unsupportedSuperlatives = [
  /\bthe best\b/i,
  /\bfastest\b/i,
  /\bcheapest\b/i,
  /\bmost powerful\b/i,
  /\bindustry-leading\b/i,
];

export const userReviewClaimPatterns = [
  /\busers love\b/i,
  /\bcustomers say\b/i,
  /\breviewers consistently\b/i,
  /\beveryone loves\b/i,
];

export const rawAffiliateUrlPatterns = [
  /https?:\/\/[^/\s]+\/(click|aff|affiliate|partner|ref)=/i,
  /https?:\/\/[^/\s]*(shareasale|impact\.com|partnerstack|awin1)/i,
];
