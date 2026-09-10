import type { LinkOpportunityReport } from "./types";

function section(title: string, body: string): string {
  return `## ${title}\n\n${body}\n`;
}

/**
 * Format docs/seo/WEEKLY-LINK-OPPORTUNITIES.md
 */
export function formatWeeklyLinkOpportunitiesMarkdown(
  report: LinkOpportunityReport,
): string {
  const top20 = report.prospects.slice(0, 20);
  const topAssets = report.assets.slice(0, 12);
  const topGaps = report.gaps
    .filter((g) => g.domainsLinkingToCompetitor > 0 || !report.exportMeta)
    .slice(0, 15);

  const prospectLines =
    top20.length === 0
      ? "_No scored prospects — import a backlink export or wait for gap domains._\n"
      : top20
          .map(
            (p, i) =>
              `${i + 1}. **${p.domain}** (${p.prospectType}) — score ${p.opportunityScore} → \`${p.softwareGlimpseAssetPath}\` — ${p.pitch.suggestedAngle} — status **${p.relationshipStatus}**`,
          )
          .join("\n") + "\n";

  const assetLines = topAssets
    .map(
      (a) =>
        `- **${a.name}** (\`${a.path}\`) — asset score ${a.assetScore} · citation ${a.dimensions.citationValue} · journalist ${a.dimensions.journalistUsefulness} · freshness ${a.dimensions.freshness}`,
    )
    .join("\n");

  const gapLines =
    topGaps.length === 0
      ? "_No gaps computed._\n"
      : topGaps
          .map(
            (g) =>
              `- \`${g.softwareGlimpsePath}\` vs ${g.competitorUrl} — competitor RDs ${g.domainsLinkingToCompetitor}, not linking to SG ${g.domainsNotLinkingToSoftwareGlimpse}, opportunity ${g.opportunityScore}${
                g.authorityMetricAverage != null
                  ? `, auth avg ${g.authorityMetricAverage}`
                  : " (no auth metric in export)"
              }`,
          )
          .join("\n") + "\n";

  const researchLines = report.prospects
    .filter(
      (p) =>
        p.softwareGlimpseAssetPath.includes("/research/") ||
        p.prospectType === "DATA_CITATION" ||
        p.prospectType === "JOURNALIST",
    )
    .slice(0, 10)
    .map(
      (p) =>
        `- ${p.domain} → ${p.softwareGlimpseAssetName}: ${p.pitch.suggestedAngle}`,
    );

  const statusLines = [
    `IDENTIFIED/QUALIFIED: ${report.tracking.filter((t) => t.status === "IDENTIFIED" || t.status === "QUALIFIED").length}`,
    `CONTACTED: ${report.summary.contactedCount}`,
    `REPLIED: ${report.tracking.filter((t) => t.status === "REPLIED").length}`,
    `LINK_EARNED: ${report.summary.linksEarnedCount}`,
    `DECLINED / NO_RESPONSE / NOT_RELEVANT: ${report.tracking.filter((t) => ["DECLINED", "NO_RESPONSE", "NOT_RELEVANT"].includes(t.status)).length}`,
  ]
    .map((l) => `- ${l}`)
    .join("\n");

  const earnedLines =
    report.linksEarned.length === 0
      ? "_No earned links recorded in tracking store._\n"
      : report.linksEarned
          .map(
            (l) =>
              `- ${l.domain} → ${l.earnedLinkUrl ?? "(url pending)"} targeting \`${l.targetUrl}\` (asset \`${l.assetPath}\`) on ${l.updatedAt.slice(0, 10)}`,
          )
          .join("\n") + "\n";

  return `# Weekly link opportunities

Generated: ${report.generatedAt}  
Engine: ${report.engineVersion}

Legitimate editorial link earning only. **Never** buy links, mass-submit directories, spam comments/forums, run PBNs, or send bulk unsolicited email. Outreach drafts require **human approval** and are never auto-sent.

Export: ${
    report.exportMeta
      ? `${report.exportMeta.provider} · ${report.exportMeta.filename} · validity **${report.exportMeta.validity}** · ${report.exportMeta.rowCount} rows · date ${report.exportMeta.exportDate ?? "unknown"} · metrics: ${report.exportMeta.metricsAvailable.join(", ") || "none"}`
      : `**none loaded** (validity **${report.summary.exportValidity}**) — competitor gaps cannot invent referring domains`
  }

Fixture/sample prospect count in this report: **${report.summary.fixtureProspectCount}** (must be 0 in production). Draft-eligible (QUALIFIED): **${report.summary.draftEligibleCount}**.

${
  report.exportMetrics
    ? `### Export metrics (REAL rows only)

| Metric | Value |
| --- | --- |
| Referring domains (unique) | ${report.exportMetrics.referringDomains} |
| Backlinks (rows) | ${report.exportMetrics.backlinks} |
| Linked SG pages | ${report.exportMetrics.linkedPages} |
| Topical relevance avg | ${report.exportMetrics.topicalRelevanceAverage ?? "—"} |
| New RDs | ${report.exportMetrics.newReferringDomains ?? "n/a"} |
| Lost RDs | ${report.exportMetrics.lostReferringDomains ?? "n/a"} |
| Links → research | ${report.exportMetrics.linksToResearchAssets} |
| Links → commercial | ${report.exportMetrics.linksToCommercialPages} |

${
  report.exportMetrics.topReferringDomains?.length
    ? `Top referring domains:\n${report.exportMetrics.topReferringDomains
        .slice(0, 10)
        .map((d) => `- ${d.domain} (${d.links} links)`)
        .join("\n")}\n`
    : ""
}
${report.exportMetrics.notes.map((n) => `- ${n}`).join("\n")}
`
    : "_Export metrics unavailable — drop a REAL Ahrefs/Semrush CSV/JSON under `data/seo/imports/`._\n"
}

---

${section("Top 20 prospects", prospectLines)}
${section(
  "Prioritized asset outreach (DRAFT ONLY)",
  formatAssetOutreach(report) + "\n",
)}
${section("Best linkable assets", assetLines + "\n")}
${section("Competitor link gaps", gapLines)}
${section(
  "Research outreach opportunities",
  (researchLines.length ? researchLines.join("\n") : "_None in this run._") +
    "\n",
)}
${section("Existing outreach status", statusLines + "\n")}
${section("Links earned", earnedLines)}

---

## Methodology notes

${report.methodologyNotes.map((n) => `- ${n}`).join("\n")}

## Compliance

${report.complianceNotes.map((n) => `- ${n}`).join("\n")}

See [DIGITAL-PR-SYSTEM.md](./DIGITAL-PR-SYSTEM.md).
`;
}

function formatAssetOutreach(report: LinkOpportunityReport): string {
  const rows = report.assetOutreachPriorities ?? [];
  if (rows.length === 0) {
    return "_No asset outreach priorities — inventory empty._";
  }
  const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const r of rows) counts[r.priority] += 1;
  const lines = [
    `Priority mix: HIGH ${counts.HIGH} · MEDIUM ${counts.MEDIUM} · LOW ${counts.LOW}. **Not earned links.** No auto-send.`,
    "",
    ...rows.slice(0, 25).map(
      (r, i) =>
        `${i + 1}. **${r.priority}** · \`${r.assetPath}\` (${r.theme}) — topical ${r.topicalRelevance} · likelihood ${r.likelihood} — ${r.draftPitchAngle}`,
    ),
  ];
  return lines.join("\n");
}
