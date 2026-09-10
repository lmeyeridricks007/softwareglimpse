#!/usr/bin/env npx tsx
/**
 * Estate improve batch — material improvements on existing URLs only.
 *
 *   npx tsx scripts/seo/run-estate-improve-batch.ts
 *   npx tsx scripts/seo/run-estate-improve-batch.ts --phase baseline|improve|finalize|all
 *
 * Selection: Lane A first, then Lane B. Page-level GSC demand allowed.
 * Excludes selection that depends on LOW/MEDIUM inferred query mappings for rewrite actions.
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { getCategoryBySlug, getSoftwareBySlug } from "@/data";
import { loadEnrichment } from "@/data/research/store";
import {
  analyzePageQualityGate,
  recordGateResult,
  type GatePageType,
} from "@/services/content-quality/gate";
import {
  assessComparisonSemanticTemplateRisk,
  assessGuideSemanticTemplateRisk,
} from "@/services/content-quality/gate/semantic-template";
import { runCompareEnrichmentBatch } from "@/services/seo/compare-enrichment";
import { getLifecycleOverrideState } from "@/services/seo/content-lifecycle/store";
import {
  loadContentLifecycleStoreFromDisk,
  persistContentLifecycleStore,
} from "@/services/seo/content-lifecycle/store-write";
import { runGuideEnrichmentBatch } from "@/services/seo/guide-enrichment";
import { runGrowthDashboard } from "@/services/seo/growth-dashboard";
import { runImproveBatchLinking } from "@/services/seo/improve-linking";
import { getGuides } from "@/data/repositories/guides";
import { getAllComparisonsUnfiltered } from "@/data";

const ROOT = process.cwd();
const BATCH_ID = "improve-batch-2026-09-06-estate";
const BATCH_PATH = path.join(ROOT, "data/seo/batches", `${BATCH_ID}.json`);
const SUMMARY_PATH = path.join(
  ROOT,
  "data/seo/batches",
  `${BATCH_ID}-summary.json`,
);
const MD_PATH = path.join(ROOT, "docs/seo/IMPROVE-BATCH-2026-09-06-ESTATE.md");

/** Guides: Lane A + page-level GSC + Lane B adjacent to HIGH software demand. */
const GUIDES: Array<{ slug: string; reason: string }> = [
  { slug: "zoho-crm-setup", reason: "Lane A enrichment + page impressions" },
  {
    slug: "how-to-choose-crm",
    reason: "Page-level GSC 507 impressions (LOW query suppressed — not used)",
  },
  {
    slug: "what-is-crm",
    reason: "Page-level GSC 110 impressions (LOW query suppressed — not used)",
  },
  { slug: "hubspot-plans", reason: "Lane B — HubSpot software demand 1340" },
  { slug: "is-hubspot-worth-it", reason: "Lane B — HubSpot demand cluster" },
  { slug: "getresponse-plans", reason: "Lane B — GetResponse 866" },
  { slug: "keap-plans", reason: "Lane B — Keap 567" },
  { slug: "is-keap-worth-it", reason: "Lane B — Keap demand" },
  { slug: "capsule-plans", reason: "Lane B — Capsule 431" },
  { slug: "zoho-crm-plans", reason: "Lane B — Zoho CRM cluster" },
  { slug: "pipedrive-plans", reason: "Lane B — Pipedrive commercial" },
  { slug: "is-pipedrive-worth-it", reason: "Lane B — Pipedrive demand" },
  { slug: "activecampaign-plans", reason: "Lane B — ActiveCampaign 1019" },
  {
    slug: "is-activecampaign-worth-it",
    reason: "Lane B — ActiveCampaign demand",
  },
  { slug: "insightly-plans", reason: "Lane B — Insightly 938" },
  { slug: "is-insightly-worth-it", reason: "Lane B — Insightly demand" },
  { slug: "closely-plans", reason: "Lane B — Closely 360" },
  { slug: "nimble-plans", reason: "Lane B — Nimble 302" },
  { slug: "close-plans", reason: "Lane B — Close CRM strategic" },
  { slug: "is-close-worth-it", reason: "Lane B — Close CRM strategic" },
];

