import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier27GuideScheduledAt } from "@/data/config/publishing/tier-27-ats-recruiting-launch-2027-08-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-ats-recruiting-software";
const SCHEDULED_AT = tier27GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "ATS and recruiting software manages job postings, candidate pipelines, interview stages, offer workflows, and career sites — not payroll, shift scheduling, or time clocks. Decision rule: if the blocking job is structured hiring with scorecards and governance, shortlist Greenhouse-class tools; if it is SMB ATS with a transparent free tier, shortlist Breezy HR; if it is published-floor recruiting with trial, shortlist Workable — never rank those ATS clusters as one undifferentiated list.",
    bullets: [
      "Job postings and career sites",
      "Candidate pipelines and stages",
      "Interview scheduling and scorecards",
      "Offer and onboarding handoff",
      "Recruiting analytics",
      "Not payroll, WFM, or time clocks",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "ATS clusters differ",
        body: "Structured enterprise ATS, SMB free-tier ATS, and published-floor recruiting are different purchases — compare inside clusters.",
      },
      {
        label: "Subcategory under HR",
        body: "Use the parent HR Finder with recruiting as the primary job to shortlist.",
      },
      {
        label: "Pricing units matter",
        body: "Per-seat, employee-band, and recruiter-pool tiers change TCO more than headline tiles.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Shortlist by ATS job cluster, then run the HR Finder with recruiting as the primary job.",
    href: "/best/ats-recruiting-software/",
    ctaLabel: "Best ATS & recruiting software →",
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

export const whatIsAtsRecruitingSoftwareGuide: GuidePage = {
  id: "guide-what-is-ats-recruiting-software",
  slug: SLUG,
  title: "What Is ATS & Recruiting Software?",
  summary:
    "ATS and recruiting software for hiring pipelines, career sites, and interview workflows — distinct from payroll, WFM, and time clocks.",
  categorySlugs: ["ats-recruiting", "hr"],
  topicType: "fundamental",
  journeyStage: "learn",
  supports: [
    {
      contentId: "content:category:ats-recruiting",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "how-to-choose-ats-recruiting-software",
    "ats-recruiting-pricing-guide",
    "ats-recruiting-evaluation-guide",
    "ats-recruiting-vs-hr-software",
    "what-is-hr-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What Is ATS & Recruiting Software? | SoftwareGlimpse",
    description:
      "Hiring pipelines, career sites, and interview workflows — how ATS software differs from payroll and WFM.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
