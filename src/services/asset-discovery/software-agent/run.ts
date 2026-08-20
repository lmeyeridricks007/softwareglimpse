import fs from "node:fs";
import path from "node:path";
import type {
  SoftwareAssetMasterReport,
  SoftwareProductAssetAudit,
} from "@/domain/schemas/asset-discovery";
import {
  SOFTWARE_ASSET_DISCOVERY_AGENT_ID,
  SOFTWARE_ASSET_DISCOVERY_AGENT_VERSION,
  SoftwareAssetMasterReportSchema,
} from "@/domain/schemas/asset-discovery";
import { getAllSoftwareUnfiltered } from "@/data/repositories/catalog";
import { isPubliclyAvailable } from "@/domain/publishing";
import { loadEnrichment, loadManualSources } from "@/data/research/store";
import { auditSoftwareProductAssets } from "./audit-product";
import {
  formatSoftwareAssetMasterMarkdown,
  formatSoftwareProductAssetMarkdown,
} from "./report";

const DOCS_SOFTWARE_DIR = path.join(
  process.cwd(),
  "docs",
  "content-assets",
  "software",
);
const MASTER_REPORT_PATH = path.join(
  process.cwd(),
  "docs",
  "content-assets",
  "SOFTWARE-ASSET-OPPORTUNITIES.md",
);

export type SoftwareAssetDiscoveryAgentMeta = {
  id: typeof SOFTWARE_ASSET_DISCOVERY_AGENT_ID;
  name: "SoftwareAssetDiscoveryAgent";
  version: typeof SOFTWARE_ASSET_DISCOVERY_AGENT_VERSION;
  /** Never edits product pages or enrichment. */
  mutatesProductPages: false;
};

export const SOFTWARE_ASSET_DISCOVERY_AGENT: SoftwareAssetDiscoveryAgentMeta = {
  id: SOFTWARE_ASSET_DISCOVERY_AGENT_ID,
  name: "SoftwareAssetDiscoveryAgent",
  version: SOFTWARE_ASSET_DISCOVERY_AGENT_VERSION,
  mutatesProductPages: false,
};

export function productReportRelPath(productSlug: string): string {
  return `docs/content-assets/software/${productSlug}-asset-opportunities.md`;
}

export function writeSoftwareProductAssetReport(
  audit: SoftwareProductAssetAudit,
): string {
  fs.mkdirSync(DOCS_SOFTWARE_DIR, { recursive: true });
  const full = path.join(
    DOCS_SOFTWARE_DIR,
    `${audit.productSlug}-asset-opportunities.md`,
  );
  fs.writeFileSync(full, formatSoftwareProductAssetMarkdown(audit), "utf8");
  return full;
}

export function writeSoftwareAssetMasterReport(
  report: SoftwareAssetMasterReport,
): string {
  fs.mkdirSync(path.dirname(MASTER_REPORT_PATH), { recursive: true });
  fs.writeFileSync(
    MASTER_REPORT_PATH,
    formatSoftwareAssetMasterMarkdown(report),
    "utf8",
  );
  return MASTER_REPORT_PATH;
}

function nextActionForAudit(audit: SoftwareProductAssetAudit): string {
  if (audit.summary.addNow > 0) {
    const first = audit.recommendations.find(
      (r) => r.recommendationLevel === "add-now",
    );
    return first
      ? `Search/add: ${first.title}`
      : `Pursue ${audit.summary.addNow} ADD NOW opportunities`;
  }
  if (audit.summary.staleCount > 0) {
    return `Refresh ${audit.summary.staleCount} stale media item(s)`;
  }
  if (audit.summary.strongOpportunity > 0) {
    return `Review ${audit.summary.strongOpportunity} strong opportunity search task(s)`;
  }
  if (audit.summary.originalVisualCount > 0) {
    return "Create original SoftwareGlimpse teaching visual(s)";
  }
  if (audit.coverageRating === "excellent" || audit.coverageRating === "strong") {
    return "Maintain — reuse existing ResearchMedia; spot-check freshness";
  }
  return "Improve official media coverage via vendor sources";
}

