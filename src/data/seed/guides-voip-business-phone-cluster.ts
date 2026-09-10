import type { GuidePageInput } from "@/domain";
import { tier22GuideScheduledAt } from "@/data/config/publishing/tier-22-voip-business-phone-launch-2027-06-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { howToChooseVoipBusinessPhoneSoftwareGuide } from "./guides-how-to-choose-voip-business-phone-software";
import { voipBusinessPhonePricingGuide } from "./guides-voip-business-phone-pricing-guide";
import { whatIsVoipBusinessPhoneSoftwareGuide } from "./guides-what-is-voip-business-phone-software";

function withTier22Schedule(guide: GuidePageInput): GuidePageInput {
  const scheduledAt = tier22GuideScheduledAt(guide.slug);
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

/** VoIP / business phone subcategory guides — June 2027 launch wave. */
export const voipBusinessPhoneCategoryGuides: GuidePageInput[] = [
  whatIsVoipBusinessPhoneSoftwareGuide,
  howToChooseVoipBusinessPhoneSoftwareGuide,
  voipBusinessPhonePricingGuide,
  ...teachingExpansionFor("voip-business-phone").map(withTier22Schedule),
];