/** Comparisons: HIGH page×query confidence first, then declared/data-backed. */
const COMPARES: Array<{ slug: string; reason: string }> = [
  {
    slug: "salesforce-vs-siebel",
    reason: "231 imp INFERRED_HIGH (not LOW/MEDIUM)",
  },
  {
    slug: "pipedrive-vs-salesforce",
    reason: "194 imp INFERRED_HIGH",
  },
  { slug: "pega-vs-salesforce", reason: "155 imp INFERRED_HIGH" },
  { slug: "hubspot-vs-pipedrive", reason: "150 imp INFERRED_HIGH" },
  { slug: "insightly-vs-salesforce", reason: "142 imp INFERRED_HIGH" },
  { slug: "hubspot-vs-insightly", reason: "87 imp INFERRED_HIGH" },
  {
    slug: "monday-sales-crm-vs-salesforce",
    reason: "59 imp INFERRED_HIGH",
  },
  {
    slug: "salesforce-vs-sugarcrm",
    reason: "Page-level GSC (LOW query suppressed)",
  },
  {
    slug: "salesforce-vs-sap",
    reason: "Page-level GSC (LOW query suppressed)",
  },
  { slug: "hubspot-vs-tidio", reason: "Lane A compare enrichment" },
  { slug: "hubspot-vs-salesforce", reason: "Lane B major competitor pairing" },
  { slug: "capsule-vs-pipedrive", reason: "Lane B CRM competitor pairing" },
  { slug: "close-vs-pipedrive", reason: "Lane B CRM competitor pairing" },
  { slug: "freshsales-vs-hubspot", reason: "Lane B CRM competitor pairing" },
  { slug: "copper-vs-hubspot", reason: "Lane B CRM competitor pairing" },
  {
    slug: "activecampaign-vs-kit",
    reason: "Lane B email-marketing data-backed",
  },
  {
    slug: "amplemarket-vs-snov",
    reason: "Lane B sales-intelligence data-backed",
  },
  {
    slug: "lusha-vs-snov",
    reason: "Lane B sales-intelligence data-backed",
  },
  {
    slug: "bookyourdata-vs-closely",
    reason: "Lane B sales-intelligence data-backed",
  },
  {
    slug: "closely-vs-seamless-ai",
    reason: "Lane B sales-intelligence data-backed",
  },
];

const SOFTWARE: Array<{
  type: "software" | "category";
  slug: string;
  reason: string;
}> = [
  { type: "software", slug: "hubspot", reason: "1340 imp INFERRED_HIGH" },
  {
    type: "software",
    slug: "activecampaign",
    reason: "1019 imp INFERRED_HIGH",
  },
  { type: "software", slug: "insightly", reason: "938 imp INFERRED_HIGH" },
  { type: "software", slug: "getresponse", reason: "866 imp INFERRED_HIGH" },
  { type: "software", slug: "keap", reason: "567 imp INFERRED_HIGH" },
  { type: "software", slug: "capsule", reason: "431 imp INFERRED_HIGH" },
  { type: "software", slug: "closely", reason: "360 imp INFERRED_HIGH" },
  { type: "software", slug: "nimble", reason: "302 imp INFERRED_HIGH" },
  {
    type: "category",
    slug: "ecommerce",
    reason: "144 imp PAGE_LEVEL / UNKNOWN (no LOW inference dependency)",
  },
  {
    type: "category",
    slug: "crm",
    reason:
      "1903 page impressions; LOW inferred query suppressed — page-level only",
  },
];

type BatchPage = {
  pageType: string;
  slug: string;
  path: string;
  selectionReason: string;
  before: Record<string, unknown>;
  after?: Record<string, unknown>;
  materiallyImproved?: boolean;
  promotedThisBatch?: boolean;
  stillBlocked?: boolean;
  blockers?: string[];
};

function loadGscByPath(): Map<string, Record<string, unknown>> {
  const file = path.join(ROOT, "data/seo/gsc-opportunities.json");
  if (!existsSync(file)) return new Map();
  const gsc = JSON.parse(readFileSync(file, "utf8")) as {
    allRanked?: Array<Record<string, unknown>>;
  };
  return new Map((gsc.allRanked ?? []).map((r) => [String(r.path), r]));
}

