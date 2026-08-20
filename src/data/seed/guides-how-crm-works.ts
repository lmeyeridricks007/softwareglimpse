import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * How CRM works — operational model of the system of record.
 * Template: softwareglimpse-guide-template-v1
 */
const howCrmWorksBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM software works as a shared system of record: people and companies are stored as records, deals move through pipeline stages, and emails, calls, and tasks stay attached to those records. Decision rule: the product is useful only when the team relies on that data enough to run follow-ups, handoffs, and pipeline reviews from it — not from memory or scattered spreadsheets.",
    bullets: [
      "Records (contacts & companies)",
      "Deals & stages",
      "Activity history",
      "Ownership & permissions",
      "Automation triggers",
      "Reporting views",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Objects first, features second",
        body: "Contacts, companies, deals, and activities are the core model. Features are just ways to create and update those records faster.",
      },
      {
        label: "The loop is capture → advance → log → review",
        body: "Every sales CRM implements some version of that loop. Customization changes stages and fields — not the basic job.",
      },
      {
        label: "Trust is the real product",
        body: "If owners, stages, and history are unreliable, dashboards and automation amplify noise instead of helping.",
      },
      {
        label: "Integrations feed the record",
        body: "Email sync, forms, and calendars matter because they keep activity on the same deal — not because “integration count” looks impressive.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "operating-model",
    title: "The CRM operating model",
    steps: [
      { id: "obj-contact", label: "Contact", short: "Person you sell to" },
      { id: "obj-company", label: "Company", short: "Account / org" },
      { id: "obj-deal", label: "Deal", short: "Opportunity in motion" },
      { id: "obj-activity", label: "Activity", short: "What happened" },
      { id: "obj-owner", label: "Owner", short: "Who is responsible" },
      { id: "obj-report", label: "Report", short: "What the data says" },
    ],
    ctaHref: "/guides/types-of-crm/",
    ctaLabel: "See CRM types →",
    figure: {
      src: "/guides/how-crm-works-operating-model.png",
      alt: "CRM operating model hub with contact, company, deal, activity, owner, and report spokes.",
      caption: "CRM works when these objects stay linked under clear ownership.",
    },
  },
  {
    type: "size-match",
    id: "worked-loop",
    title: "Worked example: Harbor Sales vs a spreadsheet",
    tiers: [
      {
        id: "harbor-loop",
        label: "When the loop is real",
        description:
          "Worked example: Harbor Sales (eight AEs) logs every follow-up on the deal. Monday pipeline review opens the CRM, not a sheet. Handoffs to CS keep the same company record.",
        fitHints: ["Shared ownership", "Activity on the deal", "Weekly review from CRM"],
      },
      {
        id: "sheet-still-wins",
        label: "When a sheet still wins",
        description:
          "Worked example: a two-person founder sale with 12 named accounts. If nobody will log activity, a CRM just duplicates the spreadsheet — skip until the capture → advance → log loop is a weekly ritual.",
        fitHints: ["Tiny named list", "No shared handoff", "Do not buy for the dashboard"],
      },
    ],
  },
  {
    type: "figure",
    id: "system-of-record-visual",
    title: "CRM as a system of record",
    src: "/guides/how-crm-works-hero.png",
    alt: "CRM system of record linking contacts, companies, deals, and activities.",
    caption:
      "Everything useful in a CRM is either a record or an update to a record.",
  },
  {
    type: "step",
    id: "lifecycle-loop",
    stepNumber: 1,
    heading: "The day-to-day CRM loop",
    body: "Most sales CRMs implement the same operational loop. A lead or contact is captured, someone owns qualification, a deal advances through stages that match how you sell, activities are logged against the record, and the team reviews pipeline health.\n\nExample: at Northwind Labs (5 sellers), a form creates Contact “Riley Ng,” AE Jordan qualifies and opens a Deal, moves it to Proposal after a discovery call, logs the proposal email on that deal, and the manager reviews all Proposal deals Friday without rebuilding a sheet.",
    tip: "If your stages do not match how you actually sell, the loop still “works” — it just produces misleading forecasts.",
    figure: {
      src: "/guides/how-crm-works-lifecycle.png",
      alt: "Five-stage CRM lifecycle: Capture, Qualify, Advance, Log activity, Review.",
      caption: "Customization changes fields and stages — not this basic loop.",
    },
    scenarios: [
      {
        title: "Capture",
        body: "Forms, imports, manual entry, or inbound tools create a contact/lead record.",
      },
      {
        title: "Qualify",
        body: "An owner decides whether the opportunity is real and worth a deal.",
      },
      {
        title: "Advance",
        body: "The deal moves through stages with required fields and next steps.",
      },
      {
        title: "Log",
        body: "Emails, calls, meetings, and tasks stay attached to the same record.",
      },
      {
        title: "Review",
        body: "Managers and reps use pipeline and activity views without rebuilding spreadsheets.",
      },
    ],
  },
  {
    type: "step",
    id: "activity-layer",
    stepNumber: 2,
    heading: "How activity history stays attached",
    body: "Email sync, calling, calendars, and task tools only help when they write back to the contact or deal. That shared history is what makes handoffs possible — a new owner should see the last conversation without hunting through inboxes.\n\nExample: when AE Jordan goes on PTO, teammate Sam opens the Acme deal and sees yesterday’s call note and the open “send proposal” task — no inbox archaeology required.",
    tip: "Prefer reliable logging of the channels you actually use over exotic channel coverage you will ignore.",
    figure: {
      src: "/guides/how-crm-works-activity-sync.png",
      alt: "Email, phone, and calendar feeding a single CRM contact and deal timeline.",
      caption: "The value is one timeline — not another disconnected inbox.",
    },
    scenarios: [
      {
        title: "Email sync",
        body: "Messages associated with a contact appear on the record for the team.",
      },
      {
        title: "Calls & meetings",
        body: "Outcomes and notes stay with the deal so follow-ups are visible.",
      },
      {
        title: "Tasks",
        body: "Next steps are owned and dated — not stuck in a personal to-do list.",
      },
    ],
  },
  {
    type: "step",
    id: "automation-reporting",
    stepNumber: 3,
    heading: "Automation and reporting sit on top of clean records",
    body: "Workflow automation can assign owners, create tasks, or notify teammates when a stage changes. Reporting aggregates deals and activities into pipeline and forecast views. Both assume stages, owners, and close dates are maintained — otherwise automation creates noise and reports invent confidence.\n\nExample: when Northwind moves a deal to Proposal, automation creates a “send proposal” task for the owner and notifies the manager. Their Friday report only counts deals with owners and close dates — empty stages are treated as process incidents, not forecast fuel.",
    tip: "Fix data hygiene and stage definitions before you build complex automations.",
    figure: {
      src: "/guides/how-crm-works-automation-reporting.png",
      alt: "Layered diagram showing automation and reporting sitting on clean CRM records and activity history.",
      caption: "Automation amplifies whatever is in the records — clean data first.",
    },
  },
  {
    type: "feature-matrix",
    id: "what-the-system-must-do",
    title: "What has to work for CRM to “work”",
    figure: {
      src: "/guides/how-crm-works-must-work.png",
      alt: "Checklist of must-work CRM foundations: owners, stages, logging, shared definitions, reporting cadence, and admin.",
      caption: "If these foundations fail, features and automation will not save the rollout.",
    },
    rows: [
      {
        feature: "Reliable contact & company records",
        mustHave: true,
        niceToHave: false,
        notes: "Duplicates destroy trust",
      },
      {
        feature: "Pipeline stages that match reality",
        mustHave: true,
        niceToHave: false,
        notes: "Vendor defaults rarely fit",
      },
      {
        feature: "Shared activity history",
        mustHave: true,
        niceToHave: false,
        notes: "Handoffs depend on it",
      },
      {
        feature: "Clear ownership",
        mustHave: true,
        niceToHave: false,
        notes: "Who follows up next?",
      },
      {
        feature: "Basic pipeline reporting",
        mustHave: true,
        niceToHave: false,
        notes: "Weekly review without sheets",
      },
      {
        feature: "Advanced AI insights",
        mustHave: false,
        niceToHave: true,
        notes: "Useful later — not day one",
      },
      {
        feature: "Deep customization on week one",
        mustHave: false,
        niceToHave: true,
        notes: "Often slows adoption",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "How teams break the CRM model",
    items: [
      {
        title: "Treating CRM as a filing cabinet",
        body: "If deals are not updated until month-end, the system cannot support daily follow-ups or honest forecasts.",
      },
      {
        title: "Automating a messy process",
        body: "Automation on unclear stages and duplicate contacts multiplies bad data.",
      },
      {
        title: "Skipping ownership rules",
        body: "Without clear owners, activities pile up and nobody is accountable for the next step.",
      },
      {
        title: "Confusing adjacent tools with CRM",
        body: "Marketing automation or sales intelligence can feed CRM — they do not replace the system of record unless that is their real job.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How does CRM software work?",
        answer:
          "As a shared system of record: contacts and companies are records, deals move through stages, and activities stay attached so the team can run follow-ups, handoffs, and pipeline reviews from trusted data — not from memory.",
      },
      {
        question: "Is CRM just a contact database?",
        answer:
          "Contacts are the foundation, but the operating value comes from deals, stages, ownership, and activity history working together. Example: a handoff only works when the new owner can see the last call note on the deal.",
      },
      {
        question: "Do I need automation on day one?",
        answer:
          "Usually no. Get capture, ownership, stages, and logging reliable first. Automate after the team trusts the records.",
      },
      {
        question: "Where does reporting data come from?",
        answer:
          "From the same deals and activities reps maintain. If those fields are empty or inconsistent, reports will look precise and still be wrong.",
      },
      {
        question: "What should I read next?",
        answer:
          "Read Types of CRM to pick the right product shape, then How to Choose a CRM for a buying framework — or CRM Finder for a shortlist.",
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
        description: "Beginner definition and building blocks.",
      },
      {
        href: "/guides/types-of-crm/",
        label: "Types of CRM",
        description: "Operational shapes and who they fit.",
      },
      {
        href: "/guides/crm-benefits/",
        label: "CRM benefits",
        description: "What the workflow actually changes.",
      },
      {
        href: "/guides/crm-examples/",
        label: "CRM examples",
        description: "Real team workflows end to end.",
      },
      {
        href: "/guides/do-i-need-a-crm/",
        label: "Do I need a CRM?",
        description: "Readiness check before you shop.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Buying framework before you shortlist.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist from structured answers.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Write must vs nice before demos.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Ready to compare options?",
    body: "Once you understand the CRM model, use CRM Finder to map your team’s answers to researched products. Affiliate status never changes the order.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const howCrmWorksGuide: GuidePage = {
  id: "guide-how-crm-works",
  slug: "how-crm-works",
  title: "How CRM Software Works: Records, Pipelines & Activity",
  summary:
    "Understand how CRM software actually operates — contacts, companies, deals, activity history, automation, and reporting — so you can evaluate products without vendor fog.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "how-it-works",
  journeyStage: "understand",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/how-crm-works-hero.png",
    alt: "CRM system of record connecting contacts, companies, deals, and activities.",
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
    "types-of-crm",
    "crm-benefits",
    "crm-examples",
    "crm-glossary",
    "do-i-need-a-crm",
    "how-to-choose-crm",
  ],
  blocks: howCrmWorksBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "records",
      label: "Understand core records",
      description: "Contacts, companies, deals, activities.",
      order: 0,
    },
    {
      id: "loop",
      label: "Map your sales loop",
      description: "Capture → qualify → advance → log → review.",
      order: 1,
    },
    {
      id: "trust",
      label: "Define trust rules",
      description: "Ownership, stage exit criteria, logging norms.",
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
    title: "How CRM Software Works | SoftwareGlimpse",
    description:
      "Learn how CRM software works as a system of record — contacts, pipelines, activity history, automation, and reporting — without invented claims.",
    canonicalPath: "/guides/how-crm-works/",
    indexable: true,
  },
};
