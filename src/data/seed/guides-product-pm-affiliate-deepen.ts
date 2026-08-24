import {
  TIER_12_PM_AFFILIATE_DEEPEN_SLUGS,
  tier12WhatIsScheduledAt,
} from "@/data/config/publishing/tier-12-pm-affiliate-deepen-launch-2027-02-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T13:40:00.000Z";

/**
 * Tier 12 PM affiliate deepen — product-scoped what-is guides deferred from Tier 2.
 * Pairs with existing 5-kind packs.
 */
export const pmAffiliateDeepenProductGuides = TIER_12_PM_AFFILIATE_DEEPEN_SLUGS.map(
  (productSlug) => {
    const guideSlug = `what-is-${productSlug}`;
    return buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier12WhatIsScheduledAt(guideSlug),
      variant: "affiliate",
      stamp: STAMP,
    });
  },
);
