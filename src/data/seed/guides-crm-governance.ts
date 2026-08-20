import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Governance Guide — field ownership, change control, access reviews, admin backlog.
 * Template: softwareglimpse-guide-template-v1
 */
const crmGovernanceBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM governance is named ownership for fields, stages, permissions, and the admin backlog — with change control before configuration drifts. Decision rule: do not add or change stages, required fields, roles, or automations without a written request, impact review, and communicate step. If nobody owns a field or the admin queue is unlimited, freeze new config until RACI and review cadence exist.",
    bullets: [
      "Field ownership",
      "Change control",
      "Access reviews",
      "Admin backlog",
      "Freeze on drift",
      "Communicate changes",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Every field needs an owner",
        body: "Unowned fields become optional noise and break reporting trust.",
      },
      {
        label: "Stages are policy, not preference",
        body: "Stage and required-field changes go through change control.",
      },
      {
        label: "Access is reviewed, not assumed",
        body: "Quarterly (or more often) access reviews catch privilege creep.",
      },
      {
        label: "Admin backlog is finite",
        body: "Prioritize by risk to hygiene and adoption — not by who yelled last.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "governance-path",
    title: "Governance operating path",
    steps: [
      { id: "raci", label: "RACI", short: "Name owners" },
      { id: "control", label: "Change control", short: "Request → audit" },
      { id: "access", label: "Access reviews", short: "Least privilege" },
      { id: "backlog", label: "Admin backlog", short: "Finite queue" },
      { id: "audit", label: "Audit cadence", short: "Fields & stages" },
    ],
    ctaHref: "/guides/crm-data-quality/",
    ctaLabel: "Data quality guide →",
  },
  {
    type: "figure",
    id: "change-control-visual",
    title: "Change control for stages and fields",
    src: "/guides/crm-governance-change-control.png",
    alt: "CRM change-control workflow from request through impact review, approve or reject, configure, communicate, and audit.",
    caption:
      "Configuration without communicate + audit is how quiet drift kills trust.",
  },
  {
    type: "checklist",
    id: "governance-standup-checklist",
    title: "Stand up governance in one week",
    copyable: true,
    items: [
      {
        id: "admin-r",
        label: "Name admin R/A with hours",
        description: "Fields, users, permissions, duplicates — on the calendar.",
        order: 0,
      },
      {
        id: "field-owners",
        label: "Assign owners for required fields",
        description: "Business owner + admin implementer for each.",
        order: 1,
      },
      {
        id: "change-form",
        label: "Publish a one-page change request",
        description: "What, why, who impacted, rollback, communicate plan.",
        order: 2,
      },
      {
        id: "access-cadence",
        label: "Schedule access review",
        description: "Roles, exceptions, inactive users, export rights.",
        order: 3,
      },
      {
        id: "backlog-wip",
        label: "Cap admin WIP",
        description: "Finite in-progress tickets; park nice-to-haves.",
        order: 4,
      },
    ],
  },
  {
    type: "step",
    id: "field-ownership",
    stepNumber: 1,
    heading: "Assign field and stage ownership",
    body: "List required and reporting-critical fields. Each needs a business owner (defines meaning and when it must be filled) and an admin implementer (configures validation and views). Stage definitions get the same treatment: exit criteria written, owner named, managers trained to reject dishonest jumps.\n\nExample: Blue Harbor Logistics discovers fourteen custom fields with no owner after six months. Ops lead Devon deletes nine unused fields, assigns owners to five that feed Friday reviews, and freezes new fields until a change request exists.",
    tip: "If you cannot name who will keep a field accurate, do not create it.",
    figure: {
      src: "/guides/crm-governance-hero.png",
      alt: "CRM governance hero: field ownership RACI, change-request queue, access review checklist, and admin backlog.",
      caption:
        "Governance is visible operating work — ownership, control, reviews, and a finite backlog.",
    },
    scenarios: [
      {
        title: "Required fields",
        body: "Owner + next step + stage always have business owners.",
      },
      {
        title: "Reporting fields",
        body: "Anything on an exec dashboard needs a data steward.",
      },
      {
        title: "Optional clutter",
        body: "Unused for two review cycles → archive or delete via change control.",
      },
    ],
  },
  {
    type: "step",
    id: "change-control",
    stepNumber: 2,
    heading: "Put stages and fields under change control",
    body: "Treat stage edits, required-field changes, permission model changes, and automations as controlled changes. Flow: request → impact review (who breaks, what reports change) → approve/reject → configure in a controlled window → communicate → short audit that the change behaved.\n\nExample: Meridian Specialty Finance wants a new “Credit Review” stage. Ana rejects a same-day config ask, runs a fifteen-minute impact review with sales and credit, updates exit criteria docs, then configures and announces in the Monday briefing before the stage appears.",
    tip: "Emergency fixes still get a same-day written note — silent hotfix culture recreates chaos.",
    scenarios: [
      {
        title: "Stage rename",
        body: "Update definitions, coach managers, check historical reports.",
      },
      {
        title: "New required field",
        body: "Prove who fills it; train before enforcement goes hard.",
      },
      {
        title: "Automation",
        body: "Only after hygiene holds — noisy automations undermine governance.",
      },
    ],
  },
  {
    type: "step",
    id: "access-reviews",
    stepNumber: 3,
    heading: "Run access reviews on a cadence",
    body: "Privilege creep is normal: contractors linger, managers inherit broad roles, export rights spread. Schedule reviews of roles, exception grants, inactive seats, and sensitive-field visibility. Document exceptions with expiry and approver.\n\nExample: Harborline Advisory’s quarterly review finds two former contractors still in a reporting role and a temporary “see all households” grant without expiry. Keisha revokes both, adds expiry to future exceptions, and logs the review date on the governance checklist.",
    tip: "Least privilege is a habit, not a one-time setup checkbox.",
    scenarios: [
      {
        title: "Role drift",
        body: "Compare actual permissions to the access matrix; close gaps.",
      },
      {
        title: "Inactive users",
        body: "Disable seats that have not worked the core loop for your defined window.",
      },
      {
        title: "Sensitive fields",
        body: "Confirm who can see financial or personal fields after org changes.",
      },
    ],
  },
  {
    type: "step",
    id: "admin-backlog",
    stepNumber: 4,
    heading: "Run a finite admin backlog",
    body: "Unlimited “can you add a field?” queues destroy focus. Cap work-in-progress, triage weekly, and prioritize items that protect hygiene, adoption, or security over cosmetic requests. Publish what is parked and why.\n\nExample: Crestview Wealth’s admin backlog had forty-two open asks. Priya caps WIP at five, groups duplicates, and parks AI-scoring experiments until Day-60 adoption gates pass. Requesters see the queue status in a shared note.",
    tip: "Saying no (or later) with a reason is governance — not rudeness.",
    scenarios: [
      {
        title: "Hygiene blockers",
        body: "Duplicate rules, required fields, broken views — first.",
      },
      {
        title: "Adoption blockers",
        body: "Manager coaching views and next-step enforcement next.",
      },
      {
        title: "Nice-to-haves",
        body: "Park until gates pass; revisit monthly.",
      },
    ],
  },
  {
    type: "step",
    id: "governance-cadence",
    stepNumber: 5,
    heading: "Keep a light governance cadence",
    body: "Weekly: admin triage + hygiene glance. Monthly: field/stage audit and backlog reorder. Quarterly: access review and RACI refresh. Tie governance to adoption and data-quality rituals so it stays operational, not ceremonial.\n\nExample: Blue Harbor’s monthly audit finds three stages nobody can define. They merge two via change control and retrain managers — governance preventing another quarter of dishonest forecasts.",
    tip: "If governance meetings produce no decisions, shorten them and raise the backlog WIP visibility.",
    scenarios: [
      {
        title: "Small team",
        body: "Same person may wear admin + ops — still write the RACI.",
      },
      {
        title: "Multi-pod",
        body: "Local champions propose; central admin approves controlled changes.",
      },
      {
        title: "Regulated context",
        body: "Align access reviews with your policy owners; do not invent certification claims.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Governance mistakes",
    items: [
      {
        title: "Anyone can edit stages",
        body: "Pipeline meaning collapses; forecasts become theater.",
      },
      {
        title: "Fields without owners",
        body: "Required checkboxes nobody believes train people to skip updates.",
      },
      {
        title: "Infinite admin yes-queue",
        body: "Configuration sprawl outruns training and hygiene.",
      },
      {
        title: "Access set once at go-live",
        body: "Privilege creep is inevitable without scheduled reviews.",
      },
      {
        title: "Silent hotfixes",
        body: "Uncommunicated changes break habits and trust overnight.",
      },
      {
        title: "Governance as paperwork only",
        body: "If reviews never change config or access, skip the theater and fix the WIP system.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is CRM governance?",
        answer:
          "Named ownership and decision rights for fields, stages, permissions, and admin work — plus change control so configuration does not drift. It is how you keep the system trustworthy after go-live.",
      },
      {
        question: "Who should own CRM governance?",
        answer:
          "An admin (or ops) lead with calendar hours, plus business owners for critical fields and stages. Executives sponsor; they do not approve every field rename.",
      },
      {
        question: "Do small teams need change control?",
        answer:
          "Yes, lightly. A one-page request and a weekly triage still prevent silent stage edits. Formal committees are optional; written decisions are not.",
      },
      {
        question: "How often should we review access?",
        answer:
          "At least on a quarterly cadence for most teams, and after role changes or contractor exits. Set your own interval — do not invent a universal benchmark as a fact.",
      },
      {
        question: "How does governance relate to data quality?",
        answer:
          "Governance decides who owns fields and what may change; data quality runs the hygiene SLAs and weekly reviews. Use both — ownership without hygiene still decays.",
      },
      {
        question: "What should I do next?",
        answer:
          "Name admin R/A, assign owners for required fields, publish a change-request page, and cap admin WIP. Then connect to Data Quality and Adoption gates.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-data-quality/",
        label: "CRM data quality",
        description: "Hygiene SLAs and weekly quality reviews.",
      },
      {
        href: "/guides/crm-adoption/",
        label: "CRM adoption",
        description: "Core-loop usage and 30/60/90 gates.",
      },
      {
        href: "/guides/crm-change-management/",
        label: "CRM change management",
        description: "People side of controlled change.",
      },
      {
        href: "/guides/crm-implementation-kpis/",
        label: "CRM implementation KPIs",
        description: "Signals that governance is working.",
      },
      {
        href: "/guides/crm-implementation/",
        label: "CRM implementation",
        description: "Where governance sits in rollout.",
      },
      {
        href: "/guides/common-crm-mistakes/",
        label: "Common CRM mistakes",
        description: "Ownership and set-and-forget failures.",
      },
      {
        href: "/guides/crm-requirements-guide/",
        label: "CRM requirements guide",
        description: "Freeze must-haves before field sprawl.",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "Implementation Planner",
        description: "Put governance tasks on the plan.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist if admin fit is still open.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "planner-cta",
    title: "Put governance on the implementation plan",
    body: "Add field ownership, change control, and access-review tasks in the Implementation Planner so admin work is scheduled — not leftover.",
    href: "/tools/crm-implementation-planner/",
    ctaLabel: "Open Implementation Planner →",
    variant: "finder",
  },
];

export const crmGovernanceGuide: GuidePage = {
  id: "guide-crm-governance",
  slug: "crm-governance",
  title: "CRM Governance Guide: Ownership and Change Control",
  summary:
    "Govern CRM with field ownership, stage/field change control, access reviews, and a finite admin backlog — so configuration does not quietly destroy trust.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "implementation",
  journeyStage: "implement",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/crm-governance-hero.png",
    alt: "CRM governance hero: field ownership RACI, change-request queue, access review checklist, and admin backlog.",
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
      contentId: "content:tool:crm-finder",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:tool:crm-implementation-planner",
    label: "Open Implementation Planner",
  },
  relatedGuideSlugs: [
    "crm-data-quality",
    "crm-adoption",
    "crm-change-management",
    "crm-implementation-kpis",
    "crm-implementation",
    "common-crm-mistakes",
    "crm-requirements-guide",
  ],
  blocks: crmGovernanceBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "raci",
      label: "Name admin + field/stage owners",
      description: "RACI written; hours on calendar.",
      order: 0,
    },
    {
      id: "change-control",
      label: "Publish change-control flow",
      description: "Request → review → communicate → audit.",
      order: 1,
    },
    {
      id: "access-backlog",
      label: "Schedule access review + cap admin WIP",
      description: "Finite backlog; exceptions expire.",
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
    title: "CRM Governance Guide: Ownership & Change Control | SoftwareGlimpse",
    description:
      "CRM governance for field ownership, stage/field change control, access reviews, and a finite admin backlog — without configuration drift.",
    canonicalPath: "/guides/crm-governance/",
    indexable: true,
  },
};
