import {
  TIER_22_SCHEDULED_GUIDE_SLUGS,
  tier22ProductWhatIsScheduledAt,
} from "@/data/config/publishing/tier-22-voip-business-phone-launch-2027-06-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T19:30:00.000Z";

const TIER_22_VOIP_PRODUCT_SLUGS = [
  "krispcall",
  "callhippo",
  "aircall",
  "freshcaller",
  "kixie",
] as const;

/** Tier 22 voip-business-phone launch — affiliate what-is guides. */
export const voipBusinessPhoneAffiliateDeepenProductGuides =
  TIER_22_VOIP_PRODUCT_SLUGS.map((productSlug) =>
    buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier22ProductWhatIsScheduledAt(productSlug),
      variant: "affiliate",
      stamp: STAMP,
    }),
  );

export { TIER_22_SCHEDULED_GUIDE_SLUGS };
