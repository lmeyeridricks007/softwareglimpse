import { isPublishedStatus } from "@/domain";
import type {
  AnchorRef,
  CategoryKnowledgeMap,
  ClusterAreaCoverage,
  ContentCluster,
  SupportingKnowledgePlan,
  SupportingTopicCandidate,
  SupportingTopicConcept,
  TopicPlacementRecommendation,
  TopicPriorityClass,
} from "@/domain";
import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllCategoriesUnfiltered,
  getAllComparisonsUnfiltered,
  getAllSoftwareUnfiltered,
  getSoftwareBySlug,
} from "@/data";
import {
  getGuideBySlug,
  getGuidesByCategory,
  getGuidesByProduct,
  getGuidesSupportingContentId,
} from "@/data/repositories/guides";
import {
  getCategoryKnowledgeMap,
  listCategoryKnowledgeMaps,
} from "@/data/content-clusters/knowledge";
import {
  bestContentId,
  categoryContentId,
  pathForContent,
  softwareContentId,
  toolContentId,
} from "@/services/publishing/ids";

type SeoSignal = {
  query: string;
  impressions: number;
  clicks: number;
};

function countStandaloneSignals(
  concept: SupportingTopicConcept,
): number {
  const s = concept.standaloneSignals;
  return [
    s.multipleSubquestions,
    s.distinctSearchIntent,
    s.decisionImportance,
    s.internalLinkUsefulness,
    s.meaningfulDepth,
  ].filter(Boolean).length;
}

function categoryLabelFromConcept(
  concept: SupportingTopicConcept,
): string | undefined {
  const slug = concept.supportsContentIds
    .find((id) => id.startsWith("content:category:"))
    ?.split(":")
    .at(-1);
  return slug?.replace(/-/g, " ");
}

function titlesShareDuplicateIntent(
  conceptTitle: string,
  guideTitle: string,
  categoryLabel?: string,
): boolean {
  const concept = conceptTitle.toLowerCase().trim();
  const guide = guideTitle.toLowerCase().trim();
  const sliceA = concept.slice(0, 12);
  const sliceB = guide.slice(0, 12);
  if (!sliceA || !sliceB) return false;
  const aInB = guide.includes(sliceA);
  const bInA = concept.includes(sliceB);
  if (!aInB && !bInA) return false;

  // Category-prefixed titles ("Sales intelligence vendor evaluation") share
  // the first 12 chars with "How to Choose Sales Intelligence Software".
  // That is a label collision, not duplicate intent.
  if (categoryLabel && concept.startsWith(categoryLabel)) {
    const rest = concept.slice(categoryLabel.length).replace(/\s+/g, " ").trim();
    if (rest.length >= 8 && !guide.includes(rest.slice(0, 12))) {
      return false;
    }
  }
  return true;
}

export function decideTopicPlacement(
  concept: SupportingTopicConcept,
  existingSlugs: Set<string>,
): { placement: TopicPlacementRecommendation; reason: string; expandTargetSlug?: string } {
  if (concept.priorityClass === "NOT_RECOMMENDED") {
    return {
      placement: "NO_ACTION",
      reason: "Marked NOT_RECOMMENDED — product section or insufficient value",
    };
  }

  if (existingSlugs.has(concept.suggestedSlug)) {
    return {
      placement: "NO_ACTION",
      reason: `Guide already exists: ${concept.suggestedSlug}`,
      expandTargetSlug: concept.suggestedSlug,
    };
  }

  // Duplicate intent against existing guides (slug or title overlap)
  const categoryLabel = categoryLabelFromConcept(concept);
  for (const slug of existingSlugs) {
    const guide = getGuideBySlug(slug, { includeUnpublished: true });
    if (!guide) continue;
    const sameArea =
      guide.knowledgeAreaSlug === concept.knowledgeAreaSlug &&
      guide.topicType === concept.topicType;
    const titleOverlap = titlesShareDuplicateIntent(
      concept.titleConcept,
      guide.title,
      categoryLabel,
    );
    if (sameArea && titleOverlap && guide.slug !== concept.suggestedSlug) {
      return {
        placement: "EXPAND_EXISTING_PAGE",
        reason: `Duplicate intent with existing guide ${guide.slug}`,
        expandTargetSlug: guide.slug,
      };
    }
  }

  const signals = countStandaloneSignals(concept);
  if (signals < 3) {
    // Prefer section on a related CORE guide in same area if one exists
    const areaGuide = [...existingSlugs]
      .map((s) => getGuideBySlug(s, { includeUnpublished: true }))
      .find(
        (g) =>
          g &&
          g.knowledgeAreaSlug === concept.knowledgeAreaSlug &&
          g.categorySlugs.includes(
            concept.supportsContentIds
              .find((id) => id.startsWith("content:category:"))
              ?.split(":")
              .at(-1) ?? "",
          ),
      );
    if (areaGuide || concept.notes.some((n) => /section|ADD_SECTION/i.test(n))) {
      return {
        placement: "ADD_SECTION",
        reason: `Insufficient standalone depth (signals=${signals}/5)`,
        expandTargetSlug: areaGuide?.slug,
      };
    }
    return {
      placement: "NO_ACTION",
      reason: `Micro-topic without enough standalone value (signals=${signals}/5)`,
    };
  }

  if (concept.priorityClass === "OPTIONAL" && signals < 4) {
    return {
      placement: "ADD_SECTION",
      reason: "Optional topic — prefer enriching an existing page",
    };
  }

  if (
    concept.priorityClass === "SECONDARY" &&
    concept.notes.some((n) => /section|ADD_SECTION/i.test(n))
  ) {
    return {
      placement: "ADD_SECTION",
      reason: "Secondary topic notes recommend section on a related guide",
    };
  }

  return {
    placement: "NEW_PAGE",
    reason: `Standalone value sufficient (signals=${signals}/5)`,
  };
}

