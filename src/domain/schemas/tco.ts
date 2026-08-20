import { z } from "zod";
import { CurrencyCodeSchema, SlugSchema } from "./primitives";
import { BillingPreferenceSchema } from "./crm-requirements";

/**
 * Generic total-cost-of-ownership model — category-agnostic.
 * Licence/software amounts must come from the canonical pricing engine;
 * this schema only stores assumptions and non-licence cost items.
 * Affiliate status must never appear here.
 */

export const TCO_SESSION_VERSION = 1 as const;

export const TCOCostSourceTypeSchema = z.enum([
  "researched",
  "user-input",
  "calculated",
  "unknown",
]);
export type TCOCostSourceType = z.infer<typeof TCOCostSourceTypeSchema>;

export const TCOCostFrequencySchema = z.enum([
  "one-time",
  "monthly",
  "annual",
]);
export type TCOCostFrequency = z.infer<typeof TCOCostFrequencySchema>;

export const TCOCostCategorySchema = z.enum([
  "software",
  "implementation",
  "migration",
  "integrations",
  "training",
  "administration",
  "support",
  "addon",
  "custom",
]);
export type TCOCostCategory = z.infer<typeof TCOCostCategorySchema>;

export const TCOHorizonYearsSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);
export type TCOHorizonYears = z.infer<typeof TCOHorizonYearsSchema>;

export const TCOSeatYearSchema = z.object({
  year: z.number().int().min(1).max(5),
  users: z.number().int().min(1).max(10_000),
});
export type TCOSeatYear = z.infer<typeof TCOSeatYearSchema>;

export const TCOCostItemSchema = z.object({
  id: z.string().min(1),
  category: TCOCostCategorySchema,
  label: z.string().min(1),
  sourceType: TCOCostSourceTypeSchema,
  frequency: TCOCostFrequencySchema,
  /** Absent or null with sourceType unknown = not included in known TCO. */
  amountMinor: z.number().int().nullable().optional(),
  currency: CurrencyCodeSchema.optional(),
  startYear: z.number().int().min(1).max(5).optional(),
  endYear: z.number().int().min(1).max(5).optional(),
  /** Product slug when cost is product-scoped; omit for shared assumptions. */
  productId: SlugSchema.optional(),
  evidenceRef: z.string().optional(),
  userNote: z.string().max(500).optional(),
});
export type TCOCostItem = z.infer<typeof TCOCostItemSchema>;

export const ImplementationApproachSchema = z.enum([
  "self-service",
  "internal",
  "vendor",
  "partner",
  "mixed",
  "unsure",
]);
export type ImplementationApproach = z.infer<
  typeof ImplementationApproachSchema
>;

export const MigrationNeededSchema = z.enum([
  "none",
  "basic",
  "moderate",
  "complex",
  "unknown",
]);
export type MigrationNeeded = z.infer<typeof MigrationNeededSchema>;

export const TrainingMethodSchema = z.enum([
  "internal",
  "vendor",
  "partner",
  "self-service",
  "mixed",
]);
export type TrainingMethod = z.infer<typeof TrainingMethodSchema>;

export const IntegrationCostStatusSchema = z.enum([
  "native",
  "paid-addon",
  "external",
  "custom",
  "unknown",
]);
export type IntegrationCostStatus = z.infer<typeof IntegrationCostStatusSchema>;

export const SeatGrowthModeSchema = z.enum(["flat", "percent", "custom"]);
export type SeatGrowthMode = z.infer<typeof SeatGrowthModeSchema>;

/** Optional monetary field: undefined = not asked; null = explicitly unknown. */
export const OptionalMoneyMinorSchema = z.number().int().nullable().optional();

export const TCOImplementationInputSchema = z.object({
  approach: ImplementationApproachSchema.default("unsure"),
  /** External / vendor / partner implementation fee. */
  externalCostMinor: OptionalMoneyMinorSchema,
  internalHours: z.number().nonnegative().optional(),
  internalHourlyCostMinor: z.number().int().nonnegative().optional(),
});
export type TCOImplementationInput = z.infer<
  typeof TCOImplementationInputSchema
>;

export const TCOMigrationInputSchema = z.object({
  needed: MigrationNeededSchema.default("unknown"),
  scopes: z.array(z.string()).default([]),
  externalCostMinor: OptionalMoneyMinorSchema,
  dataCleaningCostMinor: OptionalMoneyMinorSchema,
  internalHours: z.number().nonnegative().optional(),
  internalHourlyCostMinor: z.number().int().nonnegative().optional(),
});
export type TCOMigrationInput = z.infer<typeof TCOMigrationInputSchema>;

export const TCOIntegrationLineSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  status: IntegrationCostStatusSchema.default("unknown"),
  setupCostMinor: OptionalMoneyMinorSchema,
  recurringMonthlyMinor: OptionalMoneyMinorSchema,
  maintenanceHoursPerMonth: z.number().nonnegative().optional(),
});
export type TCOIntegrationLine = z.infer<typeof TCOIntegrationLineSchema>;

export const TCOTrainingInputSchema = z.object({
  method: TrainingMethodSchema.default("mixed"),
  externalCostMinor: OptionalMoneyMinorSchema,
  hoursPerUser: z.number().nonnegative().optional(),
  hourlyCostMinor: z.number().int().nonnegative().optional(),
});
export type TCOTrainingInput = z.infer<typeof TCOTrainingInputSchema>;

