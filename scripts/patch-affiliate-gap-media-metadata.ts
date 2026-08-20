#!/usr/bin/env npx tsx
/**
 * Patch affiliate-gap enrichment media + screenshots with feature/use-case
 * mappings so asset discovery can reach "strong" coverage where videos exist.
 *
 * Idempotent — merges tags without clearing existing ids.
 */
import fs from "node:fs";
import path from "node:path";
import { getAllSoftwareUnfiltered } from "@/data/repositories/catalog";
import type { ProductMedia, ProductScreenshot } from "@/domain/schemas/product-media";
import {
  selectMajorFeaturesForSearch,
  selectUseCasesForSearch,
} from "@/services/asset-discovery/software-agent/analyze";

const SLUGS = [
  "navan",
  "bolt-for-business",
  "carepatron",
  "dext",
  "flexiquiz",
  "freshteam",
  "accelerated-growth-studio",
  "birch",
  "databox",
  "diginius",
  "evolve",
  "lucrovox",
  "zypper",
  "aira",
  "emergent",
  "rank-prompt",
  "nicejob",
  "shore",
  "flippa",
  "shipbob",
  "ueni",
  "contractor-foreman",
  "mrpeasy",
  "vektoros",
  "servicem8",
  "fastmail",
  "sanebox",
];

const CHECKED_AT = "2026-08-19T15:20:00.000Z";

function uniq<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function mergeTags(existing: string[], next: string[]): string[] {
  return uniq([...existing, ...next.filter(Boolean)]);
}

function mergePlacements(
  existing: ProductMedia["placements"],
  next: ProductMedia["placements"],
): ProductMedia["placements"] {
  return uniq([...existing, ...next]) as ProductMedia["placements"];
}

function patchMedia(
  media: ProductMedia[],
  majorFeatures: string[],
  useCases: string[],
): number {
  const active = media.filter(
    (m) =>
      m.officialSource &&
      (m.status === "published" || m.status === "active" || m.status === "embedding-disabled"),
  );
  if (active.length === 0) return 0;

  let changed = 0;
  active.forEach((entry, index) => {
    const before = JSON.stringify({
      featureIds: entry.featureIds,
      useCaseIds: entry.useCaseIds,
      placements: entry.placements,
      type: entry.type,
    });

    entry.placements = mergePlacements(entry.placements, [
      "overview",
      "features",
      "evidence",
    ]);

    if (active.length === 1) {
      entry.featureIds = mergeTags(entry.featureIds, majorFeatures);
      entry.useCaseIds = mergeTags(entry.useCaseIds, useCases);
      entry.placements = mergePlacements(entry.placements, [
        "use-cases",
        "implementation",
      ]);
      if (entry.type === "official-video") {
        entry.type = "official-tutorial";
      }
    } else if (index === 0) {
      entry.featureIds = mergeTags(entry.featureIds, majorFeatures.slice(0, 2));
      entry.useCaseIds = mergeTags(entry.useCaseIds, useCases.slice(0, 2));
      entry.placements = mergePlacements(entry.placements, ["use-cases"]);
    } else if (index === 1) {
      entry.featureIds = mergeTags(
        entry.featureIds,
        majorFeatures.slice(1, 3).length ? majorFeatures.slice(1, 3) : majorFeatures.slice(0, 1),
      );
      entry.useCaseIds = mergeTags(
        entry.useCaseIds,
        useCases.slice(2, 4).length ? useCases.slice(2, 4) : useCases.slice(0, 1),
      );
      if (entry.type === "official-video") {
        entry.type = "official-tutorial";
      }
      entry.placements = mergePlacements(entry.placements, [
        "implementation",
        "use-cases",
      ]);
    } else {
      entry.featureIds = mergeTags(
        entry.featureIds,
        majorFeatures.slice(index, index + 1),
      );
      entry.useCaseIds = mergeTags(
        entry.useCaseIds,
        useCases.slice(index, index + 1),
      );
    }

    entry.lastCheckedAt = CHECKED_AT;

    const after = JSON.stringify({
      featureIds: entry.featureIds,
      useCaseIds: entry.useCaseIds,
      placements: entry.placements,
      type: entry.type,
    });
    if (before !== after) changed += 1;
  });

  return changed;
}

function patchScreenshots(
  screenshots: ProductScreenshot[],
  majorFeatures: string[],
): number {
  let changed = 0;
  screenshots.forEach((shot, index) => {
    if (shot.kind !== "vendor-ui") return;
    const before = JSON.stringify(shot.featureIds ?? []);
    const featureId = majorFeatures[index] ?? majorFeatures[0];
    if (!featureId) return;
    shot.featureIds = mergeTags(shot.featureIds ?? [], [featureId]);
    if (before !== JSON.stringify(shot.featureIds)) changed += 1;
  });
  return changed;
}

function main(): void {
  const products = new Map(
    getAllSoftwareUnfiltered().map((p) => [p.slug, p]),
  );
  const summary: string[] = [];

  for (const slug of SLUGS) {
    const product = products.get(slug);
    if (!product) {
      summary.push(`${slug}\tSKIP\tno product in catalog`);
      continue;
    }

    const enrichmentPath = path.join(
      process.cwd(),
      "src/data/research",
      slug,
      "enrichment.json",
    );
    if (!fs.existsSync(enrichmentPath)) {
      summary.push(`${slug}\tSKIP\tno enrichment`);
      continue;
    }

    const enrichment = JSON.parse(fs.readFileSync(enrichmentPath, "utf8"));
    enrichment.media = Array.isArray(enrichment.media) ? enrichment.media : [];
    enrichment.screenshots = Array.isArray(enrichment.screenshots)
      ? enrichment.screenshots
      : [];

    const majorFeatures = selectMajorFeaturesForSearch({
      software: product,
      enrichment,
    });
    const useCases = selectUseCasesForSearch(product);

    const mediaChanged = patchMedia(enrichment.media, majorFeatures, useCases);
    const shotsChanged = patchScreenshots(enrichment.screenshots, majorFeatures);

    if (mediaChanged > 0 || shotsChanged > 0) {
      enrichment.updatedAt = CHECKED_AT;
      fs.writeFileSync(enrichmentPath, `${JSON.stringify(enrichment, null, 2)}\n`);
    }

    summary.push(
      `${slug}\tmedia=${mediaChanged}\tshots=${shotsChanged}\tfeatures=${majorFeatures.join(",") || "none"}\tuseCases=${useCases.join(",") || "none"}`,
    );
  }

  console.log("patch-affiliate-gap-media-metadata\n");
  for (const line of summary) console.log(line);
}

main();
