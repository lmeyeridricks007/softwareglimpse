/**
 * FR-002 factory product-pack wave selection.
 *
 * Process IMPROVE factory packs in waves of 50 — Lane A → B → C.
 * Within a lane: GSC demand, positions 8–40, commercial intent, product importance.
 * Do not delete URLs. Do not promote on structured enrichment alone.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { getGuideBySlug } from "@/data/repositories/guides";
import { getSoftwareBySlug } from "@/data";
import {
  buildGuideEnrichmentQueue,
  type BuildEnrichmentQueueOptions,
} from "@/services/seo/guide-enrichment/queue";
import type { EnrichmentQueueItem } from "@/services/seo/guide-enrichment/types";
import { planGuideEnrichment } from "@/services/seo/guide-enrichment/plan";
import { isFactoryProductPackGuide } from "@/services/seo/guides-index-worthiness/classify";
import { collectDataEnrichmentSignals } from "@/services/seo/guide-enrichment/enrich-context";
import type { EnrichmentGuideType } from "@/services/seo/guide-enrichment/types";

export type FactoryPackKind =
  | "plans"
  | "worth-it"
  | "implementation"
  | "setup"
  | "migration";

export type SeparateExistenceDecision = {
  ok: boolean;
  userJob: string | null;
  reason: string;
  packKind: FactoryPackKind | null;
  enrichmentType: EnrichmentGuideType | null;
  dataBlockers: string[];
};

const PACK_JOB: Record<FactoryPackKind, string> = {
  plans:
    "Compare plan economics and thresholds where a higher tier becomes worthwhile",
  "worth-it":
    "Decide whether this product fits their job vs who should avoid it",
  implementation:
    "Execute a product-specific implementation sequence with pitfalls",
  setup: "Configure the product for a first working workflow",
  migration: "Plan cutover from a prior stack with product-specific risks",
};

function packKindFromSlug(
  slug: string,
  productSlug: string,
): FactoryPackKind | null {
  if (slug === `is-${productSlug}-worth-it`) return "worth-it";
  for (const kind of [
    "plans",
    "implementation",
    "setup",
    "migration",
  ] as const) {
    if (slug === `${productSlug}-${kind}`) return kind;
  }
  return null;
}

/**
 * Why should this exact factory URL exist separately?
 * Requires a clear buyer job AND enough real catalogue/research signal to
 * write page-specific analysis (not product-name substitution).
 */
export function evaluateSeparateExistence(
  slug: string,
): SeparateExistenceDecision {
  const guide = getGuideBySlug(slug, { includeUnpublished: true });
  if (!guide || !isFactoryProductPackGuide(guide)) {
    return {
      ok: false,
      userJob: null,
      reason: "Not a factory product-pack guide",
      packKind: null,
      enrichmentType: null,
      dataBlockers: ["not_factory_pack"],
    };
  }
  const productSlug = guide.productSlugs[0]!;
  const kind = packKindFromSlug(guide.slug, productSlug);
  if (!kind) {
    return {
      ok: false,
      userJob: null,
      reason: "Unrecognized factory pack kind",
      packKind: null,
      enrichmentType: null,
      dataBlockers: ["unknown_pack_kind"],
    };
  }

  const product = getSoftwareBySlug(productSlug, { includeUnpublished: true });
  if (!product) {
    return {
      ok: false,
      userJob: null,
      reason: "Product missing from catalogue",
      packKind: kind,
      enrichmentType: null,
      dataBlockers: ["missing_product"],
    };
  }

  const plan = planGuideEnrichment(guide);
  const signals = collectDataEnrichmentSignals(guide);
  const blockers: string[] = [];

  if (kind === "plans") {
    if (!signals.hasPricing) blockers.push("missing_pricing_structure");
  }
  if (kind === "worth-it") {
    if (!signals.hasAlternatives && (product.alternativeSlugs?.length ?? 0) === 0) {
      blockers.push("missing_alternatives_for_verdict");
    }
    if (!(product.notIdealFor?.length ?? 0) && !(product.bestFor?.length ?? 0)) {
      blockers.push("missing_limitations_or_poor_fit");
    }
  }
  if (kind === "implementation" || kind === "setup" || kind === "migration") {
    // Need at least product identity + some capability/use-case signal
    if (
      !(product.useCaseSlugs?.length ?? 0) &&
      !(product.bestFor?.length ?? 0) &&
      !signals.hasCapabilities
    ) {
      blockers.push("missing_workflow_or_capability_signal");
    }
  }

  if (!plan.canApplyDeterministically) {
    blockers.push("cannot_apply_deterministic_enrichment");
  }

  if (blockers.length > 0) {
    return {
      ok: false,
      userJob: PACK_JOB[kind],
      reason: `Legitimate job exists but data too thin for page-specific analysis: ${blockers.join(", ")}`,
      packKind: kind,
      enrichmentType: plan.enrichmentType,
      dataBlockers: blockers,
    };
  }

  return {
    ok: true,
    userJob: PACK_JOB[kind],
    reason: `Separate URL justified: ${PACK_JOB[kind]} for ${product.name}`,
    packKind: kind,
    enrichmentType: plan.enrichmentType,
    dataBlockers: [],
  };
}

