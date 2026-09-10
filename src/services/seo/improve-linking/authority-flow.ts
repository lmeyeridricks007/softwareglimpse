/**
 * FR-009 authority-flow selection: INDEXABLE_READY, Lane A IMPROVE orphans,
 * recently enriched high-quality pages — never mass-link weak long-tail.
 */

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  getAllBestPagesUnfiltered,
  getAlternativesPageBySlug,
  getCategoryBySlug,
  getSoftware,
  getUseCases,
} from "@/data";
import { getGuideBySlug } from "@/data/repositories/guides";
import { getComparisonBySlug } from "@/data";
import { isEntityIndexable } from "@/domain/quality-gates";
import { identityPath } from "@/seo/canonical";
import {
  classifyEnrichmentLane,
  loadExternalEnrichmentEvidence,
} from "@/services/seo/enrichment-lanes";
import { loadGscOpportunitySignalsByPath } from "@/services/seo/gsc-opportunity/load-report";
import { analyzeKnowledgeGraph } from "@/services/seo/knowledge-graph/analyze";
import { buildKnowledgeGraph } from "@/services/seo/knowledge-graph/build-graph";
import {
  clearAuthorityCaches,
  getOrphanReport,
  inboundStatsFromReport,
} from "@/services/seo/knowledge-graph/authority";
import { clearCrmOutboundEdgeCache } from "@/services/internal-linking/outbound-graph";
import { buildCategoryHubSections } from "@/services/seo/knowledge-graph/hub-sections";
import {
  collectCrmOutboundEdges,
} from "@/services/internal-linking/outbound-graph";
import type { BatchPageRef } from "@/services/seo/improve-linking/types";
import {
  getContentLifecycleStoreSnapshot,
  getLifecycleEntry,
} from "@/services/seo/content-lifecycle/store";
import { loadContentLifecycleStoreFromDisk } from "@/services/seo/content-lifecycle/store-write";
import {
  categorySharedToolHref,
} from "@/data/config/tools/category-tool-meta";
import type { LinkInjectionEdge } from "@/services/internal-linking/link-injections";
import { moduleForTarget } from "@/services/seo/improve-linking/module-for-target";

export type AuthorityFlowTarget = BatchPageRef & {
  priority: "INDEXABLE_READY" | "LANE_A" | "RECENT_ENRICHED" | "STRUCTURAL_ORPHAN";
  orphanStatus: string;
  inboundCount: number;
  lane: string;
  selectionReason: string;
};

function pageTypeFromPath(p: string): string {
  if (p.startsWith("/guides/")) return "guide";
  if (p.startsWith("/compare/")) return "comparison";
  if (p.startsWith("/software/")) return "software";
  if (p.startsWith("/best/")) return "best";
  if (p.startsWith("/alternatives/")) return "alternatives";
  if (p.startsWith("/use-cases/")) return "use-case";
  if (p.startsWith("/categories/")) return "category";
  return "other";
}

function slugFromPath(p: string): string {
  return p.replace(/\/$/, "").split("/").pop() ?? "";
}

function loadRecentEnrichedPaths(root: string): Set<string> {
  const out = new Set<string>();
  const batches = path.join(root, "data/seo/batches");
  if (!existsSync(batches)) return out;
  for (const name of readdirSync(batches)) {
    if (
      !name.startsWith("compare-rehab-") &&
      !name.startsWith("factory-pack-") &&
      !name.startsWith("guide-rehab-") &&
      !name.startsWith("improve-wave-")
    ) {
      continue;
    }
    const selected = path.join(batches, name, "selected.json");
    const summary = path.join(batches, name, "summary.json");
    const wave = path.join(batches, name, "wave-report.json");
    for (const file of [selected, summary, wave]) {
      if (!existsSync(file)) continue;
      try {
        const raw = JSON.parse(readFileSync(file, "utf8")) as {
          pages?: Array<{ slug?: string; path?: string; promoted?: boolean }>;
          selected?: Array<{ slug?: string; path?: string }>;
        };
        const rows = raw.pages ?? raw.selected ?? [];
        for (const r of rows) {
          if (r.path) out.add(identityPath(r.path));
          else if (r.slug) {
            if (name.includes("compare")) out.add(`/compare/${r.slug}/`);
            else out.add(`/guides/${r.slug}/`);
          }
        }
      } catch {
        // ignore
      }
    }
  }
  return out;
}

