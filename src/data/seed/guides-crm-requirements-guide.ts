import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Requirements Guide — must-haves, nice-to-haves, stakeholders.
 * Template: softwareglimpse-guide-template-v1
 */
const crmRequirementsGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Write CRM requirements from 90-day outcomes first, then split must-have vs nice-to-have features against real stakeholders and hard constraints (integrations, admin capacity, budget). Decision rule: a requirement is ready for demos only when every must-have has an owner, a pass/fail check, and a named constraint — if you cannot run a demo script from the sheet, keep writing.",
    bullets: [
      "90-day outcomes",
      "Must vs nice",
      "Stakeholder map",
      "Integrations & admin",
      "Budget posture",
      "Demo-ready sheet",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Outcomes beat feature wishlists",
        body: "Vendors will match any long list; only observable 90-day outcomes keep the shortlist honest.",
      },
      {
        label: "Must-haves need pass/fail checks",
        body: "If you cannot test it in a trial or demo, it is not a requirement yet.",
      },
      {
        label: "Constraints are requirements too",
        body: "Integrations, who will admin, and budget posture kill more buys than missing AI features.",
      },
      {
        label: "One sheet for demos",
        body: "Deliverable is a requirements sheet sellers and buyers can reuse across every vendor conversation.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "requirements-path",
    title: "Requirements path",
    steps: [
      { id: "outcomes", label: "Outcomes", short: "90-day results" },
      { id: "stakeholders", label: "Stakeholders", short: "Who decides" },
      { id: "must-nice", label: "Must vs nice", short: "Split the list" },
      { id: "constraints", label: "Constraints", short: "Integrations & admin" },
      { id: "sheet", label: "Sheet", short: "Demo-ready" },
    ],
    ctaHref: "/guides/crm-evaluation-guide/",
    ctaLabel: "Evaluation guide →",
    figure: {
      src: "/guides/crm-requirements-path.png",
      alt: "CRM requirements path: 90-day outcomes, stakeholders, must vs nice, tests, freeze the demo sheet.",
      caption:
        "Start from outcomes and constraints — not from vendor feature grids.",
    },
  },
  {
    type: "size-match",
    id: "worked-sheet",
    title: "Worked example: Harbor’s 90-day sheet",
    tiers: [
      {
        id: "must",
        label: "Must-haves they can test",
        description:
          "Worked example: Harbor Sales writes three 90-day outcomes — every deal has an owner, email is on the contact, Monday reviews use one pipeline. Each has a pass/fail demo check and an owner on the sheet.",
        fitHints: ["Owner per must-have", "Pass/fail in trial", "Named constraint"],
      },
      {
        id: "nice",
        label: "Nice-to-haves they freeze",
        description:
          "Worked example: AI summaries and a custom forecasting module stay nice-to-have until the core loop is trusted. Pulse’s admin capacity is a constraint, not a feature request.",
        fitHints: ["Freeze before demos", "Admin time is a requirement", "Do not let vendors expand musts"],
      },
    ],
  },
  {
    type: "figure",
    id: "requirements-matrix-visual",
    title: "Must-have vs nice-to-have",
    src: "/guides/crm-requirements-guide-matrix.png",
    alt: "CRM requirements matrix separating must-have outcomes and features from nice-to-haves, with stakeholder and constraint columns.",
    caption:
      "Must-haves unblock go-live; nice-to-haves wait until the core loop is trusted in weekly use.",
  },
  {
    type: "step",
    id: "write-outcomes",
    stepNumber: 1,
    heading: "Start with three 90-day outcomes",
    body: "Name results your team can observe weekly — not vendor feature names. Limit to three so demos stay comparable.\n\nExample: a 6-person B2B services team (two sellers, founder, ops lead, two delivery) writes: (1) every inbound lead has an owner within one business day, (2) every open deal shows stage + next step by Friday, (3) handoffs to delivery include notes without rebuilding from email. Features that do not support those three stay nice-to-have.",
    tip: "If a stakeholder cannot describe how they will verify the outcome in a Friday review, rewrite the outcome.",
    figure: {
      src: "/guides/crm-requirements-guide-hero.png",
      alt: "CRM requirements guide hero: outcomes, stakeholders, must-haves, and constraints feeding a demo-ready requirements sheet.",
      caption:
        "Requirements start from outcomes and constraints — not from a marketplace feature grid.",
    },
    scenarios: [
      {
        title: "Lead ownership",
        body: "No lead sits unassigned past a stated SLA.",
      },
      {
        title: "Pipeline truth",
        body: "Weekly reviews read the board instead of rebuilding status.",
      },
      {
        title: "Handoff quality",
        body: "Delivery gets context without hunting inboxes.",
      },
    ],
  },
  {
    type: "step",
    id: "stakeholders-constraints",
    stepNumber: 2,
    heading: "Map stakeholders and hard constraints",
    body: "List who must approve, who will use daily, and who will admin. Capture integrations you already live in, admin hours available, and budget posture before demos start.\n\nExample: the same 6-person team names the founder as buyer, both sellers as daily users, and the ops lead as part-time admin (≈2 hours/week). Hard constraints: Google Workspace email/calendar sync, Slack notifications, and no dedicated CRM admin hire in year one.",
    tip: "Ask each stakeholder for two must-haves only — then reconcile overlaps before writing the sheet.",
    figure: {
      src: "/guides/crm-requirements-stakeholders.png",
      alt: "Map CRM stakeholders and hard constraints: buyer, daily users, admin capacity, integrations, freeze constraints.",
      caption:
        "A must-have without an admin who will keep it accurate is adoption debt.",
    },
    scenarios: [
      {
        title: "Buyer vs daily user",
        body: "Buyers care about reporting; sellers care about logging speed — both belong on the sheet.",
      },
      {
        title: "Admin capacity",
        body: "If nobody owns fields and stages, enterprise complexity fails regardless of features.",
      },
      {
        title: "Integration truth",
        body: "Logo on a marketplace page is not the same as the workflow you need.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "must-nice-matrix",
    title: "Must-have vs nice-to-have (starter)",
    rows: [
      {
        feature: "Contacts, companies, deals/stages",
        mustHave: true,
        niceToHave: false,
        notes: "Core system of record",
      },
      {
        feature: "Owner + next-step fields",
        mustHave: true,
        niceToHave: false,
        notes: "Supports 90-day outcomes",
      },
      {
        feature: "Email/calendar sync you already use",
        mustHave: true,
        niceToHave: false,
        notes: "Constraint, not wishlist",
      },
      {
        feature: "Basic pipeline report / board",
        mustHave: true,
        niceToHave: false,
        notes: "Friday review without rebuild",
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
      src: "/guides/crm-feature-matrix.png",
      alt: "Must-have versus nice-to-have CRM feature matrix.",
      caption: "Reuse this split in every vendor demo and trial scorecard.",
    },
  },
  {
    type: "selection-checklist",
    id: "requirements-dimensions",
    title: "Requirements sheet dimensions",
    dimensions: [
      {
        id: "outcomes",
        label: "90-day outcomes",
        options: [
          "Lead ownership SLA",
          "Pipeline visibility",
          "Follow-up discipline",
          "Handoff quality",
          "Forecast hygiene",
        ],
      },
      {
        id: "stakeholders",
        label: "Stakeholders",
        options: ["Buyer", "Daily sellers", "Ops/admin", "Delivery/CS", "Finance"],
      },
      {
        id: "constraints",
        label: "Hard constraints",
        options: [
          "Email/calendar",
          "Marketing/support tools",
          "Admin hours",
          "Security baseline",
          "Budget posture",
        ],
      },
      {
        id: "must-haves",
        label: "Must-have tests",
        options: [
          "Create deal + owner",
          "Log activity",
          "Pull weekly board",
          "Sync critical inbox",
          "Export sample data",
        ],
      },
    ],
  },
  {
    type: "checklist",
    id: "sheet-ready",
    title: "Demo-ready requirements sheet",
    copyable: true,
    items: [
      {
        id: "three-outcomes",
        label: "Three 90-day outcomes written",
        description: "Observable in a weekly review.",
        order: 0,
      },
      {
        id: "must-split",
        label: "Must vs nice split agreed",
        description: "Each must-have has a pass/fail check.",
        order: 1,
      },
      {
        id: "constraints",
        label: "Constraints listed",
        description: "Integrations, admin, budget, security baseline.",
        order: 2,
      },
      {
        id: "owners",
        label: "Stakeholder owners named",
        description: "Buyer, daily users, admin.",
        order: 3,
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Requirements mistakes",
    items: [
      {
        title: "Starting from vendor feature grids",
        body: "You will inflate nice-to-haves and skip outcomes vendors cannot fake in a scripted demo.",
      },
      {
        title: "Must-haves without tests",
        body: "“Good reporting” means nothing until you define the Friday board view you need.",
      },
      {
        title: "Ignoring admin and integration constraints",
        body: "A perfect feature set fails if nobody can maintain fields or your inbox will not sync.",
      },
      {
        title: "Letting every stakeholder add five must-haves",
        body: "Cap inputs, reconcile overlaps, and protect the three outcomes.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How do I write CRM requirements?",
        answer:
          "Start with three observable 90-day outcomes, map stakeholders and hard constraints, then split must-have vs nice-to-have features with pass/fail checks. You are ready for demos when the sheet alone can drive a consistent script across vendors.",
      },
      {
        question: "What belongs on a CRM requirements sheet?",
        answer:
          "Outcomes, must-haves with tests, nice-to-haves, integrations, admin capacity, budget posture, security baseline, and named owners for buyer, daily users, and admin.",
      },
      {
        question: "How many must-haves should we list?",
        answer:
          "Prefer a short list tied to the three outcomes — typically a handful of day-one capabilities. Long must-have lists recreate feature shopping.",
      },
      {
        question: "When should we involve delivery or finance?",
        answer:
          "Early enough to capture handoff and cost constraints — not after a preferred vendor is already chosen from a demo.",
      },
      {
        question: "What should I do next?",
        answer:
          "Use the sheet in CRM Evaluation Guide scorecards and trials, or shortlist with CRM Finder once must-haves and constraints are clear.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Full selection framework.",
      },
      {
        href: "/guides/crm-evaluation-guide/",
        label: "CRM evaluation guide",
        description: "Scorecards and fair trials.",
      },
      {
        href: "/guides/crm-rfp-guide/",
        label: "CRM RFP guide",
        description: "Packet the sheet into a vendor brief.",
      },
      {
        href: "/guides/crm-demo-guide/",
        label: "CRM demo guide",
        description: "Run demos against your must-haves.",
      },
      {
        href: "/guides/do-i-need-a-crm/",
        label: "Do I need a CRM?",
        description: "Confirm need before requirements depth.",
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
    id: "requirements-builder-cta",
    title: "Build the sheet, don’t start from a blank doc",
    body: "The Requirements Builder walks outcomes, must vs nice, integrations, and admin capacity into one sheet you can hand to vendors.",
    href: "/tools/crm-requirements-builder/",
    ctaLabel: "Open Requirements Builder →",
    variant: "generic",
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Ready to shortlist?",
    body: "Once outcomes and must-haves are on the sheet, CRM Finder maps constraints to researched products — without affiliate-ordered rankings.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmRequirementsGuide: GuidePage = {
  id: "guide-crm-requirements-guide",
  slug: "crm-requirements-guide",
  title: "CRM Requirements Guide: Must-Haves, Nice-to-Haves & Stakeholders",
  summary:
    "Write demo-ready CRM requirements from 90-day outcomes, must vs nice features, stakeholders, and hard constraints — without feature-wishlist shopping.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/crm-requirements-guide-hero.png",
    alt: "CRM requirements guide hero: outcomes, stakeholders, must-haves, and constraints feeding a demo-ready requirements sheet.",
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
    "how-to-choose-crm",
    "crm-evaluation-guide",
    "crm-rfp-guide",
    "crm-demo-guide",
    "crm-selection-process",
    "crm-vendor-evaluation",
    "do-i-need-a-crm",
  ],
  blocks: crmRequirementsGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "outcomes",
      label: "Write three 90-day outcomes",
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
      label: "Capture stakeholders & constraints",
      description: "Integrations, admin hours, budget.",
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
    title: "CRM Requirements Guide: Must-Haves & Stakeholders | SoftwareGlimpse",
    description:
      "How to write CRM requirements: 90-day outcomes, must vs nice, stakeholders, and constraints — ready for fair demos.",
    canonicalPath: "/guides/crm-requirements-guide/",
    indexable: true,
  },
};
