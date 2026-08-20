import fs from "node:fs";
import path from "node:path";
import { buildSearchIndex, runSearch } from "@/services/search";
import { SEARCH_RELEVANCE_FIXTURES } from "@/services/search/fixtures";

export type SearchQualityFinding = {
  severity: "info" | "warn" | "fail";
  code: string;
  message: string;
  query?: string;
};

export type SearchQualityReport = {
  generatedAt: string;
  indexSize: number;
  fixturePass: number;
  fixtureFail: number;
  findings: SearchQualityFinding[];
};

/**
 * SearchQualityAgent — audits ranking fixtures, zero results, and leakage risks.
 * Does not automatically manipulate ranking weights.
 */
export function runSearchQualityAgent(): SearchQualityReport {
  const findings: SearchQualityFinding[] = [];
  const index = buildSearchIndex({ force: true });
  let fixturePass = 0;
  let fixtureFail = 0;

  for (const fixture of SEARCH_RELEVANCE_FIXTURES) {
    const result = runSearch({ query: fixture.query });
    let ok = true;
    if (fixture.expectZero) {
      ok = result.total === 0;
    } else {
      const top = result.featured ?? result.hits[0];
      if (!top) ok = false;
      if (ok && fixture.expectType && top!.document.type !== fixture.expectType) {
        ok = false;
      }
      if (
        ok &&
        fixture.expectSlug &&
        top!.document.slug !== fixture.expectSlug
      ) {
        ok = false;
      }
      if (
        ok &&
        fixture.expectTitleIncludes &&
        !top!.document.title
          .toLowerCase()
          .includes(fixture.expectTitleIncludes.toLowerCase())
      ) {
        ok = false;
      }
    }

    if (ok) {
      fixturePass += 1;
    } else {
      fixtureFail += 1;
      const top = result.featured ?? result.hits[0];
      findings.push({
        severity: "fail",
        code: "FIXTURE_MISS",
        query: fixture.query,
        message: `Expected ${fixture.expectType ?? "zero"} / ${fixture.expectSlug ?? fixture.expectTitleIncludes ?? "n/a"}; got ${top ? `${top.document.type}:${top.document.title}` : "none"}`,
      });
    }
  }

  const leaked = index.filter(
    (d) =>
      d.canonicalUrl.startsWith("/go/") ||
      d.canonicalUrl.startsWith("/api/") ||
      d.canonicalUrl.includes("/dev/") ||
      !d.published,
  );
  if (leaked.length) {
    findings.push({
      severity: "fail",
      code: "LEAKAGE",
      message: `${leaked.length} documents look non-public or blocked-prefix`,
    });
  } else {
    findings.push({
      severity: "info",
      code: "LEAKAGE_OK",
      message: "No draft/admin/affiliate-redirect leakage detected in index",
    });
  }

  const thin = index.filter((d) => !d.summary || d.summary.trim().length < 20);
  if (thin.length > 0) {
    findings.push({
      severity: "warn",
      code: "THIN_SUMMARY",
      message: `${thin.length} documents have very short summaries`,
    });
  }

  const dupKeys = new Map<string, number>();
  for (const d of index) {
    const key = `${d.type}:${d.canonicalUrl}`;
    dupKeys.set(key, (dupKeys.get(key) ?? 0) + 1);
  }
  const dups = [...dupKeys.entries()].filter(([, n]) => n > 1);
  if (dups.length) {
    findings.push({
      severity: "warn",
      code: "DUPLICATE_URL",
      message: `${dups.length} duplicate type+URL pairs in index`,
    });
  }

  // Spot-check typo handling
  const typo = runSearch({ query: "pipedrve" });
  if (typo.featured?.document.slug !== "pipedrive") {
    findings.push({
      severity: "fail",
      code: "TYPO_HANDLING",
      query: "pipedrve",
      message: "Typo query did not resolve to Pipedrive",
    });
  } else {
    findings.push({
      severity: "info",
      code: "TYPO_OK",
      query: "pipedrve",
      message: "Typo resolves to Pipedrive with related results",
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    indexSize: index.length,
    fixturePass,
    fixtureFail,
    findings,
  };
}

export function formatSearchQualityMarkdown(report: SearchQualityReport): string {
  const lines: string[] = [
    "# Search Quality — SoftwareGlimpse",
    "",
    `**Generated:** ${report.generatedAt}`,
    `**Index size:** ${report.indexSize}`,
    `**Fixtures:** ${report.fixturePass} pass / ${report.fixtureFail} fail`,
    "",
    "> Audits common queries, expected top results, typo handling, and leakage.",
    "> Does **not** auto-tune ranking weights.",
    "",
    "## Findings",
    "",
  ];

  for (const finding of report.findings) {
    lines.push(
      `- **${finding.severity.toUpperCase()}** \`${finding.code}\`${finding.query ? ` (“${finding.query}”)` : ""} — ${finding.message}`,
    );
  }

  lines.push(
    "",
    "## Upgrade path",
    "",
    "- Current: deterministic in-process index + scoring (no SaaS).",
    "- Next: optional Postgres FTS / MiniSearch if catalogue grows past ~5k docs.",
    "- Later: Typesense/Meilisearch only if latency or ops needs justify it.",
    "",
  );

  return lines.join("\n");
}

export function writeSearchQualityReport(
  report: SearchQualityReport = runSearchQualityAgent(),
): { markdownPath: string; report: SearchQualityReport } {
  const markdown = formatSearchQualityMarkdown(report);
  const outDir = path.join(process.cwd(), "docs/site-intelligence");
  fs.mkdirSync(outDir, { recursive: true });
  const markdownPath = path.join(outDir, "SEARCH-QUALITY-LATEST.md");
  fs.writeFileSync(markdownPath, markdown, "utf8");
  return { markdownPath, report };
}
