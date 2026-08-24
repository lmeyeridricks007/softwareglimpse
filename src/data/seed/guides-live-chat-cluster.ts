import type { GuidePage } from "@/domain";
import { tier23GuideScheduledAt } from "@/data/config/publishing/tier-23-live-chat-launch-2027-07-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { howToChooseLiveChatSoftwareGuide } from "./guides-how-to-choose-live-chat-software";
import { liveChatPricingGuide } from "./guides-live-chat-pricing-guide";
import { whatIsLiveChatSoftwareGuide } from "./guides-what-is-live-chat-software";

function withTier23Schedule(guide: GuidePage): GuidePage {
  const scheduledAt = tier23GuideScheduledAt(guide.slug);
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

/** Live chat subcategory guides — July 2027 launch wave. */
export const liveChatCategoryGuides: GuidePage[] = [
  whatIsLiveChatSoftwareGuide,
  howToChooseLiveChatSoftwareGuide,
  liveChatPricingGuide,
  ...teachingExpansionFor("live-chat").map(withTier23Schedule),
];
