import { z } from "zod";
import { BillingIntervalSchema } from "./pricing";
import {
  CurrencyCodeSchema,
  IsoDateSchema,
  IsoDateTimeSchema,
  SlugSchema,
} from "./primitives";

/**
 * Historical list-price observation — separate from current-state `Pricing`.
 * Never overwrite; append only when material fields change (or force periodic).
 *
 * productId / planId use catalogue slugs (SoftwareGlimpse identity).
 */
export const PriceBillingBasisSchema = z.enum([
  "per-user",
  "flat-rate",
  "usage-based",
  "custom",
  "contact-sales",
]);

export const PriceVerificationMethodSchema = z.enum([
  "vendor-page",
  "research-merge",
  "manual",
  "migration-from-current",
  "legacy-crm-history",
]);

export const PriceObservationConfidenceSchema = z.enum([
  "high",
  "medium",
  "low",
  "unverified",
]);

export const PriceObservationMetricKindSchema = z.enum([
  "starting-price",
  "plan-list",
  "rule",
]);

export const PriceObservationSchema = z.object({
  id: z.string().min(1),
  /** Catalogue software slug. */
  productId: SlugSchema,
  /**
   * Plan id when this row is plan-scoped; null for product-level starting price.
   */
  planId: z.string().min(1).nullable(),
  planName: z.string().min(1).optional(),
  observedAt: IsoDateSchema.or(IsoDateTimeSchema),
  /** List price in major units; null when contact-sales / custom without a published amount. */
  price: z.number().nonnegative().nullable(),
  currency: CurrencyCodeSchema,
  billingPeriod: BillingIntervalSchema,
  billingBasis: PriceBillingBasisSchema,
  perUser: z.boolean(),
  minimumUsers: z.number().int().positive().nullable().optional(),
  /** Primary human-readable source label or source id. */
  source: z.string().min(1),
  sourceIds: z.array(z.string()).default([]),
  verificationMethod: PriceVerificationMethodSchema,
  confidence: PriceObservationConfidenceSchema,
  notes: z.string().optional(),
  categorySlug: SlugSchema.optional(),
  metricKind: PriceObservationMetricKindSchema.default("starting-price"),
});

export type PriceBillingBasis = z.infer<typeof PriceBillingBasisSchema>;
export type PriceVerificationMethod = z.infer<
  typeof PriceVerificationMethodSchema
>;
export type PriceObservationConfidence = z.infer<
  typeof PriceObservationConfidenceSchema
>;
export type PriceObservationMetricKind = z.infer<
  typeof PriceObservationMetricKindSchema
>;
export type PriceObservation = z.infer<typeof PriceObservationSchema>;

export const ProductPriceHistoryFileSchema = z.object({
  productId: SlugSchema,
  observations: z.array(PriceObservationSchema).default([]),
});

export type ProductPriceHistoryFile = z.infer<
  typeof ProductPriceHistoryFileSchema
>;

/**
 * Material-change fingerprint — excludes notes, confidence, source labels.
 */
export function priceObservationFingerprint(
  obs: Pick<
    PriceObservation,
    | "productId"
    | "planId"
    | "price"
    | "currency"
    | "billingPeriod"
    | "billingBasis"
    | "perUser"
    | "minimumUsers"
    | "metricKind"
  >,
): string {
  return [
    obs.productId,
    obs.planId ?? "",
    obs.metricKind ?? "starting-price",
    obs.price == null ? "null" : String(obs.price),
    obs.currency,
    obs.billingPeriod,
    obs.billingBasis,
    obs.perUser ? "1" : "0",
    obs.minimumUsers == null ? "" : String(obs.minimumUsers),
  ].join("|");
}

/** Series key for latest-lookup (one timeline per plan/metric/billing axis). */
export function priceObservationSeriesKey(
  obs: Pick<
    PriceObservation,
    "productId" | "planId" | "billingPeriod" | "billingBasis" | "metricKind"
  >,
): string {
  return [
    obs.productId,
    obs.planId ?? "",
    obs.metricKind ?? "starting-price",
    obs.billingPeriod,
    obs.billingBasis,
  ].join("|");
}
