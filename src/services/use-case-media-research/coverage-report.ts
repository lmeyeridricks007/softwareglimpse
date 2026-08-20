import { loadEnrichment } from "@/data/research/store";
import { getUseCases, getAllSoftwareUnfiltered } from "@/data";
import { isOfficialVendorMedia } from "@/domain";
import { getUseCaseHubProfile } from "@/data/use-case-hub";
import type {
  UseCaseVisualCoverageProduct,
  UseCaseVisualCoverageReport,
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

function useCaseAliases(useCaseSlug: string): string[] {
  return [useCaseSlug];
}

function mediaMatchesUseCase(
  useCaseIds: string[],
  useCaseSlug: string,
): boolean {
  const aliases = new Set(useCaseAliases(useCaseSlug));
  return useCaseIds.some((id) => aliases.has(id));
}

/**
 * Whether media counts as use-case workflow evidence (docs/screenshots OR video).
 * Screenshots on enrichment count; active official use-case-tagged video counts.
 */
function hasWorkflowEvidence(input: {
  screenshotCount: number;
  officialWorkflowVideoCount: number;
}): boolean {
  return input.screenshotCount > 0 || input.officialWorkflowVideoCount > 0;
}

/**
 * Internal diagnostics for Use Case research visual evidence coverage.
 * Video coverage is informational — does NOT alter research completeness scores
 * unless methodology explicitly requires visual evidence.
 */
export function buildUseCaseVisualCoverageReport(
  useCaseSlug: string,
  options?: { now?: Date },
): UseCaseVisualCoverageReport | null {
  const useCase = getUseCases().find((u) => u.slug === useCaseSlug);
  if (!useCase) return null;

  const profile = getUseCaseHubProfile(useCaseSlug);
  const useCaseName = profile?.badgeLabel ?? useCase.name;

  const catalogue = getAllSoftwareUnfiltered().filter((s) =>
    s.useCaseSlugs.includes(useCaseSlug),
  );

  // Also include researched products that have use-case-tagged media
  // even if catalogue tagging lags.
  const productMap = new Map(
    catalogue.map((s) => [s.slug, { slug: s.slug, name: s.name }]),
  );
  for (const soft of getAllSoftwareUnfiltered()) {
    if (productMap.has(soft.slug)) continue;
    const enrichment = loadEnrichment(soft.slug);
    if (!enrichment?.media?.some((m) => mediaMatchesUseCase(m.useCaseIds, useCaseSlug))) {
      continue;
    }
    productMap.set(soft.slug, { slug: soft.slug, name: soft.name });
  }

  const products: UseCaseVisualCoverageProduct[] = [...productMap.values()].map(
    (row) => {
      const enrichment = loadEnrichment(row.slug);
      const researched = Boolean(enrichment);
      const screenshots = enrichment?.screenshots ?? [];
      const media = enrichment?.media ?? [];

      const scoped = media.filter((m) =>
        mediaMatchesUseCase(m.useCaseIds, useCaseSlug),
      );
      const officialWorkflowVideos = scoped.filter(
        (m) =>
          isOfficialVendorMedia(m) && ACTIVE_VIDEO_STATUSES.has(m.status),
      );
      const pipelineVideos = scoped.filter(
        (m) =>
          m.type !== "softwareglimpse-video" && PIPELINE_STATUSES.has(m.status),
      );

      const screenshotCount = screenshots.length;
      const hasScreenshots = screenshotCount > 0;
      const hasOfficialWorkflowVideo = officialWorkflowVideos.length > 0;
      const workflowEvidence = hasWorkflowEvidence({
        screenshotCount,
        officialWorkflowVideoCount: officialWorkflowVideos.length,
      });

      return {
        productSlug: row.slug,
        productName: row.name,
        researched,
        hasWorkflowEvidence: workflowEvidence,
        hasScreenshots,
        hasOfficialWorkflowVideo,
        screenshotCount,
        officialWorkflowVideoCount: officialWorkflowVideos.length,
        pipelineVideoCount: pipelineVideos.length,
      };
    },
  );

  const assessed = products.filter((p) => p.researched);
  const withEvidence = assessed.filter((p) => p.hasWorkflowEvidence);
  const withShots = assessed.filter((p) => p.hasScreenshots);
  const withVideos = assessed.filter((p) => p.hasOfficialWorkflowVideo);
  const lackingVisual = assessed
    .filter((p) => !p.hasWorkflowEvidence)
    .map((p) => p.productSlug);
  const missingVideo = assessed
    .filter((p) => !p.hasOfficialWorkflowVideo)
    .map((p) => p.productSlug);

  return {
    useCaseSlug,
    useCaseName,
    generatedAt: (options?.now ?? new Date()).toISOString(),
    productsAssessed: assessed.length,
    productsWithWorkflowEvidence: withEvidence.length,
    productsWithScreenshots: withShots.length,
    productsWithOfficialWorkflowVideo: withVideos.length,
    productsLackingVisualEvidence: lackingVisual,
    productsMissingOfficialWorkflowVideo: missingVideo,
    note: "Video coverage is informational. Missing official workflow video does not alter research completeness scores unless visual evidence is explicitly required by methodology.",
    products,
  };
}

export function formatUseCaseVisualCoverageReportText(
  report: UseCaseVisualCoverageReport,
): string {
  const lines = [
    report.useCaseName,
    "",
    `Products assessed: ${report.productsAssessed}`,
    `Products with workflow evidence: ${report.productsWithWorkflowEvidence}`,
    `Products with screenshots: ${report.productsWithScreenshots}`,
    `Products with official workflow video: ${report.productsWithOfficialWorkflowVideo}`,
    "",
    report.note,
    "",
    `Use case: ${report.useCaseSlug}`,
    `Generated: ${report.generatedAt}`,
    `Lacking visual evidence: ${
      report.productsLackingVisualEvidence.length
        ? report.productsLackingVisualEvidence.join(", ")
        : "none"
    }`,
    `Missing official workflow video (informational): ${
      report.productsMissingOfficialWorkflowVideo.length
        ? report.productsMissingOfficialWorkflowVideo.join(", ")
        : "none"
    }`,
    "",
    "Per product:",
  ];
  for (const p of report.products) {
    lines.push(
      `  - ${p.productName}: researched=${p.researched} workflowEvidence=${p.hasWorkflowEvidence} screenshots=${p.screenshotCount} workflowVideos=${p.officialWorkflowVideoCount} pipeline=${p.pipelineVideoCount}`,
    );
  }
  return lines.join("\n");
}
