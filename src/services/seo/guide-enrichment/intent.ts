import type { GuidePage } from "@/domain/schemas";
import { guideTargetIntent } from "@/services/seo/guides-index-worthiness/classify";
import type { CommercialIntent, GuideSearchIntent } from "./types";
import { classifyEnrichmentGuideType } from "./taxonomy";

export type GscGuideSignal = {
  impressions: number;
  clicks?: number;
  position: number | null;
  queries: string[];
  /** From GSC Opportunity Engine when available. */
  opportunityScore?: number;
  queueBucket?: string | null;
  hasDirectQuery?: boolean;
};

function commercialIntentFor(
  guide: GuidePage,
  enrichmentType: ReturnType<typeof classifyEnrichmentGuideType>,
): CommercialIntent {
  if (
    enrichmentType === "BUYING_GUIDE" ||
    enrichmentType === "COST_GUIDE" ||
    enrichmentType === "DECISION_GUIDE" ||
    guide.topicType === "buying-guide" ||
    guide.topicType === "pricing-education" ||
    guide.topicType === "selection"
  ) {
    return "commercial";
  }
  if (
    enrichmentType === "CATEGORY_EDUCATION" ||
    enrichmentType === "FEATURE_GUIDE" ||
    enrichmentType === "PRODUCT_EXPLAINER" ||
    guide.journeyStage === "learn" ||
    guide.journeyStage === "understand"
  ) {
    return "informational";
  }
  return "mixed";
}

function likelyReaderFor(
  enrichmentType: ReturnType<typeof classifyEnrichmentGuideType>,
  stage: string,
): string {
  switch (enrichmentType) {
    case "PRODUCT_EXPLAINER":
      return "Researcher orienting on a named product before evaluation";
    case "INDUSTRY_GUIDE":
      return "Operator or buyer in a specific industry choosing software";
    case "USE_CASE_GUIDE":
      return "Practitioner solving a concrete workflow problem";
    case "IMPLEMENTATION_GUIDE":
    case "MIGRATION_GUIDE":
      return "Implementer planning rollout or cutover";
    case "COST_GUIDE":
      return "Buyer comparing plan fit and cost structure";
    case "BUYING_GUIDE":
    case "DECISION_GUIDE":
      return "Buyer shortlisting tools against requirements";
    default:
      return stage === "learn" || stage === "understand"
        ? "Researcher learning the category"
        : "Buyer mid-evaluation";
  }
}

/**
 * Infer search intent for a guide. Prefer GSC queries when provided;
 * otherwise infer conservatively from topic taxonomy.
 */
export function resolveGuideSearchIntent(
  guide: GuidePage,
  gsc?: GscGuideSignal | null,
): GuideSearchIntent {
  const enrichmentType = classifyEnrichmentGuideType(guide);
  const topicIntent = guideTargetIntent(guide);
  const hasGsc = Boolean(gsc && (gsc.queries.length > 0 || gsc.impressions > 0));

  const primaryIntent =
    enrichmentType === "PRODUCT_EXPLAINER" && guide.productSlugs[0]
      ? gsc?.queries[0]?.trim() ||
        `what is ${guide.productSlugs[0].replace(/-/g, " ")}`
      : gsc?.queries[0]?.trim() ||
        topicIntent ||
        guide.title ||
        guide.slug;

  return {
    primaryIntent,
    likelyReader: likelyReaderFor(enrichmentType, guide.journeyStage),
    decisionStage: guide.journeyStage,
    categorySlug: guide.categorySlugs[0] ?? null,
    relatedProductSlugs: [...guide.productSlugs],
    relatedUseCaseSlugs: [],
    relatedCapabilitySlugs: [],
    commercialIntent: commercialIntentFor(guide, enrichmentType),
    gscQueries: gsc?.queries ?? [],
    gscImpressions: gsc?.impressions ?? null,
    gscPosition: gsc?.position ?? null,
    inferenceSource: hasGsc
      ? gsc!.queries.length > 0
        ? "mixed"
        : "gsc"
      : "topic",
  };
}
