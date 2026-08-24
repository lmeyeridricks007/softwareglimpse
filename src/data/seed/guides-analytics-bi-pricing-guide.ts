import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier17GuideScheduledAt } from "@/data/config/publishing/tier-17-analytics-bi-launch-2027-02-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "analytics-bi-pricing-guide";
const SCHEDULED_AT = tier17GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Analytics and BI pricing is usually per tracked source, per dashboard, or per seat — plus plan gates for connectors, call tracking numbers, and client accounts. Decision rule: model the qualifying configuration for your real data sources and reporting audience; never compare an attribution starter tile to an enterprise dashboard quote.",
    bullets: [
      "Data sources / connectors",
      "Tracked numbers / leads",
      "Dashboards & viewers",
      "Agency client accounts",
      "Alert & delivery add-ons",
      "Annual vs monthly",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/best/analytics-bi-software/",
    ctaLabel: "Best analytics & BI software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T17:00:00.000Z",
        reviewedAt: "2026-08-23T17:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T17:00:00.000Z",
        publishedAt: "2026-08-23T17:00:00.000Z",
        reviewedAt: "2026-08-23T17:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const analyticsBiPricingGuide: GuidePage = {
  id: "guide-analytics-bi-pricing-guide",
  slug: SLUG,
  title: "Analytics & BI Software Pricing Guide",
  summary:
    "Budget attribution and KPI dashboard tools by qualifying configuration — not the advertised starter tile.",
  categorySlugs: ["analytics-bi"],
  topicType: "pricing-education",
  supports: [
    {
      contentId: "content:category:analytics-bi",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  journeyStage: "evaluate",
  relatedGuideSlugs: [
    "what-is-analytics-bi-software",
    "how-to-choose-analytics-bi-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "Analytics & BI Software Pricing Guide",
    description:
      "Understand how attribution and KPI dashboard tools price connectors, seats, and tracked sources.",
    indexable: !SCHEDULED_AT,
    canonicalPath: "/guides/analytics-bi-pricing-guide/",
  },
};
