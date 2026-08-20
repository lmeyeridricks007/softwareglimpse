import fs from "node:fs";
import path from "node:path";
import type { ContentQualityAssessment } from "@/domain/schemas/content-quality";
import { qualityBandLabel } from "./dimensions";
import type {
  ContentQualityPriority,
  JourneyImportance,
  PageImportance,
} from "./priority";

export type AuditPageResult = {
  assessment: ContentQualityAssessment;
  slug: string;
  agentId: string;
  agentLabel: string;
  improvementPriority: ContentQualityPriority;
  pageImportance: PageImportance;
  journeyImportance: JourneyImportance;
  reportRelPath: string;
};

const DOCS_PAGES_DIR = path.join(
  process.cwd(),
  "docs",
  "content-quality",
  "pages",
);
const DOCS_MASTER = path.join(
  process.cwd(),
  "docs",
  "content-quality",
  "CONTENT-QUALITY-LATEST.md",
);

export function pageReportFilename(
  pageType: string,
  slug: string,
): string {
  return `${pageType}--${slug}.md`;
}

export function formatPageAuditMarkdown(result: AuditPageResult): string {
  const a = result.assessment;
  const lines: string[] = [
    `# Content Quality Assessment`,
    "",
    `| Field | Value |`,
    `| --- | --- |`,
    `| Route | \`${a.route}\` |`,
    `| Page type | ${a.pageType} |`,
    `| Status | ${qualityBandLabel(a.qualityBand)} |`,
    `| Overall score | **${a.overallScore}/100** |`,
    `| Quality band | **${qualityBandLabel(a.qualityBand)}** |`,
    `| Improvement priority | **${result.improvementPriority}** |`,
    `| Page importance | ${result.pageImportance} |`,
    `| Journey importance | ${result.journeyImportance} |`,
    `| Agent | ${result.agentLabel} |`,
    `| Profile | ${a.profileId} |`,
    `| Evaluated | ${a.evaluatedAt} |`,
    `| Evaluator | v${a.evaluatorVersion} |`,
    "",
    "> Evaluation only — does not rewrite, publish, or mutate content.",
    "",
    `## Executive assessment`,
    "",
    a.overallScore >= 80
      ? `This ${a.pageType} page is in good editorial shape overall (${a.overallScore}/100), with remaining gaps listed below.`
      : a.overallScore >= 60
        ? `This ${a.pageType} page is usable but has meaningful quality gaps (${a.overallScore}/100). Prioritize the critical gaps before expansion.`
        : `This ${a.pageType} page is weak or incomplete (${a.overallScore}/100). It needs substantial improvement before it can reliably support the CRM buyer journey.`,
    "",
    ...(a.weaknesses.slice(0, 3).map((w) => `- ${w}`)),
    "",
    `## Scorecard`,
    "",
    `| Dimension | Score | Weight | Notes |`,
    `| --- | ---: | ---: | --- |`,
  ];

  for (const d of a.dimensions) {
    const note = (d.gap ?? d.reason).replace(/\|/g, "/").slice(0, 120);
    lines.push(`| ${d.label} | ${d.score}/5 | ${d.weight} | ${note} |`);
  }

  const section = (title: string, items: string[]) => {
    lines.push("", `## ${title}`, "");
    if (!items.length) lines.push("_None flagged._");
    else items.forEach((i) => lines.push(`- ${i}`));
  };

  section("What is strong", a.strengths);
  section("Critical gaps", a.criticalGaps);
  section("Improvement opportunities", [
    ...a.majorImprovements,
    ...a.quickWins,
  ]);
  section("Missing evidence", a.researchGaps);
  section("Missing visuals/media", a.mediaGaps);
  section("Missing tools/resources", [
    ...a.toolOpportunities,
    ...a.resourceOpportunities,
  ]);
  section("Internal-linking issues", a.linkingGaps);

  const cannibal = a.dimensions.find((d) => d.id === "content-differentiation");
  lines.push("", "## Cannibalization/overlap concerns", "");
  if (cannibal && cannibal.score <= 2) {
    lines.push(`- ${cannibal.gap ?? cannibal.reason}`);
    cannibal.evidence
      .filter((e) => e.present === false)
      .forEach((e) => lines.push(`- ${e.label}${e.detail ? `: ${e.detail}` : ""}`));
  } else {
    lines.push("_No significant overlap concerns flagged._");
  }

  const fresh = a.dimensions.find((d) => d.id === "research-freshness");
  lines.push("", "## Freshness issues", "");
  if (fresh && fresh.score <= 2) {
    lines.push(`- ${fresh.gap ?? fresh.reason}`);
  } else {
    lines.push("_No critical freshness issues flagged._");
  }

  lines.push("", "## Suggested next step", "");
  const next =
    a.criticalGaps[0] ??
    a.majorImprovements[0] ??
    a.quickWins[0] ??
    "Maintain current quality; re-evaluate after research refresh.";
  lines.push(next);
  lines.push("");
  lines.push(`Priority: **${result.improvementPriority}** (${result.pageImportance} × ${result.journeyImportance} journey).`);
  lines.push("");

  return lines.join("\n");
}

