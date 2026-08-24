import { tier11ProductScheduledAt } from "@/data/config/publishing/tier-11-marketing-affiliate-launch-2027-01-11";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T23:00:00.000Z";

const PPC_AFFILIATE_SLUGS = ["diginius", "birch"] as const;

export const ppcAdvertisingAffiliateDeepenProductGuides = PPC_AFFILIATE_SLUGS.map(
  (productSlug) =>
    buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier11ProductScheduledAt(productSlug),
      variant: "affiliate",
      stamp: STAMP,
    }),
);
