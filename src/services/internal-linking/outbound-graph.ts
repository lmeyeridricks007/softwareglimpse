import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAudiences,
  getCapabilities,
  getCategories,
  getCategoryBySlug,
  getComparisons,
  getIndustries,
  getResources,
  getSoftware,
  getUseCases,
} from "@/data";
import { getRoutableTools } from "@/data/config/tools/registry";
import {
  getGuides,
} from "@/data/repositories/guides";
import { listFeatureDetailParams } from "@/data/feature-detail";
import { getFeatureDetailProfile } from "@/data/feature-detail";
import { listRequirementDetailParams } from "@/data/requirement-detail";
import { getRequirementDetailProfile } from "@/data/requirement-detail";
import { isEntityIndexable } from "@/domain/quality-gates";
import { indexabilityFromSeoFlag } from "@/seo/indexability";
import { normalizePath } from "@/seo/canonical";
import {
  buildCapabilityLinkPlan,
  buildFeatureLinkPlan,
  buildGuideLinkPlan,
  buildRequirementLinkPlan,
  buildResourceLinkPlan,
  buildSoftwareLinkPlan,
  buildUseCaseLinkPlan,
} from "./builders";
import { flattenPlanLinks } from "./select";
import type { ContextualLink, LinkEntityType, PageLinkPlan } from "./types";

export type OutboundEdge = {
  from: string;
  to: string;
  relationship: ContextualLink["relationship"];
  module: ContextualLink["module"];
  sourceType: LinkEntityType;
};

function categoryHubPath(category: {
  path: string[];
  seo?: { canonicalPath?: string };
}): string {
  return normalizePath(
    category.seo?.canonicalPath || `/categories/${category.path.join("/")}/`,
  );
}

