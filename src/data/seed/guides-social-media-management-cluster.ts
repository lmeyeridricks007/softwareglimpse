import type { GuidePage } from "@/domain";
import { tier31GuideScheduledAt } from "@/data/config/publishing/tier-31-social-media-management-launch-2027-09-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { howToChooseSocialMediaManagementSoftwareGuide } from "./guides-how-to-choose-social-media-management-software";
import { socialMediaManagementPricingGuide } from "./guides-social-media-management-pricing-guide";
import { whatIsSocialMediaManagementSoftwareGuide } from "./guides-what-is-social-media-management-software";

function withTier31Schedule(guide: GuidePage): GuidePage {
  const scheduledAt = tier31GuideScheduledAt(guide.slug);
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

/** Social media management subcategory guides — September 2027 launch wave. */
export const socialMediaManagementCategoryGuides: GuidePage[] = [
  whatIsSocialMediaManagementSoftwareGuide,
  howToChooseSocialMediaManagementSoftwareGuide,
  socialMediaManagementPricingGuide,
  ...teachingExpansionFor("social-media-management").map(withTier31Schedule),
];
