import type { GuidePage } from "@/domain/schemas";
import { getGuides } from "@/data/repositories/guides";
import {
  assessGuideSemanticTemplateRisk,
  countCanonicalUniqueSignals,
} from "@/services/content-quality/gate/semantic-template";
import { loadGuideEnrichmentOverlay } from "@/services/seo/guide-enrichment/overlay-store";
import { mergeGuideWithOverlay } from "@/services/seo/guide-enrichment/overlay-merge";
import {
  emptyLifecycleSummaryCounts,
  type LifecycleSummaryCounts,
} from "@/services/seo/content-lifecycle";
import {
  intentClusterKey,
  isFactoryProductPackGuide,
  isIndustryVariantGuide,
  isProductExplainerGuide,
  normalizeIntentTitle,
} from "./classify";
import { evaluateGuideIndexWorthiness } from "./evaluate";
import { guideBodyHasUniqueAnalysis } from "./uniqueness";
import type {
  GuideAuditReport,
  GuideAuditSummary,
  GuideIndexClass,
  GuideIndexEvaluation,
} from "./types";
import { GUIDES_INDEX_WORTHINESS_VERSION } from "./types";

/** Same merged entity the public route and quality gate evaluate. */
function guidesWithOverlays(guides: GuidePage[]): GuidePage[] {
  return guides.map((guide) => {
    const overlay = loadGuideEnrichmentOverlay(guide.slug);
    return overlay ? mergeGuideWithOverlay(guide, overlay) : guide;
  });
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(
    sorted.length - 1,
    Math.max(0, Math.floor((sorted.length - 1) * p)),
  );
  return sorted[idx]!;
}

function distribution(values: number[]): {
  p25: number;
  p50: number;
  p75: number;
} {
  const sorted = [...values].sort((a, b) => a - b);
  return {
    p25: Number(percentile(sorted, 0.25).toFixed(3)),
    p50: Number(percentile(sorted, 0.5).toFixed(3)),
    p75: Number(percentile(sorted, 0.75).toFixed(3)),
  };
}

function estimateInbound(guide: GuidePage, byProduct: Map<string, number>): number {
  let n = 0;
  if (guide.categorySlugs[0]) n += 1; // category hub / guides hub filter
  for (const p of guide.productSlugs) {
    n += byProduct.get(p) ? 1 : 0;
  }
  n += Math.min(guide.relatedGuideSlugs?.length ?? 0, 3);
  n += guide.supports?.length ? 1 : 0;
  return n;
}

function estimateOutbound(guide: GuidePage): number {
  return (
    2 +
    (guide.nextAction ? 1 : 0) +
    Math.min(guide.relatedGuideSlugs?.length ?? 0, 4) +
    Math.min(guide.productSlugs.length, 2) +
    Math.min(guide.supports?.length ?? 0, 2)
  );
}

/** Prefer shorter, non-industry, category-level slug as primary. */
function pickPrimary(members: GuidePage[]): GuidePage {
  const scored = [...members].sort((a, b) => {
    const score = (g: GuidePage) => {
      let s = 0;
      if (!isIndustryVariantGuide(g)) s += 50;
      if ((g.productSlugs?.length ?? 0) === 0) s += 40;
      if (g.topicType === "buying-guide" || g.topicType === "fundamental") s += 20;
      if (g.heroVisual) s += 5;
      s += Math.min((g.blocks?.length ?? 0) + (g.sections?.length ?? 0), 20);
      s -= g.slug.length * 0.05;
      return s;
    };
    return score(b) - score(a);
  });
  return scored[0]!;
}

