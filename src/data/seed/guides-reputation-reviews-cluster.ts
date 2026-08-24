import type { GuidePage } from "@/domain";
import { tier19GuideScheduledAt } from "@/data/config/publishing/tier-19-reputation-reviews-launch-2027-04-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { howToChooseReputationReviewsSoftwareGuide } from "./guides-how-to-choose-reputation-reviews-software";
import { reputationReviewsPricingGuide } from "./guides-reputation-reviews-pricing-guide";
import { whatIsReputationReviewsSoftwareGuide } from "./guides-what-is-reputation-reviews-software";

function withTier19Schedule(guide: GuidePage): GuidePage {
  const scheduledAt = tier19GuideScheduledAt(guide.slug);
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

/** Reputation & review management category guides — April 2027 launch wave. */
export const reputationReviewsCategoryGuides: GuidePage[] = [
  whatIsReputationReviewsSoftwareGuide,
  howToChooseReputationReviewsSoftwareGuide,
  reputationReviewsPricingGuide,
  ...teachingExpansionFor("reputation-reviews").map(withTier19Schedule),
];