function scoreCandidate(
  concept: SupportingTopicConcept,
  placement: TopicPlacementRecommendation,
  seo: { impressions: number; queryCount: number },
  knowledgeGap: boolean,
): SupportingTopicCandidate["scores"] {
  const journeyValue =
    concept.journeyStage === "evaluate" || concept.journeyStage === "choose"
      ? 9
      : concept.journeyStage === "learn" || concept.journeyStage === "understand"
        ? 8
        : concept.journeyStage === "implement" || concept.journeyStage === "switch"
          ? 7
          : 5;

  const searchEvidence = Math.min(
    10,
    Math.round(seo.queryCount * 2 + Math.log10(seo.impressions + 1) * 2),
  );
  const anchorSupport = Math.min(10, concept.supportsContentIds.length * 3);
  const knowledgeGapScore = knowledgeGap ? 9 : 3;
  const strategicRelevance =
    concept.priorityClass === "CORE"
      ? 10
      : concept.priorityClass === "SECONDARY"
        ? 7
        : concept.priorityClass === "OPTIONAL"
          ? 4
          : 0;
  const effortPenalty =
    placement === "NEW_PAGE" ? 3 : placement === "ADD_SECTION" ? 1 : 0;

  const total =
    journeyValue * 1.2 +
    searchEvidence * 1.0 +
    anchorSupport * 1.3 +
    knowledgeGapScore * 1.1 +
    strategicRelevance * 1.4 -
    effortPenalty;

  return {
    journeyValue,
    searchEvidence,
    anchorSupport,
    knowledgeGap: knowledgeGapScore,
    strategicRelevance,
    effortPenalty,
    total: Math.round(total * 10) / 10,
  };
}

function matchSeoSignals(
  concept: SupportingTopicConcept,
  signals: SeoSignal[],
): { impressions: number; queryCount: number } {
  let impressions = 0;
  let queryCount = 0;
  for (const signal of signals) {
    const q = signal.query.toLowerCase();
    if (
      concept.intentClusterKeys.some((k) => q.includes(k.toLowerCase())) ||
      concept.intentClusterKeys.some((k) =>
        k.toLowerCase().split(/\s+/).every((part) => q.includes(part)),
      )
    ) {
      impressions += signal.impressions;
      queryCount += 1;
    }
  }
  return { impressions, queryCount };
}

