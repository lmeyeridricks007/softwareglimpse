import type { GuidePage } from "@/domain/schemas";
import { evaluateGuideQuality } from "@/domain/quality-gates";
import type { SemanticRiskLevel } from "@/services/content-quality/gate/semantic-template";
import { WORD_COUNT_SOFT_WARN } from "@/services/content-quality/gate/thresholds";
import { factoryProductGuideKind } from "@/services/product-guides/kinds";
import {
  effectiveSeoIndexable,
  getLifecycleOverrideState,
  improvementReasonsFromGuideGates,
  remediationForReasons,
  resolveLifecycleState,
} from "@/services/seo/content-lifecycle";
import {
  classifyGuideAuditType,
  guideTargetIntent,
  isFactoryProductPackGuide,
  isIndustryVariantGuide,
  isProductExplainerGuide,
} from "./classify";
import {
  estimateGuideUniqueContentRatio,
  guideBodyHasUniqueAnalysis,
  guideHasTablesOrData,
  titleQualityFor,
} from "./uniqueness";
import type {
  GuideGateResult,
  GuideIndexClass,
  GuideIndexEvaluation,
  GuidePageMetrics,
} from "./types";

export type EvaluateGuideOptions = {
  inboundCount?: number;
  outboundCount?: number;
  duplicateClusterId?: string | null;
  recommendedRedirect?: string | null;
  intentClusterId?: string | null;
  intentClusterRole?: GuideIndexEvaluation["intentClusterRole"];
  /** Peer educational guide in same category with clearer canonical role. */
  preferredPrimarySlug?: string | null;
  titleCollision?: boolean;
  metaCollision?: boolean;
  /**
   * Estate-wide sibling semantic assessment (overlay-merged peers).
   * Required to clear high near-duplicate risk for factory/explainer packs.
   */
  semanticRiskLevel?: SemanticRiskLevel | null;
  semanticUniqueSignalCount?: number | null;
};

function daysSince(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / (1000 * 60 * 60 * 24));
}

function contentCompleteness(guide: GuidePage, uniq: ReturnType<typeof estimateGuideUniqueContentRatio>): number {
  let score = 0;
  const blocks = guide.blocks?.length ?? 0;
  const sections = guide.sections?.length ?? 0;
  if (blocks >= 6 || sections >= 4) score += 0.35;
  else if (blocks >= 3 || sections >= 2) score += 0.2;
  if (guide.faq.length >= 2) score += 0.1;
  if (guide.checklist.length >= 2) score += 0.1;
  if (guide.heroVisual) score += 0.1;
  if (guide.supports.length > 0) score += 0.1;
  if (guide.nextAction) score += 0.05;
  if (uniq.ratio >= 0.45) score += 0.2;
  else if (uniq.ratio >= 0.3) score += 0.1;
  return Math.min(1, Number(score.toFixed(3)));
}

