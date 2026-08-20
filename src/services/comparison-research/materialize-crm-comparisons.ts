import { canonicalizeComparisonSlug } from "@/domain";
import type { z } from "zod";
import { ComparisonSchema } from "@/domain";
import type { ProductEditorialAssessment } from "@/domain";
import { softwareSeed } from "@/data/seed/software";
import { loadAssessment } from "@/data/editorial/store";
import { attachExistingSupportingFacts } from "./attach-supporting-facts";
import {
  confidenceForAssessmentOutcome,
  confidenceForFeatureBundle,
  confidenceForPricingOutcome,
} from "./comparison-confidence";
import { researchedAvailabilityTieReason } from "./distinctive-research";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

type ComparisonInput = z.input<typeof ComparisonSchema>;

type FeatureAvailability =
  | "supported"
  | "limited"
  | "add-on"
  | "not-supported"
  | "unknown"
  | string;

type FeatureRow = {
  featureSlug: string;
  availability: FeatureAvailability;
  sourceIds?: string[];
};

type Enrichment = {
  productSlug: string;
  featureSupport?: FeatureRow[];
  pricing?: {
    startingPriceMonthly?: number | null;
    hasFreePlan?: boolean | null;
    hasFreeTrial?: boolean | null;
    currency?: string;
    verifiedAt?: string;
    sourceIds?: string[];
    notes?: string;
  };
  vendorPositioning?: Array<{ claim?: string; sourceIds?: string[] }>;
  editorialFit?: Array<{
    strength?: string;
    rationale?: string;
    businessSizeSlug?: string;
    teamTypeSlug?: string;
  }>;
  limitations?: Array<{ text?: string } | string>;
  screenshots?: Array<{ id: string; src: string }>;
};

/** Match SeoFieldsSchema title max — long vendor names must not break catalogue load. */
const SEO_TITLE_MAX = 70;

function comparisonSeoTitle(labelA: string, labelB: string): string {
  const pair = `${labelA} vs ${labelB}`;
  const candidates = [
    `${pair}: Which CRM Is Better?`,
    `${pair}: CRM Compared`,
    `${pair} Compared`,
    pair,
  ];
  for (const candidate of candidates) {
    if (candidate.length <= SEO_TITLE_MAX) return candidate;
  }
  return pair.length <= SEO_TITLE_MAX
    ? pair
    : `${pair.slice(0, SEO_TITLE_MAX - 1)}…`;
}

const CRM_CRITERIA = [
  "ease-of-use",
  "pipeline-management",
  "sales-automation",
  "email-capabilities",
  "reporting",
  "customization",
  "integrations",
  "administration",
  "scalability",
  "value-for-money",
] as const;

/** Criterion → enrichment feature slugs used as evidence. */
const CRITERION_FEATURES: Record<(typeof CRM_CRITERIA)[number], string[]> = {
  "ease-of-use": ["mobile-app", "contact-management"],
  "pipeline-management": [
    "pipeline-management",
    "deal-management",
    "custom-pipelines",
  ],
  "sales-automation": [
    "workflow-automation",
    "sales-automation",
    "lead-scoring",
  ],
  "email-capabilities": [
    "email-sync",
    "email-tracking",
    "email-sequences",
    "call-functionality",
  ],
  reporting: ["reporting", "forecasting"],
  customization: ["custom-fields", "custom-pipelines"],
  integrations: ["integrations"],
  administration: [
    "sso",
    "custom-fields",
    "custom-objects",
    "custom-pipelines",
  ],
  scalability: ["custom-objects", "custom-pipelines", "integrations"],
  "value-for-money": [],
};

/** Assessment criterion slugs that map onto comparison criteria. */
const CRM_SCORE_KEYS: Record<(typeof CRM_CRITERIA)[number], string[]> = {
  "ease-of-use": ["ease-of-use"],
  "pipeline-management": ["pipeline-management"],
  "sales-automation": ["sales-automation"],
  "email-capabilities": ["email-capabilities"],
  reporting: ["reporting"],
  customization: ["customization"],
  integrations: ["integrations"],
  administration: ["administration", "administration-overhead"],
  scalability: ["scalability"],
  "value-for-money": ["value-for-money"],
};

function researchRoot(): string {
  return join(process.cwd(), "src/data/research");
}

function loadEnrichment(slug: string): Enrichment | null {
  const path = join(researchRoot(), slug, "enrichment.json");
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as Enrichment;
}

function availabilityScore(value: FeatureAvailability | undefined): number | null {
  if (!value || value === "unknown") return null;
  if (value === "supported") return 3;
  if (value === "limited" || value === "add-on") return 2;
  if (value === "not-supported") return 0;
  return 1;
}