export function resolveCategoryAnchors(categorySlug: string): AnchorRef[] {
  const anchors: AnchorRef[] = [];
  const category = getAllCategoriesUnfiltered().find(
    (c) => c.slug === categorySlug,
  );
  if (category) {
    anchors.push({
      contentId: categoryContentId(category.slug),
      type: "category",
      slug: category.slug,
      path: pathForContent("category", category.slug),
      title: category.name,
      published: isPublishedStatus(category.metadata.status),
    });
  }

  for (const best of getAllBestPagesUnfiltered()) {
    if (best.categorySlug !== categorySlug) continue;
    anchors.push({
      contentId: bestContentId(best.slug),
      type: "best",
      slug: best.slug,
      path: pathForContent("best", best.slug),
      title: best.title,
      published: isPublishedStatus(best.metadata.status),
    });
  }

  for (const software of getAllSoftwareUnfiltered()) {
    if (software.primaryCategorySlug !== categorySlug) continue;
    anchors.push({
      contentId: softwareContentId(software.slug),
      type: "software",
      slug: software.slug,
      path: pathForContent("software", software.slug),
      title: software.name,
      published: isPublishedStatus(software.metadata.status),
    });
  }

  // Tools (hardcoded CRM tools today)
  if (categorySlug === "crm") {
    for (const tool of [
      { slug: "crm-finder", title: "CRM Finder" },
      { slug: "crm-cost-calculator", title: "CRM Cost Calculator" },
    ]) {
      anchors.push({
        contentId: toolContentId(tool.slug),
        type: "tool",
        slug: tool.slug,
        path: pathForContent("tool", tool.slug),
        title: tool.title,
        published: true,
      });
    }
  }

  // Pricing pages for category products
  for (const software of getAllSoftwareUnfiltered()) {
    if (software.primaryCategorySlug !== categorySlug) continue;
    anchors.push({
      contentId: `content:pricing:${software.slug}`,
      type: "pricing",
      slug: software.slug,
      path: `/pricing/${software.slug}/`,
      title: `${software.name} pricing`,
      published: isPublishedStatus(software.metadata.status),
    });
  }

  for (const alt of getAllAlternativesUnfiltered()) {
    const product = getSoftwareBySlug(alt.slug, { includeUnpublished: true });
    if (product?.primaryCategorySlug !== categorySlug) continue;
    anchors.push({
      contentId: `content:alternatives:${alt.slug}`,
      type: "alternatives",
      slug: alt.slug,
      path: `/alternatives/${alt.slug}/`,
      title: alt.title,
      published: isPublishedStatus(alt.metadata.status),
    });
  }

  for (const comparison of getAllComparisonsUnfiltered()) {
    if (comparison.categorySlug !== categorySlug) continue;
    anchors.push({
      contentId: `content:comparison:${comparison.slug}`,
      type: "comparison",
      slug: comparison.slug,
      path: `/compare/${comparison.slug}/`,
      title: comparison.title,
      published: isPublishedStatus(comparison.metadata.status),
    });
  }

  return anchors;
}

function productEvidenceOk(concept: SupportingTopicConcept): boolean {
  if (concept.productSlugs.length === 0) return true;
  // Require product importance: published primary CRM (or category) product
  return concept.productSlugs.every((slug) => {
    const p = getSoftwareBySlug(slug, { includeUnpublished: true });
    return Boolean(p && isPublishedStatus(p.metadata.status));
  });
}

/**
 * Build supporting-topic candidates for a category.
 * Does not execute GuideAgent or invent SEO demand.
 */
