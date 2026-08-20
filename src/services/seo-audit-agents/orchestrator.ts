import type {
  SeoAgentContext,
  SeoAgentRunResult,
  SeoAuditMode,
  SeoFinding,
  SeoHealthOrchestratorResult,
} from "./types";
import { diffFindings, toSnapshot } from "./diff";
import {
  formatDiffSummary,
  formatFindingMarkdown,
  loadPreviousIssueSnapshot,
  writeIssueSnapshot,
  writeLatestReport,
  maybeWriteArchive,
} from "./report-io";
import { runSeoAgent, type SeoAgentRunner } from "./framework";
import { technicalSeoAuditAgent } from "./agents/technical";
import { internalLinkAuditAgent } from "./agents/internal-linking";
import { contentCoverageAuditAgent } from "./agents/content-coverage";
import { structuredDataAuditAgent } from "./agents/structured-data";
import { performanceAuditAgent } from "./agents/performance";
import { mediaSeoAuditAgent } from "./agents/media-seo";
import { outboundLinkAuditAgent } from "./agents/outbound-links";

export const SEO_HEALTH_ORCHESTRATOR = {
  id: "seo-health-orchestrator",
  name: "SEOHealthOrchestrator",
  version: "1.0.0",
  mutatesProduction: false as const,
};

export const ALL_SEO_AUDIT_AGENTS: SeoAgentRunner[] = [
  technicalSeoAuditAgent,
  internalLinkAuditAgent,
  contentCoverageAuditAgent,
  structuredDataAuditAgent,
  performanceAuditAgent,
  mediaSeoAuditAgent,
  outboundLinkAuditAgent,
];

export function getAgentByKey(key: string): SeoAgentRunner | undefined {
  const map: Record<string, SeoAgentRunner> = {
    technical: technicalSeoAuditAgent,
    links: internalLinkAuditAgent,
    "internal-linking": internalLinkAuditAgent,
    content: contentCoverageAuditAgent,
    "content-coverage": contentCoverageAuditAgent,
    schema: structuredDataAuditAgent,
    "structured-data": structuredDataAuditAgent,
    performance: performanceAuditAgent,
    perf: performanceAuditAgent,
    media: mediaSeoAuditAgent,
    outbound: outboundLinkAuditAgent,
  };
  return map[key];
}

function severityBucket(findings: SeoFinding[]) {
  return {
    P0: findings.filter((f) => f.severity === "P0"),
    P1: findings.filter((f) => f.severity === "P1"),
    P2: findings.filter((f) => f.severity === "P2"),
    P3: findings.filter((f) => f.severity === "P3"),
  };
}

function topRecommendations(findings: SeoFinding[], n = 20): SeoFinding[] {
  const rank = { P0: 0, P1: 1, P2: 2, P3: 3 } as const;
  return [...findings]
    .sort(
      (a, b) =>
        rank[a.severity] - rank[b.severity] ||
        b.confidence - a.confidence ||
        a.id.localeCompare(b.id),
    )
    .slice(0, n);
}

