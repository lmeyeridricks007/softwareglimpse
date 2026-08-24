import type { GuidePage } from "@/domain";
import { tier15GuideScheduledAt } from "@/data/config/publishing/tier-15-lms-course-creation-launch-2026-12-01";
import { teachingExpansionFor } from "./guides-category-teaching-expansion";
import { howToChooseLmsCourseCreationSoftwareGuide } from "./guides-how-to-choose-lms-course-creation-software";
import { lmsCourseCreationPricingGuide } from "./guides-lms-course-creation-pricing-guide";
import { whatIsLmsCourseCreationSoftwareGuide } from "./guides-what-is-lms-course-creation-software";

function withTier15Schedule(guide: GuidePage): GuidePage {
  const scheduledAt = tier15GuideScheduledAt(guide.slug);
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

/** LMS & course creation category guides — December 2026 launch wave. */
export const lmsCourseCreationCategoryGuides: GuidePage[] = [
  whatIsLmsCourseCreationSoftwareGuide,
  howToChooseLmsCourseCreationSoftwareGuide,
  lmsCourseCreationPricingGuide,
  ...teachingExpansionFor("lms-course-creation").map(withTier15Schedule),
];
