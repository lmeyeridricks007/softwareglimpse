#!/usr/bin/env node
/**
 * Sales Intelligence Priority-4 — optional/adjacent products:
 * Adapt.io, Outreach, Salesloft, Instantly, Gong, Lemlist, Smartlead.
 *
 * Usage: node scripts/onboard-si-priority4-batch.mjs
 * Idempotent — overwrites product research / editorial packs.
 *
 * Does NOT WP-publish. handsOnTesting=false.
 * Affiliate economics never enter scores.
 * All products are SI landscape (not ranked contact-DB peers).
 */
import { runSiBatch, avgScore, configureSiRuntime } from "./lib/si-onboard-runtime.mjs";
import { PRODUCTS } from "./lib/si-priority4-products.mjs";

function main() {
  configureSiRuntime({
    verifiedAt: "2026-08-17T18:00:00.000Z",
    publishedAt: "2026-08-17T00:00:00.000Z",
    batchLabel: "SI Priority-4 onboarding 2026-08-17",
    jobTag: "si-priority4",
  });

  console.log("SI Priority-4 products (all landscape):");
  for (const p of PRODUCTS) {
    console.log(
      `  - ${p.slug} overall=${avgScore(p.scores)} role=${p.membershipRole ?? "landscape"}`,
    );
  }

  runSiBatch({
    products: PRODUCTS,
    batchLabel: "SI Priority-4 onboarding 2026-08-17",
    seedSnippetFile: "_si-priority4-seed-snippet.ts",
    videoSpecFile: "_si-priority4-official-videos.json",
    jobTag: "si-priority4",
  });
}

main();
