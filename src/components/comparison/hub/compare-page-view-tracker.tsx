"use client";

import { useEffect } from "react";
import { track } from "@/analytics/events";

export function ComparePageViewTracker() {
  useEffect(() => {
    track({ name: "compare_page_view" });
  }, []);
  return null;
}
