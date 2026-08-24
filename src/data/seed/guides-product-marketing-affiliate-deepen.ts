import {
  TIER_11_MARKETING_AFFILIATE_DEEPEN_SLUGS,
  tier11WhatIsScheduledAt,
} from "@/data/config/publishing/tier-11-marketing-affiliate-launch-2027-01-11";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T13:35:00.000Z";

/**
 * Tier 11 marketing affiliate deepen — product-scoped what-is guides deferred
 * from Tier 2. Pairs with existing 5-kind packs.
 */
export const marketingAffiliateDeepenProductGuides =
  TIER_11_MARKETING_AFFILIATE_DEEPEN_SLUGS.map((productSlug) => {
    const guideSlug = `what-is-${productSlug}`;
    return buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier11WhatIsScheduledAt(guideSlug),
      variant: "affiliate",
      stamp: STAMP,
    });
  });
