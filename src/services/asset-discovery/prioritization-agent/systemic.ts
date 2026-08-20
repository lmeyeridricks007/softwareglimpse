import type {
  AssetEnrichmentBacklogItem,
  AssetEnrichmentPriorityBand,
  GuideAssetAudit,
  SoftwareProductAssetAudit,
  SystemicAssetOpportunity,
} from "@/domain/schemas/asset-discovery";
import { existsSync } from "node:fs";
import path from "node:path";
import { SYSTEMIC_MIN_COUNT } from "./constants";

const SHARED_MIGRATION_KIT = path.join(
  process.cwd(),
  "public/guides/_shared/migration-cutover-field-map.png",
);
const SHARED_DAY_ZERO_KIT = path.join(
  process.cwd(),
  "public/guides/_shared/implementation-day-zero.png",
);

type PatternBucket = {
  key: string;
  title: string;
  items: AssetEnrichmentBacklogItem[];
  recommendation: string;
  whatItAdds: string;
};

function maxBand(
  a: AssetEnrichmentPriorityBand,
  b: AssetEnrichmentPriorityBand,
): AssetEnrichmentPriorityBand {
  const order = { A0: 0, A1: 1, A2: 2, A3: 3 };
  return order[a] <= order[b] ? a : b;
}

/**
 * Collapse repeated same-shape opportunities into TEMPLATE FIX recommendations.
 * Example: N product Features tabs need official feature videos but lack a
 * shared surface component → one template fix, not N manual page edits.
 */
