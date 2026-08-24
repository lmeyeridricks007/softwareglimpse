import { tier9ProductScheduledAt } from "@/data/config/publishing/tier-9-hr-affiliate-deepen-launch-2026-12-15";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T22:00:00.000Z";

const ATS_AFFILIATE_SLUGS = ["breezy-hr", "freshteam"] as const;

export const atsRecruitingAffiliateDeepenProductGuides = ATS_AFFILIATE_SLUGS.map(
  (productSlug) =>
    buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier9ProductScheduledAt(productSlug),
      variant: "affiliate",
      stamp: STAMP,
    }),
);
