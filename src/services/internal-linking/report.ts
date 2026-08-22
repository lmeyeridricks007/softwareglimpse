import {
  getCategoryBySlug,
} from "@/data";
import {
  getGuides,
} from "@/data/repositories/guides";
import { isEntityIndexable } from "@/domain/quality-gates";
import { ALL_SHARED_TOOL_CATEGORY_SLUGS } from "@/data/config/tools/category-tool-meta";
import { factoryProductGuideKind } from "@/services/product-guides/kinds";
import { findSupportingGuides, buildGuideLinkPlan } from "./builders";
import { validateInternalLinkHealth } from "./health";
import { detectSeoOrphans } from "./orphan-detector";
import { collectCrmOutboundEdges } from "./outbound-graph";

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
  categoryHubCoverage: Array<{
    category: string;
    hub: string;
    childEdges: number;
    guideNextStepCoverage: number;
    guideParentCoverage: number;
    guideCount: number;
  }>;
  pillarSupport: Array<{
    pillar: string;
    supportingCount: number;
    supporting: string[];
  }>;
  missingNextStepSample: string[];
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
    ...ALL_SHARED_TOOL_CATEGORY_SLUGS.map((slug) => `/categories/${slug}/`),
  ];
  const hubCoverage = hubPaths.map((hub) => ({
    hub,
    childEdges: edges.filter((e) => e.from === hub).length,
  }));

  const categoryHubCoverage = ALL_SHARED_TOOL_CATEGORY_SLUGS.map((slug) => {
    const cat = getCategoryBySlug(slug);
    const hub = cat
      ? cat.seo.canonicalPath || `/categories/${slug}/`
      : `/categories/${slug}/`;
    const guides = getGuides()
      .filter((g) => g.categorySlugs.includes(slug))
      .filter((g) => isEntityIndexable({ kind: "guide", entity: g }))
      .filter((g) => !factoryProductGuideKind(g));
    let withNext = 0;
    let withParent = 0;
    for (const g of guides) {
      const plan = buildGuideLinkPlan(g);
      if (plan.recommendedNextStep.length > 0) withNext += 1;
      if (plan.parentHub.length > 0) withParent += 1;
    }
    return {
      category: slug,
      hub,
      childEdges: edges.filter((e) => e.from === hub).length,
      guideNextStepCoverage: guides.length === 0 ? 1 : withNext / guides.length,
      guideParentCoverage: guides.length === 0 ? 1 : withParent / guides.length,
      guideCount: guides.length,
    };
  });

  const pillarSupport = getGuides()
    .filter((g) => isEntityIndexable({ kind: "guide", entity: g }))
    .filter(
      (g) =>
        g.topicType === "implementation" ||
        g.topicType === "buying-guide" ||
        g.topicType === "selection",
    )
    .slice(0, 40)
    .map((pillar) => {
      const supporting = findSupportingGuides(pillar);
      return {
        pillar: `/guides/${pillar.slug}/`,
        supportingCount: supporting.length,
        supporting: supporting.slice(0, 8).map((s) => `/guides/${s.slug}/`),
      };
    });

  const missingNext: string[] = [];
  for (const g of getGuides()) {
    if (!isEntityIndexable({ kind: "guide", entity: g })) continue;
    if (factoryProductGuideKind(g)) continue;
    const plan = buildGuideLinkPlan(g);
    if (plan.recommendedNextStep.length === 0) {
      missingNext.push(`/guides/${g.slug}/`);
    }
    if (plan.parentHub.length === 0) {
      missingNext.push(`parent-missing:/guides/${g.slug}/`);
    }
  }

  const thinCategories = categoryHubCoverage
    .filter(
      (c) =>
        c.childEdges < 3 ||
        c.guideNextStepCoverage < 0.7 ||
        c.guideParentCoverage < 0.9,
    )
    .map(
      (c) =>
        `Strengthen ${c.category} hub mesh (edges=${c.childEdges}, next=${(c.guideNextStepCoverage * 100).toFixed(0)}%, parent=${(c.guideParentCoverage * 100).toFixed(0)}%, guides=${c.guideCount})`,
    );

  const recommendedAdditions = [
    ...orphans.orphans.slice(0, 15).map(
      (o) => `Add parent/hub inbound to ${o.path}`,
    ),
    ...orphans.chromeOnly.slice(0, 10).map(
      (o) => `Add contextual (non-chrome) inbound to ${o.path}`,
    ),
    ...missingNext.slice(0, 10).map((p) => `Ensure next-step/parent on ${p}`),
    ...thinCategories.slice(0, 10),
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
    categoryHubCoverage,
    pillarSupport,
    missingNextStepSample: missingNext.slice(0, 25),
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
  lines.push("## Per-category hub coverage");
  lines.push("");
  lines.push(
    "| Category | Hub child edges | Guides | Next-step % | Parent % |",
  );
  lines.push("| --- | ---: | ---: | ---: | ---: |");
  for (const row of data.categoryHubCoverage) {
    lines.push(
      `| ${row.category} | ${row.childEdges} | ${row.guideCount} | ${(row.guideNextStepCoverage * 100).toFixed(0)}% | ${(row.guideParentCoverage * 100).toFixed(0)}% |`,
    );
  }
  lines.push("");
  lines.push("## Hub coverage (outbound child edges)");
  lines.push("");
  for (const h of data.hubCoverage) {
    lines.push(`- \`${h.hub}\` → ${h.childEdges} child edges`);
  }
  lines.push("");
  lines.push("## Missing next-step / parent (sample)");
  lines.push("");
  if (data.missingNextStepSample.length === 0) {
    lines.push("_All sampled guides have parent + next-step modules._");
  } else {
    for (const p of data.missingNextStepSample) lines.push(`- \`${p}\``);
  }
  lines.push("");
  lines.push("## Pillar → supporting guides");
  lines.push("");
  for (const p of data.pillarSupport.slice(0, 20)) {
    lines.push(
      `- \`${p.pillar}\` supports **${p.supportingCount}** (${p.supporting.join(", ") || "none"})`,
    );
  }
  lines.push("");
  lines.push("## Top inbound");
  lines.push("");
  for (const row of data.topInbound.slice(0, 15)) {
    lines.push(`- \`${row.path}\` ← ${row.count}`);
  }
  lines.push("");
  lines.push("## Recommended additions");
  lines.push("");
  for (const tip of data.recommendedAdditions) lines.push(`- ${tip}`);
  lines.push("");
  lines.push("## Health issues (sample)");
  lines.push("");
  for (const issue of data.healthIssues.slice(0, 30)) {
    lines.push(
      `- **${issue.severity}** \`${issue.code}\`: ${issue.message}${issue.from ? ` (${issue.from} → ${issue.to ?? ""})` : ""}`,
    );
  }
  lines.push("");
  lines.push(
    "> Do not treat orphanCount=0 as success alone — check category hub coverage and next-step % above.",
  );
  lines.push("");
  return lines.join("\n");
}

