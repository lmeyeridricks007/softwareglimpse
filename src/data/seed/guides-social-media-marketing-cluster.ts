import type { GuidePage } from "@/domain";
import { tier13GuideScheduledAt } from "@/data/config/publishing/tier-13-social-media-marketing-launch-2026-10-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { howToChooseSocialMediaMarketingSoftwareGuide } from "./guides-how-to-choose-social-media-marketing-software";
import { socialMediaMarketingPricingGuide } from "./guides-social-media-marketing-pricing-guide";
import { whatIsSocialMediaMarketingSoftwareGuide } from "./guides-what-is-social-media-marketing-software";

function withTier13Schedule(guide: GuidePage): GuidePage {
  const scheduledAt = tier13GuideScheduledAt(guide.slug);
  if (!scheduledAt) return guide;
  return {
    ...guide,
    metadata: {
      ...guide.metadata,
      status: "scheduled",
      scheduledAt,
    },
    seo: {
      ...guide.seo,
      indexable: false,
    },
  };
}

/** Social media marketing category guides — October 2026 launch wave. */
export const socialMediaMarketingCategoryGuides: GuidePage[] = [
  whatIsSocialMediaMarketingSoftwareGuide,
  howToChooseSocialMediaMarketingSoftwareGuide,
  socialMediaMarketingPricingGuide,
  ...teachingExpansionFor("social-media-marketing").map(withTier13Schedule),
];
