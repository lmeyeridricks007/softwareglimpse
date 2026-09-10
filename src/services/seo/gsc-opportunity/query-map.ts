import type { QueryIntent } from "@/domain";
import { classifyQuery } from "../classify-query";
import { clusterKeyForQuery } from "../cluster-queries";
import { normalizeQuery } from "../normalize-query";
import type {
  ActionConfidence,
  GscActionType,
  GscCommercialIntent,
  GscRootCause,
  InferredQueryCandidate,
  MappedQuery,
  QueryMappingConfidence,
  QueryProvenance,
  QueryRelationshipEvidence,
  QueryRelationshipSource,
  QuerySourceDateRange,
} from "./types";

export function toCommercialIntent(intent: QueryIntent): GscCommercialIntent {
  switch (intent) {
    case "pricing":
      return "pricing";
    case "transactional":
      return "transactional";
    case "comparison":
      return "comparison";
    case "alternatives":
      return "alternatives";
    case "review":
      return "review";
    case "best":
      return "buying_guide";
    case "brand":
      return "navigational_brand";
    case "informational":
    case "problem":
    case "category":
    case "tool":
      return "informational";
    case "unknown":
      return "low_value";
    default:
      return "commercial_investigation";
  }
}

function tokenize(s: string): string[] {
  return normalizeQuery(s)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2 && !STOP.has(t));
}

const STOP = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "that",
  "this",
  "are",
  "was",
  "you",
  "your",
  "our",
  "into",
  "vs",
  "or",
  "of",
  "to",
  "in",
  "on",
  "a",
  "an",
]);

/** Tokens too generic to justify page→query attachment alone. */
const GENERIC_QUERY_TOKENS = new Set([
  "software",
  "seo",
  "crm",
  "tool",
  "tools",
  "app",
  "apps",
  "platform",
  "platforms",
  "system",
  "systems",
  "solution",
  "solutions",
  "best",
  "top",
  "free",
  "online",
  "cloud",
  "business",
  "management",
  "marketing",
  "sales",
  "email",
  "review",
  "reviews",
  "compare",
  "comparison",
  "alternative",
  "alternatives",
  "pricing",
  "price",
  "cost",
]);

export type PageQueryMatchContext = {
  path: string;
  title: string | null;
  pageType: string;
  productSlugs: string[];
  categorySlugs: string[];
};

export type AggregatedQuery = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  sourceDateRange?: QuerySourceDateRange;
};

export type PageQueryMapping = {
  relationshipSource: QueryRelationshipSource;
  provenance: QueryProvenance;
  mappingConfidence: QueryMappingConfidence;
  mappingReason: string;
  evidence: QueryRelationshipEvidence[];
  sourceDateRange: QuerySourceDateRange;
  /** Trusted target only — DIRECT_GSC / HISTORICAL_DIRECT_GSC / INFERRED_HIGH. */
  targetQuery: string | null;
  mappedQueries: MappedQuery[];
  inferredQueryCandidates: InferredQueryCandidate[];
  actionConfidence: ActionConfidence;
  requiresHumanReview: boolean;
};

const EMPTY_DATE_RANGE: QuerySourceDateRange = {
  startDate: null,
  endDate: null,
};

export function relationshipSourceFrom(
  provenance: QueryProvenance,
  confidence: QueryMappingConfidence,
): QueryRelationshipSource {
  if (provenance === "DIRECT_GSC") return "DIRECT_GSC";
  if (provenance === "HISTORICAL_DIRECT_GSC") return "HISTORICAL_DIRECT_GSC";
  if (provenance === "UNKNOWN") return "UNKNOWN";
  if (confidence === "HIGH") return "INFERRED_HIGH";
  if (confidence === "MEDIUM") return "INFERRED_MEDIUM";
  if (confidence === "LOW") return "INFERRED_LOW";
  return "UNKNOWN";
}

export function provenanceFromRelationshipSource(
  source: QueryRelationshipSource,
): QueryProvenance {
  if (source === "DIRECT_GSC") return "DIRECT_GSC";
  if (source === "HISTORICAL_DIRECT_GSC") return "HISTORICAL_DIRECT_GSC";
  if (source === "UNKNOWN") return "UNKNOWN";
  return "INFERRED";
}