function buildMetrics(
  guide: GuidePage,
  opts: EvaluateGuideOptions,
): GuidePageMetrics {
  const uniq = estimateGuideUniqueContentRatio(guide);
  const quality = evaluateGuideQuality(guide);
  const title = guide.seo.title || guide.title;
  const canonicalPath = guide.seo.canonicalPath || `/guides/${guide.slug}/`;
  const expected = `/guides/${guide.slug}/`;
  const freshness = daysSince(
    guide.metadata.updatedAt || guide.metadata.publishedAt,
  );
  const factoryKind = factoryProductGuideKind(guide);
  const guideType = classifyGuideAuditType(guide);
  const templateHeavy =
    Boolean(factoryKind) || isProductExplainerGuide(guide);
  const bodyUnique = guideBodyHasUniqueAnalysis(guide, {
    allowEnrichedFactory: true,
  });
  const semanticLevel = opts.semanticRiskLevel ?? null;
  const semanticSignals = opts.semanticUniqueSignalCount ?? null;

  // Near-dup risk: factory/explainer clear "high" only when estate sibling
  // semantic analysis says so (same SEMANTIC_SIMILARITY_* thresholds as promote).
  // Never treat slug-class alone as high risk once overlays are in the entity.
  let dupRisk: GuidePageMetrics["duplicateNearDuplicateRisk"];
  if (templateHeavy) {
    if (semanticLevel === "high") {
      dupRisk = "high";
    } else if (semanticLevel === "elevated") {
      dupRisk = uniq.ratio < 0.35 || !bodyUnique ? "high" : "medium";
    } else if (semanticLevel === "none") {
      // Sibling analysis cleared high risk — do not re-flag high from slug class.
      dupRisk = uniq.ratio < 0.35 ? "medium" : "low";
    } else {
      // No sibling assessment available — fail closed for template-heavy pages.
      dupRisk = "high";
    }
  } else {
    dupRisk =
      uniq.ratio < 0.35 || uniq.boilerplateShare >= 0.55
        ? "high"
        : uniq.ratio < 0.5
          ? "medium"
          : "low";
  }

  // Template-heavy pages: unique-analysis requires estate semantic signals
  // (block-type presence alone is factory template structure, not uniqueness).
  const uniqueAnalysisPresent = templateHeavy
    ? semanticSignals != null &&
      semanticSignals >= 2 &&
      semanticLevel !== "high"
    : guideBodyHasUniqueAnalysis(guide);

  const intentRisk: GuidePageMetrics["duplicateIntentRisk"] =
    opts.intentClusterRole === "MERGE_INTO_PRIMARY"
      ? "high"
      : isIndustryVariantGuide(guide)
        ? "medium"
        : "low";

  const stale: GuidePageMetrics["staleDataRisk"] =
    freshness == null
      ? "medium"
      : freshness > 540
        ? "high"
        : freshness > 270
          ? "medium"
          : "low";

  const productRefs = new Set<string>([
    ...guide.productSlugs,
    ...((guide.blocks ?? [])
      .flatMap((b) => {
        if (!b || typeof b !== "object") return [];
        const raw = JSON.stringify(b);
        return (raw.match(/"productSlug":"([^"]+)"/g) ?? []).map((m) =>
          m.replace(/"productSlug":"|"/g, ""),
        );
      }) as string[]),
  ]);

  const wouldKeepSeed = guide.seo.indexable === true;

  return {
    wordCount: uniq.wordCount,
    uniqueContentRatio: uniq.ratio,
    guideType,
    topicType: guide.topicType,
    journeyStage: guide.journeyStage,
    categorySlug: guide.categorySlugs[0] ?? null,
    productSlugCount: guide.productSlugs.length,
    meaningfulProductReferences: productRefs.size,
    blockCount: guide.blocks?.length ?? 0,
    sectionCount: guide.sections?.length ?? 0,
    faqCount: guide.faq?.length ?? 0,
    checklistCount: guide.checklist?.length ?? 0,
    hasHeroVisual: Boolean(guide.heroVisual),
    hasSupports: (guide.supports?.length ?? 0) > 0,
    hasNextAction: Boolean(guide.nextAction),
    relatedGuideCount: guide.relatedGuideSlugs?.length ?? 0,
    outgoingInternalLinks: opts.outboundCount ?? 0,
    incomingInternalLinks: opts.inboundCount ?? 0,
    uniqueTitle: !opts.titleCollision,
    titleQuality: titleQualityFor(title),
    uniqueMetaDescription: !opts.metaCollision,
    canonicalPresent: Boolean(guide.seo.canonicalPath || true),
    selfCanonical: canonicalPath === expected,
    indexDirective: wouldKeepSeed ? "index" : "noindex",
    sitemapInclusion: false, // filled by inventory after classification
    structuredDataPresent: true, // guide pages emit Article/WebPage + breadcrumbs
    authorAttribution: Boolean(guide.metadata.author),
    uniqueAnalysisPresent,
    originalResearchPresent: false, // guides rarely host original datasets
    tablesOrDataPresent: guideHasTablesOrData(guide),
    imagesOrScreenshots: guide.heroVisual ? 1 : 0,
    contentCompleteness: contentCompleteness(guide, uniq),
    staleDataRisk: stale,
    dataFreshnessDays: freshness,
    lastUpdated: guide.metadata.updatedAt ?? null,
    publishedAt: guide.metadata.publishedAt ?? null,
    duplicateNearDuplicateRisk: dupRisk,
    duplicateIntentRisk: intentRisk,
    factoryPackKind: factoryKind,
    qualityGateOk: quality.ok,
    qualityGateFailures: quality.failures,
    seedIndexableFlag: wouldKeepSeed,
  };
}

