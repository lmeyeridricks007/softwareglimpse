#!/usr/bin/env npx tsx
/**
 * Progressive comparison enrichment CLI.
 *
 *   npm run seo:enrich-comparisons
 *   npm run seo:enrich-comparisons -- --batch 25 --apply
 *   npm run seo:enrich-comparisons -- --batch 20 --apply --promote
 *   npm run seo:enrich-comparisons -- --slugs hubspot-vs-pipedrive --apply
 *   npm run seo:enrich-comparisons -- --json --no-write
 */
import {
  buildCompareEnrichmentReport,
  runCompareEnrichmentBatch,
  writeCompareEnrichmentOutputs,
} from "@/services/seo/compare-enrichment";
import { loadContentLifecycleStoreFromDisk } from "@/services/seo/content-lifecycle/store-write";

function argValue(args: string[], name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

function main() {
  loadContentLifecycleStoreFromDisk();
  const args = process.argv.slice(2);
  const noWrite = args.includes("--no-write");
  const asJson = args.includes("--json");
  const apply = args.includes("--apply");
  const promote = args.includes("--promote");
  const batchRaw = argValue(args, "--batch");
  const batchSize = batchRaw ? Number(batchRaw) : 25;
  const slugsRaw = argValue(args, "--slugs");
  const slugs = slugsRaw
    ? slugsRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined;

  const report = buildCompareEnrichmentReport();
  const batch = runCompareEnrichmentBatch({
    batchSize: Number.isFinite(batchSize) ? batchSize : 25,
    apply,
    promote,
    slugs,
  });

  if (!noWrite) {
    const paths = writeCompareEnrichmentOutputs(report, batch);
    console.error(`Wrote ${paths.markdownPath}`);
    console.error(`Wrote ${paths.jsonPath}`);
  }

  if (asJson) {
    console.log(
      JSON.stringify(
        {
          summary: report.summary,
          topQueue: report.queue.slice(0, 20),
          batch: {
            batchSize: batch.batchSize,
            applied: batch.applied.filter((a) => a.applied).length,
            promoted: batch.promoted,
            skippedPromotion: batch.skippedPromotion.slice(0, 10),
            queueRemaining: batch.queueRemaining,
          },
        },
        null,
        2,
      ),
    );
  } else {
    console.log(
      `Compare enrichment: queue ${report.summary.improveQueueSize} → batch ${batch.batchSize}, applied ${batch.applied.filter((a) => a.applied).length}, promoted ${batch.promoted.length}, remaining ~${batch.queueRemaining}`,
    );
  }
}

main();
