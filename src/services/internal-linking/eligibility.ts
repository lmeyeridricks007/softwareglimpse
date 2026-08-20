import { TOOLS_REGISTRY } from "@/data/config/tools/registry";
import {
  getAllAlternativesUnfiltered,
  getAllBestPagesUnfiltered,
  getAllComparisonsUnfiltered,
  getAudiences,
  getCapabilities,
  getCategories,
  getIndustries,
  getResources,
  getSoftware,
  getUseCases,
} from "@/data";
import {
  getGuides,
} from "@/data/repositories/guides";
import { listFeatureDetailParams, getFeatureDetailProfile } from "@/data/feature-detail";
import {
  CRM_REQUIREMENT_PILLAR_SLUGS,
  listRequirementDetailParams,
  getRequirementDetailProfile,
} from "@/data/requirement-detail";
import { isEntityIndexable } from "@/domain/quality-gates";
import { COMPANY_ROUTES, LEGAL_ROUTES } from "@/services/site-foundation";
import { normalizePath, resolveCanonicalPath } from "@/seo/canonical";
import {
  indexabilityForFeaturePage,
  indexabilityForRequirementPage,
  indexabilityFromSeoFlag,
} from "@/seo/indexability";

/**
 * Eligibility for primary related-content modules:
 * publishable + indexable + canonical path (not draft / noindex / /go / alias).
 */

const BLOCKED_PREFIXES = ["/go/", "/api/", "/dev/", "/search/", "/newsletter/"];

export function isBlockedUtilityPath(path: string): boolean {
  const p = normalizePath(path);
  return BLOCKED_PREFIXES.some((prefix) => p === prefix || p.startsWith(prefix));
}

/** Resolve to canonical pathname; null if unusable as an internal content link. */
export function resolveEligibleHref(
  rawPath: string,
  options: { requireIndexable?: boolean; now?: Date } = {},
): string | null {
  const requireIndexable = options.requireIndexable ?? true;
  const now = options.now ?? new Date();

  let path: string;
  try {
    path = resolveCanonicalPath(rawPath);
  } catch {
    return null;
  }

  if (isBlockedUtilityPath(path)) return null;

  // Strip query for eligibility of the document; tools may keep query at render
  // but modules should link to clean canonical tool landings.
  if (path.includes("?")) {
    path = normalizePath(path.split("?")[0] ?? path);
  }

  if (!requireIndexable) {
    return path;
  }

  if (!isPathIndexable(path, now)) return null;
  return path;
}

export function isPathIndexable(path: string, now: Date = new Date()): boolean {
  const p = normalizePath(path);
  const cacheKey = `${p}|${now.toISOString().slice(0, 10)}`;
  const cached = indexableCache.get(cacheKey);
  if (cached !== undefined) return cached;
  const result = computePathIndexable(p, now);
  indexableCache.set(cacheKey, result);
  return result;
}

const indexableCache = new Map<string, boolean>();