export function buildMasterReport(
  audits: SoftwareProductAssetAudit[],
  generatedAt: string,
): SoftwareAssetMasterReport {
  const rows = audits.map((audit) => {
    const screenshotOpps = audit.recommendations.filter(
      (r) =>
        r.assetType === "official-screenshot" &&
        r.recommendationLevel !== "reuse-existing",
    ).length;
    const tourOpps = audit.recommendations.filter(
      (r) =>
        (r.assetType === "official-product-video" ||
          r.assetType === "official-product-tour") &&
        (r.recommendationLevel === "add-now" ||
          r.recommendationLevel === "strong-opportunity"),
    ).length;
    const implMedia = audit.recommendations.filter(
      (r) =>
        r.placement?.sectionId === "implementation" &&
        r.recommendationLevel !== "do-not-use",
    ).length;
    const industryMedia = audit.recommendations.filter(
      (r) => r.placement?.sectionId === "industry",
    ).length;

    return {
      productSlug: audit.productSlug,
      productName: audit.productName,
      coverageRating: audit.coverageRating,
      officialVideosFound: audit.currentOfficialVideoCount,
      screenshotOpportunities: screenshotOpps,
      productTourOpportunities: tourOpps,
      implementationMedia: implMedia,
      industryMedia,
      priorityOpportunities:
        audit.summary.addNow + audit.summary.strongOpportunity,
      staleAssets: audit.summary.staleCount,
      recommendedNextAction: nextActionForAudit(audit),
      reportPath: productReportRelPath(audit.productSlug),
    };
  });

  // Sort weakest coverage / highest priority first
  const rank: Record<string, number> = {
    "very-weak": 0,
    weak: 1,
    adequate: 2,
    strong: 3,
    excellent: 4,
  };
  rows.sort((a, b) => {
    const pr =
      b.priorityOpportunities - a.priorityOpportunities ||
      (rank[a.coverageRating] ?? 9) - (rank[b.coverageRating] ?? 9);
    return pr;
  });

  return SoftwareAssetMasterReportSchema.parse({
    agentId: SOFTWARE_ASSET_DISCOVERY_AGENT_ID,
    agentVersion: SOFTWARE_ASSET_DISCOVERY_AGENT_VERSION,
    generatedAt,
    productsAudited: audits.length,
    rows,
    totals: {
      addNow: audits.reduce((s, a) => s + a.summary.addNow, 0),
      strongOpportunity: audits.reduce(
        (s, a) => s + a.summary.strongOpportunity,
        0,
      ),
      reuseExisting: audits.reduce((s, a) => s + a.summary.reuseExisting, 0),
      staleAssets: audits.reduce((s, a) => s + a.summary.staleCount, 0),
      originalVisualOpportunities: audits.reduce(
        (s, a) => s + a.summary.originalVisualCount,
        0,
      ),
      officialVideosCatalogued: audits.reduce(
        (s, a) => s + a.currentOfficialVideoCount,
        0,
      ),
    },
  });
}

export type RunSoftwareAssetDiscoveryAgentOptions = {
  /** Limit to one product slug. */
  productSlug?: string;
  /** Include unpublished products. Default: public only. */
  includeUnpublished?: boolean;
  /** Write docs/content-assets reports. */
  writeDocs?: boolean;
  generatedAt?: string;
  /** Cap number of products (smoke / intelligence limits). */
  limit?: number;
};

export type SoftwareAssetDiscoveryAgentResult = {
  agent: SoftwareAssetDiscoveryAgentMeta;
  audits: SoftwareProductAssetAudit[];
  master: SoftwareAssetMasterReport;
  writtenPaths: string[];
};

/**
 * Run SoftwareAssetDiscoveryAgent across software/product pages.
 * Never mutates product pages or ResearchMedia enrichment.
 */
export function runSoftwareAssetDiscoveryAgent(
  options: RunSoftwareAssetDiscoveryAgentOptions = {},
): SoftwareAssetDiscoveryAgentResult {
  const generatedAt = options.generatedAt ?? new Date().toISOString();
  const now = new Date(generatedAt);

  let products = getAllSoftwareUnfiltered();
  if (options.productSlug) {
    products = products.filter((p) => p.slug === options.productSlug);
  } else if (!options.includeUnpublished) {
    products = products.filter((p) => isPubliclyAvailable(p.metadata, now));
  }
  if (options.limit && options.limit > 0) {
    products = products.slice(0, options.limit);
  }

  const audits: SoftwareProductAssetAudit[] = [];
  const writtenPaths: string[] = [];

  for (const software of products) {
    const enrichment = loadEnrichment(software.slug);
    const sources = loadManualSources(software.slug);
    const audit = auditSoftwareProductAssets({
      software: {
        ...software,
        sources: sources.length ? sources : software.sources,
      },
      enrichment,
      sources,
      generatedAt,
    });
    audits.push(audit);
    if (options.writeDocs) {
      writtenPaths.push(writeSoftwareProductAssetReport(audit));
    }
  }

  const master = buildMasterReport(audits, generatedAt);
  if (options.writeDocs) {
    writtenPaths.push(writeSoftwareAssetMasterReport(master));
  }

  return {
    agent: SOFTWARE_ASSET_DISCOVERY_AGENT,
    audits,
    master,
    writtenPaths,
  };
}
