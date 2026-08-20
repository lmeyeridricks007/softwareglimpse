import type {
  AssetEnrichmentBacklogItem,
  AssetEnrichmentBacklogReport,
  GuideAssetAudit,
  SoftwareProductAssetAudit,
  SystemicAssetOpportunity,
} from "@/domain/schemas/asset-discovery";
import {
  ASSET_OPPORTUNITY_PRIORITIZATION_AGENT_ID,
  ASSET_OPPORTUNITY_PRIORITIZATION_AGENT_VERSION,
  AssetEnrichmentBacklogReportSchema,
} from "@/domain/schemas/asset-discovery";
import type { ContentMapNode } from "@/services/content-quality/improvement/types";
import { findMapNode } from "@/services/content-quality/improvement/content-map";
import {
  clusterForGuideKind,
  clusterForSoftwareSection,
  clusterFromRoute,
} from "./clusters";
import { FLAGSHIP_PRODUCT_SLUGS } from "./constants";
import { formatCqLink, type CqIssueRef } from "./cq-links";
import {
  bandFromScore,
  buyerUsefulnessForGuide,
  buyerUsefulnessForSoftware,
  coverageToWeakness,
  effortForGuide,
  effortForSoftware,
  implementationBatchForGuide,
  implementationBatchForSoftware,
  scoreImpact,
  softwareSectionRelevance,
  sourceQualityForGuide,
  sourceQualityForSoftware,
  type ImpactFactors,
} from "./scoring";
import { detectSystemicAssetOpportunities } from "./systemic";

function normalizeRoute(route: string): string {
  return route.endsWith("/") ? route : `${route}/`;
}

function pageLeverage(
  productSlug: string | undefined,
  map: ContentMapNode | undefined,
): ImpactFactors["pageLeverage"] {
  if (productSlug && FLAGSHIP_PRODUCT_SLUGS.has(productSlug)) return "flagship";
  if (map?.priority === "P0") return "high";
  if (map?.priority === "P1") return "medium";
  return "low";
}

