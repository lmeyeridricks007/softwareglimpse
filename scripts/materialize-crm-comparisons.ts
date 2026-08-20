#!/usr/bin/env npx tsx
/**
 * Materialize + report CRM comparison research coverage.
 *
 *   npm run comparisons:crm -- [--approve]
 */
import {
  buildCrmComparisonsFromResearch,
  crmComparisonCoverageReport,
  listCrmProductSlugs,
} from "../src/services/comparison-research";
import { evaluateComparisonQuality } from "../src/domain/quality-gates";
import { ComparisonSchema } from "../src/domain";

async function main() {
  const approve = process.argv.includes("--approve");
  const products = listCrmProductSlugs();
  const comparisons = buildCrmComparisonsFromResearch({ autoApprove: approve });
  const report = crmComparisonCoverageReport(comparisons);

  console.log(`CRM products (${products.length}): ${products.join(", ")}`);
  console.log(`Pairs: ${report.pairCount}`);
  console.log(`Approved: ${report.approved}`);
  console.log(`Indexable: ${report.indexable}`);
  console.log(`With screenshot mention: ${report.withScreenshots}`);
  if (report.incompleteResearch.length) {
    console.log(`Incomplete: ${report.incompleteResearch.join(", ")}`);
  }

  let gateFails = 0;
  for (const raw of comparisons) {
    const parsed = ComparisonSchema.parse(raw);
    const quality = evaluateComparisonQuality(parsed);
    if (!quality.ok) {
      gateFails += 1;
      console.log(`GATE FAIL ${parsed.slug}: ${quality.failures.join(", ")}`);
    }
  }
  console.log(`Quality gate failures: ${gateFails}`);
  if (gateFails > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
