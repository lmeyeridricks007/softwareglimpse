#!/usr/bin/env node
/**
 * Marketing Priority-1 credibility products:
 * Buffer, ClickFunnels, Adobe Marketo Engage (upgrade), Braze.
 *
 * Pardot stays CRM-primary — landscape touch is applied in seed/best updates
 * (not a full marketing-editorial re-score in this batch).
 *
 * Usage: node scripts/onboard-marketing-priority1-batch.mjs
 * Idempotent — overwrites product research / editorial packs.
 *
 * Does NOT auto-publish beyond writing approved editorial JSON.
 * Affiliate economics never enter scores.
 */
import fs from "node:fs";
import path from "node:path";
import { runMktBatch, avgScore, ROOT, VERIFIED_AT, writeJson } from "./lib/mkt-onboard-runtime.mjs";
import { PRODUCTS } from "./lib/mkt-priority1-products.mjs";

function refreshPardotLandscapeTouch() {
  const researchDir = path.join(ROOT, "src/data/research", "pardot");
  const enrichmentPath = path.join(researchDir, "enrichment.json");
  if (!fs.existsSync(enrichmentPath)) {
    console.warn("⚠ pardot enrichment missing — skip landscape touch");
    return;
  }
  const enrichment = JSON.parse(fs.readFileSync(enrichmentPath, "utf8"));
  enrichment.shortDescription =
    "Salesforce Account Engagement (Pardot) is Salesforce’s B2B marketing automation product for lead nurture, scoring, and Sales Cloud-aligned campaigns — typically packaged with Salesforce editions via custom quote. Marketing is secondary to CRM-primary catalogue placement; on Best Marketing it appears in landscape / decision path rather than as a ranked peer to Marketo/Braze/Buffer.";
  enrichment.vendorPositioning = [
    {
      claim:
        "B2B marketing automation natively aligned to Salesforce Sales Cloud — Account Engagement (formerly Pardot) for enterprise nurture and sales handoff.",
      audienceHints: [
        "Salesforce-centric B2B marketing ops",
        "Teams comparing Marketo vs Salesforce-native MA",
      ],
      sourceIds: ["pardot-product-official"],
    },
  ];
  enrichment.notes = `Marketing Priority-1 landscape touch ${VERIFIED_AT}. CRM primary retained. handsOnTesting=false. Custom quote only — no invented dollars.`;
  enrichment.updatedAt = VERIFIED_AT;
  writeJson(enrichmentPath, enrichment);

  const reviewPath = path.join(ROOT, "src/data/editorial/reviews", "pardot.json");
  if (fs.existsSync(reviewPath)) {
    const review = JSON.parse(fs.readFileSync(reviewPath, "utf8"));
    review.intro =
      (review.intro || "") +
      " For Marketing & Growth buyers, Account Engagement is a Salesforce-native B2B MA peer to Marketo — covered on the marketing best page as landscape / decision-path context while remaining CRM-primary in the catalogue.";
    review.lastUpdatedAt = VERIFIED_AT;
    if (review.metadata) review.metadata.updatedAt = VERIFIED_AT;
    writeJson(reviewPath, review);
  }
  console.log("✓ pardot landscape touch (CRM primary retained)");
}

function main() {
  console.log("Marketing Priority-1 products:");
  for (const p of PRODUCTS) {
    console.log(`  - ${p.slug} overall=${avgScore(p.scores)} primary=${p.primaryCategorySlug}`);
  }
  runMktBatch({
    products: PRODUCTS,
    batchLabel: "Marketing Priority-1 onboarding 2026-08-17",
    seedSnippetFile: "_marketing-priority1-seed-snippet.ts",
    videoSpecFile: "_marketing-priority1-official-videos.json",
    jobTag: "marketing-priority1",
  });
  refreshPardotLandscapeTouch();
}

main();