function positionBandBoost(position: number | null): number {
  if (position == null) return 0;
  // Prefer positions 8–40 (striking distance / mid-SERP commercial)
  if (position >= 8 && position <= 40) return 80;
  if (position > 40 && position <= 60) return 25;
  if (position < 8 && position > 0) return 40;
  return 0;
}

export type FactoryWaveCandidate = EnrichmentQueueItem & {
  existence: SeparateExistenceDecision;
  factoryRank: number;
};

function loadProcessedFactorySlugs(rootDir: string): Set<string> {
  const out = new Set<string>();
  const batches = join(rootDir, "data/seo/batches");
  if (!existsSync(batches)) return out;
  for (const name of readdirSync(batches)) {
    if (!name.startsWith("factory-pack-")) continue;
    const reportPath = join(batches, name, "wave-report.json");
    if (!existsSync(reportPath)) continue;
    try {
      const report = JSON.parse(readFileSync(reportPath, "utf8")) as {
        applied?: boolean;
        pages?: Array<{ slug?: string; applied?: boolean }>;
      };
      // Dry-run / plan reports must not exclude candidates from later apply waves.
      if (report.applied !== true) continue;
      for (const p of report.pages ?? []) {
        if (p.slug) out.add(p.slug);
      }
    } catch {
      // ignore corrupt reports
    }
  }
  return out;
}

/**
 * Factory IMPROVE queue: Lane A→B→C, then GSC / commercial / journey ranking.
 * Marks pages that fail separate-existence (stay IMPROVE without rewrite).
 */
export function selectFactoryPackWave(
  opts: BuildEnrichmentQueueOptions & {
    waveSize?: number;
    /** Prefer only pages that pass separate-existence (default true for apply). */
    requireLegitimateExistence?: boolean;
    /** Skip slugs already covered by prior factory-pack wave reports. */
    excludeProcessedWaves?: boolean;
    rootDir?: string;
  } = {},
): {
  selected: FactoryWaveCandidate[];
  skippedIllegitimate: FactoryWaveCandidate[];
  remainingFactoryImprove: number;
  excludedAlreadyProcessed: number;
} {
  const waveSize = opts.waveSize ?? 50;
  const requireOk = opts.requireLegitimateExistence !== false;
  const processed =
    opts.excludeProcessedWaves === false
      ? new Set<string>()
      : loadProcessedFactorySlugs(opts.rootDir ?? process.cwd());
  const queue = buildGuideEnrichmentQueue({
    ...opts,
    allocateByLane: false,
  });

  const factory: FactoryWaveCandidate[] = [];
  let excludedAlreadyProcessed = 0;
  for (const item of queue) {
    if (processed.has(item.slug)) {
      excludedAlreadyProcessed += 1;
      continue;
    }
    const guide = getGuideBySlug(item.slug, { includeUnpublished: true });
    if (!guide || !isFactoryProductPackGuide(guide)) continue;
    const existence = evaluateSeparateExistence(item.slug);
    const pos = item.prioritySignals.gscPosition;
    const factoryRank =
      item.overallScore +
      positionBandBoost(pos) +
      (item.prioritySignals.gscImpressions > 0 ? 30 : 0) +
      (item.lane === "A" ? 200 : item.lane === "B" ? 50 : 0);
    factory.push({ ...item, existence, factoryRank });
  }

  factory.sort((a, b) => {
    const laneOrder = { A: 0, B: 1, C: 2 } as const;
    const ld = laneOrder[a.lane] - laneOrder[b.lane];
    if (ld !== 0) return ld;
    return b.factoryRank - a.factoryRank;
  });

  const remainingFactoryImprove = factory.length + excludedAlreadyProcessed;
  const skippedIllegitimate: FactoryWaveCandidate[] = [];
  const selected: FactoryWaveCandidate[] = [];

  for (const c of factory) {
    if (selected.length >= waveSize) break;
    if (requireOk && !c.existence.ok) {
      skippedIllegitimate.push(c);
      continue;
    }
    selected.push(c);
  }

  if (selected.length < waveSize) {
    for (const c of factory) {
      if (selected.length >= waveSize) break;
      if (selected.some((s) => s.slug === c.slug)) continue;
      if (!c.existence.ok) {
        skippedIllegitimate.push(c);
      }
    }
  }

  return {
    selected,
    skippedIllegitimate,
    remainingFactoryImprove,
    excludedAlreadyProcessed,
  };
}
