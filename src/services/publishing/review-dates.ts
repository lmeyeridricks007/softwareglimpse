import type { ContentType } from "@/domain";
import { getReviewMaxAgeDays } from "@/data/config/publishing/review-policies";
import type { ReviewPolicy } from "@/domain";

/**
 * Compute nextReviewAt from page type + fromDate using review policies.
 * Returns ISO UTC with Z.
 */
export function computeNextReviewAt(
  pageType: ContentType | string,
  fromDate: Date | string = new Date(),
  policies?: ReviewPolicy,
): string {
  const from =
    typeof fromDate === "string" ? new Date(fromDate) : new Date(fromDate);
  const maxAgeDays = policies?.[pageType]?.maxAgeDays ?? getReviewMaxAgeDays(pageType);
  const next = new Date(from.getTime() + maxAgeDays * 24 * 60 * 60 * 1000);
  return next.toISOString();
}

export function isPastReviewDate(
  nextReviewAt: string | undefined,
  now: Date = new Date(),
): boolean {
  if (!nextReviewAt) return false;
  const ts = Date.parse(nextReviewAt);
  if (Number.isNaN(ts)) return false;
  return ts <= now.getTime();
}
