import {
  TIER_17_SCHEDULED_GUIDE_SLUGS,
  tier17ProductWhatIsScheduledAt,
} from "@/data/config/publishing/tier-17-analytics-bi-launch-2027-02-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T17:00:00.000Z";

const TIER_17_ANALYTICS_BI_PRODUCT_SLUGS = [
  "whatconverts",
  "databox",
] as const;

/** Tier 17 analytics-bi launch — affiliate what-is guides (moved from Tier 11). */
export const analyticsBiAffiliateDeepenProductGuides =
  TIER_17_ANALYTICS_BI_PRODUCT_SLUGS.map((productSlug) => {
    const guideSlug = `what-is-${productSlug}`;
    return buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier17ProductWhatIsScheduledAt(productSlug),
      variant: "affiliate",
      stamp: STAMP,
    });
  });

export { TIER_17_SCHEDULED_GUIDE_SLUGS };
