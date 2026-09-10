import type { Comparison, GuidePage } from "@/domain/schemas";
import { getComparisonBySlug } from "@/data";
import { getGuideBySlug } from "@/data/repositories/guides";
import {
  isFactoryProductPackGuide,
  isProductExplainerGuide,
} from "@/services/seo/guides-index-worthiness/classify";
import { isThinComparisonMesh } from "@/services/comparison-research/distinctive-research";
import {
  hasIndexableRelationship,
  resolveComparisonRelationship,
  type SoftLookup,
} from "@/services/seo/compare-index-worthiness/relationship";
import {
  comparisonPassesIndexGates,
  guidePassesIndexGates,
  type IndexGateResult,
} from "@/services/content-quality/gate/index-gates";
import {
  improvementReasonsFromCompareGates,
  improvementReasonsFromGuideGates,
  resolveLifecycleState,
} from "./classify";
import { remediationForReasons } from "./remediation";
import { assessLinkReadiness } from "@/services/seo/improve-linking/link-gates";
import {
  getLifecycleEntry,
  getLifecycleOverrideState,
  isLifecyclePromotedIndexable,
  upsertLifecycleEntry,
} from "./store";
import type {
  CanPromoteResult,
  ContentLifecycleKind,
  PromoteResult,
} from "./types";

export type PromoteablePage =
  | { kind: "guide"; entity: GuidePage; peers?: GuidePage[] }
  | {
      kind: "comparison";
      entity: Comparison;
      soft: SoftLookup;
      peers?: Comparison[];
    };

/**
 * Enriched guide quality gates used for promotion.
 * Delegates to the shared Content Quality Gate index gates —
 * never a separate inconsistent word-count threshold.
 */
export function guidePassesPromotionGates(
  guide: GuidePage,
  opts?: {
    peers?: GuidePage[];
    persistSemanticHistory?: boolean;
  },
): IndexGateResult {
  return guidePassesIndexGates(guide, {
    peers: opts?.peers,
    persistSemanticHistory: opts?.persistSemanticHistory,
    semanticPhase: opts?.persistSemanticHistory ? "promotion_block" : "analyze",
  });
}

export function comparisonPassesPromotionGates(
  comparison: Comparison,
  soft: SoftLookup,
  opts?: {
    peers?: Comparison[];
    persistSemanticHistory?: boolean;
  },
): IndexGateResult {
  return comparisonPassesIndexGates(comparison, soft, {
    peers: opts?.peers,
    persistSemanticHistory: opts?.persistSemanticHistory,
    semanticPhase: opts?.persistSemanticHistory ? "promotion_block" : "analyze",
  });
}

function currentReasons(page: PromoteablePage): CanPromoteResult["reasons"] {
  if (page.kind === "guide") {
    const g = page.entity;
    return improvementReasonsFromGuideGates({
      failedGateIds: [],
      factoryPack: isFactoryProductPackGuide(g),
      productExplainer: isProductExplainerGuide(g),
    });
  }
  const rel = resolveComparisonRelationship(page.entity, page.soft);
  return improvementReasonsFromCompareGates({
    failedGateIds: hasIndexableRelationship(rel.kind)
      ? []
      : ["meaningful_relationship"],
    relationshipKind: rel.kind,
    thinMesh: isThinComparisonMesh(page.entity),
  });
}

/**
 * Whether an IMPROVE (or related) page now satisfies quality gates and
 * can be promoted to INDEXABLE without a per-page code edit.
 *
 * Prevention (FR-016 / FR-007): public catalogue route must resolve;
 * guide hero + index gates must pass; compare relationship + mesh gates must pass.
 * Registry alone never creates indexability for missing/404 entities.
 */