function isMostlyGenericQuery(tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const specific = tokens.filter((t) => !GENERIC_QUERY_TOKENS.has(t));
  return specific.length === 0;
}

function confidenceFromMatchScore(
  matchScore: number,
  opts: {
    hasStrongEntity: boolean;
    mostlyGeneric: boolean;
    pageNeedsEntity: boolean;
  },
): QueryMappingConfidence {
  if (opts.mostlyGeneric) return "LOW";
  if (opts.pageNeedsEntity && !opts.hasStrongEntity) {
    // Software/compare pages must share a product/entity — never promote on
    // generic "software" / "seo" token overlap alone.
    return matchScore >= 0.55 ? "LOW" : "UNKNOWN";
  }
  if (opts.hasStrongEntity && matchScore >= 0.85) return "HIGH";
  if (matchScore >= 0.72 && opts.hasStrongEntity) return "MEDIUM";
  if (matchScore >= 0.55) return "MEDIUM";
  if (matchScore >= 0.35) return "LOW";
  return "UNKNOWN";
}

function pageNeedsStrongEntity(page: PageQueryMatchContext): boolean {
  const pt = page.pageType.toLowerCase();
  const p = page.path.toLowerCase();
  return (
    p.startsWith("/software/") ||
    p.startsWith("/compare/") ||
    p.startsWith("/alternatives/") ||
    p.startsWith("/pricing/") ||
    pt.includes("review") ||
    pt.includes("comparison") ||
    pt.includes("alternatives")
  );
}

