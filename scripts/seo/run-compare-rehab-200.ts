#!/usr/bin/env npx tsx
/**
 * Progressive comparison estate rehabilitation — next 200 IMPROVE compares.
 *
 *   npx tsx scripts/seo/run-compare-rehab-200.ts
 *   npx tsx scripts/seo/run-compare-rehab-200.ts --limit 200 --batch-size 25
 *   npx tsx scripts/seo/run-compare-rehab-200.ts --from-batch 3
 *
 * After EVERY batch of 25:
 *   enrich → semantic/family QA → quality gate → linking → promote
 *   → comparison audit → knowledge graph → sitemap reconciliation
 *
 * Does not create new comparison URLs. Does not delete existing compares.
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { analyzeKnowledgeGraph } from "@/services/seo/knowledge-graph/analyze";
import { runCompareIndexAudit } from "@/services/seo/compare-index-worthiness";
import { runImproveBatchLinking } from "@/services/seo/improve-linking";
import {
  buildCompareEnrichmentQueue,
  runCompareEnrichmentBatch,
} from "@/services/seo/compare-enrichment";
import {
  loadContentLifecycleStoreFromDisk,
  persistContentLifecycleStore,
} from "@/services/seo/content-lifecycle/store-write";
import {
  analyzePageQualityGate,
  recordGateResult,
} from "@/services/content-quality/gate";

const ROOT = process.cwd();
const WAVE_DATE = new Date().toISOString().slice(0, 10);
const WAVE_ID = `compare-rehab-200-${WAVE_DATE}`;
const OUT_DIR = path.join(ROOT, "data/seo/batches", WAVE_ID);
const MD_PATH = path.join(ROOT, "docs/seo", `COMPARE-REHAB-200-${WAVE_DATE}.md`);
const PRIOR_WAVE_DIRS = [
  "compare-rehab-200-2026-09-07",
];

const DEFAULT_LIMIT = 200;
const DEFAULT_BATCH = 25;

/** Prefer indexable-strength relationships; weak mesh goes last. */
const STRONG_RELATIONSHIPS = new Set([
  "declared_competitor",
  "declared_alternative",
  "declared_comparable",
  "data_backed_comparable",
]);

const WEAK_RELATIONSHIPS = new Set(["same_category_only"]);

function loadPriorWaveSlugs(): Set<string> {
  const out = new Set<string>();
  for (const dir of PRIOR_WAVE_DIRS) {
    const p = path.join(ROOT, "data/seo/batches", dir, "selected.json");
    if (!existsSync(p)) continue;
    try {
      const rows = JSON.parse(readFileSync(p, "utf8")) as Array<{ slug?: string }>;
      for (const r of rows) if (r.slug) out.add(r.slug);
    } catch {
      // ignore
    }
  }
  // Also exclude any other compare-rehab waves already on disk
  const batchesRoot = path.join(ROOT, "data/seo/batches");
  if (existsSync(batchesRoot)) {
    for (const name of readdirSync(batchesRoot)) {
      if (!name.startsWith("compare-rehab-200-") || name === WAVE_ID) continue;
      const p = path.join(batchesRoot, name, "selected.json");
      if (!existsSync(p)) continue;
      try {
        const rows = JSON.parse(readFileSync(p, "utf8")) as Array<{ slug?: string }>;
        for (const r of rows) if (r.slug) out.add(r.slug);
      } catch {
        // ignore
      }
    }
  }
  return out;
}

const SYSTEMIC = {
  minApplyRate: 0.25,
  maxSemanticBlockRate: 0.9,
  maxAvgQualityDrop: -10,
};

const INVALID_RELATIONSHIPS = new Set([
  "cross_category_undeclared",
  "missing_product",
]);

type PageResult = {
  slug: string;
  categorySlug: string | null;
  relationshipKind: string;
  lane: string;
  thesis: string | null;
  applied: boolean;
  promoted: boolean;
  stillImprove: boolean;
  manualReview: boolean;
  invalidRelationship: boolean;
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
  invalidRelationships: number;
  familyQaFlagged: boolean;
  semanticBlocked: number;
  avgQualityDelta: number;
  systemicStop: string | null;
  postBatch: {
    compareAuditOk: boolean;
    knowledgeGraphOk: boolean;
    sitemapReconcileOk: boolean;
  };
  pages: PageResult[];
};

