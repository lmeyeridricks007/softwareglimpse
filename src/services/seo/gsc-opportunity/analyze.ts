import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { getSiteUrl } from "@/lib/site";
import { getComparisonBySlug } from "@/data";
import { getGuideBySlug } from "@/data/repositories/guides";
import { buildContentRegistry } from "@/services/publishing/server";
import { loadAuditSnapshots } from "@/services/content-quality";
import { detectSeoOrphans } from "@/services/internal-linking";
import { loadContentLifecycleStoreFromDisk } from "@/services/seo/content-lifecycle/store-write";
import { getLifecycleOverrideState } from "@/services/seo/content-lifecycle/store";
import {
  buildCanonicalizerContext,
  resolveCanonicalOpportunity,
} from "./canonicalize";
import { diagnosePage, type DiagnoseContext } from "./diagnose";
import {
  inferEstateType,
  resolveOpportunityQueueBucket,
} from "./estate";
import { resolveCreateCandidate } from "./existing-page";
import { writeGscSystemFeeds } from "./feeds";
import {
  aggregatePageQueryMatrix,
  aggregateQueries,
  discoverLatestGscExport,
  loadGscExport,
  type LoadedGscExport,
} from "./ingest";
import { buildSearchIntentProfile } from "./intent-profile";
import {
  findQueriesWithoutStrongPage,
  gateQuerySpecificActions,
  inferPageQueryMapping,
  mapQueriesFromPageQueryMatrix,
  primaryCommercialIntent,
} from "./query-map";
import {
  formatGscOpportunitiesMarkdown,
  formatTop20GrowthPagesMarkdown,
} from "./report";
import { scorePageOpportunity } from "./score";
import {
  GSC_OPPORTUNITY_ENGINE_VERSION,
  type CannibalizationFlag,
  type ExclusionReason,
  type GscOpportunityReport,
  type GscOpportunityRow,
} from "./types";
import { GSC_OPPORTUNITY_WEIGHTS } from "./score";
import { loadAiVisibilitySummary } from "@/services/seo/ai-visibility";

export type AnalyzeGscOpportunitiesOptions = {
  /** Explicit export path. If omitted, newest known export is discovered. */
  exportPath?: string;
  cwd?: string;
  /** Min impressions after rollup to score a page. */
  minImpressions?: number;
  /** How many top pages get full diagnostics. */
  diagnoseTopN?: number;
  write?: boolean;
  outJson?: string;
  outMd?: string;
  outTop20?: string;
  /** Allow fixture/synthetic exports (tests only). Default false. */
  allowSynthetic?: boolean;
};

type RolledPage = {
  path: string;
  clicks: number;
  impressions: number;
  positionWeighted: number;
  sourcePaths: string[];
};

function siteUrlFor(pathName: string): string {
  const base = getSiteUrl().replace(/\/$/, "");
  return `${base}${pathName}`;
}

function rollupEligiblePages(
  exportData: LoadedGscExport,
  cwd: string,
): {
  pages: RolledPage[];
  exclusionSummary: Record<string, number>;
  excludedPages: number;
} {
  const ctx = buildCanonicalizerContext(cwd);
  const exclusionSummary: Record<string, number> = {};
  let excludedPages = 0;
  const rolled = new Map<string, RolledPage>();

  // Prefer page-dimension rows for page metrics. If absent, roll up page×query
  // matrix by page (do not mix both — that would double-count).
  const metricRows =
    exportData.pageRows.length > 0
      ? exportData.pageRows
      : exportData.pageQueryRows;

  for (const row of metricRows) {
    if (!row.page) continue;
    const resolution = resolveCanonicalOpportunity(row.page, ctx);

    if (resolution.excluded) {
      const reason = resolution.exclusionReason ?? ("redirect_source" as ExclusionReason);
      // EN redirect/mapping sources: attribute metrics to live target.
      if (
        (reason === "redirect_source" || reason === "locale_redirect") &&
        resolution.targetPath &&
        resolution.targetPath !== resolution.inputPath &&
        reason === "redirect_source"
      ) {
        const target = resolution.targetPath;
        // Still count the source as excluded from direct listing.
        exclusionSummary[reason] = (exclusionSummary[reason] ?? 0) + 1;
        excludedPages += 1;
        const cur = rolled.get(target) ?? {
          path: target,
          clicks: 0,
          impressions: 0,
          positionWeighted: 0,
          sourcePaths: [],
        };
        cur.clicks += row.clicks;
        cur.impressions += row.impressions;
        cur.positionWeighted += row.position * row.impressions;
        if (!cur.sourcePaths.includes(resolution.inputPath)) {
          cur.sourcePaths.push(resolution.inputPath);
        }
        rolled.set(target, cur);
        continue;
      }

      exclusionSummary[reason] = (exclusionSummary[reason] ?? 0) + 1;
      excludedPages += 1;
      continue;
    }

    const target = resolution.targetPath;
    const cur = rolled.get(target) ?? {
      path: target,
      clicks: 0,
      impressions: 0,
      positionWeighted: 0,
      sourcePaths: [],
    };
    cur.clicks += row.clicks;
    cur.impressions += row.impressions;
    cur.positionWeighted += row.position * row.impressions;
    if (!cur.sourcePaths.includes(resolution.inputPath)) {
      cur.sourcePaths.push(resolution.inputPath);
    }
    rolled.set(target, cur);
  }

  return {
    pages: [...rolled.values()],
    exclusionSummary,
    excludedPages,
  };
}