function softwareRecToItem(input: {
  audit: SoftwareProductAssetAudit;
  rec: SoftwareProductAssetAudit["recommendations"][number];
  map?: ContentMapNode;
  cq?: CqIssueRef[];
}): AssetEnrichmentBacklogItem | null {
  const { audit, rec, map, cq } = input;
  if (rec.recommendationLevel === "do-not-use") return null;
  // Skip low-value optional noise on non-flagship unless reuse
  if (
    rec.recommendationLevel === "optional" &&
    !FLAGSHIP_PRODUCT_SLUGS.has(audit.productSlug) &&
    map?.priority !== "P0"
  ) {
    return null;
  }

  const sectionId = rec.placement?.sectionId;
  const factors: ImpactFactors = {
    mapPriority: map?.priority,
    pageLeverage: pageLeverage(audit.productSlug, map),
    qualityWeakness: coverageToWeakness(audit.coverageRating),
    assetRelevance: softwareSectionRelevance(sectionId),
    buyerUsefulness: buyerUsefulnessForSoftware(rec),
    evidenceValue:
      rec.recommendationLevel === "source-only" ||
      rec.usageRecommendation === "cite"
        ? "high"
        : rec.officialSource || Boolean(rec.reuseOfMediaId)
          ? "medium"
          : "low",
    differentiationValue:
      rec.assetType === "softwareglimpse-original-visual-opportunity"
        ? "high"
        : rec.assetType.includes("workflow") ||
            rec.assetType.includes("feature")
          ? "medium"
          : "low",
    easeOfUse:
      rec.recommendationLevel === "reuse-existing"
        ? "high"
        : rec.sourceUrl
          ? "medium"
          : "low",
    sourceQuality: sourceQualityForSoftware(rec),
    freshnessUrgency: "unknown",
    effort: effortForSoftware(rec),
    recommendationLevel: rec.recommendationLevel,
    hasCqLink: Boolean(cq && cq.length > 0),
    isTemplate: false,
  };

  const impactScore = scoreImpact(factors);
  const priority = bandFromScore(impactScore, factors);
  const batch = implementationBatchForSoftware(rec);
  const source =
    rec.sourceUrl ??
    (rec.reuseOfMediaId
      ? `ResearchMedia:${rec.reuseOfMediaId}`
      : rec.searchQueries[0]
        ? `search: ${rec.searchQueries[0]}`
        : "official vendor search required");

  return {
    id: `AE-${audit.productSlug}-${rec.id}`,
    priority,
    page: audit.productName,
    pageRoute: normalizeRoute(audit.route),
    pageType: "software-review",
    section: rec.placement
      ? `${rec.placement.sectionTitle}${rec.placement.subsection ? ` → ${rec.placement.subsection}` : ""}`
      : sectionId ?? "—",
    asset: rec.title,
    assetType: rec.assetType,
    source,
    official: rec.officialSource || Boolean(rec.reuseOfMediaId),
    recommendation: recommendationAction(rec),
    whatItAdds:
      rec.whatItShows.slice(0, 2).join("; ") ||
      rec.placement?.why ||
      rec.reason,
    relatedContentQualityIssue: formatCqLink(cq),
    researchEvidenceImpact: researchImpact(factors),
    implementationEffort: factors.effort,
    usageConstraints: usageConstraintsSoftware(rec),
    implementationBatch: batch,
    productSlug: audit.productSlug,
    cluster: clusterForSoftwareSection(sectionId),
    impactScore,
    mapPriority: map?.priority,
    mapNodeId: map?.id,
    isTemplateFix: false,
    isOriginalVisual:
      rec.assetType === "softwareglimpse-original-visual-opportunity",
    isPageSpecific: true,
    origin: "software",
    sourceOpportunityId: rec.id,
  };
}

function recommendationAction(
  rec: SoftwareProductAssetAudit["recommendations"][number],
): string {
  if (rec.recommendationLevel === "reuse-existing") {
    return "REUSE EXISTING MEDIA";
  }
  if (rec.usageRecommendation === "embed") return "EMBED (after verify)";
  if (rec.usageRecommendation === "link") return "LINK official source";
  if (rec.usageRecommendation === "cite") return "CITE as evidence";
  if (rec.recommendationLevel === "source-only") return "LINK / CITE only";
  if (rec.recommendationLevel === "add-now") return "ADD NOW — search & verify";
  if (rec.recommendationLevel === "strong-opportunity") {
    return "STRONG — discover official asset";
  }
  return rec.recommendationLevel.toUpperCase();
}

function usageConstraintsSoftware(
  rec: SoftwareProductAssetAudit["recommendations"][number],
): string {
  const parts: string[] = [];
  if (rec.embedStatus === "link-only") parts.push("link-only (no embed)");
  if (rec.embedStatus === "unknown") parts.push("confirm embed rights");
  if (!rec.sourceUrl) parts.push("do not invent URL — run search tasks");
  if (rec.recommendationLevel === "reuse-existing") {
    parts.push("do not duplicate ResearchMedia record");
  }
  parts.push("never use affiliate URL as evidence");
  parts.push("media must not affect rankings");
  return parts.join("; ");
}

function researchImpact(f: ImpactFactors): string {
  if (f.evidenceValue === "high" && f.sourceQuality !== "original") {
    return "high — strengthens primary-source claims";
  }
  if (f.buyerUsefulness === "high") {
    return "medium-high — improves buyer understanding of product fit";
  }
  if (f.differentiationValue === "high") {
    return "medium — original SG visual differentiates teaching";
  }
  return "low-medium — incremental media enrichment";
}

