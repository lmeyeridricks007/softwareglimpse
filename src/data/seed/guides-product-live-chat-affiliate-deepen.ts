import { tier7CsProductScheduledAt } from "@/data/config/publishing/tier-7-cs-short-guides-launch-2026-11-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T20:00:00.000Z";

const LIVE_CHAT_AFFILIATE_PRODUCT_SLUGS = ["tidio", "freshchat"] as const;

function scheduledAtFor(productSlug: string): string | undefined {
  if (productSlug === "freshchat") {
    return tier7CsProductScheduledAt("freshchat");
  }
  // Tidio what-is published from Aug 2026 CS wave — not rescheduled in Tier 23.
  return undefined;
}

/** Tier 23 live-chat — affiliate what-is guides with live-chat category deepen links. */
export const liveChatAffiliateDeepenProductGuides =
  LIVE_CHAT_AFFILIATE_PRODUCT_SLUGS.map((productSlug) =>
    buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: scheduledAtFor(productSlug),
      variant: "affiliate",
      stamp: STAMP,
    }),
  );
