import { identityPath } from "@/seo/canonical";
import { analyzeKnowledgeGraph } from "@/services/seo/knowledge-graph/analyze";
import { clearAuthorityCaches } from "@/services/seo/knowledge-graph/authority";
import { clearCrmOutboundEdgeCache } from "@/services/internal-linking/outbound-graph";
import { clearLinkInjectionsCache } from "@/services/internal-linking/link-injections";
import { assessLinkReadiness } from "./link-gates";
import type {
  BatchLinkingMetrics,
  PageLinkingImpact,
  PageLinkingPlan,
} from "./types";

export type GraphSnapshot = {
  orphans: number;
  improveOrphans: number;
  inboundByPath: Map<string, number>;
  hubDepthByPath: Map<string, number | null>;
};

/**
 * Phase 5–6 snapshot helpers — re-run graph after each batch.
 */
export function snapshotKnowledgeGraphLinking(options: {
  light?: boolean;
  paths?: string[];
}): GraphSnapshot {
  clearLinkInjectionsCache();
  clearCrmOutboundEdgeCache();
  clearAuthorityCaches();

  const report = analyzeKnowledgeGraph({
    write: false,
    lightQa: options.light === true,
    improveLimit: 200,
  });

  const inboundByPath = new Map<string, number>();
  const hubDepthByPath = new Map<string, number | null>();
  for (const row of report.improveInbound) {
    inboundByPath.set(identityPath(row.path), row.contentInboundCount);
    hubDepthByPath.set(identityPath(row.path), row.hubDepth);
  }

  return {
    orphans: report.summary.improveOrphans,
    improveOrphans: report.summary.improveOrphans,
    inboundByPath,
    hubDepthByPath,
  };
}

function anchorDiversity(anchors: string[]): number {
  if (anchors.length === 0) return 1;
  const unique = new Set(anchors.map((a) => a.trim().toLowerCase()));
  return unique.size / anchors.length;
}

export function buildBatchLinkingMetrics(input: {
  batchId: string;
  before: GraphSnapshot | null;
  after: GraphSnapshot | null;
  plans: PageLinkingPlan[];
  applied: Array<{ toPath: string; fromPath: string }>;
  appliedCount: number;
  qualityPromotions: number;
  skippedWeak: number;
}): BatchLinkingMetrics {
  const paths = input.plans
    .filter((p) => p.eligibility.eligible)
    .map((p) => identityPath(p.path));

  let inboundLinksGained: number | null = null;
  if (input.before && input.after) {
    inboundLinksGained = 0;
    for (const p of paths) {
      const a = input.after.inboundByPath.get(p) ?? 0;
      const b = input.before.inboundByPath.get(p) ?? 0;
      inboundLinksGained += Math.max(0, a - b);
    }
  }

  const hubDepthSample = paths.slice(0, 12).map((p) => ({
    path: p,
    depth: input.after?.hubDepthByPath.get(p) ?? null,
  }));

  const appliedByTo = new Map<string, string[]>();
  for (const a of input.applied) {
    const to = identityPath(a.toPath);
    const list = appliedByTo.get(to) ?? [];
    list.push(identityPath(a.fromPath));
    appliedByTo.set(to, list);
  }

  const pages: PageLinkingImpact[] = input.plans
    .filter((p) => p.eligibility.eligible)
    .map((p) => {
      const path = identityPath(p.path);
      const linkingSources = [
        ...new Set([
          ...(appliedByTo.get(path) ?? []),
          ...p.selected.map((s) => identityPath(s.fromPath)),
        ]),
      ];
      const anchors = [
        ...p.selected.map((s) => s.fromTitle),
        ...p.outboundNextSteps.map((s) => s.label),
      ].filter(Boolean);

      const inboundBefore = input.before?.inboundByPath.get(path) ?? 0;
      const inboundAfter = input.after
        ? (input.after.inboundByPath.get(path) ?? inboundBefore)
        : null;
      const hubDepthBefore = input.before?.hubDepthByPath.get(path) ?? null;
      const hubDepthAfter = input.after
        ? (input.after.hubDepthByPath.get(path) ?? hubDepthBefore)
        : null;

      let promotionImpact = false;
      try {
        const ready = assessLinkReadiness(path, {
          kind:
            p.kind === "guide" || p.kind === "comparison" ? p.kind : undefined,
          slug: p.slug,
          light: true,
        });
        promotionImpact = ready.ok;
      } catch {
        promotionImpact = false;
      }

      return {
        path,
        inboundBefore,
        inboundAfter,
        hubDepthBefore,
        hubDepthAfter,
        linkingSources,
        anchors,
        anchorDiversity: anchorDiversity(anchors),
        promotionImpact,
      };
    });

  return {
    batchId: input.batchId,
    generatedAt: new Date().toISOString(),
    orphansBefore: input.before?.improveOrphans ?? 0,
    orphansAfter: input.after?.improveOrphans ?? null,
    inboundLinksGained,
    hubDepthSample,
    qualityPromotions: input.qualityPromotions,
    pagesPlanned: input.plans.filter((p) => p.eligibility.eligible).length,
    pagesApplied: input.appliedCount,
    opportunitiesSelected: input.plans.reduce(
      (n, p) => n + p.selected.filter((s) => !s.alreadyLinked).length,
      0,
    ),
    skippedWeak: input.skippedWeak,
    pages,
  };
}