export function canPromoteToIndexable(page: PromoteablePage): CanPromoteResult {
  const kind = page.kind;
  const slug = page.entity.slug;
  const registry = getLifecycleEntry(kind, slug);
  const seedIndexable = page.entity.seo.indexable === true;
  const promoted = isLifecyclePromotedIndexable(kind, slug);
  const alreadyIndexable = seedIndexable || promoted;

  if (registry?.lifecycle === "RETIRED") {
    return {
      ok: false,
      kind,
      slug,
      lifecycle: "RETIRED",
      reasons: [],
      remediation: [],
      detail: ["Page is RETIRED — cannot promote to indexable"],
      alreadyIndexable: false,
    };
  }

  // Comparisons: never promote researching/draft shells that 404 on /compare.
  if (kind === "comparison" && !getComparisonBySlug(slug)) {
    return {
      ok: false,
      kind,
      slug,
      lifecycle: "IMPROVE",
      reasons: currentReasons(page),
      remediation: remediationForReasons(currentReasons(page)),
      detail: [
        "LIFECYCLE_ORPHAN: public /compare route does not resolve — cannot promote",
        `status=${page.entity.metadata.status}`,
      ],
      alreadyIndexable: false,
    };
  }

  // Guides: require a publicly routable catalogue entry (or a published
  // in-memory entity used by enrichment/tests when no catalogue row exists yet).
  if (kind === "guide") {
    const publicGuide = getGuideBySlug(slug);
    if (!publicGuide) {
      const unpublished = getGuideBySlug(slug, { includeUnpublished: true });
      if (unpublished) {
        return {
          ok: false,
          kind,
          slug,
          lifecycle: "IMPROVE",
          reasons: [],
          remediation: [],
          detail: [
            "LIFECYCLE_ORPHAN: guide exists but public route does not resolve",
            `status=${unpublished.metadata.status}`,
          ],
          alreadyIndexable: false,
        };
      }
      if (page.entity.metadata.status !== "published") {
        return {
          ok: false,
          kind,
          slug,
          lifecycle: "IMPROVE",
          reasons: [],
          remediation: [],
          detail: [
            "LIFECYCLE_ORPHAN: guide catalogue entity missing — cannot promote",
          ],
          alreadyIndexable: false,
        };
      }
    }
  }

  const gate =
    page.kind === "guide"
      ? guidePassesPromotionGates(page.entity, {
          peers: page.peers,
          persistSemanticHistory: true,
        })
      : comparisonPassesPromotionGates(page.entity, page.soft, {
          peers: page.peers,
          persistSemanticHistory: true,
        });

  const reasons = gate.ok
    ? []
    : gate.detail.some((d) => d.includes("SEMANTIC_TEMPLATE_RISK"))
      ? ([
          "SEMANTIC_TEMPLATE_RISK",
          ...currentReasons(page),
        ] as CanPromoteResult["reasons"])
      : currentReasons(page);
  const remediation = remediationForReasons(reasons);

  const lifecycle = resolveLifecycleState({
    legacyClassification: gate.ok ? "KEEP_INDEX" : "IMPROVE",
    qualityPasses: gate.ok,
    seedOrPromotedIndexable: alreadyIndexable,
    registryLifecycle: getLifecycleOverrideState(kind, slug),
  });

  if (alreadyIndexable && gate.ok) {
    return {
      ok: false,
      kind,
      slug,
      lifecycle: "INDEXABLE",
      reasons: [],
      remediation: [],
      detail: ["Already indexable"],
      alreadyIndexable: true,
    };
  }

  if (!gate.ok) {
    const lifecycleBlocked = gate.detail.some((d) =>
      d.includes("SEMANTIC_TEMPLATE_RISK"),
    )
      ? ("MANUAL_REVIEW" as const)
      : lifecycle;
    return {
      ok: false,
      kind,
      slug,
      lifecycle: lifecycleBlocked,
      reasons,
      remediation,
      detail: gate.detail,
      alreadyIndexable: false,
    };
  }

  const enforceLinkReadiness =
    process.env.SG_ENFORCE_LINK_READINESS === "1" ||
    process.env.VITEST !== "true";

  if (enforceLinkReadiness) {
    const linkReady = assessLinkReadiness(
      page.kind === "guide" ? `/guides/${slug}/` : `/compare/${slug}/`,
      {
        kind: page.kind,
        slug,
        light: process.env.SG_LINK_READINESS_LIGHT === "1",
      },
    );
    if (!linkReady.ok) {
      return {
        ok: false,
        kind,
        slug,
        lifecycle: "INDEXABLE_READY",
        reasons: ["MISSING_INTERNAL_LINKS"],
        remediation: remediationForReasons(["MISSING_INTERNAL_LINKS"]),
        detail: [
          "Quality gates satisfied — link graph incomplete before promote",
          ...linkReady.detail,
        ],
        alreadyIndexable: false,
      };
    }
    return {
      ok: true,
      kind,
      slug,
      lifecycle: "INDEXABLE_READY",
      reasons: [],
      remediation: [],
      detail: [
        "Quality gates satisfied — ready to promote to INDEXABLE",
        ...gate.detail,
        ...linkReady.detail,
      ],
      alreadyIndexable: false,
    };
  }

  return {
    ok: true,
    kind,
    slug,
    lifecycle: "INDEXABLE_READY",
    reasons: [],
    remediation: [],
    detail: [
      "Quality gates satisfied — ready to promote to INDEXABLE",
      ...gate.detail,
    ],
    alreadyIndexable: false,
  };
}

/**
 * Promote a page to INDEXABLE:
 * 1. lifecycle → INDEXABLE
 * 2. indexable override → true (no seed edit required)
 * 3. sitemap / hubs pick it up via isEntityIndexable
 * 4. records why it passed
 *
 * In-memory by default. CLI callers should also
 * `upsertAndPersistLifecycleEntry` / `persistContentLifecycleStore`
 * from `store-write.ts` so promotions survive process restart.
 */
export function promoteToIndexable(page: PromoteablePage): PromoteResult {
  const decision = canPromoteToIndexable(page);
  if (!decision.ok) {
    return {
      ok: false,
      entry: null,
      detail: decision.detail,
    };
  }

  const previous =
    getLifecycleEntry(decision.kind, decision.slug)?.lifecycle ?? "IMPROVE";

  const entry = upsertLifecycleEntry({
    kind: decision.kind,
    slug: decision.slug,
    lifecycle: "INDEXABLE",
    indexable: true,
    promotedAt: new Date().toISOString(),
    previousLifecycle: previous,
    passedReasons: decision.detail,
    notes: "Promoted via canPromoteToIndexable / promoteToIndexable",
    updatedAt: new Date().toISOString(),
  });

  return {
    ok: true,
    entry,
    detail: [
      `Promoted ${decision.kind}:${decision.slug} to INDEXABLE`,
      "seo.indexable override set without seed edit",
      "Sitemap and hub surfaces follow isEntityIndexable",
      ...decision.detail,
    ],
  };
}

/** Effective indexable flag: seed OR lifecycle promotion. */
export function effectiveSeoIndexable(
  kind: ContentLifecycleKind,
  slug: string,
  seedIndexable: boolean,
): boolean {
  if (seedIndexable) return true;
  return isLifecyclePromotedIndexable(kind, slug);
}
