/** AI InteleKt launch — Tier 1 stagger slot (29 Aug 2026; shipped). */
import { TIER_1_LAUNCHED_SOFTWARE } from "@/data/config/publishing/tier-1-content-launch-2026-08-26";

export const AI_INTELEKT_LAUNCH_UTC =
  TIER_1_LAUNCHED_SOFTWARE.find((item) => item.slug === "ai-intelekt")
    ?.publishedAt ?? "2026-08-29T06:00:00.000Z";

export const AI_INTELEKT_LAUNCH_LOCAL = "2026-08-29T08:00:00+02:00";
