import type { ContentQualityPageType } from "@/domain/schemas/content-quality";
import { runContentQualityAgent } from "./agents";
import {
  type AuditPageResult,
  writeMasterInventory,
  writePageAuditReport,
} from "./audit-report";
import {
  loadAuditSnapshots,
  type AuditScopeFilter,
} from "./loaders/inventory";
import {
  assignImprovementPriority,
  classifyJourneyImportance,
  classifyPageImportance,
} from "./priority";

export type ContentAuditRunOptions = {
  scope?: AuditScopeFilter;
  writeReports?: boolean;
  writeMaster?: boolean;
  evaluatedAt?: string;
  pageTypes?: ContentQualityPageType[];
  limit?: number;
  /** FAST: pillars + high-commercial + industries + best + flagship reviews */
  mode?: "FAST" | "FULL";
};

export type ContentAuditRunResult = {
  evaluatedAt: string;
  scope: AuditScopeFilter;
  results: AuditPageResult[];
  masterPath?: string;
  summary: {
    pagesEvaluated: number;
    averageScore: number;
    byPriority: Record<string, number>;
    byPageTypeAvg: Record<string, number>;
    strongest: Array<{ route: string; score: number }>;
    weakest: Array<{ route: string; score: number }>;
    commonGaps: Array<{ gap: string; count: number }>;
    commonEvidenceProblems: Array<{ gap: string; count: number }>;
    commonLinkingProblems: Array<{ gap: string; count: number }>;
  };
};

function topCounts(items: string[], limit = 12): Array<{ gap: string; count: number }> {
  const map = new Map<string, number>();
  for (const i of items) {
    const key = i.slice(0, 140);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([gap, count]) => ({ gap, count }));
}

/**
 * Run Content Quality Audit Agents across inventory.
 * Writes local Markdown reports only — never rewrites pages.
 */
export function runContentQualityAudit(
  opts: ContentAuditRunOptions = {},
): ContentAuditRunResult {
  const scope = opts.scope ?? "crm";
  const evaluatedAt = opts.evaluatedAt ?? new Date().toISOString();
  let loaded = loadAuditSnapshots(scope);

  if (opts.pageTypes?.length) {
    const set = new Set(opts.pageTypes);
    loaded = loaded.filter((x) => set.has(x.snapshot.pageType));
  }

  if (opts.mode === "FAST") {
    loaded = loaded.filter((x) => {
      const route = x.snapshot.route.endsWith("/")
        ? x.snapshot.route
        : `${x.snapshot.route}/`;
      const importance = classifyPageImportance(route, x.snapshot.pageType);
      if (importance === "pillar" || importance === "high-commercial") {
        return true;
      }
      // Always include industry shells + requirements/features with known systemic issues
      if (
        x.snapshot.pageType === "industry" ||
        x.snapshot.pageType === "best" ||
        x.snapshot.pageType === "use-case" ||
        x.snapshot.pageType === "capability"
      ) {
        return true;
      }
      // Flagship product guides sample
      if (
        /\/(hubspot|salesforce|pipedrive|zoho-crm|freshsales|monday-sales-crm)(\/|-)/.test(
          route,
        )
      ) {
        return true;
      }
      return false;
    });
  }

  if (opts.limit && opts.limit > 0) {
    loaded = loaded.slice(0, opts.limit);
  }

  const results: AuditPageResult[] = [];

  for (const item of loaded) {
    const { agentId, agentLabel, assessment } = runContentQualityAgent(
      item.snapshot,
      { evaluatedAt },
    );
    const pageImportance = classifyPageImportance(
      assessment.route,
      assessment.pageType,
    );
    const journeyImportance = classifyJourneyImportance(
      assessment.pageType,
      item.snapshot.journey?.stage,
    );
    const improvementPriority = assignImprovementPriority({
      assessment,
      pageImportance,
      journeyImportance,
    });

    const partial: AuditPageResult = {
      assessment,
      slug: item.slug,
      agentId,
      agentLabel,
      improvementPriority,
      pageImportance,
      journeyImportance,
      reportRelPath: "",
    };

    if (opts.writeReports !== false) {
      partial.reportRelPath = writePageAuditReport(partial);
    } else {
      partial.reportRelPath = `docs/content-quality/pages/${assessment.pageType}--${item.slug}.md`;
    }

    results.push(partial);
  }

  let masterPath: string | undefined;
  if (opts.writeMaster !== false) {
    masterPath = writeMasterInventory(results, { evaluatedAt, scope });
  }

  const scores = results.map((r) => r.assessment.overallScore);
  const averageScore = scores.length
    ? Math.round(scores.reduce((s, n) => s + n, 0) / scores.length)
    : 0;

  const byPriority: Record<string, number> = {
    "CQ-P0": 0,
    "CQ-P1": 0,
    "CQ-P2": 0,
    "CQ-P3": 0,
  };
  for (const r of results) {
    byPriority[r.improvementPriority] =
      (byPriority[r.improvementPriority] ?? 0) + 1;
  }

  const byType = new Map<string, number[]>();
  for (const r of results) {
    const arr = byType.get(r.assessment.pageType) ?? [];
    arr.push(r.assessment.overallScore);
    byType.set(r.assessment.pageType, arr);
  }
  const byPageTypeAvg: Record<string, number> = {};
  for (const [type, arr] of byType) {
    byPageTypeAvg[type] = Math.round(
      arr.reduce((s, n) => s + n, 0) / arr.length,
    );
  }

  const ranked = [...results].sort(
    (a, b) => b.assessment.overallScore - a.assessment.overallScore,
  );

  return {
    evaluatedAt,
    scope,
    results,
    masterPath,
    summary: {
      pagesEvaluated: results.length,
      averageScore,
      byPriority,
      byPageTypeAvg,
      strongest: ranked.slice(0, 10).map((r) => ({
        route: r.assessment.route,
        score: r.assessment.overallScore,
      })),
      weakest: ranked
        .slice()
        .reverse()
        .slice(0, 20)
        .map((r) => ({
          route: r.assessment.route,
          score: r.assessment.overallScore,
        })),
      commonGaps: topCounts(results.flatMap((r) => r.assessment.criticalGaps)),
      commonEvidenceProblems: topCounts(
        results.flatMap((r) => r.assessment.researchGaps),
      ),
      commonLinkingProblems: topCounts(
        results.flatMap((r) => r.assessment.linkingGaps),
      ),
    },
  };
}