function guideRecToItem(input: {
  audit: GuideAssetAudit;
  rec: GuideAssetAudit["recommendations"][number];
  map?: ContentMapNode;
  cq?: CqIssueRef[];
}): AssetEnrichmentBacklogItem | null {
  const { audit, rec, map, cq } = input;
  if (rec.recommendationLevel === "do-not-use") return null;

  // Drop most OPTIONAL/SOURCE-ONLY on non-P0 guides to avoid count inflation
  if (
    (rec.recommendationLevel === "optional" ||
      rec.recommendationLevel === "source-only") &&
    map?.priority !== "P0" &&
    map?.priority !== "P1" &&
    audit.visualQuality !== "very-weak" &&
    audit.visualQuality !== "weak"
  ) {
    return null;
  }
  // Even on weak guides, skip optional vendor demos in conceptual sections
  if (
    rec.recommendationLevel === "optional" &&
    rec.category === "official-product-demo" &&
    /quick answer|intro|definition/i.test(rec.sectionTitle)
  ) {
    return null;
  }

  const factors: ImpactFactors = {
    mapPriority: map?.priority,
    pageLeverage:
      map?.priority === "P0"
        ? "high"
        : map?.priority === "P1"
          ? "medium"
          : "low",
    qualityWeakness:
      audit.contentQualityVisualScore != null &&
      audit.contentQualityVisualScore >= 4
        ? "low"
        : coverageToWeakness(audit.visualQuality),
    assetRelevance:
      rec.recommendationLevel === "add-now"
        ? "high"
        : rec.recommendationLevel === "strong-opportunity"
          ? "medium"
          : "low",
    buyerUsefulness: buyerUsefulnessForGuide(rec.category),
    evidenceValue:
      rec.usageRecommendation === "cite" ||
      rec.category === "official-checklist-pdf-source" ||
      rec.category.includes("documentation")
        ? "high"
        : "medium",
    differentiationValue: rec.category.startsWith("original-")
      ? "high"
      : "low",
    easeOfUse: rec.sourceUrl
      ? "high"
      : rec.category.startsWith("original-")
        ? "low"
        : "medium",
    sourceQuality: sourceQualityForGuide(rec),
    freshnessUrgency: "unknown",
    effort: effortForGuide(rec),
    recommendationLevel: rec.recommendationLevel,
    hasCqLink:
      Boolean(cq && cq.length > 0) ||
      rec.resolvesContentQualityIds.length > 0 ||
      audit.contentQualityIssueIds.length > 0,
    isTemplate: false,
  };

  const impactScore = scoreImpact(factors);
  const priority = bandFromScore(impactScore, factors);
  const cluster =
    clusterFromRoute(audit.route) ?? clusterForGuideKind(audit.guideKind);

  return {
    id: `AE-guide-${audit.guideSlug}-${rec.id}`,
    priority,
    page: audit.guideTitle,
    pageRoute: normalizeRoute(audit.route),
    pageType: `guide:${audit.guideKind}`,
    section: rec.sectionTitle,
    asset: rec.title,
    assetType: rec.category,
    source:
      rec.sourceUrl ??
      (rec.searchQueries[0]
        ? `search: ${rec.searchQueries[0]}`
        : "official / authoritative search required"),
    official: !rec.category.startsWith("original-"),
    recommendation: guideRecommendation(rec),
    whatItAdds: rec.why,
    relatedContentQualityIssue: formatCqLink(
      cq,
      [
        ...rec.resolvesContentQualityIds,
        ...audit.contentQualityIssueIds,
      ].slice(0, 3),
    ),
    researchEvidenceImpact: researchImpact(factors),
    implementationEffort: factors.effort,
    usageConstraints: [
      rec.requiresUsageReview ? "usage review required" : null,
      "never affiliate URL as evidence",
      rec.category.startsWith("original-")
        ? "prefer original SG visual over copying vendor imagery"
        : "prefer primary official / authoritative source",
      "do not invent asset URLs",
    ]
      .filter(Boolean)
      .join("; "),
    implementationBatch: implementationBatchForGuide(rec),
    productSlug: rec.productIds[0],
    cluster,
    impactScore,
    mapPriority: map?.priority,
    mapNodeId: map?.id,
    isTemplateFix: false,
    isOriginalVisual: rec.category.startsWith("original-"),
    isPageSpecific: true,
    origin: "guide",
    sourceOpportunityId: rec.id,
  };
}

