import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM for Financial Services — how advisory, wealth, and B2B FS teams use CRM.
 * Template: softwareglimpse-guide-template-v1
 * Topic recipe: how-it-works (+ figure, interactive-cta for teaching depth)
 */
const financialServicesCrmBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Financial-services CRM is the shared system of record for client accounts, relationship history, and opportunity pipelines — often with separate boards for advisory work and new-business sales. Decision rule: if planners and sellers rebuild household context from email, or if opportunity status lives in a different tool than client notes, you need one CRM with clear owners and permissions — not another spreadsheet tab.",
    bullets: [
      "Shared client accounts",
      "Relationship history",
      "Multi-pipeline boards",
      "Owned next steps",
      "Role-aware access",
      "Weekly review views",
    ],
  },
  {
    type: "decision-framework",
    id: "fs-crm-loop",
    title: "How FS teams run CRM",
    steps: [
      { id: "capture", label: "Capture", short: "Account + owner" },
      { id: "qualify", label: "Qualify", short: "Route the work" },
      { id: "advance", label: "Advance", short: "Honest stages" },
      { id: "govern", label: "Govern", short: "Who can see what" },
      { id: "review", label: "Review", short: "Stuck items weekly" },
    ],
    ctaHref: "/guides/financial-services-crm-requirements/",
    ctaLabel: "FS CRM requirements →",
  },
  {
    type: "figure",
    id: "fs-crm-hero-visual",
    title: "Advisory and sales on one client record",
    src: "/guides/financial-services-crm-hero.png",
    alt: "Financial-services CRM hero: shared client accounts feeding advisory and sales pipelines with permission boundaries.",
    caption:
      "One account can hold relationship notes and open opportunities — without every seat seeing every field.",
  },
  {
    type: "step",
    id: "advisory-firm-loop",
    stepNumber: 1,
    heading: "Advisory firms: household context before the next meeting",
    body: "Advisory teams use CRM so anyone covering a book sees the same household map, last review, and open tasks — not a planner’s private notebook.\n\nExample: Harborline Advisory (8 people: five planners, one BD lead, one ops admin, one practice lead) used to keep household notes in email and new-business leads in a sheet. After CRM, Contact “Jordan Lee” sits under Account “Lee Household” with spouse and adult child linked, owner Maya, and a dated next-review task. When Maya is out, coverage planner Sam opens the account and sees last quarter’s review note plus the open referral opportunity — no inbox archaeology.",
    tip: "Define household/account roles (primary, spouse, beneficiary contact) before you import a flat contact list — flat lists recreate the silo.",
    figure: {
      src: "/guides/financial-services-crm-workflow.png",
      alt: "Five-step financial-services CRM workflow: capture, qualify, advance, govern, review.",
      caption:
        "Capture → qualify → advance → govern → review is the same loop whether the board is advisory or sales.",
    },
    scenarios: [
      {
        title: "Capture",
        body: "Inquiry or referral lands on an account/contact with a named owner the same day.",
      },
      {
        title: "Qualify",
        body: "Practice lead routes to relationship work vs. a new-business pipeline.",
      },
      {
        title: "Advance",
        body: "Stages move only when discovery, proposal, or onboarding checkpoints actually finish.",
      },
      {
        title: "Govern",
        body: "Team visibility rules limit sensitive fields to roles that need them.",
      },
      {
        title: "Review",
        body: "Friday board shows missing next touches and stuck opportunities.",
      },
    ],
  },
  {
    type: "step",
    id: "wealth-relationship",
    stepNumber: 2,
    heading: "Wealth / relationship teams: history that survives coverage",
    body: "Wealth and ongoing relationship work depends on durable history — meetings, preferences, and open service items attached to the account so coverage and handoffs do not restart from zero.\n\nExample: Crestview Wealth’s relationship manager Priya logs a quarterly review on the Chen Family account with topics discussed and a follow-up to update risk preference. When Priya takes leave, associate Devon opens the same timeline, sees the open task, and completes the follow-up without asking the client to “catch them up.”",
    tip: "Require a next-step date on every open relationship item before you celebrate “we have CRM.” Empty next steps recreate memory-based coverage.",
    scenarios: [
      {
        title: "Meeting notes on the account",
        body: "Reviews and preferences live on the record the team already opens.",
      },
      {
        title: "Coverage without restart",
        body: "A colleague can act from the timeline, not from a forwarded thread.",
      },
      {
        title: "Service vs. opportunity",
        body: "Service tasks and new-money opportunities can share the account with different owners.",
      },
    ],
  },
  {
    type: "step",
    id: "b2b-fs-sales",
    stepNumber: 3,
    heading: "B2B financial-services sales: stages that match real checkpoints",
    body: "B2B FS sales pods use CRM so multi-stakeholder deals encode credit, legal, partner, or product checkpoints — Friday reviews start from blockers, not Slack archaeology.\n\nExample: Meridian Specialty Finance (6 sellers + sales manager + part-time ops) sells equipment financing. Deal “North Park Logistics” stalls because credit review is pending, but the sheet still shows Proposal. In CRM, stage Credit Review requires an owner and a dated checkpoint; the Friday board surfaces that deal as stuck instead of counting it as late-stage forecast fuel.",
    tip: "If a stage does not map to a real approval or meeting your firm already runs, rename or remove it — vendor default stages rarely match FS checkpoints.",
    scenarios: [
      {
        title: "Multi-stakeholder map",
        body: "Buyer, influencer, and internal approvers sit on the same deal with roles.",
      },
      {
        title: "Honest stage exits",
        body: "Deals advance only when the checkpoint your process actually uses is done.",
      },
      {
        title: "Manager coaching",
        body: "Reviews start from missing next steps and overdue stages, not status theater.",
      },
    ],
  },
  {
    type: "step",
    id: "shared-vs-split",
    stepNumber: 4,
    heading: "When advisory and sales should share one CRM",
    body: "Most FS teams should share one CRM for client history, with separate pipelines when the work differs. Two systems that disagree about the same household cost more than configuring two boards.\n\nExample: Harborline’s BD lead opens opportunities on the same accounts planners already use. New-business pipeline stages stay separate from the advisory “review / service” board, but both teams see the Lee Household timeline. Ops admin Keisha owns fields and permissions so BD cannot edit planner-only notes, and planners cannot move sales stages without ownership.",
    tip: "Shared accounts + clear ownership beat “best of breed” silos unless a product gap is proven with a written must-have test.",
    scenarios: [
      {
        title: "Shared account truth",
        body: "One household/account record; multiple pipelines or stages as needed.",
      },
      {
        title: "Permission boundaries",
        body: "Process visibility without dumping every sensitive field to every seat.",
      },
      {
        title: "One admin owner",
        body: "Fields, stages, and access rules need a named owner — not “everyone configures.”",
      },
    ],
  },
  {
    type: "step",
    id: "what-crm-is-not",
    stepNumber: 5,
    heading: "What FS CRM is — and is not",
    body: "CRM holds relationship and opportunity operations. It is not a substitute for your firm’s compliance program, portfolio/trading systems, or legal advice. Use soft operational language: define who needs access, what must be auditable, and which exports/retention rules your policy requires — then verify vendor capabilities against that checklist.\n\nExample: Meridian’s ops lead writes a one-page access matrix (sellers see own book; manager sees team; finance sees revenue fields only) before demos. They ask vendors how permission changes and exports are logged — without treating marketing pages as certifications.",
    tip: "Treat security and audit needs as requirements with owners — not as logos you paste from a vendor homepage.",
  },
  {
    type: "expert-tip",
    id: "expert-tip",
    title: "Expert tip",
    body: "Pilot one book of business (one planner pod or one sales territory) until Friday reviews run from the board without a side spreadsheet. Expand seats only after owners, stages, and next-step hygiene hold for two consecutive weeks — automation and fancy reporting wait until that trust exists.",
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How do financial services teams use CRM?",
        answer:
          "They keep client accounts, relationship history, and opportunity pipelines in one system of record — often with separate boards for advisory/relationship work and new-business sales — so coverage, handoffs, and weekly reviews do not depend on inboxes or personal sheets.",
      },
      {
        question: "Do we need an industry-specific CRM?",
        answer:
          "Not always. Many advisory and B2B FS teams succeed with a general CRM configured for accounts, multiple pipelines, and strong permissions. Choose a purpose-built product only when a written must-have cannot be modeled in a general tool — verify in demos, not from category labels.",
      },
      {
        question: "Should advisory and sales share one CRM?",
        answer:
          "Usually yes for client history, with separate pipelines when workflows differ. Shared accounts plus clear ownership beat two systems that disagree about the same household.",
      },
      {
        question: "What is different about CRM in financial services vs. generic sales CRM?",
        answer:
          "Emphasis shifts to household/account context, multi-pipeline design, permission discipline, and honest stages that encode real checkpoints. The core loop (capture → advance → log → review) is the same; the objects and governance are stricter.",
      },
      {
        question: "How should we talk about security and compliance in CRM?",
        answer:
          "Write operational requirements: roles, field access, audit/export needs, and who owns access reviews. Confirm those with vendors and your internal policy owners. Educational guides should not invent certification claims — verify documentation yourself.",
      },
      {
        question: "What should we read next?",
        answer:
          "Turn this operating model into a must vs nice sheet with Financial Services CRM Requirements, then map capabilities in FS CRM Features before you shortlist in CRM Finder.",
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
        description: "Industry hub: priorities, use cases, and workflow.",
      },
      {
        href: "/guides/financial-services-crm-requirements/",
        label: "FS CRM requirements",
        description: "Must-haves, nice-to-haves, and demo-ready tests.",
      },
      {
        href: "/guides/financial-services-crm-features/",
        label: "FS CRM features",
        description: "Capabilities that matter for advisory and sales.",
      },
      {
        href: "/guides/financial-services-crm-implementation/",
        label: "FS CRM implementation",
        description: "Pilot → hygiene → expand rollout path.",
      },
      {
        href: "/guides/financial-services-crm-security/",
        label: "FS CRM security",
        description: "Permissions, audit needs, and vendor questions.",
      },
      {
        href: "/guides/financial-services-crm-migration/",
        label: "FS CRM migration",
        description: "Move history without losing the thread.",
      },
      {
        href: "/guides/financial-services-crm-checklist/",
        label: "FS CRM checklist",
        description: "Copyable gates across choose and implement.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist from structured answers — not affiliate order.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Ready to shortlist for financial services?",
    body: "Once you know how your advisory or sales loop should run, CRM Finder maps constraints to researched products — without affiliate-ordered rankings.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const financialServicesCrmGuide: GuidePage = {
  id: "guide-financial-services-crm",
  slug: "financial-services-crm",
  title: "CRM for Financial Services: How Teams Use It",
  summary:
    "How advisory, wealth, and B2B financial-services teams use CRM as a shared client system — multi-pipeline boards, relationship history, and role-aware access — without invented product rankings.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "how-it-works",
  journeyStage: "understand",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/financial-services-crm-hero.png",
    alt: "Financial-services CRM hero: shared client accounts feeding advisory and sales pipelines with permission boundaries.",
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
  blocks: financialServicesCrmBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "map-loop",
      label: "Map your FS CRM loop",
      description: "Capture → qualify → advance → govern → review.",
      order: 0,
    },
    {
      id: "name-pipelines",
      label: "Name advisory vs sales boards",
      description: "Shared accounts; separate stages when work differs.",
      order: 1,
    },
    {
      id: "access-owner",
      label: "Name access & field owner",
      description: "Who maintains permissions and hygiene.",
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
    title: "CRM for Financial Services: How Teams Use It | SoftwareGlimpse",
    description:
      "How advisory, wealth, and B2B financial-services teams use CRM — shared accounts, multi-pipeline boards, and role-aware access — without invented rankings.",
    canonicalPath: "/guides/financial-services-crm/",
    indexable: true,
  },
};
