import type {
  AuditFinding,
  AuditCheckResult,
  LegacyFateRow,
  MigrationSeoAuditSummary,
} from "./types";
import { MIGRATION_SEO_AUDIT_AGENT } from "./types";

function esc(s: string): string {
  return s.replace(/\|/g, "/").replace(/\n/g, " ");
}

function sectionFindings(
  title: string,
  findings: AuditFinding[],
  checkIds: string[],
): string[] {
  const rows = findings.filter((f) => checkIds.includes(f.check));
  const lines = [`## ${title}`, ""];
  if (rows.length === 0) {
    lines.push("_None._", "");
    return lines;
  }
  lines.push("| Severity | Subject | Problem | Evidence | Action |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const f of rows.slice(0, 80)) {
    lines.push(
      `| ${f.severity} | \`${esc(f.subject)}\` | ${esc(f.problem)} | ${esc(f.evidence)} | ${esc(f.recommendedAction)} |`,
    );
  }
  if (rows.length > 80) {
    lines.push("", `_…and ${rows.length - 80} more (see JSON)._`);
  }
  lines.push("");
  return lines;
}

export function renderMigrationSeoAuditMarkdown(input: {
  summary: MigrationSeoAuditSummary;
  findings: AuditFinding[];
  fateRows: LegacyFateRow[];
  checks: AuditCheckResult[];
}): string {
  const { summary, findings, fateRows, checks } = input;
  const p0 = findings.filter((f) => f.severity === "P0");
  const p1 = findings.filter((f) => f.severity === "P1");
  const p2 = findings.filter((f) => f.severity === "P2");

  const unresolved = fateRows.filter((r) => r.expectedFate === "unresolved");
  const excluded = fateRows.filter((r) => r.expectedFate === "excluded_manual");
  const redirects = fateRows.filter((r) => r.expectedFate === "redirect_301");
  const retired = fateRows.filter(
    (r) =>
      r.expectedFate === "intentional_404" ||
      r.expectedFate === "intentional_410",
  );
  const preserved = fateRows.filter((r) => r.expectedFate === "preserved_200");

  const lines: string[] = [
    `# Migration SEO QA`,
    "",
    `**Generated:** ${summary.generatedAt}`,
    `**Agent:** ${MIGRATION_SEO_AUDIT_AGENT.name} v${MIGRATION_SEO_AUDIT_AGENT.version}`,
    `**Mode:** ${summary.mode}`,
    `**Overall:** **${summary.overall}**`,
    "",
    "> Static pre-launch audit against mapping plan, redirect config, inventory, sitemap, internal-link graph, and repository scan. Optional live HTTP probes are out of band unless `BASE_URL` live mode is enabled in a future pass.",
    "",
    "## PASS / FAIL summary",
    "",
    `| Metric | Value |`,
    `| --- | ---: |`,
    `| Overall | ${summary.overall} |`,
    `| Legacy URLs audited | ${summary.totals.legacyUrls} |`,
    `| Clean fate | ${summary.totals.fateOk} |`,
    `| Fate issues | ${summary.totals.fateIssues} |`,
    `| Redirects configured | ${summary.totals.redirectsConfigured} |`,
    `| High-risk redirect OK | ${summary.totals.highRiskRedirectOk} |`,
    `| High-risk redirect issues | ${summary.totals.highRiskRedirectIssues} |`,
    `| P0 findings | ${summary.totals.findingsP0} |`,
    `| P1 findings | ${summary.totals.findingsP1} |`,
    `| P2 findings | ${summary.totals.findingsP2} |`,
    "",
    "## Checks",
    "",
    `| Check | Status | Findings | Summary |`,
    `| --- | --- | ---: | --- |`,
    ...checks.map(
      (c) =>
        `| \`${c.id}\` | ${c.status} | ${c.findingCount} | ${esc(c.summary)} |`,
    ),
    "",
    "## Legacy URL coverage",
    "",
    `| Fate | Count |`,
    `| --- | ---: |`,
    `| Preserved 200 (KEEP) | ${preserved.length} |`,
    `| Redirect 301 implemented | ${redirects.length} |`,
    `| Intentional 404/410 | ${retired.length} |`,
    `| Excluded manual (not auto-301) | ${excluded.length} |`,
    `| Unresolved (REVIEW / pending) | ${unresolved.length} |`,
    "",
    "Every legacy URL should end as **200 preserved**, **301/308 mapped**, **404 intentional**, or **410 intentional**. Unresolved REVIEW rows need editorial decisions before launch.",
    "",
    ...sectionFindings("Critical redirect coverage / high-risk", findings, [
      "high_risk_coverage",
    ]),
    ...sectionFindings("Redirect chains / temporary redirects", findings, [
      "redirect_hygiene",
    ]),
    ...sectionFindings("Broken redirects / wrong destinations / fate issues", findings, [
      "legacy_url_fate",
    ]),
    ...sectionFindings("Old URLs in current internal links", findings, [
      "internal_links",
    ]),
    ...sectionFindings("Sitemap issues", findings, ["sitemaps"]),
    ...sectionFindings("Canonical issues", findings, ["canonicals"]),
    ...sectionFindings("Structured-data issues", findings, ["structured_data"]),
    ...sectionFindings("Open Graph / share URL issues", findings, ["open_graph"]),
    ...sectionFindings("Hardcoded legacy links", findings, ["hardcoded_legacy"]),
    ...sectionFindings("Legacy asset issues", findings, ["legacy_assets"]),
    ...sectionFindings("404/410 findings", findings, ["not_found_experience"]),
    "## P0 launch blockers",
    "",
  ];

  if (p0.length === 0) {
    lines.push("_None._", "");
  } else {
    lines.push("| Subject | Problem | Check |");
    lines.push("| --- | --- | --- |");
    for (const f of p0.slice(0, 50)) {
      lines.push(
        `| \`${esc(f.subject)}\` | ${esc(f.problem)} | \`${f.check}\` |`,
      );
    }
    lines.push("");
  }

  lines.push("## P1 launch risks", "");
  if (p1.length === 0) {
    lines.push("_None._", "");
  } else {
    lines.push("| Subject | Problem | Check |");
    lines.push("| --- | --- | --- |");
    for (const f of p1.slice(0, 50)) {
      lines.push(
        `| \`${esc(f.subject)}\` | ${esc(f.problem)} | \`${f.check}\` |`,
      );
    }
    if (p1.length > 50) lines.push("", `_…and ${p1.length - 50} more._`);
    lines.push("");
  }

  lines.push("## P2 cleanup", "");
  if (p2.length === 0) {
    lines.push("_None._", "");
  } else {
    lines.push("| Subject | Problem | Check |");
    lines.push("| --- | --- | --- |");
    for (const f of p2.slice(0, 40)) {
      lines.push(
        `| \`${esc(f.subject)}\` | ${esc(f.problem)} | \`${f.check}\` |`,
      );
    }
    if (p2.length > 40) lines.push("", `_…and ${p2.length - 40} more._`);
    lines.push("");
  }

  lines.push(
    "## Notes",
    "",
    "- Soft 404 / live 500 / redirect loops require a running deployment (`BASE_URL` live probe) — not asserted in static mode.",
    "- Source of truth for redirects: `config/legacy-redirects.json`.",
    "- Regenerate: `npm run migration:seo-audit`",
    "",
  );

  return `${lines.join("\n")}\n`;
}
