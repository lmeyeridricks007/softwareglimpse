import type {
  CriterionAssessment,
  FeatureAvailability,
  Methodology,
  ProductResearchEnrichment,
  ResearchFact,
} from "@/domain";
import { loadEnrichment, loadFacts } from "@/data/research/store";

/**
 * Provisional feature-availability → score mapping for fixture demos ONLY.
 *
 * RULE:
 * - supported feature cluster → base 7.0
 * - limited → 5.0
 * - unsupported / unknown / missing → no auto score (omit criterion)
 *
 * This is not a substitute for human editorial judgment. Auto scores always
 * use confidence "low" and status "assessment-in-progress".
 */
export const FEATURE_AVAILABILITY_SCORE: Partial<
  Record<FeatureAvailability, number>
> = {
  supported: 7.0,
  limited: 5.0,
};

/**
 * Criterion → enrichment feature slugs used for provisional auto-scoring.
 * Empty arrays = human judgment required (never auto-scored).
 */
export const CRITERION_FEATURE_MAP: Record<string, string[]> = {
  "ease-of-use": [],
  "pipeline-management": ["pipeline-management", "deal-management"],
  "sales-automation": ["workflow-automation", "sales-automation"],
  "email-capabilities": ["email-sync", "email-tracking"],
  reporting: ["reporting", "forecasting"],
  customization: ["custom-fields"],
  integrations: ["integrations"],
  "administration-overhead": [],
  scalability: [],
  "value-for-money": [],
};

export function computeWeightedOverall(
  assessments: CriterionAssessment[],
  methodology: Methodology,
): number | undefined {
  if (assessments.length === 0) return undefined;

  const weightBySlug = new Map(
    methodology.criteria.map((c) => [c.slug, c.weight]),
  );

  let weightedSum = 0;
  let totalWeight = 0;

  for (const assessment of assessments) {
    const weight = weightBySlug.get(assessment.criterionSlug);
    if (weight == null) continue;
    weightedSum += assessment.score * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return undefined;
  return Math.round((weightedSum / totalWeight) * 100) / 100;
}

export function validateCriterionAssessment(
  assessment: CriterionAssessment,
  methodology: Methodology,
): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  const criterion = methodology.criteria.find(
    (c) => c.slug === assessment.criterionSlug,
  );

  if (!criterion) {
    errors.push(`unknown-criterion:${assessment.criterionSlug}`);
    return { ok: false, errors };
  }

  if (
    assessment.score < criterion.scoringScaleMin ||
    assessment.score > criterion.scoringScaleMax
  ) {
    errors.push(
      `score-out-of-range:${assessment.criterionSlug}:${assessment.score}`,
    );
  }

  if (!assessment.rationale?.trim()) {
    errors.push(`missing-rationale:${assessment.criterionSlug}`);
  }

  return { ok: errors.length === 0, errors };
}

function availabilityScore(
  availability: FeatureAvailability,
): number | undefined {
  return FEATURE_AVAILABILITY_SCORE[availability];
}

function findFeatureFactIds(
  facts: ResearchFact[],
  featureSlug: string,
): string[] {
  return facts
    .filter(
      (f) =>
        (f.status === "approved" || f.status === "verified") &&
        (f.field === `features.${featureSlug}` ||
          f.field.endsWith(`.${featureSlug}`)),
    )
    .map((f) => f.id);
}

/**
 * Build provisional criterion assessments from enrichment feature availability.
 * Omits criteria with empty maps or no scorable feature evidence.
 */
export function buildProvisionalAssessmentsFromEnrichment(input: {
  enrichment: ProductResearchEnrichment;
  facts?: ResearchFact[];
  methodology: Methodology;
}): CriterionAssessment[] {
  const facts = input.facts ?? [];
  const supportBySlug = new Map(
    input.enrichment.featureSupport.map((f) => [f.featureSlug, f]),
  );

  const assessments: CriterionAssessment[] = [];

  for (const criterion of input.methodology.criteria) {
    const featureSlugs = CRITERION_FEATURE_MAP[criterion.slug];
    if (!featureSlugs || featureSlugs.length === 0) continue;

    const scored: { featureSlug: string; score: number; factIds: string[] }[] =
      [];

    for (const featureSlug of featureSlugs) {
      const support = supportBySlug.get(featureSlug);
      if (!support) continue;
      const score = availabilityScore(support.availability);
      if (score == null) continue;
      scored.push({
        featureSlug,
        score,
        factIds: findFeatureFactIds(facts, featureSlug),
      });
    }

    if (scored.length === 0) continue;

    const avg =
      scored.reduce((sum, item) => sum + item.score, 0) / scored.length;
    const rounded = Math.round(avg * 10) / 10;
    const factIds = [...new Set(scored.flatMap((s) => s.factIds))];
    const featureSummary = scored
      .map((s) => `${s.featureSlug}=${s.score}`)
      .join(", ");

    const rationale =
      factIds.length > 0
        ? `Provisional fixture-demo mapping from feature availability (${featureSummary}). Supporting facts: ${factIds.join(", ")}.`
        : `Provisional fixture-demo mapping from feature availability (${featureSummary}). No approved feature facts linked yet.`;

    assessments.push({
      criterionSlug: criterion.slug,
      score: rounded,
      rationale,
      supportingFactIds: factIds,
      confidence: "low",
      status: "assessment-in-progress",
    });
  }

  return assessments;
}

/**
 * Load enrichment + facts and produce provisional assessments for a product.
 */
export function provisionalAssessmentsForProduct(
  productSlug: string,
  methodology: Methodology,
): CriterionAssessment[] {
  const enrichment = loadEnrichment(productSlug);
  if (!enrichment) return [];
  const facts = loadFacts(productSlug);
  return buildProvisionalAssessmentsFromEnrichment({
    enrichment,
    facts,
    methodology,
  });
}
