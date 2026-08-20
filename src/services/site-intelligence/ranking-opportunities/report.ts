import type {
  RankingOpportunitiesReport,
  RankingOpportunity,
} from "./types";

function formatOpportunityBlock(o: RankingOpportunity, idx?: number): string[] {
  const lines: string[] = [];
  const title = idx != null ? `### ${idx}. \`${o.query}\`` : `### \`${o.query}\``;
  lines.push(title);
  lines.push("");
  lines.push(`- **Intent:** ${o.intent} (${o.intentClass})`);
  lines.push(
    `- **Current target page:** ${o.targetPage ? `\`${o.targetPage}\`` : "—"}`,
  );
  lines.push(
    `- **Current rank if known:** ${o.currentRank ?? "unknown / not measured"}`,
  );
  lines.push(`- **Opportunity score:** ${o.opportunityScore}/100 _(relative)_`);
  lines.push(`- **Feasibility band:** ${o.feasibility}`);
  lines.push(`- **Confidence:** ${o.confidence}`);
  lines.push(
    `- **Competitor strength:** ${o.competitorStrength ?? "—"} _(sampled pages; not DA)_`,
  );
  lines.push(`- **Clusters:** ${o.clusterIds.join(", ")}`);
  lines.push("");
  if (o.dimensions.length) {
    lines.push("| Dimension | Score | Reason |");
    lines.push("| --- | ---: | --- |");
    for (const d of o.dimensions) {
      lines.push(
        `| ${d.id} | ${d.score ?? "n/a"} | ${d.reason.replace(/\|/g, "/")} |`,
      );
    }
    lines.push("");
  }
  lines.push("**SoftwareGlimpse strengths**");
  for (const s of o.strengths) lines.push(`- ${s}`);
  lines.push("");
  lines.push("**SoftwareGlimpse weaknesses**");
  for (const s of o.weaknesses) lines.push(`- ${s}`);
  lines.push("");
  lines.push("**Required improvements**");
  for (const s of o.requiredImprovements) lines.push(`- ${s}`);
  lines.push("");
  lines.push("**Internal links required**");
  for (const s of o.internalLinksRequired) lines.push(`- ${s}`);
  lines.push("");
  lines.push("**Supporting content needed**");
  for (const s of o.supportingContentNeeded) lines.push(`- ${s}`);
  lines.push("");
  lines.push("**Research needed**");
  for (const s of o.researchNeeded) lines.push(`- ${s}`);
  lines.push("");
  lines.push(`**Authority caveat:** ${o.authorityCaveat}`);
  lines.push("");
  lines.push(`**Recommended action:** ${o.recommendedAction}`);
  lines.push("");
  return lines;
}

function summaryTable(opps: RankingOpportunity[], limit?: number): string[] {
  const lines: string[] = [];
  lines.push(
    "| # | Query | Page | Score | Feasibility | Action |",
  );
  lines.push("| ---: | --- | --- | ---: | --- | --- |");
  const rows = limit == null ? opps : opps.slice(0, limit);
  rows.forEach((o, i) => {
    lines.push(
      `| ${i + 1} | ${o.query} | ${o.targetPage ? `\`${o.targetPage}\`` : "—"} | ${o.opportunityScore} | ${o.feasibility} | ${o.recommendedAction.replace(/\|/g, "/").slice(0, 60)} |`,
    );
  });
  lines.push("");
  return lines;
}

function pageTypeFromPath(page: string | null): string {
  if (!page) return "unmapped";
  if (page.startsWith("/software/")) return "product-review";
  if (page.startsWith("/guides/")) return "guide";
  if (page === "/compare/" || page === "/compare") return "comparison-hub";
  if (page.startsWith("/compare/")) return "comparison";
  if (page.startsWith("/alternatives/")) return "alternatives";
  if (page.startsWith("/best/")) return "best";
  if (page.startsWith("/resources/")) return "resource";
  if (page.startsWith("/tools/")) return "tool";
  if (page.startsWith("/industries/")) return "industry";
  if (page.startsWith("/use-cases/")) return "use-case";
  if (page.startsWith("/capabilities/")) return "capability";
  if (page.startsWith("/features/")) return "feature";
  if (page.startsWith("/requirements/")) return "requirement";
  if (page.startsWith("/for/")) return "audience";
  if (page.startsWith("/categories/")) return "category";
  return "other";
}

const TYPE_ORDER = [
  "category",
  "best",
  "product-review",
  "comparison",
  "comparison-hub",
  "alternatives",
  "guide",
  "tool",
  "resource",
  "industry",
  "use-case",
  "capability",
  "feature",
  "requirement",
  "audience",
  "other",
  "unmapped",
] as const;

function fullInventoryTables(opps: RankingOpportunity[]): string[] {
  const byType = new Map<string, RankingOpportunity[]>();
  for (const o of opps) {
    const t = pageTypeFromPath(o.targetPage);
    const list = byType.get(t) ?? [];
    list.push(o);
    byType.set(t, list);
  }

  const lines: string[] = [];
  lines.push("## Complete CRM ranking opportunity inventory");
  lines.push("");
  lines.push(
    `Every evaluated CRM target page (${opps.length}). Sorted by opportunity score within each page type.`,
  );
  lines.push("");
  lines.push("| Page type | Opportunities |");
  lines.push("| --- | ---: |");
  for (const t of TYPE_ORDER) {
    const n = byType.get(t)?.length ?? 0;
    if (!n) continue;
    lines.push(`| ${t} | ${n} |`);
  }
  lines.push(`| **Total** | **${opps.length}** |`);
  lines.push("");

  for (const t of TYPE_ORDER) {
    const list = byType.get(t);
    if (!list?.length) continue;
    list.sort((a, b) => b.opportunityScore - a.opportunityScore || a.query.localeCompare(b.query));
    lines.push(`### ${t} (${list.length})`);
    lines.push("");
    lines.push(...summaryTable(list));
  }
  return lines;
}

