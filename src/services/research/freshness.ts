import type { ResearchDomain } from "@/domain";
import {
  DEFAULT_FRESHNESS_POLICIES,
  getFreshnessMaxAgeDays,
  type FreshnessPolicy,
} from "@/domain/schemas/freshness";
import { daysBetween } from "./utils";

export function isResearchDomainStale(input: {
  domain: ResearchDomain;
  checkedAt?: string;
  now?: Date;
  policies?: FreshnessPolicy[];
}): boolean {
  if (!input.checkedAt) return true;
  const maxAge = getFreshnessMaxAgeDays(
    input.domain,
    input.policies ?? DEFAULT_FRESHNESS_POLICIES,
  );
  return daysBetween(input.checkedAt, input.now) > maxAge;
}

export function getStaleResearchDomains(input: {
  domainCheckedAt: Partial<Record<ResearchDomain, string>>;
  domains?: ResearchDomain[];
  now?: Date;
  policies?: FreshnessPolicy[];
}): ResearchDomain[] {
  const domains =
    input.domains ??
    (DEFAULT_FRESHNESS_POLICIES.map((p) => p.domain) as ResearchDomain[]);

  return domains.filter((domain) =>
    isResearchDomainStale({
      domain,
      checkedAt: input.domainCheckedAt[domain],
      now: input.now,
      policies: input.policies,
    }),
  );
}

export type DomainCompleteness =
  | "complete"
  | "partial"
  | "missing"
  | "stale";

export function assessDomainCompleteness(input: {
  hasFacts: boolean;
  verifiedCount: number;
  totalCount: number;
  checkedAt?: string;
  domain: ResearchDomain;
  now?: Date;
}): DomainCompleteness {
  if (!input.hasFacts || input.totalCount === 0) return "missing";
  if (
    isResearchDomainStale({
      domain: input.domain,
      checkedAt: input.checkedAt,
      now: input.now,
    })
  ) {
    return "stale";
  }
  if (input.verifiedCount >= Math.max(1, Math.ceil(input.totalCount * 0.7))) {
    return "complete";
  }
  return "partial";
}
