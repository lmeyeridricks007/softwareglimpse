import {
  TIER_5_AI_AFFILIATE_DEEPEN_SLUGS,
  tier5WhatIsScheduledAt,
} from "@/data/config/publishing/tier-5-ai-affiliate-deepen-launch-2026-11-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T13:00:00.000Z";

/**
 * Tier 5 AI affiliate deepen — product-scoped what-is guides for AI-category
 * affiliates deferred from Tier 2. Pairs with existing 5-kind packs.
 */
export const aiAffiliateDeepenProductGuides = [
  ...TIER_5_AI_AFFILIATE_DEEPEN_SLUGS.map((productSlug) => {
    const guideSlug = `what-is-${productSlug}`;
    return buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier5WhatIsScheduledAt(guideSlug),
      variant: "affiliate",
      stamp: STAMP,
    });
  }),
  buildProductWhatIsDeepenGuide("turbotic", {
    variant: "affiliate",
    stamp: STAMP,
  }),
  buildProductWhatIsDeepenGuide("hynote", {
    variant: "affiliate",
    stamp: STAMP,
  }),
];
