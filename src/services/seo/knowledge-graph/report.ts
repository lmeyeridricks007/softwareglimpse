import type { KnowledgeGraphReport } from "./analyze";

export function formatKnowledgeGraphMarkdown(
  report: KnowledgeGraphReport,
): string {
  const lines: string[] = [];
  lines.push("# SoftwareGlimpse knowledge graph");
  lines.push("");
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push("");
  lines.push(
    "Semantic relationships across the existing estate — **not** a deletion plan. IMPROVE/noindex pages stay linkable when they help buyers.",
  );
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("| --- | ---: |");
  lines.push(`| Nodes | ${report.summary.nodes} |`);
  lines.push(`| Edges (total) | ${report.summary.edges} |`);
  lines.push(`| Semantic edges | ${report.summary.semanticEdges} |`);
  lines.push(`| Contextual edges | ${report.summary.contextualEdges} |`);
  lines.push(`| IMPROVE pages analyzed | ${report.summary.improvePages} |`);
  lines.push(`| IMPROVE orphans | ${report.summary.improveOrphans} |`);
  lines.push(`| QA errors | ${report.summary.qaErrors} |`);
  lines.push(`| QA warnings | ${report.summary.qaWarnings} |`);
  lines.push("");

  lines.push("## User journeys");
  lines.push("");
  for (const j of report.journeys) {
    lines.push(`### ${j.name}`);
    lines.push("");
    lines.push(j.description);
    lines.push("");
    lines.push(
      j.steps
        .map((s) => `${s.label}${s.optional ? " _(optional)_" : ""}`)
        .join(" → "),
    );
    lines.push("");
  }

  lines.push("## Authority priority (top 20)");
  lines.push("");
  lines.push("| Path | Score |");
  lines.push("| --- | ---: |");
  for (const row of report.authorityTop.slice(0, 20)) {
    lines.push(`| \`${row.path}\` | ${row.score} |`);
  }
  lines.push("");

  lines.push("## IMPROVE inbound (priority)");
  lines.push("");
  lines.push(
    "| Path | Inbound | Content inbound | Hub depth | Status | Suggested referrers |",
  );
  lines.push("| --- | ---: | ---: | ---: | --- | --- |");
  for (const row of report.improveInbound.slice(0, 25)) {
    lines.push(
      `| \`${row.path}\` | ${row.inboundCount} | ${row.contentInboundCount} | ${row.hubDepth ?? "—"} | ${row.orphanStatus} | ${row.suggestedAdditions
        .slice(0, 3)
        .map((s) => s.fromPath)
        .join(", ") || "—"} |`,
    );
  }
  lines.push("");

  lines.push("## Hub sections sample (CRM)");
  lines.push("");
  const crm = report.hubSectionsByCategory.crm ?? [];
  for (const section of crm) {
    lines.push(`### ${section.title}`);
    lines.push("");
    for (const l of section.links.slice(0, 6)) {
      lines.push(
        `- [\`${l.href}\`](${l.href}) — ${l.label} (authority ${l.authorityScore})`,
      );
    }
    lines.push("");
  }

  lines.push("## QA issues");
  lines.push("");
  if (!report.qa.length) {
    lines.push("_No issues in capped sample._");
  } else {
    lines.push("| Severity | Code | Path | Message |");
    lines.push("| --- | --- | --- | --- |");
    for (const issue of report.qa.slice(0, 40)) {
      lines.push(
        `| ${issue.severity} | ${issue.code} | \`${issue.path ?? "—"}\` | ${issue.message.replace(/\|/g, "/")} |`,
      );
    }
  }
  lines.push("");
  lines.push("## Ops");
  lines.push("");
  lines.push("```bash");
  lines.push("npm run seo:knowledge-graph");
  lines.push("npm run seo:internal-links");
  lines.push("```");
  lines.push("");
  lines.push(
    "Machine output: `data/seo/knowledge-graph.json`",
  );
  lines.push("");
  return lines.join("\n");
}
