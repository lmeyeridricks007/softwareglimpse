import type { GuidePage } from "@/domain";
import {
  GUIDE_ASSET_DISCOVERY_AGENT_ID,
  GUIDE_ASSET_DISCOVERY_AGENT_VERSION,
  GuideAssetAuditSchema,
  type GuideAssetAudit,
} from "@/domain/schemas/asset-discovery";
import {
  buildGuideSectionRecommendations,
  buildSearchTasksFromRecommendations,
  classifyGuideKind,
  countGuideFigures,
  detectIndustryIds,
  loadContentQualityVisualContext,
  rateGuideVisualQuality,
} from "./analyze";

function summarizeBuckets(recs: GuideAssetAudit["recommendations"]) {
  const videoCats = new Set([
    "official-product-demo",
    "official-tutorial",
    "official-webinar",
    "official-implementation-video",
  ]);
  const screenshotCats = new Set(["official-screenshot"]);
  const diagramCats = new Set([
    "original-softwareglimpse-diagram",
    "original-comparison-graphic",
    "original-checklist-visualization",
    "official-workflow-diagram",
    "official-documentation-diagram",
    "tool-cta-visual",
  ]);
  const officialCats = new Set([
    "official-product-demo",
    "official-tutorial",
    "official-screenshot",
    "official-documentation-diagram",
    "official-workflow-diagram",
    "official-webinar",
    "official-implementation-video",
    "official-migration-documentation",
    "official-checklist-pdf-source",
  ]);
  const originalCats = new Set([
    "original-softwareglimpse-diagram",
    "original-checklist-visualization",
    "original-comparison-graphic",
    "tool-cta-visual",
  ]);
  const authCats = new Set([
    "government-regulatory-diagram",
    "standards-body-diagram",
  ]);

  return {
    videoOpportunities: recs.filter((r) => videoCats.has(r.category)).length,
    screenshotOpportunities: recs.filter((r) => screenshotCats.has(r.category))
      .length,
    diagramOpportunities: recs.filter((r) => diagramCats.has(r.category)).length,
    officialSourceOpportunities: recs.filter((r) => officialCats.has(r.category))
      .length,
    originalVisualOpportunities: recs.filter((r) => originalCats.has(r.category))
      .length,
    authoritativeSourceOpportunities: recs.filter((r) =>
      authCats.has(r.category),
    ).length,
    addNow: recs.filter((r) => r.recommendationLevel === "add-now").length,
    strongOpportunity: recs.filter(
      (r) => r.recommendationLevel === "strong-opportunity",
    ).length,
    priorityScore:
      recs.filter((r) => r.recommendationLevel === "add-now").length * 3 +
      recs.filter((r) => r.recommendationLevel === "strong-opportunity").length *
        2 +
      (recs.some((r) => r.resolvesContentQualityIds.length > 0) ? 2 : 0),
  };
}

/**
 * GuideAssetDiscoveryAgent — audit one guide.
 * Recommendations only. Never edits guide content.
 */
