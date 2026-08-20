import {
  getBestPages,
  getCategories,
  getComparisons,
  getIndustries,
  getResources,
  getSoftwareByCategory,
  getUseCases,
  getCapabilities,
} from "@/data";
import {
  getGuidesByCategory,
} from "@/data/repositories/guides";
import { loadReview } from "@/data/editorial/store";
import { listIndustryHubProfiles } from "@/data/industry-hub";
import { listUseCaseHubProfiles } from "@/data/use-case-hub";
import { listCapabilityHubProfiles } from "@/data/capability-hub";
import { listFeatureDetailProfiles } from "@/data/feature-detail";
import { listRequirementDetailProfiles } from "@/data/requirement-detail";
import { listResourceHubProfiles, getResourceHubProfile } from "@/data/resource-hub";
import type { ContentQualityPageType } from "@/domain/schemas/content-quality";
import type { PageQualitySnapshot } from "@/domain/schemas/content-quality";
import { snapshotFromGuide } from "./guides";
import { snapshotFromProductReview } from "./reviews";
import { snapshotFromComparison } from "./comparisons";
import { snapshotFromBestPage } from "./best";
import { snapshotFromHubProfile } from "./hubs";
import { snapshotFromFeature } from "./features";
import { snapshotFromRequirement } from "./requirements";
import { snapshotFromResource } from "./resources";
import { inferGuidePageType } from "./helpers";

export type AuditScopeFilter =
  | "all"
  | "crm"
  | "reviews"
  | "guides"
  | "comparisons"
  | "best"
  | "industry"
  | "use-case"
  | "capability"
  | "requirement"
  | "feature"
  | "resource"
  | "article"
  | "implementation-guide"
  | "product-guide";

export type InventoriesSnapshot = {
  snapshot: PageQualitySnapshot;
  slug: string;
};

function industryTitle(slug: string, displayTitle?: string): string {
  if (displayTitle) return displayTitle;
  const ind = getIndustries({ includeUnpublished: true }).find(
    (i) => i.slug === slug,
  );
  return ind ? `CRM for ${ind.name}` : `CRM for ${slug}`;
}

function useCaseTitle(slug: string, displayTitle?: string): string {
  if (displayTitle) return displayTitle;
  const uc = getUseCases().find((u) => u.slug === slug);
  return uc?.name ?? slug;
}

function capabilityTitle(slug: string, displayTitle?: string): string {
  if (displayTitle) return displayTitle;
  const cap = getCapabilities().find((c) => c.slug === slug);
  return cap?.name ?? slug;
}

/**
 * Categories included in reviews / guides / comparisons / best snapshots.
 * `crm` stays CRM-only. Every other scope uses live categories including
 * children (email-marketing under marketing, etc.) so subcategory hubs are scored.
 */
function auditCategorySlugs(scope: AuditScopeFilter): string[] {
  if (scope === "crm") return ["crm"];
  return getCategories({ includeUnpublished: true }).map((c) => c.slug);
}

/**
 * Load live editorial pages as quality snapshots.
 * Evaluation only — does not mutate content.
 */
