import type { GuidePageInput } from "@/domain";
import { tier29GuideScheduledAt } from "@/data/config/publishing/tier-29-web-hosting-launch-2027-08-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { howToChooseWebHostingSoftwareGuide } from "./guides-how-to-choose-web-hosting-software";
import { webHostingPricingGuide } from "./guides-web-hosting-pricing-guide";
import { whatIsWebHostingSoftwareGuide } from "./guides-what-is-web-hosting-software";

function withTier29Schedule(guide: GuidePageInput): GuidePageInput {
  const scheduledAt = tier29GuideScheduledAt(guide.slug);
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

/** Web hosting subcategory guides — August 2027 launch wave. */
export const webHostingCategoryGuides: GuidePageInput[] = [
  whatIsWebHostingSoftwareGuide,
  howToChooseWebHostingSoftwareGuide,
  webHostingPricingGuide,
  ...teachingExpansionFor("web-hosting").map(withTier29Schedule),
];