function evaluateGates(
  guide: GuidePage,
  metrics: GuidePageMetrics,
  opts: EvaluateGuideOptions,
): GuideGateResult[] {
  const factory = isFactoryProductPackGuide(guide);
  const productExplainer = isProductExplainerGuide(guide);
  const bodyUnique = guideBodyHasUniqueAnalysis(guide, {
    allowEnrichedFactory: true,
  });
  const semanticCleared =
    opts.semanticRiskLevel === "none" ||
    opts.semanticRiskLevel === "elevated";
  // Template-heavy pages clear the hard boilerplate gate only with unique
  // analysis signals AND estate sibling semantic risk below "high".
  const templateCleared =
    bodyUnique &&
    semanticCleared &&
    metrics.duplicateNearDuplicateRisk !== "high";

  const notFactory: GuideGateResult = {
    id: "not_factory_boilerplate",
    passed: factory || productExplainer ? templateCleared : true,
    severity: "hard",
    reasons: factory && !templateCleared
      ? [
          `Factory product-pack guide (${metrics.factoryPackKind}) — useful onsite, not a distinct search result until estate sibling analysis clears near-dup risk`,
        ]
      : productExplainer && !templateCleared
        ? [
            "Product explainer (what-is-{product}) still thin/template — enrich with product-specific orientation before indexing",
          ]
        : [],
  };

  const distinctIntent: GuideGateResult = {
    id: "distinct_search_intent",
    passed:
      metrics.duplicateIntentRisk !== "high" &&
      opts.intentClusterRole !== "MERGE_INTO_PRIMARY",
    severity: opts.intentClusterRole === "MERGE_INTO_PRIMARY" ? "hard" : "soft",
    reasons:
      opts.intentClusterRole === "MERGE_INTO_PRIMARY"
        ? [
            `Overlaps stronger primary guide${opts.preferredPrimarySlug ? ` (${opts.preferredPrimarySlug})` : ""}`,
          ]
        : metrics.duplicateIntentRisk === "medium"
          ? ["Possible intent overlap with category sibling — review cluster"]
          : [],
  };

  const substance: GuideGateResult = {
    id: "content_substance",
    passed:
      metrics.qualityGateOk &&
      (metrics.blockCount >= 3 || metrics.sectionCount >= 2) &&
      metrics.wordCount >= WORD_COUNT_SOFT_WARN,
    severity: "soft",
    reasons: [
      ...metrics.qualityGateFailures.map((f) => `quality:${f}`),
      ...(metrics.wordCount < WORD_COUNT_SOFT_WARN ? ["thin-word-count"] : []),
    ],
  };

  const uniqueAnalysis: GuideGateResult = {
    id: "unique_analysis",
    passed:
      metrics.uniqueContentRatio >= 0.35 &&
      metrics.duplicateNearDuplicateRisk !== "high",
    severity: "soft",
    reasons: [
      ...(metrics.uniqueContentRatio < 0.35
        ? [`low-unique-ratio:${metrics.uniqueContentRatio}`]
        : []),
      ...(metrics.duplicateNearDuplicateRisk === "high"
        ? ["high-near-duplicate-risk"]
        : []),
      ...(!metrics.uniqueAnalysisPresent
        ? ["limited-unique-analysis-signals"]
        : []),
    ],
    score: metrics.uniqueContentRatio,
  };

  const discoverability: GuideGateResult = {
    id: "internal_discoverability",
    passed:
      metrics.hasSupports ||
      metrics.relatedGuideCount > 0 ||
      (opts.inboundCount ?? 0) > 0 ||
      metrics.hasNextAction,
    severity: "soft",
    reasons:
      !metrics.hasSupports &&
      metrics.relatedGuideCount === 0 &&
      (opts.inboundCount ?? 0) === 0
        ? ["weak-internal-linking"]
        : [],
  };

  const canonical: GuideGateResult = {
    id: "canonical_validity",
    passed: metrics.selfCanonical && metrics.canonicalPresent,
    severity: "hard",
    reasons: metrics.selfCanonical ? [] : ["canonical-mismatch"],
  };

  const editorial: GuideGateResult = {
    id: "editorial_completeness",
    passed:
      metrics.hasHeroVisual &&
      metrics.titleQuality !== "weak" &&
      metrics.titleQuality !== "missing" &&
      Boolean(guide.seo.description?.trim()),
    // Hard: INDEXABLE pages must clear hero + title + meta (FR-007).
    severity: "hard",
    reasons: [
      ...(!metrics.hasHeroVisual ? ["missing-hero-visual"] : []),
      ...(metrics.titleQuality === "weak" || metrics.titleQuality === "missing"
        ? ["weak-title"]
        : []),
      ...(!guide.seo.description?.trim() ? ["missing-meta-description"] : []),
    ],
  };

  return [
    notFactory,
    distinctIntent,
    substance,
    uniqueAnalysis,
    discoverability,
    canonical,
    editorial,
  ];
}

