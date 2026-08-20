"use client";

import { useCallback } from "react";
import { useReportWebVitals } from "next/web-vitals";
import { track } from "@/analytics/events";

/**
 * First-party Web Vitals collector. Events go through the consent-gated
 * analytics sink — this is not CrUX/RUM field truth until a production
 * destination is configured.
 */
export function WebVitals() {
  const onReport = useCallback(
    (metric: {
      id: string;
      name: string;
      value: number;
      rating?: string;
    }) => {
      track({
        name: "web_vital",
        properties: {
          metric: metric.name,
          value: Math.round(metric.value),
          rating: metric.rating ?? "",
          id: metric.id,
        },
      });
    },
    [],
  );
  useReportWebVitals(onReport);
  return null;
}
