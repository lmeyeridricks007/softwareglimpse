/**
 * INDEXABLE_READY estate review — revalidate current state before promote.
 * Never bulk-promote from stale enrichment estimates.
 */

import { getGuideBySlug, getGuides } from "@/data/repositories/guides";
import {
  getAllComparisonsUnfiltered,
  getComparisonBySlug,
  getSoftware,
  getSoftwareBySlug,
} from "@/data";
import {
  analyzePageQualityGate,
  recordGateResult,
  assessGuideSemanticTemplateRisk,
  assessComparisonSemanticTemplateRisk,
} from "@/services/content-quality/gate";
import {
  canPromoteToIndexable,
  promoteToIndexable,
} from "@/services/seo/content-lifecycle/promote";
import { promoteAndPersist } from "@/services/seo/content-lifecycle/promote-persist";
import {
  upsertLifecycleEntry,
  getLifecycleEntry,
} from "@/services/seo/content-lifecycle/store";
import { upsertAndPersistLifecycleEntry } from "@/services/seo/content-lifecycle/store-write";
import { assessLinkReadiness } from "@/services/seo/improve-linking/link-gates";
import {
  buildSoftwareLookup,
  hasIndexableRelationship,
  resolveComparisonRelationship,
} from "@/services/seo/compare-index-worthiness/relationship";
import { loadGscOpportunitySignalsByPath } from "@/services/seo/gsc-opportunity/load-report";
import {
  classifyEnrichmentLane,
  type EnrichmentLane,
} from "@/services/seo/enrichment-lanes";
import { runGuidesIndexAudit } from "@/services/seo/guides-index-worthiness/inventory";
import { runCompareIndexAudit } from "@/services/seo/compare-index-worthiness/inventory";
import type { GuideIndexEvaluation } from "@/services/seo/guides-index-worthiness/types";
import type { CompareIndexEvaluation } from "@/services/seo/compare-index-worthiness/types";

export type ReadyOutcome =
  | "PROMOTED"
  | "REMAIN_READY"
  | "BACK_TO_IMPROVE"
  | "MANUAL_REVIEW"
  | "SKIPPED";

export type ReadyKind = "guide" | "comparison";

export type ReadyCandidate = {
  kind: ReadyKind;
  slug: string;
  path: string;
  categorySlug: string | null;
  priorityScore: number;
  gscImpressions: number;
  gscClicks: number;
  gscOpportunity: number;
  lane: EnrichmentLane | "none";
  commercialBoost: number;
  relationshipKind: string | null;
  inboundLinks: number;
  uniqueRatio: number;
  rankingScore: number;
  selectionReasons: string[];
};

export type ReadyReviewResult = {
  kind: ReadyKind;
  slug: string;
  path: string;
  outcome: ReadyOutcome;
  reason: string;
  detail: string[];
  qualityScore: number | null;
  indexEligible: boolean | null;
  semanticBlocked: boolean;
  linkReady: boolean | null;
  gscImpressions: number;
  lane: EnrichmentLane | "none";
  rankingScore: number;
};

export type ReadyBatchReport = {
  version: string;
  generatedAt: string;
  batchIndex: number;
  applied: boolean;
  persist: boolean;
  reviewed: ReadyReviewResult[];
  counts: Record<ReadyOutcome, number> & {
    qualityFailures: number;
    semanticFailures: number;
    missingEntities: number;
    missingLinks: number;
    pricingEvidenceBlockers: number;
  };
};

const CATEGORY_IMPORTANCE: Record<string, number> = {
  crm: 100,
  "sales-intelligence": 90,
  "email-marketing": 80,
  marketing: 75,
  hr: 70,
  "project-management": 65,
  ecommerce: 60,
  "business-communications": 55,
  "customer-service": 70,
  ai: 50,
  "it-development": 45,
};

export const READY_QUEUE_VERSION = "1.0.0";