export function writePageAuditReport(result: AuditPageResult): string {
  fs.mkdirSync(DOCS_PAGES_DIR, { recursive: true });
  const filename = pageReportFilename(
    result.assessment.pageType,
    result.slug,
  );
  const full = path.join(DOCS_PAGES_DIR, filename);
  fs.writeFileSync(full, formatPageAuditMarkdown(result), "utf8");
  return path.join("docs/content-quality/pages", filename);
}

export function formatMasterInventoryMarkdown(
  results: AuditPageResult[],
  meta: { evaluatedAt: string; scope: string },
): string {
  const sorted = [...results].sort(
    (a, b) => a.assessment.overallScore - b.assessment.overallScore,
  );
  const lines: string[] = [
    `# Content Quality — Latest Inventory`,
    "",
    `Evaluated: ${meta.evaluatedAt}`,
    `Scope: **${meta.scope}**`,
    `Pages: **${results.length}**`,
    "",
    "> Sorted lowest quality first. Evaluation only — no content rewrites.",
    "",
    `| Route | Page type | Score | Band | Priority | Critical gaps | Quick wins | Research gaps | Link gaps | Last evaluated |`,
    `| --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- |`,
  ];

  for (const r of sorted) {
    const a = r.assessment;
    const cell = (items: string[]) =>
      items.length
        ? items
            .slice(0, 2)
            .map((i) => i.replace(/\|/g, "/").slice(0, 80))
            .join("; ")
        : "—";
    lines.push(
      `| \`${a.route}\` | ${a.pageType} | ${a.overallScore} | ${qualityBandLabel(a.qualityBand)} | ${r.improvementPriority} | ${cell(a.criticalGaps)} | ${cell(a.quickWins)} | ${cell(a.researchGaps)} | ${cell(a.linkingGaps)} | ${a.evaluatedAt.slice(0, 10)} |`,
    );
  }

  lines.push("");
  lines.push(`## Priority counts`);
  lines.push("");
  for (const p of ["CQ-P0", "CQ-P1", "CQ-P2", "CQ-P3"] as const) {
    const n = results.filter((r) => r.improvementPriority === p).length;
    lines.push(`- **${p}**: ${n}`);
  }
  lines.push("");
  lines.push(`## Average score by page type`);
  lines.push("");
  const byType = new Map<string, number[]>();
  for (const r of results) {
    const arr = byType.get(r.assessment.pageType) ?? [];
    arr.push(r.assessment.overallScore);
    byType.set(r.assessment.pageType, arr);
  }
  lines.push(`| Page type | Count | Avg score |`);
  lines.push(`| --- | ---: | ---: |`);
  for (const [type, scores] of [...byType.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    const avg = Math.round(scores.reduce((s, n) => s + n, 0) / scores.length);
    lines.push(`| ${type} | ${scores.length} | ${avg} |`);
  }
  lines.push("");

  return lines.join("\n");
}

export function writeMasterInventory(
  results: AuditPageResult[],
  meta: { evaluatedAt: string; scope: string },
): string {
  fs.mkdirSync(path.dirname(DOCS_MASTER), { recursive: true });
  fs.writeFileSync(
    DOCS_MASTER,
    formatMasterInventoryMarkdown(results, meta),
    "utf8",
  );
  return "docs/content-quality/CONTENT-QUALITY-LATEST.md";
}

export function getDocsPagesDir(): string {
  return DOCS_PAGES_DIR;
}
