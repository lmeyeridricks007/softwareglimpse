#!/usr/bin/env npx tsx
/**
 * FR-002 factory product-pack wave — enrich for usefulness, not promotion rate.
 *
 *   npm run seo:factory-pack-wave
 *   npm run seo:factory-pack-wave -- --wave-size 50 --apply
 *   npm run seo:factory-pack-wave -- --wave-size 50 --apply --promote
 *   npm run seo:factory-pack-wave -- --dry-run
 *
 * Waves of 50. Lane A → B → C. Never deletes URLs.
 * Default: apply overlays without promote. Promote only with --promote when
 * current-state semantic + quality gates pass.
 */
import { mkdirSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import {
  analyzePageQualityGate,
  recordGateResult,
} from "@/services/content-quality/gate";
import { getGuideBySlug, getGuides } from "@/data/repositories/guides";
import { loadContentLifecycleStoreFromDisk } from "@/services/seo/content-lifecycle/store-write";
import { runGuideEnrichmentBatch } from "@/services/seo/guide-enrichment";
import { mergeGuideWithOverlay } from "@/services/seo/guide-enrichment/overlay-merge";
import { loadGuideEnrichmentOverlay } from "@/services/seo/guide-enrichment/overlay-store";
import { assessGuideSemanticTemplateRisk } from "@/services/content-quality/gate/semantic-template";
import {
  isFactoryProductPackGuide,
  isProductExplainerGuide,
} from "@/services/seo/guides-index-worthiness/classify";
import { buildGuideEnrichmentQueue } from "@/services/seo/guide-enrichment/queue";
import { selectFactoryPackWave } from "@/services/seo/factory-pack-wave/select";

const ROOT = process.cwd();
const WAVE_DATE = new Date().toISOString().slice(0, 10);

function nextWaveId(): string {
  const batches = path.join(ROOT, "data/seo/batches");
  let n = 1;
  if (existsSync(batches)) {
    for (const name of readdirSync(batches)) {
      const m = /^factory-pack-(\d{4}-\d{2}-\d{2})(?:-w(\d+))?$/.exec(name);
      if (!m) continue;
      if (m[1] !== WAVE_DATE) continue;
      const waveNum = m[2] ? Number(m[2]) : 1;
      if (waveNum >= n) n = waveNum + 1;
    }
  }
  return n === 1
    ? `factory-pack-${WAVE_DATE}`
    : `factory-pack-${WAVE_DATE}-w${n}`;
}

function argFlag(args: string[], name: string): boolean {
  return args.includes(name);
}

function argValue(args: string[], name: string): string | undefined {
  const eq = args.find((a) => a.startsWith(`${name}=`));
  if (eq) return eq.slice(name.length + 1);
  const idx = args.indexOf(name);
  if (idx >= 0 && args[idx + 1] && !args[idx + 1]!.startsWith("--")) {
    return args[idx + 1];
  }
  return undefined;
}

type PageRow = {
  slug: string;
  packKind: string | null;
  lane: string;
  existenceOk: boolean;
  existenceReason: string;
  userJob: string | null;
  applied: boolean;
  materiallyImproved: boolean;
  promoted: boolean;
  remainingImprove: boolean;
  semanticFailure: boolean;
  semanticRiskBefore: "none" | "elevated" | "high" | null;
  semanticRiskAfter: "none" | "elevated" | "high" | null;
  semanticRiskReduced: boolean;
  maxSimilarityBefore: number | null;
  maxSimilarityAfter: number | null;
  uniqueSignalsBefore: number;
  uniqueSignalsAfter: number;
  uniqueSignalsGained: number;
  dataBlockers: string[];
  evidenceBlockers: string[];
  qualityBefore: number | null;
  qualityAfter: number | null;
  qualityDelta: number | null;
  skipReasons: string[];
};

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const apply = argFlag(args, "--apply");
  const promote = argFlag(args, "--promote");
  const dryRun = argFlag(args, "--dry-run") || !apply;
  const waveSize = Number(argValue(args, "--wave-size") ?? "50");

  loadContentLifecycleStoreFromDisk();

  console.log(
    `FR-002 factory-pack wave: size=${waveSize} mode=${dryRun ? "DRY-RUN" : apply ? (promote ? "APPLY+PROMOTE" : "APPLY") : "PLAN"}`,
  );

  const { selected, skippedIllegitimate, remainingFactoryImprove, excludedAlreadyProcessed } =
    selectFactoryPackWave({
      waveSize,
      requireLegitimateExistence: true,
      allocateByLane: false,
      excludeProcessedWaves: true,
    });

  const waveId = nextWaveId();

  console.log(
    `Factory IMPROVE pool≈${remainingFactoryImprove}; already processed excluded=${excludedAlreadyProcessed}; legitimate selected=${selected.length}; thin/illegitimate skipped this pass=${skippedIllegitimate.length}`,
  );

  if (selected.length === 0) {
    const outDir = path.join(ROOT, "data/seo/batches", waveId);
    mkdirSync(outDir, { recursive: true });
    const blocked = skippedIllegitimate.map((thin) => ({
      slug: thin.slug,
      packKind: thin.existence.packKind,
      lane: thin.lane,
      existenceOk: false,
      existenceReason: thin.existence.reason,
      userJob: thin.existence.userJob,
      applied: false,
      materiallyImproved: false,
      promoted: false,
      remainingImprove: true,
      semanticFailure: false,
      skipReasons: [`existence:${thin.existence.reason}`],
      dataBlockers: thin.existence.dataBlockers,
    }));
    const summary = {
      wave: waveId,
      fr: "FR-002",
      generatedAt: new Date().toISOString(),
      applied: apply && !dryRun,
      promote,
      waveSize,
      metrics: {
        processed: 0,
        promoted: 0,
        illegitimateSkipped: skippedIllegitimate.length,
        excludedAlreadyProcessed,
        factoryImproveRemainingApprox: remainingFactoryImprove,
      },
      pages: blocked,
      notes: [
        "No remaining legitimate factory packs in the unprocessed IMPROVE pool.",
        "Existence-failed pages stay IMPROVE with machine-readable existence blockers.",
      ],
    };
    writeFileSync(
      path.join(outDir, "wave-report.json"),
      `${JSON.stringify(summary, null, 2)}\n`,
      "utf8",
    );
    console.log(
      `No legitimate factory candidates left. Recorded ${blocked.length} existence blockers.`,
    );
    return;
  }
  console.log(
    "Wave lanes:",
    selected.reduce(
      (acc, s) => {
        acc[s.lane] = (acc[s.lane] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  );
  console.log(
    "Top 10:",
    selected
      .slice(0, 10)
      .map(
        (s) =>
          `${s.slug} [${s.lane} rank=${Math.round(s.factoryRank)} gsc=${s.prioritySignals.gscImpressions}/${s.prioritySignals.gscPosition ?? "—"}]`,
      ),
  );

  const seedPeers = getGuides({ includeUnpublished: true });
  const peersWithOverlays = (): typeof seedPeers =>
    seedPeers.map((g) => {
      if (!isFactoryProductPackGuide(g) && !isProductExplainerGuide(g)) {
        return g;
      }
      const overlay = loadGuideEnrichmentOverlay(g.slug);
      return overlay ? mergeGuideWithOverlay(g, overlay) : g;
    });
  const refreshPeer = (slug: string, page: (typeof seedPeers)[number]) => {
    peers = peers.map((p) => (p.slug === slug ? page : p));
  };
  // Estate-compatible peers: overlay-merged siblings (not seed-only).
  console.log("Building overlay-merged peer set…");
  let peers = peersWithOverlays();
  console.log(`Peers ready (${peers.length})`);
  const pages: PageRow[] = [];

  // Quality + semantic before
  const beforeScores = new Map<string, number>();
  const beforeSemantic = new Map<
    string,
    ReturnType<typeof assessGuideSemanticTemplateRisk>
  >();
  console.log("Scoring semantic before…");
  for (const item of selected) {
    const gate = analyzePageQualityGate({
      pageType: "guide",
      slug: item.slug,
    });
    if (gate) {
      beforeScores.set(item.slug, gate.qualityScore);
      if (apply) {
        recordGateResult(gate, "before", {
          note: "FR-002 factory-pack wave",
          persist: true,
        });
      }
    }
    const guideBefore = getGuideBySlug(item.slug, { includeUnpublished: true });
    if (guideBefore) {
      const overlay = loadGuideEnrichmentOverlay(item.slug);
      const mergedBefore = overlay
        ? mergeGuideWithOverlay(guideBefore, overlay)
        : guideBefore;
      beforeSemantic.set(
        item.slug,
        assessGuideSemanticTemplateRisk(mergedBefore, peers),
      );
    }
  }
  console.log("Before-scores done; running enrichment batch…");

  const legitimateSlugs = selected
    .filter((s) => s.existence.ok)
    .map((s) => s.slug);

  let batch = null;
  if (!dryRun && apply && legitimateSlugs.length > 0) {
    batch = runGuideEnrichmentBatch({
      slugs: legitimateSlugs,
      batchSize: legitimateSlugs.length,
      apply: true,
      promote: Boolean(promote),
      allocateByLane: false,
      persistFamilyQa: true,
    });
  }

  const appliedMap = new Map(
    (batch?.applied ?? []).map((a) => [a.slug, a]),
  );
  const promotedSet = new Set(batch?.promoted ?? []);
  const skippedMap = new Map(
    (batch?.skippedPromotion ?? []).map((s) => [s.slug, s.reasons]),
  );

  for (const item of selected) {
    const existence = item.existence;
    const appliedRow = appliedMap.get(item.slug);
    const guide = getGuideBySlug(item.slug, { includeUnpublished: true });
    let working = guide;
    if (guide && appliedRow?.applied) {
      working = mergeGuideWithOverlay(
        guide,
        loadGuideEnrichmentOverlay(item.slug),
      );
    }

    const afterGate = analyzePageQualityGate({
      pageType: "guide",
      slug: item.slug,
    });
    if (afterGate && apply) {
      recordGateResult(afterGate, "after", {
        note: "FR-002 factory-pack wave",
        persist: true,
      });
    }

    const qBefore = beforeScores.get(item.slug) ?? null;
    const qAfter = afterGate?.qualityScore ?? qBefore;
    const delta =
      qBefore != null && qAfter != null ? qAfter - qBefore : null;

    const semBefore = beforeSemantic.get(item.slug) ?? null;
    // Point-update peer cache after apply (avoid re-reading all overlays).
    if (working) refreshPeer(item.slug, working);
    const semantic =
      working != null
        ? assessGuideSemanticTemplateRisk(working, peers)
        : null;
    const semanticFailure = Boolean(semantic?.blocksAutoPromotion);
    const riskRank = (r: "none" | "elevated" | "high" | null | undefined) =>
      r === "high" ? 2 : r === "elevated" ? 1 : r === "none" ? 0 : -1;
    const uniqueBefore = semBefore?.uniqueAnalysisSignals?.length ?? 0;
    const uniqueAfter = semantic?.uniqueAnalysisSignals?.length ?? 0;
    const skipReasons = skippedMap.get(item.slug) ?? [];
    if (!existence.ok) {
      skipReasons.push(`existence:${existence.reason}`);
    }

    const evidenceBlockers = skipReasons.filter(
      (r) =>
        r.toLowerCase().includes("evidence") ||
        r.toLowerCase().includes("source") ||
        r.toLowerCase().includes("credibility"),
    );

    const materiallyImproved =
      Boolean(appliedRow?.applied) &&
      ((appliedRow?.uniqueValueAdded.length ?? 0) > 0 ||
        (appliedRow?.blocksAdded ?? 0) > 0) &&
      (delta == null || delta >= 0);

    pages.push({
      slug: item.slug,
      packKind: existence.packKind,
      lane: item.lane,
      existenceOk: existence.ok,
      existenceReason: existence.reason,
      userJob: existence.userJob,
      applied: Boolean(appliedRow?.applied),
      materiallyImproved,
      promoted: promotedSet.has(item.slug),
      remainingImprove: !promotedSet.has(item.slug),
      semanticFailure,
      semanticRiskBefore: semBefore?.riskLevel ?? null,
      semanticRiskAfter: semantic?.riskLevel ?? null,
      semanticRiskReduced:
        riskRank(semantic?.riskLevel) < riskRank(semBefore?.riskLevel),
      maxSimilarityBefore: semBefore?.maxSemanticSimilarity ?? null,
      maxSimilarityAfter: semantic?.maxSemanticSimilarity ?? null,
      uniqueSignalsBefore: uniqueBefore,
      uniqueSignalsAfter: uniqueAfter,
      uniqueSignalsGained: Math.max(0, uniqueAfter - uniqueBefore),
      dataBlockers: existence.dataBlockers,
      evidenceBlockers,
      qualityBefore: qBefore,
      qualityAfter: qAfter,
      qualityDelta: delta,
      skipReasons,
    });
  }

  // Record existence failures so later waves do not re-select them.
  for (const thin of skippedIllegitimate) {
    if (pages.some((p) => p.slug === thin.slug)) continue;
    pages.push({
      slug: thin.slug,
      packKind: thin.existence.packKind,
      lane: thin.lane,
      existenceOk: false,
      existenceReason: thin.existence.reason,
      userJob: thin.existence.userJob,
      applied: false,
      materiallyImproved: false,
      promoted: false,
      remainingImprove: true,
      semanticFailure: false,
      semanticRiskBefore: null,
      semanticRiskAfter: null,
      semanticRiskReduced: false,
      maxSimilarityBefore: null,
      maxSimilarityAfter: null,
      uniqueSignalsBefore: 0,
      uniqueSignalsAfter: 0,
      uniqueSignalsGained: 0,
      dataBlockers: thin.existence.dataBlockers,
      evidenceBlockers: [],
      qualityBefore: null,
      qualityAfter: null,
      qualityDelta: null,
      skipReasons: [`existence:${thin.existence.reason}`],
    });
  }

  const wavePages = pages.filter((p) => p.existenceOk);
  const thinSample = skippedIllegitimate.slice(0, 25).map((thin) => ({
    slug: thin.slug,
    packKind: thin.existence.packKind,
    lane: thin.lane,
    reason: thin.existence.reason,
    dataBlockers: thin.existence.dataBlockers,
  }));

  const processed = wavePages.length;
  const materiallyImproved = wavePages.filter((p) => p.materiallyImproved)
    .length;
  const promoted = wavePages.filter((p) => p.promoted).length;
  const remainingImprove = wavePages.filter((p) => p.remainingImprove).length;
  const semanticFailure = wavePages.filter((p) => p.semanticFailure).length;
  const semanticRiskReduced = wavePages.filter((p) => p.semanticRiskReduced)
    .length;
  const stillHighRisk = wavePages.filter(
    (p) => p.semanticRiskAfter === "high",
  ).length;
  const dataBlockers = wavePages.filter((p) => p.dataBlockers.length > 0)
    .length;
  const evidenceBlockers = wavePages.filter(
    (p) => p.evidenceBlockers.length > 0,
  ).length;
  const deltas = wavePages
    .map((p) => p.qualityDelta)
    .filter((d): d is number => d != null);
  const averageQualityDelta = deltas.length
    ? Number(
        (deltas.reduce((a, b) => a + b, 0) / deltas.length).toFixed(2),
      )
    : null;
  const simDeltas = wavePages
    .map((p) =>
      p.maxSimilarityBefore != null && p.maxSimilarityAfter != null
        ? p.maxSimilarityBefore - p.maxSimilarityAfter
        : null,
    )
    .filter((d): d is number => d != null);
  const averageSemanticDelta = simDeltas.length
    ? Number(
        (simDeltas.reduce((a, b) => a + b, 0) / simDeltas.length).toFixed(3),
      )
    : null;
  const uniqueGained = wavePages.reduce(
    (a, p) => a + p.uniqueSignalsGained,
    0,
  );

  // Remaining factory IMPROVE after wave
  const afterQueue = buildGuideEnrichmentQueue({ allocateByLane: false });
  let factoryRemaining = 0;
  for (const item of afterQueue) {
    const g = getGuideBySlug(item.slug, { includeUnpublished: true });
    if (g && isFactoryProductPackGuide(g)) factoryRemaining += 1;
  }

  const summary = {
    wave: waveId,
    fr: "FR-002",
    generatedAt: new Date().toISOString(),
    applied: apply && !dryRun,
    promote,
    waveSize,
    metrics: {
      processed,
      materiallyImproved,
      promoted,
      remainingImprove,
      semanticFailure,
      semanticRiskReduced,
      stillHighRisk,
      averageSemanticDelta,
      uniqueAnalysisSignalsGained: uniqueGained,
      dataBlockers,
      evidenceBlockers,
      averageQualityDelta,
      factoryImproveRemainingApprox: factoryRemaining,
      illegitimateSkipped: skippedIllegitimate.length,
      excludedAlreadyProcessed,
    },
    // Include existence-failed rows so later waves exclude them as BLOCKED.
    pages,
    thinExistenceSkipsSample: thinSample,
    laneMix: selected.reduce(
      (acc, s) => {
        acc[s.lane] = (acc[s.lane] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
    notes: [
      "Lane A factory packs with GSC/strategic override: none in current IMPROVE pool — wave proceeds Lane B→C per priority order.",
      "Do not promote solely because enrichment overlays exist.",
      "Negative quality deltas leave IMPROVE — enrichment alone is not success.",
    ],
    familyQa: batch?.familyQa
      ? {
          flagged: batch.familyQa.flagged,
          sharedRatio: batch.familyQa.sharedRatio,
          reasons: batch.familyQa.reasons,
        }
      : null,
  };

  const outDir = path.join(ROOT, "data/seo/batches", summary.wave);
  mkdirSync(outDir, { recursive: true });
  const jsonPath = path.join(outDir, "wave-report.json");
  writeFileSync(jsonPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

  const md = [
    `# FR-002 factory pack wave — ${summary.wave}`,
    "",
    "Goal: fewer template-like pages, more genuinely valuable buying content.",
    "URLs preserved. No bulk promote.",
    "",
    "## Wave metrics",
    "",
    `| Metric | Count |`,
    `| --- | ---: |`,
    `| Processed (legitimate existence) | ${processed} |`,
    `| Materially improved | ${materiallyImproved} |`,
    `| Promoted | ${promoted} |`,
    `| Remaining improve (this wave) | ${remainingImprove} |`,
    `| Semantic failure (still blocks) | ${semanticFailure} |`,
    `| Semantic risk reduced | ${semanticRiskReduced} |`,
    `| Still high semantic risk | ${stillHighRisk} |`,
    `| Average semantic similarity Δ (↓ better) | ${averageSemanticDelta ?? "—"} |`,
    `| Unique-analysis signals gained | ${uniqueGained} |`,
    `| Data blockers | ${dataBlockers} |`,
    `| Evidence blockers | ${evidenceBlockers} |`,
    `| Average quality delta | ${averageQualityDelta ?? "—"} |`,
    `| Factory IMPROVE remaining (approx) | ${factoryRemaining} |`,
    `| Already processed (excluded) | ${excludedAlreadyProcessed} |`,
    "",
    "## Notes",
    "",
    "- Pages failing “why exist separately?” stay IMPROVE without rewrite.",
    "- Semantic uniqueness requires distinct thesis/fit/limitations — not name/price swaps.",
    "- Lane A empty for factory IMPROVE (no GSC demand in opportunity export); Lane B commercial packs prioritized.",
    "",
    "## Pages",
    "",
  ];
  for (const p of wavePages) {
    md.push(
      `- \`${p.slug}\` [${p.lane}/${p.packKind}] applied=${p.applied} Δq=${p.qualityDelta ?? "—"} risk ${p.semanticRiskBefore}→${p.semanticRiskAfter} (sim ${p.maxSimilarityBefore?.toFixed(2) ?? "—"}→${p.maxSimilarityAfter?.toFixed(2) ?? "—"}) uniq+${p.uniqueSignalsGained} promoted=${p.promoted} — ${p.userJob}`,
    );
  }
  md.push("");
  const mdPath = path.join(
    ROOT,
    "docs/seo",
    `FACTORY-PACK-WAVE-${summary.wave.replace(/^factory-pack-/, "")}.md`,
  );
  writeFileSync(mdPath, md.join("\n"), "utf8");

  console.log("\n════════ WAVE REPORT ════════");
  console.log(`processed: ${processed}`);
  console.log(`materially improved: ${materiallyImproved}`);
  console.log(`promoted: ${promoted}`);
  console.log(`remaining improve: ${remainingImprove}`);
  console.log(`semantic failure: ${semanticFailure}`);
  console.log(`semantic risk reduced: ${semanticRiskReduced}`);
  console.log(`still high risk: ${stillHighRisk}`);
  console.log(`average semantic Δ: ${averageSemanticDelta ?? "—"}`);
  console.log(`unique signals gained: ${uniqueGained}`);
  console.log(`data blockers: ${dataBlockers}`);
  console.log(`evidence blockers: ${evidenceBlockers}`);
  console.log(`average quality delta: ${averageQualityDelta ?? "—"}`);
  console.log(`factory IMPROVE remaining ≈ ${factoryRemaining}`);
  console.log(`Wrote ${jsonPath}`);
  console.log(`Wrote ${mdPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
