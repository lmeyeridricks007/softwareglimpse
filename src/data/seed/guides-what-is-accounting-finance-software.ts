import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";
import { tier3GuideScheduledAt } from "@/data/config/publishing/tier-3-accounting-finance-launch-2026-09-01";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const SLUG = "what-is-accounting-finance-software";
const SCHEDULED_AT = tier3GuideScheduledAt(SLUG);

const blocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Accounting and finance software helps teams close books, capture receipts, manage expenses, or run inventory and production — not CRM pipelines or generic project boards. Decision rule: if the blocking job is employee reimbursements or corporate T&E, shortlist expense tools (Navan-class); if it is receipt capture for your bookkeeper, shortlist bookkeeping automation (Dext-class); if it is BOM, stock, and shop-floor work, shortlist manufacturing ERP (MRPeasy-class) — never rank those jobs as one undifferentiated list.",
    bullets: [
      "Expense management",
      "Travel & expense (T&E)",
      "Bookkeeping automation",
      "General ledger / AP",
      "Inventory & manufacturing ERP",
      "Not a CRM",
      "Not a Work OS",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "The category holds several jobs",
        body: "Expense, bookkeeping, and inventory ERP fail for different reasons. Name the job before you shortlist.",
      },
      {
        label: "Finance software is not HR payroll by default",
        body: "Payroll system-of-record lives in HR. Finance tools may integrate with payroll but own receipts, expenses, ledgers, or production.",
      },
      {
        label: "Subscription is not the whole bill",
        body: "Per-user seats, entity counts, transaction volumes, and implementation fees often matter more than the starter tile.",
      },
      {
        label: "Manufacturing ERP is a different purchase",
        body: "MRP tools plan materials and production. They should not be ranked against expense apps or receipt scanners.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "af-building-blocks",
    title: "Accounting & finance software building blocks",
    steps: [
      { id: "capture", label: "Capture", short: "Receipts & feeds" },
      { id: "categorise", label: "Categorise", short: "Rules & GL codes" },
      { id: "approve", label: "Approve", short: "Policy & sign-off" },
      { id: "reconcile", label: "Reconcile", short: "Bank match" },
      { id: "report", label: "Report", short: "P&L & cash" },
      { id: "produce", label: "Produce", short: "BOM & MRP" },
    ],
    ctaHref: "/guides/how-to-choose-accounting-finance-software/",
    ctaLabel: "How to choose accounting & finance software →",
  },
  {
    type: "crm-types",
    id: "af-shapes",
    title: "Common accounting & finance software shapes (not rankings)",
    types: [
      {
        id: "expense",
        title: "Expense management",
        bestFor: "Employee receipts, approvals, reimbursements, and policy.",
        avoidWhen: "You need BOM, work orders, or shop-floor MRP.",
      },
      {
        id: "te",
        title: "Travel & expense (T&E)",
        bestFor: "Corporate travel booking plus expense policy in one stack.",
        avoidWhen: "You only need accountant-facing receipt capture.",
      },
      {
        id: "bookkeeping",
        title: "Bookkeeping automation",
        bestFor: "Owners and bookkeepers digitising receipts and categorisation.",
        avoidWhen: "Enterprise T&E policy is the blocking job.",
      },
      {
        id: "erp",
        title: "Inventory & manufacturing ERP",
        bestFor: "Small manufacturers tracking stock, BOM, and production.",
        avoidWhen: "You only need expense reports or receipt OCR.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Is accounting software the same as HR software?",
        answer:
          "No. HR software owns hiring, employee records, and payroll runs. Finance software owns receipts, expenses, ledgers, or production — though stacks often integrate.",
      },
      {
        question: "Where do Navan, Dext, and MRPeasy fit?",
        answer:
          "They are Wave-1 cluster anchors for T&E, bookkeeping automation, and manufacturing MRP respectively. Compare inside those jobs — see Best accounting & finance software for methodology-based editor's picks.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Name your primary job, then shortlist within that cluster.",
    href: "/best/accounting-finance-software/",
    ctaLabel: "See Best Accounting & Finance Software →",
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

export const whatIsAccountingFinanceSoftwareGuide: GuidePage = {
  id: "guide-what-is-accounting-finance-software",
  slug: SLUG,
  title: "What Is Accounting & Finance Software?",
  summary:
    "A clear definition of expense management, bookkeeping automation, travel & expense, and manufacturing ERP — and how they differ from CRM and HR payroll.",
  categorySlugs: ["accounting-finance"],
  topicType: "fundamental",
  supports: [
    {
      contentId: "content:category:accounting-finance",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:accounting-finance-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:guide:how-to-choose-accounting-finance-software",
    label: "How to choose accounting & finance software",
  },
  relatedGuideSlugs: [
    "how-to-choose-accounting-finance-software",
    "accounting-finance-pricing-guide",
    "accounting-finance-requirements-guide",
    "accounting-finance-evaluation-guide",
  ],
  blocks: blocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: metadata(),
  seo: {
    title: "What Is Accounting & Finance Software? | SoftwareGlimpse",
    description:
      "What is accounting and finance software? Expense management, bookkeeping automation, T&E, and manufacturing ERP — and how they differ from CRM and HR.",
    canonicalPath: `/guides/${SLUG}/`,
    indexable: !SCHEDULED_AT,
  },
};