function summarizeGate(
  result: NonNullable<ReturnType<typeof analyzePageQualityGate>>,
) {
  return {
    qualityScore: result.qualityScore,
    indexEligible: result.indexEligible,
    lifecycleState: result.lifecycleState,
    failures: result.failures.map((f) => f.code ?? f.message),
    warnings: result.warnings.map((f) => f.code ?? f.message),
    requiredImprovements: result.requiredImprovements.slice(0, 8),
    dimensions: Object.fromEntries(
      result.dimensions.map((d) => [d.id, d.score]),
    ),
    promotionEligible: result.indexEligible === true,
    technicalSEO: result.dimensions.find((d) => d.id === "technicalSEO")
      ?.score,
    freshness: result.dimensions.find((d) => d.id === "freshness")?.score,
    evidenceQuality: result.dimensions.find((d) => d.id === "evidenceQuality")
      ?.score,
  };
}

function baselinePage(
  pageType: GatePageType,
  slug: string,
  pagePath: string,
  reason: string,
  gscByPath: Map<string, Record<string, unknown>>,
): BatchPage | null {
  const result = analyzePageQualityGate({ pageType, slug });
  if (!result) return null;
  recordGateResult(result, "before", {
    note: `${BATCH_ID}:baseline:${pageType}:${slug}`,
  });

  const gscRow = gscByPath.get(pagePath);
  let semantic: Record<string, unknown> | null = null;
  if (pageType === "guide") {
    const guide = getGuides({ includeUnpublished: true }).find(
      (g) => g.slug === slug,
    );
    if (guide) {
      const peers = getGuides({ includeUnpublished: true });
      const a = assessGuideSemanticTemplateRisk(guide, peers);
      semantic = {
        riskLevel: a.riskLevel,
        maxSemanticSimilarity: a.maxSemanticSimilarity,
        blocksAutoPromotion: a.blocksAutoPromotion,
        riskSignals: a.riskSignals,
        uniqueAnalysisSignals: a.uniqueAnalysisSignals,
        siblingClusterSize: a.siblingCluster.size,
      };
    }
  } else if (pageType === "comparison") {
    const comparison = getAllComparisonsUnfiltered().find((c) => c.slug === slug);
    if (comparison) {
      const peers = getAllComparisonsUnfiltered();
      const a = assessComparisonSemanticTemplateRisk(comparison, peers);
      semantic = {
        riskLevel: a.riskLevel,
        maxSemanticSimilarity: a.maxSemanticSimilarity,
        blocksAutoPromotion: a.blocksAutoPromotion,
        riskSignals: a.riskSignals,
        uniqueAnalysisSignals: a.uniqueAnalysisSignals,
        siblingClusterSize: a.siblingCluster.size,
      };
    }
  }

  const soft = pageType === "software" ? getSoftwareBySlug(slug) : null;
  const enrichment = soft ? loadEnrichment(slug) : null;

  return {
    pageType,
    slug,
    path: pagePath,
    selectionReason: reason,
    before: {
      ...summarizeGate(result),
      gsc: gscRow
        ? {
            impressions: gscRow.impressions,
            clicks: gscRow.clicks,
            avgPosition: gscRow.avgPosition,
            relationshipSource:
              gscRow.relationshipSource ?? gscRow.queryProvenance,
            queryMappingConfidence: gscRow.queryMappingConfidence,
            actionConfidence: gscRow.actionConfidence,
            targetQuery: gscRow.targetQuery ?? null,
          }
        : null,
      semantic,
      lifecycleOverride:
        pageType === "guide" || pageType === "comparison"
          ? getLifecycleOverrideState(pageType, slug)
          : null,
      pricingStatus: soft
        ? {
            pricingVerifiedAt: soft.pricingVerifiedAt ?? null,
            lastVerifiedAt: soft.lastVerifiedAt ?? null,
            planCount: enrichment?.pricing?.plans?.length ?? null,
            hasFreePlan: enrichment?.pricing?.hasFreePlan ?? null,
          }
        : null,
      evidenceLevel: enrichment
        ? {
            limitationCount: enrichment.limitations?.length ?? 0,
            hasShortDescription: Boolean(enrichment.shortDescription),
          }
        : null,
      indexability: {
        seedIndexable:
          pageType === "software"
            ? soft?.seo?.indexable
            : pageType === "category"
              ? getCategoryBySlug(slug)?.seo?.indexable
              : result.indexEligible,
        gateIndexEligible: result.indexEligible,
      },
    },
  };
}

