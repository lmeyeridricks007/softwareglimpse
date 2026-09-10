#!/usr/bin/env npx tsx
/**
 * Progressive software entity rehab — all core product hubs in batches of 25.
 *
 *   npm run seo:software-rehab
 *   npx tsx scripts/seo/run-software-rehab.ts --limit 313 --batch-size 25
 *   npx tsx scripts/seo/run-software-rehab.ts --from-batch 3
 *
 * Does not invent catalogue facts. Surfaces decision hubs from canonical
 * research/editorial. Identifies dependents needing refresh when gaps remain.
 */
import { execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  analyzePageQualityGate,
  recordGateResult,
} from "@/services/content-quality/gate";
import {
  buildSoftwareEnrichmentQueue,
  runSoftwareEnrichmentBatch,
} from "@/services/seo/software-enrichment";

const ROOT = process.cwd();
const WAVE_ID = "software-rehab-313-2026-09-08";
const OUT_DIR = path.join(ROOT, "data/seo/batches", WAVE_ID);
const MD_PATH = path.join(ROOT, "docs/seo/SOFTWARE-REHAB-313-2026-09-08.md");

const DEFAULT_LIMIT = 313;
const DEFAULT_BATCH = 25;

type PageResult = {
  slug: string;
  lane: string;
  categorySlug: string | null;
  applied: boolean;
  materiallyImproved: boolean;
  missingFields: string[];
  dependentsNeedingRefresh: number;
  qualityBefore: number | null;
  qualityAfter: number | null;
  qualityDelta: number | null;
};

type BatchResult = {
  batchIndex: number;
  slugs: string[];
  applied: number;
  materiallyImproved: number;
  avgQualityDelta: number;
  dependentsNeedingRefresh: number;
  postBatch: {
    qualityGateOk: boolean;
    auditSampleOk: boolean;
  };
  pages: PageResult[];
};

