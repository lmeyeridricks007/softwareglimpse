/**
 * Google Analytics 4 — measurement ID continuity with the pre-rebuild site.
 * UI must not import this; ConsentAwareAnalytics registers the sink.
 */

import type { AnalyticsEvent } from "./events";

/** GA4 property used on www.softwareglimpse.com (Wayback 2023–2024). */
export const LEGACY_GA_MEASUREMENT_ID = "G-T76JWYS30G";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Client measurement ID. Override with NEXT_PUBLIC_GA_MEASUREMENT_ID.
 * Set to empty / "false" / "0" to disable GA4 without removing the sink wiring.
 */
export function getGaMeasurementId(): string | null {
  const raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (raw === "" || raw === "0" || raw === "false") return null;
  const trimmed = raw?.trim();
  if (trimmed) return trimmed;
  return LEGACY_GA_MEASUREMENT_ID;
}

function toGtagParams(
  properties?: AnalyticsEvent["properties"],
): Record<string, string | number | boolean> | undefined {
  if (!properties) return undefined;
  const out: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(properties)) {
    if (value === null || value === undefined) continue;
    out[key] = value;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Forward provider-agnostic track() events to gtag when the library is loaded. */
export function createGa4Sink(measurementId: string) {
  return (event: AnalyticsEvent): void => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") {
      return;
    }
    const params = toGtagParams(event.properties);
    if (params) {
      window.gtag("event", event.name, { send_to: measurementId, ...params });
    } else {
      window.gtag("event", event.name, { send_to: measurementId });
    }
  };
}

export function sendGa4PageView(
  measurementId: string,
  pagePath: string,
): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag("config", measurementId, {
    page_path: pagePath,
  });
}