function formatMasterReport(input: {
  mode: SeoAuditMode;
  startedAt: string;
  finishedAt: string;
  agents: SeoAgentRunResult[];
  findings: SeoFinding[];
  checksCompleted: number;
  checksSkipped: number;
  checksFailed: number;
  failedChecks: SeoHealthOrchestratorResult["failedChecks"];
  skippedChecks: SeoHealthOrchestratorResult["skippedChecks"];
  diff: SeoHealthOrchestratorResult["diff"];
}): string {
  const buckets = severityBucket(input.findings);
  const top = topRecommendations(input.findings, 20);
  const byArea = (area: string) =>
    input.findings.filter((f) => f.area === area).length;

  const cleanClaimBlocked = input.checksFailed > 0 || input.checksSkipped > 0;

  return [
    `# SEO HEALTH LATEST`,
    "",
    `**Orchestrator:** ${SEO_HEALTH_ORCHESTRATOR.name} v${SEO_HEALTH_ORCHESTRATOR.version}  `,
    `**Mode:** ${input.mode}  `,
    `**Started:** ${input.startedAt}  `,
    `**Finished:** ${input.finishedAt}  `,
    "",
    `> ANALYZE → REPORT → RECOMMEND only. **No auto-fixes.** Do not change canonicals, robots, copy, scores, or affiliate links from this report alone.`,
    "",
    cleanClaimBlocked
      ? `> ⚠️ **Incomplete run:** ${input.checksFailed} check(s) failed, ${input.checksSkipped} skipped. Do **not** claim clean SEO.`
      : `> All registered checks completed for this mode.`,
    "",
    `## SEO HEALTH SUMMARY`,
    "",
    `| Metric | Value |`,
    `| --- | ---: |`,
    `| Findings | ${input.findings.length} |`,
    `| P0 | ${buckets.P0.length} |`,
    `| P1 | ${buckets.P1.length} |`,
    `| P2 | ${buckets.P2.length} |`,
    `| P3 | ${buckets.P3.length} |`,
    `| Checks completed | ${input.checksCompleted} |`,
    `| Checks skipped | ${input.checksSkipped} |`,
    `| Checks failed | ${input.checksFailed} |`,
    "",
    `## Changes since previous run`,
    "",
    formatDiffSummary(input.diff),
    `### New problems`,
    "",
    input.diff.items.filter((i) => i.status === "NEW").length
      ? input.diff.items
          .filter((i) => i.status === "NEW")
          .slice(0, 30)
          .map((i) => `- \`${i.id}\` ${i.severity ?? ""} — ${i.problem ?? ""}`)
          .join("\n")
      : "_None_",
    "",
    `### Resolved problems`,
    "",
    input.diff.items.filter((i) => i.status === "RESOLVED").length
      ? input.diff.items
          .filter((i) => i.status === "RESOLVED")
          .slice(0, 30)
          .map((i) => `- \`${i.id}\` — ${i.problem ?? ""}`)
          .join("\n")
      : "_None_",
    "",
    `### Regressed`,
    "",
    input.diff.items.filter((i) => i.status === "REGRESSED").length
      ? input.diff.items
          .filter((i) => i.status === "REGRESSED")
          .map((i) => `- \`${i.id}\` → ${i.severity} — ${i.problem ?? ""}`)
          .join("\n")
      : "_None_",
    "",
    `## Area rollup`,
    "",
    `| Area | Findings |`,
    `| --- | ---: |`,
    `| Indexability / technical | ${byArea("technical")} |`,
    `| Internal linking | ${byArea("internal-linking")} |`,
    `| Content coverage | ${byArea("content-coverage")} |`,
    `| Structured data | ${byArea("structured-data")} |`,
    `| Performance | ${byArea("performance")} |`,
    `| Media | ${byArea("media")} |`,
    `| Outbound links | ${byArea("outbound")} |`,
    "",
    `## Agent status`,
    "",
    `| Agent | Findings | Failed checks | Report |`,
    `| --- | ---: | ---: | --- |`,
    ...input.agents.map((a) => {
      const failed = a.checks.filter((c) => c.status === "failed").length;
      const rel = a.reportPath
        ? a.reportPath.replace(process.cwd() + "/", "")
        : "—";
      return `| ${a.meta.name} | ${a.findings.length} | ${failed} | \`${rel}\` |`;
    }),
    "",
    `## Checks failed`,
    "",
    input.failedChecks.length
      ? input.failedChecks
          .map(
            (c) =>
              `- **${c.agent}** / \`${c.checkId}\`${c.reason ? `: ${c.reason}` : ""}`,
          )
          .join("\n")
      : "_None_",
    "",
    `## Checks skipped`,
    "",
    input.skippedChecks.length
      ? input.skippedChecks
          .slice(0, 40)
          .map(
            (c) =>
              `- **${c.agent}** / \`${c.checkId}\`${c.reason ? `: ${c.reason}` : ""}`,
          )
          .join("\n")
      : "_None_",
    "",
    `## P0`,
    "",
    buckets.P0.length
      ? buckets.P0.map((f) => `- \`${f.id}\` — ${f.problem}`).join("\n")
      : "_None_",
    "",
    `## P1`,
    "",
    buckets.P1.length
      ? buckets.P1.slice(0, 40).map((f) => `- \`${f.id}\` — ${f.problem}`).join("\n")
      : "_None_",
    "",
    `## P2`,
    "",
    buckets.P2.length
      ? buckets.P2.slice(0, 40).map((f) => `- \`${f.id}\` — ${f.problem}`).join("\n")
      : "_None_",
    "",
    `## P3`,
    "",
    buckets.P3.length
      ? buckets.P3.slice(0, 30).map((f) => `- \`${f.id}\` — ${f.problem}`).join("\n")
      : "_None_",
    "",
    `## Top 20 recommendations`,
    "",
    ...top.map(formatFindingMarkdown),
    `---`,
    "",
    `_Individual agent reports live under \`docs/seo/reports/*-latest.md\`. Archive written for FULL mode only._`,
    "",
  ].join("\n");
}

