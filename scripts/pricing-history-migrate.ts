#!/usr/bin/env npx tsx
/**
 * Seed PriceObservation history from:
 * 1) legacy crm.json starting-price rows (preserved as-is)
 * 2) current enrichment Pricing as FIRST observation when no series exists
 *
 * Never invents historical prices. Never overwrites existing observations.
 *
 * Usage:
 *   npm run pricing:history:migrate
 *   npm run pricing:history:validate
 */
import { listResearchProducts, loadEnrichment } from "@/data/research/store";
import { getCrmPricingHistory } from "@/data/research/pricing-history";
import {
  appendPriceObservations,
  listAllPriceObservations,
  listPriceHistoryProductIds,
  loadProductPriceHistory,
} from "@/data/research/pricing-history/store";
import {
  PriceObservationSchema,
  PricingSchema,
  type PriceObservation,
} from "@/domain";
import { getSoftwareBySlug } from "@/data";
import {
  extractObservationsFromPricing,
  priceObservationSeriesKey,
  recordPriceObservations,
} from "@/services/pricing-history";
import { normalizePricingInput } from "@/services/pricing/build-snapshot";

/** Cutover date for migration-from-current seeds when verifiedAt is missing. */
export const PRICE_HISTORY_MIGRATION_DATE = "2026-09-06";

function migrateLegacyCrmHistory(): {
  appended: number;
  skipped: number;
} {
  const dataset = getCrmPricingHistory();
  let appended = 0;
  let skipped = 0;

  for (const row of dataset.snapshots) {
    const product = getSoftwareBySlug(row.productSlug);
    const planId = null;
    const obs: PriceObservation = PriceObservationSchema.parse({
      id: [
        row.productSlug,
        "product",
        "starting-price",
        "month",
        "per-user",
        row.observedAt.slice(0, 10),
        row.startingPriceMonthly == null
          ? "null"
          : String(row.startingPriceMonthly),
      ].join("__"),
      productId: row.productSlug,
      planId,
      planName: row.planName,
      observedAt: row.observedAt.slice(0, 10),
      price: row.startingPriceMonthly,
      currency: row.currency,
      billingPeriod: "month",
      billingBasis: "per-user",
      perUser: true,
      minimumUsers: null,
      source: row.sourceIds[0] ?? `${row.productSlug}-pricing`,
      sourceIds: row.sourceIds,
      verificationMethod: "legacy-crm-history",
      confidence: "medium",
      notes: row.billingNotes
        ? `${row.billingNotes} [legacy crm-pricing-history-v1]`
        : "Imported from crm-pricing-history-v1",
      categorySlug: dataset.categorySlug,
      metricKind: "starting-price",
    });

    // Preserve same-price re-verifies from legacy file (append by id only).
    const result = appendPriceObservations(row.productSlug, [obs]);
    appended += result.appended.length;
    skipped += result.skippedExistingIds.length;

    if (product && result.appended.length > 0) {
      // no-op — product lookup validates slug exists when possible
    }
  }

  return { appended, skipped };
}

function migrateCurrentPricingAsFirstObservation(): {
  productsTouched: number;
  appended: number;
  skippedUnchanged: number;
} {
  let productsTouched = 0;
  let appended = 0;
  let skippedUnchanged = 0;

  for (const productSlug of listResearchProducts()) {
    const enrichment = loadEnrichment(productSlug);
    if (!enrichment?.pricing) continue;

    const parsed = PricingSchema.safeParse(
      normalizePricingInput(enrichment.pricing),
    );
    if (!parsed.success) continue;

    const software = getSoftwareBySlug(productSlug);
    const categorySlug = software?.primaryCategorySlug;
    const verifiedAt = parsed.data.verifiedAt;
    const observedAt = verifiedAt
      ? verifiedAt.slice(0, 10)
      : PRICE_HISTORY_MIGRATION_DATE;

    const existing = loadProductPriceHistory(productSlug).observations;
    const existingSeries = new Set(
      existing.map((o) => priceObservationSeriesKey(o)),
    );

    const candidates = extractObservationsFromPricing({
      productId: productSlug,
      pricing: parsed.data,
      categorySlug,
      observedAt,
      verificationMethod: "migration-from-current",
      confidence: verifiedAt ? "medium" : "low",
      notes: `Migration seed from current Pricing state on ${PRICE_HISTORY_MIGRATION_DATE}. This is the first observation for the series when history was empty — not a vendor re-verify on this date unless verifiedAt matches.`,
    }).filter((c) => !existingSeries.has(priceObservationSeriesKey(c)));

    if (candidates.length === 0) continue;

    productsTouched += 1;
    const result = recordPriceObservations(candidates);
    appended += result.appended.length;
    skippedUnchanged += result.skippedUnchanged.length;
  }

  return { productsTouched, appended, skippedUnchanged };
}

export function validatePriceHistoryStore(): {
  ok: boolean;
  observationCount: number;
  productCount: number;
  errors: string[];
} {
  const errors: string[] = [];
  let observationCount = 0;

  for (const productId of listPriceHistoryProductIds()) {
    try {
      const file = loadProductPriceHistory(productId);
      if (file.productId !== productId) {
        errors.push(`${productId}: productId mismatch in file`);
      }
      const ids = new Set<string>();
      for (const obs of file.observations) {
        if (ids.has(obs.id)) {
          errors.push(`${productId}: duplicate observation id ${obs.id}`);
        }
        ids.add(obs.id);
        observationCount += 1;
      }
    } catch (err) {
      errors.push(
        `${productId}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  // Spot-check: all observations parse via listAll
  try {
    listAllPriceObservations();
  } catch (err) {
    errors.push(
      `listAllPriceObservations: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  return {
    ok: errors.length === 0,
    observationCount,
    productCount: listPriceHistoryProductIds().length,
    errors,
  };
}

function main() {
  const mode = process.argv.includes("--validate-only")
    ? "validate"
    : "migrate";

  if (mode === "migrate") {
    const legacy = migrateLegacyCrmHistory();
    console.log(
      `legacy crm.json → observations: appended=${legacy.appended} skippedExisting=${legacy.skipped}`,
    );

    const current = migrateCurrentPricingAsFirstObservation();
    console.log(
      `current Pricing first seeds: products=${current.productsTouched} appended=${current.appended} skippedUnchanged=${current.skippedUnchanged}`,
    );
  }

  const report = validatePriceHistoryStore();
  console.log(
    `pricing-history validate: products=${report.productCount} observations=${report.observationCount} errors=${report.errors.length}`,
  );
  for (const err of report.errors) {
    console.error(`[error] ${err}`);
  }

  if (!report.ok) process.exit(1);
}

main();
