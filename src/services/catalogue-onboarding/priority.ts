import {
  cataloguePriorityWeights,
  categoryStrategicWeights,
} from "@/data/config/catalogue/priority-weights";
import {
  getAlternativesPageBySlug,
  getComparisonsForProduct,
  getSoftwareBySlug,
} from "@/data";
import { loadEnrichment } from "@/data/research/store";
import type {
  CategoryReadinessStatus,
  NormalizedCatalogueCandidate,
} from "@/domain";
import type { CatalogueClassification } from "./classify";
import type { CatalogueMapping } from "./map";

export type CommercialPriorityResult = {
  score: number;
  label: "very-high" | "high" | "medium" | "low" | "none";
  reasons: string[];
  /** Existing mature products should RECONCILE/MAINTAIN not re-onboard. */
  actionHint: "ONBOARD" | "RECONCILE" | "MAINTAIN" | "DEFER" | "EXCLUDE" | "REVIEW";
};

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function labelFor(score: number): CommercialPriorityResult["label"] {
  if (score >= 75) return "very-high";
  if (score >= 55) return "high";
  if (score >= 35) return "medium";
  if (score >= 15) return "low";
  return "none";
}

/**
 * Onboarding priority — NOT product recommendation ranking.
 * Commercial metrics never enter editorial scoring.
 */
export function scoreCommercialPriority(input: {
  candidate: NormalizedCatalogueCandidate;
  classification: CatalogueClassification;
  mapping: CatalogueMapping;
}): CommercialPriorityResult {
  const { candidate, classification, mapping } = input;
  const reasons: string[] = [];
  const w = cataloguePriorityWeights;
  const c = candidate.commercial;

  // Normalize commercial signals against Pipedrive-scale fixtures
  const convScore = clamp01(c.conversions / 420);
  const revScore = clamp01(c.revenueAmount / 18_500_000);
  const clickScore = clamp01(c.clicks / 8_420);
  const commercialBlend = convScore * 0.5 + revScore * 0.35 + clickScore * 0.15;
  if (c.conversions >= 100) reasons.push("+ strong historical conversions");
  if (c.revenueAmount >= 5_000_000) reasons.push("+ strong historical commission signal");
  if (c.clicks >= 2000) reasons.push("+ high click volume");

  const demand = clickScore;

  const catSlug = mapping.categorySlug ?? "";
  const strategic = categoryStrategicWeights[catSlug] ?? 0.25;
  if (strategic >= 0.85) reasons.push("+ category strategic priority");

  const slug =
    mapping.canonicalProductSlug ?? candidate.suggestedSlug;
  const product = getSoftwareBySlug(slug, { includeUnpublished: true });
  let contentEquity = 0;
  if (product) {
    contentEquity += 0.4;
    const enrichment = loadEnrichment(product.slug);
    if (enrichment) contentEquity += 0.3;
    const alts = getAlternativesPageBySlug(product.slug, {
      includeUnpublished: true,
    });
    if (alts) contentEquity += 0.15;
    const comps = getComparisonsForProduct(product.slug, {
      includeUnpublished: true,
    });
    if (comps.length) contentEquity += 0.15;
    reasons.push("+ existing content equity");
  }

  const readinessScore = readinessToScore(mapping.categoryReadiness);
  if (mapping.categoryReadiness === "CATEGORY_READY") {
    reasons.push("+ category ready");
  } else if (mapping.categoryReadiness === "CATEGORY_NOT_READY") {
    reasons.push("- category not ready");
  }

  const statusScore =
    candidate.affiliateStatus === "active"
      ? 1
      : candidate.affiliateStatus === "pending"
        ? 0.7
        : candidate.affiliateStatus === "terms-review"
          ? 0.4
          : 0.2;
  if (candidate.affiliateStatus === "active") reasons.push("+ active affiliate");

  // Lower effort score = harder (we invert for priority)
  let effortEase = 0.7;
  if (classification.identityOutcome === "EXISTING") effortEase = 1;
  if (classification.bucket === "REVIEW_REQUIRED") effortEase = 0.2;
  if (classification.bucket === "MULTI_PRODUCT_PROGRAM") effortEase = 0.15;
  if (mapping.categoryReadiness === "CATEGORY_NOT_READY") effortEase *= 0.4;

  const score = Math.round(
    100 *
      (w.historicalConversionCommission * commercialBlend +
        w.existingTrafficDemand * demand +
        w.categoryStrategicPriority * strategic +
        w.existingContentEquity * contentEquity +
        w.categoryReadiness * readinessScore +
        w.affiliateStatus * statusScore +
        w.implementationEffort * effortEase),
  );

  let actionHint: CommercialPriorityResult["actionHint"] = "ONBOARD";
  if (
    classification.bucket === "SERVICE" ||
    classification.bucket === "MARKETPLACE" ||
    classification.bucket === "LOGISTICS" ||
    classification.bucket === "OTHER"
  ) {
    actionHint = "EXCLUDE";
    reasons.push("→ exclude from software onboarding");
  } else if (
    classification.bucket === "MULTI_PRODUCT_PROGRAM" ||
    classification.bucket === "REVIEW_REQUIRED"
  ) {
    actionHint = "REVIEW";
  } else if (
    classification.identityOutcome === "EXISTING" &&
    product &&
    (product.metadata.status === "published" || contentEquity >= 0.7)
  ) {
    actionHint = score >= 70 ? "MAINTAIN" : "RECONCILE";
    reasons.push("→ reconcile / maintain (already onboarded)");
  } else if (mapping.categoryReadiness === "CATEGORY_NOT_READY") {
    actionHint = "DEFER";
    reasons.push("→ defer until category ready");
  } else if (classification.identityOutcome === "EXISTING") {
    actionHint = "RECONCILE";
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    label: labelFor(score),
    reasons,
    actionHint,
  };
}

function readinessToScore(status: CategoryReadinessStatus): number {
  switch (status) {
    case "CATEGORY_READY":
      return 1;
    case "CATEGORY_PARTIAL":
      return 0.55;
    case "CATEGORY_NOT_READY":
      return 0.15;
    default:
      return 0.1;
  }
}
