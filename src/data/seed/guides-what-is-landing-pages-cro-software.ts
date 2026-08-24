import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier32GuideScheduledAt } from "@/data/config/publishing/tier-32-landing-pages-cro-launch-2027-09-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-landing-pages-cro-software";
const SCHEDULED_AT = tier32GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Landing pages and CRO software builds conversion-focused pages, runs A/B tests, and optimizes funnels — not permission-based email campaigns or broad MAP journeys. Decision rule: if the blocking job is standalone landing pages with testing, shortlist Leadpages-class builders; if it is funnel pages plus checkout inside one stack, shortlist Kartra-class platforms; if it is experimentation and behavioral CRO on live sites, shortlist Freshmarketer-class suites — never rank those landing and CRO clusters as one undifferentiated list.",
    bullets: [
      "Landing page builders",
      "Funnel page sequences",
      "A/B and multivariate tests",
      "Heatmaps and session replay",
      "Form and lead capture",
      "Not ESP campaigns",
      "Not MAP nurture only",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Landing and CRO clusters differ",
        body: "Page builders, funnel stacks, and on-site experimentation are different purchases — compare inside clusters.",
      },
      {
        label: "Distinct from email and MAP",
        body: "Email and MAP own subscriber journeys — landing and CRO own on-page conversion and funnel structure.",
      },
      {
        label: "Pricing units matter",
        body: "Published monthly tiers, traffic limits, and funnel gates change TCO more than starter tiles.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Shortlist by landing and CRO cluster, then confirm live commercial terms.",
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

export const whatIsLandingPagesCroSoftwareGuide: GuidePage = {
  id: "guide-what-is-landing-pages-cro-software",
  slug: SLUG,
  title: "What Is Landing Pages & CRO Software?",
  summary:
    "Landing page builders, funnel pages, and on-site experimentation — distinct from ESP campaigns and MAP nurture journeys.",
  categorySlugs: ["landing-pages-cro"],
  topicType: "fundamental",
  journeyStage: "learn",
  supports: [
    {
      contentId: "content:category:landing-pages-cro",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "how-to-choose-landing-pages-cro-software",
    "landing-pages-cro-pricing-guide",
    "landing-pages-cro-evaluation-guide",
    "landing-pages-cro-vs-marketing-software",
    "what-is-email-marketing",
    "what-is-marketing-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What Is Landing Pages & CRO Software? | SoftwareGlimpse",
    description:
      "Landing pages, funnel sequences, and on-site CRO — how page builders differ from ESP and MAP.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
