import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import type { CompareAuditReport, CompareIndexEvaluation } from "./types";

function esc(v: string): string {
  return v.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

export function formatCompareAuditMarkdown(report: CompareAuditReport): string {
  const s = report.summary;
  const life = s.byLifecycle;
  const lines: string[] = [];
  lines.push("# Comparison index-worthiness audit");
  lines.push("");
  lines.push(`**Generated:** ${report.generatedAt}`);
  lines.push(`**Engine:** compare-index-worthiness v${report.version}`);
  lines.push("");
  lines.push(
    "Lifecycle-first policy: weak comparisons are **preserved** under IMPROVE (temporary `noindex,follow`), then remediated and promoted to INDEXABLE. Cartesian pairs are not deleted — they stay in the improvement queue until competitive relationships and quality gates clear.",
  );
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Count |");
  lines.push("| --- | ---: |");
  lines.push(`| Total comparison pages | ${s.total} |`);
  lines.push(`| Indexable | ${life.INDEXABLE} |`);
  lines.push(
    `| Improvement queue | ${s.improvementQueueCount} (IMPROVE ${life.IMPROVE} · IMPROVING ${life.IMPROVING}) |`,
  );
  lines.push(
    `| Ready for promotion | ${s.readyForPromotionCount} (INDEXABLE_READY ${life.INDEXABLE_READY} · READY_FOR_REVIEW ${life.READY_FOR_REVIEW}) |`,
  );
  lines.push(`| Manual review | ${s.manualReviewCount} |`);
  lines.push(`| Retired | ${s.retiredCount} |`);
  lines.push(
    `| Potential indexable after remediation | ${s.potentialIndexableAfterRemediation} |`,
  );
  lines.push(`| Search-indexable (post-policy) | ${s.searchIndexableCount} |`);
  lines.push(
    `| Seed \`seo.indexable=true\` (pre-policy) | ${s.previouslySeedIndexableCount} |`,
  );
  lines.push(`| Orphans (0 inbound estimate) | ${s.orphanCount} |`);
  lines.push(`| Near-orphans (1 inbound) | ${s.nearOrphanCount} |`);
  lines.push(`| Duplicate-risk clusters | ${s.duplicateClusterCount} |`);
  lines.push("");
  lines.push("### Legacy class counts (compat)");
  lines.push("");
  lines.push("| Class | Count |");
  lines.push("| --- | ---: |");
  lines.push(`| KEEP_INDEX | ${s.byClass.KEEP_INDEX} |`);
  lines.push(`| IMPROVE | ${s.byClass.IMPROVE} |`);
  lines.push(`| NOINDEX | ${s.byClass.NOINDEX} |`);
  lines.push(`| MERGE | ${s.byClass.MERGE} |`);
  lines.push(`| REDIRECT | ${s.byClass.REDIRECT} |`);
  lines.push(`| REVIEW_MANUALLY | ${s.byClass.REVIEW_MANUALLY} |`);
  lines.push("");
  lines.push("## Policy");
  lines.push("");
  lines.push(
    "- Same-category **Cartesian** pairs without declared relationships → **IMPROVE** (WEAK_COMPARISON_RELATIONSHIP) — not deleted.",
  );
  lines.push(
    "- Declared competitive relationships + quality/differentiation/decision gates → **INDEXABLE**.",
  );
  lines.push(
    "- Soft gaps on otherwise legitimate pairs → **IMPROVE** → remediate → **INDEXABLE_READY** → promote.",
  );
  lines.push(
    "- Best-of co-appearance without declarations → **MANUAL_REVIEW**.",
  );
  lines.push(
    "- MANUAL_REVIEW backlog is triaged by `npm run seo:compare-manual-review -- --apply` (evidence → DIRECT_COMPETITOR / ALTERNATIVE / CROSS_CATEGORY_DECISION / SPECIALIST_VS_GENERALIST / WEAK_RELATIONSHIP / MISSING_DATA / NONSENSICAL). See `docs/seo/COMPARE-MANUAL-REVIEW.md`.",
  );
  lines.push(
    "- New generation must call `mayCreateIndexableComparison` — unrestricted Cartesian cannot silently set `indexable: true`.",
  );
  lines.push(
    "- **RETIRED** only for genuinely obsolete / invalid / duplicate pages.",
  );
  lines.push("");
  lines.push("## By category");
  lines.push("");
  lines.push("| Category | Total | Indexable | Not indexed | Improve queue |");
  lines.push("| --- | ---: | ---: | ---: | ---: |");
  for (const row of s.byCategory) {
    lines.push(
      `| ${esc(row.category)} | ${row.total} | ${row.keepIndex} | ${row.noindex} | ${row.improve} |`,
    );
  }
  lines.push("");
  lines.push("## Content completeness distributions");
  lines.push("");
  lines.push("| Metric | p25 | p50 | p75 |");
  lines.push("| --- | ---: | ---: | ---: |");
  lines.push(
    `| Feature completeness | ${s.contentCompleteness.feature.p25} | ${s.contentCompleteness.feature.p50} | ${s.contentCompleteness.feature.p75} |`,
  );
  lines.push(
    `| Pricing completeness | ${s.contentCompleteness.pricing.p25} | ${s.contentCompleteness.pricing.p50} | ${s.contentCompleteness.pricing.p75} |`,
  );
  lines.push(
    `| Unique content ratio | ${s.contentCompleteness.uniqueRatio.p25} | ${s.contentCompleteness.uniqueRatio.p50} | ${s.contentCompleteness.uniqueRatio.p75} |`,
  );
  lines.push("");
  lines.push("## Duplicate-risk clusters");
  lines.push("");
  if (report.duplicateClusters.length === 0) {
    lines.push("_None above threshold._");
  } else {
    for (const c of report.duplicateClusters) {
      lines.push(
        `- **${c.id}** (${c.risk}): ${esc(c.note)} — sample: ${c.slugs.slice(0, 8).join(", ")}`,
      );
    }
  }
  lines.push("");
  lines.push("## Orphan / near-orphan comparisons");
  lines.push("");
  lines.push(
    `Orphans: ${report.orphans.length}. Near-orphans: ${report.nearOrphans.length}.`,
  );
  if (report.orphans.length) {
    lines.push("");
    lines.push("Sample orphans:");
    for (const u of report.orphans.slice(0, 25)) {
      lines.push(`- ${u}`);
    }
  }
  lines.push("");
  lines.push("## Ready for promotion");
  lines.push("");
  if (report.readyForPromotion.length === 0) {
    lines.push("_None currently INDEXABLE_READY._");
  } else {
    lines.push("| Rank | URL | Lifecycle | Reasons |");
    lines.push("| ---: | --- | --- | --- |");
    report.readyForPromotion.slice(0, 50).forEach((e, i) => {
      lines.push(
        `| ${i + 1} | ${esc(e.url)} | ${e.lifecycle} | ${esc(e.reasons.slice(0, 2).join("; ") || "gates passed")} |`,
      );
    });
  }
  lines.push("");
  lines.push("## Top 100 to improve first");
  lines.push("");
  lines.push(
    "| Rank | URL | Lifecycle | Category | Unique | Improvement reasons | Remediation |",
  );
  lines.push("| ---: | --- | --- | --- | ---: | --- | --- |");
  report.topImprove.forEach((e, i) => {
    lines.push(
      `| ${i + 1} | ${esc(e.url)} | ${e.lifecycle} | ${esc(e.categorySlug || "—")} | ${e.metrics.uniqueContentRatio} | ${esc(e.improvementReasons.slice(0, 3).join(", ") || "—")} | ${esc(e.remediationRequirements.slice(0, 3).join(", ") || "—")} |`,
    );
  });
  lines.push("");
  lines.push("## Lifecycle samples");
  lines.push("");
  for (const lifeState of [
    "INDEXABLE",
    "IMPROVE",
    "INDEXABLE_READY",
    "MANUAL_REVIEW",
  ] as const) {
    const sample = report.evaluations
      .filter((e) => e.lifecycle === lifeState)
      .slice(0, 8);
    lines.push(`### ${lifeState} (sample)`);
    lines.push("");
    if (!sample.length) {
      lines.push("_None._");
      lines.push("");
      continue;
    }
    for (const e of sample) {
      lines.push(
        `- ${e.url} — ${esc(e.improvementReasons.join(", ") || e.reasons[0] || e.relationshipKind)} (unique=${e.metrics.uniqueContentRatio}, features=${e.metrics.featureDataCompleteness})`,
      );
    }
    lines.push("");
  }
  lines.push("## Machine-readable output");
  lines.push("");
  lines.push("- `data/seo/compare-audit.json`");
  lines.push("- `data/seo/content-lifecycle.json` (promotion registry)");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

export function writeCompareAuditOutputs(
  report: CompareAuditReport,
  cwd: string = process.cwd(),
): { markdownPath: string; jsonPath: string } {
  const docsDir = path.join(cwd, "docs/seo");
  const dataDir = path.join(cwd, "data/seo");
  mkdirSync(docsDir, { recursive: true });
  mkdirSync(dataDir, { recursive: true });

  const markdownPath = path.join(docsDir, "COMPARE-AUDIT.md");
  const jsonPath = path.join(dataDir, "compare-audit.json");

  writeFileSync(markdownPath, formatCompareAuditMarkdown(report), "utf8");

  const json = {
    ...report,
    evaluations: report.evaluations.map(compactEvaluation),
  };
  writeFileSync(jsonPath, `${JSON.stringify(json, null, 2)}\n`, "utf8");

  return { markdownPath, jsonPath };
}

function compactEvaluation(e: CompareIndexEvaluation) {
  return {
    slug: e.slug,
    url: e.url,
    productA: e.productA,
    productB: e.productB,
    categorySlug: e.categorySlug,
    classification: e.classification,
    lifecycle: e.lifecycle,
    improvementReasons: e.improvementReasons,
    remediationRequirements: e.remediationRequirements,
    searchIndexable: e.searchIndexable,
    readyForPromotion: e.readyForPromotion,
    relationshipKind: e.relationshipKind,
    failedGateIds: e.failedGateIds,
    passedGateIds: e.passedGateIds,
    reasons: e.reasons,
    priorityScore: e.priorityScore,
    recommendedRedirect: e.recommendedRedirect,
    duplicateClusterId: e.duplicateClusterId,
    metrics: e.metrics,
    gates: e.gates,
  };
}
