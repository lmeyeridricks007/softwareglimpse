import {
  TIER_14_SCHEDULED_GUIDE_SLUGS,
  tier14ProductWhatIsScheduledAt,
} from "@/data/config/publishing/tier-14-webinar-virtual-events-launch-2026-11-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T15:00:00.000Z";

const TIER_14_WVE_PRODUCT_SLUGS = [
  "webinarjam-everwebinar",
  "livestorm",
  "switcher-studio",
] as const;

/** Tier 14 webinar-virtual-events launch — affiliate what-is guides (moved from Tier 11). */
export const webinarVirtualEventsAffiliateDeepenProductGuides =
  TIER_14_WVE_PRODUCT_SLUGS.map((productSlug) => {
    const guideSlug = `what-is-${productSlug}`;
    return buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier14ProductWhatIsScheduledAt(productSlug),
      variant: "affiliate",
      stamp: STAMP,
    });
  });

export { TIER_14_SCHEDULED_GUIDE_SLUGS };
