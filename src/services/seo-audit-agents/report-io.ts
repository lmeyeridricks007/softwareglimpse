import fs from "node:fs";
import path from "node:path";
import type { SeoFinding, SeoIssueDiff } from "./types";
import type { SeoIssueSnapshot } from "./diff";

export const SEO_REPORTS_DIR = path.join(process.cwd(), "docs", "seo", "reports");
export const SEO_ARCHIVE_DIR = path.join(SEO_REPORTS_DIR, "archive");
export const SEO_SNAPSHOT_PATH = path.join(
  SEO_ARCHIVE_DIR,
  "seo-issues-latest.json",
);

export function ensureReportDirs(): void {
  fs.mkdirSync(SEO_REPORTS_DIR, { recursive: true });
  fs.mkdirSync(SEO_ARCHIVE_DIR, { recursive: true });
}

export function loadPreviousIssueSnapshot(): SeoIssueSnapshot | null {
  if (!fs.existsSync(SEO_SNAPSHOT_PATH)) return null;
  try {
    return JSON.parse(
      fs.readFileSync(SEO_SNAPSHOT_PATH, "utf8"),
    ) as SeoIssueSnapshot;
  } catch {
    return null;
  }
}

export function writeIssueSnapshot(snapshot: SeoIssueSnapshot): string {
  ensureReportDirs();
  fs.writeFileSync(SEO_SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2), "utf8");
  return SEO_SNAPSHOT_PATH;
}

export function writeLatestReport(filename: string, markdown: string): string {
  ensureReportDirs();
  const full = path.join(SEO_REPORTS_DIR, filename);
  fs.writeFileSync(full, markdown, "utf8");
  return full;
}

/**
 * Archive policy: write dated archive for FULL runs, or when forced.
 * Avoids hundreds of files from frequent FAST local runs.
 */
export function maybeWriteArchive(
  basename: string,
  markdown: string,
  options: { mode: string; force?: boolean; now?: Date },
): string | undefined {
  if (options.mode !== "FULL" && !options.force) return undefined;
  ensureReportDirs();
  const d = options.now ?? new Date();
  const day = d.toISOString().slice(0, 10);
  const full = path.join(SEO_ARCHIVE_DIR, `${day}-${basename}`);
  fs.writeFileSync(full, markdown, "utf8");
  return full;
}

export function formatFindingMarkdown(f: SeoFinding): string {
  return [
    `### ${f.id} — ${f.severity}`,
    "",
    `| Field | Value |`,
    `| --- | --- |`,
    `| Severity | ${f.severity} |`,
    `| Area | ${f.area} |`,
    `| Problem | ${f.problem} |`,
    `| Evidence | ${f.evidence} |`,
    `| Affected pages | ${f.affectedPages.map((p) => `\`${p}\``).join(", ") || "—"} |`,
    `| Likely cause | ${f.likelyCause} |`,
    `| Recommended action | ${f.recommendedAction} |`,
    `| Files/components | ${f.filesLikelyAffected.map((p) => `\`${p}\``).join(", ") || "—"} |`,
    `| Expected impact | ${f.expectedImpact} |`,
    `| Effort | ${f.effort} |`,
    `| Confidence | ${(f.confidence * 100).toFixed(0)}% |`,
    "",
  ].join("\n");
}

export function formatFindingsSection(findings: SeoFinding[]): string {
  if (findings.length === 0) {
    return "_No findings for this agent in this run._\n";
  }
  const bySev = (["P0", "P1", "P2", "P3"] as const).flatMap((sev) =>
    findings.filter((f) => f.severity === sev),
  );
  return bySev.map(formatFindingMarkdown).join("\n");
}

export function formatDiffSummary(diff: SeoIssueDiff): string {
  const s = diff.summary;
  return [
    `| Status | Count |`,
    `| --- | ---: |`,
    `| NEW | ${s.NEW} |`,
    `| RESOLVED | ${s.RESOLVED} |`,
    `| REGRESSED | ${s.REGRESSED} |`,
    `| UNCHANGED | ${s.UNCHANGED} |`,
    `| EXISTING | ${s.EXISTING} |`,
    "",
  ].join("\n");
}

export function agentReportHeader(input: {
  title: string;
  agentName: string;
  mode: string;
  startedAt: string;
  finishedAt: string;
  checksCompleted: number;
  checksSkipped: number;
  checksFailed: number;
  findingCount: number;
}): string {
  return [
    `# ${input.title}`,
    "",
    `**Agent:** ${input.agentName}  `,
    `**Mode:** ${input.mode}  `,
    `**Started:** ${input.startedAt}  `,
    `**Finished:** ${input.finishedAt}  `,
    "",
    `> Report-only. This agent does **not** change canonicals, robots, content, scores, or affiliate links.`,
    "",
    `## Run status`,
    "",
    `| Checks | Count |`,
    `| --- | ---: |`,
    `| Completed | ${input.checksCompleted} |`,
    `| Skipped | ${input.checksSkipped} |`,
    `| Failed | ${input.checksFailed} |`,
    `| Findings | ${input.findingCount} |`,
    "",
  ].join("\n");
}
