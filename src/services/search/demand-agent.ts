import fs from "node:fs";
import path from "node:path";

export type SearchDemandReport = {
  generatedAt: string;
  available: boolean;
  reason: string;
};

/**
 * SearchDemandOpportunityAgent — maps on-site search analytics to content gaps.
 * Only produces opportunity lists when privacy-safe analytics sinks persist data.
 */
export function runSearchDemandOpportunityAgent(): SearchDemandReport {
  return {
    generatedAt: new Date().toISOString(),
    available: false,
    reason:
      "No persisted on-site search analytics store yet. Events (search_submitted, search_zero_results, search_result_clicked, search_filter_used, search_suggestion_clicked) are emitted to the consent-aware analytics bus, but no first-party query log is configured. Do not fabricate popular terms.",
  };
}

export function formatSearchDemandMarkdown(report: SearchDemandReport): string {
  return [
    "# Search Demand — SoftwareGlimpse",
    "",
    `**Generated:** ${report.generatedAt}`,
    `**Analytics available:** ${report.available ? "yes" : "no"}`,
    "",
    "## Status",
    "",
    report.reason,
    "",
    "## When data exists, report should include",
    "",
    "- most searched terms",
    "- zero-result searches",
    "- high-search low-click terms",
    "- searches leading to Tools",
    "- searches leading to Products",
    "",
    "Map those to missing content, synonym gaps, navigation problems, and Tool/Resource opportunities.",
    "",
  ].join("\n");
}

export function formatSearchContentOpportunitiesMarkdown(
  report: SearchDemandReport,
): string {
  return [
    "# Search Content Opportunities",
    "",
    `**Generated:** ${report.generatedAt}`,
    "",
    report.available
      ? "See demand clusters below."
      : "DATA NOT AVAILABLE — configure a privacy-safe search analytics sink before listing opportunities. Do not invent queries.",
    "",
  ].join("\n");
}

export function writeSearchDemandReports(
  report: SearchDemandReport = runSearchDemandOpportunityAgent(),
): { demandPath: string; opportunitiesPath: string } {
  const demandDir = path.join(process.cwd(), "docs/site-intelligence");
  const contentDir = path.join(process.cwd(), "docs/content-quality");
  fs.mkdirSync(demandDir, { recursive: true });
  fs.mkdirSync(contentDir, { recursive: true });

  const demandPath = path.join(demandDir, "SEARCH-DEMAND-LATEST.md");
  const opportunitiesPath = path.join(
    contentDir,
    "SEARCH-CONTENT-OPPORTUNITIES.md",
  );

  fs.writeFileSync(demandPath, formatSearchDemandMarkdown(report), "utf8");
  fs.writeFileSync(
    opportunitiesPath,
    formatSearchContentOpportunitiesMarkdown(report),
    "utf8",
  );

  return { demandPath, opportunitiesPath };
}
