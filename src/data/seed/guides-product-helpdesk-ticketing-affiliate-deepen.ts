import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T21:00:00.000Z";

const HELPDESK_AFFILIATE_SLUGS = ["freshdesk"] as const;

export const helpdeskTicketingAffiliateDeepenProductGuides =
  HELPDESK_AFFILIATE_SLUGS.map((productSlug) =>
    buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: undefined,
      variant: "affiliate",
      stamp: STAMP,
    }),
  );