function commercialBoostForGuide(evaluation: GuideIndexEvaluation): number {
  const productSlug =
    evaluation.guideType === "product-explainer"
      ? evaluation.slug.replace(/^what-is-/, "").replace(/^how-.*-/, "")
      : null;
  // Prefer explicit product supports via re-load when ranking.
  const guide = getGuideBySlug(evaluation.slug, { includeUnpublished: true });
  let boost = CATEGORY_IMPORTANCE[evaluation.categorySlug ?? ""] ?? 20;
  for (const slug of guide?.productSlugs ?? []) {
    const soft = getSoftwareBySlug(slug, { includeUnpublished: true });
    if (soft?.affiliate?.enabled) boost += 25;
    else if (soft) boost += 10;
  }
  if (productSlug) {
    const soft = getSoftwareBySlug(productSlug, { includeUnpublished: true });
    if (soft?.affiliate?.enabled) boost += 15;
  }
  return boost;
}

function commercialBoostForCompare(evaluation: CompareIndexEvaluation): number {
  let boost = CATEGORY_IMPORTANCE[evaluation.categorySlug ?? ""] ?? 15;
  for (const slug of [evaluation.productA, evaluation.productB]) {
    if (!slug) continue;
    const soft = getSoftwareBySlug(slug, { includeUnpublished: true });
    if (soft?.affiliate?.enabled) boost += 20;
    else if (soft) boost += 8;
  }
  return boost;
}

function rankCandidate(c: Omit<ReadyCandidate, "rankingScore" | "selectionReasons">): ReadyCandidate {
  const reasons: string[] = [];
  let score = 0;

  // 1. Real GSC historical demand
  if (c.gscImpressions > 0 || c.gscClicks > 0) {
    score += Math.min(400, c.gscOpportunity * 2 + c.gscImpressions * 0.05 + c.gscClicks * 5);
    reasons.push(`gsc:imp=${c.gscImpressions},clicks=${c.gscClicks},opp=${c.gscOpportunity}`);
  }

  // 2. Lane A
  if (c.lane === "A") {
    score += 300;
    reasons.push("lane:A");
  } else if (c.lane === "B") {
    score += 80;
    reasons.push("lane:B");
  } else if (c.lane === "C") {
    score += 20;
    reasons.push("lane:C");
  }

  // 3. Commercial products/categories
  score += c.commercialBoost;
  if (c.commercialBoost >= 50) reasons.push("commercial:strong");

  // 4. Strongest buyer relationships (compares)
  if (c.kind === "comparison") {
    if (
      c.relationshipKind === "declared_competitor" ||
      c.relationshipKind === "declared_alternative" ||
      c.relationshipKind === "declared_comparable" ||
      c.relationshipKind === "data_backed_comparable"
    ) {
      score += 120;
      reasons.push(`relationship:${c.relationshipKind}`);
    } else if (c.relationshipKind === "same_category_only") {
      score += 20;
      reasons.push("relationship:same_category");
    }
  }

  // 5. Quality / evidence proxies
  score += Math.round(c.uniqueRatio * 80);
  score += Math.min(60, c.priorityScore / 5);

  // 6. Internal discoverability
  score += Math.min(100, c.inboundLinks * 15);
  if (c.inboundLinks >= 2) reasons.push(`inbound:${c.inboundLinks}`);

  return { ...c, rankingScore: score, selectionReasons: reasons };
}

export type SelectReadyOptions = {
  kinds?: ReadyKind[];
  limit?: number;
  /** Prefer live audit recompute (slower) vs cached audit JSON fields via inventory. */
  liveAudit?: boolean;
};

/**
 * Prioritized INDEXABLE_READY queue (guides + comparisons).
 */
