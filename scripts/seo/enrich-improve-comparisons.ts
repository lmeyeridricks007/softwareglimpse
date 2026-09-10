#!/usr/bin/env npx tsx
/**
 * Enrich IMPROVE comparisons from lifecycle without rebuilding the 4000-page
 * compare-audit queue. Existing URLs only.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { runCompareEnrichmentBatch } from "@/services/seo/compare-enrichment";
import { loadContentLifecycleStoreFromDisk } from "@/services/seo/content-lifecycle/store-write";
import { getContentLifecycleStoreSnapshot } from "@/services/seo/content-lifecycle/store";

const ROOT = process.cwd();
const BATCH = 25;
const WAVE_LIMIT = Number(process.env.SG_COMPARE_ENRICH_LIMIT ?? "200");

function main() {
  loadContentLifecycleStoreFromDisk();
  const snap = getContentLifecycleStoreSnapshot();
  const slugs = Object.values(snap.entries)
    .filter(
      (e) => e.kind === "comparison" && e.lifecycle === "IMPROVE",
    )
    .map((e) => e.slug);

  const selected = slugs.slice(0, WAVE_LIMIT);
  console.log(
    `IMPROVE comparisons=${slugs.length} processing=${selected.length} batch=${BATCH}`,
  );

  let promoted = 0;
  let applied = 0;
  let skipped = 0;
  const skipReasons: Record<string, number> = {};
  const promotedSlugs: string[] = [];

  for (let i = 0; i < selected.length; i += BATCH) {
    const batch = selected.slice(i, i + BATCH);
    const n = Math.floor(i / BATCH) + 1;
    console.log(`\n── batch ${n} (${batch.length}) ──`);
    const result = runCompareEnrichmentBatch({
      slugs: batch,
      apply: true,
      promote: true,
      persistFamilyQa: false,
    });
    applied += result.applied.filter((a) => a.applied).length;
    promoted += result.promoted.length;
    skipped += result.skippedPromotion.length;
    promotedSlugs.push(...result.promoted);
    for (const s of result.skippedPromotion) {
      const key = s.reasons[0] ?? "unknown";
      skipReasons[key] = (skipReasons[key] ?? 0) + 1;
    }
    console.log(
      `  applied=${result.applied.filter((a) => a.applied).length} promoted=${result.promoted.length} skipped=${result.skippedPromotion.length}`,
    );
    if (result.promoted.length) console.log("  promoted", result.promoted.join(", "));
  }

  const out = {
    generatedAt: new Date().toISOString(),
    improvePool: slugs.length,
    processed: selected.length,
    applied,
    promoted,
    skipped,
    skipReasons,
    promotedSlugs,
  };
  writeFileSync(
    path.join(ROOT, "data/seo/batches/compare-improve-enrich-2026-09-10.json"),
    `${JSON.stringify(out, null, 2)}\n`,
    "utf8",
  );
  console.log("\n════════");
  console.log(out);
}

main();
