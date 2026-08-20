/**
 * LegacyMigrationMonitorAgent — post-launch health monitoring for migration redirects.
 * Analyze only — never auto-modifies redirects.
 */

export type MonitorIssueState =
  | "NEW"
  | "OPEN"
  | "RESOLVED"
  | "REGRESSED"
  | "INTENTIONAL";

export type MonitorIssueKind =
  | "REDIRECT"
  | "TARGET"
  | "CHAIN"
  | "LOOP"
  | "404"
  | "CANONICAL"
  | "SITEMAP"
  | "INTERNAL"
  | "GSC"
  | "IMPORTANT";

export type MonitorSeverity = "P0" | "P1" | "P2";

export type MonitorIssue = {
  id: string;
  kind: MonitorIssueKind;
  severity: MonitorSeverity;
  subject: string;
  problem: string;
  evidence: string;
  recommendedAction: string;
  important: boolean;
  state: MonitorIssueState;
  firstSeenAt?: string;
  lastSeenAt?: string;
};

export type MonitorCheckId =
  | "redirect_health"
  | "target_status"
  | "chains_loops"
  | "unexpected_404"
  | "canonical_regression"
  | "sitemap_regression"
  | "internal_legacy"
  | "important_urls"
  | "gsc_signals";

export type MonitorCheckResult = {
  id: MonitorCheckId;
  title: string;
  status: "pass" | "warn" | "fail" | "skip";
  summary: string;
  issueCount: number;
};

export type MonitorGscSection = {
  available: boolean;
  mode: string;
  notes: string[];
  /** Signals only when real (non-synthetic) data exists — never invented. */
  signals: Array<{
    id: string;
    label: string;
    detail: string;
    interpretWithCaution: true;
  }>;
};

export type MonitorSummary = {
  overall: "HEALTHY" | "ATTENTION" | "CRITICAL";
  generatedAt: string;
  mode: "static" | "static+live";
  totals: {
    issuesOpen: number;
    issuesNew: number;
    issuesResolved: number;
    issuesRegressed: number;
    issuesIntentional: number;
    redirectsChecked: number;
    importantUrlsWatched: number;
    p0: number;
    p1: number;
    p2: number;
  };
  checks: MonitorCheckResult[];
  scheduleHint: string;
};

export type MonitorIssueSnapshot = {
  generatedAt: string;
  mode: string;
  issues: Array<{
    id: string;
    kind: MonitorIssueKind;
    severity: MonitorSeverity;
    subject: string;
    problem: string;
    state: MonitorIssueState;
    important: boolean;
    firstSeenAt: string;
    lastSeenAt: string;
  }>;
};

export type LegacyMigrationMonitorResult = {
  summary: MonitorSummary;
  issues: MonitorIssue[];
  gsc: MonitorGscSection;
  paths: {
    markdown: string;
    json: string;
    snapshot: string;
    archive?: string;
  };
};

export const LEGACY_MIGRATION_MONITOR_AGENT = {
  id: "legacy-migration-monitor-agent",
  name: "LegacyMigrationMonitorAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
};
