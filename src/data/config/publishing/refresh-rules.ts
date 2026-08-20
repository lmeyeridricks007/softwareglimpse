import type {
  ChangeEventDomain,
  ContentType,
  RefreshPriority,
} from "@/domain";

/**
 * Config-driven refresh impact rules.
 *
 * Examples:
 * - pricing updated → pricing HIGH, software HIGH, comparisons MEDIUM/HIGH, best MEDIUM
 * - affiliate URL → HIGH operational (no editorial rewrite required)
 * - feature updated → software HIGH, comparison MEDIUM
 * - discontinued → CRITICAL all dependents
 * - guide "what is crm" is NOT affected by product pricing changes
 */

export type RefreshImpactRule = {
  id: string;
  /** Change event domain that triggers this rule. */
  domain: ChangeEventDomain;
  /** Optional changeType match (substring or exact). */
  changeTypes?: readonly string[];
  /** Target content types and resulting priority. */
  impacts: readonly {
    contentType: ContentType;
    priority: RefreshPriority;
    /** When true, only pages that resolve as dependents of the entity. */
    dependentsOnly?: boolean;
    reason: string;
  }[];
  /**
   * Content types explicitly excluded (e.g. guides for pricing changes).
   */
  excludeContentTypes?: readonly ContentType[];
  /** Operational-only: no editorial rewrite required. */
  operationalOnly?: boolean;
};

export const REFRESH_RULES: readonly RefreshImpactRule[] = [
  {
    id: "pricing-updated",
    domain: "pricing",
    changeTypes: ["updated", "pricing-updated", "plan-changed"],
    excludeContentTypes: ["guide", "industry", "use-case", "category"],
    impacts: [
      {
        contentType: "pricing",
        priority: "high",
        dependentsOnly: false,
        reason: "pricing-changed",
      },
      {
        contentType: "software",
        priority: "high",
        dependentsOnly: false,
        reason: "pricing-changed",
      },
      {
        contentType: "comparison",
        priority: "high",
        dependentsOnly: true,
        reason: "pricing-changed",
      },
      {
        contentType: "best",
        priority: "normal",
        dependentsOnly: true,
        reason: "pricing-changed",
      },
      {
        contentType: "alternatives",
        priority: "normal",
        dependentsOnly: true,
        reason: "pricing-changed",
      },
      {
        contentType: "tool",
        priority: "high",
        dependentsOnly: false,
        reason: "pricing-changed-operational",
      },
    ],
  },
  {
    id: "affiliate-url",
    domain: "affiliate",
    changeTypes: ["url-updated", "affiliate-updated"],
    operationalOnly: true,
    excludeContentTypes: ["guide", "industry", "use-case"],
    impacts: [
      {
        contentType: "software",
        priority: "high",
        dependentsOnly: false,
        reason: "affiliate-url-changed-operational",
      },
      {
        contentType: "pricing",
        priority: "high",
        dependentsOnly: false,
        reason: "affiliate-url-changed-operational",
      },
      {
        contentType: "comparison",
        priority: "high",
        dependentsOnly: true,
        reason: "affiliate-url-changed-operational",
      },
      {
        contentType: "best",
        priority: "high",
        dependentsOnly: true,
        reason: "affiliate-url-changed-operational",
      },
      {
        contentType: "alternatives",
        priority: "high",
        dependentsOnly: true,
        reason: "affiliate-url-changed-operational",
      },
    ],
  },
  {
    id: "feature-updated",
    domain: "features",
    changeTypes: ["updated", "feature-updated"],
    excludeContentTypes: ["guide", "industry", "pricing"],
    impacts: [
      {
        contentType: "software",
        priority: "high",
        dependentsOnly: false,
        reason: "features-changed",
      },
      {
        contentType: "comparison",
        priority: "normal",
        dependentsOnly: true,
        reason: "features-changed",
      },
      {
        contentType: "best",
        priority: "normal",
        dependentsOnly: true,
        reason: "features-changed",
      },
      {
        contentType: "alternatives",
        priority: "normal",
        dependentsOnly: true,
        reason: "features-changed",
      },
    ],
  },
  {
    id: "discontinued",
    domain: "availability",
    changeTypes: ["discontinued", "sunset", "unavailable"],
    impacts: [
      {
        contentType: "software",
        priority: "critical",
        dependentsOnly: false,
        reason: "product-discontinued",
      },
      {
        contentType: "pricing",
        priority: "critical",
        dependentsOnly: false,
        reason: "product-discontinued",
      },
      {
        contentType: "comparison",
        priority: "critical",
        dependentsOnly: true,
        reason: "product-discontinued",
      },
      {
        contentType: "best",
        priority: "critical",
        dependentsOnly: true,
        reason: "product-discontinued",
      },
      {
        contentType: "alternatives",
        priority: "critical",
        dependentsOnly: true,
        reason: "product-discontinued",
      },
      {
        contentType: "tool",
        priority: "critical",
        dependentsOnly: false,
        reason: "product-discontinued",
      },
    ],
  },
  {
    id: "identity-updated",
    domain: "identity",
    changeTypes: ["renamed", "slug-changed", "brand-updated"],
    impacts: [
      {
        contentType: "software",
        priority: "high",
        dependentsOnly: false,
        reason: "identity-changed",
      },
      {
        contentType: "comparison",
        priority: "high",
        dependentsOnly: true,
        reason: "identity-changed",
      },
      {
        contentType: "best",
        priority: "normal",
        dependentsOnly: true,
        reason: "identity-changed",
      },
      {
        contentType: "alternatives",
        priority: "high",
        dependentsOnly: true,
        reason: "identity-changed",
      },
    ],
  },
  {
    id: "editorial-updated",
    domain: "editorial",
    changeTypes: ["revised", "editorial-updated"],
    impacts: [
      {
        contentType: "software",
        priority: "normal",
        dependentsOnly: false,
        reason: "editorial-changed",
      },
    ],
  },
];

export function matchRefreshRules(event: {
  domain: ChangeEventDomain;
  changeType: string;
}): RefreshImpactRule[] {
  return REFRESH_RULES.filter((rule) => {
    if (rule.domain !== event.domain) return false;
    if (!rule.changeTypes || rule.changeTypes.length === 0) return true;
    const ct = event.changeType.toLowerCase();
    return rule.changeTypes.some(
      (t) => ct === t.toLowerCase() || ct.includes(t.toLowerCase()),
    );
  });
}

/** Priority rank for merging candidates (higher wins). */
export const REFRESH_PRIORITY_RANK: Record<RefreshPriority, number> = {
  critical: 4,
  high: 3,
  normal: 2,
  low: 1,
};

export function maxPriority(
  a: RefreshPriority,
  b: RefreshPriority,
): RefreshPriority {
  return REFRESH_PRIORITY_RANK[a] >= REFRESH_PRIORITY_RANK[b] ? a : b;
}
