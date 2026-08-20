import { loadEnrichment } from "@/data/research/store";
import { isOfficialVendorMedia } from "@/domain";
import { getIndustryCapabilityPage } from "@/services/industry-capability";
import { getCapabilities } from "@/data";
import type {
  CapabilityVisualCoverageProduct,
  CapabilityVisualCoverageReport,
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

function capabilityAliases(capabilitySlug: string): string[] {
  // Keep in sync with capability-page-media aliases where practical.
  if (capabilitySlug === "pipeline-management") {
    return ["pipeline-management", "pipeline"];
  }
  if (capabilitySlug === "workflow-automation") {
    return ["workflow-automation", "workflow-engine", "automation"];
  }
  return [capabilitySlug];
}

function mediaMatchesCapability(
  capabilityIds: string[],
  capabilitySlug: string,
): boolean {
  const aliases = new Set(capabilityAliases(capabilitySlug));
  return capabilityIds.some((id) => aliases.has(id));
}

/**
 * Internal diagnostics for Capability research visual evidence coverage.
 * Missing official workflow video is NEVER treated as research incompleteness.
 */
export function buildCapabilityVisualCoverageReport(
  capabilitySlug: string,
  options?: { industrySlug?: string; now?: Date },
): CapabilityVisualCoverageReport | null {
  const industrySlug = options?.industrySlug ?? "financial-services";
  const page = getIndustryCapabilityPage(industrySlug, capabilitySlug);
  if (!page) return null;

  const capabilityName =
    page.capabilityName ||
    getCapabilities().find((c) => c.slug === capabilitySlug)?.name ||
    capabilitySlug;

  const products: CapabilityVisualCoverageProduct[] = page.productRows.map(
    (row) => {
      const enrichment = loadEnrichment(row.slug);
      const researched = Boolean(enrichment);
      const screenshots = enrichment?.screenshots ?? [];
      const media = enrichment?.media ?? [];

      const scoped = media.filter((m) =>
        mediaMatchesCapability(m.capabilityIds, capabilitySlug),
      );
      const officialWorkflowVideos = scoped.filter(
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
      const hasOfficialWorkflowVideo = officialWorkflowVideos.length > 0;
      const hasVisualEvidence = hasScreenshots || hasOfficialWorkflowVideo;

      return {
        productSlug: row.slug,
        productName: row.name,
        researched,
        hasScreenshots,
        hasOfficialWorkflowVideo,
        hasVisualEvidence,
        screenshotCount,
        officialWorkflowVideoCount: officialWorkflowVideos.length,
        pipelineVideoCount: pipelineVideos.length,
      };
    },
  );

  const assessed = products.filter((p) => p.researched);
  const withShots = assessed.filter((p) => p.hasScreenshots);
  const withVideos = assessed.filter((p) => p.hasOfficialWorkflowVideo);
  const lackingVisual = assessed
    .filter((p) => !p.hasVisualEvidence)
    .map((p) => p.productSlug);
  const missingVideo = assessed
    .filter((p) => !p.hasOfficialWorkflowVideo)
    .map((p) => p.productSlug);

  return {
    capabilitySlug,
    capabilityName,
    industrySlug,
    generatedAt: (options?.now ?? new Date()).toISOString(),
    productsAssessed: assessed.length,
    productsWithScreenshots: withShots.length,
    productsWithOfficialWorkflowVideo: withVideos.length,
    productsLackingVisualEvidence: lackingVisual,
    productsMissingOfficialWorkflowVideo: missingVideo,
    note: "Lack of official workflow video is not research incompleteness by itself — documentation and screenshots remain valid capability evidence.",
    products,
  };
}

export function formatCapabilityVisualCoverageReportText(
  report: CapabilityVisualCoverageReport,
): string {
  const lines = [
    report.capabilityName,
    "",
    `Products assessed: ${report.productsAssessed}`,
    `Products with screenshots: ${report.productsWithScreenshots}`,
    `Products with official workflow video: ${report.productsWithOfficialWorkflowVideo}`,
    "",
    report.note,
    "",
    `Capability: ${report.capabilitySlug}${
      report.industrySlug ? ` · industry: ${report.industrySlug}` : ""
    }`,
    `Generated: ${report.generatedAt}`,
    `Lacking visual evidence: ${
      report.productsLackingVisualEvidence.length
        ? report.productsLackingVisualEvidence.join(", ")
        : "none"
    }`,
    `Missing official workflow video (not incompleteness): ${
      report.productsMissingOfficialWorkflowVideo.length
        ? report.productsMissingOfficialWorkflowVideo.join(", ")
        : "none"
    }`,
    "",
    "Per product:",
  ];
  for (const p of report.products) {
    lines.push(
      `  - ${p.productName}: researched=${p.researched} screenshots=${p.screenshotCount} workflowVideos=${p.officialWorkflowVideoCount} pipeline=${p.pipelineVideoCount} visual=${p.hasVisualEvidence}`,
    );
  }
  return lines.join("\n");
}
