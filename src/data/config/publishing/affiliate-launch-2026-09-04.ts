import {
  TIER_1_SCHEDULED_SOFTWARE_SLUGS,
  tier1SoftwareScheduledAt,
} from "@/data/config/publishing/tier-1-content-launch-2026-08-26";

/** First affiliate software slot in the Tier 1 stagger (ai-intelekt). */
export const AFFILIATE_LAUNCH_2026_09_04_UTC =
  tier1SoftwareScheduledAt("ai-intelekt") ?? "2026-09-04T06:00:00.000Z";

export const AFFILIATE_LAUNCH_2026_09_04_LOCAL =
  "2026-09-04T08:00:00+02:00";

export const AFFILIATE_LAUNCH_2026_09_04_SOFTWARE_SLUGS =
  TIER_1_SCHEDULED_SOFTWARE_SLUGS.filter(
    (slug) => slug === "ai-intelekt",
  ) as readonly ["ai-intelekt"];