function buildIntentClusters(guides: GuidePage[]): {
  clusters: GuideAuditReport["intentClusters"];
  roleBySlug: Map<
    string,
    {
      role: "PRIMARY" | "MERGE_INTO_PRIMARY" | "KEEP_DISTINCT" | "REVIEW_MANUALLY";
      clusterId: string;
      primarySlug: string;
    }
  >;
  proposedMerges: GuideAuditReport["proposedMerges"];
} {
  const byKey = new Map<string, GuidePage[]>();
  for (const g of guides) {
    if (isFactoryProductPackGuide(g) || isProductExplainerGuide(g)) continue;
    const key = intentClusterKey(g);
    const list = byKey.get(key) ?? [];
    list.push(g);
    byKey.set(key, list);
  }

  const clusters: GuideAuditReport["intentClusters"] = [];
  const roleBySlug = new Map<
    string,
    {
      role: "PRIMARY" | "MERGE_INTO_PRIMARY" | "KEEP_DISTINCT" | "REVIEW_MANUALLY";
      clusterId: string;
      primarySlug: string;
    }
  >();
  const proposedMerges: GuideAuditReport["proposedMerges"] = [];

  let i = 0;
  for (const [key, members] of byKey) {
    if (members.length < 2) continue;
    // Only cluster when normalized titles are tightly similar OR industry siblings.
    const titles = members.map((m) => normalizeIntentTitle(m.title));
    const sameTitle = titles.every((t) => t === titles[0]);
    const industrySiblings = members.some((m) => isIndustryVariantGuide(m));
    if (!sameTitle && !industrySiblings && members.length < 3) continue;

    const primary = pickPrimary(members);
    const id = `intent-${++i}-${primary.slug}`;
    const clusterMembers: GuideAuditReport["intentClusters"][number]["members"] =
      [];

    for (const m of members) {
      if (m.slug === primary.slug) {
        clusterMembers.push({ slug: m.slug, role: "PRIMARY" });
        roleBySlug.set(m.slug, {
          role: "PRIMARY",
          clusterId: id,
          primarySlug: primary.slug,
        });
        continue;
      }

      // Safe merge only for obvious industry variants of the same topic.
      const canMerge =
        isIndustryVariantGuide(m) &&
        !isIndustryVariantGuide(primary) &&
        m.topicType === primary.topicType &&
        m.categorySlugs[0] === primary.categorySlugs[0];

      if (canMerge) {
        clusterMembers.push({ slug: m.slug, role: "MERGE_INTO_PRIMARY" });
        roleBySlug.set(m.slug, {
          role: "MERGE_INTO_PRIMARY",
          clusterId: id,
          primarySlug: primary.slug,
        });
        proposedMerges.push({
          from: m.slug,
          into: primary.slug,
          reason: "Industry/audience variant overlaps category primary guide intent",
          confidence: "medium",
        });
      } else {
        clusterMembers.push({ slug: m.slug, role: "REVIEW_MANUALLY" });
        roleBySlug.set(m.slug, {
          role: "REVIEW_MANUALLY",
          clusterId: id,
          primarySlug: primary.slug,
        });
      }
    }

    clusters.push({
      id,
      primarySlug: primary.slug,
      members: clusterMembers,
      note: `Intent key ${key} — ${members.length} overlapping guides`,
    });
  }

  return { clusters, roleBySlug, proposedMerges };
}

function buildDuplicateClusters(
  evaluations: GuideIndexEvaluation[],
): GuideAuditReport["duplicateClusters"] {
  const factoryByKind = new Map<string, string[]>();
  for (const e of evaluations) {
    // Only cluster packs that still fail estate near-dup — not every factory slug.
    if (
      e.metrics.factoryPackKind &&
      e.metrics.duplicateNearDuplicateRisk === "high"
    ) {
      const list = factoryByKind.get(e.metrics.factoryPackKind) ?? [];
      list.push(e.slug);
      factoryByKind.set(e.metrics.factoryPackKind, list);
    }
  }
  const clusters: GuideAuditReport["duplicateClusters"] = [];
  for (const [kind, slugs] of factoryByKind) {
    clusters.push({
      id: `dup-factory-${kind}`,
      slugs: slugs.slice(0, 12),
      risk: "high",
      note: `${slugs.length} factory ${kind} product packs still high near-duplicate after overlay+sibling analysis`,
    });
  }

  const explainers = evaluations
    .filter(
      (e) =>
        e.guideType === "product-explainer" &&
        e.metrics.duplicateNearDuplicateRisk === "high",
    )
    .map((e) => e.slug);
  if (explainers.length > 0) {
    clusters.push({
      id: "dup-product-explainer-what-is",
      slugs: explainers.slice(0, 12),
      risk: "high",
      note: `${explainers.length} what-is-{product} explainers still high template overlap`,
    });
  }

  return clusters;
}

