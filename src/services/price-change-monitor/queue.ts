import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { getSoftware } from "@/data";
import { getAllComparisonsUnfiltered } from "@/data/repositories/catalog";
import { resolveAffectedPages } from "@/services/editorial/dependencies";
import {
  listPriceObservations,
  priceObservationSeriesKey,
} from "@/services/pricing-history";
import type {
  PriceMonitorFrequency,
  PriceMonitorQueueItem,
} from "@/domain";
import type { GscOpportunityReport } from "@/services/seo/gsc-opportunity/types";

function loadGscReport(): GscOpportunityReport | null {
  const candidates = [
    path.join(process.cwd(), "data/seo/gsc-opportunities.json"),
    path.join(process.cwd(), "src/data/seo/gsc-opportunities.json"),
  ] as const;
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    try {
      return JSON.parse(readFileSync(file, "utf8")) as GscOpportunityReport;
    } catch {
      continue;
    }
  }
  return null;
}

function extractSoftwareSlug(pagePath: string): string | null {
  const match = pagePath.match(/\/software\/([^/]+)\/?/i);
  return match?.[1]?.toLowerCase() ?? null;
}

function frequencyFromScore(score: number): PriceMonitorFrequency {
  if (score >= 70) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

/**
 * Prioritize products for pricing re-verification.
 * Uses SEO opportunity, traffic, comparisons, commercial signals,
 * category importance, and prior observation volatility — never invents GSC.
 */
export function buildPriceMonitorQueue(limit?: number): {
  generatedAt: string;
  gscSource: string | null;
  items: PriceMonitorQueueItem[];
} {
  const software = getSoftware({ includeUnpublished: false });
  const comparisons = getAllComparisonsUnfiltered();
  const gsc = loadGscReport();

  const comparisonCountBySlug = new Map<string, number>();
  for (const c of comparisons) {
    for (const slug of c.productSlugs) {
      comparisonCountBySlug.set(
        slug,
        (comparisonCountBySlug.get(slug) ?? 0) + 1,
      );
    }
  }

  const gscBySlug = new Map<
    string,
    { opportunityScore: number; impressions: number }
  >();
  if (gsc) {
    for (const row of gsc.allRanked ?? gsc.top100 ?? []) {
      const slug = extractSoftwareSlug(row.path);
      if (!slug) continue;
      const prev = gscBySlug.get(slug);
      if (!prev || row.opportunityScore > prev.opportunityScore) {
        gscBySlug.set(slug, {
          opportunityScore: row.opportunityScore,
          impressions: row.impressions,
        });
      } else {
        gscBySlug.set(slug, {
          opportunityScore: prev.opportunityScore,
          impressions: Math.max(prev.impressions, row.impressions),
        });
      }
    }
  }

  const categoryWeight = (slug: string | null | undefined): number => {
    if (!slug) return 0;
    if (slug === "crm") return 20;
    if (
      slug === "sales-intelligence" ||
      slug === "customer-service" ||
      slug === "email-marketing"
    ) {
      return 12;
    }
    return 5;
  };

  const scored: PriceMonitorQueueItem[] = [];

  for (const product of software) {
    const gscRow = gscBySlug.get(product.slug);
    const opportunityScore = gscRow?.opportunityScore ?? 0;
    const impressions = gscRow?.impressions ?? 0;
    const comparisonCount = comparisonCountBySlug.get(product.slug) ?? 0;
    const affectedPageCount = resolveAffectedPages(product.slug).length;

    const observations = listPriceObservations({ productId: product.slug });
    const seriesKeys = new Set(
      observations.map((o) => priceObservationSeriesKey(o)),
    );
    let volatilityScore = 0;
    for (const key of seriesKeys) {
      const series = observations.filter(
        (o) => priceObservationSeriesKey(o) === key,
      );
      if (series.length >= 2) volatilityScore += Math.min(series.length - 1, 5) * 4;
    }

    const commercialScore = product.affiliate?.enabled ? 15 : 0;

    const reasons: string[] = [];
    if (opportunityScore >= 50) reasons.push("high SEO opportunity");
    if (impressions >= 100) reasons.push("material impressions");
    if (comparisonCount >= 3) reasons.push("frequent comparisons");
    if (affectedPageCount >= 5) reasons.push("wide page impact");
    if (volatilityScore >= 8) reasons.push("prior price volatility");
    if (commercialScore >= 15) reasons.push("commercial importance");
    if (product.primaryCategorySlug === "crm") reasons.push("priority category");

    const priorityScore =
      opportunityScore * 0.35 +
      Math.min(impressions / 50, 25) +
      Math.min(comparisonCount * 4, 20) +
      Math.min(affectedPageCount * 2, 15) +
      Math.min(volatilityScore, 15) +
      commercialScore +
      categoryWeight(product.primaryCategorySlug);

    const lastObservedAt =
      observations
        .map((o) => o.observedAt)
        .sort((a, b) => b.localeCompare(a))[0] ?? null;

    scored.push({
      rank: 0,
      productId: product.slug,
      productName: product.name,
      categorySlug: product.primaryCategorySlug ?? null,
      frequency: frequencyFromScore(priorityScore),
      priorityScore: Math.round(priorityScore * 10) / 10,
      opportunityScore,
      impressions,
      comparisonCount,
      affectedPageCount,
      volatilityScore,
      commercialScore,
      reasons:
        reasons.length > 0
          ? reasons
          : ["catalogue coverage — low monitoring urgency"],
      lastObservedAt,
    });
  }

  scored.sort((a, b) => b.priorityScore - a.priorityScore);
  const limited =
    typeof limit === "number" ? scored.slice(0, limit) : scored;
  limited.forEach((item, i) => {
    item.rank = i + 1;
  });

  return {
    generatedAt: new Date().toISOString(),
    gscSource: gsc?.generatedAt ?? (gsc ? "gsc-opportunities.json" : null),
    items: limited,
  };
}
