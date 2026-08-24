import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

/**
 * Accounting & Finance category hub profile.
 */
export function buildAccountingFinanceCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "accounting-finance",
    shortName: "Accounting & Finance",
    displayName: "Accounting & Finance Software",
    tagline:
      "Find accounting and finance software that fits the job — expense management, bookkeeping automation, travel & expense, or inventory and manufacturing ERP.",
    definition:
      "Accounting and finance software helps teams capture receipts, manage expenses, close books, or plan production and inventory. The right tool matches the primary job — not a single list that ranks Navan against Dext or MRPeasy as if they were the same purchase.",
    iconSlug: "accounting-finance",
    decisionCriteria: [
      "Primary job fit",
      "Receipt & expense workflow depth",
      "Approval & policy controls",
      "Ledger / ERP integrations",
      "Reporting & close readiness",
      "Total cost (seats + volume + modules)",
    ],
    popularNeeds: [
      "Expense management",
      "Receipt capture",
      "Bookkeeping automation",
      "Travel & expense",
      "Bank reconciliation",
      "Inventory & MRP",
    ],
    chooseGuideHref: "/guides/how-to-choose-accounting-finance-software/",
    glance: {
      whatItDoes: [
        "Captures employee and corporate receipts",
        "Routes expenses for approval and reimbursement",
        "Automates categorisation for bookkeepers",
        "Books corporate travel with policy controls",
        "Reconciles bank feeds to the ledger",
        "Tracks stock, BOM, and production for manufacturers",
      ],
      bestFor: [
        "Ops leads tired of email expense threads",
        "Owners handing receipts to an external bookkeeper",
        "Finance teams rolling out T&E policy",
        "Small manufacturers outgrowing spreadsheets",
      ],
      typicalFeatures: [
        "Receipt capture",
        "Expense approvals",
        "Policy rules",
        "Bank feeds",
        "GL / accounting sync",
        "Inventory & BOM",
        "Production planning",
      ],
    },
    types: [
      {
        id: "expense",
        name: "Expense management",
        description: "Employee receipts, approvals, and reimbursements.",
        icon: "receipt",
        href: "/use-cases/expense-management/",
        ctaLabel: "Explore expense tools →",
      },
      {
        id: "bookkeeping",
        name: "Bookkeeping automation",
        description: "Receipt OCR and categorisation for owners and accountants.",
        icon: "book",
        href: "/use-cases/bookkeeping-automation/",
        ctaLabel: "Explore bookkeeping tools →",
      },
      {
        id: "te",
        name: "Travel & expense",
        description: "Corporate travel booking plus expense policy.",
        icon: "plane",
        href: "/use-cases/travel-expense/",
        ctaLabel: "Explore T&E platforms →",
      },
      {
        id: "erp",
        name: "Inventory & manufacturing ERP",
        description: "Stock, BOM, work orders, and shop-floor workflows.",
        icon: "factory",
        href: "/use-cases/inventory-erp/",
        ctaLabel: "Explore manufacturing ERP →",
      },
    ],
    tools: [
      {
        id: "finder",
        name: "Category finder",
        description: "Shortlist by expense vs bookkeeping vs ERP job.",
        href: "/tools/accounting-finance-finder/",
        icon: "search",
      },
    ],
    bestPageHref: "/best/accounting-finance-software/",
    finderHref: "/tools/accounting-finance-finder/",
    guides: [
      {
        label: "What is accounting & finance software?",
        href: "/guides/what-is-accounting-finance-software/",
      },
      {
        label: "How to choose",
        href: "/guides/how-to-choose-accounting-finance-software/",
      },
      {
        label: "Pricing guide",
        href: "/guides/accounting-finance-pricing-guide/",
      },
    ],
  });
}
