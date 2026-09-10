import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { DEFAULT_LANE_ALLOCATION } from "@/services/seo/enrichment-lanes";
import { buildCompareEnrichmentQueue } from "./queue";
import {
  COMPARE_ENRICHMENT_VERSION,
  DEFAULT_COMPARE_ENRICHMENT_BATCH_SIZE,
  type CompareEnrichmentBatchResult,
  type CompareEnrichmentQueueItem,
  type CompareEnrichmentReport,
} from "./types";

function esc(v: string): string {
  return v.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function laneTable(items: CompareEnrichmentQueueItem[], limit = 25): string {
  const lines = [
    "| Rank | URL | Relationship | Lane | Overall | GSC demand | Strategic | Quality gap | Commercial | Authority | Override | GSC impr. | Reason |",
    "| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |",
  ];
  items.slice(0, limit).forEach((q, i) => {
    lines.push(
      `| ${i + 1} | ${q.url} | ${q.relationshipKind} | ${q.lane} | ${q.overallScore} | ${q.gscDemandScore} | ${q.strategicScore} | ${q.qualityGapScore} | ${q.commercialScore} | ${q.authorityScore} | ${q.strategicOverride ? "yes" : "—"} | ${q.prioritySignals.gscImpressions} | ${esc(q.reason)} |`,
    );
  });
  return lines.join("\n");
}

export function buildCompareEnrichmentReport(): CompareEnrichmentReport {
  const queue = buildCompareEnrichmentQueue();
  const byRel = new Map<string, number>();
  const byLane = new Map<string, number>();
  for (const q of queue) {
    byRel.set(q.relationshipKind, (byRel.get(q.relationshipKind) ?? 0) + 1);
    byLane.set(q.lane, (byLane.get(q.lane) ?? 0) + 1);
  }
  const laneA = queue.filter((q) => q.lane === "A");
  const laneB = queue.filter((q) => q.lane === "B");
  const laneC = queue.filter((q) => q.lane === "C");
  return {
    version: COMPARE_ENRICHMENT_VERSION,
    generatedAt: new Date().toISOString(),
    summary: {
      improveQueueSize: queue.length,
      queued: queue.length,
      byRelationship: [...byRel.entries()]
        .map(([kind, count]) => ({
          kind: kind as CompareEnrichmentReport["summary"]["byRelationship"][number]["kind"],
          count,
        }))
        .sort((a, b) => b.count - a.count),
      byLane: (["A", "B", "C"] as const).map((lane) => ({
        lane,
        count: byLane.get(lane) ?? 0,
      })),
      laneAllocation: { ...DEFAULT_LANE_ALLOCATION },
      batchSizeDefault: DEFAULT_COMPARE_ENRICHMENT_BATCH_SIZE,
      readyForPromotionEstimate: queue.filter(
        (q) => q.lifecycle === "INDEXABLE_READY",
      ).length,
    },
    queue: queue.slice(0, 200),
    laneA: laneA.slice(0, 50),
    laneB: laneB.slice(0, 50),
    laneC: laneC.slice(0, 50),
  };
}

export function formatCompareEnrichmentMarkdown(
  report: CompareEnrichmentReport,
  batch?: CompareEnrichmentBatchResult,
): string {
  const s = report.summary;
  const lines: string[] = [];
  lines.push("# Comparison enrichment system");
  lines.push("");
  lines.push(`**Generated:** ${report.generatedAt}`);
  lines.push(`**Engine:** compare-enrichment v${report.version}`);
  lines.push("");
  lines.push(
    "Progressive enrichment of **existing** `/compare/` URLs. Weak/noindex pages stay live, get data-backed relationship signals + decision content from catalogue pricing/capabilities/evidence, then promote only when quality gates pass. No replacement URLs.",
  );
  lines.push("");
  lines.push(
    "Execution lanes separate **proven search demand** from strategic competitor coverage. Zero-impression pairs stay in the estate — they do not outrank strong GSC opportunities.",
  );
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Count |");
  lines.push("| --- | ---: |");
  lines.push(`| Improvement queue | ${s.improveQueueSize} |`);
  lines.push(`| Default batch size | ${s.batchSizeDefault} |`);
  lines.push(
    `| Ready-for-promotion (estimate) | ${s.readyForPromotionEstimate} |`,
  );
  lines.push(
    `| Batch mix (A/B/C) | ${Math.round(s.laneAllocation.laneA * 100)}% / ${Math.round(s.laneAllocation.laneB * 100)}% / ${Math.round(s.laneAllocation.laneC * 100)}% |`,
  );
  lines.push("");
  lines.push("## Queue by lane");
  lines.push("");
  lines.push("| Lane | Meaning | Count |");
  lines.push("| --- | --- | ---: |");
  lines.push(
    `| A | Proven search demand | ${s.byLane.find((r) => r.lane === "A")?.count ?? 0} |`,
  );
  lines.push(
    `| B | Strategic competitor / commercial pairs | ${s.byLane.find((r) => r.lane === "B")?.count ?? 0} |`,
  );
  lines.push(
    `| C | Long-tail improvement | ${s.byLane.find((r) => r.lane === "C")?.count ?? 0} |`,
  );
  lines.push("");
  lines.push("## Queue by relationship kind");
  lines.push("");
  lines.push("| Kind | Count |");
  lines.push("| --- | ---: |");
  for (const row of s.byRelationship) {
    lines.push(`| ${row.kind} | ${row.count} |`);
  }
  lines.push("");
  lines.push("## Policy");
  lines.push("");
  lines.push(
    "- Declared competitor/alternative/comparable **or** data-backed buyer comparability (use cases, audience, capabilities, pricing tier, integrations) can justify enrichment.",
  );
  lines.push(
    "- Same-category Cartesian pairs without further signals stay IMPROVE — not deleted.",
  );
  lines.push("- Missing feature data → **unknown**, never invented “No”.");
  lines.push(
    "- Do not imply hands-on testing unless evidence levels support it.",
  );
  lines.push(
    "- Promote IMPROVE → INDEXABLE_READY → INDEXABLE (KEEP_INDEX) only after intent, uniqueness, QA, and promotion gates.",
  );
  lines.push(
    "- Never fabricate GSC demand; FIXTURE AI/backlink inputs do not unlock Lane A.",
  );
  lines.push("");

  lines.push("## Top Lane A — Proven search demand");
  lines.push("");
  lines.push(
    "_Highest execution priority. Real GSC impressions/clicks/position, direct page×query when available, known backlinks, or REAL AI citations._",
  );
  lines.push("");
  lines.push(laneTable(report.laneA));
  lines.push("");

  lines.push("## Top Lane B — Strategic existing content");
  lines.push("");
  lines.push(
    "_Key competitor relationships and commercially important pairs without meaningful GSC yet._",
  );
  lines.push("");
  lines.push(laneTable(report.laneB));
  lines.push("");

  lines.push("## Top Lane C — Long-tail improvement");
  lines.push("");
  lines.push(
    "_Valid existing comparisons with no demand and no strong override — preserve, enrich after A/B._",
  );
  lines.push("");
  lines.push(laneTable(report.laneC));
  lines.push("");

  if (batch) {
    lines.push("## Latest batch");
    lines.push("");
    lines.push(`- Batch size: ${batch.batchSize}`);
    lines.push(`- Applied: ${batch.applied.filter((a) => a.applied).length}`);
    lines.push(`- Promoted: ${batch.promoted.length}`);
    lines.push(`- Queue remaining (approx): ${batch.queueRemaining}`);
    lines.push("");
    if (batch.promoted.length) {
      lines.push("### Promoted");
      lines.push("");
      for (const slug of batch.promoted) {
        lines.push(`- \`/compare/${slug}/\``);
      }
      lines.push("");
    }
  }

  lines.push("## CLI");
  lines.push("");
  lines.push("```bash");
  lines.push("npm run seo:enrich-comparisons");
  lines.push("npm run seo:enrich-comparisons -- --batch 25 --apply");
  lines.push(
    "npm run seo:enrich-comparisons -- --batch 20 --apply --promote",
  );
  lines.push(
    "npm run seo:enrich-comparisons -- --slugs hubspot-vs-pipedrive --apply",
  );
  lines.push("```");
  lines.push("");
  lines.push(
    "Default batch allocation ≈ **65% A / 25% B / 10% C** (override with `laneAllocation`).",
  );
  lines.push(
    "Zero-impression pages stay below Lane A unless `strategicOverride === true` (Lane B) with an explicit reason.",
  );
  lines.push("");

  return lines.join("\n");
}

export function writeCompareEnrichmentOutputs(
  report: CompareEnrichmentReport,
  batch?: CompareEnrichmentBatchResult,
): { markdownPath: string; jsonPath: string } {
  const dir = path.join(process.cwd(), "docs/seo");
  const dataDir = path.join(process.cwd(), "data/seo");
  mkdirSync(dir, { recursive: true });
  mkdirSync(dataDir, { recursive: true });

  const markdownPath = path.join(dir, "COMPARE-ENRICHMENT.md");
  const jsonPath = path.join(dataDir, "compare-enrichment.json");

  writeFileSync(
    markdownPath,
    formatCompareEnrichmentMarkdown(report, batch),
    "utf8",
  );
  writeFileSync(
    jsonPath,
    `${JSON.stringify(
      {
        version: report.version,
        generatedAt: report.generatedAt,
        summary: report.summary,
        laneA: report.laneA,
        laneB: report.laneB,
        laneC: report.laneC,
        queue: report.queue,
        latestBatch: batch
          ? {
              generatedAt: batch.generatedAt,
              batchSize: batch.batchSize,
              applied: batch.applied.filter((a) => a.applied).map((a) => a.slug),
              promoted: batch.promoted,
              skippedPromotion: batch.skippedPromotion.slice(0, 50),
              queueRemaining: batch.queueRemaining,
            }
          : null,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  return { markdownPath, jsonPath };
}
