import type {
  GuidePage,
  ProductResearchEnrichment,
  ResearchSource,
  Software,
} from "@/domain";
import type {
  AssetDiscoveryPageType,
  PageAssetSnapshot,
} from "@/domain/schemas/asset-discovery";
import { PageAssetSnapshotSchema } from "@/domain/schemas/asset-discovery";
import { getSoftwareBySlug } from "@/data/repositories/catalog";
import { getGuideBySlug } from "@/data/repositories/guides";
import { loadEnrichment, loadManualSources } from "@/data/research/store";
import { resolveProductOfficialLinks } from "@/services/outbound/resolve-product-links";

/**
 * Map live Software / Guide entities → PageAssetSnapshot for needs analysis.
 * Read-only — never mutates production content.
 */

function sectionKindFromGuideBlock(
  type: string,
): PageAssetSnapshot["sections"][number]["kind"] {
  switch (type) {
    case "direct-answer":
    case "key-takeaways":
      return "overview";
    case "decision-framework":
    case "step":
      return "workflow";
    case "feature-matrix":
    case "size-match":
      return "features";
    case "figure":
      return "teaching";
    case "checklist":
      return "implementation";
    case "faq":
      return "faq";
    case "comparison-table":
      return "comparison";
    default:
      return "other";
  }
}

export function snapshotFromSoftware(input: {
  software: Software;
  enrichment?: ProductResearchEnrichment | null;
  sources?: ResearchSource[];
}): PageAssetSnapshot {
  const { software } = input;
  const enrichment = input.enrichment ?? null;
  const sources = input.sources ?? software.sources ?? [];
  const media = enrichment?.media ?? [];
  const screenshots = enrichment?.screenshots ?? [];
  const officialVideos = media.filter(
    (m) =>
      m.officialSource &&
      (m.status === "published" ||
        m.status === "active" ||
        m.status === "embedding-disabled"),
  );
  const officialLinks = resolveProductOfficialLinks({
    ...software,
    sources: sources.length ? sources : software.sources,
  });

  const featureIds = [
    ...new Set([
      ...software.featureRatings.map((f) => f.featureSlug),
      ...media.flatMap((m) => m.featureIds),
    ]),
  ];

  const hasOverviewVideo = officialVideos.some((m) =>
    m.placements.includes("overview"),
  );
  const hasFeatureVideo = officialVideos.some(
    (m) =>
      m.placements.includes("features") ||
      m.featureIds.length > 0 ||
      m.type === "official-tutorial",
  );
  const hasImplVideo = officialVideos.some(
    (m) =>
      m.placements.includes("implementation") ||
      m.type === "official-tutorial" ||
      m.evidenceClaimKinds.includes("setup-tutorial"),
  );

  return PageAssetSnapshotSchema.parse({
    pageId: `content:software:${software.slug}`,
    route: `/software/${software.slug}/`,
    pageType: "product-review" satisfies AssetDiscoveryPageType,
    title: `${software.name} review`,
    summary: software.shortDescription ?? software.description,
    productIds: [software.slug],
    industryIds: software.industrySlugs,
    useCaseIds: software.useCaseSlugs,
    featureIds,
    sections: [
      {
        id: "overview",
        title: "Overview",
        kind: "overview",
        topics: ["product-overview"],
        hasVisual: officialVideos.length > 0 || screenshots.length > 0,
        hasOfficialVideo: hasOverviewVideo || officialVideos.length > 0,
        hasScreenshot: screenshots.length > 0,
        claimHeavy: true,
      },
      {
        id: "features",
        title: "Features",
        kind: "features",
        topics: featureIds.slice(0, 8),
        hasVisual: hasFeatureVideo || screenshots.length > 0,
        hasOfficialVideo: hasFeatureVideo,
        hasScreenshot: screenshots.length > 0,
        claimHeavy: true,
      },
      {
        id: "implementation",
        title: "Implementation",
        kind: "implementation",
        topics: ["setup", "onboarding"],
        hasVisual: hasImplVideo,
        hasOfficialVideo: hasImplVideo,
        hasScreenshot: false,
        claimHeavy: false,
      },
      {
        id: "pricing",
        title: "Pricing",
        kind: "pricing",
        topics: ["pricing"],
        hasVisual: Boolean(officialLinks.pricing),
        hasOfficialVideo: false,
        hasScreenshot: false,
        claimHeavy: true,
      },
      {
        id: "integrations",
        title: "Integrations",
        kind: "integrations",
        topics: software.integrationSlugs.slice(0, 6),
        hasVisual: false,
        hasOfficialVideo: false,
        hasScreenshot: false,
        claimHeavy: false,
      },
      {
        id: "evidence",
        title: "Evidence",
        kind: "evidence",
        topics: ["sources", "docs"],
        hasVisual: officialVideos.some((m) =>
          m.placements.includes("evidence"),
        ),
        hasOfficialVideo: officialVideos.some((m) =>
          m.placements.includes("evidence"),
        ),
        hasScreenshot: screenshots.length > 0,
        claimHeavy: true,
      },
    ],
    existingOfficialVideoCount: officialVideos.length,
    existingScreenshotCount: screenshots.length,
    existingFigureCount: 0,
    existingOfficialSourceCount: sources.filter(
      (s) =>
        s.authority === "first-party" ||
        s.sourceType.startsWith("official-"),
    ).length,
    existingMediaIds: [
      ...media.map((m) => m.id),
      ...screenshots.map((s) => s.id),
    ],
    notes: [
      "Asset discovery is recommendation-only — does not alter rankings or enrichment",
      `Official website: ${officialLinks.officialWebsite ?? "unknown"}`,
    ],
  });
}