function buildDiagnoseContext(): DiagnoseContext {
  const registry = buildContentRegistry({ includeUnpublishedPricing: true });
  const registryByPath = new Map(
    registry.map((e) => [e.path.endsWith("/") ? e.path : `${e.path}/`, e]),
  );

  const snapshotByRoute = new Map<string, ReturnType<typeof loadAuditSnapshots>[number]["snapshot"]>();
  try {
    for (const item of loadAuditSnapshots("all")) {
      const route = item.snapshot.route.endsWith("/")
        ? item.snapshot.route
        : `${item.snapshot.route}/`;
      snapshotByRoute.set(route, item.snapshot);
    }
  } catch {
    // Content-quality inventory may be heavy / partial — diagnostics degrade gracefully.
  }

  let inboundCounts = new Map<string, number>();
  let outboundCounts = new Map<string, number>();
  try {
    const orphans = detectSeoOrphans();
    inboundCounts = orphans.contentInboundCounts ?? orphans.inboundCounts;
    outboundCounts = orphans.outgoingCounts;
  } catch {
    // Link graph optional.
  }

  return { registryByPath, snapshotByRoute, inboundCounts, outboundCounts };
}

/**
 * CANNIBALIZATION only when multiple URLs share the same DIRECT_GSC query.
 * Heuristic cluster overlap → POSSIBLE_INTENT_OVERLAP (review required).
 */
function detectCannibalization(
  rows: GscOpportunityRow[],
): CannibalizationFlag[] {
  const byDirectQuery = new Map<string, GscOpportunityRow[]>();
  const byInferredCluster = new Map<string, GscOpportunityRow[]>();

  for (const row of rows) {
    const direct = row.mappedQueries.filter(
      (m) =>
        m.provenance === "DIRECT_GSC" ||
        m.provenance === "HISTORICAL_DIRECT_GSC",
    );
    for (const m of direct.slice(0, 5)) {
      const key = m.query.trim().toLowerCase();
      const list = byDirectQuery.get(key) ?? [];
      list.push(row);
      byDirectQuery.set(key, list);
    }

    if (
      row.queryProvenance === "INFERRED" ||
      row.queryProvenance === "UNKNOWN" ||
      row.relationshipSource.startsWith("INFERRED") ||
      row.relationshipSource === "UNKNOWN"
    ) {
      for (const cluster of row.queryClusters.slice(0, 2)) {
        const list = byInferredCluster.get(cluster) ?? [];
        list.push(row);
        byInferredCluster.set(cluster, list);
      }
    }
  }

  const flags: CannibalizationFlag[] = [];

  for (const [query, list] of byDirectQuery) {
    const unique = [...new Map(list.map((r) => [r.path, r])).values()];
    if (unique.length < 2) continue;
    if (unique.every((r) => r.impressions < 40)) continue;
    flags.push({
      queryOrCluster: query,
      paths: unique.map((r) => r.path),
      impressions: unique.map((r) => r.impressions),
      classification: "CANNIBALIZATION",
      queryProvenance: "DIRECT_GSC",
      requiresReview: false,
    });
  }

  for (const [cluster, list] of byInferredCluster) {
    const unique = [...new Map(list.map((r) => [r.path, r])).values()];
    if (unique.length < 2) continue;
    if (unique.every((r) => r.impressions < 40)) continue;
    // Skip if already flagged as real cannibalization on overlapping paths.
    const already = flags.some(
      (f) =>
        f.classification === "CANNIBALIZATION" &&
        f.paths.some((p) => unique.some((u) => u.path === p)),
    );
    if (already) continue;
    flags.push({
      queryOrCluster: cluster,
      paths: unique.map((r) => r.path),
      impressions: unique.map((r) => r.impressions),
      classification: "POSSIBLE_INTENT_OVERLAP",
      queryProvenance: "INFERRED",
      requiresReview: true,
    });
  }

  return flags
    .sort(
      (a, b) =>
        (a.classification === "CANNIBALIZATION" ? 0 : 1) -
          (b.classification === "CANNIBALIZATION" ? 0 : 1) ||
        b.paths.length - a.paths.length,
    )
    .slice(0, 40);
}

