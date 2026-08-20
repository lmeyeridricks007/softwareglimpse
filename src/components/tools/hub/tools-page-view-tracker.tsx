"use client";

import { useEffect } from "react";
import { track } from "@/analytics/events";

/** Fires tools_page_view once on mount. */
export function ToolsPageViewTracker() {
  useEffect(() => {
    track({ name: "tools_page_view" });
  }, []);
  return null;
}