function argValue(args: string[], name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

function topBlockers(pages: PageResult[]): Array<{ reason: string; count: number }> {
  const counts = new Map<string, number>();
  for (const p of pages) {
    if (p.invalidRelationship) {
      counts.set("invalid_relationship", (counts.get("invalid_relationship") ?? 0) + 1);
    }
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

function categoryPromoRates(pages: PageResult[]) {
  const by = new Map<string, { promoted: number; n: number }>();
  for (const p of pages) {
    const cat = p.categorySlug || "unknown";
    const cur = by.get(cat) ?? { promoted: 0, n: 0 };
    cur.n += 1;
    if (p.promoted) cur.promoted += 1;
    by.set(cat, cur);
  }
  return [...by.entries()]
    .map(([category, v]) => ({
      category,
      rate: v.n ? v.promoted / v.n : 0,
      n: v.n,
      promoted: v.promoted,
    }))
    .sort((a, b) => b.rate - a.rate || b.n - a.n);
}

function runPostBatchAudits(batchIndex: number): BatchResult["postBatch"] {
  const result = {
    compareAuditOk: false,
    knowledgeGraphOk: false,
    sitemapReconcileOk: false,
  };
  try {
    execSync("npm run seo:compare-audit", {
      cwd: ROOT,
      stdio: "pipe",
      timeout: 180_000,
    });
    result.compareAuditOk = true;
  } catch (e) {
    console.error(`Batch ${batchIndex}: compare-audit failed`, e);
  }
  try {
    analyzeKnowledgeGraph({ write: true, lightQa: true });
    result.knowledgeGraphOk = true;
  } catch (e) {
    console.error(`Batch ${batchIndex}: knowledge-graph failed`, e);
  }
  try {
    // Compare sitemap eligibility is enforced via lifecycle + compare audit;
    // also refresh guides sitemap reconciliation as estate integrity check.
    execSync("npx tsx scripts/seo/reconcile-guides-sitemap.ts", {
      cwd: ROOT,
      stdio: "pipe",
      timeout: 120_000,
    });
    result.sitemapReconcileOk = true;
  } catch (e) {
    console.error(`Batch ${batchIndex}: sitemap reconcile failed`, e);
  }
  return result;
}

function processBatch(
  batchIndex: number,
  slugs: string[],
  queueMeta: Map<
    string,
    {
      lane: string;
      relationshipKind: string;
      categorySlug: string | null;
      thesis: string | null;
    }
  >,
): BatchResult {
  loadContentLifecycleStoreFromDisk();

  const beforeScores = new Map<string, number>();
  for (const slug of slugs) {
    const gate = analyzePageQualityGate({ pageType: "comparison", slug });
    if (gate) {
      beforeScores.set(slug, gate.qualityScore);
      recordGateResult(gate, "before", {
        note: `${WAVE_ID}:batch${batchIndex}:before:${slug}`,
      });
    }
  }

  const enrich = runCompareEnrichmentBatch({
    slugs,
    apply: true,
    promote: true,
    persistFamilyQa: true,
    allocateByLane: false,
  });
  persistContentLifecycleStore();

  const linkPages = slugs.map((slug) => {
    const gate = analyzePageQualityGate({ pageType: "comparison", slug });
    return {
      pageType: "comparison" as const,
      slug,
      path: `/compare/${slug}/`,
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

  loadContentLifecycleStoreFromDisk();
  const rePromote = runCompareEnrichmentBatch({
    slugs,
    apply: false,
    promote: true,
    persistFamilyQa: true,
    allocateByLane: false,
  });
  persistContentLifecycleStore();

  const promotedSet = new Set([...enrich.promoted, ...rePromote.promoted]);
  const skipMap = new Map<string, string[]>();
  for (const s of [...enrich.skippedPromotion, ...rePromote.skippedPromotion]) {
    skipMap.set(s.slug, [...(skipMap.get(s.slug) ?? []), ...s.reasons]);
  }
  const appliedSet = new Set(
    enrich.applied.filter((a) => a.applied).map((a) => a.slug),
  );

  const pages: PageResult[] = [];
  let semanticBlocked = 0;
  let invalidRelationships = 0;
  const deltas: number[] = [];

  for (const slug of slugs) {
    const gate = analyzePageQualityGate({ pageType: "comparison", slug });
    if (gate) {
      recordGateResult(gate, "after", {
        note: `${WAVE_ID}:batch${batchIndex}:after:${slug}`,
      });
    }
    const meta = queueMeta.get(slug);
    const rel = meta?.relationshipKind ?? "unknown";
    const invalid = INVALID_RELATIONSHIPS.has(rel);
    if (invalid) invalidRelationships += 1;

    const before = beforeScores.get(slug) ?? null;
    const after = gate?.qualityScore ?? null;
    const delta = before != null && after != null ? after - before : null;
    if (delta != null) deltas.push(delta);

    const reasons = skipMap.get(slug) ?? [];
    const sem =
      reasons.some((r) => /SEMANTIC_TEMPLATE|INSUFFICIENT|differentiation/i.test(r)) ||
      gate?.failures?.some((f) =>
        /semantic|template|nonsensical/i.test(String(f.code ?? f.message)),
      );
    if (sem) semanticBlocked += 1;

    const life = gate?.lifecycleState ?? "IMPROVE";
    pages.push({
      slug,
      categorySlug: meta?.categorySlug ?? null,
      relationshipKind: rel,
      lane: meta?.lane ?? "B",
      thesis: meta?.thesis ?? null,
      applied: appliedSet.has(slug),
      promoted: promotedSet.has(slug) || life === "INDEXABLE",
      stillImprove: life === "IMPROVE" || life === "IMPROVING",
      manualReview: life === "MANUAL_REVIEW" || life === "READY_FOR_REVIEW",
      invalidRelationship: invalid,
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
  const promoRate = slugs.length
    ? pages.filter((p) => p.promoted).length / slugs.length
    : 0;

  let systemicStop: string | null = null;
  // Invalid-relationship-heavy batches are expected to apply poorly — stop only
  // when valid pages also fail enrichment.
  const validPages = pages.filter((p) => !p.invalidRelationship);
  const validApplyRate = validPages.length
    ? validPages.filter((p) => p.applied).length / validPages.length
    : applyRate;
  if (validPages.length >= 5 && validApplyRate < SYSTEMIC.minApplyRate) {
    systemicStop = `Valid-page apply rate ${(validApplyRate * 100).toFixed(0)}% < ${SYSTEMIC.minApplyRate * 100}%`;
  } else if (
    semRate > SYSTEMIC.maxSemanticBlockRate &&
    appliedSet.size > 0 &&
    validApplyRate < 0.5
  ) {
    systemicStop = `Semantic block rate ${(semRate * 100).toFixed(0)}% with weak apply — skeletons failing`;
  } else if (avgQualityDelta < SYSTEMIC.maxAvgQualityDrop) {
    systemicStop = `Average quality Δ ${avgQualityDelta} too low`;
  } else if (familyQaFlagged && promoRate < 0.15 && validApplyRate < 0.5) {
    systemicStop = `Family QA + low apply/promo — enrichment skeletons not differentiating`;
  } else if (promoRate < 0.2) {
    // Apply-first wave: semantic sibling cluster often blocks promote until
    // more peers have unique overlays. Continue applying; final re-promote later.
    console.warn(
      `Low promotion ${(promoRate * 100).toFixed(0)}% after apply ${appliedSet.size}/${slugs.length} — continue (final re-promote pass planned)`,
    );
  } else if (familyQaFlagged) {
    console.warn(
      `Family QA flagged (promo ${(promoRate * 100).toFixed(0)}%) — continue with caution`,
    );
  }

  const postBatch = runPostBatchAudits(batchIndex);

  return {
    batchIndex,
    slugs,
    applied: appliedSet.size,
    promoted: pages.filter((p) => p.promoted).length,
    linksAdded: linking.applied.length,
    invalidRelationships,
    familyQaFlagged,
    semanticBlocked,
    avgQualityDelta,
    systemicStop,
    postBatch,
    pages,
  };
}

function writeReport(
  batches: BatchResult[],
  selected: Array<{
    slug: string;
    lane: string;
    relationshipKind: string;
    categorySlug: string | null;
    thesis: string | null;
  }>,
  stoppedEarly: boolean,
  stopReason: string | null,
): void {
  const allPages = batches.flatMap((b) => b.pages);
  const processed = allPages.length;
  const improved = allPages.filter((p) => p.applied).length;
  const promoted = allPages.filter((p) => p.promoted).length;
  const stillImprove = allPages.filter((p) => p.stillImprove && !p.promoted).length;
  const manual = allPages.filter((p) => p.manualReview).length;
  const invalid = allPages.filter((p) => p.invalidRelationship).length;
  const deltas = allPages
    .map((p) => p.qualityDelta)
    .filter((d): d is number => d != null);
  const avgDelta =
    deltas.length === 0
      ? 0
      : Number((deltas.reduce((a, b) => a + b, 0) / deltas.length).toFixed(2));
  const blockers = topBlockers(allPages);
  const cats = categoryPromoRates(allPages);

  const summary = {
    generatedAt: new Date().toISOString(),
    waveId: WAVE_ID,
    selected: selected.length,
    processed,
    improved,
    promoted,
    stillImprove,
    manualReview: manual,
    invalidRelationships: invalid,
    averageQualityDelta: avgDelta,
    promotionRate: processed ? Number((promoted / processed).toFixed(4)) : 0,
    internalLinksAdded: batches.reduce((s, b) => s + b.linksAdded, 0),
    batchesCompleted: batches.length,
    stoppedEarly,
    stopReason,
    topBlockers: blockers,
    mostSuccessfulCategories: cats.slice(0, 8),
    leastSuccessfulCategories: [...cats].sort((a, b) => a.rate - b.rate).slice(0, 5),
    batches: batches.map((b) => ({
      batchIndex: b.batchIndex,
      applied: b.applied,
      promoted: b.promoted,
      linksAdded: b.linksAdded,
      invalidRelationships: b.invalidRelationships,
      familyQaFlagged: b.familyQaFlagged,
      semanticBlocked: b.semanticBlocked,
      avgQualityDelta: b.avgQualityDelta,
      systemicStop: b.systemicStop,
      postBatch: b.postBatch,
    })),
    pages: allPages,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(path.join(OUT_DIR, "summary.json"), JSON.stringify(summary, null, 2));
  writeFileSync(path.join(OUT_DIR, "selected.json"), JSON.stringify(selected, null, 2));

  const md = [
    `# Comparison estate rehabilitation — next 200 (${WAVE_DATE})`,
    "",
    "Existing `/compare/` URLs only. Batches of 25. No new combinations. No deletes.",
    "Selection: Lane A → B → C with real GSC + competitor/commercial signals; prior-wave slugs excluded.",
    "",
    stoppedEarly
      ? `**Stopped early after batch ${batches.length}:** ${stopReason}`
      : "**Completed full wave.**",
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
    `| Invalid relationships | ${invalid} |`,
    `| Manual review | ${manual} |`,
    `| Average quality Δ | ${avgDelta} |`,
    `| Promotion rate | ${((summary.promotionRate as number) * 100).toFixed(1)}% |`,
    `| Internal links added | ${summary.internalLinksAdded} |`,
    `| Batches completed | ${batches.length} |`,
    "",
    "## Top blockers",
    "",
    ...(blockers.length
      ? blockers.map((b) => `- **${b.count}×** ${b.reason}`)
      : ["- None"]),
    "",
    "## Most successful comparison categories",
    "",
    ...cats.slice(0, 8).map(
      (c) =>
        `- ${c.category}: ${(c.rate * 100).toFixed(0)}% (${c.promoted}/${c.n})`,
    ),
    "",
    "## Batch log",
    "",
    `| Batch | Applied | Promoted | Invalid | Links | Sem | Δ | Family | Audits | Stop |`,
    `| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |`,
    ...batches.map((b) => {
      const audits = [
        b.postBatch.compareAuditOk ? "cmp" : "cmp!",
        b.postBatch.knowledgeGraphOk ? "kg" : "kg!",
        b.postBatch.sitemapReconcileOk ? "sm" : "sm!",
      ].join("/");
      return `| ${b.batchIndex} | ${b.applied} | ${b.promoted} | ${b.invalidRelationships} | ${b.linksAdded} | ${b.semanticBlocked} | ${b.avgQualityDelta} | ${b.familyQaFlagged ? "FLAG" : "ok"} | ${audits} | ${b.systemicStop ? "YES" : ""} |`;
    }),
    "",
    "## Process notes (next 200)",
    "",
    "- Require a clear buyer question (thesis) before treating a pair as promote-ready.",
    "- Prefer declared/data-backed relationships; keep `same_category_only` as IMPROVE unless evidence upgrades.",
    "- Capability cells: YES / NO / PARTIAL / UNKNOWN — never map missing→NO.",
    "- Evidence disclaimers must stay asymmetric when only one product is hands-on tested.",
    "- Re-promote after improve-linking; load lifecycle before queueing.",
    "- Invalid relationships (cross_category_undeclared) stay IMPROVE — do not fabricate comparability.",
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

  const selectedPath = path.join(OUT_DIR, "selected.json");
  type SelectedRow = {
    slug: string;
    lane: string;
    relationshipKind: string;
    categorySlug: string | null;
    thesis: string | null;
    priorityScore: number;
    reason: string;
    gscImpressions: number;
  };

  let selected: SelectedRow[];
  const refreshSelection = args.includes("--refresh-selection");
  if (!refreshSelection && existsSync(selectedPath)) {
    selected = JSON.parse(readFileSync(selectedPath, "utf8")) as SelectedRow[];
    console.log(`Using frozen selection (${selected.length} from disk)`);
  } else {
    // Prefer valid + strong relationships; diversify categories; skip prior waves.
    const prior = loadPriorWaveSlugs();
    console.log(`Excluding ${prior.size} slugs from prior compare-rehab waves`);
    const queue = buildCompareEnrichmentQueue({ allocateByLane: false }).filter(
      (q) => !prior.has(q.slug),
    );
    const preferredStrong = queue.filter(
      (q) =>
        !INVALID_RELATIONSHIPS.has(q.relationshipKind) &&
        !WEAK_RELATIONSHIPS.has(q.relationshipKind) &&
        (STRONG_RELATIONSHIPS.has(q.relationshipKind) || Boolean(q.thesisPreview)),
    );
    const preferredWeak = queue.filter(
      (q) =>
        !INVALID_RELATIONSHIPS.has(q.relationshipKind) &&
        WEAK_RELATIONSHIPS.has(q.relationshipKind),
    );
    const preferredOther = queue.filter(
      (q) =>
        !INVALID_RELATIONSHIPS.has(q.relationshipKind) &&
        !WEAK_RELATIONSHIPS.has(q.relationshipKind) &&
        !preferredStrong.includes(q),
    );
    const invalidTail = queue.filter((q) =>
      INVALID_RELATIONSHIPS.has(q.relationshipKind),
    );

    function diversifyByCategory<
      T extends {
        categorySlug: string | null;
        lane: string;
        priorityScore: number;
      },
    >(items: T[]): T[] {
      const byCat = new Map<string, T[]>();
      for (const item of items) {
        const key = `${item.lane}:${item.categorySlug || "unknown"}`;
        const bucket = byCat.get(key) ?? [];
        bucket.push(item);
        byCat.set(key, bucket);
      }
      for (const bucket of byCat.values()) {
        bucket.sort((a, b) => b.priorityScore - a.priorityScore);
      }
      const keys = [...byCat.keys()].sort();
      const out: T[] = [];
      let added = true;
      while (added) {
        added = false;
        for (const key of keys) {
          const bucket = byCat.get(key)!;
          if (bucket.length) {
            out.push(bucket.shift()!);
            added = true;
          }
        }
      }
      return out;
    }

    const ordered = [
      ...diversifyByCategory(preferredStrong),
      ...diversifyByCategory(preferredOther),
      ...diversifyByCategory(preferredWeak),
      ...invalidTail,
    ];
    selected = ordered.slice(0, limit).map((q) => ({
      slug: q.slug,
      lane: q.lane,
      relationshipKind: q.relationshipKind,
      categorySlug: q.categorySlug,
      thesis: q.thesisPreview,
      priorityScore: q.priorityScore,
      reason: q.orderingReason,
      gscImpressions: q.prioritySignals.gscImpressions,
    }));
    writeFileSync(selectedPath, JSON.stringify(selected, null, 2));
  }

  console.log(
    `Selected ${selected.length}. Lanes A=${selected.filter((s) => s.lane === "A").length} B=${selected.filter((s) => s.lane === "B").length} C=${selected.filter((s) => s.lane === "C").length}; invalid=${selected.filter((s) => INVALID_RELATIONSHIPS.has(s.relationshipKind)).length}`,
  );

  const meta = new Map(
    selected.map((s) => [
      s.slug,
      {
        lane: s.lane,
        relationshipKind: s.relationshipKind,
        categorySlug: s.categorySlug,
        thesis: s.thesis,
      },
    ]),
  );

  const batches: BatchResult[] = [];
  const statePath = path.join(OUT_DIR, "progress.json");
  if (fromBatch > 1 && existsSync(statePath)) {
    const prev = JSON.parse(readFileSync(statePath, "utf8")) as {
      batches: BatchResult[];
    };
    batches.push(
      ...(prev.batches ?? []).filter((b) => b.batchIndex < fromBatch),
    );
  }

  let stopReason: string | null = null;
  const totalBatches = Math.ceil(selected.length / batchSize);

  for (let i = fromBatch; i <= totalBatches; i++) {
    const start = (i - 1) * batchSize;
    const chunk = selected.slice(start, start + batchSize);
    if (!chunk.length) break;

    console.log(`\n=== Batch ${i}/${totalBatches} (${chunk.length} compares) ===`);
    // Warm compare audit inventory once early is expensive; post-batch handles it.
    void runCompareIndexAudit;
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
      `Batch ${i}: applied=${result.applied} promoted=${result.promoted} invalid=${result.invalidRelationships} links=${result.linksAdded} Δ=${result.avgQualityDelta} family=${result.familyQaFlagged ? "FLAG" : "ok"} audits=${result.postBatch.compareAuditOk}/${result.postBatch.knowledgeGraphOk}/${result.postBatch.sitemapReconcileOk}`,
    );

    if (result.systemicStop) {
      stopReason = result.systemicStop;
      console.error(`SYSTEMIC STOP after batch ${i}: ${stopReason}`);
      break;
    }
  }

  writeReport(batches, selected, Boolean(stopReason), stopReason);

  // Final re-promote in chunks of 25 (full-wave pass is too slow / can hang).
  console.log("\n=== Final re-promote pass across wave slugs (chunks of 25) ===");
  const allSlugs = selected.map((s) => s.slug);
  const finalPromoted: string[] = [];
  const finalSkipped: Array<{ slug: string; reasons: string[] }> = [];
  for (let i = 0; i < allSlugs.length; i += batchSize) {
    const chunk = allSlugs.slice(i, i + batchSize);
    const chunkIdx = Math.floor(i / batchSize) + 1;
    console.log(`Re-promote chunk ${chunkIdx} (${chunk.length})`);
    loadContentLifecycleStoreFromDisk();
    // Ensure link injections exist before promote attempt.
    const linkPages = chunk.map((slug) => ({
      pageType: "comparison" as const,
      slug,
      path: `/compare/${slug}/`,
      beforeQuality: 70,
      afterQuality: 80,
      materiallyImproved: true,
      uniqueValueCount: 4,
      lifecycleState: "IMPROVE",
      stillBlocked: true,
    }));
    runImproveBatchLinking({
      batchId: `${WAVE_ID}-final-link-${chunkIdx}`,
      pages: linkPages,
      dryRun: false,
      light: false,
      skipGraphSnapshots: true,
      write: true,
    });
    loadContentLifecycleStoreFromDisk();
    const pass = runCompareEnrichmentBatch({
      slugs: chunk,
      apply: false,
      promote: true,
      persistFamilyQa: false,
      allocateByLane: false,
    });
    persistContentLifecycleStore();
    finalPromoted.push(...pass.promoted);
    finalSkipped.push(...pass.skippedPromotion);
    console.log(
      `  chunk ${chunkIdx}: promoted=${pass.promoted.length} skipped=${pass.skippedPromotion.length}`,
    );
  }
  writeFileSync(
    path.join(OUT_DIR, "final-repromote.json"),
    JSON.stringify(
      {
        promoted: finalPromoted,
        skippedPromotion: finalSkipped.slice(0, 120),
        promotedCount: finalPromoted.length,
        skippedCount: finalSkipped.length,
      },
      null,
      2,
    ),
  );

  // Refresh summary promo counts from lifecycle after re-promote
  if (existsSync(path.join(OUT_DIR, "summary.json"))) {
    const summary = JSON.parse(
      readFileSync(path.join(OUT_DIR, "summary.json"), "utf8"),
    ) as Record<string, unknown>;
    summary.finalRepromotePromoted = finalPromoted.length;
    summary.finalRepromoteSkipped = finalSkipped.length;
    // Recount promoted from latest batch pages + final promote set
    const promoSet = new Set(finalPromoted);
    if (Array.isArray(summary.pages)) {
      for (const p of summary.pages as Array<Record<string, unknown>>) {
        if (promoSet.has(String(p.slug))) {
          p.promoted = true;
          p.stillImprove = false;
        }
      }
      const pages = summary.pages as Array<{ promoted?: boolean; stillImprove?: boolean }>;
      summary.promoted = pages.filter((p) => p.promoted).length;
      summary.stillImprove = pages.filter((p) => p.stillImprove && !p.promoted).length;
      summary.promotionRate = pages.length
        ? Number(((summary.promoted as number) / pages.length).toFixed(4))
        : 0;
    }
    writeFileSync(
      path.join(OUT_DIR, "summary.json"),
      JSON.stringify(summary, null, 2),
    );
  }

  console.error(`Wrote ${MD_PATH}`);
  console.error(`Final promoted this pass: ${finalPromoted.length}`);
}

main();
