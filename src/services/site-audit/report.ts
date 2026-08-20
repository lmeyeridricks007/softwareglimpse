import type { AuditResult } from "@/domain";

export function formatAuditText(result: AuditResult): string {
  const lines: string[] = [
    `SOFTWAREGLIMPSE ${result.scope.kind.toUpperCase()} AUDIT`,
    result.scope.label ? result.scope.label : "",
    "",
    `Status               ${result.status}`,
    `Published pages      ${result.metrics.publishedPages}`,
    `Indexable            ${result.metrics.indexablePages}`,
    `Critical issues      ${result.metrics.criticalIssues}`,
    `High issues          ${result.metrics.highIssues}`,
    `Warnings (med/low)   ${result.metrics.mediumIssues + result.metrics.lowIssues}`,
    result.publicationReadiness
      ? `Publication          ${result.publicationReadiness}`
      : "",
    result.health ? `Health (internal)    ${result.health.score}/100` : "",
    "",
  ];

  if (result.blockers.length) {
    lines.push("CRITICAL / HIGH");
    lines.push("");
    result.blockers.slice(0, 15).forEach((b, i) => {
      lines.push(`${i + 1}. [${b.severity}] ${b.type}`);
      lines.push(`   ${b.message}`);
    });
    lines.push("");
  }

  if (result.remediations.length) {
    lines.push("TOP REMEDIATIONS");
    lines.push("");
    result.remediations.slice(0, 10).forEach((r) => {
      lines.push(
        `${r.rank}. [${r.remediationClass}] ${r.action} — ${r.title.slice(0, 100)}`,
      );
    });
    lines.push("");
  }

  if (result.warnings.length) {
    lines.push(`WARNINGS (${result.warnings.length})`);
    result.warnings.slice(0, 8).forEach((w) => {
      lines.push(`- [${w.severity}] ${w.type}: ${w.message}`);
    });
  }

  return lines.filter((l) => l !== undefined).join("\n");
}

export function formatAuditMarkdown(result: AuditResult): string {
  const sections = [
    `# SoftwareGlimpse audit — ${result.scope.kind}${result.scope.id ? `: ${result.scope.id}` : ""}`,
    "",
    `Audited: ${result.auditedAt}`,
    `Status: **${result.status}**`,
    result.publicationReadiness
      ? `Publication readiness: **${result.publicationReadiness}**`
      : "",
    result.health
      ? `Internal health: **${result.health.score}/100** — ${result.health.formula}`
      : "",
    "",
    "## Executive summary",
    "",
    `- Published pages: ${result.metrics.publishedPages}`,
    `- Critical: ${result.metrics.criticalIssues}`,
    `- High: ${result.metrics.highIssues}`,
    `- Orphans: ${result.metrics.orphanPages}`,
    `- Duplicate intent: ${result.metrics.duplicateIntentWarnings}`,
    `- Research gaps/stale: ${result.metrics.researchStale}`,
    "",
    "## Critical blockers",
    "",
    ...(result.blockers.length
      ? result.blockers.map(
          (b) =>
            `- **${b.type}** (${b.severity}): ${b.message}${b.evidence ? ` — _${b.evidence}_` : ""}`,
        )
      : ["_None_"]),
    "",
    "## Recommended remediation sequence",
    "",
    ...result.remediations
      .slice(0, 15)
      .map(
        (r) =>
          `${r.rank}. \`${r.action}\` [${r.remediationClass}] — ${r.title}`,
      ),
    "",
    "## Notes",
    "",
    ...result.notes.map((n) => `- ${n}`),
    "",
  ];
  return sections.filter(Boolean).join("\n");
}
