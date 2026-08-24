import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier30GuideScheduledAt } from "@/data/config/publishing/tier-30-itsm-launch-2027-08-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "itsm-pricing-guide";
const SCHEDULED_AT = tier30GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "ITSM pricing mixes per-agent monthly plans, asset-pack tiers, and enterprise ITIL packaging. Freshservice Starter is $19/agent/mo annual, Growth $49, and Pro $99 — confirm live terms for CMDB, change, and automation gates. Compare per-agent tiers and asset limits, not headline tiles alone.",
    bullets: [
      "Per-agent monthly tiers",
      "CMDB and asset-pack gates",
      "Change and release management tiers",
      "Automation and orchestration add-ons",
      "Employee self-service portal limits",
      "Annual vs monthly billing",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Model TCO for your agent count and asset inventory, then shortlist inside the ITSM cluster.",
    href: "/best/itsm-software/",
    ctaLabel: "Best ITSM software →",
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

export const itsmPricingGuide: GuidePage = {
  id: "guide-itsm-pricing-guide",
  slug: SLUG,
  title: "ITSM Pricing Guide",
  summary:
    "Per-agent tiers, asset packs, and ITIL packaging for ITSM and internal service desk platforms.",
  categorySlugs: ["itsm", "it-development"],
  productSlugs: [],
  topicType: "pricing-education",
  journeyStage: "evaluate",
  supports: [
    {
      contentId: "content:category:itsm",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-itsm-software",
    "how-to-choose-itsm-software",
    "itsm-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "ITSM Pricing Guide | SoftwareGlimpse",
    description:
      "Compare per-agent, asset-pack, and ITIL tier pricing for ITSM software.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