export function snapshotFromGuide(guide: GuidePage): PageAssetSnapshot {
  const figureBlocks = guide.blocks.filter((b) => b.type === "figure");
  const stepFigures = guide.blocks.filter(
    (b) => b.type === "step" && "figure" in b && Boolean(b.figure),
  );
  const figureCount =
    figureBlocks.length +
    stepFigures.length +
    (guide.heroVisual ? 1 : 0);

  const sections = guide.blocks.map((block) => {
    const hasFigure =
      block.type === "figure" ||
      (block.type === "step" && "figure" in block && Boolean(block.figure));
    return {
      id: block.id,
      title:
        ("title" in block && typeof block.title === "string" && block.title) ||
        ("heading" in block &&
          typeof block.heading === "string" &&
          block.heading) ||
        block.type,
      kind: sectionKindFromGuideBlock(block.type),
      topics: [],
      hasVisual: hasFigure,
      hasOfficialVideo: false,
      hasScreenshot: false,
      claimHeavy: block.type === "direct-answer" || block.type === "step",
    };
  });

  // Fallback sections when blocks empty
  const fallbackSections =
    sections.length > 0
      ? sections
      : guide.sections.map((s) => ({
          id: s.id,
          title: s.heading,
          kind: "teaching" as const,
          topics: [],
          hasVisual: false,
          hasOfficialVideo: false,
          hasScreenshot: false,
          claimHeavy: false,
        }));

  const industryIds = guide.categorySlugs.includes("crm")
    ? guide.slug.includes("financial-services")
      ? ["financial-services"]
      : []
    : [];

  return PageAssetSnapshotSchema.parse({
    pageId: `content:guide:${guide.slug}`,
    route: `/guides/${guide.slug}/`,
    pageType: "guide",
    title: guide.title,
    summary: guide.summary,
    productIds: guide.productSlugs,
    industryIds,
    useCaseIds: [],
    capabilityIds: [],
    requirementIds: [],
    featureIds: [],
    sections: fallbackSections,
    existingOfficialVideoCount: 0,
    existingScreenshotCount: 0,
    existingFigureCount: figureCount,
    existingOfficialSourceCount: 0,
    existingMediaIds: guide.heroVisual ? [`hero:${guide.slug}`] : [],
    topicType: guide.topicType,
    notes: [
      "Guide asset discovery prefers original SoftwareGlimpse teaching visuals",
      "Official vendor media is optional supporting evidence — not ranking input",
    ],
  });
}

export function loadSoftwarePageSnapshot(
  productSlug: string,
): PageAssetSnapshot | null {
  const software = getSoftwareBySlug(productSlug, {
    includeUnpublished: true,
  });
  if (!software) return null;
  const enrichment = loadEnrichment(productSlug);
  const sources = loadManualSources(productSlug);
  return snapshotFromSoftware({
    software: {
      ...software,
      sources: sources.length ? sources : software.sources,
    },
    enrichment,
    sources,
  });
}

export function loadGuidePageSnapshot(
  guideSlug: string,
): PageAssetSnapshot | null {
  const guide = getGuideBySlug(guideSlug, { includeUnpublished: true });
  if (!guide) return null;
  return snapshotFromGuide(guide);
}
