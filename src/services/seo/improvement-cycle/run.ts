import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getGuideBySlug } from "@/data/repositories/guides";
import {
  getAllComparisonsUnfiltered,
  getComparisonBySlug,
  getSoftware,
} from "@/data";
import {
  analyzeGscOpportunities,
  discoverLatestGscExport,
} from "@/services/seo/gsc-opportunity";
import { loadGscOpportunityReport } from "@/services/seo/gsc-opportunity/load-report";
import { runGrowthDashboard } from "@/services/seo/growth-dashboard";
import { runPriceChangeMonitor } from "@/services/price-change-monitor/run";
import {
  computeWeeklyQualityVelocity,
  loadQualitySnapshotStore,
  latestSnapshot,
  previousSnapshot,
  detectQualityRegression,
} from "@/services/content-quality/gate/snapshots";
import { analyzePageQualityGate, recordGateResult } from "@/services/content-quality/gate";
import { runGuideEnrichmentBatch } from "@/services/seo/guide-enrichment/run";
import { runCompareEnrichmentBatch } from "@/services/seo/compare-enrichment/run";
import { applySoftwareEnrichment } from "@/services/seo/software-enrichment/apply";
import { runImproveBatchLinking } from "@/services/seo/improve-linking/run";
import {
  canPromoteToIndexable,
  promoteToIndexable,
} from "@/services/seo/content-lifecycle/promote";
import {
  loadContentLifecycleStoreFromDisk,
  persistContentLifecycleStore,
} from "@/services/seo/content-lifecycle/store-write";
import { buildSoftwareLookup } from "@/services/seo/compare-index-worthiness";
import { runSitemapEstateReconcile } from "@/services/seo/sitemap-reconcile";
import { runSEOHealthOrchestrator } from "@/services/seo-audit-agents";
import { buildProductTestingQueue } from "@/services/product-testing/queue";
import { reconcileDataVerifiedCoverage } from "@/services/editorial/pricing-verified-at";
import { selectRecommendedBatch } from "./select-batch";
import {
  computeRankingMovements,
  loadPreviousRankingSnapshot,
  saveRankingSnapshot,
} from "./ranking-delta";
import { renderImprovementCycleMarkdown } from "./summary";
import type {
  CycleQueueItem,
  ImprovementCycleMode,
  ImprovementCycleReport,
  ImprovementCycleStepResult,
  ImprovementCycleOperatingSummary,
} from "./types";
import { IMPROVEMENT_CYCLE_VERSION } from "./types";

export type RunImprovementCycleOptions = {
  mode?: ImprovementCycleMode;
  batchSize?: number;
  cwd?: string;
  /** Optional explicit GSC export path. */
  gscExport?: string;
  /** Skip live SEO audit HTTP probes. */
  skipSeoAudit?: boolean;
  writeSummary?: boolean;
};

function weekId(d = new Date()): string {
  const y = d.getUTCFullYear();
  const oneJan = new Date(Date.UTC(y, 0, 1));
  const week = Math.ceil(
    ((d.getTime() - oneJan.getTime()) / 86_400_000 + oneJan.getUTCDay() + 1) /
      7,
  );
  return `${y}-W${String(week).padStart(2, "0")}`;
}

function step(
  id: string,
  label: string,
  status: ImprovementCycleStepResult["status"],
  detail: string,
  artifactPaths: string[] = [],
): ImprovementCycleStepResult {
  return { id, label, status, detail, artifactPaths };
}

/**
 * Weekly EXISTING-CONTENT improvement cycle.
 * Default mode = plan (dry-run). `--apply` may mutate enrichment overlays,
 * linking injections, promotions, and report artifacts — never fabricates
 * testing or creates new URLs.
 */
