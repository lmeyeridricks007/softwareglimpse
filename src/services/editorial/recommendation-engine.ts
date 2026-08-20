import type {
  CriterionAssessment,
  ProductEditorialAssessment,
  RecommendationCriteria,
  Software,
} from "@/domain";
import { loadAssessment } from "@/data/editorial/store";
import { loadEnrichment } from "@/data/research/store";
import { getAllSoftwareUnfiltered } from "@/data/repositories/catalog";

export type RecommendationCandidate = {
  softwareSlug: string;
  score: number;
  rationale: string[];
  criterionContribution: { criterionSlug: string; score: number; weight: number }[];
  useCaseFit: number;
  /** Always false — engine never auto-publishes rankings. */
  autoPublish: false;
};

export type RankCandidatesInput = {
  criteria: RecommendationCriteria;
  /** Optional explicit pool; defaults to category-filtered catalogue. */
  productSlugs?: string[];
  /** Criterion weights for ranking; defaults to equal weight. */
  criterionWeights?: Record<string, number>;
};

/**
 * Lightweight ranking from criterion assessments + use-case / feature fit.
 * Returns CANDIDATES with rationale only — never auto-publishes.
 * Affiliate metadata is intentionally ignored for ranking.
 */
export function rankRecommendationCandidates(
  input: RankCandidatesInput,
): RecommendationCandidate[] {
  const catalog = getAllSoftwareUnfiltered();
  const pool = selectPool(catalog, input);

  const candidates: RecommendationCandidate[] = [];

  for (const software of pool) {
    // Affiliate must not affect rank — do not read software.affiliate here.
    const assessment = loadAssessment(software.slug);
    const enrichment = loadEnrichment(software.slug);
    const criterionAssessments = assessment?.criterionAssessments ?? [];

    const contribution = scoreFromAssessments(
      criterionAssessments,
      input.criterionWeights,
    );
    const useCaseFit = scoreUseCaseFit(software, input.criteria);
    const featureFit = scoreFeatureFit(
      enrichment?.featureSupport.map((f) => f.featureSlug) ??
        software.featureRatings.map((f) => f.featureSlug),
      input.criteria.requiredFeatureSlugs,
    );

    const score =
      Math.round((contribution.total * 0.6 + useCaseFit * 0.25 + featureFit * 0.15) * 100) /
      100;

    const rationale: string[] = [];
    if (contribution.parts.length > 0) {
      rationale.push(
        `Editorial criterion average ${contribution.total}/10 across ${contribution.parts.length} dimensions.`,
      );
    } else {
      rationale.push("No editorial criterion assessments yet — fit is provisional.");
    }
    if (useCaseFit >= 7) {
      rationale.push("Strong use-case / taxonomy overlap with the request.");
    } else if (useCaseFit <= 3) {
      rationale.push("Weak use-case overlap with the request.");
    }
    if (input.criteria.requiredFeatureSlugs.length > 0) {
      rationale.push(`Required-feature coverage score ${featureFit}/10.`);
    }
    if (assessment?.bestFor?.length) {
      rationale.push(`Editorial best-for: ${assessment.bestFor.slice(0, 2).join("; ")}`);
    }

    candidates.push({
      softwareSlug: software.slug,
      score,
      rationale,
      criterionContribution: contribution.parts,
      useCaseFit,
      autoPublish: false,
    });
  }

  return candidates.sort((a, b) => b.score - a.score || a.softwareSlug.localeCompare(b.softwareSlug));
}

function selectPool(
  catalog: Software[],
  input: RankCandidatesInput,
): Software[] {
  if (input.productSlugs?.length) {
    const set = new Set(input.productSlugs);
    return catalog.filter((s) => set.has(s.slug));
  }
  const category = input.criteria.categorySlug;
  if (!category) return catalog;
  return catalog.filter(
    (s) =>
      s.primaryCategorySlug === category ||
      s.secondaryCategorySlugs.includes(category),
  );
}

function scoreFromAssessments(
  assessments: CriterionAssessment[],
  weights?: Record<string, number>,
): {
  total: number;
  parts: { criterionSlug: string; score: number; weight: number }[];
} {
  if (assessments.length === 0) return { total: 0, parts: [] };
  const parts = assessments.map((a) => ({
    criterionSlug: a.criterionSlug,
    score: a.score,
    weight: weights?.[a.criterionSlug] ?? 1,
  }));
  const weighted = parts.reduce((sum, p) => sum + p.score * p.weight, 0);
  const totalWeight = parts.reduce((sum, p) => sum + p.weight, 0);
  return {
    total: Math.round((weighted / totalWeight) * 100) / 100,
    parts,
  };
}

function scoreUseCaseFit(
  software: Software,
  criteria: RecommendationCriteria,
): number {
  let points = 5;
  if (
    criteria.primaryUseCaseSlug &&
    software.useCaseSlugs.includes(criteria.primaryUseCaseSlug)
  ) {
    points += 3;
  }
  const secondaryHits = criteria.secondaryUseCaseSlugs.filter((u) =>
    software.useCaseSlugs.includes(u),
  ).length;
  points += Math.min(2, secondaryHits);

  if (criteria.companySize && criteria.companySize !== "unknown") {
    const sizeSlug = mapCompanySize(criteria.companySize);
    if (sizeSlug && software.businessSizeSlugs.includes(sizeSlug)) {
      points += 1;
    }
  }

  return Math.min(10, points);
}

function scoreFeatureFit(
  available: string[],
  required: string[],
): number {
  if (required.length === 0) return 5;
  const set = new Set(available);
  const hits = required.filter((r) => set.has(r)).length;
  return Math.round((hits / required.length) * 10 * 10) / 10;
}

function mapCompanySize(
  size: NonNullable<RecommendationCriteria["companySize"]>,
): string | undefined {
  switch (size) {
    case "solo":
    case "micro":
      return "solopreneur";
    case "small":
      return "small-business";
    case "medium":
      return "mid-market";
    case "enterprise":
      return "enterprise";
    default:
      return undefined;
  }
}

/** Helper: expose assessment overall as a candidate signal without publishing. */
export function assessmentToCandidateSignal(
  assessment: ProductEditorialAssessment,
): Pick<RecommendationCandidate, "softwareSlug" | "score" | "autoPublish"> {
  return {
    softwareSlug: assessment.productSlug,
    score: assessment.overallScore ?? 0,
    autoPublish: false,
  };
}
