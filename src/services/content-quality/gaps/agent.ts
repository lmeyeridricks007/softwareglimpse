import fs from "node:fs";
import path from "node:path";
import { analyzeContentGaps } from "./analyze";
import {
  formatNewContentOpportunitiesMarkdown,
  writeNewContentOpportunities,
} from "./report";

export const CONTENT_GAP_OPPORTUNITY_AGENT = {
  id: "content-gap-opportunity-agent",
  label: "ContentGapOpportunityAgent",
  version: "1.0.0",
} as const;

function noteForPath(relPaths: string[], missingLabel: string): string {
  for (const rel of relPaths) {
    const p = path.join(process.cwd(), rel);
    if (fs.existsSync(p)) {
      return `available (\`${rel}\`)`;
    }
  }
  return missingLabel;
}

export type GapAgentRunOptions = {
  write?: boolean;
  evaluatedAt?: string;
};

/**
 * ContentGapOpportunityAgent
 *
 * Finds missing supporting content, incomplete clusters, resource gaps,
 * and what should NOT be created. Never creates or mutates content.
 */
export function runContentGapOpportunityAgent(
  opts: GapAgentRunOptions = {},
): {
  agent: typeof CONTENT_GAP_OPPORTUNITY_AGENT;
  generatedAt: string;
  reportPath?: string;
  markdown: string;
  summary: {
    total: number;
    create: number;
    researchFirst: number;
    merge: number;
    keepAsSection: number;
    doNotCreate: number;
    future: number;
    resources: number;
    productGuides: number;
    industryGuides: number;
    supporting: number;
    top50: Array<{
      id: string;
      title: string;
      priority: string;
      decision: string;
      type: string;
    }>;
    coverageNote: string;
    qualityNote: string;
    backlogNote: string;
    documentPath: string;
  };
} {
  const generatedAt = opts.evaluatedAt ?? new Date().toISOString();
  const analysis = analyzeContentGaps();

  const qualityNote = noteForPath(
    ["docs/content-quality/CONTENT-QUALITY-LATEST.md"],
    "not found",
  );
  const backlogNote = noteForPath(
    ["docs/content-quality/CONTENT-IMPROVEMENT-BACKLOG.md"],
    "not found",
  );
  const coverageNote = noteForPath(
    [
      "docs/seo/reports/content-coverage-latest.md",
      "docs/seo/content-coverage-latest.md",
    ],
    "not found (`docs/seo/reports/content-coverage-latest.md` missing — gaps use content-map + quality inventory)",
  );

  const markdown = formatNewContentOpportunitiesMarkdown({
    generatedAt,
    analysis,
    coverageNote,
    qualityNote,
    backlogNote,
  });

  let reportPath: string | undefined;
  if (opts.write !== false) {
    reportPath = writeNewContentOpportunities(markdown);
  }

  const { opportunities, counts } = analysis;
  const resources = opportunities.filter((o) =>
    /CHECKLIST|TEMPLATE|WORKSHEET|SCORECARD|TOOL/.test(o.type),
  ).length;
  const productGuides = opportunities.filter((o) =>
    /PRODUCT GUIDE|PRODUCT HOW-TO|PRODUCT ×/.test(o.type),
  ).length;
  const industryGuides = opportunities.filter(
    (o) => o.type === "INDUSTRY GUIDE",
  ).length;
  const supporting = opportunities.filter((o) =>
    /SUPPORTING ARTICLE|IMPLEMENTATION|MIGRATION|CAPABILITY|REQUIREMENT|FEATURE|USE-CASE|PILLAR|RESEARCH/.test(
      o.type,
    ),
  ).length;

  const preferred = opportunities.filter((o) =>
    ["CREATE", "RESEARCH FIRST", "MERGE INTO EXISTING"].includes(o.decision),
  );
  const rest = opportunities.filter(
    (o) =>
      !["CREATE", "RESEARCH FIRST", "MERGE INTO EXISTING"].includes(o.decision),
  );
  const top50 = [...preferred, ...rest].slice(0, 50).map((o) => ({
    id: o.id,
    title: o.title,
    priority: o.priority,
    decision: o.decision,
    type: o.type,
  }));

  return {
    agent: CONTENT_GAP_OPPORTUNITY_AGENT,
    generatedAt,
    reportPath,
    markdown,
    summary: {
      total: opportunities.length,
      create: counts.CREATE,
      researchFirst: counts["RESEARCH FIRST"],
      merge: counts["MERGE INTO EXISTING"],
      keepAsSection: counts["KEEP AS SECTION"],
      doNotCreate: counts["DO NOT CREATE"],
      future: counts.FUTURE,
      resources,
      productGuides,
      industryGuides,
      supporting,
      top50,
      coverageNote,
      qualityNote,
      backlogNote,
      documentPath: "docs/content-quality/NEW-CONTENT-OPPORTUNITIES.md",
    },
  };
}
