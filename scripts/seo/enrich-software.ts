#!/usr/bin/env npx tsx
/**
 * Apply software enrichment overlays for explicit slugs.
 *
 *   npm run seo:enrich-software -- --slug pipedrive
 *   npm run seo:enrich-software -- --batch 25
 */
import {
  applySoftwareEnrichment,
  buildSoftwareEnrichmentQueue,
  runSoftwareEnrichmentBatch,
} from "@/services/seo/software-enrichment";

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  if (i === -1) return undefined;
  return process.argv[i + 1];
}

function main() {
  const slug = arg("--slug");
  const batchRaw = arg("--batch");
  const batch = batchRaw ? Number(batchRaw) : undefined;

  if (slug) {
    const result = applySoftwareEnrichment(slug);
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  const queue = buildSoftwareEnrichmentQueue({
    limit: Number.isFinite(batch) ? batch : 25,
  });
  const result = runSoftwareEnrichmentBatch({
    slugs: queue.map((q) => q.slug),
  });
  console.log(
    JSON.stringify(
      {
        queued: queue.length,
        applied: result.applied.filter((a) => a.applied).length,
        materiallyImproved: result.materiallyImproved.length,
        failed: result.failed,
        dependentsNeedingRefresh: result.totalDependentsNeedingRefresh,
      },
      null,
      2,
    ),
  );
}

main();
