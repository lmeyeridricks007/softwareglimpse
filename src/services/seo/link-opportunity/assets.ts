import { inventoryLinkableAssets } from "@/services/authority-intelligence/linkable-assets";
import { listCrmPricingHistorySnapshots } from "@/data/research/pricing-history";
import { buildCrmPricingResearchReport } from "@/services/research-reports";
import type {
  LinkableAssetScoreDimensions,
  ScoredLinkableAsset,
} from "./types";

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function scoreDimensionsForAsset(input: {
  kind: string;
  path: string;
  linkability: string;
  name: string;
}): LinkableAssetScoreDimensions {
  const { kind, path, linkability } = input;
  const linkabilityBase =
    linkability === "excellent"
      ? 90
      : linkability === "strong"
        ? 75
        : linkability === "good"
          ? 60
          : linkability === "low"
            ? 30
            : 45;

  let uniqueness = linkabilityBase;
  let dataDepth = 40;
  let freshness = 50;
  let citationValue = linkabilityBase;
  let journalistUsefulness = 45;
  let seoRelevance = 55;

  if (kind === "dataset" || path.includes("/research/crm-pricing")) {
    uniqueness = 92;
    dataDepth = 88;
    citationValue = 95;
    journalistUsefulness = 90;
    seoRelevance = 80;
    // Freshness from live report observation when available
    try {
      const report = buildCrmPricingResearchReport();
      freshness = report.observationDate ? 85 : 60;
      dataDepth = clamp(50 + report.sample.usdProductsWithPlans);
    } catch {
      freshness = 70;
    }
  }

  if (path.includes("pricing-history")) {
    uniqueness = 94;
    dataDepth = 70;
    citationValue = 92;
    journalistUsefulness = 88;
    try {
      const snaps = listCrmPricingHistorySnapshots();
      freshness = snaps[0]?.observedAt ? 80 : 55;
      dataDepth = clamp(40 + snaps.length * 5);
    } catch {
      freshness = 60;
    }
  }

  if (kind === "tool") {
    uniqueness = 78;
    dataDepth = 55;
    citationValue = 70;
    journalistUsefulness = 65;
    seoRelevance = 85;
    freshness = 75;
  }

  if (kind === "template" || kind === "resource") {
    uniqueness = 70;
    dataDepth = 50;
    citationValue = 72;
    journalistUsefulness = 60;
    seoRelevance = 70;
  }

  if (kind === "framework" || path.includes("methodology") || path.includes("how-we-review")) {
    uniqueness = 75;
    dataDepth = 60;
    citationValue = 80;
    journalistUsefulness = 70;
    seoRelevance = 55;
  }

  if (kind === "glossary" || kind === "guide") {
    uniqueness = 55;
    dataDepth = 45;
    citationValue = 60;
    journalistUsefulness = 50;
    seoRelevance = 75;
  }

  if (kind === "homepage") {
    uniqueness = 20;
    dataDepth = 10;
    citationValue = 15;
    journalistUsefulness = 10;
    seoRelevance = 40;
    freshness = 40;
  }

  return {
    uniqueness: clamp(uniqueness),
    dataDepth: clamp(dataDepth),
    freshness: clamp(freshness),
    citationValue: clamp(citationValue),
    journalistUsefulness: clamp(journalistUsefulness),
    seoRelevance: clamp(seoRelevance),
  };
}

function assetScoreFromDimensions(d: LinkableAssetScoreDimensions): number {
  return clamp(
    d.uniqueness * 0.2 +
      d.dataDepth * 0.15 +
      d.freshness * 0.1 +
      d.citationValue * 0.25 +
      d.journalistUsefulness * 0.2 +
      d.seoRelevance * 0.1,
  );
}

/**
 * Inventory + score SoftwareGlimpse assets capable of earning editorial links.
 * Does not invent pages or statistics.
 */
export function inventoryAndScoreLinkableAssets(): ScoredLinkableAsset[] {
  const assets = inventoryLinkableAssets();
  return assets
    .map((a) => {
      const dimensions = scoreDimensionsForAsset({
        kind: a.kind,
        path: a.path,
        linkability: a.linkability,
        name: a.name,
      });
      return {
        id: a.id,
        name: a.name,
        path: a.path,
        kind: a.kind,
        cluster: a.cluster ?? null,
        linkability: a.linkability,
        whyLinkable: a.whyLinkable,
        dimensions,
        assetScore: assetScoreFromDimensions(dimensions),
        promotionAngles: a.promotionAngles,
      };
    })
    .sort((a, b) => b.assetScore - a.assetScore || a.name.localeCompare(b.name));
}
