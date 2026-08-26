import type { ContentMetadata } from "@/domain/schemas";
import { isMergedFeatureSlug } from "@/data/config/hub-page-twins";
import { isPubliclyAvailable } from "@/domain/publishing";
import { isEntityIndexable, type IndexableEntity } from "@/domain/quality-gates";

/**
 * Central indexability decisions for SEO metadata + sitemap.
 * Prefer this over ad-hoc robots flags in page components.
 */

export type SeoPageType =
  | "home"
  | "hub"
  | "category"
  | "product"
  | "product-tab"
  | "comparison"
  | "best"
  | "alternatives"
  | "guide"
  | "industry"
  | "use-case"
  | "capability"
  | "requirement"
  | "feature"
  | "resource"
  | "audience"
  | "tool"
  | "pricing"
  | "company"
  | "legal"
  | "search"
  | "utility"
  | "redirect"
  | "internal";

export type IndexabilityDecision = {
  indexable: boolean;
  /** When true, emit nofollow (private / search / preview). Soft-publish stays follow. */
  nofollow: boolean;
  reason: string;
};

export function decisionIndexable(reason = "explicit-indexable"): IndexabilityDecision {
  return { indexable: true, nofollow: false, reason };
}

export function decisionNoindex(input?: {
  nofollow?: boolean;
  reason?: string;
}): IndexabilityDecision {
  return {
    indexable: false,
    nofollow: input?.nofollow ?? false,
    reason: input?.reason ?? "noindex",
  };
}

/** Entity kinds covered by domain quality gates. */
export function indexabilityForEntity(
  input: IndexableEntity,
  now: Date = new Date(),
): IndexabilityDecision {
  if (!isEntityIndexable(input, now)) {
    return decisionNoindex({ reason: `entity-gate:${input.kind}` });
  }
  return decisionIndexable(`entity-gate:${input.kind}`);
}

/** Soft flag on taxonomy entities (use case, capability, resource, audience, industry). */
export function indexabilityFromSeoFlag(input: {
  seoIndexable: boolean;
  metadata?: ContentMetadata;
  now?: Date;
  reason?: string;
}): IndexabilityDecision {
  if (!input.seoIndexable) {
    return decisionNoindex({ reason: input.reason ?? "seo.indexable-false" });
  }
  if (
    input.metadata &&
    !isPubliclyAvailable(
      {
        status: input.metadata.status,
        publishedAt: input.metadata.publishedAt,
        scheduledAt: input.metadata.scheduledAt,
      },
      input.now,
    )
  ) {
    return decisionNoindex({ reason: "not-publicly-available" });
  }
  return decisionIndexable(input.reason ?? "seo.indexable-true");
}

/** Product hub section tabs — UX routes; do not index as standalone documents. */
export function indexabilityForProductTab(productIndexable: boolean): IndexabilityDecision {
  if (!productIndexable) {
    return decisionNoindex({ reason: "product-not-indexable" });
  }
  return decisionNoindex({
    reason: "product-tab-section",
    nofollow: false,
  });
}

/** Search, newsletter, preview, personalized tool results. */
export function indexabilityForUtility(
  kind: "search" | "preview" | "personalized" | "private" | "dev",
): IndexabilityDecision {
  const nofollow = kind === "preview" || kind === "private" || kind === "dev";
  return decisionNoindex({ nofollow, reason: `utility:${kind}` });
}

/** Feature detail — requires substantive profile (not empty shell). Merged hub twins stay noindex. */
export function indexabilityForFeaturePage(input: {
  featureSlug?: string;
  hasModel: boolean;
  hasOverview: boolean;
  hasTagline: boolean;
}): IndexabilityDecision {
  if (input.featureSlug && isMergedFeatureSlug(input.featureSlug)) {
    return decisionNoindex({ reason: "hub-twin-merged-into-capability" });
  }
  if (!input.hasModel) {
    return decisionNoindex({ reason: "feature-missing" });
  }
  if (!input.hasOverview || !input.hasTagline) {
    return decisionNoindex({ reason: "feature-thin" });
  }
  return decisionIndexable("feature-substantive");
}

/** Requirement detail — pillar + overview + hero (existing editorial gate). */
export function indexabilityForRequirementPage(input: {
  isPillar: boolean;
  hasOverview: boolean;
  hasHero: boolean;
}): IndexabilityDecision {
  if (!input.isPillar || !input.hasOverview || !input.hasHero) {
    return decisionNoindex({ reason: "requirement-gate" });
  }
  return decisionIndexable("requirement-pillar");
}

/** Pricing product pages — fixture research stays noindex. */
export function indexabilityForPricingPage(input: {
  available: boolean;
  hasFixtureResearch: boolean;
}): IndexabilityDecision {
  if (!input.available) {
    return decisionNoindex({ reason: "pricing-unavailable" });
  }
  if (input.hasFixtureResearch) {
    return decisionNoindex({ reason: "pricing-fixture" });
  }
  return decisionIndexable("pricing-verified");
}
