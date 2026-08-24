import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier28GuideScheduledAt } from "@/data/config/publishing/tier-28-time-attendance-launch-2027-08-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "time-attendance-pricing-guide";
const SCHEDULED_AT = tier28GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Time and attendance pricing mixes per-user monthly plans, unlimited-user free tiers, and frontline hub bundles. Jibble is free forever for unlimited users with Premium ~$4.49 and Ultimate ~$7.99/user/mo annual; Connecteam is free ≤10 users with paid hubs from $29/mo annual for the first 30 users — confirm live terms. Compare policy tier gates and hub packaging, not headline tiles alone.",
    bullets: [
      "Per-user vs unlimited-user free tiers",
      "GPS / geofence / face-recognition gates",
      "Frontline hub bundle pricing",
      "Payroll export add-ons",
      "Location and device limits",
      "Annual vs monthly billing",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Model TCO for your headcount and clock-in policies, then shortlist inside the time-clock cluster.",
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

export const timeAttendancePricingGuide: GuidePage = {
  id: "guide-time-attendance-pricing-guide",
  slug: SLUG,
  title: "Time & Attendance Pricing Guide",
  summary:
    "Per-user, free-tier, and frontline-hub pricing for time and attendance platforms.",
  categorySlugs: ["time-attendance", "hr"],
  productSlugs: [],
  topicType: "pricing-education",
  journeyStage: "evaluate",
  supports: [
    {
      contentId: "content:category:time-attendance",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-time-attendance-software",
    "how-to-choose-time-attendance-software",
    "time-attendance-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "Time & Attendance Pricing Guide | SoftwareGlimpse",
    description:
      "Compare per-user, free-tier, and hub-bundle pricing for time & attendance software.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
