import type { BudgetFitLabel, CrmFinderCriteria } from "@/domain";
import {
  featureAvailabilityToScore,
  fitLevelToScore,
  integrationKindToScore,
} from "@/domain/recommendation/fit-values";
import type { CrmFinderConfig, CrmFinderWeightKey } from "@/data/config/recommendation/crm-finder-v1";
import type {
  DimensionScores,
  ProductRecommendationSnapshot,
  ScoredCandidate,
} from "./types";
import { estimateMonthlyTotal } from "./pricing-fit";

/**
 * Score each dimension 0–1, or null when unknown / not applicable.
 * Aggregate = weighted average over known dimensions only.
 */
export function scoreSnapshot(
  snapshot: ProductRecommendationSnapshot,
  criteria: CrmFinderCriteria,
  config: CrmFinderConfig,
): ScoredCandidate {
  const useCaseFit = scoreUseCaseFit(snapshot, criteria);
  const requiredFeatures = scoreRequiredFeatures(snapshot, criteria);
  const preferredFeatures = scorePreferredFeatures(snapshot, criteria);
  const businessSizeFit = scoreBusinessSizeFit(snapshot, criteria);
  const integrations = scoreIntegrations(snapshot, criteria);
  const priorities = scorePriorities(snapshot, criteria);
  const { score: budgetFit, label: budgetFitLabel } = scoreBudgetFit(
    snapshot,
    criteria,
  );
  const businessTypeFit = scoreBusinessTypeFit(snapshot, criteria);

  const dimensionScores: DimensionScores = {
    useCaseFit,
    requiredFeatures,
    preferredFeatures,
    businessSizeFit,
    integrations,
    priorities,
    budgetFit,
    businessTypeFit,
    unknownDimensions: [],
  };

  const keys = Object.keys(config.weights) as CrmFinderWeightKey[];
  let knownWeight = 0;
  let totalApplicableWeight = 0;
  let weightedSum = 0;

  for (const key of keys) {
    const weight = config.weights[key];
    const value = dimensionScores[key];
    const applicable = isDimensionApplicable(key, criteria);
    if (!applicable) continue;
    totalApplicableWeight += weight;
    if (value == null) {
      dimensionScores.unknownDimensions.push(key);
      continue;
    }
    knownWeight += weight;
    weightedSum += value * weight;
  }

  const matchScore =
    knownWeight > 0
      ? Math.round((weightedSum / knownWeight) * 1000) / 10
      : 0;

  const pricingEstimate = estimateMonthlyTotal(snapshot, criteria);

  return {
    snapshot,
    matchScore: Math.min(100, Math.max(0, matchScore)),
    dimensionScores,
    knownWeight,
    totalApplicableWeight,
    budgetFitLabel,
    estimatedMonthlyTotal: pricingEstimate.estimatedMonthlyTotal,
    estimatedCurrency: pricingEstimate.estimatedCurrency,
  };
}

function isDimensionApplicable(
  key: CrmFinderWeightKey,
  criteria: CrmFinderCriteria,
): boolean {
  switch (key) {
    case "requiredFeatures":
      return criteria.requiredFeatureSlugs.length > 0;
    case "preferredFeatures":
      return criteria.preferredFeatureSlugs.length > 0;
    case "integrations":
      return criteria.preferredIntegrationSlugs.length > 0;
    case "budgetFit":
      return criteria.budgetPerUserMax !== undefined;
    case "businessTypeFit":
      return Boolean(criteria.businessTypeSlug);
    default:
      return true;
  }
}

function scoreUseCaseFit(
  snapshot: ProductRecommendationSnapshot,
  criteria: CrmFinderCriteria,
): number | null {
  const primary = snapshot.fit.useCaseFits[criteria.primaryUseCaseSlug];
  const primaryScore = fitLevelToScore(primary);

  let secondarySum = 0;
  let secondaryKnown = 0;
  for (const slug of criteria.secondaryUseCaseSlugs) {
    const score = fitLevelToScore(snapshot.fit.useCaseFits[slug]);
    if (score == null) continue;
    secondarySum += score;
    secondaryKnown += 1;
  }

  // Also credit taxonomy overlap when fit map lacks the slug but product lists it
  const taxonomyPrimary = snapshot.useCaseSlugs.includes(
    criteria.primaryUseCaseSlug,
  );
  const effectivePrimary =
    primaryScore ?? (taxonomyPrimary ? 0.8 : null);

  if (effectivePrimary == null && secondaryKnown === 0) {
    // Weak taxonomy-only secondary hits
    const secondaryHits = criteria.secondaryUseCaseSlugs.filter((s) =>
      snapshot.useCaseSlugs.includes(s),
    ).length;
    if (secondaryHits === 0) {
      // Still a CRM candidate — keep in ranking with a weak use-case score
      // so every researched CRM can participate, not only exact use-case matches.
      return snapshot.useCaseSlugs.length > 0 ||
        snapshot.featureSupport.length > 0
        ? 0.22
        : null;
    }
    return Math.min(0.45, 0.25 + secondaryHits * 0.1);
  }

  if (effectivePrimary == null) {
    // Only secondary — lower than strong primary
    return Math.min(0.55, (secondarySum / secondaryKnown) * 0.7);
  }

  if (secondaryKnown === 0) return effectivePrimary;

  const secondaryAvg = secondarySum / secondaryKnown;
  return Math.min(1, effectivePrimary * 0.75 + secondaryAvg * 0.25);
}

