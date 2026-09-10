import type { Comparison, Software } from "@/domain/schemas";
import type { CompareRelationshipKind } from "./types";

export type SoftLookup = Map<string, Software>;

export type ComparabilitySignalId =
  | "same_category"
  | "secondary_category_overlap"
  | "overlapping_use_cases"
  | "same_audience"
  | "shared_capabilities"
  | "declared_competitor"
  | "declared_alternative"
  | "declared_comparable"
  | "similar_pricing_tier"
  | "shared_integrations"
  | "same_buyer_problem"
  | "shared_team_type";

export type ComparabilitySignal = {
  id: ComparabilitySignalId;
  weight: number;
  detail: string;
};

export type ComparabilityAnalysis = {
  kind: CompareRelationshipKind;
  genuineCompetitors: boolean;
  sharedCategoryOrUseCase: boolean;
  reasons: string[];
  signals: ComparabilitySignal[];
  score: number;
  /** True when buyer-comparable without requiring a declared edge. */
  dataBackedComparable: boolean;
};

export function buildSoftwareLookup(software: Software[]): SoftLookup {
  return new Map(software.map((s) => [s.slug, s]));
}

function relationSet(product: Software): {
  competitors: Set<string>;
  alternatives: Set<string>;
  comparable: Set<string>;
} {
  return {
    competitors: new Set(product.competitorSlugs ?? []),
    alternatives: new Set(product.alternativeSlugs ?? []),
    comparable: new Set(product.comparableSlugs ?? []),
  };
}

function intersect<T>(a: Iterable<T>, b: Iterable<T>): T[] {
  const setB = new Set(b);
  return [...a].filter((x) => setB.has(x));
}

function startingPriceBand(product: Software): number | null {
  const p = product.pricing?.startingPriceMonthly;
  if (p == null || !Number.isFinite(p)) return null;
  if (p <= 0) return 0;
  if (p < 20) return 1;
  if (p < 50) return 2;
  if (p < 100) return 3;
  if (p < 250) return 4;
  return 5;
}

/**
 * Collect buyer-comparability signals from catalogue data.
 * Declared edges are strongest; overlapping use cases / capabilities / audience
 * can establish legitimacy without an explicit competitor declaration.
 */
