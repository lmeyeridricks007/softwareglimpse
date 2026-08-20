import { z } from "zod";
import { CurrencyCodeSchema, SlugSchema } from "./primitives";

/**
 * Typed pricing rules — not one universal formula.
 * Calculators select and compose rules by product/plan.
 */
export const PricingRuleKindSchema = z.enum([
  "flat",
  "per-seat",
  "per-unit",
  "tiered",
  "usage",
  "addon",
  "minimum",
]);

export const PricingUnitSchema = z.enum([
  "seat",
  "contact",
  "user",
  "message",
  "call",
  "credit",
  "storage-gb",
  "location",
  "other",
]);

/**
 * Billing cadence — how often the customer is charged.
 * Distinct from amountPeriod (what the listed amount represents).
 */
export const BillingIntervalSchema = z.enum([
  "month",
  "year",
  "one-time",
  "custom",
]);

/**
 * What period the rule amount is quoted for (monthly-equivalent vs annual list price).
 * Example: Pipedrive Essential $14/seat with annual billing → amountPeriod=month, interval=year.
 */
export const AmountPeriodSchema = z.enum(["month", "year"]);

export type AmountPeriod = z.infer<typeof AmountPeriodSchema>;

export const FlatPricingRuleSchema = z.object({
  kind: z.literal("flat"),
  amount: z.number().nonnegative(),
  currency: CurrencyCodeSchema,
  interval: BillingIntervalSchema,
  amountPeriod: AmountPeriodSchema.default("month"),
});

export const PerSeatPricingRuleSchema = z.object({
  kind: z.literal("per-seat"),
  amountPerSeat: z.number().nonnegative(),
  currency: CurrencyCodeSchema,
  interval: BillingIntervalSchema,
  amountPeriod: AmountPeriodSchema.default("month"),
  minimumSeats: z.number().int().positive().optional(),
  /** Published seat cap (e.g. free tier up to 3). Plan is ineligible above this. */
  maximumSeats: z.number().int().positive().optional(),
});

export const PerUnitPricingRuleSchema = z.object({
  kind: z.literal("per-unit"),
  unit: PricingUnitSchema,
  amountPerUnit: z.number().nonnegative(),
  currency: CurrencyCodeSchema,
  interval: BillingIntervalSchema,
  amountPeriod: AmountPeriodSchema.default("month"),
  includedUnits: z.number().nonnegative().optional(),
});

export const TieredPricingRuleSchema = z.object({
  kind: z.literal("tiered"),
  unit: PricingUnitSchema,
  currency: CurrencyCodeSchema,
  interval: BillingIntervalSchema,
  amountPeriod: AmountPeriodSchema.default("month"),
  tiers: z
    .array(
      z.object({
        upTo: z.number().positive().nullable(),
        amountPerUnit: z.number().nonnegative(),
      }),
    )
    .min(1),
});

export const UsagePricingRuleSchema = z.object({
  kind: z.literal("usage"),
  unit: PricingUnitSchema,
  amountPerUnit: z.number().nonnegative(),
  currency: CurrencyCodeSchema,
  amountPeriod: AmountPeriodSchema.default("month"),
  includedUnits: z.number().nonnegative().optional(),
});

export const AddonPricingRuleSchema = z.object({
  kind: z.literal("addon"),
  addonId: z.string().min(1),
  name: z.string().min(1),
  amount: z.number().nonnegative(),
  currency: CurrencyCodeSchema,
  interval: BillingIntervalSchema,
  amountPeriod: AmountPeriodSchema.default("month"),
  unit: PricingUnitSchema.optional(),
});

export const MinimumPricingRuleSchema = z.object({
  kind: z.literal("minimum"),
  amount: z.number().nonnegative(),
  currency: CurrencyCodeSchema,
  interval: BillingIntervalSchema,
  amountPeriod: AmountPeriodSchema.default("month"),
});

export const PricingRuleSchema = z.discriminatedUnion("kind", [
  FlatPricingRuleSchema,
  PerSeatPricingRuleSchema,
  PerUnitPricingRuleSchema,
  TieredPricingRuleSchema,
  UsagePricingRuleSchema,
  AddonPricingRuleSchema,
  MinimumPricingRuleSchema,
]);

export type PricingRule = z.infer<typeof PricingRuleSchema>;

export const PricingPlanSchema = z.object({
  id: z.string().min(1),
  slug: SlugSchema,
  name: z.string().min(1),
  description: z.string().optional(),
  isFree: z.boolean().default(false),
  hasFreeTrial: z.boolean().optional(),
  trialDays: z.number().int().positive().optional(),
  /** Empty rules + contactSales → custom quote, not $0. */
  contactSales: z.boolean().optional(),
  rules: z.array(PricingRuleSchema).default([]),
  /** Opaque limits until we model them strongly per product family. */
  limits: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  highlighted: z.boolean().optional(),
});

export type PricingPlan = z.infer<typeof PricingPlanSchema>;

/**
 * Product pricing envelope. Omit or leave plans empty until researched.
 */
export const PricingSchema = z.object({
  currency: CurrencyCodeSchema.optional(),
  model: z
    .enum([
      "free",
      "freemium",
      "subscription",
      "usage",
      "one-time",
      "custom",
      "custom-quote",
      "hybrid",
      "unknown",
    ])
    .default("unknown"),
  hasFreePlan: z.boolean().optional(),
  hasFreeTrial: z.boolean().optional(),
  startingPriceMonthly: z.number().nonnegative().optional(),
  plans: z.array(PricingPlanSchema).default([]),
  notes: z.string().optional(),
  verifiedAt: z.string().optional(),
  sourceIds: z.array(z.string()).default([]),
});

export type Pricing = z.infer<typeof PricingSchema>;
