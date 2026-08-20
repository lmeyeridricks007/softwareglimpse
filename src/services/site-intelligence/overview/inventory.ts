import {
  getAllBestPagesUnfiltered,
  getCapabilities,
  getComparisons,
  getIndustries,
  getResources,
  getSoftware,
  getUseCases,
} from "@/data";
import {
  getGuides,
} from "@/data/repositories/guides";
import { TOOLS_REGISTRY } from "@/data/config/tools/registry";
import { listFeatureDetailParams } from "@/data/feature-detail";
import { listRequirementDetailParams } from "@/data/requirement-detail";
import { getSitemapEntries } from "@/seo/sitemap";

export type SiteInventory = {
  sitemapUrls: number;
  publishedSoftware: number;
  indexableSoftware: number;
  comparisons: number;
  indexableComparisons: number;
  guidesPublished: number;
  guidesIndexable: number;
  industries: number;
  industriesIndexable: number;
  useCases: number;
  useCasesIndexable: number;
  capabilities: number;
  capabilitiesIndexable: number;
  requirements: number;
  features: number;
  bestPages: number;
  bestIndexable: number;
  resources: number;
  resourcesIndexable: number;
  toolsAvailable: number;
  toolsPartial: number;
  toolsComingSoon: number;
  pageTypeCounts: Record<string, number>;
  clusters: string[];
  notes: string[];
};

/** Lightweight indexability signal — avoids expensive quality-gate evaluation. */
function isPublishedIndexable(entity: {
  metadata: { status: string };
  seo?: { indexable?: boolean };
}): boolean {
  return (
    entity.metadata.status === "published" && entity.seo?.indexable === true
  );
}

/**
 * Live inventory from data layer + sitemap — read-only.
 */
export function buildSiteInventory(): SiteInventory {
  const sitemap = getSitemapEntries();
  const software = getSoftware({ includeUnpublished: true });
  const publishedSoftware = software.filter(
    (s) => s.metadata.status === "published",
  );
  const indexableSoftware = publishedSoftware.filter(isPublishedIndexable);

  const comparisons = getComparisons({ includeUnpublished: true });
  const compsPublished = comparisons.filter(
    (c) => c.metadata.status === "published",
  );
  const compsIndexable = compsPublished.filter(isPublishedIndexable);

  const guides = getGuides({ includeUnpublished: true });
  const guidesPublished = guides.filter(
    (g) => g.metadata.status === "published",
  );
  const guidesIndexable = guidesPublished.filter(isPublishedIndexable);

  const industries = getIndustries({ includeUnpublished: true });
  const indIndexable = industries.filter(isPublishedIndexable);

  const useCases = getUseCases();
  const ucIndexable = useCases.filter(isPublishedIndexable);

  const capabilities = getCapabilities();
  const capIndexable = capabilities.filter(isPublishedIndexable);

  const best = getAllBestPagesUnfiltered();
  const bestPublished = best.filter((b) => b.metadata.status === "published");
  const bestIndexable = bestPublished.filter(isPublishedIndexable);

  const resources = getResources({ includeUnpublished: true });
  const resPublished = resources.filter(
    (r) => r.metadata.status === "published",
  );
  const resIndexable = resPublished.filter(isPublishedIndexable);

  const toolsAvailable = TOOLS_REGISTRY.filter(
    (t) => t.status === "available",
  ).length;
  const toolsPartial = TOOLS_REGISTRY.filter((t) => t.status === "partial")
    .length;
  const toolsComingSoon = TOOLS_REGISTRY.filter(
    (t) => t.status === "coming-soon",
  ).length;

  const pageTypeCounts: Record<string, number> = {
    homepage: 1,
    software: publishedSoftware.length,
    comparison: compsPublished.length,
    guide: guidesPublished.length,
    industry: industries.length,
    "use-case": useCases.length,
    capability: capabilities.length,
    requirement: listRequirementDetailParams().length,
    feature: listFeatureDetailParams().length,
    best: bestPublished.length,
    resource: resPublished.length,
    tool: toolsAvailable + toolsPartial,
  };

  const notes: string[] = [];
  if (guidesIndexable.length === 0 && guidesPublished.length > 0) {
    notes.push(
      `${guidesPublished.length} published guides but 0 indexable (seo.indexable gate)`,
    );
  }
  if (bestIndexable.length === 0 && bestPublished.length > 0) {
    notes.push(
      `${bestPublished.length} published best page(s) but 0 indexable`,
    );
  }
  if (indIndexable.length === 0 && industries.length > 0) {
    notes.push(
      `${industries.length} industry hubs seeded; 0 currently indexable`,
    );
  }

  return {
    sitemapUrls: sitemap.length,
    publishedSoftware: publishedSoftware.length,
    indexableSoftware: indexableSoftware.length,
    comparisons: compsPublished.length,
    indexableComparisons: compsIndexable.length,
    guidesPublished: guidesPublished.length,
    guidesIndexable: guidesIndexable.length,
    industries: industries.length,
    industriesIndexable: indIndexable.length,
    useCases: useCases.length,
    useCasesIndexable: ucIndexable.length,
    capabilities: capabilities.length,
    capabilitiesIndexable: capIndexable.length,
    requirements: listRequirementDetailParams().length,
    features: listFeatureDetailParams().length,
    bestPages: bestPublished.length,
    bestIndexable: bestIndexable.length,
    resources: resPublished.length,
    resourcesIndexable: resIndexable.length,
    toolsAvailable,
    toolsPartial,
    toolsComingSoon,
    pageTypeCounts,
    clusters: [
      "CRM Learn",
      "CRM Choose",
      "CRM Products",
      "CRM Compare",
      "CRM Industries",
      "CRM Use Cases",
      "CRM Capabilities",
      "CRM Requirements",
      "CRM Features",
      "CRM Tools",
      "CRM Resources",
      "CRM Implementation / Migration",
    ],
    notes,
  };
}
