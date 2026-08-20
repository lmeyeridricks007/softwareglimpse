import type { SearchPerformanceReport, SearchPerformanceSignal } from "./types";

function signalTable(signals: SearchPerformanceSignal[], limit = 20): string[] {
  if (!signals.length) return ["_None flagged in this run._", ""];
  const lines = [
    "| Page | Query | Imp | Clicks | CTR | Avg pos* | Action |",
    "| --- | --- | ---: | ---: | ---: | ---: | --- |",
  ];
  for (const s of signals.slice(0, limit)) {
    lines.push(
      `| \`${s.page}\` | ${s.query ?? "—"} | ${s.impressions} | ${s.clicks} | ${(s.ctr * 100).toFixed(2)}% | ${s.position.toFixed(1)} | ${s.recommendedAction.replace(/\|/g, "/").slice(0, 70)} |`,
    );
  }
  lines.push("");
  return lines;
}

export function formatSearchPerformanceMarkdown(
  report: SearchPerformanceReport,
): string {
  const lines: string[] = [];
  lines.push("# Search Performance — SoftwareGlimpse");
  lines.push("");
  lines.push(`**Generated:** ${report.generatedAt}`);
  lines.push(`**Source mode:** ${report.sourceMode}`);
  lines.push(
    `**Live / approved import:** ${report.live ? "yes" : "no"}`,
  );
  lines.push(`**Synthetic:** ${report.synthetic ? "yes" : "no"}`);
  lines.push("");
  lines.push(
    "> Consumes approved Search Console–shaped data (live GSC connector, import, or labeled fixtures). Does **not** scrape GSC. Does **not** invent credentials.",
  );
  lines.push("");

  lines.push("## Methodology — average position");
  lines.push("");
  for (const n of report.methodologyNotes) lines.push(`- ${n}`);
  lines.push("");
  lines.push("\\* Avg pos columns use GSC average position for the period.");
  lines.push("");

  lines.push("## Disclaimers");
  lines.push("");
  for (const d of report.disclaimers) lines.push(`- ${d}`);
  lines.push("");

  if (report.notes.length) {
    lines.push("## Notes");
    lines.push("");
    for (const n of report.notes) lines.push(`- ${n}`);
    lines.push("");
  }

  if (!report.current) {
    lines.push("## Status");
    lines.push("");
    lines.push(
      "DATA NOT AVAILABLE — no search-performance snapshot. Configure GSC, import an approved export, or run with `--fixture` for synthetic pipeline tests.",
    );
    lines.push("");
    lines.push("```bash");
    lines.push("npm run site:search-performance -- --fixture");
    lines.push("npm run site:search-performance -- --import path/to/gsc-export.json");
    lines.push("```");
    lines.push("");
    return lines.join("\n");
  }

  lines.push("## Period");
  lines.push("");
  lines.push(`- **Snapshot:** \`${report.current.id}\``);
  lines.push(`- **Source:** ${report.current.source}`);
  lines.push(`- **Range label:** ${report.current.rangeLabel}`);
  lines.push(
    `- **Period:** ${report.current.period.startDate} → ${report.current.period.endDate}`,
  );
  lines.push(`- **Data through:** ${report.current.dataThroughDate}`);
  lines.push(`- **Rows:** ${report.current.rowCount}`);
  if (report.previous) {
    lines.push(
      `- **Compare vs:** \`${report.previous.id}\` (${report.previous.dataThroughDate})`,
    );
  }
  lines.push("");

  lines.push("## Totals");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("| --- | ---: |");
  lines.push(`| Clicks | ${report.totals.clicks} |`);
  lines.push(`| Impressions | ${report.totals.impressions} |`);
  lines.push(
    `| CTR | ${report.totals.avgCtr != null ? `${(report.totals.avgCtr * 100).toFixed(2)}%` : "—"} |`,
  );
  lines.push(
    `| Avg position* | ${report.totals.avgPosition != null ? report.totals.avgPosition.toFixed(1) : "—"} |`,
  );
  lines.push(`| Queries | ${report.totals.queryCount} |`);
  lines.push(`| Pages | ${report.totals.pageCount} |`);
  lines.push("");

  lines.push("## Near-win pages");
  lines.push("");
  lines.push(
    `High impressions + average position ${8}–${20} (relative traction — not a fixed SERP slot).`,
  );
  lines.push("");
  lines.push(...signalTable(report.nearWins));

  lines.push("## Title / snippet (CTR) opportunities");
  lines.push("");
  lines.push("High impressions + poor CTR vs expected band for average position.");
  lines.push("");
  lines.push(...signalTable(report.ctrOpportunities));

  lines.push("## Refresh candidates");
  lines.push("");
  lines.push("Position decline and/or click drop vs prior period.");
  lines.push("");
  lines.push(...signalTable(report.refreshCandidates));

  lines.push("## Emerging topics");
  lines.push("");
  lines.push("Queries with new impressions not present in the prior snapshot.");
  lines.push("");
  lines.push(...signalTable(report.emergingTopics));

  lines.push("## Defend / build cluster");
  lines.push("");
  lines.push(
    "Strong average position with weak measurable supporting-cluster impressions.",
  );
  lines.push("");
  lines.push(...signalTable(report.defendCluster));

  if (report.visibilityMetrics) {
    lines.push("## Site Intelligence visibility metrics (derived)");
    lines.push("");
    lines.push(
      report.visibilityMetrics.synthetic
        ? "_SYNTHETIC — do not claim live visibility._"
        : "_Ready for Search Visibility pillar when overview re-runs._",
    );
    lines.push("");
    lines.push("| Factor | Norm |");
    lines.push("| --- | ---: |");
    lines.push(
      `| indexedPerformingCoverage | ${report.visibilityMetrics.indexedPerformingCoverage} |`,
    );
    lines.push(`| impressionsNorm | ${report.visibilityMetrics.impressionsNorm} |`);
    lines.push(`| clicksNorm | ${report.visibilityMetrics.clicksNorm} |`);
    lines.push(`| ctrNorm | ${report.visibilityMetrics.ctrNorm} |`);
    lines.push(
      `| positionDistributionNorm | ${report.visibilityMetrics.positionDistributionNorm} |`,
    );
    lines.push(
      `| queryCoverageNorm | ${report.visibilityMetrics.queryCoverageNorm} |`,
    );
    lines.push("");
  }

  lines.push("## Sample rows (top impressions)");
  lines.push("");
  lines.push("| Page | Query | Imp | Clicks | CTR | Avg pos* | Device | Country |");
  lines.push("| --- | --- | ---: | ---: | ---: | ---: | --- | --- |");
  const top = [...report.snapshots]
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 30);
  for (const r of top) {
    lines.push(
      `| \`${r.page.replace(/^https?:\/\/[^/]+/, "")}\` | ${r.query} | ${r.impressions} | ${r.clicks} | ${(r.ctr * 100).toFixed(2)}% | ${r.position.toFixed(1)} | ${r.device ?? "—"} | ${r.country ?? "—"} |`,
    );
  }
  lines.push("");

  lines.push("## Refresh");
  lines.push("");
  lines.push("```bash");
  lines.push("# Synthetic pipeline (labeled — not live GSC)");
  lines.push("npm run site:search-performance -- --fixture");
  lines.push("# Approved GSC-shaped export");
  lines.push("npm run site:search-performance -- --import path/to/export.json");
  lines.push("# From snapshots already in src/data/seo/snapshots");
  lines.push("npm run site:search-performance");
  lines.push("```");
  lines.push("");
  return lines.join("\n");
}