export function analyzeProductComparability(
  a: Software,
  b: Software,
): {
  signals: ComparabilitySignal[];
  score: number;
  dataBackedComparable: boolean;
  sharedCategory: boolean;
  sharedUseCase: boolean;
} {
  const signals: ComparabilitySignal[] = [];

  const sharedCategory =
    Boolean(a.primaryCategorySlug) &&
    a.primaryCategorySlug === b.primaryCategorySlug;
  if (sharedCategory) {
    signals.push({
      id: "same_category",
      weight: 1,
      detail: `Shared primary category: ${a.primaryCategorySlug}`,
    });
  }

  const secondaryOverlap = intersect(
    a.secondaryCategorySlugs ?? [],
    b.secondaryCategorySlugs ?? [],
  );
  const crossPrimarySecondary =
    (a.secondaryCategorySlugs ?? []).includes(b.primaryCategorySlug) ||
    (b.secondaryCategorySlugs ?? []).includes(a.primaryCategorySlug);
  if (secondaryOverlap.length > 0 || crossPrimarySecondary) {
    signals.push({
      id: "secondary_category_overlap",
      weight: 1.5,
      detail: crossPrimarySecondary
        ? "One product’s secondary category matches the other’s primary"
        : `Shared secondary categories: ${secondaryOverlap.slice(0, 3).join(", ")}`,
    });
  }

  const useOverlap = intersect(a.useCaseSlugs ?? [], b.useCaseSlugs ?? []);
  if (useOverlap.length > 0) {
    signals.push({
      id: "overlapping_use_cases",
      weight: Math.min(3, 1.5 + useOverlap.length * 0.4),
      detail: `Shared use cases (${useOverlap.length}): ${useOverlap.slice(0, 4).join(", ")}`,
    });
  }

  const audienceOverlap = intersect(
    a.businessSizeSlugs ?? [],
    b.businessSizeSlugs ?? [],
  );
  if (audienceOverlap.length > 0) {
    signals.push({
      id: "same_audience",
      weight: 1.2,
      detail: `Shared company-size audience: ${audienceOverlap.slice(0, 3).join(", ")}`,
    });
  }

  const teamOverlap = intersect(a.teamTypeSlugs ?? [], b.teamTypeSlugs ?? []);
  if (teamOverlap.length > 0) {
    signals.push({
      id: "shared_team_type",
      weight: 1,
      detail: `Shared team types: ${teamOverlap.slice(0, 3).join(", ")}`,
    });
  }

  const featuresA = new Map(
    (a.featureRatings ?? []).map((f) => [f.featureSlug, f]),
  );
  const featuresB = new Map(
    (b.featureRatings ?? []).map((f) => [f.featureSlug, f]),
  );
  let sharedFeatureCount = 0;
  for (const slug of featuresA.keys()) {
    if (featuresB.has(slug)) sharedFeatureCount += 1;
  }
  if (sharedFeatureCount >= 2) {
    signals.push({
      id: "shared_capabilities",
      weight: Math.min(3, 1 + sharedFeatureCount * 0.25),
      detail: `Overlapping feature ratings: ${sharedFeatureCount} capabilities`,
    });
  }

  const intOverlap = intersect(
    a.integrationSlugs ?? [],
    b.integrationSlugs ?? [],
  );
  if (intOverlap.length >= 2) {
    signals.push({
      id: "shared_integrations",
      weight: Math.min(2.5, 1 + intOverlap.length * 0.2),
      detail: `Shared integrations (${intOverlap.length})`,
    });
  }

  const bandA = startingPriceBand(a);
  const bandB = startingPriceBand(b);
  const modelA = a.pricing?.model;
  const modelB = b.pricing?.model;
  if (
    (bandA != null && bandB != null && Math.abs(bandA - bandB) <= 1) ||
    (modelA &&
      modelB &&
      modelA !== "unknown" &&
      modelB !== "unknown" &&
      modelA === modelB)
  ) {
    signals.push({
      id: "similar_pricing_tier",
      weight: 1.2,
      detail:
        bandA != null && bandB != null
          ? `Similar starting-price bands (${bandA} vs ${bandB})`
          : `Shared pricing model: ${modelA}`,
    });
  }

  const buyerA = new Set(
    [...(a.bestFor ?? []), ...(a.notIdealFor ?? [])].map((s) =>
      s.toLowerCase().trim(),
    ),
  );
  const buyerB = [...(b.bestFor ?? []), ...(b.notIdealFor ?? [])].map((s) =>
    s.toLowerCase().trim(),
  );
  const buyerHits = buyerB.filter(
    (phrase) =>
      phrase.length > 8 &&
      [...buyerA].some(
        (other) => other.includes(phrase) || phrase.includes(other),
      ),
  );
  if (buyerHits.length > 0 || intersect(a.bestFor ?? [], b.bestFor ?? []).length > 0) {
    signals.push({
      id: "same_buyer_problem",
      weight: 1.5,
      detail: "Overlapping best-fit / buyer-problem language",
    });
  }

  const score = signals.reduce((sum, s) => sum + s.weight, 0);
  const nonCategorySignals = signals.filter((s) => s.id !== "same_category");
  // Same category alone is not enough — need additional buyer-comparability.
  const dataBackedComparable =
    (sharedCategory && nonCategorySignals.length >= 2 && score >= 3.5) ||
    (!sharedCategory &&
      nonCategorySignals.some((s) => s.id === "overlapping_use_cases") &&
      nonCategorySignals.length >= 3 &&
      score >= 5);

  return {
    signals,
    score,
    dataBackedComparable,
    sharedCategory,
    sharedUseCase: useOverlap.length > 0,
  };
}

/**
 * Genuine buying alternatives — declared edges OR data-backed comparability.
 * Same-category Cartesian pairs without further signals stay `same_category_only`.
 */