function scoreRequiredFeatures(
  snapshot: ProductRecommendationSnapshot,
  criteria: CrmFinderCriteria,
): number | null {
  if (criteria.requiredFeatureSlugs.length === 0) return null;
  const scores: number[] = [];
  let anyKnown = false;
  for (const slug of criteria.requiredFeatureSlugs) {
    const support = snapshot.featureSupport.find((f) => f.slug === slug);
    const score = featureAvailabilityToScore(support?.availability ?? "unknown");
    if (score == null) continue;
    anyKnown = true;
    scores.push(score);
  }
  if (!anyKnown || scores.length === 0) return null;
  // Average known only — unknown does not count as zero
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function scorePreferredFeatures(
  snapshot: ProductRecommendationSnapshot,
  criteria: CrmFinderCriteria,
): number | null {
  if (criteria.preferredFeatureSlugs.length === 0) return null;
  const scores: number[] = [];
  for (const slug of criteria.preferredFeatureSlugs) {
    const support = snapshot.featureSupport.find((f) => f.slug === slug);
    const score = featureAvailabilityToScore(support?.availability ?? "unknown");
    if (score == null) continue;
    scores.push(score);
  }
  if (scores.length === 0) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function scoreBusinessSizeFit(
  snapshot: ProductRecommendationSnapshot,
  criteria: CrmFinderCriteria,
): number | null {
  const fromFit = fitLevelToScore(
    snapshot.fit.businessSizeFits[criteria.companySizeSlug],
  );
  if (fromFit != null) return fromFit;
  if (snapshot.businessSizeSlugs.includes(criteria.companySizeSlug)) {
    return 0.8;
  }
  return null;
}

function scoreIntegrations(
  snapshot: ProductRecommendationSnapshot,
  criteria: CrmFinderCriteria,
): number | null {
  if (criteria.preferredIntegrationSlugs.length === 0) return null;
  const scores: number[] = [];
  for (const slug of criteria.preferredIntegrationSlugs) {
    const support = snapshot.integrationSupport.find((i) => i.slug === slug);
    const score = integrationKindToScore(support?.kind ?? "unknown");
    if (score == null) continue;
    scores.push(score);
  }
  if (scores.length === 0) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function scorePriorities(
  snapshot: ProductRecommendationSnapshot,
  criteria: CrmFinderCriteria,
): number | null {
  const entries = Object.entries(criteria.priorities) as [
    keyof typeof criteria.priorities,
    number,
  ][];
  let weighted = 0;
  let weightSum = 0;
  for (const [slug, weight] of entries) {
    if (weight <= 0) continue;
    const fit = snapshot.fit.priorityFits[slug];
    const score = fitLevelToScore(fit);
    if (score == null) continue;
    weighted += score * weight;
    weightSum += weight;
  }
  if (weightSum === 0) return null;
  return weighted / weightSum;
}

function scoreBudgetFit(
  snapshot: ProductRecommendationSnapshot,
  criteria: CrmFinderCriteria,
): { score: number | null; label: BudgetFitLabel } {
  if (criteria.budgetPerUserMax === undefined) {
    return { score: null, label: "unknown" };
  }
  if (criteria.budgetPerUserMax === null) {
    return { score: 1, label: "good" };
  }
  const price = snapshot.pricing?.startingPriceMonthly;
  if (price == null) {
    return { score: null, label: "unknown" };
  }
  const max = criteria.budgetPerUserMax;
  if (price <= max * 0.85) {
    return { score: 1, label: "good" };
  }
  if (price <= max) {
    return { score: 0.65, label: "tight" };
  }
  return { score: 0.15, label: "over" };
}

function scoreBusinessTypeFit(
  snapshot: ProductRecommendationSnapshot,
  criteria: CrmFinderCriteria,
): number | null {
  if (!criteria.businessTypeSlug) return null;
  const fromFit = fitLevelToScore(
    snapshot.fit.businessTypeFits[criteria.businessTypeSlug],
  );
  if (fromFit != null) return fromFit;
  if (snapshot.businessTypeSlugs.includes(criteria.businessTypeSlug)) {
    return 0.8;
  }
  return null;
}