export function runGuidesIndexAudit(): GuideAuditReport {
  const seedGuides = getGuides();
  // Audit the rendered/canonical merge path — overlays are first-class content.
  const guides = guidesWithOverlays(seedGuides);
  const byProduct = new Map<string, number>();
  for (const g of guides) {
    for (const p of g.productSlugs) {
      byProduct.set(p, (byProduct.get(p) ?? 0) + 1);
    }
  }

  const { clusters: intentClusters, roleBySlug, proposedMerges } =
    buildIntentClusters(guides);

  const titleCounts = new Map<string, number>();
  const metaCounts = new Map<string, number>();
  for (const g of guides) {
    const t = (g.seo.title || g.title).toLowerCase().trim();
    const m = (g.seo.description || "").toLowerCase().trim();
    titleCounts.set(t, (titleCounts.get(t) ?? 0) + 1);
    if (m) metaCounts.set(m, (metaCounts.get(m) ?? 0) + 1);
  }

  const evaluations: GuideIndexEvaluation[] = guides.map((guide) => {
    const role = roleBySlug.get(guide.slug);
    const factory = isFactoryProductPackGuide(guide);
    const explainer = isProductExplainerGuide(guide);
    const templateHeavy = factory || explainer;
    // Unenriched factory packs fail closed as high near-dup (no sibling scan).
    // Overlay-enriched packs + explainers get estate sibling analysis.
    const hasOverlay = Boolean(loadGuideEnrichmentOverlay(guide.slug));
    const needsSiblingAssess =
      templateHeavy &&
      (explainer ||
        hasOverlay ||
        guideBodyHasUniqueAnalysis(guide, { allowEnrichedFactory: true }));
    const semantic = needsSiblingAssess
      ? assessGuideSemanticTemplateRisk(guide, guides)
      : null;
    const semanticSignals = semantic
      ? countCanonicalUniqueSignals(semantic.uniqueAnalysisSignals)
      : null;

    return evaluateGuideIndexWorthiness(guide, {
      inboundCount: estimateInbound(guide, byProduct),
      outboundCount: estimateOutbound(guide),
      intentClusterId: role?.clusterId ?? null,
      intentClusterRole:
        role?.role === "REVIEW_MANUALLY"
          ? null
          : (role?.role as GuideIndexEvaluation["intentClusterRole"]) ?? null,
      preferredPrimarySlug:
        role && role.role !== "PRIMARY" ? role.primarySlug : null,
      recommendedRedirect:
        role?.role === "MERGE_INTO_PRIMARY"
          ? `/guides/${role.primarySlug}/`
          : null,
      duplicateClusterId:
        factory && (semantic?.riskLevel ?? "high") === "high"
          ? `dup-factory-${guide.topicType}`
          : explainer && (semantic?.riskLevel ?? "high") === "high"
            ? "dup-product-explainer-what-is"
            : role?.clusterId ?? null,
      titleCollision:
        (titleCounts.get((guide.seo.title || guide.title).toLowerCase().trim()) ??
          0) > 1,
      metaCollision:
        Boolean(guide.seo.description) &&
        (metaCounts.get((guide.seo.description || "").toLowerCase().trim()) ??
          0) > 1,
      // null → evaluate fails closed high for template-heavy pages
      semanticRiskLevel: needsSiblingAssess
        ? (semantic?.riskLevel ?? null)
        : factory
          ? "high"
          : null,
      semanticUniqueSignalCount: semanticSignals,
    });
  });

  // Promote REVIEW_MANUALLY for ambiguous intent cluster members
  for (const e of evaluations) {
    const role = roleBySlug.get(e.slug);
    if (
      role?.role === "REVIEW_MANUALLY" &&
      (e.classification === "KEEP_INDEX" || e.lifecycle === "INDEXABLE")
    ) {
      e.classification = "REVIEW_MANUALLY";
      e.lifecycle = "MANUAL_REVIEW";
      e.searchIndexable = false;
      e.readyForPromotion = false;
      e.metrics.sitemapInclusion = false;
      e.metrics.indexDirective = "noindex";
      e.reasons = [
        ...e.reasons,
        `Intent cluster ${role.clusterId} — confirm distinctness vs ${role.primarySlug}`,
      ];
      e.intentClusterRole = null;
      e.intentClusterId = role.clusterId;
    }
  }

  const byClass: Record<GuideIndexClass, number> = {
    KEEP_INDEX: 0,
    IMPROVE: 0,
    NOINDEX: 0,
    MERGE: 0,
    REMOVE: 0,
    REVIEW_MANUALLY: 0,
  };
  const byLifecycle: LifecycleSummaryCounts = emptyLifecycleSummaryCounts();
  for (const e of evaluations) {
    byClass[e.classification] += 1;
    byLifecycle[e.lifecycle] += 1;
  }

  const byTypeMap = new Map<
    string,
    { type: GuideIndexEvaluation["guideType"]; total: number; keepIndex: number }
  >();
  for (const e of evaluations) {
    const cur = byTypeMap.get(e.guideType) ?? {
      type: e.guideType,
      total: 0,
      keepIndex: 0,
    };
    cur.total += 1;
    if (e.lifecycle === "INDEXABLE" || e.classification === "KEEP_INDEX") {
      cur.keepIndex += 1;
    }
    byTypeMap.set(e.guideType, cur);
  }

  const byCatMap = new Map<
    string,
    { category: string; total: number; keepIndex: number; noindex: number; improve: number }
  >();
  for (const e of evaluations) {
    const cat = e.categorySlug || "none";
    const cur = byCatMap.get(cat) ?? {
      category: cat,
      total: 0,
      keepIndex: 0,
      noindex: 0,
      improve: 0,
    };
    cur.total += 1;
    if (e.lifecycle === "INDEXABLE" || e.classification === "KEEP_INDEX") {
      cur.keepIndex += 1;
    }
    // Legacy noindex bucket: any non-indexable robots directive
    if (!e.searchIndexable) cur.noindex += 1;
    if (
      e.lifecycle === "IMPROVE" ||
      e.lifecycle === "IMPROVING" ||
      e.classification === "IMPROVE"
    ) {
      cur.improve += 1;
    }
    byCatMap.set(cat, cur);
  }

  const orphans = evaluations
    .filter(
      (e) =>
        e.searchIndexable && e.metrics.incomingInternalLinks === 0,
    )
    .map((e) => e.url);
  const nearOrphans = evaluations
    .filter(
      (e) =>
        e.searchIndexable && e.metrics.incomingInternalLinks === 1,
    )
    .map((e) => e.url);

  const duplicateClusters = buildDuplicateClusters(evaluations);

  const proposedRedirects = proposedMerges
    .filter((m) => m.confidence === "high")
    .map((m) => ({
      from: `/guides/${m.from}/`,
      to: `/guides/${m.into}/`,
      reason: m.reason,
    }));

  const topImprove = [...evaluations]
    .filter(
      (e) =>
        e.lifecycle === "IMPROVE" ||
        e.lifecycle === "IMPROVING" ||
        e.lifecycle === "MANUAL_REVIEW" ||
        e.classification === "IMPROVE" ||
        e.classification === "REVIEW_MANUALLY",
    )
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 100);

  const readyForPromotion = [...evaluations]
    .filter((e) => e.lifecycle === "INDEXABLE_READY" || e.readyForPromotion)
    .sort((a, b) => b.priorityScore - a.priorityScore);

  const weakGuides = [...evaluations]
    .filter(
      (e) =>
        e.metrics.contentCompleteness < 0.45 ||
        e.metrics.uniqueContentRatio < 0.35,
    )
    .sort((a, b) => a.metrics.contentCompleteness - b.metrics.contentCompleteness)
    .slice(0, 50);

  const improvementQueueCount =
    byLifecycle.IMPROVE + byLifecycle.IMPROVING;
  const readyForPromotionCount =
    byLifecycle.INDEXABLE_READY + byLifecycle.READY_FOR_REVIEW;
  const manualReviewCount = byLifecycle.MANUAL_REVIEW;
  const retiredCount = byLifecycle.RETIRED;
  const potentialIndexableAfterRemediation =
    improvementQueueCount + readyForPromotionCount + manualReviewCount;

  const summary: GuideAuditSummary = {
    total: evaluations.length,
    byClass,
    byLifecycle,
    byGuideType: [...byTypeMap.values()].sort((a, b) => b.total - a.total),
    byCategory: [...byCatMap.values()].sort((a, b) => b.total - a.total),
    orphanCount: orphans.length,
    nearOrphanCount: nearOrphans.length,
    duplicateClusterCount: duplicateClusters.length,
    intentClusterCount: intentClusters.length,
    searchIndexableCount: byLifecycle.INDEXABLE,
    improvementQueueCount,
    readyForPromotionCount,
    manualReviewCount,
    retiredCount,
    potentialIndexableAfterRemediation,
    previouslySeedIndexableCount: evaluations.filter(
      (e) => e.metrics.seedIndexableFlag,
    ).length,
    factoryPackCount: evaluations.filter((e) => e.metrics.factoryPackKind).length,
    highNearDuplicateRiskCount: evaluations.filter((e) =>
      e.reasons.includes("high-near-duplicate-risk"),
    ).length,
    limitedUniqueAnalysisCount: evaluations.filter((e) =>
      e.reasons.includes("limited-unique-analysis-signals"),
    ).length,
    uniqueRatio: distribution(evaluations.map((e) => e.metrics.uniqueContentRatio)),
    wordCount: distribution(evaluations.map((e) => e.metrics.wordCount)),
  };

  return {
    version: GUIDES_INDEX_WORTHINESS_VERSION,
    generatedAt: new Date().toISOString(),
    summary,
    evaluations,
    orphans,
    nearOrphans,
    duplicateClusters,
    intentClusters,
    proposedMerges,
    proposedRedirects,
    topImprove,
    readyForPromotion,
    weakGuides,
    generationPolicy: {
      factoryProductPacksDefaultNoindex: true,
      indexableRequiresKeepClass: true,
      preserveWeakPagesForRemediation: true,
    },
  };
}

export function normalizeGuidePath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return p.endsWith("/") ? p : `${p}/`;
}
