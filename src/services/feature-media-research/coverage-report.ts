import { loadEnrichment } from "@/data/research/store";
import { getFeatureDetailPage } from "@/services/feature-detail";
import { isOfficialVendorMedia } from "@/domain";
import type {
  FeatureVisualCoverageProduct,
  FeatureVisualCoverageReport,
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

/**
 * Internal diagnostics for Feature research visual evidence coverage.
 * Missing video is NEVER treated as research failure.
 */
export function buildFeatureVisualCoverageReport(
  featureSlug: string,
  options?: { now?: Date },
): FeatureVisualCoverageReport | null {
  const page = getFeatureDetailPage(featureSlug);
  if (!page) return null;

  const products: FeatureVisualCoverageProduct[] = page.productRows.map(
    (row) => {
      const enrichment = loadEnrichment(row.slug);
      const researched = Boolean(enrichment);
      const screenshots = enrichment?.screenshots ?? [];
      const media = enrichment?.media ?? [];

      const scoped = media.filter((m) => m.featureIds.includes(featureSlug));
      const officialVideos = scoped.filter(
        (m) =>
          isOfficialVendorMedia(m) && ACTIVE_VIDEO_STATUSES.has(m.status),
      );
      const pipelineVideos = scoped.filter(
        (m) =>
          m.type !== "softwareglimpse-video" && PIPELINE_STATUSES.has(m.status),
      );

      const pageShots = page.screenshots.filter(
        (s) => s.productSlug === row.slug,
      );
      const screenshotCount = Math.max(screenshots.length, pageShots.length);
      const hasScreenshots = screenshotCount > 0;
      const hasOfficialVideos = officialVideos.length > 0;
      const hasVisualEvidence = hasScreenshots || hasOfficialVideos;

      return {
        productSlug: row.slug,
        productName: row.name,
        researched,
        hasScreenshots,
        hasOfficialVideos,
        hasVisualEvidence,
        screenshotCount,
        officialVideoCount: officialVideos.length,
        pipelineVideoCount: pipelineVideos.length,
      };
    },
  );

  const researchedProducts = products.filter((p) => p.researched);
  const withShots = researchedProducts.filter((p) => p.hasScreenshots);
  const withVideos = researchedProducts.filter((p) => p.hasOfficialVideos);
  const lackingVisual = researchedProducts
    .filter((p) => !p.hasVisualEvidence)
    .map((p) => p.productSlug);
  const missingVideo = researchedProducts
    .filter((p) => !p.hasOfficialVideos)
    .map((p) => p.productSlug);

  return {
    featureSlug: page.featureSlug,
    featureName: page.featureName,
    generatedAt: (options?.now ?? new Date()).toISOString(),
    productsResearched: researchedProducts.length,
    productsWithScreenshots: withShots.length,
    productsWithOfficialVideos: withVideos.length,
    productsLackingVisualEvidence: lackingVisual,
    productsMissingOfficialVideo: missingVideo,
    note: "Missing official video is not a research failure — documentation and screenshots remain valid evidence for ProductFeatureAssessment.",
    products,
  };
}

export function formatFeatureVisualCoverageReportText(
  report: FeatureVisualCoverageReport,
): string {
  const lines = [
    `Feature visual coverage: ${report.featureName} (${report.featureSlug})`,
    `Generated: ${report.generatedAt}`,
    "",
    `Products researched: ${report.productsResearched}`,
    `With screenshots: ${report.productsWithScreenshots}`,
    `With official videos: ${report.productsWithOfficialVideos}`,
    `Lacking visual evidence: ${
      report.productsLackingVisualEvidence.length
        ? report.productsLackingVisualEvidence.join(", ")
        : "none"
    }`,
    `Missing official video (not a failure): ${
      report.productsMissingOfficialVideo.length
        ? report.productsMissingOfficialVideo.join(", ")
        : "none"
    }`,
    "",
    report.note,
    "",
    "Per product:",
  ];
  for (const p of report.products) {
    lines.push(
      `  - ${p.productName}: researched=${p.researched} screenshots=${p.screenshotCount} videos=${p.officialVideoCount} pipeline=${p.pipelineVideoCount} visual=${p.hasVisualEvidence}`,
    );
  }
  return lines.join("\n");
}
