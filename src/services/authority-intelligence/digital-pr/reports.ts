import { AUTHORITY_INTELLIGENCE_VERSION } from "@/domain/schemas/authority-intelligence";
import type { DigitalPrReport } from "./types";

function esc(s: string): string {
  return s.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return `${s.slice(0, n - 1)}…`;
}

export function formatDigitalPrReport(report: DigitalPrReport): string {
  const lines: string[] = [];

  lines.push("# Digital PR Opportunities — Latest");
  lines.push("");
  lines.push(
    `> Agent: **DigitalPROpportunityAgent** · Topic: **${report.topic}**`,
  );
  lines.push(
    `> Generated: ${report.generatedAt} · Framework v${report.version}`,
  );
  lines.push(
    `> Live web search required: **yes** · Invents statistics: **no** · Sends outreach: **no**`,
  );
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| Metric | Value |");
  lines.push("| --- | --- |");
  lines.push(`| PR ideas (scored) | ${report.ideas.length} |`);
  lines.push(
    `| Ready / near-ready | ${report.ideas.filter((i) => i.status === "ready" || i.status === "near-ready").length} |`,
  );
  lines.push(`| Deferred (no data support) | ${report.deferredIdeas.length} |`);
  lines.push(`| Data inventory items | ${report.dataInventory.length} |`);
  lines.push(`| Publication matches | ${report.publicationMatches.length} |`);
  lines.push(
    `| Expert commentary channels | ${report.expertCommentary.length} |`,
  );
  lines.push(`| Seasonal hooks | ${report.seasonalHooks.length} |`);
  lines.push("");
  lines.push("## Policy");
  lines.push("");
  lines.push(
    "- Only recommend studies where underlying SoftwareGlimpse data can genuinely support them.",
  );
  lines.push("- **Do not invent statistics.**");
  lines.push(
    "- Do not invent journalist names — publication matches list outlets and coverage angles from live verification.",
  );
  lines.push(
    "- Embeddable assets may require attribution; **never require followed links** as a condition for use.",
  );
  lines.push(
    "- Sponsored content is never characterized as independent editorial coverage.",
  );
  lines.push("- Report only — this agent does not pitch or publish.");
  lines.push("");

  lines.push("## Existing data inventory");
  lines.push("");
  lines.push(
    "| Asset | Scale | Citeable as | Not citeable as | Source |",
  );
  lines.push("| --- | --- | --- | --- | --- |");
  for (const d of report.dataInventory) {
    lines.push(
      `| ${esc(d.label)} | ${esc(truncate(d.approximateScale, 120))} | ${esc(truncate(d.citeableAs, 140))} | ${esc(truncate(d.notCiteableAs, 100))} | \`${esc(d.pathOrSource)}\` |`,
    );
  }
  lines.push("");

  lines.push("## Master table");
  lines.push("");
  lines.push(
    "| Priority | PR idea | Data required | Existing data | New research needed | Target audiences | Potential publications | Timeliness | Linkability | Effort | Recommended next action |",
  );
  lines.push(
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  );
  for (const idea of report.ideas) {
    lines.push(
      `| ${idea.priority ?? ""} | ${esc(idea.title)} | ${esc(truncate(idea.dataRequired.join("; "), 80))} | ${esc(truncate(idea.existingDataAvailable.join("; "), 90))} | ${esc(truncate(idea.newResearchNeeded.join("; ") || "—", 70))} | ${esc(truncate(idea.targetAudiences.join("; "), 70))} | ${esc(truncate(idea.potentialPublications.join("; "), 70))} | ${esc(truncate(idea.timeliness, 60))} | ${idea.scoreBand} (${idea.scoreNormalized}) · ${idea.status} | ${idea.effort} | ${esc(truncate(idea.recommendedNextAction, 100))} |`,
    );
  }
  lines.push("");

  lines.push("## PR ideas detail");
  lines.push("");
  for (const idea of report.ideas) {
    lines.push(`### ${idea.priority}. ${idea.title}`);
    lines.push("");
    lines.push(`**Status:** ${idea.status} · **Linkability:** ${idea.scoreBand} (${idea.scoreNormalized}) · **Effort:** ${idea.effort}`);
    lines.push("");
    lines.push(idea.summary);
    lines.push("");
    lines.push("| Field | Detail |");
    lines.push("| --- | --- |");
    lines.push(`| Data required | ${esc(idea.dataRequired.join("; "))} |`);
    lines.push(
      `| Existing data available | ${esc(idea.existingDataAvailable.join("; "))} |`,
    );
    lines.push(
      `| New research needed | ${esc(idea.newResearchNeeded.join("; ") || "None beyond polish")} |`,
    );
    lines.push(
      `| Target audiences | ${esc(idea.targetAudiences.join("; "))} |`,
    );
    lines.push(
      `| Potential publications | ${esc(idea.potentialPublications.join("; "))} |`,
    );
    lines.push(`| Timeliness | ${esc(idea.timeliness)} |`);
    lines.push(
      `| Landing pages | ${idea.landingPages.map((p) => `\`${p}\``).join(", ") || "—"} |`,
    );
    lines.push(
      `| Recommended next action | ${esc(idea.recommendedNextAction)} |`,
    );
    lines.push("");
    lines.push("**Linkability dimensions**");
    lines.push("");
    lines.push(
      `| Originality | Data uniqueness | Newsworthiness | Timeliness | Visual | Citation | Audience | Reproducibility |`,
    );
    lines.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
    const L = idea.linkability;
    lines.push(
      `| ${L.originality} | ${L.dataUniqueness} | ${L.newsworthiness} | ${L.timeliness} | ${L.visualPotential} | ${L.citationPotential} | ${L.audienceFit} | ${L.reproducibility} |`,
    );
    lines.push("");
    if (idea.visuals.length) {
      lines.push("**Recommended visuals / embeddables**");
      lines.push("");
      for (const v of idea.visuals) {
        lines.push(
          `- **${v.kind}:** ${v.description}${v.embeddable ? " _(embeddable; attribution OK; no follow-link required)_" : ""}`,
        );
      }
      lines.push("");
    }
    if (idea.limitations.length) {
      lines.push("**Limitations**");
      lines.push("");
      for (const lim of idea.limitations) lines.push(`- ${lim}`);
      lines.push("");
    }
  }

  lines.push("## Deferred ideas (insufficient data)");
  lines.push("");
  lines.push("| Idea | Why deferred |");
  lines.push("| --- | --- |");
  for (const d of report.deferredIdeas) {
    lines.push(`| ${esc(d.title)} | ${esc(d.reason)} |`);
  }
  lines.push("");

  lines.push("## Publication / coverage matches");
  lines.push("");
  lines.push(
    "| Publication | Recent coverage angle | Author (if verified) | Source URL | Verified |",
  );
  lines.push("| --- | --- | --- | --- | --- |");
  for (const p of report.publicationMatches) {
    lines.push(
      `| ${esc(p.publication)} | ${esc(truncate(p.recentCoverageAngle, 140))} | ${p.journalistOrAuthor ? esc(p.journalistOrAuthor) : "—"} | ${p.url} | ${p.verifiedAt.slice(0, 10)} |`,
    );
  }
  lines.push("");
  lines.push(
    "_Journalist/author names omitted unless observed on the live page — no invented names._",
  );
  lines.push("");

  lines.push("## Expert commentary opportunities");
  lines.push("");
  lines.push("| Platform | Notes | Cost notes | Source URL | Verified |");
  lines.push("| --- | --- | --- | --- | --- |");
  for (const c of report.expertCommentary) {
    lines.push(
      `| ${esc(c.platform)} | ${esc(truncate(c.notes, 160))} | ${esc(c.costNotes ?? "—")} | ${c.url} | ${c.verifiedAt.slice(0, 10)} |`,
    );
  }
  lines.push("");

  lines.push("## Seasonal / news hooks");
  lines.push("");
  for (const h of report.seasonalHooks) {
    lines.push(`### ${h.hook}`);
    lines.push("");
    lines.push(`- **Window:** ${h.window}`);
    if (h.relatedPrIdeaIds.length) {
      lines.push(`- **Related ideas:** ${h.relatedPrIdeaIds.join(", ")}`);
    }
    if (h.sourceUrl) lines.push(`- **Source:** ${h.sourceUrl}`);
    if (h.notes) lines.push(`- ${h.notes}`);
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
    `Regenerate: \`npm run authority:digital-pr\` · Schema ${AUTHORITY_INTELLIGENCE_VERSION}`,
  );
  lines.push("");

  return lines.join("\n");
}