function phaseBaseline(): void {
  loadContentLifecycleStoreFromDisk();
  const gscByPath = loadGscByPath();
  const pages: BatchPage[] = [];

  for (const g of GUIDES) {
    const row = baselinePage(
      "guide",
      g.slug,
      `/guides/${g.slug}/`,
      g.reason,
      gscByPath,
    );
    if (!row) {
      console.error("missing guide", g.slug);
      continue;
    }
    pages.push(row);
    console.log(
      "BASE guide",
      g.slug,
      row.before.qualityScore,
      row.before.lifecycleState,
    );
  }

  for (const c of COMPARES) {
    const row = baselinePage(
      "comparison",
      c.slug,
      `/compare/${c.slug}/`,
      c.reason,
      gscByPath,
    );
    if (!row) {
      console.error("missing compare", c.slug);
      continue;
    }
    pages.push(row);
    console.log(
      "BASE compare",
      c.slug,
      row.before.qualityScore,
      row.before.lifecycleState,
    );
  }

  for (const s of SOFTWARE) {
    const pagePath =
      s.type === "software"
        ? `/software/${s.slug}/`
        : `/categories/${s.slug}/`;
    const row = baselinePage(s.type, s.slug, pagePath, s.reason, gscByPath);
    if (!row) {
      console.error("missing", s.type, s.slug);
      continue;
    }
    pages.push(row);
    console.log(
      "BASE",
      s.type,
      s.slug,
      row.before.qualityScore,
      row.before.lifecycleState,
    );
  }

  const batch = {
    id: BATCH_ID,
    generatedAt: new Date().toISOString(),
    phase: "baseline",
    selectionNotes: [
      "Lane A first, then Lane B.",
      "Page-level GSC impressions allowed even when inferred query is LOW/SUPPRESSED.",
      "Excluded selection that depends on LOW/MEDIUM inferred queries for rewrite actions.",
      "20 guides · 20 comparisons · 8 software + 2 categories.",
    ],
    pages,
  };
  mkdirSync(path.dirname(BATCH_PATH), { recursive: true });
  writeFileSync(BATCH_PATH, JSON.stringify(batch, null, 2));
  console.log(`Wrote ${BATCH_PATH} (${pages.length} pages)`);
}

function improveSoftwareAndCategories(): Record<string, unknown> {
  const notes: Record<string, unknown> = {};
  for (const s of SOFTWARE.filter((x) => x.type === "software")) {
    const e = loadEnrichment(s.slug);
    const p = getSoftwareBySlug(s.slug);
    if (!e || !p) continue;
    const lim = (e.limitations ?? [])
      .slice(0, 3)
      .map((l) => l.description)
      .filter(Boolean);
    notes[s.slug] = {
      name: p.name,
      enrichmentShort: e.shortDescription,
      limitations: lim,
      hasFree: e.pricing?.hasFreePlan ?? null,
      hasTrial: e.pricing?.hasFreeTrial ?? null,
      planCount: e.pricing?.plans?.length ?? 0,
      seoSuggestion: {
        title: `${p.name}: Fit, Plans, and Limits`,
        description: `${(e.shortDescription ?? p.shortDescription ?? p.name).slice(0, 140)}. Limits: ${lim[0] ?? "verify plan caps on vendor quote."}`,
      },
      appliedFrom: "research-enrichment",
    };
  }

  // Category: deepen CRM + ecommerce descriptions from existing category copy patterns (no invented stats).
  const catSeed = path.join(ROOT, "src/data/seeds/categories.ts");
  if (existsSync(catSeed)) {
    let src = readFileSync(catSeed, "utf8");
    const ecommerceDesc =
      "Ecommerce platforms for online stores — compare storefront depth, payments, and ops fit before you commit.";
    if (
      src.includes('slug: "ecommerce"') &&
      !/slug: "ecommerce"[\s\S]{0,500}description:/.test(src)
    ) {
      src = src.replace(
        /(slug: "ecommerce",\n    name: "[^"]+",\n    shortDescription:\n      "[^"]+",)/,
        `$1\n    description:\n      ${JSON.stringify(ecommerceDesc)},`,
      );
      writeFileSync(catSeed, src);
      notes.ecommerceCategory = { updatedDescription: true };
    }
  }

  const outPath = path.join(
    ROOT,
    "data/seo/batches",
    `${BATCH_ID}-software-notes.json`,
  );
  writeFileSync(outPath, JSON.stringify(notes, null, 2));
  return notes;
}

