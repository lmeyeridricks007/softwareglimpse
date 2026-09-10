#!/usr/bin/env npx tsx
import { getAllComparisonsUnfiltered } from "@/data";
import { getGuideBySlug } from "@/data/repositories/guides";
import { isEntityIndexable } from "@/domain/quality-gates";
import {
  getSitemapPublicationContext,
  isContentVisible,
} from "@/domain/publication-context";
import { buildGuideLinkPlan } from "@/services/internal-linking/builders";
import { injectionsToPath } from "@/services/internal-linking/link-injections";
import { loadContentLifecycleStoreFromDisk } from "@/services/seo/content-lifecycle/store-write";
import { getContentLifecycleStoreSnapshot } from "@/services/seo/content-lifecycle/store";
import { mergeComparisonWithOverlay } from "@/services/seo/compare-enrichment/overlay-merge";
import { loadCompareEnrichmentOverlay } from "@/services/seo/compare-enrichment/overlay-store";
import { mergeGuideWithOverlay } from "@/services/seo/guide-enrichment/overlay-merge";
import { loadGuideEnrichmentOverlay } from "@/services/seo/guide-enrichment/overlay-store";

loadContentLifecycleStoreFromDisk();
const now = new Date();
const ctx = getSitemapPublicationContext();
const snap = getContentLifecycleStoreSnapshot();

let unpublishedIndexable = 0;
const unpublished: string[] = [];
for (const e of Object.values(snap.entries)) {
  if (e.lifecycle !== "INDEXABLE") continue;
  if (e.kind === "comparison") {
    const raw = getAllComparisonsUnfiltered().find((c) => c.slug === e.slug);
    if (!raw) continue;
    const entity = mergeComparisonWithOverlay(raw, loadCompareEnrichmentOverlay(e.slug));
    const vis = isContentVisible(entity.metadata, ctx, now);
    const idx = isEntityIndexable({ kind: "comparison", entity });
    if (!vis || !idx) {
      unpublishedIndexable += 1;
      unpublished.push(`compare:${e.slug} vis=${vis} idx=${idx}`);
    }
  } else if (e.kind === "guide") {
    const raw = getGuideBySlug(e.slug, { includeUnpublished: true });
    if (!raw) continue;
    let entity = raw;
    try {
      entity = mergeGuideWithOverlay(raw, loadGuideEnrichmentOverlay(raw.slug));
    } catch {
      entity = raw;
    }
    const vis = isContentVisible(entity.metadata, ctx, now);
    const idx = isEntityIndexable({ kind: "guide", entity });
    if (!vis || !idx) {
      unpublishedIndexable += 1;
      unpublished.push(`guide:${e.slug} vis=${vis} idx=${idx}`);
    }
  }
}

const sampleSlug = "kaspr-vs-snov";
const edges = injectionsToPath(`/compare/${sampleSlug}/`);
const planHits: string[] = [];
for (const edge of edges.slice(0, 4)) {
  const gslug = edge.fromPath.replace(/^\/guides\/|\/$/g, "");
  const guide = getGuideBySlug(gslug, { includeUnpublished: true });
  if (!guide) continue;
  const plan = buildGuideLinkPlan(guide);
  const hit = plan.relatedComparisons.some((l) => l.href === `/compare/${sampleSlug}/`);
  planHits.push(`${edge.fromPath} render=${hit} relatedComparisons=${plan.relatedComparisons.length}`);
}

const sendcloud = snap.entries["guide:what-is-sendcloud"];
console.log(
  JSON.stringify(
    {
      unpublishedIndexable,
      unpublishedSample: unpublished.slice(0, 20),
      sendcloud: sendcloud?.lifecycle ?? "absent",
      sampleInbound: {
        slug: sampleSlug,
        injectionCount: edges.length,
        from: edges.map((e) => e.fromPath),
        planHits,
      },
    },
    null,
    2,
  ),
);
