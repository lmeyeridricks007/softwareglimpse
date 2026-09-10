import { RESOLVED_GAP_DECISIONS } from "./absorbs";
import type { Locale410ReviewResult, Locale410TopicRow } from "./types";

function fmtGsc(row: Locale410TopicRow): string {
  if (!row.enGsc.available && !row.localeGsc.available) return "n/a";
  return `EN ${row.enGsc.clicks}c/${row.enGsc.impressions}i · locale ${row.localeGsc.clicks}c/${row.localeGsc.impressions}i`;
}

function fmtBacklinks(row: Locale410TopicRow): string {
  if (!row.enBacklinks.available) return row.enBacklinks.validity;
  return String(row.enBacklinks.referringDomains ?? 0);
}

export function renderLocale410ReviewMarkdown(
  result: Locale410ReviewResult,
): string {
  const s = result.summary;
  const lines: string[] = [
    `# Locale 410 topic review`,
    ``,
    `**Agent:** ${s.agent} v${s.version}  `,
    `**Generated:** ${s.generatedAt}  `,
    `**Gap recovery resolved:** 2026-09-06`,
    ``,
    `English-only equity preservation. Does **not** restore multilingual pages,`,
    `dump to the homepage, or auto-create English URLs.`,
    ``,
    `## Summary`,
    ``,
    `| Metric | Count |`,
    `| --- | ---: |`,
    `| Unmapped locale URLs (410 today) | ${s.unmappedLocaleUrls} |`,
    `| Unique EN topic siblings | ${s.uniqueEnTopics} |`,
    `| TRUE_OBSOLETE | ${s.byClassification.TRUE_OBSOLETE} |`,
    `| TAXONOMY_JUNK | ${s.byClassification.TAXONOMY_JUNK} |`,
    `| DUPLICATE_TOPIC (301 repair) | ${s.byClassification.DUPLICATE_TOPIC} |`,
    `| ENGLISH_EQUIVALENT_MISSING | ${s.byClassification.ENGLISH_EQUIVALENT_MISSING} |`,
    `| VALUABLE_TOPIC_CANDIDATE | ${s.byClassification.VALUABLE_TOPIC_CANDIDATE} |`,
    `| Gap review queue | ${s.gapReviewCount} |`,
    `| GSC available | ${s.gscAvailable ? "yes" : "no"} |`,
    `| Backlinks available | ${s.backlinksAvailable ? "yes" : "no"} |`,
    ``,
    `## 301 repairs (genuine English absorbs)`,
    ``,
  ];

  if (result.repairs.length === 0) {
    lines.push(`_None proposed in this run (already applied or no unmapped siblings)._`, ``);
  } else {
    lines.push(
      `| EN topic | Destination | Locales | GSC | Reason |`,
      `| --- | --- | ---: | --- | --- |`,
    );
    for (const row of result.repairs) {
      lines.push(
        `| \`${row.enPath}\` | \`${row.proposedDestination}\` | ${row.localeCount} | ${fmtGsc(row)} | ${row.absorbReason ?? ""} |`,
      );
    }
    lines.push(``);
  }

  lines.push(
    `## EXISTING_ESTATE_GAP_REVIEW`,
    ``,
    `Open queue: **${s.gapReviewCount}**. Resolved archive below.`,
    `Do **not** auto-create pages — manual editorial consideration only.`,
    ``,
  );

  if (result.gapReview.length === 0) {
    lines.push(`_Open queue empty._`, ``);
  } else {
    lines.push(
      `| EN topic | Title | Intent | Locales | GSC | Backlinks | Why queued |`,
      `| --- | --- | --- | ---: | --- | --- | --- |`,
    );
    for (const row of result.gapReview) {
      lines.push(
        `| \`${row.enPath}\` | ${row.title ?? "—"} | ${row.intentKind} | ${row.localeCount} | ${fmtGsc(row)} | ${fmtBacklinks(row)} | ${row.mappingReason ?? row.classification} |`,
      );
    }
    lines.push(``);
  }

  lines.push(
    `### Resolved gap decisions`,
    ``,
    `| EN topic | Decision | Canonical | Entity | Quality | Redirects | Indexability | Reason |`,
    `| --- | --- | --- | --- | --- | --- | --- | --- |`,
  );
  for (const d of RESOLVED_GAP_DECISIONS) {
    lines.push(
      `| \`${d.enPath}\` | ${d.decision} | ${d.canonical ? `\`${d.canonical}\`` : "—"} | ${d.entity} | ${d.quality} | ${d.redirects} | ${d.indexability} | ${d.reason} |`,
    );
  }
  lines.push(``);

  lines.push(
    `## Kept 410`,
    ``,
    `TAXONOMY_JUNK, TRUE_OBSOLETE (including Content at Scale), and ENGLISH_EQUIVALENT_MISSING remain Proxy **410**.`,
    `No redirects to homepage or unrelated pages.`,
    ``,
  );

  return lines.join("\n");
}

