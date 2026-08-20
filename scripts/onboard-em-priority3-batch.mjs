#!/usr/bin/env node
/**
 * Email Marketing Priority-3 mid-tier products:
 * Drip, Mailjet, Customer.io.
 *
 * Usage: node scripts/onboard-em-priority3-batch.mjs
 * Idempotent — overwrites product research / editorial packs.
 *
 * Does NOT auto-publish beyond writing approved editorial JSON.
 * Affiliate economics never enter scores.
 */
import { runEmBatch, avgScore } from "./lib/em-onboard-runtime.mjs";
import { PRODUCTS } from "./lib/em-priority3-products.mjs";

function main() {
  console.log("EM Priority-3 products:");
  for (const p of PRODUCTS) {
    console.log(`  - ${p.slug} overall=${avgScore(p.scores)} role=${p.membershipRole}`);
  }
  runEmBatch({
    products: PRODUCTS,
    batchLabel: "Email-marketing Priority-3 onboarding 2026-08-17",
    seedSnippetFile: "_em-priority3-seed-snippet.ts",
    videoSpecFile: "_em-priority3-official-videos.json",
    jobTag: "email-marketing-priority3",
  });
}

main();
