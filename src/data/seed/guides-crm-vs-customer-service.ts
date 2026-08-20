import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM vs customer service software — sales pipeline vs helpdesk/tickets/SLA, shared customer record.
 * Template: softwareglimpse-guide-template-v1
 */
const crmVsCustomerServiceBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Customer service / helpdesk software owns tickets, queues, SLAs, and support workflows. CRM owns the sales pipeline — contacts, deals, owners, and revenue activity. Decision rule: if the metric is time-to-first-response and ticket backlog, buy service software; if the metric is pipeline coverage and deal next steps, buy CRM — share the customer record, do not force one workflow tool.",
    bullets: [
      "Helpdesk = tickets & SLAs",
      "CRM = sales pipeline",
      "Shared customer record",
      "Suites help when both jobs are real",
      "Separate tools when teams diverge",
      "Don’t conflate the jobs",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Support and sales optimize different queues",
        body: "Agents work tickets against SLAs; reps work deals against stages. Forcing one workflow into the other creates noise.",
      },
      {
        label: "Context should be shared, systems can differ",
        body: "Account history, contacts, and prior conversations should be visible across teams — that does not require one undifferentiated product.",
      },
      {
        label: "Suites help when both jobs are daily",
        body: "CRM + service platforms reduce swivel-chair work when sales and support truly share customers and admin capacity.",
      },
      {
        label: "Separate tools are fine with a customer hub",
        body: "Best-fit helpdesk plus sales CRM works when integrations and identity/account matching are owned deliberately.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "which-first",
    title: "Sales CRM, helpdesk, or both?",
    steps: [
      { id: "pain", label: "Blocking pain", short: "Pipeline vs tickets" },
      { id: "users", label: "Primary users", short: "Reps vs agents" },
      { id: "record", label: "Customer record", short: "Shared identity" },
      { id: "sla", label: "SLA / queue need", short: "Support intensity" },
      { id: "shape", label: "Stack shape", short: "Suite vs separate" },
      { id: "handoff", label: "Handoff rules", short: "Sales ↔ support" },
    ],
    ctaHref: "/guides/how-to-choose-crm/",
    ctaLabel: "How to choose a CRM →",
  },
  {
    type: "figure",
    id: "jobs-visual",
    title: "Sales CRM vs customer service jobs",
    src: "/guides/crm-vs-customer-service-software-hero.png",
    alt: "Sales CRM pipeline and deal owners on one side versus helpdesk tickets, queues, and SLAs on the other around a shared customer record.",
    caption: "Shared customer — different work systems.",
  },
  {
    type: "step",
    id: "job-split",
    stepNumber: 1,
    heading: "What each system is for",
    body: "Keep the job statements boring and specific. If the metric is time-to-first-response and ticket backlog, you need service software. If the metric is pipeline coverage and next steps on deals, you need CRM.\n\nExample: a 12-person ecommerce brand has two AEs closing wholesale accounts and a three-person support desk answering order issues. Sales needs stages and next steps in CRM; support needs ticket queues and SLAs in a helpdesk. They share the customer profile (orders, contacts, open deals) via integration — they do not ask AEs to “work tickets” in the pipeline board.",
    tip: "If support is logging “tickets” inside a sales CRM without queues and SLAs, you likely under-bought service tooling — not under-configured CRM stages.",
    figure: {
      src: "/guides/crm-vs-customer-service-jobs.png",
      alt: "Jobs diagram comparing CRM sales pipeline work with customer service ticket queues and SLAs, linked by a shared customer profile.",
      caption: "Visibility across teams ≠ forcing one workflow tool.",
    },
    scenarios: [
      {
        title: "CRM / sales job",
        body: "Opportunities, stages, forecasts, outbound/inbound follow-up, and revenue ownership.",
      },
      {
        title: "Customer service job",
        body: "Ticket intake, assignment, SLAs, knowledge base, and resolution workflows.",
      },
      {
        title: "Shared customer context",
        body: "Who the customer is, past purchases, open deals, and prior conversations both teams should see.",
      },
    ],
  },
  {
    type: "crm-types",
    id: "stack-patterns",
    title: "Stack patterns (not product rankings)",
    types: [
      {
        id: "crm-first",
        title: "Sales CRM first",
        bestFor:
          "Teams whose urgent failure is pipeline ownership and follow-up — with light support volume handled via email or a simple inbox.",
        avoidWhen:
          "Ticket volume and SLAs already define the customer experience.",
      },
      {
        id: "helpdesk-first",
        title: "Helpdesk first",
        bestFor:
          "Support-led businesses where response quality and queues are the blocking pain — add CRM when selling becomes multi-owner.",
        avoidWhen:
          "Deals are stalling from missing owners and stages; a helpdesk will not create a sales process.",
      },
      {
        id: "suite",
        title: "CRM + service suite",
        bestFor:
          "Orgs that run sales and support on the same customer base daily and want one customer timeline with shared admin.",
        avoidWhen:
          "Only one team will use the suite; unused modules add cost and configuration.",
      },
      {
        id: "best-of-breed",
        title: "Separate CRM + helpdesk",
        bestFor:
          "Teams that need specialized service workflows and a focused sales CRM, with capacity to integrate identity and history.",
        avoidWhen:
          "No owner for account matching, sync errors, or “which system is true for X.”",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "job-matrix",
    title: "Job matrix: CRM vs customer service",
    rows: [
      {
        feature: "Deal stages, owners, and forecasts",
        mustHave: true,
        niceToHave: false,
        notes: "CRM job",
      },
      {
        feature: "Ticket queues, SLAs, and escalation",
        mustHave: true,
        niceToHave: false,
        notes: "Helpdesk / service job",
      },
      {
        feature: "Shared customer timeline visibility",
        mustHave: true,
        niceToHave: false,
        notes: "Suite or integration",
      },
      {
        feature: "Sales activity as system of record",
        mustHave: true,
        niceToHave: false,
        notes: "CRM strength",
      },
      {
        feature: "Knowledge base + deflection",
        mustHave: false,
        niceToHave: true,
        notes: "Service tooling",
      },
      {
        feature: "Forcing support into sales pipeline stages",
        mustHave: false,
        niceToHave: true,
        notes: "Common misfit",
      },
    ],
  },
  {
    type: "size-match",
    id: "fit-by-org",
    title: "Fit by organization shape",
    tiers: [
      {
        id: "early",
        label: "Early / founder-led",
        description:
          "Start with the louder pain. Many start on CRM; add helpdesk when ticket chaos outgrows inbox triage.",
        fitHints: ["One primary job", "Light process"],
      },
      {
        id: "smb-both",
        label: "SMB with sales + support",
        description:
          "Suite or integrated pair both work — write handoff rules for renewals, escalations, and expansion.",
        fitHints: ["Shared account view", "Clear admins"],
      },
      {
        id: "support-led",
        label: "Support-led / high ticket volume",
        description:
          "Prioritize service tooling and SLAs; keep CRM for revenue motions that need pipeline discipline.",
        fitHints: ["Queues first", "CRM for expansion"],
      },
      {
        id: "enterprise",
        label: "Enterprise / multi-brand",
        description:
          "Permissions, audit, and identity resolution dominate — evaluate suite vs best-of-breed with IT.",
        fitHints: ["Governance", "Identity matching"],
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Common CRM vs service mistakes",
    items: [
      {
        title: "Using CRM stages as a fake ticket system",
        body: "Pipeline fields without queues, SLAs, and agent workflows will not meet support standards.",
      },
      {
        title: "Buying a suite for one team only",
        body: "Unused service or sales modules still create license and admin drag.",
      },
      {
        title: "No shared customer identity",
        body: "Separate tools without matching rules produce duplicate people and blind handoffs.",
      },
      {
        title: "Ignoring expansion and renewal handoffs",
        body: "Support often sees churn risk first; sales needs a defined path to act — regardless of vendor.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "Is customer service software a CRM?",
        answer:
          "Not in the sales sense. Helpdesk tools manage tickets and support workflows. Some vendors brand broadly as “CRM,” so clarify whether you need pipeline management, ticket management, or both. Decision rule: ticket SLAs point to service software; deal stages point to CRM.",
      },
      {
        question: "Can one suite replace both CRM and helpdesk?",
        answer:
          "Sometimes, when sales and support both use the platform daily and share a customer timeline. Evaluate each job on its own — suite convenience is not the same as fit.",
      },
      {
        question: "What should be shared between sales and support?",
        answer:
          "At minimum: who the customer is, key contacts, open deals or subscriptions, and recent interaction history relevant to the next conversation.",
      },
      {
        question: "Should we buy CRM or helpdesk first?",
        answer:
          "Buy for the blocking operational pain. Pipeline and follow-up failures point to CRM; ticket backlog and SLA failures point to customer service software.",
      },
      {
        question: "What should I read next?",
        answer:
          "Start with What is CRM? and Do I Need a CRM? if sales is the gap — then How to Choose a CRM or CRM Finder for shortlisting.",
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
        description: "Buying framework.",
      },
      {
        href: "/guides/crm-vs-marketing-automation/",
        label: "CRM vs marketing automation",
        description: "Another boundary comparison.",
      },
      {
        href: "/guides/crm-vs-cdp/",
        label: "CRM vs CDP",
        description: "Where customer data platforms differ.",
      },
      {
        href: "/guides/types-of-crm/",
        label: "Types of CRM",
        description: "Suites that bundle a service desk.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist from structured answers.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Separate sales musts from support musts.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "If the gap is the sales system of record",
    body: "When you need CRM for pipeline — not a helpdesk substitute — CRM Finder maps your answers to researched products without affiliate-ordered rankings.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmVsCustomerServiceGuide: GuidePage = {
  id: "guide-crm-vs-customer-service-software",
  slug: "crm-vs-customer-service-software",
  title: "CRM vs Customer Service Software: Pipeline vs Tickets",
  summary:
    "Clarify the boundary between sales CRM (pipeline and deals) and customer service / helpdesk tools (tickets and SLAs) — when suites help, when separate tools fit, and what must be shared.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "comparison-education",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/crm-vs-customer-service-software-hero.png",
    alt: "Sales CRM pipeline versus helpdesk tickets and SLAs around a shared customer record.",
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
    "crm-vs-marketing-automation",
    "crm-vs-cdp",
    "crm-vs-spreadsheet",
    "crm-vs-erp",
    "types-of-crm",
    "how-to-choose-crm",
  ],
  blocks: crmVsCustomerServiceBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "pain",
      label: "Name the blocking pain",
      description: "Pipeline/follow-up vs tickets/SLAs.",
      order: 0,
    },
    {
      id: "share",
      label: "Define shared customer fields",
      description: "Identity, history, open deals, contacts.",
      order: 1,
    },
    {
      id: "shape",
      label: "Choose stack shape",
      description: "CRM-only, helpdesk-first, suite, or separate+integrate.",
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
    title: "CRM vs Customer Service Software | SoftwareGlimpse",
    description:
      "Sales CRM owns pipeline; helpdesk tools own tickets and SLAs. Learn shared customer records, suites vs separate tools, and what to buy first.",
    canonicalPath: "/guides/crm-vs-customer-service-software/",
    indexable: true,
  },
};
