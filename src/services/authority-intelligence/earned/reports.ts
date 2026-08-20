import type {
  EarnedBacklinkOpportunity,
  EarnedBacklinkReport,
} from "./types";

function esc(s: string): string {
  return s.replace(/\|/g, "/").replace(/\n/g, " ");
}

function tableRow(o: EarnedBacklinkOpportunity): string {
  const target = o.targetPageUrl
    ? `[${esc(o.targetPageName ?? o.relevantSgPage ?? "SG page")}](${o.targetPageUrl})`
    : `\`${o.relevantSgPage ?? "—"}\``;
  const submit = o.submitOrContactUrl
    ? `[Open page](${o.submitOrContactUrl})`
    : `[Open](${o.opportunityUrl})`;
  return `| ${o.priority ?? "—"} | ${esc(o.site)} | \`${o.domain}\` | [${esc(o.opportunityTitle)}](${o.opportunityUrl}) | ${o.type} | ${target} | ${submit} | ${esc((o.howToSubmitOrRequest ?? o.contactPath ?? o.submissionPath ?? "—").slice(0, 120))}${(o.howToSubmitOrRequest?.length ?? 0) > 120 ? "…" : ""} | ${o.seoValue} | ${o.referralValue} | ${o.difficulty} | ${o.effort} | ${o.status} |`;
}

export function formatEarnedMasterReport(report: EarnedBacklinkReport): string {
  const lines: string[] = [
    `# Earned Backlink Opportunities — Latest`,
    ``,
    `> Agent: **EarnedBacklinkOpportunityAgent** · Topic: **${report.topic}**`,
    `> Generated: ${report.generatedAt} · Framework v${report.version}`,
    `> Live web search required: **yes** · Hits investigated: **${report.hitsInvestigated}**`,
    `> Evaluate only — no outreach, form submissions, or production edits.`,
    ``,
    `## How to use this report`,
    ``,
    `For each opportunity:`,
    ``,
    `1. Open **Submit / request page** (the opportunity URL — where the list or article lives).`,
    `2. Link / cite the **SG target page** (exact URL to request).`,
    `3. Use the **Suggested ask** in detail cards (edit before sending — humans only).`,
    ``,
    `## Summary`,
    ``,
    `| Metric | Value |`,
    `| --- | --- |`,
    `| Accepted (qualified) | ${report.accepted.length} |`,
    `| Top N listed | ${report.top50.length} |`,
    `| Rejected | ${report.rejected.length} |`,
    `| Queries run | ${report.queriesRun.length} |`,
    ``,
    `## TOP ${report.top50.length} REALISTIC EARNED LINK OPPORTUNITIES`,
    ``,
    `Ranked by realistic probability/value (likelihood + fit), not domain prestige alone.`,
    ``,
    `| Priority | Site | Domain | Opportunity | Type | Link this SG page | Submit / request page | How to submit/request | SEO | Referral | Difficulty | Effort | Status |`,
    `| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |`,
    ...report.top50.map(tableRow),
    ``,
    `## Opportunity detail (Top ${Math.min(15, report.top50.length)})`,
    ``,
  ];

  for (const o of report.top50.slice(0, 15)) {
    lines.push(
      `### ${o.priority}. ${o.site} — ${o.type}`,
      ``,
      `- **Opportunity URL (where the list/article is):** ${o.opportunityUrl}`,
      `- **Submit / request page:** ${o.submitOrContactUrl ?? o.opportunityUrl}`,
      `- **Link this SG page:** [${o.targetPageName ?? o.relevantSgPage ?? "SG page"}](${o.targetPageUrl ?? "#"}) (\`${o.relevantSgPage ?? "—"}\`)`,
      `- Domain: \`${o.domain}\``,
      `- Score: **${o.scoreBand}** (${o.scoreNormalized})`,
      `- SEO / Referral: ${o.seoValue} / ${o.referralValue}`,
      `- Difficulty / Effort / Likelihood: ${o.difficulty} / ${o.effort} / ${o.likelihood}`,
      `- Contact notes: ${o.contactPath ?? "—"}`,
      `- Submission notes: ${o.submissionPath ?? "—"}`,
      `- Competitor gap class: ${o.competitorGapClass ?? "—"}`,
      ``,
      `**How to submit / request**`,
      ``,
      o.howToSubmitOrRequest ??
        "Open the opportunity URL; find contribute/contact; ask for a citation to the SG target page.",
      ``,
      `**Suggested ask** (human edit before send — do not auto-send)`,
      ``,
      `> ${o.suggestedAsk ?? "—"}`,
      ``,
      `**Why they might link**`,
      ``,
      o.whyTheyMightLink,
      ``,
    );
  }

  lines.push(
    `## Rejected / investigated but not recommended`,
    ``,
    `See also [\`earned-backlink-rejects-latest.md\`](./earned-backlink-rejects-latest.md).`,
    ``,
    `| Site | Domain | Reason | Notes |`,
    `| --- | --- | --- | --- |`,
    ...report.rejected.map(
      (r) =>
        `| ${r.site} | \`${r.domain}\` | ${r.reason} | ${(r.notes ?? "").replace(/\|/g, "/").slice(0, 120)} |`,
    ),
    ``,
    `## Queries run (live)`,
    ``,
    ...report.queriesRun.map((q) => `- \`${q}\``),
    ``,
    `## Limitations`,
    ``,
    ...report.limitations.map((l) => `- ${l}`),
    ``,
    `## Per-domain reports`,
    ``,
    `Individual files under [\`earned/\`](./earned/).`,
    ``,
    `## Re-run`,
    ``,
    "```bash",
    "npm run authority:earned",
    "npm run authority:earned -- --no-write --json",
    "```",
    ``,
    `Related: [\`docs/authority/README.md\`](./README.md) · Authority Intelligence orchestrator.`,
    ``,
  );

  return lines.join("\n");
}

