#!/usr/bin/env npx tsx
/**
 * Lane A GSC improve — top 30 existing pages by hard position bands.
 *
 *   npm run seo:lane-a-gsc-improve-30
 *   npm run seo:lane-a-gsc-improve-30 -- --apply
 *   npm run seo:lane-a-gsc-improve-30 -- --apply --skip-gsc-refresh
 *
 * Priority (page-level GSC only):
 *   1. positions 8–20
 *   2. positions 21–30
 *   3. positions 31–50 with strong impressions
 *   4. high-impression commercial URLs deeper than 50
 *
 * Never invents Lane A, never uses inferred query mappings for rewrites,
 * avoids title churn unless snippet/CTR focus warrants it.
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {
  getAllBestPagesUnfiltered,
  getCategories,
  getComparisonBySlug,
  getSoftwareBySlug,
} from "@/data";
import { getGuideBySlug } from "@/data/repositories/guides";
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
import { getLifecycleOverrideState } from "@/services/seo/content-lifecycle/store";
import {
  loadContentLifecycleStoreFromDisk,
  persistContentLifecycleStore,
} from "@/services/seo/content-lifecycle/store-write";
import { runCompareEnrichmentBatch } from "@/services/seo/compare-enrichment";
import { runGuideEnrichmentBatch } from "@/services/seo/guide-enrichment";
import { runSoftwareEnrichmentBatch } from "@/services/seo/software-enrichment";
import { runImproveBatchLinking } from "@/services/seo/improve-linking";
import type { BatchPageRef } from "@/services/seo/improve-linking/types";
import { runEvidenceQuality } from "@/services/seo/evidence-quality";
import { runGrowthDashboard } from "@/services/seo/growth-dashboard";
import { mergeGuideWithOverlay } from "@/services/seo/guide-enrichment/overlay-merge";
import {
  loadGuideEnrichmentOverlay,
  saveGuideEnrichmentOverlay,
} from "@/services/seo/guide-enrichment/overlay-store";
import { mergeComparisonWithOverlay } from "@/services/seo/compare-enrichment/overlay-merge";
import { loadCompareEnrichmentOverlay } from "@/services/seo/compare-enrichment/overlay-store";
import {
  selectLaneAGscImprovePages,
  type LaneAPageKind,
  type LaneASelectedPage,
} from "@/services/seo/lane-a-gsc-improve/select";
import { analyzeGscOpportunities } from "@/services/seo/gsc-opportunity";

const ROOT = process.cwd();
const WAVE_DATE = new Date().toISOString().slice(0, 10);
const BATCH_ID = `lane-a-gsc-improve-30-${WAVE_DATE}`;
const OUT_DIR = path.join(ROOT, "data/seo/batches", BATCH_ID);
const MD_PATH = path.join(
  ROOT,
  "docs/seo",
  `LANE-A-GSC-IMPROVE-30-${WAVE_DATE}.md`,
);

type SeoSnapshot = {
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
};

type PageOutcome = {
  path: string;
  kind: LaneAPageKind;
  slug: string;
  band: string;
  focus: string;
  impressions: number;
  clicks: number;
  ctr: number;
  avgPosition: number;
  primaryAction: string;
  qualityBefore: number | null;
  qualityAfter: number | null;
  qualityDelta: number | null;
  seoBefore: SeoSnapshot;
  seoAfter: SeoSnapshot;
  titleChanged: boolean;
  metaChanged: boolean;
  contentImproved: boolean;
  dataImproved: boolean;
  evidenceImproved: boolean;
  linksAdded: number;
  promoted: boolean;
  stillImprove: boolean;
  semanticFailure: boolean;
  titleChurnReverted: boolean;
  dataBlocker: string | null;
  evidenceBlocker: string | null;
  promoteBlockers: string[];
  notes: string[];
};

function argFlag(args: string[], name: string): boolean {
  return args.includes(name);
}

function pageTypeRef(kind: LaneAPageKind): AnalyzePageRef["pageType"] {
  if (kind === "guide") return "guide";
  if (kind === "comparison") return "comparison";
  if (kind === "software") return "software";
  if (kind === "best") return "best";
  return "category";
}

function lifecycleKind(kind: LaneAPageKind): ContentLifecycleKind | null {
  if (kind === "guide" || kind === "comparison") return kind;
  return null;
}

function readQuality(kind: LaneAPageKind, slug: string): number | null {
  try {
    return (
      analyzePageQualityGate({ pageType: pageTypeRef(kind), slug })
        ?.qualityScore ?? null
    );
  } catch {
    return null;
  }
}

function isStillImprove(kind: LaneAPageKind, slug: string): boolean {
  const lk = lifecycleKind(kind);
  if (!lk) return false;
  const state = getLifecycleOverrideState(lk, slug);
  return state === "IMPROVE" || state === "MANUAL_REVIEW";
}

function measureSemantic(kind: LaneAPageKind, slug: string): string | null {
  try {
    if (kind === "guide") {
      const guide = getGuideBySlug(slug, { includeUnpublished: true });
      if (!guide) return null;
      const overlay = loadGuideEnrichmentOverlay(slug);
      const merged = overlay ? mergeGuideWithOverlay(guide, overlay) : guide;
      return assessGuideSemanticTemplateRisk(merged).level;
    }
    if (kind === "comparison") {
      const cmp = getComparisonBySlug(slug);
      if (!cmp) return null;
      const overlay = loadCompareEnrichmentOverlay(slug);
      const merged = overlay ? mergeComparisonWithOverlay(cmp, overlay) : cmp;
      return assessComparisonSemanticTemplateRisk(merged).level;
    }
  } catch {
    return null;
  }
  return null;
}

function readSeo(kind: LaneAPageKind, slug: string): SeoSnapshot {
  try {
    if (kind === "guide") {
      const guide = getGuideBySlug(slug, { includeUnpublished: true });
      if (!guide) return { title: null, metaDescription: null, h1: null };
      const overlay = loadGuideEnrichmentOverlay(slug);
      const merged = overlay ? mergeGuideWithOverlay(guide, overlay) : guide;
      return {
        title: merged.seo?.title ?? merged.title ?? null,
        metaDescription: merged.seo?.description ?? null,
        h1: merged.title ?? null,
      };
    }
    if (kind === "comparison") {
      const cmp = getComparisonBySlug(slug);
      if (!cmp) return { title: null, metaDescription: null, h1: null };
      const overlay = loadCompareEnrichmentOverlay(slug);
      const merged = overlay ? mergeComparisonWithOverlay(cmp, overlay) : cmp;
      return {
        title: merged.seo?.title ?? merged.title ?? null,
        metaDescription: merged.seo?.description ?? null,
        h1: merged.title ?? null,
      };
    }
    if (kind === "software") {
      const soft = getSoftwareBySlug(slug, { includeUnpublished: true });
      return {
        title: soft?.seo?.title ?? (soft ? `${soft.name} Review` : null),
        metaDescription: soft?.seo?.description ?? null,
        h1: soft?.name ?? null,
      };
    }
    if (kind === "best") {
      const page = getAllBestPagesUnfiltered().find((b) => b.slug === slug);
      return {
        title: page?.seo?.title ?? page?.title ?? null,
        metaDescription: page?.seo?.description ?? null,
        h1: page?.title ?? null,
      };
    }
    const cat = getCategories().find((c) => c.slug === slug);
    return {
      title: cat?.seo?.title ?? cat?.name ?? null,
      metaDescription: cat?.seo?.description ?? null,
      h1: cat?.name ?? null,
    };
  } catch {
    return { title: null, metaDescription: null, h1: null };
  }
}

function shouldAllowTitleChange(page: LaneASelectedPage): boolean {
  // Avoid title churn unless CTR/snippet focus (or explicit OPTIMIZE_TITLE).
  if (page.focus === "snippet") return true;
  if (page.primaryAction === "OPTIMIZE_TITLE") return true;
  if (page.primaryAction === "OPTIMIZE_TITLE_FOR_QUERY" && page.hasDirectQuery) {
    return true;
  }
  if (page.rootCauses.includes("POOR_CTR") || page.rootCauses.includes("TITLE_WEAK")) {
    return true;
  }
  // Strong rank + weak CTR
  if (page.avgPosition <= 20 && page.ctr < 0.02 && page.impressions >= 30) {
    return true;
  }
  return false;
}

function revertTitleChurn(page: LaneASelectedPage, before: SeoSnapshot): boolean {
  if (shouldAllowTitleChange(page)) return false;
  if (page.kind !== "guide") {
    // Compare overlays do not patch SEO title/meta; software/best reported only.
    return false;
  }
  const overlay = loadGuideEnrichmentOverlay(page.slug);
  if (!overlay) return false;
  const after = readSeo(page.kind, page.slug);
  if (
    after.title === before.title &&
    after.metaDescription === before.metaDescription
  ) {
    return false;
  }
  saveGuideEnrichmentOverlay({
    ...overlay,
    patch: {
      ...overlay.patch,
      seo: {
        ...(overlay.patch.seo ?? {}),
        ...(before.title != null ? { title: before.title } : {}),
        ...(before.metaDescription != null
          ? { description: before.metaDescription }
          : {}),
      },
    },
    updatedAt: new Date().toISOString(),
    notes: [
      ...overlay.notes,
      "Title/meta restored — avoid churn (substance/intent focus; page-level GSC only)",
    ],
  });
  return true;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const apply = argFlag(args, "--apply");
  const skipGscRefresh = argFlag(args, "--skip-gsc-refresh");
  const skipSeoAudit = argFlag(args, "--skip-seo-audit");

  loadContentLifecycleStoreFromDisk();
  mkdirSync(OUT_DIR, { recursive: true });

  if (!skipGscRefresh) {
    console.log("Refreshing GSC opportunity scores (real export only)…");
    try {
      analyzeGscOpportunities({});
    } catch (error) {
      console.warn(
        "GSC refresh warning:",
        error instanceof Error ? error.message : error,
      );
    }
  }

  const selection = selectLaneAGscImprovePages(30);
  const selected = selection.selected;

  console.log(
    `lane-a-gsc-improve-30 mode=${apply ? "APPLY" : "PLAN"} selected=${selected.length}`,
  );
  console.log(
    `  bands: 8-20=${selection.bandCounts["8-20"]} · 21-30=${selection.bandCounts["21-30"]} · 31-50=${selection.bandCounts["31-50"]} · 50+=${selection.bandCounts["50+-commercial"]} · fill=${selection.bandCounts["lane-a-fill"] ?? 0}`,
  );

  const gscBaseline = {
    generatedAt: new Date().toISOString(),
    batchId: BATCH_ID,
    provenance: selection.gscProvenance,
    note: "Store for later comparison after fresh GSC arrives. Do not invent deltas.",
    pages: selected.map((s) => ({
      path: s.path,
      kind: s.kind,
      slug: s.slug,
      band: s.band,
      impressions: s.impressions,
      clicks: s.clicks,
      ctr: s.ctr,
      avgPosition: s.avgPosition,
      opportunityScore: s.opportunityScore,
      primaryAction: s.primaryAction,
      rootCauses: s.rootCauses,
      focus: s.focus,
      hasDirectQuery: s.hasDirectQuery,
    })),
  };
  writeFileSync(
    path.join(OUT_DIR, "gsc-baseline.json"),
    `${JSON.stringify(gscBaseline, null, 2)}\n`,
  );
  writeFileSync(
    path.join(OUT_DIR, "selection.json"),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), ...selection }, null, 2)}\n`,
  );

  const outcomes: PageOutcome[] = [];
  for (const page of selected) {
    const qualityBefore = readQuality(page.kind, page.slug);
    const seoBefore = readSeo(page.kind, page.slug);
    if (qualityBefore != null && apply) {
      try {
        const gate = analyzePageQualityGate({
          pageType: pageTypeRef(page.kind),
          slug: page.slug,
        });
        if (gate) recordGateResult(gate);
      } catch {
        /* ignore */
      }
    }
    outcomes.push({
      path: page.path,
      kind: page.kind,
      slug: page.slug,
      band: page.band,
      focus: page.focus,
      impressions: page.impressions,
      clicks: page.clicks,
      ctr: page.ctr,
      avgPosition: page.avgPosition,
      primaryAction: page.primaryAction,
      qualityBefore,
      qualityAfter: null,
      qualityDelta: null,
      seoBefore,
      seoAfter: seoBefore,
      titleChanged: false,
      metaChanged: false,
      contentImproved: false,
      dataImproved: false,
      evidenceImproved: false,
      linksAdded: 0,
      promoted: false,
      stillImprove: isStillImprove(page.kind, page.slug),
      semanticFailure: false,
      titleChurnReverted: false,
      dataBlocker: null,
      evidenceBlocker: null,
      promoteBlockers: [],
      notes: [page.reason],
    });
  }

  let contentImproved = 0;
  let dataImproved = 0;
  let evidenceImproved = 0;
  let linksAdded = 0;
  let promoted = 0;
  const dataBlockers: string[] = [];
  const evidenceBlockers: string[] = [];

  const guides = selected.filter((s) => s.kind === "guide");
  const compares = selected.filter((s) => s.kind === "comparison");
  const softPages = selected.filter((s) => s.kind === "software");

  if (apply) {
    if (guides.length) {
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
        if (row.qa && !row.qa.ok) {
          o.notes.push(
            `Guide QA: ${row.qa.findings.map((f) => f.code).join(", ")}`,
          );
        }
      }
    }

    if (compares.length) {
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
        if (row.qa && !row.qa.ok) {
          o.notes.push(
            `Compare QA: ${row.qa.findings.map((f) => f.code).join(", ")}`,
          );
        }
      }
    }

    const softSlugs = softPages
      .map((s) => s.slug)
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
          o.dataImproved = Boolean(row.materiallyImproved);
          contentImproved += 1;
          if (row.materiallyImproved) dataImproved += 1;
        }
      }
      for (const fail of softBatch.failed) {
        dataBlockers.push(`${fail}: software enrich did not apply`);
        const o = outcomes.find((x) => x.slug === fail && x.kind === "software");
        if (o) o.dataBlocker = "software enrich did not apply";
      }
    }

    // Title churn guard — revert SEO title/meta when focus is substance/intent only
    for (const page of selected) {
      const o = outcomes.find((x) => x.path === page.path);
      if (!o) continue;
      const reverted = revertTitleChurn(page, o.seoBefore);
      if (reverted) {
        o.titleChurnReverted = true;
        o.notes.push("Title/meta churn reverted (substance/intent focus)");
      }
    }

    const productSlugs = new Set<string>(softSlugs);
    for (const c of compares) {
      const cmp = getComparisonBySlug(c.slug);
      for (const s of cmp?.productSlugs ?? []) productSlugs.add(s);
    }

    const evidence = await runEvidenceQuality({
      apply: true,
      limit: Math.min(40, Math.max(10, productSlugs.size || 10)),
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

    reconcileDataVerifiedCoverage();

    for (const o of outcomes) {
      o.seoAfter = readSeo(o.kind, o.slug);
      o.titleChanged = o.seoBefore.title !== o.seoAfter.title;
      o.metaChanged = o.seoBefore.metaDescription !== o.seoAfter.metaDescription;
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

    // Promotion pass (guides/compares only — quality + semantic gates)
    if (guides.length) {
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
          }
        }
      }
    }
    if (compares.length) {
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
          }
        }
      }
    }

    for (const o of outcomes) {
      o.stillImprove = isStillImprove(o.kind, o.slug);
      const risk = measureSemantic(o.kind, o.slug);
      if (risk === "high") o.semanticFailure = true;
    }

    persistContentLifecycleStore();

    if (!skipSeoAudit) {
      try {
        runGrowthDashboard();
      } catch (error) {
        console.warn(
          "Growth dashboard refresh skipped:",
          error instanceof Error ? error.message : error,
        );
      }
    }
  } else {
    for (const o of outcomes) {
      const prev = previousSnapshot(o.path)?.qualityScore ?? null;
      if (o.qualityBefore == null && prev != null) o.qualityBefore = prev;
    }
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

  const titleChanges = outcomes.filter((o) => o.titleChanged).length;
  const metaChanges = outcomes.filter((o) => o.metaChanged).length;
  const contentChanges = outcomes.filter((o) => o.contentImproved).length;
  const blockedEvidence = outcomes.filter(
    (o) => o.evidenceBlocker || o.dataBlocker,
  );

  const summary = {
    batchId: BATCH_ID,
    mode: apply ? "apply" : "plan",
    generatedAt: new Date().toISOString(),
    processed: selected.length,
    bandCounts: selection.bandCounts,
    titleChanges,
    metaChanges,
    contentChanges,
    linksAdded: apply ? linksAdded : 0,
    qualityDelta: avgQualityDelta,
    promoted: apply ? promoted : 0,
    stillImprove: outcomes.filter((o) => o.stillImprove).length,
    semanticFailures: outcomes.filter((o) => o.semanticFailure).length,
    titleChurnReverted: outcomes.filter((o) => o.titleChurnReverted).length,
    dataImproved: apply ? dataImproved : 0,
    evidenceImproved: apply ? evidenceImproved : 0,
    blockedByMissingEvidenceOrData: blockedEvidence.map((o) => ({
      path: o.path,
      dataBlocker: o.dataBlocker,
      evidenceBlocker: o.evidenceBlocker,
    })),
    gscBaselinePath: `data/seo/batches/${BATCH_ID}/gsc-baseline.json`,
  };

  writeFileSync(
    path.join(OUT_DIR, "outcomes.json"),
    `${JSON.stringify(outcomes, null, 2)}\n`,
  );
  writeFileSync(
    path.join(OUT_DIR, "summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
  );

  const md = [
    `# Lane A GSC improve 30 — ${WAVE_DATE}`,
    "",
    `Mode: **${apply ? "APPLY" : "PLAN"}** · Batch: \`${BATCH_ID}\``,
    "",
    "Existing URLs only. **Real page-level GSC.** Inferred query mappings are not used for direct content rewrites.",
    "",
    "## Selection priority",
    "",
    "1. positions 8–20",
    "2. positions 21–30",
    "3. positions 31–50 with strong impressions (≥50)",
    "4. high-impression commercial URLs deeper than 50 (≥150 imp)",
    "",
    `| Band | Count |`,
    `| --- | ---: |`,
    `| 8–20 | ${selection.bandCounts["8-20"] ?? 0} |`,
    `| 21–30 | ${selection.bandCounts["21-30"] ?? 0} |`,
    `| 31–50 | ${selection.bandCounts["31-50"] ?? 0} |`,
    `| 50+ commercial | ${selection.bandCounts["50+-commercial"] ?? 0} |`,
    `| Lane A fill | ${selection.bandCounts["lane-a-fill"] ?? 0} |`,
    "",
    selection.bandCounts["8-20"] === 0
      ? "_Note: current GSC export has **no** Lane A pages in positions 8–20 — filled from later bands._"
      : "",
    selection.bandCounts["lane-a-fill"]
      ? `_Fill: ${selection.bandCounts["lane-a-fill"]} extra Lane A commercial page(s) to reach 30 after excluding hub indexes._`
      : "",
    "",
    "## Outcomes",
    "",
    `| Metric | Value |`,
    `| --- | ---: |`,
    `| Processed | ${summary.processed} |`,
    `| Title changes | ${summary.titleChanges} |`,
    `| Meta changes | ${summary.metaChanges} |`,
    `| Content changes | ${summary.contentChanges} |`,
    `| Links added | ${summary.linksAdded} |`,
    `| Quality delta (avg) | ${summary.qualityDelta ?? "n/a"} |`,
    `| Promoted | ${summary.promoted} |`,
    `| Still IMPROVE | ${summary.stillImprove} |`,
    `| Title churn reverted | ${summary.titleChurnReverted} |`,
    `| Blocked (data/evidence) | ${summary.blockedByMissingEvidenceOrData.length} |`,
    "",
    `GSC baseline stored: \`${summary.gscBaselinePath}\` (compare after fresh GSC).`,
    "",
    "## Pages",
    "",
    ...outcomes.map((o) => {
      const bits = [
        `### \`${o.path}\``,
        "",
        `- Band **${o.band}** · focus **${o.focus}** · pos ${o.avgPosition.toFixed(1)} · ${o.impressions} imp · ${o.clicks} clicks · CTR ${(o.ctr * 100).toFixed(2)}%`,
        `- Action: ${o.primaryAction}`,
        `- Quality: ${o.qualityBefore ?? "?"} → ${o.qualityAfter ?? "n/a"} (Δ ${o.qualityDelta ?? "n/a"})`,
        `- Title changed: ${o.titleChanged}${o.titleChurnReverted ? " (reverted)" : ""} · Meta changed: ${o.metaChanged}`,
        `- Content: ${o.contentImproved} · Links: ${o.linksAdded} · Promoted: ${o.promoted} · Still IMPROVE: ${o.stillImprove}`,
      ];
      if (o.titleChanged && o.seoBefore.title !== o.seoAfter.title) {
        bits.push(`- Title: “${o.seoBefore.title ?? ""}” → “${o.seoAfter.title ?? ""}”`);
      }
      if (o.metaChanged) {
        bits.push(
          `- Meta: “${(o.seoBefore.metaDescription ?? "").slice(0, 80)}…” → “${(o.seoAfter.metaDescription ?? "").slice(0, 80)}…”`,
        );
      }
      if (o.dataBlocker || o.evidenceBlocker) {
        bits.push(
          `- **Blocked:** ${[o.dataBlocker, o.evidenceBlocker].filter(Boolean).join(" · ")}`,
        );
      }
      if (o.promoteBlockers.length) {
        bits.push(`- Promote blockers: ${o.promoteBlockers.join(", ")}`);
      }
      bits.push("");
      return bits.join("\n");
    }),
    "## Integrity",
    "",
    "- No new URLs created.",
    "- No fabricated HANDS_ON / revenue.",
    "- Title churn avoided unless snippet/CTR focus.",
    "- Query-scoped rewrites only when DIRECT_GSC (enrichment gates).",
    `- Artifacts: \`data/seo/batches/${BATCH_ID}/\``,
    "",
  ]
    .filter((line, i, arr) => !(line === "" && arr[i - 1] === ""))
    .join("\n");

  writeFileSync(MD_PATH, md, "utf8");

  console.log("\n=== LANE A GSC IMPROVE 30 ===");
  console.log(`Processed: ${summary.processed}`);
  console.log(`Title changes: ${summary.titleChanges}`);
  console.log(`Meta changes: ${summary.metaChanges}`);
  console.log(`Content changes: ${summary.contentChanges}`);
  console.log(`Links added: ${summary.linksAdded}`);
  console.log(`Quality delta: ${summary.qualityDelta ?? "n/a"}`);
  console.log(`Promoted: ${summary.promoted}`);
  console.log(
    `Blocked data/evidence: ${summary.blockedByMissingEvidenceOrData.length}`,
  );
  console.log(`\nWrote ${MD_PATH}`);
  console.log(`Baseline: ${path.join(OUT_DIR, "gsc-baseline.json")}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
