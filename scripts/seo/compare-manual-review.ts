#!/usr/bin/env npx tsx
/**
 * Triage MANUAL_REVIEW comparisons with evidence-backed classification.
 *
 *   npm run seo:compare-manual-review
 *   npm run seo:compare-manual-review -- --apply
 *   npm run seo:compare-manual-review -- --json
 *   npm run seo:compare-manual-review -- --no-write
 *   npm run seo:compare-manual-review -- --limit 50
 *
 * --apply: move enrichable classes to IMPROVE; retain others as MANUAL_REVIEW;
 *          write decisions JSON; refresh compare audit.
 */
import { execSync } from "node:child_process";
import {
  runCompareManualReview,
  writeManualReviewOutputs,
  formatManualReviewMarkdown,
  applyManualReviewTriage,
} from "@/services/seo/compare-manual-review";
import {
  loadContentLifecycleStoreFromDisk,
} from "@/services/seo/content-lifecycle/store-write";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  if (i === -1) return undefined;
  return process.argv[i + 1];
}

function main() {
  const noWrite = process.argv.includes("--no-write");
  const asJson = process.argv.includes("--json");
  const apply = process.argv.includes("--apply");
  const limitRaw = arg("--limit");
  const limit = limitRaw ? Number(limitRaw) : undefined;

  loadContentLifecycleStoreFromDisk();

  const report = runCompareManualReview({
    limit: Number.isFinite(limit) ? limit : undefined,
  });

  let applyResult: ReturnType<typeof applyManualReviewTriage> | null = null;
  if (apply && !noWrite) {
    applyResult = applyManualReviewTriage(report);
    report.summary.appliedToImprove = applyResult.appliedToImprove;
    report.summary.retainedManualReview = applyResult.retainedManualReview;
    console.error(
      `Applied lifecycle: IMPROVE=${applyResult.appliedToImprove}, MANUAL_REVIEW=${applyResult.retainedManualReview}, skippedIndexable=${applyResult.skippedIndexable}`,
    );
    console.error(`Wrote ${applyResult.decisionsPath}`);
  }

  if (!noWrite) {
    const paths = writeManualReviewOutputs(report);
    console.error(`Wrote ${paths.markdownPath}`);
    console.error(`Wrote ${paths.jsonPath}`);
  }

  if (apply && !noWrite) {
    try {
      // Refresh audit lifecycle counts without clobbering applied triage outputs
      execSync("npm run seo:compare-audit -- --skip-manual-review", {
        cwd: process.cwd(),
        stdio: "pipe",
        timeout: 300_000,
      });
      console.error("Updated comparison audit (seo:compare-audit --skip-manual-review)");
      // Re-write triage outputs after audit so applied counts remain authoritative
      writeManualReviewOutputs(report);
    } catch (e) {
      console.error("compare-audit failed after apply", e);
    }
  }

  if (asJson) {
    console.log(
      JSON.stringify(
        {
          summary: report.summary,
          enrichmentQueueSlugs: report.enrichmentQueueSlugs.slice(0, 40),
          weakRelationshipSlugs: report.weakRelationshipSlugs.slice(0, 40),
          nonsensicalSlugs: report.nonsensicalSlugs.slice(0, 40),
          retireCandidates: report.retireCandidates.slice(0, 40),
          apply: applyResult
            ? {
                appliedToImprove: applyResult.appliedToImprove,
                retainedManualReview: applyResult.retainedManualReview,
              }
            : null,
          sample: report.results.slice(0, 15).map((r) => ({
            slug: r.slug,
            classification: r.classification,
            decision: r.decision,
            evidenceScore: r.evidence.evidenceScore,
            thesis: r.thesis?.label ?? null,
            appliedLifecycle: r.appliedLifecycle ?? null,
            presentFlags: r.evidence.items
              .filter((i) => i.present)
              .map((i) => i.flag),
          })),
        },
        null,
        2,
      ),
    );
  } else if (noWrite) {
    console.log(formatManualReviewMarkdown(report));
  } else {
    const s = report.summary;
    console.log(
      `Manual review triage: ${s.totalReviewed} reviewed → enqueue ${s.enqueueEnrichment}, weak ${s.leaveImprove}, missing ${s.blockCatalogue}, nonsensical/preserve ${s.preserveReview}, retire candidates ${s.retireCandidates}` +
        (apply
          ? ` | applied IMPROVE=${s.appliedToImprove} MANUAL_REVIEW=${s.retainedManualReview}`
          : " (pass --apply to write lifecycle)"),
    );
  }
}

main();
