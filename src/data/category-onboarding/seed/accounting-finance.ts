import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * Accounting & Finance decision-domain definition v1.0.
 * Expense management, bookkeeping automation, travel & expense, and inventory/manufacturing ERP.
 */
export const accountingFinanceDefinition: CategoryDefinition =
  CategoryDefinitionSchema.parse({
    id: "cat-def-accounting-finance-v1",
    slug: "accounting-finance",
    name: "Accounting & Finance",
    shortDescription:
      "Expense management, receipt capture, bookkeeping automation, travel & expense, and inventory/manufacturing ERP for SMB finance ops.",
    parentSlug: null,
    aliases: [
      "accounting software",
      "bookkeeping software",
      "expense management software",
      "finance software",
      "accounts payable software",
      "manufacturing ERP software",
    ],
    lifecycle: "active",
    configVersion: "1.0.0",
    scope: {
      definition:
        "Software whose primary job is closing books, capturing receipts, managing employee or corporate expenses, reconciling accounts, or running inventory/production for manufacturers — not CRM pipelines, generic project boards, or HRIS payroll system-of-record unless finance ops is the stated buyer job.",
      includes: [
        { id: "inc-expense", label: "Expense management & corporate cards" },
        { id: "inc-te", label: "Travel & expense (T&E) platforms" },
        {
          id: "inc-bookkeeping",
          label: "Bookkeeping / receipt capture automation",
        },
        {
          id: "inc-ledger",
          label: "General ledger & accounts payable (SMB accounting suites)",
        },
        {
          id: "inc-inventory-erp",
          label: "Inventory & manufacturing ERP / MRP",
        },
      ],
      excludes: [
        {
          id: "exc-crm",
          label: "Primary CRM / sales pipeline systems",
          notes: "Prefer crm",
        },
        {
          id: "exc-payroll-only",
          label: "Payroll / benefits system-of-record without finance-ops core",
          notes:
            "Gusto-class payroll stays hr-primary; expense tools may integrate with payroll",
        },
        {
          id: "exc-pm-only",
          label: "Work OS / Kanban boards without inventory or GL depth",
          notes: "Prefer project-management for generic task boards",
        },
        {
          id: "exc-3pl",
          label: "Third-party logistics without finance SKU",
          notes: "Fulfillment services are not accounting software",
        },
      ],
      adjacentCategorySlugs: ["hr", "project-management", "ecommerce", "crm"],
      classificationNotes: [
        "Navan is travel-expense / corporate T&E primary — not core HRIS or payroll",
        "Dext is bookkeeping-automation primary — not payroll or WFM",
        "MRPeasy is inventory-erp / manufacturing MRP primary — not a Work OS peer",
        "Expense tools, bookkeeping apps, and manufacturing ERP are distinct job clusters — never one undifferentiated rank",
        "HR payroll platforms may integrate with finance tools but stay hr-primary when pay runs are the job",
      ],
    },
    features: [
      feat(
        "receipt-capture",
        "Receipt capture",
        "Mobile and email receipt ingestion with OCR and categorisation.",
        "core",
        true,
        true,
      ),
      feat(
        "expense-management",
        "Expense management",
        "Employee expense submission, approval workflows, and reimbursement.",
        "core",
        true,
        true,
      ),
      feat(
        "bookkeeping-automation",
        "Bookkeeping automation",
        "Automated categorisation, accountant collaboration, and ledger sync.",
        "core",
        true,
        true,
      ),
      feat(
        "bank-reconciliation",
        "Bank reconciliation",
        "Bank feed matching and reconciliation workflows.",
        "important",
        true,
        true,
      ),
      feat(
        "general-ledger",
        "General ledger",
        "Chart of accounts, journal entries, and period close.",
        "important",
        true,
        true,
      ),
      feat(
        "accounts-payable",
        "Accounts payable",
        "Vendor bills, approval, and payment scheduling.",
        "important",
        true,
        true,
      ),
      feat(
        "financial-reporting",
        "Financial reporting",
        "P&L, balance sheet, cash flow, and management reports.",
        "important",
        true,
        true,
      ),
      feat(
        "inventory-management",
        "Inventory management",
        "Stock levels, warehouses, and valuation.",
        "specialist",
        true,
        true,
        "Required for inventory-erp cluster; not required of expense-only tools.",
      ),
      feat(
        "manufacturing-mrp",
        "Manufacturing MRP",
        "BOM, work orders, production planning, and shop-floor tracking.",
        "specialist",
        true,
        true,
        "Manufacturing ERP cluster only.",
      ),
      feat(
        "payroll-processing",
        "Payroll processing",
        "Pay runs and tax filings when bundled as finance suite.",
        "optional",
        true,
        false,
        "If payroll is the primary job, prefer hr.",
      ),
    ],
    researchRequirements: [
      { domain: "identity", level: "required", featureSlugs: [] },
      {
        domain: "pricing",
        level: "required",
        featureSlugs: [],
        notes: "Per-user, per-entity, transaction, and GMV-style units",
      },
      { domain: "plans", level: "required", featureSlugs: [] },
      { domain: "features", level: "required", featureSlugs: ["receipt-capture", "expense-management", "bookkeeping-automation"] },
      { domain: "integrations", level: "required", featureSlugs: [] },
      { domain: "limits", level: "required", featureSlugs: [] },
      { domain: "free-trial", level: "recommended", featureSlugs: [] },
      { domain: "security-compliance", level: "recommended", featureSlugs: [] },
    ],
    editorialMethodology: {
      id: "methodology-accounting-finance-v1",
      slug: "accounting-finance-editorial",
      name: "Accounting & Finance Editorial Methodology",
      version: "1.0.0",
      categorySlug: "accounting-finance",
      description:
        "SoftwareGlimpse evaluates accounting and finance platforms on ease of use, primary job fit (expense, bookkeeping, T&E, or inventory ERP), workflow depth, integrations, reporting, scalability, value, and automation. Affiliate relationships never influence scores. Products are ranked within job clusters only.",
      criteria: [
        crit("ease-of-use", "Ease of use", "Learning curve for finance admins and employees.", 12, 0, ["features:receipt-capture", "product-positioning"]),
        crit("finance-job-fit", "Finance job fit", "Fit to expense, bookkeeping, T&E, or inventory ERP cluster.", 15, 1, ["features:expense-management", "features:bookkeeping-automation", "features:manufacturing-mrp"]),
        crit("workflow-depth", "Workflow depth", "Approvals, policies, categorisation, and production workflows.", 12, 2, ["features:expense-management", "features:bookkeeping-automation"]),
        crit("integrations", "Integrations", "Accounting, payroll, banking, and ERP ecosystem depth.", 10, 3, ["integrations"]),
        crit("reporting", "Reporting", "Management and statutory reporting depth.", 10, 4, ["features:financial-reporting"]),
        crit("automation", "Automation", "OCR, rules, feeds, and production automation.", 10, 5, ["features:receipt-capture", "features:bookkeeping-automation"]),
        crit("scalability", "Scalability", "Entities, users, volume, and multi-site growth.", 8, 6, ["limits", "pricing"]),
        crit("value-for-money", "Value for money", "Pricing fairness vs capabilities and plan gates.", 13, 7, ["pricing", "plans"]),
        crit("ai-capabilities", "AI capabilities", "Useful categorisation or assist — not marketing fluff.", 10, 8, ["ai-capabilities"]),
      ],
      notes: "Weights sum to 100. Score within job clusters. Affiliate economics excluded.",
    },
    comparisonCriteria: [
      cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
      cmp("free-trial", "Free trial", "factual", 1, "medium"),
      cmp("receipt-capture", "Receipt capture", "editorial", 2, "high", "receipt-capture"),
      cmp("expense-mgmt", "Expense management", "editorial", 3, "high", "expense-management"),
      cmp("bookkeeping", "Bookkeeping automation", "editorial", 4, "high", "bookkeeping-automation"),
      cmp("integrations", "Integrations", "editorial", 5, "high"),
      cmp("reporting", "Financial reporting", "editorial", 6, "medium", "financial-reporting"),
      cmp("inventory-erp", "Inventory / MRP", "editorial", 7, "medium", "manufacturing-mrp"),
    ],
    pricingDimensions: [
      { id: "pd-af-users", slug: "users", name: "Users / seats", enginePrimitive: "per-seat", required: true },
      { id: "pd-af-entities", slug: "entities", name: "Entities / companies", enginePrimitive: "flat", required: false },
      { id: "pd-af-transactions", slug: "transactions", name: "Transactions / receipts", enginePrimitive: "usage", required: false },
      { id: "pd-af-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
    ],
    pricingCapability: "PARTIAL",
    pricingCapabilityNotes: [
      "Per-user and usage primitives supported; category TCO calculator not built",
      "PRICING_CAPABILITY_GAP: accounting-finance category calculator UX",
    ],
    recommendationDimensions: [
      { id: "rd-af-job", slug: "primary-job", name: "Primary job (expense vs bookkeeping vs ERP)" },
      { id: "rd-af-size", slug: "company-size", name: "Company size" },
      { id: "rd-af-volume", slug: "transaction-volume", name: "Receipt / expense volume" },
      { id: "rd-af-budget", slug: "budget", name: "Budget" },
    ],
    finderReadiness: "DATA_MODEL_READY",
    finderNotes: [
      "Question/dimension model defined",
      "Three affiliate primaries in seed — finder UI after 8–12 primaries",
      "Pricing support PARTIAL",
    ],
    useCases: [
      { slug: "expense-management", name: "Expense management", pageEligibility: "content-candidate" },
      { slug: "travel-expense", name: "Travel & expense", pageEligibility: "content-candidate" },
      { slug: "bookkeeping-automation", name: "Bookkeeping automation", pageEligibility: "content-candidate" },
      { slug: "inventory-erp", name: "Inventory & manufacturing ERP", pageEligibility: "content-candidate" },
    ],
    audienceSlugs: ["small-business", "operations"],
    businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
    businessTypeSlugs: ["saas", "professional-services", "startup"],
    seedProductSlugs: ["navan", "dext", "mrpeasy"],
    queryAliases: [
      "accounting software",
      "bookkeeping software",
      "expense management software",
      "best expense software",
      "manufacturing ERP software",
    ],
    requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
    optionalResearchDomains: ["free-trial", "security-compliance", "ai-capabilities"],
    pricingModelsSupported: ["per-seat", "usage", "flat", "custom", "hybrid"],
    notes: [
      "Anchor with editorial leaders before scaling inventory beyond three affiliate SKUs",
      "Expense vs bookkeeping vs inventory ERP are distinct finder jobs",
      "Do not invent product scores; do not auto-publish pages",
    ],
    supportingKnowledgeAreas: ["fundamentals", "selection", "pricing", "features"],
  });

function feat(
  slug: string,
  name: string,
  description: string,
  importance: "core" | "important" | "optional" | "specialist",
  comparisonRelevant: boolean,
  finderRelevant: boolean,
  researchGuidance?: string,
) {
  return {
    id: `feat-af-${slug}`,
    slug,
    name,
    description,
    importance,
    comparisonRelevant,
    finderRelevant,
    researchGuidance,
    aliases: [],
  };
}

function crit(
  slug: string,
  name: string,
  description: string,
  weight: number,
  displayOrder: number,
  evidenceRequirements: string[],
) {
  return {
    id: `crit-af-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "accounting-finance",
    displayOrder,
  };
}

function cmp(
  slug: string,
  name: string,
  kind: "factual" | "editorial",
  displayOrder: number,
  decisionImportance: "high" | "medium" | "low",
  featureSlug?: string,
) {
  return {
    id: `cmp-af-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