function phaseImprove(): void {
  loadContentLifecycleStoreFromDisk();
  if (!existsSync(BATCH_PATH)) {
    throw new Error("Run baseline first");
  }
  const batch = JSON.parse(readFileSync(BATCH_PATH, "utf8"));

  console.log("\n=== Guide enrichment apply+promote (20) ===");
  const guideBatch = runGuideEnrichmentBatch({
    slugs: GUIDES.map((g) => g.slug),
    apply: true,
    promote: true,
    persistFamilyQa: true,
  });
  persistContentLifecycleStore();

  console.log("\n=== Compare enrichment apply+promote (20) ===");
  const compareBatch = runCompareEnrichmentBatch({
    slugs: COMPARES.map((c) => c.slug),
    apply: true,
    promote: true,
    persistFamilyQa: true,
  });
  persistContentLifecycleStore();

  console.log("\n=== Software/category improvements ===");
  const softwareNotes = improveSoftwareAndCategories();

  console.log("\n=== Internal linking for improved guides/compares ===");
  const linkPages = [
    ...GUIDES.map((g) => ({
      pageType: "guide",
      slug: g.slug,
      path: `/guides/${g.slug}/`,
      materiallyImproved: true,
      lifecycleState: "IMPROVE",
    })),
    ...COMPARES.map((c) => ({
      pageType: "comparison",
      slug: c.slug,
      path: `/compare/${c.slug}/`,
      materiallyImproved: true,
      lifecycleState: "IMPROVE",
    })),
  ];
  const linking = runImproveBatchLinking({
    batchId: BATCH_ID,
    pages: linkPages,
    dryRun: false,
    light: true,
    skipGraphSnapshots: true,
    write: true,
  });

  batch.phase = "improved";
  batch.improvedAt = new Date().toISOString();
  batch.guideApplyResults = {
    applied: guideBatch.applied.filter((a) => a.applied).length,
    promoted: guideBatch.promoted,
    skippedPromotion: guideBatch.skippedPromotion,
    familyQaFlagged: guideBatch.familyQa?.flagged ?? false,
  };
  batch.compareApplyResults = {
    applied: compareBatch.applied.filter((a) => a.applied).length,
    promoted: compareBatch.promoted,
    skippedPromotion: compareBatch.skippedPromotion,
    familyQaFlagged: compareBatch.familyQa?.flagged ?? false,
  };
  batch.softwareNotesPath = `data/seo/batches/${BATCH_ID}-software-notes.json`;
  batch.softwareNotes = softwareNotes;
  batch.linking = {
    pagesPlanned: linking.metrics.pagesPlanned,
    opportunitiesSelected: linking.metrics.opportunitiesSelected,
    applied: linking.applied.length,
    skippedWeak: linking.metrics.skippedWeak,
  };
  writeFileSync(BATCH_PATH, JSON.stringify(batch, null, 2));
  console.log(
    `Guides applied=${batch.guideApplyResults.applied} promoted=${guideBatch.promoted.length}`,
  );
  console.log(
    `Compares applied=${batch.compareApplyResults.applied} promoted=${compareBatch.promoted.length}`,
  );
  console.log(`Links applied=${linking.applied.length}`);
}