export function selectReadyQueue(opts: SelectReadyOptions = {}): ReadyCandidate[] {
  const kinds = new Set(opts.kinds ?? ["guide", "comparison"]);
  const gsc = loadGscOpportunitySignalsByPath();
  const out: ReadyCandidate[] = [];

  if (kinds.has("guide")) {
    const audit = runGuidesIndexAudit();
    const ready = audit.readyForPromotion.filter(
      (e) => e.lifecycle === "INDEXABLE_READY" || e.readyForPromotion,
    );
    for (const e of ready) {
      const path = `/guides/${e.slug}/`;
      const signal = gsc.get(path) ?? gsc.get(`/guides/${e.slug}`);
      const laneClass = classifyEnrichmentLane({
        gsc: {
          impressions: signal?.impressions ?? 0,
          clicks: signal?.clicks ?? 0,
          hasDirectQuery: signal?.hasDirectQuery ?? false,
          opportunityScore: signal?.opportunityScore ?? 0,
        },
        strategic: {
          categoryImportance: CATEGORY_IMPORTANCE[e.categorySlug ?? ""] ?? 0,
          productPopularity: commercialBoostForGuide(e),
          commercialRelevance: commercialBoostForGuide(e),
          internalJourneyStrength: Math.min(
            100,
            (e.metrics?.incomingInternalLinks ?? 0) * 20,
          ),
          competitorRelationship: false,
          importantBuyerQuestion:
            (e.guideType ?? "").includes("pricing") ||
            (e.guideType ?? "").includes("choose") ||
            (e.targetIntent ?? "").includes("how-to"),
        },
        qualityGap: Math.max(0, 100 - (e.priorityScore ?? 0) / 2),
      });
      out.push(
        rankCandidate({
          kind: "guide",
          slug: e.slug,
          path,
          categorySlug: e.categorySlug ?? null,
          priorityScore: e.priorityScore ?? 0,
          gscImpressions: signal?.impressions ?? 0,
          gscClicks: signal?.clicks ?? 0,
          gscOpportunity: signal?.opportunityScore ?? 0,
          lane: laneClass.lane,
          commercialBoost: commercialBoostForGuide(e),
          relationshipKind: null,
          inboundLinks: e.metrics?.incomingInternalLinks ?? 0,
          uniqueRatio: e.metrics?.uniqueContentRatio ?? 0,
        }),
      );
    }
  }

  if (kinds.has("comparison")) {
    const audit = runCompareIndexAudit();
    const ready = audit.readyForPromotion.filter(
      (e) => e.lifecycle === "INDEXABLE_READY" || e.readyForPromotion,
    );
    const soft = buildSoftwareLookup(getSoftware({ includeUnpublished: true }));
    for (const e of ready) {
      const path = `/compare/${e.slug}/`;
      const signal = gsc.get(path) ?? gsc.get(`/compare/${e.slug}`);
      const entity = getAllComparisonsUnfiltered().find((c) => c.slug === e.slug);
      const rel = entity
        ? resolveComparisonRelationship(entity, soft).kind
        : e.relationshipKind ?? null;
      const laneClass = classifyEnrichmentLane({
        gsc: {
          impressions: signal?.impressions ?? 0,
          clicks: signal?.clicks ?? 0,
          hasDirectQuery: signal?.hasDirectQuery ?? false,
          opportunityScore: signal?.opportunityScore ?? 0,
        },
        strategic: {
          categoryImportance: CATEGORY_IMPORTANCE[e.categorySlug ?? ""] ?? 0,
          productPopularity: commercialBoostForCompare(e),
          commercialRelevance: commercialBoostForCompare(e),
          internalJourneyStrength: Math.min(
            100,
            (e.metrics?.incomingInternalLinks ?? 0) * 20,
          ),
          competitorRelationship: hasIndexableRelationship(
            (rel ?? "same_category_only") as Parameters<
              typeof hasIndexableRelationship
            >[0],
          ),
          importantBuyerQuestion: true,
        },
        qualityGap: Math.max(0, 100 - (e.priorityScore ?? 0) / 2),
      });
      out.push(
        rankCandidate({
          kind: "comparison",
          slug: e.slug,
          path,
          categorySlug: e.categorySlug ?? null,
          priorityScore: e.priorityScore ?? 0,
          gscImpressions: signal?.impressions ?? 0,
          gscClicks: signal?.clicks ?? 0,
          gscOpportunity: signal?.opportunityScore ?? 0,
          lane: laneClass.lane,
          commercialBoost: commercialBoostForCompare(e),
          relationshipKind: rel,
          inboundLinks: e.metrics?.incomingInternalLinks ?? 0,
          uniqueRatio: e.metrics?.uniqueContentRatio ?? 0,
        }),
      );
    }
  }

  out.sort((a, b) => b.rankingScore - a.rankingScore);
  if (opts.limit != null) return out.slice(0, opts.limit);
  return out;
}

