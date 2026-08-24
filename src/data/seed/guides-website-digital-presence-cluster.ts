import type { GuidePage } from "@/domain";
import { tier16GuideScheduledAt } from "@/data/config/publishing/tier-16-website-digital-presence-launch-2027-01-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { howToChooseWebsiteDigitalPresenceSoftwareGuide } from "./guides-how-to-choose-website-digital-presence-software";
import { websiteDigitalPresencePricingGuide } from "./guides-website-digital-presence-pricing-guide";
import { whatIsWebsiteDigitalPresenceSoftwareGuide } from "./guides-what-is-website-digital-presence-software";

function withTier16Schedule(guide: GuidePage): GuidePage {
  const scheduledAt = tier16GuideScheduledAt(guide.slug);
  if (!scheduledAt) return guide;
  return {
    ...guide,
    metadata: { ...guide.metadata, status: "scheduled", scheduledAt },
    seo: { ...guide.seo, indexable: false },
  };
}

/** Website & digital presence category guides — January 2027 launch wave. */
export const websiteDigitalPresenceCategoryGuides: GuidePage[] = [
  whatIsWebsiteDigitalPresenceSoftwareGuide,
  howToChooseWebsiteDigitalPresenceSoftwareGuide,
  websiteDigitalPresencePricingGuide,
  ...teachingExpansionFor("website-digital-presence").map(withTier16Schedule),
];
