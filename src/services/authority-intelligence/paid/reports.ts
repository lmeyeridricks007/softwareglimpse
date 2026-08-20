import type { PaidPromotionReport } from "./types";
import { LINK_SCHEME_AVOID_LABEL } from "./types";

function esc(s: string): string {
  return s.replace(/\|/g, "/").replace(/\n/g, " ");
}

export function formatPaidPromotionReport(report: PaidPromotionReport): string {
  const tiers = [
    "€0",
    "€1–250",
    "€250–1,000",
    "€1,000–5,000",
    "€5,000+",
    "PRICE UNKNOWN",
  ] as const;

  const lines: string[] = [
    `# Paid Promotion Opportunities — Latest`,
    ``,
    `> Agent: **PaidPromotionOpportunityAgent** · Topic: **${report.topic}**`,
    `> Generated: ${report.generatedAt} · Framework v${report.version}`,
    `> Live web search required: **yes** · Hits investigated: **${report.hitsInvestigated}**`,
    `> **Report only — do not purchase from this agent.** Paid SEO links are not the objective.`,
    ``,
    `## Summary`,
    ``,
    `| Metric | Value |`,
    `| --- | --- |`,
    `| Recommended / test candidates | ${report.accepted.length} |`,
    `| Avoided (link-scheme / unfit) | ${report.avoided.length} |`,
    `| Experiments | ${report.experiments.length} |`,
    `| Queries run | ${report.queriesRun.length} |`,
    ``,
    `## Link policy`,
    ``,
    `- Expected link treatment for paid placements: **SPONSORED**, **NOFOLLOW**, or **UNKNOWN**.`,
    `- Never pay extra for **dofollow** or **SEO link juice**.`,
    `- Such offers are marked **${LINK_SCHEME_AVOID_LABEL}**.`,
    `- Sponsored content is never characterized as independent editorial coverage.`,
    ``,
    `## Master table`,
    ``,
    `| Priority | Site/channel | Audience | Opportunity | Cost | Link treatment | SEO link value | Referral | Brand | Lead | Why worthwhile | Source URL | Verified |`,
    `| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |`,
    ...report.accepted.map(
      (o) =>
        `| ${o.priority} | ${esc(o.siteChannel)} | ${esc(o.audience).slice(0, 80)} | ${esc(o.opportunity).slice(0, 100)} | ${esc(o.costDisplay)} | ${o.expectedLinkTreatment} | ${o.seoLinkValue} | ${o.referralPotential} | ${o.brandValue} | ${o.leadValue} | ${esc(o.whyWorthwhile).slice(0, 140)}… | ${o.sourceUrl} | ${o.verifiedAt.slice(0, 10)} |`,
    ),
    ``,
    `## Budget tiers`,
    ``,
  ];

  for (const tier of tiers) {
    const items = report.byBudgetTier[tier] ?? [];
    lines.push(`### ${tier} (${items.length})`, ``);
    if (items.length === 0) {
      lines.push(`_None in this band._`, ``);
      continue;
    }
    for (const o of items) {
      lines.push(
        `- **P${o.priority}** ${o.siteChannel} — ${o.costDisplay} → \`${o.targetSgPage ?? "—"}\``,
      );
    }
    lines.push(``);
  }

  lines.push(
    `## Best paid experiments`,
    ``,
    `These are **tests**, not “buy these links.” Run A0 (control) before or alongside paid spend.`,
    ``,
  );

  for (const e of report.experiments) {
    lines.push(
      `### ${e.id} — ${e.title}`,
      ``,
      `| Field | Value |`,
      `| --- | --- |`,
      `| Channel | ${esc(e.channel)} |`,
      `| Goal | ${esc(e.goal)} |`,
      `| Target SG page | \`${e.targetSgPage}\` |`,
      `| Budget tier | ${e.budgetTier} |`,
      `| Estimated cost | ${esc(e.estimatedCost)} |`,
      ``,
      `**Measure**`,
      ``,
      ...e.measure.map((m) => `- ${m}`),
      ``,
    );
  }

  lines.push(
    `## ${LINK_SCHEME_AVOID_LABEL} / rejected`,
    ``,
    `| Site/channel | Opportunity | Reason | Notes | Source |`,
    `| --- | --- | --- | --- | --- |`,
    ...report.avoided.map(
      (a) =>
        `| ${esc(a.siteChannel)} | ${esc(a.opportunity).slice(0, 80)} | ${a.reason} | ${esc(a.notes ?? "—").slice(0, 120)} | ${a.sourceUrl} |`,
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
    `## Re-run`,
    ``,
    "```bash",
    "npm run authority:paid",
    "npm run authority:paid -- --no-write --json",
    "```",
    ``,
  );

  return lines.join("\n");
}