function featureMap(enrichment: Enrichment | null): Map<string, FeatureRow> {
  const map = new Map<string, FeatureRow>();
  for (const row of enrichment?.featureSupport ?? []) {
    map.set(row.featureSlug, row);
  }
  return map;
}

function factId(slug: string, featureSlug: string): string {
  return `fact-${slug}-features.${featureSlug}`;
}

function productLabel(slug: string, labels: Map<string, string>): string {
  return labels.get(slug) ?? slug;
}

function compareFeatureBundle(
  slugA: string,
  slugB: string,
  labelA: string,
  labelB: string,
  features: string[],
  mapA: Map<string, FeatureRow>,
  mapB: Map<string, FeatureRow>,
): {
  winnerKind: "product-a" | "product-b" | "tie" | "depends";
  winnerSlug: string | null;
  reason: string;
  confidence: "low" | "medium" | "high";
  supportingFactIds: string[];
  researchStatus: "complete" | "in-progress";
} {
  if (features.length === 0) {
    return {
      winnerKind: "depends",
      winnerSlug: null,
      reason:
        "Not enough structured criterion evidence to declare a winner — outcome depends on buyer priorities.",
      confidence: "low",
      supportingFactIds: [],
      researchStatus: "complete",
    };
  }

  let scoreA = 0;
  let scoreB = 0;
  let known = 0;
  const supportingFactIds: string[] = [];
  const notes: string[] = [];

  for (const feature of features) {
    const a = mapA.get(feature);
    const b = mapB.get(feature);
    const sa = availabilityScore(a?.availability);
    const sb = availabilityScore(b?.availability);
    if (sa == null && sb == null) continue;
    known += 1;
    if (sa != null) {
      scoreA += sa;
      supportingFactIds.push(factId(slugA, feature));
    }
    if (sb != null) {
      scoreB += sb;
      supportingFactIds.push(factId(slugB, feature));
    }
    if (sa != null && sb != null && sa !== sb) {
      const stronger = sa > sb ? labelA : labelB;
      notes.push(
        `${feature}: ${stronger} shows stronger researched availability (${a?.availability ?? "unknown"} vs ${b?.availability ?? "unknown"}).`,
      );
    }
  }

  if (known === 0) {
    return {
      winnerKind: "depends",
      winnerSlug: null,
      reason:
        "Feature evidence for this criterion is incomplete for one or both products.",
      confidence: "low",
      supportingFactIds: [],
      researchStatus: "in-progress",
    };
  }

  if (scoreA === scoreB) {
    const rows = features.map((feature) => ({
      feature,
      availabilityA: mapA.get(feature)?.availability,
      availabilityB: mapB.get(feature)?.availability,
    }));
    return {
      winnerKind: "tie",
      winnerSlug: null,
      reason:
        notes[0] ??
        researchedAvailabilityTieReason(labelA, labelB, rows),
      confidence: confidenceForFeatureBundle({
        known,
        featureCount: features.length,
        diffNotes: notes.length,
        scoreDiff: 0,
        supportingFactIds,
        researchStatus: "complete",
        hasWinner: false,
      }),
      supportingFactIds,
      researchStatus: "complete",
    };
  }

  const aWins = scoreA > scoreB;
  return {
    winnerKind: aWins ? "product-a" : "product-b",
    winnerSlug: aWins ? slugA : slugB,
    reason:
      notes[0] ??
      `${aWins ? labelA : labelB} has stronger researched coverage across ${features.join(", ")}.`,
    confidence: confidenceForFeatureBundle({
      known,
      featureCount: features.length,
      diffNotes: notes.length,
      scoreDiff: Math.abs(scoreA - scoreB),
      supportingFactIds,
      researchStatus: "complete",
      hasWinner: true,
    }),
    supportingFactIds,
    researchStatus: "complete",
  };
}

function scoresOf(
  assessment: ProductEditorialAssessment | null,
): Map<string, number> {
  const scores = new Map<string, number>();
  for (const row of assessment?.criterionAssessments ?? []) {
    if (typeof row.score === "number") scores.set(row.criterionSlug, row.score);
  }
  return scores;
}

function mappedScore(
  scores: Map<string, number>,
  keys: string[],
): number | null {
  for (const key of keys) {
    const value = scores.get(key);
    if (typeof value === "number") return value;
  }
  return null;
}

function criterionRow(
  assessment: ProductEditorialAssessment | null,
  keys: string[],
) {
  for (const key of keys) {
    const row = assessment?.criterionAssessments?.find(
      (item) => item.criterionSlug === key,
    );
    if (row) return row;
  }
  return undefined;
}

