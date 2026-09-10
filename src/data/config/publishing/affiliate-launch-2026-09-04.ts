import { TIER_1_LAUNCHED_SOFTWARE } from "@/data/config/publishing/tier-1-content-launch-2026-08-26";

/** Historical Tier 1 slot for ai-intelekt (shipped 29 Aug 2026). */
export const AFFILIATE_LAUNCH_2026_09_04_UTC =
  TIER_1_LAUNCHED_SOFTWARE.find((item) => item.slug === "ai-intelekt")
    ?.publishedAt ?? "2026-08-29T06:00:00.000Z";

export const AFFILIATE_LAUNCH_2026_09_04_LOCAL =
  "2026-08-29T08:00:00+02:00";

export const AFFILIATE_LAUNCH_2026_09_04_SOFTWARE_SLUGS = [
  "ai-intelekt",
] as const;