export function loadAuditSnapshots(
  scope: AuditScopeFilter = "crm",
): InventoriesSnapshot[] {
  const out: InventoriesSnapshot[] = [];
  const categorySlugs = auditCategorySlugs(scope);
  const include = (pageType: ContentQualityPageType): boolean => {
    if (scope === "all") return true;
    if (scope === "crm") {
      return (
        pageType === "guide" ||
        pageType === "article" ||
        pageType === "implementation-guide" ||
        pageType === "product-guide" ||
        pageType === "product-review" ||
        pageType === "comparison" ||
        pageType === "best" ||
        pageType === "industry" ||
        pageType === "use-case" ||
        pageType === "resource"
      );
    }
    if (scope === "guides") {
      return (
        pageType === "guide" ||
        pageType === "article" ||
        pageType === "implementation-guide" ||
        pageType === "product-guide"
      );
    }
    if (scope === "reviews") return pageType === "product-review";
    if (scope === "comparisons") return pageType === "comparison";
    if (scope === "best") return pageType === "best";
    if (scope === "industry") return pageType === "industry";
    if (scope === "use-case") return pageType === "use-case";
    if (scope === "capability") return pageType === "capability";
    if (scope === "requirement") return pageType === "requirement";
    if (scope === "feature") return pageType === "feature";
    if (scope === "resource") return pageType === "resource";
    if (scope === "article") return pageType === "article";
    if (scope === "implementation-guide") {
      return pageType === "implementation-guide";
    }
    if (scope === "product-guide") return pageType === "product-guide";
    return true;
  };

  // Guides
  for (const categorySlug of categorySlugs) {
    for (const guide of getGuidesByCategory(categorySlug, {
      includeUnpublished: true,
    })) {
      const pageType = inferGuidePageType({
        topicType: guide.topicType,
        productSlugs: guide.productSlugs,
      });
      if (!include(pageType)) continue;
      const snapshot = snapshotFromGuide(guide);
      out.push({ snapshot, slug: guide.slug });
    }
  }

  // Reviews
  if (include("product-review")) {
    const seen = new Set<string>();
    for (const categorySlug of categorySlugs) {
      const software = getSoftwareByCategory(categorySlug, {
        includeUnpublished: true,
      }).filter((s) => s.primaryCategorySlug === categorySlug);
      for (const s of software) {
        if (seen.has(s.slug)) continue;
        seen.add(s.slug);
        const review = loadReview(s.slug);
        if (!review) continue;
        out.push({
          snapshot: snapshotFromProductReview(review),
          slug: s.slug,
        });
      }
    }
  }

  // Comparisons
  if (include("comparison")) {
    const comparisonCategories = new Set(categorySlugs);
    for (const c of getComparisons({ includeUnpublished: true }).filter((x) =>
      comparisonCategories.has(x.categorySlug),
    )) {
      out.push({ snapshot: snapshotFromComparison(c), slug: c.slug });
    }
  }

  // Best
  if (include("best")) {
    const bestCategories = new Set(categorySlugs);
    for (const b of getBestPages({ includeUnpublished: true }).filter((x) =>
      bestCategories.has(x.categorySlug ?? ""),
    )) {
      out.push({ snapshot: snapshotFromBestPage(b), slug: b.slug });
    }
  }

  // Industry
  if (include("industry")) {
    for (const profile of listIndustryHubProfiles()) {
      out.push({
        snapshot: snapshotFromHubProfile({
          pageType: "industry",
          slug: profile.industrySlug,
          title: industryTitle(profile.industrySlug, profile.displayTitle),
          route: `/industries/${profile.industrySlug}/`,
          contentId: `content:industry:${profile.industrySlug}`,
          profile,
          agentNote: "agent=IndustryQualityAgent",
        }),
        slug: profile.industrySlug,
      });
    }
  }

  // Use cases
  if (include("use-case")) {
    for (const profile of listUseCaseHubProfiles()) {
      const uc = getUseCases().find((u) => u.slug === profile.useCaseSlug);
      if (uc && !uc.categorySlugs?.includes("crm")) continue;
      out.push({
        snapshot: snapshotFromHubProfile({
          pageType: "use-case",
          slug: profile.useCaseSlug,
          title: useCaseTitle(profile.useCaseSlug, profile.displayTitle),
          route: `/use-cases/${profile.useCaseSlug}/`,
          contentId: `content:use-case:${profile.useCaseSlug}`,
          profile,
          agentNote: "agent=UseCaseQualityAgent",
        }),
        slug: profile.useCaseSlug,
      });
    }
  }

  // Capabilities
  if (include("capability")) {
    for (const profile of listCapabilityHubProfiles()) {
      out.push({
        snapshot: snapshotFromHubProfile({
          pageType: "capability",
          slug: profile.capabilitySlug,
          title: capabilityTitle(profile.capabilitySlug, profile.displayTitle),
          route: `/capabilities/${profile.capabilitySlug}/`,
          contentId: `content:capability:${profile.capabilitySlug}`,
          profile,
          agentNote: "agent=CapabilityQualityAgent",
        }),
        slug: profile.capabilitySlug,
      });
    }
  }

  // Features
  if (include("feature")) {
    for (const profile of listFeatureDetailProfiles()) {
      out.push({ snapshot: snapshotFromFeature(profile), slug: profile.slug });
    }
  }

  // Requirements
  if (include("requirement")) {
    for (const profile of listRequirementDetailProfiles()) {
      out.push({
        snapshot: snapshotFromRequirement(profile),
        slug: profile.slug,
      });
    }
  }

  // Resources
  if (include("resource")) {
    const profiles = new Map(
      listResourceHubProfiles().map((p) => [p.resourceSlug, p]),
    );
    for (const resource of getResources({ includeUnpublished: true }).filter(
      (r) => r.categorySlugs?.includes("crm"),
    )) {
      const profile =
        profiles.get(resource.slug) ?? getResourceHubProfile(resource.slug);
      out.push({
        snapshot: snapshotFromResource(resource, profile),
        slug: resource.slug,
      });
    }
  }

  return out;
}
