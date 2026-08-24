import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier27GuideScheduledAt } from "@/data/config/publishing/tier-27-ats-recruiting-launch-2027-08-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-ats-recruiting-software";
const SCHEDULED_AT = tier27GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose ATS and recruiting software by the hiring job blocking work — structured enterprise ATS, SMB free-tier ATS, or published-floor recruiting — then confirm pricing unit (seats vs employee bands vs recruiter pools), pipeline stages, career site depth, and HRIS integrations. Shortlist only tools whose core product is applicant tracking, not payroll, WFM, or time clocks.",
    bullets: [
      "Primary ATS job cluster",
      "Per-seat vs employee-band pricing",
      "Pipeline stages and scorecards",
      "Career site and job boards",
      "HRIS / onboarding integrations",
      "Trial with one real requisition",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by ATS cluster, then confirm live commercial terms.",
    href: "/tools/hr-finder/",
    ctaLabel: "HR Finder (ATS primary) →",
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

export const howToChooseAtsRecruitingSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-ats-recruiting-software",
  slug: SLUG,
  title: "How to Choose ATS & Recruiting Software",
  summary:
    "Pick ATS tools by hiring job cluster — structured enterprise, SMB free-tier, or published-floor recruiting — not as one generic list.",
  categorySlugs: ["ats-recruiting", "hr"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:ats-recruiting",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-ats-recruiting-software",
    "ats-recruiting-pricing-guide",
    "ats-recruiting-evaluation-guide",
    "ats-recruiting-vs-hr-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose ATS & Recruiting Software | SoftwareGlimpse",
    description:
      "Choose ATS software by hiring job cluster, pricing unit, pipeline depth, and HRIS integrations.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
