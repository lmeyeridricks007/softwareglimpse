import {
  TIER_21_SCHEDULED_GUIDE_SLUGS,
  tier21ProductWhatIsScheduledAt,
} from "@/data/config/publishing/tier-21-ai-website-builder-launch-2027-05-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T19:00:00.000Z";

const TIER_21_AI_WEBSITE_BUILDER_PRODUCT_SLUGS = [
  "wegic",
  "mindstudio",
  "emergent",
] as const;

/** Tier 21 ai-website-builder launch — affiliate what-is guides (moved from Tier 5/16). */
export const aiWebsiteBuilderAffiliateDeepenProductGuides =
  TIER_21_AI_WEBSITE_BUILDER_PRODUCT_SLUGS.map((productSlug) =>
    buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier21ProductWhatIsScheduledAt(productSlug),
      variant: "affiliate",
      stamp: STAMP,
    }),
  );

export { TIER_21_SCHEDULED_GUIDE_SLUGS };
