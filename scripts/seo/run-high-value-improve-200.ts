#!/usr/bin/env npx tsx
/**
 * Next 200 highest-value EXISTING weak pages.
 *
 *   npm run seo:high-value-improve-200
 *   npm run seo:high-value-improve-200 -- --apply --promote
 *   npm run seo:high-value-improve-200 -- --apply --promote --from-batch 3
 *
 * Batches of 25. Never creates URLs. Factory origin total is not a target.
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { getComparisonBySlug, getSoftwareBySlug } from "@/data";
import { getGuideBySlug } from "@/data/repositories/guides";
import {
  analyzePageQualityGate,
  recordGateResult,
  type AnalyzePageRef,
} from "@/services/content-quality/gate";
import {
  assessComparisonSemanticTemplateRisk,
  assessGuideSemanticTemplateRisk,
} from "@/services/content-quality/gate/semantic-template";
import { analyzeKnowledgeGraph } from "@/services/seo/knowledge-graph";
import { runCompareEnrichmentBatch } from "@/services/seo/compare-enrichment";
import { runGuideEnrichmentBatch } from "@/services/seo/guide-enrichment";
import { mergeGuideWithOverlay } from "@/services/seo/guide-enrichment/overlay-merge";
import { loadGuideEnrichmentOverlay } from "@/services/seo/guide-enrichment/overlay-store";
import { mergeComparisonWithOverlay } from "@/services/seo/compare-enrichment/overlay-merge";
import { loadCompareEnrichmentOverlay } from "@/services/seo/compare-enrichment/overlay-store";
import { runSoftwareEnrichmentBatch } from "@/services/seo/software-enrichment";
import { runImproveBatchLinking } from "@/services/seo/improve-linking";
import type { BatchPageRef } from "@/services/seo/improve-linking/types";
import {
  loadContentLifecycleStoreFromDisk,
  persistContentLifecycleStore,
} from "@/services/seo/content-lifecycle/store-write";
import { getLifecycleOverrideState } from "@/services/seo/content-lifecycle/store";
import { runGuidesIndexAudit } from "@/services/seo/guides-index-worthiness";
import type { FactoryRemediationKpis } from "@/services/seo/guides-index-worthiness";
import { selectHighValueWeakPages } from "@/services/seo/high-value-improve/select";
import type { HighValuePage } from "@/services/seo/high-value-improve/select";
import { writeGuidesAuditOutputs } from "@/services/seo/guides-index-worthiness/report";
import { runGrowthDashboard } from "@/services/seo/growth-dashboard";

const ROOT = process.cwd();
const WAVE_ID = "high-value-improve-200-2026-09-10";
const OUT_DIR = path.join(ROOT, "data/seo/batches", WAVE_ID);
const MD_PATH = path.join(ROOT, "docs/seo", `HIGH-VALUE-IMPROVE-200-2026-09-10.md`);
const BATCH_SIZE = 25;
const LIMIT = 200;

function argFlag(args: string[], name: string): boolean {
  return args.includes(name);
}
function argValue(args: string[], name: string): string | undefined {
  const i = args.indexOf(name);
  if (i === -1) return undefined;
  return args[i + 1];
}

function pageType(kind: HighValuePage["kind"]): AnalyzePageRef["pageType"] {
  if (kind === "guide") return "guide";
  if (kind === "comparison") return "comparison";
  if (kind === "software") return "software";
  if (kind === "best") return "best";
  return "category";
}

function qualityOf(kind: HighValuePage["kind"], slug: string): number | null {
  try {
    return analyzePageQualityGate({ pageType: pageType(kind), slug })?.qualityScore ?? null;
  } catch {
    return null;
  }
}

function semanticOf(kind: HighValuePage["kind"], slug: string): string | null {
  try {
    if (kind === "guide") {
      const g = getGuideBySlug(slug, { includeUnpublished: true });
      if (!g) return null;
      const ov = loadGuideEnrichmentOverlay(slug);
      const merged = ov ? mergeGuideWithOverlay(g, ov) : g;
      return assessGuideSemanticTemplateRisk(merged).riskLevel;
    }
    if (kind === "comparison") {
      const c = getComparisonBySlug(slug);
      if (!c) return null;
      const ov = loadCompareEnrichmentOverlay(slug);
      const merged = ov ? mergeComparisonWithOverlay(c, ov) : c;
      return assessComparisonSemanticTemplateRisk(merged).riskLevel;
    }
  } catch {
    return null;
  }
  return null;
}

type PageOutcome = {
  path: string;
  kind: string;
  slug: string;
  bucket: string;
  applied: boolean;
  materiallyImproved: boolean;
  promoted: boolean;
  stayedImprove: boolean;
  qualityFailure: boolean;
  semanticFailure: boolean;
  dataBlocker: boolean;
  qualityBefore: number | null;
  qualityAfter: number | null;
  semanticBefore: string | null;
  semanticAfter: string | null;
};

function snapshotFactory(): FactoryRemediationKpis {
  const audit = runGuidesIndexAudit();
  writeGuidesAuditOutputs(audit);
  return audit.summary.factoryKpis;
}

function orphansFromKg(): number {
  try {
    const kg = JSON.parse(
      readFileSync(path.join(ROOT, "data/seo/knowledge-graph.json"), "utf8"),
    ) as { summary?: { improveOrphans?: number } };
    return kg.summary?.improveOrphans ?? 0;
  } catch {
    return 0;
  }
}

function writeReport(payload: Record<string, unknown>): void {
  writeFileSync(path.join(OUT_DIR, "summary.json"), `${JSON.stringify(payload, null, 2)}\n`);
  const kpis = payload.kpis as {
    before: FactoryRemediationKpis;
    after: FactoryRemediationKpis;
  };
  const totals = payload.totals as Record<string, number>;
  const lines = [
    "# High-value existing-page improve — 200",
    "",
    `**Generated:** ${payload.generatedAt}`,
    `**Mode:** ${payload.mode}`,
    "",
    "FACTORY_ORIGIN_TOTAL is inventory — not a quality KPI.",
    "",
    "## Totals",
    "",
    `| Metric | Count |`,
    `| --- | ---: |`,
    `| Processed | ${totals.processed} |`,
    `| Materially improved | ${totals.materiallyImproved} |`,
    `| Promoted | ${totals.promoted} |`,
    `| Stayed IMPROVE | ${totals.stayedImprove} |`,
    `| Quality failures | ${totals.qualityFailures} |`,
    `| Semantic failures | ${totals.semanticFailures} |`,
    `| Data blockers | ${totals.dataBlockers} |`,
    "",
    "## Estate factory KPIs",
    "",
    `| KPI | Before | After |`,
    `| --- | ---: | ---: |`,
    `| FACTORY_ORIGIN_TOTAL | ${kpis.before.originTotal} | ${kpis.after.originTotal} |`,
    `| FACTORY_HIGH_RISK | ${kpis.before.highRisk} | ${kpis.after.highRisk} |`,
    `| FACTORY_LIMITED_UNIQUE | ${kpis.before.limitedUnique} | ${kpis.after.limitedUnique} |`,
    `| FACTORY_QUALITY_PASS | ${kpis.before.qualityPass} | ${kpis.after.qualityPass} |`,
    `| FACTORY_INDEXABLE | ${kpis.before.indexable} | ${kpis.after.indexable} |`,
    `| FACTORY_IMPROVE | ${kpis.before.improve} | ${kpis.after.improve} |`,
    `| FACTORY_PROMOTED | ${kpis.before.promoted} | ${kpis.after.promoted} |`,
    `| Semantic orphans (IMPROVE) | ${payload.orphansBefore} | ${payload.orphansAfter} |`,
    "",
  ];
  writeFileSync(MD_PATH, `${lines.join("\n")}\n`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const apply = argFlag(args, "--apply");
  const promote = argFlag(args, "--promote") || apply;
  const fromBatch = Number(argValue(args, "--from-batch") ?? "1");
  mkdirSync(OUT_DIR, { recursive: true });
  loadContentLifecycleStoreFromDisk();

  console.log("Selecting 200 existing weak pages…");
  const { selected, bandCounts } = selectHighValueWeakPages(LIMIT);
  writeFileSync(
    path.join(OUT_DIR, "selection.json"),
    `${JSON.stringify({ bandCounts, selected }, null, 2)}\n`,
  );
  console.log(`Selected ${selected.length}`, bandCounts);

  console.log("Baseline factory KPIs + knowledge graph…");
  const kpisBefore = snapshotFactory();
  analyzeKnowledgeGraph({ write: true });
  const orphansBefore = orphansFromKg();
  const allOutcomes: PageOutcome[] = [];
  const batchKpis: Array<{ batch: number; kpis: FactoryRemediationKpis }> = [
    { batch: 0, kpis: kpisBefore },
  ];

  const batches = Math.ceil(selected.length / BATCH_SIZE);
  for (let b = fromBatch; b <= batches; b++) {
    const slice = selected.slice((b - 1) * BATCH_SIZE, b * BATCH_SIZE);
    console.log(`\n=== Batch ${b}/${batches} (${slice.length}) ===`);
    const outcomes: PageOutcome[] = [];
    for (const p of slice) {
      outcomes.push({
        path: p.path,
        kind: p.kind,
        slug: p.slug,
        bucket: p.bucket,
        applied: false,
        materiallyImproved: false,
        promoted: false,
        stayedImprove: false,
        qualityFailure: false,
        semanticFailure: false,
        dataBlocker: false,
        qualityBefore: qualityOf(p.kind, p.slug),
        qualityAfter: null,
        semanticBefore: semanticOf(p.kind, p.slug),
        semanticAfter: null,
      });
    }

    if (apply) {
      const guides = slice.filter((p) => p.kind === "guide").map((p) => p.slug);
      const compares = slice.filter((p) => p.kind === "comparison").map((p) => p.slug);
      const software = slice.filter((p) => p.kind === "software").map((p) => p.slug);

      if (guides.length) {
        const g = runGuideEnrichmentBatch({
          slugs: guides,
          apply: true,
          promote,
          persistFamilyQa: true,
        });
        const promoted = new Set(g.promoted);
        const applied = new Set(g.applied.filter((a) => a.applied).map((a) => a.slug));
        const skipped = new Set(g.skippedPromotion.map((s) => s.slug));
        for (const o of outcomes.filter((x) => x.kind === "guide")) {
          o.applied = applied.has(o.slug);
          o.materiallyImproved = o.applied;
          o.promoted = promoted.has(o.slug);
          o.semanticFailure = skipped.has(o.slug) && (o.semanticBefore === "high" || o.semanticAfter === "high");
        }
      }
      if (compares.length) {
        const c = runCompareEnrichmentBatch({
          slugs: compares,
          apply: true,
          promote,
          persistFamilyQa: true,
        });
        const promoted = new Set(c.promoted);
        const applied = new Set(c.applied.filter((a) => a.applied).map((a) => a.slug));
        for (const o of outcomes.filter((x) => x.kind === "comparison")) {
          o.applied = applied.has(o.slug);
          o.materiallyImproved = o.applied;
          o.promoted = promoted.has(o.slug);
        }
      }
      if (software.length) {
        const s = runSoftwareEnrichmentBatch({ slugs: software });
        const applied = new Set(s.applied.filter((a) => a.applied).map((a) => a.slug));
        const improved = new Set(s.materiallyImproved);
        for (const o of outcomes.filter((x) => x.kind === "software")) {
          o.applied = applied.has(o.slug);
          o.materiallyImproved = improved.has(o.slug);
        }
      }

      const linkPages: BatchPageRef[] = slice.map((p) => ({
        pageType: p.kind,
        slug: p.slug,
        path: p.path,
      }));
      runImproveBatchLinking({
        batchId: `${WAVE_ID}-b${b}`,
        pages: linkPages,
        light: true,
        skipGraphSnapshots: true,
        minPerPage: 2,
        maxPerPage: 5,
      });

      for (const o of outcomes) {
        o.qualityAfter = qualityOf(o.kind as HighValuePage["kind"], o.slug);
        o.semanticAfter = semanticOf(o.kind as HighValuePage["kind"], o.slug);
        try {
          recordGateResult({
            pageType: pageType(o.kind as HighValuePage["kind"]),
            slug: o.slug,
          });
        } catch {
          /* keep going */
        }
        const life =
          o.kind === "guide" || o.kind === "comparison"
            ? getLifecycleOverrideState(o.kind as "guide" | "comparison", o.slug)
            : null;
        o.stayedImprove = life === "IMPROVE" || life === "IMPROVING" || (!o.promoted && o.kind !== "software");
        o.qualityFailure =
          o.qualityAfter != null &&
          o.qualityBefore != null &&
          o.qualityAfter < o.qualityBefore;
        o.semanticFailure =
          o.semanticFailure || o.semanticAfter === "high";
        if (o.kind === "software") {
          o.dataBlocker = !getSoftwareBySlug(o.slug);
        }
      }
      persistContentLifecycleStore();
      analyzeKnowledgeGraph({ write: true });
      if (b === batches || b % 4 === 0) {
        const kpis = snapshotFactory();
        batchKpis.push({ batch: b, kpis });
      }
    }

    allOutcomes.push(...outcomes);
    writeFileSync(
      path.join(OUT_DIR, `batch-${b}.json`),
      `${JSON.stringify({ batch: b, outcomes }, null, 2)}\n`,
    );
  }

  const kpisAfter = apply
    ? (batchKpis[batchKpis.length - 1]?.kpis ?? kpisBefore)
    : kpisBefore;
  if (apply) runGrowthDashboard();

  const totals = {
    processed: allOutcomes.length,
    materiallyImproved: allOutcomes.filter((o) => o.materiallyImproved).length,
    promoted: allOutcomes.filter((o) => o.promoted).length,
    stayedImprove: allOutcomes.filter((o) => o.stayedImprove).length,
    qualityFailures: allOutcomes.filter((o) => o.qualityFailure).length,
    semanticFailures: allOutcomes.filter((o) => o.semanticFailure).length,
    dataBlockers: allOutcomes.filter((o) => o.dataBlocker).length,
  };
  const orphansAfter = orphansFromKg();
  writeReport({
    generatedAt: new Date().toISOString(),
    mode: apply ? "apply+promote" : "plan",
    bandCounts,
    totals,
    kpis: { before: kpisBefore, after: kpisAfter },
    orphansBefore,
    orphansAfter,
    batchKpis,
  });
  console.log("Wrote", MD_PATH);
  console.log(totals);
  console.log("FACTORY_ORIGIN_TOTAL", kpisBefore.originTotal, "→", kpisAfter.originTotal);
  console.log("FACTORY_HIGH_RISK", kpisBefore.highRisk, "→", kpisAfter.highRisk);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
