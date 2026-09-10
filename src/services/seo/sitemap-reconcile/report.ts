import type { SitemapEstateReconcileReport } from "./types";

function fmtCounts(c: SitemapEstateReconcileReport["pageTypes"][0]["counts"]): string {
  return [
    `| total | ${c.totalExisting} |`,
    `| INDEXABLE | ${c.INDEXABLE} |`,
    `| IMPROVE | ${c.IMPROVE} |`,
    `| IMPROVING | ${c.IMPROVING} |`,
    `| INDEXABLE_READY | ${c.INDEXABLE_READY} |`,
    `| READY_FOR_REVIEW | ${c.READY_FOR_REVIEW} |`,
    `| MANUAL_REVIEW | ${c.MANUAL_REVIEW} |`,
    `| RETIRED | ${c.RETIRED} |`,
    `| UNTRACKED | ${c.UNTRACKED} |`,
    `| in sitemap | ${c.inSitemap} |`,
    `| not in sitemap | ${c.notInSitemap} |`,
  ].join("\n");
}

export function renderSitemapReconcileMarkdown(
  report: SitemapEstateReconcileReport,
): string {
  const lines: string[] = [
    `# Sitemap ↔ lifecycle reconciliation`,
    ``,
    `**Generated:** ${report.generatedAt}  `,
    `**Version:** ${report.version}  `,
    `**Canonical origin:** ${report.canonicalOrigin}  `,
    ``,
    `Does **not** change content lifecycle states merely to make counts match.`,
    `Promotions hydrate from \`data/seo/content-lifecycle.json\` into sitemap builds.`,
    ``,
    `## Estate totals (reviews excluded from sum — same as software)`,
    ``,
    `| Metric | Count |`,
    `| --- | ---: |`,
    `| Total entities | ${report.totals.totalExisting} |`,
    `| INDEXABLE | ${report.totals.INDEXABLE} |`,
    `| IMPROVE | ${report.totals.IMPROVE} |`,
    `| IMPROVING | ${report.totals.IMPROVING} |`,
    `| INDEXABLE_READY | ${report.totals.INDEXABLE_READY} |`,
    `| READY_FOR_REVIEW | ${report.totals.READY_FOR_REVIEW} |`,
    `| MANUAL_REVIEW | ${report.totals.MANUAL_REVIEW} |`,
    `| RETIRED | ${report.totals.RETIRED} |`,
    `| UNTRACKED | ${report.totals.UNTRACKED} |`,
    `| In sitemap (sum of partitions) | ${report.totals.inSitemap} |`,
    `| Not in sitemap | ${report.totals.notInSitemap} |`,
    `| Discrepancies | ${report.totals.discrepancyCount} |`,
    `| Auto-fixable | ${report.totals.fixableCount} |`,
    ``,
    `## By page type`,
    ``,
  ];

  for (const p of report.pageTypes) {
    lines.push(
      `### ${p.pageType}`,
      ``,
      `Sitemap partition: \`${p.sitemapContentType}\` · expected indexable in sitemap: **${p.expectedInSitemap}**`,
      ``,
      `| Metric | Count |`,
      `| --- | ---: |`,
      fmtCounts(p.counts),
      ``,
    );
    if (p.notes.length) {
      for (const n of p.notes) lines.push(`- ${n}`);
      lines.push(``);
    }
    if (p.discrepancies.length) {
      lines.push(`Discrepancies (${p.discrepancies.length}):`, ``);
      for (const d of p.discrepancies.slice(0, 40)) {
        lines.push(`- \`${d.kind}\` · ${d.path} — ${d.detail}`);
      }
      if (p.discrepancies.length > 40) {
        lines.push(`- … +${p.discrepancies.length - 40} more`);
      }
      lines.push(``);
    }
  }

  lines.push(`## Live validation`, ``);
  const live = report.liveValidation;
  lines.push(
    `Attempted: ${live.attempted} · OK: ${live.ok} · Base: ${live.baseUrl ?? "—"}`,
    ``,
  );
  for (const n of live.notes) lines.push(`- ${n}`);
  if (live.childChecks.length) {
    lines.push(``, `| Path | Status | URLs | Error |`, `| --- | ---: | ---: | --- |`);
    for (const c of live.childChecks) {
      lines.push(
        `| ${c.path} | ${c.status ?? "—"} | ${c.urlCount ?? "—"} | ${c.error ?? ""} |`,
      );
    }
  }

  lines.push(``, `## Schema / policy notes`, ``);
  for (const n of report.schemaNotes) lines.push(`- ${n}`);
  lines.push(``);

  return `${lines.join("\n")}\n`;
}