export function formatRejectReport(report: EarnedBacklinkReport): string {
  return [
    `# Earned backlink opportunities — rejected`,
    ``,
    `Investigated via live search but not recommended.`,
    ``,
    `| Site | Domain | URL | Type | Reason | Notes |`,
    `| --- | --- | --- | --- | --- | --- |`,
    ...report.rejected.map(
      (r) =>
        `| ${r.site} | \`${r.domain}\` | ${r.opportunityUrl} | ${r.type} | ${r.reason} | ${(r.notes ?? "—").replace(/\|/g, "/")} |`,
    ),
    ``,
  ].join("\n");
}

export function formatDomainReport(
  domain: string,
  opportunities: EarnedBacklinkOpportunity[],
  report: EarnedBacklinkReport,
): string {
  const lines: string[] = [
    `# Earned backlink opportunities — ${domain}`,
    ``,
    `> From EarnedBacklinkOpportunityAgent · ${report.generatedAt}`,
    `> Topic: ${report.topic}`,
    ``,
  ];

  for (const o of opportunities) {
    lines.push(
      `## P${o.priority} — ${o.opportunityTitle}`,
      ``,
      `| Field | Value |`,
      `| --- | --- |`,
      `| Priority | ${o.priority} |`,
      `| Site | ${o.site} |`,
      `| Domain | \`${o.domain}\` |`,
      `| Opportunity URL | ${o.opportunityUrl} |`,
      `| Submit / request page | ${o.submitOrContactUrl ?? o.opportunityUrl} |`,
      `| Link this SG page | [${o.targetPageName ?? "SG page"}](${o.targetPageUrl ?? "#"}) |`,
      `| SG path | \`${o.relevantSgPage ?? "—"}\` |`,
      `| Type | ${o.type} |`,
      `| SEO value | ${o.seoValue} |`,
      `| Referral value | ${o.referralValue} |`,
      `| Difficulty | ${o.difficulty} |`,
      `| Effort | ${o.effort} |`,
      `| Likelihood | ${o.likelihood} |`,
      `| Score | ${o.scoreBand} (${o.scoreNormalized}) |`,
      `| Contact notes | ${o.contactPath ?? "—"} |`,
      `| Submission notes | ${o.submissionPath ?? "—"} |`,
      `| Status | ${o.status} |`,
      `| Discovery query | \`${o.discoveryQuery}\` |`,
      `| Verified | ${o.verifiedAt} |`,
      ``,
      `### How to submit / request`,
      ``,
      o.howToSubmitOrRequest ?? "—",
      ``,
      `### Suggested ask`,
      ``,
      o.suggestedAsk ?? "—",
      ``,
      `### Why they might link`,
      ``,
      o.whyTheyMightLink,
      ``,
      `### Do not`,
      ``,
      `- Do not send automated outreach from this agent.`,
      `- Do not pitch homepage if a tool/resource deep link fits better.`,
      `- Do not claim paid/dofollow link value.`,
      ``,
    );
  }

  return lines.join("\n");
}
