import { track, type AnalyticsEvent } from "@/analytics/events";

/**
 * Site-foundation analytics event names.
 * Sinks must respect consent — see ConsentAwareAnalytics.
 */
export type SiteAnalyticsEventName =
  | "newsletter_signup_viewed"
  | "newsletter_signup_submitted"
  | "newsletter_signup_confirmed"
  | "newsletter_popup_dismissed"
  | "contact_page_view"
  | "contact_reason_selected"
  | "contact_form_started"
  | "contact_form_submitted"
  | "contact_form_success"
  | "contact_form_error"
  | "cookie_consent_shown"
  | "cookie_consent_saved"
  | "cookie_preferences_updated";

declare module "@/analytics/events" {
  // Augment via union extension on track callers — keep local wrapper typed.
}

export function trackSiteEvent(
  name: SiteAnalyticsEventName,
  properties?: AnalyticsEvent["properties"],
): void {
  track({
    name: name as AnalyticsEvent["name"],
    properties,
  });
}
