import fs from "node:fs";
import path from "node:path";
import {
  FLAGSHIP_PRODUCT_SLUGS,
} from "@/services/asset-discovery/prioritization-agent/constants";
import { runSoftwareAssetDiscoveryAgent, buildMasterReport, writeSoftwareAssetMasterReport } from "@/services/asset-discovery/software-agent";
import { runGuideAssetDiscoveryAgent } from "@/services/asset-discovery/guide-agent";
import { runAssetOpportunityPrioritizationAgent } from "@/services/asset-discovery/prioritization-agent";
import { buildProductMediaHealthReport } from "@/services/product-media/media-health-report";
import { parseVideoSourceUrl } from "@/services/product-media";
import {
  diffOpportunitySnapshots,
  loadPreviousOpportunitySnapshot,
  summarizeAssetChanges,
  writeOpportunitySnapshot,
  type AssetIntelligenceSnapshot,
  type AssetOpportunitySnapshotItem,
} from "./diff";
import { inspectAssetIntegrity } from "./integrity";
import {
  inventoryGuides,
  inventoryResearchMedia,
  inventorySoftwarePages,
} from "./inventory";
import { formatAssetIntelligenceMarkdown } from "./master-report";
import {
  isKnownInMemory,
  loadSearchMemory,
  rememberAsset,
  saveSearchMemory,
} from "./search-memory";
import {
  kindFromBatch,
  stableAssetOpportunityId,
} from "./stable-ids";

export const CONTENT_ASSET_INTELLIGENCE_ORCHESTRATOR = {
  id: "content-asset-intelligence-orchestrator",
  label: "ContentAssetIntelligenceOrchestrator",
  version: "1.0.0",
  mutatesContent: false as const,
} as const;

export type AssetIntelligenceMode = "LIGHT" | "FULL" | "DEEP";

export type ContentAssetIntelligenceOptions = {
  scope?: "crm" | "software" | "guides";
  mode?: AssetIntelligenceMode;
  write?: boolean;
  archive?: boolean;
  persistSnapshot?: boolean;
  persistSearchMemory?: boolean;
  includeUnpublished?: boolean;
  generatedAt?: string;
  /** Test limits */
  softwareLimit?: number;
  guideLimit?: number;
};

const ASSETS_DIR = path.join(process.cwd(), "docs", "content-assets");
const ARCHIVE_DIR = path.join(ASSETS_DIR, "archive");
const LATEST_PATH = path.join(ASSETS_DIR, "ASSET-INTELLIGENCE-LATEST.md");

/**
 * ContentAssetIntelligenceOrchestrator
 *
 * Periodically evaluate whether Software / Guide content could be improved
 * with better official media. NEVER auto-edits content.
 */