export function formatRankingOpportunitiesMarkdown(
  report: RankingOpportunitiesReport,
): string {
  const lines: string[] = [];
  lines.push("# Ranking Opportunities — SoftwareGlimpse");
  lines.push("");
  lines.push(`**Generated:** ${report.generatedAt}`);
  lines.push(`**Cluster:** ${report.cluster}`);
  lines.push(
    `**Coverage:** ${report.opportunities.length} opportunities — **all** CRM catalogue pages evaluated (one primary opportunity per target page)`,
  );
  lines.push("");
  lines.push(
    "> Relative opportunity and feasibility only. **Not** a Google ranking probability. **Not** a timeline prediction.",
  );
  lines.push("");
  lines.push(`> **Authority:** ${report.authorityCaveatGlobal}`);
  lines.push("");

  lines.push("## Sources");
  lines.push("");
  lines.push("| Source | Path | Status |");
  lines.push("| --- | --- | --- |");
  for (const s of report.sources) {
    lines.push(`| ${s.id} | \`${s.path}\` | ${s.status} |`);
  }
  lines.push("");

  lines.push("## Disclaimers");
  lines.push("");
  for (const d of report.disclaimers) lines.push(`- ${d}`);
  lines.push("");

  if (report.notes.length) {
    lines.push("## Notes");
    lines.push("");
    for (const n of report.notes) lines.push(`- ${n}`);
    lines.push("");
  }

  lines.push("## Top 25 strongest opportunities");
  lines.push("");
  lines.push(...summaryTable(report.topStrongest, 25));
  report.topStrongest.slice(0, 10).forEach((o, i) => {
    lines.push(...formatOpportunityBlock(o, i + 1));
  });
  if (report.topStrongest.length > 10) {
    lines.push(
      `_Detail blocks shown for top 10; remaining ${report.topStrongest.length - 10} are in the summary table. Full catalogue is in **Complete CRM ranking opportunity inventory** below._`,
    );
    lines.push("");
  }

  lines.push("## Top 25 hardest targets");
  lines.push("");
  lines.push(...summaryTable(report.topHardest, 25));

  lines.push("## Existing pages closest to breaking through");
  lines.push("");
  if (!report.closestToBreakthrough.length) {
    lines.push("_None flagged in this run._");
    lines.push("");
  } else {
    lines.push(...summaryTable(report.closestToBreakthrough, 15));
    for (const o of report.closestToBreakthrough.slice(0, 5)) {
      lines.push(...formatOpportunityBlock(o));
    }
  }

  lines.push("## Pages requiring substantial upgrades");
  lines.push("");
  if (!report.needsSubstantialUpgrade.length) {
    lines.push("_None flagged in this run._");
    lines.push("");
  } else {
    lines.push(...summaryTable(report.needsSubstantialUpgrade, 15));
  }

  lines.push("## New content opportunities");
  lines.push("");
  if (!report.newContentOpportunities.length) {
    lines.push("_None flagged in this run._");
    lines.push("");
  } else {
    lines.push(...summaryTable(report.newContentOpportunities, 15));
  }

  lines.push("## Cluster opportunities");
  lines.push("");
  lines.push(
    "| Cluster | Queries | Pages | Avg score | Feasibility | Action |",
  );
  lines.push("| --- | ---: | ---: | ---: | --- | --- |");
  for (const c of report.clusters) {
    lines.push(
      `| ${c.label} | ${c.queries.length} | ${c.pageCount} | ${c.avgScore} | ${c.feasibility} | ${c.recommendedAction.replace(/\|/g, "/").slice(0, 70)} |`,
    );
  }
  lines.push("");
  for (const c of report.clusters) {
    lines.push(`### ${c.label}`);
    lines.push("");
    lines.push(`- **Queries:** ${c.queries.join("; ")}`);
    lines.push(`- **Avg opportunity score:** ${c.avgScore}/100 _(relative)_`);
    lines.push(`- **Feasibility:** ${c.feasibility}`);
    lines.push(`- **Authority caveat:** ${c.authorityCaveat}`);
    lines.push("**Strengths**");
    for (const s of c.strengths) lines.push(`- ${s}`);
    lines.push("**Weaknesses**");
    for (const s of c.weaknesses) lines.push(`- ${s}`);
    lines.push(`**Recommended action:** ${c.recommendedAction}`);
    lines.push("");
  }

  lines.push("## Low-value topics to avoid");
  lines.push("");
  if (!report.lowValueAvoid.length) {
    lines.push("_None flagged in this run._");
    lines.push("");
  } else {
    for (const o of report.lowValueAvoid) {
      lines.push(`- **\`${o.query}\`** — ${o.avoidReason ?? "Low relative value"}`);
    }
    lines.push("");
  }

  lines.push(...fullInventoryTables(report.opportunities));

  lines.push("## Refresh");
  lines.push("");
  lines.push("```bash");
  lines.push("npm run site:ranking-opportunities");
  lines.push("npm run site:ranking-opportunities -- --fixture");
  lines.push("npm run site:crm-keywords   # companion full keyword inventory");
  lines.push("```");
  lines.push("");
  lines.push(
    "Re-run after SERP / benchmark / CQ / map refresh. Do not treat old opportunity snapshots as current.",
  );
  lines.push("");
  return lines.join("\n");
}
