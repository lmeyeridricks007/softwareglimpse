import {
  TIER_4_EDITORIAL_ANCHOR_SLUGS,
  tier4WhatIsScheduledAt,
} from "@/data/config/publishing/tier-4-editorial-anchor-launch-2026-10-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T13:00:00.000Z";

/**
 * Tier 4 editorial anchors — product-scoped what-is guides for non-affiliate CRM
 * leaders. Pairs with existing 5-kind packs and approved comparison graphs.
 */
export const editorialAnchorProductGuides = TIER_4_EDITORIAL_ANCHOR_SLUGS.map(
  (productSlug) => {
    const guideSlug = `what-is-${productSlug}`;
    return buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier4WhatIsScheduledAt(guideSlug),
      variant: "editorial-anchor",
      stamp: STAMP,
    });
  },
);