export function runContentAssetIntelligenceOrchestrator(
  opts: ContentAssetIntelligenceOptions = {},
): {
  agent: typeof CONTENT_ASSET_INTELLIGENCE_ORCHESTRATOR;
  generatedAt: string;
  mode: AssetIntelligenceMode;
  scope: string;
  paths: {
    intelligenceLatest?: string;
    archive?: string;
    softwareOpportunities?: string;
    guideOpportunities?: string;
    enrichmentBacklog?: string;
    snapshot?: string;
    searchMemory?: string;
  };
  summary: {
    softwarePages: number;
    guides: number;
    researchMedia: number;
    backlogA0: number;
    backlogA1: number;
    newOfficial: number;
    changeSummary: Record<string, number>;
    integrityCritical: number;
    exitHint: "ok" | "integrity-critical";
  };
  markdown: string;
} {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const mode: AssetIntelligenceMode = opts.mode ?? "FULL";
  const scope = opts.scope ?? "crm";
  const write = opts.write !== false;
  const agentsRun: string[] = [];

  // 1–2. Inventory
  const softwarePages = inventorySoftwarePages({
    includeUnpublished: opts.includeUnpublished,
  });
  const guides = inventoryGuides({
    includeUnpublished: opts.includeUnpublished,
  });

  // 3. ResearchMedia inventory
  const mediaInventory = inventoryResearchMedia();

  // 4–11. Discovery + prioritize (mode-dependent)
  let softwareMaster:
    | ReturnType<typeof runSoftwareAssetDiscoveryAgent>["master"]
    | undefined;
  let guideMaster:
    | ReturnType<typeof runGuideAssetDiscoveryAgent>["master"]
    | undefined;
  let softwareAudits:
    | ReturnType<typeof runSoftwareAssetDiscoveryAgent>["audits"]
    | undefined;
  let guideAudits:
    | ReturnType<typeof runGuideAssetDiscoveryAgent>["audits"]
    | undefined;
  let backlog:
    | ReturnType<typeof runAssetOpportunityPrioritizationAgent>["report"]
    | undefined;

  const paths: {
    intelligenceLatest?: string;
    archive?: string;
    softwareOpportunities?: string;
    guideOpportunities?: string;
    enrichmentBacklog?: string;
    snapshot?: string;
    searchMemory?: string;
  } = {};

  const runSoftware = scope === "crm" || scope === "software";
  const runGuides = scope === "crm" || scope === "guides";

  if (mode !== "LIGHT") {
    if (runSoftware) {
      agentsRun.push("SoftwareAssetDiscoveryAgent");
      if (mode === "DEEP") {
        softwareAudits = [];
        for (const slug of FLAGSHIP_PRODUCT_SLUGS) {
          const soft = runSoftwareAssetDiscoveryAgent({
            productSlug: slug,
            includeUnpublished: opts.includeUnpublished,
            writeDocs: write && (scope === "crm" || scope === "software"),
            generatedAt,
          });
          softwareAudits.push(...soft.audits);
        }
        softwareMaster = buildMasterReport(softwareAudits, generatedAt);
        if (write && (scope === "crm" || scope === "software")) {
          paths.softwareOpportunities =
            writeSoftwareAssetMasterReport(softwareMaster);
        }
      } else {
        const soft = runSoftwareAssetDiscoveryAgent({
          includeUnpublished: opts.includeUnpublished,
          writeDocs: write && (scope === "crm" || scope === "software"),
          generatedAt,
          limit: opts.softwareLimit,
        });
        softwareAudits = soft.audits;
        softwareMaster = soft.master;
        if (soft.writtenPaths.length) {
          paths.softwareOpportunities = soft.writtenPaths.find((p) =>
            p.endsWith("SOFTWARE-ASSET-OPPORTUNITIES.md"),
          );
        }
      }
    }

    if (runGuides) {
      agentsRun.push("GuideAssetDiscoveryAgent");
      const guideLimit =
        mode === "DEEP"
          ? opts.guideLimit ?? 40
          : opts.guideLimit;
      const g = runGuideAssetDiscoveryAgent({
        includeUnpublished: opts.includeUnpublished,
        writeDocs: write && (scope === "crm" || scope === "guides"),
        generatedAt,
        limit: guideLimit,
      });
      guideAudits = g.audits;
      guideMaster = g.master;
      if (g.writtenPaths.length) {
        paths.guideOpportunities = g.writtenPaths.find((p) =>
          p.endsWith("GUIDE-ASSET-OPPORTUNITIES.md"),
        );
      }
    }

    if (runSoftware || runGuides) {
      agentsRun.push("AssetOpportunityPrioritizationAgent");
      const prio = runAssetOpportunityPrioritizationAgent({
        writeDocs: write && scope === "crm",
        generatedAt,
        softwareAudits: softwareAudits ?? [],
        guideAudits: guideAudits ?? [],
      });
      backlog = prio.report;
      paths.enrichmentBacklog = prio.writtenPath;
    }
  }

  // Always: light media health
  agentsRun.push("media-health");
  const mediaHealth = buildProductMediaHealthReport();

  // Search memory — seed from ResearchMedia + recommendation URLs with known ids
  let memory = loadSearchMemory();
  let newOfficialAssets: Array<{
    title: string;
    sourceUrl: string;
    product?: string;
  }> = [];

  for (const url of mediaInventory.sourceUrls) {
    const parsed = parseVideoSourceUrl(url);
    const r = rememberAsset(memory, {
      sourceUrl: url,
      provider: parsed?.provider,
      providerId: parsed?.videoId,
      at: generatedAt,
    });
    memory = r.memory;
  }

  if (softwareAudits) {
    for (const audit of softwareAudits) {
      for (const rec of audit.recommendations) {
        if (!rec.sourceUrl) continue;
        const parsed = parseVideoSourceUrl(rec.sourceUrl);
        const known = isKnownInMemory(memory, {
          sourceUrl: rec.sourceUrl,
          provider: parsed?.provider,
          providerId: parsed?.videoId ?? undefined,
        });
        const r = rememberAsset(memory, {
          sourceUrl: rec.sourceUrl,
          provider: parsed?.provider,
          providerId: parsed?.videoId,
          title: rec.title,
          productSlug: audit.productSlug,
          at: generatedAt,
        });
        memory = r.memory;
        if (r.isNew && !known && rec.officialSource) {
          newOfficialAssets.push({
            title: rec.title,
            sourceUrl: rec.sourceUrl,
            product: audit.productName,
          });
        }
      }
      for (const m of audit.currentMedia) {
        if (!m.sourceUrl) continue;
        const parsed = parseVideoSourceUrl(m.sourceUrl);
        const r = rememberAsset(memory, {
          sourceUrl: m.sourceUrl,
          provider: parsed?.provider,
          providerId: parsed?.videoId ?? m.mediaId,
          title: m.title,
          productSlug: audit.productSlug,
          at: generatedAt,
        });
        memory = r.memory;
      }
    }
  }

  if (opts.persistSearchMemory !== false && write) {
    paths.searchMemory = saveSearchMemory(memory);
  }

  // Build opportunity snapshot items from backlog (or light health gaps)
  const opportunityItems: AssetOpportunitySnapshotItem[] = [];

  if (backlog) {
    for (const item of backlog.items) {
      const kind = kindFromBatch(item.implementationBatch);
      const id = stableAssetOpportunityId({
        pageRoute: item.pageRoute,
        kind,
        assetTitle: item.asset,
        section: item.section,
      });
      const parsed = item.source.startsWith("http")
        ? parseVideoSourceUrl(item.source)
        : null;
      opportunityItems.push({
        id,
        pageRoute: item.pageRoute,
        page: item.page,
        kind,
        asset: item.asset,
        priority: item.priority,
        sourceUrl: item.source.startsWith("http") ? item.source : undefined,
        providerId: parsed?.videoId,
        statusHint: kind === "STALE" ? "stale" : undefined,
        relatedCqIds: item.relatedContentQualityIssue
          ? item.relatedContentQualityIssue
              .split(";")
              .map((s) => s.trim().split(" ")[0]!)
              .filter(Boolean)
          : undefined,
        mapNodeId: item.mapNodeId,
      });
    }
  } else {
    // LIGHT: opportunities from weak media-health coverage
    for (const row of mediaHealth.products) {
      if (!row.missingMajorMediaCoverage && row.unavailable === 0) continue;
      const route = `/software/${row.productSlug}/`;
      if (row.missingMajorMediaCoverage) {
        opportunityItems.push({
          id: stableAssetOpportunityId({
            pageRoute: route,
            kind: "VIDEO",
            assetTitle: "missing major official media coverage",
          }),
          pageRoute: route,
          page: row.productName,
          kind: "VIDEO",
          asset: "missing major official media coverage",
          priority: "A1",
        });
      }
      if (row.unavailable > 0) {
        opportunityItems.push({
          id: stableAssetOpportunityId({
            pageRoute: route,
            kind: "STALE",
            assetTitle: `${row.unavailable} unavailable media`,
          }),
          pageRoute: route,
          page: row.productName,
          kind: "STALE",
          asset: `${row.unavailable} unavailable media record(s)`,
          priority: "A0",
          statusHint: "stale",
        });
      }
    }
  }

  const previous = loadPreviousOpportunitySnapshot();
  const snapshot: AssetIntelligenceSnapshot = {
    generatedAt,
    mode,
    scope,
    opportunities: opportunityItems,
    knownProviderIds: mediaInventory.providerIds,
    knownSourceUrls: mediaInventory.sourceUrls,
    dismissedIds: previous?.dismissedIds ?? [],
  };
  const changes = diffOpportunitySnapshots(previous, snapshot);
  const changeSummary = summarizeAssetChanges(changes);

  if (opts.persistSnapshot !== false && write) {
    paths.snapshot = writeOpportunitySnapshot(snapshot);
  }

  // Integrity
  const integrity = inspectAssetIntegrity();

  // Report sections
  const reusedAssets =
    backlog?.items
      .filter((i) => i.implementationBatch === "existing-research-media-to-reuse")
      .slice(0, 25)
      .map((i) => ({ title: i.asset, page: i.page })) ?? [];

  const brokenStale: Array<{ title: string; detail: string; product?: string }> =
    [];
  for (const row of mediaHealth.products) {
    for (const r of row.mediaResults) {
      if (
        r.publicVisibility === "hidden" ||
        r.flags.includes("source-unavailable") ||
        r.flags.includes("stale-ui")
      ) {
        brokenStale.push({
          title: r.mediaId,
          detail: r.notes.join("; ") || r.flags.join(", "),
          product: row.productName,
        });
      }
    }
  }
  if (softwareAudits) {
    for (const a of softwareAudits) {
      for (const s of a.staleAssets) {
        brokenStale.push({
          title: s.title,
          detail: s.detail,
          product: a.productName,
        });
      }
    }
  }

  const weakSoftware =
    softwareMaster?.rows
      .filter(
        (r) =>
          r.coverageRating === "weak" ||
          r.coverageRating === "very-weak" ||
          r.coverageRating === "adequate",
      )
      .map((r) => ({
        name: r.productName,
        rating: r.coverageRating,
        route: `/software/${r.productSlug}/`,
      })) ??
    mediaHealth.products
      .filter((p) => p.missingMajorMediaCoverage)
      .map((p) => ({
        name: p.productName,
        rating: "weak",
        route: `/software/${p.productSlug}/`,
      }));

  const weakGuides =
    guideMaster?.rows
      .filter(
        (r) =>
          r.visualQuality === "weak" || r.visualQuality === "very-weak",
      )
      .map((r) => ({
        title: r.guideTitle,
        rating: r.visualQuality,
        route: `/guides/${r.guideSlug}/`,
      })) ?? [];

  const pickBatch = (batch: string) =>
    (backlog?.items ?? [])
      .filter((i) => i.implementationBatch === batch)
      .slice(0, 15)
      .map((i) => ({
        title: i.asset,
        page: i.page,
        priority: i.priority,
      }));

  const usageReview = (backlog?.items ?? [])
    .filter((i) => /usage review|confirm embed/i.test(i.usageConstraints))
    .slice(0, 20)
    .map((i) => ({
      title: i.asset,
      page: i.page,
      note: i.usageConstraints,
    }));

  const systemic =
    backlog?.systemicOpportunities.map((s) => ({
      id: s.id,
      title: s.title,
      priority: s.priority,
      count: s.count,
    })) ?? [];

  const topActions = (backlog?.topActions ?? opportunityItems.slice(0, 30)).map(
    (a, idx) => {
      if ("recommendation" in a) {
        const id = stableAssetOpportunityId({
          pageRoute: a.pageRoute,
          kind: kindFromBatch(a.implementationBatch),
          assetTitle: a.asset,
          section: a.section,
        });
        return {
          id,
          priority: a.priority,
          page: a.page,
          asset: a.asset,
          recommendation: a.recommendation,
          relatedCq: a.relatedContentQualityIssue,
        };
      }
      const item = opportunityItems[idx]!;
      return {
        id: item.id,
        priority: item.priority ?? "A2",
        page: item.page,
        asset: item.asset,
        recommendation: "Review media coverage gap",
      };
    },
  );

  // Cap newly discovered list
  newOfficialAssets = newOfficialAssets.slice(0, 30);

  const markdown = formatAssetIntelligenceMarkdown({
    generatedAt,
    mode,
    scope,
    previousGeneratedAt: previous?.generatedAt,
    softwareInventoryCount: softwarePages.length,
    guideInventoryCount: guides.length,
    mediaInventory,
    mediaHealth,
    softwareMaster,
    guideMaster,
    backlog,
    changes,
    changeSummary,
    integrity,
    newOfficialAssets,
    reusedAssets,
    brokenStale: brokenStale.slice(0, 40),
    weakSoftware,
    weakGuides,
    bestVideos: pickBatch("official-videos-to-embed"),
    bestScreenshots: pickBatch("screenshots-to-add"),
    bestDiagrams: [
      ...pickBatch("original-diagrams-to-create"),
      ...pickBatch("original-workflow-visuals-to-create"),
    ].slice(0, 15),
    originalVisuals: (backlog?.items ?? [])
      .filter((i) => i.isOriginalVisual)
      .slice(0, 15)
      .map((i) => ({
        title: i.asset,
        page: i.page,
        priority: i.priority,
      })),
    usageReview,
    systemic,
    topActions,
    searchMemorySize: memory.entries.length,
    agentsRun,
  });

  if (write) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
    fs.writeFileSync(LATEST_PATH, markdown, "utf8");
    paths.intelligenceLatest = LATEST_PATH;

    if (opts.archive !== false) {
      fs.mkdirSync(ARCHIVE_DIR, { recursive: true });
      const day = generatedAt.slice(0, 10);
      const archivePath = path.join(
        ARCHIVE_DIR,
        `${day}-asset-intelligence.md`,
      );
      fs.writeFileSync(archivePath, markdown, "utf8");
      paths.archive = archivePath;
    }
  }

  const integrityCritical = integrity.filter(
    (i) => i.severity === "critical",
  ).length;

  return {
    agent: CONTENT_ASSET_INTELLIGENCE_ORCHESTRATOR,
    generatedAt,
    mode,
    scope,
    paths,
    summary: {
      softwarePages: softwarePages.length,
      guides: guides.length,
      researchMedia: mediaInventory.mediaCount,
      backlogA0: backlog?.summary.a0 ?? 0,
      backlogA1: backlog?.summary.a1 ?? 0,
      newOfficial: newOfficialAssets.length,
      changeSummary,
      integrityCritical,
      exitHint: integrityCritical > 0 ? "integrity-critical" : "ok",
    },
    markdown,
  };
}