/**
 * Full GSC Opportunity Engine run — analysis only.
 * Production reporting requires a real (non-fixture) Search Console export.
 */
export function analyzeGscOpportunities(
  options: AnalyzeGscOpportunitiesOptions = {},
): GscOpportunityReport {
  const cwd = options.cwd ?? process.cwd();
  const minImpressions = options.minImpressions ?? 10;
  const diagnoseTopN = options.diagnoseTopN ?? 200;
  const write = options.write !== false;
  const allowSynthetic = options.allowSynthetic === true;

  // Hydrate lifecycle overrides for guide/compare promotion queues.
  try {
    loadContentLifecycleStoreFromDisk();
  } catch {
    // optional
  }

  const exportData = options.exportPath
    ? loadGscExport(options.exportPath)
    : discoverLatestGscExport(cwd, { allowSynthetic });

  if (exportData.synthetic && !allowSynthetic) {
    throw new Error(
      `Refusing fixture/synthetic GSC export for production opportunity reporting: ${exportData.sourcePath}. Pass a real Search Console export.`,
    );
  }

  const { pages, exclusionSummary, excludedPages } = rollupEligiblePages(
    exportData,
    cwd,
  );

  const queries = aggregateQueries(exportData.queryRows);
  const pageQueryByPath = aggregatePageQueryMatrix(exportData.pageQueryRows);
  const diagnoseCtx = buildDiagnoseContext();

  const cannibalPaths = new Set<string>();
  const possibleOverlapPaths = new Set<string>();

  const candidates = pages
    .filter((p) => p.impressions >= minImpressions)
    .map((p) => {
      const position =
        p.impressions > 0 ? p.positionWeighted / p.impressions : 0;
      const ctr = p.impressions > 0 ? p.clicks / p.impressions : 0;
      return { ...p, position, ctr };
    })
    .sort((a, b) => b.impressions - a.impressions);

  // Diagnose top N by a provisional ranking: impression × position proximity.
  const provisional = [...candidates].sort((a, b) => {
    const scoreA =
      Math.log10(1 + a.impressions) *
      (a.position >= 8 && a.position <= 35 ? 2 : a.position <= 50 ? 1.4 : 1);
    const scoreB =
      Math.log10(1 + b.impressions) *
      (b.position >= 8 && b.position <= 35 ? 2 : b.position <= 50 ? 1.4 : 1);
    return scoreB - scoreA;
  });

  const diagnoseSet = new Set(
    provisional.slice(0, diagnoseTopN).map((p) => p.path),
  );

  const scored: GscOpportunityRow[] = [];

  for (const page of candidates) {
    const shouldDiagnose = diagnoseSet.has(page.path);
    const entry = diagnoseCtx.registryByPath.get(page.path);
    const snap = diagnoseCtx.snapshotByRoute.get(page.path);
    const pageType =
      snap?.pageType ??
      (entry?.type ? String(entry.type) : inferFallbackType(page.path));
    const title = snap?.title ?? entry?.title ?? null;
    const productSlugs = extractSlug(page.path, "software");
    const categorySlugs = extractSlug(page.path, "categories");
    // Compare pages: extract both product slugs from slug-vs-slug
    if (page.path.startsWith("/compare/")) {
      const slug = page.path.split("/").filter(Boolean)[1];
      if (slug?.includes("-vs-")) {
        for (const part of slug.split("-vs-")) {
          if (part) productSlugs.push(part);
        }
      }
    }
    const estateType = inferEstateType(page.path);

    const matrixQueries = pageQueryByPath.get(page.path);
    const exportDateRange = {
      startDate: exportData.dateRangeStart,
      endDate: exportData.dateRangeEnd,
    };
    const mapping =
      matrixQueries && matrixQueries.length > 0
        ? mapQueriesFromPageQueryMatrix(matrixQueries, {
            historical: exportData.historicalPageQuery,
            sourceDateRange: exportDateRange,
          })
        : inferPageQueryMapping(
            {
              path: page.path,
              title,
              pageType,
              productSlugs,
              categorySlugs,
            },
            queries,
            { sourceDateRange: exportDateRange },
          );

    const mapped = mapping.mappedQueries;
    const candidatesInferred = mapping.inferredQueryCandidates;
    const commercialIntent = primaryCommercialIntent(
      mapped,
      page.path,
      candidatesInferred,
    );

    // Intent mismatch only from trusted query evidence.
    const topTrusted = mapped[0];
    const intentMismatch =
      Boolean(topTrusted) &&
      (mapping.actionConfidence === "EVIDENCED" ||
        mapping.actionConfidence === "REVIEW_REQUIRED") &&
      ((pageType.includes("review") &&
        topTrusted!.intent === "comparison" &&
        topTrusted!.matchScore > 0.5) ||
        (pageType.includes("guide") &&
          (topTrusted!.intent === "pricing" ||
            topTrusted!.intent === "transactional")));

    const finalDiag = shouldDiagnose
      ? diagnosePage(page.path, diagnoseCtx, {
          avgPosition: page.position,
          ctr: page.ctr,
          impressions: page.impressions,
          intentMismatch,
          cannibalization: cannibalPaths.has(page.path),
          possibleIntentOverlap: possibleOverlapPaths.has(page.path),
        })
      : null;

    const resolvedType = finalDiag?.diagnostics.pageType ?? pageType;
    const { lifecycleState, seoIndexable } = resolveLifecycleAndIndexable(
      page.path,
      finalDiag?.diagnostics.seoIndexable ??
        (entry ? entry.seoIndexable : null),
    );

    const queueBucket = resolveOpportunityQueueBucket({
      seoIndexable,
      lifecycleState,
    });
    const improvePromotion = queueBucket === "improve_promotion";

    const topicalMatch =
      mapping.provenance === "DIRECT_GSC" ||
      mapping.provenance === "HISTORICAL_DIRECT_GSC"
        ? 0.85
        : candidatesInferred.length > 0
          ? Math.min(
              0.45,
              candidatesInferred
                .slice(0, 3)
                .reduce((s, m) => s + m.matchScore, 0) /
                Math.min(3, candidatesInferred.length),
            )
          : 0.2;

    const queryCountForScore =
      mapping.provenance === "DIRECT_GSC" ||
      mapping.provenance === "HISTORICAL_DIRECT_GSC"
        ? mapped.length
        : 0; // Do not inflate score with weak inferred query coverage

    const { opportunityScore, scoreBreakdown } = scorePageOpportunity({
      impressions: page.impressions,
      position: page.position,
      ctr: page.ctr,
      queryCount: queryCountForScore,
      commercialIntent,
      pageType: resolvedType,
      qualityScore: finalDiag?.qualityScore ?? null,
      completenessSignals: finalDiag?.completenessSignals ?? 0,
      inboundLinks: finalDiag?.diagnostics.inboundInternalLinks ?? null,
      outboundLinks: finalDiag?.diagnostics.outgoingInternalLinks ?? null,
      lastUpdated: finalDiag?.diagnostics.lastUpdated ?? null,
      topicalMatch,
      cannibalizationRisk: cannibalPaths.has(page.path)
        ? 0.7
        : possibleOverlapPaths.has(page.path)
          ? 0.35
          : 0.1,
      rootCauseCount: finalDiag?.rootCauses.length ?? 0,
      indexable: seoIndexable !== false,
      improvePromotion,
    });

    const clusters = [
      ...new Set([
        ...mapped.map((m) => m.clusterKey),
        ...candidatesInferred.map((c) => c.clusterKey),
      ].filter(Boolean)),
    ].slice(0, 6);

    let rootCauses = finalDiag?.rootCauses ?? ["OTHER"];
    let recommendedActions = finalDiag?.recommendedActions ?? ["MANUAL_REVIEW"];
    let primaryAction = finalDiag?.primaryAction ?? "MANUAL_REVIEW";

    if (improvePromotion) {
      if (!recommendedActions.includes("ENRICH_AND_PROMOTE")) {
        recommendedActions = ["ENRICH_AND_PROMOTE", ...recommendedActions];
      }
      if (
        primaryAction === "MANUAL_REVIEW" ||
        primaryAction === "NO_ACTION"
      ) {
        primaryAction = "ENRICH_AND_PROMOTE";
      }
    }

    const keepPageLevelTitleOpt =
      rootCauses.includes("TITLE_WEAK") || rootCauses.includes("POOR_CTR");
    const h1LooksWeak = (() => {
      const h1 = finalDiag?.diagnostics.h1;
      if (!h1) return Boolean(finalDiag);
      return h1.trim().length < 12 || h1.trim().length > 90;
    })();
    const gated = gateQuerySpecificActions({
      recommendedActions,
      primaryAction,
      rootCauses,
      actionConfidence: mapping.actionConfidence,
      relationshipSource: mapping.relationshipSource,
      targetQuery: mapping.targetQuery,
      h1LooksWeak,
      keepPageLevelTitleOpt,
    });
    rootCauses = gated.rootCauses;
    recommendedActions = gated.recommendedActions;
    primaryAction = gated.primaryAction;

    const intentProfile = buildSearchIntentProfile({
      mappedQueries: mapped,
      inferredCandidates: candidatesInferred,
      commercialIntent,
      pageType: resolvedType,
      rootCauses,
      recommendedActions,
      intentMismatch,
      queryProvenance: mapping.provenance,
      actionConfidence: mapping.actionConfidence,
    });

    const secondaryQueries =
      mapping.actionConfidence === "EVIDENCED" ||
      mapping.actionConfidence === "REVIEW_REQUIRED"
        ? mapped.slice(1, 5).map((m) => m.query)
        : [];

    scored.push({
      rank: 0,
      url: siteUrlFor(page.path),
      path: page.path,
      pageType: resolvedType,
      estateType,
      queueBucket,
      lifecycleState,
      primaryQuery: mapping.targetQuery,
      targetQuery: mapping.targetQuery,
      relationshipSource: mapping.relationshipSource,
      queryProvenance: mapping.provenance,
      queryMappingConfidence: mapping.mappingConfidence,
      queryMappingReason: mapping.mappingReason,
      queryEvidence: mapping.evidence,
      querySourceDateRange: mapping.sourceDateRange,
      inferredQueryCandidates: candidatesInferred,
      secondaryQueries,
      queryClusters: clusters,
      intentProfile,
      clicks: page.clicks,
      impressions: page.impressions,
      ctr: page.ctr,
      avgPosition: page.position,
      opportunityScore,
      scoreBreakdown,
      commercialIntent,
      mappedQueries: mapped,
      rootCauses,
      recommendedActions,
      primaryAction,
      actionConfidence: mapping.actionConfidence,
      requiresHumanReview: mapping.requiresHumanReview,
      expectedDifficulty: finalDiag?.expectedDifficulty ?? "MEDIUM",
      internalLinkRecommendations:
        finalDiag?.internalLinkRecommendations ?? [],
      backlinksLikelyHelp: finalDiag?.backlinksLikelyHelp ?? page.position > 25,
      contentChangeMode: finalDiag?.contentChangeMode ?? "adjust",
      diagnostics: finalDiag?.diagnostics ?? null,
      sourcePaths: page.sourcePaths,
      notes: [
        ...(page.sourcePaths.length > 1
          ? [
              `Impressions rolled up from ${page.sourcePaths.length} legacy/source URL(s)`,
            ]
          : []),
        ...(mapping.provenance === "INFERRED"
          ? [
              "INFERRED — NOT DIRECT GSC DATA — heuristic candidates only; do not auto-rewrite title/H1/content from these queries",
            ]
          : []),
        ...(mapping.provenance === "UNKNOWN"
          ? [
              "Query mapping UNKNOWN — no page×query matrix and no confident heuristic candidates",
            ]
          : []),
        ...(mapping.provenance === "DIRECT_GSC"
          ? ["Query mapping from DIRECT_GSC page×query evidence"]
          : []),
        ...(mapping.provenance === "HISTORICAL_DIRECT_GSC"
          ? ["Query mapping from HISTORICAL_DIRECT_GSC page×query evidence"]
          : []),
        ...gated.notes,
        ...(improvePromotion
          ? [
              "Queue B — IMPROVE/noindex promotion: historical GSC demand favors enrichment + index restoration over discard",
            ]
          : []),
      ],
    });
  }

  scored.sort(
    (a, b) =>
      b.opportunityScore - a.opportunityScore ||
      b.impressions - a.impressions,
  );
  scored.forEach((row, i) => {
    row.rank = i + 1;
  });

  const cannibalization = detectCannibalization(scored.slice(0, 150));
  for (const flag of cannibalization) {
    if (flag.classification === "CANNIBALIZATION") {
      for (const p of flag.paths) cannibalPaths.add(p);
    } else {
      for (const p of flag.paths) possibleOverlapPaths.add(p);
    }
  }
  // Annotate evidence-backed cannibalization vs possible overlap (review).
  for (const row of scored) {
    if (cannibalPaths.has(row.path)) {
      if (!row.rootCauses.includes("CANNIBALIZATION")) {
        row.rootCauses = [...row.rootCauses, "CANNIBALIZATION"];
      }
      if (
        row.actionConfidence === "EVIDENCED" &&
        !row.recommendedActions.includes("QUERY_CLUSTER_CONSOLIDATION")
      ) {
        row.recommendedActions = [
          ...row.recommendedActions,
          "QUERY_CLUSTER_CONSOLIDATION",
        ];
        if (
          row.primaryAction === "OPTIMIZE_TITLE" ||
          row.primaryAction === "MANUAL_REVIEW"
        ) {
          row.primaryAction = "QUERY_CLUSTER_CONSOLIDATION";
        }
      }
    } else if (possibleOverlapPaths.has(row.path)) {
      if (!row.rootCauses.includes("POSSIBLE_INTENT_OVERLAP")) {
        row.rootCauses = [...row.rootCauses, "POSSIBLE_INTENT_OVERLAP"];
      }
      if (!row.recommendedActions.includes("MANUAL_REVIEW")) {
        row.recommendedActions = [...row.recommendedActions, "MANUAL_REVIEW"];
      }
      row.requiresHumanReview = true;
      row.notes = [
        ...row.notes,
        "POSSIBLE_INTENT_OVERLAP — heuristic name/cluster overlap only; not DIRECT_GSC cannibalization",
      ];
    }
  }

  const scoredPaths = scored.map((r) => r.path);
  const rawQueriesWithoutPage = findQueriesWithoutStrongPage(
    queries,
    scored.map((r) => ({
      path: r.path,
      mapped: r.mappedQueries,
      candidates: r.inferredQueryCandidates,
    })),
  );
  const queriesWithoutPage = rawQueriesWithoutPage.map((q) => {
    const resolution = resolveCreateCandidate({
      query: q.query,
      impressions: q.impressions,
      intent: q.intent,
      reason: q.reason,
      scoredPaths,
    });
    return {
      ...q,
      improveExistingPath: resolution.improveExisting?.path ?? null,
      createCandidateSuggested: resolution.createCandidateSuggested,
    };
  });
  const createCandidatesDeferred = queriesWithoutPage.filter(
    (q) => q.improveExistingPath && !q.createCandidateSuggested,
  ).length;

  const indexedImprovementQueue = scored
    .filter((r) => r.queueBucket === "indexed_improvement")
    .slice(0, 50);
  const improvePromotionQueue = scored
    .filter((r) => r.queueBucket === "improve_promotion")
    .slice(0, 50);

  const aiVisibility = loadAiVisibilitySummary(cwd);
  if (aiVisibility?.topCitedPaths.length) {
    const cited = new Set(aiVisibility.topCitedPaths);
    for (const row of scored) {
      if (!cited.has(row.path)) continue;
      row.notes = [
        ...row.notes,
        "Also appears in recent AI Visibility top cited paths (measurement only — not a ranking boost).",
      ];
    }
  }

  const generatedAt = new Date().toISOString();
  const report: GscOpportunityReport = {
    engineVersion: GSC_OPPORTUNITY_ENGINE_VERSION,
    generatedAt,
    sourceFile: exportData.sourcePath,
    sourceLabel: exportData.label,
    dataThroughDate: exportData.meta.dataThroughDate ?? exportData.dateRangeEnd,
    rangeLabel: exportData.meta.rangeLabel ?? null,
    provenance: {
      source: exportData.sourcePath,
      sourceLabel: exportData.label,
      dateRangeStart: exportData.dateRangeStart,
      dateRangeEnd: exportData.dateRangeEnd,
      dataThroughDate:
        exportData.meta.dataThroughDate ?? exportData.dateRangeEnd,
      rangeLabel: exportData.meta.rangeLabel ?? null,
      importRetrievedAt: exportData.meta.retrievedAt ?? null,
      generatedAt,
      synthetic: false,
    },
    methodologyNotes: [
      "Analysis only — no production content, canonicals, or robots were modified.",
      `REAL GSC source: ${exportData.sourcePath}` +
        (exportData.meta.sourceFiles
          ? ` (original: ${exportData.meta.sourceFiles.join(", ")})`
          : ""),
      `Date range: ${exportData.dateRangeStart ?? "?"} → ${exportData.dateRangeEnd ?? exportData.meta.dataThroughDate ?? "?"}`,
      `Import retrievedAt: ${exportData.meta.retrievedAt ?? "—"}`,
      "Fixture/synthetic GSC data is rejected for production reporting.",
      exportData.hasPageQueryMatrix
        ? `Page×query matrix loaded (${exportData.pageQueryRows.length} rows) — relationshipSource DIRECT_GSC${exportData.historicalPageQuery ? " (historical)" : ""}.`
        : "Pages and Queries tabs loaded separately — NO page×query matrix. Heuristic candidates are INFERRED_* — NOT DIRECT GSC DATA. INFERRED_MEDIUM/LOW never become target queries or rewrite drivers.",
      "relationshipSource: DIRECT_GSC | HISTORICAL_DIRECT_GSC | INFERRED_HIGH | INFERRED_MEDIUM | INFERRED_LOW | UNKNOWN.",
      "Query-scoped actions (OPTIMIZE_TITLE_FOR_QUERY, REWRITE_H1_FOR_QUERY, SEARCH_INTENT_MISMATCH, QUERY_CLUSTER_CONSOLIDATION) auto-apply only from DIRECT_GSC / HISTORICAL_DIRECT_GSC; INFERRED_HIGH requires human review; INFERRED_MEDIUM/LOW never rewrite.",
      "Page-level OPTIMIZE_TITLE may still fire from TITLE_WEAK / POOR_CTR without a target query.",
      "CANNIBALIZATION requires multiple URLs for the same DIRECT_GSC query; heuristic overlap is POSSIBLE_INTENT_OVERLAP.",
      "Legacy non-English, taxonomy, utility, 410/404-classified, and author/feed URLs are excluded.",
      "English redirect sources are excluded as pages; their impressions roll up to live destinations.",
      "Position bands: 8–20 very high, 21–35 high, 36–50 medium, 51–70 selective, >70 low unless impressions unusually high.",
      "Queue A = indexed page improvement; Queue B = IMPROVE/noindex promotion (historical demand is a priority signal, not a discard reason).",
      "CREATE_CANDIDATE is deferred when an existing SoftwareGlimpse page can absorb the intent after improvement.",
      `Score weights: ${JSON.stringify(GSC_OPPORTUNITY_WEIGHTS)}`,
      "Opportunity score uses page-level metrics independently — inferred query coverage does not inflate score.",
      "Commercial intent boosts editorial priority only — never product recommendation ranks.",
      aiVisibility
        ? `AI Visibility summary loaded from data/seo/ai-visibility.json (${aiVisibility.totalCitations} citations, ${aiVisibility.uniqueCitedPages} unique pages) — measurement only.`
        : "AI Visibility summary not found — run npm run seo:ai-visibility after importing a legitimate export.",
    ],
    totals: {
      rawPageRows: exportData.pageRows.length,
      rawQueryRows: exportData.queryRows.length,
      rawPageQueryRows: exportData.pageQueryRows.length,
      hasPageQueryMatrix: exportData.hasPageQueryMatrix,
      excludedPages,
      eligiblePages: pages.length,
      scoredPages: scored.length,
      diagnosedPages: scored.filter((r) => r.diagnostics != null).length,
      indexedImprovementCount: scored.filter(
        (r) => r.queueBucket === "indexed_improvement",
      ).length,
      improvePromotionCount: scored.filter(
        (r) => r.queueBucket === "improve_promotion",
      ).length,
      createCandidatesDeferred,
      pagesWithDirectQuery: scored.filter(
        (r) =>
          r.queryProvenance === "DIRECT_GSC" ||
          r.queryProvenance === "HISTORICAL_DIRECT_GSC",
      ).length,
      pagesWithInferredOnly: scored.filter(
        (r) => r.queryProvenance === "INFERRED",
      ).length,
      pagesWithUnknownQuery: scored.filter(
        (r) => r.queryProvenance === "UNKNOWN",
      ).length,
    },
    exclusionSummary,
    indexedImprovementQueue,
    improvePromotionQueue,
    top20: scored.slice(0, 20),
    top50: scored.slice(0, 50),
    top100: scored.slice(0, 100),
    allRanked: scored,
    queriesWithoutPage,
    cannibalization,
    weeklyProcess: [
      "1. Prefer a page×query export (GSC API dimensions page+query, combined CSV, or JSON pageQueries[]) — required for DIRECT_GSC target queries.",
      "2. If only Pages + Queries tabs exist, the engine will NOT invent primary queries; candidates stay INFERRED — NOT DIRECT GSC DATA.",
      "3. Place under data/seo/imports/ or docs/migration/data/ (must be synthetic:false) — see docs/seo/GSC-OPPORTUNITY-ENGINE.md.",
      "4. Run: npm run seo:gsc-opportunities -- --export <path>",
      "5. Review Queue A (indexed improvement) AND Queue B (IMPROVE/noindex promotion).",
      "6. Only auto-optimize titles/H1 from DIRECT_GSC (or HIGH inference after human review).",
      "7. Prefer enriching existing URLs — only create when resolveCreateCandidate finds no match.",
      "8. Feed outputs under data/seo/feeds/ drive guide/compare enrichment, testing, pricing, links, refresh.",
      "9. Re-export GSC the following week and re-run to measure impression/CTR/position deltas.",
      "10. Optionally run npm run seo:ai-visibility (measurement only).",
    ],
    systemFeeds: null,
    aiVisibility,
  };

  if (write) {
    const outJson =
      options.outJson ?? path.join(cwd, "data/seo/gsc-opportunities.json");
    const outMd =
      options.outMd ?? path.join(cwd, "docs/seo/GSC-OPPORTUNITIES.md");
    const outTop20 =
      options.outTop20 ?? path.join(cwd, "docs/seo/TOP-20-GROWTH-PAGES.md");

    report.systemFeeds = writeGscSystemFeeds(report, cwd);

    mkdirSync(path.dirname(outJson), { recursive: true });
    mkdirSync(path.dirname(outMd), { recursive: true });
    writeFileSync(outJson, JSON.stringify(report, null, 2) + "\n", "utf8");
    writeFileSync(outMd, formatGscOpportunitiesMarkdown(report), "utf8");
    writeFileSync(outTop20, formatTop20GrowthPagesMarkdown(report), "utf8");
  }

  return report;
}

