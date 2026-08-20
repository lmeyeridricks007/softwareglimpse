import type { ContextualLink, GraphRelation, LinkEntityType, LinkModuleId } from "./types";
import { MODULE_LIMITS } from "./types";
import { resolveEligibleHref } from "./eligibility";

export function makeLink(input: {
  href: string;
  label: string;
  relationship: GraphRelation;
  module: LinkModuleId;
  entityType: LinkEntityType;
  score?: number;
  description?: string;
  requireIndexable?: boolean;
}): ContextualLink | null {
  const href = resolveEligibleHref(input.href, {
    requireIndexable: input.requireIndexable ?? true,
  });
  if (!href) return null;
  const label = input.label.trim();
  if (!label || /^(learn more|click here|read more)$/i.test(label)) {
    return null;
  }
  return {
    href,
    label,
    relationship: input.relationship,
    module: input.module,
    entityType: input.entityType,
    score: input.score ?? 50,
    description: input.description,
  };
}

/** Rank by score desc, dedupe href, enforce module max (default 3–6). */
export function selectLinks(
  links: Array<ContextualLink | null | undefined>,
  options: {
    module: LinkModuleId;
    excludeHrefs?: string[];
    limit?: number;
  },
): ContextualLink[] {
  const max = options.limit ?? MODULE_LIMITS[options.module].max;
  const exclude = new Set(
    (options.excludeHrefs ?? []).map((h) => resolveEligibleHref(h, { requireIndexable: false }) ?? h),
  );

  const seen = new Set<string>();
  const ranked = links
    .filter((l): l is ContextualLink => Boolean(l))
    .filter((l) => !exclude.has(l.href))
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));

  const out: ContextualLink[] = [];
  for (const link of ranked) {
    if (seen.has(link.href)) continue;
    seen.add(link.href);
    out.push(link);
    if (out.length >= max) break;
  }
  return out;
}

/** Flatten all modules for graph / orphan analysis. */
export function flattenPlanLinks(plan: {
  parentHub: ContextualLink[];
  relatedGuides: ContextualLink[];
  relatedProducts: ContextualLink[];
  relatedComparisons: ContextualLink[];
  relatedCapabilities: ContextualLink[];
  relatedRequirements: ContextualLink[];
  relatedFeatures: ContextualLink[];
  relatedUseCases: ContextualLink[];
  relatedIndustries: ContextualLink[];
  relatedResources: ContextualLink[];
  recommendedNextStep: ContextualLink[];
  tryDecisionTool: ContextualLink[];
}): ContextualLink[] {
  return [
    ...plan.parentHub,
    ...plan.relatedGuides,
    ...plan.relatedProducts,
    ...plan.relatedComparisons,
    ...plan.relatedCapabilities,
    ...plan.relatedRequirements,
    ...plan.relatedFeatures,
    ...plan.relatedUseCases,
    ...plan.relatedIndustries,
    ...plan.relatedResources,
    ...plan.recommendedNextStep,
    ...plan.tryDecisionTool,
  ];
}

/** Page-level dedupe: keep highest-score occurrence of each href. */
export function dedupePlanByHref<T extends {
  parentHub: ContextualLink[];
  relatedGuides: ContextualLink[];
  relatedProducts: ContextualLink[];
  relatedComparisons: ContextualLink[];
  relatedCapabilities: ContextualLink[];
  relatedRequirements: ContextualLink[];
  relatedFeatures: ContextualLink[];
  relatedUseCases: ContextualLink[];
  relatedIndustries: ContextualLink[];
  relatedResources: ContextualLink[];
  recommendedNextStep: ContextualLink[];
  tryDecisionTool: ContextualLink[];
}>(plan: T): T {
  const best = new Map<string, ContextualLink>();
  for (const link of flattenPlanLinks(plan)) {
    const prev = best.get(link.href);
    if (!prev || link.score > prev.score) best.set(link.href, link);
  }
  const keep = (links: ContextualLink[]) =>
    links.filter((l) => best.get(l.href) === l);

  return {
    ...plan,
    parentHub: keep(plan.parentHub),
    relatedGuides: keep(plan.relatedGuides),
    relatedProducts: keep(plan.relatedProducts),
    relatedComparisons: keep(plan.relatedComparisons),
    relatedCapabilities: keep(plan.relatedCapabilities),
    relatedRequirements: keep(plan.relatedRequirements),
    relatedFeatures: keep(plan.relatedFeatures),
    relatedUseCases: keep(plan.relatedUseCases),
    relatedIndustries: keep(plan.relatedIndustries),
    relatedResources: keep(plan.relatedResources),
    // Journey modules keep primary even if URL also appears in related*
    recommendedNextStep: plan.recommendedNextStep,
    tryDecisionTool: plan.tryDecisionTool,
  };
}
