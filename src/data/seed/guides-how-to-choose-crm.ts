import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const howToChooseBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose the CRM that matches how you sell in the next 90 days — not the longest feature list. Write three observable outcomes, mark must-have vs nice-to-have features, then shortlist only tools that clear integrations, true cost, and adoption for your team size. Skip “#1 CRM” claims and affiliate rankings until that filter is done.",
    bullets: [
      "Sales process fit",
      "Team size & roles",
      "Must-have features",
      "Integrations you already use",
      "Total cost of ownership",
      "Usability & adoption",
      "Growth requirements",
    ],
  },
  {
    type: "figure",
    id: "choose-example-visual",
    src: "/guides/how-to-choose-crm-example.png",
    alt: "Worked example: a four-person B2B team choosing CRM shape from 90-day outcomes, must-haves, and size fit — not from a feature wishlist.",
    caption:
      "Worked example: start from 90-day outcomes and team shape, then filter products — do not start from vendor feature grids.",
  },
  {
    type: "selection-checklist",
    id: "interactive-checklist",
    title: "Interactive CRM selection checklist",
    dimensions: [
      {
        id: "goals",
        label: "Primary goal",
        options: [
          "Lead management",
          "Pipeline visibility",
          "Sales automation",
          "Customer history",
          "Forecasting",
        ],
      },
      {
        id: "team-size",
        label: "Team size",
        options: ["Solo", "2–10", "11–50", "50+"],
      },
      {
        id: "sales-process",
        label: "Sales process",
        options: ["Simple inbound", "Outbound prospecting", "Complex B2B", "Mixed"],
      },
      {
        id: "features",
        label: "Must-have features",
        options: [
          "Pipeline + contacts",
          "Email sync",
          "Automation",
          "Reporting",
          "API access",
        ],
      },
      {
        id: "integrations",
        label: "Critical integrations",
        options: [
          "Email/calendar",
          "Marketing",
          "Support",
          "Accounting",
          "Ecommerce",
        ],
      },
      {
        id: "budget",
        label: "Budget posture",
        options: ["Lean", "Mid-market", "Flexible if ROI clear"],
      },
      {
        id: "complexity",
        label: "Implementation complexity",
        options: ["DIY this week", "Guided rollout", "Need partner help"],
      },
    ],
  },
  {
    type: "decision-framework",
    id: "roadmap",
    title: "Selection roadmap",
    steps: [
      { id: "step-needs", label: "Needs" },
      { id: "step-features", label: "Features" },
      { id: "step-size", label: "Size fit" },
      { id: "step-integrations", label: "Integrations" },
      { id: "step-cost", label: "Cost" },
      { id: "step-usability", label: "Usability" },
      { id: "step-growth", label: "Growth" },
    ],
    ctaHref: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    figure: {
      src: "/guides/crm-selection-roadmap.png",
      alt: "CRM selection roadmap: needs → features → size fit → integrations → cost → usability → growth.",
      caption:
        "Walk the roadmap in order: outcomes and must-haves before demos, cost and adoption before a signed contract.",
    },
  },
  {
    type: "step",
    id: "step-needs",
    stepNumber: 1,
    heading: "Define what you need a CRM to solve",
    body: "Write the jobs the CRM must improve in the first 90 days. Vague goals make every product look “good enough.” Anchor on outcomes your team can observe weekly — not vendor feature checklists.\n\nExample: a 4-person B2B services team agrees on three outcomes — every inbound lead has an owner within one business day, every open deal shows a next step and stage, and Friday reviews run from the CRM board instead of a rebuilt spreadsheet. Anything that does not support those three outcomes is nice-to-have.",
    tip: "Limit yourself to three measurable outcomes. If a feature doesn’t support those outcomes, deprioritize it.",
    figure: {
      src: "/guides/how-to-choose-crm-define-needs.png",
      alt: "Define what you need a CRM to solve: jobs to improve, weekly evidence, top three outcomes, cut extras, team alignment.",
      caption:
        "Vague goals make every product look good enough — anchor on outcomes you can observe weekly.",
    },
    scenarios: [
      {
        title: "Lead management",
        body: "Capture, assign, and follow up without leads dying in inboxes.",
      },
      {
        title: "Pipeline visibility",
        body: "See stage, owner, and next step for every open opportunity.",
      },
      {
        title: "Sales automation",
        body: "Reduce repetitive tasks with sequences that still feel human.",
      },
      {
        title: "Customer history",
        body: "Give anyone on the account the full interaction context.",
      },
      {
        title: "Forecasting",
        body: "Build forecasts from pipeline reality — not spreadsheet optimism.",
      },
    ],
  },
  {
    type: "step",
    id: "step-features",
    stepNumber: 2,
    heading: "Identify must-have vs nice-to-have features",
    body: "Separate requirements that block go-live from extras that can wait. Typical sales-team must-haves: contacts, pipeline stages, activity logging, and basic reporting. Nice-to-haves often include AI summaries, advanced forecasting, or niche marketplace apps.\n\nExample: that same 4-person team marks contacts, stages, email sync, and a weekly pipeline view as must-haves. AI deal summaries and advanced forecasting stay on the nice-to-have list until the board is trusted in Friday reviews.",
    tip: "Ask each stakeholder for their top two must-haves — then reconcile overlaps before demos.",
    figure: {
      src: "/guides/crm-feature-matrix.png",
      alt: "Must-have versus nice-to-have CRM feature matrix for a sales team evaluation.",
      caption:
        "Must-haves unblock go-live; nice-to-haves wait until the core loop is trusted.",
    },
  },
  {
    type: "feature-matrix",
    id: "feature-matrix",
    title: "Must-have vs nice-to-have matrix",
    rows: [
      {
        feature: "Contact & company records",
        mustHave: true,
        niceToHave: false,
        notes: "Core system of record",
      },
      {
        feature: "Pipeline stages & deals",
        mustHave: true,
        niceToHave: false,
        notes: "Match how you sell",
      },
      {
        feature: "Activity history / email sync",
        mustHave: true,
        niceToHave: false,
        notes: "Often a day-one need",
      },
      {
        feature: "Basic reporting",
        mustHave: true,
        niceToHave: false,
        notes: "Weekly pipeline review",
      },
      {
        feature: "Workflow automation",
        mustHave: false,
        niceToHave: true,
        notes: "Useful after process is stable",
      },
      {
        feature: "AI writing / summaries",
        mustHave: false,
        niceToHave: true,
        notes: "Don’t let this drive the buy",
      },
      {
        feature: "Advanced forecasting",
        mustHave: false,
        niceToHave: true,
        notes: "Needs clean pipeline data first",
      },
      {
        feature: "Open API / webhooks",
        mustHave: false,
        niceToHave: true,
        notes: "Critical if you customize heavily",
      },
    ],
  },
  {
    type: "step",
    id: "step-size",
    stepNumber: 3,
    heading: "Match the CRM to your team and company size",
    body: "Tools that delight a solo founder can overwhelm a 40-person sales org — and enterprise platforms can bury a five-person team in admin work. Size fit is about permissions, reporting, and change management as much as seat price.\n\nExample: the 4-person team rejects an enterprise platform that needs a dedicated admin and SSO project. They shortlist simple sales CRMs with shared stages, light permissions, and a trial a non-admin seller can finish in a week.",
    figure: {
      src: "/guides/crm-size-progression.png",
      alt: "CRM size progression from solo and small team to scaling company and enterprise governance needs.",
      caption:
        "Match admin burden and governance to team size — not to aspirational “we might grow into it” plans.",
    },
  },
  {
    type: "size-match",
    id: "size-diagram",
    title: "CRM by business size",
    tiers: [
      {
        id: "solo",
        label: "Solo / freelancer",
        description: "Speed and simplicity beat depth. Prefer low admin overhead.",
        fitHints: ["Minimal fields", "Email-centric workflows"],
      },
      {
        id: "small",
        label: "Small team",
        description: "Shared pipeline and clear ownership without heavy IT.",
        fitHints: ["Shared stages", "Light automation"],
      },
      {
        id: "scaling",
        label: "Scaling company",
        description: "Roles, reporting, and integrations start to matter weekly.",
        fitHints: ["Permissions", "Reliable integrations"],
      },
      {
        id: "enterprise",
        label: "Enterprise",
        description: "Governance, security, and multi-team processes dominate.",
        fitHints: ["SSO / audit", "Complex data model"],
      },
    ],
  },
  {
    type: "step",
    id: "step-integrations",
    stepNumber: 4,
    heading: "Evaluate integrations",
    body: "List the tools your team already lives in. Prefer CRMs with documented integrations for those systems — and verify the workflow you need, not just a logo on a marketplace page.",
    tip: "“Connects to Gmail” is not the same as reliable two-way sync for your use case.",
    figure: {
      src: "/guides/how-to-choose-crm-integrations.png",
      alt: "Evaluate CRM integrations: list tools you live in, mark critical connections, verify documented workflow, trial the path.",
      caption:
        "A marketplace logo is not the same as reliable two-way sync for your use case.",
    },
  },
  {
    type: "integration-ecosystem",
    id: "integration-diagram",
    title: "Integration ecosystem",
    hubLabel: "CRM",
    body: "Your CRM sits in the middle of work — not as an island.",
    systems: [
      { id: "google", label: "Google Workspace" },
      { id: "microsoft", label: "Microsoft 365" },
      { id: "slack", label: "Slack" },
      { id: "mailchimp", label: "Mailchimp" },
      { id: "zoom", label: "Zoom" },
      { id: "quickbooks", label: "QuickBooks" },
      { id: "zapier", label: "Zapier" },
    ],
  },
  {
    type: "step",
    id: "step-cost",
    stepNumber: 5,
    heading: "Understand the real cost",
    body: "List price per seat is only the start. Add required plan tiers for your must-haves, add-ons, and the time to implement and train. Prefer researched prices over marketing “from $X” alone.",
    figure: {
      src: "/guides/how-to-choose-crm-real-cost.png",
      alt: "Understand real CRM cost: seats, plan gates, add-ons, implementation and training, honest estimate band.",
      caption:
        "List price per seat is only the start — model total cost before you fall in love with a demo.",
    },
  },
  {
    type: "cost-breakdown",
    id: "cost-breakdown",
    title: "True cost breakdown",
    body: "Model total cost before you fall in love with a demo.",
    lines: [
      {
        label: "Subscription × seats",
        description: "Plan you’ll actually need for must-have features.",
      },
      {
        label: "Add-ons",
        description: "Automation, AI, phone, extra storage — often gated.",
      },
      {
        label: "Onboarding / training",
        description: "Internal time or partner help to reach adoption.",
      },
      {
        label: "Implementation / migration",
        description: "Importing data and rebuilding workflows — only count researched or quoted costs.",
      },
    ],
    calculatorHref: "/tools/crm-cost-calculator/",
    calculatorLabel: "Estimate seat costs in the CRM Cost Calculator →",
  },
  {
    type: "step",
    id: "step-usability",
    stepNumber: 6,
    heading: "Evaluate usability and adoption",
    body: "A feature-rich CRM that nobody updates is worse than a simpler one with clean habits. Involve the people who will log activities daily — not only the buyer who watches the demo.",
    tip: "Time a real task in each trial (create a deal, log a call, pull a pipeline view) with a non-admin user.",
    figure: {
      src: "/guides/how-to-choose-crm-usability.png",
      alt: "Evaluate CRM usability: create deal, log activity, weekly board, non-admin speed, manager can coach.",
      caption:
        "If only power users can run the trial, sellers will dual-run sheets after go-live.",
    },
  },
  {
    type: "step",
    id: "step-growth",
    stepNumber: 7,
    heading: "Think about growth",
    body: "Check how permissions, custom fields, automation, reporting, APIs, data model flexibility, and internationalization hold up as seats and volume grow. You don’t need enterprise complexity on day one — but you do need a path that doesn’t force a painful migration in a year.",
    tip: "Ask what breaks first as you add seats or custom fields — then validate in a trial.",
    figure: {
      src: "/guides/how-to-choose-crm-growth.png",
      alt: "Think about CRM growth: seats, custom fields, automation, reporting, path without forced rip-and-replace.",
      caption:
        "You don’t need enterprise complexity on day one — but you need a path that won’t force a painful switch in a year.",
    },
  },
  {
    type: "comparison-framework",
    id: "comparison-framework",
    title: "CRM comparison framework (weighted criteria)",
    criteria: [
      {
        id: "process-fit",
        label: "Sales process fit",
        weight: 5,
        description: "Stages, fields, and workflows match how you sell.",
      },
      {
        id: "must-haves",
        label: "Must-have coverage",
        weight: 5,
        description: "Day-one features without forcing an enterprise plan.",
      },
      {
        id: "integrations",
        label: "Integration reality",
        weight: 4,
        description: "Documented workflows for your critical tools.",
      },
      {
        id: "usability",
        label: "Usability & adoption",
        weight: 4,
        description: "Non-admins can complete core tasks quickly.",
      },
      {
        id: "tco",
        label: "Total cost clarity",
        weight: 3,
        description: "Transparent seats, gates, and researched pricing.",
      },
      {
        id: "growth",
        label: "Growth headroom",
        weight: 3,
        description: "Permissions, reporting, API, and data model scale.",
      },
    ],
  },
  {
    type: "crm-types",
    id: "crm-types",
    title: "Which type of CRM should you choose?",
    types: [
      {
        id: "simple-sales",
        title: "Simple sales CRM",
        bestFor: "Small teams that need pipeline + contacts without heavy admin.",
        avoidWhen: "You need complex multi-team governance on day one.",
      },
      {
        id: "sales-engagement",
        title: "Sales engagement–heavy CRM",
        bestFor: "Outbound teams living in sequences, dialers, and email tasks.",
        avoidWhen: "Your pain is account management, not activity volume.",
      },
      {
        id: "all-in-one",
        title: "CRM + marketing suite",
        bestFor: "Teams that want marketing and CRM in one vendor ecosystem.",
        avoidWhen: "You only need sales CRM and hate paying for unused modules.",
      },
      {
        id: "enterprise-platform",
        title: "Enterprise CRM platform",
        bestFor: "Complex processes, security, and multi-department workflows.",
        avoidWhen: "A five-person team can’t staff the admin and change work.",
      },
    ],
  },
  {
    type: "product-shortlist",
    id: "shortlist",
    title: "CRM shortlist (catalogue examples)",
    body: "Use these as evaluation starting points from the SoftwareGlimpse CRM catalogue — then score them with your criteria. This is not an affiliate-ordered ranking.",
    productSlugs: [
      "pipedrive",
      "freshsales",
      "close",
      "salesflare",
      "folk",
      "capsule",
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Common mistakes when choosing a CRM",
    items: [
      {
        title: "Buying features you won’t adopt",
        body: "Unused automation and AI seats still cost money and attention.",
      },
      {
        title: "Ignoring true cost",
        body: "Must-haves often live on higher plans than the marketing “from” price.",
      },
      {
        title: "Skipping non-admin trials",
        body: "If sellers hate logging activity, data quality collapses.",
      },
      {
        title: "Choosing from affiliate lists alone",
        body: "Commissions never equal fit. Use structured criteria and trials.",
      },
      {
        title: "No migration / ownership plan",
        body: "Who owns fields, stages, and cleanup? Undefined ownership kills CRM ROI.",
      },
      {
        title: "Over-customizing on day one",
        body: "Start with a thin process; add fields after real usage patterns appear.",
      },
    ],
  },
  {
    type: "checklist",
    id: "demo-checklist",
    title: "Questions to ask during a CRM demo or trial",
    copyable: true,
    items: [
      {
        id: "q1",
        label: "Show our exact pipeline stages",
        description: "Can we model them without custom code?",
        order: 0,
      },
      {
        id: "q2",
        label: "Email/calendar sync demo",
        description: "Two-way? Permissions? Mobile?",
        order: 1,
      },
      {
        id: "q3",
        label: "Reporting for our weekly review",
        description: "Which plan unlocks it?",
        order: 2,
      },
      {
        id: "q4",
        label: "Integration for our critical tool",
        description: "Live walkthrough of our workflow.",
        order: 3,
      },
      {
        id: "q5",
        label: "Permissions for managers vs reps",
        description: "What can each role see and edit?",
        order: 4,
      },
      {
        id: "q6",
        label: "Export / exit path",
        description: "How do we leave with our data?",
        order: 5,
      },
      {
        id: "q7",
        label: "Implementation timeline",
        description: "What does a realistic 30-day rollout look like?",
        order: 6,
      },
    ],
  },
  {
    type: "trial-plan",
    id: "trial-plan",
    title: "7-day CRM evaluation plan",
    days: [
      {
        day: 1,
        focus: "Setup & stages",
        tasks: [
          "Create a sandbox pipeline matching your real stages",
          "Invite one non-admin seller",
        ],
      },
      {
        day: 2,
        focus: "Core workflow",
        tasks: [
          "Create 10 realistic contacts and 5 deals",
          "Log calls/emails the way your team actually works",
        ],
      },
      {
        day: 3,
        focus: "Integrations",
        tasks: [
          "Connect email/calendar",
          "Test one critical third-party integration end-to-end",
        ],
      },
      {
        day: 4,
        focus: "Reporting",
        tasks: [
          "Build the weekly pipeline view your manager needs",
          "Note which features require a paid upgrade",
        ],
      },
      {
        day: 5,
        focus: "Automation",
        tasks: [
          "Build one simple automation or sequence",
          "Confirm it doesn’t create noise or duplicate tasks",
        ],
      },
      {
        day: 6,
        focus: "Adoption stress test",
        tasks: [
          "Have two sellers complete a full day without admin help",
          "Collect friction notes",
        ],
      },
      {
        day: 7,
        focus: "Decision memo",
        tasks: [
          "Score against your weighted criteria",
          "Document go / no-go and remaining risks",
        ],
      },
    ],
  },
  {
    type: "scorecard",
    id: "scorecard",
    title: "Decision scorecard",
    body: "Score shortlisted products 0–5 on each criterion. Weights mirror the framework above. Your scores stay in this browser — they are not SoftwareGlimpse rankings.",
    criteria: [
      { id: "process-fit", label: "Sales process fit", weight: 5 },
      { id: "must-haves", label: "Must-have coverage", weight: 5 },
      { id: "integrations", label: "Integration reality", weight: 4 },
      { id: "usability", label: "Usability & adoption", weight: 4 },
      { id: "tco", label: "Total cost clarity", weight: 3 },
      { id: "growth", label: "Growth headroom", weight: 3 },
    ],
    productSlugs: ["pipedrive", "freshsales", "close"],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Ready to shortlist?",
    body: "Use CRM Finder for a deterministic shortlist from your answers. Affiliate status never changes the order.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-requirements-guide/",
        label: "CRM requirements guide",
        description: "Write must vs nice first.",
      },
      {
        href: "/guides/crm-evaluation-guide/",
        label: "CRM evaluation guide",
        description: "Score demos and trials fairly.",
      },
      {
        href: "/guides/crm-selection-process/",
        label: "CRM selection process",
        description: "Stages, gates, and owners.",
      },
      {
        href: "/guides/crm-pricing-guide/",
        label: "CRM pricing guide",
        description: "Plans, seats, and cost drivers.",
      },
      {
        href: "/guides/crm-selection-mistakes/",
        label: "CRM selection mistakes",
        description: "Failure patterns to avoid.",
      },
      {
        href: "/guides/what-is-crm/",
        label: "What is CRM?",
        description: "Fundamentals before you buy.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Build the must vs nice sheet.",
      },
      {
        href: "/tools/crm-vendor-scorecard/",
        label: "Vendor Scorecard",
        description: "Score shortlisted CRMs on your criteria.",
      },
      {
        href: "/best/crm-software/",
        label: "Best CRM software",
        description: "Research-backed rankings when available.",
      },
      {
        href: "/tools/crm-cost-calculator/",
        label: "CRM Cost Calculator",
        description: "Seat-cost estimates from researched prices.",
      },
      {
        href: "/categories/crm/",
        label: "CRM category",
        description: "Browse the CRM catalogue.",
      },
      {
        href: "/compare/",
        label: "CRM comparisons",
        description: "Side-by-side product comparisons.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Personalized shortlist from structured answers.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How do I choose the right CRM?",
        answer:
          "Match the tool to your sales process and 90-day outcomes first, then filter by must-have features, integrations, true cost, adoption risk, and growth headroom. Demo at most three products that clear that filter — and score them with a non-admin trial, not a feature brochure.",
      },
      {
        question: "How many CRMs should I demo?",
        answer:
          "Three is usually enough once you have clear must-haves. More demos without criteria tends to increase confusion, not clarity.",
      },
      {
        question: "Should I buy the cheapest plan?",
        answer:
          "Only if the plan includes your must-haves. Cheap list prices often gate reporting, automation, or integrations you need on day one.",
      },
      {
        question: "When should I use CRM Finder vs this guide?",
        answer:
          "Use this guide to define criteria. Use CRM Finder after you know goals and constraints — it shortlists from structured answers; it does not replace a trial against your workflow.",
      },
      {
        question: "Do affiliate relationships affect recommendations?",
        answer:
          "No. Affiliate status does not set rankings, Finder order, or scorecard results on SoftwareGlimpse.",
      },
    ],
  },
];

