import type {
  AssetDiscoveryReport,
  AssetOpportunity,
  DiscoveredAsset,
  PageAssetSnapshot,
} from "@/domain/schemas/asset-discovery";
import {
  ASSET_DISCOVERY_VERSION,
  AssetDiscoveryReportSchema,
  PageAssetSnapshotSchema,
} from "@/domain/schemas/asset-discovery";
import { discoverAssetOpportunities } from "./needs";
import { buildSearchTasks } from "./search-tasks";
import {
  materializeDiscoveredAssets,
  type MaterializeCandidatesOptions,
} from "./materialize";
import type { AssetSearchProvider, SeededCandidate } from "./search";

export type RunAssetDiscoveryOptions = {
  snapshot: PageAssetSnapshot;
  provider?: AssetSearchProvider;
  seededCandidates?: SeededCandidate[];
  /** Skip provider materialization (needs + search tasks only). */
  needsOnly?: boolean;
  generatedAt?: string;
};

export type AssetDiscoveryRunResult = {
  report: AssetDiscoveryReport;
  opportunities: AssetOpportunity[];
  discoveredAssets: DiscoveredAsset[];
};

function summarize(
  opportunities: AssetOpportunity[],
  searchTaskCount: number,
  discoveredAssets: DiscoveredAsset[],
): AssetDiscoveryReport["summary"] {
  return {
    opportunityCount: opportunities.length,
    openOpportunityCount: opportunities.filter((o) => o.status === "open")
      .length,
    satisfiedExistingCount: opportunities.filter(
      (o) => o.status === "satisfied-existing",
    ).length,
    searchTaskCount,
    discoveredAssetCount: discoveredAssets.length,
    officialVerifiedCount: discoveredAssets.filter((a) => a.officialSource)
      .length,
    embedRecommendedCount: discoveredAssets.filter(
      (a) => a.recommendation === "embed",
    ).length,
    linkRecommendedCount: discoveredAssets.filter(
      (a) =>
        a.recommendation === "link" ||
        a.recommendation === "cite" ||
        a.recommendation === "use-as-evidence",
    ).length,
    createOriginalCount: discoveredAssets.filter(
      (a) => a.recommendation === "create-original-visual-based-on-source",
    ).length,
  };
}

function buildReport(input: {
  snapshot: PageAssetSnapshot;
  opportunities: AssetOpportunity[];
  searchTaskCount: number;
  discoveredAssets: DiscoveredAsset[];
  searchTasks: ReturnType<typeof buildSearchTasks>;
  generatedAt: string;
  extraLimitations?: string[];
}): AssetDiscoveryReport {
  return AssetDiscoveryReportSchema.parse({
    id: `asset-audit-${input.snapshot.pageId.replace(/[^a-zA-Z0-9._-]/g, "-")}`,
    pageId: input.snapshot.pageId,
    route: input.snapshot.route,
    pageType: input.snapshot.pageType,
    title: input.snapshot.title,
    generatedAt: input.generatedAt,
    frameworkVersion: ASSET_DISCOVERY_VERSION,
    opportunities: input.opportunities,
    searchTasks: input.searchTasks,
    discoveredAssets: input.discoveredAssets,
    summary: summarize(
      input.opportunities,
      input.searchTaskCount,
      input.discoveredAssets,
    ),
    limitations: [
      "Recommendations only — no auto-embed, download, publish, or enrichment mutation",
      "officialSource requires domain/channel verification — never title/snippet alone",
      "Affiliate URLs are never treated as evidence URLs",
      "Media presence/absence must not influence software rankings",
      "When no search API/candidates are supplied, search tasks are listed without invented URLs",
      ...(input.extraLimitations ?? []),
    ],
    notes: input.snapshot.notes,
  });
}

/**
 * Full asset discovery pipeline:
 * 1) parse page needs  2) search tasks  3) optional candidate materialization
 * Never publishes, downloads, or mutates production content.
 */
export async function runAssetDiscovery(
  options: RunAssetDiscoveryOptions,
): Promise<AssetDiscoveryRunResult> {
  const snapshot = PageAssetSnapshotSchema.parse(options.snapshot);
  const opportunities = discoverAssetOpportunities(snapshot);
  const searchTasks = buildSearchTasks(opportunities);
  const generatedAt = options.generatedAt ?? new Date().toISOString();

  let discoveredAssets: DiscoveredAsset[] = [];
  if (!options.needsOnly) {
    const materializeOpts: MaterializeCandidatesOptions = {
      opportunities,
      searchTasks,
      provider: options.provider,
      seededCandidates: options.seededCandidates,
      verifiedAt: generatedAt,
    };
    discoveredAssets = await materializeDiscoveredAssets(materializeOpts);

    const hitOppIds = new Set(
      discoveredAssets
        .map((a) => a.opportunityId)
        .filter((id): id is string => Boolean(id)),
    );
    for (const opp of opportunities) {
      if (opp.status === "open" && hitOppIds.has(opp.id)) {
        opp.status = "candidate-found";
      }
    }
  }

  const report = buildReport({
    snapshot,
    opportunities,
    searchTaskCount: searchTasks.length,
    discoveredAssets,
    searchTasks,
    generatedAt,
  });

  return { report, opportunities, discoveredAssets };
}

/** Needs + search tasks only (no candidate materialization). */
export function runAssetNeedsAnalysis(
  snapshot: PageAssetSnapshot,
  opts?: { generatedAt?: string },
): AssetDiscoveryRunResult {
  const snap = PageAssetSnapshotSchema.parse(snapshot);
  const opportunities = discoverAssetOpportunities(snap);
  const searchTasks = buildSearchTasks(opportunities);
  const generatedAt = opts?.generatedAt ?? new Date().toISOString();
  const report = buildReport({
    snapshot: snap,
    opportunities,
    searchTaskCount: searchTasks.length,
    discoveredAssets: [],
    searchTasks,
    generatedAt,
    extraLimitations: [
      "Needs-only run — candidate URLs not materialized",
    ],
  });
  return { report, opportunities, discoveredAssets: [] };
}
