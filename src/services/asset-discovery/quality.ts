import type {
  AssetQualityScore,
  AssetType,
  FreshnessStatus,
} from "@/domain/schemas/asset-discovery";
import { AssetQualityScoreSchema } from "@/domain/schemas/asset-discovery";

/**
 * Quality criteria for discovered assets.
 * Prefer specific product workflow demos over generic corporate brand videos.
 */

export type ScoreAssetQualityInput = {
  assetType: AssetType;
  officialSource: boolean;
  officialConfidence: "high" | "medium" | "low" | "none";
  /** How specifically the asset matches the opportunity need (0–5). */
  relevance?: number;
  /** Workflow/feature specificity vs generic brand (0–5). */
  specificity?: number;
  freshnessStatus?: FreshnessStatus;
  visualClarity?: number;
  buyerUsefulness?: number;
  evidenceUsefulness?: number;
  embeddingUsability?: number;
  /** Title/description hints for specificity heuristics. */
  title?: string;
  whatItShows?: string[];
};

function clampScore(n: number): number {
  return Math.max(0, Math.min(5, Math.round(n)));
}

function specificityFromSignals(
  assetType: AssetType,
  title?: string,
  whatItShows?: string[],
): number {
  const text = `${title ?? ""} ${(whatItShows ?? []).join(" ")}`.toLowerCase();
  const genericHints = [
    "brand film",
    "company culture",
    "we are hiring",
    "about us",
    "corporate overview",
    "our story",
  ];
  const specificHints = [
    "workflow",
    "pipeline",
    "tutorial",
    "setup",
    "demo",
    "how to",
    "walkthrough",
    "feature",
    "reporting",
    "automation",
    "integration",
  ];

  if (genericHints.some((h) => text.includes(h))) return 1;
  if (
    assetType === "official-product-video" &&
    !specificHints.some((h) => text.includes(h))
  ) {
    return 2;
  }
  if (
    assetType === "official-feature-demo" ||
    assetType === "official-workflow-demo" ||
    assetType === "official-tutorial"
  ) {
    return specificHints.some((h) => text.includes(h)) ? 5 : 4;
  }
  if (specificHints.some((h) => text.includes(h))) return 4;
  return 3;
}

function freshnessScore(status: FreshnessStatus | undefined): number {
  switch (status) {
    case "fresh":
      return 5;
    case "acceptable":
      return 4;
    case "stale":
      return 2;
    default:
      return 3;
  }
}

function officialScore(
  officialSource: boolean,
  confidence: ScoreAssetQualityInput["officialConfidence"],
): number {
  if (!officialSource) return confidence === "low" ? 1 : 0;
  switch (confidence) {
    case "high":
      return 5;
    case "medium":
      return 4;
    case "low":
      return 2;
    default:
      return 0;
  }
}

/**
 * Score asset usefulness. Overall is integer 0–100.
 */
export function scoreAssetQuality(
  input: ScoreAssetQualityInput,
): AssetQualityScore {
  const relevance = clampScore(input.relevance ?? 3);
  const specificity = clampScore(
    input.specificity ??
      specificityFromSignals(input.assetType, input.title, input.whatItShows),
  );
  const officialSourceConfidence = clampScore(
    officialScore(input.officialSource, input.officialConfidence),
  );
  const freshness = clampScore(freshnessScore(input.freshnessStatus));
  const visualClarity = clampScore(input.visualClarity ?? 3);
  const buyerUsefulness = clampScore(
    input.buyerUsefulness ?? Math.round((relevance + specificity) / 2),
  );
  const evidenceUsefulness = clampScore(
    input.evidenceUsefulness ??
      (input.officialSource ? Math.min(5, specificity + 1) : 1),
  );
  const embeddingUsability = clampScore(input.embeddingUsability ?? 3);

  const dims = [
    { score: relevance, weight: 1.2 },
    { score: specificity, weight: 1.3 },
    { score: officialSourceConfidence, weight: 1.4 },
    { score: freshness, weight: 0.8 },
    { score: visualClarity, weight: 0.9 },
    { score: buyerUsefulness, weight: 1.1 },
    { score: evidenceUsefulness, weight: 1.0 },
    { score: embeddingUsability, weight: 0.7 },
  ];
  const weightSum = dims.reduce((s, d) => s + d.weight, 0);
  const overall = Math.round(
    (dims.reduce((s, d) => s + d.score * d.weight, 0) / weightSum / 5) * 100,
  );

  return AssetQualityScoreSchema.parse({
    relevance,
    specificity,
    officialSourceConfidence,
    freshness,
    visualClarity,
    buyerUsefulness,
    evidenceUsefulness,
    embeddingUsability,
    overall,
  });
}
