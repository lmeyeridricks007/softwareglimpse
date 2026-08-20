import { AUTHORITY_INTELLIGENCE_VERSION } from "@/domain/schemas/authority-intelligence";
import type { PartnershipReport } from "./types";

function esc(s: string): string {
  return s.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return `${s.slice(0, n - 1)}…`;
}

export function formatPartnershipReport(report: PartnershipReport): string {
  const lines: string[] = [];

  lines.push("# Partnership Opportunities — Latest");
  lines.push("");
  lines.push(
    `> Agent: **PartnershipOpportunityAgent** · Topic: **${report.topic}**`,
  );
  lines.push(
    `> Generated: ${report.generatedAt} · Framework v${report.version}`,
  );
  lines.push(
    `> Live web search required: **yes** · Contacts partners: **no** · Hits investigated: **${report.hitsInvestigated}**`,
  );
  lines.push(
    `> **Report only.** Never misrepresent SoftwareGlimpse as an implementation partner where it is not.`,
  );
  lines.push("");

  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("| --- | --- |");
  lines.push(`| Recommended / explore | ${report.accepted.length} |`);
  lines.push(`| Rejected | ${report.rejected.length} |`);
  lines.push(`| Queries run | ${report.queriesRun.length} |`);
  lines.push("");

  lines.push("## Policy");
  lines.push("");
  lines.push(
    "- Partnerships require **mutual value** (what we offer ↔ what they offer).",
  );
  lines.push(
    `- Reject **${"REJECT — MASS LINK EXCHANGE"}** as the primary relationship model.`,
  );
  lines.push(
    "- Natural mutual references arising from genuine collaboration are different and allowed.",
  );
  lines.push(
    "- Do **not** enroll in vendor SI / Solutions Partner programs unless SG truly delivers those services.",
  );
  lines.push("- This agent never contacts partners or submits applications.");
  lines.push("");

  lines.push("## Master table");
  lines.push("");
  lines.push(
    "| Priority | Organization | Type | Why relevant | Collaboration idea | What we offer | What they offer | Potential link | Visibility | Difficulty | Contact path |",
  );
  lines.push(
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  );
  for (const o of report.accepted) {
    lines.push(
      `| ${o.priority ?? ""} | ${esc(o.organization)} | ${o.partnerType} | ${esc(truncate(o.whyRelevant, 90))} | ${esc(truncate(o.collaborationIdea, 90))} | ${esc(truncate(o.whatWeOffer, 80))} | ${esc(truncate(o.whatTheyOffer, 80))} | ${esc(truncate(o.potentialLink, 70))} | ${o.visibilityValue} | ${o.difficulty} | ${esc(truncate(o.contactPath, 70))} |`,
    );
  }
  lines.push("");

  lines.push("## Opportunity detail");
  lines.push("");
  for (const o of report.accepted) {
    lines.push(`### ${o.priority}. ${o.organization}`);
    lines.push("");
    lines.push(
      `**Type:** ${o.partnerType} · **Status:** ${o.status} · **Score:** ${o.scoreBand} (${o.scoreNormalized}) · **Difficulty:** ${o.difficulty}`,
    );
    lines.push("");
    lines.push("| Field | Detail |");
    lines.push("| --- | --- |");
    lines.push(`| Why relevant | ${esc(o.whyRelevant)} |`);
    lines.push(`| Collaboration idea | ${esc(o.collaborationIdea)} |`);
    lines.push(
      `| Models | ${o.collaborationModels.join(", ")} |`,
    );
    lines.push(`| What we offer | ${esc(o.whatWeOffer)} |`);
    lines.push(`| What they offer | ${esc(o.whatTheyOffer)} |`);
    lines.push(`| Mutual value | ${esc(o.mutualValue)} |`);
    lines.push(`| Potential link | ${esc(o.potentialLink)} |`);
    lines.push(`| Visibility value | ${o.visibilityValue} |`);
    lines.push(`| Contact path | ${esc(o.contactPath)} |`);
    lines.push(`| Source | ${o.sourceUrl} |`);
    lines.push(`| Verified | ${o.verifiedAt.slice(0, 10)} |`);
    if (o.targetSgAssets.length) {
      lines.push(
        `| SG assets | ${o.targetSgAssets.map((p) => `\`${p}\``).join(", ")} |`,
      );
    }
    if (o.vendorEcosystemNotes) {
      lines.push(`| Vendor ecosystem notes | ${esc(o.vendorEcosystemNotes)} |`);
    }
    lines.push("");
  }

  lines.push("## By partner type");
  lines.push("");
  for (const [type, items] of Object.entries(report.byPartnerType).sort()) {
    if (!items.length) continue;
    lines.push(`### ${type} (${items.length})`);
    lines.push("");
    for (const o of items) {
      lines.push(
        `- **P${o.priority}** ${o.organization} — ${truncate(o.collaborationIdea, 100)}`,
      );
    }
    lines.push("");
  }

  lines.push("## Rejected");
  lines.push("");
  lines.push("| Organization | Opportunity | Reason | Notes | Source |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const r of report.rejected) {
    lines.push(
      `| ${esc(r.organization)} | ${esc(truncate(r.opportunity, 80))} | ${esc(r.reason)} | ${esc(truncate(r.notes ?? "", 100))} | ${r.sourceUrl} |`,
    );
  }
  lines.push("");

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
    `Regenerate: \`npm run authority:partnerships\` · Schema ${AUTHORITY_INTELLIGENCE_VERSION}`,
  );
  lines.push("");

  return lines.join("\n");
}