export const howToChooseCrmGuide: GuidePage = {
  id: "guide-how-to-choose-crm",
  slug: "how-to-choose-crm",
  title: "How to Choose the Right CRM for Your Business",
  summary:
    "A practical decision framework for picking CRM software: needs, features, size fit, integrations, true cost, adoption, and growth — without vendor hype.",
  categorySlugs: ["crm"],
  productSlugs: [
    "pipedrive",
    "freshsales",
    "close",
    "salesflare",
    "folk",
    "capsule",
  ],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/crm-selection-framework-hero.png",
    alt: "7-Step CRM Selection Framework: goals, features, integrations, pricing, ease of use, growth, and decision arranged around a CRM dashboard.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:tool:crm-finder",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:crm-software",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:tool:crm-cost-calculator",
      relationType: "explains-pricing",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:tool:crm-finder",
    label: "Try the CRM Finder",
  },
  relatedGuideSlugs: [
    "crm-requirements-guide",
    "crm-evaluation-guide",
    "crm-selection-process",
    "crm-pricing-guide",
    "crm-vendor-evaluation",
    "crm-selection-mistakes",
    "crm-demo-guide",
    "do-i-need-a-crm",
  ],
  checklist: [],
  blocks: howToChooseBlocks as GuidePage["blocks"],
  sections: [
    {
      id: "quick-answer",
      heading: "Quick answer",
      body: "The right CRM should match your sales process before it matches your feature wishlist.",
    },
    {
      id: "step-needs",
      heading: "Define what you need a CRM to solve",
      body: "Anchor on 90-day outcomes before demos.",
    },
  ],
  faq: [],
  freshnessClass: "medium-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-13T16:00:00.000Z",
    publishedAt: "2026-08-13T12:00:00.000Z",
    reviewedAt: "2026-08-13T16:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "How to Choose the Right CRM for Your Business | SoftwareGlimpse",
    description:
      "Decision framework to choose CRM software: needs, features, size fit, integrations, true cost, adoption, scorecard, and trial plan — without invented claims.",
    canonicalPath: "/guides/how-to-choose-crm/",
    indexable: true,
  },
};
