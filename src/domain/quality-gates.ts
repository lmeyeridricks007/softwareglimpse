import type {
  AlternativesPage,
  BestPage,
  Category,
  Comparison,
  ContentMetadata,
  GuidePage,
  Software,
} from "@/domain/schemas";
import { isPubliclyAvailable } from "@/domain/publishing";
import {
  getSitemapPublicationContext,
  isContentVisible,
  type PublicationContext,
} from "@/domain/publication-context";
import { softwareSeed } from "@/data/seed/software";
import {
  buildSoftwareLookup,
  type SoftLookup,
} from "@/services/seo/compare-index-worthiness/relationship";
import { isComparisonSearchIndexWorthy } from "@/services/seo/compare-index-worthiness/search-indexable";
import { isGuideSearchIndexWorthy } from "@/services/seo/guides-index-worthiness/search-indexable";
import { getLifecycleOverrideState } from "@/services/seo/content-lifecycle/store";
import { effectiveSeoIndexable } from "@/services/seo/content-lifecycle/promote";
import { loadCompareEnrichmentOverlay } from "@/services/seo/compare-enrichment/overlay-store";
import { mergeComparisonWithOverlay } from "@/services/seo/compare-enrichment/overlay-merge";
import {
  evaluateAlternativesQuality,
  evaluateBestQuality,
  evaluateCategoryQuality,
  evaluateComparisonQuality,
  evaluateGuideQuality,
  evaluateSoftwareQuality,
  type QualityResult,
} from "@/domain/quality-evaluators";

export type { QualityResult };
export {
  evaluateAlternativesQuality,
  evaluateBestQuality,
  evaluateCategoryQuality,
  evaluateComparisonQuality,
  evaluateGuideQuality,
  evaluateSoftwareQuality,
};

let softwareLookupCache: SoftLookup | null = null;

/**
 * Lightweight lookup from seed — avoids importing the catalog repository
 * (and its fs-backed research/editorial stores) into client bundles.
 */
function softwareLookup(): SoftLookup {
  if (!softwareLookupCache) {
    softwareLookupCache = buildSoftwareLookup(
      softwareSeed.map((s) => ({
        slug: s.slug,
        name: s.name ?? s.slug,
        primaryCategorySlug: s.primaryCategorySlug,
        secondaryCategorySlugs: s.secondaryCategorySlugs ?? [],
        useCaseSlugs: s.useCaseSlugs ?? [],
        businessSizeSlugs: s.businessSizeSlugs ?? [],
        teamTypeSlugs: s.teamTypeSlugs ?? [],
        featureRatings: s.featureRatings ?? [],
        integrationSlugs: s.integrationSlugs ?? [],
        pricing: s.pricing,
        bestFor: s.bestFor ?? [],
        notIdealFor: s.notIdealFor ?? [],
        aiCapabilities: s.aiCapabilities ?? [],
        scores: s.scores,
        competitorSlugs: s.competitorSlugs ?? [],
        alternativeSlugs: s.alternativeSlugs ?? [],
        comparableSlugs: s.comparableSlugs ?? [],
      })) as Software[],
    );
  }
  return softwareLookupCache;
}

/** Test helper — clear lookup cache between cases. */
export function resetComparisonIndexWorthinessCache(): void {
  softwareLookupCache = null;
}

export type IndexableEntity =
  | { kind: "software"; entity: Software }
  | { kind: "category"; entity: Category }
  | { kind: "comparison"; entity: Comparison }
  | { kind: "alternatives"; entity: AlternativesPage }
  | { kind: "best"; entity: BestPage }
  | { kind: "guide"; entity: GuidePage };

/**
 * Central indexability decision.
 * Explicit seo.indexable + publish gate + page-type quality gate.
 */
export function isEntityIndexable(
  input: IndexableEntity,
  now: Date = new Date(),
  context: PublicationContext = getSitemapPublicationContext(now),
): boolean {
  const { metadata, seo } = input.entity;

  if (input.kind === "guide" || input.kind === "comparison") {
    const lifecycle = getLifecycleOverrideState(input.kind, input.entity.slug);
    if (lifecycle === "RETIRED") return false;
  }

  const seedIndexable = seo.indexable === true;
  const indexable =
    input.kind === "guide"
      ? effectiveSeoIndexable("guide", input.entity.slug, seedIndexable)
      : input.kind === "comparison"
        ? effectiveSeoIndexable(
            "comparison",
            input.entity.slug,
            seedIndexable,
          )
        : seedIndexable;

  if (!indexable) return false;
  if (
    !isContentVisible(
      {
        status: metadata.status,
        publishedAt: metadata.publishedAt,
        scheduledAt: metadata.scheduledAt,
      },
      context,
      now,
    )
  ) {
    return false;
  }

  return passesQualityGate(input);
}

function comparisonForQuality(comparison: Comparison): Comparison {
  try {
    return mergeComparisonWithOverlay(
      comparison,
      loadCompareEnrichmentOverlay(comparison.slug),
    );
  } catch {
    return comparison;
  }
}

export function passesQualityGate(input: IndexableEntity): boolean {
  switch (input.kind) {
    case "software":
      return evaluateSoftwareQuality(input.entity).ok;
    case "category":
      return evaluateCategoryQuality(input.entity).ok;
    case "comparison": {
      const entity = comparisonForQuality(input.entity);
      return (
        evaluateComparisonQuality(entity).ok &&
        isComparisonSearchIndexWorthy(entity, softwareLookup())
      );
    }
    case "alternatives":
      return evaluateAlternativesQuality(input.entity).ok;
    case "best":
      return evaluateBestQuality(input.entity).ok;
    case "guide":
      return (
        evaluateGuideQuality(input.entity).ok &&
        isGuideSearchIndexWorthy(input.entity)
      );
    default:
      return false;
  }
}

/** Convenience for entities that only expose metadata + seo. */
export function isIndexableFromFields(
  seoIndexable: boolean,
  metadata: ContentMetadata,
  now?: Date,
): boolean {
  if (!seoIndexable) return false;
  return isPubliclyAvailable(
    {
      status: metadata.status,
      publishedAt: metadata.publishedAt,
      scheduledAt: metadata.scheduledAt,
    },
    now,
  );
}
