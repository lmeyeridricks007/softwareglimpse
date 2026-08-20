#!/usr/bin/env node
/**
 * Email Marketing Priority-2 segment-depth products:
 * Omnisend, Kit (ConvertKit), Constant Contact, Flodesk, Moosend, Beehiiv.
 *
 * Usage: node scripts/onboard-em-priority2-batch.mjs
 * Idempotent — overwrites product research / editorial packs.
 *
 * Does NOT auto-publish beyond writing approved editorial JSON.
 * Affiliate economics never enter scores.
 * Grounded pricing verified 2026-08-17 from official pricing pages.
 */
import { runEmBatch } from "./lib/em-onboard-runtime.mjs";
import { PRODUCTS } from "./lib/em-priority2-products.mjs";
import { avgScore } from "./lib/em-onboard-runtime.mjs";

function main() {
  console.log("EM Priority-2 products:");
  for (const p of PRODUCTS) {
    console.log(`  - ${p.slug} overall=${avgScore(p.scores)} role=${p.membershipRole}`);
  }
  runEmBatch({
    products: PRODUCTS,
    batchLabel: "Email-marketing Priority-2 onboarding 2026-08-17",
    seedSnippetFile: "_em-priority2-seed-snippet.ts",
    videoSpecFile: "_em-priority2-official-videos.json",
    jobTag: "email-marketing-priority2",
  });
}

main();
