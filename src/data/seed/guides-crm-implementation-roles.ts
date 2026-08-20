import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Implementation Roles — who owns what during rollout.
 * Template: softwareglimpse-guide-template-v1
 * Educational / operational — qualitative hours bands only; no invented salaries or rankings.
 */
const crmImplementationRolesBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Staff CRM implementation with named RACI owners for five seats: executive sponsor, CRM admin, sales (or delivery) lead, IT/security, and change lead. Decision rule: do not start configure or migrate until admin Responsible hours are on the calendar and a sponsor is Accountable for pilot exit criteria — if roles are “everyone’s job,” the project has no owner.",
    bullets: [
      "Name five seats",
      "Admin hours booked",
      "Sponsor owns gates",
      "Sales lead owns loop",
      "IT owns access",
      "Change owns training",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Roles beat job titles",
        body: "A founder can wear sponsor + change; an ops manager can be admin — as long as each seat has a name.",
      },
      {
        label: "Admin is non-optional",
        body: "Fields, users, duplicates, and permissions need a Responsible person with weekly hours.",
      },
      {
        label: "Hours are qualitative bands",
        body: "Use light / moderate / heavy weekly bands — not invented salary or FTE claims.",
      },
      {
        label: "Size changes stacking, not the seats",
        body: "Small teams combine hats; mid-market separates them — the RACI jobs stay the same.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "role-staffing-path",
    title: "Staff the implementation team",
    steps: [
      { id: "list", label: "List seats", short: "Five RACI roles" },
      { id: "name", label: "Name people", short: "One R per seat" },
      { id: "hours", label: "Book hours", short: "Weekly bands" },
      { id: "stack", label: "Stack if small", short: "Hats OK if written" },
      { id: "gate", label: "Gate start", short: "Admin + sponsor set" },
    ],
    ctaHref: "/tools/crm-implementation-planner/",
    ctaLabel: "Implementation Planner →",
  },
  {
    type: "figure",
    id: "staffing-compare",
    title: "Small team vs mid-market staffing",
    src: "/guides/crm-implementation-roles-staffing.png",
    alt: "Side-by-side staffing diagram: small team with combined sponsor-admin hats versus mid-market with separate sponsor, admin, sales lead, IT/security, and change lead.",
    caption:
      "Same five seats — small teams stack hats; mid-market separates them. Write the stacking so nothing is orphaned.",
  },
  {
    type: "feature-matrix",
    id: "role-musts",
    title: "Role coverage musts vs deferrable",
    rows: [
      {
        feature: "Named CRM admin with weekly hours",
        mustHave: true,
        niceToHave: false,
        notes: "Fields, users, hygiene",
      },
      {
        feature: "Executive sponsor for pilot exit gates",
        mustHave: true,
        niceToHave: false,
        notes: "Unblocks decisions",
      },
      {
        feature: "Sales/delivery lead for core loop design",
        mustHave: true,
        niceToHave: false,
        notes: "Stages & next steps",
      },
      {
        feature: "IT/security for SSO, export, access matrix",
        mustHave: true,
        niceToHave: false,
        notes: "Before mass invites",
      },
      {
        feature: "Dedicated change/training lead",
        mustHave: false,
        niceToHave: true,
        notes: "Sponsor can own on small teams",
      },
      {
        feature: "External implementer as R for admin",
        mustHave: false,
        niceToHave: true,
        notes: "Still need internal A",
      },
    ],
  },
  {
    type: "checklist",
    id: "roles-ready",
    title: "Roles readiness checklist",
    copyable: true,
    items: [
      {
        id: "sponsor-named",
        label: "Executive sponsor named",
        description: "Accountable for scope, budget attention, and go/no-go.",
        order: 0,
      },
      {
        id: "admin-named",
        label: "CRM admin named with hours band",
        description: "Responsible for fields, users, duplicates, permissions.",
        order: 1,
      },
      {
        id: "sales-lead",
        label: "Sales or delivery lead named",
        description: "Owns stage definitions and weekly review from the board.",
        order: 2,
      },
      {
        id: "it-security",
        label: "IT/security contact named",
        description: "Access matrix, SSO/MFA, export path, vendor security Qs.",
        order: 3,
      },
      {
        id: "change-lead",
        label: "Change/training owner named",
        description: "Pilot agenda, training on real records, adoption nudges.",
        order: 4,
      },
      {
        id: "raci-written",
        label: "RACI written for configure / migrate / go-live",
        description: "No seat left as “the team.”",
        order: 5,
      },
    ],
  },
  {
    type: "step",
    id: "five-seats",
    stepNumber: 1,
    heading: "Define the five RACI seats",
    body: "Write five seats before you touch configuration: (1) Executive sponsor — Accountable for scope and pilot exit; typically light hours after kickoff. (2) CRM admin — Responsible for fields, roles, duplicates, and integrations; usually the heaviest ongoing band. (3) Sales or delivery lead — Responsible for stage honesty and Friday reviews. (4) IT/security — Responsible for access matrix, identity, and export path. (5) Change lead — Responsible for training agendas and adoption follow-ups.\n\nExample: Brightline Creative, an 11-person B2B design agency, names founder Priya as sponsor + change lead, ops manager Devon as CRM admin (~3–5 hrs/week during pilot), sales lead Maya for pipeline stages, and their MSP contact Jordan for SSO and export checks. Hats are stacked on purpose — and written on a one-page RACI so Friday reviews still have a single admin owner.",
    tip: "If two people share “admin,” pick one Responsible name — shared admin is how fields proliferate.",
    figure: {
      src: "/guides/crm-implementation-roles-hero.png",
      alt: "CRM implementation roles hero: RACI team board with sponsor, admin, sales lead, IT/security, and change lead plus hours/week bands.",
      caption:
        "Name seats and qualitative hours bands before configure day — not after the first messy Friday.",
    },
    scenarios: [
      {
        title: "Sponsor",
        body: "Unblocks scope fights; owns go/no-go on expansion.",
      },
      {
        title: "Admin",
        body: "Owns field requests, merges, and permission exceptions.",
      },
      {
        title: "Sales lead",
        body: "Rejects stage fiction; coaches from the board.",
      },
    ],
  },
  {
    type: "step",
    id: "hours-bands",
    stepNumber: 2,
    heading: "Set qualitative hours/week bands",
    body: "Assign a band per seat — light (~1–2 hrs/week), moderate (~3–5), or heavy (more during pilot/cutover) — without inventing salaries or headcount math. Admin usually spikes during configure, pilot, and migration hygiene; sponsor stays light unless gates slip; sales lead peaks around stage design and training weeks.\n\nExample: Brightline books Devon’s admin band as moderate through pilot (fields + hygiene huddles), Maya’s sales-lead band as moderate for two weeks of stage workshops then light for Friday reviews, and Priya’s sponsor band as light check-ins plus Accountable sign-off on pilot exit. When cutover week arrives, Devon temporarily moves to a heavier band and the MSP is on-call for access — then bands drop again once hygiene holds.",
    tip: "Put the admin band on a real calendar series — “when we have time” is not a staffing plan.",
    scenarios: [
      {
        title: "Pilot weeks",
        body: "Admin + sales lead moderate; sponsor light.",
      },
      {
        title: "Cutover week",
        body: "Admin heavier; IT available; change lead active.",
      },
      {
        title: "Steady state",
        body: "Admin light–moderate hygiene; others light.",
      },
    ],
  },
  {
    type: "step",
    id: "small-vs-mid",
    stepNumber: 3,
    heading: "Staff small teams vs mid-market",
    body: "Small teams (roughly under ~15 people) almost always stack hats: founder = sponsor + change; ops = admin; sales lead stays separate if you sell as a team. Mid-market separates sponsor, dedicated admin, sales lead, IT/security, and change so no single person becomes the bottleneck and the silent veto.\n\nExample: Brightline stacks sponsor+change. Six months later, after hiring three AEs, they split change to HR/ops associate Sam and keep Devon as dedicated admin. Decision rule: when Friday reviews fail because the admin was in client work all week, separate the admin seat — do not add more custom fields hoping process will appear.",
    tip: "Stacking is fine; unspoken stacking is how “nobody owns duplicates” happens.",
    scenarios: [
      {
        title: "Agency / studio",
        body: "Ops admin + founder sponsor; sales lead owns pipeline.",
      },
      {
        title: "B2B services mid-market",
        body: "Dedicated admin; IT owns SSO; change owns training waves.",
      },
      {
        title: "External implementer",
        body: "Vendor can be R for build; internal admin remains A.",
      },
    ],
  },
  {
    type: "step",
    id: "raci-by-phase",
    stepNumber: 4,
    heading: "Map RACI across configure, migrate, go-live",
    body: "One static org chart is not enough. For each phase — configure, data migrate, pilot, go-live — write Responsible / Accountable / Consulted / Informed. Typical pattern: admin R for configure; sales lead C on stages; IT R for access before invites; change R for training; sponsor A for go-live.\n\nExample: Brightline’s migrate phase lists Devon R for clean+import, Maya C for open-deal validation, Jordan R for export sample and role model, Priya A for freeze-window go/no-go, and the AE pod Informed on Monday cutover. When a duplicate fight appears, the RACI already says Devon decides merges — no Slack democracy.",
    tip: "If Consulted becomes a committee of eight, shrink it — slow consults recreate “nobody decides.”",
    scenarios: [
      {
        title: "Configure",
        body: "Admin R; sales lead C on stages; sponsor A on scope.",
      },
      {
        title: "Migrate",
        body: "Admin R; IT R on export; sales lead validates sample.",
      },
      {
        title: "Go-live",
        body: "Change R for training; sponsor A for cut line.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Role-staffing mistakes",
    items: [
      {
        title: "No named admin",
        body: "Fields and duplicates become everyone’s problem — which means nobody’s.",
      },
      {
        title: "Sponsor in name only",
        body: "Without Accountable go/no-go, pilots never end and expansion never gates.",
      },
      {
        title: "IT invited after mass user load",
        body: "Access models harden around temporary wide-open seats.",
      },
      {
        title: "Training owned by “the vendor webinar”",
        body: "Generic tours do not teach your stages on your records.",
      },
      {
        title: "External partner as the only admin",
        body: "When the SOW ends, hygiene debt has no internal owner.",
      },
      {
        title: "Inventing FTE or salary math as a gate",
        body: "Use qualitative hours bands and outcomes — not fake headcount totals.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "Who needs to be on a CRM implementation team?",
        answer:
          "At minimum: executive sponsor, CRM admin, sales or delivery lead, IT/security contact, and a change/training owner. Small teams may stack hats; mid-market should separate them. Decision rule: admin Responsible hours and sponsor Accountable gates must be named before configure starts.",
      },
      {
        question: "How many hours per week does a CRM admin need?",
        answer:
          "Use qualitative bands, not invented salaries: light for steady hygiene, moderate during pilot and field design, heavier during cutover week. Book the band on the calendar; if Friday reviews fail because admin work lost to billable work, raise the band or separate the seat.",
      },
      {
        question: "Can one person be sponsor and admin?",
        answer:
          "On a very small team, yes — write it explicitly. As soon as field requests and duplicate merges compete with sponsorship decisions, split the seats so Accountable and Responsible are not the same bottleneck.",
      },
      {
        question: "Do we need a dedicated change manager?",
        answer:
          "Not always. Someone must own training agendas, pilot communications, and adoption follow-ups. On small teams the sponsor or ops lead can wear that hat; mid-market usually benefits from a separate change owner across waves.",
      },
      {
        question: "Where does IT fit if we are an SMB on SaaS CRM?",
        answer:
          "Even without a large IT department, name who owns identity (SSO/MFA), export samples, and the access matrix before invites. An MSP or technical founder can fill the seat — the job still exists.",
      },
      {
        question: "What should I do next?",
        answer:
          "Write the five-seat RACI, book admin hours, then plan phases in the CRM Implementation Planner. Pair with Implementation Mistakes, Data Migration, and the CRM Implementation pillar for the full rollout path.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM implementation resources",
    links: [
      {
        href: "/guides/crm-implementation/",
        label: "CRM implementation guide",
        description: "Pillar rollout path.",
      },
      {
        href: "/guides/crm-implementation-mistakes/",
        label: "Implementation mistakes",
        description: "Failure modes with fix artifacts.",
      },
      {
        href: "/guides/crm-data-migration/",
        label: "CRM data migration",
        description: "Inventory → pilot → cutover.",
      },
      {
        href: "/guides/crm-data-cleaning/",
        label: "Clean CRM data",
        description: "Hygiene before you import.",
      },
      {
        href: "/guides/crm-field-mapping/",
        label: "Field mapping guide",
        description: "Source → destination rules.",
      },
      {
        href: "/guides/crm-training/",
        label: "CRM training guide",
        description: "Change-lead agendas.",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "CRM Implementation Planner",
        description: "Phase plan with owners.",
      },
      {
        href: "/tools/crm-migration-planner/",
        label: "CRM Migration Planner",
        description: "When data is moving.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "planner-cta",
    title: "Turn roles into a phase plan",
    body: "Once seats and hours bands are named, use the CRM Implementation Planner to sequence pilot, configure, and go-live with owners attached — without inventing timelines or rankings.",
    href: "/tools/crm-implementation-planner/",
    ctaLabel: "Open Implementation Planner →",
    variant: "generic",
  },
];

export const crmImplementationRolesGuide: GuidePage = {
  id: "guide-crm-implementation-roles",
  slug: "crm-implementation-roles",
  title: "CRM Implementation Roles: Who Owns What on the Team",
  summary:
    "Staff CRM rollout with RACI owners — sponsor, admin, sales lead, IT/security, change lead — including small-team hat stacking and qualitative hours/week bands.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "implementation",
  journeyStage: "implement",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/crm-implementation-roles-hero.png",
    alt: "CRM implementation roles hero: RACI team board with sponsor, admin, sales lead, IT/security, and change lead plus hours/week bands.",
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
  ],
  nextAction: {
    contentId: "content:tool:crm-implementation-planner",
    label: "Try the Implementation Planner",
  },
  relatedGuideSlugs: [
    "crm-implementation",
    "crm-implementation-mistakes",
    "crm-data-migration",
    "crm-data-cleaning",
    "crm-field-mapping",
    "crm-training",
    "crm-go-live",
    "crm-change-management",
  ],
  blocks: crmImplementationRolesBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "five-seats",
      label: "Name five RACI seats",
      description: "Sponsor, admin, sales lead, IT/security, change.",
      order: 0,
    },
    {
      id: "admin-hours",
      label: "Book admin hours band",
      description: "On a real calendar series.",
      order: 1,
    },
    {
      id: "phase-raci",
      label: "Write RACI per phase",
      description: "Configure, migrate, go-live.",
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
    author: "author-lee-meyeridricks",
  },
  seo: {
    title:
      "CRM Implementation Roles: Team RACI & Hours | SoftwareGlimpse",
    description:
      "Who owns CRM implementation: sponsor, admin, sales lead, IT/security, and change lead — with small-team vs mid-market staffing and qualitative hours bands.",
    canonicalPath: "/guides/crm-implementation-roles/",
    indexable: true,
  },
};
