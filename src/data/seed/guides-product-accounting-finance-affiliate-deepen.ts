import {
  TIER_3_SCHEDULED_GUIDE_SLUGS,
  tier3ProductWhatIsScheduledAt,
} from "@/data/config/publishing/tier-3-accounting-finance-launch-2026-09-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T14:00:00.000Z";

const TIER_3_AF_PRODUCT_SLUGS = ["navan", "dext", "mrpeasy"] as const;

/**
 * Tier 3 accounting-finance launch — product what-is guides for recategorized affiliates.
 */
export const accountingFinanceAffiliateDeepenProductGuides =
  TIER_3_AF_PRODUCT_SLUGS.map((productSlug) => {
    const guideSlug = `what-is-${productSlug}`;
    return buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier3ProductWhatIsScheduledAt(productSlug),
      variant: "affiliate",
      stamp: STAMP,
    });
  });

export { TIER_3_SCHEDULED_GUIDE_SLUGS };