function classifyFromGates(
  gates: GuideGateResult[],
  opts: EvaluateGuideOptions,
  metrics: GuidePageMetrics,
): { classification: GuideIndexClass; reasons: string[] } {
  const reasons = gates.flatMap((g) => g.reasons);
  const hardFails = gates.filter((g) => !g.passed && g.severity === "hard");
  const softFails = gates.filter((g) => !g.passed && g.severity === "soft");

  if (opts.intentClusterRole === "MERGE_INTO_PRIMARY" && opts.preferredPrimarySlug) {
    return {
      classification: "MERGE",
      reasons: [
        ...reasons,
        `Merge into primary ${opts.preferredPrimarySlug}`,
      ],
    };
  }

  if (hardFails.some((g) => g.id === "not_factory_boilerplate")) {
    // Preserve page; queue for enrichment — not a permanent NOINDEX class.
    return { classification: "IMPROVE", reasons };
  }

  if (hardFails.some((g) => g.id === "canonical_validity")) {
    return { classification: "IMPROVE", reasons };
  }

  if (hardFails.some((g) => g.id === "editorial_completeness")) {
    return { classification: "IMPROVE", reasons };
  }

  if (hardFails.some((g) => g.id === "distinct_search_intent")) {
    return {
      classification: opts.preferredPrimarySlug ? "MERGE" : "REVIEW_MANUALLY",
      reasons,
    };
  }

  const substance = gates.find((g) => g.id === "content_substance");
  const unique = gates.find((g) => g.id === "unique_analysis");
  if (!substance?.passed) {
    return { classification: "IMPROVE", reasons };
  }
  if (!unique?.passed) {
    return { classification: "IMPROVE", reasons };
  }

  // Soft linking gaps alone do not remove a strong educational guide from the
  // index — they become IMPROVE when stacked with weak completeness.
  const softMaterial = softFails.filter((g) =>
    g.id === "internal_discoverability",
  );
  if (softMaterial.length >= 1 && metrics.contentCompleteness < 0.55) {
    return { classification: "IMPROVE", reasons };
  }

  if (!metrics.qualityGateOk) {
    return { classification: "IMPROVE", reasons };
  }

  return {
    classification: "KEEP_INDEX",
    reasons: reasons.length ? reasons : ["All index-worthiness gates passed"],
  };
}

