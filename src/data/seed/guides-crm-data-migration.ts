import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Data Migration Guide — inventory → clean → map → pilot → validate → cutover.
 * Template: softwareglimpse-guide-template-v1
 * Educational / operational — no invented timelines, prices, or rankings.
 */
const crmDataMigrationBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Migrate CRM data in a gated path: inventory sources → clean → map fields → pilot migrate → validate → cutover with a freeze window — then hygiene until the board is trusted. Decision rule: do not firm-wide cutover until a pilot sample shows correct owners, links, and stages — and until you know how to re-import or roll back if validation fails.",
    bullets: [
      "Inventory sources",
      "Clean first",
      "Map fields",
      "Pilot migrate",
      "Validate",
      "Freeze cutover",
    ],
  },
  {
    type: "decision-framework",
    id: "migration-path",
    title: "Migration path",
    steps: [
      { id: "inventory", label: "Inventory", short: "Sources of truth" },
      { id: "clean", label: "Clean", short: "Before map" },
      { id: "map", label: "Map", short: "Fields & owners" },
      { id: "pilot", label: "Pilot", short: "Sample import" },
      { id: "validate", label: "Validate", short: "Owners & stages" },
      { id: "cutover", label: "Cutover", short: "Freeze & switch" },
    ],
    ctaHref: "/tools/crm-migration-planner/",
    ctaLabel: "Migration Planner →",
  },
  {
    type: "figure",
    id: "cutover-visual",
    title: "Cutover sequence",
    src: "/guides/_shared/migration-cutover-field-map.png",
    alt: "SoftwareGlimpse shared CRM migration visual system: inventory, clean, map, pilot, and cutover stages.",
    caption:
      "Shared SoftwareGlimpse migration kit — inventory → clean → map → pilot → cutover. Parameterize product names in surrounding copy; keep this sequence.",
  },
  {
    type: "checklist",
    id: "migration-ready",
    title: "Migration readiness checklist",
    copyable: true,
    items: [
      {
        id: "sources",
        label: "Sources of truth named and ranked",
        description: "Legacy CRM, sheets, inboxes — primary vs archive.",
        order: 0,
      },
      {
        id: "cleaned",
        label: "Open records cleaned",
        description: "Dedupe, owners, next steps — see Data Cleaning.",
        order: 1,
      },
      {
        id: "field-map",
        label: "Field map approved",
        description: "Source → destination → transform → rule owner.",
        order: 2,
      },
      {
        id: "pilot-pass",
        label: "Pilot import passed",
        description: "Sample segment validated by ops + a frontline lead.",
        order: 3,
      },
      {
        id: "roles",
        label: "Roles ready before mass invites",
        description: "Do not widen access during import chaos.",
        order: 4,
      },
      {
        id: "freeze",
        label: "Freeze window scheduled",
        description: "Team knows when legacy edits stop.",
        order: 5,
      },
      {
        id: "rollback",
        label: "Re-import / rollback note written",
        description: "Who decides if counts fail validation.",
        order: 6,
      },
    ],
  },
  {
    type: "step",
    id: "inventory",
    stepNumber: 1,
    heading: "Inventory every source of customer truth",
    body: "List where identity, history, and opportunity state actually live: legacy CRM, shared sheets, project tools, email folders, and personal trackers. Rank each as system of record, secondary, or archive-only. Decide what will not migrate.\n\nExample: Cascade Agency, a 16-person B2B services shop, inventories HubSpot contacts/deals, a Google Sheet for retainer account owners, and Asana for delivery tasks. They keep CRM + sheet as migration inputs and treat Asana as reference — delivery status stays in project tools; only client identity and open commercial opportunities move.",
    tip: "If two sources disagree on owner or stage, resolve the winning rule before mapping — imports amplify conflict.",
    figure: {
      src: "/guides/crm-data-migration-hero.png",
      alt: "CRM data migration hero: six-stage path inventory, clean, map, pilot migrate, validate, and cutover with UI mock panels.",
      caption:
        "Migration succeeds when inventory and cleaning are honest before the first full import.",
    },
    scenarios: [
      {
        title: "Primary CRM",
        body: "Contacts, companies, open opportunities.",
      },
      {
        title: "Owner sheet",
        body: "Account ownership often hides outside the CRM.",
      },
      {
        title: "Archive",
        body: "Old closed deals may stay export-only.",
      },
    ],
  },
  {
    type: "step",
    id: "clean-before-map",
    stepNumber: 2,
    heading: "Clean before you map",
    body: "Do not map garbage into new field names. Run operational cleaning on open work: dedupe contacts/companies, assign owners, require next-step dates, archive inactive records, and fill required day-one fields. Link the Data Cleaning guide as the playbook; migration assumes that work is underway.\n\nExample: Cascade’s sheet and CRM disagreed on 40 retainers. Ops lead Keisha ran a cleaning week: merge duplicates, pick a winning owner rule (sheet wins for retainer owner; CRM wins for open deal stage), archive clients with no activity in the agreed inactive window, and require next step on every open opportunity before mapping.",
    tip: "Cleaning mid-import is how freeze weekends turn into freeze months.",
    scenarios: [
      {
        title: "Dedupe first",
        body: "One company/contact identity before field map.",
      },
      {
        title: "Owner + next step",
        body: "Open items without both are migration debt.",
      },
      {
        title: "Inactive archive",
        body: "Do not import cold history as if it were live.",
      },
    ],
  },
  {
    type: "step",
    id: "map-fields",
    stepNumber: 3,
    heading: "Map fields, stages, and ownership",
    body: "Build a field map: source field → destination field → transform rule → owner of the rule. Explicitly map company/contact links, open vs closed stages, and required day-one fields. Drop vanity fields nobody updates. Keep a reject list so importers stop inventing destinations. Pair with the Field Mapping guide for the template shape.\n\nExample: Cascade maps Sheet “Account owner” to Company owner, collapses seven informal stages into Discovery / Proposal / Verbal / Closed-won / Closed-lost, and requires Next step on every open opportunity. Vanity “lead score” from an unused tool goes on the reject list.",
    tip: "Map the reject list too — “bring everything” is how distrust starts.",
    scenarios: [
      {
        title: "Identity keys",
        body: "Stable external IDs beat fuzzy name matching alone.",
      },
      {
        title: "Stage honesty",
        body: "Merge stages staff cannot define consistently.",
      },
      {
        title: "Owner rule",
        body: "One named owner per open opportunity on day one.",
      },
    ],
  },
  {
    type: "step",
    id: "pilot-validate",
    stepNumber: 4,
    heading: "Pilot migrate, then validate",
    body: "Import a bounded sample — one pod’s accounts or one region — into a sandbox or clean org. Validate company links, owners, open stages, and a handful of notes. Have a frontline lead and ops walk the records together. Fix the map before scaling. Validation is a written checklist, not a vibe.\n\nExample: Cascade pilots 35 retainer accounts for AE Maya. Three companies split incorrectly on nickname matches; two open deals lacked next steps after transform. They fix the map, re-import the pilot, and only then schedule firm cutover in the Migration Planner.",
    tip: "Pilot with the messiest segment you have — clean samples hide mapping failures.",
    scenarios: [
      {
        title: "Link check",
        body: "Contacts sit under the correct company.",
      },
      {
        title: "Owner check",
        body: "Roles show what the access model intends.",
      },
      {
        title: "Pipeline check",
        body: "Open deals match reality, not legacy stage names.",
      },
    ],
  },
  {
    type: "step",
    id: "cutover-hygiene",
    stepNumber: 5,
    heading: "Cut over with a freeze, then run hygiene",
    body: "Announce when legacy edits stop, who runs the final export, and when the new CRM becomes the only place for new notes and stages. Keep the freeze short. Validate critical counts before declaring success. Keep a re-import plan written down. After cutover, schedule hygiene: merge stragglers, fix orphan contacts, require next steps, confirm leavers’ seats are gone.\n\nExample: Cascade freezes Friday 4pm on the old CRM; ops exports; Saturday import and validation; Monday 8am sellers open only the new CRM. For ten business days Keisha posts a hygiene board — duplicates remaining, deals missing next step. Migration is done when Friday pipeline review no longer rebuilds reality in Sheets.",
    tip: "Do not invite every contractor during cutover week — stabilize roles first.",
    scenarios: [
      {
        title: "Freeze",
        body: "No parallel truth in two systems past the cut line.",
      },
      {
        title: "Validate",
        body: "Counts and spot-checks before the go-live email.",
      },
      {
        title: "Hygiene",
        body: "Daily short standup until the board is trusted.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Migration mistakes",
    items: [
      {
        title: "Big-bang import without a pilot",
        body: "Field-map bugs multiply across every account at once.",
      },
      {
        title: "Migrating dirty data “we’ll clean later”",
        body: "Later rarely comes; distrust arrives on Monday.",
      },
      {
        title: "Bringing every historical field just in case",
        body: "Dead fields create noise; archive what you rarely use.",
      },
      {
        title: "Running two systems without a freeze",
        body: "Parallel edits guarantee the new CRM is wrong.",
      },
      {
        title: "Ignoring permissions during import",
        body: "Wide-open seats during cutover become the lasting model.",
      },
      {
        title: "Declaring done at import success",
        body: "Done means weekly review runs from the board without a side sheet.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How should we migrate CRM data?",
        answer:
          "Inventory sources, clean open records, map fields and ownership, pilot import a sample, validate, then cut over with a freeze window and a hygiene period. Decision rule: no firm-wide cutover until the pilot passes.",
      },
      {
        question: "How long does CRM data migration take?",
        answer:
          "Duration depends on data quality, complexity, and team size — not a universal calendar. Plan inventory, cleaning, and mapping before setting a cutover date. Treat “migrate in a weekend” claims skeptically until your pilot passes.",
      },
      {
        question: "Should we migrate closed history?",
        answer:
          "Migrate enough history for people to serve customers without hunting archives. Deep closed-deal archaeology can stay in an export archive if it slows cutover and nobody uses it weekly.",
      },
      {
        question: "What if legacy CRM and our sheet disagree?",
        answer:
          "Pick a winning rule before import (for example, sheet wins for account owner; CRM wins for open deal stage). Document the rule on the field map so importers do not invent fixes mid-flight.",
      },
      {
        question: "How do cleaning and field mapping fit?",
        answer:
          "Cleaning prepares open records; field mapping defines transforms. Run cleaning before you finalize the map, and keep both guides open during pilot validation.",
      },
      {
        question: "What should I do next?",
        answer:
          "Open the CRM Migration Planner to sequence inventory → cutover, then use Data Cleaning and Field Mapping for the artifacts. Pair with Implementation Roles and Implementation Mistakes so ownership and gates stay intact.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM migration resources",
    links: [
      {
        href: "/guides/crm-implementation/",
        label: "CRM implementation guide",
        description: "Pillar after cutover.",
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
        href: "/guides/crm-implementation-roles/",
        label: "Implementation roles",
        description: "Who owns migrate phases.",
      },
      {
        href: "/guides/crm-implementation-mistakes/",
        label: "Implementation mistakes",
        description: "Dirty migrate & big-bang risks.",
      },
      {
        href: "/guides/crm-go-live/",
        label: "CRM go-live guide",
        description: "Freeze window launch.",
      },
      {
        href: "/tools/crm-migration-planner/",
        label: "CRM Migration Planner",
        description: "Sequence the path.",
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
    title: "Plan the migration path",
    body: "Use the CRM Migration Planner to turn inventory, cleaning, mapping, pilot, and cutover into a sequenced plan with owners — without invented timelines or rankings.",
    href: "/tools/crm-migration-planner/",
    ctaLabel: "Open Migration Planner →",
    variant: "generic",
  },
];

export const crmDataMigrationGuide: GuidePage = {
  id: "guide-crm-data-migration",
  slug: "crm-data-migration",
  title: "CRM Data Migration: Inventory, Pilot & Cutover",
  summary:
    "Migrate CRM data with inventory, cleaning, field mapping, pilot import, validation, freeze-window cutover, and hygiene — without big-bang surprises.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "migration",
  journeyStage: "implement",
  knowledgeAreaSlug: "migration",
  heroVisual: {
    src: "/guides/crm-data-migration-hero.png",
    alt: "CRM data migration hero: six-stage path inventory, clean, map, pilot migrate, validate, and cutover with UI mock panels.",
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
    "crm-implementation",
    "crm-data-cleaning",
    "crm-field-mapping",
    "crm-implementation-roles",
    "crm-implementation-mistakes",
    "crm-go-live",
    "crm-testing",
    "crm-data-quality",
  ],
  blocks: crmDataMigrationBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "inventory",
      label: "Inventory sources of truth",
      description: "Rank primary vs archive.",
      order: 0,
    },
    {
      id: "pilot",
      label: "Pass a pilot sample import",
      description: "Ops + frontline validation.",
      order: 1,
    },
    {
      id: "cutover",
      label: "Schedule freeze and hygiene",
      description: "Named owners for both.",
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
    title: "CRM Data Migration Guide: Pilot & Cutover | SoftwareGlimpse",
    description:
      "How to migrate CRM data: inventory sources, clean, map fields, pilot import, validate, freeze-window cutover, and hygiene — educational playbook.",
    canonicalPath: "/guides/crm-data-migration/",
    indexable: true,
  },
};
