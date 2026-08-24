import { tier7CsProductScheduledAt } from "@/data/config/publishing/tier-7-cs-short-guides-launch-2026-11-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T22:00:00.000Z";

/** Tier 30 ITSM — Freshservice what-is scheduled Tier 7 Nov 2026. */
export const itsmAffiliateDeepenProductGuides = [
  buildProductWhatIsDeepenGuide("freshservice", {
    scheduledAt: tier7CsProductScheduledAt("freshservice"),
    variant: "affiliate",
    stamp: STAMP,
  }),
];
