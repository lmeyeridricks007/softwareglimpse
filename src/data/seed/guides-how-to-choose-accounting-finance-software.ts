import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier3GuideScheduledAt } from "@/data/config/publishing/tier-3-accounting-finance-launch-2026-09-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "how-to-choose-accounting-finance-software";
const SCHEDULED_AT = tier3GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose accounting and finance software by the job blocking work — expense approvals, bookkeeper receipt capture, corporate T&E, or inventory/production — then confirm users, volume units, integrations, and plan gates. Shortlist only tools whose core product is your job; an expense app and a manufacturing ERP are different purchases even when both sit in this category.",
    bullets: [
      "Primary job to be done",
      "Users & volume units",
      "Must-have workflows",
      "Accounting / payroll integrations",
      "Policy & approval depth",
      "Trial with real receipts or SKUs",
    ],
  },
  {
    type: "key-takeaways",
    id: "takeaways",
    title: "What matters most",
    items: [
      {
        label: "Three jobs, three shortlists",
        body: "Expense, bookkeeping, and inventory ERP fail for different reasons. Pick the shape before the brand.",
      },
      {
        label: "Per-user vs per-transaction math changes TCO",
        body: "Seat floors, receipt volumes, and entity counts need a model — not a homepage tile.",
      },
      {
        label: "Integrations are part of fit",
        body: "Bank feeds, QBO/Xero, payroll, and ecommerce channels should be native where possible.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Should I buy one suite for everything?",
        answer:
          "Only if you will use multiple hubs weekly. Most SMBs start with the job creating rework — expenses, receipts, or production — then integrate.",
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

export const howToChooseAccountingFinanceSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-accounting-finance-software",
  slug: SLUG,
  title: "How to Choose Accounting & Finance Software",
  summary:
    "Pick expense, bookkeeping, T&E, or manufacturing ERP tools by primary job, volume, integrations, and plan gates.",
  categorySlugs: ["accounting-finance"],
  topicType: "selection",
  supports: [
    {
      contentId: "content:category:accounting-finance",
      relationType: "supports-anchor",
      primary: true,
    },
  ],
  relatedGuideSlugs: [
    "what-is-accounting-finance-software",
    "accounting-finance-pricing-guide",
    "accounting-finance-requirements-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "How to Choose Accounting & Finance Software | SoftwareGlimpse",
    description:
      "How to choose accounting and finance software by expense, bookkeeping, T&E, or manufacturing ERP job cluster.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
