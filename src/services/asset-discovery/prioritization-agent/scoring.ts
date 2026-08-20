import type {
  AssetEnrichmentEffort,
  AssetEnrichmentPriorityBand,
  AssetImplementationBatch,
  GuideAssetCategory,
  GuideAssetRecommendation,
  SoftwareAssetRecommendation,
  SoftwareAssetRecommendationLevel,
} from "@/domain/schemas/asset-discovery";

export type ImpactFactors = {
  mapPriority?: "P0" | "P1" | "P2" | "P3";
  /** pillar / high-commercial / supporting / long-tail style boost */
  pageLeverage: "flagship" | "high" | "medium" | "low";
  qualityWeakness: "critical" | "high" | "medium" | "low" | "none";
  assetRelevance: "critical" | "high" | "medium" | "low";
  buyerUsefulness: "high" | "medium" | "low";
  evidenceValue: "high" | "medium" | "low";
  differentiationValue: "high" | "medium" | "low";
  easeOfUse: "high" | "medium" | "low";
  sourceQuality: "verified-official" | "official-pending" | "authoritative" | "original" | "unknown";
  freshnessUrgency: "replace-now" | "refresh" | "ok" | "unknown";
  effort: AssetEnrichmentEffort;
  recommendationLevel: SoftwareAssetRecommendationLevel;
  hasCqLink: boolean;
  isTemplate: boolean;
};

const MAP_W: Record<string, number> = { P0: 28, P1: 20, P2: 12, P3: 6 };
const LEVERAGE_W = { flagship: 18, high: 12, medium: 6, low: 2 };
const WEAK_W = { critical: 22, high: 16, medium: 8, low: 3, none: 0 };
const RELEVANCE_W = { critical: 18, high: 12, medium: 6, low: 2 };
const BUYER_W = { high: 14, medium: 7, low: 2 };
const EVIDENCE_W = { high: 10, medium: 5, low: 1 };
const DIFF_W = { high: 10, medium: 5, low: 1 };
const EASE_W = { high: 8, medium: 4, low: 1 };
const SOURCE_W = {
  "verified-official": 10,
  "official-pending": 6,
  authoritative: 7,
  original: 8,
  unknown: 2,
};
const FRESH_W = { "replace-now": 16, refresh: 8, ok: 0, unknown: 1 };
const LEVEL_W: Record<SoftwareAssetRecommendationLevel, number> = {
  "add-now": 12,
  "strong-opportunity": 8,
  "reuse-existing": 10,
  optional: 2,
  "source-only": 3,
  "do-not-use": -50,
};
const EFFORT_PENALTY: Record<AssetEnrichmentEffort, number> = {
  trivial: 0,
  small: 1,
  medium: 3,
  large: 6,
};

/**
 * Qualitative composite — deliberately not proportional to opportunity count.
 * One excellent workflow video can outrank fifteen low-value screenshots.
 */
export function scoreImpact(f: ImpactFactors): number {
  let score =
    (f.mapPriority ? MAP_W[f.mapPriority] ?? 0 : 4) +
    LEVERAGE_W[f.pageLeverage] +
    WEAK_W[f.qualityWeakness] +
    RELEVANCE_W[f.assetRelevance] +
    BUYER_W[f.buyerUsefulness] +
    EVIDENCE_W[f.evidenceValue] +
    DIFF_W[f.differentiationValue] +
    EASE_W[f.easeOfUse] +
    SOURCE_W[f.sourceQuality] +
    FRESH_W[f.freshnessUrgency] +
    LEVEL_W[f.recommendationLevel] -
    EFFORT_PENALTY[f.effort];

  if (f.hasCqLink) score += 8;
  if (f.isTemplate) score += 14;
  return score;
}

export function bandFromScore(
  score: number,
  f: ImpactFactors,
): AssetEnrichmentPriorityBand {
  if (f.recommendationLevel === "do-not-use") return "A3";

  // Template fixes that clear many gaps
  if (f.isTemplate) {
    if (f.mapPriority === "P0" || f.mapPriority === "P1" || score >= 80) {
      return "A0";
    }
    return "A1";
  }

  // Stale / broken media on important pages
  if (
    f.freshnessUrgency === "replace-now" &&
    (f.pageLeverage === "flagship" || f.mapPriority === "P0")
  ) {
    return "A0";
  }

  // Critical missing media on important pages — high bar, not every diagram
  if (
    (f.pageLeverage === "flagship" || f.mapPriority === "P0") &&
    (f.qualityWeakness === "critical" || f.qualityWeakness === "high") &&
    (f.assetRelevance === "critical" || f.assetRelevance === "high") &&
    f.buyerUsefulness === "high" &&
    (f.recommendationLevel === "add-now" ||
      f.recommendationLevel === "reuse-existing") &&
    f.easeOfUse !== "low" // originals are valuable but usually A1 unless reuse/embed-ready
  ) {
    return "A0";
  }

  // Flagship product: verified official media ready to reuse/embed
  if (
    f.pageLeverage === "flagship" &&
    f.sourceQuality === "verified-official" &&
    f.recommendationLevel === "reuse-existing" &&
    (f.assetRelevance === "critical" || f.assetRelevance === "high")
  ) {
    return "A0";
  }

  if (score >= 100) return "A1";
  if (score >= 72) return "A1";
  if (score >= 48) return "A2";
  return "A3";
}

