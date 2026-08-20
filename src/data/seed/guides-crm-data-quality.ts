import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Data Quality Guide — ongoing hygiene SLAs (distinct from one-time cleaning).
 * Template: softwareglimpse-guide-template-v1
 */
const crmDataQualityBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM data quality is an ongoing operating system — hygiene SLAs, duplicate rules, required fields, and a weekly quality review — not a one-time cleanup project. Decision rule: if open work routinely lacks owners or next steps, duplicates age in a queue, or Friday still needs a rebuild sheet, pause new automation and run the weekly quality ritual until those signals meet your team-defined targets for two consecutive weeks.",
    bullets: [
      "Ongoing hygiene",
      "Duplicate rules",
      "Required fields",
      "Weekly review",
      "Team-defined targets",
      "Not one-time clean",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Cleaning ≠ quality",
        body: "A migration cleanse without SLAs decays within weeks.",
      },
      {
        label: "Required fields need owners",
        body: "Enforcement without coaching creates junk values.",
      },
      {
        label: "Duplicates need rules + a queue owner",
        body: "Match keys and merge authority beat ad-hoc deletes.",
      },
      {
        label: "Weekly review is the control loop",
        body: "Short quality huddles beat quarterly “data days.”",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "quality-path",
    title: "Ongoing quality path",
    steps: [
      { id: "sla", label: "Hygiene SLAs", short: "Team targets" },
      { id: "dupes", label: "Duplicate rules", short: "Match + merge" },
      { id: "required", label: "Required fields", short: "Owner + next step" },
      { id: "weekly", label: "Weekly review", short: "Queue → decide" },
      { id: "intervene", label: "Intervene", short: "Two-week miss" },
    ],
    ctaHref: "/guides/crm-governance/",
    ctaLabel: "Governance guide →",
    figure: {
      src: "/guides/crm-data-quality-path.png",
      alt: "Ongoing CRM quality path: hygiene SLAs, duplicate rules, required fields, weekly review, intervene on two-week miss.",
      caption:
        "Quality is recurring ops with decision rules — not a one-off cleanup weekend.",
    },
  },
  {
    type: "figure",
    id: "sla-visual",
    title: "Hygiene SLAs and weekly quality review",
    src: "/guides/crm-data-quality-sla.png",
    alt: "Four-panel CRM data quality diagram: duplicate rules, required fields, hygiene SLAs with team-defined targets, and weekly quality review intervene rule.",
    caption:
      "Quality is recurring ops with decision rules — not a percentage copied from an industry blog.",
  },
  {
    type: "checklist",
    id: "quality-ops-checklist",
    title: "Stand up data quality ops",
    copyable: true,
    items: [
      {
        id: "signals",
        label: "Pick 3–5 hygiene signals",
        description: "e.g. owner filled, next-step filled, duplicate age, stage honesty sample.",
        order: 0,
      },
      {
        id: "targets",
        label: "Set team-defined targets",
        description: "Qualitative thresholds or internal goals — not invented industry benchmarks.",
        order: 1,
      },
      {
        id: "dupe-rules",
        label: "Write duplicate match + merge rules",
        description: "Keys, survivor record, who may merge.",
        order: 2,
      },
      {
        id: "required",
        label: "Confirm required field owners",
        description: "Business owner + coaching response for empties.",
        order: 3,
      },
      {
        id: "ritual",
        label: "Schedule weekly quality review",
        description: "30 minutes; queue → assign → decide intervene/hold.",
        order: 4,
      },
    ],
  },
  {
    type: "step",
    id: "ongoing-vs-cleaning",
    stepNumber: 1,
    heading: "Treat quality as ongoing — not a cleanup project",
    body: "One-time cleaning (dedupe before import, archive dead leads) is necessary but temporary. Ongoing quality is the SLA and ritual that keep records trustworthy after go-live. Separate the projects: finish a cleanse, then immediately turn on hygiene reviews so the cleanse does not expire.\n\nExample: Northwind Field Services runs a heroic weekend dedupe before cutover, then skips weekly reviews. By week five estimators recreate jobs because duplicates returned and next steps are empty. Ops restarts a Tuesday quality huddle and freezes new automations until the overdue queue shrinks for two weeks.",
    tip: "If your plan only has “clean data” and no weekly owner, you planned a relapse.",
    figure: {
      src: "/guides/crm-data-quality-hero.png",
      alt: "CRM data quality hero dashboard: hygiene SLA meters, duplicate queue, required-field compliance, and weekly quality review agenda.",
      caption:
        "Operational quality looks like meters, queues, and a weekly agenda — not a one-off spreadsheet scrub.",
    },
    scenarios: [
      {
        title: "Post-migration",
        body: "Cleanse first; start SLAs in week one of live use.",
      },
      {
        title: "Mature CRM drift",
        body: "Re-baseline signals; do not only schedule another cleanup weekend.",
      },
      {
        title: "Multi-source intake",
        body: "Tighten create paths and duplicate rules at the source.",
      },
    ],
  },
  {
    type: "step",
    id: "hygiene-slas",
    stepNumber: 2,
    heading: "Define hygiene SLAs with team targets",
    body: "Choose a short signal set: open items with owners, next-step fill on open work, duplicate queue age, and a small sample of stage honesty. Set targets your team can explain (for example “overdue next-step queue empty before Friday review” or “duplicates older than seven days need an owner”). Avoid presenting invented industry percentages as verified facts.\n\nExample: Meridian Specialty Finance defines success as: every open deal has owner + next step before the Monday forecast, and the duplicate queue has a named resolver with items aged beyond the team’s seven-day threshold escalated to Ana.",
    tip: "A target nobody can act on in the weekly review is decoration.",
    figure: {
      src: "/guides/crm-data-quality-slas.png",
      alt: "Define CRM hygiene SLAs: pick signals, set team targets, name owners, act in the ritual, skip invented benchmarks.",
      caption:
        "Targets must be explainable and actionable in the weekly review.",
    },
    scenarios: [
      {
        title: "Sales pod",
        body: "Owner + next step + stuck-deal sample each week.",
      },
      {
        title: "Account team",
        body: "Coverage owner + next review date on strategic accounts.",
      },
      {
        title: "Mixed intake",
        body: "Add create-path completeness for new contacts/leads.",
      },
    ],
  },
  {
    type: "step",
    id: "duplicate-rules",
    stepNumber: 3,
    heading: "Write duplicate rules and merge authority",
    body: "Decide match keys (email, phone, account name + domain, external IDs), survivor rules, and who may merge. Publish what not to do (delete without merge, create “just for me” duplicates). Route suspected duplicates into a queue with an owner — not into Slack threads.\n\nExample: Harborline Advisory matches households on primary email + household name. Planners cannot hard-delete; only Keisha or a trained champion merges, preserving activity history. The weekly review starts with duplicates older than the team’s aging threshold.",
    tip: "Merge authority without training creates silent data loss — practice on sandbox or low-risk records first.",
    figure: {
      src: "/guides/crm-data-quality-dupes.png",
      alt: "CRM duplicate rules: match keys, survivor rules, merge authority, aged queue, ban silent deletes.",
      caption:
        "Publish match keys and who may merge — do not resolve duplicates in Slack votes.",
    },
    scenarios: [
      {
        title: "Contact duplicates",
        body: "Email/phone keys; preserve the record with richer history.",
      },
      {
        title: "Account duplicates",
        body: "Domain + legal name; map child contacts before merge.",
      },
      {
        title: "Cross-object noise",
        body: "Same person as lead and contact — define convert/merge path.",
      },
    ],
  },
  {
    type: "step",
    id: "required-fields",
    stepNumber: 4,
    heading: "Enforce required fields with coaching",
    body: "Required fields only help when people know why they exist and managers reject junk. Keep the required set small: ownership, stage, next-step date, and a few reporting-critical fields with named stewards. When empties spike, coach the ritual — do not only add more required checkboxes.\n\nExample: Crestview Wealth makes next-review date required, then sees “2099-01-01” placeholders. Priya removes the fake dates, coaches partners on real next touches, and reports placeholder rates in the weekly quality review until they fall under the team’s internal threshold.",
    tip: "Junk required values are worse than honest empties — they hide the problem.",
    figure: {
      src: "/guides/crm-data-quality-required.png",
      alt: "Enforce required CRM fields with coaching: minimal set, named steward, reject junk, coach empties, hold checkbox sprawl.",
      caption:
        "Keep required fields small and coached — junk placeholders hide the real gap.",
    },
    scenarios: [
      {
        title: "Hard required",
        body: "Block save only for true must-haves after training.",
      },
      {
        title: "Soft required",
        body: "Warn + queue for coaching during early adoption.",
      },
      {
        title: "Reporting fields",
        body: "Steward reviews completeness before exec dashboards.",
      },
    ],
  },
  {
    type: "step",
    id: "weekly-quality-review",
    stepNumber: 5,
    heading: "Run a weekly quality review",
    body: "Thirty focused minutes: scan hygiene signals, work the duplicate queue, sample stage honesty, assign owners for exceptions, and decide intervene / hold / expand for related rollout work. Link outcomes to adoption gates and governance change control when fields or stages are the root cause.\n\nExample: Blue Harbor’s Tuesday huddle finds next-step fill missing the team target for the second week. They pause a new automation request, schedule manager coaching, and reopen the issue only after two clean weeks — the intervene rule in action.",
    tip: "End every review with named actions and due dates — notes without owners are not quality ops.",
    figure: {
      src: "/guides/crm-data-quality-weekly.png",
      alt: "Weekly CRM quality review: scan signals, work dupe queue, sample stage honesty, assign actions, apply intervene rule.",
      caption:
        "Thirty focused minutes ending in named actions — intervene, hold, or expand.",
    },
    scenarios: [
      {
        title: "Intervene",
        body: "Two consecutive misses → freeze complexity; coach or simplify.",
      },
      {
        title: "Hold",
        body: "Signals mixed → keep WIP; no new required fields.",
      },
      {
        title: "Expand",
        body: "Signals hold → allow next pod or light automation.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Data quality mistakes",
    items: [
      {
        title: "One-time cleanse as the plan",
        body: "Without SLAs and a weekly owner, quality decays on schedule.",
      },
      {
        title: "Invented benchmark chasing",
        body: "Copying unverified industry percentages distracts from team-defined targets.",
      },
      {
        title: "Required-field sprawl",
        body: "Too many hard requirements produce junk data and resentment.",
      },
      {
        title: "Nobody owns the duplicate queue",
        body: "Duplicates age forever and train users to create more.",
      },
      {
        title: "Automating on dirty inputs",
        body: "Task spam on empty next steps teaches people to ignore CRM.",
      },
      {
        title: "Quality without governance",
        body: "Anyone can add fields that nobody will maintain — fix ownership too.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How is data quality different from data cleaning?",
        answer:
          "Cleaning is a project (often pre-migration). Data quality is the ongoing SLAs, duplicate rules, required-field discipline, and weekly review that keep records trustworthy afterward. You usually need both — in that order.",
      },
      {
        question: "What hygiene metrics should we track?",
        answer:
          "Start with ownership on open work, next-step fill, duplicate queue age, and a light stage-honesty sample. Set team-defined targets and intervene on sustained misses — do not treat invented industry percentages as facts.",
      },
      {
        question: "Who runs the weekly quality review?",
        answer:
          "Ops/admin plus a business lead (sales or service). Managers act on coaching items; admin owns merges and config fixes under governance.",
      },
      {
        question: "When should we stop adding automations?",
        answer:
          "When hygiene signals miss your targets for two consecutive weekly reviews — or when managers still rebuild status outside CRM. Fix the loop first.",
      },
      {
        question: "How do duplicates get handled day to day?",
        answer:
          "Published match keys, a queue, named merge authority, and aging thresholds reviewed weekly. Ad-hoc deletes without merge rules destroy history.",
      },
      {
        question: "What should I do next?",
        answer:
          "Pick signals, write duplicate rules, schedule the weekly review, and connect field ownership via Governance. Use Adoption and Implementation KPIs for intervene/expand gates.",
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
        label: "CRM governance",
        description: "Field ownership and change control.",
      },
      {
        href: "/guides/crm-adoption/",
        label: "CRM adoption",
        description: "Core-loop usage that depends on clean data.",
      },
      {
        href: "/guides/crm-implementation-kpis/",
        label: "CRM implementation KPIs",
        description: "Leading hygiene signals and intervene rules.",
      },
      {
        href: "/guides/crm-change-management/",
        label: "CRM change management",
        description: "When quality fixes need people change.",
      },
      {
        href: "/guides/crm-data-cleaning/",
        label: "Clean CRM data",
        description: "One-time cleanse before ongoing SLAs.",
      },
      {
        href: "/guides/common-crm-mistakes/",
        label: "Common CRM mistakes",
        description: "Unclean migration and set-and-forget.",
      },
      {
        href: "/guides/crm-vs-spreadsheet/",
        label: "CRM vs spreadsheet",
        description: "Why side sheets destroy single source of truth.",
      },
      {
        href: "/tools/crm-migration-planner/",
        label: "Migration Planner",
        description: "Plan cleanse + cutover before live SLAs.",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "Implementation Planner",
        description: "Schedule quality rituals into rollout.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "planner-cta",
    title: "Schedule quality into the rollout",
    body: "Add hygiene SLAs, duplicate-queue ownership, and weekly quality reviews to the Implementation Planner so cleanup does not end at go-live.",
    href: "/tools/crm-implementation-planner/",
    ctaLabel: "Open Implementation Planner →",
    variant: "finder",
  },
];

export const crmDataQualityGuide: GuidePage = {
  id: "guide-crm-data-quality",
  slug: "crm-data-quality",
  title: "CRM Data Quality Guide: Ongoing Hygiene SLAs",
  summary:
    "Keep CRM trustworthy with ongoing hygiene SLAs, duplicate rules, required-field discipline, and weekly quality reviews — distinct from one-time cleaning.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "implementation",
  journeyStage: "implement",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/crm-data-quality-hero.png",
    alt: "CRM data quality hero dashboard: hygiene SLA meters, duplicate queue, required-field compliance, and weekly quality review agenda.",
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
  ],
  nextAction: {
    contentId: "content:tool:crm-implementation-planner",
    label: "Open Implementation Planner",
  },
  relatedGuideSlugs: [
    "crm-governance",
    "crm-adoption",
    "crm-implementation-kpis",
    "crm-change-management",
    "crm-data-cleaning",
    "common-crm-mistakes",
    "crm-vs-spreadsheet",
  ],
  blocks: crmDataQualityBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "signals-targets",
      label: "Define hygiene signals + team targets",
      description: "No invented industry benchmark facts.",
      order: 0,
    },
    {
      id: "dupe-required",
      label: "Publish duplicate + required-field rules",
      description: "Match keys, merge authority, field owners.",
      order: 1,
    },
    {
      id: "weekly-review",
      label: "Run weekly quality review with intervene rule",
      description: "Two-week miss → freeze complexity.",
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
    title: "CRM Data Quality Guide: Ongoing Hygiene SLAs | SoftwareGlimpse",
    description:
      "Operate CRM data quality with hygiene SLAs, duplicate rules, required fields, and weekly reviews — not a one-time cleanse.",
    canonicalPath: "/guides/crm-data-quality/",
    indexable: true,
  },
};
