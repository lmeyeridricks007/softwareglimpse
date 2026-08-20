import type {
  CrmFinderCriteria,
  FinderRecommendationResult,
} from "@/domain";
import type { CrmFinderConfig } from "@/data/config/recommendation/crm-finder-v1";
import { selectCandidatesByCategory } from "./candidates";
import {
  deriveConfidence,
  requiredFeatureUnknownRatio,
} from "./confidence";
import { evaluateEligibility, isFinderEligible } from "./eligibility";
import { explainRecommendation } from "./explanation";
import { scoreSnapshot } from "./scoring";
import type {
  EmptyRecommendReason,
  EligibilityExclusion,
  ProductRecommendationSnapshot,
  ScoredCandidate,
} from "./types";

export type RecommendCrmResult = {
  results: FinderRecommendationResult[];
  emptyReason?: EmptyRecommendReason;
  methodologyVersion: string;
  exclusions?: EligibilityExclusion[];
};

/**
 * Pure deterministic category recommendation pipeline.
 * NEVER reads affiliate metadata.
 */
export function recommendForCategory(
  criteria: CrmFinderCriteria,
  snapshots: ProductRecommendationSnapshot[],
  config: CrmFinderConfig,
  categorySlug: string,
): RecommendCrmResult {
  const candidates = selectCandidatesByCategory(snapshots, categorySlug);
  if (candidates.length === 0) {
    return {
      results: [],
      emptyReason:
        categorySlug === "crm" ? "no-crm-candidates" : "no-candidates",
      methodologyVersion: config.version,
    };
  }

  const exclusions: EligibilityExclusion[] = [];
  const eligible: ProductRecommendationSnapshot[] = [];

  for (const snapshot of candidates) {
    if (!isFinderEligible(snapshot, categorySlug)) {
      exclusions.push({
        productSlug: snapshot.slug,
        reason: "Insufficient finder data (no use cases or feature support)",
        code: "insufficient-data",
      });
      continue;
    }
    const eligibility = evaluateEligibility(
      snapshot,
      criteria,
      config,
      categorySlug,
    );
    if (!eligibility.eligible) {
      exclusions.push(...eligibility.exclusions);
      continue;
    }
    eligible.push(snapshot);
  }

  if (eligible.length === 0) {
    return {
      results: [],
      emptyReason: "all-excluded",
      methodologyVersion: config.version,
      exclusions,
    };
  }

  const scored: ScoredCandidate[] = [];
  for (const snapshot of eligible) {
    const candidate = scoreSnapshot(snapshot, criteria, config);
    const knownRatio =
      candidate.totalApplicableWeight > 0
        ? candidate.knownWeight / candidate.totalApplicableWeight
        : 0;
    if (knownRatio < config.minEligibleDataScore) {
      exclusions.push({
        productSlug: snapshot.slug,
        reason: `Known dimension weight ${knownRatio.toFixed(2)} below minEligibleDataScore`,
        code: "insufficient-data",
      });
      continue;
    }
    scored.push(candidate);
  }

  if (scored.length === 0) {
    return {
      results: [],
      emptyReason: "insufficient-data",
      methodologyVersion: config.version,
      exclusions,
    };
  }

  scored.sort(
    (a, b) =>
      b.matchScore - a.matchScore ||
      a.snapshot.slug.localeCompare(b.snapshot.slug),
  );

  const results = scored.map((candidate) => {
    const confidence = deriveConfidence({
      scored: candidate,
      requiredFeatureUnknownRatio: requiredFeatureUnknownRatio(
        candidate.snapshot,
        criteria.requiredFeatureSlugs,
      ),
    });
    const explanation = explainRecommendation(
      candidate,
      criteria,
      candidate.budgetFitLabel,
    );

    const result: FinderRecommendationResult = {
      productSlug: candidate.snapshot.slug,
      name: candidate.snapshot.name,
      matchScore: candidate.matchScore,
      confidence,
      breakdown: {
        useCaseFit: candidate.dimensionScores.useCaseFit,
        requiredFeatures: candidate.dimensionScores.requiredFeatures,
        preferredFeatures: candidate.dimensionScores.preferredFeatures,
        businessSizeFit: candidate.dimensionScores.businessSizeFit,
        integrations: candidate.dimensionScores.integrations,
        priorities: candidate.dimensionScores.priorities,
        budgetFit: candidate.dimensionScores.budgetFit,
        businessTypeFit: candidate.dimensionScores.businessTypeFit,
        unknownDimensions: candidate.dimensionScores.unknownDimensions,
        knownWeight: candidate.knownWeight,
        totalApplicableWeight: candidate.totalApplicableWeight,
      },
      reasons: explanation.reasons,
      tradeoffs: explanation.tradeoffs,
      unknowns: explanation.unknowns,
      estimatedMonthlyTotal: candidate.estimatedMonthlyTotal,
      estimatedCurrency: candidate.estimatedCurrency as
        | FinderRecommendationResult["estimatedCurrency"]
        | undefined,
      budgetFit: candidate.budgetFitLabel,
      labels: [],
      comparisonPath: `/compare/${candidate.snapshot.slug}/`,
    };
    return result;
  });

  applyTieLabels(results, config.tieThresholdPoints);

  return {
    results,
    methodologyVersion: config.version,
    exclusions: exclusions.length > 0 ? exclusions : undefined,
  };
}

/**
 * Pure deterministic CRM recommendation pipeline.
 * NEVER reads affiliate metadata.
 */
export function recommendCrm(
  criteria: CrmFinderCriteria,
  snapshots: ProductRecommendationSnapshot[],
  config: CrmFinderConfig,
): RecommendCrmResult {
  return recommendForCategory(criteria, snapshots, config, "crm");
}

/** Sales Intelligence finder — same scoring math, SI candidate pool. */
export function recommendSalesIntelligence(
  criteria: CrmFinderCriteria,
  snapshots: ProductRecommendationSnapshot[],
  config: CrmFinderConfig,
): RecommendCrmResult {
  return recommendForCategory(
    criteria,
    snapshots,
    config,
    "sales-intelligence",
  );
}

function applyTieLabels(
  results: FinderRecommendationResult[],
  tieThresholdPoints: number,
): void {
  if (results.length < 2) return;
  for (let i = 0; i < results.length - 1; i++) {
    const a = results[i]!;
    const b = results[i + 1]!;
    if (Math.abs(a.matchScore - b.matchScore) <= tieThresholdPoints) {
      const label = "Close match";
      a.labels = [...(a.labels ?? []), label];
      b.labels = [...(b.labels ?? []), label];
    }
  }
  // Dedupe labels per result
  for (const result of results) {
    result.labels = [...new Set(result.labels ?? [])];
  }
}
