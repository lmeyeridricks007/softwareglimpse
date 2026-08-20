import fs from "node:fs";
import path from "node:path";
import { loadAuditInputs } from "./load-inputs";
import { runAllAuditChecks } from "./checks";
import { renderMigrationSeoAuditMarkdown } from "./report";
import {
  MIGRATION_SEO_AUDIT_AGENT,
  type MigrationSeoAuditResult,
} from "./types";

export type MigrationSeoAuditOptions = {
  write?: boolean;
  generatedAt?: string;
  /** Reserved for future live BASE_URL probing */
  liveBaseUrl?: string;
};

/**
 * MigrationSEOAuditAgent — validate migration SEO safety (static by default).
 */
export function runMigrationSeoAudit(
  opts: MigrationSeoAuditOptions = {},
): MigrationSeoAuditResult {
  const generatedAt = opts.generatedAt ?? new Date().toISOString();
  const write = opts.write !== false;
  const mode = opts.liveBaseUrl ? "static+live" : "static";

  const inputs = loadAuditInputs(new Date(generatedAt));
  const { findings, checks, fateRows } = runAllAuditChecks(inputs);

  const p0 = findings.filter((f) => f.severity === "P0").length;
  const p1 = findings.filter((f) => f.severity === "P1").length;
  const p2 = findings.filter((f) => f.severity === "P2").length;
  const fateOk = fateRows.filter((r) => r.ok).length;
  const fateIssues = fateRows.length - fateOk;

  const highRiskFindings = findings.filter((f) => f.check === "high_risk_coverage");
  const highRiskRedirectCandidates = inputs.seoPriority.filter((r) => {
    const action = inputs.mappingRows.find(
      (m) => m.legacyPath === r.legacyPath,
    )?.recommendedAction;
    return (
      (r.historicalSeoImportance === "CRITICAL" ||
        r.historicalSeoImportance === "HIGH" ||
        r.migrationRisk === "CRITICAL" ||
        r.migrationRisk === "HIGH") &&
      (action === "301_REDIRECT" || action === "MERGE_AND_301")
    );
  });

  const summary = {
    overall: (p0 > 0 ? "FAIL" : "PASS") as "PASS" | "FAIL",
    generatedAt,
    mode: mode as "static" | "static+live",
    totals: {
      legacyUrls: fateRows.length,
      fateOk,
      fateIssues,
      redirectsConfigured: inputs.redirects.redirects.length,
      highRiskRedirectOk: Math.max(
        0,
        highRiskRedirectCandidates.length - highRiskFindings.length,
      ),
      highRiskRedirectIssues: highRiskFindings.length,
      findingsP0: p0,
      findingsP1: p1,
      findingsP2: p2,
    },
    checks,
  };

  const paths = {
    markdown: path.join(
      process.cwd(),
      "docs/migration/MIGRATION-SEO-QA-LATEST.md",
    ),
    json: path.join(
      process.cwd(),
      "docs/migration/data/migration-seo-qa.json",
    ),
  };

  if (write) {
    fs.mkdirSync(path.dirname(paths.json), { recursive: true });
    fs.writeFileSync(
      paths.markdown,
      renderMigrationSeoAuditMarkdown({
        summary,
        findings,
        fateRows,
        checks,
      }),
    );
    fs.writeFileSync(
      paths.json,
      `${JSON.stringify(
        {
          agent: MIGRATION_SEO_AUDIT_AGENT,
          summary,
          findings,
          fateRows,
        },
        null,
        2,
      )}\n`,
    );
  }

  return { summary, findings, fateRows, paths };
}
