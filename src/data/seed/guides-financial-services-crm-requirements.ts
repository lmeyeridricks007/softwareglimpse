import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Financial Services CRM Requirements — must-haves vs nice-to-haves for FS buyers.
 * Template: softwareglimpse-guide-template-v1
 */
const financialServicesCrmRequirementsBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Write financial-services CRM requirements from 90-day outcomes first — shared client history, honest pipelines, owned next steps — then split must-have vs nice-to-have against stakeholders and hard constraints (permissions, integrations, admin capacity). Decision rule: a requirement is demo-ready only when every must-have has an owner, a pass/fail check, and a named constraint — if you cannot script the Harborline or Meridian scenario from the sheet, keep writing.",
    bullets: [
      "90-day FS outcomes",
      "Must vs nice",
      "Relationship history",
      "Multi-pipeline",
      "Permissions & reporting",
      "Demo-ready sheet",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Outcomes beat vertical wishlists",
        body: "“Finance CRM” labels do not replace observable outcomes like coverage without inbox rebuild or Friday boards without side sheets.",
      },
      {
        label: "Must-haves need pass/fail checks",
        body: "Relationship history, multi-pipeline, permissions, and reporting only count when you can test them in a demo script.",
      },
      {
        label: "Permissions are requirements",
        body: "Who sees which fields is a day-one constraint for FS teams — not a post-go-live polish item.",
      },
      {
        label: "One sheet for every vendor",
        body: "Deliverable is a requirements sheet advisory and sales stakeholders reuse across demos.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "fs-requirements-path",
    title: "FS requirements path",
    steps: [
      { id: "outcomes", label: "Outcomes", short: "90-day results" },
      { id: "stakeholders", label: "Stakeholders", short: "Who decides" },
      { id: "must-nice", label: "Must vs nice", short: "Split the list" },
      { id: "constraints", label: "Constraints", short: "Access & admin" },
      { id: "sheet", label: "Sheet", short: "Demo-ready" },
    ],
    ctaHref: "/guides/financial-services-crm-features/",
    ctaLabel: "FS CRM features →",
  },
  {
    type: "figure",
    id: "requirements-matrix-visual",
    title: "Must-have vs nice-to-have for FS CRM",
    src: "/guides/financial-services-crm-requirements-matrix.png",
    alt: "Financial-services CRM requirements matrix separating must-have relationship, pipeline, permission, and reporting needs from nice-to-haves.",
    caption:
      "Must-haves unblock trusted weekly use; nice-to-haves wait until the core loop holds.",
  },
  {
    type: "step",
    id: "write-fs-outcomes",
    stepNumber: 1,
    heading: "Start with three 90-day FS outcomes",
    body: "Name results planners and sellers can observe weekly — not vendor feature names. Limit to three so demos stay comparable.\n\nExample: Harborline Advisory writes: (1) every household has a named owner and next-review date, (2) every open new-business opportunity shows stage + next step by Friday, (3) coverage planners can open an account and see last review notes without email search. Features that do not support those three stay nice-to-have — including AI writing aids and marketplace apps.",
    tip: "If a stakeholder cannot describe how they will verify the outcome in a Friday review, rewrite the outcome.",
    figure: {
      src: "/guides/financial-services-crm-requirements-hero.png",
      alt: "Financial-services CRM requirements hero: outcomes, stakeholders, must-haves, and constraints feeding a demo-ready sheet.",
      caption:
        "Requirements start from FS outcomes and access constraints — not from a vertical feature grid.",
    },
    scenarios: [
      {
        title: "Coverage readiness",
        body: "Anyone covering a book sees household context and next steps.",
      },
      {
        title: "Pipeline truth",
        body: "Weekly reviews read the board instead of rebuilding status.",
      },
      {
        title: "Handoff quality",
        body: "BD and planning share account history without duplicate systems.",
      },
    ],
  },
  {
    type: "step",
    id: "stakeholders-constraints",
    stepNumber: 2,
    heading: "Map stakeholders and hard constraints",
    body: "List who must approve, who will use daily, and who will admin. Capture email/calendar you already live in, permission expectations, admin hours, and budget posture before demos.\n\nExample: Meridian Specialty Finance names the sales manager as buyer, six sellers as daily users, and ops lead Ana as part-time admin (≈3 hours/week). Hard constraints: Microsoft 365 mail/calendar sync, manager visibility of the team book, seller visibility limited to owned accounts, and no dedicated CRM hire in year one.",
    tip: "Ask each stakeholder for two must-haves only — then reconcile overlaps before writing the sheet.",
    scenarios: [
      {
        title: "Buyer vs daily user",
        body: "Buyers care about reporting and access; sellers care about logging speed.",
      },
      {
        title: "Admin capacity",
        body: "If nobody owns fields and roles, FS complexity fails regardless of features.",
      },
      {
        title: "Integration truth",
        body: "A marketplace logo is not the same as the mail/calendar workflow you need.",
      },
    ],
  },
  {
    type: "step",
    id: "must-vs-nice-fs",
    stepNumber: 3,
    heading: "Split FS must-haves from nice-to-haves",
    body: "Must-haves for most FS packs: durable relationship/account history, multi-pipeline (or clearly separated stage models), role-aware permissions, owned next steps, and a weekly reporting board. Nice-to-haves: deep automation libraries, AI summaries, advanced forecasting modules, and niche vertical add-ons — after the core loop is trusted.\n\nExample: Crestview Wealth marks household hierarchy + activity timeline + role permissions as must-have with pass/fail demo scripts. “Portfolio dashboard widgets” stay nice-to-have until reviews already run from CRM notes.",
    tip: "Cap must-haves to what your three outcomes need — long vertical wishlists recreate feature shopping.",
  },
  {
    type: "feature-matrix",
    id: "must-nice-matrix",
    title: "Must-have vs nice-to-have (FS starter)",
    rows: [
      {
        feature: "Accounts/contacts with relationship history",
        mustHave: true,
        niceToHave: false,
        notes: "Coverage depends on it",
      },
      {
        feature: "Multi-pipeline or separated stage models",
        mustHave: true,
        niceToHave: false,
        notes: "Advisory vs new business",
      },
      {
        feature: "Owner + next-step fields",
        mustHave: true,
        niceToHave: false,
        notes: "Supports 90-day outcomes",
      },
      {
        feature: "Role / team permissions",
        mustHave: true,
        niceToHave: false,
        notes: "Access is a day-one need",
      },
      {
        feature: "Basic pipeline / activity reporting",
        mustHave: true,
        niceToHave: false,
        notes: "Friday review without rebuild",
      },
      {
        feature: "Email/calendar sync you already use",
        mustHave: true,
        niceToHave: false,
        notes: "Constraint, not wishlist",
      },
      {
        feature: "Workflow automation library",
        mustHave: false,
        niceToHave: true,
        notes: "After process is stable",
      },
      {
        feature: "AI summaries / writing aids",
        mustHave: false,
        niceToHave: true,
        notes: "Do not drive the buy",
      },
    ],
    figure: {
      src: "/guides/financial-services-crm-requirements-matrix.png",
      alt: "Must-have versus nice-to-have financial-services CRM feature matrix.",
      caption: "Reuse this split in every vendor demo and trial scorecard.",
    },
  },
  {
    type: "selection-checklist",
    id: "requirements-dimensions",
    title: "FS requirements sheet dimensions",
    dimensions: [
      {
        id: "outcomes",
        label: "90-day outcomes",
        options: [
          "Household/account ownership",
          "Coverage without inbox rebuild",
          "Pipeline visibility",
          "Follow-up discipline",
          "Honest stage checkpoints",
        ],
      },
      {
        id: "stakeholders",
        label: "Stakeholders",
        options: [
          "Practice / sales lead",
          "Planners / advisors",
          "Sellers / BD",
          "Ops/admin",
          "Compliance / risk liaison",
        ],
      },
      {
        id: "constraints",
        label: "Hard constraints",
        options: [
          "Email/calendar",
          "Permission model",
          "Admin hours",
          "Export / retention needs",
          "Budget posture",
        ],
      },
      {
        id: "must-haves",
        label: "Must-have tests",
        options: [
          "Create account + related contacts",
          "Open deal on second pipeline",
          "Restrict field by role",
          "Log activity on account",
          "Pull weekly board / export sample",
        ],
      },
    ],
  },
  {
    type: "checklist",
    id: "sheet-ready",
    title: "Demo-ready FS requirements sheet",
    copyable: true,
    items: [
      {
        id: "three-outcomes",
        label: "Three 90-day FS outcomes written",
        description: "Observable in a weekly advisory or sales review.",
        order: 0,
      },
      {
        id: "must-split",
        label: "Must vs nice split agreed",
        description: "Each must-have has a pass/fail check.",
        order: 1,
      },
      {
        id: "permissions",
        label: "Access matrix sketched",
        description: "Who sees which books and sensitive fields.",
        order: 2,
      },
      {
        id: "constraints",
        label: "Constraints listed",
        description: "Integrations, admin hours, budget, audit/export needs.",
        order: 3,
      },
      {
        id: "owners",
        label: "Stakeholder owners named",
        description: "Buyer, daily users, admin, policy liaison.",
        order: 4,
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "FS requirements mistakes",
    items: [
      {
        title: "Starting from “finance CRM” feature grids",
        body: "You will inflate nice-to-haves and skip outcomes vendors cannot fake in a scripted demo.",
      },
      {
        title: "Must-haves without tests",
        body: "“Good permissions” means nothing until you define who sees which account fields in a live scenario.",
      },
      {
        title: "Ignoring admin and access constraints",
        body: "A perfect feature set fails if nobody can maintain roles or your inbox will not sync.",
      },
      {
        title: "Treating certifications as the requirements sheet",
        body: "Ask for documentation and map it to your access/audit needs — do not invent or assume certifications as facts in the sheet.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How do I write CRM requirements for financial services?",
        answer:
          "Start with three observable 90-day outcomes (coverage, pipeline truth, handoffs), map stakeholders and access constraints, then split must-have vs nice-to-have with pass/fail checks. You are ready for demos when the sheet alone can drive a consistent script across vendors.",
      },
      {
        question: "What are must-have CRM features for FS teams?",
        answer:
          "Typically: accounts/contacts with relationship history, multi-pipeline or clear stage separation, owner + next-step fields, role/team permissions, basic reporting, and email/calendar sync you already use. Confirm with your outcomes — do not copy a vendor grid.",
      },
      {
        question: "What can wait as nice-to-have?",
        answer:
          "Heavy automation libraries, AI assistants, advanced forecasting modules, and niche vertical widgets — until Friday reviews already run from trusted CRM data.",
      },
      {
        question: "How many must-haves should we list?",
        answer:
          "Prefer a short list tied to the three outcomes. Long must-have lists recreate feature shopping and stall demos.",
      },
      {
        question: "When should compliance or risk join requirements?",
        answer:
          "Early enough to capture access, audit, and export needs as constraints — not after a preferred vendor is already chosen from a demo.",
      },
      {
        question: "What should I do next?",
        answer:
          "Use the sheet against FS CRM Features and Security guides, then shortlist with CRM Finder once must-haves and constraints are clear.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related financial services CRM resources",
    links: [
      {
        href: "/industries/financial-services/",
        label: "CRM for Financial Services",
        description: "Industry hub overview and priorities.",
      },
      {
        href: "/guides/financial-services-crm/",
        label: "How FS teams use CRM",
        description: "Operating model and worked examples.",
      },
      {
        href: "/guides/financial-services-crm-features/",
        label: "FS CRM features",
        description: "Map must-haves to capabilities.",
      },
      {
        href: "/guides/financial-services-crm-security/",
        label: "FS CRM security",
        description: "Permissions and audit question set.",
      },
      {
        href: "/guides/financial-services-crm-implementation/",
        label: "FS CRM implementation",
        description: "Roll out after the sheet is ready.",
      },
      {
        href: "/guides/financial-services-crm-migration/",
        label: "FS CRM migration",
        description: "Data move planning.",
      },
      {
        href: "/guides/financial-services-crm-checklist/",
        label: "FS CRM checklist",
        description: "Copyable gates for the pack.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Generate the sheet step by step.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist from structured answers.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Ready to shortlist?",
    body: "Once FS outcomes and must-haves are on the sheet, CRM Finder maps constraints to researched products — without affiliate-ordered rankings.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const financialServicesCrmRequirementsGuide: GuidePage = {
  id: "guide-financial-services-crm-requirements",
  slug: "financial-services-crm-requirements",
  title: "Financial Services CRM Requirements: Must-Haves vs Nice-to-Haves",
  summary:
    "Write demo-ready financial-services CRM requirements from 90-day outcomes — relationship history, multi-pipeline, permissions, and reporting — without vertical feature shopping.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/financial-services-crm-requirements-hero.png",
    alt: "Financial-services CRM requirements hero: outcomes, stakeholders, must-haves, and constraints feeding a demo-ready sheet.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:industry:financial-services",
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
    "financial-services-crm",
    "financial-services-crm-requirements",
    "financial-services-crm-features",
    "financial-services-crm-implementation",
    "financial-services-crm-security",
    "financial-services-crm-migration",
    "financial-services-crm-checklist",
  ],
  blocks: financialServicesCrmRequirementsBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "outcomes",
      label: "Write three 90-day FS outcomes",
      description: "Observable in weekly reviews.",
      order: 0,
    },
    {
      id: "must-nice",
      label: "Split must vs nice with tests",
      description: "Pass/fail checks for each must-have.",
      order: 1,
    },
    {
      id: "constraints",
      label: "Capture access & admin constraints",
      description: "Permissions matrix, integrations, budget.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T12:00:00.000Z",
    publishedAt: "2026-08-14T12:00:00.000Z",
    reviewedAt: "2026-08-14T12:00:00.000Z",
    researchStatus: "complete",
    seoStatus: "optimized",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title:
      "Financial Services CRM Requirements: Must-Haves | SoftwareGlimpse",
    description:
      "How to write FS CRM requirements: relationship history, multi-pipeline, permissions, and reporting — demo-ready must vs nice without invented claims.",
    canonicalPath: "/guides/financial-services-crm-requirements/",
    indexable: true,
  },
};
