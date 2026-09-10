#!/usr/bin/env npx tsx
/**
 * Evidence quality upgrade — normalize real sources, elevate DATA_VERIFIED
 * only after live vendor plan confirmation, refresh testing queue top 10.
 *
 *   npm run seo:evidence-quality
 *   npm run seo:evidence-quality -- --apply --limit 40
 *   npx tsx scripts/seo/run-evidence-quality.ts --dry-run --limit 15
 *
 * Never fabricates hands-on ProductTestSession records.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { runEvidenceQuality } from "@/services/seo/evidence-quality";
import {
  buildProductTestingQueue,
  formatProductTestingQueueMarkdown,
  DEFAULT_TESTING_QUEUE_LIMIT,
} from "@/services/product-testing/queue";
import { buildTestCoverageMetrics } from "@/services/product-testing/coverage";
import { reconcileDataVerifiedCoverage } from "@/services/editorial/pricing-verified-at";

function argValue(args: string[], name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const dryRun = args.includes("--dry-run") || !apply;
  const limit = Number(argValue(args, "--limit") ?? "40");

  console.log(
    `Evidence quality: limit=${limit} mode=${dryRun ? "dry-run (no stamps)" : "apply"}`,
  );

  const report = await runEvidenceQuality({
    limit,
    apply: !dryRun,
    writeArtifacts: true,
  });

  console.log(
    `Packs=${report.packsBuilt} checks=${report.pricingChecksAttempted} verified=${report.pricingChecksVerified} promoted=${report.promotedToDataVerified} languageHits=${report.languageHits}`,
  );

  // Refresh human testing queue (top 10) — never fabricate sessions.
  const queue = buildProductTestingQueue(DEFAULT_TESTING_QUEUE_LIMIT);
  const coverage = buildTestCoverageMetrics();
  const outDir = path.join(process.cwd(), "docs/editorial");
  mkdirSync(outDir, { recursive: true });
  const queuePath = path.join(outDir, "PRODUCT-TESTING-QUEUE.md");
  const queueBody = formatProductTestingQueueMarkdown(queue);
  writeFileSync(
    queuePath,
    `${queueBody}
## Coverage snapshot

| Metric | Count |
| --- | ---: |
| Total products | ${coverage.totalProducts} |
| Researched | ${coverage.researched} |
| Data verified | ${coverage.dataVerified} |
| Hands-on tested | ${coverage.handsOnTested} |
| Reviews with public test evidence | ${coverage.reviewsWithEvidence} |
| Comparisons with any hands-on side | ${coverage.comparisonsWithEvidence} |
| Comparisons both tested | ${coverage.comparisonsBothTested} |
| Comparisons one tested | ${coverage.comparisonsOneTested} |
| Comparisons none tested | ${coverage.comparisonsNoneTested} |

Generated with coverage at ${coverage.generatedAt}.

**Hands-on tested must stay 0 until a real human session is completed.** Do not fabricate sessions.
`,
    "utf8",
  );
  console.log(`Wrote ${queuePath} (${queue.items.length} products)`);

  // Refresh DATA_VERIFIED reconciliation markdown from growth dashboard helper.
  const recon = reconcileDataVerifiedCoverage();
  console.log(
    `DATA_VERIFIED reconciliation: accepted=${recon.accepted} rejected=${recon.rejected}`,
  );

  for (const p of report.packs.filter((x) => x.promotedToDataVerified)) {
    console.log(
      `  PROMOTED ${p.slug} → data_verified @ ${p.pricingVerification.verifiedAt}`,
    );
  }
  for (const t of report.testingQueueTop10) {
    console.log(
      `  TESTQ ${t.rank}. ${t.slug} priority=${t.evidencePriorityScore} comps=${t.comparisonCount}`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
