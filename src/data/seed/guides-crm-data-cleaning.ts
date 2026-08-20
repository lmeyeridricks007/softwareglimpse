import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Clean CRM Data — operational hygiene before migrate.
 * Template: softwareglimpse-guide-template-v1
 * Educational / operational — no invented metrics, rankings, or dollar totals.
 * topicType: migration (not how-to).
 */
const crmDataCleaningBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Clean CRM data before you migrate by running four operational passes: deduplicate contacts/companies, fix owner and next-step hygiene on open work, archive inactive records, and enforce required day-one fields. Decision rule: do not start a full import until every open opportunity has an owner and a next-step date — and until duplicate identity conflicts are resolved with a written winning rule.",
    bullets: [
      "Dedupe identities",
      "Owner hygiene",
      "Next-step hygiene",
      "Archive inactive",
      "Required fields",
      "Then map/migrate",
    ],
  },
  {
    type: "decision-framework",
    id: "cleaning-path",
    title: "Cleaning path before migrate",
    steps: [
      { id: "dedupe", label: "Dedupe", short: "One identity" },
      { id: "owners", label: "Owners", short: "Open work owned" },
      { id: "next", label: "Next steps", short: "Dates on open" },
      { id: "inactive", label: "Inactive", short: "Archive cold" },
      { id: "required", label: "Required", short: "Day-one fields" },
    ],
    ctaHref: "/tools/crm-migration-planner/",
    ctaLabel: "Migration Planner →",
    figure: {
      src: "/guides/crm-data-cleaning-path.png",
      alt: "Cleaning path before migrate: dedupe, owners, next steps, archive inactive, required day-one fields.",
      caption:
        "Operational passes in order — do not start a full import on unclean open work.",
    },
  },
  {
    type: "figure",
    id: "cleaning-workflow",
    title: "Four cleaning passes",
    src: "/guides/crm-data-cleaning-workflow.png",
    alt: "Four-step CRM data cleaning workflow: deduplicate, fix owner and next-step hygiene, archive inactive records, enforce required fields before migrate.",
    caption:
      "Operational passes in order — cleaning mid-import is how freeze weekends expand.",
  },
  {
    type: "checklist",
    id: "clean-ready",
    title: "Pre-migrate cleaning checklist",
    copyable: true,
    items: [
      {
        id: "dedupe-done",
        label: "Duplicate companies/contacts merged or queued",
        description: "Winning identity rule written.",
        order: 0,
      },
      {
        id: "owners-done",
        label: "Every open opportunity has an owner",
        description: "No “shared” or blank owners on live work.",
        order: 1,
      },
      {
        id: "next-steps-done",
        label: "Every open opportunity has a next-step date",
        description: "Empty next steps are migration debt.",
        order: 2,
      },
      {
        id: "inactive-archived",
        label: "Inactive records archived or marked do-not-migrate",
        description: "Cold history stays out of the live import.",
        order: 3,
      },
      {
        id: "required-filled",
        label: "Required day-one fields filled on open set",
        description: "Only fields you will actually keep accurate.",
        order: 4,
      },
      {
        id: "approver",
        label: "Merge/archive approver named",
        description: "Admin or ops decides conflicts — not Slack democracy.",
        order: 5,
      },
    ],
  },
  {
    type: "step",
    id: "dedupe",
    stepNumber: 1,
    heading: "Deduplicate contacts and companies",
    body: "Start with identity. Export or filter likely duplicates (same email domain + similar name, same phone, same company name variants). Pick a winning record rule — for example, newest activity wins for contacts; longest-lived company record wins for accounts — and merge with a named approver. Do not fuzzy-merge blindly across the whole database in one click.\n\nExample: Harborline Studio, a 14-person digital agency, finds three “Acme Holdings” company rows and six contact variants for the same buyer. Ops lead Devon writes: company merge prefers the record with open opportunities; contact merge prefers the email the AE actually uses. They process the open-book duplicates first, not ten years of cold trade-show badges.",
    tip: "Merge the open set first — perfecting archive duplicates delays migration without helping Monday’s pipeline.",
    figure: {
      src: "/guides/crm-data-cleaning-hero.png",
      alt: "CRM data cleaning hero: amber problem list for duplicates, empty owners, blank next steps, inactive records, and missing required fields paired with mint fix panels.",
      caption:
        "Problems → operational fixes — not vague “improve data quality” advice.",
    },
    scenarios: [
      {
        title: "Same email, two contacts",
        body: "Merge; keep activity on the winner.",
      },
      {
        title: "Company name variants",
        body: "Pick one legal/trade name; redirect aliases.",
      },
      {
        title: "Cross-source duplicates",
        body: "Resolve CRM vs sheet identity before map.",
      },
    ],
  },
  {
    type: "step",
    id: "owner-next-step",
    stepNumber: 2,
    heading: "Fix owner and next-step hygiene",
    body: "Open work without an owner or next step will poison the new CRM’s first Friday review. Filter open opportunities (and any open “next review” objects you use) for blank owner or blank next-step date. Assign owners using a written rule (territory, book, last activity). Require a real next action date — not “TBD.”\n\nExample: Harborline’s pipeline board shows 28 open deals; 11 lack next steps and 4 have blank owners after a departure. Sales lead Maya runs a 60-minute hygiene huddle: assign orphans, set next-step dates, and close or archive deals that are fiction. Only then does migration mapping start.",
    tip: "Treat empty next steps as incidents during cleaning week — not as a backlog for “after go-live.”",
    figure: {
      src: "/guides/crm-data-cleaning-owners-next.png",
      alt: "Fix CRM owner and next-step hygiene: filter blanks, assign by rule, set real dates, close fiction, then map.",
      caption:
        "Empty next steps are migration debt — clear them before field mapping starts.",
    },
    scenarios: [
      {
        title: "Leaver orphans",
        body: "Reassign before import; do not migrate blank owners.",
      },
      {
        title: "Shared ownership fiction",
        body: "One Responsible name per open opportunity.",
      },
      {
        title: "Stale next steps",
        body: "Past-due dates need a new date or a close reason.",
      },
    ],
  },
  {
    type: "step",
    id: "inactive",
    stepNumber: 3,
    heading: "Archive inactive records",
    body: "Define inactive in writing (for example: no activity and no open opportunity within an agreed window). Mark those records do-not-migrate or archive them in the source before export. Keep an export archive if legal/ops need history — but do not load cold rows into the live destination as if they were active customers.\n\nExample: Harborline marks contacts with no activity in their agreed inactive window and no open deal as archive-only. They export that set to a dated file for reference and exclude it from the Migration Planner cutover import. Live retainers and open pipeline stay in the migrate set.",
    tip: "Inactive is a rule you write once — not a feeling during the freeze weekend.",
    figure: {
      src: "/guides/crm-data-cleaning-archive.png",
      alt: "Archive inactive CRM records: define rule, mark do-not-migrate, export history, exclude from live load, keep open pipeline.",
      caption:
        "Cold history stays in an export archive — not in the live destination as active customers.",
    },
    scenarios: [
      {
        title: "Cold contacts",
        body: "Archive; do not invent owners just to import.",
      },
      {
        title: "Closed-won ancient deals",
        body: "Often export-only unless reporting needs them live.",
      },
      {
        title: "Legal hold exceptions",
        body: "Park in archive with IT/ops — still not live clutter.",
      },
    ],
  },
  {
    type: "step",
    id: "required-fields",
    stepNumber: 4,
    heading: "Enforce required fields before migrate",
    body: "List the day-one required fields you will actually keep accurate — typically owner, stage, next step, and maybe industry or segment if reviews use them. Fill those on the open migrate set. Do not invent a long required list; every required field needs a Responsible updater after go-live.\n\nExample: Harborline requires Owner, Stage, Next step, and Account type on open opportunities. They drop “Lead score” and “Personality notes” from required. Admin Devon rejects any new required-field request that lacks an updater name — same discipline as the Implementation Roles RACI.",
    tip: "Required fields without owners become empty theater in the new system.",
    figure: {
      src: "/guides/crm-data-cleaning-required.png",
      alt: "Enforce required CRM fields before migrate: list day-one fields, fill open set, name updaters, reject vanity requireds.",
      caption:
        "Only require fields someone will keep accurate after go-live.",
    },
    scenarios: [
      {
        title: "Minimal required set",
        body: "Owner + stage + next step for open work.",
      },
      {
        title: "Segment fields",
        body: "Only if Friday reviews actually filter on them.",
      },
      {
        title: "Reject vanity requireds",
        body: "Unused fields stay optional or rejected.",
      },
    ],
  },
  {
    type: "step",
    id: "hand-to-migrate",
    stepNumber: 5,
    heading: "Hand a clean open set to mapping",
    body: "When the checklist passes, freeze further messy imports into the source, hand the clean open set to field mapping, and schedule the pilot import. Cleaning is not a one-time festival — keep a short recurring hygiene huddle through cutover week so new duplicates do not reappear.\n\nExample: Harborline’s cleaning checklist goes green on Wednesday; Thursday they finalize the field map; Friday they pilot 20 accounts. Devon keeps a 15-minute daily hygiene standup through cutover so AEs do not recreate sheet duplicates while the freeze approaches.",
    tip: "If cleaning never finishes, your migrate date is fictional — move the date, not the quality bar.",
    figure: {
      src: "/guides/crm-data-cleaning-hand-off.png",
      alt: "Hand a clean open CRM set to mapping: checklist green, freeze messy imports, finalize map, pilot messy sample, hygiene through cutover.",
      caption:
        "Checklist green before map — keep a short hygiene huddle through cutover week.",
    },
    scenarios: [
      {
        title: "Ready for map",
        body: "Open set clean; reject list known.",
      },
      {
        title: "Ready for pilot",
        body: "Messiest segment included in the sample.",
      },
      {
        title: "Ready for cutover",
        body: "Hygiene owner named for post-import week.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Data-cleaning mistakes",
    items: [
      {
        title: "Cleaning only after full import",
        body: "You teach distrust on day one and clean under production pressure.",
      },
      {
        title: "Fuzzy-merging the entire database blindly",
        body: "Wrong merges destroy history; approve open-set merges first.",
      },
      {
        title: "Migrating inactive as live",
        body: "Cold rows inflate counts and hide real pipeline.",
      },
      {
        title: "Leaving blank owners “for later”",
        body: "Later becomes never; Friday reviews stay fictional.",
      },
      {
        title: "Making twenty fields required",
        body: "People invent junk values; keep required fields minimal and owned.",
      },
      {
        title: "No merge approver",
        body: "Slack votes recreate duplicates under new IDs.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How do you clean CRM data before a migration?",
        answer:
          "Run operational passes in order: dedupe identities, fix owners and next steps on open work, archive inactive records, and enforce a minimal required-field set. Decision rule: no full import until open opportunities have owners and next-step dates.",
      },
      {
        question: "What should we clean first — history or open work?",
        answer:
          "Open work first. Archive or export-only cold history. Perfecting ten-year-old trade-show contacts rarely improves Monday’s pipeline review.",
      },
      {
        question: "How do we decide which duplicate wins?",
        answer:
          "Write a rule before merging (for example, newest activity for contacts; record with open opportunities for companies). Name an approver for conflicts instead of group-chat voting.",
      },
      {
        question: "What counts as inactive?",
        answer:
          "Define it in writing for your team — typically no activity and no open opportunity within an agreed window. Document exceptions (legal hold) separately so they do not clog the live migrate set.",
      },
      {
        question: "Do we need special tools to clean?",
        answer:
          "Start with filters, exports, and merge features you already have, plus a checklist and an approver. Add vendor or third-party cleaning tools only if volume demands it — tools do not replace written winning rules.",
      },
      {
        question: "What should I do next?",
        answer:
          "Complete the pre-migrate cleaning checklist, then continue into Field Mapping and the CRM Data Migration guide. Sequence the cutover in the Migration Planner once the open set is clean.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM data resources",
    links: [
      {
        href: "/guides/crm-data-migration/",
        label: "CRM data migration",
        description: "Inventory → pilot → cutover.",
      },
      {
        href: "/guides/crm-field-mapping/",
        label: "Field mapping guide",
        description: "After the open set is clean.",
      },
      {
        href: "/guides/crm-implementation/",
        label: "CRM implementation guide",
        description: "Pillar rollout path.",
      },
      {
        href: "/guides/crm-implementation-mistakes/",
        label: "Implementation mistakes",
        description: "Dirty migrate risks.",
      },
      {
        href: "/guides/crm-implementation-roles/",
        label: "Implementation roles",
        description: "Who approves merges.",
      },
      {
        href: "/guides/crm-data-quality/",
        label: "CRM data quality",
        description: "Ongoing quality after go-live.",
      },
      {
        href: "/tools/crm-migration-planner/",
        label: "CRM Migration Planner",
        description: "Sequence clean → cutover.",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "CRM Implementation Planner",
        description: "Pilot and expand after.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "migration-planner-cta",
    title: "Sequence cleaning into cutover",
    body: "When the cleaning checklist is green, use the CRM Migration Planner to attach clean → map → pilot → cutover with owners — without invented timelines.",
    href: "/tools/crm-migration-planner/",
    ctaLabel: "Open Migration Planner →",
    variant: "generic",
  },
];

export const crmDataCleaningGuide: GuidePage = {
  id: "guide-crm-data-cleaning",
  slug: "crm-data-cleaning",
  title: "Clean CRM Data Before You Migrate",
  summary:
    "Operational CRM data cleaning before migration: dedupe, owner and next-step hygiene, archive inactive records, and enforce required fields — with a named approver.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "migration",
  journeyStage: "implement",
  knowledgeAreaSlug: "migration",
  heroVisual: {
    src: "/guides/crm-data-cleaning-hero.png",
    alt: "CRM data cleaning hero: amber problem list for duplicates, empty owners, blank next steps, inactive records, and missing required fields paired with mint fix panels.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:tool:crm-migration-planner",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:tool:crm-migration-planner",
    label: "Try the Migration Planner",
  },
  relatedGuideSlugs: [
    "crm-data-migration",
    "crm-field-mapping",
    "crm-implementation",
    "crm-implementation-mistakes",
    "crm-implementation-roles",
    "crm-data-quality",
    "crm-go-live",
    "crm-testing",
  ],
  blocks: crmDataCleaningBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "dedupe",
      label: "Dedupe open-set identities",
      description: "Winning rule + approver.",
      order: 0,
    },
    {
      id: "hygiene",
      label: "Owners + next steps on open work",
      description: "No blanks on live opportunities.",
      order: 1,
    },
    {
      id: "archive-required",
      label: "Archive inactive; fill requireds",
      description: "Then hand off to mapping.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "medium-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T12:00:00.000Z",
    publishedAt: "2026-08-14T12:00:00.000Z",
    reviewedAt: "2026-08-14T12:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Clean CRM Data Before Migration | SoftwareGlimpse",
    description:
      "How to clean CRM data before migrate: dedupe, owner and next-step hygiene, archive inactive records, and enforce required fields — operational playbook.",
    canonicalPath: "/guides/crm-data-cleaning/",
    indexable: true,
  },
};
