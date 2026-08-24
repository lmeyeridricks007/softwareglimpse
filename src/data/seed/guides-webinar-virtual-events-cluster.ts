import type { GuidePage } from "@/domain";
import { tier14GuideScheduledAt } from "@/data/config/publishing/tier-14-webinar-virtual-events-launch-2026-11-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { howToChooseWebinarVirtualEventsSoftwareGuide } from "./guides-how-to-choose-webinar-virtual-events-software";
import { webinarVirtualEventsPricingGuide } from "./guides-webinar-virtual-events-pricing-guide";
import { whatIsWebinarVirtualEventsSoftwareGuide } from "./guides-what-is-webinar-virtual-events-software";

function withTier14Schedule(guide: GuidePage): GuidePage {
  const scheduledAt = tier14GuideScheduledAt(guide.slug);
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

/** Webinar & virtual events category guides — November 2026 launch wave. */
export const webinarVirtualEventsCategoryGuides: GuidePage[] = [
  whatIsWebinarVirtualEventsSoftwareGuide,
  howToChooseWebinarVirtualEventsSoftwareGuide,
  webinarVirtualEventsPricingGuide,
  ...teachingExpansionFor("webinar-virtual-events").map(withTier14Schedule),
];