export function detectSystemicAssetOpportunities(input: {
  softwareAudits: SoftwareProductAssetAudit[];
  guideAudits: GuideAssetAudit[];
  candidates: AssetEnrichmentBacklogItem[];
}): {
  systemic: SystemicAssetOpportunity[];
  /** Candidate ids absorbed into a template fix (demote or drop duplicates). */
  absorbedIds: Set<string>;
} {
  const buckets = new Map<string, PatternBucket>();
  const absorbedIds = new Set<string>();

  const bump = (
    key: string,
    title: string,
    item: AssetEnrichmentBacklogItem,
    recommendation: string,
    whatItAdds: string,
  ) => {
    const b = buckets.get(key) ?? {
      key,
      title,
      items: [],
      recommendation,
      whatItAdds,
    };
    b.items.push(item);
    buckets.set(key, b);
  };

  for (const item of input.candidates) {
    if (item.origin === "stale") {
      bump(
        "stale-media-refresh-pipeline",
        "Stale / unavailable official media refresh pipeline",
        item,
        "TEMPLATE FIX: add a shared freshness gate + refresh queue for ResearchMedia (unavailable embed, old UI, beyond review threshold) instead of one-off page edits.",
        "Keeps flagship reviews trustworthy without per-page ad-hoc screenshot swaps.",
      );
      continue;
    }

    if (
      item.origin === "software" &&
      item.section.toLowerCase().includes("feature") &&
      item.implementationBatch === "official-videos-to-embed"
    ) {
      bump(
        "software-features-tab-official-video-surface",
        "Product Features tabs: official feature videos not surfaced",
        item,
        "TEMPLATE FIX: ensure Features tab / feature detail components can render OfficialProductVideo (or equivalent) from enrichment media relationships — do not hand-edit each product Features tab.",
        "One template change unlocks official feature demos across the product catalog where ResearchMedia already exists or is about to be added.",
      );
      continue;
    }

    if (
      item.origin === "software" &&
      item.implementationBatch === "existing-research-media-to-reuse" &&
      item.section.toLowerCase().includes("feature")
    ) {
      bump(
        "reuse-research-media-on-features-tab",
        "Reuse existing ResearchMedia on Features tabs",
        item,
        "TEMPLATE FIX: wire Features tab media selection to existing ProductResearchEnrichment.media (featureIds/placements) so catalogued official videos appear without duplicate discovery or per-page embeds.",
        "Converts already-verified ResearchMedia into buyer-facing evidence on high-traffic product hubs.",
      );
      continue;
    }

    if (
      item.origin === "software" &&
      item.section.toLowerCase().includes("implementation") &&
      (item.implementationBatch === "official-videos-to-embed" ||
        item.implementationBatch === "original-diagrams-to-create")
    ) {
      bump(
        "software-implementation-media-slot",
        "Product Implementation sections lack a standard media slot",
        item,
        "TEMPLATE FIX: add a shared Implementation media module (official setup/tutorial embed + original rollout diagram) on the software hub template.",
        "Buyers evaluating rollout effort get consistent setup evidence across products.",
      );
      continue;
    }

    if (
      item.origin === "guide" &&
      item.cluster === "Migration" &&
      item.isOriginalVisual
    ) {
      // Shared kit shipped — do not keep aggregating per-guide originals into A0
      if (existsSync(SHARED_MIGRATION_KIT)) {
        absorbedIds.add(item.id);
        continue;
      }
      bump(
        "migration-guide-original-cutover-diagram",
        "Migration guides need a shared cutover / field-mapping visual system",
        item,
        "TEMPLATE FIX: ship reusable SoftwareGlimpse migration diagram components (inventory → map → pilot → cutover) parameterized by product — not 20 near-identical one-off illustrations.",
        "Differentiation + teaching clarity across the entire migration cluster with one visual system.",
      );
      continue;
    }

    if (
      item.origin === "guide" &&
      item.cluster === "Implementation" &&
      item.isOriginalVisual
    ) {
      if (existsSync(SHARED_DAY_ZERO_KIT)) {
        absorbedIds.add(item.id);
        continue;
      }
      bump(
        "implementation-guide-day-zero-visual-system",
        "Implementation / setup guides need a shared day-zero visual system",
        item,
        "TEMPLATE FIX: create a parameterized day-zero / pipeline-ready diagram set for product implementation guides instead of per-guide originals.",
        "Consistent buyer teaching across implementation cluster; lower production cost.",
      );
      continue;
    }

    if (
      item.origin === "guide" &&
      item.cluster === "Industries" &&
      (item.isOriginalVisual ||
        item.implementationBatch === "original-diagrams-to-create")
    ) {
      bump(
        "industry-guide-architecture-visual-system",
        "Industry guides need shared architecture / workflow visuals",
        item,
        "TEMPLATE FIX: build an industry visual kit (workflow, roles, compliance touchpoints) applied across industry guides — prefer original SG diagrams over vendor imagery.",
        "Raises weak industry visual quality site-wide without N bespoke commissions.",
      );
      continue;
    }

    if (
      item.origin === "guide" &&
      item.implementationBatch === "official-docs-to-link" &&
      /pricing/i.test(item.asset)
    ) {
      bump(
        "guide-official-pricing-source-links",
        "Guides cite pricing without a standard official-source link pattern",
        item,
        "TEMPLATE FIX: add a guide-template evidence pattern that always links primary vendor pricing docs (never affiliate URLs) wherever pricing claims appear.",
        "Evidence integrity across selection/pricing guides with one template rule.",
      );
      continue;
    }
  }

  // Software: many products with ADD NOW feature demos + existing videos elsewhere
  const productsWithFeatureAddNow = input.softwareAudits.filter((a) =>
    a.recommendations.some(
      (r) =>
        r.recommendationLevel === "add-now" &&
        r.placement?.sectionId === "features",
    ),
  );
  if (productsWithFeatureAddNow.length >= SYSTEMIC_MIN_COUNT) {
    const syntheticItems = productsWithFeatureAddNow.map((a) => ({
      id: `sys-seed-${a.productSlug}`,
      priority: "A1" as const,
      page: a.productName,
      pageRoute: a.route,
      pageType: "software-review",
      section: "Features",
      asset: "official feature demo",
      assetType: "official-feature-demo",
      source: "vendor official",
      official: true,
      recommendation: "search",
      whatItAdds: "feature evidence",
      researchEvidenceImpact: "medium",
      implementationEffort: "medium" as const,
      usageConstraints: "official only",
      implementationBatch: "official-videos-to-embed" as const,
      cluster: "Features" as const,
      impactScore: 0,
      isTemplateFix: false,
      isOriginalVisual: false,
      isPageSpecific: true,
      origin: "software" as const,
    }));
    for (const item of syntheticItems) {
      bump(
        "software-features-tab-official-video-surface",
        "Product Features tabs: official feature videos not surfaced",
        item,
        "TEMPLATE FIX: ensure Features tab / feature detail components can render OfficialProductVideo (or equivalent) from enrichment media relationships — do not hand-edit each product Features tab.",
        "One template change unlocks official feature demos across the product catalog where ResearchMedia already exists or is about to be added.",
      );
    }
  }

  const systemic: SystemicAssetOpportunity[] = [];

  for (const b of buckets.values()) {
    if (b.items.length < SYSTEMIC_MIN_COUNT) continue;

    let priority: AssetEnrichmentPriorityBand = "A2";
    for (const it of b.items) {
      priority = maxBand(priority, it.priority);
    }
    // Systemic template fixes on large patterns escalate
    if (b.items.length >= 12 && priority !== "A0") priority = "A1";
    if (
      b.key === "software-features-tab-official-video-surface" ||
      b.key === "reuse-research-media-on-features-tab" ||
      b.key === "migration-guide-original-cutover-diagram" ||
      b.key === "implementation-guide-day-zero-visual-system" ||
      b.key === "industry-guide-architecture-visual-system"
    ) {
      priority = "A0";
    }

    const routes = [...new Set(b.items.map((i) => i.pageRoute))].slice(0, 24);
    const products = [
      ...new Set(
        b.items.map((i) => i.productSlug).filter((x): x is string => Boolean(x)),
      ),
    ].slice(0, 24);
    const pageTypes = [...new Set(b.items.map((i) => i.pageType))];

    systemic.push({
      id: `SYS-ASSET-${b.key}`,
      title: b.title,
      count: b.items.length,
      affectedRoutes: routes,
      pageTypes,
      products,
      recommendation: b.recommendation,
      fixClass: "TEMPLATE FIX",
      priority,
      whatItAdds: b.whatItAdds,
      implementationEffort:
        b.key.includes("original") || b.key.includes("visual-system")
          ? "large"
          : "medium",
    });

    for (const it of b.items) {
      if (!it.id.startsWith("sys-seed-")) absorbedIds.add(it.id);
    }
  }

  systemic.sort((a, b) => {
    const order = { A0: 0, A1: 1, A2: 2, A3: 3 };
    return order[a.priority] - order[b.priority] || b.count - a.count;
  });

  return { systemic, absorbedIds };
}
