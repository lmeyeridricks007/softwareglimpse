import type {
  CrmProductFit,
  FeatureAvailability,
  FitLevel,
} from "@/domain";
import type { IntegrationKindScoreKey } from "@/domain/recommendation/fit-values";

export type SnapshotFeatureSupport = {
  slug: string;
  availability: FeatureAvailability;
};

export type SnapshotIntegrationSupport = {
  slug: string;
  kind: IntegrationKindScoreKey;
};

export type SnapshotPricing = {
  startingPriceMonthly?: number;
  currency?: string;
  model?: string;
  hasFreePlan?: boolean;
  plans?: unknown[];
};

/**
 * Pure scoring input — no affiliate fields.
 * Built from Software + enrichment + crm-fit.
 */
export type ProductRecommendationSnapshot = {
  slug: string;
  name: string;
  primaryCategorySlug: string;
  secondaryCategorySlugs: string[];
  subcategorySlugs: string[];
  useCaseSlugs: string[];
  businessSizeSlugs: string[];
  businessTypeSlugs: string[];
  userPrioritySlugs?: string[];
  featureSupport: SnapshotFeatureSupport[];
  integrationSupport: SnapshotIntegrationSupport[];
  pricing?: SnapshotPricing;
  /** 0–1 research completeness signal. */
  researchCompleteness: number;
  hasFixtureResearch: boolean;
  fit: CrmProductFit;
};

export type EligibilityExclusion = {
  productSlug: string;
  reason: string;
  code:
    | "not-crm"
    | "wrong-category"
    | "required-feature-not-supported"
    | "insufficient-data";
};

export type EligibilityResult = {
  eligible: boolean;
  exclusions: EligibilityExclusion[];
};

export type DimensionScores = {
  useCaseFit: number | null;
  requiredFeatures: number | null;
  preferredFeatures: number | null;
  businessSizeFit: number | null;
  integrations: number | null;
  priorities: number | null;
  budgetFit: number | null;
  businessTypeFit: number | null;
  unknownDimensions: string[];
};

export type ScoredCandidate = {
  snapshot: ProductRecommendationSnapshot;
  matchScore: number;
  dimensionScores: DimensionScores;
  knownWeight: number;
  totalApplicableWeight: number;
  budgetFitLabel: "good" | "tight" | "over" | "unknown";
  estimatedMonthlyTotal?: number;
  estimatedCurrency?: string;
};

export type EmptyRecommendReason =
  | "no-crm-candidates"
  | "no-candidates"
  | "all-excluded"
  | "insufficient-data";

export { type FitLevel };
