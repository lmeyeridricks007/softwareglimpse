import type { GuidePage } from "@/domain";
import { tier30GuideScheduledAt } from "@/data/config/publishing/tier-30-itsm-launch-2027-08-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { howToChooseItsmSoftwareGuide } from "./guides-how-to-choose-itsm-software";
import { itsmPricingGuide } from "./guides-itsm-pricing-guide";
import { whatIsItsmSoftwareGuide } from "./guides-what-is-itsm-software";

function withTier30Schedule(guide: GuidePage): GuidePage {
  const scheduledAt = tier30GuideScheduledAt(guide.slug);
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

/** ITSM subcategory guides — August 2027 launch wave. */
export const itsmCategoryGuides: GuidePage[] = [
  whatIsItsmSoftwareGuide,
  howToChooseItsmSoftwareGuide,
  itsmPricingGuide,
  ...teachingExpansionFor("itsm").map(withTier30Schedule),
];
