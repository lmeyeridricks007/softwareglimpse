import type { AuditPageResult } from "../audit-report";
import type { ImprovementOpportunity, SystemicPattern } from "../improvement/types";
import type { NewContentOpportunity, DuplicateCannibalizationFinding } from "../gaps/types";
import type { ScoreChange } from "./diff";
import { summarizeChanges } from "./diff";
import type { IntegrityFinding } from "./integrity";
import { stableActionId } from "./stable-ids";

function esc(s: string): string {
  return s.replace(/\|/g, "/").replace(/\n/g, " ").trim();
}

function avgBy(
  results: AuditPageResult[],
  keyFn: (r: AuditPageResult) => string,
): Array<{ key: string; n: number; avg: number }> {
  const map = new Map<string, number[]>();
  for (const r of results) {
    const k = keyFn(r);
    if (!map.has(k)) map.set(k, []);
    map.get(k)!.push(r.assessment.overallScore);
  }
  return [...map.entries()]
    .map(([key, scores]) => ({
      key,
      n: scores.length,
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    }))
    .sort((a, b) => a.avg - b.avg);
}

function clusterFor(r: AuditPageResult): string {
  const route = r.assessment.route;
  const t = r.assessment.pageType;
  if (t === "industry") return "Industries";
  if (t === "use-case") return "Use Cases";
  if (t === "capability") return "Capabilities";
  if (t === "requirement") return "Requirements";
  if (t === "feature") return "Features";
  if (t === "resource") return "Resources";
  if (t === "product-review") return "Products";
  if (t === "comparison") return "Compare";
  if (t === "best") return "Choose";
  if (t === "product-guide" || t === "implementation-guide") return "Product guides";
  if (/\/guides\/crm-(implementation|data-migration|go-live|training|adoption)/.test(route)) {
    return "Implementation";
  }
  if (/\/guides\/(how-to-choose|crm-evaluation|crm-requirements|crm-pricing|crm-roi)/.test(route)) {
    return "Choose";
  }
  if (/\/guides\/(what-is-crm|how-crm|types-of-crm|do-i-need|crm-vs-)/.test(route)) {
    return "Learn";
  }
  if (route.startsWith("/tools/")) return "Tools";
  return t;
}

export type MasterReportInput = {
  generatedAt: string;
  mode: "FAST" | "FULL";
  scope: string;
  results: AuditPageResult[];
  improvements: ImprovementOpportunity[];
  patterns: SystemicPattern[];
  gaps: NewContentOpportunity[];
  duplicates: DuplicateCannibalizationFinding[];
  changes: ScoreChange[];
  integrity: IntegrityFinding[];
  clusterCoverage: Array<{
    label: string;
    existingCore: number;
    targetCore: number;
    missing: string[];
  }>;
  mapCoverage: {
    total: number;
    missing: number;
    thin: number;
    optional: number;
  };
  linkGaps: Array<{ route: string; note: string }>;
  previousGeneratedAt?: string;
};

