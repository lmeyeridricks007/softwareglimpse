import type {
  ChangeEventDomain,
  PriceMonitorGrowthSignal,
  RefreshCandidate,
} from "@/domain";
import { maxPriority } from "@/data/config/publishing/refresh-rules";
import { buildContentId } from "@/services/publishing/ids";

/**
 * Merge growth signals into refresh candidates (boost priority).
 * Pure — no filesystem I/O (safe for shared import graphs).
 */
export function applyGrowthSignalsToRefreshCandidates(
  candidates: RefreshCandidate[],
  signals: PriceMonitorGrowthSignal[],
): RefreshCandidate[] {
  if (signals.length === 0) return candidates;

  const boostByPath = new Map<string, PriceMonitorGrowthSignal>();
  for (const signal of signals) {
    const prev = boostByPath.get(signal.path);
    if (
      !prev ||
      priorityRank(signal.refreshPriorityBoost) >
        priorityRank(prev.refreshPriorityBoost)
    ) {
      boostByPath.set(signal.path, signal);
    }
  }

  const bucket = new Map<string, RefreshCandidate>();
  for (const c of candidates) {
    bucket.set(String(c.contentId), { ...c });
  }

  for (const [pagePath, signal] of boostByPath) {
    const mapped = pathToContentId(pagePath);
    if (!mapped) continue;
    const key = String(mapped);
    const existing = bucket.get(key);
    const boostPriority = signal.refreshPriorityBoost;
    if (existing) {
      bucket.set(key, {
        ...existing,
        priority: maxPriority(existing.priority, boostPriority),
        refreshStatus:
          signal.confidence === "CONFIRMED"
            ? "refresh-required"
            : existing.refreshStatus === "current"
              ? "refresh-recommended"
              : existing.refreshStatus,
        reasons: [
          ...new Set([
            ...existing.reasons,
            "price-monitor-outdated-pricing",
            signal.reason,
          ]),
        ],
        affectedDomains: [
          ...new Set<ChangeEventDomain>([
            ...((existing.affectedDomains ?? []) as ChangeEventDomain[]),
            "pricing",
          ]),
        ],
      });
    } else if (signal.confidence === "CONFIRMED") {
      bucket.set(key, {
        contentId: mapped,
        priority: boostPriority,
        refreshStatus: "refresh-required",
        reasons: ["price-monitor-outdated-pricing", signal.reason],
        changeEventIds: [`price-monitor-${signal.productId}`],
        affectedDomains: ["pricing"],
      });
    }
  }

  return [...bucket.values()].sort((a, b) => {
    const order = { critical: 0, high: 1, normal: 2, low: 3 };
    return order[a.priority] - order[b.priority];
  });
}

function priorityRank(p: "critical" | "high" | "normal"): number {
  return p === "critical" ? 3 : p === "high" ? 2 : 1;
}

function pathToContentId(pagePath: string) {
  const patterns: Array<{
    re: RegExp;
    type:
      | "software"
      | "pricing"
      | "comparison"
      | "alternatives"
      | "best"
      | "tool"
      | "category";
  }> = [
    { re: /^\/software\/([^/]+)\/$/, type: "software" },
    { re: /^\/pricing\/([^/]+)\/$/, type: "pricing" },
    { re: /^\/compare\/([^/]+)\/$/, type: "comparison" },
    { re: /^\/alternatives\/([^/]+)\/$/, type: "alternatives" },
    { re: /^\/best\/([^/]+)\/$/, type: "best" },
    { re: /^\/tools\/([^/]+)\/$/, type: "tool" },
    { re: /^\/categories\/([^/]+)\/$/, type: "category" },
  ];
  for (const { re, type } of patterns) {
    const m = pagePath.match(re);
    if (m?.[1]) {
      try {
        return buildContentId(type, m[1]);
      } catch {
        return null;
      }
    }
  }
  return null;
}
