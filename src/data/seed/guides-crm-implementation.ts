import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Implementation Guide (pillar) — journey from plan → pilot → adopt.
 * Template: softwareglimpse-guide-template-v1
 */
const crmImplementationBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM implementation succeeds when you treat it as a gated operating change — plan outcomes and owners, pilot one segment on a core loop, prove hygiene in weekly reviews, then expand seats and light automation. Decision rule: do not calendar firm-wide go-live until one real team runs Friday reviews from the board for two consecutive weeks without a side spreadsheet.",
    bullets: [
      "Plan outcomes",
      "Name owners",
      "Pilot core loop",
      "Prove hygiene",
      "Expand seats",
      "Automate last",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Implementation is change work",
        body: "Configuration without owners and review habits is decoration.",
      },
      {
        label: "Pilot beats big-bang",
        body: "One pod or territory proves the loop before you inherit every messy process.",
      },
      {
        label: "Hygiene before automation",
        body: "Task spam on dishonest stages trains people to ignore the CRM.",
      },
      {
        label: "Deep-link the hard parts",
        body: "Planning, timeline ranges, and cost categories each deserve their own guide.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "implementation-journey",
    title: "CRM implementation journey",
    steps: [
      { id: "plan", label: "Plan", short: "Outcomes & RACI" },
      { id: "configure", label: "Configure", short: "Core loop only" },
      { id: "migrate", label: "Migrate", short: "Pilot slice" },
      { id: "pilot", label: "Pilot", short: "Two clean Fridays" },
      { id: "expand", label: "Expand", short: "Seats & light automations" },
    ],
    ctaHref: "/tools/crm-implementation-planner/",
    ctaLabel: "Implementation Planner →",
  },
  {
    type: "figure",
    id: "implementation-roadmap",
    title: "Implementation roadmap",
    src: "/guides/_shared/implementation-day-zero.png",
    alt: "SoftwareGlimpse shared CRM implementation day-zero visual system: access, objects, pipeline, import, and first live workflow.",
    caption:
      "Shared SoftwareGlimpse day-zero kit — access → objects → pipeline → pilot import → first live workflow. Expand only after two clean Friday reviews.",
  },
  {
    type: "feature-matrix",
    id: "day-zero-vs-later",
    title: "Day-zero vs later configuration",
    rows: [
      {
        feature: "Users, roles, and permissions",
        mustHave: true,
        niceToHave: false,
        notes: "Match the access matrix before data entry.",
      },
      {
        feature: "Accounts, contacts, pipelines matching real work",
        mustHave: true,
        niceToHave: false,
        notes: "Rename or remove vendor defaults you never use.",
      },
      {
        feature: "Required owner + next-step fields",
        mustHave: true,
        niceToHave: false,
        notes: "Hygiene depends on these being non-optional.",
      },
      {
        feature: "Email / calendar sync for the pilot pod",
        mustHave: true,
        niceToHave: false,
        notes: "Prove one logged activity before inviting more seats.",
      },
      {
        feature: "Marketplace apps and AI add-ons",
        mustHave: false,
        niceToHave: true,
        notes: "After two clean Friday reviews — not day zero.",
      },
      {
        feature: "Multi-branch automation and scoring models",
        mustHave: false,
        niceToHave: true,
        notes: "Automate proven repetitive work only.",
      },
      {
        feature: "Full historical import of every note",
        mustHave: false,
        niceToHave: true,
        notes: "Pilot needs trusted open work; bulk history is a migration project.",
      },
    ],
  },
  {
    type: "checklist",
    id: "pre-implementation-checklist",
    title: "Before implementation starts",
    copyable: true,
    items: [
      {
        id: "outcomes",
        label: "Three 90-day outcomes frozen",
        description: "What “working” looks like in reviews — not a feature wishlist.",
        order: 0,
      },
      {
        id: "admin",
        label: "Admin / ops owner named with hours",
        description: "Fields, users, duplicates, and permission exceptions.",
        order: 1,
      },
      {
        id: "sponsor",
        label: "Executive sponsor named",
        description: "Unblocks scope fights and protects pilot time.",
        order: 2,
      },
      {
        id: "pilot",
        label: "Pilot segment chosen",
        description: "One pod, book, or territory — not the whole company.",
        order: 3,
      },
      {
        id: "success",
        label: "Pilot exit criteria written",
        description: "Two Friday reviews from the board without a side sheet.",
        order: 4,
      },
      {
        id: "cost-buckets",
        label: "Cost categories listed",
        description: "Subscription, admin time, migration, training — no invented totals.",
        order: 5,
      },
    ],
  },
  {
    type: "step",
    id: "plan-the-change",
    stepNumber: 1,
    heading: "Plan outcomes, owners, and pilot scope",
    body: "Freeze three 90-day outcomes, a RACI-ish map (who is Responsible / Accountable for fields, users, data, training), and a pilot segment large enough to feel real. Build the phase plan in the Implementation Planner — do not start from a vendor “week 1–12” slide as truth.\n\nExample: Northline Ops, a 12-person B2B services team, freezes outcomes as (1) every open opportunity has an owner and next-step date, (2) Monday pipeline reviews run from the board, (3) delivery handoffs stop living in Slack threads. Ops lead Jordan owns admin ~3 hours/week; sales manager Priya is accountable for stage honesty; founder Sam sponsors scope. They pilot Priya’s four-person delivery+sales pod first.",
    tip: "If nobody can name the admin and the pilot exit criteria, you are still in discovery — not implementation.",
    figure: {
      src: "/guides/crm-implementation-hero.png",
      alt: "CRM implementation hero: annotated SaaS rollout board showing plan, pilot, hygiene gate, and expand phases with owner chips.",
      caption:
        "Implementation is a gated board — plan and ownership come before firm-wide seats.",
    },
    scenarios: [
      {
        title: "Services / agency",
        body: "Pilot one client-delivery pod plus related opportunities.",
      },
      {
        title: "Sales-led SaaS",
        body: "Pilot one AE territory with manager coaching from the board.",
      },
      {
        title: "Founder-led",
        body: "Pilot the founder’s book plus first hire — prove handoffs early.",
      },
    ],
  },
  {
    type: "step",
    id: "configure-core-loop",
    stepNumber: 2,
    heading: "Configure the core loop only",
    body: "Day-zero setup: users/roles, account and contact essentials, pipelines that match how you actually sell or deliver, required owner + next-step fields, and email/calendar sync for the pilot. Defer marketplace apps, scoring models, and multi-branch automations.\n\nExample: Northline configures Accounts, Contacts, one New Business pipeline (Discovery → Proposal → Negotiation → Won/Lost), and a Delivery Handoff checklist field. Jordan bans custom fields not on the requirements sheet and runs a weekly field-request triage. They prove one logged email on a live deal before inviting the rest of the pod.",
    tip: "Every new field needs an owner who will keep it accurate — otherwise delete it from the pilot.",
    scenarios: [
      {
        title: "Roles first",
        body: "Permissions match the access matrix before bulk data entry.",
      },
      {
        title: "Stages match reality",
        body: "Remove vendor defaults your process never uses.",
      },
      {
        title: "Sync that feeds records",
        body: "One proven activity attachment beats ten empty integrations.",
      },
    ],
  },
  {
    type: "step",
    id: "migrate-pilot-slice",
    stepNumber: 3,
    heading: "Migrate a pilot slice — not the whole archive",
    body: "Import or enter what the pilot needs to trust coverage and open work: active accounts, open opportunities, and key contacts. Prefer a clean pilot over dumping years of unowned notes on day one. Use the Migration Planner for inventory, field mapping, and cutover gates when history matters.\n\nExample: Northline imports ~90 active client accounts and 34 open opportunities from Sheets. They leave closed-lost notes older than 18 months in archive until after two clean Fridays. Jordan runs a dedupe pass and assigns owners before Priya’s first board review.",
    tip: "Unowned historical rows are debt — they do not create trust on week one.",
    scenarios: [
      {
        title: "Spreadsheet exit",
        body: "Clean open rows first; archive stale tabs.",
      },
      {
        title: "Tool-to-tool",
        body: "Map fields and owners; test import before cutover.",
      },
      {
        title: "Greenfield",
        body: "Enter live work only — skip fake sample data for the pilot.",
      },
    ],
  },
  {
    type: "step",
    id: "prove-hygiene",
    stepNumber: 4,
    heading: "Prove hygiene before you expand",
    body: "Hygiene means every open item has an owner and next-step date, stages only move when exit criteria are met, duplicates are merged on a schedule, and permission exceptions are rare and reviewed. Gate expansion on two consecutive clean Friday (or Monday) reviews from the board.\n\nExample: Northline’s first Monday review fails — seven deals lack next steps. Priya and Jordan run a 20-minute hygiene huddle twice a week until the overdue view is empty. Only then does Sam approve inviting the second pod.",
    tip: "Treat empty next steps and orphan accounts as incidents — not as “we’ll clean later.”",
    scenarios: [
      {
        title: "Owner + next step",
        body: "No open deal or delivery item without both.",
      },
      {
        title: "Stage honesty",
        body: "Managers reject stage jumps that skip real checkpoints.",
      },
      {
        title: "Access exceptions",
        body: "Temporary broader access has an expiry and a named approver.",
      },
    ],
  },
  {
    type: "step",
    id: "expand-and-automate",
    stepNumber: 5,
    heading: "Expand seats, then add light automation",
    body: "After the hygiene gate passes, invite the next segment with the same core configuration and train on the pilot’s real records. Add only automations that remove proven repetitive work (stale-deal alerts, missing next-step reminders). Park AI features and complex multi-branch flows until the board stays trusted.\n\nExample: Northline expands to the second pod after two clean Mondays. Jordan clones roles, imports the next account slice carefully, and adds one automation: notify owner when next-step date is blank for seven days. Scoring and marketplace dialers stay parked for a quarter.",
    tip: "Expansion is a people change — schedule training on real records, not a generic vendor webinar alone.",
    scenarios: [
      {
        title: "Clone what worked",
        body: "Same stages, fields, and review ritual — do not reinvent per team.",
      },
      {
        title: "Automate proven pain",
        body: "Reminders after hygiene holds; never to “force adoption.”",
      },
      {
        title: "Measure adoption",
        body: "Track empty next steps and side-sheet usage — not login vanity.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "High-cost implementation mistakes",
    items: [
      {
        title: "Firm-wide go-live on week one",
        body: "You inherit every messy process at once and lose the ability to fix the loop quickly.",
      },
      {
        title: "Configuring everything before anyone works",
        body: "Empty decorated workspaces do not create trust; one complete core loop does.",
      },
      {
        title: "Automating before hygiene",
        body: "Task spam on dishonest stages trains people to ignore the CRM.",
      },
      {
        title: "No admin hours on the calendar",
        body: "Without a named owner, fields and permissions drift and teams return to sheets.",
      },
      {
        title: "Treating vendor timelines as guarantees",
        body: "Week ranges are planning aids — gate on evidence, not slide numbers.",
      },
      {
        title: "Inventing cost totals from seat tiles",
        body: "List categories (subscription, time, migration, training) and use calculators — never fake dollar sums.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is CRM implementation?",
        answer:
          "The operating change of configuring a CRM, migrating a usable data slice, training a pilot team, proving hygiene in weekly reviews, and expanding. It is not “turning the product on.” Decision rule: if reviews still rebuild status in spreadsheets, implementation is incomplete.",
      },
      {
        question: "How long does CRM implementation take?",
        answer:
          "Ranges vary by scope — a focused pod can prove a core loop in a few weeks; multi-team rollouts often span months. See the Implementation Timeline guide for phase ranges. Never treat a vendor kickoff calendar as a guarantee.",
      },
      {
        question: "What should we configure on day zero?",
        answer:
          "Users/roles, account and contact essentials, pipelines that match real work, owner + next-step fields, and email/calendar sync for the pilot. Defer marketplace apps and heavy automation.",
      },
      {
        question: "When should we migrate historical data?",
        answer:
          "Import what the pilot needs to trust coverage and open opportunities. Prefer a clean pilot over dumping years of unowned notes. Use the Migration Planner for bulk history projects.",
      },
      {
        question: "How do we estimate implementation cost?",
        answer:
          "List categories — qualifying subscription, admin time, migration/cleanup, training, add-ons — without inventing totals. Use the Cost Calculator and TCO Calculator for researched bands; see the Implementation Cost guide for decision rules.",
      },
      {
        question: "Who should own CRM implementation?",
        answer:
          "An executive sponsor for scope, an ops/admin owner for configuration and hygiene, and a business owner (sales/delivery lead) for stage honesty and adoption. RACI details belong in the Planning guide.",
      },
      {
        question: "What should I do next?",
        answer:
          "Build a phase plan in the CRM Implementation Planner, then deep-dive Planning, Timeline, and Cost guides as needed. If the product choice is still open, use CRM Finder first.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related implementation resources",
    links: [
      {
        href: "/guides/crm-implementation-planning/",
        label: "Plan CRM implementation",
        description: "Outcomes, RACI, and pilot scope.",
      },
      {
        href: "/guides/crm-implementation-timeline/",
        label: "Implementation timeline",
        description: "Phase week ranges — not guarantees.",
      },
      {
        href: "/guides/crm-implementation-cost/",
        label: "Implementation cost",
        description: "Cost categories and decision rules.",
      },
      {
        href: "/guides/crm-implementation-roles/",
        label: "Implementation roles",
        description: "Who owns what during rollout.",
      },
      {
        href: "/guides/crm-data-migration/",
        label: "CRM data migration",
        description: "Pilot import and cutover.",
      },
      {
        href: "/guides/crm-go-live/",
        label: "CRM go-live",
        description: "Launch gates after the pilot.",
      },
      {
        href: "/guides/crm-adoption/",
        label: "CRM adoption",
        description: "Habits after seats expand.",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "CRM Implementation Planner",
        description: "Phases, tasks, risks, go-live checklist.",
      },
      {
        href: "/tools/crm-migration-planner/",
        label: "CRM Migration Planner",
        description: "Inventory, mapping, test & cutover.",
      },
      {
        href: "/tools/crm-tco-calculator/",
        label: "CRM TCO Calculator",
        description: "Ownership categories beyond seats.",
      },
      {
        href: "/tools/crm-cost-calculator/",
        label: "CRM Cost Calculator",
        description: "Qualifying plan subscription bands.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist if product choice is still open.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "planner-cta",
    title: "Turn this journey into a plan",
    body: "Use the CRM Implementation Planner to structure phases, tasks, risks, and a go-live checklist from your requirements — without invented vendor timelines.",
    href: "/tools/crm-implementation-planner/",
    ctaLabel: "Build implementation plan →",
    variant: "finder",
  },
];

export const crmImplementationGuide: GuidePage = {
  id: "guide-crm-implementation",
  slug: "crm-implementation",
  title: "CRM Implementation Guide: Plan, Pilot, Expand",
  summary:
    "Implement CRM as a gated operating change — plan outcomes and owners, configure a core loop, prove hygiene in weekly reviews, then expand seats and light automation.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "implementation",
  journeyStage: "implement",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/crm-implementation-hero.png",
    alt: "CRM implementation hero: annotated SaaS rollout board showing plan, pilot, hygiene gate, and expand phases with owner chips.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:tool:crm-implementation-planner",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:tool:crm-migration-planner",
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
    contentId: "content:tool:crm-implementation-planner",
    label: "Build an implementation plan",
  },
  relatedGuideSlugs: [
    "crm-implementation-planning",
    "crm-implementation-timeline",
    "crm-implementation-cost",
    "crm-implementation-roles",
    "crm-implementation-mistakes",
    "crm-data-migration",
    "crm-go-live",
    "crm-adoption",
    "crm-training",
  ],
  blocks: crmImplementationBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "outcomes-owners",
      label: "Freeze outcomes, admin owner, and pilot segment",
      description: "RACI-ish ownership before configuration.",
      order: 0,
    },
    {
      id: "core-loop",
      label: "Configure core loop + migrate pilot slice",
      description: "Roles, pipelines, sync, owner + next step.",
      order: 1,
    },
    {
      id: "hygiene-expand",
      label: "Expand after two clean weekly reviews",
      description: "Then seats and light automation.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T10:00:00.000Z",
    publishedAt: "2026-08-14T10:00:00.000Z",
    reviewedAt: "2026-08-14T10:00:00.000Z",
    researchStatus: "complete",
    seoStatus: "optimized",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "CRM Implementation Guide: Plan, Pilot, Expand | SoftwareGlimpse",
    description:
      "Implement CRM with a gated plan → configure → pilot → expand path. Hygiene before automation; deep links to planning, timeline, and cost guides.",
    canonicalPath: "/guides/crm-implementation/",
    indexable: true,
  },
};