function computePathIndexable(p: string, now: Date): boolean {
  if (p === "/") return true;

  const staticIndexable = new Set([
    "/software/",
    "/categories/",
    "/tools/",
    "/pricing/",
    "/compare/",
    "/guides/",
    "/use-cases/",
    "/capabilities/",
    "/requirements/",
    "/features/",
    "/resources/",
    "/for/",
  ]);
  if (staticIndexable.has(p)) return true;

  for (const route of Object.values(COMPANY_ROUTES)) {
    if (normalizePath(route) === p) return true;
  }
  for (const route of Object.values(LEGAL_ROUTES)) {
    if (normalizePath(route) === p) return true;
  }

  for (const tool of TOOLS_REGISTRY) {
    if (tool.status !== "available" || !tool.href) continue;
    if (
      tool.slug === "software-finder" ||
      tool.slug === "software-stack-builder"
    ) {
      continue;
    }
    if (normalizePath(tool.href) === p) return true;
  }

  const catMatch = p.match(/^\/categories\/(.+)\/$/);
  if (catMatch?.[1]) {
    const pathParts = catMatch[1].split("/");
    const cat = getCategories().find(
      (c) => c.path.join("/") === pathParts.join("/"),
    );
    return Boolean(
      cat && isEntityIndexable({ kind: "category", entity: cat }, now),
    );
  }

  const softMatch = p.match(/^\/software\/([^/]+)\/$/);
  if (softMatch?.[1]) {
    const soft = getSoftware().find((s) => s.slug === softMatch[1]);
    return Boolean(
      soft && isEntityIndexable({ kind: "software", entity: soft }, now),
    );
  }

  // Product tabs are UX-only — never primary link targets
  if (/^\/software\/[^/]+\/[^/]+\/$/.test(p)) return false;

  const compareMatch = p.match(/^\/compare\/([^/]+)\/$/);
  if (compareMatch?.[1]) {
    const c = getAllComparisonsUnfiltered().find(
      (x) => x.slug === compareMatch[1],
    );
    return Boolean(
      c && isEntityIndexable({ kind: "comparison", entity: c }, now),
    );
  }

  const altMatch = p.match(/^\/alternatives\/([^/]+)\/$/);
  if (altMatch?.[1]) {
    const a = getAllAlternativesUnfiltered().find(
      (x) => x.slug === altMatch[1],
    );
    return Boolean(
      a && isEntityIndexable({ kind: "alternatives", entity: a }, now),
    );
  }

  const bestMatch = p.match(/^\/best\/([^/]+)\/$/);
  if (bestMatch?.[1]) {
    const b = getAllBestPagesUnfiltered().find((x) => x.slug === bestMatch[1]);
    return Boolean(b && isEntityIndexable({ kind: "best", entity: b }, now));
  }

  const guideMatch = p.match(/^\/guides\/([^/]+)\/$/);
  if (guideMatch?.[1]) {
    const g = getGuides().find((x) => x.slug === guideMatch[1]);
    return Boolean(g && isEntityIndexable({ kind: "guide", entity: g }, now));
  }

  const ucMatch = p.match(/^\/use-cases\/([^/]+)\/$/);
  if (ucMatch?.[1]) {
    const uc = getUseCases().find((x) => x.slug === ucMatch[1]);
    if (!uc) return false;
    return indexabilityFromSeoFlag({
      seoIndexable: uc.seo.indexable === true,
      metadata: uc.metadata,
      now,
    }).indexable;
  }

  const capMatch = p.match(/^\/capabilities\/([^/]+)\/$/);
  if (capMatch?.[1]) {
    const cap = getCapabilities().find((x) => x.slug === capMatch[1]);
    if (!cap) return false;
    return indexabilityFromSeoFlag({
      seoIndexable: cap.seo.indexable === true,
      metadata: cap.metadata,
      now,
    }).indexable;
  }

  const resMatch = p.match(/^\/resources\/([^/]+)\/$/);
  if (resMatch?.[1]) {
    const res = getResources().find((x) => x.slug === resMatch[1]);
    if (!res) return false;
    return indexabilityFromSeoFlag({
      seoIndexable: res.seo.indexable === true,
      metadata: res.metadata,
      now,
    }).indexable;
  }

  const forMatch = p.match(/^\/for\/([^/]+)\/$/);
  if (forMatch?.[1]) {
    const aud = getAudiences().find((x) => x.slug === forMatch[1]);
    if (!aud) return false;
    return indexabilityFromSeoFlag({
      seoIndexable: aud.seo.indexable === true,
      metadata: aud.metadata,
      now,
    }).indexable;
  }

  const indMatch = p.match(/^\/industries\/([^/]+)\/$/);
  if (indMatch?.[1]) {
    const ind = getIndustries().find((x) => x.slug === indMatch[1]);
    if (!ind) return false;
    return indexabilityFromSeoFlag({
      seoIndexable: ind.seo.indexable === true,
      metadata: ind.metadata,
      now,
    }).indexable;
  }

  // Nested industry combos are intentionally noindex
  if (/^\/industries\/[^/]+\/(use-cases|capabilities|features|requirements)\//.test(p)) {
    return false;
  }

  const featMatch = p.match(/^\/features\/([^/]+)\/$/);
  if (featMatch?.[1]) {
    if (!listFeatureDetailParams().some((x) => x.slug === featMatch[1])) {
      return false;
    }
    const profile = getFeatureDetailProfile(featMatch[1]);
    if (!profile) return false;
    return indexabilityForFeaturePage({
      hasModel: true,
      hasOverview: Boolean(profile.overview),
      hasTagline: Boolean(profile.tagline?.trim()),
    }).indexable;
  }

  const reqMatch = p.match(/^\/requirements\/([^/]+)\/$/);
  if (reqMatch?.[1]) {
    if (!listRequirementDetailParams().some((x) => x.slug === reqMatch[1])) {
      return false;
    }
    const profile = getRequirementDetailProfile(reqMatch[1]);
    if (!profile) return false;
    const pillar = new Set<string>(CRM_REQUIREMENT_PILLAR_SLUGS);
    return indexabilityForRequirementPage({
      isPillar: pillar.has(reqMatch[1]),
      hasOverview: Boolean(profile.overview),
      hasHero: Boolean(profile.heroVisual?.src),
    }).indexable;
  }

  const pricingMatch = p.match(/^\/pricing\/([^/]+)\/$/);
  if (pricingMatch?.[1]) {
    return false;
  }

  return false;
}
