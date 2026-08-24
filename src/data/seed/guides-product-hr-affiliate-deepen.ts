import {
  TIER_9_HR_AFFILIATE_DEEPEN_SLUGS,
  tier9WhatIsScheduledAt,
} from "@/data/config/publishing/tier-9-hr-affiliate-deepen-launch-2026-12-15";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T13:25:00.000Z";

/**
 * Tier 9 HR / ops affiliate deepen — product-scoped what-is guides deferred from Tier 2.
 * Pairs with existing 5-kind packs.
 */
export const hrAffiliateDeepenProductGuides = TIER_9_HR_AFFILIATE_DEEPEN_SLUGS.map(
  (productSlug) => {
    const guideSlug = `what-is-${productSlug}`;
    return buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier9WhatIsScheduledAt(guideSlug),
      variant: "affiliate",
      stamp: STAMP,
    });
  },
);
