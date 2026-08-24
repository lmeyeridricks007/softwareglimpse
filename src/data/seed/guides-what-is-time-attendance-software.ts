import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier28GuideScheduledAt } from "@/data/config/publishing/tier-28-time-attendance-launch-2027-08-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-time-attendance-software";
const SCHEDULED_AT = tier28GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Time and attendance software captures clock-in/out, timesheets, GPS or geofence policies, and attendance reporting — not full hiring pipelines or frontline scheduling suites. Decision rule: if the blocking job is dedicated GPS/face-recognition time clocks with a generous free tier, shortlist Jibble-class tools; if it is frontline hubs where scheduling and comms are co-primary, shortlist Connecteam — never rank pure time clocks and full WFM suites as one undifferentiated list.",
    bullets: [
      "Clock-in / clock-out capture",
      "GPS, geofence, and face recognition",
      "Timesheets and attendance policies",
      "Overtime and break rules",
      "Payroll export integrations",
      "Not ATS pipelines or full WFM",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Time clocks differ from WFM",
        body: "Dedicated attendance tools and frontline WFM hubs are different purchases — compare inside clusters.",
      },
      {
        label: "Subcategory under HR",
        body: "Use the parent HR Finder with time & attendance as the primary job to shortlist.",
      },
      {
        label: "Free tiers and policy depth",
        body: "Unlimited-user free plans and geofence tier gates change TCO more than headline tiles.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Shortlist by time-clock cluster, then run the HR Finder with attendance as the primary job.",
    href: "/best/time-attendance-software/",
    ctaLabel: "Best time & attendance software →",
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

export const whatIsTimeAttendanceSoftwareGuide: GuidePage = {
  id: "guide-what-is-time-attendance-software",
  slug: SLUG,
  title: "What Is Time & Attendance Software?",
  summary:
    "Time and attendance software for clock-in, timesheets, and attendance policies — distinct from ATS pipelines and full WFM suites.",
  categorySlugs: ["time-attendance", "hr"],
  topicType: "fundamental",
  journeyStage: "learn",
  supports: [
    {
      contentId: "content:category:time-attendance",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "how-to-choose-time-attendance-software",
    "time-attendance-pricing-guide",
    "time-attendance-evaluation-guide",
    "time-attendance-vs-hr-software",
    "what-is-hr-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What Is Time & Attendance Software? | SoftwareGlimpse",
    description:
      "Clock-in, timesheets, and attendance policies — how time software differs from ATS and WFM.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
