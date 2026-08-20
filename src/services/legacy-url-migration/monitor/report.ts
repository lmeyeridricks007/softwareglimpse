import type {
  MonitorCheckResult,
  MonitorGscSection,
  MonitorIssue,
  MonitorSummary,
} from "./types";
import { LEGACY_MIGRATION_MONITOR_AGENT } from "./types";

function esc(s: string): string {
  return s.replace(/\|/g, "/").replace(/\n/g, " ");
}

function tableIssues(title: string, issues: MonitorIssue[]): string[] {
  const lines = [`## ${title}`, ""];
  if (issues.length === 0) {
    lines.push("_None._", "");
    return lines;
  }
  lines.push("| ID | State | Sev | Subject | Problem |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const i of issues.slice(0, 60)) {
    lines.push(
      `| \`${i.id}\` | ${i.state} | ${i.severity} | \`${esc(i.subject)}\` | ${esc(i.problem)} |`,
    );
  }
  if (issues.length > 60) {
    lines.push("", `_…and ${issues.length - 60} more (see JSON)._`);
  }
  lines.push("");
  return lines;
}

export function renderMigrationMonitorMarkdown(input: {
  summary: MonitorSummary;
  issues: MonitorIssue[];
  gsc: MonitorGscSection;
  checks: MonitorCheckResult[];
}): string {
  const { summary, issues, gsc, checks } = input;
  const open = issues.filter(
    (i) => i.state === "NEW" || i.state === "OPEN" || i.state === "REGRESSED",
  );
  const intentional = issues.filter((i) => i.state === "INTENTIONAL");
  const resolved = issues.filter((i) => i.state === "RESOLVED");
  const important = open.filter((i) => i.important);

  const lines: string[] = [
    `# Migration Monitor`,
    "",
    `**Generated:** ${summary.generatedAt}`,
    `**Agent:** ${LEGACY_MIGRATION_MONITOR_AGENT.name} v${LEGACY_MIGRATION_MONITOR_AGENT.version}`,
    `**Mode:** ${summary.mode}`,
    `**Overall:** **${summary.overall}**`,
    "",
    "> Post-launch health monitor for legacy redirects. **Does not modify redirects.**",
    "",
    "## Summary",
    "",
    `| Metric | Value |`,
    `| --- | ---: |`,
    `| Overall | ${summary.overall} |`,
    `| Redirects checked | ${summary.totals.redirectsChecked} |`,
    `| Important URLs watched | ${summary.totals.importantUrlsWatched} |`,
    `| NEW | ${summary.totals.issuesNew} |`,
    `| OPEN | ${summary.totals.issuesOpen} |`,
    `| REGRESSED | ${summary.totals.issuesRegressed} |`,
    `| RESOLVED | ${summary.totals.issuesResolved} |`,
    `| INTENTIONAL | ${summary.totals.issuesIntentional} |`,
    `| P0 / P1 / P2 (active) | ${summary.totals.p0} / ${summary.totals.p1} / ${summary.totals.p2} |`,
    "",
    "## Checks",
    "",
    `| Check | Status | Issues | Summary |`,
    `| --- | --- | ---: | --- |`,
    ...checks.map(
      (c) =>
        `| \`${c.id}\` | ${c.status} | ${c.issueCount} | ${esc(c.summary)} |`,
    ),
    "",
    ...tableIssues("Important / high-priority active issues", important),
    ...tableIssues("All active issues (NEW / OPEN / REGRESSED)", open),
    ...tableIssues("Resolved since last run", resolved),
    ...tableIssues("Intentional (allowlisted)", intentional),
    "## Search Console",
    "",
    `| Field | Value |`,
    `| --- | --- |`,
    `| Available | ${gsc.available ? "yes" : "no"} |`,
    `| Mode | ${gsc.mode} |`,
    "",
    "**Notes**",
    "",
    ...gsc.notes.map((n) => `- ${n}`),
    "",
  ];

  if (gsc.signals.length) {
    lines.push("**Signals (interpret with caution)**", "");
    for (const s of gsc.signals) {
      lines.push(`- \`${s.id}\` — **${s.label}**: ${s.detail}`);
    }
    lines.push("");
  }

  lines.push(
    "## Recommended schedule",
    "",
    summary.scheduleHint,
    "",
    "## Commands",
    "",
    "```bash",
    "npm run migration:audit      # full pre/post-launch SEO QA",
    "npm run migration:redirects  # regenerate approved redirects (manual approval gate)",
    "npm run migration:monitor    # this report",
    "```",
    "",
    "## Limitations",
    "",
    "- Static by default — live HTTP status/redirect-loop probes require `BASE_URL` / future live mode.",
    "- Soft 404 detection is not asserted without live HTML.",
    "- GSC coverage reports are never invented; imported rows are signals only.",
    "- This agent **never** auto-edits `config/legacy-redirects.json`.",
    "",
    "## Issue states",
    "",
    "| State | Meaning |",
    "| --- | --- |",
    "| NEW | First seen this run |",
    "| OPEN | Seen before, still present |",
    "| RESOLVED | Present last run, gone now |",
    "| REGRESSED | Returned after resolve, or severity worsened |",
    "| INTENTIONAL | Listed in `docs/migration/data/monitor-intentional.json` |",
    "",
  );

  return `${lines.join("\n")}\n`;
}

export const DEFAULT_SCHEDULE_HINT = [
  "**PRE-LAUNCH:** `npm run migration:audit` (full QA).",
  "**LAUNCH DAY:** `npm run migration:monitor` + redirect/canonical/sitemap focus; spot-check important 301s live.",
  "**FIRST WEEK:** daily monitor if CI scheduling supports it.",
  "**FIRST MONTH:** weekly monitor.",
  "**AFTER:** monthly monitor / fold into normal SEO audit cadence.",
].join(" ");