function scoreQueryAgainstPage(
  page: PageQueryMatchContext,
  q: AggregatedQuery,
): {
  matchScore: number;
  intent: GscCommercialIntent;
  hasStrongEntity: boolean;
  mostlyGeneric: boolean;
  reason: string;
  clusterKey: string;
} | null {
  const classified = classifyQuery(q.query);
  const qTokens = tokenize(q.query);
  if (qTokens.length === 0) return null;

  const pathTokens = new Set(tokenize(page.path.replace(/\//g, " ")));
  const titleTokens = new Set(tokenize(page.title ?? ""));
  const productSet = new Set(page.productSlugs.map((s) => s.toLowerCase()));
  const categorySet = new Set(page.categorySlugs.map((s) => s.toLowerCase()));

  let overlap = 0;
  let specificOverlap = 0;
  for (const t of qTokens) {
    if (pathTokens.has(t) || titleTokens.has(t)) {
      overlap += 1;
      if (!GENERIC_QUERY_TOKENS.has(t)) specificOverlap += 1;
    }
  }
  const tokenScore = overlap / qTokens.length;
  const specificTokenScore =
    qTokens.filter((t) => !GENERIC_QUERY_TOKENS.has(t)).length > 0
      ? specificOverlap /
        qTokens.filter((t) => !GENERIC_QUERY_TOKENS.has(t)).length
      : 0;

  let entityScore = 0;
  let hasStrongEntity = false;
  const needsBothCompareProducts = page.path.startsWith("/compare/");

  for (const slug of classified.productSlugs) {
    const slugNorm = slug.toLowerCase();
    if (productSet.has(slugNorm)) {
      entityScore = Math.max(entityScore, needsBothCompareProducts ? 0.55 : 0.95);
      if (!needsBothCompareProducts) hasStrongEntity = true;
    }
    // Full slug as path segment (e.g. /software/hubspot/)
    if (pathTokens.has(slugNorm) || page.path.includes(`/${slugNorm}/`)) {
      entityScore = Math.max(entityScore, needsBothCompareProducts ? 0.55 : 0.9);
      if (!needsBothCompareProducts) hasStrongEntity = true;
    }
    // Multi-part slug: require majority of distinctive parts
    const parts = slugNorm.split("-").filter((p) => p.length >= 3);
    if (parts.length >= 2) {
      const hit = parts.filter((part) => pathTokens.has(part)).length;
      if (hit === parts.length) {
        entityScore = Math.max(entityScore, needsBothCompareProducts ? 0.5 : 0.75);
        if (!needsBothCompareProducts) hasStrongEntity = true;
      }
    }
  }
  for (const slug of classified.categorySlugs) {
    if (categorySet.has(slug) || pathTokens.has(slug)) {
      entityScore = Math.max(entityScore, 0.7);
      // Category alone is not "strong entity" for product/compare pages.
      if (!pageNeedsStrongEntity(page)) hasStrongEntity = true;
    }
  }

  // Comparison pages: both product tokens required for strong entity / HIGH.
  if (needsBothCompareProducts) {
    const pathProducts = page.path
      .split("/")
      .filter(Boolean)[1]
      ?.split("-vs-")
      .filter(Boolean);
    if (pathProducts && pathProducts.length >= 2) {
      const qSet = new Set(qTokens);
      const productMatched = (prod: string): boolean => {
        if (qSet.has(prod)) return true;
        // Ignore generic fragments (crm, sales, software) — require a
        // distinctive brand token from the product slug.
        const distinctive = prod
          .split("-")
          .filter((p) => p.length >= 3 && !GENERIC_QUERY_TOKENS.has(p));
        if (distinctive.length === 0) return qSet.has(prod);
        return distinctive.some((p) => qSet.has(p));
      };
      const hits = pathProducts.filter(productMatched).length;
      if (hits >= 2) {
        entityScore = Math.max(entityScore, 0.95);
        hasStrongEntity = true;
      } else if (hits === 1) {
        entityScore = Math.max(entityScore, 0.55);
        hasStrongEntity = false;
      }
    }
  }

  let intentAlign = 0.25;
  const pt = page.pageType.toLowerCase();
  const intent = classified.intent;
  if (intent === "review" && (pt.includes("review") || pt.includes("software"))) {
    intentAlign = 0.55;
  } else if (
    intent === "comparison" &&
    (pt.includes("comparison") || pt.includes("compare"))
  ) {
    intentAlign = 0.75;
  } else if (intent === "alternatives" && pt.includes("alternatives")) {
    intentAlign = 0.75;
  } else if (
    intent === "best" &&
    (pt.includes("best") || pt.includes("industry"))
  ) {
    intentAlign = 0.7;
  } else if (intent === "pricing" && pt.includes("pricing")) {
    intentAlign = 0.75;
  } else if (intent === "informational" && pt.includes("guide")) {
    intentAlign = 0.65;
  }

  const mostlyGeneric = isMostlyGenericQuery(qTokens);
  // Down-weight generic token-only overlap hard.
  const effectiveToken =
    mostlyGeneric ? tokenScore * 0.15 : tokenScore * 0.35 + specificTokenScore * 0.2;

  const matchScore =
    effectiveToken + entityScore * 0.4 + intentAlign * 0.15;

  const reasonParts: string[] = [];
  if (hasStrongEntity) reasonParts.push("shared product/entity");
  if (specificOverlap > 0) reasonParts.push("specific token overlap");
  if (mostlyGeneric) reasonParts.push("mostly generic query tokens");
  if (!hasStrongEntity && pageNeedsStrongEntity(page)) {
    reasonParts.push("missing product entity on product/compare page");
  }

  return {
    matchScore,
    intent: toCommercialIntent(classified.intent),
    hasStrongEntity,
    mostlyGeneric,
    reason: reasonParts.join("; ") || "weak path/title overlap",
    clusterKey: clusterKeyForQuery(q.query),
  };
}

/**
 * DIRECT_GSC mapping from real page×query matrix rows.
 */
export function mapQueriesFromPageQueryMatrix(
  pathQueries: AggregatedQuery[],
  opts: {
    historical?: boolean;
    sourceDateRange?: QuerySourceDateRange;
  } = {},
): PageQueryMapping {
  const provenance: QueryProvenance = opts.historical
    ? "HISTORICAL_DIRECT_GSC"
    : "DIRECT_GSC";
  const relationshipSource: QueryRelationshipSource = opts.historical
    ? "HISTORICAL_DIRECT_GSC"
    : "DIRECT_GSC";
  const dateRange = opts.sourceDateRange ?? EMPTY_DATE_RANGE;

  if (pathQueries.length === 0) {
    return {
      relationshipSource: "UNKNOWN",
      provenance: "UNKNOWN",
      mappingConfidence: "UNKNOWN",
      mappingReason: "Page×query matrix present site-wide but empty for this URL",
      evidence: [{ label: "empty_matrix_path" }],
      sourceDateRange: dateRange,
      targetQuery: null,
      mappedQueries: [],
      inferredQueryCandidates: [],
      actionConfidence: "PAGE_LEVEL",
      requiresHumanReview: false,
    };
  }

  const mapped: MappedQuery[] = pathQueries
    .map((q) => {
      const classified = classifyQuery(q.query);
      const reason = opts.historical
        ? "Historical GSC page×query row"
        : "Direct GSC page×query row";
      const evidence: QueryRelationshipEvidence[] = [
        {
          label: opts.historical ? "historical_page_query_row" : "direct_page_query_row",
          detail: `${q.impressions} impressions · pos ${q.position}`,
        },
      ];
      const rowRange = q.sourceDateRange ?? dateRange;
      return {
        query: q.query,
        clicks: q.clicks,
        impressions: q.impressions,
        ctr: q.ctr,
        position: q.position,
        intent: toCommercialIntent(classified.intent),
        matchScore: 1,
        clusterKey: clusterKeyForQuery(q.query),
        relationshipSource,
        provenance,
        confidence: "HIGH" as const,
        mappingConfidence: "HIGH" as const,
        reason,
        mappingReason: reason,
        evidence,
        sourceDateRange: rowRange,
      };
    })
    .sort(
      (a, b) =>
        b.impressions - a.impressions || b.clicks - a.clicks,
    );

  const primary = mapped[0]!;
  return {
    relationshipSource,
    provenance,
    mappingConfidence: "HIGH",
    mappingReason: primary.reason,
    evidence: primary.evidence,
    sourceDateRange: primary.sourceDateRange,
    targetQuery: primary.query,
    mappedQueries: mapped.slice(0, 12),
    inferredQueryCandidates: [],
    actionConfidence: "EVIDENCED",
    requiresHumanReview: false,
  };
}

/**
 * Heuristic query→page mapping when GSC page×query matrix is unavailable.
 * Never presents LOW/MEDIUM as a trusted primary/target query.
 */
export function matchQueriesToPage(
  page: PageQueryMatchContext,
  queries: AggregatedQuery[],
  opts: { minScore?: number; maxQueries?: number } = {},
): MappedQuery[] {
  return inferPageQueryMapping(page, queries, opts).mappedQueries;
}

export function inferPageQueryMapping(
  page: PageQueryMatchContext,
  queries: AggregatedQuery[],
  opts: {
    minScore?: number;
    maxCandidates?: number;
    sourceDateRange?: QuerySourceDateRange;
  } = {},
): PageQueryMapping {
  const minScore = opts.minScore ?? 0.35;
  const maxCandidates = opts.maxCandidates ?? 12;
  const needsEntity = pageNeedsStrongEntity(page);
  const dateRange = opts.sourceDateRange ?? EMPTY_DATE_RANGE;

  const scored: Array<{
    q: AggregatedQuery;
    matchScore: number;
    intent: GscCommercialIntent;
    hasStrongEntity: boolean;
    mostlyGeneric: boolean;
    reason: string;
    clusterKey: string;
    confidence: QueryMappingConfidence;
  }> = [];

  for (const q of queries) {
    const scoredQ = scoreQueryAgainstPage(page, q);
    if (!scoredQ || scoredQ.matchScore < minScore) continue;
    const confidence = confidenceFromMatchScore(scoredQ.matchScore, {
      hasStrongEntity: scoredQ.hasStrongEntity,
      mostlyGeneric: scoredQ.mostlyGeneric,
      pageNeedsEntity: needsEntity,
    });
    if (confidence === "UNKNOWN") continue;
    scored.push({ ...scoredQ, q, confidence });
  }

  scored.sort(
    (a, b) =>
      b.q.impressions * b.matchScore - a.q.impressions * a.matchScore ||
      b.matchScore - a.matchScore,
  );

  const top = scored.slice(0, maxCandidates);
  const candidates: InferredQueryCandidate[] = top.map((s) => {
    const relationshipSource = relationshipSourceFrom("INFERRED", s.confidence);
    const reason = `INFERRED — NOT DIRECT GSC DATA (${s.reason})`;
    const evidence: QueryRelationshipEvidence[] = [
      { label: "heuristic_overlap", detail: s.reason },
      { label: "match_score", detail: String(s.matchScore.toFixed(3)) },
      { label: "relationship_source", detail: relationshipSource },
    ];
    return {
      query: s.q.query,
      clicks: s.q.clicks,
      impressions: s.q.impressions,
      ctr: s.q.ctr,
      position: s.q.position,
      intent: s.intent,
      matchScore: s.matchScore,
      clusterKey: s.clusterKey,
      relationshipSource,
      confidence: s.confidence,
      mappingConfidence: s.confidence,
      reason,
      mappingReason: reason,
      evidence,
      sourceDateRange: s.q.sourceDateRange ?? dateRange,
    };
  });

  const best = top[0];
  if (!best) {
    return {
      relationshipSource: "UNKNOWN",
      provenance: "UNKNOWN",
      mappingConfidence: "UNKNOWN",
      mappingReason:
        "No page×query matrix and no heuristic candidates above threshold",
      evidence: [{ label: "no_candidates" }],
      sourceDateRange: dateRange,
      targetQuery: null,
      mappedQueries: [],
      inferredQueryCandidates: [],
      actionConfidence: "PAGE_LEVEL",
      requiresHumanReview: false,
    };
  }

  // Prefer the strongest HIGH candidate for targetQuery (not merely top impressions).
  const bestHigh = top.find((s) => s.confidence === "HIGH");
  const allowTarget = Boolean(bestHigh);
  const target = bestHigh ?? null;
  const mappedQueries: MappedQuery[] = target
    ? [
        {
          query: target.q.query,
          clicks: target.q.clicks,
          impressions: target.q.impressions,
          ctr: target.q.ctr,
          position: target.q.position,
          intent: target.intent,
          matchScore: target.matchScore,
          clusterKey: target.clusterKey,
          relationshipSource: "INFERRED_HIGH",
          provenance: "INFERRED",
          confidence: "HIGH",
          mappingConfidence: "HIGH",
          reason: `INFERRED — NOT DIRECT GSC DATA (${target.reason}); INFERRED_HIGH — human review required before title/H1/content rewrites`,
          mappingReason: `INFERRED — NOT DIRECT GSC DATA (${target.reason}); INFERRED_HIGH — human review required before title/H1/content rewrites`,
          evidence: [
            { label: "heuristic_entity_match", detail: target.reason },
            { label: "match_score", detail: String(target.matchScore.toFixed(3)) },
            { label: "relationship_source", detail: "INFERRED_HIGH" },
          ],
          sourceDateRange: target.q.sourceDateRange ?? dateRange,
        },
      ]
    : [];

  const overallConfidence = bestHigh?.confidence ?? best.confidence;
  const relationshipSource = relationshipSourceFrom("INFERRED", overallConfidence);

  return {
    relationshipSource,
    provenance: "INFERRED",
    mappingConfidence: overallConfidence,
    mappingReason: `INFERRED — NOT DIRECT GSC DATA (${(bestHigh ?? best).reason})`,
    evidence: [
      { label: "heuristic_overlap", detail: (bestHigh ?? best).reason },
      { label: "relationship_source", detail: relationshipSource },
    ],
    sourceDateRange: dateRange,
    targetQuery: allowTarget ? target!.q.query : null,
    mappedQueries,
    inferredQueryCandidates: candidates,
    actionConfidence: allowTarget ? "REVIEW_REQUIRED" : "SUPPRESSED",
    requiresHumanReview: true,
  };
}

export function primaryCommercialIntent(
  mapped: MappedQuery[],
  fallbackPath: string,
  candidates: InferredQueryCandidate[] = [],
): GscCommercialIntent {
  const intentSource =
    mapped.length > 0
      ? mapped
      : candidates.map((c) => ({
          intent: c.intent,
          impressions: c.impressions,
        }));

  if (intentSource.length === 0) {
    const p = fallbackPath.toLowerCase();
    if (p.includes("/compare/") || p.includes("-vs-")) return "comparison";
    if (p.includes("/alternatives/")) return "alternatives";
    if (p.includes("/pricing/")) return "pricing";
    if (p.includes("/best/") || p.includes("/industries/")) return "buying_guide";
    if (p.includes("/software/")) return "review";
    if (p.includes("/guides/")) return "informational";
    return "commercial_investigation";
  }

  const weights = new Map<GscCommercialIntent, number>();
  for (const m of intentSource) {
    if (m.intent === "low_value") continue;
    weights.set(m.intent, (weights.get(m.intent) ?? 0) + m.impressions);
  }
  let best: GscCommercialIntent = intentSource[0]!.intent;
  let bestW = -1;
  for (const [intent, w] of weights) {
    if (w > bestW) {
      best = intent;
      bestW = w;
    }
  }
  return best;
}

/**
 * Query-scoped actions may auto-fire only from DIRECT_GSC / HISTORICAL_DIRECT_GSC.
 * INFERRED_HIGH may recommend them with REVIEW_REQUIRED.
 * INFERRED_MEDIUM / INFERRED_LOW must never drive content rewrites.
 */
export const QUERY_SCOPED_REWRITE_ACTIONS = new Set<GscActionType>([
  "OPTIMIZE_TITLE_FOR_QUERY",
  "REWRITE_H1_FOR_QUERY",
  "SEARCH_INTENT_MISMATCH",
  "QUERY_CLUSTER_CONSOLIDATION",
  // legacy aliases
  "FIX_INTENT_MATCH",
  "CONSOLIDATE",
]);

/** @deprecated Prefer QUERY_SCOPED_REWRITE_ACTIONS */
export const QUERY_SPECIFIC_ACTIONS = QUERY_SCOPED_REWRITE_ACTIONS;

export function querySpecificActionsAllowed(
  actionConfidence: ActionConfidence,
): boolean {
  return (
    actionConfidence === "EVIDENCED" || actionConfidence === "REVIEW_REQUIRED"
  );
}

export function mayAutoApplyQueryScopedActions(
  actionConfidence: ActionConfidence,
): boolean {
  return actionConfidence === "EVIDENCED";
}

/**
 * Attach query-scoped rewrite recommendations based on relationship strength.
 * Page-level OPTIMIZE_TITLE (no target query) is separate and may remain.
 */
export function attachQueryScopedActions(input: {
  recommendedActions: GscActionType[];
  primaryAction: GscActionType;
  rootCauses: GscRootCause[];
  actionConfidence: ActionConfidence;
  relationshipSource: QueryRelationshipSource;
  targetQuery: string | null;
  h1LooksWeak?: boolean;
}): {
  recommendedActions: GscActionType[];
  primaryAction: GscActionType;
  rootCauses: GscRootCause[];
  notes: string[];
} {
  const notes: string[] = [];
  let actions = [...input.recommendedActions];
  let causes = [...input.rootCauses];
  let primary = input.primaryAction;

  const canRecommend = querySpecificActionsAllowed(input.actionConfidence);
  const canAuto = mayAutoApplyQueryScopedActions(input.actionConfidence);

  // Strip any query-scoped actions unless mapping allows recommendation.
  if (!canRecommend) {
    actions = actions.filter((a) => !QUERY_SCOPED_REWRITE_ACTIONS.has(a));
    causes = causes.filter(
      (c) => c !== "INTENT_MISMATCH" && c !== "CANNIBALIZATION",
    );
    notes.push(
      "Query-scoped rewrite actions suppressed — relationshipSource is not DIRECT_GSC / HISTORICAL_DIRECT_GSC / INFERRED_HIGH",
    );
    if (
      QUERY_SCOPED_REWRITE_ACTIONS.has(primary) ||
      primary === "OPTIMIZE_TITLE_FOR_QUERY"
    ) {
      primary =
        actions.find((a) => a !== "NO_ACTION") ??
        ("MANUAL_REVIEW" as GscActionType);
    }
    return { recommendedActions: actions, primaryAction: primary, rootCauses: causes, notes };
  }

  if (input.targetQuery) {
    if (
      causes.includes("TITLE_WEAK") ||
      causes.includes("POOR_CTR")
    ) {
      if (!actions.includes("OPTIMIZE_TITLE_FOR_QUERY")) {
        actions.push("OPTIMIZE_TITLE_FOR_QUERY");
      }
    }
    if (input.h1LooksWeak) {
      if (!actions.includes("REWRITE_H1_FOR_QUERY")) {
        actions.push("REWRITE_H1_FOR_QUERY");
      }
    }
    if (causes.includes("INTENT_MISMATCH")) {
      if (!actions.includes("SEARCH_INTENT_MISMATCH")) {
        actions.push("SEARCH_INTENT_MISMATCH");
      }
      actions = actions.filter((a) => a !== "FIX_INTENT_MATCH");
    }
    if (causes.includes("CANNIBALIZATION")) {
      if (!actions.includes("QUERY_CLUSTER_CONSOLIDATION")) {
        actions.push("QUERY_CLUSTER_CONSOLIDATION");
      }
      actions = actions.filter((a) => a !== "CONSOLIDATE");
    }
  }

  if (canAuto) {
    notes.push(
      `Query-scoped actions allowed from ${input.relationshipSource} evidence`,
    );
    // Prefer query-scoped title action over generic page-level when evidenced.
    if (
      actions.includes("OPTIMIZE_TITLE_FOR_QUERY") &&
      (primary === "OPTIMIZE_TITLE" || primary === "MANUAL_REVIEW")
    ) {
      primary = "OPTIMIZE_TITLE_FOR_QUERY";
    }
    if (
      actions.includes("SEARCH_INTENT_MISMATCH") &&
      (primary === "OPTIMIZE_TITLE" || primary === "OPTIMIZE_TITLE_FOR_QUERY")
    ) {
      primary = "SEARCH_INTENT_MISMATCH";
    }
    if (actions.includes("QUERY_CLUSTER_CONSOLIDATION")) {
      primary = "QUERY_CLUSTER_CONSOLIDATION";
    }
  } else {
    // INFERRED_HIGH — recommend only under human review.
    notes.push(
      "INFERRED_HIGH — NOT DIRECT GSC DATA — query-scoped actions require human review before title/H1/content rewrites",
    );
    if (!actions.includes("MANUAL_REVIEW")) {
      actions = ["MANUAL_REVIEW", ...actions];
    }
    // Never auto-primary a query-scoped rewrite (or a title rewrite that
    // was upgraded for a guessed target query) from inference alone.
    if (
      QUERY_SCOPED_REWRITE_ACTIONS.has(primary) ||
      actions.includes("OPTIMIZE_TITLE_FOR_QUERY") ||
      actions.includes("REWRITE_H1_FOR_QUERY")
    ) {
      primary = "MANUAL_REVIEW";
    }
  }

  return {
    recommendedActions: [...new Set(actions)],
    primaryAction: primary,
    rootCauses: causes,
    notes,
  };
}

/**
 * Strip query-specific rewrite actions when mapping is weak.
 * Page-level OPTIMIZE_TITLE from TITLE_WEAK / POOR_CTR may remain when
 * `keepPageLevelTitleOpt` is true (title length issues need no target query).
 */
export function gateQuerySpecificActions(input: {
  recommendedActions: GscActionType[];
  primaryAction: GscActionType;
  rootCauses: GscRootCause[];
  actionConfidence: ActionConfidence;
  relationshipSource?: QueryRelationshipSource;
  targetQuery?: string | null;
  h1LooksWeak?: boolean;
  keepPageLevelTitleOpt?: boolean;
}): {
  recommendedActions: GscActionType[];
  primaryAction: GscActionType;
  rootCauses: GscRootCause[];
  notes: string[];
} {
  const notes: string[] = [];
  const allow = querySpecificActionsAllowed(input.actionConfidence);
  let actions = [...input.recommendedActions];
  let causes = [...input.rootCauses];
  let primary = input.primaryAction;

  if (!allow) {
    actions = actions.filter((a) => !QUERY_SCOPED_REWRITE_ACTIONS.has(a));
    causes = causes.filter(
      (c) => c !== "INTENT_MISMATCH" && c !== "CANNIBALIZATION",
    );
    notes.push(
      "Query-scoped actions suppressed — mapping is not DIRECT_GSC / HISTORICAL_DIRECT_GSC / INFERRED_HIGH (INFERRED — NOT DIRECT GSC DATA)",
    );

    // OPTIMIZE_TITLE only as page-level when title/CTR evidence exists without relying on target query.
    if (
      !input.keepPageLevelTitleOpt &&
      actions.includes("OPTIMIZE_TITLE") &&
      !causes.includes("TITLE_WEAK") &&
      !causes.includes("POOR_CTR")
    ) {
      actions = actions.filter((a) => a !== "OPTIMIZE_TITLE");
    }
    if (QUERY_SCOPED_REWRITE_ACTIONS.has(primary)) {
      primary =
        actions.find((a) => a !== "NO_ACTION") ??
        ("MANUAL_REVIEW" as GscActionType);
    }
  } else {
    const attached = attachQueryScopedActions({
      recommendedActions: actions,
      primaryAction: primary,
      rootCauses: causes,
      actionConfidence: input.actionConfidence,
      relationshipSource:
        input.relationshipSource ??
        (input.actionConfidence === "EVIDENCED"
          ? "DIRECT_GSC"
          : "INFERRED_HIGH"),
      targetQuery: input.targetQuery ?? null,
      h1LooksWeak: input.h1LooksWeak,
    });
    actions = attached.recommendedActions;
    primary = attached.primaryAction;
    causes = attached.rootCauses;
    notes.push(...attached.notes);
  }

  if (
    !actions.includes(primary) ||
    (!allow && QUERY_SCOPED_REWRITE_ACTIONS.has(primary))
  ) {
    primary =
      actions.find((a) => a !== "NO_ACTION") ??
      ("MANUAL_REVIEW" as GscActionType);
  }

  return {
    recommendedActions: actions,
    primaryAction: primary,
    rootCauses: causes,
    notes,
  };
}

export function findQueriesWithoutStrongPage(
  queries: AggregatedQuery[],
  pages: Array<{ path: string; mapped: MappedQuery[]; candidates?: InferredQueryCandidate[] }>,
  minImpressions = 80,
): Array<{
  query: string;
  impressions: number;
  position: number;
  intent: GscCommercialIntent;
  reason: string;
}> {
  const covered = new Set<string>();
  for (const page of pages) {
    for (const m of page.mapped) {
      if (
        m.provenance === "DIRECT_GSC" ||
        m.provenance === "HISTORICAL_DIRECT_GSC" ||
        (m.provenance === "INFERRED" && m.mappingConfidence === "HIGH")
      ) {
        covered.add(normalizeQuery(m.query));
      }
    }
    for (const c of page.candidates ?? []) {
      if (c.mappingConfidence === "HIGH") {
        covered.add(normalizeQuery(c.query));
      }
    }
  }

  const out = [];
  for (const q of queries) {
    if (q.impressions < minImpressions) continue;
    const classified = classifyQuery(q.query);
    const intent = toCommercialIntent(classified.intent);
    if (intent === "navigational_brand" || intent === "low_value") continue;
    if (covered.has(normalizeQuery(q.query))) continue;
    out.push({
      query: q.query,
      impressions: q.impressions,
      position: q.position,
      intent,
      reason:
        "No DIRECT_GSC or HIGH-confidence page match (separate Pages/Queries export — page×query matrix preferred).",
    });
  }
  return out.sort((a, b) => b.impressions - a.impressions).slice(0, 50);
}