export async function runImprovementCycle(
  options: RunImprovementCycleOptions = {},
): Promise<ImprovementCycleReport> {
  const cwd = options.cwd ?? process.cwd();
  const mode: ImprovementCycleMode = options.mode ?? "plan";
  const apply = mode === "apply";
  const batchSize = options.batchSize ?? 25;
  const writeSummary = options.writeSummary !== false;
  const generatedAt = new Date().toISOString();
  const id = weekId(new Date(generatedAt));
  const steps: ImprovementCycleStepResult[] = [];
  const notes: string[] = [
    "Existing-content only — no new URL creation, no mass deletes, no fabricated testing.",
    apply
      ? "APPLY mode: enrichment overlays / linking / promotion may persist."
      : "PLAN mode: no enrichment overlays or promotions written.",
  ];
  const existingArtifacts: string[] = [];
  const technicalIssues: string[] = [];
  const readyToPromote: CycleQueueItem[] = [];
  const blocked: CycleQueueItem[] = [];
  const dataVerification: CycleQueueItem[] = [];
  const linkOpps: ImprovementCycleOperatingSummary["internalLinkOpportunities"] =
    [];

  // Hydrate lifecycle for queues / promote eval
  try {
    loadContentLifecycleStoreFromDisk();
  } catch (error) {
    technicalIssues.push(
      `Lifecycle hydrate failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  // 1. Ingest latest REAL GSC data
  try {
    const exportPath =
      options.gscExport ??
      discoverLatestGscExport(cwd, { allowSynthetic: false }).sourcePath;
    const report = analyzeGscOpportunities({
      cwd,
      exportPath,
      write: true,
      allowSynthetic: false,
    });
    steps.push(
      step(
        "gsc_ingest",
        "Ingest latest REAL GSC data",
        "ok",
        `Loaded ${exportPath}; scored ${report.allRanked?.length ?? 0} pages`,
        [
          "data/seo/gsc-opportunities.json",
          "docs/seo/GSC-OPPORTUNITIES.md",
          "data/seo/feeds/",
        ],
      ),
    );
    existingArtifacts.push(
      "data/seo/gsc-opportunities.json",
      "docs/seo/GSC-OPPORTUNITIES.md",
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    steps.push(
      step(
        "gsc_ingest",
        "Ingest latest REAL GSC data",
        "failed",
        msg,
      ),
    );
    technicalIssues.push(`GSC ingest: ${msg}`);
    notes.push(
      "Place a real Search Console export then re-run. Synthetic fixtures are refused.",
    );
  }

  // 2. Refresh opportunity lanes (feeds written by GSC analyze)
  const feedsDir = path.join(cwd, "data/seo/feeds");
  steps.push(
    step(
      "opportunity_lanes",
      "Refresh opportunity lanes",
      existsSync(feedsDir) ? "ok" : "partial",
      existsSync(feedsDir)
        ? "GSC system feeds refreshed (guide/compare/testing/pricing/links/refresh)"
        : "Feeds directory missing — GSC step may have failed",
      [
        "data/seo/feeds/gsc-guide-enrichment.json",
        "data/seo/feeds/gsc-compare-enrichment.json",
        "data/seo/feeds/gsc-refresh.json",
      ],
    ),
  );

  // 3. Ranking gains/losses
  const gscReport = loadGscOpportunityReport();
  const currentPages = (gscReport?.allRanked ?? []).slice(0, 500).map((r) => ({
    path: r.path.endsWith("/") ? r.path : `${r.path}/`,
    position: r.avgPosition ?? null,
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
    opportunityScore: r.opportunityScore,
  }));
  const previousSnap = loadPreviousRankingSnapshot(cwd);
  const movements = computeRankingMovements(currentPages, previousSnap);
  steps.push(
    step(
      "ranking_delta",
      "Detect ranking gains/losses",
      movements.wins.length || movements.losses.length || previousSnap
        ? "ok"
        : "partial",
      movements.note,
      ["data/seo/improvement-cycle/previous-ranking-snapshot.json"],
    ),
  );

  // Persist snapshot for next week (always — plan and apply)
  saveRankingSnapshot(
    {
      generatedAt,
      weekId: id,
      pages: currentPages,
    },
    cwd,
  );

  // 4. Content-quality regressions
  const velocity = computeWeeklyQualityVelocity({ cwd });
  const store = loadQualitySnapshotStore(cwd);
  const regressions: string[] = [];
  const seenUrls = new Set<string>();
  for (const snap of store.snapshots.slice(-200)) {
    if (seenUrls.has(snap.url)) continue;
    seenUrls.add(snap.url);
    const latest = latestSnapshot(snap.url, cwd);
    const prev = previousSnapshot(snap.url, cwd);
    if (!latest) continue;
    const flag = detectQualityRegression(latest, prev, { cwd, persist: false });
    if (flag) {
      regressions.push(
        `${snap.url} · score ${prev?.qualityScore ?? "?"}→${latest.qualityScore}`,
      );
    }
  }
  steps.push(
    step(
      "quality_regressions",
      "Identify content-quality regressions",
      "ok",
      `Weekly velocity improvedUrls=${velocity.improvedUrls?.length ?? 0}; regressions flagged=${regressions.length}`,
      ["data/seo/content-quality-gate-history.json"],
    ),
  );
  for (const r of regressions.slice(0, 15)) {
    technicalIssues.push(`Quality regression: ${r}`);
  }

  // 5. Stale pricing / data
  let pricingDetail = "";
  try {
    const pricing = runPriceChangeMonitor({
      limit: 40,
      applyConfirmed: false,
      appendObservations: false,
      writeWeeklyReport: true,
      writeGrowthSignals: true,
      writeVerificationTasks: true,
      markOutdatedPricing: false,
    });
    pricingDetail = `Scanned ${pricing.productsScanned}; changes=${pricing.changeCount}; needsVerification=${pricing.needsVerificationCount}; tasks=${pricing.verificationTaskCount}`;
    steps.push(
      step(
        "stale_pricing",
        "Identify stale pricing/data",
        "ok",
        pricingDetail,
        [
          "docs/pricing/WEEKLY-PRICE-CHANGES.md",
          "data/pricing/price-change-growth-signals.json",
        ],
      ),
    );
    existingArtifacts.push("docs/pricing/WEEKLY-PRICE-CHANGES.md");

    if (pricing.verificationTasksPath) {
      const abs = path.isAbsolute(pricing.verificationTasksPath)
        ? pricing.verificationTasksPath
        : path.join(cwd, pricing.verificationTasksPath);
      if (existsSync(abs)) {
        try {
          const raw = JSON.parse(readFileSync(abs, "utf8")) as
            | Array<{ productId?: string; productSlug?: string }>
            | { tasks?: Array<{ productId?: string; productSlug?: string }> };
          const tasks = Array.isArray(raw) ? raw : (raw.tasks ?? []);
          for (const task of tasks.slice(0, 20)) {
            const productId = task.productId ?? task.productSlug;
            if (!productId) continue;
            dataVerification.push({
              kind: "software",
              slug: productId,
              path: `/software/${productId}/`,
              lane: null,
              score: 0,
              reason: "Pricing verification task",
              action: "verify_pricing",
              lifecycle: null,
              blockedReasons: [],
            });
          }
        } catch {
          /* ignore parse errors */
        }
      }
    }
  } catch (error) {
    steps.push(
      step(
        "stale_pricing",
        "Identify stale pricing/data",
        "partial",
        error instanceof Error ? error.message : String(error),
      ),
    );
  }

  const recon = reconcileDataVerifiedCoverage();
  if (recon.rejected > 0) {
    notes.push(
      `DATA_VERIFIED reconciliation: accepted=${recon.accepted} rejected=${recon.rejected} (see docs/editorial/DATA-VERIFIED-RECONCILIATION.md)`,
    );
  }

  // 6–9. Rank IMPROVE / INDEXABLE refresh + select batch
  const { enrich, refresh, selected } = selectRecommendedBatch({ batchSize });
  steps.push(
    step(
      "rank_improve",
      "Rank existing IMPROVE pages",
      "ok",
      `${enrich.length} enrich candidates from guide/compare/software queues`,
    ),
  );
  steps.push(
    step(
      "rank_refresh",
      "Rank existing INDEXABLE pages needing refresh",
      "ok",
      `${refresh.length} refresh candidates from GSC indexed-improvement / OUTDATED`,
    ),
  );
  steps.push(
    step(
      "select_batch",
      "Select recommended batch",
      "ok",
      `Selected ${selected.length} pages (batchSize=${batchSize})`,
    ),
  );
  steps.push(
    step(
      "actionable_queue",
      "Generate actionable improvement queue",
      "ok",
      "Included in operating summary below",
      ["docs/seo/IMPROVEMENT-CYCLE.md"],
    ),
  );

  // Promote evaluation (plan + apply)
  const softLookup = buildSoftwareLookup(getSoftware({ includeUnpublished: true }));
  for (const item of selected.filter((s) => s.action === "enrich")) {
    if (item.kind === "guide") {
      const guide = getGuideBySlug(item.slug, { includeUnpublished: true });
      if (!guide) {
        blocked.push({
          ...item,
          action: "blocked",
          blockedReasons: ["guide_not_found"],
        });
        continue;
      }
      const decision = canPromoteToIndexable({ kind: "guide", entity: guide });
      if (decision.ok) {
        readyToPromote.push({
          ...item,
          action: "promote_eval",
          reason: decision.detail.join("; ") || "Passes promotion gates",
        });
      } else if (!decision.alreadyIndexable && decision.reasons.length) {
        blocked.push({
          ...item,
          action: "blocked",
          blockedReasons: decision.reasons.map(String),
        });
      }
    } else if (item.kind === "comparison") {
      const comparison =
        getComparisonBySlug(item.slug) ??
        getAllComparisonsUnfiltered().find((c) => c.slug === item.slug);
      if (!comparison) {
        blocked.push({
          ...item,
          action: "blocked",
          blockedReasons: ["comparison_not_found"],
        });
        continue;
      }
      const decision = canPromoteToIndexable({
        kind: "comparison",
        entity: comparison,
        soft: softLookup,
      });
      if (decision.ok) {
        readyToPromote.push({
          ...item,
          action: "promote_eval",
          reason: decision.detail.join("; ") || "Passes promotion gates",
        });
      } else if (!decision.alreadyIndexable && decision.reasons.length) {
        blocked.push({
          ...item,
          action: "blocked",
          blockedReasons: decision.reasons.map(String),
        });
      }
    }
  }

  // 10–14. Apply path only
  if (apply) {
    const guideSlugs = selected
      .filter((s) => s.kind === "guide" && s.action === "enrich")
      .map((s) => s.slug);
    const compareSlugs = selected
      .filter((s) => s.kind === "comparison" && s.action === "enrich")
      .map((s) => s.slug);
    const softwareSlugs = selected
      .filter((s) => s.kind === "software" && s.action === "enrich")
      .map((s) => s.slug);

    try {
      if (guideSlugs.length) {
        const gBatch = runGuideEnrichmentBatch({
          slugs: guideSlugs,
          apply: true,
          promote: false,
          persistFamilyQa: true,
        });
        steps.push(
          step(
            "enrich_guides",
            "Enrich selected guides",
            "ok",
            `Applied ${gBatch.applied.length}/${guideSlugs.length}; promoted=${gBatch.promoted.length}`,
            ["data/seo/guide-enrichment-overlays/"],
          ),
        );
      } else {
        steps.push(
          step("enrich_guides", "Enrich selected guides", "skipped", "None selected"),
        );
      }

      if (compareSlugs.length) {
        const cBatch = runCompareEnrichmentBatch({
          slugs: compareSlugs,
          apply: true,
          promote: false,
          persistFamilyQa: true,
        });
        steps.push(
          step(
            "enrich_comparisons",
            "Enrich selected comparisons",
            "ok",
            `Applied ${cBatch.applied.length}/${compareSlugs.length}; promoted=${cBatch.promoted.length}`,
            ["data/seo/compare-enrichment-overlays/"],
          ),
        );
      } else {
        steps.push(
          step(
            "enrich_comparisons",
            "Enrich selected comparisons",
            "skipped",
            "None selected",
          ),
        );
      }

      let softwareApplied = 0;
      for (const slug of softwareSlugs) {
        try {
          applySoftwareEnrichment(slug);
          softwareApplied += 1;
        } catch (error) {
          technicalIssues.push(
            `Software enrich ${slug}: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
      steps.push(
        step(
          "enrich_software",
          "Enrich selected software hubs",
          softwareSlugs.length ? "ok" : "skipped",
          softwareSlugs.length
            ? `Applied ${softwareApplied}/${softwareSlugs.length}`
            : "None selected",
          ["data/seo/software-enrichment-overlays/"],
        ),
      );
    } catch (error) {
      steps.push(
        step(
          "enrich",
          "Enrichment batch",
          "failed",
          error instanceof Error ? error.message : String(error),
        ),
      );
    }

    // 11–12 Semantic QA + CQ gate (per selected page)
    let gateOk = 0;
    let gateFail = 0;
    for (const item of selected.slice(0, batchSize)) {
      try {
        const gate = analyzePageQualityGate({
          pageType: item.kind === "comparison" ? "comparison" : item.kind,
          slug: item.slug,
        });
        if (gate) {
          recordGateResult(gate, "after", {
            note: `improvement-cycle:${id}:${item.kind}:${item.slug}`,
          });
          if (gate.indexEligible || (gate.qualityScore ?? 0) >= 70) gateOk += 1;
          else gateFail += 1;
        }
      } catch {
        gateFail += 1;
      }
    }
    steps.push(
      step(
        "semantic_cq_gate",
        "Semantic QA + Content Quality Gate",
        "ok",
        `Recorded gate results; ok-ish=${gateOk} weak=${gateFail} (semantic family QA runs inside enrichment)`,
        ["data/seo/content-quality-gate-history.json"],
      ),
    );

    // 13. Contextual internal linking
    try {
      const pages = selected.map((s) => ({
        pageType: s.kind,
        slug: s.slug,
        path: s.path,
      }));
      const linking = runImproveBatchLinking({
        batchId: `improvement-cycle-${id}`,
        pages,
        cwd,
        write: true,
        dryRun: false,
        light: true,
        skipGraphSnapshots: true,
      });
      steps.push(
        step(
          "internal_linking",
          "Contextual internal linking",
          "ok",
          `Plans=${linking.plans.length}; selected edges across batch`,
          [`data/seo/batches/improvement-cycle-${id}-linking.json`],
        ),
      );
      for (const plan of linking.plans.slice(0, 20)) {
        linkOpps.push({
          path: plan.path,
          detail: `${plan.selected.length} selected inbound / ${plan.outboundNextSteps.length} outbound next-steps`,
        });
      }
    } catch (error) {
      steps.push(
        step(
          "internal_linking",
          "Contextual internal linking",
          "partial",
          error instanceof Error ? error.message : String(error),
        ),
      );
    }

    // 14. Promotion evaluation + persist when eligible
    let promoted = 0;
    for (const item of readyToPromote) {
      try {
        if (item.kind === "guide") {
          const guide = getGuideBySlug(item.slug, { includeUnpublished: true });
          if (!guide) continue;
          const result = promoteToIndexable({ kind: "guide", entity: guide });
          if (result.ok) {
            promoted += 1;
          }
        } else if (item.kind === "comparison") {
          const comparison = getComparisonBySlug(item.slug);
          if (!comparison) continue;
          const result = promoteToIndexable({
            kind: "comparison",
            entity: comparison,
            soft: softLookup,
          });
          if (result.ok) {
            promoted += 1;
          }
        }
      } catch (error) {
        technicalIssues.push(
          `Promote ${item.slug}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
    try {
      persistContentLifecycleStore();
    } catch {
      /* optional */
    }
    steps.push(
      step(
        "promotion",
        "Promotion evaluation",
        "ok",
        `Eligible=${readyToPromote.length}; newly promoted=${promoted}`,
        ["data/seo/content-lifecycle.json"],
      ),
    );
  } else {
    steps.push(
      step(
        "enrich",
        "Enrichment (apply)",
        "skipped",
        "PLAN mode — re-run with --apply to enrich selected pages only",
      ),
    );
    steps.push(
      step(
        "semantic_cq_gate",
        "Semantic QA + Content Quality Gate",
        "skipped",
        "PLAN mode",
      ),
    );
    // Linking opportunities (dry-run)
    try {
      const pages = selected.map((s) => ({
        pageType: s.kind,
        slug: s.slug,
        path: s.path,
      }));
      const linking = runImproveBatchLinking({
        batchId: `improvement-cycle-${id}-plan`,
        pages,
        cwd,
        write: true,
        dryRun: true,
        light: true,
        skipGraphSnapshots: true,
      });
      steps.push(
        step(
          "internal_linking",
          "Contextual internal linking",
          "ok",
          `DRY-RUN plans=${linking.plans.length}`,
          [`data/seo/batches/improvement-cycle-${id}-plan-linking.json`],
        ),
      );
      for (const plan of linking.plans.slice(0, 20)) {
        linkOpps.push({
          path: plan.path,
          detail: `Dry-run: ${plan.selected.length} inbound candidates`,
        });
      }
    } catch (error) {
      steps.push(
        step(
          "internal_linking",
          "Contextual internal linking",
          "partial",
          error instanceof Error ? error.message : String(error),
        ),
      );
    }
    steps.push(
      step(
        "promotion",
        "Promotion evaluation",
        "ok",
        `Eligible without apply: ${readyToPromote.length} (not persisted in PLAN)`,
      ),
    );
  }

  // 15. Sitemap reconciliation
  try {
    const sitemap = runSitemapEstateReconcile({});
    steps.push(
      step(
        "sitemap_reconcile",
        "Sitemap reconciliation",
        sitemap.totals.discrepancyCount === 0 ? "ok" : "partial",
        `Discrepancies=${sitemap.totals.discrepancyCount}; guides in sitemap=${sitemap.pageTypes.find((p) => p.pageType === "guides")?.counts.inSitemap ?? "?"}`,
        ["docs/seo/SITEMAP-LIFECYCLE-RECONCILIATION.md"],
      ),
    );
    existingArtifacts.push("docs/seo/SITEMAP-LIFECYCLE-RECONCILIATION.md");
    if (sitemap.totals.discrepancyCount > 0) {
      technicalIssues.push(
        `Sitemap discrepancies: ${sitemap.totals.discrepancyCount}`,
      );
    }
  } catch (error) {
    steps.push(
      step(
        "sitemap_reconcile",
        "Sitemap reconciliation",
        "failed",
        error instanceof Error ? error.message : String(error),
      ),
    );
  }

  // 16. SEO audit (FAST, no live base by default)
  if (options.skipSeoAudit) {
    steps.push(
      step("seo_audit", "SEO audit", "skipped", "Skipped via --skip-seo-audit"),
    );
  } else {
    try {
      const audit = await runSEOHealthOrchestrator({
        mode: "FAST",
        writeReports: true,
      });
      steps.push(
        step(
          "seo_audit",
          "SEO audit",
          "ok",
          `FAST orchestrator: findings=${audit.findings?.length ?? 0}`,
          ["docs/seo/reports/"],
        ),
      );
    } catch (error) {
      steps.push(
        step(
          "seo_audit",
          "SEO audit",
          "partial",
          error instanceof Error ? error.message : String(error),
        ),
      );
    }
  }

  // 17. Growth Dashboard refresh
  try {
    runGrowthDashboard({ write: true });
    steps.push(
      step(
        "growth_dashboard",
        "Growth Dashboard refresh",
        "ok",
        "Refreshed growth dashboard from connected sources",
        ["docs/seo/GROWTH-DASHBOARD.md", "data/seo/growth-dashboard.json"],
      ),
    );
    existingArtifacts.push("docs/seo/GROWTH-DASHBOARD.md");
  } catch (error) {
    steps.push(
      step(
        "growth_dashboard",
        "Growth Dashboard refresh",
        "failed",
        error instanceof Error ? error.message : String(error),
      ),
    );
  }

  // Human testing queue (existing)
  const testingQueue = buildProductTestingQueue(10);
  const humanTesting: CycleQueueItem[] = testingQueue.items.map((t) => ({
    kind: "software" as const,
    slug: t.productSlug,
    path: `/software/${t.productSlug}/`,
    lane: t.lane ?? null,
    score: t.evidencePriorityScore,
    reason: t.reason,
    action: "human_test" as const,
    lifecycle: null,
    blockedReasons: [],
  }));
  existingArtifacts.push("docs/editorial/PRODUCT-TESTING-QUEUE.md");

  // Link opportunities from GSC feed if empty
  if (linkOpps.length === 0) {
    const feedPath = path.join(cwd, "data/seo/feeds/gsc-internal-links.json");
    if (existsSync(feedPath)) {
      try {
        const feed = JSON.parse(readFileSync(feedPath, "utf8")) as {
          items?: Array<{ path?: string; reason?: string }>;
          pages?: Array<{ path?: string; reason?: string }>;
        };
        const items = feed.items ?? feed.pages ?? [];
        for (const item of items.slice(0, 15)) {
          if (item.path) {
            linkOpps.push({
              path: item.path,
              detail: item.reason ?? "GSC internal-links feed",
            });
          }
        }
      } catch {
        /* ignore */
      }
    }
  }

  const summary: ImprovementCycleOperatingSummary = {
    rankingWins: movements.wins,
    rankingLosses: movements.losses,
    pagesToRefresh: refresh.slice(0, 30),
    pagesToEnrich: enrich.slice(0, 30),
    pagesReadyToPromote: readyToPromote.slice(0, 30),
    pagesBlocked: blocked.slice(0, 40),
    dataVerificationRequired: dataVerification.slice(0, 30),
    humanTestingRequired: humanTesting,
    internalLinkOpportunities: linkOpps.slice(0, 30),
    technicalIssues: technicalIssues.slice(0, 40),
  };

  const report: ImprovementCycleReport = {
    version: IMPROVEMENT_CYCLE_VERSION,
    generatedAt,
    weekId: id,
    mode,
    batchSize,
    steps,
    selectedBatch: selected,
    summary,
    existingArtifacts: [...new Set(existingArtifacts)],
    notes,
  };

  if (writeSummary) {
    const mdPath = path.join(cwd, "docs/seo/IMPROVEMENT-CYCLE.md");
    mkdirSync(path.dirname(mdPath), { recursive: true });
    writeFileSync(mdPath, renderImprovementCycleMarkdown(report), "utf8");

    const jsonPath = path.join(
      cwd,
      "data/seo/improvement-cycle",
      "latest-report.json",
    );
    mkdirSync(path.dirname(jsonPath), { recursive: true });
    writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  }

  return report;
}
