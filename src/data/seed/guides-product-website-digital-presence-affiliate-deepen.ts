import {
  TIER_16_SCHEDULED_GUIDE_SLUGS,
  tier16ProductWhatIsScheduledAt,
} from "@/data/config/publishing/tier-16-website-digital-presence-launch-2027-01-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T16:30:00.000Z";

const TIER_16_WDP_PRODUCT_SLUGS = ["shopify", "ueni", "flippa"] as const;

/** Tier 16 website-digital-presence launch — affiliate what-is guides (moved from Tier 5/8/10/11). */
export const websiteDigitalPresenceAffiliateDeepenProductGuides =
  TIER_16_WDP_PRODUCT_SLUGS.map((productSlug) => {
    const guideSlug = `what-is-${productSlug}`;
    return buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier16ProductWhatIsScheduledAt(productSlug),
      variant: "affiliate",
      stamp: STAMP,
    });
  });

export { TIER_16_SCHEDULED_GUIDE_SLUGS };
