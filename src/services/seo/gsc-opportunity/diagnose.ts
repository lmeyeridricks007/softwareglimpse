import type { ContentRegistryEntry } from "@/domain";
import type { PageQualitySnapshot } from "@/domain/schemas/content-quality";
import { evaluatePageQuality } from "@/services/content-quality";
import type {
  GscActionType,
  GscContentChangeMode,
  GscDifficulty,
  GscRootCause,
  PageDiagnostics,
} from "./types";

export type DiagnoseContext = {
  registryByPath: Map<string, ContentRegistryEntry>;
  snapshotByRoute: Map<string, PageQualitySnapshot>;
  inboundCounts: Map<string, number>;
  outboundCounts: Map<string, number>;
};

export type DiagnoseResult = {
  diagnostics: PageDiagnostics;
  rootCauses: GscRootCause[];
  recommendedActions: GscActionType[];
  primaryAction: GscActionType;
  expectedDifficulty: GscDifficulty;
  contentChangeMode: GscContentChangeMode;
  internalLinkRecommendations: string[];
  backlinksLikelyHelp: boolean;
  qualityScore: number | null;
  completenessSignals: number;
  productSlugs: string[];
  categorySlugs: string[];
};

function inferPageTypeFromPath(path: string): string {
  const parts = path.replace(/^\/|\/$/g, "").split("/");
  const root = parts[0] ?? "";
  switch (root) {
    case "software":
      return "product-review";
    case "compare":
      return "comparison";
    case "alternatives":
      return "alternatives";
    case "best":
      return "best";
    case "pricing":
      return "pricing";
    case "guides":
      return "guide";
    case "industries":
      return "industry";
    case "use-cases":
      return "use-case";
    case "capabilities":
      return "capability";
    case "features":
      return "feature";
    case "tools":
      return "tool-landing";
    case "categories":
      return "category-hub";
    case "resources":
      return "resource";
    default:
      return "unknown-legacy";
  }
}

function titleLooksWeak(title: string | null, path: string): boolean {
  if (!title) return true;
  const len = title.trim().length;
  if (len < 25 || len > 70) return true;
  const slugBits = path
    .replace(/^\/|\/$/g, "")
    .split("/")
    .pop()
    ?.replace(/-/g, " ");
  if (slugBits && title.toLowerCase() === slugBits.toLowerCase()) return true;
  return false;
}

/**
 * Offline diagnostics from registry + content-quality snapshots + link graph.
 * Does not fetch live HTML; flags are evidence-based heuristics only.
 */
