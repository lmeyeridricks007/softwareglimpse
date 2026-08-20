"use client";

import { useEffect, useRef } from "react";
import { Analytics } from "@vercel/analytics/next";
import { registerAnalyticsSink, type AnalyticsEvent } from "@/analytics/events";
import { useConsentOptional } from "@/components/site/consent-provider";
import { siteFoundationConfig } from "@/data/config/site/foundation-client";

/**
 * Registers a consent-gated analytics sink and mounts Vercel Web Analytics
 * only when the analytics category is allowed.
 * Affiliate redirects must NOT depend on this sink.
 */
export function ConsentAwareAnalytics() {
  const consent = useConsentOptional();
  const buffer = useRef<AnalyticsEvent[]>([]);
  const allowed = consent?.allows("analytics") ?? false;
  const requiresConsent =
    siteFoundationConfig.consent.analyticsRequiresConsent;
  const loadAnalytics = !requiresConsent || allowed;

  useEffect(() => {
    const sink = (event: AnalyticsEvent) => {
      if (requiresConsent && !allowed) {
        // Do not forward optional analytics before consent.
        // Cookie consent lifecycle events are still recorded only after accept
        // when they themselves go through track — banner "shown" is intentional
        // and may be dropped until a sink exists; that is preferred over loading GA early.
        if (
          event.name === "cookie_consent_shown" ||
          event.name === "cookie_consent_saved" ||
          event.name === "cookie_preferences_updated"
        ) {
          buffer.current.push(event);
        }
        return;
      }
      if (process.env.NODE_ENV === "development") {
        console.debug("[analytics]", event.name, event.properties);
      }
    };
    return registerAnalyticsSink(sink);
  }, [allowed, requiresConsent]);

  useEffect(() => {
    if (!allowed) return;
    buffer.current = [];
  }, [allowed]);

  if (!loadAnalytics) return null;
  return <Analytics />;
}

type ConsentScriptProps = {
  category: "analytics" | "marketing" | "preferences";
  /** Render children only when category allowed */
  children?: React.ReactNode;
};

/**
 * Gate third-party / optional scripts behind consent categories.
 */
export function ConsentScript({ category, children }: ConsentScriptProps) {
  const consent = useConsentOptional();
  if (!consent?.allows(category)) return null;
  return <>{children}</>;
}
