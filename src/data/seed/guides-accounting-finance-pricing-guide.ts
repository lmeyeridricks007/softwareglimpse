import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier3GuideScheduledAt } from "@/data/config/publishing/tier-3-accounting-finance-launch-2026-09-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "accounting-finance-pricing-guide";
const SCHEDULED_AT = tier3GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Accounting and finance software pricing is usually per user, per entity, or per transaction/receipt — plus plan gates for approvals, multi-entity, or MRP modules. Decision rule: model the qualifying configuration for your real headcount and monthly receipt or SKU volume; never compare starter tiles across different job clusters.",
    bullets: [
      "Users / seats",
      "Entities / companies",
      "Receipts / transactions",
      "Plan feature gates",
      "Implementation fees",
      "Annual vs monthly",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Gates are part of the price",
        body: "Multi-entity, approval chains, and production modules often unlock on higher tiers.",
      },
      {
        label: "Expense and ERP units differ",
        body: "Per-seat T&E and per-SKU MRP need different volume models — do not compare tiles alone.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/best/accounting-finance-software/",
    ctaLabel: "Best accounting & finance software →",
    variant: "finder",
  },
];

function metadata(): GuidePage["metadata"] {
  return SCHEDULED_AT
    ? {
        status: "scheduled",
        scheduledAt: SCHEDULED_AT,
        updatedAt: "2026-08-23T12:00:00.000Z",
        reviewedAt: "2026-08-23T12:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      }
    : {
        status: "published",
        updatedAt: "2026-08-23T12:00:00.000Z",
        publishedAt: "2026-08-23T12:00:00.000Z",
        reviewedAt: "2026-08-23T12:00:00.000Z",
        researchStatus: "complete",
        author: "author-lee-meyeridricks",
      };
}

export const accountingFinancePricingGuide: GuidePage = {
  id: "guide-accounting-finance-pricing-guide",
  slug: SLUG,
  title: "Accounting & Finance Software Pricing Guide",
  summary:
    "Budget expense, bookkeeping, T&E, and manufacturing ERP tools by qualifying configuration — not the advertised starter tile.",
  categorySlugs: ["accounting-finance"],
  topicType: "pricing-education",
  supports: [
    {
      contentId: "content:category:accounting-finance",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  journeyStage: "evaluate",
  relatedGuideSlugs: [
    "what-is-accounting-finance-software",
    "how-to-choose-accounting-finance-software",
    "accounting-finance-requirements-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "Accounting & Finance Software Pricing Guide | SoftwareGlimpse",
    description:
      "How to budget accounting and finance software — users, entities, receipt volume, plan gates, and add-ons.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