export function diagnosePage(
  path: string,
  ctx: DiagnoseContext,
  opts: {
    avgPosition: number;
    ctr: number;
    impressions: number;
    intentMismatch?: boolean;
    cannibalization?: boolean;
    possibleIntentOverlap?: boolean;
  },
): DiagnoseResult {
  const entry = ctx.registryByPath.get(path);
  const snap = ctx.snapshotByRoute.get(path);
  const assessment = snap ? evaluatePageQuality(snap) : null;

  const inbound = ctx.inboundCounts.get(path) ?? 0;
  const outbound =
    ctx.outboundCounts.get(path) ??
    snap?.linking?.supportingContentLinks ??
    null;

  const title = snap?.title ?? entry?.title ?? null;
  const h1 = snap?.h1 ?? null;
  const pageType =
    snap?.pageType ??
    (entry?.type ? String(entry.type) : inferPageTypeFromPath(path));

  const present = new Set(snap?.presentSections ?? []);
  const missing = new Set(snap?.missingSections ?? []);
  const uniqueVerdict =
    present.has("verdict") ||
    (snap?.originalValueSignals?.some((s) =>
      /verdict|assessment/i.test(s),
    ) ??
      false);
  const pricingData =
    present.has("pricing") ||
    (snap?.evidenceSignals?.pricingSourceCount ?? 0) > 0;
  const screenshots = (snap?.evidenceSignals?.screenshotCount ?? 0) > 0;
  const featureTables =
    present.has("features") || Boolean(snap?.structure?.usesTablesOrCards);
  const prosCons = present.has("pros-cons");
  const methodology = Boolean(snap?.trust?.methodologyReferenced);
  const author = Boolean(snap?.trust?.authorOrEditorialOwnership);
  const toolsLinked = (snap?.linking?.toolLinks ?? 0) > 0;
  const relatedContent = (snap?.linking?.supportingContentLinks ?? 0) > 0;
  const mostlyTemplated =
    Boolean(snap?.differentiation?.genericCategoryCopy) ||
    Boolean(snap?.differentiation?.onlyH1Changed) ||
    (assessment != null && assessment.overallScore < 45);

  const firstWordsPreview = snap?.summary
    ? snap.summary.slice(0, 300)
    : null;
  const wordCountEstimate = snap?.summary
    ? snap.summary.trim().split(/\s+/).filter(Boolean).length * 8
    : null;

  const diagnostics: PageDiagnostics = {
    pageType,
    title,
    titleLength: title ? title.length : null,
    h1,
    metaDescription: null,
    firstWordsPreview,
    wordCountEstimate,
    lastUpdated:
      entry?.lastUpdatedAt ??
      entry?.metadata.updatedAt ??
      snap?.freshness?.lastReviewedAt ??
      null,
    uniqueVerdict: snap ? uniqueVerdict : null,
    pricingData: snap ? pricingData : null,
    screenshots: snap ? screenshots : null,
    featureTables: snap ? featureTables : null,
    prosCons: snap ? prosCons : null,
    outgoingInternalLinks: outbound,
    inboundInternalLinks: inbound,
    breadcrumb: null,
    canonical: path,
    structuredData: null,
    author: snap ? author : null,
    editorialMethodology: snap ? methodology : null,
    relatedContent: snap ? relatedContent : null,
    toolsLinked: snap ? toolsLinked : null,
    mostlyTemplated: snap ? mostlyTemplated : null,
    qualityScore: assessment?.overallScore ?? null,
    seoIndexable: entry?.seoIndexable ?? null,
    publishStatus: entry?.metadata.status ?? null,
  };

  const rootCauses: GscRootCause[] = [];
  const actions = new Set<GscActionType>();

  if (titleLooksWeak(title, path)) {
    rootCauses.push("TITLE_WEAK");
    actions.add("OPTIMIZE_TITLE");
  }
  if (opts.intentMismatch) {
    rootCauses.push("INTENT_MISMATCH");
    actions.add("SEARCH_INTENT_MISMATCH");
  }
  if (missing.has("verdict") || (snap && !uniqueVerdict && pageType.includes("review"))) {
    rootCauses.push("NO_UNIQUE_VERDICT");
    actions.add("ADD_UNIQUE_ANALYSIS");
  }
  if (missing.has("pricing") || (snap && pricingData === false && /review|best|pricing|comparison/.test(pageType))) {
    rootCauses.push("PRICING_MISSING");
    actions.add("ADD_PRICING");
  }
  if (snap && screenshots === false && /review|comparison|best/.test(pageType)) {
    rootCauses.push("NO_SCREENSHOTS");
    actions.add("ADD_SCREENSHOTS");
  }
  if (snap && !methodology) {
    rootCauses.push("NO_EDITORIAL_EVIDENCE");
    actions.add("ADD_EDITORIAL_EVIDENCE");
  }
  if (
    assessment &&
    (assessment.overallScore < 55 ||
      missing.size >= 3 ||
      (wordCountEstimate != null && wordCountEstimate < 400))
  ) {
    rootCauses.push("THIN_CONTENT");
    actions.add("IMPROVE_INTRO");
    actions.add("ADD_UNIQUE_ANALYSIS");
  }
  if (mostlyTemplated) {
    rootCauses.push("GENERIC_CONTENT");
    actions.add("ADD_UNIQUE_ANALYSIS");
    rootCauses.push("DUPLICATE_TEMPLATE_CONTENT");
  }
  if (
    snap?.freshness?.withinPolicy === false ||
    (snap?.freshness?.staleClaimFlags ?? 0) > 0
  ) {
    rootCauses.push("OUTDATED");
    actions.add("REFRESH_CONTENT");
  }
  if (inbound < 2) {
    rootCauses.push("LOW_INBOUND_LINKS");
    actions.add("ADD_INTERNAL_LINKS");
  }
  if ((outbound ?? 0) < 2) {
    rootCauses.push("WEAK_INTERNAL_LINKS");
    actions.add("ADD_INTERNAL_LINKS");
  }
  if (opts.cannibalization) {
    rootCauses.push("CANNIBALIZATION");
    actions.add("QUERY_CLUSTER_CONSOLIDATION");
  }
  if (opts.possibleIntentOverlap) {
    rootCauses.push("POSSIBLE_INTENT_OVERLAP");
    actions.add("MANUAL_REVIEW");
  }
  if (opts.impressions >= 30 && opts.ctr < 0.005 && opts.avgPosition <= 40) {
    rootCauses.push("POOR_CTR");
    actions.add("OPTIMIZE_TITLE");
    actions.add("OPTIMIZE_META");
    actions.add("IMPROVE_INTRO");
  }
  if (Boolean(snap?.structure?.bloatedIntro) || !snap?.structure?.hasQuickAnswer) {
    if (snap) {
      rootCauses.push("WEAK_ABOVE_THE_FOLD");
      actions.add("IMPROVE_INTRO");
    }
  }
  if (pageType.includes("comparison") && !featureTables) {
    actions.add("ADD_COMPARISON_DATA");
  }

  if (rootCauses.length === 0) {
    if (opts.avgPosition >= 8 && opts.avgPosition <= 35) {
      rootCauses.push("OTHER");
      actions.add("REFRESH_CONTENT");
    } else {
      actions.add("MANUAL_REVIEW");
    }
  }

  // Deep positions with meaningful impressions often need authority too.
  const backlinksLikelyHelp =
    opts.avgPosition > 20 && opts.impressions >= 80;
  if (backlinksLikelyHelp) actions.add("BUILD_LINKS");

  const recommendedActions = [...actions];
  const primaryAction = pickPrimaryAction(recommendedActions, rootCauses);

  const expectedDifficulty = difficultyFor(
    recommendedActions,
    assessment?.overallScore ?? null,
    opts.avgPosition,
  );
  const contentChangeMode = changeModeFor(recommendedActions, expectedDifficulty);

  const internalLinkRecommendations: string[] = [];
  if (inbound < 2) {
    internalLinkRecommendations.push(
      "Add contextual links from nearest category hub and related guides",
    );
  }
  if ((outbound ?? 0) < 2) {
    internalLinkRecommendations.push(
      "Add outbound links to Finder/tools, pricing, and 2–3 related reviews",
    );
  }
  if (path.startsWith("/software/")) {
    internalLinkRecommendations.push(
      "Ensure alternatives + comparison cluster pages link back with descriptive anchors",
    );
  }
  if (path.startsWith("/industries/") || path.startsWith("/best/")) {
    internalLinkRecommendations.push(
      "Link from /categories/ parent hub and complementary industry/best pages",
    );
  }

  let completenessSignals = 0;
  if (uniqueVerdict) completenessSignals += 1;
  if (pricingData) completenessSignals += 1;
  if (screenshots) completenessSignals += 1;
  if (prosCons) completenessSignals += 1;
  if (methodology) completenessSignals += 1;

  const productSlugs: string[] = [];
  const categorySlugs: string[] = [];
  if (entry?.type === "software") productSlugs.push(entry.slug);
  if (entry?.type === "category") categorySlugs.push(entry.slug);
  if (path.startsWith("/software/")) {
    const slug = path.split("/").filter(Boolean)[1];
    if (slug) productSlugs.push(slug);
  }
  if (path.startsWith("/categories/")) {
    const slug = path.split("/").filter(Boolean).pop();
    if (slug) categorySlugs.push(slug);
  }

  return {
    diagnostics,
    rootCauses: [...new Set(rootCauses)],
    recommendedActions,
    primaryAction,
    expectedDifficulty,
    contentChangeMode,
    internalLinkRecommendations,
    backlinksLikelyHelp,
    qualityScore: assessment?.overallScore ?? null,
    completenessSignals,
    productSlugs: [...new Set(productSlugs)],
    categorySlugs: [...new Set(categorySlugs)],
  };
}