function editorialCrmOutcome(
  slugA: string,
  slugB: string,
  labelA: string,
  labelB: string,
  criterion: (typeof CRM_CRITERIA)[number],
  assessmentA: ProductEditorialAssessment | null,
  assessmentB: ProductEditorialAssessment | null,
  featureFallback: ReturnType<typeof compareFeatureBundle>,
): {
  winnerKind: "product-a" | "product-b" | "tie" | "depends";
  winnerSlug: string | null;
  reason: string;
  confidence: "low" | "medium" | "high";
  supportingFactIds: string[];
  assessmentIds: string[];
  researchStatus: "complete" | "in-progress";
} {
  const keys = CRM_SCORE_KEYS[criterion];
  const scoreA = mappedScore(scoresOf(assessmentA), keys);
  const scoreB = mappedScore(scoresOf(assessmentB), keys);
  const approved =
    assessmentA?.status === "approved" && assessmentB?.status === "approved";
  const assessmentIds = [assessmentA?.id, assessmentB?.id].filter(
    (id): id is string => Boolean(id),
  );
  const factIds = [
    ...(criterionRow(assessmentA, keys)?.supportingFactIds ?? []),
    ...(criterionRow(assessmentB, keys)?.supportingFactIds ?? []),
    ...(featureFallback.supportingFactIds ?? []),
  ];

  if (approved && scoreA != null && scoreB != null) {
    const delta = scoreA - scoreB;
    if (Math.abs(delta) <= 0.5) {
      if (
        featureFallback.winnerKind === "product-a" ||
        featureFallback.winnerKind === "product-b"
      ) {
        return {
          ...featureFallback,
          reason: `${featureFallback.reason} Editorial scores are close (${scoreA}/10 vs ${scoreB}/10).`,
          confidence: confidenceForFeatureBundle({
            known: featureFallback.supportingFactIds.length,
            featureCount: CRITERION_FEATURES[criterion].length,
            diffNotes: featureFallback.reason.includes(":")
              ? featureFallback.reason.split(":").length - 1
              : 1,
            scoreDiff: 1,
            supportingFactIds: factIds,
            researchStatus: "complete",
            hasWinner: true,
          }),
          supportingFactIds: factIds,
          assessmentIds,
        };
      }
      const label = criterion.replace(/-/g, " ");
      return {
        winnerKind: "tie",
        winnerSlug: null,
        reason: `${labelA} and ${labelB} are close on ${label} (${scoreA}/10 vs ${scoreB}/10) from approved SoftwareGlimpse editorial assessments — not hands-on lab testing.`,
        confidence: confidenceForAssessmentOutcome({
          scoreA,
          scoreB,
          supportingFactIds: factIds,
          assessmentIds,
          researchStatus: "complete",
        }),
        supportingFactIds: factIds,
        assessmentIds,
        researchStatus: "complete",
      };
    }
    const aWins = delta > 0;
    const label = criterion.replace(/-/g, " ");
    const lead = `${aWins ? labelA : labelB} leads on ${label}`;
    return {
      winnerKind: aWins ? "product-a" : "product-b",
      winnerSlug: aWins ? slugA : slugB,
      reason: `${lead} (${scoreA}/10 vs ${scoreB}/10) from approved SoftwareGlimpse editorial assessments — not hands-on lab testing.`,
      confidence: confidenceForAssessmentOutcome({
        scoreA,
        scoreB,
        supportingFactIds: factIds,
        assessmentIds,
        researchStatus: "complete",
      }),
      supportingFactIds: factIds,
      assessmentIds,
      researchStatus: "complete",
    };
  }

  return {
    ...featureFallback,
    supportingFactIds: factIds,
    assessmentIds,
  };
}

