/**
 * Software entity rehab — field audit + decision-hub overlays from canonical
 * catalogue / research / editorial sources only. Never fabricate facts.
 */

export const SOFTWARE_ENRICHMENT_VERSION = "1.0.0";

export type FieldStatus = "PASS" | "PARTIAL" | "MISSING" | "UNKNOWN";

export type SoftwareFieldId =
  | "name"
  | "product_status"
  | "canonical_vendor"
  | "category"
  | "description"
  | "target_audience"
  | "use_cases"
  | "capabilities"
  | "pricing"
  | "plans"
  | "free_plan"
  | "trial"
  | "integrations"
  | "alternatives"
  | "competitors"
  | "affiliate"
  | "source_provenance"
  | "verification_date";

export type SoftwareFieldAuditItem = {
  field: SoftwareFieldId;
  status: FieldStatus;
  detail: string;
  source: "seed" | "enrichment" | "assessment" | "review" | "none";
};

export type SoftwareFieldAudit = {
  slug: string;
  checkedAt: string;
  items: SoftwareFieldAuditItem[];
  passCount: number;
  partialCount: number;
  missingCount: number;
  unknownCount: number;
  score: number;
};

export type DependentPageRef = {
  kind: "guide" | "comparison" | "alternatives" | "best" | "pricing" | "tools";
  slug: string;
  path: string;
};

export type DecisionHubDraft = {
  whatItIs: string | null;
  bestFor: string[];
  notIdealFor: string[];
  coreCapabilities: string[];
  pricingSummary: string | null;
  keyTradeoffs: string[];
  alternatives: Array<{ slug: string; name: string }>;
  importantComparisons: Array<{ slug: string; title: string; href: string }>;
  relevantGuides: Array<{ slug: string; title: string; href: string }>;
  evidenceState: string;
  nextDecisionStep: string | null;
  /** Explicit gaps — never filled with invented copy. */
  missingSections: string[];
};

export type SoftwareEnrichmentOverlay = {
  slug: string;
  updatedAt: string;
  version: string;
  fieldAudit: SoftwareFieldAudit;
  decisionHub: DecisionHubDraft;
  dependents: DependentPageRef[];
  dependentsNeedingRefresh: DependentPageRef[];
  remediation: string[];
  notes: string[];
  /** True when overlay improved decision-hub surface from existing sources. */
  materiallyImproved: boolean;
};

export type SoftwareQueueItem = {
  slug: string;
  name: string;
  categorySlug: string | null;
  lane: "A" | "B" | "C";
  priorityScore: number;
  orderingReason: string;
  gscImpressions: number;
  gscClicks: number;
  dependentCount: number;
  comparisonCount: number;
  commercialScore: number;
  dataGapScore: number;
  evidenceGapScore: number;
  completenessPercent: number;
};