export function formatContentIntelligenceMarkdown(
  input: MasterReportInput,
): string {
  const {
    generatedAt,
    mode,
    scope,
    results,
    improvements,
    patterns,
    gaps,
    duplicates,
    changes,
    integrity,
    clusterCoverage,
    mapCoverage,
    linkGaps,
  } = input;

  const avg =
    results.length === 0
      ? 0
      : Math.round(
          (results.reduce((a, r) => a + r.assessment.overallScore, 0) /
            results.length) *
            10,
        ) / 10;

  const bands: Record<string, number> = {
    excellent: 0,
    strong: 0,
    "good-but-improvable": 0,
    weak: 0,
    poor: 0,
    "critical-incomplete": 0,
  };
  for (const r of results) {
    const b = String(r.assessment.qualityBand);
    if (b in bands) bands[b] += 1;
  }

  const changeSummary = summarizeChanges(changes);
  const byType = avgBy(results, (r) => r.assessment.pageType);
  const byCluster = avgBy(results, clusterFor);

  const weakestImportant = [...results]
    .filter(
      (r) =>
        r.pageImportance === "pillar" ||
        r.pageImportance === "high-commercial" ||
        r.improvementPriority === "CQ-P0" ||
        r.improvementPriority === "CQ-P1",
    )
    .sort((a, b) => a.assessment.overallScore - b.assessment.overallScore)
    .slice(0, 20);

  const topImprove = improvements.slice(0, 20);
  const topGaps = gaps
    .filter((g) =>
      ["CREATE", "RESEARCH FIRST", "MERGE INTO EXISTING"].includes(g.decision),
    )
    .slice(0, 20);

  const weakCount =
    bands.weak + bands.poor + bands["critical-incomplete"];
  const topOpp = topImprove[0];
  const leverageLine = (() => {
    if (weakCount > 0) {
      return `Highest leverage: fix ${weakCount} weak/poor page(s) before expanding URL inventory.`;
    }
    if (topOpp) {
      return `Highest leverage: ${topOpp.priority} on \`${topOpp.route}\` (${topOpp.types.slice(0, 2).join(", ") || "improve"}) — then mapped decision tools only.`;
    }
    return `Highest leverage: fill mapped decision-tool gaps; avoid mass new URLs without research.`;
  })();

  const researchGaps = [
    ...improvements.filter((o) => o.researchRequired).slice(0, 15),
    ...gaps.filter((g) => g.decision === "RESEARCH FIRST").slice(0, 15),
  ];
  const evidenceGaps = improvements
    .filter(
      (o) =>
        o.types.includes("ADD EVIDENCE") ||
        o.types.includes("REFRESH RESEARCH") ||
        o.fixClass === "DATA/RESEARCH FIX",
    )
    .slice(0, 20);
  const visualGaps = improvements
    .filter(
      (o) =>
        o.types.includes("ADD VISUAL") ||
        o.types.includes("ADD SCREENSHOT") ||
        o.types.includes("ADD VIDEO") ||
        o.visualMediaNeeded.length > 0,
    )
    .slice(0, 15);
  const toolGaps = [
    ...improvements.filter((o) => o.toolIntegration.length > 0 || o.types.includes("ADD TOOL CTA")).slice(0, 10),
    ...gaps.filter((g) => g.type === "TOOL").slice(0, 10),
  ];
  const resourceGaps = [
    ...improvements.filter((o) => o.types.includes("ADD RESOURCE") || o.types.includes("ADD CHECKLIST")).slice(0, 10),
    ...gaps.filter((g) =>
      /CHECKLIST|TEMPLATE|WORKSHEET|SCORECARD/.test(g.type),
    ),
  ];
  const linkImprove = improvements
    .filter(
      (o) =>
        o.types.includes("ADD INTERNAL LINKS") ||
        o.types.includes("IMPROVE NEXT STEP") ||
        o.fixClass === "LINK GRAPH FIX",
    )
    .slice(0, 20);

  const actions: Array<{
    id: string;
    action: string;
    priority: string;
    target: string;
    note: string;
  }> = [];

  for (const o of improvements.slice(0, 12)) {
    actions.push({
      id: stableActionId(
        o.researchRequired ? "RESEARCH" : "IMPROVE",
        o.route,
        o.id,
      ),
      action: o.researchRequired ? "RESEARCH" : "IMPROVE",
      priority: o.priority,
      target: o.route,
      note: o.recommendedChange.slice(0, 120),
    });
  }
  for (const g of gaps.filter((x) => x.decision === "CREATE").slice(0, 6)) {
    actions.push({
      id: stableActionId("CREATE", g.suggestedRoute, g.id),
      action: g.type === "TOOL" ? "CREATE" : /CHECKLIST|WORKSHEET|TEMPLATE/.test(g.type) ? "ADD RESOURCE" : "CREATE",
      priority: g.priority,
      target: g.suggestedRoute,
      note: g.whyNeeded.slice(0, 120),
    });
  }
  for (const d of duplicates.slice(0, 3)) {
    actions.push({
      id: stableActionId("MERGE", d.routes[0] ?? d.id, d.id),
      action: "MERGE",
      priority: "P0",
      target: d.routes.join(" → "),
      note: d.rationale.slice(0, 120),
    });
  }
  for (const g of gaps.filter((x) => x.decision === "DO NOT CREATE").slice(0, 3)) {
    actions.push({
      id: stableActionId("BLOCK", g.suggestedRoute, g.id),
      action: "BLOCK",
      priority: "P3",
      target: g.title,
      note: "Do not generate — " + g.whyNeeded.slice(0, 80),
    });
  }

  const lines: string[] = [
    `# SoftwareGlimpse Content Intelligence`,
    "",
    `Generated: ${generatedAt}`,
    `Orchestrator: **ContentIntelligenceOrchestrator**`,
    `Mode: **${mode}** · Scope: **${scope}**`,
    `Pages audited: **${results.length}** · Avg score: **${avg}**`,
    "",
    "> Evaluation / recommendation only — does **not** create, rewrite, or publish content.",
    "> Workflow: AUDIT → RECOMMEND → HUMAN SELECTS → SEPARATE IMPROVEMENT/CREATION PROMPT → RE-AUDIT",
    "",
    `## Executive summary`,
    "",
    `- Overall health: **${avg}/100** across ${results.length} pages (${mode} mode).`,
    `- Weak / poor pages: **${bands.weak + bands.poor + bands["critical-incomplete"]}**; needs improvement: **${bands["good-but-improvable"]}**; strong+: **${bands.strong + bands.excellent}**.`,
    `- Improvement opportunities: **${improvements.length}**; new-content candidates: **${gaps.length}**.`,
    `- Change vs previous: NEW ${changeSummary["NEW ISSUES"]} · RESOLVED ${changeSummary.RESOLVED} · IMPROVED ${changeSummary.IMPROVED} · REGRESSED ${changeSummary.REGRESSED} · UNCHANGED ${changeSummary.UNCHANGED}.`,
    `- Integrity critical findings: **${integrity.filter((i) => i.severity === "critical").length}** (subjective quality never fails CI).`,
    `- ${leverageLine}`,
    "",
    `## Overall content health`,
    "",
    `| Metric | Value |`,
    `| --- | ---: |`,
    `| Pages audited | ${results.length} |`,
    `| Average score | ${avg} |`,
    `| Excellent | ${bands.excellent} |`,
    `| Strong | ${bands.strong} |`,
    `| Needs improvement | ${bands["good-but-improvable"]} |`,
    `| Weak / Poor | ${bands.weak + bands.poor} |`,
    `| Critical | ${bands["critical-incomplete"]} |`,
    `| Map rows (missing / thin / optional) | ${mapCoverage.missing} / ${mapCoverage.thin} / ${mapCoverage.optional} of ${mapCoverage.total} |`,
    "",
    `## Change tracking`,
    "",
  ];

  if (!input.previousGeneratedAt) {
    lines.push("_No previous score snapshot — baseline established this run._", "");
  } else {
    lines.push(`Compared to snapshot from \`${input.previousGeneratedAt}\`.`, "");
    lines.push(`| Kind | Count |`);
    lines.push(`| --- | ---: |`);
    for (const k of [
      "NEW ISSUES",
      "RESOLVED",
      "IMPROVED",
      "REGRESSED",
      "UNCHANGED",
    ] as const) {
      lines.push(`| ${k} | ${changeSummary[k]} |`);
    }
    lines.push("");
    const notable = changes.filter((c) =>
      ["IMPROVED", "REGRESSED", "NEW ISSUES", "RESOLVED"].includes(c.kind),
    ).slice(0, 40);
    if (notable.length) {
      lines.push(`| Route | Change | Scores |`);
      lines.push(`| --- | --- | --- |`);
      for (const c of notable) {
        const scores =
          c.previousScore != null && c.currentScore != null
            ? `${c.previousScore} → ${c.currentScore}`
            : c.currentScore != null
              ? `— → ${c.currentScore}`
              : `${c.previousScore} → —`;
        lines.push(`| \`${c.route}\` | ${c.kind} | ${scores} |`);
      }
      lines.push("");
    }
  }

  lines.push(`## Quality by page type`, "");
  lines.push(`| Page type | Pages | Avg score |`);
  lines.push(`| --- | ---: | ---: |`);
  for (const row of byType) {
    lines.push(`| ${row.key} | ${row.n} | ${row.avg} |`);
  }
  lines.push("");

  lines.push(`## Quality by CRM cluster`, "");
  lines.push(`| Cluster | Pages | Avg score |`);
  lines.push(`| --- | ---: | ---: |`);
  for (const row of byCluster) {
    lines.push(`| ${row.key} | ${row.n} | ${row.avg} |`);
  }
  lines.push("");
  if (clusterCoverage.length) {
    lines.push(`### Supporting-cluster coverage (content-clusters)`, "");
    for (const c of clusterCoverage) {
      lines.push(
        `- **${c.label}:** ${c.existingCore}/${c.targetCore} core` +
          (c.missing.length ? ` — missing: ${c.missing.join(", ")}` : ""),
      );
    }
    lines.push("");
  }

  lines.push(`## Top 20 weakest important pages`, "");
  lines.push(`| # | Route | Type | Score | Band | Priority | Importance |`);
  lines.push(`| --- | --- | --- | ---: | --- | --- | --- |`);
  weakestImportant.forEach((r, i) => {
    lines.push(
      `| ${i + 1} | \`${r.assessment.route}\` | ${r.assessment.pageType} | ${r.assessment.overallScore} | ${r.assessment.qualityBand} | ${r.improvementPriority} | ${r.pageImportance} |`,
    );
  });
  lines.push("");

  lines.push(`## Top 20 improvement opportunities`, "");
  lines.push(`| # | ID | Priority | Route | Types | Score | Change |`);
  lines.push(`| --- | --- | --- | --- | --- | ---: | --- |`);
  topImprove.forEach((o, i) => {
    lines.push(
      `| ${i + 1} | \`${o.id}\` | ${o.priority} | \`${o.route}\` | ${o.types[0]} | ${o.currentScore} | ${esc(o.recommendedChange).slice(0, 100)} |`,
    );
  });
  lines.push("");

  lines.push(`## Top 20 new content opportunities`, "");
  lines.push(`| # | ID | Decision | Priority | Title | Type | Why |`);
  lines.push(`| --- | --- | --- | --- | --- | --- | --- |`);
  topGaps.forEach((g, i) => {
    lines.push(
      `| ${i + 1} | \`${g.id}\` | ${g.decision} | ${g.priority} | ${esc(g.title)} | ${g.type} | ${esc(g.whyNeeded).slice(0, 90)} |`,
    );
  });
  lines.push("");

  lines.push(`## Research gaps`, "");
  for (const item of researchGaps.slice(0, 25)) {
    if ("route" in item && "recommendedChange" in item) {
      const o = item as ImprovementOpportunity;
      lines.push(`- \`${o.id}\` \`${o.route}\` — ${esc(o.recommendedChange).slice(0, 120)}`);
    } else {
      const g = item as NewContentOpportunity;
      lines.push(`- \`${g.id}\` ${g.title} — ${esc(g.whyNeeded).slice(0, 120)}`);
    }
  }
  lines.push("");

  lines.push(`## Evidence gaps`, "");
  for (const o of evidenceGaps) {
    lines.push(`- \`${o.id}\` \`${o.route}\` — ${esc(o.problem).slice(0, 120)}`);
  }
  lines.push("");

  lines.push(`## Visual/media gaps`, "");
  if (!visualGaps.length) {
    lines.push("_No high-priority visual/media opportunities in this run slice._", "");
  } else {
    for (const o of visualGaps) {
      lines.push(
        `- \`${o.id}\` \`${o.route}\` — ${(o.visualMediaNeeded.join("; ") || o.types.join(", ")).slice(0, 120)}`,
      );
    }
    lines.push("");
  }

  lines.push(`## Tool integration gaps`, "");
  for (const item of toolGaps.slice(0, 20)) {
    if ("toolIntegration" in item) {
      const o = item as ImprovementOpportunity;
      lines.push(
        `- \`${o.id}\` \`${o.route}\` — ${(o.toolIntegration.join("; ") || "Add tool CTA").slice(0, 120)}`,
      );
    } else {
      const g = item as NewContentOpportunity;
      lines.push(`- \`${g.id}\` **${g.decision}** ${g.title} (\`${g.suggestedRoute}\`)`);
    }
  }
  lines.push("");

  lines.push(`## Resource/checklist opportunities`, "");
  for (const item of resourceGaps.slice(0, 20)) {
    if ("resourceIntegration" in item) {
      const o = item as ImprovementOpportunity;
      lines.push(`- \`${o.id}\` \`${o.route}\` — ${esc(o.recommendedChange).slice(0, 120)}`);
    } else {
      const g = item as NewContentOpportunity;
      lines.push(`- \`${g.id}\` **${g.decision}** ${g.title} (\`${g.suggestedRoute}\`)`);
    }
  }
  lines.push("");

  lines.push(`## Internal-link gaps`, "");
  for (const o of linkImprove) {
    lines.push(`- \`${o.id}\` \`${o.route}\` — ${esc(o.recommendedChange).slice(0, 120)}`);
  }
  for (const l of linkGaps.slice(0, 15)) {
    lines.push(`- \`${l.route}\` — ${esc(l.note)}`);
  }
  lines.push("");

  lines.push(`## Cannibalization / consolidation opportunities`, "");
  for (const d of duplicates) {
    lines.push(`### ${d.id}`);
    lines.push("");
    lines.push(`- **Routes:** ${d.routes.map((r) => `\`${r}\``).join(", ")}`);
    lines.push(`- **Recommendation:** ${d.recommendation}`);
    if (d.canonical) lines.push(`- **Canonical:** \`${d.canonical}\``);
    lines.push(`- **Rationale:** ${d.rationale}`);
    lines.push("");
  }
  for (const g of gaps.filter((x) => x.decision === "DO NOT CREATE" || x.decision === "MERGE INTO EXISTING")) {
    lines.push(`- \`${g.id}\` **${g.decision}** — ${g.title}: ${esc(g.whyNeeded).slice(0, 120)}`);
  }
  lines.push("");

  lines.push(`## Systemic template problems`, "");
  if (!patterns.length) {
    lines.push("_No systemic patterns with ≥3 hits._", "");
  } else {
    for (const p of patterns) {
      lines.push(`### ${p.id} — ${p.label}`);
      lines.push("");
      lines.push(`- **Count:** ${p.count}`);
      lines.push(`- **Fix class:** ${p.suggestedFixClass}`);
      lines.push(`- **Recommendation:** ${p.recommendation}`);
      lines.push(`- **Samples:** ${p.sampleRoutes.map((r) => `\`${r}\``).join(", ")}`);
      lines.push("");
    }
  }

  lines.push(`## Content integrity (deterministic)`, "");
  if (!integrity.length) {
    lines.push("_No deterministic integrity failures detected._", "");
  } else {
    for (const i of integrity) {
      lines.push(
        `- **${i.severity.toUpperCase()}** \`${i.id}\` \`${i.route}\` — ${i.issue}`,
      );
    }
    lines.push("");
  }

  lines.push(`## Next 25 recommended actions`, "");
  lines.push(`| # | ID | Action | Priority | Target | Notes |`);
  lines.push(`| --- | --- | --- | --- | --- | --- |`);
  actions.slice(0, 25).forEach((a, i) => {
    lines.push(
      `| ${i + 1} | \`${a.id}\` | ${a.action} | ${a.priority} | \`${esc(a.target)}\` | ${esc(a.note)} |`,
    );
  });
  lines.push("");
  lines.push(`## How to action`);
  lines.push("");
  lines.push("1. Human selects an action ID from this report or child reports.");
  lines.push("2. Run a **separate** content improvement / creation prompt (never auto-publish from this orchestrator).");
  lines.push("3. Re-run `npm run content:intelligence` (or FAST weekly) to verify IMPROVED / RESOLVED.");
  lines.push("");
  lines.push(`## Related outputs`);
  lines.push("");
  lines.push("- `docs/content-quality/CONTENT-QUALITY-LATEST.md`");
  lines.push("- `docs/content-quality/CONTENT-IMPROVEMENT-BACKLOG.md`");
  lines.push("- `docs/content-quality/NEW-CONTENT-OPPORTUNITIES.md`");
  lines.push("- `docs/content-quality/CONTENT-MAP-COVERAGE-LATEST.md`");
  lines.push("- Archive: `docs/content-quality/archive/YYYY-MM-DD-content-intelligence.md`");
  lines.push("");

  return `${lines.join("\n")}\n`;
}

