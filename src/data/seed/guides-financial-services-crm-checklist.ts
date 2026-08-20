import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Financial Services CRM Checklist — buyer sheet from requirements through go-live.
 * Template: softwareglimpse-guide-template-v1
 * Educational / operational only — no invented rankings, prices, or certifications.
 */
const financialServicesCrmChecklistBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Use one financial-services CRM buyer checklist that covers requirements, security questions, pilot proof, and go-live ownership — then refuse to advance a vendor until the current section is checked. Decision rule: if a must-have, access question, or pilot test is still open, you are not ready for contract or firm-wide launch.",
    bullets: [
      "Requirements",
      "Security asks",
      "Pilot tests",
      "Go-live owners",
      "One shared sheet",
      "No silent skips",
    ],
  },
  {
    type: "figure",
    id: "checklist-board",
    title: "Buyer checklist board",
    src: "/guides/financial-services-crm-checklist-board.png",
    alt: "Four-column financial-services CRM buyer checklist board: requirements, security questions, pilot proof, and go-live ownership.",
    caption:
      "Advance vendors column by column — open security or pilot items block go-live, not just the contract.",
  },
  {
    type: "decision-framework",
    id: "fs-checklist-framework",
    title: "How to run the checklist",
    steps: [
      {
        id: "col-requirements",
        label: "Requirements",
        short:
          "Write 90-day outcomes, must-haves with pass/fail tests, constraints, and stakeholders.",
      },
      {
        id: "col-security",
        label: "Security",
        short:
          "Draft the access map, role model, vendor questions, and access-review owner before shortlist expands.",
      },
      {
        id: "col-pilot",
        label: "Pilot",
        short:
          "Run the same script on each finalist — including non-admin permissions and critical integrations.",
      },
      {
        id: "col-golive",
        label: "Go-live",
        short:
          "Name admin ownership, load production roles, schedule hygiene week, book the first Friday board.",
      },
    ],
    ctaHref: "/tools/crm-finder/",
    ctaLabel: "Shortlist after requirements →",
  },
  {
    type: "checklist",
    id: "fs-buyer-checklist",
    title: "Financial services CRM buyer checklist",
    copyable: true,
    items: [
      {
        id: "req-outcomes",
        label: "Three 90-day outcomes written",
        description:
          "Observable weekly — e.g. owned inquiries, honest stages, trusted handoffs.",
        order: 0,
      },
      {
        id: "req-musts",
        label: "Must-haves with pass/fail tests",
        description:
          "Accounts/households, multi-pipeline or stage model, owners, reporting board.",
        order: 1,
      },
      {
        id: "req-constraints",
        label: "Hard constraints listed",
        description: "Email/calendar, admin hours, integrations, budget posture.",
        order: 2,
      },
      {
        id: "req-stakeholders",
        label: "Stakeholders named",
        description: "Buyer, daily advisors/sellers, ops admin, compliance/security owner.",
        order: 3,
      },
      {
        id: "sec-access-map",
        label: "Access map drafted",
        description: "Who needs owned vs team vs firm-wide client visibility.",
        order: 4,
      },
      {
        id: "sec-roles",
        label: "Role model sketched",
        description: "Including export rights and who can change permissions.",
        order: 5,
      },
      {
        id: "sec-vendor-q",
        label: "Same security questions sent to finalists",
        description:
          "Roles, field limits, SSO options on proposed plan, audit export, exit path — in writing.",
        order: 6,
      },
      {
        id: "sec-review-owner",
        label: "Access-review owner named",
        description: "Cadence for joiners/movers/leavers plus periodic review.",
        order: 7,
      },
      {
        id: "pilot-script",
        label: "Pilot script matches must-haves",
        description:
          "Create household, advance deal, log activity, pull Friday board as non-admin.",
        order: 8,
      },
      {
        id: "pilot-permissions",
        label: "Non-admin permissions verified",
        description: "Confirm the role cannot export or see beyond intended scope.",
        order: 9,
      },
      {
        id: "pilot-integrations",
        label: "Critical integrations smoke-tested",
        description: "Email/calendar or other day-one connections on the proposed plan.",
        order: 10,
      },
      {
        id: "pilot-score",
        label: "Pilot scorecard completed for each finalist",
        description: "Same script — no demo-only confidence.",
        order: 11,
      },
      {
        id: "live-admin",
        label: "Go-live admin owner confirmed",
        description: "Fields, stages, and user invites have a named person.",
        order: 12,
      },
      {
        id: "live-roles",
        label: "Production roles loaded before mass invites",
        description: "Avoid everyone-admin for “just setup.”",
        order: 13,
      },
      {
        id: "live-hygiene",
        label: "Hygiene week scheduled",
        description: "Duplicates, next steps, orphan contacts after cutover or launch.",
        order: 14,
      },
      {
        id: "live-review",
        label: "First Friday board review booked",
        description: "Prove the team will use the CRM as the meeting source of truth.",
        order: 15,
      },
    ],
  },
  {
    type: "size-match",
    id: "fs-checklist-by-firm",
    title: "How the checklist scales by firm size",
    tiers: [
      {
        id: "boutique",
        label: "Boutique advisory (≤10 seats)",
        description:
          "Keep one shared sheet. Security column can be lighter on SSO depth but must still cover export rights and exit. Pilot script should take under two hours per finalist.",
        fitHints: [
          "Owner = founder or ops lead",
          "Block on export + access map",
          "Skip multi-pipeline must-haves unless you already run two motions",
        ],
      },
      {
        id: "mid-firm",
        label: "Mid-size FS firm (10–50 seats)",
        description:
          "Require written vendor answers and a non-admin pilot. Separate compliance reviewer from CRM admin. Go-live column needs named hygiene week before mass invites.",
        fitHints: [
          "Compliance signs security column",
          "Same pilot script for all finalists",
          "No everyone-admin during setup",
        ],
      },
      {
        id: "regulated-team",
        label: "Regulated / multi-desk team",
        description:
          "Treat access map and audit-export answers as contract gates. Pilot must prove field-level limits and household visibility. Do not advance to go-live with open must-haves.",
        fitHints: [
          "Field-level access in pilot",
          "Audit export path in writing",
          "Friday board before firm-wide invite",
        ],
      },
    ],
  },
  {
    type: "step",
    id: "fs-checklist-worked-example",
    stepNumber: 1,
    heading: "Worked example: lending team gates signature on export",
    body: "A 14-person B2B lending team used this checklist as the only buying board. Requirements and security columns were complete; pilot scored two finalists equally on household create and stage advance. Signature was blocked for one week until the non-admin role failed the export test on the preferred plan — then passed after the vendor enabled the correct role pack. That single gate prevented a go-live with firm-wide CSV rights.",
    tip: "If a pilot cannot fail a permission test, you are still in demo theater.",
    scenarios: [
      {
        title: "What they refused to skip",
        body: "Non-admin export test, same pilot script, named go-live admin before invites.",
      },
      {
        title: "What stayed nice-to-have",
        body: "Marketing automation sync and custom forecasting dashboards — parked until Friday board worked.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "fs-checklist-mistakes",
    title: "Checklist mistakes that break FS CRM buys",
    items: [
      {
        title: "Shadow spreadsheets beside the board",
        body: "Parallel must-have lists diverge within a week. Keep one sheet owner and refuse silent scope adds.",
      },
      {
        title: "Treating security as a post-contract task",
        body: "Access maps and export answers belong before signature — not as an implementation surprise.",
      },
      {
        title: "Demo-only pilot confidence",
        body: "If a non-admin never runs the Friday board script, you have not proved day-one usability.",
      },
      {
        title: "Everyone-admin during go-live",
        body: "Loading production roles after mass invites creates irreversible oversharing of client records.",
      },
    ],
  },
  {
    type: "expert-tip",
    id: "expert-tip",
    title: "Expert tip",
    body: "Print or share one checklist for the buying committee and refuse parallel “shadow” spreadsheets. When a stakeholder adds a new must-have mid-pilot, either add a pass/fail test or park it as nice-to-have — never silently expand scope without updating the sheet.",
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "Who should own this checklist?",
        answer:
          "Usually the CRM buyer or ops lead, with security/compliance stakeholders signing the access section and advisors signing the pilot script. One sheet owner prevents conflicting versions.",
      },
      {
        question: "Can we skip security questions if we are a small firm?",
        answer:
          "No. Small firms still need an access map, role sketch, and written answers on export and exit. Scale the depth to your risk — do not skip the column.",
      },
      {
        question: "When is the checklist “done”?",
        answer:
          "When requirements tests, security answers, pilot scorecards, and go-live owners are complete for the chosen path. Nice-to-haves can remain open; must-haves and access gates should not.",
      },
      {
        question: "How does this relate to the other FS guides?",
        answer:
          "Requirements and features feed the first column; security and migration/implementation feed the later columns. Use the industry hub for context, then return here as the single progress board.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Turn checklist constraints into a shortlist",
    body: "Once must-haves and access constraints are on the sheet, CRM Finder helps you shortlist researched products without affiliate-ordered rankings — then come back to finish pilot and go-live checks.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
  {
    type: "related-content",
    id: "related",
    title: "Related financial-services CRM resources",
    links: [
      {
        href: "/industries/financial-services/",
        label: "CRM for Financial Services",
        description: "Industry hub for FS buyers.",
      },
      {
        href: "/guides/financial-services-crm/",
        label: "How FS teams use CRM",
        description: "Workflow context for the checklist.",
      },
      {
        href: "/guides/financial-services-crm-requirements/",
        label: "FS CRM requirements",
        description: "Build the requirements column.",
      },
      {
        href: "/guides/financial-services-crm-features/",
        label: "FS CRM features",
        description: "Capability language for must-haves.",
      },
      {
        href: "/guides/financial-services-crm-security/",
        label: "FS CRM security",
        description: "Access map and vendor asks.",
      },
      {
        href: "/guides/financial-services-crm-implementation/",
        label: "FS CRM implementation",
        description: "Pilot and expand after choose.",
      },
      {
        href: "/guides/financial-services-crm-migration/",
        label: "FS CRM migration",
        description: "If you are switching systems.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist from structured answers.",
      },
    ],
  },
];

export const financialServicesCrmChecklistGuide: GuidePage = {
  id: "guide-financial-services-crm-checklist",
  slug: "financial-services-crm-checklist",
  title: "Financial Services CRM Checklist: Requirements, Security, Pilot & Go-Live",
  summary:
    "A copyable financial-services CRM buyer checklist covering requirements, security questions, pilot proof, and go-live ownership — one sheet for the committee.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "checklist",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/financial-services-crm-checklist-hero.png",
    alt: "Financial services CRM checklist hero: requirements, security, pilot, and go-live columns on one buyer board.",
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
  ],
  blocks: financialServicesCrmChecklistBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "requirements",
      label: "Complete requirements column",
      description: "Outcomes, musts, constraints, stakeholders.",
      order: 0,
    },
    {
      id: "security",
      label: "Complete security column",
      description: "Access map, roles, vendor asks, review owner.",
      order: 1,
    },
    {
      id: "pilot-golive",
      label: "Complete pilot and go-live columns",
      description: "Same script; named admin and hygiene.",
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
      "Financial Services CRM Checklist: Buyer Sheet | SoftwareGlimpse",
    description:
      "Copyable financial-services CRM checklist: requirements, security questions, pilot tests, and go-live owners — one sheet for fair vendor comparison.",
    canonicalPath: "/guides/financial-services-crm-checklist/",
    indexable: true,
  },
};
