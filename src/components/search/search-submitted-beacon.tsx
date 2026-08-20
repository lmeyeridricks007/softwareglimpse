"use client";

import { useEffect } from "react";
import { trackSearchEvent } from "@/services/search/analytics";

/** Fires once when a successful search with results is shown. */
export function SearchSubmittedBeacon({
  query,
  total,
}: {
  query: string;
  total: number;
}) {
  useEffect(() => {
    if (!query) return;
    trackSearchEvent("search_submitted", {
      query,
      result_count: total,
    });
  }, [query, total]);

  return null;
}
