import { tier16ProductWhatIsScheduledAt } from "@/data/config/publishing/tier-16-website-digital-presence-launch-2027-01-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T22:00:00.000Z";

/** Tier 29 web-hosting — Plesk what-is scheduled Tier 16 Jan 2027. */
export const webHostingAffiliateDeepenProductGuides = [
  buildProductWhatIsDeepenGuide("plesk", {
    scheduledAt: tier16ProductWhatIsScheduledAt("plesk"),
    variant: "affiliate",
    stamp: STAMP,
  }),
];
