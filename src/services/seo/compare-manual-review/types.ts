/**
 * MANUAL_REVIEW comparison backlog triage — evidence-backed classification.
 * Never fabricates competitive relationships; never auto-deletes pairs.
 */

export const COMPARE_MANUAL_REVIEW_VERSION = "2.0.0";

/**
 * Buyer-relationship classes (user-facing).
 * Valid* classes may move to IMPROVE/enrichment; others stay constrained.
 */
export type ManualReviewClass =
  | "DIRECT_COMPETITOR"
  | "ALTERNATIVE"
  | "CROSS_CATEGORY_DECISION"
  | "SPECIALIST_VS_GENERALIST"
  | "WEAK_RELATIONSHIP"
  | "MISSING_DATA"
  | "NONSENSICAL";

/** Classes that may enqueue enrichment (move to IMPROVE). */
export const ENRICHABLE_CLASSES: ReadonlySet<ManualReviewClass> = new Set([
  "DIRECT_COMPETITOR",
  "ALTERNATIVE",
  "CROSS_CATEGORY_DECISION",
  "SPECIALIST_VS_GENERALIST",
]);

export type ManualReviewDecision =
  | "ENQUEUE_ENRICHMENT"
  | "LEAVE_IMPROVE_WITH_REMEDIATION"
  | "BLOCK_PENDING_CATALOGUE"
  | "PRESERVE_NOINDEX_REVIEW"
  | "CANDIDATE_RETIRE_NOINDEX";

export type RelationshipEvidenceFlag =
  | "same_category"
  | "shared_use_cases"
  | "shared_audience"
  | "overlapping_capabilities"
  | "pricing_tier"
  | "integration_overlap"
  | "declared_competitor"
  | "declared_alternative"
  | "declared_comparable"
  | "best_list_cooccurrence"
  | "gsc_demand"
  | "gsc_direct_query"
  | "known_backlinks"
  | "secondary_category_overlap"
  | "missing_product"
  | "disjoint_use_cases"
  | "use_case_breadth_skew"
  | "related_job_family";

export type RelationshipEvidenceItem = {
  flag: RelationshipEvidenceFlag;
  present: boolean;
  detail: string;
  weight: number;
};

export type RelationshipEvidencePack = {
  slug: string;
  productA: string;
  productB: string;
  categorySlug: string | null;
  primaryCategoryA: string | null;
  primaryCategoryB: string | null;
  sameCategory: boolean;
  items: RelationshipEvidenceItem[];
  /** Sum of present item weights — catalogue + demand only. */
  evidenceScore: number;
  relationshipKind: string;
  catalogueSignalIds: string[];
  gscImpressions: number;
  gscClicks: number;
  gscPosition: number | null;
  gscHasDirectQuery: boolean;
  knownBacklinks: number;
  bestListCoOccurrence: boolean;
  missingProduct: boolean;
  /** Both products document use cases with empty intersection. */
  disjointUseCases: boolean;
  /** Absolute use-case count difference when both have use cases. */
  useCaseBreadthSkew: number;
  useCasesA: string[];
  useCasesB: string[];
  /** Catalogue job-family overlap (HRIS↔HCM, enrichment↔prospecting, etc.). */
  relatedJobFamily: boolean;
  jobFamiliesA: string[];
  jobFamiliesB: string[];
};

export type BuyerThesisDraft = {
  kind: string;
  label: string;
  rationale: string;
  supportedBy: string[];
};

export type ManualReviewTriageResult = {
  slug: string;
  url: string;
  productA: string;
  productB: string;
  classification: ManualReviewClass;
  decision: ManualReviewDecision;
  evidence: RelationshipEvidencePack;
  thesis: BuyerThesisDraft | null;
  remediation: string[];
  reasons: string[];
  /** Only true when NONSENSICAL and no GSC/backlink/best-list demand. */
  retireEligible: boolean;
  /** Lifecycle applied (when --apply). */
  appliedLifecycle?: "IMPROVE" | "MANUAL_REVIEW" | null;
};

export type ManualReviewReportSummary = {
  totalReviewed: number;
  byClass: Record<ManualReviewClass, number>;
  byDecision: Record<ManualReviewDecision, number>;
  enqueueEnrichment: number;
  leaveImprove: number;
  blockCatalogue: number;
  retireCandidates: number;
  preserveReview: number;
  appliedToImprove: number;
  retainedManualReview: number;
};

export type ManualReviewReport = {
  version: string;
  generatedAt: string;
  summary: ManualReviewReportSummary;
  results: ManualReviewTriageResult[];
  enrichmentQueueSlugs: string[];
  retireCandidates: string[];
  weakRelationshipSlugs: string[];
  missingDataSlugs: string[];
  nonsensicalSlugs: string[];
};