function resolveLifecycleAndIndexable(
  pagePath: string,
  registryIndexable: boolean | null,
): { lifecycleState: string | null; seoIndexable: boolean | null } {
  const parts = pagePath.split("/").filter(Boolean);

  if (parts[0] === "guides" && parts[1]) {
    const override = getLifecycleOverrideState("guide", parts[1]);
    const guide = getGuideBySlug(parts[1], { includeUnpublished: true });
    const seedIndexable = guide?.seo?.indexable === true;
    const seoIndexable =
      override === "INDEXABLE"
        ? true
        : override
          ? false
          : seedIndexable
            ? true
            : registryIndexable === true
              ? true
              : guide
                ? false
                : registryIndexable;
    const lifecycleState =
      override ??
      (seoIndexable ? "INDEXABLE" : guide ? "IMPROVE" : null);
    return { lifecycleState, seoIndexable };
  }

  if (parts[0] === "compare" && parts[1]) {
    const override = getLifecycleOverrideState("comparison", parts[1]);
    const comparison = getComparisonBySlug(parts[1], {
      includeUnpublished: true,
    });
    const seedIndexable = comparison?.seo?.indexable === true;
    const seoIndexable =
      override === "INDEXABLE"
        ? true
        : override
          ? false
          : seedIndexable
            ? true
            : registryIndexable === true
              ? true
              : comparison
                ? false
                : registryIndexable;
    const lifecycleState =
      override ??
      (seoIndexable ? "INDEXABLE" : comparison ? "IMPROVE" : null);
    return { lifecycleState, seoIndexable };
  }

  return {
    lifecycleState: null,
    seoIndexable: registryIndexable,
  };
}

