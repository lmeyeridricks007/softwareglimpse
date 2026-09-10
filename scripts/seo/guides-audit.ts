#!/usr/bin/env npx tsx
/**
 * Guides index-worthiness audit CLI.
 *
 *   npm run seo:guides-audit
 *   npm run seo:guides-audit -- --json
 *   npm run seo:guides-audit -- --no-write
 */
import {
  runGuidesIndexAudit,
  writeGuidesAuditOutputs,
  formatGuidesAuditMarkdown,
} from "@/services/seo/guides-index-worthiness";

function main() {
  const args = process.argv.slice(2);
  const noWrite = args.includes("--no-write");
  const asJson = args.includes("--json");

  const report = runGuidesIndexAudit();

  if (!noWrite) {
    const paths = writeGuidesAuditOutputs(report);
    console.error(`Wrote ${paths.markdownPath}`);
    console.error(`Wrote ${paths.jsonPath}`);
  }

  if (asJson) {
    console.log(
      JSON.stringify(
        {
          summary: report.summary,
          topImprove: report.topImprove.slice(0, 20),
          proposedMerges: report.proposedMerges.slice(0, 20),
          generationPolicy: report.generationPolicy,
        },
        null,
        2,
      ),
    );
  } else if (noWrite) {
    console.log(formatGuidesAuditMarkdown(report));
  } else {
    const s = report.summary;
    console.log(
      `Guides audit: ${s.total} pages → Indexable ${s.byLifecycle.INDEXABLE}, Improve ${s.improvementQueueCount}, Ready ${s.readyForPromotionCount}, Manual ${s.manualReviewCount}, Retired ${s.retiredCount}, Potential ${s.potentialIndexableAfterRemediation}`,
    );
  }
}

main();
