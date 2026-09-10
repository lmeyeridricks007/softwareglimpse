import type {
  CategoryScoringProfile,
  CriterionAssessment,
  EditorialDimensionScore,
  Methodology,
  TraceableOverallScore,
} from "@/domain";
import {
  CategoryScoringProfileSchema,
  STANDARD_SCORING_DIMENSIONS,
  type StandardScoringDimensionId,
} from "@/domain";
import { computeWeightedOverall } from "./scoring";

/**
 * Default category-aware scoring profiles.
 * These configure which dimensions matter — they do NOT invent product scores.
 */
export const DEFAULT_CATEGORY_SCORING_PROFILES: CategoryScoringProfile[] = [
  CategoryScoringProfileSchema.parse({
    id: "profile-crm-standard-v1",
    categorySlug: "crm",
    version: "1.0.0",
    name: "CRM standard dimensions",
    description:
      "Maps standard buying dimensions onto CRM methodology criteria. Scores come only from approved assessments.",
    dimensionWeights: [
      { dimensionSlug: "ease-of-use", weight: 1, standardDimensionId: "easeOfUse" },
      { dimensionSlug: "pipeline-management", weight: 1, standardDimensionId: "features" },
      { dimensionSlug: "sales-automation", weight: 1, standardDimensionId: "automation" },
      { dimensionSlug: "reporting", weight: 1, standardDimensionId: "reporting" },
      { dimensionSlug: "integrations", weight: 1, standardDimensionId: "integrations" },
      { dimensionSlug: "value-for-money", weight: 1, standardDimensionId: "value" },
      { dimensionSlug: "administration-overhead", weight: 1, standardDimensionId: "setup" },
      { dimensionSlug: "scalability", weight: 1, standardDimensionId: "scalability" },
    ],
  }),
  CategoryScoringProfileSchema.parse({
    id: "profile-generic-standard-v1",
    categorySlug: "generic",
    version: "1.0.0",
    name: "Generic software dimensions",
    description:
      "Default dimension catalog for categories without a specialized profile. Do not auto-score products from this alone.",
    dimensionWeights: (
      Object.keys(STANDARD_SCORING_DIMENSIONS) as StandardScoringDimensionId[]
    ).map((id) => ({
      dimensionSlug: STANDARD_SCORING_DIMENSIONS[id].slug,
      weight: 1,
      standardDimensionId: id,
    })),
  }),
];

export function getCategoryScoringProfile(
  categorySlug: string,
): CategoryScoringProfile {
  return (
    DEFAULT_CATEGORY_SCORING_PROFILES.find(
      (p) => p.categorySlug === categorySlug,
    ) ??
    DEFAULT_CATEGORY_SCORING_PROFILES.find(
      (p) => p.categorySlug === "generic",
    )!
  );
}

export function listStandardScoringDimensions(): Array<{
  id: StandardScoringDimensionId;
  slug: string;
  name: string;
  description: string;
}> {
  return (
    Object.keys(STANDARD_SCORING_DIMENSIONS) as StandardScoringDimensionId[]
  ).map((id) => ({
    id,
    ...STANDARD_SCORING_DIMENSIONS[id],
  }));
}

/**
 * Build dimension score rows from approved criterion assessments.
 * Returns null when there is nothing to score — never fabricates values.
 */
export function buildDimensionScoresFromAssessments(input: {
  assessments: CriterionAssessment[];
  methodology: Methodology;
  /** Only include assessments that are approved when true (default). */
  approvedOnly?: boolean;
}): EditorialDimensionScore[] | null {
  const approvedOnly = input.approvedOnly !== false;
  const weightBySlug = new Map(
    input.methodology.criteria.map((c) => [c.slug, c]),
  );

  const rows: EditorialDimensionScore[] = [];

  for (const assessment of input.assessments) {
    if (approvedOnly && assessment.status !== "approved") continue;
    const criterion = weightBySlug.get(assessment.criterionSlug);
    if (!criterion) continue;
    if (!assessment.rationale?.trim()) continue;

    rows.push({
      dimensionId: criterion.id,
      dimensionSlug: criterion.slug,
      score: assessment.score,
      weight: criterion.weight,
      evidence: assessment.supportingFactIds ?? [],
      notes: assessment.rationale,
      confidence: assessment.confidence,
    });
  }

  return rows.length > 0 ? rows : null;
}

/**
 * Compute a traceable overall score from dimension rows.
 * Returns null if dimensions are missing — never invents an overall.
 */
export function buildTraceableOverallScore(input: {
  dimensions: EditorialDimensionScore[];
  methodology?: Methodology | null;
  methodologySlug?: string;
  methodologyVersion?: string;
  profileId?: string;
  rationale?: string;
  computedAt?: string;
}): TraceableOverallScore | null {
  if (input.dimensions.length === 0) return null;

  let weightedSum = 0;
  let totalWeight = 0;
  for (const row of input.dimensions) {
    weightedSum += row.score * row.weight;
    totalWeight += row.weight;
  }
  if (totalWeight === 0) return null;

  const overall = Math.round((weightedSum / totalWeight) * 100) / 100;

  return {
    overall,
    dimensions: input.dimensions,
    methodologySlug:
      input.methodologySlug ?? input.methodology?.slug ?? undefined,
    methodologyVersion:
      input.methodologyVersion ?? input.methodology?.version ?? undefined,
    profileId: input.profileId,
    computedAt: input.computedAt,
    rationale: input.rationale,
  };
}

/**
 * Prefer methodology-weighted overall when available; otherwise null.
 * Does not invent scores for products that lack approved assessments.
 */
export function resolveTraceableScoreFromMethodology(input: {
  assessments: CriterionAssessment[];
  methodology: Methodology;
  approvedOnly?: boolean;
  rationale?: string;
}): TraceableOverallScore | null {
  const dimensions = buildDimensionScoresFromAssessments({
    assessments: input.assessments,
    methodology: input.methodology,
    approvedOnly: input.approvedOnly,
  });
  if (!dimensions) return null;

  const overall = computeWeightedOverall(
    input.assessments.filter(
      (a) =>
        (input.approvedOnly === false || a.status === "approved") &&
        dimensions.some((d) => d.dimensionSlug === a.criterionSlug),
    ),
    input.methodology,
  );
  if (overall == null) return null;

  return buildTraceableOverallScore({
    dimensions,
    methodology: input.methodology,
    rationale: input.rationale,
  });
}
