import { AUTHORITY_INTELLIGENCE_VERSION } from "@/domain/schemas/authority-intelligence";
import type { ContentPromotionReport } from "./types";

function esc(s: string): string {
  return s.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return `${s.slice(0, n - 1)}…`;
}

export function formatContentPromotionReport(
  report: ContentPromotionReport,
): string {
  const lines: string[] = [];

  lines.push("# Content Promotion Opportunities — Latest");
  lines.push("");
  lines.push(
    `> Agent: **ContentPromotionOpportunityAgent** · Topic: **${report.topic}**`,
  );
  lines.push(
    `> Generated: ${report.generatedAt} · Framework v${report.version}`,
  );
  lines.push(
    `> Posts to channels: **no** · Generates assets: **no** · Channels catalogued: **${report.channelsCatalogued}**`,
  );
  lines.push(
    `> Backlink acquisition is **not** the only goal — qualified reach, awareness, and tool usage matter.`,
  );
  lines.push("");

  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("| --- | --- |");
  lines.push(`| Promotion plans | ${report.plans.length} |`);
  lines.push(`| Tool launch plans | ${report.launchPlans.length} |`);
  lines.push(`| Rejected unsafe tactics | ${report.rejectedTactics.length} |`);
  lines.push("");

  lines.push("## Consumed inputs");
  lines.push("");
  const c = report.consumedInputs;
  lines.push("| Source | Path |");
  lines.push("| --- | --- |");
  lines.push(`| Content map | ${c.contentMap ?? "_missing_"} |`);
  lines.push(
    `| Ranking opportunities | ${c.rankingOpportunities ?? "_missing_"} |`,
  );
  lines.push(`| Content quality | ${c.contentQuality ?? "_missing_"} |`);
  lines.push(`| Earned backlinks | ${c.earnedBacklinks ?? "_missing_"} |`);
  lines.push(`| Paid promotion | ${c.paidPromotion ?? "_missing_"} |`);
  lines.push(`| Digital PR | ${c.digitalPr ?? "_missing_"} |`);
  lines.push(`| Partnerships | ${c.partnerships ?? "_missing_"} |`);
  lines.push("");
  for (const n of c.notes) lines.push(`- ${n}`);
  lines.push("");

  lines.push("## Community safety");
  lines.push("");
  lines.push(
    "Do **not**: drive-by self-promo · automated Reddit posts · mass forum posting · fake accounts · fake testimonials.",
  );
  lines.push(
    "Do: contribute where content genuinely answers the discussion; links secondary to helping.",
  );
  lines.push("");
  lines.push("| Rejected tactic | Reason |");
  lines.push("| --- | --- |");
  for (const r of report.rejectedTactics) {
    lines.push(`| ${esc(r.tactic)} | ${esc(r.reason)} |`);
  }
  lines.push("");

  lines.push("## Master table — priority assets");
  lines.push("");
  lines.push(
    "| Priority | Asset | Audience | Primary channels | Promotion angle | Repurposing | Expected outcome | Effort | Paid/free | Measurement |",
  );
  lines.push(
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  );
  for (const p of report.plans) {
    lines.push(
      `| ${p.priority ?? ""} | ${esc(p.assetName)} (\`${p.assetPath}\`) | ${esc(truncate(p.audience, 70))} | ${esc(truncate(p.primaryChannels.join(", "), 60))} | ${esc(truncate(p.promotionAngle, 90))} | ${esc(truncate(p.repurposingIdeas.join(", "), 50))} | ${esc(truncate(p.expectedOutcome, 50))} | ${p.effort} | ${p.paidFree} | ${esc(truncate(p.measurement.join("; "), 50))} |`,
    );
  }
  lines.push("");

  lines.push("## Plans detail");
  lines.push("");
  for (const p of report.plans) {
    lines.push(`### ${p.priority}. ${p.assetName}`);
    lines.push("");
    lines.push(
      `**Path:** \`${p.assetPath}\` · **Score:** ${p.scoreBand} · **Effort:** ${p.effort} · **Paid/free:** ${p.paidFree}`,
    );
    lines.push("");
    lines.push("| Field | Detail |");
    lines.push("| --- | --- |");
    lines.push(`| Audience | ${esc(p.audience)} |`);
    lines.push(`| Primary channels | ${esc(p.primaryChannels.join(", "))} |`);
    if (p.weakChannels.length) {
      lines.push(`| Weak / avoid | ${esc(p.weakChannels.join(", "))} |`);
    }
    lines.push(`| Promotion angle | ${esc(p.promotionAngle)} |`);
    if (p.badAngleExample) {
      lines.push(`| Bad angle (avoid) | ${esc(p.badAngleExample)} |`);
    }
    lines.push(
      `| Repurposing ideas | ${esc(p.repurposingIdeas.join(", "))} _(ideas only — assets not generated)_ |`,
    );
    lines.push(`| Expected outcome | ${esc(p.expectedOutcome)} |`);
    lines.push(`| Measurement | ${esc(p.measurement.join("; "))} |`);
    if (p.relatedPartnerships.length) {
      lines.push(
        `| Related partnerships | ${esc(p.relatedPartnerships.join("; "))} |`,
      );
    }
    if (p.relatedPaidTests.length) {
      lines.push(
        `| Related paid tests | ${esc(p.relatedPaidTests.join("; "))} |`,
      );
    }
    if (p.relatedPrIdeas.length) {
      lines.push(`| Related PR ideas | ${esc(p.relatedPrIdeas.join("; "))} |`);
    }
    if (p.communitySafetyNotes) {
      lines.push(`| Safety | ${esc(p.communitySafetyNotes)} |`);
    }
    lines.push("");
  }

  lines.push("## Major tool launch / distribution plans");
  lines.push("");
  for (const L of report.launchPlans) {
    lines.push(`### ${L.toolName}`);
    lines.push("");
    lines.push(
      `**Path:** \`${L.toolPath}\` · **Product Hunt fit:** ${L.productHuntFit} · **Effort:** ${L.effort}`,
    );
    lines.push("");
    lines.push(L.launchNarrative);
    lines.push("");
    lines.push(`- **Channels:** ${L.channels.join(", ")}`);
    if (L.productHuntNotes) lines.push(`- **PH notes:** ${L.productHuntNotes}`);
    lines.push("- **Sequence:**");
    for (const step of L.sequence) lines.push(`  1. ${step}`);
    lines.push(`- **Measure:** ${L.measurement.join("; ")}`);
    lines.push("");
  }

  lines.push("## Queries run");
  lines.push("");
  for (const q of report.queriesRun) lines.push(`- \`${q}\``);
  lines.push("");

  lines.push("## Limitations");
  lines.push("");
  for (const lim of report.limitations) lines.push(`- ${lim}`);
  lines.push("");

  lines.push("---");
  lines.push("");
  lines.push(
    `Regenerate: \`npm run authority:promote\` · Schema ${AUTHORITY_INTELLIGENCE_VERSION}`,
  );
  lines.push("");

  return lines.join("\n");
}
