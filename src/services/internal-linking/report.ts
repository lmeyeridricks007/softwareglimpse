import {
  getGuides,
} from "@/data/repositories/guides";
import { isEntityIndexable } from "@/domain/quality-gates";
import { findSupportingGuides } from "./builders";
import { validateInternalLinkHealth } from "./health";
import { detectSeoOrphans } from "./orphan-detector";
import { collectCrmOutboundEdges } from "./outbound-graph";
import { flattenPlanLinks } from "./select";
import { buildGuideLinkPlan } from "./builders";

export type InternalLinkingReportData = {
  generatedAt: string;
  edgeCount: number;
  orphanCount: number;
  chromeOnlyCount: number;
  weakCount: number;
  healthErrors: number;
  healthWarnings: number;
  orphans: string[];
  chromeOnly: string[];
  weaklyLinked: string[];
  topInbound: Array<{ path: string; count: number }>;
  topOutgoing: Array<{ path: string; count: number }>;
  hubCoverage: Array<{ hub: string; childEdges: number }>;
  pillarSupport: Array<{
    pillar: string;
    supportingCount: number;
    supporting: string[];
  }>;
  healthIssues: Array<{ code: string; severity: string; message: string; to?: string; from?: string }>;
  recommendedAdditions: string[];
};

export function buildInternalLinkingReportData(): InternalLinkingReportData {
  const edges = collectCrmOutboundEdges();
  const orphans = detectSeoOrphans({ edges });
  const health = validateInternalLinkHealth();

  const topInbound = [...orphans.inboundCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([path, count]) => ({ path, count }));

  const topOutgoing = [...orphans.outgoingCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([path, count]) => ({ path, count }));

  const hubPaths = [
    "/categories/",
    "/categories/crm/",
    "/software/",
    "/guides/",
    "/use-cases/",
    "/capabilities/",
    "/features/",
    "/requirements/",
    "/resources/",
    "/compare/",
    "/best/",
    "/alternatives/",
    "/industries/",
  ];
  const hubCoverage = hubPaths.map((hub) => ({
    hub,
    childEdges: edges.filter((e) => e.from === hub).length,
  }));

  const pillarSupport = getGuides()
    .filter((g) => g.categorySlugs.includes("crm"))
    .filter((g) => isEntityIndexable({ kind: "guide", entity: g }))
    .filter(
      (g) =>
        g.topicType === "implementation" ||
        g.topicType === "buying-guide" ||
        g.topicType === "selection" ||
        g.slug === "crm-implementation" ||
        g.slug === "how-to-choose-crm",
    )
    .slice(0, 12)
    .map((pillar) => {
      const supporting = findSupportingGuides(pillar);
      return {
        pillar: `/guides/${pillar.slug}/`,
        supportingCount: supporting.length,
        supporting: supporting.slice(0, 8).map((s) => `/guides/${s.slug}/`),
      };
    });

  // Sample guide plans for missing next-step
  const missingNext: string[] = [];
  for (const g of getGuides()) {
    if (!g.categorySlugs.includes("crm")) continue;
    if (!isEntityIndexable({ kind: "guide", entity: g })) continue;
    const plan = buildGuideLinkPlan(g);
    if (plan.recommendedNextStep.length === 0) {
      missingNext.push(`/guides/${g.slug}/`);
    }
    if (plan.parentHub.length === 0) {
      missingNext.push(`parent-missing:/guides/${g.slug}/`);
    }
  }

  const recommendedAdditions = [
    ...orphans.orphans.slice(0, 15).map(
      (o) => `Add parent/hub inbound to ${o.path}`,
    ),
    ...orphans.chromeOnly.slice(0, 10).map(
      (o) => `Add contextual (non-chrome) inbound to ${o.path}`,
    ),
    ...missingNext.slice(0, 10).map((p) => `Ensure next-step/parent on ${p}`),
  ];

  return {
    generatedAt: new Date().toISOString(),
    edgeCount: edges.length,
    orphanCount: orphans.orphans.length,
    chromeOnlyCount: orphans.chromeOnly.length,
    weakCount: orphans.weaklyLinked.length,
    healthErrors: health.filter((h) => h.severity === "error").length,
    healthWarnings: health.filter((h) => h.severity === "warning").length,
    orphans: orphans.orphans.map((o) => o.path),
    chromeOnly: orphans.chromeOnly.map((o) => o.path),
    weaklyLinked: orphans.weaklyLinked.map((o) => o.path),
    topInbound,
    topOutgoing,
    hubCoverage,
    pillarSupport,
    healthIssues: health.slice(0, 80).map((h) => ({
      code: h.code,
      severity: h.severity,
      message: h.message,
      to: h.to,
      from: h.from,
    })),
    recommendedAdditions,
  };
}

