import type { GuidePage } from "@/domain";
import { tier32GuideScheduledAt } from "@/data/config/publishing/tier-32-landing-pages-cro-launch-2027-09-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { howToChooseLandingPagesCroSoftwareGuide } from "./guides-how-to-choose-landing-pages-cro-software";
import { landingPagesCroPricingGuide } from "./guides-landing-pages-cro-pricing-guide";
import { whatIsLandingPagesCroSoftwareGuide } from "./guides-what-is-landing-pages-cro-software";

function withTier32Schedule(guide: GuidePage): GuidePage {
  const scheduledAt = tier32GuideScheduledAt(guide.slug);
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

/** Landing pages & CRO subcategory guides — September 2027 launch wave. */
export const landingPagesCroCategoryGuides: GuidePage[] = [
  whatIsLandingPagesCroSoftwareGuide,
  howToChooseLandingPagesCroSoftwareGuide,
  landingPagesCroPricingGuide,
  ...teachingExpansionFor("landing-pages-cro").map(withTier32Schedule),
];