export function buildSupportingTopicCandidates(
  categorySlug: string,
  options?: { seoSignals?: SeoSignal[]; knowledgeMap?: CategoryKnowledgeMap },
): SupportingTopicCandidate[] {
  const map =
    options?.knowledgeMap ?? getCategoryKnowledgeMap(categorySlug);
  if (!map) return [];

  const existingGuides = getGuidesByCategory(categorySlug, {
    includeUnpublished: true,
  });
  const existingSlugs = new Set(existingGuides.map((g) => g.slug));
  const seoSignals = options?.seoSignals ?? [];
  const candidates: SupportingTopicCandidate[] = [];

  for (const concept of map.topics) {
    if (concept.productSlugs.length && !productEvidenceOk(concept)) {
      continue;
    }

    const exists = existingSlugs.has(concept.suggestedSlug);
    const placement = decideTopicPlacement(concept, existingSlugs);
    const seo = matchSeoSignals(concept, seoSignals);
    const knowledgeGap = !exists && concept.priorityClass === "CORE";

    let readiness: SupportingTopicCandidate["readiness"] = "ready";
    if (exists) readiness = "exists";
    else if (placement.placement === "NO_ACTION") readiness = "not-recommended";
    else if (
      placement.placement === "EXPAND_EXISTING_PAGE" ||
      (seo.queryCount === 0 &&
        concept.priorityClass !== "CORE" &&
        concept.productSlugs.length > 0)
    ) {
      // Product guides without observed SEO stay research-required / optional
      if (concept.productSlugs.length > 0 && seo.queryCount === 0) {
        readiness =
          concept.priorityClass === "NOT_RECOMMENDED"
            ? "not-recommended"
            : "research-required";
      } else if (placement.placement === "EXPAND_EXISTING_PAGE") {
        readiness = "duplicate";
      }
    }

    // Reject product×feature micro pages without evidence
    if (
      concept.productSlugs.length > 0 &&
      concept.priorityClass === "NOT_RECOMMENDED"
    ) {
      readiness = "not-recommended";
    }

    const scores = scoreCandidate(
      concept,
      placement.placement,
      seo,
      knowledgeGap,
    );

    // Affiliate commission intentionally omitted from scoring.
    const priority =
      concept.priorityClass === "CORE"
        ? 1000 + scores.total
        : concept.priorityClass === "SECONDARY"
          ? 500 + scores.total
          : concept.priorityClass === "OPTIONAL"
            ? 100 + scores.total
            : 0;

    candidates.push({
      id: `candidate:${concept.id}`,
      titleConcept: concept.titleConcept,
      suggestedSlug: concept.suggestedSlug,
      categorySlug,
      productSlugs: concept.productSlugs,
      topicType: concept.topicType,
      journeyStage: concept.journeyStage,
      knowledgeAreaSlug: concept.knowledgeAreaSlug,
      targetIntent: concept.intentClusterKeys[0] ?? concept.titleConcept,
      supports: concept.supportsContentIds.map((contentId) => ({
        contentId,
        relationType: concept.supportRelationType,
      })),
      evidence: {
        seoQueryCount: seo.queryCount,
        seoImpressions: seo.impressions,
        knowledgeGap,
        userJourneyValue: scores.journeyValue,
        multiAnchorValue: concept.supportsContentIds.length,
        notes: concept.notes,
      },
      scores,
      priorityClass: concept.priorityClass as TopicPriorityClass,
      placement: placement.placement,
      placementReason: placement.reason,
      readiness,
      existingGuideSlug: exists ? concept.suggestedSlug : undefined,
      expandTargetSlug: placement.expandTargetSlug,
      priority,
    });
  }

  return candidates.sort((a, b) => b.priority - a.priority);
}

export function buildContentCluster(
  categorySlug: string,
  options?: { seoSignals?: SeoSignal[] },
): ContentCluster | null {
  const map = getCategoryKnowledgeMap(categorySlug);
  if (!map) return null;

  const anchors = resolveCategoryAnchors(categorySlug);
  const guides = getGuidesByCategory(categorySlug, { includeUnpublished: true });
  const candidates = buildSupportingTopicCandidates(categorySlug, options);

  const coverage: ClusterAreaCoverage[] = map.areas.map((area) => {
    const areaTopics = map.topics.filter(
      (t) => t.knowledgeAreaSlug === area.slug,
    );
    const coreIds = areaTopics
      .filter((t) => t.priorityClass === "CORE")
      .map((t) => t.id);
    const existingCore = coreIds.filter((id) => {
      const topic = map.topics.find((t) => t.id === id);
      return topic && guides.some((g) => g.slug === topic.suggestedSlug);
    });
    const existingSecondary = areaTopics.filter(
      (t) =>
        t.priorityClass === "SECONDARY" &&
        guides.some((g) => g.slug === t.suggestedSlug),
    );
    return {
      knowledgeAreaSlug: area.slug,
      label: area.label,
      targetCoreCount: area.targetCoreCount,
      existingCoreCount: existingCore.length,
      existingSecondaryCount: existingSecondary.length,
      missingCoreTopicIds: coreIds.filter(
        (id) => !existingCore.includes(id),
      ),
    };
  });

  const journeyCoverage: Record<string, number> = {};
  for (const g of guides) {
    journeyCoverage[g.journeyStage] = (journeyCoverage[g.journeyStage] ?? 0) + 1;
  }

  return {
    id: `cluster:${categorySlug}`,
    categorySlug,
    anchors,
    existingGuideSlugs: guides.map((g) => g.slug),
    candidates,
    coverage,
    journeyCoverage,
    generatedAt: new Date().toISOString(),
  };
}

export function buildSupportingKnowledgePlan(
  categorySlug: string,
): SupportingKnowledgePlan | null {
  const map = getCategoryKnowledgeMap(categorySlug);
  if (!map) return null;
  const candidates = buildSupportingTopicCandidates(categorySlug);
  return {
    areas: map.areas.map((a) => a.slug),
    coreTopicIds: map.topics
      .filter((t) => t.priorityClass === "CORE")
      .map((t) => t.id),
    candidateCount: candidates.length,
    readyCount: candidates.filter((c) => c.readiness === "ready").length,
    notes: [
      "Plan only — do not auto-execute GuideAgent for all candidates",
      ...map.notes,
    ],
  };
}

