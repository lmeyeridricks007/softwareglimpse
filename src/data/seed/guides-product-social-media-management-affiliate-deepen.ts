import { tier13ProductWhatIsScheduledAt } from "@/data/config/publishing/tier-13-social-media-marketing-launch-2026-10-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T23:00:00.000Z";

/** SocialBee what-is scheduled Tier 13 Oct 2026 — moved from top-level SMM hub. */
export const socialMediaManagementAffiliateDeepenProductGuides = [
  buildProductWhatIsDeepenGuide("socialbee", {
    scheduledAt: tier13ProductWhatIsScheduledAt("socialbee"),
    variant: "affiliate",
    stamp: STAMP,
  }),
];
