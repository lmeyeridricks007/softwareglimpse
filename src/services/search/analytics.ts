import { track, type AnalyticsEvent } from "@/analytics/events";

/**
 * Privacy-safe on-site search analytics.
 * Do not attach personal identifiers beyond existing site policy.
 */

export type SearchAnalyticsEventName =
  | "search_submitted"
  | "search_result_clicked"
  | "search_zero_results"
  | "search_filter_used"
  | "search_suggestion_clicked";

export function trackSearchEvent(
  name: SearchAnalyticsEventName,
  properties?: AnalyticsEvent["properties"],
): void {
  track({
    name: name as AnalyticsEvent["name"],
    properties,
  });
}
