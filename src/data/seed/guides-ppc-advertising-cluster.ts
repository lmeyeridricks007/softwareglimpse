import type { GuidePageInput } from "@/domain";
import { tier33GuideScheduledAt } from "@/data/config/publishing/tier-33-ppc-advertising-launch-2027-09-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { howToChoosePpcAdvertisingSoftwareGuide } from "./guides-how-to-choose-ppc-advertising-software";
import { ppcAdvertisingPricingGuide } from "./guides-ppc-advertising-pricing-guide";
import { whatIsPpcAdvertisingSoftwareGuide } from "./guides-what-is-ppc-advertising-software";

function withTier33Schedule(guide: GuidePageInput): GuidePageInput {
  const scheduledAt = tier33GuideScheduledAt(guide.slug);
  if (!scheduledAt) return guide;
  return {
    ...guide,
    metadata: {
      ...guide.metadata,
      status: "scheduled",
      scheduledAt,
    },
  };
}

/** PPC advertising subcategory guides — September 2027 launch wave. */
export const ppcAdvertisingCategoryGuides: GuidePageInput[] = [
  whatIsPpcAdvertisingSoftwareGuide,
  howToChoosePpcAdvertisingSoftwareGuide,
  ppcAdvertisingPricingGuide,
  ...teachingExpansionFor("ppc-advertising").map(withTier33Schedule),
];
