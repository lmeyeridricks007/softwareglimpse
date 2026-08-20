import type { PageRankingReadinessReport } from "./types";

export function formatPageRankingReadinessMarkdown(
  report: PageRankingReadinessReport,
): string {
  const lines: string[] = [];
  lines.push(`# Page Ranking Readiness — \`${report.route}\``);
  lines.push("");
  lines.push(`**Agent:** PageRankingReadinessAgent v${report.agentVersion}`);
  lines.push(`**Generated:** ${report.generatedAt}`);
  if (report.title) lines.push(`**Title:** ${report.title}`);
  if (report.pageType) lines.push(`**Page type:** ${report.pageType}`);
  if (report.contentId) lines.push(`**Content ID:** \`${report.contentId}\``);
  lines.push("");
  lines.push(
    "> Local relative assessment of how competitive this page is and what would need to change for a **stronger chance** of ranking. **Not** a ranking promise or probability.",
  );
  lines.push("");

  lines.push("## RANKING READINESS");
  lines.push("");
  lines.push("```text");
  lines.push(`${report.rankingReadiness} / 100`);
  lines.push("");
  lines.push(`Feasibility:`);
  lines.push(`${report.feasibility}`);
  lines.push("");
  lines.push(`Confidence:`);
  lines.push(`${report.confidence.toUpperCase()}`);
  lines.push("```");
  lines.push("");
  lines.push("### Confidence reasons");
  lines.push("");
  for (const r of report.confidenceReasons) {
    lines.push(`- ${r}`);
  }
  lines.push("");

  lines.push("## Target intent & queries");
  lines.push("");
  lines.push(`**Target intent:** ${report.targetIntent}`);
  lines.push("");
  if (report.targetQueries.length) {
    lines.push("**Likely target query set:**");
    lines.push("");
    for (const q of report.targetQueries) {
      lines.push(`- ${q}`);
    }
  } else {
    lines.push("_No mapped query seeds for this route._");
  }
  lines.push("");

  lines.push("## WHY");
  lines.push("");
  lines.push("### STRONG");
  lines.push("");
  if (!report.strong.length) lines.push("- _None flagged_");
  else for (const s of report.strong) lines.push(`+ ${s}`);
  lines.push("");
  lines.push("### WEAK");
  lines.push("");
  if (!report.weak.length) lines.push("- _None flagged_");
  else for (const w of report.weak) lines.push(`- ${w}`);
  lines.push("");

  lines.push("## Dimension scores");
  lines.push("");
  lines.push("| Dimension | Score / status | Summary |");
  lines.push("| --- | --- | --- |");
  for (const d of report.dimensions) {
    const score =
      d.status === "not-measured"
        ? "NOT MEASURED"
        : d.status === "not-connected"
          ? "NOT CONNECTED"
          : d.status === "not-available"
            ? "NOT AVAILABLE"
            : d.score == null
              ? "—"
              : String(d.score);
    lines.push(
      `| ${d.label} | ${score} | ${d.summary.replace(/\|/g, "/").slice(0, 120)} |`,
    );
  }
  lines.push("");

  lines.push("## REQUIRED IMPROVEMENTS");
  lines.push("");
  lines.push("### Must do");
  lines.push("");
  for (const x of report.improvements.mustDo) lines.push(`- ${x}`);
  if (!report.improvements.mustDo.length) lines.push("- _None_");
  lines.push("");
  lines.push("### Should do");
  lines.push("");
  for (const x of report.improvements.shouldDo) lines.push(`- ${x}`);
  if (!report.improvements.shouldDo.length) lines.push("- _None_");
  lines.push("");
  lines.push("### Optional");
  lines.push("");
  for (const x of report.improvements.optional) lines.push(`- ${x}`);
  if (!report.improvements.optional.length) lines.push("- _None_");
  lines.push("");
  lines.push("### Avoid");
  lines.push("");
  for (const x of report.improvements.avoid) lines.push(`- ${x}`);
  if (!report.improvements.avoid.length) lines.push("- _None_");
  lines.push("");

  lines.push("## COMPETITOR BENCHMARK");
  lines.push("");
  lines.push(
    "Representative top-ranking / sampled competitor pages vs SoftwareGlimpse (observable dimensions only).",
  );
  lines.push("");
  if (!report.competitors.length) {
    lines.push("_No competitor benchmark rows matched to this page._");
    lines.push("");
  } else {
    lines.push(
      "| Competitor | Query | Stance (SG vs them) | SG better | Equal | SG weaker |",
    );
    lines.push("| --- | --- | --- | --- | --- | --- |");
    for (const c of report.competitors) {
      lines.push(
        `| [${c.domain}](${c.url}) | ${c.query} | **${c.stance}** | ${c.sgBetter.join(", ") || "—"} | ${c.equal.join(", ") || "—"} | ${c.weaker.join(", ") || "—"} |`,
      );
    }
    lines.push("");
    lines.push("### Stance key");
    lines.push("");
    lines.push("- **better** — SoftwareGlimpse is ahead on most scored dimensions");
    lines.push("- **equal** — roughly comparable");
    lines.push("- **weaker** — SoftwareGlimpse trails on most scored dimensions");
    lines.push("- **unknown** — insufficient observable data");
    lines.push("");
  }

  lines.push("## Related ranking opportunities");
  lines.push("");
  if (!report.relatedOpportunityScores.length) {
    lines.push("_No entries in RANKING-OPPORTUNITIES for this target page._");
    lines.push("");
  } else {
    lines.push("| Query | Opportunity | Feasibility |");
    lines.push("| --- | ---: | --- |");
    for (const o of report.relatedOpportunityScores) {
      lines.push(
        `| ${o.query} | ${o.opportunityScore} | ${o.feasibility} |`,
      );
    }
    lines.push("");
  }

  lines.push("## Authority / backlink limitations");
  lines.push("");
  lines.push(report.authorityLimitation);
  lines.push("");

  lines.push("## Search performance");
  lines.push("");
  lines.push(report.searchPerformanceNote);
  lines.push("");

  lines.push("## Inputs");
  lines.push("");
  lines.push("| Source | Status | Path |");
  lines.push("| --- | --- | --- |");
  for (const s of report.sources) {
    lines.push(`| ${s.id} | ${s.status} | \`${s.path}\` |`);
  }
  lines.push("");

  lines.push("## Disclaimers");
  lines.push("");
  for (const d of report.disclaimers) lines.push(`- ${d}`);
  lines.push("");

  lines.push("## Command");
  lines.push("");
  lines.push("```bash");
  lines.push(`npm run site:page-readiness -- ${report.route}`);
  lines.push("```");
  lines.push("");

  return lines.join("\n");
}
