/**
 * Generate docs/editorial/PRODUCT-TESTING-QUEUE.md from catalogue + GSC opportunities.
 *
 * Usage: npm run testing:queue
 * Default: top 10 evidence-priority products only.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import {
  buildProductTestingQueue,
  formatProductTestingQueueMarkdown,
  DEFAULT_TESTING_QUEUE_LIMIT,
} from "@/services/product-testing/queue";
import { buildTestCoverageMetrics } from "@/services/product-testing/coverage";

const queue = buildProductTestingQueue(DEFAULT_TESTING_QUEUE_LIMIT);
const coverage = buildTestCoverageMetrics();

const outDir = path.join(process.cwd(), "docs/editorial");
mkdirSync(outDir, { recursive: true });

const queuePath = path.join(outDir, "PRODUCT-TESTING-QUEUE.md");
const queueBody = formatProductTestingQueueMarkdown(queue);
const withCoverage = `${queueBody}
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
`;

writeFileSync(queuePath, withCoverage, "utf8");
console.log(`Wrote ${queuePath} (${queue.items.length} products)`);
console.log(
  `Coverage: ${coverage.handsOnTested}/${coverage.totalProducts} hands-on`,
);
for (const item of queue.items) {
  console.log(
    `  ${item.rank}. ${item.productSlug} priority=${item.evidencePriorityScore} comps=${item.comparisonCount} gsc=${item.opportunityScore}`,
  );
}
