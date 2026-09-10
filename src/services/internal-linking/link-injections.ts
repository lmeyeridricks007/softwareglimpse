/**
 * Contextual link injections for improve-batch linking.
 * Kept free of builders imports to avoid catalogue ↔ guides cycles.
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { identityPath } from "@/seo/canonical";
import { dedupePlanByHref } from "./select";
import type { ContextualLink, LinkModuleId, PageLinkPlan } from "./types";

export const LINK_INJECTIONS_VERSION = "1.0.0";

export type LinkInjectionEdge = {
  fromPath: string;
  toPath: string;
  label: string;
  module: LinkModuleId;
  reason: string;
  batchId?: string;
  /** Allow IMPROVE/noindex targets when value is real. */
  requireIndexable?: boolean;
  score?: number;
};

export type LinkInjectionsFile = {
  version: string;
  updatedAt: string;
  edges: LinkInjectionEdge[];
};

let cache: LinkInjectionsFile | null = null;

function injectionsPath(): string {
  return (
    process.env.SG_LINK_INJECTIONS_PATH ||
    path.join(process.cwd(), "data/seo/link-injections.json")
  );
}

export function clearLinkInjectionsCache(): void {
  cache = null;
}

export function loadLinkInjections(): LinkInjectionsFile {
  if (cache) return cache;
  const filePath = injectionsPath();
  if (!existsSync(filePath)) {
    cache = {
      version: LINK_INJECTIONS_VERSION,
      updatedAt: new Date(0).toISOString(),
      edges: [],
    };
    return cache;
  }
  try {
    const raw = JSON.parse(
      readFileSync(filePath, "utf8"),
    ) as LinkInjectionsFile;
    cache = {
      version: raw.version ?? LINK_INJECTIONS_VERSION,
      updatedAt: raw.updatedAt ?? new Date(0).toISOString(),
      edges: Array.isArray(raw.edges) ? raw.edges : [],
    };
  } catch {
    cache = {
      version: LINK_INJECTIONS_VERSION,
      updatedAt: new Date(0).toISOString(),
      edges: [],
    };
  }
  return cache;
}

export function injectionsFromPath(fromPath: string): LinkInjectionEdge[] {
  const from = identityPath(fromPath);
  return loadLinkInjections().edges.filter(
    (e) => identityPath(e.fromPath) === from,
  );
}

export function injectionsToPath(toPath: string): LinkInjectionEdge[] {
  const to = identityPath(toPath);
  return loadLinkInjections().edges.filter(
    (e) => identityPath(e.toPath) === to,
  );
}

function edgeToLink(edge: LinkInjectionEdge): ContextualLink {
  return {
    href: identityPath(edge.toPath),
    label: edge.label,
    relationship: "related",
    module: edge.module,
    entityType: "guide",
    score: edge.score ?? 88,
    description: edge.reason,
  };
}

/**
 * Merge batch injections into a page link plan (related* modules only).
 * Dedupes by href within each module and across the whole plan.
 */
export function mergeLinkInjectionsIntoPlan(plan: PageLinkPlan): PageLinkPlan {
  const edges = injectionsFromPath(plan.sourcePath);
  if (edges.length === 0) return plan;

  const next: PageLinkPlan = { ...plan };
  const planHrefs = new Set(
    [
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
    ].map((l) => l.href),
  );

  const byModule = new Map<LinkModuleId, ContextualLink[]>();
  for (const edge of edges) {
    const list = byModule.get(edge.module) ?? [];
    list.push(edgeToLink(edge));
    byModule.set(edge.module, list);
  }

  for (const [module, links] of byModule) {
    // Journey modules are authored by builders — never inject duplicates there.
    if (module === "recommendedNextStep" || module === "tryDecisionTool") {
      continue;
    }
    const existing = ((next as Record<string, unknown>)[module] as
      | ContextualLink[]
      | undefined) ?? [];
    const seen = new Set(existing.map((l) => l.href));
    const merged = [...existing];
    for (const link of links) {
      if (
        seen.has(link.href) ||
        planHrefs.has(link.href) ||
        link.href === plan.sourcePath
      ) {
        continue;
      }
      seen.add(link.href);
      planHrefs.add(link.href);
      merged.push(link);
    }
    (next as Record<string, unknown>)[module] = merged;
  }
  return next;
}

/**
 * Apply injections then page-level dedupe — single finalize for builders + UI.
 * Set SG_SKIP_LINK_INJECTIONS=1 to inspect natural plans (prune / already-linked).
 */
export function finalizePageLinkPlan(plan: PageLinkPlan): PageLinkPlan {
  if (process.env.SG_SKIP_LINK_INJECTIONS === "1") {
    return dedupePlanByHref(plan);
  }
  return dedupePlanByHref(mergeLinkInjectionsIntoPlan(plan));
}