export function renderExistingEstateGapReviewMarkdown(
  result: Locale410ReviewResult,
): string {
  const lines: string[] = [
    `# EXISTING_ESTATE_GAP_REVIEW`,
    ``,
    `**Source:** Locale 410 topic review (${result.summary.agent} v${result.summary.version})  `,
    `**Generated:** ${result.summary.generatedAt}  `,
    `**Resolved:** 2026-09-06 (gap recovery — preserve → improve → promote)`,
    ``,
    `Manual consideration queue for legacy **topics** that previously had locale`,
    `URLs returning **410**, with historical/user signal, but **no** English page`,
    `that could legitimately absorb them.`,
    ``,
    `## Rules`,
    ``,
    `- Remain English-only — do **not** restore multilingual pages`,
    `- Do **not** auto-create placeholder pages`,
    `- Do **not** 301 to homepage or unrelated hubs just to “save” the URL`,
    `- Prefer onboarding a real catalogue/guide entity first, then map locales`,
    `- Junk / off-strategy tooling is **not** listed here (stays 410)`,
    ``,
    `## Resolution summary (${RESOLVED_GAP_DECISIONS.length}/${RESOLVED_GAP_DECISIONS.length})`,
    ``,
    `| EN topic | Decision | Canonical | Redirects | Indexability |`,
    `| --- | --- | --- | --- | --- |`,
  ];

  for (const d of RESOLVED_GAP_DECISIONS) {
    lines.push(
      `| \`${d.enPath}\` | ${d.decision} | ${d.canonical ? `\`${d.canonical}\`` : "—"} | ${d.redirects} | ${d.indexability} |`,
    );
  }
  lines.push(``);

  lines.push(
    `## Open candidates (${result.gapReview.length})`,
    ``,
  );

  if (result.gapReview.length === 0) {
    lines.push(`_No open gap candidates — queue cleared._`, ``);
  } else {
    for (const row of result.gapReview) {
      lines.push(`### \`${row.enPath}\``, ``);
      lines.push(`| Field | Value |`);
      lines.push(`| --- | --- |`);
      lines.push(`| Title | ${row.title ?? "—"} |`);
      lines.push(`| Category / type | ${row.category ?? row.legacyPageType ?? "—"} |`);
      lines.push(`| Intent | ${row.intentKind} |`);
      lines.push(`| Lastmod | ${row.lastmod ?? "—"} |`);
      lines.push(
        `| EN GSC | ${row.enGsc.available ? `${row.enGsc.clicks} clicks / ${row.enGsc.impressions} impressions` : "unavailable"} |`,
      );
      lines.push(
        `| Locale GSC (sum) | ${row.localeGsc.available ? `${row.localeGsc.clicks} clicks / ${row.localeGsc.impressions} impressions` : "unavailable"} |`,
      );
      lines.push(
        `| Backlinks | ${row.enBacklinks.available ? String(row.enBacklinks.referringDomains ?? 0) : row.enBacklinks.validity} |`,
      );
      lines.push(`| Mapping note | ${row.mappingReason ?? "—"} |`);
      lines.push(`| Disposition | Keep locale URLs **410** until editorial decision |`);
      lines.push(``);
      lines.push(`Locale paths:`);
      for (const p of row.localePaths) {
        lines.push(`- \`${p}\``);
      }
      lines.push(``);
    }
  }

  lines.push(`## Resolved archive`, ``);
  for (const d of RESOLVED_GAP_DECISIONS) {
    lines.push(`### \`${d.enPath}\``, ``);
    lines.push(`| Field | Value |`);
    lines.push(`| --- | --- |`);
    lines.push(`| Decision | **${d.decision}** |`);
    lines.push(
      `| Canonical target | ${d.canonical ? `\`${d.canonical}\`` : "none"} |`,
    );
    lines.push(`| Product entity | ${d.entity} |`);
    lines.push(`| Quality result | ${d.quality} |`);
    lines.push(`| Redirect status | ${d.redirects} |`);
    lines.push(`| Indexability | ${d.indexability} |`);
    lines.push(`| Reason | ${d.reason} |`);
    lines.push(``);
  }

  return lines.join("\n");
}
