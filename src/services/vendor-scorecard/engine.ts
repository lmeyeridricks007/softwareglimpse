import type {
  FeatureAvailability,
  ScorecardCriterion,
  ScorecardCombinationSettings,
} from "@/domain";
import {
  availabilityToQualitative,
  deriveOverallFit,
  evaluateMustHave,
  qualitativeToScore,
  scoreToQualitativeLabel,
  summarizeMustHaves,
  type MustHaveStatus,
  type MustHaveSummary,
  type OverallFitLabel,
  type ResearchQualitativeLabel,
} from "./labels";

/** Server-serialized research for one product — no affiliate fields. */
export type ScorecardCriterionResearch = {
  criterionSlug: string;
  /** Approved 0–10 only; null when not approved. */
  score: number | null;
  qualitative: ResearchQualitativeLabel;
  rationale: string | null;
  confidence: "low" | "medium" | "high" | null;
  supportingFactIds: string[];
  assessmentUpdatedAt: string | null;
};

export type ScorecardProductResearch = {
  slug: string;
  name: string;
  logo: { src: string; alt: string } | null;
  reviewScore: number | null;
  reviewApproved: boolean;
  startingPriceLabel: string | null;
  assessmentStatus: string | null;
  assessmentUpdatedAt: string | null;
  researchConfidence: "low" | "medium" | "high" | null;
  strengths: string[];
  weaknesses: string[];
  tradeoffs: string[];
  criteria: ScorecardCriterionResearch[];
  featureSupport: Array<{
    featureSlug: string;
    availability: FeatureAvailability;
    notes?: string;
  }>;
};

export type ScorecardResearchCatalog = {
  products: ScorecardProductResearch[];
  methodologyVersion: string;
  methodologyHref: string;
  generatedAt: string;
  featureLabels: Record<string, string>;
};

export type CriterionCellResult = {
  criterionId: string;
  criterionSlug: string;
  label: string;
  weight: number;
  qualitative: ResearchQualitativeLabel;
  /** Approved numeric score when available. */
  numericScore: number | null;
  rationale: string | null;
  confidence: "low" | "medium" | "high" | null;
  supportingFactIds: string[];
};

export type MustHaveCellResult = {
  featureSlug: string;
  label: string;
  status: MustHaveStatus;
  availability: FeatureAvailability | "unknown";
};

export type ProductScorecardResult = {
  productSlug: string;
  productName: string;
  cells: CriterionCellResult[];
  mustHaves: MustHaveCellResult[];
  mustHaveSummary: MustHaveSummary;
  failsMustHave: boolean;
  /** Weighted 0–10 from known research cells only; null if <2 scored. */
  weightedResearchScore: number | null;
  overallFit: OverallFitLabel;
  strongestAreas: string[];
  mainTradeOff: string | null;
  researchConfidence: "low" | "medium" | "high" | "unknown";
  userAverage: number | null;
  combinedScore: number | null;
};

export type ScorecardEngineInput = {
  criteria: ScorecardCriterion[];
  productIds: string[];
  research: ScorecardResearchCatalog;
  mustHaveFeatureSlugs: string[];
  /** productId → user ratings 1–5 averages already computed, or per-rating map */
  userAverages: Record<string, number | null>;
  combination?: ScorecardCombinationSettings | null;
};

/**
 * Resolve research cells for criteria from editorial assessments + feature maps.
 * Never invents scores — unknown when assessment missing/unapproved.
 */
export function resolveCriterionCell(
  criterion: ScorecardCriterion,
  product: ScorecardProductResearch | undefined,
): CriterionCellResult {
  const slug = criterion.sourceId ?? criterion.id;
  const weight = criterion.normalizedWeight ?? 0;
  const base = {
    criterionId: criterion.id,
    criterionSlug: slug,
    label: criterion.label,
    weight,
    qualitative: "unknown" as ResearchQualitativeLabel,
    numericScore: null as number | null,
    rationale: null as string | null,
    confidence: null as "low" | "medium" | "high" | null,
    supportingFactIds: [] as string[],
  };
  if (!product) return base;

  const row = product.criteria.find((c) => c.criterionSlug === slug);
  if (row) {
    return {
      ...base,
      qualitative: row.qualitative,
      numericScore: row.score,
      rationale: row.rationale,
      confidence: row.confidence,
      supportingFactIds: row.supportingFactIds,
    };
  }

  // Cost / value: fall back to qualitative from starting price presence only as unknown
  if (criterion.type === "cost") {
    return base;
  }

  return base;
}

export function resolveMustHaves(
  product: ScorecardProductResearch | undefined,
  mustHaveFeatureSlugs: string[],
  featureLabels: Record<string, string>,
): MustHaveCellResult[] {
  return mustHaveFeatureSlugs.map((featureSlug) => {
    const support = product?.featureSupport.find(
      (f) => f.featureSlug === featureSlug,
    );
    const availability = support?.availability ?? "unknown";
    return {
      featureSlug,
      label: featureLabels[featureSlug] ?? featureSlug,
      status: evaluateMustHave(availability),
      availability,
    };
  });
}

function computeWeightedScore(cells: CriterionCellResult[]): number | null {
  let weightSum = 0;
  let scoreSum = 0;
  let scored = 0;
  for (const cell of cells) {
    if (cell.weight <= 0) continue;
    const numeric =
      cell.numericScore ?? qualitativeToScore(cell.qualitative);
    if (numeric == null) continue;
    weightSum += cell.weight;
    scoreSum += numeric * cell.weight;
    scored += 1;
  }
  if (scored < 2 || weightSum <= 0) return null;
  return Math.round((scoreSum / weightSum) * 10) / 10;
}