function guideRecommendation(
  rec: GuideAssetAudit["recommendations"][number],
): string {
  if (rec.recommendationLevel === "add-now") return "ADD NOW";
  if (rec.recommendationLevel === "strong-opportunity") return "STRONG";
  if (rec.recommendationLevel === "source-only") return "SOURCE ONLY / LINK";
  if (rec.recommendationLevel === "reuse-existing") return "REUSE";
  if (rec.category.startsWith("original-")) {
    return "CREATE ORIGINAL SG VISUAL";
  }
  if (rec.usageRecommendation === "embed") return "EMBED (after verify)";
  return rec.recommendationLevel.toUpperCase();
}

function staleToItems(
  audit: SoftwareProductAssetAudit,
  map: ContentMapNode | undefined,
  cq: CqIssueRef[] | undefined,
): AssetEnrichmentBacklogItem[] {
  return audit.staleAssets.map((s) => {
    const factors: ImpactFactors = {
      mapPriority: map?.priority,
      pageLeverage: pageLeverage(audit.productSlug, map),
      qualityWeakness: "high",
      assetRelevance: "high",
      buyerUsefulness: "medium",
      evidenceValue: "high",
      differentiationValue: "low",
      easeOfUse: "medium",
      sourceQuality: "verified-official",
      freshnessUrgency: "replace-now",
      effort: "medium",
      recommendationLevel: "add-now",
      hasCqLink: Boolean(cq?.length),
      isTemplate: false,
    };
    const impactScore = scoreImpact(factors);
    return {
      id: `AE-stale-${audit.productSlug}-${s.mediaId}`,
      priority: bandFromScore(impactScore, factors),
      page: audit.productName,
      pageRoute: normalizeRoute(audit.route),
      pageType: "software-review",
      section: "Existing media",
      asset: s.title,
      assetType: s.kind,
      source: `ResearchMedia:${s.mediaId}`,
      official: true,
      recommendation: "REPLACE / REFRESH",
      whatItAdds: s.refreshRecommendation,
      relatedContentQualityIssue: formatCqLink(cq),
      researchEvidenceImpact: "high — removes stale/misleading UI evidence",
      implementationEffort: "medium" as const,
      usageConstraints: `${s.detail}; confirm current official source before re-embed`,
      implementationBatch: "stale-media-to-replace" as const,
      productSlug: audit.productSlug,
      cluster: "CRM Product Reviews" as const,
      impactScore,
      mapPriority: map?.priority,
      mapNodeId: map?.id,
      isTemplateFix: false,
      isOriginalVisual: false,
      isPageSpecific: true,
      origin: "stale" as const,
      sourceOpportunityId: s.mediaId,
    };
  });
}

