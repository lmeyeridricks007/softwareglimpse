import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier20GuideScheduledAt } from "@/data/config/publishing/tier-20-ai-writing-launch-2027-05-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "ai-writing-pricing-guide";
const SCHEDULED_AT = tier20GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "AI writing pricing is usually free tier plus Premium annual plans — plus word/credit limits, team seats, and GEO feature gates. Decision rule: model the qualifying configuration for your real monthly word volume; never compare a paraphrasing Premium tile to an enterprise GEO quote.",
    bullets: [
      "Free tier limits",
      "Premium annual plans",
      "Words / credits",
      "Team seats",
      "GEO / AEO add-ons",
      "Annual vs monthly",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/best/ai-writing-software/",
    ctaLabel: "Best AI writing software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T18:30:00.000Z",
        reviewedAt: "2026-08-23T18:30:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T18:30:00.000Z",
        publishedAt: "2026-08-23T18:30:00.000Z",
        reviewedAt: "2026-08-23T18:30:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const aiWritingPricingGuide: GuidePage = {
  id: "guide-ai-writing-pricing-guide",
  slug: SLUG,
  title: "AI Writing Software Pricing Guide",
  summary:
    "Budget AI writing tools by qualifying word limits and Premium gates — not the advertised starter tile.",
  categorySlugs: ["ai-writing", "ai"],
  topicType: "pricing-education",
  supports: [
    {
      contentId: "content:category:ai-writing",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  journeyStage: "evaluate",
  relatedGuideSlugs: [
    "what-is-ai-writing-software",
    "how-to-choose-ai-writing-software",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "AI Writing Software Pricing Guide",
    description:
      "Understand how AI writing tools price free tiers, Premium plans, and word limits.",
    indexable: !SCHEDULED_AT,
    canonicalPath: "/guides/ai-writing-pricing-guide/",
  },
};
