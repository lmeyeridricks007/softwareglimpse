#!/usr/bin/env npx tsx
/**
 * Comparison index-worthiness audit CLI.
 *
 *   npm run seo:compare-audit
 *   npm run seo:compare-audit -- --json
 *   npm run seo:compare-audit -- --no-write
 *   npm run seo:compare-audit -- --skip-manual-review
 */
import {
  runCompareIndexAudit,
  writeCompareAuditOutputs,
  formatCompareAuditMarkdown,
} from "@/services/seo/compare-index-worthiness";
import {
  runCompareManualReview,
  writeManualReviewOutputs,
} from "@/services/seo/compare-manual-review";
import { loadContentLifecycleStoreFromDisk } from "@/services/seo/content-lifecycle/store-write";

function main() {
  const args = process.argv.slice(2);
  const noWrite = args.includes("--no-write");
  const asJson = args.includes("--json");
  const skipManual = args.includes("--skip-manual-review");

  loadContentLifecycleStoreFromDisk();

  const report = runCompareIndexAudit();

  if (!noWrite) {
    const paths = writeCompareAuditOutputs(report);
    console.error(`Wrote ${paths.markdownPath}`);
    console.error(`Wrote ${paths.jsonPath}`);

    if (!skipManual) {
      const triage = runCompareManualReview({
        evaluations: report.evaluations,
      });
      const triagePaths = writeManualReviewOutputs(triage);
      console.error(`Wrote ${triagePaths.markdownPath}`);
      console.error(`Wrote ${triagePaths.jsonPath}`);
      console.error(
        `Manual review triage: enqueue ${triage.summary.enqueueEnrichment}, weak ${triage.summary.leaveImprove}, retire candidates ${triage.summary.retireCandidates}`,
      );
    }
  }

  if (asJson) {
    console.log(
      JSON.stringify(
        {
          summary: report.summary,
          topImprove: report.topImprove.slice(0, 20),
          generationPolicy: report.generationPolicy,
        },
        null,
        2,
      ),
    );
  } else if (noWrite) {
    console.log(formatCompareAuditMarkdown(report));
  } else {
    const s = report.summary;
    console.log(
      `Compare audit: ${s.total} pages → Indexable ${s.byLifecycle.INDEXABLE}, Improve ${s.improvementQueueCount}, Ready ${s.readyForPromotionCount}, Manual ${s.manualReviewCount}, Retired ${s.retiredCount}, Potential ${s.potentialIndexableAfterRemediation}`,
    );
  }
}

main();
