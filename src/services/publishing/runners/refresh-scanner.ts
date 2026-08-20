import type {
  ChangeEvent,
  ContentRegistryEntry,
  RefreshCandidate,
} from "@/domain";
import { maxPriority } from "@/data/config/publishing/refresh-rules";
import { listChangeEvents } from "@/data/publishing/store";
import { softwareContentId } from "../ids";
import { isPastReviewDate } from "../review-dates";
import { resolveRefreshCandidates } from "../refresh-resolver";

export type RefreshScannerOptions = {
  now?: Date;
  entries?: ContentRegistryEntry[];
  changeEvents?: ChangeEvent[];
  /**
   * Optional research freshness hook — return product slugs that are stale.
   */
  listStaleResearchProducts?: () => string[];
};

export type RefreshScanResult = {
  candidates: RefreshCandidate[];
  fromChangeEvents: number;
  fromStaleReview: number;
  fromResearch: number;
};

/**
 * Scan stale nextReviewAt, change events, and research freshness hooks
 * → refresh candidates.
 */
export function scanRefreshCandidates(
  opts: RefreshScannerOptions = {},
): RefreshScanResult {
  const now = opts.now ?? new Date();
  const bucket = new Map<string, RefreshCandidate>();

  let fromChangeEvents = 0;
  let fromStaleReview = 0;
  let fromResearch = 0;

  const events = opts.changeEvents ?? listChangeEvents();
  for (const event of events) {
    const resolved = resolveRefreshCandidates(event);
    fromChangeEvents += resolved.length;
    mergeCandidates(bucket, resolved);
  }

  for (const entry of opts.entries ?? []) {
    const nextReview = entry.nextReviewAt ?? entry.metadata.nextReviewAt;
    if (isPastReviewDate(nextReview, now)) {
      fromStaleReview += 1;
      const key = String(entry.contentId);
      const existing = bucket.get(key);
      const candidate: RefreshCandidate = {
        contentId: entry.contentId,
        priority: existing?.priority ?? "normal",
        refreshStatus: "refresh-recommended",
        reasons: [...new Set([...(existing?.reasons ?? []), "past-next-review-at"])],
        changeEventIds: existing?.changeEventIds ?? [],
        affectedDomains: existing?.affectedDomains ?? ["editorial"],
      };
      bucket.set(key, candidate);
    }
  }

  const staleProducts = opts.listStaleResearchProducts?.() ?? [];
  for (const slug of staleProducts) {
    fromResearch += 1;
    const contentId = softwareContentId(slug);
    const key = String(contentId);
    const existing = bucket.get(key);
    bucket.set(key, {
      contentId,
      priority: existing?.priority ?? "normal",
      refreshStatus: "refresh-recommended",
      reasons: [...new Set([...(existing?.reasons ?? []), "research-stale"])],
      changeEventIds: [
        ...new Set([...(existing?.changeEventIds ?? []), `research-stale-${slug}`]),
      ],
      affectedDomains: [
        ...new Set([...(existing?.affectedDomains ?? []), "editorial"]),
      ] as RefreshCandidate["affectedDomains"],
    });
  }

  return {
    candidates: [...bucket.values()],
    fromChangeEvents,
    fromStaleReview,
    fromResearch,
  };
}

function mergeCandidates(
  bucket: Map<string, RefreshCandidate>,
  candidates: RefreshCandidate[],
): void {
  for (const candidate of candidates) {
    const key = String(candidate.contentId);
    const existing = bucket.get(key);
    if (!existing) {
      bucket.set(key, candidate);
      continue;
    }
    bucket.set(key, {
      contentId: candidate.contentId,
      priority: maxPriority(existing.priority, candidate.priority),
      refreshStatus: candidate.refreshStatus,
      reasons: [...new Set([...existing.reasons, ...candidate.reasons])],
      changeEventIds: [
        ...new Set([...existing.changeEventIds, ...candidate.changeEventIds]),
      ],
      affectedDomains: [
        ...new Set([...existing.affectedDomains, ...candidate.affectedDomains]),
      ] as RefreshCandidate["affectedDomains"],
    });
  }
}