function demote(
  kind: ReadyKind,
  slug: string,
  lifecycle: "IMPROVE" | "MANUAL_REVIEW",
  notes: string,
  persist: boolean,
): void {
  const previous = getLifecycleEntry(kind, slug)?.lifecycle ?? "INDEXABLE_READY";
  const entry = {
    kind,
    slug,
    lifecycle,
    indexable: false,
    previousLifecycle: previous,
    notes,
    updatedAt: new Date().toISOString(),
  };
  if (persist) upsertAndPersistLifecycleEntry(entry);
  else upsertLifecycleEntry(entry);
}

/**
 * Re-run current-state gates for one INDEXABLE_READY candidate.
 */
export function reviewReadyPage(
  candidate: ReadyCandidate,
  opts: { apply?: boolean; persist?: boolean; peers?: { guides?: ReturnType<typeof getGuides>; comparisons?: ReturnType<typeof getAllComparisonsUnfiltered> } } = {},
): ReadyReviewResult {
  const apply = opts.apply === true;
  const persist = opts.persist === true && apply;
  const detail: string[] = [];
  let qualityScore: number | null = null;
  let indexEligible: boolean | null = null;
  let semanticBlocked = false;
  let linkReady: boolean | null = null;

  const base = {
    kind: candidate.kind,
    slug: candidate.slug,
    path: candidate.path,
    gscImpressions: candidate.gscImpressions,
    lane: candidate.lane,
    rankingScore: candidate.rankingScore,
  };

  // Force link readiness checks outside Vitest (CLI).
  const prevLink = process.env.SG_ENFORCE_LINK_READINESS;
  process.env.SG_ENFORCE_LINK_READINESS = "1";
  process.env.SG_LINK_READINESS_LIGHT = process.env.SG_LINK_READINESS_LIGHT ?? "1";

  try {
    if (candidate.kind === "guide") {
      const guide = getGuideBySlug(candidate.slug, { includeUnpublished: true });
      if (!guide) {
        if (apply) {
          demote("guide", candidate.slug, "IMPROVE", "READY review: missing entity", persist);
        }
        return {
          ...base,
          outcome: "BACK_TO_IMPROVE",
          reason: "Missing guide entity",
          detail: ["missing_entity"],
          qualityScore,
          indexEligible,
          semanticBlocked,
          linkReady,
        };
      }
      if (!getGuideBySlug(candidate.slug)) {
        if (apply) {
          demote(
            "guide",
            candidate.slug,
            "IMPROVE",
            "READY review: public route does not resolve",
            persist,
          );
        }
        return {
          ...base,
          outcome: "BACK_TO_IMPROVE",
          reason: "Public guide route does not resolve",
          detail: ["route_not_public", `status=${guide.metadata.status}`],
          qualityScore,
          indexEligible,
          semanticBlocked,
          linkReady,
        };
      }

      const gate = analyzePageQualityGate({
        pageType: "guide",
        slug: candidate.slug,
      });
      if (gate) {
        qualityScore = gate.qualityScore;
        indexEligible = gate.indexEligible;
        if (apply) {
          recordGateResult(gate, "analyze", {
            note: "ready-queue review",
            persist: true,
          });
        }
        if (gate.failures.length > 0) {
          detail.push(...gate.failures.map((f) => `quality:${f.code}`));
        }
      }

      const peers = opts.peers?.guides ?? getGuides({ includeUnpublished: true });
      const semantic = assessGuideSemanticTemplateRisk(guide, peers);
      if (semantic.blocksAutoPromotion) {
        semanticBlocked = true;
        detail.push(`SEMANTIC_TEMPLATE_RISK: ${semantic.promotionReason}`);
        if (apply) {
          demote(
            "guide",
            candidate.slug,
            "MANUAL_REVIEW",
            `READY review: ${semantic.promotionReason}`,
            persist,
          );
        }
        return {
          ...base,
          outcome: "MANUAL_REVIEW",
          reason: "Semantic template risk",
          detail,
          qualityScore,
          indexEligible,
          semanticBlocked,
          linkReady,
        };
      }

      const links = assessLinkReadiness(candidate.path, {
        kind: "guide",
        slug: candidate.slug,
        light: true,
      });
      linkReady = links.ok;
      if (!links.ok) detail.push(...links.detail.map((d) => `link:${d}`));

      const decision = canPromoteToIndexable({
        kind: "guide",
        entity: guide,
        peers,
      });

      if (decision.alreadyIndexable) {
        return {
          ...base,
          outcome: "SKIPPED",
          reason: "Already indexable",
          detail: decision.detail,
          qualityScore,
          indexEligible,
          semanticBlocked,
          linkReady,
        };
      }

      if (decision.ok) {
        if (apply) {
          const result = persist
            ? promoteAndPersist({ kind: "guide", entity: guide, peers })
            : promoteToIndexable({ kind: "guide", entity: guide, peers });
          if (!result.ok) {
            return {
              ...base,
              outcome: "REMAIN_READY",
              reason: "Promote failed unexpectedly",
              detail: result.detail,
              qualityScore,
              indexEligible,
              semanticBlocked,
              linkReady,
            };
          }
        }
        return {
          ...base,
          outcome: "PROMOTED",
          reason: apply
            ? "Current-state gates + links passed — promoted"
            : "Would promote (dry-run)",
          detail: decision.detail,
          qualityScore,
          indexEligible,
          semanticBlocked,
          linkReady,
        };
      }

      // Classify non-ok promote
      const joined = decision.detail.join(" ");
      if (joined.includes("SEMANTIC_TEMPLATE_RISK")) {
        if (apply) {
          demote(
            "guide",
            candidate.slug,
            "MANUAL_REVIEW",
            `READY review: ${joined}`,
            persist,
          );
        }
        return {
          ...base,
          outcome: "MANUAL_REVIEW",
          reason: "Semantic / manual review block",
          detail: decision.detail,
          qualityScore,
          indexEligible: indexEligible ?? false,
          semanticBlocked: true,
          linkReady,
        };
      }
      if (
        decision.lifecycle === "INDEXABLE_READY" ||
        joined.includes("link graph") ||
        joined.includes("MISSING_INTERNAL_LINKS")
      ) {
        return {
          ...base,
          outcome: "REMAIN_READY",
          reason: "Quality OK — internal links incomplete",
          detail: decision.detail,
          qualityScore,
          indexEligible,
          semanticBlocked,
          linkReady: false,
        };
      }

      if (apply) {
        demote(
          "guide",
          candidate.slug,
          "IMPROVE",
          `READY review failed: ${joined.slice(0, 240)}`,
          persist,
        );
      }
      return {
        ...base,
        outcome: "BACK_TO_IMPROVE",
        reason: "Current-state quality/gates failed",
        detail: decision.detail,
        qualityScore,
        indexEligible: indexEligible ?? false,
        semanticBlocked,
        linkReady,
      };
    }

    // comparison
    const soft = buildSoftwareLookup(getSoftware({ includeUnpublished: true }));
    const comparison =
      getComparisonBySlug(candidate.slug) ??
      getAllComparisonsUnfiltered().find((c) => c.slug === candidate.slug);
    if (!comparison) {
      if (apply) {
        demote(
          "comparison",
          candidate.slug,
          "IMPROVE",
          "READY review: missing comparison entity",
          persist,
        );
      }
      return {
        ...base,
        outcome: "BACK_TO_IMPROVE",
        reason: "Missing comparison entity",
        detail: ["missing_entity"],
        qualityScore,
        indexEligible,
        semanticBlocked,
        linkReady,
      };
    }
    if (!getComparisonBySlug(candidate.slug)) {
      if (apply) {
        demote(
          "comparison",
          candidate.slug,
          "IMPROVE",
          "READY review: public route does not resolve",
          persist,
        );
      }
      return {
        ...base,
        outcome: "BACK_TO_IMPROVE",
        reason: "Public compare route does not resolve",
        detail: ["route_not_public", `status=${comparison.metadata.status}`],
        qualityScore,
        indexEligible,
        semanticBlocked,
        linkReady,
      };
    }

    const rel = resolveComparisonRelationship(comparison, soft);
    if (!hasIndexableRelationship(rel.kind)) {
      detail.push(`relationship:${rel.kind}`);
      if (apply) {
        demote(
          "comparison",
          candidate.slug,
          "IMPROVE",
          `READY review: weak relationship ${rel.kind}`,
          persist,
        );
      }
      return {
        ...base,
        outcome: "BACK_TO_IMPROVE",
        reason: `Weak comparison relationship (${rel.kind})`,
        detail,
        qualityScore,
        indexEligible,
        semanticBlocked,
        linkReady,
      };
    }

    const gate = analyzePageQualityGate({
      pageType: "comparison",
      slug: candidate.slug,
    });
    if (gate) {
      qualityScore = gate.qualityScore;
      indexEligible = gate.indexEligible;
      if (apply) {
        recordGateResult(gate, "analyze", {
          note: "ready-queue review",
          persist: true,
        });
      }
      if (gate.failures.length > 0) {
        detail.push(...gate.failures.map((f) => `quality:${f.code}`));
      }
    }

    const peersAll =
      opts.peers?.comparisons ?? getAllComparisonsUnfiltered();
    const peers = peersAll.filter(
      (p) =>
        p.categorySlug === comparison.categorySlug ||
        p.productSlugs.some((s) => comparison.productSlugs.includes(s)),
    );
    const semantic = assessComparisonSemanticTemplateRisk(
      comparison,
      peers.length > 0 ? peers : peersAll.slice(0, 200),
    );
    if (semantic.blocksAutoPromotion) {
      semanticBlocked = true;
      detail.push(`SEMANTIC_TEMPLATE_RISK: ${semantic.promotionReason}`);
      if (apply) {
        demote(
          "comparison",
          candidate.slug,
          "MANUAL_REVIEW",
          `READY review: ${semantic.promotionReason}`,
          persist,
        );
      }
      return {
        ...base,
        outcome: "MANUAL_REVIEW",
        reason: "Semantic template risk",
        detail,
        qualityScore,
        indexEligible,
        semanticBlocked,
        linkReady,
      };
    }

    const links = assessLinkReadiness(candidate.path, {
      kind: "comparison",
      slug: candidate.slug,
      light: true,
    });
    linkReady = links.ok;
    if (!links.ok) detail.push(...links.detail.map((d) => `link:${d}`));

    const decision = canPromoteToIndexable({
      kind: "comparison",
      entity: comparison,
      soft,
      peers,
    });

    if (decision.alreadyIndexable) {
      return {
        ...base,
        outcome: "SKIPPED",
        reason: "Already indexable",
        detail: decision.detail,
        qualityScore,
        indexEligible,
        semanticBlocked,
        linkReady,
      };
    }

    if (decision.ok) {
      if (apply) {
        const result = persist
          ? promoteAndPersist({
              kind: "comparison",
              entity: comparison,
              soft,
              peers,
            })
          : promoteToIndexable({
              kind: "comparison",
              entity: comparison,
              soft,
              peers,
            });
        if (!result.ok) {
          return {
            ...base,
            outcome: "REMAIN_READY",
            reason: "Promote failed unexpectedly",
            detail: result.detail,
            qualityScore,
            indexEligible,
            semanticBlocked,
            linkReady,
          };
        }
      }
      return {
        ...base,
        outcome: "PROMOTED",
        reason: apply
          ? "Current-state gates + relationship + links passed — promoted"
          : "Would promote (dry-run)",
        detail: decision.detail,
        qualityScore,
        indexEligible,
        semanticBlocked,
        linkReady,
      };
    }

    const joined = decision.detail.join(" ");
    if (joined.includes("SEMANTIC_TEMPLATE_RISK")) {
      if (apply) {
        demote(
          "comparison",
          candidate.slug,
          "MANUAL_REVIEW",
          `READY review: ${joined}`,
          persist,
        );
      }
      return {
        ...base,
        outcome: "MANUAL_REVIEW",
        reason: "Semantic / manual review block",
        detail: decision.detail,
        qualityScore,
        indexEligible: indexEligible ?? false,
        semanticBlocked: true,
        linkReady,
      };
    }
    if (
      decision.lifecycle === "INDEXABLE_READY" ||
      joined.includes("link graph") ||
      joined.includes("MISSING_INTERNAL_LINKS")
    ) {
      return {
        ...base,
        outcome: "REMAIN_READY",
        reason: "Quality OK — internal links incomplete",
        detail: decision.detail,
        qualityScore,
        indexEligible,
        semanticBlocked,
        linkReady: false,
      };
    }

    if (apply) {
      demote(
        "comparison",
        candidate.slug,
        "IMPROVE",
        `READY review failed: ${joined.slice(0, 240)}`,
        persist,
      );
    }
    return {
      ...base,
      outcome: "BACK_TO_IMPROVE",
      reason: "Current-state quality/gates failed",
      detail: decision.detail,
      qualityScore,
      indexEligible: indexEligible ?? false,
      semanticBlocked,
      linkReady,
    };
  } finally {
    if (prevLink === undefined) delete process.env.SG_ENFORCE_LINK_READINESS;
    else process.env.SG_ENFORCE_LINK_READINESS = prevLink;
  }
}

