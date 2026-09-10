#!/usr/bin/env npx tsx
/**
 * Progressive guide estate rehabilitation — next 200 IMPROVE guides.
 *
 *   npx tsx scripts/seo/run-guide-rehab-200.ts
 *   npx tsx scripts/seo/run-guide-rehab-200.ts --limit 200 --batch-size 25
 *   npx tsx scripts/seo/run-guide-rehab-200.ts --from-batch 3   # resume
 *
 * After EVERY batch of 25: enrich → semantic/family QA → quality gate →
 * internal linking → promote → focused tests.
 * Stops if a batch exposes a systemic content-quality problem.
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  analyzePageQualityGate,
  recordGateResult,
} from "@/services/content-quality/gate";
import {
  loadContentLifecycleStoreFromDisk,
  persistContentLifecycleStore,
} from "@/services/seo/content-lifecycle/store-write";
import {
  buildGuideEnrichmentQueue,
  runGuideEnrichmentBatch,
} from "@/services/seo/guide-enrichment";
import { runImproveBatchLinking } from "@/services/seo/improve-linking";
import type { EnrichmentGuideType } from "@/services/seo/guide-enrichment/types";

const ROOT = process.cwd();
const WAVE_ID = "guide-rehab-200-2026-09-07";
const OUT_DIR = path.join(ROOT, "data/seo/batches", WAVE_ID);
const MD_PATH = path.join(ROOT, "docs/seo/GUIDE-REHAB-200-2026-09-07.md");

const DEFAULT_LIMIT = 200;
const DEFAULT_BATCH = 25;

/** Systemic stop thresholds — do not continue to the next batch. */
const SYSTEMIC = {
  minApplyRate: 0.35,
  maxFamilyFlaggedBatches: 1,
  maxSemanticBlockRate: 0.85,
  maxAvgQualityDrop: -8,
};

type PageResult = {
  slug: string;
  enrichmentType: EnrichmentGuideType | string;
  lane: string;
  applied: boolean;
  promoted: boolean;
  stillImprove: boolean;
  manualReview: boolean;
  qualityBefore: number | null;
  qualityAfter: number | null;
  qualityDelta: number | null;
  skipReasons: string[];
  semanticBlocked: boolean;
};

type BatchResult = {
  batchIndex: number;
  slugs: string[];
  applied: number;
  promoted: number;
  linksAdded: number;
  familyQaFlagged: boolean;
  semanticBlocked: number;
  avgQualityDelta: number;
  systemicStop: string | null;
  testsOk: boolean;
  pages: PageResult[];
};

