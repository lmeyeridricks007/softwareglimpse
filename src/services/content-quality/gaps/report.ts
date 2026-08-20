import fs from "node:fs";
import path from "node:path";
import type { GapAnalysisResult } from "./analyze";
import type {
  EligibilityDecision,
  NewContentOpportunity,
  NewContentOpportunityType,
} from "./types";

export const NEW_CONTENT_OPPORTUNITIES_PATH = path.join(
  process.cwd(),
  "docs",
  "content-quality",
  "NEW-CONTENT-OPPORTUNITIES.md",
);

function esc(s: string): string {
  return s.replace(/\|/g, "/").replace(/\n/g, " ").trim();
}

function byType(
  ops: NewContentOpportunity[],
  type: NewContentOpportunityType | RegExp,
): NewContentOpportunity[] {
  if (typeof type === "string") {
    return ops.filter((o) => o.type === type);
  }
  return ops.filter((o) => type.test(o.type));
}

function byDecision(
  ops: NewContentOpportunity[],
  d: EligibilityDecision,
): NewContentOpportunity[] {
  return ops.filter((o) => o.decision === d);
}

/** Top 50: prioritize CREATE + RESEARCH FIRST, then MERGE, then others. */
export function selectTop50(
  opportunities: NewContentOpportunity[],
): NewContentOpportunity[] {
  const preferred = opportunities.filter((o) =>
    ["CREATE", "RESEARCH FIRST", "MERGE INTO EXISTING"].includes(o.decision),
  );
  const rest = opportunities.filter(
    (o) => !["CREATE", "RESEARCH FIRST", "MERGE INTO EXISTING"].includes(o.decision),
  );
  return [...preferred, ...rest].slice(0, 50);
}

