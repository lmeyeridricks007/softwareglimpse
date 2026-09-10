#!/usr/bin/env npx tsx
/**
 * FR-009 — improve meaningful internal authority flow.
 *
 *   npm run seo:authority-flow
 *   npm run seo:authority-flow -- --dry-run
 *   npm run seo:authority-flow -- --limit 60 --apply
 *
 * Prioritizes INDEXABLE_READY → Lane A IMPROVE → recently enriched →
 * structural orphans (best/alternatives/use-case). Adds 2–6 contextual
 * inbounds. Also injects journey next-steps from authority-hoarding hubs.
 * Does not chase zero orphans.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadContentLifecycleStoreFromDisk } from "@/services/seo/content-lifecycle/store-write";
import { analyzeKnowledgeGraph } from "@/services/seo/knowledge-graph/analyze";
import {
  clearAuthorityCaches,
  getOrphanReport,
  inboundStatsFromReport,
} from "@/services/seo/knowledge-graph/authority";
import { clearCrmOutboundEdgeCache } from "@/services/internal-linking/outbound-graph";
import { runImproveBatchLinking } from "@/services/seo/improve-linking";
import { upsertLinkInjections } from "@/services/seo/improve-linking/injection-store";
import {
  planAuthorityHoarderOutbounds,
  selectAuthorityFlowTargets,
} from "@/services/seo/improve-linking/authority-flow";
import { classifyEnrichmentLane } from "@/services/seo/enrichment-lanes";
import { loadGscOpportunitySignalsByPath } from "@/services/seo/gsc-opportunity/load-report";
import { loadExternalEnrichmentEvidence } from "@/services/seo/enrichment-lanes";
import { identityPath } from "@/seo/canonical";
import { clearLinkInjectionsCache } from "@/services/internal-linking/link-injections";

const ROOT = process.cwd();
const WAVE = `fr009-authority-flow-${new Date().toISOString().slice(0, 10)}`;

function argFlag(args: string[], name: string): boolean {
  return args.includes(name);
}

function argValue(args: string[], name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx >= 0 && args[idx + 1] && !args[idx + 1]!.startsWith("--")) {
    return args[idx + 1];
  }
  return undefined;
}

function laneAOrphanCount(
  improveInbound: Array<{ path: string; orphanStatus: string }>,
): number {
  const gsc = loadGscOpportunitySignalsByPath();
  const external = loadExternalEnrichmentEvidence();
  let n = 0;
  for (const row of improveInbound) {
    if (row.orphanStatus !== "orphan") continue;
    const signal = gsc.get(identityPath(row.path));
    const lane = classifyEnrichmentLane({
      gsc: {
        impressions: signal?.impressions ?? 0,
        clicks: signal?.clicks ?? 0,
        position: signal?.position ?? null,
        opportunityScore: signal?.opportunityScore ?? 0,
        hasDirectQuery: signal?.hasDirectQuery,
        knownBacklinks: external.backlinksByPath.get(identityPath(row.path)) ?? 0,
        realAiCitations: external.aiCitationsByPath.get(identityPath(row.path)) ?? 0,
      },
      strategic: {
        categoryImportance: 50,
        productPopularity: 12,
        commercialRelevance: 15,
        internalJourneyStrength: 12,
        competitorRelationship: false,
        importantBuyerQuestion: true,
      },
      qualityGap: 20,
    });
    if (lane.lane === "A") n += 1;
  }
  return n;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const apply = argFlag(args, "--apply") || !argFlag(args, "--dry-run");
  const dryRun = argFlag(args, "--dry-run") || !apply;
  const limit = Number(argValue(args, "--limit") ?? "150");

  loadContentLifecycleStoreFromDisk();
  console.log(
    `FR-009 authority-flow limit=${limit} mode=${dryRun ? "DRY-RUN" : "APPLY"}`,
  );

  const { targets, before, kg: kgBefore } = selectAuthorityFlowTargets({
    limit,
    cwd: ROOT,
    structuralCap: 20,
  });

  console.log(
    `Before: nodes=${before.nodes} edges=${before.edges} IMPROVE orphans(sample)=${before.improveOrphans}/${before.improvePages} LaneA orphans=${before.laneAOrphans} READY orphans=${before.readyOrphans} target orphans=${before.targetOrphans} target weak(<2)=${before.targetWeakInbound}`,
  );
  console.log(
    `Selected ${targets.length}:`,
    targets.reduce(
      (acc, t) => {
        acc[t.priority] = (acc[t.priority] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  );

  const hoarderEdges = planAuthorityHoarderOutbounds(kgBefore);
  console.log(`Authority-hoarder outbound candidates: ${hoarderEdges.length}`);

  let linkingReport = null;
  let hoarderApplied = 0;
  if (!dryRun) {
    if (hoarderEdges.length) {
      upsertLinkInjections(hoarderEdges);
      hoarderApplied = hoarderEdges.length;
      console.log(`Injected ${hoarderApplied} hub next-step edges`);
    }

    linkingReport = runImproveBatchLinking({
      batchId: WAVE,
      pages: targets,
      dryRun: false,
      write: true,
      light: false,
      skipGraphSnapshots: false,
      prioritizeByLane: true,
      minPerPage: 2,
      maxPerPage: 6,
    });
    console.log(
      `Linking: planned=${linkingReport.metrics.pagesPlanned} selectedEdges=${linkingReport.metrics.opportunitiesSelected} applied=${linkingReport.applied.length} skippedWeak=${linkingReport.metrics.skippedWeak}`,
    );
  } else {
    linkingReport = runImproveBatchLinking({
      batchId: `${WAVE}-dry`,
      pages: targets,
      dryRun: true,
      write: true,
      light: true,
      skipGraphSnapshots: true,
      prioritizeByLane: true,
      minPerPage: 2,
      maxPerPage: 6,
    });
  }

  console.log("Re-running knowledge graph…");
  clearLinkInjectionsCache();
  clearCrmOutboundEdgeCache();
  clearAuthorityCaches();
  const kgAfter = analyzeKnowledgeGraph({
    write: !dryRun,
    improveLimit: 80,
    lightQa: false,
  });

  // Target-set orphan measurement (what FR-009 optimizes — not the weak IMPROVE sample)
  const orphanAfter = getOrphanReport();
  let targetOrphansAfter = 0;
  let targetWeakAfter = 0;
  let laneAOrphansAfter = 0;
  let readyOrphansAfter = 0;
  let hubDepthSumBefore = 0;
  let hubDepthSumAfter = 0;
  let hubDepthN = 0;
  for (const t of targets) {
    const stats = inboundStatsFromReport(t.path, orphanAfter);
    if (stats.orphanStatus === "orphan") {
      targetOrphansAfter += 1;
      if (t.priority === "LANE_A") laneAOrphansAfter += 1;
      if (t.priority === "INDEXABLE_READY") readyOrphansAfter += 1;
    }
    if (stats.contentInboundCount < 2) targetWeakAfter += 1;
  }
  const hubDepthBefore = new Map(
    kgBefore.improveInbound.map((r) => [identityPath(r.path), r.hubDepth]),
  );
  const hubDepthChanges = kgAfter.improveInbound
    .map((r) => {
      const beforeD = hubDepthBefore.get(identityPath(r.path));
      return {
        path: r.path,
        before: beforeD ?? null,
        after: r.hubDepth,
        delta:
          beforeD != null && r.hubDepth != null ? r.hubDepth - beforeD : null,
      };
    })
    .filter((x) => x.delta != null && x.delta !== 0)
    .slice(0, 25);

  for (const t of targets) {
    const beforeRow = kgBefore.improveInbound.find(
      (r) => identityPath(r.path) === identityPath(t.path),
    );
    const afterRow = kgAfter.improveInbound.find(
      (r) => identityPath(r.path) === identityPath(t.path),
    );
    if (beforeRow?.hubDepth != null && afterRow?.hubDepth != null) {
      hubDepthSumBefore += beforeRow.hubDepth;
      hubDepthSumAfter += afterRow.hubDepth;
      hubDepthN += 1;
    }
  }

  const contextualLinks = (linkingReport?.applied ?? []).filter(
    (a) => a.method === "link_injection" || a.method === "guide_overlay",
  ).length;
  const moduleLinks = (linkingReport?.applied ?? []).filter(
    (a) => a.method === "link_injection",
  ).length;
  const overlayLinks = (linkingReport?.applied ?? []).filter(
    (a) => a.method === "guide_overlay",
  ).length;

  const summary = {
    wave: WAVE,
    fr: "FR-009",
    generatedAt: new Date().toISOString(),
    dryRun,
    before: {
      ...before,
      authorityTop: kgBefore.authorityTop.slice(0, 10),
    },
    after: {
      nodes: kgAfter.summary.nodes,
      edges: kgAfter.summary.edges,
      improveOrphansSample: kgAfter.summary.improveOrphans,
      improvePagesSample: kgAfter.summary.improvePages,
      laneAOrphans: laneAOrphansAfter,
      readyOrphans: readyOrphansAfter,
      targetOrphans: targetOrphansAfter,
      targetWeakInbound: targetWeakAfter,
      avgHubDepthBefore:
        hubDepthN > 0
          ? Number((hubDepthSumBefore / hubDepthN).toFixed(2))
          : null,
      avgHubDepthAfter:
        hubDepthN > 0
          ? Number((hubDepthSumAfter / hubDepthN).toFixed(2))
          : null,
    },
    selection: {
      total: targets.length,
      byPriority: targets.reduce(
        (acc, t) => {
          acc[t.priority] = (acc[t.priority] ?? 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
      targets: targets.map((t) => ({
        path: t.path,
        priority: t.priority,
        lane: t.lane,
        orphanStatus: t.orphanStatus,
        inboundBefore: t.inboundCount,
        reason: t.selectionReason,
      })),
    },
    links: {
      injectedTotal:
        (linkingReport?.applied.length ?? 0) + (dryRun ? 0 : hoarderApplied),
      contextualInboundApplied: contextualLinks,
      moduleInjectionLinks: moduleLinks,
      guideOverlayLinks: overlayLinks,
      authorityHoarderOutbounds: dryRun ? hoarderEdges.length : hoarderApplied,
      opportunitiesSelected:
        linkingReport?.metrics.opportunitiesSelected ?? 0,
      skippedWeak: linkingReport?.metrics.skippedWeak ?? 0,
      orphansBefore:
        linkingReport?.metrics.orphansBefore ?? before.targetOrphans,
      orphansAfter: targetOrphansAfter,
    },
    hubDepthChanges,
  };

  const outDir = path.join(ROOT, "data/seo/batches", WAVE);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(
    path.join(outDir, "report.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8",
  );

  const md = [
    `# FR-009 authority flow — ${WAVE}`,
    "",
    "Goal: useful discoverability — not zero orphans.",
    "",
    "## Before → after",
    "",
    `| Metric | Before | After |`,
    `| --- | ---: | ---: |`,
    `| Nodes | ${summary.before.nodes} | ${summary.after.nodes} |`,
    `| Edges | ${summary.before.edges} | ${summary.after.edges} |`,
    `| IMPROVE orphans (sample) | ${summary.before.improveOrphans} | ${summary.after.improveOrphansSample} |`,
    `| IMPROVE pages sampled | ${summary.before.improvePages} | ${summary.after.improvePagesSample} |`,
    `| Target orphans | ${summary.before.targetOrphans} | ${summary.after.targetOrphans} |`,
    `| Target weak inbound (<2) | ${summary.before.targetWeakInbound} | ${summary.after.targetWeakInbound} |`,
    `| Lane A orphans (targets) | ${summary.before.laneAOrphans} | ${summary.after.laneAOrphans} |`,
    `| READY orphans (targets) | ${summary.before.readyOrphans} | ${summary.after.readyOrphans} |`,
    `| Avg hub depth (overlap) | ${summary.after.avgHubDepthBefore ?? "—"} | ${summary.after.avgHubDepthAfter ?? "—"} |`,
    "",
    "## Links",
    "",
    `| Metric | Count |`,
    `| --- | ---: |`,
    `| Opportunities selected | ${summary.links.opportunitiesSelected} |`,
    `| Applied (inbound) | ${summary.links.contextualInboundApplied} |`,
    `| Module injections | ${summary.links.moduleInjectionLinks} |`,
    `| Guide overlay links | ${summary.links.guideOverlayLinks} |`,
    `| Authority-hoarder outbounds | ${summary.links.authorityHoarderOutbounds} |`,
    `| Skipped weak | ${summary.links.skippedWeak} |`,
    "",
    "## Selection mix",
    "",
    ...Object.entries(summary.selection.byPriority).map(
      ([k, v]) => `- ${k}: ${v}`,
    ),
    "",
    "## Hub depth changes (sample)",
    "",
    ...(hubDepthChanges.length
      ? hubDepthChanges.map(
          (h) =>
            `- \`${h.path}\` depth ${h.before} → ${h.after} (Δ ${h.delta})`,
        )
      : ["- No depth deltas in overlapping sample"]),
    "",
    "## Notes",
    "",
    "- Preferred sources: category hubs, software, buying guides, tools, research, use-cases.",
    "- Avoided footer spam / mass related grids / exact-match anchor dumps.",
    "- Target orphan count must fall; sample IMPROVE 80/80 is weak long-tail (not mass-linked).",
    "",
    `Artifacts: \`data/seo/batches/${WAVE}/\``,
    "",
  ].join("\n");

  const mdPath = path.join(ROOT, "docs/seo", `FR009-AUTHORITY-FLOW-${new Date().toISOString().slice(0, 10)}.md`);
  writeFileSync(mdPath, md, "utf8");

  console.log("\n════════ FR-009 REPORT ════════");
  console.log(`targets: ${summary.selection.total}`);
  console.log(`target orphans before→after: ${summary.before.targetOrphans} → ${summary.after.targetOrphans}`);
  console.log(`target weak(<2) before→after: ${summary.before.targetWeakInbound} → ${summary.after.targetWeakInbound}`);
  console.log(`Lane A orphans before→after: ${summary.before.laneAOrphans} → ${summary.after.laneAOrphans}`);
  console.log(`READY orphans before→after: ${summary.before.readyOrphans} → ${summary.after.readyOrphans}`);
  console.log(`IMPROVE sample orphans: ${summary.before.improveOrphans} → ${summary.after.improveOrphansSample}`);
  console.log(`edges: ${summary.before.edges} → ${summary.after.edges}`);
  console.log(`links injected (inbound+hoarder): ${summary.links.injectedTotal}`);
  console.log(`contextual/module/overlay: ${summary.links.contextualInboundApplied}/${summary.links.moduleInjectionLinks}/${summary.links.guideOverlayLinks}`);
  console.log(`Wrote ${path.join(outDir, "report.json")}`);
  console.log(`Wrote ${mdPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
