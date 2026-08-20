import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Vendor Migration — switch platforms between vendors.
 * Template: softwareglimpse-guide-template-v1
 * Distinct from generic data migration: integrations, historical activity, user remapping.
 * Educational — no invented timelines, dollar totals, or rankings.
 */
const crmVendorMigrationBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Switch CRM vendors with a gated path: inventory both systems → clean the active book → map fields/users/integrations → pilot a segment → cut over with a freeze — then hygiene until the new board is trusted. Decision rule: do not firm-wide cutover until a pilot proves owners, stages, activity links, and remapped users — and until integration owners confirm what will break on day one.",
    bullets: [
      "Inventory both sides",
      "Clean active book",
      "Map fields & users",
      "Pilot + validate",
      "Freeze cutover",
      "Hygiene week",
    ],
  },
  {
    type: "decision-framework",
    id: "vendor-switch-path",
    title: "Vendor switch path",
    steps: [
      { id: "inventory", label: "Inventory", short: "Both vendors" },
      { id: "clean", label: "Clean", short: "Active book" },
      { id: "map", label: "Map", short: "Fields, users, apps" },
      { id: "pilot", label: "Pilot", short: "Segment import" },
      { id: "cutover", label: "Cutover", short: "Freeze & switch" },
      { id: "hygiene", label: "Hygiene", short: "Trust the board" },
    ],
    ctaHref: "/tools/crm-migration-planner/",
    ctaLabel: "Migration Planner →",
  },
  {
    type: "figure",
    id: "vendor-switch-visual",
    title: "Vendor A → Vendor B cutover",
    src: "/guides/crm-vendor-migration-path.png",
    alt: "Vendor CRM migration timeline: inventory both systems, clean, map fields users and integrations, pilot, freeze cutover, then hygiene — with callouts for activity history and user remapping risks.",
    caption:
      "A vendor switch is more than a CSV move — users, integrations, and activity history fail if you only map contact names.",
  },
  {
    type: "checklist",
    id: "vendor-switch-ready",
    title: "Vendor-switch readiness checklist",
    copyable: true,
    items: [
      {
        id: "destination-chosen",
        label: "Destination vendor chosen with frozen must-haves",
        description: "Replace decision done — see When to Replace.",
        order: 0,
      },
      {
        id: "dual-inventory",
        label: "Source + destination inventory complete",
        description: "Objects, integrations, roles, activity stores.",
        order: 1,
      },
      {
        id: "cleaned",
        label: "Active book cleaned before map lock",
        description: "Dedupe, owners, next steps — Data Cleaning.",
        order: 2,
      },
      {
        id: "user-map",
        label: "User / seat remap table approved",
        description: "Leavers, shared inboxes, role equivalents.",
        order: 3,
      },
      {
        id: "integration-owners",
        label: "Integration cut list with named owners",
        description: "What reconnects, what retires, what waits.",
        order: 4,
      },
      {
        id: "pilot-pass",
        label: "Pilot segment passed (ops + frontline)",
        description: "Owners, stages, sample activity links.",
        order: 5,
      },
      {
        id: "freeze",
        label: "Freeze window + rollback note scheduled",
        description: "Team knows when Vendor A edits stop.",
        order: 6,
      },
    ],
  },
  {
    type: "step",
    id: "inventory-both",
    stepNumber: 1,
    heading: "Inventory both vendors — not just contacts",
    body: "List what lives in the source CRM and what the destination expects: companies/contacts, open opportunities, custom objects, notes/emails/tasks, files, reports, automations, and live integrations (email, calendar, billing, support, marketing). Rank each as migrate live, archive export-only, or retire. Vendor switches fail when teams only inventory “contacts and deals.”\n\nExample: Harbor Advisory, a 28-person B2B firm leaving Vendor A for Vendor B, inventories open deals and contacts plus: Gmail sync, Stripe customer IDs on companies, Zendesk ticket links, three Zapier flows posting Slack alerts, and seven shared “team” seats that are not people. They mark Zendesk links as reconnect-after-cutover, retire two unused Zaps, and treat closed-won older than the agreed window as archive-only.",
    tip: "If two sources disagree on owner or stage, pick the winning rule before mapping — vendor imports amplify conflict.",
    figure: {
      src: "/guides/crm-vendor-migration-hero.png",
      alt: "CRM vendor migration hero: switching from Vendor A to Vendor B across inventory, clean, map, pilot, and cutover with integration and user-remap callouts.",
      caption:
        "Vendor switch success starts with an honest inventory of integrations, users, and activity — not a contact export alone.",
    },
    scenarios: [
      {
        title: "Core objects",
        body: "Companies, contacts, open opportunities.",
      },
      {
        title: "Integrations",
        body: "Email, billing, support, automation hubs.",
      },
      {
        title: "People & seats",
        body: "Named users vs shared/team inboxes.",
      },
    ],
  },
  {
    type: "step",
    id: "clean-then-map",
    stepNumber: 2,
    heading: "Clean the active book, then map fields and users",
    body: "Do not map dirty open work into a new vendor. Dedupe, assign owners, require next-step dates, archive inactive records, and fill day-one required fields. Then build three maps: (1) fields — source → destination → transform → rule owner; (2) users — old seats → new seats/roles, including leavers; (3) integrations — reconnect, replace, or retire. Pair with Data Cleaning and Field Mapping; use generic Data Migration for the shared inventory→pilot pattern, but keep vendor risks explicit here.\n\nExample: Harbor’s ops lead Sam runs a cleaning week on open retainers, then maps Sheet/CRM owner conflicts (sheet wins for account owner; Vendor A wins for open stage). User remap sends two leavers’ open deals to a named AE; the “Sales shared” inbox becomes a queue user in Vendor B. Stripe ID maps to a custom company field; Zendesk stays on the reconnect list, not the first import.",
    tip: "User remapping is its own workstream — orphaned owners on Monday destroy trust faster than a missing vanity field.",
    scenarios: [
      {
        title: "Field map",
        body: "Identity keys, stages, required day-one fields.",
      },
      {
        title: "User remap",
        body: "Leavers, shared seats, role equivalents.",
      },
      {
        title: "Integration map",
        body: "Reconnect / retire / wait — with owners.",
      },
    ],
  },
  {
    type: "step",
    id: "pilot-activity",
    stepNumber: 3,
    heading: "Pilot with the messiest segment — validate activity too",
    body: "Import a bounded segment into a sandbox or clean destination org. Validate company links, owners, stages, and a sample of notes/emails/tasks if those migrate. Have ops and a frontline lead walk records together. Fix maps before scaling. Historical activity is a vendor-switch risk: some tools export threads poorly; decide what must be live vs archive before promising “everything moves.”\n\nExample: Harbor pilots 40 retainer accounts for AE Nina. Three companies split on nickname matches; two deals land under leavers until the user map is fixed; email bodies for older threads stay archive-only after a sample shows incomplete exports. They re-import the pilot, document “live notes = last 12 months of open accounts,” and only then schedule firm cutover in the Migration Planner.",
    tip: "Pilot the segment with shared seats and integrations — clean AE-only samples hide remapping failures.",
    scenarios: [
      {
        title: "Link & owner check",
        body: "Contacts under correct companies; roles correct.",
      },
      {
        title: "Activity sample",
        body: "Decide live vs archive for notes/email.",
      },
      {
        title: "Integration smoke",
        body: "Test one reconnect path before go-live.",
      },
    ],
  },
  {
    type: "step",
    id: "cutover-hygiene",
    stepNumber: 4,
    heading: "Freeze, cut over, then run hygiene",
    body: "Announce when Vendor A edits stop, who runs the final export, and when Vendor B becomes the only place for new notes and stages. Keep the freeze short. Validate critical counts and spot-check remapped users before the go-live email. After cutover, run hygiene: merge stragglers, fix orphan contacts, require next steps, confirm leavers’ seats are gone, and reconnect integrations on the owned sequence. Pair Implementation Planner for post-cutover expand.\n\nExample: Harbor freezes Friday 4pm on Vendor A; ops exports; Saturday import and validation; Monday 8am sellers open only Vendor B. Gmail sync reconnects Monday morning under Sam; Stripe ID spot-checks pass; Zendesk reconnect waits until Wednesday. For ten business days Sam posts a hygiene board — duplicates, deals missing next step, users still on Vendor A bookmarks. Switch is done when Friday pipeline review no longer opens Vendor A.",
    tip: "Do not reconnect every integration on cutover morning — stabilize core loop and user access first.",
    scenarios: [
      {
        title: "Freeze",
        body: "No parallel truth past the cut line.",
      },
      {
        title: "Validate",
        body: "Counts, owners, and user remap spot-checks.",
      },
      {
        title: "Hygiene",
        body: "Daily board until Vendor B is trusted.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Vendor-switch mistakes",
    items: [
      {
        title: "Treating switch as “just data migration”",
        body: "Integrations, users, and activity history need their own maps.",
      },
      {
        title: "Big-bang import without a pilot",
        body: "Field and user-map bugs multiply across every account at once.",
      },
      {
        title: "Promising all historical email will be live",
        body: "Many vendors export activity poorly — decide archive vs live early.",
      },
      {
        title: "Skipping user remapping",
        body: "Leavers and shared seats create orphan ownership on day one.",
      },
      {
        title: "Running two CRMs without a freeze",
        body: "Parallel edits guarantee Vendor B is wrong by Tuesday.",
      },
      {
        title: "Reconnecting every app during cutover hour",
        body: "Stabilize roles and core loop; sequence integrations with owners.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How is vendor migration different from data migration?",
        answer:
          "Data migration covers inventory → clean → map → pilot → cutover for records. Vendor migration adds switch-specific risks: remapping users/seats, reconnecting or retiring integrations, and deciding what historical activity is live vs archive. Use both guides — this one emphasizes the switch risks.",
      },
      {
        question: "Should we migrate all historical activity?",
        answer:
          "Migrate enough for people to serve customers without hunting Vendor A daily. Deep closed archaeology can stay export-only if it slows cutover and nobody uses it weekly. Prove a sample export before promising “everything.”",
      },
      {
        question: "What about integrations during the switch?",
        answer:
          "Inventory every live connection, name an owner, and classify reconnect / replace / retire. Smoke-test at least one critical path in pilot; do not flip every app during the freeze hour.",
      },
      {
        question: "How do we remap users and shared seats?",
        answer:
          "Build an explicit old-seat → new-seat/role table, including leavers and shared inboxes. Validate ownership on the pilot segment before firm-wide cutover.",
      },
      {
        question: "How long does a CRM vendor switch take?",
        answer:
          "Duration depends on data quality, integration count, and team size — not a universal calendar. Plan inventory, cleaning, mapping, and pilot before setting a cutover date. Treat “switch this weekend” claims skeptically until the pilot passes.",
      },
      {
        question: "What if we have not decided whether to replace yet?",
        answer:
          "Use When to Replace CRM first. Do not start a vendor migration until the optimize-vs-replace gate is decided and destination constraints are frozen.",
      },
      {
        question: "What should I do next?",
        answer:
          "Open the CRM Migration Planner to sequence inventory → cutover, use Data Cleaning and Field Mapping for artifacts, keep CRM Data Migration open for the shared path, and use Implementation Planner for post-cutover expand.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM switch & migration resources",
    links: [
      {
        href: "/guides/when-to-replace-crm/",
        label: "When to replace a CRM",
        description: "Decide before you switch.",
      },
      {
        href: "/guides/crm-data-migration/",
        label: "CRM data migration",
        description: "Shared inventory → pilot → cutover path.",
      },
      {
        href: "/guides/crm-data-cleaning/",
        label: "Clean CRM data",
        description: "Hygiene before import.",
      },
      {
        href: "/guides/crm-field-mapping/",
        label: "Field mapping guide",
        description: "Source → destination rules.",
      },
      {
        href: "/guides/crm-go-live/",
        label: "CRM go-live guide",
        description: "Freeze window launch.",
      },
      {
        href: "/guides/crm-implementation/",
        label: "CRM implementation guide",
        description: "Stabilize after cutover.",
      },
      {
        href: "/tools/crm-migration-planner/",
        label: "CRM Migration Planner",
        description: "Sequence the vendor switch.",
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
    title: "Plan the vendor switch",
    body: "Use the CRM Migration Planner to sequence inventory, cleaning, field/user/integration maps, pilot, and freeze cutover — without invented timelines or dollar totals.",
    href: "/tools/crm-migration-planner/",
    ctaLabel: "Open Migration Planner →",
    variant: "generic",
  },
];

export const crmVendorMigrationGuide: GuidePage = {
  id: "guide-crm-vendor-migration",
  slug: "crm-vendor-migration",
  title: "Migrate to Another CRM Vendor: Switch Playbook",
  summary:
    "Switch CRM vendors with inventory, cleaning, field/user/integration maps, pilot validation, freeze cutover, and hygiene — emphasizing switch risks beyond a generic data move.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "migration",
  journeyStage: "switch",
  knowledgeAreaSlug: "migration",
  heroVisual: {
    src: "/guides/crm-vendor-migration-hero.png",
    alt: "CRM vendor migration hero: switching from Vendor A to Vendor B across inventory, clean, map, pilot, and cutover with integration and user-remap callouts.",
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
    "when-to-replace-crm",
    "crm-data-migration",
    "crm-data-cleaning",
    "crm-field-mapping",
    "crm-go-live",
    "crm-implementation",
    "crm-implementation-mistakes",
    "how-to-choose-crm",
  ],
  blocks: crmVendorMigrationBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "dual-inventory",
      label: "Inventory source + destination systems",
      description: "Objects, users, integrations, activity.",
      order: 0,
    },
    {
      id: "pilot",
      label: "Pass pilot with user remap + activity sample",
      description: "Ops + frontline validation.",
      order: 1,
    },
    {
      id: "cutover",
      label: "Schedule freeze, reconnect sequence, hygiene",
      description: "Named owners for each.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "medium-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T16:45:00.000Z",
    publishedAt: "2026-08-14T16:45:00.000Z",
    reviewedAt: "2026-08-14T16:45:00.000Z",
    researchStatus: "complete",
    seoStatus: "optimized",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Migrate to Another CRM Vendor: Switch Playbook | SoftwareGlimpse",
    description:
      "How to switch CRM vendors: inventory both systems, clean, map fields/users/integrations, pilot, freeze cutover, and hygiene — switch risks beyond generic data migration.",
    canonicalPath: "/guides/crm-vendor-migration/",
    indexable: true,
  },
};