function originalSoftwareToItems(
  audit: SoftwareProductAssetAudit,
  map: ContentMapNode | undefined,
  cq: CqIssueRef[] | undefined,
): AssetEnrichmentBacklogItem[] {
  return audit.originalVisualOpportunities.map((o) => {
    const factors: ImpactFactors = {
      mapPriority: map?.priority,
      pageLeverage: pageLeverage(audit.productSlug, map),
      qualityWeakness: coverageToWeakness(audit.coverageRating),
      assetRelevance: softwareSectionRelevance(o.sectionId),
      buyerUsefulness: "high",
      evidenceValue: "medium",
      differentiationValue: "high",
      easeOfUse: "low",
      sourceQuality: "original",
      freshnessUrgency: "ok",
      effort: "large",
      recommendationLevel:
        o.priority === "high" ? "add-now" : "strong-opportunity",
      hasCqLink: Boolean(cq?.length),
      isTemplate: false,
    };
    const impactScore = scoreImpact(factors);
    return {
      id: `AE-orig-${audit.productSlug}-${o.id}`,
      priority: bandFromScore(impactScore, factors),
      page: audit.productName,
      pageRoute: normalizeRoute(audit.route),
      pageType: "software-review",
      section: o.sectionId ?? "Teaching visual",
      asset: o.title,
      assetType: "softwareglimpse-original-visual-opportunity",
      source: o.basedOnSourceHint ?? "SoftwareGlimpse original",
      official: false,
      recommendation: "CREATE ORIGINAL SG VISUAL",
      whatItAdds: o.description,
      relatedContentQualityIssue: formatCqLink(cq),
      researchEvidenceImpact: researchImpact(factors),
      implementationEffort: "large" as const,
      usageConstraints:
        "original SG IP; do not copy vendor UI imagery when rights unclear",
      implementationBatch:
        /workflow|setup|implement/i.test(o.title)
          ? ("original-workflow-visuals-to-create" as const)
          : ("original-diagrams-to-create" as const),
      productSlug: audit.productSlug,
      cluster: clusterForSoftwareSection(o.sectionId),
      impactScore,
      mapPriority: map?.priority,
      mapNodeId: map?.id,
      isTemplateFix: false,
      isOriginalVisual: true,
      isPageSpecific: true,
      origin: "software" as const,
      sourceOpportunityId: o.id,
    };
  });
}

function systemicToBacklogItem(
  s: SystemicAssetOpportunity,
): AssetEnrichmentBacklogItem {
  return {
    id: s.id,
    priority: s.priority,
    page: `(template — ${s.count} pages/products)`,
    pageRoute: s.affectedRoutes[0] ?? "/software/",
    pageType: s.pageTypes.join(", ") || "multi",
    section: "Systemic / template",
    asset: s.title,
    assetType: "TEMPLATE FIX",
    source: "pattern across asset opportunity corpus",
    official: true,
    recommendation: s.recommendation,
    whatItAdds: s.whatItAdds,
    relatedContentQualityIssue: undefined,
    researchEvidenceImpact:
      "high — one platform change multiplies evidence quality",
    implementationEffort: s.implementationEffort,
    usageConstraints:
      "do not implement as N manual page edits; fix template/component once",
    implementationBatch: "template-fix",
    productSlug: s.products[0],
    cluster: "CRM Product Reviews",
    impactScore: s.priority === "A0" ? 120 : s.priority === "A1" ? 90 : 60,
    isTemplateFix: true,
    isOriginalVisual: /visual|diagram/i.test(s.title),
    isPageSpecific: false,
    origin: "systemic",
    systemicPatternId: s.id,
  };
}

function sortItems(a: AssetEnrichmentBacklogItem, b: AssetEnrichmentBacklogItem) {
  const order = { A0: 0, A1: 1, A2: 2, A3: 3 };
  return (
    order[a.priority] - order[b.priority] ||
    b.impactScore - a.impactScore ||
    a.pageRoute.localeCompare(b.pageRoute)
  );
}

