import type { GuidePage } from "@/domain";
import { tier17GuideScheduledAt } from "@/data/config/publishing/tier-17-analytics-bi-launch-2027-02-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { howToChooseAnalyticsBiSoftwareGuide } from "./guides-how-to-choose-analytics-bi-software";
import { analyticsBiPricingGuide } from "./guides-analytics-bi-pricing-guide";
import { whatIsAnalyticsBiSoftwareGuide } from "./guides-what-is-analytics-bi-software";

function withTier17Schedule(guide: GuidePage): GuidePage {
  const scheduledAt = tier17GuideScheduledAt(guide.slug);
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

/** Analytics & BI category guides — February 2027 launch wave. */
export const analyticsBiCategoryGuides: GuidePage[] = [
  whatIsAnalyticsBiSoftwareGuide,
  howToChooseAnalyticsBiSoftwareGuide,
  analyticsBiPricingGuide,
  ...teachingExpansionFor("analytics-bi").map(withTier17Schedule),
];
