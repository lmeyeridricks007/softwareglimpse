import { z } from "zod";
import { CurrencyCodeSchema, SlugSchema } from "./primitives";
import { RecommendationConfidenceSchema } from "./finder";

/**
 * Eligibility before/alongside calculation.
 * STALE_DATA can combine with a calculated estimate (status still calculated/partial).
 */
export const PricingEligibilityStatusSchema = z.enum([
  "CALCULABLE",
  "PARTIALLY_CALCULABLE",
  "CUSTOM_QUOTE",
  "INSUFFICIENT_DATA",
  "STALE_DATA",
]);

export type PricingEligibilityStatus = z.infer<
  typeof PricingEligibilityStatusSchema
>;

export const ProductCostStatusSchema = z.enum([
  "calculated",
  "partial",
  "custom-quote",
  "insufficient-data",
  "no-suitable-plan",
]);

export type ProductCostStatus = z.infer<typeof ProductCostStatusSchema>;

export const CostComponentKindSchema = z.enum([
  "base",
  "seat",
  "unit",
  "tiered",
  "usage",
  "addon",
  "minimum",
  "other",
]);

export type CostComponentKind = z.infer<typeof CostComponentKindSchema>;

export const MoneySchema = z.object({
  amountMinor: z.number().int(),
  currency: CurrencyCodeSchema,
});

export const CostComponentSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  money: MoneySchema,
  kind: CostComponentKindSchema,
});

export type CostComponent = z.infer<typeof CostComponentSchema>;

export const ProductCostEstimateSchema = z.object({
  productSlug: SlugSchema,
  productName: z.string().min(1),
  status: ProductCostStatusSchema,
  recommendedPlan: z
    .object({
      id: z.string().min(1),
      slug: SlugSchema,
      name: z.string().min(1),
    })
    .optional(),
  /** Normalized monthly run-rate for comparison (not always cash due that month). */
  monthlyEquivalent: MoneySchema.optional(),
  /** Cash due if billed monthly; omitted when only annual billing applies. */
  monthlyCashCost: MoneySchema.optional(),
  /** Cash due for a year at the selected billing cadence. */
  annualCost: MoneySchema.optional(),
  currency: CurrencyCodeSchema.optional(),
  components: z.array(CostComponentSchema).default([]),
  assumptions: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
  confidence: RecommendationConfidenceSchema,
  pricingVerifiedAt: z.string().optional(),
  sourceIds: z.array(z.string()).default([]),
  eligibilityStatus: PricingEligibilityStatusSchema.optional(),
  explanation: z.string().optional(),
});

export type ProductCostEstimate = z.infer<typeof ProductCostEstimateSchema>;

export const ProductCostComparisonSchema = z.object({
  requirements: z.record(z.string(), z.unknown()),
  sortMode: z.enum(["lowest-cost", "input-order", "finder-order"]),
  results: z.array(ProductCostEstimateSchema),
  currencyGroups: z.array(CurrencyCodeSchema).default([]),
  notes: z.array(z.string()).default([]),
});

export type ProductCostComparison = z.infer<typeof ProductCostComparisonSchema>;
