#!/usr/bin/env npx tsx
/**
 * One-shot baseline capture for the first improve→promote batch.
 * Usage: npx tsx scripts/seo/run-improve-batch-baseline.ts
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  analyzePageQualityGate,
  recordGateResult,
  type GatePageType,
} from "@/services/content-quality/gate";
import { getLifecycleOverrideState } from "@/services/seo/content-lifecycle/store";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "data/seo/batches/improve-batch-2026-09-06.json");

const GUIDES = [
  { slug: "zoho-crm-setup", reason: "Lane A enrichment + 44 GSC impressions (IMPROVE)" },
  { slug: "how-to-choose-crm", reason: "507 GSC page impressions; query mapping SUPPRESSED" },
  { slug: "what-is-crm", reason: "110 GSC page impressions; query mapping SUPPRESSED" },
  { slug: "hubspot-plans", reason: "Adjacent Lane A — HubSpot software 1340 impressions" },
  { slug: "is-hubspot-worth-it", reason: "Adjacent Lane A — HubSpot demand" },
  { slug: "getresponse-plans", reason: "Adjacent Lane A — GetResponse 866 impressions" },
  { slug: "keap-plans", reason: "Adjacent Lane A — Keap 567 impressions" },
  { slug: "is-keap-worth-it", reason: "Adjacent Lane A — Keap demand" },
  { slug: "capsule-plans", reason: "Adjacent Lane A — Capsule 431 impressions" },
  { slug: "zoho-crm-plans", reason: "Adjacent Lane A — Zoho setup demand cluster" },
];

const COMPARES = [
  { slug: "salesforce-vs-siebel", reason: "231 imp, INFERRED HIGH" },
  { slug: "pipedrive-vs-salesforce", reason: "194 imp, INFERRED HIGH" },
  { slug: "insightly-vs-salesforce", reason: "142 imp, INFERRED HIGH" },
  { slug: "pega-vs-salesforce", reason: "155 imp, INFERRED HIGH" },
  { slug: "hubspot-vs-pipedrive", reason: "150 imp, INFERRED HIGH" },
  { slug: "hubspot-vs-insightly", reason: "87 imp, INFERRED HIGH" },
  { slug: "monday-sales-crm-vs-salesforce", reason: "59 imp, INFERRED HIGH" },
  { slug: "salesforce-vs-sugarcrm", reason: "136 imp, page-level (LOW query suppressed)" },
  { slug: "salesforce-vs-sap", reason: "84 imp, page-level (LOW query suppressed)" },
  { slug: "hubspot-vs-tidio", reason: "Lane A compare enrichment + 11 imp" },
];

const SOFTWARE: Array<{ type: "software" | "category"; slug: string; reason: string }> = [
  { type: "software", slug: "hubspot", reason: "1340 imp HIGH" },
  { type: "software", slug: "getresponse", reason: "866 imp HIGH" },
  { type: "software", slug: "keap", reason: "567 imp HIGH" },
  { type: "software", slug: "capsule", reason: "431 imp HIGH" },
  { type: "software", slug: "sanebox", reason: "393 imp HIGH" },
  { type: "software", slug: "closely", reason: "360 imp HIGH" },
  { type: "software", slug: "nimble", reason: "302 imp HIGH" },
  { type: "software", slug: "diginius", reason: "258 imp HIGH" },
  { type: "category", slug: "crm", reason: "1903 imp page-level (LOW query suppressed)" },
  { type: "category", slug: "ecommerce", reason: "144 imp PAGE_LEVEL" },
];

function summarize(result: NonNullable<ReturnType<typeof analyzePageQualityGate>>) {
  const dims = Object.fromEntries(
    (result.dimensions ?? []).map((d) => [d.id, d.score]),
  );
  const failures = (result.failures ?? []).map((f) => f.code ?? f.message);
  return {
    qualityScore: result.qualityScore,
    indexEligible: result.indexEligible,
    lifecycleState: result.lifecycleState,
    failures,
    warnings: (result.warnings ?? []).map((f) => f.code ?? f.message),
    requiredImprovements: result.requiredImprovements ?? [],
    dimensions: dims,
    promotionEligible: result.indexEligible === true,
  };
}

function main() {
  const gsc = JSON.parse(
    readFileSync(path.join(ROOT, "data/seo/gsc-opportunities.json"), "utf8"),
  ) as { allRanked: Array<Record<string, unknown>> };
  const gscByPath = new Map(
    (gsc.allRanked ?? []).map((r) => [String(r.path), r]),
  );

  const batch = {
    generatedAt: new Date().toISOString(),
    phase: "baseline",
    selectionNotes: [
      "Lane A = proven GSC page demand and/or enrichment Lane A.",
      "Excluded target-query-driven selection when mapping is LOW-only inferred.",
      "SUPPRESSED/null targetQuery with page impressions is allowed (page-level).",
      "Guide fill uses IMPROVE guides for products with HIGH software GSC demand.",
    ],
    pages: [] as Array<Record<string, unknown>>,
  };

  for (const g of GUIDES) {
    const r = analyzePageQualityGate({ pageType: "guide", slug: g.slug });
    if (!r) {
      console.error("missing guide", g.slug);
      continue;
    }
    recordGateResult(r, "analyze", { note: `batch-baseline:${g.slug}` });
    const pagePath = `/guides/${g.slug}/`;
    const gscRow = gscByPath.get(pagePath);
    batch.pages.push({
      pageType: "guide" satisfies GatePageType,
      slug: g.slug,
      path: pagePath,
      selectionReason: g.reason,
      before: {
        ...summarize(r),
        gsc: gscRow
          ? {
              impressions: gscRow.impressions,
              clicks: gscRow.clicks,
              avgPosition: gscRow.avgPosition,
              queryProvenance: gscRow.queryProvenance,
              queryMappingConfidence: gscRow.queryMappingConfidence,
              actionConfidence: gscRow.actionConfidence,
              targetQuery: gscRow.targetQuery ?? null,
            }
          : null,
        lifecycleOverride: getLifecycleOverrideState("guide", g.slug),
      },
    });
    console.log(
      "BASE guide",
      g.slug,
      summarize(r).overallScore,
      summarize(r).lifecycleState,
    );
  }

  for (const c of COMPARES) {
    const r = analyzePageQualityGate({ pageType: "comparison", slug: c.slug });
    if (!r) {
      console.error("missing compare", c.slug);
      continue;
    }
    recordGateResult(r, "analyze", { note: `batch-baseline:${c.slug}` });
    const pagePath = `/compare/${c.slug}/`;
    const gscRow = gscByPath.get(pagePath);
    batch.pages.push({
      pageType: "comparison" satisfies GatePageType,
      slug: c.slug,
      path: pagePath,
      selectionReason: c.reason,
      before: {
        ...summarize(r),
        gsc: gscRow
          ? {
              impressions: gscRow.impressions,
              clicks: gscRow.clicks,
              avgPosition: gscRow.avgPosition,
              queryProvenance: gscRow.queryProvenance,
              queryMappingConfidence: gscRow.queryMappingConfidence,
              actionConfidence: gscRow.actionConfidence,
              targetQuery: gscRow.targetQuery ?? null,
            }
          : null,
        lifecycleOverride: getLifecycleOverrideState("comparison", c.slug),
      },
    });
    console.log(
      "BASE compare",
      c.slug,
      summarize(r).overallScore,
      summarize(r).lifecycleState,
    );
  }

  for (const s of SOFTWARE) {
    const r = analyzePageQualityGate({ pageType: s.type, slug: s.slug });
    if (!r) {
      console.error("missing", s.type, s.slug);
      continue;
    }
    recordGateResult(r, "analyze", {
      note: `batch-baseline:${s.type}:${s.slug}`,
    });
    const pagePath =
      s.type === "software"
        ? `/software/${s.slug}/`
        : `/categories/${s.slug}/`;
    const gscRow = gscByPath.get(pagePath);
    batch.pages.push({
      pageType: s.type,
      slug: s.slug,
      path: pagePath,
      selectionReason: s.reason,
      before: {
        ...summarize(r),
        gsc: gscRow
          ? {
              impressions: gscRow.impressions,
              clicks: gscRow.clicks,
              avgPosition: gscRow.avgPosition,
              queryProvenance: gscRow.queryProvenance,
              queryMappingConfidence: gscRow.queryMappingConfidence,
              actionConfidence: gscRow.actionConfidence,
              targetQuery: gscRow.targetQuery ?? null,
            }
          : null,
      },
    });
    console.log(
      "BASE",
      s.type,
      s.slug,
      summarize(r).overallScore,
      summarize(r).lifecycleState,
      "eligible",
      summarize(r).indexEligible,
    );
  }

  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(batch, null, 2));
  console.log(`Wrote ${OUT} (${batch.pages.length} pages)`);
}

main();
