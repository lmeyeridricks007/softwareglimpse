import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import type { GuideAuditReport } from "./types";

function esc(v: string): string {
  return v.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

export function formatGuidesAuditMarkdown(report: GuideAuditReport): string {
  const s = report.summary;
  const life = s.byLifecycle;
  const lines: string[] = [];
  lines.push("# Guides index-worthiness audit");
  lines.push("");
  lines.push(`**Generated:** ${report.generatedAt}`);
  lines.push(`**Engine:** guides-index-worthiness v${report.version}`);
  lines.push("");
  lines.push(
    "Lifecycle-first policy: weak guides are **preserved** under IMPROVE (temporary `noindex,follow`), then enriched, validated, and promoted to INDEXABLE. Robots noindex is a directive — not a permanent business classification. Factory packs and product explainers stay routable for onsite UX.",
  );
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Count |");
  lines.push("| --- | ---: |");
  lines.push(`| Total guide pages | ${s.total} |`);
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
  lines.push(
    `| FACTORY_ORIGIN_TOTAL (inventory — not a quality KPI) | ${s.factoryKpis.originTotal} |`,
  );
  lines.push(`| FACTORY_HIGH_RISK | ${s.factoryKpis.highRisk} |`);
  lines.push(`| FACTORY_LIMITED_UNIQUE | ${s.factoryKpis.limitedUnique} |`);
  lines.push(`| FACTORY_QUALITY_PASS | ${s.factoryKpis.qualityPass} |`);
  lines.push(`| FACTORY_INDEXABLE | ${s.factoryKpis.indexable} |`);
  lines.push(`| FACTORY_IMPROVE | ${s.factoryKpis.improve} |`);
  lines.push(
    `| FACTORY_PROMOTED (promoted after remediation) | ${s.factoryKpis.promoted} |`,
  );
  lines.push(
    `| Estate high near-duplicate risk (all guides) | ${s.highNearDuplicateRiskCount} |`,
  );
  lines.push(
    `| Estate limited unique-analysis (all guides) | ${s.limitedUniqueAnalysisCount} |`,
  );
  lines.push(`| Orphans (0 inbound estimate) | ${s.orphanCount} |`);
  lines.push(`| Near-orphans (1 inbound) | ${s.nearOrphanCount} |`);
  lines.push(`| Duplicate-risk clusters | ${s.duplicateClusterCount} |`);
  lines.push(`| Intent clusters | ${s.intentClusterCount} |`);
  lines.push("");
  lines.push("### Legacy class counts (compat)");
  lines.push("");
  lines.push("| Class | Count |");
  lines.push("| --- | ---: |");
  lines.push(`| KEEP_INDEX | ${s.byClass.KEEP_INDEX} |`);
  lines.push(`| IMPROVE | ${s.byClass.IMPROVE} |`);
  lines.push(`| NOINDEX | ${s.byClass.NOINDEX} |`);
  lines.push(`| MERGE | ${s.byClass.MERGE} |`);
  lines.push(`| REMOVE | ${s.byClass.REMOVE} |`);
  lines.push(`| REVIEW_MANUALLY | ${s.byClass.REVIEW_MANUALLY} |`);
  lines.push("");
  lines.push("## Policy");
  lines.push("");
  lines.push(
    "- **FACTORY_ORIGIN_TOTAL** is inventory/history (slug-class packs). It does **not** fall when those pages become excellent. Remediation KPIs are HIGH_RISK ↓, LIMITED_UNIQUE ↓, QUALITY_PASS ↑, INDEXABLE ↑, IMPROVE ↓.",
    "- **Factory product packs** → **IMPROVE** (TEMPLATE_HEAVY) — preserved; temporary noindex until enriched + promoted.",
  );
  lines.push(
    "- **Product explainers** → **IMPROVE** (THIN_EXPLAINER / TEMPLATE_HEAVY) — preserved for product-hub UX.",
  );
  lines.push(
    "- Category educational guides with substance + uniqueness → **INDEXABLE**.",
  );
  lines.push(
    "- Soft gaps → **IMPROVE** → enrichment → **INDEXABLE_READY** → `promoteToIndexable` → sitemap.",
  );
  lines.push(
    "- Ambiguous intent clusters → **MANUAL_REVIEW** (no destructive redirects).",
  );
  lines.push(
    "- **RETIRED** only for genuinely obsolete / invalid / duplicate pages — not for weak-but-useful URLs.",
  );
  lines.push("");
  lines.push("## Guide types");
  lines.push("");
  lines.push("| Type | Total | Indexable |");
  lines.push("| --- | ---: | ---: |");
  for (const row of s.byGuideType) {
    lines.push(`| ${esc(row.type)} | ${row.total} | ${row.keepIndex} |`);
  }
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
  lines.push("## Content distributions");
  lines.push("");
  lines.push("| Metric | p25 | p50 | p75 |");
  lines.push("| --- | ---: | ---: | ---: |");
  lines.push(
    `| Unique content ratio | ${s.uniqueRatio.p25} | ${s.uniqueRatio.p50} | ${s.uniqueRatio.p75} |`,
  );
  lines.push(
    `| Word count | ${s.wordCount.p25} | ${s.wordCount.p50} | ${s.wordCount.p75} |`,
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
  lines.push("## Intent clusters (cannibalization)");
  lines.push("");
  if (report.intentClusters.length === 0) {
    lines.push("_None detected._");
  } else {
    for (const c of report.intentClusters.slice(0, 40)) {
      lines.push(
        `- **${c.id}** primary \`${c.primarySlug}\`: ${esc(c.note)} — members: ${c.members.map((m) => `${m.slug}(${m.role})`).join(", ")}`,
      );
    }
    if (report.intentClusters.length > 40) {
      lines.push(`- _…and ${report.intentClusters.length - 40} more_`);
    }
  }
  lines.push("");
  lines.push("## Proposed merges");
  lines.push("");
  if (report.proposedMerges.length === 0) {
    lines.push("_None with automatic confidence._");
  } else {
    for (const m of report.proposedMerges.slice(0, 50)) {
      lines.push(
        `- \`${m.from}\` → \`${m.into}\` (${m.confidence}): ${esc(m.reason)}`,
      );
    }
  }
  lines.push("");
  lines.push("## Proposed redirects");
  lines.push("");
  if (report.proposedRedirects.length === 0) {
    lines.push(
      "_None applied automatically — medium-confidence merges stay MANUAL_REVIEW flags only. Existing URLs are preserved._",
    );
  } else {
    for (const r of report.proposedRedirects) {
      lines.push(`- \`${r.from}\` → \`${r.to}\`: ${esc(r.reason)}`);
    }
  }
  lines.push("");
  lines.push("## Orphan / near-orphan guides");
  lines.push("");
  lines.push(
    `Orphans: ${report.orphans.length}. Near-orphans: ${report.nearOrphans.length}.`,
  );
  lines.push("");
  lines.push("## Ready for promotion");
  lines.push("");
  if (report.readyForPromotion.length === 0) {
    lines.push("_None currently INDEXABLE_READY._");
  } else {
    lines.push("| Rank | URL | Lifecycle | Reasons |");
    lines.push("| ---: | --- | --- | --- |");
    report.readyForPromotion.slice(0, 50).forEach((e, idx) => {
      lines.push(
        `| ${idx + 1} | ${e.url} | ${e.lifecycle} | ${esc(e.reasons.slice(0, 2).join("; ") || "gates passed")} |`,
      );
    });
  }
  lines.push("");
  lines.push("## Top 100 improvement priorities");
  lines.push("");
  lines.push(
    "| Rank | URL | Lifecycle | Type | Unique | Improvement reasons | Remediation |",
  );
  lines.push("| ---: | --- | --- | --- | ---: | --- | --- |");
  report.topImprove.forEach((e, idx) => {
    lines.push(
      `| ${idx + 1} | ${e.url} | ${e.lifecycle} | ${e.guideType} | ${e.metrics.uniqueContentRatio} | ${esc(e.improvementReasons.slice(0, 3).join(", ") || "—")} | ${esc(e.remediationRequirements.slice(0, 3).join(", ") || "—")} |`,
    );
  });
  lines.push("");
  lines.push("## Weak guides (completeness / uniqueness)");
  lines.push("");
  for (const e of report.weakGuides.slice(0, 25)) {
    lines.push(
      `- ${e.url} — completeness ${e.metrics.contentCompleteness}, unique ${e.metrics.uniqueContentRatio}, lifecycle ${e.lifecycle}`,
    );
  }
  lines.push("");
  lines.push("## Sitemap impact");
  lines.push("");
  lines.push(
    "Only **INDEXABLE** guides enter the sitemap. IMPROVE / MANUAL_REVIEW pages remain HTTP 200 with temporary noindex until promoted via `canPromoteToIndexable` / `promoteToIndexable` (no per-page code edit).",
  );
  lines.push("");
  lines.push(
    `| Seed indexable flag (current) | Indexable (sitemap) | Improvement queue |`,
  );
  lines.push("| ---: | ---: | ---: |");
  lines.push(
    `| ${s.previouslySeedIndexableCount} | ${s.searchIndexableCount} | ${s.improvementQueueCount} |`,
  );
  lines.push("");
  lines.push("## Safe consolidations applied");
  lines.push("");
  lines.push(
    "- Runtime `isGuideSearchIndexWorthy` + lifecycle promotion wired into `isEntityIndexable`.",
  );
  lines.push(
    "- Factory product-pack builders default `seo.indexable: false` (IMPROVE queue).",
  );
  lines.push(
    "- Guides hub discovery grid + CollectionPage JSON-LD limited to INDEXABLE guides.",
  );
  lines.push(
    "- Ambiguous merges flagged MANUAL_REVIEW — no mass 301s; URLs preserved.",
  );
  lines.push("");
  lines.push("## Remaining work");
  lines.push("");
  lines.push(
    "1. Editorial pass on MANUAL_REVIEW intent clusters before merging.",
  );
  lines.push(
    "2. Enrich IMPROVE queue pages (unique analysis, pricing, links) then promote.",
  );
  lines.push(
    "3. Optionally promote a curated set of enriched product `worth-it` pages after unique editorial work.",
  );
  lines.push("");
  lines.push("## Machine-readable output");
  lines.push("");
  lines.push("- `data/seo/guides-audit.json`");
  lines.push("- `data/seo/content-lifecycle.json` (promotion registry)");
  lines.push("");
  return lines.join("\n");
}

export function writeGuidesAuditOutputs(report: GuideAuditReport): {
  markdownPath: string;
  jsonPath: string;
} {
  const root = process.cwd();
  const markdownPath = path.join(root, "docs/seo/GUIDES-AUDIT.md");
  const jsonPath = path.join(root, "data/seo/guides-audit.json");
  mkdirSync(path.dirname(markdownPath), { recursive: true });
  mkdirSync(path.dirname(jsonPath), { recursive: true });
  writeFileSync(markdownPath, formatGuidesAuditMarkdown(report), "utf8");
  writeFileSync(jsonPath, JSON.stringify(report, null, 2), "utf8");
  return { markdownPath, jsonPath };
}
