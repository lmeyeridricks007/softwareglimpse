import type {
  ChangeEvent,
  ContentId,
  ContentType,
  RefreshCandidate,
  RefreshPriority,
} from "@/domain";
import {
  matchRefreshRules,
  maxPriority,
  type RefreshImpactRule,
} from "@/data/config/publishing/refresh-rules";
import { resolveAffectedPages } from "@/services/editorial/dependencies";
import {
  alternativesContentId,
  bestContentId,
  buildContentId,
  comparisonContentId,
  pricingContentId,
  softwareContentId,
  toolContentId,
} from "./ids";

export type RefreshResolverOptions = {
  /**
   * Optional override for dependent page resolution (tests).
   * Defaults to editorial resolveAffectedPages(entityId).
   */
  resolveDependents?: (entityId: string) => {
    contentId: ContentId;
    type: ContentType;
  }[];
};

function defaultDependents(entityId: string): {
  contentId: ContentId;
  type: ContentType;
}[] {
  const pages = resolveAffectedPages(entityId);
  return pages.map((page) => {
    const type = mapPageType(page.pageType);
    return {
      contentId: buildContentId(type, page.slug),
      type,
    };
  });
}

function mapPageType(
  pageType: string,
): ContentType {
  switch (pageType) {
    case "software-review":
      return "software";
    case "comparison":
      return "comparison";
    case "alternatives":
      return "alternatives";
    case "best":
      return "best";
    case "pricing":
      return "pricing";
    case "tool":
      return "tool";
    default:
      return "guide";
  }
}

function directTargets(
  entityId: string,
  contentType: ContentType,
): { contentId: ContentId; type: ContentType }[] {
  switch (contentType) {
    case "software":
      return [{ contentId: softwareContentId(entityId), type: "software" }];
    case "pricing":
      return [{ contentId: pricingContentId(entityId), type: "pricing" }];
    case "tool":
      return [
        { contentId: toolContentId("crm-cost-calculator"), type: "tool" },
        { contentId: toolContentId("crm-finder"), type: "tool" },
      ];
    default:
      return [];
  }
}

function applyRule(
  event: ChangeEvent,
  rule: RefreshImpactRule,
  dependents: { contentId: ContentId; type: ContentType }[],
  bucket: Map<string, RefreshCandidate>,
): void {
  for (const impact of rule.impacts) {
    if (rule.excludeContentTypes?.includes(impact.contentType)) continue;

    const targets = impact.dependentsOnly
      ? dependents.filter((d) => d.type === impact.contentType)
      : [
          ...directTargets(event.entityId, impact.contentType),
          ...dependents.filter((d) => d.type === impact.contentType),
        ];

    // Deduplicate by contentId
    const seen = new Set<string>();
    for (const target of targets) {
      const key = String(target.contentId);
      if (seen.has(key)) continue;
      seen.add(key);

      const existing = bucket.get(key);
      if (!existing) {
        bucket.set(key, {
          contentId: target.contentId,
          priority: impact.priority,
          refreshStatus:
            impact.priority === "critical"
              ? "refresh-required"
              : impact.priority === "high"
                ? "refresh-required"
                : "refresh-recommended",
          reasons: [impact.reason],
          changeEventIds: [event.id],
          affectedDomains: [event.domain],
        });
      } else {
        const priority = maxPriority(existing.priority, impact.priority);
        const reasons = existing.reasons.includes(impact.reason)
          ? existing.reasons
          : [...existing.reasons, impact.reason];
        const changeEventIds = existing.changeEventIds.includes(event.id)
          ? existing.changeEventIds
          : [...existing.changeEventIds, event.id];
        const affectedDomains = existing.affectedDomains.includes(event.domain)
          ? existing.affectedDomains
          : [...existing.affectedDomains, event.domain];
        bucket.set(key, {
          ...existing,
          priority,
          refreshStatus:
            priority === "critical" || priority === "high"
              ? "refresh-required"
              : existing.refreshStatus,
          reasons,
          changeEventIds,
          affectedDomains,
        });
      }
    }
  }
}

/**
 * Given a ChangeEvent, produce RefreshCandidate[] with priorities/reasons
 * using refresh-rules + resolveAffectedPages + content IDs.
 *
 * Guides (e.g. "what is crm") are excluded from pricing impact rules.
 */
export function resolveRefreshCandidates(
  event: ChangeEvent,
  opts: RefreshResolverOptions = {},
): RefreshCandidate[] {
  const rules = matchRefreshRules(event);
  if (rules.length === 0) return [];

  const resolveDeps = opts.resolveDependents ?? defaultDependents;
  const dependents = resolveDeps(event.entityId);
  const bucket = new Map<string, RefreshCandidate>();

  for (const rule of rules) {
    applyRule(event, rule, dependents, bucket);
  }

  return [...bucket.values()].sort((a, b) => {
    const rank: Record<RefreshPriority, number> = {
      critical: 0,
      high: 1,
      normal: 2,
      low: 3,
    };
    return rank[a.priority] - rank[b.priority];
  });
}

/** Convenience for tests — alias. */
export function resolveRefreshFromChangeEvent(
  event: ChangeEvent,
  opts?: RefreshResolverOptions,
): RefreshCandidate[] {
  return resolveRefreshCandidates(event, opts);
}

export {
  comparisonContentId,
  bestContentId,
  alternativesContentId,
  pricingContentId,
  softwareContentId,
};
