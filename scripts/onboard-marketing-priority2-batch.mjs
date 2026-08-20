#!/usr/bin/env node
/**
 * Marketing Priority-2 depth products:
 * Later, Agorapulse, Hootsuite, Sprout Social, Meltwater, Brandwatch,
 * Iterable, WhatConverts, Uniqode, Switcher Studio.
 *
 * Usage: node scripts/onboard-marketing-priority2-batch.mjs
 * Idempotent — overwrites product research / editorial packs.
 *
 * Does NOT auto-publish beyond writing approved editorial JSON.
 * Affiliate economics never enter scores. handsOnTesting=false.
 */
import { runMktBatch, avgScore } from "./lib/mkt-onboard-runtime.mjs";
import { PRODUCTS } from "./lib/mkt-priority2-products.mjs";

function main() {
  console.log("Marketing Priority-2 products:");
  for (const p of PRODUCTS) {
    console.log(
      `  - ${p.slug} overall=${avgScore(p.scores)} primary=${p.primaryCategorySlug}${
        p.catalogueSourceId ? ` aff=${p.catalogueSourceId}` : ""
      }`,
    );
  }
  runMktBatch({
    products: PRODUCTS,
    batchLabel: "Marketing Priority-2 onboarding 2026-08-17",
    seedSnippetFile: "_marketing-priority2-seed-snippet.ts",
    videoSpecFile: "_marketing-priority2-official-videos.json",
    jobTag: "priority2",
  });
}

main();
