#!/usr/bin/env npx tsx
/**
 * Promote onboarding manifests to `ready` when catalogue editorial + research are complete.
 *
 * Usage: npm run onboard:manifest-reconcile
 *        npm run onboard:manifest-reconcile -- --dry-run
 */
import { getAllSoftwareUnfiltered } from "@/data";
import { loadAssessment, loadReview } from "@/data/editorial/store";
import {
  listManifests,
  saveManifest,
  type OnboardingManifest,
} from "@/data/onboarding/store";
import { loadEnrichment } from "@/data/research/store";

const RECONCILE_AT = new Date().toISOString();
const RECONCILE_RUN_PREFIX = "reconcile-manifest-2026-08-23c";

function editorialReady(slug: string): boolean {
  const assessment = loadAssessment(slug);
  const review = loadReview(slug);
  return (
    assessment?.status === "approved" && review?.editorialStatus === "approved"
  );
}

function shouldPromote(manifest: OnboardingManifest): boolean {
  if (manifest.status === "ready") return false;
  if (manifest.status !== "blocked" && manifest.status !== "review-required") {
    return false;
  }
  const product = getAllSoftwareUnfiltered().find(
    (s) => s.slug === manifest.productSlug,
  );
  if (!product) return false;
  if (!loadEnrichment(manifest.productSlug)) return false;
  if (!editorialReady(manifest.productSlug)) return false;
  return true;
}

function reconcileNotes(manifest: OnboardingManifest): string[] {
  const hadDuplicateBlocker = (manifest.notes ?? []).some((n) =>
    n.includes("POSSIBLE_DUPLICATE"),
  );
  const kept = (manifest.notes ?? []).filter(
    (n) =>
      !n.startsWith("blocker:") &&
      !n.startsWith("warning:RELATIONSHIP_REVIEW") &&
      n !== "backfill:pre-manifest-catalogue",
  );
  const notes = [...kept, `reconcile:${RECONCILE_RUN_PREFIX}`];
  if (hadDuplicateBlocker) {
    notes.push("dedup:resolved-distinct-catalogue-sku");
  }
  return [...new Set(notes)];
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  let promoted = 0;
  let skipped = 0;

  for (const manifest of listManifests()) {
    if (!shouldPromote(manifest)) {
      skipped++;
      continue;
    }

    const preserveRunId =
      manifest.latestRunId?.startsWith("onboard-") === true
        ? manifest.latestRunId
        : `${RECONCILE_RUN_PREFIX}:${manifest.productSlug}`;

    const next: OnboardingManifest = {
      ...manifest,
      status: "ready",
      latestRunId: preserveRunId,
      lastReconciledAt: RECONCILE_AT,
      lastResearchRunAt: manifest.lastResearchRunAt ?? RECONCILE_AT,
      notes: reconcileNotes(manifest),
    };

    if (!dryRun) saveManifest(next);
    promoted++;
  }

  console.log(dryRun ? "DRY RUN — no files written" : `Promoted ${promoted} manifests to ready`);
  console.log(`  skipped (already ready or incomplete): ${skipped}`);
}

main();
