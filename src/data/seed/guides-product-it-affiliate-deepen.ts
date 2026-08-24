import {
  TIER_10_IT_AFFILIATE_DEEPEN_SLUGS,
  tier10WhatIsScheduledAt,
} from "@/data/config/publishing/tier-10-it-affiliate-deepen-launch-2027-01-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T13:30:00.000Z";

/**
 * Tier 10 IT-development affiliate deepen — product-scoped what-is guides deferred
 * from Tier 2. Pairs with existing 5-kind packs.
 */
export const itAffiliateDeepenProductGuides = TIER_10_IT_AFFILIATE_DEEPEN_SLUGS.map(
  (productSlug) => {
    const guideSlug = `what-is-${productSlug}`;
    return buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier10WhatIsScheduledAt(guideSlug),
      variant: "affiliate",
      stamp: STAMP,
    });
  },
);
