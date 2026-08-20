/**
 * Best-page helpers that read research enrichment + approved assessments.
 * Never invents scores, prices, or feature support.
 */

import type { Software } from "@/domain";
import { formatMoney, fromMajor, type CurrencyCode } from "@/domain";
import { PricingSchema } from "@/domain";
import { loadEnrichment } from "@/data/research/store";
import { loadAssessment } from "@/data/editorial/store";
import { canonicalFeaturesSeed } from "@/data/seed/features";

function extractPricing(software: Software) {
  const enrichment = loadEnrichment(software.slug);
  const fromEnrichment = enrichment?.pricing;
  if (fromEnrichment != null) {
    const parsed = PricingSchema.safeParse(fromEnrichment);
    if (parsed.success) return { pricing: parsed.data, enrichment };
  }
  if (software.pricing) {
    return { pricing: software.pricing, enrichment };
  }
  return { pricing: null, enrichment };
}

/** Prefer /user/mo only when published rules are seat-based; otherwise /mo. */
function startingPriceSuffix(
  pricing: NonNullable<ReturnType<typeof extractPricing>["pricing"]>,
): "/user/mo" | "/mo" {
  const rules = (pricing.plans ?? []).flatMap((p) => p.rules ?? []);
  const hasPerSeat = rules.some((r) => r.kind === "per-seat");
  const hasFlatPaid = rules.some((r) => r.kind === "flat");
  if (hasPerSeat && !hasFlatPaid) return "/user/mo";
  if (hasPerSeat && hasFlatPaid) {
    // Mixed catalogues (rare): seat-led if any paid plan is primarily per-seat.
    const paidPlans = (pricing.plans ?? []).filter((p) => !p.isFree);
    const seatLed = paidPlans.some((p) =>
      (p.rules ?? []).some((r) => r.kind === "per-seat"),
    );
    const flatLed = paidPlans.every((p) =>
      (p.rules ?? []).every((r) => r.kind !== "per-seat"),
    );
    if (seatLed && !flatLed) return "/user/mo";
  }
  return "/mo";
}

function formatStartingPrice(
  pricing: NonNullable<ReturnType<typeof extractPricing>["pricing"]>,
): string | null {
  if (pricing.startingPriceMonthly == null) return null;
  const currency = (pricing.currency ?? "USD") as CurrencyCode;
  return `${formatMoney(fromMajor(pricing.startingPriceMonthly, currency))}${startingPriceSuffix(pricing)}`;
}

export function enrichmentPricingTeaser(software: Software): string | null {
  const { pricing } = extractPricing(software);
  if (!pricing) return null;
  if (pricing.startingPriceMonthly == null) {
    if (pricing.hasFreePlan) return "Free plan available";
    return null;
  }
  return formatStartingPrice(pricing);
}

export function enrichmentPricingDetail(
  software: Software,
): {
  startingPrice?: string | null;
  model?: string | null;
  freeTrial?: string | null;
  freePlan?: string | null;
  lastChecked?: string | null;
} | null {
  const { pricing, enrichment } = extractPricing(software);
  if (!pricing) return null;

  const starting =
    formatStartingPrice(pricing) ??
    (pricing.hasFreePlan ? "Free plan available" : null);

  const freePlan = pricing.hasFreePlan
    ? "Yes"
    : pricing.hasFreePlan === false
      ? "No"
      : null;

  const trialPlan = pricing.plans?.find(
    (p) => p.hasFreeTrial && typeof p.trialDays === "number",
  );
  const freeTrial =
    trialPlan?.trialDays != null
      ? `${trialPlan.trialDays}-day trial`
      : pricing.hasFreeTrial
        ? "Trial available"
        : pricing.hasFreeTrial === false
          ? "No trial listed"
          : null;

  const model =
    pricing.model === "subscription"
      ? "Subscription"
      : pricing.model
        ? String(pricing.model)
        : null;

  const lastChecked =
    enrichment?.domainCheckedAt?.pricing ??
    enrichment?.domainCheckedAt?.plans ??
    pricing.verifiedAt ??
    software.pricingVerifiedAt ??
    null;

  return {
    startingPrice: starting,
    model,
    freeTrial,
    freePlan,
    lastChecked: lastChecked ? String(lastChecked).slice(0, 10) : null,
  };
}