function pickPrimaryAction(
  actions: GscActionType[],
  causes: GscRootCause[],
): GscActionType {
  const priority: GscActionType[] = [
    "QUERY_CLUSTER_CONSOLIDATION",
    "SEARCH_INTENT_MISMATCH",
    "OPTIMIZE_TITLE_FOR_QUERY",
    "REWRITE_H1_FOR_QUERY",
    "OPTIMIZE_TITLE",
    "OPTIMIZE_META",
    "IMPROVE_INTRO",
    "ADD_UNIQUE_ANALYSIS",
    "ADD_PRICING",
    "ADD_SCREENSHOTS",
    "ADD_COMPARISON_DATA",
    "ADD_EDITORIAL_EVIDENCE",
    "ADD_INTERNAL_LINKS",
    "REFRESH_CONTENT",
    "BUILD_LINKS",
    "MANUAL_REVIEW",
    "NO_ACTION",
  ];
  for (const a of priority) {
    if (actions.includes(a)) return a;
  }
  if (causes.includes("POOR_CTR")) return "OPTIMIZE_TITLE";
  return "MANUAL_REVIEW";
}

function difficultyFor(
  actions: GscActionType[],
  quality: number | null,
  position: number,
): GscDifficulty {
  const heavy = actions.filter((a) =>
    [
      "ADD_UNIQUE_ANALYSIS",
      "ADD_COMPARISON_DATA",
      "QUERY_CLUSTER_CONSOLIDATION",
      "SEARCH_INTENT_MISMATCH",
      "CONSOLIDATE",
      "FIX_INTENT_MATCH",
      "REFRESH_CONTENT",
    ].includes(a),
  );
  if (heavy.length >= 2 || (quality != null && quality < 40)) return "HIGH";
  if (heavy.length >= 1 || position > 50) return "MEDIUM";
  const light = actions.every((a) =>
    [
      "OPTIMIZE_TITLE",
      "OPTIMIZE_META",
      "IMPROVE_INTRO",
      "ADD_INTERNAL_LINKS",
      "ADD_SCREENSHOTS",
      "ADD_PRICING",
      "ADD_EDITORIAL_EVIDENCE",
    ].includes(a),
  );
  if (light) return "LOW";
  return "MEDIUM";
}

function changeModeFor(
  actions: GscActionType[],
  difficulty: GscDifficulty,
): GscContentChangeMode {
  if (actions.includes("NO_ACTION")) return "none";
  if (
    difficulty === "HIGH" ||
    actions.includes("ADD_UNIQUE_ANALYSIS") ||
    actions.includes("SEARCH_INTENT_MISMATCH") ||
    actions.includes("FIX_INTENT_MATCH") ||
    actions.includes("QUERY_CLUSTER_CONSOLIDATION") ||
    actions.includes("CONSOLIDATE")
  ) {
    return "rewrite";
  }
  return "adjust";
}
