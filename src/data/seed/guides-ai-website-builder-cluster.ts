import type { GuidePage } from "@/domain";
import { tier21GuideScheduledAt } from "@/data/config/publishing/tier-21-ai-website-builder-launch-2027-05-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { howToChooseAiWebsiteBuilderSoftwareGuide } from "./guides-how-to-choose-ai-website-builder-software";
import { aiWebsiteBuilderPricingGuide } from "./guides-ai-website-builder-pricing-guide";
import { whatIsAiWebsiteBuilderSoftwareGuide } from "./guides-what-is-ai-website-builder-software";

function withTier21Schedule(guide: GuidePage): GuidePage {
  const scheduledAt = tier21GuideScheduledAt(guide.slug);
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

/** AI website builder subcategory guides — May 2027 launch wave. */
export const aiWebsiteBuilderCategoryGuides: GuidePage[] = [
  whatIsAiWebsiteBuilderSoftwareGuide,
  howToChooseAiWebsiteBuilderSoftwareGuide,
  aiWebsiteBuilderPricingGuide,
  ...teachingExpansionFor("ai-website-builder").map(withTier21Schedule),
];
