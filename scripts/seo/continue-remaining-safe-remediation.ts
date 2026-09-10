#!/usr/bin/env npx tsx
/**
 * Remaining safe remediation: enrich leftover IMPROVE compares, add
 * rendered inbound from product guides / use-cases (module cap respected),
 * promote only when quality + visibility + links pass. Existing URLs only.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import {
  getAllComparisonsUnfiltered,
  getSoftware,
} from "@/data";
import type { ContentMetadata } from "@/domain/schemas";
import { getGuideBySlug, getGuides } from "@/data/repositories/guides";
import { evaluateComparisonQuality } from "@/domain/quality-gates";
import {
  getSitemapPublicationContext,
  isContentVisible,
} from "@/domain/publication-context";
import { isPubliclyAvailable } from "@/domain/publishing";
import { buildGuideLinkPlan } from "@/services/internal-linking/builders";
import { MODULE_LIMITS } from "@/services/internal-linking/types";
import { clearLinkInjectionsCache } from "@/services/internal-linking/link-injections";
import { upsertLinkInjections } from "@/services/seo/improve-linking/injection-store";
import {
  peerComparisonsFor,
  runCompareEnrichmentBatch,
  validateAndMaybePromoteComparison,
} from "@/services/seo/compare-enrichment";
import { mergeComparisonWithOverlay } from "@/services/seo/compare-enrichment/overlay-merge";
import { loadCompareEnrichmentOverlay } from "@/services/seo/compare-enrichment/overlay-store";
import { buildSoftwareLookup } from "@/services/seo/compare-index-worthiness";
import { canPromoteToIndexable } from "@/services/seo/content-lifecycle/promote";
import { promoteAndPersist } from "@/services/seo/content-lifecycle/promote-persist";
import {
  loadContentLifecycleStoreFromDisk,
  persistContentLifecycleStore,
} from "@/services/seo/content-lifecycle/store-write";
import { getContentLifecycleStoreSnapshot } from "@/services/seo/content-lifecycle/store";
import { isFactoryProductPackGuide } from "@/services/seo/guides-index-worthiness/classify";
import { reconcileDataVerifiedCoverage } from "@/services/editorial/pricing-verified-at";
import { pickPricingSources } from "@/services/seo/evidence-quality/verify-pricing";
import { mergeGuideWithOverlay } from "@/services/seo/guide-enrichment/overlay-merge";
import { loadGuideEnrichmentOverlay } from "@/services/seo/guide-enrichment/overlay-store";

const ROOT = process.cwd();
const BATCH = 20;
const ENRICH_LIMIT = Number(process.env.SG_COMPARE_ENRICH_LIMIT ?? "400");
const BATCH_ID = "compare-quality-inbound-2026-09-10";

type SlotState = Map<string, number>;

function visibleNow(meta: ContentMetadata): boolean {
  return isContentVisible(meta, getSitemapPublicationContext(), new Date());
}

function comparisonEntity(slug: string) {
  const raw = getAllComparisonsUnfiltered().find((c) => c.slug === slug);
  if (!raw) return null;
  try {
    return mergeComparisonWithOverlay(raw, loadCompareEnrichmentOverlay(slug));
  } catch {
    return raw;
  }
}

function sourceSpareSlots(fromPath: string): number {
  const max = MODULE_LIMITS.relatedComparisons.max;
  const slug = fromPath.replace(/^\/guides\/|\/$/g, "");
  const guide = getGuideBySlug(slug, { includeUnpublished: true });
  if (!guide) return 0;
  const plan = buildGuideLinkPlan(guide);
  return Math.max(0, max - plan.relatedComparisons.length);
}

function candidateSources(
  productA: string,
  productB: string,
  guidesByProduct: Map<string, ReturnType<typeof getGuides>>,
): Array<{ fromPath: string; label: string }> {
  const out: Array<{ fromPath: string; label: string }> = [];
  const seen = new Set<string>();
  const push = (fromPath: string, label: string) => {
    if (seen.has(fromPath)) return;
    seen.add(fromPath);
    out.push({ fromPath, label });
  };

  for (const product of [productA, productB]) {
    const what = getGuideBySlug(`what-is-${product}`, { includeUnpublished: true });
    if (what && isPubliclyAvailable(what.metadata)) {
      push(`/guides/${what.slug}/`, what.title);
    }
    for (const g of guidesByProduct.get(product) ?? []) {
      if (g.slug === `what-is-${product}`) continue;
      push(`/guides/${g.slug}/`, g.title);
    }
  }
  return out;
}

function main() {
  loadContentLifecycleStoreFromDisk();
  const snap = getContentLifecycleStoreSnapshot();
  const improveCompares = Object.values(snap.entries)
    .filter((e) => e.kind === "comparison" && e.lifecycle === "IMPROVE")
    .map((e) => e.slug);

  const needEnrich = improveCompares.filter(
    (slug) => !loadCompareEnrichmentOverlay(slug),
  );
  const enrichSlice = process.env.SG_SKIP_ENRICH === "1" ? [] : needEnrich.slice(0, ENRICH_LIMIT);
  console.log(
    `IMPROVE compares=${improveCompares.length} needEnrich=${needEnrich.length} enriching=${enrichSlice.length}`,
  );

  let enrichApplied = 0;
  for (let i = 0; i < enrichSlice.length; i += BATCH) {
    const batch = enrichSlice.slice(i, i + BATCH);
    const n = Math.floor(i / BATCH) + 1;
    console.log(`\n── enrich batch ${n} (${batch.length}) ──`);
    const result = runCompareEnrichmentBatch({
      slugs: batch,
      apply: true,
      promote: false,
      persistFamilyQa: false,
    });
    const applied = result.applied.filter((a) => a.applied).length;
    enrichApplied += applied;
    console.log(`  applied=${applied}`);
  }

  const allComparisons = getAllComparisonsUnfiltered();
  const soft = buildSoftwareLookup(getSoftware({ includeUnpublished: true }));
  const guidesByProduct = new Map<string, ReturnType<typeof getGuides>>();
  for (const g of getGuides({ includeUnpublished: true })) {
    if (!isPubliclyAvailable(g.metadata)) continue;
    for (const product of g.productSlugs) {
      const list = guidesByProduct.get(product) ?? [];
      list.push(g);
      guidesByProduct.set(product, list);
    }
  }
  const slots: SlotState = new Map();
  const injected: Array<{ slug: string; from: string[] }> = [];
  const inboundBlocked: Array<{ slug: string; reason: string }> = [];
  const qualityBlocked: Record<string, number> = {};
  const qualityOk: string[] = [];

  for (const slug of improveCompares) {
    const entity = comparisonEntity(slug);
    if (!entity) continue;
    const merged = entity;
    const quality = evaluateComparisonQuality(merged);
    const preview = validateAndMaybePromoteComparison(
      merged,
      soft,
      { promote: false, peerComparisons: peerComparisonsFor(merged, allComparisons) },
    );
    // promote:false returns ok when QA/intent/gates pass — it does NOT mean links pass.
    const qualityPass =
      quality.ok &&
      (preview.ok ||
        preview.reasons.every(
          (r) =>
            r.includes("link graph incomplete") ||
            r.startsWith("Need ≥") ||
            r.includes("Missing hub") ||
            r.includes("Missing outbound"),
        ));

    if (!qualityPass) {
      const key = preview.reasons[0] ?? (quality.ok ? "unknown" : `quality:${quality.failures[0]}`);
      qualityBlocked[key] = (qualityBlocked[key] ?? 0) + 1;
      continue;
    }
    qualityOk.push(slug);

    const [a, b] = merged.productSlugs;
    if (!a || !b) {
      inboundBlocked.push({ slug, reason: "missing product pair" });
      continue;
    }

    const linkDecision = canPromoteToIndexable({
      kind: "comparison",
      entity: merged,
      soft,
      peers: peerComparisonsFor(merged, allComparisons),
    });
    const alreadyLinked = linkDecision.ok || linkDecision.alreadyIndexable;

    const sources = candidateSources(a, b, guidesByProduct);
    const chosen: string[] = [];
    if (!alreadyLinked) {
      for (const src of sources) {
        if (chosen.length >= 2) break;
        const current = slots.get(src.fromPath) ?? sourceSpareSlots(src.fromPath);
        if (current <= 0) continue;
        chosen.push(src.fromPath);
        slots.set(src.fromPath, current - 1);
      }
      if (chosen.length < 2) {
        inboundBlocked.push({
          slug,
          reason: `INSUFFICIENT_RENDERED_INBOUND_SLOTS sources=${sources.length} chosen=${chosen.length}`,
        });
        continue;
      }

      upsertLinkInjections(
        chosen.map((fromPath) => ({
          fromPath,
          toPath: `/compare/${slug}/`,
          label: merged.title,
          module: "relatedComparisons" as const,
          reason: `${merged.productSlugs[0]} vs ${merged.productSlugs[1]} — product-context comparison for ${fromPath}`,
          batchId: BATCH_ID,
          requireIndexable: false,
          score: 86,
        })),
      );
      injected.push({ slug, from: chosen });
    }
  }

  clearLinkInjectionsCache();

  let promoted = 0;
  const promotedSlugs: string[] = [];
  const stillBlocked: Array<{ slug: string; reasons: string[] }> = [];

  for (const slug of qualityOk) {
    const entity = comparisonEntity(slug);
    if (!entity) continue;
    if (!visibleNow(entity.metadata)) {
      stillBlocked.push({
        slug,
        reasons: [`unpublished until ${entity.metadata.scheduledAt ?? "unknown"}`],
      });
      continue;
    }
    const decision = canPromoteToIndexable({
      kind: "comparison",
      entity,
      soft,
      peers: peerComparisonsFor(entity, allComparisons),
    });
    if (!decision.ok) {
      stillBlocked.push({ slug, reasons: decision.detail });
      continue;
    }
    const result = promoteAndPersist({
      kind: "comparison",
      entity,
      soft,
      peers: peerComparisonsFor(entity, allComparisons),
    });
    if (result.ok) {
      promoted += 1;
      promotedSlugs.push(slug);
    } else {
      stillBlocked.push({ slug, reasons: result.detail });
    }
  }

  const guideImprove = Object.values(snap.entries).filter(
    (e) => e.kind === "guide" && e.lifecycle === "IMPROVE",
  );
  let factoryPromoted = 0;
  const factoryBlocked: Record<string, number> = {};
  if (process.env.SG_SKIP_FACTORY === "1") {
    factoryBlocked.skipped = 1;
  } else {
  for (const entry of guideImprove) {
    const guideRaw = getGuideBySlug(entry.slug, { includeUnpublished: true });
    if (!guideRaw || !isFactoryProductPackGuide(guideRaw)) continue;
    if (!loadGuideEnrichmentOverlay(guideRaw.slug)) {
      factoryBlocked.no_overlay = (factoryBlocked.no_overlay ?? 0) + 1;
      continue;
    }
    let guide = guideRaw;
    try {
      guide = mergeGuideWithOverlay(guideRaw, loadGuideEnrichmentOverlay(guideRaw.slug));
    } catch {
      guide = guideRaw;
    }
    if (!visibleNow(guide.metadata)) {
      factoryBlocked.unpublished = (factoryBlocked.unpublished ?? 0) + 1;
      continue;
    }
    const decision = canPromoteToIndexable({ kind: "guide", entity: guide });
    if (!decision.ok) {
      const key = decision.detail[0] ?? "blocked";
      factoryBlocked[key] = (factoryBlocked[key] ?? 0) + 1;
      continue;
    }
    const result = promoteAndPersist({ kind: "guide", entity: guide });
    if (result.ok) factoryPromoted += 1;
  }
  }

  persistContentLifecycleStore();

  const rec = reconcileDataVerifiedCoverage();
  const remainingDv = rec.traces.filter((t) => t.classification !== "DATA_VERIFIED");
  const dvByReason: Record<string, number> = {};
  const dvAltUrls: string[] = [];
  for (const t of remainingDv) {
    const reason = t.rejectReason ?? t.verificationMethod ?? "unknown";
    dvByReason[reason] = (dvByReason[reason] ?? 0) + 1;
    const alts = pickPricingSources(t.product, 4);
    if (alts.length > 0) dvAltUrls.push(t.product);
  }

  const after = getContentLifecycleStoreSnapshot();
  const count = (kind: string, life: string) =>
    Object.values(after.entries).filter((e) => e.kind === kind && e.lifecycle === life)
      .length;

  const out = {
    generatedAt: new Date().toISOString(),
    enrichApplied,
    qualityOk: qualityOk.length,
    injected: injected.length,
    inboundBlocked: inboundBlocked.length,
    inboundBlockedSample: inboundBlocked.slice(0, 15),
    qualityBlocked,
    promoted,
    promotedSlugs,
    stillBlockedSample: stillBlocked.slice(0, 20),
    factoryPromoted,
    factoryBlocked,
    lifecycleAfter: {
      guideIndexable: count("guide", "INDEXABLE"),
      guideImprove: count("guide", "IMPROVE"),
      guideManual: count("guide", "MANUAL_REVIEW"),
      guideReady: count("guide", "INDEXABLE_READY"),
      compareIndexable: count("comparison", "INDEXABLE"),
      compareImprove: count("comparison", "IMPROVE"),
      compareManual: count("comparison", "MANUAL_REVIEW"),
      compareReady: count("comparison", "INDEXABLE_READY"),
    },
    dataVerified: {
      accepted: rec.accepted.length,
      total: rec.traces.length,
      remaining: remainingDv.length,
      dvByReason,
      alternativeFirstPartyUrls: dvAltUrls,
    },
  };

  mkdirSync(path.join(ROOT, "data/review"), { recursive: true });
  writeFileSync(
    path.join(ROOT, "data/review/remaining-safe-remediation.json"),
    `${JSON.stringify(out, null, 2)}\n`,
    "utf8",
  );
  console.log("\n════════");
  console.log(JSON.stringify(out, null, 2));
}

main();
