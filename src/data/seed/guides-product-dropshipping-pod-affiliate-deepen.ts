import { tier8ProductScheduledAt } from "@/data/config/publishing/tier-8-ecommerce-affiliate-deepen-launch-2026-12-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T21:00:00.000Z";

const DROPSHIPPING_POD_AFFILIATE_SLUGS = ["spocket", "alidrop", "printify"] as const;

export const dropshippingPodAffiliateDeepenProductGuides =
  DROPSHIPPING_POD_AFFILIATE_SLUGS.map((productSlug) =>
    buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier8ProductScheduledAt(productSlug),
      variant: "affiliate",
      stamp: STAMP,
    }),
  );
