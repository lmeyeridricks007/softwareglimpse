/**
 * Local SEO audit-agent contracts.
 * Agents ANALYZE → REPORT → RECOMMEND only. They never mutate production SEO/content.
 */

export type SeoAuditMode = "FAST" | "FULL";

export type SeoSeverity = "P0" | "P1" | "P2" | "P3";

export type SeoEffort = "small" | "medium" | "large";

export type SeoCheckStatus = "completed" | "skipped" | "failed";

export type SeoFindingStatus =
  | "NEW"
  | "EXISTING"
  | "RESOLVED"
  | "REGRESSED"
  | "UNCHANGED";

export type SeoAuditArea =
  | "technical"
  | "internal-linking"
  | "content-coverage"
  | "structured-data"
  | "performance"
  | "media"
  | "outbound";

export type SeoCheckResult = {
  id: string;
  status: SeoCheckStatus;
  reason?: string;
};

export type SeoFinding = {
  /** Stable across runs — see stable-ids.ts */
  id: string;
  severity: SeoSeverity;
  area: SeoAuditArea;
  problem: string;
  evidence: string;
  affectedPages: string[];
  likelyCause: string;
  recommendedAction: string;
  filesLikelyAffected: string[];
  expectedImpact: string;
  effort: SeoEffort;
  /** 0–1 */
  confidence: number;
};

export type SeoAgentMeta = {
  id: string;
  name: string;
  version: string;
  area: SeoAuditArea;
  /** Hard contract — audits never mutate production. */
  mutatesProduction: false;
};

export type SeoAgentContext = {
  mode: SeoAuditMode;
  now: Date;
  /** Optional injectable fixtures for tests / dry runs. */
  fixtures?: SeoAuditFixtures;
  /** When false, skip writing markdown (still returns result). */
  writeReports?: boolean;
  /**
   * Origin for live HTML/HTTP probes (e.g. http://127.0.0.1:3000 or production).
   * When set, agents that previously skipped live checks attempt them.
   */
  baseUrl?: string;
  /** Shared live probe results (filled by ensureLiveProbeBundle). */
  liveProbe?: import("./live-probe").LiveProbeBundle;
  /** Internal: in-flight probe promise shared across agents. */
  _liveProbePromise?: Promise<import("./live-probe").LiveProbeBundle>;
};

export type SeoAuditFixtures = {
  /** Synthetic pages for technical / structured-data checks. */
  pages?: SeoFixturePage[];
  /** Synthetic internal graph edges. */
  internalEdges?: Array<{ from: string; to: string }>;
  /** Synthetic outbound link records. */
  outboundLinks?: SeoFixtureOutboundLink[];
  /** Synthetic media assets. */
  mediaAssets?: SeoFixtureMedia[];
  /** Synthetic content-map coverage rows. */
  coverageRows?: SeoFixtureCoverageRow[];
  /** Force check failures for orchestrator failure reporting. */
  forceCheckFailures?: Array<{ checkId: string; reason: string }>;
};

export type SeoFixturePage = {
  path: string;
  statusCode?: number;
  indexable?: boolean;
  canonical?: string;
  inSitemap?: boolean;
  robots?: string;
  title?: string;
  description?: string;
  h1Count?: number;
  jsonLd?: unknown[];
  internalLinks?: string[];
};

export type SeoFixtureOutboundLink = {
  url: string;
  type: "affiliate" | "evidence" | "official" | "other";
  rel?: string[];
  productSlug?: string;
  pagePath?: string;
  redirectChain?: string[];
  broken?: boolean;
};

export type SeoFixtureMedia = {
  src: string;
  pagePath?: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
  bytes?: number;
  broken?: boolean;
  kind?: "image" | "video" | "thumbnail";
  videoObject?: Record<string, unknown> | null;
  /** Optional className from live HTML (used to detect aspect-/size-/fill layout). */
  className?: string;
};

export type SeoFixtureCoverageRow = {
  id: string;
  pageType: string;
  title: string;
  route: string | null;
  status: string;
  parent?: string;
  supports?: string;
  nextStep?: string;
  cluster?: string;
};

export type SeoAgentRunResult = {
  meta: SeoAgentMeta;
  mode: SeoAuditMode;
  startedAt: string;
  finishedAt: string;
  checks: SeoCheckResult[];
  findings: SeoFinding[];
  summary: string;
  reportPath?: string;
  archivePath?: string;
  error?: string;
};

export type SeoIssueDiffSummary = {
  NEW: number;
  RESOLVED: number;
  REGRESSED: number;
  UNCHANGED: number;
  EXISTING: number;
};

export type SeoIssueDiff = {
  summary: SeoIssueDiffSummary;
  items: Array<{
    id: string;
    status: SeoFindingStatus;
    severity?: SeoSeverity;
    problem?: string;
  }>;
};

export type SeoHealthOrchestratorResult = {
  startedAt: string;
  finishedAt: string;
  mode: SeoAuditMode;
  agents: SeoAgentRunResult[];
  findings: SeoFinding[];
  checksCompleted: number;
  checksSkipped: number;
  checksFailed: number;
  failedChecks: Array<{ agent: string; checkId: string; reason?: string }>;
  skippedChecks: Array<{ agent: string; checkId: string; reason?: string }>;
  diff: SeoIssueDiff;
  masterReportPath?: string;
  snapshotPath?: string;
};
