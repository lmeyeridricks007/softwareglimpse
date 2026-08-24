import type { GuidePage } from "@/domain";
import { tier18GuideScheduledAt } from "@/data/config/publishing/tier-18-field-service-operations-launch-2027-03-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { howToChooseFieldServiceOperationsSoftwareGuide } from "./guides-how-to-choose-field-service-operations-software";
import { fieldServiceOperationsPricingGuide } from "./guides-field-service-operations-pricing-guide";
import { whatIsFieldServiceOperationsSoftwareGuide } from "./guides-what-is-field-service-operations-software";

function withTier18Schedule(guide: GuidePage): GuidePage {
  const scheduledAt = tier18GuideScheduledAt(guide.slug);
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

/** Field service & operations category guides — March 2027 launch wave. */
export const fieldServiceOperationsCategoryGuides: GuidePage[] = [
  whatIsFieldServiceOperationsSoftwareGuide,
  howToChooseFieldServiceOperationsSoftwareGuide,
  fieldServiceOperationsPricingGuide,
  ...teachingExpansionFor("field-service-operations").map(withTier18Schedule),
];
