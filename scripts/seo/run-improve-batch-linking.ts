#!/usr/bin/env npx tsx
/**
 * Plan + apply contextual knowledge-graph linking for an improve batch.
 *
 *   npx tsx scripts/seo/run-improve-batch-linking.ts
 *   npx tsx scripts/seo/run-improve-batch-linking.ts --batch improve-batch-2026-09-06 --dry-run
 *   npx tsx scripts/seo/run-improve-batch-linking.ts --light --skip-graph
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { runImproveBatchLinking } from "@/services/seo/improve-linking";
import type { BatchPageRef } from "@/services/seo/improve-linking";

const ROOT = process.cwd();

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  if (i === -1) return undefined;
  return process.argv[i + 1];
}

function main() {
  const batchId = arg("--batch") ?? "improve-batch-2026-09-06";
  const batchPath = path.join(ROOT, "data/seo/batches", `${batchId}.json`);
  if (!existsSync(batchPath)) {
    console.error(`Missing batch file: ${batchPath}`);
    process.exit(1);
  }

  const batch = JSON.parse(readFileSync(batchPath, "utf8")) as {
    pages?: Array<Record<string, unknown>>;
  };

  const pages: BatchPageRef[] = (batch.pages ?? []).map((p) => {
    const before = (p.before ?? {}) as Record<string, unknown>;
    const after = (p.after ?? {}) as Record<string, unknown>;
    return {
      pageType: String(p.pageType ?? "guide"),
      slug: String(p.slug ?? ""),
      path: String(p.path ?? ""),
      beforeQuality: Number(before.qualityScore ?? 0),
      afterQuality: Number(after.qualityScore ?? before.qualityScore ?? 0),
      materiallyImproved: Boolean(p.materiallyImproved),
      uniqueValueCount: Array.isArray(after.uniqueValueAdded)
        ? after.uniqueValueAdded.length
        : undefined,
      lifecycleState: String(after.lifecycleState ?? before.lifecycleState ?? ""),
      stillBlocked: Boolean(p.stillBlocked),
    };
  });

  const report = runImproveBatchLinking({
    batchId,
    pages,
    dryRun: process.argv.includes("--dry-run"),
    light: process.argv.includes("--light"),
    skipGraphSnapshots: process.argv.includes("--skip-graph"),
    write: !process.argv.includes("--no-write"),
    qualityPromotions: pages.filter((p) =>
      String(p.lifecycleState).includes("INDEXABLE"),
    ).length,
  });

  console.log(
    JSON.stringify(
      {
        batchId: report.batchId,
        version: report.version,
        pagesPlanned: report.metrics.pagesPlanned,
        skippedWeak: report.metrics.skippedWeak,
        opportunitiesSelected: report.metrics.opportunitiesSelected,
        applied: report.applied.length,
        orphansBefore: report.metrics.orphansBefore,
        orphansAfter: report.metrics.orphansAfter,
        inboundLinksGained: report.metrics.inboundLinksGained,
        pagesWithPromotionImpact: report.metrics.pages.filter(
          (p) => p.promotionImpact,
        ).length,
        sampleImpact: report.metrics.pages.slice(0, 5).map((p) => ({
          path: p.path,
          inboundBefore: p.inboundBefore,
          inboundAfter: p.inboundAfter,
          hubDepthBefore: p.hubDepthBefore,
          hubDepthAfter: p.hubDepthAfter,
          linkingSources: p.linkingSources.length,
          anchorDiversity: p.anchorDiversity,
          promotionImpact: p.promotionImpact,
        })),
      },
      null,
      2,
    ),
  );
}

main();
