import type {
  DetectedPriceChange,
  PriceMonitorGrowthSignal,
  RefreshCandidate,
} from "@/domain";
import { getSoftwareBySlug } from "@/data";
import { resolveAffectedPages } from "@/services/editorial/dependencies";
import { markDependentPagesRefreshNeeded } from "@/services/editorial/refresh";
import { recordChangeEvent } from "@/services/publishing/change-events";
import { resolveRefreshCandidates } from "@/services/publishing/refresh-resolver";
import { snapshotPricingHistory } from "@/services/pricing-history";
import { PricingSchema } from "@/domain";
import { loadEnrichment } from "@/data/research/store";
import { normalizePricingInput } from "@/services/pricing/build-snapshot";

export type PriceChangeImpactPage = {
  path: string;
  pageType:
    | "software-review"
    | "comparison"
    | "alternatives"
    | "best"
    | "tool"
    | "pricing"
    | "research"
    | "category"
    | "guide";
  slug: string;
  productId: string;
};

/**
 * Expand affected pages for a product price change (reviews, comparisons,
 * alternatives, best, pricing, tools, research, category).
 */
export function resolvePriceChangeImpactPages(
  productId: string,
): PriceChangeImpactPage[] {
  const software = getSoftwareBySlug(productId);
  const base: PriceChangeImpactPage[] = resolveAffectedPages(productId).map(
    (p) => ({
      path: p.path,
      pageType: p.pageType,
      slug: p.slug,
      productId,
    }),
  );

  const extra: PriceChangeImpactPage[] = [
    {
      path: "/research/",
      pageType: "research",
      slug: "research",
      productId,
    },
    {
      path: "/research/crm-pricing/",
      pageType: "research",
      slug: "crm-pricing",
      productId,
    },
    {
      path: "/research/crm-pricing-history/",
      pageType: "research",
      slug: "crm-pricing-history",
      productId,
    },
  ];

  if (software?.primaryCategorySlug) {
    extra.push({
      path: `/categories/${software.primaryCategorySlug}/`,
      pageType: "category",
      slug: software.primaryCategorySlug,
      productId,
    });
  }

  const seen = new Set(base.map((p) => p.path));
  for (const page of extra) {
    if (!seen.has(page.path)) {
      base.push(page);
      seen.add(page.path);
    }
  }
  return base;
}

export type ApplyConfirmedPriceChangeResult = {
  productId: string;
  changeEventId: string | null;
  refreshCandidates: RefreshCandidate[];
  markedReview: boolean;
  observationAppended: boolean;
  affectedPages: PriceChangeImpactPage[];
};

/**
 * CONFIRMED changes only: record publishing event, refresh candidates,
 * optional observation append, mark review refresh needed.
 * Never publishes content.
 */
export function applyConfirmedPriceChange(
  change: DetectedPriceChange,
  opts: { appendObservation?: boolean; markEditorial?: boolean } = {},
): ApplyConfirmedPriceChangeResult {
  const affectedPages = resolvePriceChangeImpactPages(change.productId);

  if (change.confidence !== "CONFIRMED") {
    return {
      productId: change.productId,
      changeEventId: null,
      refreshCandidates: [],
      markedReview: false,
      observationAppended: false,
      affectedPages,
    };
  }

  const event = recordChangeEvent({
    entityType: "software",
    entityId: change.productId,
    domain: "pricing",
    changeType: "pricing-updated",
    source: "price-change-monitor",
    severity:
      change.noteworthy ||
      (change.percentageChange != null && Math.abs(change.percentageChange) >= 15)
        ? "high"
        : "medium",
    details: {
      kind: change.kind,
      summary: change.summary,
      confidence: change.confidence,
      percentageChange: change.percentageChange ?? null,
      planId: change.planId ?? null,
      requiresHumanVerification: change.requiresHumanVerification,
    },
  });

  const refreshCandidates = resolveRefreshCandidates(event);

  let markedReview = false;
  if (opts.markEditorial !== false) {
    const mark = markDependentPagesRefreshNeeded(
      change.productId,
      `Price change monitor: ${change.summary}`,
    );
    markedReview = mark.markedReview;
  }

  let observationAppended = false;
  if (opts.appendObservation) {
    const enrichment = loadEnrichment(change.productId);
    const software = getSoftwareBySlug(change.productId);
    const raw = enrichment?.pricing ?? software?.pricing;
    if (raw) {
      const parsed = PricingSchema.safeParse(normalizePricingInput(raw));
      if (parsed.success) {
        const result = snapshotPricingHistory({
          productId: change.productId,
          pricing: parsed.data,
          categorySlug: software?.primaryCategorySlug,
          verificationMethod: "vendor-page",
          confidence: "high",
          notes: `Confirmed by price-change-monitor: ${change.kind}`,
        });
        observationAppended = result.appended.length > 0;
      }
    }
  }

  return {
    productId: change.productId,
    changeEventId: event.id,
    refreshCandidates,
    markedReview,
    observationAppended,
    affectedPages,
  };
}

export function buildGrowthSignalsFromChanges(
  changes: DetectedPriceChange[],
): PriceMonitorGrowthSignal[] {
  const signals: PriceMonitorGrowthSignal[] = [];
  const actionable = changes.filter(
    (c) =>
      c.confidence === "CONFIRMED" ||
      c.confidence === "LIKELY" ||
      c.confidence === "REQUIRES_REVIEW",
  );

  for (const change of actionable) {
    const pages = resolvePriceChangeImpactPages(change.productId);
    const boost =
      change.confidence === "CONFIRMED" && change.noteworthy
        ? "critical"
        : change.confidence === "CONFIRMED"
          ? "high"
          : "normal";

    for (const page of pages) {
      if (
        page.pageType === "research" &&
        change.confidence !== "CONFIRMED"
      ) {
        continue;
      }
      signals.push({
        path: page.path,
        productId: change.productId,
        refreshPriorityBoost: boost,
        reason: `Outdated pricing risk: ${change.summary}`,
        confidence: change.confidence,
        outdatedPricing: true,
        staleCode: "OUTDATED_PRICING",
      });
    }
  }

  return signals;
}
