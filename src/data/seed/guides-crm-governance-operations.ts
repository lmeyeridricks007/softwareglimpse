import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Governance Ops — post-go-live operating cadence (distinct from crm-governance setup).
 * Template: softwareglimpse-guide-template-v1
 * topicType: strategy (implementation-shaped teaching blocks)
 */
const crmGovernanceOperationsBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM governance ops is the post-go-live operating cadence: change tickets for fields and stages, an access-review calendar, admin backlog triage with a WIP cap, and a weekly governance standup. Decision rule: if configuration can change without a ticket, access is never reviewed, or the admin queue is unlimited, freeze new config until the cadence exists — ownership docs alone are not enough.",
    bullets: [
      "Change tickets",
      "Access calendar",
      "WIP-capped backlog",
      "Weekly standup",
      "Freeze on drift",
      "Ops ≠ setup",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Ops is cadence, not a RACI PDF",
        body: "Governance setup names owners; ops runs the weekly and quarterly rituals that keep them honest.",
      },
      {
        label: "Every field/stage change needs a ticket",
        body: "Silent edits recreate drift faster than any policy document can stop it.",
      },
      {
        label: "Access reviews live on a calendar",
        body: "Privilege creep is normal — scheduled reviews are the control, not hope.",
      },
      {
        label: "Admin WIP must be finite",
        body: "Unlimited yes-queues outrun training, hygiene, and adoption coaching.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "ops-path",
    title: "Governance ops path",
    steps: [
      { id: "tickets", label: "Change tickets", short: "Fields & stages" },
      { id: "standup", label: "Weekly standup", short: "Triage + decisions" },
      { id: "backlog", label: "Backlog WIP", short: "Cap in progress" },
      { id: "access", label: "Access calendar", short: "Review on schedule" },
      { id: "audit", label: "Cadence audit", short: "Monthly/quarterly" },
    ],
    ctaHref: "/guides/crm-governance/",
    ctaLabel: "Governance setup guide →",
  },
  {
    type: "figure",
    id: "cadence-visual",
    title: "Weekly → monthly → quarterly ops rhythm",
    src: "/guides/crm-governance-operations-cadence.png",
    alt: "CRM governance ops cadence: weekly change-ticket triage and standup, monthly field/stage audit, quarterly access review and RACI refresh.",
    caption:
      "Operating rhythm is the product — tickets, standups, and scheduled reviews beat one-time setup.",
  },
  {
    type: "checklist",
    id: "ops-standup-checklist",
    title: "Stand up governance ops in two weeks",
    copyable: true,
    items: [
      {
        id: "ticket-form",
        label: "Publish the change-ticket form",
        description: "What, why, impact, communicate plan, rollback.",
        order: 0,
      },
      {
        id: "queue",
        label: "Open a visible change queue",
        description: "Requested → impact review → approve/reject → done.",
        order: 1,
      },
      {
        id: "standup",
        label: "Book weekly governance standup",
        description: "30 minutes; ticket triage + WIP decisions only.",
        order: 2,
      },
      {
        id: "wip",
        label: "Cap admin WIP",
        description: "Finite in-progress tickets; park and publish parked list.",
        order: 3,
      },
      {
        id: "access-cal",
        label: "Put access reviews on the calendar",
        description: "Roles, exceptions, inactive seats, export rights.",
        order: 4,
      },
      {
        id: "link-hygiene",
        label: "Tie standup to hygiene glance",
        description: "One shared view; escalate to data quality if SLAs miss.",
        order: 5,
      },
    ],
  },
  {
    type: "step",
    id: "change-tickets",
    stepNumber: 1,
    heading: "Run change tickets for fields and stages",
    body: "Treat stage edits, required-field changes, permission model changes, and new automations as ticketed work. Flow: request → impact review (who breaks, which reports change) → approve/reject → configure in a controlled window → communicate → short audit. Same-day emergencies still get a written ticket the same day.\n\nExample: Northwind Advisory’s ops lead Mira finds sales managers renaming stages in production. She freezes stage edits, routes requests through a one-page ticket, and clears three backlog renames in the Friday standup after a fifteen-minute impact review with finance reporting.",
    tip: "If a change cannot name who is impacted and how you will communicate, it is not ready to configure.",
    figure: {
      src: "/guides/crm-governance-operations-hero.png",
      alt: "CRM governance ops hero: change ticket queue, access review calendar, admin backlog WIP, and weekly standup agenda.",
      caption:
        "Governance ops is visible operating work — tickets, calendar, WIP, and standup.",
    },
    scenarios: [
      {
        title: "Stage rename",
        body: "Impact review + definition update + manager briefing before go-live.",
      },
      {
        title: "New required field",
        body: "Prove filler role and train before hard enforcement.",
      },
      {
        title: "Automation ask",
        body: "Park until hygiene and adoption gates hold — noise is config debt.",
      },
    ],
  },
  {
    type: "step",
    id: "weekly-standup",
    stepNumber: 2,
    heading: "Hold a weekly governance standup",
    body: "Thirty focused minutes: open tickets, WIP status, what to park, and one hygiene glance. Decisions get owners and dates; debate without a ticket goes back to the form. Keep the agenda fixed so the meeting stays operational, not ceremonial.\n\nExample: Meridian Field Services runs Tuesday 9:00 with admin, sales ops, and one pod lead. They approve two field tickets, park an AI-score experiment, and flag duplicate spike for the data-quality ritual — no new config that week without a ticket ID.",
    tip: "If the standup produces no decisions for two weeks, shorten it and raise WIP visibility instead of adding slides.",
    scenarios: [
      {
        title: "Small team",
        body: "Same person may wear admin + ops — still run the agenda on the calendar.",
      },
      {
        title: "Multi-pod",
        body: "Local champions propose; central admin approves controlled changes.",
      },
      {
        title: "Busy week",
        body: "Async ticket board still counts — cancel only if decisions are posted.",
      },
    ],
  },
  {
    type: "step",
    id: "backlog-triage",
    stepNumber: 3,
    heading: "Triage the admin backlog with a WIP cap",
    body: "Unlimited “can you add a field?” queues destroy focus. Cap work-in-progress, group duplicates, prioritize hygiene and adoption blockers over cosmetic asks, and publish what is parked and why. Nice-to-haves wait until gates hold.\n\nExample: Crestview Wealth’s admin backlog had forty open asks. Priya caps WIP at five, merges seven duplicate field requests into one ticket, and parks dashboard cosmetics until next-step fill recovers — requesters see status in a shared note.",
    tip: "Saying later with a reason is governance ops — not rudeness.",
    scenarios: [
      {
        title: "Hygiene blockers",
        body: "Duplicate rules, broken required fields, broken views — first.",
      },
      {
        title: "Adoption blockers",
        body: "Manager coaching views and next-step enforcement next.",
      },
      {
        title: "Nice-to-haves",
        body: "Park until gates pass; revisit in monthly reorder.",
      },
    ],
  },
  {
    type: "step",
    id: "access-calendar",
    stepNumber: 4,
    heading: "Keep access reviews on a calendar",
    body: "Privilege creep is normal: contractors linger, managers inherit broad roles, export rights spread. Schedule reviews of roles, exception grants, inactive seats, and sensitive-field visibility. Document exceptions with expiry and approver — not eternal temporary grants.\n\nExample: Harborline Advisory’s quarterly review finds two former contractors still in a reporting role and a “see all households” grant without expiry. Keisha revokes both, adds expiry to future exceptions, and logs the review date on the ops checklist.",
    tip: "Least privilege is a habit reinforced by calendar invites, not a go-live checkbox.",
    scenarios: [
      {
        title: "Role drift",
        body: "Compare actual permissions to the access matrix; close gaps.",
      },
      {
        title: "Inactive seats",
        body: "Disable users outside your defined activity window.",
      },
      {
        title: "Sensitive fields",
        body: "Re-check visibility after org changes and contractor exits.",
      },
    ],
  },
  {
    type: "step",
    id: "cadence-depth",
    stepNumber: 5,
    heading: "Deepen with monthly and quarterly passes",
    body: "Weekly: ticket triage + standup + hygiene glance. Monthly: field/stage audit and backlog reorder. Quarterly: access review and RACI refresh. When health dims, escalate to a full audit or health check instead of adding more config.\n\nExample: Blue Harbor’s monthly audit finds three stages nobody can define. They merge two via change tickets and retrain managers — ops preventing another quarter of dishonest forecasts without a rip-and-replace.",
    tip: "If you only meet when something breaks, you do not have governance ops — you have incident response.",
    scenarios: [
      {
        title: "Healthy system",
        body: "Keep light cadence; expand config only when tickets and gates allow.",
      },
      {
        title: "Watch signals",
        body: "Run CRM Health Check; intervene on weak dimensions.",
      },
      {
        title: "Chronic drift",
        body: "Full CRM Audit → remediation backlog before more features.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Governance ops mistakes",
    items: [
      {
        title: "Confusing setup with ops",
        body: "A RACI from implementation week does not replace tickets and standups.",
      },
      {
        title: "Anyone can edit stages live",
        body: "Pipeline meaning collapses; forecasts become theater.",
      },
      {
        title: "Infinite admin yes-queue",
        body: "Configuration sprawl outruns training and hygiene.",
      },
      {
        title: "Access set once at go-live",
        body: "Privilege creep is inevitable without calendar reviews.",
      },
      {
        title: "Silent hotfixes",
        body: "Uncommunicated changes break habits overnight.",
      },
      {
        title: "Standups without decisions",
        body: "Status theater wastes the only control meeting you have.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How is governance ops different from the CRM Governance guide?",
        answer:
          "The Governance guide stands up ownership, change control, and backlog principles. Governance ops runs the weekly tickets, standup, WIP cap, and access calendar after go-live so those principles stay real.",
      },
      {
        question: "Who should attend the weekly governance standup?",
        answer:
          "Admin (or ops) lead plus one business voice that can approve impact. Executives sponsor; they do not need to approve every field rename.",
      },
      {
        question: "Do small teams need change tickets?",
        answer:
          "Yes, lightly. A one-page form and a weekly triage still prevent silent stage edits. Formal committees are optional; written decisions are not.",
      },
      {
        question: "How often should we review access?",
        answer:
          "Put a recurring review on the calendar — commonly quarterly for many teams, and after role changes or contractor exits. Set your own interval; do not treat an invented industry percentage as a fact.",
      },
      {
        question: "What WIP cap should we use?",
        answer:
          "Pick a number your admin can finish while protecting hygiene and adoption. Cap in-progress work, publish parked items, and revisit the number monthly — not by who yelled last.",
      },
      {
        question: "When should we escalate beyond ops cadence?",
        answer:
          "When tickets cannot keep up with drift, reporting trust collapses, or access exceptions pile up — run a CRM Health Check or full Audit, and consider replace only after remediation fails.",
      },
      {
        question: "What should I do next?",
        answer:
          "Publish the change-ticket form, book the weekly standup, cap admin WIP, and calendar the next access review. Link hygiene to Data Quality and stalled usage to Improve CRM Adoption.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-governance/",
        label: "CRM governance (setup)",
        description: "Ownership, change control principles, and RACI.",
      },
      {
        href: "/guides/crm-data-quality/",
        label: "CRM data quality",
        description: "Hygiene SLAs that feed the weekly glance.",
      },
      {
        href: "/guides/improve-crm-adoption/",
        label: "Improve CRM adoption",
        description: "Recovery plays when usage stalls after go-live.",
      },
      {
        href: "/guides/crm-audit/",
        label: "CRM audit",
        description: "Structured findings and remediation backlog.",
      },
      {
        href: "/guides/crm-health-check/",
        label: "CRM health check",
        description: "Scorecard pass with intervene rules.",
      },
      {
        href: "/guides/crm-implementation-kpis/",
        label: "CRM implementation KPIs",
        description: "Leading signals that ops should watch.",
      },
      {
        href: "/guides/when-to-replace-crm/",
        label: "When to replace CRM",
        description: "If ops cannot recover trust in place.",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "Implementation Planner",
        description: "Put ops rituals on the calendar plan.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist only after replace decision.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "planner-cta",
    title: "Put governance ops on the plan",
    body: "Add change-ticket triage, weekly standup, WIP cap, and access-review dates in the Implementation Planner so ops work is scheduled — not leftover.",
    href: "/tools/crm-implementation-planner/",
    ctaLabel: "Open Implementation Planner →",
    variant: "finder",
  },
];

export const crmGovernanceOperationsGuide: GuidePage = {
  id: "guide-crm-governance-operations",
  slug: "crm-governance-operations",
  title: "CRM Governance Ops: Change Tickets, Access Calendar & Standups",
  summary:
    "Run post-go-live CRM governance as an operating cadence — change tickets for fields and stages, access-review calendar, WIP-capped admin backlog, and weekly standup — not a one-time RACI.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "strategy",
  journeyStage: "optimize",
  knowledgeAreaSlug: "optimization",
  heroVisual: {
    src: "/guides/crm-governance-operations-hero.png",
    alt: "CRM governance ops hero: change ticket queue, access review calendar, admin backlog WIP, and weekly standup agenda.",
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
    "crm-governance",
    "crm-data-quality",
    "improve-crm-adoption",
    "crm-audit",
    "crm-health-check",
    "crm-implementation-kpis",
    "when-to-replace-crm",
  ],
  blocks: crmGovernanceOperationsBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "tickets",
      label: "Publish change tickets + visible queue",
      description: "Fields/stages/automations cannot change silently.",
      order: 0,
    },
    {
      id: "standup-wip",
      label: "Book weekly standup + cap admin WIP",
      description: "Finite in-progress; park with reasons.",
      order: 1,
    },
    {
      id: "access-cal",
      label: "Calendar access reviews",
      description: "Roles, exceptions, inactive seats, exports.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T11:00:00.000Z",
    publishedAt: "2026-08-14T11:00:00.000Z",
    reviewedAt: "2026-08-14T11:00:00.000Z",
    researchStatus: "complete",
    seoStatus: "optimized",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "CRM Governance Ops: Tickets & Standups | SoftwareGlimpse",
    description:
      "Post-go-live CRM governance ops: change tickets for fields and stages, access-review calendar, WIP-capped admin backlog, and weekly standup cadence.",
    canonicalPath: "/guides/crm-governance-operations/",
    indexable: true,
  },
};
