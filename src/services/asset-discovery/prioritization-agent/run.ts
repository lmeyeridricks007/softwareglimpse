import fs from "node:fs";
import path from "node:path";
import type { AssetEnrichmentBacklogReport } from "@/domain/schemas/asset-discovery";
import {
  ASSET_OPPORTUNITY_PRIORITIZATION_AGENT_ID,
  ASSET_OPPORTUNITY_PRIORITIZATION_AGENT_VERSION,
} from "@/domain/schemas/asset-discovery";
import { loadContentMapNodes } from "@/services/content-quality/improvement/content-map";
import { runGuideAssetDiscoveryAgent } from "@/services/asset-discovery/guide-agent";
import { runSoftwareAssetDiscoveryAgent } from "@/services/asset-discovery/software-agent";
import { loadVisualCqIssuesByRoute } from "./cq-links";
import { prioritizeAssetOpportunities } from "./prioritize";
import { formatAssetEnrichmentBacklogMarkdown } from "./report";

const BACKLOG_PATH = path.join(
  process.cwd(),
  "docs",
  "content-assets",
  "ASSET-ENRICHMENT-BACKLOG.md",
);

export type AssetOpportunityPrioritizationAgentMeta = {
  id: typeof ASSET_OPPORTUNITY_PRIORITIZATION_AGENT_ID;
  name: "AssetOpportunityPrioritizationAgent";
  version: typeof ASSET_OPPORTUNITY_PRIORITIZATION_AGENT_VERSION;
  /** Never implements or publishes assets. */
  implementsAssets: false;
};

export const ASSET_OPPORTUNITY_PRIORITIZATION_AGENT: AssetOpportunityPrioritizationAgentMeta =
  {
    id: ASSET_OPPORTUNITY_PRIORITIZATION_AGENT_ID,
    name: "AssetOpportunityPrioritizationAgent",
    version: ASSET_OPPORTUNITY_PRIORITIZATION_AGENT_VERSION,
    implementsAssets: false,
  };

export type RunAssetOpportunityPrioritizationOptions = {
  writeDocs?: boolean;
  generatedAt?: string;
  /** Limit software audits (tests). */
  softwareLimit?: number;
  /** Limit guide audits (tests). */
  guideLimit?: number;
  includeUnpublished?: boolean;
  /** Skip re-audit when caller already has SoftwareAssetDiscoveryAgent results. */
  softwareAudits?: import("@/domain/schemas/asset-discovery").SoftwareProductAssetAudit[];
  /** Skip re-audit when caller already has GuideAssetDiscoveryAgent results. */
  guideAudits?: import("@/domain/schemas/asset-discovery").GuideAssetAudit[];
};

export type AssetOpportunityPrioritizationResult = {
  agent: AssetOpportunityPrioritizationAgentMeta;
  report: AssetEnrichmentBacklogReport;
  writtenPath?: string;
};

export function writeAssetEnrichmentBacklog(
  report: AssetEnrichmentBacklogReport,
): string {
  fs.mkdirSync(path.dirname(BACKLOG_PATH), { recursive: true });
  fs.writeFileSync(
    BACKLOG_PATH,
    formatAssetEnrichmentBacklogMarkdown(report),
    "utf8",
  );
  return BACKLOG_PATH;
}

/**
 * AssetOpportunityPrioritizationAgent
 *
 * Consumes Software + Guide asset opportunity corpora (+ CQ backlog + content map)
 * and produces a prioritized enrichment backlog. Does **not** implement assets.
 */
export function runAssetOpportunityPrioritizationAgent(
  options: RunAssetOpportunityPrioritizationOptions = {},
): AssetOpportunityPrioritizationResult {
  const generatedAt = options.generatedAt ?? new Date().toISOString();

  let softwareAudits = options.softwareAudits;
  if (!softwareAudits) {
    const software = runSoftwareAssetDiscoveryAgent({
      includeUnpublished: options.includeUnpublished,
      writeDocs: false,
      generatedAt,
    });
    softwareAudits = software.audits;
  }
  if (options.softwareLimit && options.softwareLimit > 0) {
    softwareAudits = softwareAudits.slice(0, options.softwareLimit);
  }

  let guideAudits = options.guideAudits;
  if (!guideAudits) {
    const guides = runGuideAssetDiscoveryAgent({
      includeUnpublished: options.includeUnpublished,
      writeDocs: false,
      generatedAt,
      limit: options.guideLimit,
    });
    guideAudits = guides.audits;
  } else if (options.guideLimit && options.guideLimit > 0) {
    guideAudits = guideAudits.slice(0, options.guideLimit);
  }

  const mapByRoute = loadContentMapNodes();
  const cqByRoute = loadVisualCqIssuesByRoute();

  const report = prioritizeAssetOpportunities({
    softwareAudits,
    guideAudits,
    mapByRoute,
    cqByRoute,
    generatedAt,
    inputs: [
      "docs/content-assets/SOFTWARE-ASSET-OPPORTUNITIES.md (via SoftwareAssetDiscoveryAgent)",
      "docs/content-assets/GUIDE-ASSET-OPPORTUNITIES.md (via GuideAssetDiscoveryAgent)",
      "docs/content-quality/CONTENT-IMPROVEMENT-BACKLOG.md",
      "docs/content-ecosystem/04-crm-master-content-map.md",
    ],
  });

  let writtenPath: string | undefined;
  if (options.writeDocs) {
    writtenPath = writeAssetEnrichmentBacklog(report);
  }

  return {
    agent: ASSET_OPPORTUNITY_PRIORITIZATION_AGENT,
    report,
    writtenPath,
  };
}
