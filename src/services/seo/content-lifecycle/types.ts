/**
 * Reusable SEO content lifecycle — separate from robots noindex.
 *
 * Philosophy: weak page → preserve → improve → validate → promote to indexable.
 * NOINDEX remains a robots directive only; it is not a business lifecycle state.
 * RETIRED is reserved for genuinely obsolete, invalid, or duplicate pages.
 */

export const CONTENT_LIFECYCLE_VERSION = "1.0.0";

export type ContentLifecycleState =
  | "INDEXABLE"
  | "IMPROVE"
  | "IMPROVING"
  | "READY_FOR_REVIEW"
  | "INDEXABLE_READY"
  | "MANUAL_REVIEW"
  | "RETIRED";

/** Lifecycle states that may temporarily use robots noindex. */
export const LIFECYCLE_NOINDEX_STATES: ReadonlySet<ContentLifecycleState> =
  new Set([
    "IMPROVE",
    "IMPROVING",
    "READY_FOR_REVIEW",
    "INDEXABLE_READY",
    "MANUAL_REVIEW",
    "RETIRED",
  ]);

export type ImprovementReason =
  | "INSUFFICIENT_UNIQUE_VALUE"
  | "TEMPLATE_HEAVY"
  | "SEMANTIC_TEMPLATE_RISK"
  | "WEAK_SEARCH_INTENT"
  | "MISSING_PRICING"
  | "MISSING_PRODUCT_DATA"
  | "WEAK_DECISION_SUPPORT"
  | "MISSING_INTERNAL_LINKS"
  | "THIN_EXPLAINER"
  | "WEAK_COMPARISON_RELATIONSHIP"
  | "OUTDATED"
  | "MISSING_SOURCES"
  | "LOW_EVIDENCE"
  | "DUPLICATE_INTENT"
  | "OTHER";

export type RemediationRequirement =
  | "product_specific_analysis"
  | "data_backed_comparison"
  | "category_specific_guidance"
  | "unique_scenarios"
  | "pricing"
  | "evidence_sources"
  | "relevant_incoming_links"
  | "relevant_hub_membership"
  | "contextual_outgoing_links"
  | "declare_competitive_relationship"
  | "strengthen_verdict_and_best_for"
  | "refresh_stale_data"
  | "add_product_data_coverage"
  | "editorial_distinctness_review"
  | "merge_or_retire_duplicate";

export type ContentLifecycleKind = "guide" | "comparison";

export type ContentLifecycleEntry = {
  kind: ContentLifecycleKind;
  slug: string;
  /** Explicit workflow override (IMPROVING / READY_FOR_REVIEW / INDEXABLE / RETIRED). */
  lifecycle: ContentLifecycleState;
  /** When true, treat as seo.indexable for runtime gates without editing seed files. */
  indexable?: boolean;
  promotedAt?: string;
  previousLifecycle?: ContentLifecycleState;
  passedReasons?: string[];
  notes?: string;
  updatedAt: string;
};

export type ContentLifecycleStoreFile = {
  version: string;
  updatedAt: string;
  entries: Record<string, ContentLifecycleEntry>;
};

export type CanPromoteResult = {
  ok: boolean;
  kind: ContentLifecycleKind;
  slug: string;
  lifecycle: ContentLifecycleState;
  reasons: ImprovementReason[];
  remediation: RemediationRequirement[];
  /** Human-readable gate notes (why it passed or what remains). */
  detail: string[];
  alreadyIndexable: boolean;
};

export type PromoteResult = {
  ok: boolean;
  entry: ContentLifecycleEntry | null;
  detail: string[];
};

export type LifecycleSummaryCounts = {
  INDEXABLE: number;
  IMPROVE: number;
  IMPROVING: number;
  READY_FOR_REVIEW: number;
  INDEXABLE_READY: number;
  MANUAL_REVIEW: number;
  RETIRED: number;
};

export function emptyLifecycleSummaryCounts(): LifecycleSummaryCounts {
  return {
    INDEXABLE: 0,
    IMPROVE: 0,
    IMPROVING: 0,
    READY_FOR_REVIEW: 0,
    INDEXABLE_READY: 0,
    MANUAL_REVIEW: 0,
    RETIRED: 0,
  };
}

export function lifecycleEntryKey(
  kind: ContentLifecycleKind,
  slug: string,
): string {
  return `${kind}:${slug}`;
}