export function formatMapCoverageMarkdown(input: {
  generatedAt: string;
  mapCoverage: MasterReportInput["mapCoverage"];
  missingRows: Array<{ id: string; title: string; priority: string; status: string }>;
  thinRows: Array<{ id: string; title: string; priority: string; route?: string }>;
}): string {
  const lines = [
    `# Content Map Coverage`,
    "",
    `Generated: ${input.generatedAt}`,
    `Agent: ContentIntelligenceOrchestrator (map inspect — no content mutation)`,
    "",
    `| Metric | Count |`,
    `| --- | ---: |`,
    `| Total map rows | ${input.mapCoverage.total} |`,
    `| Missing / NOT-YET | ${input.mapCoverage.missing} |`,
    `| Thin / research | ${input.mapCoverage.thin} |`,
    `| Optional | ${input.mapCoverage.optional} |`,
    "",
    `## Missing / not-yet-implemented`,
    "",
  ];
  for (const r of input.missingRows.slice(0, 40)) {
    lines.push(`- \`${r.id}\` (${r.priority}) ${r.title} — ${r.status}`);
  }
  lines.push("", `## Thin / research-required`, "");
  for (const r of input.thinRows.slice(0, 40)) {
    lines.push(
      `- \`${r.id}\` (${r.priority}) ${r.title}${r.route ? ` — \`${r.route}\`` : ""}`,
    );
  }
  lines.push("");
  lines.push(
    "_Optional master-map merge remains a human/docs step (`04-crm-master-content-map.md`). This file is the generated coverage report only._",
    "",
  );
  return `${lines.join("\n")}\n`;
}
