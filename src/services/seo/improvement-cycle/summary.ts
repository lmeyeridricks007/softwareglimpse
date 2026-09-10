import type { ImprovementCycleReport } from "./types";

function listItems(
  title: string,
  rows: Array<{ path?: string; slug?: string; reason?: string; note?: string; detail?: string }>,
  empty: string,
): string[] {
  const lines = [`### ${title}`, ``];
  if (!rows.length) {
    lines.push(`_${empty}_`, ``);
    return lines;
  }
  for (const r of rows.slice(0, 25)) {
    const label = r.path ?? r.slug ?? "?";
    const why = r.reason ?? r.note ?? r.detail ?? "";
    lines.push(`- \`${label}\`${why ? ` — ${why}` : ""}`);
  }
  if (rows.length > 25) lines.push(`- … +${rows.length - 25} more`);
  lines.push(``);
  return lines;
}

/**
 * Single weekly operating summary. Points at existing report artifacts
 * instead of inventing a parallel report ecosystem.
 */
export function renderImprovementCycleMarkdown(
  report: ImprovementCycleReport,
): string {
  const s = report.summary;
  const lines: string[] = [
    `# Weekly existing-content improvement cycle`,
    ``,
    `**Week:** ${report.weekId}  `,
    `**Generated:** ${report.generatedAt}  `,
    `**Mode:** ${report.mode.toUpperCase()}  `,
    `**Version:** ${report.version}  `,
    `**Batch size:** ${report.batchSize}  `,
    ``,
    report.mode === "plan"
      ? `PLAN/DRY-RUN — no enrichment overlays or promotions persisted. Re-run with \`--apply\` after review.`
      : `APPLY — enrichment/linking/promotion may have mutated approved structures.`,
    ``,
    `## Operating summary`,
    ``,
    ...listItems(
      "This week's ranking wins",
      s.rankingWins.map((w) => ({ path: w.path, note: w.note })),
      "No prior snapshot or no wins detected",
    ),
    ...listItems(
      "Ranking losses",
      s.rankingLosses.map((w) => ({ path: w.path, note: w.note })),
      "No prior snapshot or no losses detected",
    ),
    ...listItems(
      "Pages to refresh",
      s.pagesToRefresh.map((p) => ({ path: p.path, reason: p.reason })),
      "None queued",
    ),
    ...listItems(
      "Pages to enrich",
      s.pagesToEnrich.map((p) => ({
        path: p.path,
        reason: `${p.lane ? `Lane ${p.lane} · ` : ""}${p.reason}`,
      })),
      "None queued",
    ),
    ...listItems(
      "Pages ready to promote",
      s.pagesReadyToPromote.map((p) => ({ path: p.path, reason: p.reason })),
      "None currently eligible",
    ),
    ...listItems(
      "Pages blocked",
      s.pagesBlocked.map((p) => ({
        path: p.path,
        reason: p.blockedReasons.join(", ") || p.reason,
      })),
      "None",
    ),
    ...listItems(
      "Data verification required",
      s.dataVerificationRequired.map((p) => ({
        path: p.path,
        reason: p.reason,
      })),
      "None from pricing monitor this run",
    ),
    ...listItems(
      "Human testing required",
      s.humanTestingRequired.map((p) => ({ path: p.path, reason: p.reason })),
      "See docs/editorial/PRODUCT-TESTING-QUEUE.md",
    ),
    ...listItems(
      "Internal-link opportunities",
      s.internalLinkOpportunities.map((p) => ({
        path: p.path,
        detail: p.detail,
      })),
      "None surfaced",
    ),
    `### Technical issues`,
    ``,
  ];

  if (!s.technicalIssues.length) {
    lines.push(`_None_`, ``);
  } else {
    for (const t of s.technicalIssues) lines.push(`- ${t}`);
    lines.push(``);
  }

  lines.push(
    `## Selected batch (${report.selectedBatch.length})`,
    ``,
    `| Kind | Slug | Action | Lane | Score |`,
    `| --- | --- | --- | --- | ---: |`,
  );
  for (const item of report.selectedBatch) {
    lines.push(
      `| ${item.kind} | \`${item.slug}\` | ${item.action} | ${item.lane ?? "—"} | ${item.score.toFixed?.(1) ?? item.score} |`,
    );
  }

  lines.push(
    ``,
    `## Steps`,
    ``,
    `| Step | Status | Detail |`,
    `| --- | --- | --- |`,
  );
  for (const st of report.steps) {
    lines.push(`| ${st.label} | ${st.status} | ${st.detail.replace(/\|/g, "/")} |`);
  }

  const artifactSet = new Set([
    ...report.existingArtifacts,
    "docs/editorial/PRODUCT-TESTING-QUEUE.md",
    "docs/editorial/DATA-VERIFIED-RECONCILIATION.md",
    "docs/seo/GSC-OPPORTUNITIES.md",
    "docs/seo/GROWTH-DASHBOARD.md",
    "docs/seo/SITEMAP-LIFECYCLE-RECONCILIATION.md",
  ]);
  lines.push(
    ``,
    `## Existing artifacts (reuse — do not duplicate)`,
    ``,
  );
  for (const a of artifactSet) {
    lines.push(`- \`${a}\``);
  }
  lines.push(
    ``,
    `## Notes`,
    ``,
  );
  for (const n of report.notes) lines.push(`- ${n}`);
  lines.push(
    ``,
    `## Commands`,
    ``,
    `\`\`\`bash`,
    `npm run seo:improvement-cycle`,
    `npm run seo:improvement-cycle -- --apply --batch 25`,
    `npm run seo:improvement-cycle -- --export path/to/gsc-export.json`,
    `\`\`\``,
    ``,
  );

  return `${lines.join("\n")}\n`;
}
