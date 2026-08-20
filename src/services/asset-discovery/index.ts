import type { PageAssetSnapshot } from "@/domain/schemas/asset-discovery";
import { PageAssetSnapshotSchema } from "@/domain/schemas/asset-discovery";
import { runAssetDiscovery, runAssetNeedsAnalysis } from "./audit";
import { bridgeDiscoveredAssetToResearchMedia } from "./bridge-research-media";
import {
  FIXTURE_PAGE_SNAPSHOTS,
  FIXTURE_SEEDED_CANDIDATES,
  getFixturePageSnapshot,
  getFixtureSeededCandidates,
  listFixturePageIds,
} from "./fixtures";
import {
  loadGuidePageSnapshot,
  loadSoftwarePageSnapshot,
  snapshotFromGuide,
  snapshotFromSoftware,
} from "./loaders";
import { discoverAssetOpportunities } from "./needs";
import { scoreAssetQuality } from "./quality";
import {
  formatAssetDiscoveryMarkdown,
  formatAssetDiscoveryText,
} from "./report";
import {
  createSeededSearchProvider,
  noopSearchProvider,
  type AssetSearchProvider,
  type SeededCandidate,
} from "./search";
import { buildSearchTasks } from "./search-tasks";
import {
  getAssetDiscoveryReportDir,
  writeAssetDiscoveryMarkdownReport,
} from "./store";
import { classifyUsageRights } from "./usage";
import {
  allOfficialDomainsForProduct,
  getVendorOfficialSourceEntry,
  listRegisteredVendorSlugs,
  VENDOR_OFFICIAL_SOURCE_REGISTRY,
} from "./vendor-registry";
import { verifyOfficialSource } from "./verify";

export {
  runAssetDiscovery,
  runAssetNeedsAnalysis,
  bridgeDiscoveredAssetToResearchMedia,
  FIXTURE_PAGE_SNAPSHOTS,
  FIXTURE_SEEDED_CANDIDATES,
  getFixturePageSnapshot,
  getFixtureSeededCandidates,
  listFixturePageIds,
  loadGuidePageSnapshot,
  loadSoftwarePageSnapshot,
  snapshotFromGuide,
  snapshotFromSoftware,
  discoverAssetOpportunities,
  scoreAssetQuality,
  formatAssetDiscoveryMarkdown,
  formatAssetDiscoveryText,
  createSeededSearchProvider,
  noopSearchProvider,
  buildSearchTasks,
  getAssetDiscoveryReportDir,
  writeAssetDiscoveryMarkdownReport,
  classifyUsageRights,
  allOfficialDomainsForProduct,
  getVendorOfficialSourceEntry,
  listRegisteredVendorSlugs,
  VENDOR_OFFICIAL_SOURCE_REGISTRY,
  verifyOfficialSource,
};

export type { AssetSearchProvider, SeededCandidate };

export {
  SOFTWARE_ASSET_DISCOVERY_AGENT,
  runSoftwareAssetDiscoveryAgent,
  auditSoftwareProductAssets,
  formatSoftwareProductAssetMarkdown,
  formatSoftwareAssetMasterMarkdown,
} from "./software-agent";

export {
  GUIDE_ASSET_DISCOVERY_AGENT,
  runGuideAssetDiscoveryAgent,
  auditGuideAssets,
  formatGuideAssetMarkdown,
  formatGuideAssetMasterMarkdown,
} from "./guide-agent";

export {
  ASSET_OPPORTUNITY_PRIORITIZATION_AGENT,
  runAssetOpportunityPrioritizationAgent,
  writeAssetEnrichmentBacklog,
  prioritizeAssetOpportunities,
  formatAssetEnrichmentBacklogMarkdown,
} from "./prioritization-agent";

export {
  registerApprovedAssetCandidate,
  verifyCandidateSource,
  reviewCandidateRelevance,
  reviewCandidateUsage,
  mapCandidateEntities,
  editorialApproveCandidate,
  importApprovedAsset,
  activateImportedAsset,
  inspectApprovedAssetCandidate,
  addPlacementRecommendation,
  saveApprovedAssetCandidate,
  loadApprovedAssetCandidate,
  listApprovedAssetCandidates,
  listPlacementRecommendations,
} from "./approval";

export {
  CONTENT_ASSET_INTELLIGENCE_ORCHESTRATOR,
  runContentAssetIntelligenceOrchestrator,
} from "./intelligence";

export function parsePageAssetSnapshot(input: unknown): PageAssetSnapshot {
  return PageAssetSnapshotSchema.parse(input);
}

export async function auditAndReport(
  snapshot: PageAssetSnapshot,
  opts?: {
    writeReport?: boolean;
    needsOnly?: boolean;
    seededCandidates?: SeededCandidate[];
    provider?: AssetSearchProvider;
    generatedAt?: string;
  },
): Promise<{
  report: Awaited<ReturnType<typeof runAssetDiscovery>>["report"];
  reportPath?: string;
}> {
  const { report } = await runAssetDiscovery({
    snapshot,
    needsOnly: opts?.needsOnly,
    seededCandidates: opts?.seededCandidates,
    provider: opts?.provider,
    generatedAt: opts?.generatedAt,
  });

  let reportPath: string | undefined;
  if (opts?.writeReport === true) {
    const slug = snapshot.pageId.replace(/[^a-zA-Z0-9._-]/g, "-");
    const date = report.generatedAt.slice(0, 10);
    reportPath = writeAssetDiscoveryMarkdownReport(
      `${date}-${slug}`,
      formatAssetDiscoveryMarkdown(report),
    );
  }
  return { report, reportPath };
}
