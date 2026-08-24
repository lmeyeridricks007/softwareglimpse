import {
  TIER_13_SCHEDULED_GUIDE_SLUGS,
  tier13ProductWhatIsScheduledAt,
} from "@/data/config/publishing/tier-13-social-media-marketing-launch-2026-10-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T14:30:00.000Z";

const TIER_13_SMM_PRODUCT_SLUGS = ["brand24", "zypper"] as const;

/** Tier 13 social-media-marketing launch — affiliate what-is guides (moved from Tier 11). */
export const socialMediaMarketingAffiliateDeepenProductGuides =
  TIER_13_SMM_PRODUCT_SLUGS.map((productSlug) => {
    const guideSlug = `what-is-${productSlug}`;
    return buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier13ProductWhatIsScheduledAt(productSlug),
      variant: "affiliate",
      stamp: STAMP,
    });
  });

export { TIER_13_SCHEDULED_GUIDE_SLUGS };
