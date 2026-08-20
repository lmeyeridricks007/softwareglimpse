import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Fundamental CRM guide — same `softwareglimpse-guide-template-v1` chrome as
 * selection guides (hero CTAs + framework visual + block renderer).
 */
const whatIsCrmBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM (customer relationship management) software is the operational system of record for who you sell to, what stage each opportunity is in, and what happened last. Decision rule: if handoffs and follow-ups currently depend on memory, inboxes, or personal spreadsheets, you need a CRM — not another shared sheet tab.",
    bullets: [
      "Contacts & companies",
      "Pipeline & deals",
      "Activity history",
      "Shared ownership",
      "Basic reporting",
      "Handoffs that stick",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "One system of record",
        body: "Contacts, deals, and history live together so the team is not reconstructing context from email threads.",
      },
      {
        label: "Process before features",
        body: "Map how you sell before you configure stages — vendor defaults rarely match your real workflow.",
      },
      {
        label: "When spreadsheets fail",
        body: "Shared ownership, follow-ups, and reporting are the usual tipping points into a dedicated CRM.",
      },
      {
        label: "CRM ≠ every “CRM” logo",
        body: "Marketing automation and sales intelligence may connect to CRM without replacing the sales system of record.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "crm-building-blocks",
    title: "CRM building blocks",
    steps: [
      { id: "block-contacts", label: "Contacts", short: "People & companies" },
      { id: "block-pipeline", label: "Pipeline", short: "Deals & stages" },
      { id: "block-activity", label: "Activity", short: "Emails, calls, notes" },
      { id: "block-ownership", label: "Ownership", short: "Who owns what" },
      { id: "block-reporting", label: "Reporting", short: "Pipeline health" },
      { id: "block-integrations", label: "Integrations", short: "Connected tools" },
    ],
    ctaHref: "/guides/how-to-choose-crm/",
    ctaLabel: "How to choose a CRM →",
    figure: {
      src: "/guides/what-is-crm-building-blocks.png",
      alt: "Six CRM building blocks: contacts, pipeline, activity, ownership, reporting, and integrations.",
      caption: "These blocks define a sales CRM — marketing or data tools may connect without replacing them.",
    },
  },
  {
    type: "step",
    id: "how-it-works",
    stepNumber: 1,
    heading: "How does CRM software work?",
    body: "Most sales CRMs share a simple loop: capture a lead or contact, qualify it, move a deal through pipeline stages, log activities, and report on outcomes.\n\nExample: a 4-person design agency captures a website inquiry as a contact, qualifies it on a discovery call, opens a deal in Proposal, logs the proposal email on that deal, and reviews open deals every Friday from the board — not from Slack search.",
    tip: "Map your real sales stages before you configure pipeline fields — vendors often ship stages that don’t match how you sell.",
    figure: {
      src: "/guides/what-is-crm-how-it-works.png",
      alt: "CRM how-it-works loop: capture, qualify, advance, log activity, and review.",
      caption: "Most sales CRMs follow the same operational loop.",
    },
    scenarios: [
      {
        title: "Capture",
        body: "A lead or contact enters the CRM from a form, import, or manual entry.",
      },
      {
        title: "Qualify",
        body: "Someone owns the record and decides whether it is worth pursuing.",
      },
      {
        title: "Advance",
        body: "A deal moves through stages that match how you actually sell.",
      },
      {
        title: "Log activity",
        body: "Emails, calls, and tasks stay attached to the same record.",
      },
      {
        title: "Review",
        body: "Dashboards show pipeline health without another spreadsheet.",
      },
    ],
  },
  {
    type: "step",
    id: "what-it-includes",
    stepNumber: 2,
    heading: "What CRM software typically includes",
    body: "Core CRM products cover contact records, pipelines, activity history, and reporting. Many add email sync, automation, or calling. Sales intelligence and marketing platforms can connect to CRM but usually solve a different primary job — do not assume “CRM” on a homepage means the same product category.\n\nExample: that agency’s must-haves are contacts, a short pipeline, logged emails, and a weekly board. A marketing automation suite’s nurture journeys are adjacent — useful later, not a substitute for the sales system of record.",
    tip: "Treat marketing automation and sales intelligence as adjacent tools unless your evaluation criteria explicitly need them in one product.",
    figure: {
      src: "/guides/what-is-crm-includes.png",
      alt: "CRM system of record surrounded by contacts, pipeline, activity timeline, tasks, dashboards, and integrations.",
      caption: "Core CRM keeps people, deals, and history together — extras attach around that core.",
    },
  },
  {
    type: "feature-matrix",
    id: "spreadsheet-vs-crm",
    title: "Spreadsheet vs dedicated CRM",
    figure: {
      src: "/guides/what-is-crm-spreadsheet-vs-crm.png",
      alt: "Side-by-side comparison of a messy spreadsheet workflow versus a structured CRM system of record.",
      caption: "Spreadsheets store lists; CRMs keep ownership, stages, and history together.",
    },
    rows: [
      {
        feature: "Shared contact ownership",
        mustHave: true,
        niceToHave: false,
        notes: "CRM handles roles; sheets drift",
      },
      {
        feature: "Pipeline stages & next steps",
        mustHave: true,
        niceToHave: false,
        notes: "Native in CRM; bolted onto sheets",
      },
      {
        feature: "Activity history on the record",
        mustHave: true,
        niceToHave: false,
        notes: "Email/call context stays attached",
      },
      {
        feature: "Team reporting",
        mustHave: true,
        niceToHave: false,
        notes: "Weekly pipeline reviews",
      },
      {
        feature: "Quick solo list tracking",
        mustHave: false,
        niceToHave: true,
        notes: "Spreadsheets can still work here",
      },
      {
        feature: "Heavy customization on day one",
        mustHave: false,
        niceToHave: true,
        notes: "Often overkill for first CRM",
      },
    ],
  },
  {
    type: "step",
    id: "when-you-need-one",
    stepNumber: 3,
    heading: "When do you need a CRM?",
    body: "A dedicated CRM usually pays off when more than one person touches the same customer, deals have stages worth tracking, or follow-ups fall through cracks in shared inboxes. Spreadsheets can work for a solo operator with a short list — they struggle once ownership, history, and reporting matter.\n\nExample: two account managers at a 6-person consultancy both “owned” the same warm lead in a shared inbox — neither followed up. That dual-touch failure is a clearer CRM signal than “we should look more professional.”",
    tip: "Start with shared ownership and follow-up pain — not with a feature matrix from a vendor landing page.",
    figure: {
      src: "/guides/what-is-crm-when-you-need.png",
      alt: "Growth stages from solo to multi-team showing when CRM value rises.",
      caption: "CRM value rises as shared ownership, stages, and reporting become daily needs.",
    },
  },
  {
    type: "size-match",
    id: "when-by-stage",
    title: "When a CRM starts to pay off",
    figure: {
      src: "/guides/what-is-crm-when-you-need.png",
      alt: "Four business stages from solo to multi-team showing when CRM value typically increases.",
      caption: "CRM value rises as shared ownership and pipeline visibility become daily needs.",
    },
    tiers: [
      {
        id: "solo",
        label: "Solo / freelancer",
        description:
          "A simple list may be enough until follow-ups and history get messy.",
        fitHints: ["Short pipeline", "Email-first workflows"],
      },
      {
        id: "small",
        label: "Small team",
        description:
          "Shared ownership and stage visibility usually justify a CRM.",
        fitHints: ["Clear owners", "Weekly pipeline review"],
      },
      {
        id: "scaling",
        label: "Scaling company",
        description:
          "Handoffs, reporting, and integrations become day-to-day needs.",
        fitHints: ["Permissions", "Reliable activity sync"],
      },
      {
        id: "enterprise",
        label: "Multi-team org",
        description:
          "Governance, security, and complex processes dominate the buy.",
        fitHints: ["SSO / audit", "Cross-team workflows"],
      },
    ],
  },
  {
    type: "figure",
    id: "crm-types-visual",
    title: "CRM shapes at a glance",
    src: "/guides/what-is-crm-types.png",
    alt: "Four CRM shapes: simple sales CRM, sales engagement CRM, CRM plus marketing suite, and enterprise CRM platform.",
    caption: "Same category label — different primary jobs. Pick the shape before the vendor.",
  },
  {
    type: "crm-types",
    id: "crm-types",
    title: "Common CRM shapes (not rankings)",
    types: [
      {
        id: "simple-sales",
        title: "Simple sales CRM",
        bestFor:
          "Small teams that need contacts, pipeline, and activity history without heavy admin.",
        avoidWhen:
          "You need complex multi-department governance or deep customization on day one.",
      },
      {
        id: "sales-engagement",
        title: "Sales engagement–heavy CRM",
        bestFor:
          "Outbound teams living in sequences, dialers, and high activity volume.",
        avoidWhen:
          "Your main pain is account management or support history, not activity throughput.",
      },
      {
        id: "suite",
        title: "CRM + marketing suite",
        bestFor:
          "Teams that want marketing and CRM in one vendor ecosystem and will use both.",
        avoidWhen:
          "You only need a sales CRM and dislike paying for unused modules.",
      },
      {
        id: "enterprise",
        title: "Enterprise CRM platform",
        bestFor:
          "Complex processes, security reviews, and multi-team workflows with IT involvement.",
        avoidWhen:
          "A five-person team that needs to go live this month with minimal admin.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "common-mistakes",
    title: "Common beginner mistakes",
    items: [
      {
        title: "Buying for feature count",
        body: "A longer feature list rarely fixes unclear ownership or messy stages.",
      },
      {
        title: "Trusting every “CRM” label",
        body: "Some products are marketing or intelligence tools that sync into CRM — not the system of record.",
      },
      {
        title: "Skipping process mapping",
        body: "Configuring vendor-default stages before you map how you sell creates busywork.",
      },
      {
        title: "Staying on sheets too long",
        body: "Once two people need the same history, spreadsheet drift usually costs more than a simple CRM.",
      },
    ],
  },
  {
    type: "checklist",
    id: "need-crm-signals",
    title: "Signals you need a CRM (not a longer spreadsheet)",
    copyable: true,
    items: [
      {
        id: "signal-shared-owners",
        label: "Two or more people touch the same leads or accounts",
        description: "Shared ownership without a system of record creates missed follow-ups.",
        order: 0,
      },
      {
        id: "signal-stages",
        label: "Deals have stages worth reviewing weekly",
        description: "If “where is this?” is a recurring Slack question, stages belong in a CRM.",
        order: 1,
      },
      {
        id: "signal-history",
        label: "Handoffs lose email/call context",
        description: "Activity should stay on the record, not in personal inboxes.",
        order: 2,
      },
      {
        id: "signal-reporting",
        label: "Pipeline reporting is rebuilt from memory or sheets",
        description: "Weekly reviews need a trusted board, not a Friday spreadsheet rebuild.",
        order: 3,
      },
      {
        id: "signal-followups",
        label: "Follow-ups depend on memory or starred emails",
        description: "Tasks and next steps on the deal beat hope-based follow-up.",
        order: 4,
      },
    ],
  },
  {
    type: "callout",
    id: "how-we-define-crm",
    title: "How SoftwareGlimpse uses “CRM” on this page",
    body: "We mean a sales/customer system of record for contacts, deals, activity, and ownership — not every product that puts “CRM” on a homepage. Marketing automation, sales intelligence, and CDP tools can connect without replacing that core. Claims here stay process-based; product shortlists come from structured tools and researched catalogue pages, not affiliate order.",
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is CRM?",
        answer:
          "CRM software is the operational system of record for who you sell to, what stage each opportunity is in, and what happened last — so the team does not rely on memory, inboxes, or personal spreadsheets for handoffs and follow-ups.",
      },
      {
        question: "What does CRM stand for?",
        answer:
          "CRM stands for customer relationship management. In practice, buyers usually mean the software that keeps contacts, pipeline, and activity history together for the team.",
      },
      {
        question: "Is a spreadsheet a CRM?",
        answer:
          "No. Spreadsheets can store contacts, but they lack reliable shared ownership, pipeline stages, activity history across handoffs, and team workflows that purpose-built CRMs provide. See our CRM vs spreadsheet guide when you need the side-by-side decision.",
      },
      {
        question: "Is CRM only for sales teams?",
        answer:
          "Sales is the most common buyer, but support and account teams often use the same contact and history layers. Marketing tools may sync into CRM without replacing it.",
      },
      {
        question: "How is CRM different from email marketing software?",
        answer:
          "Email marketing focuses on campaigns and lists. CRM focuses on relationships, deals, and day-to-day customer interactions. Many teams use both and connect them.",
      },
      {
        question: "What should I do after I understand what a CRM is?",
        answer:
          "Use the How to Choose a CRM guide for a buying framework, download the CRM evaluation checklist to score vendors fairly, then CRM Finder for researched product matches from your answers — never from affiliate payout order.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/how-crm-works/",
        label: "How CRM works",
        description: "Records, pipelines, and activity history.",
      },
      {
        href: "/guides/types-of-crm/",
        label: "Types of CRM",
        description: "Operational shapes and who they fit.",
      },
      {
        href: "/guides/crm-benefits/",
        label: "CRM benefits",
        description: "What changes once records live in one place.",
      },
      {
        href: "/guides/crm-vs-spreadsheet/",
        label: "CRM vs spreadsheet",
        description: "When sheets stop being enough.",
      },
      {
        href: "/guides/do-i-need-a-crm/",
        label: "Do I need a CRM?",
        description: "Readiness check before you shop.",
      },
      {
        href: "/guides/when-to-adopt-crm/",
        label: "When to adopt a CRM",
        description: "Timing signals and triggers.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Decision framework before you compare vendors.",
      },
      {
        href: "/guides/crm-glossary/",
        label: "CRM glossary",
        description: "Shared vocabulary for stages, owners, and fields.",
      },
      {
        href: "/resources/crm-evaluation-checklist/",
        label: "CRM evaluation checklist",
        description: "Downloadable checklist for fair vendor trials.",
      },
      {
        href: "/tools/crm-vendor-scorecard/",
        label: "Vendor Scorecard",
        description: "Score shortlisted CRMs on criteria you actually use.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Compare products from structured answers — not affiliate order.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Turn needs into a must vs nice sheet.",
      },
      {
        href: "/categories/crm/",
        label: "CRM category",
        description: "Browse the CRM catalogue.",
      },
      {
        href: "/best/crm-software/",
        label: "Best CRM software",
        description: "Research-backed rankings when available.",
      },
      {
        href: "/company/editorial-methodology/",
        label: "Editorial methodology",
        description: "How SoftwareGlimpse researches and ranks without affiliate bias.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "checklist-cta",
    title: "Evaluate vendors without feature-list theater",
    body: "Use the CRM evaluation checklist to run the same trial script across shortlisted tools — ownership, stages, follow-ups, and reporting — before you compare logos.",
    href: "/resources/crm-evaluation-checklist/",
    ctaLabel: "Open evaluation checklist →",
    variant: "generic",
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Ready to choose?",
    body: "Once you understand what a CRM is for, use CRM Finder to map your answers to researched products. Affiliate status never changes the order.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const whatIsCrmGuide: GuidePage = {
  id: "guide-what-is-crm",
  slug: "what-is-crm",
  title: "What Is CRM Software? A Complete Beginner’s Guide",
  summary:
    "Learn what CRM software is, how it works for sales and customer teams, and how to choose one without drowning in vendor marketing.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "fundamental",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/what-is-crm-hero.png",
    alt: "CRM as a system of record connecting contacts, pipeline deals, and activity history for a shared team.",
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
    {
      contentId: "content:tool:crm-vendor-scorecard",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:guide:how-to-choose-crm",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:guide:how-to-choose-crm",
    label: "How to choose a CRM",
  },
  relatedGuideSlugs: [
    "how-crm-works",
    "types-of-crm",
    "crm-benefits",
    "crm-glossary",
    "do-i-need-a-crm",
    "crm-vs-spreadsheet",
    "when-to-adopt-crm",
    "how-to-choose-crm",
  ],
  blocks: whatIsCrmBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "contacts",
      label: "Contact management",
      description: "One place for people, companies, and history.",
      order: 0,
    },
    {
      id: "pipeline",
      label: "Sales pipeline",
      description: "Stages, owners, and next steps for deals.",
      order: 1,
    },
    {
      id: "activity",
      label: "Activity history",
      description: "Emails, calls, and notes tied to records.",
      order: 2,
    },
    {
      id: "reporting",
      label: "Reporting",
      description: "Pipeline and activity views your team can trust.",
      order: 3,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-15T12:00:00.000Z",
    publishedAt: "2026-08-13T12:00:00.000Z",
    reviewedAt: "2026-08-15T12:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "What Is CRM? Software Definition & Beginner’s Guide | SoftwareGlimpse",
    description:
      "What is CRM software? A clear definition of the sales system of record — contacts, pipeline, activity, ownership — plus when you need one instead of a spreadsheet.",
    canonicalPath: "/guides/what-is-crm/",
    indexable: true,
  },
};
