#!/usr/bin/env npx tsx
/**
 * Progressive guide enrichment CLI.
 *
 *   npm run seo:enrich-guides
 *   npm run seo:enrich-guides -- --batch 30 --apply
 *   npm run seo:enrich-guides -- --batch 20 --apply --promote
 *   npm run seo:enrich-guides -- --slugs what-is-pipedrive,pipedrive-implementation --apply
 *   npm run seo:enrich-guides -- --json --no-write
 */
import {
  buildGuideEnrichmentReport,
  runGuideEnrichmentBatch,
  writeGuideEnrichmentOutputs,
} from "@/services/seo/guide-enrichment";
import { loadContentLifecycleStoreFromDisk } from "@/services/seo/content-lifecycle/store-write";

function argValue(args: string[], name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  return args[idx + 1];
}

function main() {
  // Promotions live on disk — load before queue scoring so INDEXABLE guides
  // are not re-selected as IMPROVE.
  loadContentLifecycleStoreFromDisk();
  const args = process.argv.slice(2);
  const noWrite = args.includes("--no-write");
  const asJson = args.includes("--json");
  const apply = args.includes("--apply");
  const promote = args.includes("--promote");
  const batchRaw = argValue(args, "--batch");
  const batchSize = batchRaw ? Number(batchRaw) : 30;
  const slugsRaw = argValue(args, "--slugs");
  const slugs = slugsRaw
    ? slugsRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined;

  const report = buildGuideEnrichmentReport();
  const batch = runGuideEnrichmentBatch({
    batchSize: Number.isFinite(batchSize) ? batchSize : 30,
    apply,
    promote,
    slugs,
  });

  if (!noWrite) {
    const paths = writeGuideEnrichmentOutputs(report, batch);
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
      `Guide enrichment: queue ${report.summary.improveQueueSize} → batch ${batch.batchSize}, applied ${batch.applied.filter((a) => a.applied).length}, promoted ${batch.promoted.length}, remaining ~${batch.queueRemaining}`,
    );
  }
}

main();