function pricingOutcome(
  slugA: string,
  slugB: string,
  labelA: string,
  labelB: string,
  enA: Enrichment | null,
  enB: Enrichment | null,
) {
  const pA = enA?.pricing;
  const pB = enB?.pricing;
  const supportingFactIds = [
    ...(pA?.sourceIds?.map((id) => `fact-${slugA}-pricing.${id}`) ?? []),
    ...(pB?.sourceIds?.map((id) => `fact-${slugB}-pricing.${id}`) ?? []),
  ];

  if (
    pA?.startingPriceMonthly == null ||
    pB?.startingPriceMonthly == null
  ) {
    return {
      winnerKind: "depends" as const,
      winnerSlug: null,
      reason:
        "Verified starting prices are incomplete for one or both products — value depends on required plan features.",
      confidence: confidenceForPricingOutcome({
        hasVerifiedPrices: false,
        supportingFactIds,
        researchStatus: "in-progress",
        hasWinner: false,
      }),
      supportingFactIds,
      researchStatus: "in-progress" as const,
    };
  }

  const freeA = Boolean(pA.hasFreePlan);
  const freeB = Boolean(pB.hasFreePlan);
  if (freeA !== freeB) {
    const winner = freeA ? slugA : slugB;
    const label = freeA ? labelA : labelB;
    return {
      winnerKind: (freeA ? "product-a" : "product-b") as "product-a" | "product-b",
      winnerSlug: winner,
      reason: `${label} researches a free plan; the other product does not in current verified pricing.`,
      confidence: confidenceForPricingOutcome({
        hasVerifiedPrices: true,
        supportingFactIds,
        researchStatus: "complete",
        hasWinner: true,
      }),
      supportingFactIds,
      researchStatus: "complete" as const,
    };
  }

  if (pA.startingPriceMonthly === pB.startingPriceMonthly) {
    return {
      winnerKind: "tie" as const,
      winnerSlug: null,
      reason: `Both list the same researched starting price ($${pA.startingPriceMonthly}/user/mo). Value still depends on included features.`,
      confidence: confidenceForPricingOutcome({
        hasVerifiedPrices: true,
        supportingFactIds,
        researchStatus: "complete",
        hasWinner: false,
      }),
      supportingFactIds,
      researchStatus: "complete" as const,
    };
  }

  // Lower price is not automatically better — mark depends with pricing context.
  return {
    winnerKind: "depends" as const,
    winnerSlug: null,
    reason: `${labelA} researched starting price $${pA.startingPriceMonthly}/user/mo vs ${labelB} $${pB.startingPriceMonthly}/user/mo. Better value depends on which features you need on that plan.`,
    confidence: confidenceForPricingOutcome({
      hasVerifiedPrices: true,
      supportingFactIds,
      researchStatus: "complete",
      hasWinner: false,
    }),
    supportingFactIds,
    researchStatus: "complete" as const,
  };
}

function bestForFromEnrichment(
  slug: string,
  enrichment: Enrichment | null,
): string[] {
  const scenarios: string[] = [];
  for (const fit of enrichment?.editorialFit ?? []) {
    if (fit.strength === "strong" && fit.rationale) {
      scenarios.push(fit.rationale.replace(/\.$/, ""));
    }
  }
  for (const pos of enrichment?.vendorPositioning ?? []) {
    if (pos.claim && scenarios.length < 3) scenarios.push(pos.claim);
  }
  if (scenarios.length === 0) {
    scenarios.push(`Teams evaluating ${slug} on current SoftwareGlimpse research`);
  }
  return [...new Set(scenarios)].slice(0, 3);
}

