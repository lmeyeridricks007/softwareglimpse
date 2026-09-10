import type { GuidePageInput } from "@/domain";
import { tier28GuideScheduledAt } from "@/data/config/publishing/tier-28-time-attendance-launch-2027-08-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { howToChooseTimeAttendanceSoftwareGuide } from "./guides-how-to-choose-time-attendance-software";
import { timeAttendancePricingGuide } from "./guides-time-attendance-pricing-guide";
import { whatIsTimeAttendanceSoftwareGuide } from "./guides-what-is-time-attendance-software";

function withTier28Schedule(guide: GuidePageInput): GuidePageInput {
  const scheduledAt = tier28GuideScheduledAt(guide.slug);
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

/** Time & attendance subcategory guides — August 2027 launch wave. */
export const timeAttendanceCategoryGuides: GuidePageInput[] = [
  whatIsTimeAttendanceSoftwareGuide,
  howToChooseTimeAttendanceSoftwareGuide,
  timeAttendancePricingGuide,
  ...teachingExpansionFor("time-attendance").map(withTier28Schedule),
];
