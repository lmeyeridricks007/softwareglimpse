import {
  DEFAULT_REVIEW_POLICY_DAYS,
  type ContentType,
  type ReviewPolicy,
} from "@/domain";

/**
 * Review cadence by page type (days until nextReviewAt).
 * software 90, pricing 30, comparison 90, best 60, alternatives 90,
 * guide/category/tool 180.
 */
export const REVIEW_POLICIES: ReviewPolicy = Object.fromEntries(
  (Object.keys(DEFAULT_REVIEW_POLICY_DAYS) as ContentType[]).map((type) => [
    type,
    { maxAgeDays: DEFAULT_REVIEW_POLICY_DAYS[type] },
  ]),
);

export function getReviewMaxAgeDays(pageType: ContentType | string): number {
  const policy = REVIEW_POLICIES[pageType];
  if (policy) return policy.maxAgeDays;
  return DEFAULT_REVIEW_POLICY_DAYS.guide;
}
