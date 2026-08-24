import {
  TIER_15_SCHEDULED_GUIDE_SLUGS,
  tier15ProductWhatIsScheduledAt,
} from "@/data/config/publishing/tier-15-lms-course-creation-launch-2026-12-01";
import { buildProductWhatIsDeepenGuide } from "@/services/product-guides/affiliate-deepen";

const STAMP = "2026-08-23T16:00:00.000Z";

const TIER_15_LMS_PRODUCT_SLUGS = [
  "learnworlds",
  "trainual",
  "flexiquiz",
] as const;

/** Tier 15 lms-course-creation launch — affiliate what-is guides (moved from Tier 9/11). */
export const lmsCourseCreationAffiliateDeepenProductGuides =
  TIER_15_LMS_PRODUCT_SLUGS.map((productSlug) => {
    const guideSlug = `what-is-${productSlug}`;
    return buildProductWhatIsDeepenGuide(productSlug, {
      scheduledAt: tier15ProductWhatIsScheduledAt(productSlug),
      variant: "affiliate",
      stamp: STAMP,
    });
  });

export { TIER_15_SCHEDULED_GUIDE_SLUGS };
