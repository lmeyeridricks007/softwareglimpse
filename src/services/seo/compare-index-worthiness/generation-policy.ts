import type { Comparison } from "@/domain/schemas";
import {
  buildSoftwareLookup,
  hasIndexableRelationship,
  resolveComparisonRelationship,
} from "./relationship";
import { evaluateComparisonQuality } from "@/domain/quality-evaluators";
import { isThinComparisonMesh } from "@/services/comparison-research/distinctive-research";

/** Minimal product shape needed for relationship checks (seed inputs are partial). */
export type SoftProductRef = {
  slug: string;
  primaryCategorySlug?: string;
  competitorSlugs?: string[];
  alternativeSlugs?: string[];
  comparableSlugs?: string[];
};

/**
 * Future comparison generation must not silently create indexable Cartesian noise.
 *
 * A pair may still be materialized for onsite UX (`seo.indexable: false`).
 * It becomes an indexable search page only when this policy returns ok.
 */
export function mayCreateIndexableComparison(input: {
  productA: SoftProductRef | undefined;
  productB: SoftProductRef | undefined;
  /** Draft comparison fields used for quality checks when available. */
  draft?: Pick<
    Comparison,
    | "productSlugs"
    | "outcomes"
    | "verdict"
    | "editorialStatus"
    | "metadata"
    | "bestFor"
    | "scenarioRecommendations"
    | "pricingNotes"
    | "seo"
    | "slug"
    | "title"
    | "criterionSlugs"
  >;
}): { ok: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const { productA, productB, draft } = input;
  if (!productA || !productB) {
    return { ok: false, reasons: ["Both products must exist in the catalogue"] };
  }

  const soft = buildSoftwareLookup([
    {
      slug: productA.slug,
      name: productA.slug,
      primaryCategorySlug: productA.primaryCategorySlug,
      competitorSlugs: productA.competitorSlugs ?? [],
      alternativeSlugs: productA.alternativeSlugs ?? [],
      comparableSlugs: productA.comparableSlugs ?? [],
    } as never,
    {
      slug: productB.slug,
      name: productB.slug,
      primaryCategorySlug: productB.primaryCategorySlug,
      competitorSlugs: productB.competitorSlugs ?? [],
      alternativeSlugs: productB.alternativeSlugs ?? [],
      comparableSlugs: productB.comparableSlugs ?? [],
    } as never,
  ]);
  const fakeComparison = {
    productSlugs: [productA.slug, productB.slug],
    categorySlug: productA.primaryCategorySlug,
  } as Comparison;
  const rel = resolveComparisonRelationship(fakeComparison, soft);
  if (!hasIndexableRelationship(rel.kind)) {
    reasons.push(
      "Indexable comparisons require declared competitor, alternative, or comparable relationship — same-category Cartesian alone is insufficient",
    );
    return { ok: false, reasons };
  }

  if (draft) {
    const asComparison = draft as Comparison;
    const quality = evaluateComparisonQuality(asComparison);
    if (!quality.ok) {
      reasons.push(...quality.failures.map((f) => `quality:${f}`));
      return { ok: false, reasons };
    }
    if (isThinComparisonMesh(asComparison)) {
      reasons.push("thin-comparison-mesh");
      return { ok: false, reasons };
    }
  }

  reasons.push(
    "Declared competitive relationship — eligible for indexable generation",
  );
  return { ok: true, reasons };
}

/**
 * Whether an in-category pair should be expanded into a researched comparison
 * document at all (UX page). Prefer declared relationships; allow Cartesian
 * shells only when explicitly requested.
 */
export function mayMaterializeCategoryPair(input: {
  productA: SoftProductRef;
  productB: SoftProductRef;
  /** When false, only declared relationships materialize. Default false for indexable mesh. */
  allowCartesianUx?: boolean;
}): { materialize: boolean; indexableEligible: boolean; reasons: string[] } {
  const policy = mayCreateIndexableComparison({
    productA: input.productA,
    productB: input.productB,
  });
  if (policy.ok) {
    return {
      materialize: true,
      indexableEligible: true,
      reasons: policy.reasons,
    };
  }
  if (input.allowCartesianUx) {
    return {
      materialize: true,
      indexableEligible: false,
      reasons: [
        ...policy.reasons,
        "Materializing as onsite UX / builder pair with indexable=false",
      ],
    };
  }
  return {
    materialize: false,
    indexableEligible: false,
    reasons: policy.reasons,
  };
}
