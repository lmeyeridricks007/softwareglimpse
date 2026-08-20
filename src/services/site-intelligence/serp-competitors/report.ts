import type { SerpCompetitorDiscoveryReport } from "./types";
import { competitorTypeLabel } from "./classify-domain";

export function formatSerpCompetitorsMarkdown(
  report: SerpCompetitorDiscoveryReport,
): string {
  const staleDate = new Date(report.generatedAt);
  staleDate.setDate(staleDate.getDate() + report.staleAfterDays);
  const lines: string[] = [
    "# SERP Competitors — SoftwareGlimpse",
    "",
    `**Generated:** ${report.generatedAt}`,
    `**Cluster:** ${report.cluster}`,
    `**Provider:** ${report.provider}`,
    `**Queries searched:** ${report.queryCount}`,
    `**Organic results captured:** ${report.resultCount}`,
    `**Treat as stale after:** ${staleDate.toISOString().slice(0, 10)} (${report.staleAfterDays}d)`,
    "",
    `> ${report.disclaimer}`,
    "",
    "## Notes",
    "",
  ];
  for (const n of report.notes) lines.push(`- ${n}`);
  lines.push("");

  lines.push("## Top competitor domains");
  lines.push("");
  lines.push(
    "| # | Domain | Type | Significance | Score | Frequency (queries) | Avg pos | Best pos | Page types | Sample URLs |",
  );
  lines.push("| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- |");

  report.domains.slice(0, 40).forEach((d, i) => {
    lines.push(
      `| ${i + 1} | ${d.domain} | ${competitorTypeLabel(d.type)} | ${d.significance} | ${d.score} | ${d.frequency} | ${d.avgPosition} | ${d.bestPosition} | ${d.pageTypesObserved.join(", ") || "—"} | ${d.sampleUrls
        .slice(0, 2)
        .map((u) => `\`${u}\``)
        .join(" ") || "—"} |`,
    );
  });
  lines.push("");

  lines.push("### Primary organic competitors");
  lines.push("");
  const primary = report.domains.filter(
    (d) => d.significance === "primary-organic-competitor",
  );
  if (primary.length === 0) {
    lines.push("_None met primary thresholds in this run._");
  } else {
    for (const d of primary) {
      lines.push(
        `- **${d.domain}** (${competitorTypeLabel(d.type)}) — ${d.queryCount} queries, avg pos ${d.avgPosition}`,
      );
      lines.push(`  - Overlap queries: ${d.queries.slice(0, 8).join("; ")}`);
    }
  }
  lines.push("");

  lines.push("## Query-level competitors");
  lines.push("");
  lines.push(
    "Competitor sets differ by query — do not assume one list for all CRM topics.",
  );
  lines.push("");

  for (const q of report.byQuery) {
    lines.push(`### \`${q.query}\``);
    lines.push("");
    lines.push(
      `- **Intent:** ${q.intent}`,
    );
    lines.push(
      `- **SoftwareGlimpse page:** ${q.associatedPage ? `\`${q.associatedPage}\`` : "—"}`,
    );
    if (q.competitors.length === 0) {
      lines.push("- _No organic results captured for this query._");
      lines.push("");
      continue;
    }
    lines.push("");
    lines.push("| Rank | Domain | Type | Title | URL |");
    lines.push("| ---: | --- | --- | --- | --- |");
    for (const c of q.competitors.slice(0, 10)) {
      lines.push(
        `| ${c.rank} | ${c.domain} | ${competitorTypeLabel(c.type)} | ${c.title.replace(/\|/g, "/").slice(0, 80)} | \`${c.url}\` |`,
      );
    }
    lines.push("");
  }

  lines.push("## Refresh");
  lines.push("");
  lines.push("```bash");
  lines.push("npm run site:serp-competitors -- --cluster crm");
  lines.push("# or import a fresh snapshot:");
  lines.push(
    "npm run site:serp-competitors -- --import docs/site-intelligence/competitors/snapshots/<file>.json",
  );
  lines.push("```");
  lines.push("");
  lines.push(
    "Requires an approved search API (`BRAVE_API_KEY`, `SERPER_API_KEY`, or Google CSE). Do **not** scrape Google HTML.",
  );
  lines.push("");
  return lines.join("\n");
}