export function enrichmentFeatureCell(
  software: Software,
  featureSlug: string,
): "yes" | "limited" | "no" | "higher-plan" | "unknown" {
  const enrichment = loadEnrichment(software.slug);
  const row = enrichment?.featureSupport?.find(
    (f) => f.featureSlug === featureSlug,
  );
  if (!row) return "unknown";
  switch (row.availability) {
    case "supported":
      return "yes";
    case "limited":
    case "add-on":
      return "limited";
    case "higher-plan-only":
      return "higher-plan";
    case "not-supported":
      return "no";
    default:
      return "unknown";
  }
}

export function enrichmentFeatureName(featureSlug: string): string {
  const hit = canonicalFeaturesSeed.find((f) => f.slug === featureSlug);
  return hit?.name ?? featureSlug.replace(/-/g, " ");
}

export function approvedCriterionScores(software: Software): Array<{
  slug: string;
  name: string;
  score: number;
}> {
  const assessment = loadAssessment(software.slug);
  if (!assessment || assessment.status !== "approved") return [];

  return (assessment.criterionAssessments ?? [])
    .filter(
      (c) =>
        c.status === "approved" &&
        typeof c.score === "number" &&
        Number.isFinite(c.score),
    )
    .map((c) => ({
      slug: c.criterionSlug,
      name: c.criterionSlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      score: c.score,
    }));
}

export function enrichmentScreenshot(software: Software): {
  src: string;
  alt: string;
  caption: string;
  source?: string;
} | null {
  const enrichment = loadEnrichment(software.slug);
  const shots = enrichment?.screenshots ?? [];
  const preferred =
    shots.find(
      (s) =>
        s.kind !== "original-diagram" &&
        Boolean(s.caption) &&
        (s.featureIds?.includes("pipeline-management") ||
          /pipeline/i.test(s.id) ||
          /pipeline/i.test(s.alt)),
    ) ??
    shots.find((s) => s.kind !== "original-diagram" && Boolean(s.caption)) ??
    shots.find((s) => s.kind !== "original-diagram");

  if (!preferred?.src || !preferred.alt) return null;
  return {
    src: preferred.src,
    alt: preferred.alt,
    caption:
      preferred.caption ??
      preferred.annotation ??
      `${software.name} product interface (vendor asset).`,
    source: preferred.source,
  };
}

export function researchTransparencyForProducts(productSlugs: string[]): {
  productsEvaluated: number;
  featureSupportRows: number;
  productsWithPricing: number;
  productsWithScreenshots: number;
  officialSourceIds: number;
  lastRefresh: string | null;
} {
  let featureSupportRows = 0;
  let productsWithPricing = 0;
  let productsWithScreenshots = 0;
  const sourceIds = new Set<string>();
  let lastRefresh: string | null = null;

  for (const slug of productSlugs) {
    const enrichment = loadEnrichment(slug);
    if (!enrichment) continue;
    featureSupportRows += enrichment.featureSupport?.length ?? 0;
    if (enrichment.screenshots?.length) productsWithScreenshots += 1;
    for (const id of enrichment.sourceIds ?? []) sourceIds.add(id);

    const parsed = PricingSchema.safeParse(enrichment.pricing);
    if (
      parsed.success &&
      (parsed.data.startingPriceMonthly != null || parsed.data.hasFreePlan)
    ) {
      productsWithPricing += 1;
    }

    const checked =
      enrichment.domainCheckedAt?.pricing ?? enrichment.updatedAt ?? null;
    if (checked) {
      const day = String(checked).slice(0, 10);
      if (!lastRefresh || day > lastRefresh) lastRefresh = day;
    }
  }

  return {
    productsEvaluated: productSlugs.length,
    featureSupportRows,
    productsWithPricing,
    productsWithScreenshots,
    officialSourceIds: sourceIds.size,
    lastRefresh,
  };
}
