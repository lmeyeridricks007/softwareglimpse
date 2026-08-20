import type {
  FeatureSupport,
  Pricing,
  PricingPlan,
} from "@/domain";

/**
 * Pure pricing input — no affiliate, no React.
 * Built from Software + enrichment via build-snapshot.
 */
export type PricingSnapshot = {
  productSlug: string;
  name: string;
  primaryCategorySlug: string;
  pricing?: Pricing;
  featureSupport: FeatureSupport[];
  pricingCheckedAt?: string;
  hasFixtureResearch: boolean;
  sourceIds: string[];
  /** Optional catalogue logo — never invented; omitted when missing. */
  logo?: { src: string; alt: string };
};

export type EvaluatedRuleCost = {
  billingPeriodMoney: import("@/domain/money").Money;
  monthlyEquivalent: import("@/domain/money").Money;
  monthlyCashCost?: import("@/domain/money").Money;
  annualCost: import("@/domain/money").Money;
  components: import("@/domain/schemas/pricing-estimate").CostComponent[];
  assumptions: string[];
};

export type PlanCostResult = {
  plan: PricingPlan;
  billingPeriodMoney: import("@/domain/money").Money;
  monthlyEquivalent: import("@/domain/money").Money;
  monthlyCashCost?: import("@/domain/money").Money;
  annualCost: import("@/domain/money").Money;
  components: import("@/domain/schemas/pricing-estimate").CostComponent[];
  assumptions: string[];
  warnings: string[];
};

export type PlanResolutionKind =
  | "recommended"
  | "custom-quote"
  | "no-suitable-plan"
  | "unknown-coverage";

export type PlanResolution = {
  kind: PlanResolutionKind;
  plan?: PricingPlan;
  warnings: string[];
  explanation?: string;
};

export type EligibilityResult = {
  status: import("@/domain/schemas/pricing-estimate").PricingEligibilityStatus;
  reasons: string[];
  stale: boolean;
};

export type CompareSortMode = "lowest-cost" | "input-order" | "finder-order";

export type CalculateOptions = {
  now?: Date;
};

export type CompareOptions = CalculateOptions & {
  sortMode?: CompareSortMode;
  /** Slug order for finder-order sort. */
  finderOrderSlugs?: string[];
};
