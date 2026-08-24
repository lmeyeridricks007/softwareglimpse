import {
  TIER_20_SCHEDULED_GUIDE_SLUGS,
  tier20ProductWhatIsScheduledAt,
} from "@/data/config/publishing/tier-20-ai-writing-launch-2027-05-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T18:30:00.000Z";

const TIER_20_AI_WRITING_PRODUCT_SLUGS = ["quillbot", "writesonic"] as const;

/** Tier 20 ai-writing launch — affiliate what-is guides (moved from Tier 5). */
export const aiWritingAffiliateDeepenProductGuides =
  TIER_20_AI_WRITING_PRODUCT_SLUGS.map((productSlug) =>
    buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier20ProductWhatIsScheduledAt(productSlug),
      variant: "affiliate",
      stamp: STAMP,
    }),
  );

export { TIER_20_SCHEDULED_GUIDE_SLUGS };