function laneForPath(p: string): { lane: string; overall: number } {
  const gscByPath = loadGscOpportunitySignalsByPath();
  const external = loadExternalEnrichmentEvidence();
  const gsc = gscByPath.get(identityPath(p));
  const pageType = pageTypeFromPath(p);
  const slug = slugFromPath(p);
  let categoryImportance = 25;
  const productPopularity = 8;
  let commercialRelevance = 10;
  let importantBuyerQuestion = false;
  let competitorRelationship = false;

  if (pageType === "guide") {
    const g = getGuideBySlug(slug, { includeUnpublished: true });
    categoryImportance =
      { crm: 100, "sales-intelligence": 90, "email-marketing": 85 }[
        g?.categorySlugs?.[0] ?? ""
      ] ?? 30;
    importantBuyerQuestion = true;
  } else if (pageType === "best") {
    const b = getAllBestPagesUnfiltered().find((x) => x.slug === slug);
    categoryImportance =
      { crm: 100, "sales-intelligence": 90, "email-marketing": 85 }[
        b?.categorySlug ?? ""
      ] ?? 40;
    importantBuyerQuestion = true;
    commercialRelevance = 22;
  } else if (pageType === "comparison") {
    competitorRelationship = true;
    importantBuyerQuestion = true;
    commercialRelevance = 24;
  }

  const lane = classifyEnrichmentLane({
    gsc: {
      impressions: gsc?.impressions ?? 0,
      clicks: gsc?.clicks ?? 0,
      position: gsc?.position ?? null,
      opportunityScore: gsc?.opportunityScore ?? 0,
      hasDirectQuery: gsc?.hasDirectQuery,
      knownBacklinks: external.backlinksByPath.get(identityPath(p)) ?? 0,
      realAiCitations: external.aiCitationsByPath.get(identityPath(p)) ?? 0,
    },
    strategic: {
      categoryImportance,
      productPopularity,
      commercialRelevance,
      internalJourneyStrength: 14,
      competitorRelationship,
      importantBuyerQuestion,
    },
    qualityGap: 20,
  });
  return { lane: lane.lane, overall: lane.overallScore };
}

/**
 * Select FR-009 linking targets.
 * Priority: ALL INDEXABLE_READY → ALL Lane A IMPROVE/demand pages needing
 * inbound → recent enriched high-value → capped structural orphans.
 * Never mass-link weak long-tail IMPROVE.
 */
