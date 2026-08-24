import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier21GuideScheduledAt } from "@/data/config/publishing/tier-21-ai-website-builder-launch-2027-05-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "ai-website-builder-pricing-guide";
const SCHEDULED_AT = tier21GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "AI website builder pricing mixes flat monthly plans, per-project limits, and generation credits. Wegic-class site tools often publish starter tiers around ~$12–15/mo; MindStudio Individual is ~$20/mo ($16 annual); Emergent uses custom/trial gates — confirm live terms before budgeting. Compare generation caps and publish limits, not headline tiles alone.",
    bullets: [
      "Flat monthly vs credit packs",
      "Free trial vs generation caps",
      "Publish / deploy limits",
      "Seat add-ons for teams",
      "Domain and hosting extras",
      "Annual vs monthly billing",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Model TCO for your build volume, then shortlist inside the job cluster.",
    href: "/best/ai-website-builder-software/",
    ctaLabel: "Best AI website builder software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T19:00:00.000Z",
        reviewedAt: "2026-08-23T19:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T19:00:00.000Z",
        publishedAt: "2026-08-23T19:00:00.000Z",
        reviewedAt: "2026-08-23T19:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const aiWebsiteBuilderPricingGuide: GuidePage = {
  id: "guide-ai-website-builder-pricing-guide",
  slug: SLUG,
  title: "AI Website Builder Pricing Guide",
  summary:
    "How AI website builders price generation credits, projects, and publish limits — by build cluster.",
  categorySlugs: ["ai-website-builder", "ai"],
  topicType: "pricing-education",
  supports: [
    {
      contentId: "content:category:ai-website-builder",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-ai-website-builder-software",
    "how-to-choose-ai-website-builder-software",
    "ai-website-builder-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "AI Website Builder Pricing Guide",
    description:
      "Compare AI website builder pricing — site generation, agent builders, and app dev platforms.",
    indexable: !SCHEDULED_AT,
    canonicalPath: "/guides/ai-website-builder-pricing-guide/",
  },
};
