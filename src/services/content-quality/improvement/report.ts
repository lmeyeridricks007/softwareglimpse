import fs from "node:fs";
import path from "node:path";
import type { ImprovementOpportunity, SystemicPattern } from "./types";

const BACKLOG_PATH = path.join(
  process.cwd(),
  "docs",
  "content-quality",
  "CONTENT-IMPROVEMENT-BACKLOG.md",
);

function clusterKey(o: ImprovementOpportunity): string {
  if (o.mapCluster && o.mapCluster !== "—") return o.mapCluster;
  switch (o.pageType) {
    case "industry":
      return "Industries";
    case "use-case":
      return "Use Cases";
    case "capability":
      return "Capabilities";
    case "requirement":
      return "Requirements";
    case "feature":
      return "Features";
    case "resource":
      return "Resources";
    case "product-review":
      return "Products";
    case "comparison":
      return "Compare";
    case "best":
      return "Choose";
    case "implementation-guide":
    case "product-guide":
      return "Implement";
    case "guide":
    case "article":
      return "Learn/Choose guides";
    default:
      return o.pageType;
  }
}

export function formatImprovementBacklogMarkdown(input: {
  generatedAt: string;
  opportunities: ImprovementOpportunity[];
  patterns: SystemicPattern[];
  seoNote: string;
}): string {
  const { opportunities, patterns, generatedAt, seoNote } = input;
  const top50 = opportunities.slice(0, 50);
  const quickWins = opportunities.filter((o) => o.quickWin);
  const majors = opportunities.filter((o) => o.majorProject);
  const researchDep = opportunities.filter((o) => o.researchRequired);
  const systemic = opportunities.filter((o) => o.systemic);
  const templateFixes = opportunities.filter((o) => o.fixClass === "TEMPLATE FIX");
  const pageFixes = opportunities.filter((o) => o.fixClass === "PAGE CONTENT FIX");
  const dataFixes = opportunities.filter((o) => o.fixClass === "DATA/RESEARCH FIX");
  const linkFixes = opportunities.filter((o) => o.fixClass === "LINK GRAPH FIX");

  const lines: string[] = [
    `# Content Improvement Backlog`,
    "",
    `Generated: ${generatedAt}`,
    `Agent: **ContentImprovementOpportunityAgent**`,
    `Opportunities: **${opportunities.length}**`,
    "",
    "> Planning only — does **not** rewrite, publish, or mutate content.",
    "",
    `## Inputs`,
    "",
    `- \`docs/content-quality/CONTENT-QUALITY-LATEST.md\``,
    `- \`docs/content-quality/pages/\``,
    `- \`docs/content-ecosystem/04-crm-master-content-map.md\``,
    `- SEO health: ${seoNote}`,
    "",
    `## Summary`,
    "",
    `| Metric | Count |`,
    `| --- | ---: |`,
    `| Total opportunities | ${opportunities.length} |`,
    `| Quick wins | ${quickWins.length} |`,
    `| Major content projects | ${majors.length} |`,
    `| Research-dependent | ${researchDep.length} |`,
    `| Systemic / pattern-tagged | ${systemic.length} |`,
    `| TEMPLATE FIX | ${templateFixes.length} |`,
    `| PAGE CONTENT FIX | ${pageFixes.length} |`,
    `| DATA/RESEARCH FIX | ${dataFixes.length} |`,
    `| LINK GRAPH FIX | ${linkFixes.length} |`,
    "",
    `## Systemic patterns (prefer platform/template fixes)`,
    "",
  ];

  if (!patterns.length) {
    lines.push("_No repeated patterns with ≥3 hits._", "");
  } else {
    for (const p of patterns) {
      lines.push(`### ${p.id} — ${p.label}`);
      lines.push("");
      lines.push(`- **Count:** ${p.count}`);
      lines.push(`- **Page types:** ${p.pageTypes.join(", ")}`);
      lines.push(`- **Fix class:** ${p.suggestedFixClass}`);
      lines.push(`- **Samples:** ${p.sampleRoutes.map((r) => `\`${r}\``).join(", ")}`);
      lines.push(`- **Recommendation:** ${p.recommendation}`);
      lines.push("");
    }
  }

  lines.push(`## Top 50 ranked improvements`);
  lines.push("");
  lines.push(
    `| # | Priority | Route | Page type | Score | Map | Issue | Recommended improvement | Research | Effort | Fix class | Impact |`,
  );
  lines.push(`| --- | --- | --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- |`);

  top50.forEach((o, i) => {
    const issue = o.problem.replace(/\|/g, "/").slice(0, 90);
    const rec = o.recommendedChange.replace(/\|/g, "/").slice(0, 110);
    const impact = o.mapNodeId
      ? `${o.mapNodeId} (${o.mapPriority ?? "?"})`
      : o.mapCluster ?? "—";
    lines.push(
      `| ${i + 1} | ${o.priority} | \`${o.route}\` | ${o.pageType} | ${o.currentScore}→${o.targetScore} | ${o.mapPriority ?? "—"} | ${issue} | ${rec} | ${o.researchRequired ? "yes" : "no"} | ${o.effort} | ${o.fixClass} | ${impact} |`,
    );
  });
  lines.push("");

  lines.push(`## Quick wins`);
  lines.push("");
  if (!quickWins.length) lines.push("_None._", "");
  else {
    lines.push(`| ID | Route | Change | Effort |`);
    lines.push(`| --- | --- | --- | --- |`);
    for (const o of quickWins.slice(0, 40)) {
      lines.push(
        `| ${o.id} | \`${o.route}\` | ${o.recommendedChange.replace(/\|/g, "/").slice(0, 140)} | ${o.effort} |`,
      );
    }
    lines.push("");
  }

  lines.push(`## Major content projects`);
  lines.push("");
  if (!majors.length) lines.push("_None._", "");
  else {
    for (const o of majors.slice(0, 30)) {
      lines.push(`### ${o.id} — \`${o.route}\` (${o.priority})`);
      lines.push("");
      lines.push(`- **Score:** ${o.currentScore} → ${o.targetScore}`);
      lines.push(`- **Types:** ${o.types.join(", ")}`);
      lines.push(`- **Fix class:** ${o.fixClass}`);
      lines.push(`- **Problem:** ${o.problem}`);
      lines.push(`- **Change:** ${o.recommendedChange}`);
      lines.push(`- **Research needed:** ${o.researchRequired ? o.evidenceNeeded.join("; ") || "yes" : "no"}`);
      lines.push(`- **Effort:** ${o.effort}`);
      lines.push("");
    }
  }

  lines.push(`## Clusters (batch improvements)`);
  lines.push("");
  const byCluster = new Map<string, ImprovementOpportunity[]>();
  for (const o of opportunities) {
    const key = clusterKey(o);
    const arr = byCluster.get(key) ?? [];
    arr.push(o);
    byCluster.set(key, arr);
  }
  for (const [cluster, items] of [...byCluster.entries()].sort(
    (a, b) => b[1].length - a[1].length,
  )) {
    lines.push(`### ${cluster} (${items.length})`);
    lines.push("");
    for (const o of items.slice(0, 12)) {
      lines.push(
        `- ${o.id} \`${o.route}\` [${o.priority}] ${o.types[0]} — ${o.problem.slice(0, 100)}`,
      );
    }
    if (items.length > 12) lines.push(`- _…+${items.length - 12} more_`);
    lines.push("");
  }

  lines.push(`## Opportunity detail (top 20)`);
  lines.push("");
  for (const o of opportunities.slice(0, 20)) {
    lines.push(`### ${o.id}`);
    lines.push("");
    lines.push(`| Field | Value |`);
    lines.push(`| --- | --- |`);
    lines.push(`| Route | \`${o.route}\` |`);
    lines.push(`| Page type | ${o.pageType} |`);
    lines.push(`| Current → target | ${o.currentScore} → ${o.targetScore} |`);
    lines.push(`| Priority | ${o.priority} |`);
    lines.push(`| Map | ${o.mapNodeId ?? "—"} (${o.mapPriority ?? "—"}) / ${o.mapCluster ?? "—"} |`);
    lines.push(`| Types | ${o.types.join(", ")} |`);
    lines.push(`| Fix class | ${o.fixClass} |`);
    lines.push(`| Effort | ${o.effort} |`);
    lines.push(`| Quick win | ${o.quickWin ? "yes" : "no"} |`);
    lines.push(`| Major project | ${o.majorProject ? "yes" : "no"} |`);
    lines.push(`| Systemic | ${o.systemic ? "yes" : "no"} |`);
    lines.push(`| Research required | ${o.researchRequired ? "yes" : "no"} |`);
    lines.push("");
    lines.push(`**Problem:** ${o.problem}`);
    lines.push("");
    lines.push(`**Why it matters:** ${o.whyItMatters}`);
    lines.push("");
    lines.push(`**Recommended change:** ${o.recommendedChange}`);
    lines.push("");
    lines.push(`**Sections affected:** ${o.sectionsAffected.join(", ") || "—"}`);
    lines.push("");
    lines.push(`**Evidence/research needed:** ${o.evidenceNeeded.join("; ") || "—"}`);
    lines.push("");
    lines.push(`**Visual/media needed:** ${o.visualMediaNeeded.join("; ") || "—"}`);
    lines.push("");
    lines.push(`**Tool integration:** ${o.toolIntegration.join("; ") || "—"}`);
    lines.push("");
    lines.push(`**Resource integration:** ${o.resourceIntegration.join("; ") || "—"}`);
    lines.push("");
    lines.push(`**Internal-link changes:** ${o.internalLinkChanges.join("; ") || "—"}`);
    lines.push("");
    lines.push(`**Related content-map nodes:** ${o.relatedMapNodes.join(", ") || "—"}`);
    lines.push("");
    lines.push(`**Dependencies:** ${o.dependencies.join("; ") || "—"}`);
    lines.push("");
    lines.push(`**Expected outcome:** ${o.expectedOutcome}`);
    lines.push("");
  }

  lines.push(`## Notes`);
  lines.push("");
  lines.push(
    "- Do not expand copy before research dependencies are satisfied.",
  );
  lines.push(
    "- Prefer systemic/template fixes when a pattern repeats across many routes.",
  );
  lines.push(
    "- Re-run `npm run content:audit:crm` then `npm run content:backlog` after major research/link waves.",
  );
  lines.push("");

  return lines.join("\n");
}

export function writeImprovementBacklog(markdown: string): string {
  fs.mkdirSync(path.dirname(BACKLOG_PATH), { recursive: true });
  fs.writeFileSync(BACKLOG_PATH, markdown, "utf8");
  return "docs/content-quality/CONTENT-IMPROVEMENT-BACKLOG.md";
}

export function getBacklogPath(): string {
  return BACKLOG_PATH;
}