/** Hub → child edges that provide parent inbound without per-page modules. */
function hubDiscoveryEdges(): OutboundEdge[] {
  const edges: OutboundEdge[] = [];
  const seen = new Set<string>();
  const push = (from: string, to: string, sourceType: LinkEntityType) => {
    const edge: OutboundEdge = {
      from: normalizePath(from),
      to: normalizePath(to),
      relationship: "child",
      module: "parentHub",
      sourceType,
    };
    const key = `${edge.from}→${edge.to}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push(edge);
  };

  push("/", "/categories/", "home");
  push("/", "/categories/crm/", "home");
  push("/", "/software/", "home");
  push("/", "/guides/", "home");
  push("/", "/compare/", "home");
  push("/", "/tools/", "home");
  push("/", "/for/", "home");
  push("/categories/crm/", "/use-cases/", "category");
  push("/categories/crm/", "/capabilities/", "category");
  push("/categories/crm/", "/features/", "category");
  push("/categories/crm/", "/requirements/", "category");
  push("/categories/crm/", "/resources/", "category");
  push("/categories/crm/", "/guides/", "category");

  for (const tool of getRoutableTools()) {
    if (!tool.href) continue;
    push("/tools/", tool.href, "hub");
    for (const catSlug of tool.categorySlugs) {
      const cat = getCategoryBySlug(catSlug);
      if (!cat || !isEntityIndexable({ kind: "category", entity: cat })) continue;
      push(categoryHubPath(cat), tool.href, "category");
    }
  }

  for (const child of getCategories()) {
    if (!isEntityIndexable({ kind: "category", entity: child })) continue;
    if (!child.parentSlug) {
      push("/categories/", categoryHubPath(child), "hub");
      continue;
    }
    const parent = getCategoryBySlug(child.parentSlug);
    if (!parent || !isEntityIndexable({ kind: "category", entity: parent })) {
      continue;
    }
    push(categoryHubPath(parent), categoryHubPath(child), "category");
  }

  for (const soft of getSoftware()) {
    if (!isEntityIndexable({ kind: "software", entity: soft })) continue;
    push("/software/", `/software/${soft.slug}/`, "hub");
    const primary = getCategoryBySlug(soft.primaryCategorySlug);
    if (primary && isEntityIndexable({ kind: "category", entity: primary })) {
      push(categoryHubPath(primary), `/software/${soft.slug}/`, "category");
    }
  }

  for (const comparison of getComparisons()) {
    if (!isEntityIndexable({ kind: "comparison", entity: comparison })) continue;
    push("/compare/", `/compare/${comparison.slug}/`, "hub");
  }

  for (const g of getGuides()) {
    if (!isEntityIndexable({ kind: "guide", entity: g })) continue;
    push("/guides/", `/guides/${g.slug}/`, "hub");
  }

  for (const uc of getUseCases()) {
    if (
      !indexabilityFromSeoFlag({
        seoIndexable: uc.seo.indexable === true,
        metadata: uc.metadata,
      }).indexable
    ) {
      continue;
    }
    push("/use-cases/", `/use-cases/${uc.slug}/`, "hub");
    push("/categories/crm/", `/use-cases/${uc.slug}/`, "category");
  }

  for (const cap of getCapabilities()) {
    if (
      !indexabilityFromSeoFlag({
        seoIndexable: cap.seo.indexable === true,
        metadata: cap.metadata,
      }).indexable
    ) {
      continue;
    }
    push("/capabilities/", `/capabilities/${cap.slug}/`, "hub");
  }

  for (const { slug } of listFeatureDetailParams()) {
    push("/features/", `/features/${slug}/`, "hub");
  }

  for (const { slug } of listRequirementDetailParams()) {
    push("/requirements/", `/requirements/${slug}/`, "hub");
  }

  for (const r of getResources()) {
    if (
      !indexabilityFromSeoFlag({
        seoIndexable: r.seo.indexable === true,
        metadata: r.metadata,
      }).indexable
    ) {
      continue;
    }
    push("/resources/", `/resources/${r.slug}/`, "hub");
  }

  for (const aud of getAudiences()) {
    if (
      !indexabilityFromSeoFlag({
        seoIndexable: aud.seo.indexable === true,
        metadata: aud.metadata,
      }).indexable
    ) {
      continue;
    }
    push("/for/", `/for/${aud.slug}/`, "hub");
    push("/categories/crm/", `/for/${aud.slug}/`, "category");
  }

  for (const industry of getIndustries()) {
    if (
      !indexabilityFromSeoFlag({
        seoIndexable: industry.seo.indexable === true,
        metadata: industry.metadata,
      }).indexable
    ) {
      continue;
    }
    push(
      "/industries/",
      industry.seo.canonicalPath || `/industries/${industry.slug}/`,
      "hub",
    );
  }

  for (const page of getAllBestPagesUnfiltered()) {
    if (!isEntityIndexable({ kind: "best", entity: page })) continue;
    const href = `/best/${page.slug}/`;
    push("/best/", href, "hub");
    if (page.categorySlug) {
      const cat = getCategoryBySlug(page.categorySlug);
      if (cat && isEntityIndexable({ kind: "category", entity: cat })) {
        push(categoryHubPath(cat), href, "category");
      }
    }
  }

  for (const page of getAllAlternativesUnfiltered()) {
    if (!isEntityIndexable({ kind: "alternatives", entity: page })) continue;
    push("/alternatives/", `/alternatives/${page.slug}/`, "hub");
  }

  return edges;
}

function edgesFromPlan(plan: PageLinkPlan): OutboundEdge[] {
  return flattenPlanLinks(plan).map((link) => ({
    from: plan.sourcePath,
    to: link.href,
    relationship: link.relationship,
    module: link.module,
    sourceType: plan.sourceType,
  }));
}

let cachedEdges: OutboundEdge[] | null = null;

/**
 * Collect contextual outbound edges from link plans + hub discovery
 * for the full catalogue (all indexable categories, not CRM-only).
 * Cached per process — safe for tests/report (data is static at build time).
 */
export function collectCrmOutboundEdges(options?: {
  refresh?: boolean;
}): OutboundEdge[] {
  if (cachedEdges && !options?.refresh) return cachedEdges;

  const edges: OutboundEdge[] = [...hubDiscoveryEdges()];

  for (const g of getGuides()) {
    if (g.metadata.status === "draft") continue;
    edges.push(...edgesFromPlan(buildGuideLinkPlan(g)));
  }

  for (const soft of getSoftware()) {
    if (!isEntityIndexable({ kind: "software", entity: soft })) continue;
    const plan = buildSoftwareLinkPlan(soft.slug);
    if (plan) edges.push(...edgesFromPlan(plan));
  }

  // Features / requirements — profile-light (avoid full page model builds)
  for (const { slug } of listFeatureDetailParams()) {
    const profile = getFeatureDetailProfile(slug);
    if (!profile) continue;
    edges.push(
      ...edgesFromPlan(
        buildFeatureLinkPlan({
          featureSlug: slug,
          featureName: profile.name,
          capabilityHref: profile.primaryCapabilitySlug
            ? `/capabilities/${profile.primaryCapabilitySlug}/`
            : null,
          capabilityName: profile.primaryCapabilityName ?? null,
          relatedFeatures: (profile.relatedFeatureSlugs ?? []).map((s) => ({
            slug: s,
            name: s.replace(/-/g, " "),
            href: `/features/${s}/`,
          })),
          relatedCapabilities: (profile.relatedCapabilitySlugs ?? []).map(
            (s) => ({
              slug: s,
              name: s.replace(/-/g, " "),
              href: `/capabilities/${s}/`,
            }),
          ),
          relatedRequirementSlugs: (profile.requirementMappings ?? [])
            .map((r) => r.requirementSlug)
            .filter((s): s is string => Boolean(s)),
          useCaseSlugs: (profile.useCaseRelevance ?? [])
            .map((u) => {
              const m = u.href?.match(/\/use-cases\/([^/]+)/);
              return m?.[1] ?? null;
            })
            .filter((s): s is string => Boolean(s)),
        }),
      ),
    );
  }

  for (const { slug } of listRequirementDetailParams()) {
    const profile = getRequirementDetailProfile(slug);
    if (!profile) continue;
    edges.push(
      ...edgesFromPlan(
        buildRequirementLinkPlan({
          requirementSlug: slug,
          requirementName: profile.name,
          capabilitySlugs: profile.primaryCapabilitySlug
            ? [profile.primaryCapabilitySlug]
            : [],
          featureSlugs: profile.featureLinks.map((f) => f.featureSlug),
          useCaseSlugs: profile.useCaseLinks
            .map((u) => {
              const m = u.href?.match(/\/use-cases\/([^/]+)/);
              return m?.[1] ?? null;
            })
            .filter((s): s is string => Boolean(s)),
        }),
      ),
    );
  }

  for (const uc of getUseCases()) {
    if (uc.seo.indexable !== true) continue;
    edges.push(
      ...edgesFromPlan(
        buildUseCaseLinkPlan({
          useCaseSlug: uc.slug,
          useCaseName: uc.name,
          productSlugs: getSoftware()
            .filter((s) => s.useCaseSlugs.includes(uc.slug))
            .slice(0, 6)
            .map((s) => s.slug),
        }),
      ),
    );
  }

  for (const cap of getCapabilities()) {
    if (cap.seo.indexable !== true) continue;
    edges.push(
      ...edgesFromPlan(
        buildCapabilityLinkPlan({
          capabilitySlug: cap.slug,
          capabilityName: cap.name,
        }),
      ),
    );
  }

  for (const r of getResources()) {
    if (r.seo.indexable !== true) continue;
    edges.push(
      ...edgesFromPlan(
        buildResourceLinkPlan({
          resourceSlug: r.slug,
          resourceName: r.name,
        }),
      ),
    );
  }

  cachedEdges = edges;
  return edges;
}

export function clearCrmOutboundEdgeCache(): void {
  cachedEdges = null;
}
