#!/usr/bin/env npx tsx
/**
 * Growth execution batch — 50 EXISTING URLs combining
 * CONTENT + DATA + LINKING + EVIDENCE + PROMOTION.
 *
 *   npm run seo:growth-execution-batch-50
 *   npm run seo:growth-execution-batch-50 -- --apply
 *   npm run seo:growth-execution-batch-50 -- --repair-links
 *   npm run seo:growth-execution-batch-50 -- --apply --skip-seo-audit
 *
 * Target mix: 20 guides + 20 comparisons + 10 software/category/best.
 * Lane A (page-level GSC ≥10 impressions or clicks) first; fill with
 * demand-adjacent IMPROVE pages (Lane B). Never invents Lane A, URLs,
 * testing, or revenue.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import {
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getCategories,
  getSoftwareBySlug,
} from "@/data";
import { getGuides } from "@/data/repositories/guides";
import {
  analyzePageQualityGate,
  previousSnapshot,
  recordGateResult,
  type AnalyzePageRef,
} from "@/services/content-quality/gate";
import type { ContentLifecycleKind } from "@/services/seo/content-lifecycle/types";
import {
  assessComparisonSemanticTemplateRisk,
  assessGuideSemanticTemplateRisk,
} from "@/services/content-quality/gate/semantic-template";
import { reconcileDataVerifiedCoverage } from "@/services/editorial/pricing-verified-at";
import { loadGscOpportunitySignalsByPath } from "@/services/seo/gsc-opportunity/load-report";
import { runCompareEnrichmentBatch } from "@/services/seo/compare-enrichment";
import { buildCompareEnrichmentQueue } from "@/services/seo/compare-enrichment/queue";
import {
  getLifecycleOverrideState,
} from "@/services/seo/content-lifecycle/store";
import {
  loadContentLifecycleStoreFromDisk,
  persistContentLifecycleStore,
} from "@/services/seo/content-lifecycle/store-write";
import { runGuideEnrichmentBatch } from "@/services/seo/guide-enrichment";
import { buildGuideEnrichmentQueue } from "@/services/seo/guide-enrichment/queue";
import { runImproveBatchLinking } from "@/services/seo/improve-linking";
import type { BatchPageRef } from "@/services/seo/improve-linking/types";
import { runEvidenceQuality } from "@/services/seo/evidence-quality";
import { runSoftwareEnrichmentBatch } from "@/services/seo/software-enrichment";
import { runGrowthDashboard } from "@/services/seo/growth-dashboard";
import { identityPath } from "@/seo/canonical";
import { LANE_A_MIN_IMPRESSIONS } from "@/services/seo/enrichment-lanes/types";
import { mergeGuideWithOverlay } from "@/services/seo/guide-enrichment/overlay-merge";
import { loadGuideEnrichmentOverlay } from "@/services/seo/guide-enrichment/overlay-store";
import { mergeComparisonWithOverlay } from "@/services/seo/compare-enrichment/overlay-merge";
import { loadCompareEnrichmentOverlay } from "@/services/seo/compare-enrichment/overlay-store";
import { getGuideBySlug } from "@/data/repositories/guides";
import { getComparisonBySlug } from "@/data";

const ROOT = process.cwd();
const WAVE_DATE = new Date().toISOString().slice(0, 10);
const BATCH_ID = `growth-exec-50-${WAVE_DATE}`;
const OUT_DIR = path.join(ROOT, "data/seo/batches", BATCH_ID);
const MD_PATH = path.join(
  ROOT,
  "docs/seo",
  `GROWTH-EXECUTION-BATCH-50-${WAVE_DATE}.md`,
);

type PageKind = "guide" | "comparison" | "software" | "best" | "category";

type SelectedPage = {
  kind: PageKind;
  slug: string;
  path: string;
  lane: "A" | "B" | "C";
  reason: string;
  impressions: number;
};

type PageOutcome = {
  path: string;
  kind: PageKind;
  slug: string;
  lane: string;
  impressions: number;
  qualityBefore: number | null;
  qualityAfter: number | null;
  qualityDelta: number | null;
  semanticRiskBefore: string | null;
  semanticRiskAfter: string | null;
  contentImproved: boolean;
  dataImproved: boolean;
  evidenceImproved: boolean;
  linksAdded: number;
  promoted: boolean;
  stillImprove: boolean;
  semanticFailure: boolean;
  dataBlocker: string | null;
  evidenceBlocker: string | null;
  promoteBlockers: string[];
};

function argFlag(args: string[], name: string): boolean {
  return args.includes(name);
}

function selectBatch(): SelectedPage[] {
  const gsc = loadGscOpportunitySignalsByPath();
  const selected: SelectedPage[] = [];
  const used = new Set<string>();

  const push = (p: SelectedPage) => {
    if (used.has(p.path)) return;
    used.add(p.path);
    selected.push(p);
  };

  // --- Guides: Lane A page-level first, then IMPROVE demand-adjacent ---
  const guideDemand = getGuides({ includeUnpublished: true })
    .map((g) => {
      const p = identityPath(g.seo?.canonicalPath || `/guides/${g.slug}/`);
      const sig = gsc.get(p);
      return {
        slug: g.slug,
        path: p,
        imp: sig?.impressions ?? 0,
        clicks: sig?.clicks ?? 0,
      };
    })
    .filter((g) => g.imp >= LANE_A_MIN_IMPRESSIONS || g.clicks > 0)
    .sort((a, b) => b.imp - a.imp);

  for (const g of guideDemand) {
    if (selected.filter((s) => s.kind === "guide").length >= 20) break;
    push({
      kind: "guide",
      slug: g.slug,
      path: g.path,
      lane: "A",
      reason: `Lane A — page-level GSC ${g.imp} impressions`,
      impressions: g.imp,
    });
  }

  const topSoftware = [...gsc.entries()]
    .filter(([p]) => p.startsWith("/software/"))
    .sort((a, b) => (b[1].impressions ?? 0) - (a[1].impressions ?? 0))
    .slice(0, 25)
    .map(([p]) => p.replace(/^\/software\//, "").replace(/\/$/, ""));

  const guideQueue = buildGuideEnrichmentQueue({
    allocateByLane: false,
    limit: 200,
  });
  for (const item of guideQueue) {
    if (selected.filter((s) => s.kind === "guide").length >= 20) break;
    const productHint = topSoftware.find(
      (s) =>
        item.slug.includes(s) ||
        item.slug.startsWith(`${s}-`) ||
        item.slug.endsWith(`-${s}`),
    );
    if (!productHint && item.lane === "C") continue;
    const p = identityPath(`/guides/${item.slug}/`);
    push({
      kind: "guide",
      slug: item.slug,
      path: p,
      lane: item.lane === "A" ? "A" : "B",
      reason: productHint
        ? `Lane B — IMPROVE adjacent to Lane A software /${productHint}/`
        : `Lane ${item.lane} — IMPROVE enrichment queue (fill to 20 guides)`,
      impressions: gsc.get(p)?.impressions ?? 0,
    });
  }

  // --- Comparisons: Lane A page-level, then IMPROVE fill ---
  const compareDemand = getAllComparisonsUnfiltered()
    .map((c) => {
      const p = identityPath(c.seo?.canonicalPath || `/compare/${c.slug}/`);
      const sig = gsc.get(p);
      return {
        slug: c.slug,
        path: p,
        imp: sig?.impressions ?? 0,
        clicks: sig?.clicks ?? 0,
      };
    })
    .filter((c) => c.imp >= LANE_A_MIN_IMPRESSIONS || c.clicks > 0)
    .sort((a, b) => b.imp - a.imp);

  for (const c of compareDemand) {
    if (selected.filter((s) => s.kind === "comparison").length >= 20) break;
    push({
      kind: "comparison",
      slug: c.slug,
      path: c.path,
      lane: "A",
      reason: `Lane A — page-level GSC ${c.imp} impressions`,
      impressions: c.imp,
    });
  }

  const compareQueue = buildCompareEnrichmentQueue({
    allocateByLane: false,
    limit: 120,
  });
  for (const item of compareQueue) {
    if (selected.filter((s) => s.kind === "comparison").length >= 20) break;
    const p = identityPath(`/compare/${item.slug}/`);
    push({
      kind: "comparison",
      slug: item.slug,
      path: p,
      lane: item.lane === "A" ? "A" : "B",
      reason: `Lane ${item.lane} — IMPROVE compare queue (fill to 20)`,
      impressions: gsc.get(p)?.impressions ?? 0,
    });
  }

  // --- Hubs: 10 software / best / category with Lane A demand ---
  const hubCandidates: SelectedPage[] = [];
  for (const [rawPath, sig] of gsc.entries()) {
    const p = identityPath(rawPath);
    const imp = sig.impressions ?? 0;
    const clicks = sig.clicks ?? 0;
    if (imp < LANE_A_MIN_IMPRESSIONS && clicks <= 0) continue;
    let kind: PageKind | null = null;
    let slug = "";
    if (p.startsWith("/software/")) {
      kind = "software";
      slug = p.replace(/^\/software\//, "").replace(/\/$/, "");
    } else if (p.startsWith("/best/")) {
      kind = "best";
      slug = p.replace(/^\/best\//, "").replace(/\/$/, "");
    } else if (p.startsWith("/categories/")) {
      kind = "category";
      slug = p.replace(/^\/categories\//, "").replace(/\/$/, "");
    }
    if (!kind) continue;
    hubCandidates.push({
      kind,
      slug,
      path: p,
      lane: "A",
      reason: `Lane A — hub GSC ${imp} impressions`,
      impressions: imp,
    });
  }
  hubCandidates.sort((a, b) => b.impressions - a.impressions);

  // Prefer mix: ~7 software, ≥1 best, ≥1 category
  const soft = hubCandidates.filter((h) => h.kind === "software");
  const best = hubCandidates.filter((h) => h.kind === "best");
  const cats = hubCandidates.filter((h) => h.kind === "category");
  for (const h of soft.slice(0, 7)) push(h);
  for (const h of best.slice(0, 1)) push(h);
  for (const h of cats.slice(0, 2)) push(h);
  for (const h of hubCandidates) {
    if (selected.filter((s) => ["software", "best", "category"].includes(s.kind)).length >= 10) {
      break;
    }
    push(h);
  }

  // Ensure category/best exist even if GSC thin — use catalogue only as last resort Lane B
  if (selected.filter((s) => s.kind === "best").length === 0) {
    const b = getAllBestPagesUnfiltered().find((x) => x.slug === "crm-software");
    if (b) {
      push({
        kind: "best",
        slug: b.slug,
        path: identityPath(b.seo?.canonicalPath || `/best/${b.slug}/`),
        lane: "B",
        reason: "Lane B — strategic best page fill (crm-software)",
        impressions: gsc.get(identityPath(`/best/${b.slug}/`))?.impressions ?? 0,
      });
    }
  }
  if (selected.filter((s) => s.kind === "category").length === 0) {
    const c = getCategories().find((x) => x.slug === "crm");
    if (c) {
      push({
        kind: "category",
        slug: c.slug,
        path: identityPath(`/categories/${c.slug}/`),
        lane: "B",
        reason: "Lane B — strategic category fill (crm)",
        impressions: gsc.get(identityPath(`/categories/${c.slug}/`))?.impressions ?? 0,
      });
    }
  }

  return selected;
}

function pageTypeRef(kind: PageKind): AnalyzePageRef["pageType"] {
  if (kind === "guide") return "guide";
  if (kind === "comparison") return "comparison";
  if (kind === "software") return "software";
  if (kind === "best") return "best";
  return "category";
}

function lifecycleKind(kind: PageKind): ContentLifecycleKind | null {
  if (kind === "guide" || kind === "comparison") return kind;
  return null;
}

function readQuality(kind: PageKind, slug: string): number | null {
  try {
    const gate = analyzePageQualityGate({
      pageType: pageTypeRef(kind),
      slug,
    });
    return gate?.qualityScore ?? null;
  } catch {
    return null;
  }
}

function isStillImprove(kind: PageKind, slug: string): boolean {
  const lk = lifecycleKind(kind);
  if (!lk) return false;
  const state = getLifecycleOverrideState(lk, slug);
  return state === "IMPROVE" || state === "MANUAL_REVIEW";
}

function measureSemantic(
  kind: PageKind,
  slug: string,
): string | null {
  try {
    if (kind === "guide") {
      const guide = getGuideBySlug(slug, { includeUnpublished: true });
      if (!guide) return null;
      const overlay = loadGuideEnrichmentOverlay(slug);
      const merged = overlay ? mergeGuideWithOverlay(guide, overlay) : guide;
      const risk = assessGuideSemanticTemplateRisk(merged);
      return risk.level;
    }
    if (kind === "comparison") {
      const cmp = getComparisonBySlug(slug);
      if (!cmp) return null;
      const overlay = loadCompareEnrichmentOverlay(slug);
      const merged = overlay ? mergeComparisonWithOverlay(cmp, overlay) : cmp;
      const risk = assessComparisonSemanticTemplateRisk(merged);
      return risk.level;
    }
  } catch {
    return null;
  }
  return null;
}

async function repairLinksAndMetrics(): Promise<void> {
  loadContentLifecycleStoreFromDisk();
  const selectionPath = path.join(OUT_DIR, "selection.json");
  const outcomesPath = path.join(OUT_DIR, "outcomes.json");
  if (!existsSync(selectionPath) || !existsSync(outcomesPath)) {
    throw new Error(
      `Missing batch artifacts under ${OUT_DIR} — run --apply first`,
    );
  }

  const { selected } = JSON.parse(
    readFileSync(selectionPath, "utf8"),
  ) as { selected: SelectedPage[] };
  const outcomes = JSON.parse(
    readFileSync(outcomesPath, "utf8"),
  ) as PageOutcome[];

  console.log(
    `growth-exec-50 mode=REPAIR-LINKS selected=${selected.length}`,
  );

  for (const o of outcomes) {
    const prev = previousSnapshot(o.path)?.qualityScore ?? null;
    if (o.qualityBefore == null && prev != null) o.qualityBefore = prev;
    o.qualityAfter = readQuality(o.kind, o.slug);
    if (o.qualityBefore != null && o.qualityAfter != null) {
      o.qualityDelta = o.qualityAfter - o.qualityBefore;
    }
    o.stillImprove = isStillImprove(o.kind, o.slug);
    o.semanticRiskAfter = measureSemantic(o.kind, o.slug);
  }

  const linkPages: BatchPageRef[] = selected.map((s) => {
    const o = outcomes.find((x) => x.path === s.path);
    return {
      path: s.path,
      slug: s.slug,
      pageType: s.kind,
      beforeQuality: o?.qualityBefore ?? undefined,
      afterQuality: o?.qualityAfter ?? undefined,
      materiallyImproved: Boolean(o?.contentImproved || o?.dataImproved),
      lifecycleState:
        lifecycleKind(s.kind) != null
          ? (getLifecycleOverrideState(lifecycleKind(s.kind)!, s.slug) ??
            undefined)
          : undefined,
    };
  });

  const linking = runImproveBatchLinking({
    batchId: `${BATCH_ID}-relink`,
    pages: linkPages,
    light: true,
    skipGraphSnapshots: true,
    minPerPage: 2,
    maxPerPage: 5,
  });

  const linksByPath = new Map<string, number>();
  for (const a of linking.applied) {
    linksByPath.set(a.toPath, (linksByPath.get(a.toPath) ?? 0) + 1);
  }
  for (const o of outcomes) {
    o.linksAdded = linksByPath.get(o.path) ?? 0;
  }

  writeFileSync(
    path.join(OUT_DIR, "linking.json"),
    `${JSON.stringify(linking, null, 2)}\n`,
  );

  const guides = selected.filter((s) => s.kind === "guide");
  const compares = selected.filter((s) => s.kind === "comparison");
  const hubs = selected.filter((s) =>
    ["software", "best", "category"].includes(s.kind),
  );

  const priorSummaryPath = path.join(OUT_DIR, "summary.json");
  const priorSummary = existsSync(priorSummaryPath)
    ? (JSON.parse(readFileSync(priorSummaryPath, "utf8")) as {
        evidenceImproved?: number;
        evidenceBlockerSamples?: string[];
        dataBlockerSamples?: string[];
      })
    : {};

  const contentImproved = outcomes.filter((o) => o.contentImproved).length;
  const dataImproved = outcomes.filter((o) => o.dataImproved).length;
  const evidenceImproved =
    priorSummary.evidenceImproved ??
    outcomes.filter((o) => o.evidenceImproved).length;
  const promoted = outcomes.filter((o) => o.promoted).length;
  const stillImprove = outcomes.filter((o) => o.stillImprove).length;
  const semanticFailures = outcomes.filter((o) => o.semanticFailure).length;
  const dataBlockers =
    priorSummary.dataBlockerSamples?.length ??
    outcomes.filter((o) => o.dataBlocker).length;
  const evidenceBlockers =
    priorSummary.evidenceBlockerSamples?.length ??
    outcomes.filter((o) => o.evidenceBlocker).length;
  const linksAdded = linking.applied.length;

  const qualityDeltas = outcomes
    .map((o) => o.qualityDelta)
    .filter((d): d is number => d != null);
  const avgQualityDelta =
    qualityDeltas.length > 0
      ? Number(
          (
            qualityDeltas.reduce((a, b) => a + b, 0) / qualityDeltas.length
          ).toFixed(2),
        )
      : null;
  const promotionRate =
    selected.length > 0
      ? Number(((promoted / selected.length) * 100).toFixed(1))
      : 0;

  const summary = {
    batchId: BATCH_ID,
    mode: "apply+repair-links",
    generatedAt: new Date().toISOString(),
    processed: selected.length,
    mix: {
      guides: guides.length,
      comparisons: compares.length,
      hubs: hubs.length,
      laneA: selected.filter((s) => s.lane === "A").length,
      laneB: selected.filter((s) => s.lane === "B").length,
    },
    contentImproved,
    dataImproved,
    linksAdded,
    evidenceImproved,
    promoted,
    stillImprove,
    semanticFailures,
    dataBlockers,
    evidenceBlockers,
    qualityDelta: avgQualityDelta,
    promotionRate,
    dataBlockerSamples:
      priorSummary.dataBlockerSamples ??
      outcomes
        .filter((o) => o.dataBlocker)
        .map((o) => `${o.slug}: ${o.dataBlocker}`)
        .slice(0, 12),
    evidenceBlockerSamples:
      priorSummary.evidenceBlockerSamples ??
      outcomes
        .filter((o) => o.evidenceBlocker)
        .map((o) => `${o.slug}: ${o.evidenceBlocker}`)
        .slice(0, 12),
    linkingEligible: linking.plans.filter((p) => p.eligibility.eligible).length,
    linkingSkippedWeak: linking.metrics.skippedWeak,
    repairNote:
      "Re-ran quality measurement + contextual linking after fixing gate API (pageType/qualityScore).",
  };

  writeFileSync(
    path.join(OUT_DIR, "summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
  );
  writeFileSync(
    path.join(OUT_DIR, "outcomes.json"),
    `${JSON.stringify(outcomes, null, 2)}\n`,
  );

  const md = [
    `# Growth execution batch 50 — ${WAVE_DATE}`,
    "",
    `Mode: **APPLY** (+ linking repair) · Batch: \`${BATCH_ID}\``,
    "",
    "Combined CONTENT · DATA · LINKING · EVIDENCE · PROMOTION on **existing URLs only**.",
    "Lane A = page-level GSC demand. Remaining slots filled with demand-adjacent IMPROVE pages (Lane B) — never fake Lane A.",
    "",
    "## Outcomes",
    "",
    `| Metric | Value |`,
    `| --- | ---: |`,
    `| Processed | ${summary.processed} |`,
    `| Content improved | ${summary.contentImproved} |`,
    `| Data improved | ${summary.dataImproved} |`,
    `| Links added | ${summary.linksAdded} |`,
    `| Evidence improved | ${summary.evidenceImproved} |`,
    `| Promoted | ${summary.promoted} |`,
    `| Still improve | ${summary.stillImprove} |`,
    `| Semantic failures | ${summary.semanticFailures} |`,
    `| Data blockers | ${summary.dataBlockers} |`,
    `| Evidence blockers | ${summary.evidenceBlockers} |`,
    `| Quality delta (avg) | ${summary.qualityDelta ?? "n/a"} |`,
    `| Promotion rate | ${summary.promotionRate}% |`,
    "",
    `Mix: guides ${guides.length} · compares ${compares.length} · hubs ${hubs.length} · Lane A ${summary.mix.laneA} · Lane B ${summary.mix.laneB}`,
    "",
    `Linking: ${summary.linkingEligible} eligible · ${summary.linksAdded} applied · ${summary.linkingSkippedWeak} skipped weak`,
    "",
    "## Selection",
    "",
    ...selected.map(
      (s) =>
        `- \`${s.path}\` · ${s.kind} · Lane ${s.lane} · ${s.impressions} imp — ${s.reason}`,
    ),
    "",
    "## Notes",
    "",
    "- No new URLs created.",
    "- No fabricated HANDS_ON testing or revenue.",
    "- Quality gates unchanged; promotion only when canPromoteToIndexable passes.",
    "- Linking repair: first apply pass used wrong gate fields (`type`/`score`); repaired with `pageType`/`qualityScore`.",
    `- Artifacts: \`data/seo/batches/${BATCH_ID}/\``,
    "",
  ].join("\n");

  writeFileSync(MD_PATH, md, "utf8");

  console.log("\n=== GROWTH EXECUTION OUTCOMES (repaired) ===");
  console.log(`Processed: ${summary.processed}`);
  console.log(`Content improved: ${summary.contentImproved}`);
  console.log(`Data improved: ${summary.dataImproved}`);
  console.log(`Links added: ${summary.linksAdded}`);
  console.log(`Evidence improved: ${summary.evidenceImproved}`);
  console.log(`Promoted: ${summary.promoted}`);
  console.log(`Still improve: ${summary.stillImprove}`);
  console.log(`Semantic failures: ${summary.semanticFailures}`);
  console.log(`Data blockers: ${summary.dataBlockers}`);
  console.log(`Evidence blockers: ${summary.evidenceBlockers}`);
  console.log(`Quality delta: ${summary.qualityDelta ?? "n/a"}`);
  console.log(`Promotion rate: ${summary.promotionRate}%`);
  console.log(`Linking eligible: ${summary.linkingEligible}`);
  console.log(`\nWrote ${MD_PATH}`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (argFlag(args, "--repair-links")) {
    await repairLinksAndMetrics();
    return;
  }
  const apply = argFlag(args, "--apply");
  const skipSeoAudit = argFlag(args, "--skip-seo-audit");

  loadContentLifecycleStoreFromDisk();
  mkdirSync(OUT_DIR, { recursive: true });

  const selected = selectBatch();
  const guides = selected.filter((s) => s.kind === "guide");
  const compares = selected.filter((s) => s.kind === "comparison");
  const hubs = selected.filter((s) =>
    ["software", "best", "category"].includes(s.kind),
  );

  console.log(
    `growth-exec-50 mode=${apply ? "APPLY" : "PLAN"} selected=${selected.length} (guides=${guides.length} compares=${compares.length} hubs=${hubs.length})`,
  );
  console.log(
    `  Lane A: ${selected.filter((s) => s.lane === "A").length} · Lane B fill: ${selected.filter((s) => s.lane === "B").length}`,
  );

  writeFileSync(
    path.join(OUT_DIR, "selection.json"),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), selected }, null, 2)}\n`,
  );

  // Baselines
  const outcomes: PageOutcome[] = [];
  for (const page of selected) {
    const qualityBefore = readQuality(page.kind, page.slug);
    if (qualityBefore != null) {
      try {
        const gate = analyzePageQualityGate({
          pageType: pageTypeRef(page.kind),
          slug: page.slug,
        });
        if (gate && apply) recordGateResult(gate);
      } catch {
        /* ignore */
      }
    }
    outcomes.push({
      path: page.path,
      kind: page.kind,
      slug: page.slug,
      lane: page.lane,
      impressions: page.impressions,
      qualityBefore,
      qualityAfter: null,
      qualityDelta: null,
      semanticRiskBefore: measureSemantic(page.kind, page.slug),
      semanticRiskAfter: null,
      contentImproved: false,
      dataImproved: false,
      evidenceImproved: false,
      linksAdded: 0,
      promoted: false,
      stillImprove: isStillImprove(page.kind, page.slug),
      semanticFailure: false,
      dataBlocker: null,
      evidenceBlocker: null,
      promoteBlockers: [],
    });
  }

  let contentImproved = 0;
  let dataImproved = 0;
  let evidenceImproved = 0;
  let linksAdded = 0;
  let promoted = 0;
  let stillImprove = 0;
  let semanticFailures = 0;
  const dataBlockers: string[] = [];
  const evidenceBlockers: string[] = [];

  if (apply) {
    // CONTENT — guides
    const guideBatch = runGuideEnrichmentBatch({
      batchSize: guides.length,
      apply: true,
      promote: false,
      slugs: guides.map((g) => g.slug),
    });
    for (const row of guideBatch.applied) {
      const o = outcomes.find((x) => x.slug === row.slug && x.kind === "guide");
      if (!o) continue;
      if (row.applied) {
        o.contentImproved = true;
        contentImproved += 1;
      }
    }

    // CONTENT — comparisons
    const compareBatch = runCompareEnrichmentBatch({
      batchSize: compares.length,
      apply: true,
      promote: false,
      slugs: compares.map((c) => c.slug),
    });
    for (const row of compareBatch.applied) {
      const o = outcomes.find(
        (x) => x.slug === row.slug && x.kind === "comparison",
      );
      if (!o) continue;
      if (row.applied) {
        o.contentImproved = true;
        contentImproved += 1;
      }
    }

    // CONTENT / DATA — software hubs (best/category skip software enrich)
    const softSlugs = hubs
      .filter((h) => h.kind === "software")
      .map((h) => h.slug)
      .filter((s) => Boolean(getSoftwareBySlug(s, { includeUnpublished: true })));
    if (softSlugs.length) {
      const softBatch = runSoftwareEnrichmentBatch({ slugs: softSlugs });
      for (const row of softBatch.applied) {
        const o = outcomes.find(
          (x) => x.slug === row.slug && x.kind === "software",
        );
        if (!o) continue;
        if (row.applied) {
          o.contentImproved = true;
          o.dataImproved = true;
          contentImproved += 1;
          dataImproved += 1;
        }
      }
      for (const fail of softBatch.failed) {
        dataBlockers.push(`${fail}: software enrich did not apply`);
        const o = outcomes.find((x) => x.slug === fail);
        if (o) o.dataBlocker = "software enrich did not apply";
      }
    }

    // EVIDENCE — related products from software + compare/guide product hints
    const productSlugs = new Set<string>(softSlugs);
    for (const c of compares) {
      const cmp = getComparisonBySlug(c.slug);
      for (const s of cmp?.productSlugs ?? []) productSlugs.add(s);
    }
    for (const g of guides) {
      const softHit = softSlugs.find(
        (s) => g.slug.includes(s) || g.slug.startsWith(`${s}-`),
      );
      if (softHit) productSlugs.add(softHit);
      const m =
        g.slug.match(/^is-(.+)-worth-it$/) ||
        g.slug.match(/^(.+)-(?:plans|setup|implementation|migration)$/);
      if (m?.[1] && getSoftwareBySlug(m[1], { includeUnpublished: true })) {
        productSlugs.add(m[1]);
      }
    }

    const evidence = await runEvidenceQuality({
      apply: true,
      limit: Math.min(40, Math.max(10, productSlugs.size)),
      slugs: [...productSlugs].slice(0, 40),
      waveId: `${BATCH_ID}-evidence`,
      writeArtifacts: true,
    });
    evidenceImproved = evidence.promotedToDataVerified;
    for (const pack of evidence.packs) {
      if (pack.promotedToDataVerified) {
        const o = outcomes.find(
          (x) => x.kind === "software" && x.slug === pack.slug,
        );
        if (o) o.evidenceImproved = true;
      } else if (
        pack.pricingVerification &&
        !pack.pricingVerification.verified &&
        pack.pricingVerification.rejectReason
      ) {
        const reason = pack.pricingVerification.rejectReason;
        evidenceBlockers.push(`${pack.slug}: ${reason}`);
        const o = outcomes.find(
          (x) => x.kind === "software" && x.slug === pack.slug,
        );
        if (o) o.evidenceBlocker = reason;
      }
    }

    // Reconcile DATA_VERIFIED (honest — no fabricated stamps)
    reconcileDataVerifiedCoverage();

    // LINKING — after content/data so afterQuality reflects improvements
    for (const o of outcomes) {
      o.qualityAfter = readQuality(o.kind, o.slug);
      if (o.qualityBefore != null && o.qualityAfter != null) {
        o.qualityDelta = o.qualityAfter - o.qualityBefore;
      }
      try {
        const gate = analyzePageQualityGate({
          pageType: pageTypeRef(o.kind),
          slug: o.slug,
        });
        if (gate) recordGateResult(gate);
      } catch {
        /* ignore */
      }
    }

    const linkPages: BatchPageRef[] = selected.map((s) => {
      const o = outcomes.find((x) => x.path === s.path);
      return {
        path: s.path,
        slug: s.slug,
        pageType: s.kind,
        beforeQuality: o?.qualityBefore ?? undefined,
        afterQuality: o?.qualityAfter ?? o?.qualityBefore ?? undefined,
        materiallyImproved: o?.contentImproved || o?.dataImproved || false,
        lifecycleState:
          lifecycleKind(s.kind) != null
            ? (getLifecycleOverrideState(lifecycleKind(s.kind)!, s.slug) ??
              undefined)
            : undefined,
      };
    });
    const linking = runImproveBatchLinking({
      batchId: BATCH_ID,
      pages: linkPages,
      light: true,
      skipGraphSnapshots: true,
      minPerPage: 2,
      maxPerPage: 5,
    });
    linksAdded = linking.applied.length;
    const linksByPath = new Map<string, number>();
    for (const a of linking.applied) {
      linksByPath.set(a.toPath, (linksByPath.get(a.toPath) ?? 0) + 1);
    }
    for (const o of outcomes) {
      o.linksAdded = linksByPath.get(o.path) ?? 0;
    }
    writeFileSync(
      path.join(OUT_DIR, "linking.json"),
      `${JSON.stringify(linking, null, 2)}\n`,
    );

    // SEMANTIC QA + QUALITY GATE + PROMOTION
    const guidePromote = runGuideEnrichmentBatch({
      batchSize: guides.length,
      apply: false,
      promote: true,
      slugs: guides.map((g) => g.slug),
    });
    for (const slug of guidePromote.promoted) {
      const o = outcomes.find((x) => x.slug === slug && x.kind === "guide");
      if (o) {
        o.promoted = true;
        promoted += 1;
      }
    }
    for (const skip of guidePromote.skippedPromotion) {
      const o = outcomes.find((x) => x.slug === skip.slug && x.kind === "guide");
      if (o) {
        o.promoteBlockers = skip.reasons;
        if (skip.reasons.some((r) => /SEMANTIC/i.test(r))) {
          o.semanticFailure = true;
          semanticFailures += 1;
        }
      }
    }

    const comparePromote = runCompareEnrichmentBatch({
      batchSize: compares.length,
      apply: false,
      promote: true,
      slugs: compares.map((c) => c.slug),
    });
    for (const slug of comparePromote.promoted) {
      const o = outcomes.find(
        (x) => x.slug === slug && x.kind === "comparison",
      );
      if (o) {
        o.promoted = true;
        promoted += 1;
      }
    }
    for (const skip of comparePromote.skippedPromotion) {
      const o = outcomes.find(
        (x) => x.slug === skip.slug && x.kind === "comparison",
      );
      if (o) {
        o.promoteBlockers = skip.reasons;
        if (skip.reasons.some((r) => /SEMANTIC/i.test(r))) {
          o.semanticFailure = true;
          semanticFailures += 1;
        }
      }
    }

    persistContentLifecycleStore();

    // Post quality / semantic (refresh after promote)
    stillImprove = 0;
    for (const o of outcomes) {
      o.qualityAfter = readQuality(o.kind, o.slug);
      if (o.qualityBefore != null && o.qualityAfter != null) {
        o.qualityDelta = o.qualityAfter - o.qualityBefore;
      }
      o.semanticRiskAfter = measureSemantic(o.kind, o.slug);
      if (
        o.semanticRiskAfter === "high" &&
        o.semanticRiskBefore !== "high"
      ) {
        o.semanticFailure = true;
      }
      o.stillImprove = isStillImprove(o.kind, o.slug);
      if (o.stillImprove) stillImprove += 1;
    }
  } else {
    stillImprove = outcomes.filter((o) => o.stillImprove).length;
  }

  const qualityDeltas = outcomes
    .map((o) => o.qualityDelta)
    .filter((d): d is number => d != null);
  const avgQualityDelta =
    qualityDeltas.length > 0
      ? Number(
          (
            qualityDeltas.reduce((a, b) => a + b, 0) / qualityDeltas.length
          ).toFixed(2),
        )
      : null;
  const promotionRate =
    selected.length > 0
      ? Number(((promoted / selected.length) * 100).toFixed(1))
      : 0;

  const summary = {
    batchId: BATCH_ID,
    mode: apply ? "apply" : "plan",
    generatedAt: new Date().toISOString(),
    processed: selected.length,
    mix: {
      guides: guides.length,
      comparisons: compares.length,
      hubs: hubs.length,
      laneA: selected.filter((s) => s.lane === "A").length,
      laneB: selected.filter((s) => s.lane === "B").length,
    },
    contentImproved,
    dataImproved,
    linksAdded,
    evidenceImproved,
    promoted,
    stillImprove,
    semanticFailures,
    dataBlockers: dataBlockers.length,
    evidenceBlockers: evidenceBlockers.length,
    qualityDelta: avgQualityDelta,
    promotionRate,
    dataBlockerSamples: dataBlockers.slice(0, 12),
    evidenceBlockerSamples: evidenceBlockers.slice(0, 12),
    skipSeoAudit,
  };

  writeFileSync(
    path.join(OUT_DIR, "summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
  );
  writeFileSync(
    path.join(OUT_DIR, "outcomes.json"),
    `${JSON.stringify(outcomes, null, 2)}\n`,
  );

  const md = [
    `# Growth execution batch 50 — ${WAVE_DATE}`,
    "",
    `Mode: **${apply ? "APPLY" : "PLAN"}** · Batch: \`${BATCH_ID}\``,
    "",
    "Combined CONTENT · DATA · LINKING · EVIDENCE · PROMOTION on **existing URLs only**.",
    "Lane A = page-level GSC demand. Remaining slots filled with demand-adjacent IMPROVE pages (Lane B) — never fake Lane A.",
    "",
    "## Outcomes",
    "",
    `| Metric | Value |`,
    `| --- | ---: |`,
    `| Processed | ${summary.processed} |`,
    `| Content improved | ${summary.contentImproved} |`,
    `| Data improved | ${summary.dataImproved} |`,
    `| Links added | ${summary.linksAdded} |`,
    `| Evidence improved | ${summary.evidenceImproved} |`,
    `| Promoted | ${summary.promoted} |`,
    `| Still improve | ${summary.stillImprove} |`,
    `| Semantic failures | ${summary.semanticFailures} |`,
    `| Data blockers | ${summary.dataBlockers} |`,
    `| Evidence blockers | ${summary.evidenceBlockers} |`,
    `| Quality delta (avg) | ${summary.qualityDelta ?? "n/a"} |`,
    `| Promotion rate | ${summary.promotionRate}% |`,
    "",
    `Mix: guides ${guides.length} · compares ${compares.length} · hubs ${hubs.length} · Lane A ${summary.mix.laneA} · Lane B ${summary.mix.laneB}`,
    "",
    "## Selection",
    "",
    ...selected.map(
      (s) =>
        `- \`${s.path}\` · ${s.kind} · Lane ${s.lane} · ${s.impressions} imp — ${s.reason}`,
    ),
    "",
    "## Notes",
    "",
    "- No new URLs created.",
    "- No fabricated HANDS_ON testing or revenue.",
    "- Quality gates unchanged; promotion only when canPromoteToIndexable passes.",
    `- Artifacts: \`data/seo/batches/${BATCH_ID}/\``,
    "",
  ].join("\n");

  writeFileSync(MD_PATH, md, "utf8");

  if (apply) {
    try {
      runGrowthDashboard({ write: true });
    } catch (e) {
      console.warn("growth-dashboard refresh failed:", e);
    }
  }

  console.log("\n=== GROWTH EXECUTION OUTCOMES ===");
  console.log(`Processed: ${summary.processed}`);
  console.log(`Content improved: ${summary.contentImproved}`);
  console.log(`Data improved: ${summary.dataImproved}`);
  console.log(`Links added: ${summary.linksAdded}`);
  console.log(`Evidence improved: ${summary.evidenceImproved}`);
  console.log(`Promoted: ${summary.promoted}`);
  console.log(`Still improve: ${summary.stillImprove}`);
  console.log(`Semantic failures: ${summary.semanticFailures}`);
  console.log(`Data blockers: ${summary.dataBlockers}`);
  console.log(`Evidence blockers: ${summary.evidenceBlockers}`);
  console.log(`Quality delta: ${summary.qualityDelta ?? "n/a"}`);
  console.log(`Promotion rate: ${summary.promotionRate}%`);
  console.log(`\nWrote ${MD_PATH}`);
  console.log(`Wrote ${path.join(OUT_DIR, "summary.json")}`);

  if (!apply) {
    console.log("\nRe-run with --apply to execute improvements.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
