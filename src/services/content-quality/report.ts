import type { ContentQualityAssessment } from "@/domain/schemas/content-quality";
import { qualityBandLabel } from "./dimensions";

export function formatQualityMarkdown(
  assessment: ContentQualityAssessment,
): string {
  const lines: string[] = [
    `# Content Quality Assessment`,
    "",
    `| Field | Value |`,
    `| --- | --- |`,
    `| Content ID | \`${assessment.contentId}\` |`,
    `| Route | \`${assessment.route}\` |`,
    `| Page type | ${assessment.pageType} |`,
    `| Profile | ${assessment.profileId} |`,
    `| Title | ${assessment.title ?? "—"} |`,
    `| Overall | **${assessment.overallScore}/100** |`,
    `| Band | **${qualityBandLabel(assessment.qualityBand)}** |`,
    `| Evaluated | ${assessment.evaluatedAt} |`,
    `| Evaluator | v${assessment.evaluatorVersion} |`,
    "",
    "> Evaluation only — does not rewrite, publish, or mutate content.",
    "",
    `## Dimension scores`,
    "",
  ];

  for (const d of assessment.dimensions) {
    lines.push(`### ${d.label}`);
    lines.push("");
    lines.push(`**${d.score} / 5** (weight ${d.weight})`);
    lines.push("");
    lines.push(`**Reason:** ${d.reason}`);
    lines.push("");
    if (d.evidence.length) {
      lines.push("**Evidence:**");
      for (const e of d.evidence) {
        const mark =
          e.present === true ? "✓" : e.present === false ? "✗" : "•";
        lines.push(
          `- ${mark} ${e.label}${e.detail ? ` — ${e.detail}` : ""}${e.path ? ` (\`${e.path}\`)` : ""}`,
        );
      }
      lines.push("");
    }
    if (d.gap) {
      lines.push(`**Gap:** ${d.gap}`);
      lines.push("");
    }
    if (d.recommendations.length) {
      lines.push("**Recommendations:**");
      for (const r of d.recommendations) {
        lines.push(`- [${r.priority}] ${r.summary}`);
      }
      lines.push("");
    }
  }

  const sections: [string, string[]][] = [
    ["Strengths", assessment.strengths],
    ["Weaknesses", assessment.weaknesses],
    ["Critical gaps", assessment.criticalGaps],
    ["Quick wins", assessment.quickWins],
    ["Major improvements", assessment.majorImprovements],
    ["Research gaps", assessment.researchGaps],
    ["Linking gaps", assessment.linkingGaps],
    ["Media gaps", assessment.mediaGaps],
    ["Tool opportunities", assessment.toolOpportunities],
    ["Resource opportunities", assessment.resourceOpportunities],
  ];

  for (const [title, items] of sections) {
    if (!items.length) continue;
    lines.push(`## ${title}`);
    lines.push("");
    for (const item of items) lines.push(`- ${item}`);
    lines.push("");
  }

  if (assessment.notes.length) {
    lines.push(`## Notes`);
    lines.push("");
    for (const n of assessment.notes) lines.push(`- ${n}`);
    lines.push("");
  }

  return lines.join("\n");
}

export function formatQualityText(assessment: ContentQualityAssessment): string {
  const lines = [
    `CONTENT QUALITY — ${assessment.route}`,
    `${assessment.pageType} | ${assessment.profileId}`,
    `Score ${assessment.overallScore}/100 — ${qualityBandLabel(assessment.qualityBand)}`,
    "",
  ];
  for (const d of assessment.dimensions) {
    lines.push(`${d.label.padEnd(28)} ${d.score}/5  ${d.reason.slice(0, 80)}`);
  }
  if (assessment.criticalGaps.length) {
    lines.push("");
    lines.push("CRITICAL");
    assessment.criticalGaps.slice(0, 5).forEach((g, i) => {
      lines.push(`${i + 1}. ${g}`);
    });
  }
  return lines.join("\n");
}
