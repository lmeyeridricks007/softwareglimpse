"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  createGa4Sink,
  getGaMeasurementId,
  sendGa4PageView,
} from "@/analytics/ga4";
import { registerAnalyticsSink } from "@/analytics/events";

type GoogleAnalyticsProps = {
  /** When false, scripts and sinks are not mounted (consent gate). */
  enabled: boolean;
};

/**
 * Consent-gated GA4 (legacy property G-T76JWYS30G unless overridden by env).
 * Page views follow App Router navigations; custom events use the analytics bus.
 */
export function GoogleAnalytics({ enabled }: GoogleAnalyticsProps) {
  const measurementId = getGaMeasurementId();
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled || !measurementId) return;
    return registerAnalyticsSink(createGa4Sink(measurementId));
  }, [enabled, measurementId]);

  useEffect(() => {
    if (!enabled || !measurementId || !pathname) return;
    sendGa4PageView(measurementId, pathname);
  }, [enabled, measurementId, pathname]);

  if (!enabled || !measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${measurementId}', { anonymize_ip: true });
        `.trim()}
      </Script>
    </>
  );
}
