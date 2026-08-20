import type { UrlMappingPlanSummary, UrlMappingRow } from "./types";

function esc(value: string | null | undefined): string {
  return (value ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function riskRank(risk: string): number {
  if (risk === "HIGH") return 0;
  if (risk === "MEDIUM") return 1;
  return 2;
}

function actionRank(action: string): number {
  if (action === "REVIEW") return 0;
  if (action === "301_REDIRECT" || action === "MERGE_AND_301" || action === "KEEP")
    return 1;
  if (action === "404" || action === "410" || action === "NOINDEX") return 2;
  return 3;
}

/** Sort: HIGH SEO RISK → REVIEW REQUIRED → 301 candidates → retirements. */
export function sortMappingRows(rows: UrlMappingRow[]): UrlMappingRow[] {
  return [...rows].sort((a, b) => {
    const r = riskRank(a.seoRisk) - riskRank(b.seoRisk);
    if (r !== 0) return r;
    const ar = actionRank(a.recommendedAction) - actionRank(b.recommendedAction);
    if (ar !== 0) return ar;
    return a.legacyPath.localeCompare(b.legacyPath);
  });
}

export function summarizeMappingPlan(
  rows: UrlMappingRow[],
  meta: { agent: string; version: string; generatedAt: string },
): UrlMappingPlanSummary {
  const meaningful = rows.filter(
    (r) =>
      !["tag", "author", "feed", "pagination", "query", "attachment", "locale"].includes(
        r.legacyIntent,
      ),
  );
  const mapped = rows.filter((r) => r.newPath);
  const unmapped = rows.filter((r) => !r.newPath);
  const byMatchBasis: Record<string, number> = {};
  const byIntent: Record<string, number> = {};
  for (const r of rows) {
    byMatchBasis[r.matchBasis] = (byMatchBasis[r.matchBasis] ?? 0) + 1;
    byIntent[r.legacyIntent] = (byIntent[r.legacyIntent] ?? 0) + 1;
  }
  return {
    agent: meta.agent,
    version: meta.version,
    generatedAt: meta.generatedAt,
    totalLegacy: rows.length,
    meaningfulLegacy: meaningful.length,
    mapped: mapped.length,
    unmapped: unmapped.length,
    keep: rows.filter((r) => r.recommendedAction === "KEEP").length,
    redirect301: rows.filter((r) => r.recommendedAction === "301_REDIRECT")
      .length,
    mergeAnd301: rows.filter((r) => r.recommendedAction === "MERGE_AND_301")
      .length,
    status404: rows.filter((r) => r.recommendedAction === "404").length,
    status410: rows.filter((r) => r.recommendedAction === "410").length,
    review: rows.filter((r) => r.recommendedAction === "REVIEW").length,
    highRisk: rows.filter((r) => r.seoRisk === "HIGH").length,
    lowConfidenceMapped: rows.filter(
      (r) => r.newPath && r.confidence === "LOW",
    ).length,
    byMatchBasis,
    byIntent,
  };
}

export function renderUrlMappingPlanMarkdown(input: {
  summary: UrlMappingPlanSummary;
  rows: UrlMappingRow[];
}): string {
  const { summary, rows } = input;
  const sorted = sortMappingRows(rows);
  const lines: string[] = [];

  lines.push("# URL Mapping Plan");
  lines.push("");
  lines.push(`**Agent:** ${summary.agent} v${summary.version}`);
  lines.push(`**Generated:** ${summary.generatedAt}`);
  lines.push("");
  lines.push(
    "> Mapping recommendations only. **Do not implement redirects** until this plan is approved.",
  );
  lines.push("");
  lines.push("## Matching priority used");
  lines.push("");
  lines.push("1. Explicit historical mapping (`migrationSeed` + path aliases)");
  lines.push("2. Same canonical entity / exact path");
  lines.push("3. Exact title/topic overlap");
  lines.push("4. Same product entity (reviews, pricing tabs, alternatives)");
  lines.push("5. Same comparison pair (order-insensitive)");
  lines.push("6. Same guide intent");
  lines.push("7. Same category / industry / audience cluster");
  lines.push("8. Semantic content similarity (token Jaccard, gated; not slug-substring)");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Count |");
  lines.push("| --- | ---: |");
  lines.push(`| Legacy URLs considered | ${summary.totalLegacy} |`);
  lines.push(`| Meaningful content URLs | ${summary.meaningfulLegacy} |`);
  lines.push(`| Mapped (have new URL) | ${summary.mapped} |`);
  lines.push(`| Unmapped (no new URL) | ${summary.unmapped} |`);
  lines.push(`| KEEP | ${summary.keep} |`);
  lines.push(`| 301_REDIRECT | ${summary.redirect301} |`);
  lines.push(`| MERGE_AND_301 | ${summary.mergeAnd301} |`);
  lines.push(`| 404 | ${summary.status404} |`);
  lines.push(`| 410 | ${summary.status410} |`);
  lines.push(`| REVIEW | ${summary.review} |`);
  lines.push(`| High SEO risk | ${summary.highRisk} |`);
  lines.push(`| Low-confidence mappings (have target) | ${summary.lowConfidenceMapped} |`);
  lines.push("");
  lines.push("### Match basis breakdown");
  lines.push("");
  lines.push("| Basis | Count |");
  lines.push("| --- | ---: |");
  for (const [k, v] of Object.entries(summary.byMatchBasis).sort(
    (a, b) => b[1] - a[1],
  )) {
    lines.push(`| ${k} | ${v} |`);
  }
  lines.push("");
  lines.push("## Mapping table");
  lines.push("");
  lines.push(
    "Sorted by **HIGH SEO risk → REVIEW required → 301 candidates → retirements**.",
  );
  lines.push("");
  lines.push(
    "| Legacy URL | Legacy title | New URL | New title | Relationship | Recommended action | Confidence | SEO risk | Reason |",
  );
  lines.push("| --- | --- | --- | --- | --- | --- | --- | --- | --- |");
  for (const r of sorted) {
    lines.push(
      `| \`${r.legacyPath}\` | ${esc(r.legacyTitle)} | ${r.newPath ? `\`${r.newPath}\`` : "—"} | ${esc(r.newTitle)} | ${r.relationship} | ${r.recommendedAction} | ${r.confidence} | ${r.seoRisk} | ${esc(r.reason)} |`,
    );
  }
  lines.push("");
  lines.push("## High-risk rows needing attention");
  lines.push("");
  const high = sorted.filter(
    (r) =>
      r.seoRisk === "HIGH" &&
      (r.recommendedAction === "REVIEW" ||
        r.confidence === "LOW" ||
        r.highRiskFlags.includes("low_confidence_mapping")),
  );
  if (high.length === 0) {
    lines.push("_None beyond the table sort order._");
  } else {
    lines.push("| Legacy | Action | Flags | Reason |");
    lines.push("| --- | --- | --- | --- |");
    for (const r of high.slice(0, 80)) {
      lines.push(
        `| \`${r.legacyPath}\` | ${r.recommendedAction} | ${r.highRiskFlags.join(", ")} | ${esc(r.reason)} |`,
      );
    }
    if (high.length > 80) {
      lines.push("");
      lines.push(`_…and ${high.length - 80} more_`);
    }
  }
  lines.push("");
  lines.push("## Low-confidence mappings");
  lines.push("");
  const low = sorted.filter((r) => r.newPath && r.confidence === "LOW");
  lines.push(`Count: **${low.length}**`);
  lines.push("");
  if (low.length) {
    lines.push("| Legacy | → New | Basis | Reason |");
    lines.push("| --- | --- | --- | --- |");
    for (const r of low.slice(0, 60)) {
      lines.push(
        `| \`${r.legacyPath}\` | \`${r.newPath}\` | ${r.matchBasis} | ${esc(r.reason)} |`,
      );
    }
  }
  lines.push("");
  lines.push("## Notes");
  lines.push("");
  lines.push(
    "- Comparison matching is **order-insensitive** via `canonicalizeComparisonSlug`.",
  );
  lines.push(
    "- Product pricing legacy URLs map to `/software/{slug}/pricing/` when the hub tab exists — not the overview.",
  );
  lines.push(
    "- Retired/out-of-strategy URLs use **410/404**, never homepage redirects.",
  );
  lines.push(
    "- GSC traffic/backlink signals were not available in this pass; high-risk flags use intent heuristics.",
  );
  lines.push(
    "- Machine-readable: [`data/url-mapping-plan.json`](./data/url-mapping-plan.json).",
  );
  lines.push("");
  return `${lines.join("\n")}\n`;
}
