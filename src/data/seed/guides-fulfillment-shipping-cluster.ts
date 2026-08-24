import type { GuidePage } from "@/domain";
import { tier26GuideScheduledAt } from "@/data/config/publishing/tier-26-fulfillment-shipping-launch-2027-07-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { fulfillmentShippingPricingGuide } from "./guides-fulfillment-shipping-pricing-guide";
import { howToChooseFulfillmentShippingSoftwareGuide } from "./guides-how-to-choose-fulfillment-shipping-software";
import { whatIsFulfillmentShippingSoftwareGuide } from "./guides-what-is-fulfillment-shipping-software";

function withTier26Schedule(guide: GuidePage): GuidePage {
  const scheduledAt = tier26GuideScheduledAt(guide.slug);
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

/** Fulfillment & shipping subcategory guides — July 2027 launch wave. */
export const fulfillmentShippingCategoryGuides: GuidePage[] = [
  whatIsFulfillmentShippingSoftwareGuide,
  howToChooseFulfillmentShippingSoftwareGuide,
  fulfillmentShippingPricingGuide,
  ...teachingExpansionFor("fulfillment-shipping").map(withTier26Schedule),
];