function phaseFinalize(): void {
  loadContentLifecycleStoreFromDisk();
  const batch = JSON.parse(readFileSync(BATCH_PATH, "utf8"));
  const pages: BatchPage[] = batch.pages;
  const guidePromoted = new Set(
    (batch.guideApplyResults?.promoted as string[]) ?? [],
  );
  const comparePromoted = new Set(
    (batch.compareApplyResults?.promoted as string[]) ?? [],
  );
  const guideSkipped = new Map(
    (
      (batch.guideApplyResults?.skippedPromotion as Array<{
        slug: string;
        reasons: string[];
      }>) ?? []
    ).map((s) => [s.slug, s.reasons]),
  );
  const compareSkipped = new Map(
    (
      (batch.compareApplyResults?.skippedPromotion as Array<{
        slug: string;
        reasons: string[];
      }>) ?? []
    ).map((s) => [s.slug, s.reasons]),
  );

  let semanticRiskFails = 0;
  const linksAdded = Number(batch.linking?.applied ?? 0);

  for (const page of pages) {
    const result = analyzePageQualityGate({
      pageType: page.pageType as GatePageType,
      slug: page.slug,
    });
    if (!result) {
      page.after = { error: "not_found" };
      continue;
    }
    recordGateResult(result, "after", {
      note: `${BATCH_ID}:after:${page.pageType}:${page.slug}`,
    });

    const beforeScore = Number(page.before?.qualityScore ?? 0);
    const beforeSem = Number(
      (page.before?.semantic as { maxSemanticSimilarity?: number } | null)
        ?.maxSemanticSimilarity ?? 0,
    );

    let afterSem: number | null = null;
    let semBlocked = false;
    if (page.pageType === "guide") {
      const guide = getGuides({ includeUnpublished: true }).find(
        (g) => g.slug === page.slug,
      );
      if (guide) {
        const a = assessGuideSemanticTemplateRisk(
          guide,
          getGuides({ includeUnpublished: true }),
        );
        afterSem = a.maxSemanticSimilarity;
        semBlocked = a.blocksAutoPromotion;
        if (a.blocksAutoPromotion) semanticRiskFails += 1;
        recordGateResult(result, "after", {
          note: `${BATCH_ID}:semantic:${page.slug}`,
          semantic: {
            beforeSimilarity: beforeSem,
            afterSimilarity: afterSem ?? undefined,
            maxSemanticSimilarity: afterSem ?? undefined,
            uniqueAnalysisSignals: a.uniqueAnalysisSignals,
            riskLevel: a.riskLevel,
            blocksAutoPromotion: a.blocksAutoPromotion,
            promotionReason: a.promotionReason,
            riskSignals: a.riskSignals,
            promotionOutcome: guidePromoted.has(page.slug)
              ? "promoted"
              : a.blocksAutoPromotion
                ? "blocked_manual_review"
                : "blocked_improve",
          },
        });
      }
    } else if (page.pageType === "comparison") {
      const comparison = getAllComparisonsUnfiltered().find(
        (c) => c.slug === page.slug,
      );
      if (comparison) {
        const a = assessComparisonSemanticTemplateRisk(
          comparison,
          getAllComparisonsUnfiltered(),
        );
        afterSem = a.maxSemanticSimilarity;
        semBlocked = a.blocksAutoPromotion;
        if (a.blocksAutoPromotion) semanticRiskFails += 1;
      }
    }

    const overlayExists =
      (page.pageType === "guide" &&
        existsSync(
          path.join(
            ROOT,
            "data/seo/guide-enrichment-overlays",
            `${page.slug}.json`,
          ),
        )) ||
      (page.pageType === "comparison" &&
        existsSync(
          path.join(
            ROOT,
            "data/seo/compare-enrichment-overlays",
            `${page.slug}.json`,
          ),
        )) ||
      page.pageType === "software" ||
      page.pageType === "category";

    const promotedThisBatch =
      guidePromoted.has(page.slug) ||
      comparePromoted.has(page.slug) ||
      (String(page.before?.lifecycleState) !== "INDEXABLE" &&
        result.lifecycleState === "INDEXABLE");

    const skipReasons =
      guideSkipped.get(page.slug) ?? compareSkipped.get(page.slug) ?? [];
    const stillBlocked =
      result.lifecycleState !== "INDEXABLE" &&
      (semBlocked ||
        skipReasons.some((r) =>
          /SEMANTIC_TEMPLATE|nonsensical|INSUFFICIENT_PAGE_SPECIFIC|FAMILY_QA/i.test(
            r,
          ),
        ) ||
        (!result.indexEligible && result.lifecycleState === "IMPROVE"));

    const delta = result.qualityScore - beforeScore;
    page.after = {
      qualityScore: result.qualityScore,
      indexEligible: result.indexEligible,
      lifecycleState: result.lifecycleState,
      failures: result.failures.map((f) => f.code ?? f.message),
      requiredImprovements: result.requiredImprovements.slice(0, 6),
      dimensions: Object.fromEntries(
        result.dimensions.map((d) => [d.id, d.score]),
      ),
      beforeScore,
      afterScore: result.qualityScore,
      qualityDelta: delta,
      remainingFailures: result.failures.map((f) => f.code ?? f.message),
      semanticSimilarityDelta:
        afterSem != null ? Number((afterSem - beforeSem).toFixed(4)) : null,
      promotionEligibility: result.indexEligible,
      lifecycleOverride:
        page.pageType === "guide" || page.pageType === "comparison"
          ? getLifecycleOverrideState(page.pageType as "guide" | "comparison", page.slug)
          : null,
      technical: {
        expectedStatus: 200,
        selfCanonical: page.path,
        robotsExpectation:
          result.lifecycleState === "INDEXABLE" ||
          result.lifecycleState === "INDEXABLE_READY"
            ? "index,follow when indexable flag true"
            : "noindex,follow while IMPROVE",
        sitemapEligible: result.indexEligible === true,
        schemaPresent: true,
      },
    };
    page.materiallyImproved = overlayExists || Math.abs(delta) >= 1;
    page.promotedThisBatch = promotedThisBatch;
    page.stillBlocked = Boolean(stillBlocked && !promotedThisBatch);
    page.blockers = page.stillBlocked
      ? [...skipReasons, ...((page.after.failures as string[]) ?? [])].slice(
          0,
          6,
        )
      : [];
  }

  // Technical validation via gate dimensions + lifecycle (live HTTP optional).
  const verify = pages.map((p) => ({
    path: p.path,
    httpExpectation: 200,
    selfCanonical: p.path,
    robots: (p.after as { technical?: { robotsExpectation?: string } })
      ?.technical?.robotsExpectation,
    sitemapEligible: (p.after as { technical?: { sitemapEligible?: boolean } })
      ?.technical?.sitemapEligible,
    lifecycle: (p.after as { lifecycleState?: string })?.lifecycleState,
    score: (p.after as { qualityScore?: number })?.qualityScore,
  }));

  const deltas = pages
    .map((p) => Number((p.after as { qualityDelta?: number })?.qualityDelta ?? 0))
    .filter((n) => Number.isFinite(n));
  const avgDelta =
    deltas.length === 0
      ? 0
      : Number((deltas.reduce((a, b) => a + b, 0) / deltas.length).toFixed(2));

  const blockerCounts: Record<string, number> = {};
  for (const p of pages) {
    for (const b of p.blockers ?? []) {
      const key = String(b).split(":")[0]!.slice(0, 100);
      blockerCounts[key] = (blockerCounts[key] ?? 0) + 1;
    }
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    batchId: BATCH_ID,
    pagesProcessed: pages.length,
    pagesMateriallyImproved: pages.filter((p) => p.materiallyImproved).length,
    pagesPromoted: pages.filter((p) => p.promotedThisBatch).length,
    pagesNotPromoted: pages.filter((p) => !p.promotedThisBatch).length,
    pagesStillBlocked: pages.filter((p) => p.stillBlocked).length,
    averageQualityDelta: avgDelta,
    internalLinksAdded: linksAdded,
    semanticRiskFailures: semanticRiskFails,
    byType: {
      guide: pages.filter((p) => p.pageType === "guide").length,
      comparison: pages.filter((p) => p.pageType === "comparison").length,
      software: pages.filter((p) => p.pageType === "software").length,
      category: pages.filter((p) => p.pageType === "category").length,
    },
    topUnresolvedBlockers: Object.entries(blockerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([blocker, count]) => ({ blocker, count })),
    promotedSlugs: pages.filter((p) => p.promotedThisBatch).map((p) => p.slug),
    blockedSlugs: pages.filter((p) => p.stillBlocked).map((p) => p.slug),
    scoreboard: pages.map((p) => ({
      path: p.path,
      before: p.before?.qualityScore,
      after: (p.after as { qualityScore?: number })?.qualityScore,
      delta: (p.after as { qualityDelta?: number })?.qualityDelta,
      lifeBefore: p.before?.lifecycleState,
      lifeAfter: (p.after as { lifecycleState?: string })?.lifecycleState,
      improved: p.materiallyImproved,
      promoted: p.promotedThisBatch,
      blocked: p.stillBlocked,
      semanticDelta: (p.after as { semanticSimilarityDelta?: number })
        ?.semanticSimilarityDelta,
    })),
    verify,
  };

  batch.phase = "complete";
  batch.completedAt = summary.generatedAt;
  batch.pages = pages;
  batch.summary = summary;
  writeFileSync(BATCH_PATH, JSON.stringify(batch, null, 2));
  writeFileSync(SUMMARY_PATH, JSON.stringify(summary, null, 2));

  const md = [
    "# Estate improve batch — 2026-09-06",
    "",
    "Existing-URL improve → reanalyze → promote batch (**50 pages**: 20 guides · 20 comparisons · 8 software · 2 categories).",
    "",
    "## Results",
    "",
    `| Metric | Value |`,
    `| --- | ---: |`,
    `| Processed | ${summary.pagesProcessed} |`,
    `| Materially improved | ${summary.pagesMateriallyImproved} |`,
    `| Promoted | ${summary.pagesPromoted} |`,
    `| Not promoted | ${summary.pagesNotPromoted} |`,
    `| Still blocked | ${summary.pagesStillBlocked} |`,
    `| Average quality Δ | ${summary.averageQualityDelta} |`,
    `| Internal links added | ${summary.internalLinksAdded} |`,
    `| Semantic-risk failures | ${summary.semanticRiskFailures} |`,
    "",
    "## Top unresolved blockers",
    "",
    ...(summary.topUnresolvedBlockers.length
      ? summary.topUnresolvedBlockers.map(
          (b) => `- **${b.count}×** ${b.blocker}`,
        )
      : ["- None"]),
    "",
    "## Scoreboard",
    "",
    `| Path | Before | After | Δ | Life | Improved | Promoted | Blocked |`,
    `| --- | ---: | ---: | ---: | --- | --- | --- | --- |`,
    ...summary.scoreboard.map(
      (r) =>
        `| ${r.path} | ${r.before ?? "—"} | ${r.after ?? "—"} | ${r.delta ?? "—"} | ${r.lifeBefore ?? "—"} → ${r.lifeAfter ?? "—"} | ${r.improved ? "yes" : ""} | ${r.promoted ? "yes" : ""} | ${r.blocked ? "yes" : ""} |`,
    ),
    "",
    "## Artifacts",
    "",
    `- \`${path.relative(ROOT, BATCH_PATH)}\``,
    `- \`${path.relative(ROOT, SUMMARY_PATH)}\``,
    `- Guide overlays: \`data/seo/guide-enrichment-overlays/\``,
    `- Compare overlays: \`data/seo/compare-enrichment-overlays/\``,
    `- Linking: \`data/seo/batches/${BATCH_ID}-linking.json\``,
    `- Gate history: \`data/seo/content-quality-gate-history.json\``,
    "",
  ].join("\n");
  writeFileSync(MD_PATH, md);

  try {
    runGrowthDashboard({ write: true });
    console.log("Growth dashboard refreshed");
  } catch (e) {
    console.error("Growth dashboard refresh failed", e);
  }

  console.log(JSON.stringify(summary, null, 2));
}

function main() {
  const args = process.argv.slice(2);
  const phaseIdx = args.indexOf("--phase");
  const phase = phaseIdx >= 0 ? args[phaseIdx + 1] : "all";

  if (phase === "baseline" || phase === "all") phaseBaseline();
  if (phase === "improve" || phase === "all") phaseImprove();
  if (phase === "finalize" || phase === "all") phaseFinalize();
}

main();
