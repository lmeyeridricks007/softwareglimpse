import type { GuidePage } from "@/domain";
import { tier27GuideScheduledAt } from "@/data/config/publishing/tier-27-ats-recruiting-launch-2027-08-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { atsRecruitingPricingGuide } from "./guides-ats-recruiting-pricing-guide";
import { howToChooseAtsRecruitingSoftwareGuide } from "./guides-how-to-choose-ats-recruiting-software";
import { whatIsAtsRecruitingSoftwareGuide } from "./guides-what-is-ats-recruiting-software";

function withTier27Schedule(guide: GuidePage): GuidePage {
  const scheduledAt = tier27GuideScheduledAt(guide.slug);
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

/** ATS & recruiting subcategory guides — August 2027 launch wave. */
export const atsRecruitingCategoryGuides: GuidePage[] = [
  whatIsAtsRecruitingSoftwareGuide,
  howToChooseAtsRecruitingSoftwareGuide,
  atsRecruitingPricingGuide,
  ...teachingExpansionFor("ats-recruiting").map(withTier27Schedule),
];
