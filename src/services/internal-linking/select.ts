import type { ContextualLink, GraphRelation, LinkEntityType, LinkModuleId } from "./types";
import { MODULE_LIMITS } from "./types";
import { resolveEligibleHref } from "./eligibility";

/** Soft authority lift without pulling Node fs into page link plans. */
const AUTHORITY_PATH_BOOST: Record<string, number> = {
  "/categories/crm/": 12,
  "/best/crm-software/": 14,
  "/guides/how-to-choose-crm/": 12,
  "/guides/what-is-crm/": 10,
  "/research/crm-pricing/": 11,
  "/tools/crm-finder/": 11,
  "/tools/crm-cost-calculator/": 10,
};

function authorityBoost(href: string): number {
  if (AUTHORITY_PATH_BOOST[href]) return AUTHORITY_PATH_BOOST[href];
  if (href.startsWith("/research/")) return 8;
  if (href.startsWith("/tools/")) return 8;
  if (href.startsWith("/best/")) return 6;
  if (href.startsWith("/compare/")) return 5;
  return 0;
}

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
  const base = input.score ?? 50;
  return {
    href,
    label,
    relationship: input.relationship,
    module: input.module,
    entityType: input.entityType,
    score: Math.min(100, base + authorityBoost(href)),
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

function uniqueByHref(links: ContextualLink[]): ContextualLink[] {
  const seen = new Set<string>();
  const out: ContextualLink[] = [];
  for (const link of links) {
    if (seen.has(link.href)) continue;
    seen.add(link.href);
    out.push(link);
  }
  return out;
}

/** Prefer the module that matches the destination type (avoids journey stealing product reviews). */
function preferredModuleForHref(href: string): LinkModuleId | null {
  if (href.startsWith("/software/") || href.startsWith("/alternatives/")) {
    return "relatedProducts";
  }
  if (href.startsWith("/compare/")) return "relatedComparisons";
  if (href.startsWith("/guides/")) return "relatedGuides";
  if (href.startsWith("/use-cases/")) return "relatedUseCases";
  if (href.startsWith("/industries/")) return "relatedIndustries";
  if (href.startsWith("/capabilities/")) return "relatedCapabilities";
  if (href.startsWith("/features/")) return "relatedFeatures";
  if (href.startsWith("/requirements/")) return "relatedRequirements";
  if (href.startsWith("/tools/")) return "tryDecisionTool";
  if (
    href.startsWith("/research/") ||
    href.startsWith("/resources/") ||
    href.startsWith("/best/") ||
    href.startsWith("/categories/")
  ) {
    return "relatedResources";
  }
  return null;
}

function pickWinningLink(href: string, links: ContextualLink[]): ContextualLink {
  const parent = links.find((l) => l.module === "parentHub");
  if (parent) return parent;

  // Core entity links stay in related* (comparison/product pages must keep reviews).
  if (
    href.startsWith("/software/") ||
    href.startsWith("/alternatives/") ||
    href.startsWith("/compare/")
  ) {
    const preferred = preferredModuleForHref(href);
    const match = preferred
      ? links.find((l) => l.module === preferred)
      : undefined;
    if (match) return match;
  }

  // Tools: prefer recommendedNextStep when present so kind-directed journeys
  // keep their primary CTA; drop the duplicate from tryDecisionTool.
  if (href.startsWith("/tools/")) {
    const nextTool = links.find((l) => l.module === "recommendedNextStep");
    if (nextTool) return nextTool;
    const tool = links.find((l) => l.module === "tryDecisionTool");
    if (tool) return tool;
  }
  const next = links.find((l) => l.module === "recommendedNextStep");
  if (next) return next;
  const toolMod = links.find((l) => l.module === "tryDecisionTool");
  if (toolMod) return toolMod;

  const preferred = preferredModuleForHref(href);
  if (preferred) {
    const match = links.find((l) => l.module === preferred);
    if (match) return match;
  }
  return [...links].sort(
    (a, b) => b.score - a.score || a.module.localeCompare(b.module),
  )[0]!;
}

/**
 * Page-level dedupe: one href per page. Destination-typed modules win
 * over journey when both claim the same URL (no repeated next-step + related).
 */
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
  const byHref = new Map<string, ContextualLink[]>();
  for (const link of flattenPlanLinks(plan)) {
    const list = byHref.get(link.href) ?? [];
    list.push(link);
    byHref.set(link.href, list);
  }

  const winner = new Map<string, ContextualLink>();
  for (const [href, links] of byHref) {
    // Pass every module occurrence — do not collapse by href first or
    // related* (earlier in flatten order) would hide recommendedNextStep.
    winner.set(href, pickWinningLink(href, links));
  }

  const keep = (links: ContextualLink[]) =>
    uniqueByHref(links).filter((l) => winner.get(l.href) === l);

  return {
    ...plan,
    parentHub: keep(uniqueByHref(plan.parentHub)),
    relatedGuides: keep(uniqueByHref(plan.relatedGuides)),
    relatedProducts: keep(uniqueByHref(plan.relatedProducts)),
    relatedComparisons: keep(uniqueByHref(plan.relatedComparisons)),
    relatedCapabilities: keep(uniqueByHref(plan.relatedCapabilities)),
    relatedRequirements: keep(uniqueByHref(plan.relatedRequirements)),
    relatedFeatures: keep(uniqueByHref(plan.relatedFeatures)),
    relatedUseCases: keep(uniqueByHref(plan.relatedUseCases)),
    relatedIndustries: keep(uniqueByHref(plan.relatedIndustries)),
    relatedResources: keep(uniqueByHref(plan.relatedResources)),
    recommendedNextStep: keep(uniqueByHref(plan.recommendedNextStep)),
    tryDecisionTool: keep(uniqueByHref(plan.tryDecisionTool)),
  };
}