function emptyCounts(): ReadyBatchReport["counts"] {
  return {
    PROMOTED: 0,
    REMAIN_READY: 0,
    BACK_TO_IMPROVE: 0,
    MANUAL_REVIEW: 0,
    SKIPPED: 0,
    qualityFailures: 0,
    semanticFailures: 0,
    missingEntities: 0,
    missingLinks: 0,
    pricingEvidenceBlockers: 0,
  };
}

export function tallyResults(results: ReadyReviewResult[]): ReadyBatchReport["counts"] {
  const counts = emptyCounts();
  for (const r of results) {
    counts[r.outcome] += 1;
    if (r.detail.some((d) => d.startsWith("quality:") || d.includes("gate:"))) {
      counts.qualityFailures += 1;
    }
    if (r.semanticBlocked || r.outcome === "MANUAL_REVIEW") {
      counts.semanticFailures += 1;
    }
    if (r.detail.some((d) => d.includes("missing_entity") || d.includes("route_not_public"))) {
      counts.missingEntities += 1;
    }
    if (r.linkReady === false || r.detail.some((d) => d.startsWith("link:"))) {
      counts.missingLinks += 1;
    }
    if (
      r.detail.some(
        (d) =>
          d.toLowerCase().includes("pricing") ||
          d.toLowerCase().includes("evidence") ||
          d.includes("empty_generated"),
      )
    ) {
      counts.pricingEvidenceBlockers += 1;
    }
  }
  return counts;
}

export function processReadyBatch(
  candidates: ReadyCandidate[],
  opts: {
    batchIndex?: number;
    apply?: boolean;
    persist?: boolean;
  } = {},
): ReadyBatchReport {
  const reviewed: ReadyReviewResult[] = [];
  // Shared peer lists once per batch (semantic assessors).
  const guidePeers = candidates.some((c) => c.kind === "guide")
    ? getGuides({ includeUnpublished: true })
    : undefined;
  const comparePeers = candidates.some((c) => c.kind === "comparison")
    ? getAllComparisonsUnfiltered()
    : undefined;

  for (const c of candidates) {
    reviewed.push(
      reviewReadyPage(c, {
        apply: opts.apply,
        persist: opts.persist,
        peers: { guides: guidePeers, comparisons: comparePeers },
      }),
    );
  }

  return {
    version: READY_QUEUE_VERSION,
    generatedAt: new Date().toISOString(),
    batchIndex: opts.batchIndex ?? 0,
    applied: opts.apply === true,
    persist: opts.persist === true,
    reviewed,
    counts: tallyResults(reviewed),
  };
}