export function evaluateGuideIndexWorthiness(
  guide: GuidePage,
  opts: EvaluateGuideOptions = {},
): GuideIndexEvaluation {
  const metrics = buildMetrics(guide, opts);
  const gates = evaluateGates(guide, metrics, opts);
  let { classification, reasons } = classifyFromGates(gates, opts, metrics);

  // Ambiguous industry / comparison-education overlaps without merge target.
  if (
    classification === "KEEP_INDEX" &&
    (isIndustryVariantGuide(guide) ||
      (metrics.guideType === "comparison-education" &&
        metrics.uniqueContentRatio < 0.45))
  ) {
    classification = "REVIEW_MANUALLY";
    reasons = [
      ...reasons,
      "Industry or cross-category explainer — confirm distinct intent before indexing aggressively",
    ];
  }

  const failedGateIds = gates.filter((g) => !g.passed).map((g) => g.id);
  const passedGateIds = gates.filter((g) => g.passed).map((g) => g.id);

  const factoryPack = isFactoryProductPackGuide(guide);
  const productExplainer = isProductExplainerGuide(guide);
  const improvementReasons =
    classification === "KEEP_INDEX"
      ? []
      : improvementReasonsFromGuideGates({
          failedGateIds,
          factoryPack,
          productExplainer,
          staleDataRisk: metrics.staleDataRisk,
          softReasons: reasons,
        });
  const remediationRequirements = remediationForReasons(improvementReasons);

  const qualityPasses = classification === "KEEP_INDEX";
  const seedOrPromotedIndexable = effectiveSeoIndexable(
    "guide",
    guide.slug,
    guide.seo.indexable === true,
  );
  const lifecycle = resolveLifecycleState({
    legacyClassification: classification,
    qualityPasses,
    seedOrPromotedIndexable,
    registryLifecycle: getLifecycleOverrideState("guide", guide.slug),
  });

  const searchIndexable = lifecycle === "INDEXABLE";
  const readyForPromotion = lifecycle === "INDEXABLE_READY";

  const priorityScore =
    (lifecycle === "IMPROVE" || lifecycle === "IMPROVING" ? 80 : 0) +
    (lifecycle === "INDEXABLE_READY" ? 95 : 0) +
    (lifecycle === "MANUAL_REVIEW" || classification === "REVIEW_MANUALLY"
      ? 60
      : 0) +
    (classification === "MERGE" ? 50 : 0) +
    Math.round((1 - metrics.contentCompleteness) * 20) +
    (metrics.incomingInternalLinks === 0 ? 15 : 0) +
    Math.round((metrics.wordCount > 800 ? 5 : 0));

  return {
    slug: guide.slug,
    url: `/guides/${guide.slug}/`,
    title: guide.title,
    h1: guide.title,
    metaTitle: guide.seo.title || guide.title,
    metaDescription: guide.seo.description || guide.summary || "",
    classification,
    lifecycle,
    improvementReasons,
    remediationRequirements,
    searchIndexable,
    readyForPromotion,
    guideType: metrics.guideType,
    targetIntent: guideTargetIntent(guide),
    primaryTopic: guide.topicType,
    categorySlug: metrics.categorySlug,
    gates,
    metrics: {
      ...metrics,
      sitemapInclusion: searchIndexable,
      indexDirective: searchIndexable ? "index" : "noindex",
    },
    failedGateIds,
    passedGateIds,
    reasons,
    priorityScore,
    recommendedRedirect:
      opts.recommendedRedirect ??
      (classification === "MERGE" ? opts.preferredPrimarySlug ?? null : null),
    duplicateClusterId: opts.duplicateClusterId ?? null,
    intentClusterRole: opts.intentClusterRole ?? null,
    intentClusterId: opts.intentClusterId ?? null,
  };
}

export { isGuideSearchIndexWorthy } from "./search-indexable";
