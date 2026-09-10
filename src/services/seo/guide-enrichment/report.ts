import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { DEFAULT_LANE_ALLOCATION } from "@/services/seo/enrichment-lanes";
import { allBlueprints } from "./blueprints";
import { buildGuideEnrichmentQueue } from "./queue";
import {
  DEFAULT_ENRICHMENT_BATCH_SIZE,
  GUIDE_ENRICHMENT_VERSION,
  type EnrichmentBatchResult,
  type EnrichmentQueueItem,
  type GuideEnrichmentReport,
} from "./types";

function esc(v: string): string {
  return v.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function laneTable(items: EnrichmentQueueItem[], limit = 25): string {
  const lines = [
    "| Rank | URL | Type | Lane | Overall | GSC demand | Strategic | Quality gap | Commercial | Authority | Override | GSC impr. | Reason |",
    "| ---: | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |",
  ];
  items.slice(0, limit).forEach((q, i) => {
    lines.push(
      `| ${i + 1} | ${q.url} | ${q.enrichmentType} | ${q.lane} | ${q.overallScore} | ${q.gscDemandScore} | ${q.strategicScore} | ${q.qualityGapScore} | ${q.commercialScore} | ${q.authorityScore} | ${q.strategicOverride ? "yes" : "—"} | ${q.prioritySignals.gscImpressions} | ${esc(q.reason)} |`,
    );
  });
  return lines.join("\n");
}

export function buildGuideEnrichmentReport(): GuideEnrichmentReport {
  const queue = buildGuideEnrichmentQueue();
  const byTypeMap = new Map<string, number>();
  const byLaneMap = new Map<string, number>();
  for (const q of queue) {
    byTypeMap.set(q.enrichmentType, (byTypeMap.get(q.enrichmentType) ?? 0) + 1);
    byLaneMap.set(q.lane, (byLaneMap.get(q.lane) ?? 0) + 1);
  }
  const laneA = queue.filter((q) => q.lane === "A");
  const laneB = queue.filter((q) => q.lane === "B");
  const laneC = queue.filter((q) => q.lane === "C");
  return {
    version: GUIDE_ENRICHMENT_VERSION,
    generatedAt: new Date().toISOString(),
    summary: {
      improveQueueSize: queue.length,
      queued: queue.length,
      byType: [...byTypeMap.entries()]
        .map(([type, count]) => ({
          type: type as GuideEnrichmentReport["summary"]["byType"][number]["type"],
          count,
        }))
        .sort((a, b) => b.count - a.count),
      byLane: (["A", "B", "C"] as const).map((lane) => ({
        lane,
        count: byLaneMap.get(lane) ?? 0,
      })),
      laneAllocation: { ...DEFAULT_LANE_ALLOCATION },
      batchSizeDefault: DEFAULT_ENRICHMENT_BATCH_SIZE,
      readyForPromotionEstimate: queue.filter(
        (q) => q.lifecycle === "INDEXABLE_READY",
      ).length,
    },
    queue: queue.slice(0, 200),
    laneA: laneA.slice(0, 50),
    laneB: laneB.slice(0, 50),
    laneC: laneC.slice(0, 50),
    blueprints: allBlueprints(),
  };
}

export function formatGuideEnrichmentMarkdown(
  report: GuideEnrichmentReport,
  batch?: EnrichmentBatchResult,
): string {
  const s = report.summary;
  const lines: string[] = [];
  lines.push("# Guide enrichment system");
  lines.push("");
  lines.push(`**Generated:** ${report.generatedAt}`);
  lines.push(`**Engine:** guide-enrichment v${report.version}`);
  lines.push("");
  lines.push(
    "Progressive enrichment of **existing** guide URLs. Weak/noindex pages stay live, get type-specific blueprints + real SoftwareGlimpse data, then promote only when quality gates pass. No replacement URLs.",
  );
  lines.push("");
  lines.push(
    "Execution lanes separate **proven search demand** from strategic catalogue work. Zero-impression pages are preserved — they do not outrank strong GSC opportunities.",
  );
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Count |");
  lines.push("| --- | ---: |");
  lines.push(`| Improvement queue | ${s.improveQueueSize} |`);
  lines.push(`| Default batch size | ${s.batchSizeDefault} |`);
  lines.push(`| Ready-for-promotion (estimate) | ${s.readyForPromotionEstimate} |`);
  lines.push(
    `| Batch mix (A/B/C) | ${Math.round(s.laneAllocation.laneA * 100)}% / ${Math.round(s.laneAllocation.laneB * 100)}% / ${Math.round(s.laneAllocation.laneC * 100)}% |`,
  );
  lines.push("");
  lines.push("## Queue by lane");
  lines.push("");
  lines.push("| Lane | Meaning | Count |");
  lines.push("| --- | --- | ---: |");
  lines.push(
    `| A | Proven search demand (GSC / REAL citations / backlinks) | ${s.byLane.find((r) => r.lane === "A")?.count ?? 0} |`,
  );
  lines.push(
    `| B | Strategic existing content (no meaningful GSC yet) | ${s.byLane.find((r) => r.lane === "B")?.count ?? 0} |`,
  );
  lines.push(
    `| C | Long-tail improvement — preserve, enrich after A/B | ${s.byLane.find((r) => r.lane === "C")?.count ?? 0} |`,
  );
  lines.push("");
  lines.push("## Queue by enrichment type");
  lines.push("");
  lines.push("| Type | Count |");
  lines.push("| --- | ---: |");
  for (const row of s.byType) {
    lines.push(`| ${row.type} | ${row.count} |`);
  }
  lines.push("");
  lines.push("## Quality blueprints");
  lines.push("");
  for (const bp of report.blueprints) {
    lines.push(`### ${bp.guideType}`);
    lines.push("");
    lines.push(bp.notes);
    lines.push("");
    lines.push(`- Required: ${bp.requiredSections.join(", ")}`);
    lines.push(`- Optional: ${bp.optionalSections.join(", ") || "—"}`);
    lines.push(`- Min unique elements: ${bp.minUniqueElements}`);
    lines.push("");
  }

  lines.push("## Top Lane A — Proven search demand");
  lines.push("");
  lines.push(
    "_Highest execution priority. Real GSC impressions/clicks/position, direct page×query when available, known backlinks, or REAL AI citations. Demand is never fabricated._",
  );
  lines.push("");
  lines.push(laneTable(report.laneA));
  lines.push("");

  lines.push("## Top Lane B — Strategic existing content");
  lines.push("");
  lines.push(
    "_No meaningful GSC demand yet, but important category / popular product / commercial relevance / journey / buyer question. Explicit strategic override — not invented search demand._",
  );
  lines.push("");
  lines.push(laneTable(report.laneB));
  lines.push("");

  lines.push("## Top Lane C — Long-tail improvement");
  lines.push("");
  lines.push(
    "_Existing valid pages with no current demand and no strong business priority. Preserve and improve progressively after A/B._",
  );
  lines.push("");
  lines.push(laneTable(report.laneC));
  lines.push("");

  if (batch) {
    lines.push("## Latest batch");
    lines.push("");
    lines.push(`- Batch size: ${batch.batchSize}`);
    lines.push(`- Applied overlays: ${batch.applied.filter((a) => a.applied).length}`);
    lines.push(`- Promoted: ${batch.promoted.length}`);
    lines.push(`- Skipped promotion: ${batch.skippedPromotion.length}`);
    lines.push(`- Queue remaining (approx): ${batch.queueRemaining}`);
    if (batch.familyQa) {
      lines.push(
        `- Family QA: ${batch.familyQa.flagged ? "**FLAGGED**" : "clear"} (${batch.familyQa.sharedPatterns.length} shared patterns)`,
      );
      for (const note of batch.familyQa.notes.slice(0, 4)) {
        lines.push(`  - ${note}`);
      }
    }
    lines.push("");
    if (batch.promoted.length) {
      lines.push("Promoted slugs:");
      for (const slug of batch.promoted) {
        lines.push(`- \`/guides/${slug}/\``);
      }
      lines.push("");
    }
  }
  lines.push("## Operating rules");
  lines.push("");
  lines.push(
    "1. Default batch mix ≈ **65% Lane A / 25% Lane B / 10% Lane C** (configurable via `laneAllocation`).",
  );
  lines.push(
    "2. A zero-impression page may not outrank Lane A unless `strategicOverride === true` (Lane B only) with an explicit reason.",
  );
  lines.push(
    "3. Semantic template risk (interchangeable analysis after stripping names/prices) blocks auto-promote — stay IMPROVE or MANUAL_REVIEW.",
  );
  lines.push("4. Process batches of 20–50 — do not rewrite 1,300 guides blindly.");
  lines.push("5. Use real catalogue/pricing/research data; omit unsupported sections.");
  lines.push("6. Reject generic filler and near-duplicate intros/conclusions (QA).");
  lines.push("7. Promote only via `validateAndMaybePromoteGuide` → content-lifecycle.");
  lines.push("8. Overlays live in `data/seo/guide-enrichment-overlays/{slug}.json`.");
  lines.push("9. Never fabricate GSC demand; FIXTURE AI/backlink inputs do not count for Lane A.");
  lines.push("");
  lines.push("## Machine-readable output");
  lines.push("");
  lines.push("- `data/seo/guide-enrichment.json`");
  lines.push("- Semantic history: `data/seo/content-quality-gate-history.json` (`semanticRecords`, `familyQaRecords`)");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

export function writeGuideEnrichmentOutputs(
  report: GuideEnrichmentReport,
  batch?: EnrichmentBatchResult,
): { markdownPath: string; jsonPath: string } {
  const root = process.cwd();
  const markdownPath = path.join(root, "docs/seo/GUIDE-ENRICHMENT.md");
  const jsonPath = path.join(root, "data/seo/guide-enrichment.json");
  mkdirSync(path.dirname(markdownPath), { recursive: true });
  mkdirSync(path.dirname(jsonPath), { recursive: true });
  writeFileSync(
    markdownPath,
    formatGuideEnrichmentMarkdown(report, batch),
    "utf8",
  );
  writeFileSync(
    jsonPath,
    `${JSON.stringify({ report, batch: batch ?? null }, null, 2)}\n`,
    "utf8",
  );
  return { markdownPath, jsonPath };
}
