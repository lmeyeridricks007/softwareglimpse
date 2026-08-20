/**
 * MigrationSEOAuditAgent — pre/post-launch SEO safety checks for WP → Next migration.
 * Analyze only — does not mutate production or invent metrics.
 */

export type AuditSeverity = "P0" | "P1" | "P2";

export type AuditCheckId =
  | "legacy_url_fate"
  | "high_risk_coverage"
  | "internal_links"
  | "canonicals"
  | "sitemaps"
  | "structured_data"
  | "open_graph"
  | "hardcoded_legacy"
  | "legacy_assets"
  | "not_found_experience"
  | "redirect_hygiene";

export type LegacyFateKind =
  | "preserved_200"
  | "redirect_301"
  | "intentional_404"
  | "intentional_410"
  | "unresolved"
  | "excluded_manual";

export type AuditFinding = {
  id: string;
  check: AuditCheckId;
  severity: AuditSeverity;
  subject: string;
  problem: string;
  evidence: string;
  recommendedAction: string;
};

export type CheckStatus = "pass" | "fail" | "warn" | "skip";

export type AuditCheckResult = {
  id: AuditCheckId;
  title: string;
  status: CheckStatus;
  summary: string;
  findingCount: number;
};

export type LegacyFateRow = {
  legacyPath: string;
  expectedFate: LegacyFateKind;
  mappingAction: string;
  expectedDestination: string | null;
  implementedDestination: string | null;
  ok: boolean;
  issues: string[];
  importance: string;
  migrationRisk: string;
};

export type MigrationSeoAuditSummary = {
  overall: "PASS" | "FAIL";
  generatedAt: string;
  mode: "static" | "static+live";
  totals: {
    legacyUrls: number;
    fateOk: number;
    fateIssues: number;
    redirectsConfigured: number;
    highRiskRedirectOk: number;
    highRiskRedirectIssues: number;
    findingsP0: number;
    findingsP1: number;
    findingsP2: number;
  };
  checks: AuditCheckResult[];
};

export type MigrationSeoAuditResult = {
  summary: MigrationSeoAuditSummary;
  findings: AuditFinding[];
  fateRows: LegacyFateRow[];
  paths: {
    markdown: string;
    json: string;
  };
};

export const MIGRATION_SEO_AUDIT_AGENT = {
  id: "migration-seo-audit-agent",
  name: "MigrationSEOAuditAgent",
  version: "1.0.0",
  mutatesProduction: false as const,
};
