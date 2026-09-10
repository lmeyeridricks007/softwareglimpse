/** Evidence quality upgrade — normalize real sources; elevate only when policy allows. */

export const EVIDENCE_QUALITY_VERSION = "1.0.0";

export type EvidenceSourceKind =
  | "vendor_product"
  | "vendor_pricing"
  | "vendor_docs"
  | "feature"
  | "integration"
  | "other";

export type NormalizedEvidenceSource = {
  id: string;
  kind: EvidenceSourceKind;
  url: string | null;
  title: string | null;
  sourceType: string | null;
  authority: string | null;
  domains: string[];
  retrievedAt: string | null;
  verifiedAt: string | null;
  lastCheckedAt: string | null;
  confidence: string | null;
  status: string | null;
};

export type PlanEvidenceRow = {
  id: string;
  slug: string;
  name: string;
  isFree: boolean;
  contactSales: boolean;
  hasFreeTrial: boolean;
};

export type PricingVerificationResult = {
  attempted: boolean;
  verified: boolean;
  httpStatus: number | null;
  sourceId: string | null;
  sourceUrl: string | null;
  planNamesChecked: string[];
  planNamesFound: string[];
  planHitRatio: number;
  rejectReason: string | null;
  verifiedAt: string | null;
  /** True when enrichment stamp was written this run. */
  stampApplied: boolean;
  /** URLs actually fetched this run — used to avoid re-hitting blocks. */
  attemptedUrls?: string[];
};

export type ProductEvidencePack = {
  slug: string;
  name: string;
  categorySlug: string | null;
  generatedAt: string;
  version: string;
  evidenceLevelBefore: "researched" | "data_verified" | "hands_on_tested";
  evidenceLevelAfter: "researched" | "data_verified" | "hands_on_tested";
  promotedToDataVerified: boolean;
  sources: NormalizedEvidenceSource[];
  vendorSourceCount: number;
  pricingSourceCount: number;
  docsSourceCount: number;
  featureEvidenceCount: number;
  integrationEvidenceCount: number;
  plans: PlanEvidenceRow[];
  researchTimestamps: {
    enrichmentUpdatedAt: string | null;
    domainCheckedAt: Record<string, string>;
    enrichmentPricingVerifiedAt: string | null;
    enrichmentPricingSourceIds: string[];
    softwarePricingVerifiedAt: string | null;
    researchDate: string | null;
  };
  pricingVerification: PricingVerificationResult;
  dependentPages: Array<{
    kind: string;
    slug: string;
    path: string;
  }>;
  notes: string[];
};

export type LanguageQaHit = {
  path: string;
  pattern: string;
  excerpt: string;
  evidenceLevel: string | null;
};

export type EvidenceQualityReport = {
  version: string;
  generatedAt: string;
  waveId: string;
  priorityLimit: number;
  packsBuilt: number;
  pricingChecksAttempted: number;
  pricingChecksVerified: number;
  promotedToDataVerified: number;
  retainedResearched: number;
  alreadyDataVerified: number;
  languageHits: number;
  schemaQaOk: boolean;
  schemaQaNotes: string[];
  testingQueueTop10: Array<{
    rank: number;
    slug: string;
    name: string;
    evidencePriorityScore: number;
    comparisonCount: number;
    opportunityScore: number;
    impressions: number;
    evidenceLevel: string;
  }>;
  packs: ProductEvidencePack[];
  languageQa: LanguageQaHit[];
};
