import type {
  FeatureSupport,
  Pricing,
  ProductResearchEnrichment,
  Software,
} from "@/domain";
import { PricingSchema } from "@/domain";
import { getAllSoftwareUnfiltered, getSoftware } from "@/data/repositories/catalog";
import { loadEnrichment } from "@/data/research/store";
import { CRM_PRICING_CONFIG } from "@/data/config/pricing/crm-pricing-v1";
import type { PricingSnapshot } from "./types";

export type BuildPricingSnapshotInput = {
  software: Software;
  enrichment?: ProductResearchEnrichment | null;
};

/**
 * Build a pricing snapshot from Software + enrichment.
 * Strips affiliate — never copies affiliate onto the snapshot.
 */
export function buildPricingSnapshot(
  input: BuildPricingSnapshotInput,
): PricingSnapshot {
  const { software, enrichment } = input;
  // Intentionally ignore software.affiliate

  const pricing = extractPricing(software, enrichment);
  const featureSupport: FeatureSupport[] = enrichment?.featureSupport
    ? [...enrichment.featureSupport]
    : [];

  const sourceIds = [
    ...new Set([
      ...(enrichment?.sourceIds ?? []),
      ...(pricing?.sourceIds ?? []),
    ]),
  ];

  const pricingCheckedAt =
    enrichment?.domainCheckedAt?.pricing ??
    enrichment?.domainCheckedAt?.plans ??
    pricing?.verifiedAt ??
    software.pricingVerifiedAt;

  return {
    productSlug: software.slug,
    name: software.name,
    primaryCategorySlug: software.primaryCategorySlug,
    pricing,
    featureSupport,
    pricingCheckedAt,
    hasFixtureResearch: detectFixtureResearch(enrichment, pricing),
    sourceIds,
    logo: software.logo,
  };
}

/**
 * Pricing snapshots for a primary category slug (published by default).
 */
const snapshotListCache = new Map<string, PricingSnapshot[]>();

export function listPricingSnapshotsForCategory(
  primaryCategorySlug: string,
  opts?: { includeUnpublished?: boolean },
): PricingSnapshot[] {
  const key = `${primaryCategorySlug}:${opts?.includeUnpublished ? "all" : "pub"}`;
  const cached = snapshotListCache.get(key);
  if (cached) return cached;

  const software = opts?.includeUnpublished
    ? getAllSoftwareUnfiltered()
    : getSoftware();
  const snapshots = software
    .filter((s) => s.primaryCategorySlug === primaryCategorySlug)
    .slice()
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((s) =>
      buildPricingSnapshot({
        software: s,
        enrichment: loadEnrichment(s.slug),
      }),
    );
  snapshotListCache.set(key, snapshots);
  return snapshots;
}

/**
 * Primary CRM products only (primaryCategorySlug === crm).
 * Apollo (sales-intelligence) and others are excluded from the CRM pool.
 * Every published primary CRM with catalogue data is included — enrichment
 * may be empty, but the product still enters compareProductCosts.
 */
export function listCrmPricingSnapshots(opts?: {
  includeUnpublished?: boolean;
}): PricingSnapshot[] {
  return listPricingSnapshotsForCategory(
    CRM_PRICING_CONFIG.primaryCategorySlug,
    opts,
  );
}

/**
 * Published sales-intelligence products (Apollo, Lusha, Reply, …).
 */
export function listSalesIntelligencePricingSnapshots(opts?: {
  includeUnpublished?: boolean;
}): PricingSnapshot[] {
  return listPricingSnapshotsForCategory("sales-intelligence", opts);
}

/**
 * Published email-marketing products (GetResponse, Mailchimp, AWeber, …).
 */
export function listEmailMarketingPricingSnapshots(opts?: {
  includeUnpublished?: boolean;
}): PricingSnapshot[] {
  return listPricingSnapshotsForCategory("email-marketing", opts);
}

/**
 * Published marketing & growth products (Marketo, LearnWorlds, Kartra, …).
 */
export function listMarketingPricingSnapshots(opts?: {
  includeUnpublished?: boolean;
}): PricingSnapshot[] {
  return listPricingSnapshotsForCategory("marketing", opts);
}

/**
 * Published business-communications products (RingCentral, Dialpad, Aircall, …).
 */
export function listBusinessCommunicationsPricingSnapshots(opts?: {
  includeUnpublished?: boolean;
}): PricingSnapshot[] {
  return listPricingSnapshotsForCategory("business-communications", opts);
}

/**
 * Published HR / workforce / training products (Breezy HR, Connecteam, Jibble, Trainual, …).
 */
export function listHrPricingSnapshots(opts?: {
  includeUnpublished?: boolean;
}): PricingSnapshot[] {
  return listPricingSnapshotsForCategory("hr", opts);
}

/**
 * Published project-management products (monday.com, Asana, ClickUp, …).
 */
export function listProjectManagementPricingSnapshots(opts?: {
  includeUnpublished?: boolean;
}): PricingSnapshot[] {
  return listPricingSnapshotsForCategory("project-management", opts);
}

