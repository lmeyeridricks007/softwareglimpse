import type { GuidePageInput } from "@/domain";
import { tier20GuideScheduledAt } from "@/data/config/publishing/tier-20-ai-writing-launch-2027-05-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { howToChooseAiWritingSoftwareGuide } from "./guides-how-to-choose-ai-writing-software";
import { aiWritingPricingGuide } from "./guides-ai-writing-pricing-guide";
import { whatIsAiWritingSoftwareGuide } from "./guides-what-is-ai-writing-software";

function withTier20Schedule(guide: GuidePageInput): GuidePageInput {
  const scheduledAt = tier20GuideScheduledAt(guide.slug);
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

/** AI writing subcategory guides — May 2027 launch wave. */
export const aiWritingCategoryGuides: GuidePageInput[] = [
  whatIsAiWritingSoftwareGuide,
  howToChooseAiWritingSoftwareGuide,
  aiWritingPricingGuide,
  ...teachingExpansionFor("ai-writing").map(withTier20Schedule),
];
