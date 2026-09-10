#!/usr/bin/env npx tsx
/**
 * FR-009 / FR3-018 — backfill guide→guide overlays into link-injections,
 * then verify growth-exec links: stored → plan (rendered) → KG edge → orphan.
 *
 *   npx tsx scripts/seo/verify-fr009-link-lifecycle.ts
 *   npx tsx scripts/seo/verify-fr009-link-lifecycle.ts --backfill-only
 *   npx tsx scripts/seo/verify-fr009-link-lifecycle.ts --base-url http://127.0.0.1:3000
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { getGuides } from "@/data/repositories/guides";
import { buildGuideLinkPlan } from "@/services/internal-linking/builders";
import { buildInjectionOnlyLinkPlan } from "@/services/internal-linking/builders";
import { flattenPlanLinks } from "@/services/internal-linking/select";
import { clearLinkInjectionsCache } from "@/services/internal-linking/link-injections";
import { clearCrmOutboundEdgeCache } from "@/services/internal-linking/outbound-graph";
import {
  clearAuthorityCaches,
  getOrphanReport,
  inboundStatsFromReport,
} from "@/services/seo/knowledge-graph/authority";
import { analyzeKnowledgeGraph } from "@/services/seo/knowledge-graph";
import { loadGuideEnrichmentOverlay } from "@/services/seo/guide-enrichment/overlay-store";
import { mergeGuideWithOverlay } from "@/services/seo/guide-enrichment/overlay-merge";
import { upsertLinkInjections } from "@/services/seo/improve-linking/injection-store";
import { moduleForTarget } from "@/services/seo/improve-linking/module-for-target";
import { identityPath, normalizePath } from "@/seo/canonical";

const ROOT = process.cwd();
const LINKING =
  "data/seo/batches/growth-exec-50-2026-09-09/linking.json";
const RELINK =
  "data/seo/batches/growth-exec-50-2026-09-09-relink-linking.json";
const OUT_DIR = "data/seo/batches/fr009-lifecycle-fix-2026-09-09";

type Applied = { fromPath: string; toPath: string; method: string };
type FailureClass =
  | "NOT_RENDERED"
  | "OVERLAY_NOT_CONSUMED"
  | "GRAPH_IGNORES_OVERLAY"
  | "INVALID_SOURCE"
  | "INVALID_TARGET"
  | "DUPLICATE_LINK"
  | "CACHE_STALE"
  | "REPORTING_BUG"
  | "OTHER"
  | "OK";

function loadApplied(): Applied[] {
  const files = [RELINK, LINKING].map((f) => path.join(ROOT, f));
  for (const f of files) {
    if (!existsSync(f)) continue;
    const raw = JSON.parse(readFileSync(f, "utf8"));
    const applied = (raw.applied ?? []) as Applied[];
    if (applied.length) return applied;
  }
  return [];
}

function backfillGuideOverlays(applied: Applied[]): number {
  const edges = [];
  for (const a of applied) {
    if (a.method !== "guide_overlay") continue;
    if (
      !a.fromPath.startsWith("/guides/") ||
      !a.toPath.startsWith("/guides/")
    ) {
      continue;
    }
    const toSlug = a.toPath.replace(/^\/guides\/|\/$/g, "");
    const g = getGuides({ includeUnpublished: true }).find(
      (x) => x.slug === toSlug,
    );
    edges.push({
      fromPath: identityPath(a.fromPath),
      toPath: identityPath(a.toPath),
      label: g?.title ?? toSlug,
      module: moduleForTarget(a.toPath),
      reason: "fr009-backfill:guide_overlay→injection",
      batchId: "fr009-lifecycle-backfill-2026-09-09",
      requireIndexable: false,
      score: 92,
    });
  }
  if (!edges.length) return 0;
  upsertLinkInjections(edges);
  return edges.length;
}

function planContains(fromPath: string, toPath: string): boolean {
  const from = identityPath(fromPath);
  const to = identityPath(toPath);
  try {
    if (from.startsWith("/guides/")) {
      const slug = from.replace(/^\/guides\/|\/$/g, "");
      const raw = getGuides({ includeUnpublished: true }).find(
        (g) => g.slug === slug,
      );
      if (!raw) return false;
      const overlay = loadGuideEnrichmentOverlay(slug);
      const merged = overlay ? mergeGuideWithOverlay(raw, overlay) : raw;
      return flattenPlanLinks(buildGuideLinkPlan(merged)).some(
        (l) => identityPath(l.href) === to,
      );
    }
    if (
      from.startsWith("/tools/") ||
      from.startsWith("/research/") ||
      from.startsWith("/industries/")
    ) {
      const type = from.startsWith("/tools/")
        ? "tool"
        : from.startsWith("/industries/")
          ? "industry"
          : "hub";
      return flattenPlanLinks(buildInjectionOnlyLinkPlan(from, type)).some(
        (l) => identityPath(l.href) === to,
      );
    }
  } catch {
    return false;
  }
  return false;
}

function overlayHas(fromPath: string, toPath: string): boolean {
  if (!fromPath.startsWith("/guides/") || !toPath.startsWith("/guides/")) {
    return false;
  }
  const fromSlug = fromPath.replace(/^\/guides\/|\/$/g, "");
  const toSlug = toPath.replace(/^\/guides\/|\/$/g, "");
  const overlay = loadGuideEnrichmentOverlay(fromSlug);
  return Boolean(overlay?.patch?.relatedGuideSlugs?.includes(toSlug));
}

async function liveHasLink(
  baseUrl: string,
  fromPath: string,
  toPath: string,
): Promise<{ ok: boolean; status: number; hrefFound: boolean }> {
  const url = new URL(fromPath, baseUrl).toString();
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "SoftwareGlimpse-FR009-verify" },
      redirect: "follow",
    });
    const html = await res.text();
    return { ok: res.ok, status: res.status, hrefFound: htmlHasHref(html, toPath) };
  } catch {
    return { ok: false, status: 0, hrefFound: false };
  }
}

function htmlHasHref(html: string, toPath: string): boolean {
  const variants = [
    toPath,
    toPath.replace(/\/$/, ""),
    toPath.replace(/^\//, ""),
  ];
  return variants.some(
    (v) =>
      html.includes(`href="${v}"`) ||
      html.includes(`href='${v}'`) ||
      html.includes(`href="${v}`) ||
      html.includes(`"${v}"`),
  );
}

/** SSG artifact check — reliable when live server is OOM'd by KG analyze. */
function staticHtmlHas(fromPath: string, toPath: string): boolean | null {
  const rel = fromPath.replace(/^\//, "").replace(/\/$/, "");
  const candidates = [
    path.join(ROOT, ".next/server/app", `${rel}.html`),
    path.join(ROOT, ".next/server/app", rel, "index.html"),
  ];
  for (const file of candidates) {
    if (!existsSync(file)) continue;
    try {
      return htmlHasHref(readFileSync(file, "utf8"), toPath);
    } catch {
      return null;
    }
  }
  return null;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const backfillOnly = args.includes("--backfill-only");
  const skipKgWrite = args.includes("--skip-kg-write");
  const baseIdx = args.indexOf("--base-url");
  const baseUrl =
    baseIdx >= 0 ? args[baseIdx + 1] : process.env.BASE_URL || "";

  const applied = loadApplied();
  console.log(`loaded applied links: ${applied.length}`);

  const backfilled = backfillGuideOverlays(applied);
  console.log(`backfilled guide_overlay → injections: ${backfilled}`);
  if (backfillOnly) return;

  clearLinkInjectionsCache();
  clearCrmOutboundEdgeCache();
  clearAuthorityCaches();

  // Sample ≥20 unique pairs (prefer mix of methods)
  const sample: Applied[] = [];
  const seen = new Set<string>();
  for (const prefer of ["link_injection", "guide_overlay"]) {
    for (const a of applied) {
      if (a.method !== prefer) continue;
      const k = `${a.fromPath}=>${a.toPath}`;
      if (seen.has(k)) continue;
      seen.add(k);
      sample.push(a);
      if (sample.length >= 24) break;
    }
    if (sample.length >= 24) break;
  }

  // Live / static HTML checks FIRST — before memory-heavy KG analyze.
  type LiveRow = {
    from: string;
    to: string;
    inOverlay: boolean;
    inPlan: boolean;
    staticHref: boolean | null;
    live: { ok: boolean; status: number; hrefFound: boolean } | null;
  };
  const preRows: LiveRow[] = [];
  for (const a of sample) {
    const from = identityPath(a.fromPath);
    const to = identityPath(a.toPath);
    const live = baseUrl ? await liveHasLink(baseUrl, from, to) : null;
    preRows.push({
      from,
      to,
      inOverlay: overlayHas(from, to),
      inPlan: planContains(from, to),
      staticHref: staticHtmlHas(from, to),
      live,
    });
  }
  const staticOk = preRows.filter((r) => r.staticHref === true).length;
  const liveOk = preRows.filter((r) => r.live?.hrefFound).length;
  console.log(
    `precheck: staticHref=${staticOk}/${preRows.length} liveHref=${liveOk}/${preRows.length}`,
  );

  const kg = analyzeKnowledgeGraph({
    write: !skipKgWrite,
    improveLimit: 80,
    lightQa: true,
  });
  const orphan = getOrphanReport();

  const byPath = new Map(
    kg.graph.nodes.map((n) => [normalizePath(n.path), n.id]),
  );
  const edgePairs = new Set(
    kg.graph.edges.map((e) => `${e.from}|${e.to}`),
  );

  const rows = [];
  let rendered = 0;
  let graphOk = 0;
  const classes: Record<string, number> = {};

  for (const a of sample) {
    const from = identityPath(a.fromPath);
    const to = identityPath(a.toPath);
    const pre = preRows.find((r) => r.from === from && r.to === to)!;
    const inOverlay = pre.inOverlay;
    const inPlan = pre.inPlan;
    const fromId = byPath.get(normalizePath(from));
    const toId = byPath.get(normalizePath(to));
    const graphEdge = Boolean(
      fromId && toId && edgePairs.has(`${fromId}|${toId}`),
    );
    const targetStats = inboundStatsFromReport(to, orphan);
    const live = pre.live;
    const staticHref = pre.staticHref;

    const effectivelyRendered =
      staticHref === true ||
      live?.hrefFound === true ||
      (staticHref == null && !live && inPlan);

    if (effectivelyRendered) rendered += 1;
    if (graphEdge) graphOk += 1;

    let failure: FailureClass = "OK";
    if (!fromId) failure = "INVALID_SOURCE";
    else if (!toId) failure = "INVALID_TARGET";
    else if (!inPlan && inOverlay) failure = "OVERLAY_NOT_CONSUMED";
    else if (!effectivelyRendered) failure = "NOT_RENDERED";
    else if (effectivelyRendered && !graphEdge) failure = "GRAPH_IGNORES_OVERLAY";
    else if (live && live.status > 0 && !live.ok) failure = "OTHER";

    classes[failure] = (classes[failure] ?? 0) + 1;

    rows.push({
      fromPath: from,
      toPath: to,
      method: a.method,
      storedInjectionOrOverlay: a.method === "link_injection" || inOverlay,
      inOverlay,
      inPlan,
      staticHref,
      liveStatus: live?.status ?? null,
      liveHrefFound: live?.hrefFound ?? null,
      graphEdge,
      targetOrphanStatus: targetStats.orphanStatus,
      targetContentInbound: targetStats.contentInboundCount,
      failure,
    });
  }

  // Lane A / READY orphan counts among improveInbound + selection targets
  const improveOrphans = kg.improveInbound.filter(
    (r) => r.orphanStatus === "orphan",
  ).length;

  const out = {
    generatedAt: new Date().toISOString(),
    linksExpected: applied.length,
    sampleSize: sample.length,
    linksRenderedInPlanOrLive: rendered,
    graphEdgesPresentInSample: graphOk,
    edgesBefore: 26853,
    edgesAfter: kg.summary.edges,
    semanticEdges: kg.summary.semanticEdges,
    contextualEdges: kg.summary.contextualEdges,
    orphansBefore: { improveSample: "80/80", note: "Review #3 baseline" },
    orphansAfter: {
      improveSampleOrphans: improveOrphans,
      improveSamplePages: kg.summary.improvePages,
    },
    staticHrefOk: staticOk,
    liveHrefOk: liveOk,
    failureClasses: classes,
    rows,
    kgSummary: kg.summary,
  };

  mkdirSync(path.join(ROOT, OUT_DIR), { recursive: true });
  writeFileSync(
    path.join(ROOT, OUT_DIR, "verification.json"),
    `${JSON.stringify(out, null, 2)}\n`,
  );

  console.log("\n=== FR-009 / FR3-018 verification ===");
  console.log(`Links expected: ${out.linksExpected}`);
  console.log(`Sample verified: ${out.sampleSize}`);
  console.log(`Links rendered (plan/live): ${out.linksRenderedInPlanOrLive}`);
  console.log(`Graph edges in sample: ${out.graphEdgesPresentInSample}`);
  console.log(`Edges before: ${out.edgesBefore}`);
  console.log(`Edges after: ${out.edgesAfter} (semantic ${out.semanticEdges} + contextual ${out.contextualEdges})`);
  console.log(
    `Orphans before: 80/80 · after: ${improveOrphans}/${kg.summary.improvePages}`,
  );
  console.log("Failure classes:", classes);
  console.log(`Wrote ${OUT_DIR}/verification.json`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
