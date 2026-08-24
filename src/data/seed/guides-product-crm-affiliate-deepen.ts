import {
  TIER_6_CRM_AFFILIATE_DEEPEN_SLUGS,
  tier6WhatIsScheduledAt,
} from "@/data/config/publishing/tier-6-crm-affiliate-deepen-launch-2026-12-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T13:10:00.000Z";

/**
 * Tier 6 CRM affiliate deepen — product-scoped what-is guides for CRM affiliates
 * deferred from Tier 2. Pairs with existing 5-kind packs.
 */
export const crmAffiliateDeepenProductGuides =
  TIER_6_CRM_AFFILIATE_DEEPEN_SLUGS.map((productSlug) => {
    const guideSlug = `what-is-${productSlug}`;
    return buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier6WhatIsScheduledAt(guideSlug),
      variant: "affiliate",
      stamp: STAMP,
    });
  });
