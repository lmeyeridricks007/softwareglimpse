import fs from "node:fs";
import path from "node:path";
import { runContentQualityAudit } from "../audit-engine";
import { generateImprovementOpportunities } from "./generate";
import {
  formatImprovementBacklogMarkdown,
  writeImprovementBacklog,
} from "./report";

export const CONTENT_IMPROVEMENT_AGENT = {
  id: "content-improvement-opportunity-agent",
  label: "ContentImprovementOpportunityAgent",
  version: "1.0.0",
} as const;

function resolveSeoNote(): string {
  const candidates = [
    path.join(process.cwd(), "docs/seo/reports/SEO-HEALTH-LATEST.md"),
    path.join(process.cwd(), "docs/seo/SEO-HEALTH-LATEST.md"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return `available (\`${path.relative(process.cwd(), p)}\`)`;
    }
  }
  return "not found (`docs/seo/reports/SEO-HEALTH-LATEST.md` missing — backlog uses quality + content-map only)";
}

export type ImprovementBacklogRunOptions = {
  write?: boolean;
  scope?: "crm";
  evaluatedAt?: string;
};

/**
 * ContentImprovementOpportunityAgent
 * Translates quality audit findings + content map into a prioritized backlog.
 * Does not change content.
 */
export function runContentImprovementOpportunityAgent(
  opts: ImprovementBacklogRunOptions = {},
): {
  agent: typeof CONTENT_IMPROVEMENT_AGENT;
  generatedAt: string;
  backlogPath?: string;
  markdown: string;
  summary: {
    total: number;
    quickWins: number;
    majorProjects: number;
    researchDependent: number;
    systemic: number;
    byFixClass: Record<string, number>;
    top20: Array<{
      id: string;
      route: string;
      priority: string;
      score: number;
      types: string[];
    }>;
    patterns: Array<{ id: string; label: string; count: number }>;
    seoNote: string;
  };
} {
  const generatedAt = opts.evaluatedAt ?? new Date().toISOString();
  const audit = runContentQualityAudit({
    scope: opts.scope ?? "crm",
    writeReports: false,
    writeMaster: false,
    evaluatedAt: generatedAt,
  });

  const { opportunities, patterns } = generateImprovementOpportunities(
    audit.results,
  );
  const seoNote = resolveSeoNote();
  const markdown = formatImprovementBacklogMarkdown({
    generatedAt,
    opportunities,
    patterns,
    seoNote,
  });

  let backlogPath: string | undefined;
  if (opts.write !== false) {
    backlogPath = writeImprovementBacklog(markdown);
  }

  const byFixClass: Record<string, number> = {};
  for (const o of opportunities) {
    byFixClass[o.fixClass] = (byFixClass[o.fixClass] ?? 0) + 1;
  }

  return {
    agent: CONTENT_IMPROVEMENT_AGENT,
    generatedAt,
    backlogPath,
    markdown,
    summary: {
      total: opportunities.length,
      quickWins: opportunities.filter((o) => o.quickWin).length,
      majorProjects: opportunities.filter((o) => o.majorProject).length,
      researchDependent: opportunities.filter((o) => o.researchRequired).length,
      systemic: opportunities.filter((o) => o.systemic).length,
      byFixClass,
      top20: opportunities.slice(0, 20).map((o) => ({
        id: o.id,
        route: o.route,
        priority: o.priority,
        score: o.currentScore,
        types: o.types,
      })),
      patterns: patterns.map((p) => ({
        id: p.id,
        label: p.label,
        count: p.count,
      })),
      seoNote,
    },
  };
}
