import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier33GuideScheduledAt } from "@/data/config/publishing/tier-33-ppc-advertising-launch-2027-09-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "ppc-advertising-pricing-guide";
const SCHEDULED_AT = tier33GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "PPC advertising pricing mixes ad spend bands, per-seat tiers, and managed-account packs. Birch Starter from $49/mo by ad spend managed; Diginius is quote-based by tier — confirm live terms. Compare spend bands, connected account limits, and automation gates, not headline tiles alone.",
    bullets: [
      "Ad spend managed bands",
      "Per-seat and workspace tiers",
      "Connected ad account limits",
      "Automation and rule gates",
      "Reporting and client packs",
      "Annual vs monthly billing",
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Model TCO for your ad spend and account count, then shortlist inside the PPC cluster.",
    href: "/best/ppc-advertising-software/",
    ctaLabel: "Best PPC advertising software →",
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

export const ppcAdvertisingPricingGuide: GuidePage = {
  id: "guide-ppc-advertising-pricing-guide",
  slug: SLUG,
  title: "PPC Advertising Software Pricing Guide",
  summary:
    "Ad spend bands, seat tiers, and account packs for PPC and paid social automation platforms.",
  categorySlugs: ["ppc-advertising"],
  productSlugs: [],
  topicType: "pricing-education",
  journeyStage: "evaluate",
  supports: [
    {
      contentId: "content:category:ppc-advertising",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-ppc-advertising-software",
    "how-to-choose-ppc-advertising-software",
    "ppc-advertising-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "PPC Advertising Software Pricing Guide | SoftwareGlimpse",
    description:
      "Compare ad spend bands, seat tiers, and account limits for PPC advertising software.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