export const TCOAdministrationInputSchema = z.object({
  hoursPerWeek: z.number().nonnegative().optional(),
  ftePercent: z.number().min(0).max(100).optional(),
  hourlyCostMinor: z.number().int().nonnegative().optional(),
});
export type TCOAdministrationInput = z.infer<
  typeof TCOAdministrationInputSchema
>;

export const TCOSupportInputSchema = z.object({
  externalMonthlyMinor: OptionalMoneyMinorSchema,
  internalHoursPerMonth: z.number().nonnegative().optional(),
  internalHourlyCostMinor: z.number().int().nonnegative().optional(),
});
export type TCOSupportInput = z.infer<typeof TCOSupportInputSchema>;

export const TCOCustomCostSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(120),
  frequency: TCOCostFrequencySchema,
  amountMinor: z.number().int().nonnegative(),
  currency: CurrencyCodeSchema.optional(),
  startYear: z.number().int().min(1).max(5).default(1),
  endYear: z.number().int().min(1).max(5).optional(),
  notes: z.string().max(500).optional(),
});
export type TCOCustomCost = z.infer<typeof TCOCustomCostSchema>;

/**
 * Editable scenario assumptions. Software licence amounts are never stored here —
 * they are recomputed from the pricing engine.
 */
export const TCOScenarioSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(80).default("Base case"),
  productIds: z.array(SlugSchema).min(0).max(5).default([]),
  horizonYears: TCOHorizonYearsSchema.default(3),
  startingUsers: z.number().int().min(1).max(10_000).default(10),
  growthMode: SeatGrowthModeSchema.default("flat"),
  annualGrowthPercent: z.number().min(0).max(200).optional(),
  /** Year-index seats when growthMode is custom (length = horizonYears). */
  customSeats: z.array(z.number().int().min(1).max(10_000)).optional(),
  billingPreference: BillingPreferenceSchema.default("annual"),
  /** User-assumed negotiated discount; never presented as vendor pricing. */
  negotiatedDiscountPercent: z.number().min(0).max(90).default(0),
  /**
   * Optional per-product plan slug override (productId → planSlug).
   * When set, TCO prices that plan for seat counts instead of auto-resolving.
   * Omit / empty = auto (lowest qualifying plan for seats + billing).
   */
  planSelections: z.record(z.string(), z.string().min(1)).default({}),
  currency: CurrencyCodeSchema.default("EUR"),
  implementation: TCOImplementationInputSchema.default({
    approach: "unsure",
  }),
  migration: TCOMigrationInputSchema.default({
    needed: "none",
    scopes: [],
  }),
  integrations: z.array(TCOIntegrationLineSchema).default([]),
  training: TCOTrainingInputSchema.default({ method: "mixed" }),
  administration: TCOAdministrationInputSchema.default({}),
  support: TCOSupportInputSchema.default({}),
  customCosts: z.array(TCOCustomCostSchema).default([]),
});
export type TCOScenario = z.infer<typeof TCOScenarioSchema>;

export const TCOSessionSchema = z.object({
  version: z.literal(TCO_SESSION_VERSION).default(TCO_SESSION_VERSION),
  categorySlug: SlugSchema.default("crm"),
  decisionProfileLinked: z.boolean().default(false),
  activeScenarioId: z.string().min(1),
  scenarios: z.array(TCOScenarioSchema).min(1),
  /** Product focused in live sidebar / results. */
  focusProductId: SlugSchema.optional(),
  wizardStepId: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type TCOSession = z.infer<typeof TCOSessionSchema>;

/** Computed yearly row — engine output, not persisted. */
export type TCOYearBreakdown = {
  year: number;
  users: number;
  byCategory: Partial<Record<TCOCostCategory, number>>;
  knownTotalMinor: number;
};

export type TCOUnknownItem = {
  id: string;
  category: TCOCostCategory;
  label: string;
};

export type TCOCategoryTotal = {
  category: TCOCostCategory;
  amountMinor: number;
  sourceType: TCOCostSourceType;
  items: TCOCostItem[];
};

export type TCOProductResult = {
  productId: string;
  productName: string;
  currency: string;
  status:
    | "calculated"
    | "partial"
    | "custom-quote"
    | "insufficient-data"
    | "no-suitable-plan";
  qualifyingPlanName?: string;
  qualifyingPlanSlug?: string;
  softwareSourceIds: string[];
  pricingVerifiedAt?: string;
  /** Known TCO across the horizon (excludes unknowns). */
  knownTcoMinor: number;
  unknownItems: TCOUnknownItem[];
  categoryTotals: TCOCategoryTotal[];
  yearly: TCOYearBreakdown[];
  costItems: TCOCostItem[];
  /** Share of known TCO by broad buckets (0–1). */
  shares: {
    software: number;
    implementationMigration: number;
    operational: number;
  };
  perUser: {
    knownTcoMinor: number;
    avgMonthlyMinor: number;
    softwareMonthlyMinor: number | null;
  };
  confidenceLabel: "researched" | "mixed" | "assumption-heavy" | "incomplete";
};

export type TCOComparisonDelta = {
  productId: string;
  productName: string;
  knownTcoMinor: number;
  deltaVsLowestMinor: number;
};

export type TCOComputeResult = {
  scenario: TCOScenario;
  seatPlan: TCOSeatYear[];
  currency: string;
  currencyWarning?: string;
  products: TCOProductResult[];
  comparison: TCOComparisonDelta[];
  assumptions: Array<{ id: string; label: string; value: string }>;
};
