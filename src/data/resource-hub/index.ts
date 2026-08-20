import {
  ResourceHubProfileSchema,
  type ResourceHubProfile,
} from "@/domain";
import { resourceDepthPartA } from "./deep-part-a";
import { resourceDepthPartB } from "./deep-part-b";
import { resourceDepthPartC } from "./deep-part-c";
import { resourceDepthPartD } from "./deep-part-d";
import { crmUatTestScriptDepth } from "./crm-uat-test-script";

type Depth = Partial<Omit<ResourceHubProfile, "resourceSlug">>;

const resourceDepthBySlug: Record<string, Depth> = {
  ...resourceDepthPartA,
  ...resourceDepthPartB,
  ...resourceDepthPartC,
  ...resourceDepthPartD,
  "crm-uat-test-script": crmUatTestScriptDepth,
};

function mergeDepth(
  base: ResourceHubProfile,
  depth: Depth | undefined,
): ResourceHubProfile {
  if (!depth) return base;
  return ResourceHubProfileSchema.parse({
    ...base,
    ...depth,
    challenges: depth.challenges?.length ? depth.challenges : base.challenges,
    outcomes: depth.outcomes?.length ? depth.outcomes : base.outcomes,
    priorities: depth.priorities?.length ? depth.priorities : base.priorities,
    workflowSteps: depth.workflowSteps?.length
      ? depth.workflowSteps
      : base.workflowSteps,
    artifactSections: depth.artifactSections?.length
      ? depth.artifactSections
      : base.artifactSections,
    downloadFiles: depth.downloadFiles?.length
      ? depth.downloadFiles
      : base.downloadFiles,
    faq: depth.faq?.length ? depth.faq : base.faq,
    relatedResourceSlugs: depth.relatedResourceSlugs?.length
      ? depth.relatedResourceSlugs
      : base.relatedResourceSlugs,
    featuredGuideHrefs: depth.featuredGuideHrefs?.length
      ? depth.featuredGuideHrefs
      : base.featuredGuideHrefs,
    relatedToolHrefs: depth.relatedToolHrefs?.length
      ? depth.relatedToolHrefs
      : base.relatedToolHrefs,
    whatsInside: depth.whatsInside?.length ? depth.whatsInside : base.whatsInside,
    useBefore: depth.useBefore?.length ? depth.useBefore : base.useBefore,
    useWith: depth.useWith?.length ? depth.useWith : base.useWith,
    useNext: depth.useNext?.length ? depth.useNext : base.useNext,
    journeySlugs: depth.journeySlugs?.length
      ? depth.journeySlugs
      : base.journeySlugs,
  });
}

export function getResourceHubProfile(
  resourceSlug: string,
): ResourceHubProfile | null {
  const depth = resourceDepthBySlug[resourceSlug];
  if (!depth) return null;
  return mergeDepth(
    ResourceHubProfileSchema.parse({ resourceSlug }),
    depth,
  );
}

export function listResourceHubProfiles(): ResourceHubProfile[] {
  return Object.keys(resourceDepthBySlug)
    .map((slug) => getResourceHubProfile(slug))
    .filter((p): p is ResourceHubProfile => Boolean(p));
}

export function getResourceDepthBySlug(): Record<string, Depth> {
  return resourceDepthBySlug;
}