export function resolveComparisonRelationship(
  comparison: Comparison,
  soft: SoftLookup,
): ComparabilityAnalysis {
  const [slugA, slugB] = comparison.productSlugs;
  const a = soft.get(slugA ?? "");
  const b = soft.get(slugB ?? "");
  if (!a || !b || !slugA || !slugB) {
    return {
      kind: "missing_product",
      genuineCompetitors: false,
      sharedCategoryOrUseCase: false,
      reasons: ["One or both products missing from catalogue"],
      signals: [],
      score: 0,
      dataBackedComparable: false,
    };
  }

  const ra = relationSet(a);
  const rb = relationSet(b);
  const analysis = analyzeProductComparability(a, b);
  const categoryMatch =
    analysis.sharedCategory ||
    (comparison.categorySlug != null &&
      (comparison.categorySlug === a.primaryCategorySlug ||
        comparison.categorySlug === b.primaryCategorySlug));

  const competitor =
    ra.competitors.has(slugB) || rb.competitors.has(slugA);
  const alternative =
    ra.alternatives.has(slugB) || rb.alternatives.has(slugA);
  const comparable =
    ra.comparable.has(slugB) || rb.comparable.has(slugA);

  if (competitor) {
    return {
      kind: "declared_competitor",
      genuineCompetitors: true,
      sharedCategoryOrUseCase: categoryMatch || analysis.sharedUseCase,
      reasons: ["Declared competitorSlugs relationship"],
      signals: [
        {
          id: "declared_competitor",
          weight: 5,
          detail: "Declared competitorSlugs relationship",
        },
        ...analysis.signals,
      ],
      score: analysis.score + 5,
      dataBackedComparable: true,
    };
  }
  if (alternative) {
    return {
      kind: "declared_alternative",
      genuineCompetitors: true,
      sharedCategoryOrUseCase: categoryMatch || analysis.sharedUseCase,
      reasons: ["Declared alternativeSlugs relationship"],
      signals: [
        {
          id: "declared_alternative",
          weight: 4.5,
          detail: "Declared alternativeSlugs relationship",
        },
        ...analysis.signals,
      ],
      score: analysis.score + 4.5,
      dataBackedComparable: true,
    };
  }
  if (comparable) {
    return {
      kind: "declared_comparable",
      genuineCompetitors: true,
      sharedCategoryOrUseCase: categoryMatch || analysis.sharedUseCase,
      reasons: ["Declared comparableSlugs relationship"],
      signals: [
        {
          id: "declared_comparable",
          weight: 4,
          detail: "Declared comparableSlugs relationship",
        },
        ...analysis.signals,
      ],
      score: analysis.score + 4,
      dataBackedComparable: true,
    };
  }

  if (analysis.dataBackedComparable) {
    return {
      kind: "data_backed_comparable",
      genuineCompetitors: true,
      sharedCategoryOrUseCase: categoryMatch || analysis.sharedUseCase,
      reasons: [
        "Data-backed buyer comparability (use cases, audience, capabilities, pricing, or integrations)",
        ...analysis.signals.map((s) => s.detail),
      ],
      signals: analysis.signals,
      score: analysis.score,
      dataBackedComparable: true,
    };
  }

  if (analysis.sharedCategory) {
    return {
      kind: "same_category_only",
      genuineCompetitors: false,
      sharedCategoryOrUseCase: true,
      reasons: [
        "Same primary category only — insufficient overlapping buyer signals for indexable comparison",
        ...analysis.signals.map((s) => s.detail),
      ],
      signals: analysis.signals,
      score: analysis.score,
      dataBackedComparable: false,
    };
  }

  return {
    kind: "cross_category_undeclared",
    genuineCompetitors: false,
    sharedCategoryOrUseCase: analysis.sharedUseCase,
    reasons: [
      "Cross-category pair without declared competitor/alternative link or enough shared buyer signals",
      ...analysis.signals.map((s) => s.detail),
    ],
    signals: analysis.signals,
    score: analysis.score,
    dataBackedComparable: false,
  };
}

/** True when a pair is eligible to become an indexable search comparison. */
export function hasIndexableRelationship(
  kind: CompareRelationshipKind,
): boolean {
  return (
    kind === "declared_competitor" ||
    kind === "declared_alternative" ||
    kind === "declared_comparable" ||
    kind === "data_backed_comparable"
  );
}