export async function runSEOHealthOrchestrator(input: {
  mode?: SeoAuditMode;
  writeReports?: boolean;
  fixtures?: SeoAgentContext["fixtures"];
  agents?: SeoAgentRunner[];
  now?: Date;
  /** Live HTML/HTTP origin — also read from process.env.BASE_URL when omitted. */
  baseUrl?: string;
}): Promise<SeoHealthOrchestratorResult> {
  const mode = input.mode ?? "FAST";
  const now = input.now ?? new Date();
  const startedAt = now.toISOString();
  const runners = input.agents ?? ALL_SEO_AUDIT_AGENTS;
  const baseUrl =
    input.baseUrl?.replace(/\/$/, "") ||
    process.env.BASE_URL?.replace(/\/$/, "") ||
    undefined;
  const ctx: SeoAgentContext = {
    mode,
    now,
    fixtures: input.fixtures,
    writeReports: input.writeReports !== false,
    baseUrl,
  };

  const agents: SeoAgentRunResult[] = [];
  for (const runner of runners) {
    agents.push(await runSeoAgent(runner, ctx));
  }

  const findings = agents.flatMap((a) => a.findings);
  // Dedupe by stable id (same issue from multiple agents)
  const byId = new Map<string, SeoFinding>();
  for (const f of findings) {
    if (!byId.has(f.id)) byId.set(f.id, f);
  }
  const unique = [...byId.values()];

  let checksCompleted = 0;
  let checksSkipped = 0;
  let checksFailed = 0;
  const failedChecks: SeoHealthOrchestratorResult["failedChecks"] = [];
  const skippedChecks: SeoHealthOrchestratorResult["skippedChecks"] = [];
  for (const a of agents) {
    for (const c of a.checks) {
      if (c.status === "completed") checksCompleted += 1;
      if (c.status === "skipped") {
        checksSkipped += 1;
        skippedChecks.push({
          agent: a.meta.name,
          checkId: c.id,
          reason: c.reason,
        });
      }
      if (c.status === "failed") {
        checksFailed += 1;
        failedChecks.push({
          agent: a.meta.name,
          checkId: c.id,
          reason: c.reason,
        });
      }
    }
  }

  const previous = loadPreviousIssueSnapshot();
  const diff = diffFindings(previous, unique);
  const finishedAt = new Date().toISOString();

  const markdown = formatMasterReport({
    mode,
    startedAt,
    finishedAt,
    agents,
    findings: unique,
    checksCompleted,
    checksSkipped,
    checksFailed,
    failedChecks,
    skippedChecks,
    diff,
  });

  let masterReportPath: string | undefined;
  let snapshotPath: string | undefined;
  if (ctx.writeReports !== false) {
    masterReportPath = writeLatestReport("SEO-HEALTH-LATEST.md", markdown);
    maybeWriteArchive("seo-health.md", markdown, { mode, now });
    snapshotPath = writeIssueSnapshot(toSnapshot(unique, mode, finishedAt));
  }

  return {
    startedAt,
    finishedAt,
    mode,
    agents,
    findings: unique,
    checksCompleted,
    checksSkipped,
    checksFailed,
    failedChecks,
    skippedChecks,
    diff,
    masterReportPath,
    snapshotPath,
  };
}
