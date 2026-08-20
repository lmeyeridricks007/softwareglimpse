import {
  CapabilityHubProfileSchema,
  type CapabilityHubProfile,
} from "@/domain";
import { capabilityDepthBySlug as crmCapabilityDepth } from "./deep";
import { businessCommunicationsCapabilityDepth } from "./business-communications-deep";
import { emailMarketingCapabilityDepth } from "./email-marketing-deep";
import { projectManagementCapabilityDepth } from "./project-management-deep";
import { hrCapabilityDepth } from "./hr-deep";
import { ecommerceCapabilityDepth } from "./ecommerce-deep";
import { customerServiceCapabilityDepth } from "./customer-service-deep";

type Depth = (typeof crmCapabilityDepth)[string];

const PACK_BY_CATEGORY: Record<string, Record<string, Depth>> = {
  crm: crmCapabilityDepth,
  "email-marketing": emailMarketingCapabilityDepth,
  "business-communications": businessCommunicationsCapabilityDepth,
  "project-management": projectManagementCapabilityDepth,
  hr: hrCapabilityDepth,
  ecommerce: ecommerceCapabilityDepth,
  "customer-service": customerServiceCapabilityDepth,
};

let mergedCache: Record<string, Depth> | null = null;

function allDepthBySlug(): Record<string, Depth> {
  if (mergedCache) return mergedCache;
  mergedCache = {
    ...emailMarketingCapabilityDepth,
    ...businessCommunicationsCapabilityDepth,
    ...projectManagementCapabilityDepth,
    ...hrCapabilityDepth,
    ...ecommerceCapabilityDepth,
    ...customerServiceCapabilityDepth,
    ...crmCapabilityDepth,
  };
  return mergedCache;
}

function depthFor(
  capabilitySlug: string,
  categoryHint?: string,
): Depth | undefined {
  if (categoryHint) {
    const pack = PACK_BY_CATEGORY[categoryHint];
    if (pack?.[capabilitySlug]) return pack[capabilitySlug];
  }
  return allDepthBySlug()[capabilitySlug];
}

function coercePriorities(raw: unknown): CapabilityHubProfile["priorities"] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item, i) => {
    if (typeof item === "string") {
      return {
        id: `p-${i + 1}`,
        title: item,
        description: `${item} as a buying lens for this capability.`,
      };
    }
    const row = (item ?? {}) as Record<string, unknown>;
    const title = String(row.title ?? `Priority ${i + 1}`);
    return {
      id: String(row.id ?? `p-${i + 1}`),
      title,
      description: String(row.description ?? title),
      ...(typeof row.icon === "string" ? { icon: row.icon } : {}),
      ...(typeof row.href === "string" ? { href: row.href } : {}),
    };
  });
}

function coerceScenarios(raw: unknown): CapabilityHubProfile["scenarios"] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item, i) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const title = String(row.title ?? `Scenario ${i + 1}`);
    return {
      id: String(row.id ?? `s-${i + 1}`),
      title,
      bestWhen: String(
        row.bestWhen ?? row.description ?? "When this job is the weekly ritual.",
      ),
      ...(typeof row.icon === "string" ? { icon: row.icon } : {}),
      ...(typeof row.href === "string" ? { href: row.href } : {}),
    };
  });
}

function mergeDepth(
  base: CapabilityHubProfile,
  depth: Depth | undefined,
): CapabilityHubProfile {
  if (!depth) return base;
  const priorities = coercePriorities(
    depth.priorities?.length ? depth.priorities : base.priorities,
  );
  const scenarios = coerceScenarios(
    depth.scenarios?.length ? depth.scenarios : base.scenarios,
  );
  return CapabilityHubProfileSchema.parse({
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
    priorities,
    scenarios,
    buyingFramework: depth.buyingFramework?.length
      ? depth.buyingFramework
      : base.buyingFramework,
    faq: depth.faq?.length ? depth.faq : base.faq,
    relatedCapabilitySlugs: depth.relatedCapabilitySlugs?.length
      ? depth.relatedCapabilitySlugs
      : base.relatedCapabilitySlugs,
    relatedUseCaseSlugs: depth.relatedUseCaseSlugs?.length
      ? depth.relatedUseCaseSlugs
      : base.relatedUseCaseSlugs,
    relatedRequirementSlugs: depth.relatedRequirementSlugs?.length
      ? depth.relatedRequirementSlugs
      : base.relatedRequirementSlugs,
    relatedFeatureSlugs: depth.relatedFeatureSlugs?.length
      ? depth.relatedFeatureSlugs
      : base.relatedFeatureSlugs,
    featuredGuideHrefs: depth.featuredGuideHrefs?.length
      ? depth.featuredGuideHrefs
      : base.featuredGuideHrefs,
  });
}

export function getCapabilityHubProfile(
  capabilitySlug: string,
  categoryHint?: string,
): CapabilityHubProfile | null {
  const depth = depthFor(capabilitySlug, categoryHint);
  if (!depth) return null;
  return mergeDepth(
    CapabilityHubProfileSchema.parse({ capabilitySlug }),
    depth,
  );
}

export function listCapabilityHubProfiles(): CapabilityHubProfile[] {
  return Object.keys(allDepthBySlug())
    .map((slug) => getCapabilityHubProfile(slug))
    .filter((p): p is CapabilityHubProfile => Boolean(p));
}

export function getCapabilityDepthBySlug(): Record<string, Depth> {
  return allDepthBySlug();
}
