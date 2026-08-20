import { loadEnrichment } from "@/data/research/store";
import { getPrimarySoftwareByCategory, getAllSoftwareUnfiltered } from "@/data";
import { isOfficialVendorMedia } from "@/domain";
import { getRequirementDetailProfile } from "@/data/requirement-detail";
import type {
  RequirementEvidenceCoverageLevel,
  RequirementVisualCoverageProduct,
  RequirementVisualCoverageReport,
} from "./types";

const PIPELINE_STATUSES = new Set([
  "discovered",
  "candidate",
  "draft",
  "verified",
  "classified",
  "needs-review",
]);

const ACTIVE_VIDEO_STATUSES = new Set([
  "active",
  "published",
  "embedding-disabled",
]);

function mediaMatchesRequirement(
  requirementIds: string[],
  requirementSlug: string,
): boolean {
  return requirementIds.includes(requirementSlug);
}

function evidenceCoverageLevel(
  assessed: number,
  withNonVideoEvidence: number,
): RequirementEvidenceCoverageLevel {
  if (assessed === 0) return "Unknown";
  const ratio = withNonVideoEvidence / assessed;
  if (ratio >= 0.7) return "High";
  if (ratio >= 0.4) return "Medium";
  if (withNonVideoEvidence > 0) return "Low";
  return "Unknown";
}

/**
 * Internal diagnostics for Requirement research evidence coverage.
 * Official video counts are informational — must NOT alter requirement fit scores.
 */
export function buildRequirementVisualCoverageReport(
  requirementSlug: string,
  options?: { now?: Date },
): RequirementVisualCoverageReport | null {
  const profile = getRequirementDetailProfile(requirementSlug);
  if (!profile) return null;

  const categorySlug = profile.categorySlug ?? "crm";
  const featureSlugs = profile.featureLinks.map((f) => f.featureSlug);

  const productMap = new Map(
    getPrimarySoftwareByCategory(categorySlug).map((s) => [
      s.slug,
      { slug: s.slug, name: s.name },
    ]),
  );

  // Include researched products that already carry requirement-tagged media.
  for (const soft of getAllSoftwareUnfiltered()) {
    if (productMap.has(soft.slug)) continue;
    const enrichment = loadEnrichment(soft.slug);
    if (
      !enrichment?.media?.some((m) =>
        mediaMatchesRequirement(m.requirementIds, requirementSlug),
      )
    ) {
      continue;
    }
    productMap.set(soft.slug, { slug: soft.slug, name: soft.name });
  }

  const products: RequirementVisualCoverageProduct[] = [
    ...productMap.values(),
  ].map((row) => {
    const enrichment = loadEnrichment(row.slug);
    const researched = Boolean(enrichment);
    const screenshots = enrichment?.screenshots ?? [];
    const media = enrichment?.media ?? [];

    const scoped = media.filter((m) =>
      mediaMatchesRequirement(m.requirementIds, requirementSlug),
    );
    const officialCriterionVideos = scoped.filter(
      (m) =>
        isOfficialVendorMedia(m) && ACTIVE_VIDEO_STATUSES.has(m.status),
    );
    const pipelineVideos = scoped.filter(
      (m) =>
        m.type !== "softwareglimpse-video" && PIPELINE_STATUSES.has(m.status),
    );

    const featureEvidenceCount = (enrichment?.featureSupport ?? []).filter(
      (f) =>
        featureSlugs.includes(f.featureSlug) &&
        (f.sourceIds?.length ?? 0) > 0,
    ).length;

    const screenshotCount = screenshots.length;
    const hasScreenshots = screenshotCount > 0;
    const hasOfficialCriterionVideo = officialCriterionVideos.length > 0;
    const hasNonVideoEvidence =
      hasScreenshots || featureEvidenceCount > 0;

    return {
      productSlug: row.slug,
      productName: row.name,
      researched,
      hasNonVideoEvidence,
      hasScreenshots,
      hasOfficialCriterionVideo,
      screenshotCount,
      officialCriterionVideoCount: officialCriterionVideos.length,
      pipelineVideoCount: pipelineVideos.length,
      featureEvidenceCount,
    };
  });

  const assessed = products.filter((p) => p.researched);
  const withNonVideo = assessed.filter((p) => p.hasNonVideoEvidence);
  const withShots = assessed.filter((p) => p.hasScreenshots);
  const withVideos = assessed.filter((p) => p.hasOfficialCriterionVideo);
  const lackingNonVideo = assessed
    .filter((p) => !p.hasNonVideoEvidence)
    .map((p) => p.productSlug);
  const missingVideo = assessed
    .filter((p) => !p.hasOfficialCriterionVideo)
    .map((p) => p.productSlug);

  return {
    requirementSlug,
    requirementName: profile.name,
    generatedAt: (options?.now ?? new Date()).toISOString(),
    criteriaCount: profile.evaluationCriteria.length,
    productsAssessed: assessed.length,
    evidenceCoverage: evidenceCoverageLevel(
      assessed.length,
      withNonVideo.length,
    ),
    productsWithNonVideoEvidence: withNonVideo.length,
    productsWithScreenshots: withShots.length,
    productsWithOfficialVideo: withVideos.length,
    productsLackingNonVideoEvidence: lackingNonVideo,
    productsMissingOfficialVideo: missingVideo,
    note: "Evidence coverage uses documentation, screenshots, and feature assessments. Official video counts are informational only and must not alter requirement fit scores.",
    products,
  };
}

export function formatRequirementVisualCoverageReportText(
  report: RequirementVisualCoverageReport,
): string {
  const lines = [
    report.requirementName,
    "",
    `Criteria:`,
    `${report.criteriaCount}`,
    "",
    `Products assessed:`,
    `${report.productsAssessed}`,
    "",
    `Evidence coverage:`,
    `${report.evidenceCoverage}`,
    "",
    `Products with official video:`,
    `${report.productsWithOfficialVideo}`,
    "",
    report.note,
    "",
    `Requirement: ${report.requirementSlug}`,
    `Generated: ${report.generatedAt}`,
    `Products with non-video evidence: ${report.productsWithNonVideoEvidence}`,
    `Products with screenshots: ${report.productsWithScreenshots}`,
    `Lacking non-video evidence: ${
      report.productsLackingNonVideoEvidence.length
        ? report.productsLackingNonVideoEvidence.join(", ")
        : "none"
    }`,
    `Missing official video (informational): ${
      report.productsMissingOfficialVideo.length
        ? report.productsMissingOfficialVideo.join(", ")
        : "none"
    }`,
    "",
    "Per product:",
  ];
  for (const p of report.products) {
    lines.push(
      `  - ${p.productName}: researched=${p.researched} nonVideoEvidence=${p.hasNonVideoEvidence} featureEvidence=${p.featureEvidenceCount} screenshots=${p.screenshotCount} criterionVideos=${p.officialCriterionVideoCount} pipeline=${p.pipelineVideoCount}`,
    );
  }
  return lines.join("\n");
}