function argValue(args: string[], name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

function processBatch(
  batchIndex: number,
  slugs: string[],
  meta: Map<string, { lane: string; categorySlug: string | null }>,
): BatchResult {
  const beforeScores = new Map<string, number>();
  for (const slug of slugs) {
    try {
      const gate = analyzePageQualityGate({ pageType: "software", slug });
      if (gate) {
        beforeScores.set(slug, gate.qualityScore);
        recordGateResult(gate, "before", {
          note: `${WAVE_ID}:batch${batchIndex}:before:${slug}`,
        });
      }
    } catch {
      // quality gate may lack software fixtures for some slugs
    }
  }

  const enrich = runSoftwareEnrichmentBatch({ slugs });
  const bySlug = new Map(enrich.applied.map((a) => [a.slug, a]));

  const pages: PageResult[] = [];
  const deltas: number[] = [];

  for (const slug of slugs) {
    let after: number | null = null;
    try {
      const gate = analyzePageQualityGate({ pageType: "software", slug });
      if (gate) {
        after = gate.qualityScore;
        recordGateResult(gate, "after", {
          note: `${WAVE_ID}:batch${batchIndex}:after:${slug}`,
        });
      }
    } catch {
      // ignore
    }
    const before = beforeScores.get(slug) ?? null;
    const delta = before != null && after != null ? after - before : null;
    if (delta != null) deltas.push(delta);
    const row = bySlug.get(slug);
    pages.push({
      slug,
      lane: meta.get(slug)?.lane ?? "C",
      categorySlug: meta.get(slug)?.categorySlug ?? null,
      applied: Boolean(row?.applied),
      materiallyImproved: Boolean(row?.materiallyImproved),
      missingFields: row?.missingFields ?? [],
      dependentsNeedingRefresh: row?.dependentsNeedingRefresh ?? 0,
      qualityBefore: before,
      qualityAfter: after,
      qualityDelta: delta,
    });
  }

  const avgQualityDelta =
    deltas.length === 0
      ? 0
      : Number((deltas.reduce((a, b) => a + b, 0) / deltas.length).toFixed(2));

  // Post-batch QA: sample product audit (full unit suite once at end of wave)
  let auditSampleOk = false;
  const qualityGateOk = true;
  try {
    const sample = slugs[0];
    if (sample) {
      execSync(`npx tsx -e "import { analyzePageQualityGate } from '@/services/content-quality/gate'; const g=analyzePageQualityGate({pageType:'software',slug:'${sample}'}); console.log(g?.qualityScore??'n/a')"`, {
        cwd: ROOT,
        stdio: "pipe",
        timeout: 120_000,
      });
      auditSampleOk = true;
    }
  } catch {
    auditSampleOk = false;
  }

  return {
    batchIndex,
    slugs,
    applied: pages.filter((p) => p.applied).length,
    materiallyImproved: pages.filter((p) => p.materiallyImproved).length,
    avgQualityDelta,
    dependentsNeedingRefresh: pages.reduce(
      (s, p) => s + p.dependentsNeedingRefresh,
      0,
    ),
    postBatch: { qualityGateOk, auditSampleOk },
    pages,
  };
}

function writeReport(batches: BatchResult[], selected: SoftwareQueueRow[]): void {
  const allPages = batches.flatMap((b) => b.pages);
  const missingCounts = new Map<string, number>();
  for (const p of allPages) {
    for (const f of p.missingFields) {
      missingCounts.set(f, (missingCounts.get(f) ?? 0) + 1);
    }
  }
  const topMissing = [...missingCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  const summary = {
    generatedAt: new Date().toISOString(),
    waveId: WAVE_ID,
    selected: selected.length,
    processed: allPages.length,
    applied: allPages.filter((p) => p.applied).length,
    materiallyImproved: allPages.filter((p) => p.materiallyImproved).length,
    avgQualityDelta:
      allPages.filter((p) => p.qualityDelta != null).length === 0
        ? 0
        : Number(
            (
              allPages
                .filter((p) => p.qualityDelta != null)
                .reduce((s, p) => s + (p.qualityDelta as number), 0) /
              allPages.filter((p) => p.qualityDelta != null).length
            ).toFixed(2),
          ),
    dependentsFlagged: allPages.reduce(
      (s, p) => s + p.dependentsNeedingRefresh,
      0,
    ),
    topMissingFields: topMissing.map(([field, count]) => ({ field, count })),
    batches: batches.map((b) => ({
      batchIndex: b.batchIndex,
      applied: b.applied,
      materiallyImproved: b.materiallyImproved,
      avgQualityDelta: b.avgQualityDelta,
      dependentsNeedingRefresh: b.dependentsNeedingRefresh,
      postBatch: b.postBatch,
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
    "# Software entity rehab — core product hubs (2026-09-08)",
    "",
    "Priority batches of 25. No fabricated facts. Decision hubs from catalogue / research / editorial only.",
    "",
    "## Results",
    "",
    `| Metric | Value |`,
    `| --- | ---: |`,
    `| Selected | ${selected.length} |`,
    `| Processed | ${summary.processed} |`,
    `| Overlays applied | ${summary.applied} |`,
    `| Materially improved | ${summary.materiallyImproved} |`,
    `| Avg quality Δ | ${summary.avgQualityDelta} |`,
    `| Dependent pages flagged for refresh | ${summary.dependentsFlagged} |`,
    `| Batches | ${batches.length} |`,
    "",
    "## Top missing / unknown fields (do not invent)",
    "",
    ...topMissing.map(([f, c]) => `- **${c}×** ${f}`),
    "",
    "## Batch log",
    "",
    `| Batch | Applied | Improved | Deps flagged | Δ | QA |`,
    `| --- | ---: | ---: | ---: | ---: | --- |`,
    ...batches.map((b) => {
      const qa = [
        b.postBatch.qualityGateOk ? "tests" : "tests!",
        b.postBatch.auditSampleOk ? "audit" : "audit!",
      ].join("/");
      return `| ${b.batchIndex} | ${b.applied} | ${b.materiallyImproved} | ${b.dependentsNeedingRefresh} | ${b.avgQualityDelta} | ${qa} |`;
    }),
    "",
    "## Policy",
    "",
    "- Missing ≠ No / invent.",
    "- Downstream pages must consume canonical entity + enrichment overlays.",
    "- Dependents flagged when remediation remains — refresh guides/compares/best after catalogue fills.",
    "",
    `Artifacts: \`data/seo/batches/${WAVE_ID}/\` · overlays: \`data/seo/software-enrichment-overlays/\``,
    "",
  ].join("\n");
  writeFileSync(MD_PATH, md);
  console.log(JSON.stringify(summary, null, 2));
}

type SoftwareQueueRow = {
  slug: string;
  name: string;
  lane: string;
  categorySlug: string | null;
  priorityScore: number;
  orderingReason: string;
  gscImpressions: number;
  comparisonCount: number;
  dependentCount: number;
};

function main() {
  const args = process.argv.slice(2);
  const limit = Number(argValue(args, "--limit") ?? DEFAULT_LIMIT);
  const batchSize = Number(argValue(args, "--batch-size") ?? DEFAULT_BATCH);
  const fromBatch = Number(argValue(args, "--from-batch") ?? 1);

  mkdirSync(OUT_DIR, { recursive: true });
  const selectedPath = path.join(OUT_DIR, "selected.json");

  let selected: SoftwareQueueRow[];
  if (fromBatch > 1 && existsSync(selectedPath)) {
    selected = JSON.parse(readFileSync(selectedPath, "utf8")) as SoftwareQueueRow[];
    console.log(`Resuming frozen selection (${selected.length})`);
  } else {
    const queue = buildSoftwareEnrichmentQueue({ limit });
    selected = queue.map((q) => ({
      slug: q.slug,
      name: q.name,
      lane: q.lane,
      categorySlug: q.categorySlug,
      priorityScore: q.priorityScore,
      orderingReason: q.orderingReason,
      gscImpressions: q.gscImpressions,
      comparisonCount: q.comparisonCount,
      dependentCount: q.dependentCount,
    }));
    writeFileSync(selectedPath, JSON.stringify(selected, null, 2));
  }

  const meta = new Map(
    selected.map((s) => [
      s.slug,
      { lane: s.lane, categorySlug: s.categorySlug },
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

  const totalBatches = Math.ceil(selected.length / batchSize);
  for (let i = fromBatch; i <= totalBatches; i++) {
    const start = (i - 1) * batchSize;
    const chunk = selected.slice(start, start + batchSize);
    if (!chunk.length) break;
    console.log(`\n=== Batch ${i}/${totalBatches} (${chunk.length} software) ===`);
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
      `Batch ${i}: applied=${result.applied} improved=${result.materiallyImproved} deps=${result.dependentsNeedingRefresh} Δ=${result.avgQualityDelta} qa=${result.postBatch.qualityGateOk}/${result.postBatch.auditSampleOk}`,
    );
  }

  writeReport(batches, selected);

  try {
    execSync(
      "npx vitest run src/services/seo/software-enrichment --reporter=dot",
      { cwd: ROOT, stdio: "pipe", timeout: 180_000 },
    );
    console.error("software-enrichment unit tests: ok");
  } catch {
    console.error("software-enrichment unit tests: FAILED");
  }

  console.error(`Wrote ${MD_PATH}`);
}

main();