export function formatInternalLinkingReportMarkdown(
  data: InternalLinkingReportData = buildInternalLinkingReportData(),
): string {
  const lines: string[] = [];
  lines.push("# Internal Linking Report");
  lines.push("");
  lines.push(`**Generated:** ${data.generatedAt}`);
  lines.push(`**Scope:** Full catalogue graph modules + hub discovery edges`);
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`| Metric | Count |`);
  lines.push(`| --- | ---: |`);
  lines.push(`| Outbound edges | ${data.edgeCount} |`);
  lines.push(`| Orphans (0 inbound) | ${data.orphanCount} |`);
  lines.push(`| Chrome-only inbound | ${data.chromeOnlyCount} |`);
  lines.push(`| Weak parent / sparse | ${data.weakCount} |`);
  lines.push(`| Health errors | ${data.healthErrors} |`);
  lines.push(`| Health warnings | ${data.healthWarnings} |`);
  lines.push("");
  lines.push("## Orphan pages (indexable, zero inbound)");
  lines.push("");
  if (data.orphans.length === 0) {
    lines.push("_None detected in the catalogue graph._");
  } else {
    for (const p of data.orphans) lines.push(`- \`${p}\``);
  }
  lines.push("");
  lines.push("## Chrome-only inbound (footer/nav only)");
  lines.push("");
  if (data.chromeOnly.length === 0) {
    lines.push("_None._");
  } else {
    for (const p of data.chromeOnly) lines.push(`- \`${p}\``);
  }
  lines.push("");
  lines.push("## Weakly linked (missing parent / sparse content inbound)");
  lines.push("");
  if (data.weaklyLinked.length === 0) {
    lines.push("_None._");
  } else {
    for (const p of data.weaklyLinked.slice(0, 40)) lines.push(`- \`${p}\``);
  }
  lines.push("");
  lines.push("## Hub coverage (child edges from hub)");
  lines.push("");
  lines.push("| Hub | Child edges |");
  lines.push("| --- | ---: |");
  for (const h of data.hubCoverage) {
    lines.push(`| \`${h.hub}\` | ${h.childEdges} |`);
  }
  lines.push("");
  lines.push("## Pillar → supporting guides");
  lines.push("");
  for (const p of data.pillarSupport) {
    lines.push(`### \`${p.pillar}\` (${p.supportingCount})`);
    if (p.supporting.length === 0) lines.push("- _(no supporting guides resolved)_");
    else for (const s of p.supporting) lines.push(`- \`${s}\``);
    lines.push("");
  }
  lines.push("## Top inbound targets");
  lines.push("");
  for (const row of data.topInbound.slice(0, 15)) {
    lines.push(`- \`${row.path}\` — ${row.count}`);
  }
  lines.push("");
  lines.push("## Top outgoing sources");
  lines.push("");
  for (const row of data.topOutgoing.slice(0, 15)) {
    lines.push(`- \`${row.path}\` — ${row.count}`);
  }
  lines.push("");
  lines.push("## Health issues (sample)");
  lines.push("");
  if (data.healthIssues.length === 0) {
    lines.push("_No issues._");
  } else {
    for (const issue of data.healthIssues.slice(0, 40)) {
      lines.push(
        `- **${issue.severity}** \`${issue.code}\`${issue.from ? ` from \`${issue.from}\`` : ""}${issue.to ? ` → \`${issue.to}\`` : ""} — ${issue.message}`,
      );
    }
  }
  lines.push("");
  lines.push("## Recommended additions");
  lines.push("");
  for (const r of data.recommendedAdditions) lines.push(`- ${r}`);
  lines.push("");
  lines.push("## Notes");
  lines.push("");
  lines.push(
    "- Detector uses the **link relationship engine** + hub discovery, not a live HTML crawl.",
  );
  lines.push(
    "- Primary related modules only emit **indexable** canonical targets (no drafts, `/go/`, aliases, or soft-noindex).",
  );
  lines.push(
    "- Affiliate status is never used in ranking.",
  );
  lines.push("");
  lines.push("*End of internal linking report.*");
  lines.push("");
  return lines.join("\n");
}

// silence unused in case tree-shaken
void flattenPlanLinks;
