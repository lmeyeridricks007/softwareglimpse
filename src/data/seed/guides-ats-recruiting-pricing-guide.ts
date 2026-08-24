import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier27GuideScheduledAt } from "@/data/config/publishing/tier-27-ats-recruiting-launch-2027-08-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "ats-recruiting-pricing-guide";
const SCHEDULED_AT = tier27GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "ATS pricing mixes per-seat monthly plans, employee-band tiers, and recruiter-pool packages. Breezy HR Bootstrap is free with paid Growth from $273/mo annual; Workable Standard is $299/mo annual for 1–20 employees; Greenhouse is quote-based by plan and hiring volume — confirm live terms. Compare pricing units and seat or employee limits, not headline tiles alone.",
    bullets: [
      "Per-seat vs employee-band tiers",
      "Free tiers and recruiter limits",
      "Job board and career-site add-ons",
      "Structured-hiring tier gates",
      "HRIS integration costs",
      "Annual vs monthly billing",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Model TCO for your open roles and recruiter seats, then shortlist inside the ATS cluster.",
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

export const atsRecruitingPricingGuide: GuidePage = {
  id: "guide-ats-recruiting-pricing-guide",
  slug: SLUG,
  title: "ATS & Recruiting Pricing Guide",
  summary:
    "Per-seat, employee-band, and recruiter-pool pricing for ATS and recruiting platforms.",
  categorySlugs: ["ats-recruiting", "hr"],
  productSlugs: [],
  topicType: "pricing-education",
  journeyStage: "evaluate",
  supports: [
    {
      contentId: "content:category:ats-recruiting",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-ats-recruiting-software",
    "how-to-choose-ats-recruiting-software",
    "ats-recruiting-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "ATS & Recruiting Pricing Guide | SoftwareGlimpse",
    description:
      "Compare per-seat, employee-band, and recruiter-pool pricing for ATS and recruiting software.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
