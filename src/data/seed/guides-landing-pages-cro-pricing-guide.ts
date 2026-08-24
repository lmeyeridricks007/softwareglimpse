import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier32GuideScheduledAt } from "@/data/config/publishing/tier-32-landing-pages-cro-launch-2027-09-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "landing-pages-cro-pricing-guide";
const SCHEDULED_AT = tier32GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Landing pages and CRO pricing mixes published monthly tiers, traffic caps, and funnel feature gates. Leadpages Grow from $99/mo; Kartra Essentials from $59/mo ($52 annual); Freshmarketer Enterprise from $15/mo with contact bands — confirm live terms. Compare traffic limits, test quotas, and funnel checkout fees, not headline tiles alone.",
    bullets: [
      "Published monthly tiers",
      "Traffic and visitor limits",
      "A/B test quotas",
      "Funnel and checkout fees",
      "MAP or ESP bundles",
      "Annual vs monthly billing",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Model TCO for your traffic and funnel depth, then shortlist inside the landing and CRO cluster.",
    href: "/best/landing-pages-cro-software/",
    ctaLabel: "Best landing pages & CRO software →",
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

export const landingPagesCroPricingGuide: GuidePage = {
  id: "guide-landing-pages-cro-pricing-guide",
  slug: SLUG,
  title: "Landing Pages & CRO Software Pricing Guide",
  summary:
    "Published tiers, traffic limits, and funnel gates for landing page and CRO platforms.",
  categorySlugs: ["landing-pages-cro"],
  productSlugs: [],
  topicType: "pricing-education",
  journeyStage: "evaluate",
  supports: [
    {
      contentId: "content:category:landing-pages-cro",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-landing-pages-cro-software",
    "how-to-choose-landing-pages-cro-software",
    "landing-pages-cro-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "Landing Pages & CRO Software Pricing Guide | SoftwareGlimpse",
    description:
      "Compare published tiers, traffic limits, and funnel gates for landing page and CRO software.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