function strongestFromCells(cells: CriterionCellResult[], limit = 3): string[] {
  return [...cells]
    .filter(
      (c) =>
        c.qualitative === "strong" ||
        c.qualitative === "good" ||
        (c.numericScore != null && c.numericScore >= 7),
    )
    .sort((a, b) => {
      const as = a.numericScore ?? qualitativeToScore(a.qualitative) ?? 0;
      const bs = b.numericScore ?? qualitativeToScore(b.qualitative) ?? 0;
      return bs - as;
    })
    .slice(0, limit)
    .map((c) => c.label);
}

function weakestTradeOff(cells: CriterionCellResult[]): string | null {
  const weak = [...cells]
    .filter(
      (c) =>
        c.qualitative === "partial" ||
        c.qualitative === "does-not-meet" ||
        (c.numericScore != null && c.numericScore < 6.5),
    )
    .sort((a, b) => {
      const as = a.numericScore ?? qualitativeToScore(a.qualitative) ?? 10;
      const bs = b.numericScore ?? qualitativeToScore(b.qualitative) ?? 10;
      return as - bs;
    })[0];
  return weak?.label ?? null;
}

function confidenceFromProduct(
  product: ScorecardProductResearch | undefined,
  cells: CriterionCellResult[],
): "low" | "medium" | "high" | "unknown" {
  if (product?.researchConfidence) return product.researchConfidence;
  const known = cells.filter((c) => c.qualitative !== "unknown").length;
  if (known === 0) return "unknown";
  if (known >= 6) return "high";
  if (known >= 3) return "medium";
  return "low";
}

function combineScores(
  research: number | null,
  user: number | null,
  settings: ScorecardCombinationSettings | null | undefined,
): number | null {
  if (!settings?.enabled) return null;
  if (research == null || user == null) return null;
  const r = settings.researchPercent / 100;
  const u = settings.userPercent / 100;
  const sum = r + u;
  if (sum <= 0) return null;
  // User is 1–5 → scale to 0–10 for mix
  const userOnTen = (user / 5) * 10;
  return Math.round(((research * r + userOnTen * u) / sum) * 10) / 10;
}

export function evaluateProductScorecard(
  productId: string,
  input: ScorecardEngineInput,
): ProductScorecardResult {
  const product = input.research.products.find((p) => p.slug === productId);
  const activeCriteria = input.criteria.filter((c) => c.importance !== "ignore");
  const cells = activeCriteria.map((c) => resolveCriterionCell(c, product));
  const mustHaves = resolveMustHaves(
    product,
    input.mustHaveFeatureSlugs,
    input.research.featureLabels,
  );
  const mustHaveSummary = summarizeMustHaves(mustHaves.map((m) => m.status));
  const weightedResearchScore = computeWeightedScore(cells);
  const scoredCriterionCount = cells.filter(
    (c) => c.numericScore != null || c.qualitative !== "unknown",
  ).length;
  const overallFit = deriveOverallFit({
    mustHaveFailed: mustHaveSummary.failed,
    mustHaveUnknown: mustHaveSummary.unknown,
    scoredCriterionCount,
    weightedScore: weightedResearchScore,
  });
  const userAverage = input.userAverages[productId] ?? null;

  return {
    productSlug: productId,
    productName: product?.name ?? productId,
    cells,
    mustHaves,
    mustHaveSummary,
    failsMustHave: mustHaveSummary.failed > 0,
    weightedResearchScore,
    overallFit,
    strongestAreas: strongestFromCells(cells),
    mainTradeOff: weakestTradeOff(cells),
    researchConfidence: confidenceFromProduct(product, cells),
    userAverage,
    combinedScore: combineScores(
      weightedResearchScore,
      userAverage,
      input.combination,
    ),
  };
}

export function evaluateScorecard(
  input: ScorecardEngineInput,
): ProductScorecardResult[] {
  return input.productIds.map((id) => evaluateProductScorecard(id, input));
}

/**
 * Rank products for display — must-have failures sink; then research score.
 * Affiliate status is never an input.
 */
export function rankScorecardResults(
  results: ProductScorecardResult[],
): ProductScorecardResult[] {
  return [...results].sort((a, b) => {
    if (a.failsMustHave !== b.failsMustHave) {
      return a.failsMustHave ? 1 : -1;
    }
    const as = a.combinedScore ?? a.weightedResearchScore ?? -1;
    const bs = b.combinedScore ?? b.weightedResearchScore ?? -1;
    if (bs !== as) return bs - as;
    return a.productName.localeCompare(b.productName);
  });
}

export function buildFeatureRequirementMatrix(
  productIds: string[],
  featureSlugs: string[],
  research: ScorecardResearchCatalog,
): Array<{
  featureSlug: string;
  label: string;
  cells: Record<string, FeatureAvailability | "unknown">;
}> {
  return featureSlugs.map((featureSlug) => ({
    featureSlug,
    label: research.featureLabels[featureSlug] ?? featureSlug,
    cells: Object.fromEntries(
      productIds.map((pid) => {
        const product = research.products.find((p) => p.slug === pid);
        const availability =
          product?.featureSupport.find((f) => f.featureSlug === featureSlug)
            ?.availability ?? "unknown";
        return [pid, availability];
      }),
    ),
  }));
}

export { scoreToQualitativeLabel, availabilityToQualitative };