export function listEcommercePricingSnapshots(opts?: {
  includeUnpublished?: boolean;
}): PricingSnapshot[] {
  return listPricingSnapshotsForCategory("ecommerce", opts);
}

export function listAiPricingSnapshots(opts?: {
  includeUnpublished?: boolean;
}): PricingSnapshot[] {
  return listPricingSnapshotsForCategory("ai", opts);
}

export function listCustomerServicePricingSnapshots(opts?: {
  includeUnpublished?: boolean;
}): PricingSnapshot[] {
  return listPricingSnapshotsForCategory("customer-service", opts);
}

export function listItDevelopmentPricingSnapshots(opts?: {
  includeUnpublished?: boolean;
}): PricingSnapshot[] {
  return listPricingSnapshotsForCategory("it-development", opts);
}

/**
 * All CRM-category products including drafts (for CLI / research tooling).
 */
export function listAllCrmPricingSnapshots(): PricingSnapshot[] {
  const software = getAllSoftwareUnfiltered();
  return software
    .filter(
      (s) => s.primaryCategorySlug === CRM_PRICING_CONFIG.primaryCategorySlug,
    )
    .map((s) =>
      buildPricingSnapshot({
        software: s,
        enrichment: loadEnrichment(s.slug),
      }),
    );
}

function extractPricing(
  software: Software,
  enrichment?: ProductResearchEnrichment | null,
): Pricing | undefined {
  const fromEnrichment = enrichment?.pricing;
  if (fromEnrichment != null) {
    const parsed = PricingSchema.safeParse(normalizePricingInput(fromEnrichment));
    if (parsed.success) return parsed.data;
  }
  if (software.pricing) {
    const parsed = PricingSchema.safeParse(normalizePricingInput(software.pricing));
    if (parsed.success) return parsed.data;
  }
  return undefined;
}

/**
 * Normalize research-shaped pricing before Zod parse:
 * - `model: "custom-quote"` → `"custom"` (schema enum)
 * - plan-level `amountPerSeat` / `amount` with empty `rules` → synthesised rules
 *   (legacy SI Priority enrichments stored seat/plan prices outside `rules[]`)
 */
export function normalizePricingInput(raw: unknown): unknown {
  if (raw == null || typeof raw !== "object" || Array.isArray(raw)) return raw;
  const input = { ...(raw as Record<string, unknown>) };

  if (typeof input.model === "string") {
    const modelAliases: Record<string, string> = {
      "custom-quote": "custom",
      "quote-led": "custom",
      "per-seat": "subscription",
      flat: "subscription",
      tiered: "subscription",
    };
    const aliased = modelAliases[input.model];
    if (aliased) input.model = aliased;
  }

  if (!Array.isArray(input.plans)) return input;

  input.plans = input.plans.map((planRaw) => {
    if (planRaw == null || typeof planRaw !== "object" || Array.isArray(planRaw)) {
      return planRaw;
    }
    const plan = { ...(planRaw as Record<string, unknown>) };
    const rules = Array.isArray(plan.rules) ? [...plan.rules] : [];

    if (rules.length === 0 && plan.contactSales !== true) {
      const currency =
        typeof plan.currency === "string"
          ? plan.currency
          : typeof input.currency === "string"
            ? input.currency
            : "USD";
      const interval =
        plan.billingInterval === "year" || plan.interval === "year"
          ? "year"
          : "month";

      if (typeof plan.amountPerSeat === "number") {
        const unit = plan.unit;
        // LinkedIn-style per-license prices use unit=seat; many SI ladders
        // incorrectly stored flat monthly plan prices as amountPerSeat.
        if (unit === "seat" || unit === "user" || unit === "license") {
          rules.push({
            kind: "per-seat",
            amountPerSeat: plan.amountPerSeat,
            currency,
            interval,
            amountPeriod: "month",
          });
        } else {
          rules.push({
            kind: "flat",
            amount: plan.amountPerSeat,
            currency,
            interval,
            amountPeriod: "month",
          });
        }
      } else if (typeof plan.amount === "number") {
        rules.push({
          kind: "flat",
          amount: plan.amount,
          currency,
          interval,
          amountPeriod: "month",
        });
      }
      // Do not invent $0 rules for isFree plans with empty rules — leave them
      // non-calculable unless research published an explicit amount.
    }

    plan.rules = rules;
    delete plan.amountPerSeat;
    delete plan.amount;
    delete plan.currency;
    delete plan.interval;
    delete plan.billingInterval;
    delete plan.unit;
    return plan;
  });

  return input;
}

function detectFixtureResearch(
  enrichment?: ProductResearchEnrichment | null,
  pricing?: Pricing,
): boolean {
  if (enrichment?.sourceIds.some((id) => id.includes("fixture"))) return true;
  if (enrichment?.notes?.toLowerCase().includes("fixture")) return true;
  if (pricing?.notes?.toLowerCase().includes("fixture")) return true;
  if (pricing?.sourceIds?.some((id) => id.includes("fixture"))) return true;
  return (
    enrichment?.featureSupport.some((f) =>
      f.sourceIds.some((id) => id.includes("fixture")),
    ) ?? false
  );
}