export function coverageToWeakness(
  rating: string,
): ImpactFactors["qualityWeakness"] {
  switch (rating) {
    case "very-weak":
      return "critical";
    case "weak":
      return "high";
    case "adequate":
      return "medium";
    case "strong":
      return "low";
    case "excellent":
      return "none";
    default:
      return "medium";
  }
}

export function softwareSectionRelevance(
  sectionId: string | undefined,
): ImpactFactors["assetRelevance"] {
  switch (sectionId) {
    case "overview":
    case "features":
      return "critical";
    case "implementation":
    case "use-cases":
    case "screenshots":
      return "high";
    case "pricing":
    case "evidence":
    case "industry":
      return "medium";
    default:
      return "low";
  }
}

export function buyerUsefulnessForSoftware(
  rec: SoftwareAssetRecommendation,
): ImpactFactors["buyerUsefulness"] {
  const t = rec.assetType;
  if (
    t === "official-workflow-demo" ||
    t === "official-feature-demo" ||
    t === "official-tutorial" ||
    t === "official-product-video"
  ) {
    return "high";
  }
  if (t === "official-screenshot" || t === "official-product-tour") {
    return "medium";
  }
  if (t === "softwareglimpse-original-visual-opportunity") return "high";
  return "low";
}

export function buyerUsefulnessForGuide(
  category: GuideAssetCategory,
): ImpactFactors["buyerUsefulness"] {
  switch (category) {
    case "official-tutorial":
    case "official-implementation-video":
    case "official-workflow-diagram":
    case "original-softwareglimpse-diagram":
    case "original-checklist-visualization":
    case "original-comparison-graphic":
      return "high";
    case "official-product-demo":
    case "official-migration-documentation":
    case "official-documentation-diagram":
    case "government-regulatory-diagram":
    case "standards-body-diagram":
      return "medium";
    case "official-screenshot":
    case "official-webinar":
    case "official-checklist-pdf-source":
    case "tool-cta-visual":
    default:
      return "low";
  }
}

export function effortForSoftware(
  rec: SoftwareAssetRecommendation,
): AssetEnrichmentEffort {
  if (rec.recommendationLevel === "reuse-existing" && rec.reuseOfMediaId) {
    return "trivial";
  }
  if (rec.sourceUrl && rec.officialSource) return "small";
  if (rec.recommendationLevel === "source-only") return "small";
  if (rec.assetType === "softwareglimpse-original-visual-opportunity") {
    return "large";
  }
  return "medium";
}

export function effortForGuide(
  rec: GuideAssetRecommendation,
): AssetEnrichmentEffort {
  if (rec.category.startsWith("original-")) return "large";
  if (rec.recommendationLevel === "source-only") return "small";
  if (rec.sourceUrl) return "small";
  return "medium";
}

export function implementationBatchForSoftware(
  rec: SoftwareAssetRecommendation,
  stale = false,
): AssetImplementationBatch {
  if (stale) return "stale-media-to-replace";
  if (rec.recommendationLevel === "reuse-existing") {
    return "existing-research-media-to-reuse";
  }
  if (rec.assetType === "softwareglimpse-original-visual-opportunity") {
    return "original-diagrams-to-create";
  }
  if (
    rec.assetType === "official-screenshot" ||
    rec.assetType === "official-ui-image"
  ) {
    return "screenshots-to-add";
  }
  if (
    rec.assetType === "official-pdf-guide" ||
    rec.usageRecommendation === "cite" ||
    rec.usageRecommendation === "link" ||
    rec.recommendationLevel === "source-only"
  ) {
    return "official-docs-to-link";
  }
  if (
    rec.assetType.includes("video") ||
    rec.assetType.includes("demo") ||
    rec.assetType.includes("tutorial") ||
    rec.assetType.includes("webinar") ||
    rec.assetType.includes("tour")
  ) {
    return "official-videos-to-embed";
  }
  return "official-docs-to-link";
}

export function implementationBatchForGuide(
  rec: GuideAssetRecommendation,
): AssetImplementationBatch {
  if (rec.category === "original-softwareglimpse-diagram") {
    return "original-diagrams-to-create";
  }
  if (
    rec.category === "original-checklist-visualization" ||
    rec.category === "original-comparison-graphic"
  ) {
    return "original-workflow-visuals-to-create";
  }
  if (rec.category === "official-screenshot") return "screenshots-to-add";
  if (
    rec.category === "official-product-demo" ||
    rec.category === "official-tutorial" ||
    rec.category === "official-webinar" ||
    rec.category === "official-implementation-video"
  ) {
    return "official-videos-to-embed";
  }
  return "official-docs-to-link";
}

export function sourceQualityForSoftware(
  rec: SoftwareAssetRecommendation,
): ImpactFactors["sourceQuality"] {
  if (rec.reuseOfMediaId || (rec.sourceUrl && rec.officialSource)) {
    return "verified-official";
  }
  if (rec.recommendationLevel === "add-now" || rec.searchQueries.length > 0) {
    return "official-pending";
  }
  if (rec.assetType === "softwareglimpse-original-visual-opportunity") {
    return "original";
  }
  return "unknown";
}

export function sourceQualityForGuide(
  rec: GuideAssetRecommendation,
): ImpactFactors["sourceQuality"] {
  if (rec.category.startsWith("original-")) return "original";
  if (
    rec.category.startsWith("government-") ||
    rec.category.startsWith("standards-")
  ) {
    return "authoritative";
  }
  if (rec.sourceUrl) return "verified-official";
  if (rec.searchQueries.length > 0) return "official-pending";
  return "unknown";
}
