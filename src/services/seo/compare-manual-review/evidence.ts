import type { Comparison, Software } from "@/domain/schemas";
import {
  analyzeProductComparability,
  resolveComparisonRelationship,
  type SoftLookup,
} from "@/services/seo/compare-index-worthiness/relationship";
import type {
  RelationshipEvidenceItem,
  RelationshipEvidencePack,
} from "./types";
import {
  familiesOverlap,
  jobFamiliesForUseCases,
} from "./job-families";

export type DemandSignals = {
  gscImpressions: number;
  gscClicks: number;
  gscPosition: number | null;
  gscHasDirectQuery: boolean;
  knownBacklinks: number;
  bestListCoOccurrence: boolean;
};

function item(
  flag: RelationshipEvidenceItem["flag"],
  present: boolean,
  detail: string,
  weight: number,
): RelationshipEvidenceItem {
  return { flag, present, detail, weight: present ? weight : 0 };
}

/**
 * Phase 1 — collect catalogue + demand evidence for a MANUAL_REVIEW pair.
 * Every classification must cite this pack; never invent competitor edges.
 */
export function buildRelationshipEvidence(
  comparison: Comparison,
  soft: SoftLookup,
  demand: DemandSignals,
): RelationshipEvidencePack {
  const [slugA, slugB] = comparison.productSlugs;
  const a = soft.get(slugA ?? "");
  const b = soft.get(slugB ?? "");
  const missingProduct = !a || !b || !slugA || !slugB;

  if (missingProduct) {
    return {
      slug: comparison.slug,
      productA: slugA ?? "",
      productB: slugB ?? "",
      categorySlug: comparison.categorySlug ?? null,
      primaryCategoryA: a?.primaryCategorySlug ?? null,
      primaryCategoryB: b?.primaryCategorySlug ?? null,
      sameCategory: false,
      items: [
        item(
          "missing_product",
          true,
          "One or both products missing from catalogue",
          0,
        ),
      ],
      evidenceScore: 0,
      relationshipKind: "missing_product",
      catalogueSignalIds: [],
      gscImpressions: demand.gscImpressions,
      gscClicks: demand.gscClicks,
      gscPosition: demand.gscPosition,
      gscHasDirectQuery: demand.gscHasDirectQuery,
      knownBacklinks: demand.knownBacklinks,
      bestListCoOccurrence: demand.bestListCoOccurrence,
      missingProduct: true,
      disjointUseCases: false,
      useCaseBreadthSkew: 0,
      useCasesA: [],
      useCasesB: [],
      relatedJobFamily: false,
      jobFamiliesA: [],
      jobFamiliesB: [],
    };
  }

  const relationship = resolveComparisonRelationship(comparison, soft);
  const analysis = analyzeProductComparability(a, b);
  const signalIds = new Set(analysis.signals.map((s) => s.id));

  const competitorsA = new Set(a.competitorSlugs ?? []);
  const competitorsB = new Set(b.competitorSlugs ?? []);
  const altA = new Set(a.alternativeSlugs ?? []);
  const altB = new Set(b.alternativeSlugs ?? []);
  const cmpA = new Set(a.comparableSlugs ?? []);
  const cmpB = new Set(b.comparableSlugs ?? []);

  const declaredCompetitor =
    competitorsA.has(slugB) || competitorsB.has(slugA);
  const declaredAlternative = altA.has(slugB) || altB.has(slugA);
  const declaredComparable = cmpA.has(slugB) || cmpB.has(slugA);

  const useCasesA = [...(a.useCaseSlugs ?? [])];
  const useCasesB = [...(b.useCaseSlugs ?? [])];
  const useSetA = new Set(useCasesA);
  const useSetB = new Set(useCasesB);
  const sharedUse = useCasesA.filter((u) => useSetB.has(u));
  const jobFamiliesA = jobFamiliesForUseCases(useCasesA);
  const jobFamiliesB = jobFamiliesForUseCases(useCasesB);
  const relatedJobFamily =
    familiesOverlap(jobFamiliesA, jobFamiliesB) ||
    // Same primary category with only one side documenting use cases — incomplete, not disjoint
    (analysis.sharedCategory &&
      ((useCasesA.length === 0) !== (useCasesB.length === 0)));
  const disjointUseCases =
    useCasesA.length > 0 &&
    useCasesB.length > 0 &&
    sharedUse.length === 0 &&
    !relatedJobFamily;
  const useCaseBreadthSkew =
    useCasesA.length > 0 && useCasesB.length > 0
      ? Math.abs(useCasesA.length - useCasesB.length)
      : 0;

  const items: RelationshipEvidenceItem[] = [
    item(
      "same_category",
      analysis.sharedCategory,
      analysis.sharedCategory
        ? `Shared primary category: ${a.primaryCategorySlug}`
        : `Categories differ: ${a.primaryCategorySlug} vs ${b.primaryCategorySlug}`,
      1,
    ),
    item(
      "secondary_category_overlap",
      signalIds.has("secondary_category_overlap"),
      analysis.signals.find((s) => s.id === "secondary_category_overlap")
        ?.detail ?? "No secondary-category overlap",
      1.5,
    ),
    item(
      "shared_use_cases",
      signalIds.has("overlapping_use_cases") || sharedUse.length > 0,
      sharedUse.length > 0
        ? `Shared use cases: ${sharedUse.slice(0, 4).join(", ")}`
        : analysis.signals.find((s) => s.id === "overlapping_use_cases")
            ?.detail ?? "No shared use cases",
      sharedUse.length > 0
        ? Math.min(3, 1 + sharedUse.length * 0.5)
        : (analysis.signals.find((s) => s.id === "overlapping_use_cases")
            ?.weight ?? 0),
    ),
    item(
      "disjoint_use_cases",
      disjointUseCases,
      disjointUseCases
        ? `Disjoint use cases — ${a.name}: ${useCasesA.slice(0, 3).join(", ") || "—"}; ${b.name}: ${useCasesB.slice(0, 3).join(", ") || "—"}`
        : "Use cases overlap, share a job family, or are incomplete",
      0,
    ),
    item(
      "related_job_family",
      relatedJobFamily && sharedUse.length === 0,
      relatedJobFamily && sharedUse.length === 0
        ? `Related job families: ${[...new Set([...jobFamiliesA, ...jobFamiliesB])].join(", ")}`
        : "No related job-family bridge (or exact use-case overlap already present)",
      relatedJobFamily && sharedUse.length === 0 ? 2 : 0,
    ),
    item(
      "use_case_breadth_skew",
      useCaseBreadthSkew >= 3,
      useCaseBreadthSkew >= 3
        ? `Use-case breadth skew: ${a.name}=${useCasesA.length}, ${b.name}=${useCasesB.length}`
        : "No material use-case breadth skew",
      useCaseBreadthSkew >= 3 ? 1.2 : 0,
    ),
    item(
      "shared_audience",
      signalIds.has("same_audience") || signalIds.has("shared_team_type"),
      analysis.signals.find(
        (s) => s.id === "same_audience" || s.id === "shared_team_type",
      )?.detail ?? "No shared audience / team type",
      1.2,
    ),
    item(
      "overlapping_capabilities",
      signalIds.has("shared_capabilities"),
      analysis.signals.find((s) => s.id === "shared_capabilities")?.detail ??
        "Insufficient overlapping feature ratings",
      analysis.signals.find((s) => s.id === "shared_capabilities")?.weight ?? 0,
    ),
    item(
      "pricing_tier",
      signalIds.has("similar_pricing_tier"),
      analysis.signals.find((s) => s.id === "similar_pricing_tier")?.detail ??
        "Pricing tiers not comparable or missing",
      1.2,
    ),
    item(
      "integration_overlap",
      signalIds.has("shared_integrations"),
      analysis.signals.find((s) => s.id === "shared_integrations")?.detail ??
        "Fewer than 2 shared integrations",
      analysis.signals.find((s) => s.id === "shared_integrations")?.weight ?? 0,
    ),
    item(
      "declared_competitor",
      declaredCompetitor,
      declaredCompetitor
        ? "Declared competitorSlugs relationship"
        : "No declared competitorSlugs edge",
      5,
    ),
    item(
      "declared_alternative",
      declaredAlternative,
      declaredAlternative
        ? "Declared alternativeSlugs relationship"
        : "No declared alternativeSlugs edge",
      4.5,
    ),
    item(
      "declared_comparable",
      declaredComparable,
      declaredComparable
        ? "Declared comparableSlugs relationship"
        : "No declared comparableSlugs edge",
      4,
    ),
    item(
      "best_list_cooccurrence",
      demand.bestListCoOccurrence,
      demand.bestListCoOccurrence
        ? "Products co-appear on a best-of recommendations list"
        : "No best-list co-occurrence",
      2,
    ),
    item(
      "gsc_demand",
      demand.gscImpressions > 0 || demand.gscClicks > 0,
      demand.gscImpressions > 0 || demand.gscClicks > 0
        ? `GSC impressions=${demand.gscImpressions}, clicks=${demand.gscClicks}, position=${demand.gscPosition ?? "n/a"}`
        : "No recorded GSC impressions/clicks for this URL",
      demand.gscImpressions >= 50 ? 2.5 : demand.gscImpressions > 0 ? 1.5 : 0,
    ),
    item(
      "gsc_direct_query",
      demand.gscHasDirectQuery,
      demand.gscHasDirectQuery
        ? "Direct page×query GSC evidence (vs / compare intent)"
        : "No direct GSC query mapping",
      2,
    ),
    item(
      "known_backlinks",
      demand.knownBacklinks > 0,
      demand.knownBacklinks > 0
        ? `Known backlinks: ${demand.knownBacklinks}`
        : "No known backlinks on file",
      demand.knownBacklinks > 0 ? 1.5 : 0,
    ),
  ];

  const evidenceScore = Number(
    items.reduce((sum, i) => sum + i.weight, 0).toFixed(2),
  );

  return {
    slug: comparison.slug,
    productA: slugA,
    productB: slugB,
    categorySlug: comparison.categorySlug ?? null,
    primaryCategoryA: a.primaryCategorySlug,
    primaryCategoryB: b.primaryCategorySlug,
    sameCategory: analysis.sharedCategory,
    items,
    evidenceScore,
    relationshipKind: relationship.kind,
    catalogueSignalIds: analysis.signals.map((s) => s.id),
    gscImpressions: demand.gscImpressions,
    gscClicks: demand.gscClicks,
    gscPosition: demand.gscPosition,
    gscHasDirectQuery: demand.gscHasDirectQuery,
    knownBacklinks: demand.knownBacklinks,
    bestListCoOccurrence: demand.bestListCoOccurrence,
    missingProduct: false,
    disjointUseCases,
    useCaseBreadthSkew,
    useCasesA,
    useCasesB,
    relatedJobFamily,
    jobFamiliesA,
    jobFamiliesB,
  };
}

export function presentFlags(pack: RelationshipEvidencePack): Set<string> {
  return new Set(pack.items.filter((i) => i.present).map((i) => i.flag));
}

/** CRM ↔ sales-intelligence pairs are a known cross-category buyer decision. */
export function isCrmVsSalesIntelligence(a: Software, b: Software): boolean {
  const cats = new Set([a.primaryCategorySlug, b.primaryCategorySlug]);
  return cats.has("crm") && cats.has("sales-intelligence");
}
