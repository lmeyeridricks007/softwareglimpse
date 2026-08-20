#!/usr/bin/env node
/**
 * Affiliate gap reconcile batch — full research/editorial packs for partial affiliate products.
 *
 * Usage: node scripts/onboard-affiliate-gap-reconcile-batch.mjs
 * Idempotent — overwrites research + editorial JSON for gap slugs.
 */
import {
  configureHrRuntime,
  runHrBatch,
  writeProduct as writeHrProduct,
  writeComparisonSpec as writeHrComparisonSpec,
} from "./lib/hr-onboard-runtime.mjs";
import {
  configurePmRuntime,
  runPmBatch,
  writeProduct as writePmProduct,
  writeComparisonSpec as writePmComparisonSpec,
} from "./lib/pm-onboard-runtime.mjs";
import {
  writeProduct as writeMktProduct,
} from "./lib/mkt-onboard-runtime.mjs";
import {
  configureAiRuntime,
  runAiBatch,
  writeProduct as writeAiProduct,
  writeComparisonSpec as writeAiComparisonSpec,
} from "./lib/ai-onboard-runtime.mjs";
import {
  configureCsRuntime,
  runCsBatch,
  writeProduct as writeCsProduct,
  writeComparisonSpec as writeCsComparisonSpec,
} from "./lib/cs-onboard-runtime.mjs";
import {
  configureEcomRuntime,
  runEcomBatch,
  writeProduct as writeEcomProduct,
  writeComparisonSpec as writeEcomComparisonSpec,
} from "./lib/ecom-onboard-runtime.mjs";
import { writeComparisonSpec as writeBcComparisonSpec } from "./lib/bc-onboard-runtime.mjs";

import {
  PRODUCTS as HR_PRODUCTS,
  COMPARISON_PAIRS as HR_PAIRS,
  VERIFIED_AT as HR_VERIFIED,
} from "./lib/affiliate-gap-hr-products.mjs";
import {
  PRODUCTS as PM_PRODUCTS,
  COMPARISON_PAIRS as PM_PAIRS,
} from "./lib/affiliate-gap-pm-products.mjs";
import {
  PRODUCTS as MKT_PRODUCTS,
  COMPARISON_PAIRS as MKT_PAIRS,
} from "./lib/affiliate-gap-mkt-products.mjs";
import {
  PRODUCTS as AI_PRODUCTS,
  COMPARISON_PAIRS as AI_PAIRS,
} from "./lib/affiliate-gap-ai-products.mjs";
import {
  PRODUCTS as CS_PRODUCTS,
  COMPARISON_PAIRS as CS_PAIRS,
} from "./lib/affiliate-gap-cs-products.mjs";
import {
  PRODUCTS as ECOM_PRODUCTS,
  COMPARISON_PAIRS as ECOM_PAIRS,
} from "./lib/affiliate-gap-ecom-products.mjs";
import {
  PRODUCTS as BC_STUBS,
  COMPARISON_PAIRS as BC_PAIRS,
  SKIP_PRODUCT_WRITE as BC_SKIP,
} from "./lib/affiliate-gap-bc-products.mjs";

const BATCH_LABEL = "Affiliate gap reconcile 2026-08-19";
const VERIFIED_AT = HR_VERIFIED;
const PUBLISHED_AT = "2026-08-19T00:00:00.000Z";

function writeFiltered(products, writer) {
  for (const p of products) {
    if (p.skipWrite) continue;
    writer(p);
  }
}

function main() {
  console.log(`\n=== ${BATCH_LABEL} ===\n`);

  configureHrRuntime({
    verifiedAt: VERIFIED_AT,
    publishedAt: PUBLISHED_AT,
    batchLabel: BATCH_LABEL,
    jobTag: "affiliate-gap-hr",
  });
  writeFiltered(HR_PRODUCTS, writeHrProduct);
  writeHrComparisonSpec(
    HR_PRODUCTS,
    HR_PAIRS,
    "_affiliate-gap-hr-comparisons.json",
  );
  console.log(`✓ HR ${HR_PRODUCTS.length} products`);

  configurePmRuntime({
    verifiedAt: VERIFIED_AT,
    publishedAt: PUBLISHED_AT,
    batchLabel: BATCH_LABEL,
    jobTag: "affiliate-gap-pm",
  });
  writeFiltered(PM_PRODUCTS, writePmProduct);
  writePmComparisonSpec(
    PM_PRODUCTS,
    PM_PAIRS,
    "_affiliate-gap-pm-comparisons.json",
  );
  console.log(`✓ PM ${PM_PRODUCTS.length} products`);

  writeFiltered(MKT_PRODUCTS, writeMktProduct);
  console.log(`✓ Marketing ${MKT_PRODUCTS.length} products`);

  configureAiRuntime({
    verifiedAt: VERIFIED_AT,
    publishedAt: PUBLISHED_AT,
    batchLabel: BATCH_LABEL,
    jobTag: "affiliate-gap-ai",
  });
  writeFiltered(AI_PRODUCTS, writeAiProduct);
  writeAiComparisonSpec(
    AI_PRODUCTS,
    AI_PAIRS,
    "_affiliate-gap-ai-comparisons.json",
  );
  console.log(`✓ AI ${AI_PRODUCTS.length} products`);

  configureCsRuntime({
    verifiedAt: VERIFIED_AT,
    publishedAt: PUBLISHED_AT,
    batchLabel: BATCH_LABEL,
    jobTag: "affiliate-gap-cs",
  });
  writeFiltered(CS_PRODUCTS, writeCsProduct);
  writeCsComparisonSpec(
    CS_PRODUCTS,
    CS_PAIRS,
    "_affiliate-gap-cs-comparisons.json",
  );
  console.log(`✓ CS ${CS_PRODUCTS.length} products`);

  configureEcomRuntime({
    verifiedAt: VERIFIED_AT,
    publishedAt: PUBLISHED_AT,
    batchLabel: BATCH_LABEL,
    jobTag: "affiliate-gap-ecom",
  });
  writeFiltered(ECOM_PRODUCTS, writeEcomProduct);
  writeEcomComparisonSpec(
    ECOM_PRODUCTS,
    ECOM_PAIRS,
    "_affiliate-gap-ecom-comparisons.json",
  );
  console.log(`✓ Ecommerce ${ECOM_PRODUCTS.length} products`);

  if (BC_SKIP) {
    writeBcComparisonSpec(
      BC_STUBS,
      BC_PAIRS,
      "_affiliate-gap-bc-comparisons.json",
    );
    console.log(`✓ BC comparisons only (skipped write — existing research)`);
  }

  console.log("\nDone. Next: node scripts/run-affiliate-gap-workflows.mjs");
}

main();