export function auditGuideAssets(input: {
  guide: GuidePage;
  generatedAt?: string;
}): GuideAssetAudit {
  const guide = input.guide;
  const kind = classifyGuideKind(guide);
  const figures = countGuideFigures(guide);
  const cq = loadContentQualityVisualContext(guide);
  const { sections, recommendations } = buildGuideSectionRecommendations({
    guide,
    kind,
    cqIssueIds: cq.issueIds,
  });
  const teachingGaps = sections.filter(
    (s) => s.visualWouldHelp && !s.hasTeachingVisual,
  ).length;
  const quality = rateGuideVisualQuality({
    figureCount: figures,
    hasHero: Boolean(guide.heroVisual?.src),
    teachingSectionGaps: teachingGaps,
    kind,
  });

  const searchTasks = buildSearchTasksFromRecommendations(recommendations);
  const summary = summarizeBuckets(recommendations);

  const officialAssetsFound = recommendations
    .filter(
      (r) =>
        r.category.startsWith("official-") &&
        r.recommendationLevel !== "do-not-use",
    )
    .map((r) => r.title);

  const authoritativeSourcesFound = recommendations
    .filter(
      (r) =>
        r.category === "government-regulatory-diagram" ||
        r.category === "standards-body-diagram",
    )
    .map((r) => r.title);

  const originalVisualOpportunities = recommendations
    .filter((r) => r.category.startsWith("original-") || r.category === "tool-cta-visual")
    .map((r) => `${r.title} → ${r.sectionTitle}`);

  const videosWorthEmbedding = recommendations
    .filter(
      (r) =>
        r.usageRecommendation === "embed" &&
        (r.recommendationLevel === "add-now" ||
          r.recommendationLevel === "strong-opportunity"),
    )
    .map((r) => r.title);

  const imagesWorthReferencing = recommendations
    .filter(
      (r) =>
        r.usageRecommendation === "link" ||
        r.usageRecommendation === "cite" ||
        r.usageRecommendation === "use-as-evidence",
    )
    .map((r) => r.title);

  const assetsRequiringUsageReview = recommendations
    .filter((r) => r.requiresUsageReview)
    .map((r) => r.title);

  const assetsToAvoid = [
    "Vendor promo / brand culture films with no UI — DO NOT USE as teaching media",
    "Third-party review-site screenshots as “official” evidence",
    "Affiliate landing pages as documentation sources",
    "Vendor marketing video used as regulatory / GDPR evidence",
    "Reusing another guide’s heroVisual artwork",
  ];

  if (cq.mediaGaps.length) {
    assetsToAvoid.push(
      ...cq.mediaGaps.slice(0, 2).map((g) => `CQ media gap context: ${g}`),
    );
  }

  const implementationPriority = [
    ...recommendations
      .filter((r) => r.recommendationLevel === "add-now")
      .map(
        (r) =>
          `ADD NOW: ${r.title} (${r.sectionTitle}) — ${r.usageRecommendation}${
            r.resolvesContentQualityIds.length
              ? ` [Resolves: ${r.resolvesContentQualityIds.join(", ")}]`
              : ""
          }`,
      ),
    ...recommendations
      .filter((r) => r.recommendationLevel === "strong-opportunity")
      .slice(0, 8)
      .map((r) => `STRONG: ${r.title} (${r.sectionTitle})`),
  ];

  return GuideAssetAuditSchema.parse({
    agentId: GUIDE_ASSET_DISCOVERY_AGENT_ID,
    agentVersion: GUIDE_ASSET_DISCOVERY_AGENT_VERSION,
    guideSlug: guide.slug,
    guideTitle: guide.title,
    route: `/guides/${guide.slug}/`,
    guideKind: kind,
    topicType: guide.topicType,
    generatedAt: input.generatedAt ?? new Date().toISOString(),
    visualQuality: quality.rating,
    visualQualityReason: quality.reason,
    contentQualityVisualScore: cq.score,
    contentQualityIssueIds: cq.issueIds,
    currentFigureCount: figures,
    hasHeroVisual: Boolean(guide.heroVisual?.src),
    productIds: guide.productSlugs ?? [],
    industryIds: detectIndustryIds(guide),
    sections,
    recommendations,
    officialAssetsFound,
    authoritativeSourcesFound,
    originalVisualOpportunities,
    videosWorthEmbedding,
    imagesWorthReferencing,
    assetsRequiringUsageReview,
    assetsToAvoid,
    implementationPriority,
    searchTasks,
    summary,
    notes: [
      "GuideAssetDiscoveryAgent — recommendations only; does not edit guides",
      "Search tasks are section-derived — prefer primary official / authoritative sources",
      "Do not recommend visuals only to decorate the page",
      cq.issueIds.length
        ? `Connected to Content Quality visual findings: ${cq.issueIds.join(", ")} (score ${cq.score}/5)`
        : cq.score !== undefined
          ? `Content Quality visual-media-support score: ${cq.score}/5`
          : "Content Quality visual score unavailable for this run",
    ],
  });
}