export function reportAnchorSupport(contentId: string): {
  contentId: string;
  supportedBy: { slug: string; title: string; status: string }[];
  gaps: SupportingTopicCandidate[];
} {
  const supportedBy = getGuidesSupportingContentId(contentId, {
    includeUnpublished: true,
  }).map((g) => ({
    slug: g.slug,
    title: g.title,
    status: g.metadata.status,
  }));

  const categorySlug = inferCategorySlugFromContentId(contentId);

  const gaps =
    categorySlug != null
      ? buildSupportingTopicCandidates(categorySlug).filter(
          (c) =>
            c.supports.some((s) => s.contentId === contentId) &&
            c.readiness !== "exists" &&
            (c.priorityClass === "CORE" ||
              (c.priorityClass === "SECONDARY" && c.placement === "NEW_PAGE")),
        )
      : [];

  return { contentId, supportedBy, gaps };
}

function inferCategorySlugFromContentId(contentId: string): string | undefined {
  const maps = listCategoryKnowledgeMaps();
  for (const map of maps) {
    if (
      contentId === categoryContentId(map.categorySlug) ||
      contentId.includes(`:${map.categorySlug}`) ||
      contentId.includes(`${map.categorySlug}-`)
    ) {
      return map.categorySlug;
    }
    // Tool / best support declared on map
    for (const [toolSlug, ids] of Object.entries(map.toolSupportTopicIds)) {
      if (contentId === toolContentId(toolSlug) && ids.length) {
        return map.categorySlug;
      }
    }
    for (const [bestSlug] of Object.entries(map.bestSupportTopicIds)) {
      if (contentId === bestContentId(bestSlug)) {
        return map.categorySlug;
      }
    }
  }
  return undefined;
}

export function reportProductSupport(productSlug: string): {
  productSlug: string;
  productGuides: { slug: string; title: string; status: string }[];
  categoryGuides: { slug: string; title: string; status: string }[];
  candidates: SupportingTopicCandidate[];
  rejected: SupportingTopicCandidate[];
} {
  const product = getSoftwareBySlug(productSlug, { includeUnpublished: true });
  const categorySlug = product?.primaryCategorySlug;
  const productGuides = getGuidesByProduct(productSlug, {
    includeUnpublished: true,
  }).map((g) => ({
    slug: g.slug,
    title: g.title,
    status: g.metadata.status,
  }));
  const categoryGuides = categorySlug
    ? getGuidesByCategory(categorySlug, { includeUnpublished: true }).map(
        (g) => ({
          slug: g.slug,
          title: g.title,
          status: g.metadata.status,
        }),
      )
    : [];

  const all = categorySlug
    ? buildSupportingTopicCandidates(categorySlug).filter((c) =>
        c.productSlugs.includes(productSlug),
      )
    : [];

  return {
    productSlug,
    productGuides,
    categoryGuides,
    candidates: all.filter(
      (c) => c.readiness === "ready" || c.readiness === "research-required",
    ),
    rejected: all.filter(
      (c) =>
        c.readiness === "not-recommended" ||
        c.readiness === "duplicate" ||
        c.placement === "NO_ACTION",
    ),
  };
}

export function planSupportingWorkflows(
  categorySlug: string,
): {
  agentId: "guide-agent";
  targetSlug: string;
  titleConcept: string;
  priorityClass: TopicPriorityClass;
  readiness: string;
}[] {
  return buildSupportingTopicCandidates(categorySlug)
    .filter(
      (c) =>
        c.readiness === "ready" &&
        c.placement === "NEW_PAGE" &&
        c.priorityClass === "CORE",
    )
    .map((c) => ({
      agentId: "guide-agent" as const,
      targetSlug: c.suggestedSlug,
      titleConcept: c.titleConcept,
      priorityClass: c.priorityClass,
      readiness: c.readiness,
    }));
}

/** Public learning links for hubs — published guides only. */
export function listPublishedLearningGuides(categorySlug: string): {
  slug: string;
  title: string;
  path: string;
}[] {
  return getGuidesByCategory(categorySlug)
    .filter((g) => isPublishedStatus(g.metadata.status))
    .map((g) => ({
      slug: g.slug,
      title: g.title,
      path: `/guides/${g.slug}/`,
    }));
}
