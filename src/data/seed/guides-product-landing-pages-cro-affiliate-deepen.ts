import { tier11ProductScheduledAt } from "@/data/config/publishing/tier-11-marketing-affiliate-launch-2027-01-11";
import { tier16ProductWhatIsScheduledAt } from "@/data/config/publishing/tier-16-website-digital-presence-launch-2027-01-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T23:00:00.000Z";

const LANDING_PAGES_CRO_AFFILIATE_SLUGS = ["kartra", "freshmarketer", "leadpages"] as const;

function scheduledAtFor(productSlug: string): string | undefined {
  if (productSlug === "kartra") {
    return tier11ProductScheduledAt("kartra");
  }
  if (productSlug === "leadpages") {
    return tier16ProductWhatIsScheduledAt("leadpages");
  }
  return undefined;
}

export const landingPagesCroAffiliateDeepenProductGuides =
  LANDING_PAGES_CRO_AFFILIATE_SLUGS.map((productSlug) =>
    buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: scheduledAtFor(productSlug),
      variant: "affiliate",
      stamp: STAMP,
    }),
  );
