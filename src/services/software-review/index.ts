/**
 * Client-safe software-review exports.
 *
 * Intentionally does NOT re-export `buildSoftwareReviewModel` / `buildDeepReviewLayer`.
 * Those modules use node:fs via research stores — importing them from this barrel
 * would pull Node into client chunks (Turbopack) because hub client components
 * import types / hub helpers from `@/services/software-review`.
 *
 * Server pages must import the builder from:
 *   `@/services/software-review/build-review-model`
 */
export type {
  SoftwareReviewModel,
  ReviewNavItem,
  ReviewQuickFact,
  ReviewCriterion,
  ReviewFeatureCard,
  ReviewFeatureRow,
  ReviewCompetitorCard,
  ReviewPricingCompareRow,
  ReviewUseCaseCard,
  ReviewGuideCard,
  ReviewFaqItem,
  ReviewPublicationState,
} from "./build-review-model";
export type { DeepReviewLayer } from "./build-deep-review";
export {
  SOFTWARE_HUB_TABS,
  SOFTWARE_HUB_TAB_SLUGS,
  getSoftwareHubTab,
  isSoftwareHubTabSlug,
  softwareHubPath,
  FEATURE_HUB_CATEGORIES,
  type SoftwareHubTabId,
} from "./hub-tabs";
export {
  buildEvidenceCenterModel,
  filterEvidenceItems,
  EVIDENCE_CENTER_PAGE_SIZE,
  type EvidenceCenterModel,
  type EvidenceCenterFilter,
  type EvidenceCenterItem,
  type EvidenceCoverageSummary,
  type EvidenceFreshness,
} from "./evidence-center";