export function formatNewContentOpportunitiesMarkdown(input: {
  generatedAt: string;
  analysis: GapAnalysisResult;
  coverageNote: string;
  qualityNote: string;
  backlogNote: string;
}): string {
  const { generatedAt, analysis, coverageNote, qualityNote, backlogNote } =
    input;
  const { opportunities, pillars, productClusters, industryClusters, duplicates, counts } =
    analysis;
  const top50 = selectTop50(opportunities);
  const createNow = byDecision(opportunities, "CREATE");
  const researchFirst = byDecision(opportunities, "RESEARCH FIRST");
  const merge = byDecision(opportunities, "MERGE INTO EXISTING");
  const keepSection = byDecision(opportunities, "KEEP AS SECTION");
  const doNotCreate = byDecision(opportunities, "DO NOT CREATE");
  const future = byDecision(opportunities, "FUTURE");
  const resources = byType(
    opportunities,
    /CHECKLIST|TEMPLATE|WORKSHEET|SCORECARD|TOOL/,
  );
  const productGuides = byType(
    opportunities,
    /PRODUCT GUIDE|PRODUCT HOW-TO|PRODUCT ×/,
  );
  const industryGuides = byType(opportunities, "INDUSTRY GUIDE");
  const supporting = byType(
    opportunities,
    /SUPPORTING ARTICLE|IMPLEMENTATION|MIGRATION|CAPABILITY|REQUIREMENT|FEATURE|USE-CASE|PILLAR|RESEARCH/,
  );

  const lines: string[] = [
    `# New Content Opportunities`,
    "",
    `Generated: ${generatedAt}`,
    `Agent: **ContentGapOpportunityAgent**`,
    `Candidates: **${opportunities.length}**`,
    "",
    "> Identifies gaps and opportunities only — does **not** create, rewrite, or publish content.",
    "",
    `## Inputs`,
    "",
    `- \`docs/content-ecosystem/04-crm-master-content-map.md\``,
    `- \`docs/content-quality/CONTENT-QUALITY-LATEST.md\` — ${qualityNote}`,
    `- \`docs/content-quality/CONTENT-IMPROVEMENT-BACKLOG.md\` — ${backlogNote}`,
    `- \`docs/seo/reports/content-coverage-latest.md\` — ${coverageNote}`,
    "",
    `## Final report summary`,
    "",
    `| Bucket | Count |`,
    `| --- | ---: |`,
    `| New candidates (total) | ${opportunities.length} |`,
    `| CREATE now | ${counts.CREATE} |`,
    `| RESEARCH FIRST | ${counts["RESEARCH FIRST"]} |`,
    `| MERGE INTO EXISTING | ${counts["MERGE INTO EXISTING"]} |`,
    `| KEEP AS SECTION | ${counts["KEEP AS SECTION"]} |`,
    `| DO NOT CREATE | ${counts["DO NOT CREATE"]} |`,
    `| FUTURE | ${counts.FUTURE} |`,
    `| Resources / tools | ${resources.length} |`,
    `| Product guides / how-tos | ${productGuides.length} |`,
    `| Industry guides | ${industryGuides.length} |`,
    `| Supporting / pillar / research | ${supporting.length} |`,
    `| Document path | \`docs/content-quality/NEW-CONTENT-OPPORTUNITIES.md\` |`,
    "",
    `## Opportunity types (taxonomy)`,
    "",
    "SUPPORTING ARTICLE · PILLAR PAGE · PRODUCT GUIDE · PRODUCT HOW-TO · PRODUCT × INDUSTRY · PRODUCT × USE CASE · INDUSTRY GUIDE · USE-CASE GUIDE · CAPABILITY GUIDE · REQUIREMENT GUIDE · FEATURE GUIDE · IMPLEMENTATION ARTICLE · MIGRATION ARTICLE · CHECKLIST · TEMPLATE · WORKSHEET · SCORECARD · TOOL · RESEARCH PAGE",
    "",
    `## Eligibility rules (applied)`,
    "",
    "- Candidates need distinct intent, depth, research coverage, original value, internal-link value, and journey value — not mere entity combinations.",
    "- Thin programmatic permutations (product×every industry, feature×every use case, compare×every industry) → **DO NOT CREATE**.",
    "- Existing thin hubs → deepen / research first; do not spawn sibling keyword URLs.",
    "- Classification: CREATE · RESEARCH FIRST · MERGE INTO EXISTING · KEEP AS SECTION · DO NOT CREATE · FUTURE.",
    "",
    `## Top 50 new content opportunities`,
    "",
    `| # | Priority | Title | Type | Parent | Supports | Why needed | Research | Effort | Linking | Decision |`,
    `| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |`,
  ];

  top50.forEach((o, i) => {
    lines.push(
      `| ${i + 1} | ${o.priority} | ${esc(o.title)} | ${o.type} | ${esc(o.parent)} | ${esc(o.supports.join(", ") || "—")} | ${esc(o.whyNeeded).slice(0, 120)} | ${esc(o.researchStatus).slice(0, 40)} | ${o.effort} | ${o.linkingImpact} | ${o.decision} |`,
    );
  });

  lines.push("", `## CREATE now (briefs)`, "");
  if (!createNow.length) {
    lines.push("_No CREATE-now candidates this run — most gaps are research-gated or tools._", "");
  } else {
    for (const o of createNow) {
      lines.push(`### ${o.id} — ${o.title}`);
      lines.push("");
      lines.push(`- **Route:** \`${o.suggestedRoute}\``);
      lines.push(`- **Type:** ${o.type}`);
      lines.push(`- **Priority:** ${o.priority}`);
      lines.push(`- **Why:** ${o.whyNeeded}`);
      if (o.brief) {
        const b = o.brief;
        lines.push(`- **Search / user intent:** ${b.searchIntent}`);
        lines.push(`- **Primary question:** ${b.primaryQuestion}`);
        lines.push(`- **Why this deserves a page:** ${b.whyDeservesPage}`);
        lines.push(`- **Differentiation:** ${b.differentiation}`);
        lines.push(`- **Required sections:** ${b.requiredSections.join("; ")}`);
        lines.push(`- **Original SoftwareGlimpse value:** ${b.originalValue.join("; ")}`);
        lines.push(
          `- **Evidence needed:** ${b.evidenceNeeded.join("; ") || "—"}`,
        );
        lines.push(`- **Visuals needed:** ${b.visualsNeeded.join("; ")}`);
        lines.push(
          `- **Tools / resources:** ${b.toolsResources.join("; ") || "—"}`,
        );
        lines.push(
          `- **Internal links in:** ${b.internalLinksIn.map((x) => `\`${x}\``).join(", ") || "—"}`,
        );
        lines.push(
          `- **Internal links out:** ${b.internalLinksOut.map((x) => `\`${x}\``).join(", ") || "—"}`,
        );
        lines.push(`- **Canonical parent:** \`${b.canonicalParent}\``);
        lines.push(
          `- **Publication requirements:** ${b.publicationRequirements.join("; ")}`,
        );
      }
      lines.push("");
      lines.push("**Support network**");
      lines.push("");
      lines.push(`| Field | Value |`);
      lines.push(`| --- | --- |`);
      lines.push(`| Primary parent | \`${o.network.primaryParent}\` |`);
      lines.push(`| Primary pillar | ${o.network.primaryPillar} |`);
      lines.push(
        `| Pages linking TO it | ${o.network.linksToIt.map((x) => `\`${x}\``).join(", ") || "—"} |`,
      );
      lines.push(
        `| Pages it links TO | ${o.network.linksFromIt.map((x) => `\`${x}\``).join(", ") || "—"} |`,
      );
      lines.push(`| Buyer stage | ${o.network.buyerStage} |`);
      lines.push(`| Next step | ${o.network.nextStep} |`);
      lines.push(`| Tool | ${o.network.tool ?? "—"} |`);
      lines.push(`| Resource | ${o.network.resource ?? "—"} |`);
      lines.push(`| Entities | ${o.network.entities.join(", ") || "—"} |`);
      lines.push("");
    }
  }

  lines.push(`## RESEARCH FIRST (ranked separately)`, "");
  lines.push(
    `| ID | Priority | Title | Route | Type | Why |`,
  );
  lines.push(`| --- | --- | --- | --- | --- | --- |`);
  for (const o of researchFirst) {
    lines.push(
      `| ${o.id} | ${o.priority} | ${esc(o.title)} | \`${o.suggestedRoute}\` | ${o.type} | ${esc(o.whyNeeded).slice(0, 140)} |`,
    );
  }
  lines.push("");

  lines.push(`## Pillar support analysis`, "");
  for (const p of pillars) {
    if (!p.existing.length && !p.missingOrThin.length && !p.resources.length) {
      continue;
    }
    lines.push(`### ${p.pillar}`);
    lines.push("");
    lines.push("**Existing (sample)**");
    lines.push("");
    if (!p.existing.length) {
      lines.push("_None mapped as fully existing in this slice._", "");
    } else {
      for (const e of p.existing.slice(0, 12)) {
        lines.push(`- ${e.title} — \`${e.route}\`${e.mapId ? ` (${e.mapId})` : ""}`);
      }
      if (p.existing.length > 12) {
        lines.push(`- _…+${p.existing.length - 12} more_`);
      }
      lines.push("");
    }
    lines.push("**Missing / thin / optional**");
    lines.push("");
    if (!p.missingOrThin.length) {
      lines.push("_No missing/thin rows for this pillar in the map slice._", "");
    } else {
      for (const m of p.missingOrThin.slice(0, 20)) {
        lines.push(
          `- **${m.decision}** — ${m.title}${m.suggestedRoute ? ` (\`${m.suggestedRoute}\`)` : ""} [${m.status}]`,
        );
      }
      lines.push("");
    }
    if (p.resources.length) {
      lines.push("**Resources**");
      lines.push("");
      for (const r of p.resources.slice(0, 15)) {
        lines.push(`- [${r.status}] ${r.title} — \`${r.route}\``);
      }
      lines.push("");
    }
  }

  lines.push(`## Product cluster analysis (flagship detail)`, "");
  lines.push(
    "_Non-flagship products: do **not** auto-generate full page packs. Flagship notes below._",
    "",
  );
  for (const c of productClusters.filter((x) => x.flagship)) {
    lines.push(`### ${c.productSlug}`);
    lines.push("");
    lines.push(
      `**Existing routes (detected):** ${c.existing.map((r) => `\`${r}\``).join(", ") || "_none detected in inventory_"}`,
    );
    lines.push("");
    for (const cand of c.candidates) {
      lines.push(`- **${cand.decision}** — ${cand.title} (${cand.type}): ${cand.reason}`);
    }
    lines.push("");
  }
  const nonFlagship = productClusters.filter((x) => !x.flagship).length;
  lines.push(
    `_Also reviewed ${nonFlagship} non-flagship CRM products: default **DO NOT CREATE** product×industry permutations; keep security/integrations as hub sections._`,
    "",
  );

  lines.push(`## Industry cluster analysis`, "");
  lines.push(
    `| Industry | Hub | Hub decision | Supporting guides | Resources |`,
  );
  lines.push(`| --- | --- | --- | --- | --- |`);
  for (const ind of industryClusters) {
    const guides = ind.supportingGuides
      .map((g) => `${g.decision}: ${g.title}`)
      .join("; ");
    const res = ind.resources
      .map((r) => `${r.decision}: ${r.title}`)
      .join("; ");
    lines.push(
      `| ${ind.industrySlug} (${ind.mapPriority}) | \`${ind.hubRoute}\` | ${ind.hubDecision} | ${esc(guides)} | ${esc(res)} |`,
    );
  }
  lines.push("");

  lines.push(`## Resource opportunities`, "");
  for (const o of resources.filter((r) =>
    ["CREATE", "RESEARCH FIRST", "KEEP AS SECTION", "FUTURE"].includes(r.decision),
  )) {
    lines.push(
      `- **${o.decision}** (${o.priority}) ${o.title} — \`${o.suggestedRoute}\` — ${o.whyNeeded}`,
    );
  }
  lines.push("");

  lines.push(`## Duplicate / cannibalization report`, "");
  for (const d of duplicates) {
    lines.push(`### ${d.id}`);
    lines.push("");
    lines.push(`- **Routes:** ${d.routes.map((r) => `\`${r}\``).join(", ")}`);
    lines.push(`- **Issue:** ${d.issue}`);
    lines.push(`- **Recommendation:** ${d.recommendation}`);
    if (d.canonical) lines.push(`- **Canonical:** \`${d.canonical}\``);
    lines.push(`- **Rationale:** ${d.rationale}`);
    lines.push("");
  }

  lines.push(`## DO NOT CREATE (programmatic / thin permutations)`, "");
  for (const o of doNotCreate) {
    lines.push(
      `- **${o.title}** — \`${o.suggestedRoute}\` — ${o.whyNeeded}`,
    );
  }
  lines.push("");

  lines.push(`## MERGE / KEEP AS SECTION / FUTURE`, "");
  lines.push("### Merge into existing");
  lines.push("");
  for (const o of merge) {
    lines.push(`- ${o.title} → related: ${(o.relatedExisting ?? []).map((r) => `\`${r}\``).join(", ") || o.parent}`);
  }
  lines.push("", "### Keep as section");
  lines.push("");
  for (const o of keepSection.slice(0, 40)) {
    lines.push(`- ${o.title} (\`${o.suggestedRoute}\`)`);
  }
  if (keepSection.length > 40) {
    lines.push(`- _…+${keepSection.length - 40} more_`);
  }
  lines.push("", "### Future");
  lines.push("");
  for (const o of future) {
    lines.push(`- ${o.title} (\`${o.suggestedRoute}\`)`);
  }
  lines.push("");

  lines.push(`## Prioritization legend`, "");
  lines.push("- **P0** — foundational missing buyer journey");
  lines.push("- **P1** — strong support / commercial opportunity");
  lines.push("- **P2** — useful cluster expansion");
  lines.push("- **P3** — long-tail");
  lines.push("- Research-needed candidates are listed under **RESEARCH FIRST** and ranked separately from CREATE.");
  lines.push("");

  return `${lines.join("\n")}\n`;
}

export function writeNewContentOpportunities(markdown: string): string {
  fs.mkdirSync(path.dirname(NEW_CONTENT_OPPORTUNITIES_PATH), {
    recursive: true,
  });
  fs.writeFileSync(NEW_CONTENT_OPPORTUNITIES_PATH, markdown, "utf8");
  return NEW_CONTENT_OPPORTUNITIES_PATH;
}
