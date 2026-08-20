import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Change Management — stakeholder map, resistance, communications, pilot champions.
 * Template: softwareglimpse-guide-template-v1
 */
const crmChangeManagementBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM change management is a stakeholder map, resistance playbook, communications cadence, and pilot champions — not a go-live email. Decision rule: do not expand seats until sponsors, managers, and champions can explain the core loop, the review ritual, and what happens to shadow sheets. If resistance shows up as silent non-use or dual-running, intervene with coaching and simplify before adding configuration.",
    bullets: [
      "Stakeholder map",
      "Resistance patterns",
      "Comms cadence",
      "Pilot champions",
      "Ritual over features",
      "Expand on buy-in",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Map people before config",
        body: "Sponsor, managers, champions, users, admin — each has a job in the change.",
      },
      {
        label: "Resistance is diagnostic",
        body: "Shadow sheets and nostalgia point to ritual gaps, not “bad users.”",
      },
      {
        label: "Cadence beats one announcement",
        body: "Kickoff, weekly pilot notes, go-live, 30-day follow-up.",
      },
      {
        label: "Champions carry the middle",
        body: "Peer help on live records outperforms vendor webinars alone.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "change-path",
    title: "Change management path",
    steps: [
      { id: "map", label: "Stakeholder map", short: "Roles & jobs" },
      { id: "pilot", label: "Pilot champions", short: "Peer coverage" },
      { id: "comms", label: "Comms cadence", short: "Week-by-week" },
      { id: "resist", label: "Resistance playbook", short: "Pattern → response" },
      { id: "expand", label: "Expand", short: "Only with buy-in" },
    ],
    ctaHref: "/guides/crm-adoption/",
    ctaLabel: "Adoption guide →",
  },
  {
    type: "figure",
    id: "cadence-visual",
    title: "Stakeholders and communications cadence",
    src: "/guides/crm-change-management-cadence.png",
    alt: "CRM change management diagram with stakeholder rings, weeks 0–8 communications timeline, and resistance pattern to coaching response pairs.",
    caption:
      "Who hears what, when — plus a playbook for the resistance you will actually see.",
  },
  {
    type: "checklist",
    id: "change-ready-checklist",
    title: "Change-ready before invite storm",
    copyable: true,
    items: [
      {
        id: "sponsor",
        label: "Exec sponsor named",
        description: "Visible support for CRM-native reviews — not just budget.",
        order: 0,
      },
      {
        id: "managers",
        label: "Managers briefed on coaching ritual",
        description: "They will lead from CRM views.",
        order: 1,
      },
      {
        id: "champions",
        label: "Pilot champions selected",
        description: "Respected peers with office-hours capacity.",
        order: 2,
      },
      {
        id: "comms-plan",
        label: "Comms calendar drafted",
        description: "Kickoff → weekly pilot → go-live → 30-day.",
        order: 3,
      },
      {
        id: "sheet-policy",
        label: "Shadow-sheet policy written",
        description: "What retires, when, and who enforces.",
        order: 4,
      },
    ],
  },
  {
    type: "step",
    id: "stakeholder-map",
    stepNumber: 1,
    heading: "Build the stakeholder map",
    body: "List roles and the change job each must do: sponsor removes ambiguity and backs the ritual; managers coach from CRM; champions answer peer questions; users complete the core loop; admin owns config and hygiene queues. Write what “good” looks like for each role in one sentence.\n\nExample: Blue Harbor Logistics maps VP Sales as sponsor, three pod leads as managers, two senior estimators as champions, and Devon as admin. The sponsor’s sentence: “I will not accept forecast answers that are not on the board.”",
    tip: "If a role has no job in the change, they will invent one — usually a side sheet.",
    figure: {
      src: "/guides/crm-change-management-hero.png",
      alt: "CRM change management hero: stakeholder map, resistance pattern cards, communications calendar, and pilot champions panel.",
      caption:
        "Change work is visible: who owns buy-in, who coaches, and how often you communicate.",
    },
    scenarios: [
      {
        title: "Founder-led",
        body: "Founder is sponsor and sometimes manager — still separate the jobs on paper.",
      },
      {
        title: "Multi-site",
        body: "Local champions + central admin; managers aligned on one agenda.",
      },
      {
        title: "Advisory / FS",
        body: "Partners as managers; coverage partners need explicit loop jobs.",
      },
    ],
  },
  {
    type: "step",
    id: "resistance-patterns",
    stepNumber: 2,
    heading: "Name resistance patterns and responses",
    body: "Expect patterns: shadow sheets, silent non-use (login without loop), process nostalgia (“our old way was fine”), and manager bypass (accepting verbal-only updates). Pair each with a response: retire the sheet on a date, coach the loop on live records, capture what to keep from the old process, and hold managers to CRM-native reviews.\n\nExample: Harborline’s planners keep a household spreadsheet “just in case.” Keisha and the practice lead set a two-week dual-run end date, move the must-have columns into CRM fields with owners, and stop referencing the Sheet in Monday coverage.",
    tip: "Punishing people for resistance without fixing the ritual creates underground workarounds.",
    scenarios: [
      {
        title: "Shadow sheets",
        body: "Deadline + field mapping + manager refusal to use the sheet.",
      },
      {
        title: "Silent non-use",
        body: "Core-loop lab + champion office hours + empty-next-step coaching.",
      },
      {
        title: "Manager bypass",
        body: "Sponsor backs CRM-only status answers in public forums.",
      },
    ],
  },
  {
    type: "step",
    id: "comms-cadence",
    stepNumber: 3,
    heading: "Run a communications cadence",
    body: "Plan messages by week: purpose and non-goals at kickoff; weekly pilot notes (what changed, what to practice, what is parked); go-live “how we work now”; 30-day gate results and next steps. Keep messages short, role-specific, and tied to the ritual — not feature dumps.\n\nExample: Meridian’s Ana sends a Friday pilot note: three wins, one stuck pattern (empty next steps), and the manager agenda for Monday. Sellers know what “good” looks like without a forty-slide deck.",
    tip: "If communications only happen at go-live, you planned surprise — not change.",
    scenarios: [
      {
        title: "Kickoff",
        body: "Why now, core loop, what retires, who to ask.",
      },
      {
        title: "Weekly pilot",
        body: "Practice focus + known issues + parked requests.",
      },
      {
        title: "30/60/90",
        body: "Gate outcome: expand, coach, or simplify — with owners.",
      },
    ],
  },
  {
    type: "step",
    id: "pilot-champions",
    stepNumber: 4,
    heading: "Equip pilot champions",
    body: "Champions are respected practitioners with time for office hours, not unpaid full-time admins. Give them a mistakes checklist, merge/escalation paths, and a direct line to admin. Recognize their work in sponsor communications so the role stays staffed.\n\nExample: Crestview names two partner-track advisors as champions. They run two thirty-minute office hours weekly using live household records. When Day-60 wobbles, they co-lead the retraining lab instead of blaming “adoption.”",
    tip: "Champions without admin backup become bottlenecks — publish what they can answer vs escalate.",
    scenarios: [
      {
        title: "Selecting champions",
        body: "High peer trust + willing to learn the loop early.",
      },
      {
        title: "Champion toolkit",
        body: "Loop card, mistakes list, how to file change requests.",
      },
      {
        title: "Scaling",
        body: "Graduate pilot champions to coach the next pod’s champions.",
      },
    ],
  },
  {
    type: "step",
    id: "expand-with-buy-in",
    stepNumber: 5,
    heading: "Expand only with demonstrated buy-in",
    body: "Seat expansion is a change event. Require: managers already coaching from CRM, champions available for the new cohort, shadow-sheet policy holding, and adoption/quality gates not in intervene mode. Re-run a compressed kickoff for each new group.\n\nExample: Northwind pauses a company-wide invite after pod two still dual-runs. They fix manager bypass first, then expand — change management as a gate, not a slide.",
    tip: "A calendar invite storm is not a change strategy.",
    scenarios: [
      {
        title: "Ready to expand",
        body: "Gates green; champions staffed; sponsor still visible.",
      },
      {
        title: "Not ready",
        body: "Hold seats; run resistance playbook and simplify.",
      },
      {
        title: "Partial expand",
        body: "Add one pod that already shares the pilot’s ritual.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Change management mistakes",
    items: [
      {
        title: "Go-live email as the plan",
        body: "Without cadence and champions, habits do not move.",
      },
      {
        title: "Ignoring manager bypass",
        body: "If leaders accept Slack-only status, users correctly ignore CRM.",
      },
      {
        title: "Champions without time",
        body: "Title-only champions burn out or go quiet.",
      },
      {
        title: "Punishing shadow sheets only",
        body: "Retire sheets after the CRM ritual can carry the work.",
      },
      {
        title: "Feature-first communications",
        body: "People need the loop and the review rules, not every module.",
      },
      {
        title: "Expanding during intervene",
        body: "More seats amplify resistance patterns you have not fixed.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is CRM change management?",
        answer:
          "The people system around rollout: stakeholder jobs, communications cadence, pilot champions, and a resistance playbook — so the core loop and review ritual stick. Configuration alone is not change management.",
      },
      {
        question: "Who should be a pilot champion?",
        answer:
          "A respected practitioner with peer trust and calendar time for office hours — not only the loudest power user or the sole admin. Give them escalation paths and recognition.",
      },
      {
        question: "How do we handle people who refuse the CRM?",
        answer:
          "Diagnose the pattern (shadow sheet, silent non-use, manager bypass), fix the ritual and incentives, coach on live records, and have the sponsor back CRM-native reviews. Do not only send more reminder emails.",
      },
      {
        question: "How long should dual-running last?",
        answer:
          "As short as you can defend with a written end date. Dual-running without a retirement date becomes permanent. Gate expansion on sheet retirement for the review ritual.",
      },
      {
        question: "How does this connect to adoption?",
        answer:
          "Change management creates the conditions; adoption measures core-loop usage and manager coaching. Use both with 30/60/90 gates.",
      },
      {
        question: "What should I do next?",
        answer:
          "Draft the stakeholder map, name champions, publish a four-touch comms calendar, and write the shadow-sheet policy. Then align with Adoption and Governance.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-adoption/",
        label: "CRM adoption",
        description: "Core-loop usage and 30/60/90 gates.",
      },
      {
        href: "/guides/crm-governance/",
        label: "CRM governance",
        description: "Controlled config while people change.",
      },
      {
        href: "/guides/crm-data-quality/",
        label: "CRM data quality",
        description: "Hygiene rituals that build trust.",
      },
      {
        href: "/guides/crm-implementation-kpis/",
        label: "CRM implementation KPIs",
        description: "Signals for intervene vs expand.",
      },
      {
        href: "/guides/crm-go-live/",
        label: "CRM go-live",
        description: "Launch communications and cutover day.",
      },
      {
        href: "/guides/crm-training/",
        label: "CRM training",
        description: "Role labs for champions and cohorts.",
      },
      {
        href: "/guides/common-crm-mistakes/",
        label: "Common CRM mistakes",
        description: "Ignoring change cost and set-and-forget.",
      },
      {
        href: "/guides/when-to-adopt-crm/",
        label: "When to adopt CRM",
        description: "Timing and pilot discipline.",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "Implementation Planner",
        description: "Put change tasks on the plan.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist if product fit is still open.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "planner-cta",
    title: "Plan the people work",
    body: "Add stakeholder briefings, champion office hours, and communications milestones to the Implementation Planner alongside configuration tasks.",
    href: "/tools/crm-implementation-planner/",
    ctaLabel: "Open Implementation Planner →",
    variant: "finder",
  },
];

export const crmChangeManagementGuide: GuidePage = {
  id: "guide-crm-change-management",
  slug: "crm-change-management",
  title: "CRM Change Management: Stakeholders to Champions",
  summary:
    "Move CRM from installed to adopted with a stakeholder map, resistance playbook, communications cadence, and pilot champions — before you expand seats.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "implementation",
  journeyStage: "implement",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/crm-change-management-hero.png",
    alt: "CRM change management hero: stakeholder map, resistance pattern cards, communications calendar, and pilot champions panel.",
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
    "crm-adoption",
    "crm-governance",
    "crm-data-quality",
    "crm-implementation-kpis",
    "crm-go-live",
    "crm-training",
    "common-crm-mistakes",
    "when-to-adopt-crm",
  ],
  blocks: crmChangeManagementBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "map-champions",
      label: "Complete stakeholder map + champions",
      description: "Jobs written; office hours scheduled.",
      order: 0,
    },
    {
      id: "comms-resist",
      label: "Publish comms cadence + resistance playbook",
      description: "Kickoff through 30-day; sheet policy dated.",
      order: 1,
    },
    {
      id: "expand-gate",
      label: "Gate expansion on buy-in evidence",
      description: "Managers coach from CRM; dual-run ending.",
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
    title: "CRM Change Management Guide | SoftwareGlimpse",
    description:
      "CRM change management with stakeholder maps, resistance patterns, communications cadence, and pilot champions — expand only on buy-in.",
    canonicalPath: "/guides/crm-change-management/",
    indexable: true,
  },
};
