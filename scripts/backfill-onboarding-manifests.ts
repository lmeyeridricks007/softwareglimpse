#!/usr/bin/env npx tsx
/**
 * Backfill onboarding manifests for seed products missing a manifest file.
 *
 * Usage: npm run onboard:manifest-backfill
 *        npm run onboard:manifest-backfill -- --dry-run
 */
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { getAllSoftwareUnfiltered } from "@/data";
import { loadAssessment, loadReview } from "@/data/editorial/store";
import {
  listManifests,
  manifestsDir,
  type OnboardingManifest,
} from "@/data/onboarding/store";
import { loadEnrichment } from "@/data/research/store";

const BACKFILL_RUN_PREFIX = "backfill-manifest-2026-08-23c";
const BACKFILL_AT = new Date().toISOString();

function existingSlugs(): Set<string> {
  const dir = manifestsDir();
  if (!existsSync(dir)) return new Set();
  return new Set(
    listManifests().map((m) => m.productSlug),
  );
}

function inferStatus(input: {
  reviewOk: boolean;
  hasEnrichment: boolean;
  hasAffiliate: boolean;
  published: boolean;
  scheduled: boolean;
}): OnboardingManifest["status"] {
  if (!input.reviewOk) return "review-required";
  if (input.scheduled) return "ready";
  if (input.hasEnrichment && input.reviewOk && input.published) {
    return "ready";
  }
  if (
    input.hasAffiliate &&
    input.hasEnrichment &&
    input.reviewOk &&
    input.published
  ) {
    return "ready";
  }
  return "review-required";
}

function buildManifest(
  slug: string,
  publishedAt?: string,
): OnboardingManifest {
  const assessment = loadAssessment(slug);
  const review = loadReview(slug);
  const enrichment = loadEnrichment(slug);
  const product = getAllSoftwareUnfiltered().find((s) => s.slug === slug)!;

  const reviewOk =
    assessment?.status === "approved" &&
    review?.editorialStatus === "approved";
  const hasEnrichment = Boolean(enrichment);
  const hasAffiliate = Boolean(
    product.affiliate?.enabled && product.affiliate.trackingUrl,
  );
  const scheduled = product.metadata.status === "scheduled";
  const published = product.metadata.status === "published";

  const status = inferStatus({
    reviewOk,
    hasEnrichment,
    hasAffiliate,
    published,
    scheduled,
  });

  const notes = [`backfill:pre-manifest-catalogue`];
  if (scheduled && product.metadata.scheduledAt) {
    notes.push(`scheduled:${product.metadata.scheduledAt}`);
  }
  if (status === "review-required") {
    notes.push("warning:RELATIONSHIP_REVIEW");
  }

  return {
    productSlug: slug,
    latestRunId: `${BACKFILL_RUN_PREFIX}:${slug}`,
    status,
    firstOnboardedAt: publishedAt ?? product.metadata.publishedAt ?? BACKFILL_AT,
    lastReconciledAt: BACKFILL_AT,
    lastResearchRunAt: hasEnrichment ? BACKFILL_AT : undefined,
    contentTasksCreated: 0,
    notes,
  };
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  const have = existingSlugs();
  const missing = getAllSoftwareUnfiltered().filter((s) => !have.has(s.slug));

  let ready = 0;
  let reviewRequired = 0;
  const written: string[] = [];

  for (const product of missing) {
    const manifest = buildManifest(
      product.slug,
      product.metadata.publishedAt,
    );
    if (manifest.status === "ready") ready++;
    else reviewRequired++;

    if (!dryRun) {
      const path = join(manifestsDir(), `${product.slug}.json`);
      writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    }
    written.push(product.slug);
  }

  console.log(
    dryRun ? "DRY RUN — no files written" : `Wrote ${written.length} manifests`,
  );
  console.log(`  ready: ${ready}`);
  console.log(`  review-required: ${reviewRequired}`);
  console.log(`  total missing before: ${missing.length}`);
  if (dryRun && written.length <= 20) {
    console.log("  slugs:", written.join(", "));
  }
}

main();