export function selectAuthorityFlowTargets(opts: {
  limit?: number;
  cwd?: string;
  /** Cap on structural best/alt/use-case orphans (default 20). */
  structuralCap?: number;
} = {}): {
  targets: AuthorityFlowTarget[];
  before: {
    improveOrphans: number;
    improvePages: number;
    nodes: number;
    edges: number;
    laneAOrphans: number;
    readyOrphans: number;
    targetOrphans: number;
    targetWeakInbound: number;
  };
  kg: ReturnType<typeof analyzeKnowledgeGraph>;
} {
  loadContentLifecycleStoreFromDisk();
  const cwd = opts.cwd ?? process.cwd();
  const limit = opts.limit ?? 120;
  const structuralCap = opts.structuralCap ?? 20;
  const kg = analyzeKnowledgeGraph({
    write: false,
    improveLimit: 80,
    lightQa: false,
  });

  clearCrmOutboundEdgeCache();
  clearAuthorityCaches();
  const orphanReport = getOrphanReport();
  const recent = loadRecentEnrichedPaths(cwd);
  const gscByPath = loadGscOpportunitySignalsByPath();
  const targets: AuthorityFlowTarget[] = [];
  const seen = new Set<string>();

  function push(
    p: string,
    priority: AuthorityFlowTarget["priority"],
    orphanStatus: string,
    inboundCount: number,
    reason: string,
  ) {
    const pathKey = identityPath(p);
    if (seen.has(pathKey)) return;
    const pageType = pageTypeFromPath(pathKey);
    if (pageType === "other") return;
    const slug = slugFromPath(pathKey);
    const { lane, overall } = laneForPath(pathKey);
    const life =
      pageType === "guide" || pageType === "comparison"
        ? getLifecycleEntry(
            pageType === "guide" ? "guide" : "comparison",
            slug,
          )?.lifecycle
        : undefined;

    seen.add(pathKey);
    targets.push({
      pageType,
      slug,
      path: pathKey,
      beforeQuality: 78,
      afterQuality: 82,
      materiallyImproved: true,
      uniqueValueCount: 3,
      lifecycleState: life ?? "IMPROVE",
      stillBlocked: false,
      priority,
      orphanStatus,
      inboundCount,
      lane,
      selectionReason: `${reason} (lane ${lane}, score ${Math.round(overall)})`,
    });
  }

  function needsInbound(stats: {
    orphanStatus: string;
    contentInboundCount: number;
  }, minInbound = 2): boolean {
    return (
      stats.orphanStatus === "orphan" ||
      stats.orphanStatus === "chrome-only" ||
      stats.contentInboundCount < minInbound
    );
  }

  // 1) ALL INDEXABLE_READY from lifecycle store (not just KG sample)
  const store = getContentLifecycleStoreSnapshot();
  for (const entry of Object.values(store.entries)) {
    if (entry.lifecycle !== "INDEXABLE_READY") continue;
    const p =
      entry.kind === "guide"
        ? `/guides/${entry.slug}/`
        : entry.kind === "comparison"
          ? `/compare/${entry.slug}/`
          : null;
    if (!p) continue;
    const stats = inboundStatsFromReport(p, orphanReport);
    if (!needsInbound(stats, 2)) continue;
    push(
      p,
      "INDEXABLE_READY",
      stats.orphanStatus,
      stats.contentInboundCount,
      "INDEXABLE_READY needs ≥2 contextual inbound",
    );
  }

  // Also catch READY rows still present in improveInbound sample
  for (const row of kg.improveInbound) {
    const lifeGuide = getLifecycleEntry("guide", slugFromPath(row.path));
    const lifeCmp = getLifecycleEntry("comparison", slugFromPath(row.path));
    const ready =
      lifeGuide?.lifecycle === "INDEXABLE_READY" ||
      lifeCmp?.lifecycle === "INDEXABLE_READY";
    if (!ready) continue;
    if (row.orphanStatus === "orphan" || row.contentInboundCount < 2) {
      push(
        row.path,
        "INDEXABLE_READY",
        row.orphanStatus,
        row.contentInboundCount,
        "INDEXABLE_READY needs inbound",
      );
    }
  }

  // 2) ALL Lane A pages with GSC demand that need inbound
  // Prefer IMPROVE lifecycle; also include high-impression INDEXABLE with <2 inbound
  // (latest Lane A opportunity set ≈ indexed improvement + top ranked).
  const laneACandidates = [...gscByPath.entries()]
    .map(([p, signal]) => {
      const { lane, overall } = laneForPath(p);
      return { path: p, signal, lane, overall };
    })
    .filter((c) => c.lane === "A" && (c.signal.impressions ?? 0) > 0)
    .sort(
      (a, b) =>
        (b.signal.impressions ?? 0) - (a.signal.impressions ?? 0) ||
        b.overall - a.overall,
    );

  for (const c of laneACandidates) {
    const pageType = pageTypeFromPath(c.path);
    if (pageType === "other") continue;
    const slug = slugFromPath(c.path);
    const life =
      pageType === "guide"
        ? getLifecycleEntry("guide", slug)?.lifecycle
        : pageType === "comparison"
          ? getLifecycleEntry("comparison", slug)?.lifecycle
          : undefined;
    // Focus IMPROVE + weak INDEXABLE hubs — skip already well-linked INDEXABLE
    const stats = inboundStatsFromReport(c.path, orphanReport);
    if (!needsInbound(stats, 2)) continue;
    if (life === "INDEXABLE" && stats.contentInboundCount >= 2) continue;
    push(
      c.path,
      "LANE_A",
      stats.orphanStatus,
      stats.contentInboundCount,
      `Lane A GSC demand (${c.signal.impressions} imp, pos ${c.signal.position ?? "—"})`,
    );
  }

  // Lane A IMPROVE orphans from KG sample (backup)
  for (const row of kg.improveInbound) {
    if (row.orphanStatus !== "orphan" && row.contentInboundCount >= 2) continue;
    const { lane } = laneForPath(row.path);
    if (lane !== "A") continue;
    push(
      row.path,
      "LANE_A",
      row.orphanStatus,
      row.contentInboundCount,
      "Lane A IMPROVE orphan/weak (sample)",
    );
  }

  // 3) Recently enriched high-quality pages still weakly linked
  for (const recentPath of recent) {
    const stats = inboundStatsFromReport(recentPath, orphanReport);
    if (!needsInbound(stats, 2)) continue;
    const { lane } = laneForPath(recentPath);
    // Prefer Lane A/B enriched; skip pure Lane C long-tail unless orphan
    if (lane === "C" && stats.orphanStatus !== "orphan") continue;
    push(
      recentPath,
      "RECENT_ENRICHED",
      stats.orphanStatus,
      stats.contentInboundCount,
      "Recently enriched still weakly linked",
    );
  }

  // 4) Structural orphans — capped so they cannot crowd out Lane A / READY
  const graph = buildKnowledgeGraph();
  let structuralAdded = 0;
  for (const node of graph.nodes) {
    if (structuralAdded >= structuralCap) break;
    if (
      !node.improveLifecycle &&
      node.kind !== "best" &&
      node.kind !== "alternatives" &&
      node.kind !== "use_case"
    ) {
      continue;
    }
    const p = identityPath(node.path);
    if (
      !p.startsWith("/best/") &&
      !p.startsWith("/alternatives/") &&
      !p.startsWith("/use-cases/")
    ) {
      continue;
    }
    const stats = inboundStatsFromReport(p, orphanReport);
    if (!needsInbound(stats, 2)) continue;
    if (p.startsWith("/best/")) {
      const slug = slugFromPath(p);
      const best = getAllBestPagesUnfiltered().find((b) => b.slug === slug);
      if (best?.categorySlug && getCategoryBySlug(best.categorySlug)) {
        push(
          p,
          "STRUCTURAL_ORPHAN",
          stats.orphanStatus,
          stats.contentInboundCount,
          `Best shortlist for ${best.categorySlug}`,
        );
        structuralAdded += 1;
      }
    } else if (p.startsWith("/alternatives/")) {
      const alt = getAlternativesPageBySlug(slugFromPath(p), {
        includeUnpublished: true,
      });
      if (alt?.sourceSlug) {
        push(
          p,
          "STRUCTURAL_ORPHAN",
          stats.orphanStatus,
          stats.contentInboundCount,
          `Alternatives for ${alt.sourceSlug}`,
        );
        structuralAdded += 1;
      }
    } else if (p.startsWith("/use-cases/")) {
      const uc = getUseCases().find((u) => u.slug === slugFromPath(p));
      if (uc?.categorySlugs?.[0]) {
        push(
          p,
          "STRUCTURAL_ORPHAN",
          stats.orphanStatus,
          stats.contentInboundCount,
          `Use case under ${uc.categorySlugs[0]}`,
        );
        structuralAdded += 1;
      }
    }
  }

  const priorityOrder = {
    INDEXABLE_READY: 0,
    LANE_A: 1,
    RECENT_ENRICHED: 2,
    STRUCTURAL_ORPHAN: 3,
  } as const;

  targets.sort(
    (a, b) =>
      priorityOrder[a.priority] - priorityOrder[b.priority] ||
      a.inboundCount - b.inboundCount,
  );

  // Never drop READY / Lane A for limit — take all of them, then fill
  const must = targets.filter(
    (t) => t.priority === "INDEXABLE_READY" || t.priority === "LANE_A",
  );
  const rest = targets.filter(
    (t) => t.priority !== "INDEXABLE_READY" && t.priority !== "LANE_A",
  );
  const selected = [
    ...must,
    ...rest.slice(0, Math.max(0, limit - must.length)),
  ];

  const laneAOrphans = selected.filter(
    (t) => t.priority === "LANE_A" && t.orphanStatus === "orphan",
  ).length;
  const readyOrphans = selected.filter(
    (t) => t.priority === "INDEXABLE_READY" && t.orphanStatus === "orphan",
  ).length;
  const targetOrphans = selected.filter(
    (t) => t.orphanStatus === "orphan",
  ).length;
  const targetWeakInbound = selected.filter(
    (t) => t.inboundCount < 2,
  ).length;

  return {
    targets: selected,
    before: {
      improveOrphans: kg.summary.improveOrphans,
      improvePages: kg.summary.improvePages,
      nodes: kg.summary.nodes,
      edges: kg.summary.edges,
      laneAOrphans,
      readyOrphans,
      targetOrphans,
      targetWeakInbound,
    },
    kg,
  };
}