function buildPair(
  slugA: string,
  slugB: string,
  labels: Map<string, string>,
  autoApprove: boolean,
): ComparisonInput {
  const productSlugs = [slugA, slugB] as [string, string];
  const slug = canonicalizeComparisonSlug(productSlugs);
  // Lexicographic order for product-a / product-b in outcomes
  const [left, right] =
    slugA < slugB ? [slugA, slugB] : [slugB, slugA];
  const labelA = productLabel(left, labels);
  const labelB = productLabel(right, labels);
  const enA = loadEnrichment(left);
  const enB = loadEnrichment(right);
  const mapA = featureMap(enA);
  const mapB = featureMap(enB);

  const assessmentA = loadAssessment(left);
  const assessmentB = loadAssessment(right);

  const outcomes = CRM_CRITERIA.map((criterion) => {
    if (criterion === "value-for-money") {
      const o = pricingOutcome(left, right, labelA, labelB, enA, enB);
      if (!(o.winnerKind === "depends" && o.researchStatus === "in-progress")) {
        return { criterionSlug: criterion, ...o };
      }
      const editorial = editorialCrmOutcome(
        left,
        right,
        labelA,
        labelB,
        criterion,
        assessmentA,
        assessmentB,
        o,
      );
      return { criterionSlug: criterion, ...editorial };
    }
    const bundle = compareFeatureBundle(
      left,
      right,
      labelA,
      labelB,
      CRITERION_FEATURES[criterion],
      mapA,
      mapB,
    );
    const editorial = editorialCrmOutcome(
      left,
      right,
      labelA,
      labelB,
      criterion,
      assessmentA,
      assessmentB,
      bundle,
    );
    return { criterionSlug: criterion, ...editorial };
  });

  const outcomesWithFacts = attachExistingSupportingFacts(left, right, outcomes);

  const complete = outcomesWithFacts.filter((o) => o.researchStatus === "complete");
  const researchedEnough = complete.length >= 3 && Boolean(enA) && Boolean(enB);
  const shotCount =
    (enA?.screenshots?.length ?? 0) + (enB?.screenshots?.length ?? 0);

  const priceA = enA?.pricing?.startingPriceMonthly;
  const priceB = enB?.pricing?.startingPriceMonthly;
  const pricingNotes =
    priceA != null && priceB != null
      ? `Researched list starting prices: ${labelA} from $${priceA}/user/mo; ${labelB} from $${priceB}/user/mo. Confirm live vendor pricing before buying.`
      : `Pricing notes use verified research when available for ${labelA} and ${labelB}. Confirm live vendor pricing before buying.`;

  const title = `${labelA} vs ${labelB}`;
  const approve = autoApprove && researchedEnough;
  const publishedAt = approve ? new Date(Date.now() - 60_000).toISOString() : undefined;
  const updatedAt = new Date().toISOString();

  return {
    id: `cmp-${slug}`,
    slug,
    title,
    productSlugs: [left, right],
    categorySlug: "crm",
    criterionSlugs: [...CRM_CRITERIA],
    outcomes: outcomesWithFacts,
    verdict: `There is no universal winner between ${labelA} and ${labelB}. Choose based on criterion fit — pipeline depth, automation, email/calling, reporting, and pricing trade-offs shown in this researched comparison.`,
    overallWinnerKind: "depends",
    overallWinnerSlug: null,
    bestFor: [
      { productSlug: left, scenarios: bestForFromEnrichment(left, enA) },
      { productSlug: right, scenarios: bestForFromEnrichment(right, enB) },
    ],
    summary: `Researched side-by-side comparison of ${labelA} and ${labelB} using SoftwareGlimpse CRM criteria, verified feature evidence${shotCount > 0 ? `, and ${shotCount} product UI screenshots across both products` : ""}.`,
    pricingNotes,
    scenarioRecommendations: [
      {
        scenario: `Prefer ${labelA}'s researched strengths`,
        preferredSlug: left,
        rationale: bestForFromEnrichment(left, enA)[0]!,
      },
      {
        scenario: `Prefer ${labelB}'s researched strengths`,
        preferredSlug: right,
        rationale: bestForFromEnrichment(right, enB)[0]!,
      },
    ],
    methodologyVersion: "1.0.0",
    editorialStatus: approve ? "approved" : "review-required",
    metadata: {
      status: approve ? "published" : "researching",
      researchStatus: researchedEnough ? "complete" : "in-progress",
      publishedAt,
      updatedAt,
    },
    seo: {
      title: comparisonSeoTitle(labelA, labelB),
      description: `Compare ${labelA} and ${labelB} on features, pricing, and buyer fit using SoftwareGlimpse researched criteria.`,
      indexable: approve,
      canonicalPath: `/compare/${slug}/`,
    },
  };
}

export type MaterializeCrmComparisonsOptions = {
  autoApprove?: boolean;
  productSlugs?: string[];
};

export function listCrmProductSlugs(): string[] {
  return softwareSeed
    .filter((s) => s.primaryCategorySlug === "crm")
    .map((s) => s.slug)
    .sort();
}

export function buildCrmComparisonsFromResearch(
  options: MaterializeCrmComparisonsOptions = {},
): ComparisonInput[] {
  const autoApprove = options.autoApprove ?? false;
  const products = softwareSeed.filter((s) => s.primaryCategorySlug === "crm");
  const slugs = (options.productSlugs ?? products.map((p) => p.slug)).sort();
  const labels = new Map(products.map((p) => [p.slug, p.name]));

  const out: ComparisonInput[] = [];
  for (let i = 0; i < slugs.length; i += 1) {
    for (let j = i + 1; j < slugs.length; j += 1) {
      out.push(buildPair(slugs[i]!, slugs[j]!, labels, autoApprove));
    }
  }
  return out;
}

export function crmComparisonCoverageReport(
  comparisons: ComparisonInput[] = buildCrmComparisonsFromResearch({
    autoApprove: true,
  }),
) {
  return {
    pairCount: comparisons.length,
    approved: comparisons.filter((c) => c.editorialStatus === "approved").length,
    indexable: comparisons.filter((c) => c.seo?.indexable).length,
    withScreenshots: comparisons.filter((c) =>
      String(c.summary ?? "").includes("screenshot"),
    ).length,
    incompleteResearch: comparisons.filter(
      (c) => c.metadata?.researchStatus !== "complete",
    ).map((c) => c.slug),
  };
}
