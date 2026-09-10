import type { ContentQualityGateResult } from "./types";

export function formatGateResultMarkdown(
  result: ContentQualityGateResult,
): string {
  const lines: string[] = [];
  lines.push(`# Content Quality Gate — ${result.title}`);
  lines.push("");
  lines.push(`- Path: \`${result.path}\``);
  lines.push(`- Type: **${result.pageType}**`);
  lines.push(`- Score: **${result.qualityScore}**/100`);
  lines.push(`- Lifecycle: \`${result.lifecycleState}\``);
  lines.push(`- Index eligible: **${result.indexEligible ? "yes" : "no"}**`);
  lines.push(`- Evaluated: ${result.evaluatedAt}`);
  lines.push("");
  lines.push("## Dimensions");
  lines.push("");
  lines.push("| Dimension | Score | Weight | Explanation |");
  lines.push("| --- | ---: | ---: | --- |");
  for (const d of result.dimensions) {
    lines.push(
      `| ${d.label} | ${d.score} | ${d.weight} | ${d.explanation.replace(/\|/g, "/").slice(0, 120)} |`,
    );
  }
  lines.push("");
  if (result.failures.length) {
    lines.push("## Failures (hard)");
    lines.push("");
    for (const f of result.failures) {
      lines.push(`- **${f.code}**: ${f.message}`);
    }
    lines.push("");
  }
  if (result.warnings.length) {
    lines.push("## Warnings");
    lines.push("");
    for (const w of result.warnings) {
      lines.push(`- ${w.code}: ${w.message}`);
    }
    lines.push("");
  }
  if (result.requiredImprovements.length) {
    lines.push("## Required improvements");
    lines.push("");
    for (const r of result.requiredImprovements) {
      lines.push(`- ${r}`);
    }
    lines.push("");
  }
  if (result.recommendedImprovements.length) {
    lines.push("## Recommended improvements");
    lines.push("");
    for (const r of result.recommendedImprovements) {
      lines.push(`- ${r}`);
    }
    lines.push("");
  }
  lines.push(
    "_Word count alone is never a hard fail. Thresholds are not lowered to inflate indexed URLs._",
  );
  lines.push("");
  return lines.join("\n");
}
