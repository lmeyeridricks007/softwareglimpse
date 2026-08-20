import {
  UseCaseHubProfileSchema,
  type UseCaseHubProfile,
} from "@/domain";
import { useCaseDepthBySlug as crmUseCaseDepth } from "./deep";
import { businessCommunicationsUseCaseDepth } from "./business-communications-deep";
import { emailMarketingUseCaseDepth } from "./email-marketing-deep";
import { projectManagementUseCaseDepth } from "./project-management-deep";
import { hrUseCaseDepth } from "./hr-deep";
import { customerServiceUseCaseDepth } from "./customer-service-deep";
import { ecommerceUseCaseDepth } from "./ecommerce-deep";

type Depth = (typeof crmUseCaseDepth)[string];

const PACK_BY_CATEGORY: Record<string, Record<string, Depth>> = {
  crm: crmUseCaseDepth,
  "email-marketing": emailMarketingUseCaseDepth,
  "business-communications": businessCommunicationsUseCaseDepth,
  "project-management": projectManagementUseCaseDepth,
  hr: hrUseCaseDepth,
  ecommerce: ecommerceUseCaseDepth,
  "customer-service": customerServiceUseCaseDepth,
};

let mergedCache: Record<string, Depth> | null = null;

function allDepthBySlug(): Record<string, Depth> {
  if (mergedCache) return mergedCache;
  // CRM last so it wins on shared slugs.
  mergedCache = {
    ...emailMarketingUseCaseDepth,
    ...businessCommunicationsUseCaseDepth,
    ...projectManagementUseCaseDepth,
    ...hrUseCaseDepth,
    ...ecommerceUseCaseDepth,
    ...customerServiceUseCaseDepth,
    ...crmUseCaseDepth,
  };
  return mergedCache;
}

function depthFor(
  useCaseSlug: string,
  categoryHint?: string,
): Depth | undefined {
  if (categoryHint) {
    const pack = PACK_BY_CATEGORY[categoryHint];
    if (pack?.[useCaseSlug]) return pack[useCaseSlug];
  }
  return allDepthBySlug()[useCaseSlug];
}

function mergeDepth(
  base: UseCaseHubProfile,
  depth: Depth | undefined,
): UseCaseHubProfile {
  if (!depth) return base;
  return UseCaseHubProfileSchema.parse({
    ...base,
    ...depth,
    challenges: depth.challenges?.length ? depth.challenges : base.challenges,
    outcomes: depth.outcomes?.length ? depth.outcomes : base.outcomes,
    capabilityNeeds: depth.capabilityNeeds?.length
      ? depth.capabilityNeeds
      : base.capabilityNeeds,
    workflowSteps: depth.workflowSteps?.length
      ? depth.workflowSteps
      : base.workflowSteps,
    priorities: depth.priorities?.length ? depth.priorities : base.priorities,
    scenarios: depth.scenarios?.length ? depth.scenarios : base.scenarios,
    buyingFramework: depth.buyingFramework?.length
      ? depth.buyingFramework
      : base.buyingFramework,
    faq: depth.faq?.length ? depth.faq : base.faq,
    relatedUseCaseSlugs: depth.relatedUseCaseSlugs?.length
      ? depth.relatedUseCaseSlugs
      : base.relatedUseCaseSlugs,
    featuredGuideHrefs: depth.featuredGuideHrefs?.length
      ? depth.featuredGuideHrefs
      : base.featuredGuideHrefs,
  });
}

export function getUseCaseHubProfile(
  useCaseSlug: string,
  categoryHint?: string,
): UseCaseHubProfile | null {
  const depth = depthFor(useCaseSlug, categoryHint);
  if (!depth) return null;
  return mergeDepth(
    UseCaseHubProfileSchema.parse({ useCaseSlug }),
    depth,
  );
}

export function listUseCaseHubProfiles(): UseCaseHubProfile[] {
  return Object.keys(allDepthBySlug())
    .map((slug) => getUseCaseHubProfile(slug))
    .filter((p): p is UseCaseHubProfile => Boolean(p));
}

export function getUseCaseDepthBySlug(): Record<string, Depth> {
  return allDepthBySlug();
}
