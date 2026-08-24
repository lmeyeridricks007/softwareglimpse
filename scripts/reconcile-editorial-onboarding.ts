#!/usr/bin/env npx tsx
/**
 * Run reconcile onboarding for editorial (non-affiliate) seed products whose
 * manifests were created by manifest-backfill or manifest-reconcile only.
 *
 * Usage: npx tsx scripts/reconcile-editorial-onboarding.ts
 *        npx tsx scripts/reconcile-editorial-onboarding.ts --dry-run
 */
import { getAllSoftwareUnfiltered } from "@/data";
import { listManifests } from "@/data/onboarding/store";
import { SoftwareOnboardingRequestSchema } from "@/domain";
import { onboardSoftware } from "@/services/onboarding/server";

const SYNTHETIC_RUN_PREFIXES = ["reconcile-manifest-", "backfill-manifest-"];

function isEditorialCatalogue(
  product: ReturnType<typeof getAllSoftwareUnfiltered>[number],
): boolean {
  return !(product.affiliate?.enabled && product.affiliate.trackingUrl);
}

function needsOnboardRun(latestRunId: string | undefined): boolean {
  if (!latestRunId) return true;
  return SYNTHETIC_RUN_PREFIXES.some((prefix) => latestRunId.startsWith(prefix));
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const manifests = new Map(listManifests().map((m) => [m.productSlug, m]));

  const targets = getAllSoftwareUnfiltered()
    .filter((product) => isEditorialCatalogue(product))
    .filter((product) => {
      const manifest = manifests.get(product.slug);
      return !manifest || needsOnboardRun(manifest.latestRunId);
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));

  console.log(
    dryRun
      ? `DRY RUN — would reconcile ${targets.length} editorial products`
      : `Reconciling ${targets.length} editorial products…`,
  );

  let ready = 0;
  let reviewRequired = 0;
  let blocked = 0;
  let failed = 0;

  for (const product of targets) {
    if (dryRun) {
      console.log(`  ${product.slug}`);
      continue;
    }

    const run = await onboardSoftware(
      SoftwareOnboardingRequestSchema.parse({
        name: product.name,
        slug: product.slug,
        website: product.website,
        source: "existing-content",
        suggestedCategoryIds: [product.primaryCategorySlug],
        options: { runResearch: false, createContentPlan: true, dryRun: false },
      }),
    );

    if (run.status === "ready") ready++;
    else if (run.status === "review-required") reviewRequired++;
    else if (run.status === "blocked") blocked++;
    else failed++;

    console.log(
      `${product.slug} -> ${run.status} (${run.duplicateOutcome ?? "n/a"})`,
    );
  }

  if (!dryRun) {
    console.log("");
    console.log(`Done: ready=${ready} review-required=${reviewRequired} blocked=${blocked} other=${failed}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
