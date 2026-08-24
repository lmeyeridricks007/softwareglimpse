import type { GuidePage } from "@/domain";
import { tier25GuideScheduledAt } from "@/data/config/publishing/tier-25-dropshipping-pod-launch-2027-07-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { dropshippingPodPricingGuide } from "./guides-dropshipping-pod-pricing-guide";
import { howToChooseDropshippingPodSoftwareGuide } from "./guides-how-to-choose-dropshipping-pod-software";
import { whatIsDropshippingPodSoftwareGuide } from "./guides-what-is-dropshipping-pod-software";

function withTier25Schedule(guide: GuidePage): GuidePage {
  const scheduledAt = tier25GuideScheduledAt(guide.slug);
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

/** Dropshipping & POD subcategory guides — July 2027 launch wave. */
export const dropshippingPodCategoryGuides: GuidePage[] = [
  whatIsDropshippingPodSoftwareGuide,
  howToChooseDropshippingPodSoftwareGuide,
  dropshippingPodPricingGuide,
  ...teachingExpansionFor("dropshipping-pod").map(withTier25Schedule),
];
