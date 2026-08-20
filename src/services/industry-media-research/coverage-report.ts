import { loadEnrichment } from "@/data/research/store";
import {
  getAllSoftwareUnfiltered,
  getIndustryBySlug,
  getPrimarySoftwareByCategory,
} from "@/data";
import { getIndustryHubProfile } from "@/data/industry-hub";
import { isOfficialVendorMedia, type ProductMedia } from "@/domain";
import { resolveIndustryMediaContext } from "@/services/product-media/industry-page-media";
import type { IndustryVisualCoverageReport } from "./types";

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

function mediaMatchesIndustry(
  industryIds: string[],
  industrySlug: string,
): boolean {
  return industryIds.includes(industrySlug);
}

function isActiveOfficial(media: ProductMedia): boolean {
  return isOfficialVendorMedia(media) && ACTIVE_VIDEO_STATUSES.has(media.status);
}

/**
 * Internal diagnostics for Industry research media coverage.
 * Counts are informational — must NOT alter industry product rankings / fit.
 */
export function buildIndustryVisualCoverageReport(
  industrySlug: string,
  options?: { now?: Date },
): IndustryVisualCoverageReport | null {
  const industry = getIndustryBySlug(industrySlug, {
    includeUnpublished: true,
  });
  if (!industry) return null;

  const profile = getIndustryHubProfile(industrySlug);
  const categorySlug = profile?.categorySlug ?? "crm";
  const industryName =
    profile?.badgeLabel ?? industry.name ?? industrySlug;

  const productMap = new Map(
    getPrimarySoftwareByCategory(categorySlug).map((s) => [
      s.slug,
      { slug: s.slug, name: s.name },
    ]),
  );

  for (const soft of getAllSoftwareUnfiltered()) {
    if (productMap.has(soft.slug)) continue;
    const enrichment = loadEnrichment(soft.slug);
    if (
      !enrichment?.media?.some((m) =>
        mediaMatchesIndustry(m.industryIds, industrySlug),
      )
    ) {
      continue;
    }
    productMap.set(soft.slug, { slug: soft.slug, name: soft.name });
  }

  const products = [...productMap.values()].map((row) => {
    const enrichment = loadEnrichment(row.slug);
    const media = (enrichment?.media ?? []).filter((m) =>
      mediaMatchesIndustry(m.industryIds, industrySlug),
    );

    const active = media.filter(isActiveOfficial);
    const pipeline = media.filter(
      (m) =>
        m.type !== "softwareglimpse-video" && PIPELINE_STATUSES.has(m.status),
    );

    let industrySpecificCount = 0;
    let industryEditionCount = 0;
    let generalWorkflowCount = 0;
    let caseStudyCount = 0;
    let weakCount = 0;

    for (const m of active) {
      if (m.industryRelevance === "weak") {
        weakCount += 1;
        continue;
      }
      const kind = resolveIndustryMediaContext(m);
      if (kind === "industry-specific") industrySpecificCount += 1;
      else if (kind === "industry-edition") industryEditionCount += 1;
      else if (kind === "customer-case-study") caseStudyCount += 1;
      else if (
        kind === "general-workflow" &&
        m.industryRelevance !== "weak"
      ) {
        generalWorkflowCount += 1;
      }
    }

    return {
      productSlug: row.slug,
      productName: row.name,
      industrySpecificCount,
      industryEditionCount,
      generalWorkflowCount,
      caseStudyCount,
      weakCount,
      pipelineCount: pipeline.length,
    };
  });

  const editionLabels = new Set<string>();
  for (const soft of productMap.values()) {
    const enrichment = loadEnrichment(soft.slug);
    for (const m of enrichment?.media ?? []) {
      if (!mediaMatchesIndustry(m.industryIds, industrySlug)) continue;
      if (!isActiveOfficial(m)) continue;
      if (m.industryRelevance === "weak") continue;
      if (resolveIndustryMediaContext(m) !== "industry-edition") continue;
      if (m.industryEditionLabel?.trim()) {
        editionLabels.add(m.industryEditionLabel.trim());
      }
    }
  }

  const industrySpecificVideos = products.reduce(
    (sum, p) => sum + p.industrySpecificCount,
    0,
  );
  const generalRelevantWorkflows = products.reduce(
    (sum, p) => sum + p.generalWorkflowCount,
    0,
  );
  const caseStudies = products.reduce((sum, p) => sum + p.caseStudyCount, 0);
  const weakRelevanceCount = products.reduce((sum, p) => sum + p.weakCount, 0);
  const pipelineVideoCount = products.reduce(
    (sum, p) => sum + p.pipelineCount,
    0,
  );
  const productsWithIndustryDemos = products.filter(
    (p) =>
      p.industrySpecificCount + p.industryEditionCount > 0,
  ).length;

  return {
    industrySlug,
    industryName,
    generatedAt: (options?.now ?? new Date()).toISOString(),
    industrySpecificVideos,
    industryEditionsRepresented: editionLabels.size,
    industryEditionLabels: [...editionLabels].sort(),
    productsWithIndustryDemos,
    generalRelevantWorkflows,
    caseStudies,
    weakRelevanceCount,
    pipelineVideoCount,
    products,
    note: "Industry media coverage is informational only and must not alter industry product rankings, fit scores, or primary recommendations.",
  };
}

export function formatIndustryVisualCoverageReportText(
  report: IndustryVisualCoverageReport,
): string {
  const lines = [
    report.industryName,
    "",
    "Industry-specific videos:",
    `${report.industrySpecificVideos}`,
    "",
    "Industry editions represented:",
    `${report.industryEditionsRepresented}`,
    "",
    "Products with industry demos:",
    `${report.productsWithIndustryDemos}`,
    "",
    "General relevant workflows:",
    `${report.generalRelevantWorkflows}`,
    "",
    "Case studies:",
    `${report.caseStudies}`,
    "",
    report.note,
    "",
    `Industry: ${report.industrySlug}`,
    `Generated: ${report.generatedAt}`,
    `Weak relevance (not prominent): ${report.weakRelevanceCount}`,
    `Pipeline (research-only): ${report.pipelineVideoCount}`,
  ];
  if (report.industryEditionLabels.length > 0) {
    lines.push(
      `Edition labels: ${report.industryEditionLabels.join(", ")}`,
    );
  }
  lines.push("", "Per product:");
  for (const p of report.products) {
    lines.push(
      `  - ${p.productName}: specific=${p.industrySpecificCount} edition=${p.industryEditionCount} general=${p.generalWorkflowCount} caseStudies=${p.caseStudyCount} weak=${p.weakCount} pipeline=${p.pipelineCount}`,
    );
  }
  return lines.join("\n");
}