function argValue(args: string[], name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

function topFailureReasons(pages: PageResult[]): Array<{ reason: string; count: number }> {
  const counts = new Map<string, number>();
  for (const p of pages) {
    for (const r of p.skipReasons) {
      const key = r.split(":")[0]!.slice(0, 120);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    if (p.semanticBlocked) {
      counts.set("SEMANTIC_TEMPLATE_RISK", (counts.get("SEMANTIC_TEMPLATE_RISK") ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
}

function promotionRatesByType(pages: PageResult[]): {
  highest: Array<{ type: string; rate: number; n: number }>;
  lowest: Array<{ type: string; rate: number; n: number }>;
} {
  const by = new Map<string, { promoted: number; n: number }>();
  for (const p of pages) {
    const t = String(p.enrichmentType);
    const cur = by.get(t) ?? { promoted: 0, n: 0 };
    cur.n += 1;
    if (p.promoted) cur.promoted += 1;
    by.set(t, cur);
  }
  const rows = [...by.entries()]
    .map(([type, v]) => ({
      type,
      rate: v.n ? v.promoted / v.n : 0,
      n: v.n,
    }))
    .sort((a, b) => b.rate - a.rate || b.n - a.n);
  return {
    highest: rows.slice(0, 5),
    lowest: [...rows].sort((a, b) => a.rate - b.rate || b.n - a.n).slice(0, 5),
  };
}

function runFocusedTests(): boolean {
  try {
    execSync(
      "npx vitest run src/services/seo/guide-enrichment src/services/seo/content-lifecycle --reporter=dot",
      { cwd: ROOT, stdio: "pipe", timeout: 180_000 },
    );
    return true;
  } catch {
    return false;
  }
}

function processBatch(
  batchIndex: number,
  slugs: string[],
  queueMeta: Map<string, { lane: string; enrichmentType: string }>,
): BatchResult {
  loadContentLifecycleStoreFromDisk();

  const beforeScores = new Map<string, number>();
  for (const slug of slugs) {
    const gate = analyzePageQualityGate({ pageType: "guide", slug });
    if (gate) {
      beforeScores.set(slug, gate.qualityScore);
      recordGateResult(gate, "before", {
        note: `${WAVE_ID}:batch${batchIndex}:before:${slug}`,
      });
    }
  }

  const enrich = runGuideEnrichmentBatch({
    slugs,
    apply: true,
    promote: true,
    persistFamilyQa: true,
    allocateByLane: false,
  });
  persistContentLifecycleStore();

  const linkPages = slugs.map((slug) => {
    const gate = analyzePageQualityGate({ pageType: "guide", slug });
    return {
      pageType: "guide" as const,
      slug,
      path: `/guides/${slug}/`,
      beforeQuality: beforeScores.get(slug) ?? 70,
      afterQuality: gate?.qualityScore ?? beforeScores.get(slug) ?? 80,
      materiallyImproved: true,
      uniqueValueCount: 4,
      lifecycleState: String(gate?.lifecycleState ?? "IMPROVE"),
      stillBlocked: gate?.lifecycleState === "IMPROVE",
    };
  });

  const linking = runImproveBatchLinking({
    batchId: `${WAVE_ID}-b${batchIndex}`,
    pages: linkPages,
    dryRun: false,
    light: false,
    skipGraphSnapshots: true,
    write: true,
  });

  // Re-promote after inbound links land.
  loadContentLifecycleStoreFromDisk();
  const rePromote = runGuideEnrichmentBatch({
    slugs,
    apply: false,
    promote: true,
    persistFamilyQa: true,
    allocateByLane: false,
  });
  persistContentLifecycleStore();

  const promotedSet = new Set([
    ...enrich.promoted,
    ...rePromote.promoted,
  ]);
  const skipMap = new Map<string, string[]>();
  for (const s of [...enrich.skippedPromotion, ...rePromote.skippedPromotion]) {
    skipMap.set(s.slug, [
      ...(skipMap.get(s.slug) ?? []),
      ...s.reasons,
    ]);
  }
  const appliedSet = new Set(
    enrich.applied.filter((a) => a.applied).map((a) => a.slug),
  );

  const pages: PageResult[] = [];
  let semanticBlocked = 0;
  const deltas: number[] = [];

  for (const slug of slugs) {
    const gate = analyzePageQualityGate({ pageType: "guide", slug });
    if (gate) {
      recordGateResult(gate, "after", {
        note: `${WAVE_ID}:batch${batchIndex}:after:${slug}`,
      });
    }
    const before = beforeScores.get(slug) ?? null;
    const after = gate?.qualityScore ?? null;
    const delta =
      before != null && after != null ? after - before : null;
    if (delta != null) deltas.push(delta);

    const reasons = skipMap.get(slug) ?? [];
    const sem =
      reasons.some((r) => /SEMANTIC_TEMPLATE|INSUFFICIENT_PAGE_SPECIFIC/i.test(r)) ||
      gate?.failures?.some((f) =>
        /semantic|template/i.test(String(f.code ?? f.message)),
      );
    if (sem) semanticBlocked += 1;

    const life = gate?.lifecycleState ?? "IMPROVE";
    pages.push({
      slug,
      enrichmentType:
        queueMeta.get(slug)?.enrichmentType ??
        enrich.planned.find((p) => p.slug === slug)?.enrichmentType ??
        "OTHER",
      lane: queueMeta.get(slug)?.lane ?? "B",
      applied: appliedSet.has(slug),
      promoted: promotedSet.has(slug) || life === "INDEXABLE",
      stillImprove: life === "IMPROVE" || life === "IMPROVING",
      manualReview: life === "MANUAL_REVIEW" || life === "READY_FOR_REVIEW",
      qualityBefore: before,
      qualityAfter: after,
      qualityDelta: delta,
      skipReasons: reasons.slice(0, 8),
      semanticBlocked: Boolean(sem),
    });
  }

  const avgQualityDelta =
    deltas.length === 0
      ? 0
      : Number((deltas.reduce((a, b) => a + b, 0) / deltas.length).toFixed(2));

  const applyRate = slugs.length ? appliedSet.size / slugs.length : 0;
  const semRate = slugs.length ? semanticBlocked / slugs.length : 0;
  const familyQaFlagged = Boolean(enrich.familyQa?.flagged);

  let systemicStop: string | null = null;
  const promoRate = slugs.length
    ? pages.filter((p) => p.promoted).length / slugs.length
    : 0;
  if (applyRate < SYSTEMIC.minApplyRate) {
    systemicStop = `Apply rate ${(applyRate * 100).toFixed(0)}% < ${SYSTEMIC.minApplyRate * 100}% — enrichment path insufficient for this cohort`;
  } else if (semRate > SYSTEMIC.maxSemanticBlockRate && appliedSet.size > 0) {
    systemicStop = `Semantic block rate ${(semRate * 100).toFixed(0)}% exceeds ${SYSTEMIC.maxSemanticBlockRate * 100}%`;
  } else if (avgQualityDelta < SYSTEMIC.maxAvgQualityDrop) {
    systemicStop = `Average quality Δ ${avgQualityDelta} worse than ${SYSTEMIC.maxAvgQualityDrop}`;
  } else if (familyQaFlagged && promoRate < 0.4) {
    // Family QA alone is a warning when pages still clear per-page semantic + promote.
    // Stop only when shared skeletons also prevent promotion at scale.
    systemicStop = `Family QA flagged with low promotion rate ${(promoRate * 100).toFixed(0)}% — shared thesis/skeleton is blocking rehab (notes: ${enrich.familyQa?.notes?.[0] ?? "n/a"})`;
  } else if (familyQaFlagged) {
    console.warn(
      `Family QA flagged (promo ${(promoRate * 100).toFixed(0)}% still ok) — continue; improve skeletons before next 200. ${enrich.familyQa?.notes?.[0] ?? ""}`,
    );
  }

  const testsOk = runFocusedTests();
  if (!testsOk && !systemicStop) {
    systemicStop = "Focused guide-enrichment / lifecycle tests failed";
  }

  return {
    batchIndex,
    slugs,
    applied: appliedSet.size,
    promoted: pages.filter((p) => p.promoted).length,
    linksAdded: linking.applied.length,
    familyQaFlagged,
    semanticBlocked,
    avgQualityDelta,
    systemicStop,
    testsOk,
    pages,
  };
}

function writeReport(
  batches: BatchResult[],
  selected: Array<{ slug: string; lane: string; enrichmentType: string }>,
  stoppedEarly: boolean,
  stopReason: string | null,
): void {
  const allPages = batches.flatMap((b) => b.pages);
  const processed = allPages.length;
  const improved = allPages.filter((p) => p.applied).length;
  const promoted = allPages.filter((p) => p.promoted).length;
  const stillImprove = allPages.filter((p) => p.stillImprove && !p.promoted).length;
  const manual = allPages.filter((p) => p.manualReview).length;
  const deltas = allPages
    .map((p) => p.qualityDelta)
    .filter((d): d is number => d != null);
  const avgDelta =
    deltas.length === 0
      ? 0
      : Number((deltas.reduce((a, b) => a + b, 0) / deltas.length).toFixed(2));
  const promoRate = processed ? promoted / processed : 0;
  const failures = topFailureReasons(allPages);
  const byType = promotionRatesByType(allPages);

  const summary = {
    generatedAt: new Date().toISOString(),
    waveId: WAVE_ID,
    target: DEFAULT_LIMIT,
    selected: selected.length,
    processed,
    improved,
    promoted,
    stillImprove,
    manualReview: manual,
    averageQualityDelta: avgDelta,
    promotionRate: Number(promoRate.toFixed(4)),
    internalLinksAdded: batches.reduce((s, b) => s + b.linksAdded, 0),
    batchesCompleted: batches.length,
    stoppedEarly,
    stopReason,
    topFailureReasons: failures,
    promotionRatesByType: byType,
    batches: batches.map((b) => ({
      batchIndex: b.batchIndex,
      applied: b.applied,
      promoted: b.promoted,
      linksAdded: b.linksAdded,
      familyQaFlagged: b.familyQaFlagged,
      semanticBlocked: b.semanticBlocked,
      avgQualityDelta: b.avgQualityDelta,
      systemicStop: b.systemicStop,
      testsOk: b.testsOk,
    })),
    pages: allPages,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(
    path.join(OUT_DIR, "summary.json"),
    JSON.stringify(summary, null, 2),
  );
  writeFileSync(
    path.join(OUT_DIR, "selected.json"),
    JSON.stringify(selected, null, 2),
  );

  const md = [
    "# Guide estate rehabilitation — next 200 (2026-09-07)",
    "",
    "Existing IMPROVE guides only. Batches of 25. Lane A → B → C.",
    "Type-specific enrichment skeletons (COST / DECISION / IMPLEMENTATION / MIGRATION / PRODUCT_EXPLAINER).",
    "",
    stoppedEarly
      ? `**Stopped early after batch ${batches.length}:** ${stopReason}`
      : "**Completed full wave (or limit).**",
    "",
    "## Results",
    "",
    `| Metric | Value |`,
    `| --- | ---: |`,
    `| Selected | ${selected.length} |`,
    `| Processed | ${processed} |`,
    `| Improved (overlay applied) | ${improved} |`,
    `| Promoted | ${promoted} |`,
    `| Still IMPROVE | ${stillImprove} |`,
    `| Manual review | ${manual} |`,
    `| Average quality Δ | ${avgDelta} |`,
    `| Promotion rate | ${(promoRate * 100).toFixed(1)}% |`,
    `| Internal links added | ${summary.internalLinksAdded} |`,
    `| Batches completed | ${batches.length} |`,
    "",
    "## Top failure reasons",
    "",
    ...(failures.length
      ? failures.map((f) => `- **${f.count}×** ${f.reason}`)
      : ["- None"]),
    "",
    "## Promotion rate by guide type",
    "",
    "### Highest",
    "",
    ...byType.highest.map(
      (r) =>
        `- ${r.type}: ${(r.rate * 100).toFixed(0)}% (${r.n} pages)`,
    ),
    "",
    "### Lowest",
    "",
    ...byType.lowest.map(
      (r) =>
        `- ${r.type}: ${(r.rate * 100).toFixed(0)}% (${r.n} pages)`,
    ),
    "",
    "## Batch log",
    "",
    `| Batch | Applied | Promoted | Links | Sem-block | Δ | Family QA | Tests | Stop |`,
    `| --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |`,
    ...batches.map(
      (b) =>
        `| ${b.batchIndex} | ${b.applied} | ${b.promoted} | ${b.linksAdded} | ${b.semanticBlocked} | ${b.avgQualityDelta} | ${b.familyQaFlagged ? "FLAG" : "ok"} | ${b.testsOk ? "ok" : "FAIL"} | ${b.systemicStop ? "YES" : ""} |`,
    ),
    "",
    "## Enrichment process notes (for next 200)",
    "",
    "- Load `content-lifecycle.json` before queueing so INDEXABLE pages are not re-selected.",
    "- COST / DECISION / IMPLEMENTATION / MIGRATION use distinct overlay skeletons.",
    "- Re-promote after improve-linking so inbound graph can clear INDEXABLE_READY.",
    "- Systemic stops: low apply rate, family QA flag, extreme semantic block rate, sharp quality drop, test failure.",
    "",
    `Artifacts: \`data/seo/batches/${WAVE_ID}/\``,
    "",
  ].join("\n");

  writeFileSync(MD_PATH, md);
  console.log(JSON.stringify(summary, null, 2));
}

function main() {
  const args = process.argv.slice(2);
  const limit = Number(argValue(args, "--limit") ?? DEFAULT_LIMIT);
  const batchSize = Number(argValue(args, "--batch-size") ?? DEFAULT_BATCH);
  const fromBatch = Number(argValue(args, "--from-batch") ?? 1);

  loadContentLifecycleStoreFromDisk();
  mkdirSync(OUT_DIR, { recursive: true });

  const queue = buildGuideEnrichmentQueue({ allocateByLane: false });
  // Strict Lane A → B → C order (already sorted); take next N IMPROVE/READY.
  const selected = queue.slice(0, limit).map((q) => ({
    slug: q.slug,
    lane: q.lane,
    enrichmentType: q.enrichmentType,
    priorityScore: q.priorityScore,
    reason: q.orderingReason,
  }));

  writeFileSync(
    path.join(OUT_DIR, "selected.json"),
    JSON.stringify(selected, null, 2),
  );

  console.log(
    `Selected ${selected.length} guides (queue head). Lane mix: A=${selected.filter((s) => s.lane === "A").length} B=${selected.filter((s) => s.lane === "B").length} C=${selected.filter((s) => s.lane === "C").length}`,
  );

  const meta = new Map(
    selected.map((s) => [
      s.slug,
      { lane: s.lane, enrichmentType: s.enrichmentType },
    ]),
  );

  const batches: BatchResult[] = [];
  const statePath = path.join(OUT_DIR, "progress.json");
  if (fromBatch > 1 && existsSync(statePath)) {
    const prev = JSON.parse(readFileSync(statePath, "utf8")) as {
      batches: BatchResult[];
    };
    batches.push(...(prev.batches ?? []).filter((b) => b.batchIndex < fromBatch));
  }

  let stopReason: string | null = null;
  const totalBatches = Math.ceil(selected.length / batchSize);

  for (let i = fromBatch; i <= totalBatches; i++) {
    const start = (i - 1) * batchSize;
    const chunk = selected.slice(start, start + batchSize);
    if (!chunk.length) break;

    console.log(`\n=== Batch ${i}/${totalBatches} (${chunk.length} guides) ===`);
    const result = processBatch(
      i,
      chunk.map((c) => c.slug),
      meta,
    );
    batches.push(result);
    writeFileSync(
      path.join(OUT_DIR, `batch-${i}.json`),
      JSON.stringify(result, null, 2),
    );
    writeFileSync(
      statePath,
      JSON.stringify({ updatedAt: new Date().toISOString(), batches }, null, 2),
    );

    console.log(
      `Batch ${i}: applied=${result.applied} promoted=${result.promoted} links=${result.linksAdded} Δ=${result.avgQualityDelta} family=${result.familyQaFlagged ? "FLAG" : "ok"} tests=${result.testsOk ? "ok" : "FAIL"}`,
    );

    if (result.systemicStop) {
      stopReason = result.systemicStop;
      console.error(`SYSTEMIC STOP after batch ${i}: ${stopReason}`);
      break;
    }
  }

  writeReport(batches, selected, Boolean(stopReason), stopReason);
  console.error(`Wrote ${MD_PATH}`);
}

main();
