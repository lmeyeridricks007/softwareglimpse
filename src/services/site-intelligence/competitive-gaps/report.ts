import type { CompetitiveGapReport, GapFinding } from "./types";

function findingBullets(items: GapFinding[], limit = 15): string[] {
  const lines: string[] = [];
  if (!items.length) {
    lines.push("_None flagged in this run._");
    lines.push("");
    return lines;
  }
  for (const f of items.slice(0, limit)) {
    lines.push(`- **${f.title}** (${f.stance})`);
    lines.push(`  - ${f.detail}`);
    if (f.sgPage) lines.push(`  - Page: \`${f.sgPage}\``);
    lines.push(`  - User value: ${f.userValue}`);
    if (f.rejectedFeatureCopy && f.rejectedFeatureNote) {
      lines.push(`  - Not recommended: ${f.rejectedFeatureNote}`);
    }
  }
  if (items.length > limit) {
    lines.push(`- _…+${items.length - limit} more_`);
  }
  lines.push("");
  return lines;
}

export function formatCompetitiveGapsMarkdown(
  report: CompetitiveGapReport,
): string {
  const lines: string[] = [];
  lines.push("# Competitive Gaps — SoftwareGlimpse");
  lines.push("");
  lines.push(`**Generated:** ${report.generatedAt}`);
  lines.push(`**Cluster:** ${report.cluster}`);
  lines.push("");
  lines.push(
    "> Identifies where SoftwareGlimpse is **STRONGER**, **COMPARABLE**, **WEAKER**, or **MISSING** vs pages that currently rank. Feature-copy without user value is rejected.",
  );
  lines.push("");

  lines.push("## Sources");
  lines.push("");
  lines.push("| Source | Path | Status |");
  lines.push("| --- | --- | --- |");
  for (const s of report.sources) {
    lines.push(`| ${s.id} | \`${s.path}\` | ${s.status} |`);
  }
  lines.push("");

  if (report.disclaimers.length) {
    lines.push("## Disclaimers");
    lines.push("");
    for (const d of report.disclaimers) lines.push(`- ${d}`);
    lines.push("");
  }

  if (report.notes.length) {
    lines.push("## Notes");
    lines.push("");
    for (const n of report.notes) lines.push(`- ${n}`);
    lines.push("");
  }

  lines.push("## Where SoftwareGlimpse is stronger");
  lines.push("");
  lines.push(...findingBullets(report.advantages, 20));

  lines.push("## Where competitors are stronger");
  lines.push("");
  lines.push(...findingBullets(report.competitorStronger, 20));

  lines.push("## Missing topic coverage");
  lines.push("");
  lines.push(...findingBullets(report.missingTopics, 20));

  lines.push("## Weak existing pages");
  lines.push("");
  lines.push(...findingBullets(report.weakPages, 20));

  lines.push("## Missing tools");
  lines.push("");
  lines.push(...findingBullets(report.missingTools, 15));

  lines.push("## Missing resources");
  lines.push("");
  lines.push(...findingBullets(report.missingResources, 15));

  lines.push("## Missing media");
  lines.push("");
  lines.push(...findingBullets(report.missingMedia, 15));

  lines.push("## Differentiation opportunities");
  lines.push("");
  lines.push(...findingBullets(report.differentiation, 15));

  lines.push("## Query gaps");
  lines.push("");
  lines.push(
    "| Query | Page | Exists | Intent | CQ score | SG bench | Comp avg | Stance | Action |",
  );
  lines.push(
    "| --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- |",
  );
  for (const q of report.queryGaps) {
    lines.push(
      `| ${q.query} | ${q.matchingPage ? `\`${q.matchingPage}\`` : "—"} | ${q.pageExists ? "yes" : "no"} | ${q.intentMatchScore ?? "—"} | ${q.qualityScore ?? "—"} | ${q.sgBenchmarkStrength ?? "—"} | ${q.competitorAvgStrength ?? "—"} | ${q.stance} | ${q.action} |`,
    );
  }
  lines.push("");

  lines.push("## Top 50 actions");
  lines.push("");
  lines.push("| # | Action | Type | Page / query | Why | User value | Not recommended |");
  lines.push("| ---: | --- | --- | --- | --- | --- | --- |");
  for (const a of report.topActions) {
    lines.push(
      `| ${a.rank} | ${a.title.replace(/\|/g, "/")} | ${a.action} | ${a.page ? `\`${a.page}\`` : a.query ? `\`${a.query}\`` : "—"} | ${a.why.replace(/\|/g, "/").slice(0, 120)} | ${a.userValue.replace(/\|/g, "/").slice(0, 100)} | ${a.notRecommended?.replace(/\|/g, "/").slice(0, 80) ?? "—"} |`,
    );
  }
  lines.push("");

  lines.push("## Refresh");
  lines.push("");
  lines.push("```bash");
  lines.push("npm run site:competitive-gaps");
  lines.push("npm run site:competitive-gaps -- --fixture");
  lines.push("```");
  lines.push("");
  lines.push(
    "Re-run after SERP competitor discovery + competitive benchmark refresh. Do not treat old gap snapshots as current.",
  );
  lines.push("");
  return lines.join("\n");
}