function inferFallbackType(p: string): string {
  if (p.startsWith("/software/")) return "product-review";
  if (p.startsWith("/compare/")) return "comparison";
  if (p.startsWith("/best/")) return "best";
  if (p.startsWith("/guides/")) return "guide";
  if (p.startsWith("/industries/")) return "industry";
  if (p.startsWith("/categories/")) return "category-hub";
  if (p.startsWith("/alternatives/")) return "alternatives";
  if (p.startsWith("/pricing/")) return "pricing";
  if (p.startsWith("/tools/")) return "tool-landing";
  return "unknown";
}

function extractSlug(p: string, segment: string): string[] {
  const parts = p.split("/").filter(Boolean);
  if (parts[0] === segment && parts[1]) return [parts[1]];
  return [];
}

export function writeGscOpportunityOutputs(
  report: GscOpportunityReport,
  paths: { json: string; md: string; top20: string },
): void {
  mkdirSync(path.dirname(paths.json), { recursive: true });
  mkdirSync(path.dirname(paths.md), { recursive: true });
  writeFileSync(paths.json, JSON.stringify(report, null, 2) + "\n", "utf8");
  writeFileSync(paths.md, formatGscOpportunitiesMarkdown(report), "utf8");
  writeFileSync(
    paths.top20,
    formatTop20GrowthPagesMarkdown(report),
    "utf8",
  );
}
