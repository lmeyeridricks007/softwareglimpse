import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier28GuideScheduledAt } from "@/data/config/publishing/tier-28-time-attendance-launch-2027-08-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-time-attendance-software";
const SCHEDULED_AT = tier28GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose time and attendance software by the clock-in job blocking work — dedicated GPS/face-recognition time clocks or frontline hubs with attendance as a co-primary hub — then confirm pricing unit (per-user vs hub bundles), geofence and policy depth, and payroll export integrations. Shortlist only tools whose core product is attendance capture, not ATS pipelines or scheduling-only WFM.",
    bullets: [
      "Primary time-clock job",
      "Dedicated clock vs frontline hub",
      "GPS / geofence / face recognition",
      "Overtime and break policies",
      "Payroll / HRIS exports",
      "Trial with one real shift week",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by time-clock cluster, then confirm live commercial terms.",
    href: "/tools/hr-finder/",
    ctaLabel: "HR Finder (time primary) →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T21:00:00.000Z",
        reviewedAt: "2026-08-23T21:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T21:00:00.000Z",
        publishedAt: "2026-08-23T21:00:00.000Z",
        reviewedAt: "2026-08-23T21:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const howToChooseTimeAttendanceSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-time-attendance-software",
  slug: SLUG,
  title: "How to Choose Time & Attendance Software",
  summary:
    "Pick time-clock tools by dedicated attendance vs frontline-hub cluster — not as one generic WFM list.",
  categorySlugs: ["time-attendance", "hr"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:time-attendance",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-time-attendance-software",
    "time-attendance-pricing-guide",
    "time-attendance-evaluation-guide",
    "time-attendance-vs-hr-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose Time & Attendance Software | SoftwareGlimpse",
    description:
      "Choose time & attendance software by clock-in job, policy depth, and payroll integrations.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