/**
 * High-authority hubs that lack journey next-steps → inject outbound edges.
 */
export function planAuthorityHoarderOutbounds(
  kg: ReturnType<typeof analyzeKnowledgeGraph>,
): LinkInjectionEdge[] {
  const edges: LinkInjectionEdge[] = [];
  const existing = new Set(
    collectCrmOutboundEdges().map(
      (e) => `${identityPath(e.from)}=>${identityPath(e.to)}`,
    ),
  );

  for (const hub of kg.authorityTop.slice(0, 20)) {
    const from = identityPath(hub.path);
    const nexts: Array<{ href: string; label: string }> = [];

    if (from.startsWith("/categories/")) {
      const catSlug = slugFromPath(from);
      const sections = buildCategoryHubSections(catSlug);
      for (const sec of sections) {
        for (const link of sec.links.slice(0, 3)) {
          nexts.push({ href: link.href, label: link.label });
        }
      }
      const finder = categorySharedToolHref(catSlug, "finder");
      if (finder) nexts.push({ href: finder, label: `${catSlug} finder` });
      const best = getAllBestPagesUnfiltered().find(
        (b) => b.categorySlug === catSlug,
      );
      if (best) {
        nexts.push({ href: `/best/${best.slug}/`, label: best.title });
      }
    } else if (from.startsWith("/best/")) {
      const best = getAllBestPagesUnfiltered().find(
        (b) => b.slug === slugFromPath(from),
      );
      if (best?.categorySlug) {
        nexts.push({
          href: `/categories/${best.categorySlug}/`,
          label: "Category hub",
        });
        const finder = categorySharedToolHref(best.categorySlug, "finder");
        if (finder) nexts.push({ href: finder, label: "Finder" });
        for (const soft of getSoftware()
          .filter((s) => s.primaryCategorySlug === best.categorySlug)
          .filter((s) => isEntityIndexable({ kind: "software", entity: s }))
          .slice(0, 3)) {
          nexts.push({ href: `/software/${soft.slug}/`, label: soft.name });
        }
      }
    } else if (from.startsWith("/guides/")) {
      const guide = getGuideBySlug(slugFromPath(from), {
        includeUnpublished: true,
      });
      if (guide?.categorySlugs[0]) {
        const cat = guide.categorySlugs[0];
        nexts.push({ href: `/categories/${cat}/`, label: "Category hub" });
        nexts.push({ href: `/best/${cat}-software/`, label: "Shortlist" });
        const finder = categorySharedToolHref(cat, "finder");
        if (finder) nexts.push({ href: finder, label: "Finder" });
      }
      for (const ps of guide?.productSlugs.slice(0, 2) ?? []) {
        nexts.push({ href: `/software/${ps}/`, label: ps });
      }
    } else if (from.startsWith("/software/")) {
      const soft = getSoftware().find((s) => s.slug === slugFromPath(from));
      if (!soft) continue;
      nexts.push({
        href: `/categories/${soft.primaryCategorySlug}/`,
        label: "Category",
      });
      nexts.push({
        href: `/software/${soft.slug}/pricing/`,
        label: "Pricing",
      });
      nexts.push({
        href: `/alternatives/${soft.slug}/`,
        label: "Alternatives",
      });
      const cmp = getComparisonBySlug(`${soft.slug}-vs-hubspot`) ||
        getComparisonBySlug(`hubspot-vs-${soft.slug}`);
      if (cmp) {
        nexts.push({ href: `/compare/${cmp.slug}/`, label: cmp.title });
      }
    }

    let added = 0;
    for (const n of nexts) {
      if (added >= 4) break;
      const to = identityPath(n.href);
      if (to === from) continue;
      const key = `${from}=>${to}`;
      if (existing.has(key)) continue;
      existing.add(key);
      edges.push({
        fromPath: from,
        toPath: to,
        label: n.label,
        module: moduleForTarget(to),
        score: Math.round(hub.score),
        reason: `FR-009 authority next-step: ${n.label}`,
        batchId: "fr009-authority-flow",
      });
      added += 1;
    }
  }

  return edges;
}
