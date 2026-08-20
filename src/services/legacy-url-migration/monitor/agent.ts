import fs from "node:fs";
import path from "node:path";
import { detectMonitorIssues } from "./detect";
import { collectGscMonitorSignals } from "./gsc-signals";
import {
  applyReappearanceRegression,
  loadIntentionalAllowlist,
  loadPreviousMonitorSnapshot,
  loadPreviousResolvedIds,
  reconcileIssueStates,
  toMonitorSnapshot,
  writeMonitorSnapshot,
  writeResolvedHistory,
} from "./issue-store";
import { DEFAULT_SCHEDULE_HINT, renderMigrationMonitorMarkdown } from "./report";
import {
  LEGACY_MIGRATION_MONITOR_AGENT,
  type LegacyMigrationMonitorResult,
  type MonitorCheckResult,
  type MonitorIssue,
} from "./types";

export type LegacyMigrationMonitorOptions = {
  write?: boolean;
  archive?: boolean;
  generatedAt?: string;
  importPath?: string;
  skipRepoScan?: boolean;
  liveBaseUrl?: string;
};

function buildChecks(issues: MonitorIssue[]): MonitorCheckResult[] {
  const active = issues.filter(
    (i) => i.state === "NEW" || i.state === "OPEN" || i.state === "REGRESSED",
  );
  const byKind = (kinds: string[]) =>
    active.filter((i) => kinds.includes(i.kind));

  const mk = (
    id: MonitorCheckResult["id"],
    title: string,
    subset: MonitorIssue[],
    passSummary: string,
  ): MonitorCheckResult => {
    const p0 = subset.some((i) => i.severity === "P0");
    return {
      id,
      title,
      status: subset.length === 0 ? "pass" : p0 ? "fail" : "warn",
      summary:
        subset.length === 0
          ? passSummary
          : `${subset.length} active issue(s)`,
      issueCount: subset.length,
    };
  };

  return [
    mk(
      "redirect_health",
      "Legacy redirect health",
      byKind(["REDIRECT"]),
      "Configured redirects look consistent with mapping",
    ),
    mk(
      "target_status",
      "Redirect target status",
      byKind(["TARGET"]),
      "All redirect targets validate against inventory",
    ),
    mk(
      "chains_loops",
      "Redirect chains / loops",
      byKind(["CHAIN", "LOOP"]),
      "No chains or loops detected",
    ),
    mk(
      "unexpected_404",
      "Unexpected 404 risk on important legacy URLs",
      byKind(["404"]),
      "Important legacy URLs have redirects or intentional retirement",
    ),
    mk(
      "canonical_regression",
      "Canonical regressions",
      byKind(["CANONICAL"]),
      "No canonical regressions detected",
    ),
    mk(
      "sitemap_regression",
      "Sitemap regressions",
      byKind(["SITEMAP"]),
      "Sitemap does not include redirect/noindex URLs",
    ),
    mk(
      "internal_legacy",
      "Legacy URLs reintroduced internally",
      byKind(["INTERNAL"]),
      "No internal links / repo hits to redirect sources",
    ),
    mk(
      "important_urls",
      "Important legacy URL watchlist",
      active.filter((i) => i.important),
      "No active issues on important legacy URLs",
    ),
    mk(
      "gsc_signals",
      "Search Console signals",
      byKind(["GSC"]),
      "No GSC overlap signals (or GSC unavailable)",
    ),
  ];
}

/**
 * LegacyMigrationMonitorAgent — periodic post-launch migration health.
 * Never auto-modifies redirects.
 */
export function runLegacyMigrationMonitor(
  opts: LegacyMigrationMonitorOptions = {},
): LegacyMigrationMonitorResult {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const write = opts.write !== false;
  const archive = opts.archive !== false;
  const mode = opts.liveBaseUrl ? "static+live" : "static";

  const detected = detectMonitorIssues({
    now: new Date(generatedAt),
    skipRepoScan: opts.skipRepoScan,
  });
  const gscBundle = collectGscMonitorSignals({ importPath: opts.importPath });

  const draftsById = new Map(
    [...detected.drafts, ...gscBundle.drafts].map((d) => [d.id, d]),
  );
  const drafts = [...draftsById.values()];

  const intentional = loadIntentionalAllowlist();
  const intentionalIds = new Set(intentional.issueIds);
  const previous = loadPreviousMonitorSnapshot();
  const previousResolved = loadPreviousResolvedIds();

  const reconciled = reconcileIssueStates({
    current: drafts,
    previous,
    intentionalIds,
    now: generatedAt,
  });

  let issues = applyReappearanceRegression(
    reconciled.issues,
    previousResolved,
    reconciled.counts,
  );

  const checks = buildChecks(issues);
  const active = issues.filter(
    (i) => i.state === "NEW" || i.state === "OPEN" || i.state === "REGRESSED",
  );
  const p0 = active.filter((i) => i.severity === "P0").length;
  const p1 = active.filter((i) => i.severity === "P1").length;
  const p2 = active.filter((i) => i.severity === "P2").length;

  const overall =
    p0 > 0 ? "CRITICAL" : active.length > 0 ? "ATTENTION" : "HEALTHY";

  const summary = {
    overall: overall as LegacyMigrationMonitorResult["summary"]["overall"],
    generatedAt,
    mode: mode as "static" | "static+live",
    totals: {
      issuesOpen: reconciled.counts.OPEN,
      issuesNew: reconciled.counts.NEW,
      issuesResolved: reconciled.counts.RESOLVED,
      issuesRegressed: reconciled.counts.REGRESSED,
      issuesIntentional: reconciled.counts.INTENTIONAL,
      redirectsChecked: detected.redirectsChecked,
      importantUrlsWatched: detected.importantUrlsWatched,
      p0,
      p1,
      p2,
    },
    checks,
    scheduleHint: DEFAULT_SCHEDULE_HINT,
  };

  const outDir = path.join(process.cwd(), "docs", "migration");
  const archiveDir = path.join(outDir, "archive");
  const dataDir = path.join(outDir, "data");
  const paths: LegacyMigrationMonitorResult["paths"] = {
    markdown: path.join(outDir, "MIGRATION-MONITOR-LATEST.md"),
    json: path.join(dataDir, "migration-monitor.json"),
    snapshot: path.join(dataDir, "migration-monitor-issues-latest.json"),
  };

  if (write) {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.mkdirSync(archiveDir, { recursive: true });

    const markdown = renderMigrationMonitorMarkdown({
      summary,
      issues,
      gsc: gscBundle.gsc,
      checks,
    });
    fs.writeFileSync(paths.markdown, markdown);

    if (archive) {
      const day = generatedAt.slice(0, 10);
      paths.archive = path.join(
        archiveDir,
        `${day}-migration-monitor.md`,
      );
      fs.writeFileSync(paths.archive, markdown);
    }

    fs.writeFileSync(
      paths.json,
      `${JSON.stringify(
        {
          agent: LEGACY_MIGRATION_MONITOR_AGENT,
          summary,
          issues,
          gsc: gscBundle.gsc,
        },
        null,
        2,
      )}\n`,
    );

    writeMonitorSnapshot(toMonitorSnapshot(issues, mode, generatedAt));
    writeResolvedHistory(issues);
  }

  return {
    summary,
    issues,
    gsc: gscBundle.gsc,
    paths,
  };
}
