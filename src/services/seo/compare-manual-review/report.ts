import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { ManualReviewReport } from "./types";

export function formatManualReviewMarkdown(report: ManualReviewReport): string {
  const s = report.summary;
  const lines: string[] = [
    "# Comparison MANUAL_REVIEW triage",
    "",
    `**Generated:** ${report.generatedAt}`,
    `**Engine:** compare-manual-review v${report.version}`,
    "",
    "Evidence-backed classification of MANUAL_REVIEW pairs. Routes are **not deleted**. Goal: remove ambiguity — not force every comparison indexable.",
    "",
    "## Summary",
    "",
    "| Metric | Count |",
    "| --- | ---: |",
    `| Reviewed | ${s.totalReviewed} |`,
    `| Enqueue enrichment (valid classes) | ${s.enqueueEnrichment} |`,
    `| Applied → IMPROVE | ${s.appliedToImprove} |`,
    `| Retained MANUAL_REVIEW | ${s.retainedManualReview} |`,
    `| Weak (editorial justification) | ${s.leaveImprove} |`,
    `| Missing catalogue data | ${s.blockCatalogue} |`,
    `| Preserve noindex review | ${s.preserveReview} |`,
    `| Retire candidates (sign-off required) | ${s.retireCandidates} |`,
    "",
    "### By class",
    "",
    "| Class | Count |",
    "| --- | ---: |",
  ];

  for (const [k, v] of Object.entries(s.byClass)) {
    lines.push(`| ${k} | ${v} |`);
  }

  lines.push(
    "",
    "### By decision",
    "",
    "| Decision | Count |",
    "| --- | ---: |",
  );
  for (const [k, v] of Object.entries(s.byDecision)) {
    lines.push(`| ${k} | ${v} |`);
  }

  lines.push(
    "",
    "## Enrichment queue (→ IMPROVE)",
    "",
  );
  if (report.enrichmentQueueSlugs.length === 0) {
    lines.push("_None this run._", "");
  } else {
    lines.push(
      "| Slug | Class | Thesis | Evidence score |",
      "| --- | --- | --- | ---: |",
    );
    for (const slug of report.enrichmentQueueSlugs.slice(0, 100)) {
      const r = report.results.find((x) => x.slug === slug);
      if (!r) continue;
      lines.push(
        `| /compare/${slug}/ | ${r.classification} | ${r.thesis?.label ?? "—"} | ${r.evidence.evidenceScore} |`,
      );
    }
    lines.push("");
  }

  lines.push("## Weak relationships (editorial justification before promote)", "");
  if (report.weakRelationshipSlugs.length === 0) {
    lines.push("_None._", "");
  } else {
    for (const slug of report.weakRelationshipSlugs.slice(0, 60)) {
      const r = report.results.find((x) => x.slug === slug);
      lines.push(
        `- /compare/${slug}/ — ${r?.reasons[0] ?? "weak"}${r?.thesis ? ` · ${r.thesis.label}` : ""}`,
      );
    }
    lines.push("");
  }

  lines.push("## Missing data (catalogue remediation)", "");
  if (report.missingDataSlugs.length === 0) {
    lines.push("_None._", "");
  } else {
    for (const slug of report.missingDataSlugs) {
      lines.push(`- /compare/${slug}/`);
    }
    lines.push("");
  }

  lines.push("## Nonsensical (preserve route; do not index/promote)", "");
  if (report.nonsensicalSlugs.length === 0) {
    lines.push("_None._", "");
  } else {
    for (const slug of report.nonsensicalSlugs.slice(0, 60)) {
      const r = report.results.find((x) => x.slug === slug);
      lines.push(
        `- /compare/${slug}/ — ${r?.retireEligible ? "retire candidate" : "preserve (demand/history)"}${r?.thesis ? ` · ${r.thesis.label}` : ""}`,
      );
    }
    lines.push("");
  }

  lines.push("## Retire candidates", "");
  if (report.retireCandidates.length === 0) {
    lines.push(
      "_None — no nonsensical pairs without demand/backlinks._",
      "",
    );
  } else {
    lines.push(
      "Confirm no historical demand before RETIRED/NOINDEX. Do not delete routes.",
      "",
    );
    for (const slug of report.retireCandidates.slice(0, 40)) {
      lines.push(`- /compare/${slug}/`);
    }
    lines.push("");
  }

  lines.push(
    "## Sample triage (top 40 by evidence score)",
    "",
    "| URL | Class | Decision | Score | Key evidence |",
    "| --- | --- | --- | ---: | --- |",
  );

  for (const r of report.results.slice(0, 40)) {
    const key = r.evidence.items
      .filter((i) => i.present && i.flag !== "disjoint_use_cases")
      .map((i) => i.flag)
      .slice(0, 4)
      .join(", ");
    lines.push(
      `| ${r.url} | ${r.classification} | ${r.decision} | ${r.evidence.evidenceScore} | ${key || "—"} |`,
    );
  }

  lines.push(
    "",
    "## Policy",
    "",
    "- Never fabricate competitor/alternative declarations.",
    "- Different categories alone do **not** make a pair nonsensical.",
    "- Mega-category + best-list alone do **not** make a pair ALTERNATIVE.",
    "- DIRECT_COMPETITOR / ALTERNATIVE / CROSS_CATEGORY_DECISION / SPECIALIST_VS_GENERALIST → IMPROVE + enrichment (requires specific thesis).",
    "- WEAK_RELATIONSHIP → retain MANUAL_REVIEW; editorial justification before promote.",
    "- MISSING_DATA → catalogue remediation requirement.",
    "- NONSENSICAL → preserve route; no index/promote unless historical evidence; retire candidate only with sign-off.",
    "",
  );

  return `${lines.join("\n")}\n`;
}

export function writeManualReviewOutputs(
  report: ManualReviewReport,
  cwd = process.cwd(),
): { markdownPath: string; jsonPath: string } {
  const docsDir = path.join(cwd, "docs/seo");
  const dataDir = path.join(cwd, "data/seo");
  mkdirSync(docsDir, { recursive: true });
  mkdirSync(dataDir, { recursive: true });

  const markdownPath = path.join(docsDir, "COMPARE-MANUAL-REVIEW.md");
  const jsonPath = path.join(dataDir, "compare-manual-review.json");

  writeFileSync(markdownPath, formatManualReviewMarkdown(report), "utf8");
  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  return { markdownPath, jsonPath };
}
