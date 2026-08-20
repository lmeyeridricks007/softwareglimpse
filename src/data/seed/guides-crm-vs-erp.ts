import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM vs ERP — customer/revenue relationships vs finance/inventory/ops.
 * Template: softwareglimpse-guide-template-v1
 */
const crmVsErpBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM owns customer and revenue relationships — contacts, deals, pipeline, and sales activity. ERP owns finance, inventory, fulfillment, and the operational back office. Decision rule: buy (or prioritize) the system whose primary users’ week breaks first if it disappears — sales process pain needs CRM; ledger/stock/fulfillment pain needs ERP.",
    bullets: [
      "CRM = relationships & revenue",
      "ERP = finance & operations",
      "Overlap on orders/accounts",
      "Different primary jobs",
      "Integrate, don’t conflate",
      "Don’t buy ERP for sales pain",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Jobs differ even when vendors blur labels",
        body: "Suites and platforms may ship both CRM and ERP modules. Evaluate the job you need done first — sales system of record vs operational backbone.",
      },
      {
        label: "CRM is not a mini-ERP",
        body: "Pipeline stages and activity history do not replace inventory, GL, procurement, or manufacturing controls.",
      },
      {
        label: "ERP is not a sales coach",
        body: "If deals stall because ownership and follow-up are unclear, an ERP implementation will not create sales discipline.",
      },
      {
        label: "Overlap needs integration rules",
        body: "Customer master, quotes, and orders often sync between systems — decide which system is authoritative for each field.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "which-system",
    title: "Which system to prioritize",
    steps: [
      { id: "pain", label: "Name the pain", short: "Sales vs ops/finance" },
      { id: "records", label: "Core records", short: "Deals vs GL/stock" },
      { id: "users", label: "Primary users", short: "Reps vs ops/finance" },
      { id: "overlap", label: "Map overlap", short: "Accounts & orders" },
      { id: "authority", label: "System of record", short: "Per data domain" },
      { id: "buy", label: "Buy or integrate", short: "CRM, ERP, or both" },
    ],
    ctaHref: "/guides/how-to-choose-crm/",
    ctaLabel: "How to choose a CRM →",
    figure: {
      src: "/guides/crm-vs-erp-which-system.png",
      alt: "Decision diagram: prioritize CRM or ERP based on whose week breaks first if the system disappears.",
      caption: "Prioritize the system whose primary users fail first without it — then design handoffs for overlap.",
    },
  },
  {
    type: "figure",
    id: "jobs-visual",
    title: "CRM and ERP own different jobs",
    src: "/guides/crm-vs-erp-hero.png",
    alt: "CRM focused on pipeline and customer relationships versus ERP focused on finance, inventory, and operations.",
    caption: "Shared customers — different systems of record by domain.",
  },
  {
    type: "step",
    id: "domain-jobs",
    stepNumber: 1,
    heading: "What each system is for",
    body: "Use domain jobs as the boundary test. If the daily work is advancing deals and logging conversations, you are in CRM territory. If the daily work is posting invoices, tracking stock, or running production, you are in ERP territory.\n\nExample: a mid-size manufacturer already runs warehouse inventory and invoices in ERP. Their sales pain is different — three account managers share open quotes and nobody trusts the “latest” status. They keep ERP for stock and finance, and add a sales CRM for pipeline and activity; they sync account names and won orders between systems instead of forcing sales into the warehouse product.",
    tip: "Ask: “If this system disappeared tomorrow, which team’s week breaks first — sales or finance/ops?” That team’s system is the priority buy.",
    figure: {
      src: "/guides/crm-vs-erp-jobs.png",
      alt: "Side-by-side jobs diagram: CRM for pipeline and relationships, ERP for finance inventory and operations, with order and account overlap in the middle.",
      caption: "Overlap is real — authority rules prevent dual masters.",
    },
    scenarios: [
      {
        title: "CRM primary job",
        body: "Contacts, opportunities, activities, forecasts, and sales handoffs.",
      },
      {
        title: "ERP primary job",
        body: "General ledger, AP/AR, inventory, purchasing, and fulfillment workflows.",
      },
      {
        title: "Shared overlap",
        body: "Customer/account masters, quotes-to-orders, and sometimes product catalogs.",
      },
    ],
  },
  {
    type: "crm-types",
    id: "buy-patterns",
    title: "Common buy patterns (not rankings)",
    types: [
      {
        id: "crm-first",
        title: "CRM first",
        bestFor:
          "Teams whose urgent pain is pipeline visibility, follow-ups, and shared sales history — with finance/ops already covered elsewhere.",
        avoidWhen:
          "You lack basic financial controls or inventory accuracy and expect CRM to fill that gap.",
      },
      {
        id: "erp-first",
        title: "ERP first",
        bestFor:
          "Operators whose blocking pain is inventory, fulfillment, or financial close — with sales manageable on a lighter tool short term.",
        avoidWhen:
          "Your real failure mode is dropped deals and unclear ownership; ERP won’t coach the sales process.",
      },
      {
        id: "both-integrated",
        title: "Both with integration",
        bestFor:
          "Growing companies that need a sales system of record and an operational backbone, with clear field-level authority.",
        avoidWhen:
          "You have no admin capacity to maintain sync rules and duplicate cleanup.",
      },
      {
        id: "suite-modules",
        title: "Suite modules from one vendor",
        bestFor:
          "Orgs that will actively use both CRM and ERP modules under one admin model and accept shared complexity.",
        avoidWhen:
          "You only need one job done and would pay for unused enterprise modules.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "job-signals",
    title: "Job signals: CRM or ERP?",
    rows: [
      {
        feature: "Pipeline stages and next-step ownership",
        mustHave: true,
        niceToHave: false,
        notes: "CRM job",
      },
      {
        feature: "Invoice posting and financial close",
        mustHave: true,
        niceToHave: false,
        notes: "ERP / finance job",
      },
      {
        feature: "Inventory and fulfillment accuracy",
        mustHave: true,
        niceToHave: false,
        notes: "ERP / ops job",
      },
      {
        feature: "Sales activity history and forecasts",
        mustHave: true,
        niceToHave: false,
        notes: "CRM job",
      },
      {
        feature: "Customer master sync between systems",
        mustHave: false,
        niceToHave: true,
        notes: "Integration design",
      },
      {
        feature: "Buying ERP “so sales gets organized”",
        mustHave: false,
        niceToHave: true,
        notes: "Common misfire",
      },
    ],
    figure: {
      src: "/guides/crm-vs-erp-job-signals.png",
      alt: "Job signals matrix showing which work belongs in CRM versus ERP.",
      caption: "Use the job, not the vendor label, to decide which system owns the work.",
    },
  },
  {
    type: "size-match",
    id: "fit-by-context",
    title: "Fit by company context",
    figure: {
      src: "/guides/crm-vs-erp-fit-context.png",
      alt: "Fit-by-context cards for services SMB, product ops, scaling teams, and enterprise suites.",
      caption: "Context changes the buy order — services vs inventory-heavy ops are different starting points.",
    },
    tiers: [
      {
        id: "services-smb",
        label: "Services SMB",
        description:
          "Usually CRM first; light accounting tools may cover finance until ERP complexity appears.",
        fitHints: ["Pipeline first", "Simple finance"],
      },
      {
        id: "product-ops",
        label: "Product / inventory-heavy",
        description:
          "ERP (or strong inventory+finance stack) may be urgent; still keep a real sales system of record.",
        fitHints: ["Stock accuracy", "Order sync"],
      },
      {
        id: "scaling",
        label: "Scaling multi-team",
        description:
          "Expect both systems plus integration ownership — do not assume one suite auto-solves authority.",
        fitHints: ["Data owners", "Admin capacity"],
      },
      {
        id: "enterprise",
        label: "Enterprise / regulated",
        description:
          "Platform choices involve IT, security, and process design; still separate CRM and ERP job statements in the RFP.",
        fitHints: ["SSO / audit", "Domain SoR"],
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "CRM vs ERP mistakes",
    items: [
      {
        title: "Buying ERP to fix sales process",
        body: "Operational platforms do not create owners, stages, or follow-up habits. Solve sales process with CRM and coaching.",
      },
      {
        title: "Expecting CRM to replace the ledger",
        body: "Deal values and invoices are related; financial controls still belong in finance systems.",
      },
      {
        title: "Two masters for the same customer fields",
        body: "Without an authority map, CRM and ERP drift and teams argue about which record is true.",
      },
      {
        title: "Suite shopping without a primary job",
        body: "Bundled modules look complete on slides; unused complexity still costs admin time and licenses.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is the difference between CRM and ERP?",
        answer:
          "CRM focuses on customer relationships and revenue pipeline. ERP focuses on running the business operationally — finance, inventory, purchasing, and related back-office processes. Decision rule: prioritize the system whose primary users’ week breaks first if it disappears.",
      },
      {
        question: "Can one product be both CRM and ERP?",
        answer:
          "Some vendors offer suites with both module families. Treat them as separate jobs in evaluation: who uses which module daily, and which system is authoritative for each data domain. Example: a manufacturer can keep ERP for warehouse stock while sales still needs a CRM for open quotes and follow-ups.",
      },
      {
        question: "Should we buy CRM or ERP first?",
        answer:
          "Buy for the pain that blocks the business most. Sales process and pipeline visibility point to CRM; financial close, inventory, or fulfillment accuracy point to ERP or finance/ops tools.",
      },
      {
        question: "Do CRM and ERP need to integrate?",
        answer:
          "Often yes once orders and customer masters matter to both teams. Integration is a design problem — define field-level systems of record before syncing everything.",
      },
      {
        question: "What should I read next?",
        answer:
          "Clarify CRM fundamentals in What is CRM?, then How to Choose a CRM if sales is the priority — or use CRM Finder for a shortlist.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/what-is-crm/",
        label: "What is CRM?",
        description: "Foundational definition.",
      },
      {
        href: "/guides/do-i-need-a-crm/",
        label: "Do I need a CRM?",
        description: "Qualify sales-system timing.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Evaluation framework.",
      },
      {
        href: "/guides/crm-vs-spreadsheet/",
        label: "CRM vs spreadsheet",
        description: "Earlier-stage boundary question.",
      },
      {
        href: "/guides/crm-vs-marketing-automation/",
        label: "CRM vs marketing automation",
        description: "Sibling boundary comparison.",
      },
      {
        href: "/guides/types-of-crm/",
        label: "Types of CRM",
        description: "Where suites overlap back-office scope.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist from structured answers.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Separate CRM musts from ERP scope.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "If the job is sales relationships",
    body: "When CRM — not ERP — is the system you need, CRM Finder maps requirements to researched products without affiliate-ordered rankings.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmVsErpGuide: GuidePage = {
  id: "guide-crm-vs-erp",
  slug: "crm-vs-erp",
  title: "CRM vs ERP: Jobs, Overlap & What to Buy First",
  summary:
    "Understand the boundary between CRM (customer and revenue relationships) and ERP (finance, inventory, operations) — including order/account overlap and why ERP will not fix a sales process.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "comparison-education",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/crm-vs-erp-hero.png",
    alt: "CRM pipeline and relationships versus ERP finance, inventory, and operations.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:crm-software",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:tool:crm-finder",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:tool:crm-finder",
    label: "Try the CRM Finder",
  },
  relatedGuideSlugs: [
    "what-is-crm",
    "do-i-need-a-crm",
    "crm-vs-spreadsheet",
    "crm-vs-marketing-automation",
    "crm-vs-customer-service-software",
    "types-of-crm",
    "how-to-choose-crm",
  ],
  blocks: crmVsErpBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "pain",
      label: "Name the blocking pain",
      description: "Sales process vs finance/ops/inventory.",
      order: 0,
    },
    {
      id: "overlap",
      label: "Map shared data domains",
      description: "Accounts, orders, catalog — and who owns them.",
      order: 1,
    },
    {
      id: "priority",
      label: "Choose buy priority",
      description: "CRM first, ERP first, or both with integration rules.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T08:00:00.000Z",
    publishedAt: "2026-08-14T08:00:00.000Z",
    reviewedAt: "2026-08-14T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "CRM vs ERP Explained | SoftwareGlimpse",
    description:
      "CRM owns relationships and pipeline; ERP owns finance and operations. Learn the overlap, authority rules, and what to buy first.",
    canonicalPath: "/guides/crm-vs-erp/",
    indexable: true,
  },
};