function countBy(
  items: AssetEnrichmentBacklogItem[],
  key: (i: AssetEnrichmentBacklogItem) => string,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const i of items) {
    const k = key(i);
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

/**
 * Prioritize asset opportunities by material impact — not by asset count.
 */
export function prioritizeAssetOpportunities(input: {
  softwareAudits: SoftwareProductAssetAudit[];
  guideAudits: GuideAssetAudit[];
  mapByRoute: Map<string, ContentMapNode>;
  cqByRoute: Map<string, CqIssueRef[]>;
  generatedAt: string;
  inputs: string[];
}): AssetEnrichmentBacklogReport {
  const candidates: AssetEnrichmentBacklogItem[] = [];

  for (const audit of input.softwareAudits) {
    const route = normalizeRoute(audit.route);
    const map =
      findMapNode(input.mapByRoute, route) ??
      findMapNode(input.mapByRoute, "/software/[slug]/");
    const cq = input.cqByRoute.get(route);

    for (const rec of audit.recommendations) {
      const item = softwareRecToItem({ audit, rec, map, cq });
      if (item) candidates.push(item);
    }
    candidates.push(...staleToItems(audit, map, cq));
    candidates.push(...originalSoftwareToItems(audit, map, cq));
  }

  for (const audit of input.guideAudits) {
    const route = normalizeRoute(audit.route);
    const map = findMapNode(input.mapByRoute, route);
    const cq = input.cqByRoute.get(route);

    for (const rec of audit.recommendations) {
      const item = guideRecToItem({ audit, rec, map, cq });
      if (item) candidates.push(item);
    }
  }

  const { systemic, absorbedIds } = detectSystemicAssetOpportunities({
    softwareAudits: input.softwareAudits,
    guideAudits: input.guideAudits,
    candidates,
  });

  // Demote absorbed page-specific items (keep a few exemplars at lower band)
  const retained: AssetEnrichmentBacklogItem[] = [];
  const exemplarByPattern = new Map<string, number>();

  for (const item of candidates) {
    if (!absorbedIds.has(item.id)) {
      retained.push(item);
      continue;
    }
    // Find which systemic pattern absorbed this
    const pattern = systemic.find((s) =>
      s.affectedRoutes.includes(item.pageRoute),
    );
    const key = pattern?.id ?? "unknown";
    const n = exemplarByPattern.get(key) ?? 0;
    if (n < 2) {
      // Keep 2 exemplars demoted to A2/A3 for traceability
      retained.push({
        ...item,
        priority: item.priority === "A0" ? "A2" : "A3",
        recommendation: `Covered by ${key} — page exemplar only; prefer TEMPLATE FIX`,
        systemicPatternId: key,
        isPageSpecific: true,
        impactScore: Math.min(item.impactScore, 55),
      });
      exemplarByPattern.set(key, n + 1);
    }
  }

  const templateItems = systemic.map(systemicToBacklogItem);
  const items = [...templateItems, ...retained].sort(sortItems);

  const topActions = items
    .filter((i) => i.priority === "A0" || i.priority === "A1" || i.isTemplateFix)
    .slice(0, 30);

  // If fewer than 30 A0/A1, fill from highest impact
  while (topActions.length < 30 && topActions.length < items.length) {
    const next = items.find((i) => !topActions.includes(i));
    if (!next) break;
    topActions.push(next);
  }

  return AssetEnrichmentBacklogReportSchema.parse({
    agentId: ASSET_OPPORTUNITY_PRIORITIZATION_AGENT_ID,
    agentVersion: ASSET_OPPORTUNITY_PRIORITIZATION_AGENT_VERSION,
    generatedAt: input.generatedAt,
    inputs: input.inputs,
    items,
    systemicOpportunities: systemic,
    topActions: topActions.slice(0, 30),
    summary: {
      a0: items.filter((i) => i.priority === "A0").length,
      a1: items.filter((i) => i.priority === "A1").length,
      a2: items.filter((i) => i.priority === "A2").length,
      a3: items.filter((i) => i.priority === "A3").length,
      templateOpportunities: items.filter((i) => i.isTemplateFix).length,
      pageSpecificOpportunities: items.filter((i) => i.isPageSpecific).length,
      originalVisualOpportunities: items.filter((i) => i.isOriginalVisual)
        .length,
      byImplementationBatch: countBy(items, (i) => i.implementationBatch),
      byProduct: countBy(
        items.filter((i) => i.productSlug),
        (i) => i.productSlug!,
      ),
      byCluster: countBy(items, (i) => i.cluster),
    },
  });
}
