import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Financial Services CRM Migration — inventory → map → pilot → cutover → hygiene.
 * Template: softwareglimpse-guide-template-v1
 * Educational / operational only — no invented timelines, prices, or rankings.
 */
const financialServicesCrmMigrationBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Migrate a financial-services CRM by inventorying sources of truth, mapping fields and ownership, proving a pilot import, cutting over with a freeze window, then running hygiene until the board is trusted. Decision rule: do not firm-wide cutover until a pilot book shows correct owners, household links, and stages — and until you know how to roll back or re-import if the sample fails.",
    bullets: [
      "Inventory sources",
      "Map fields",
      "Pilot import",
      "Cutover window",
      "Hygiene week",
      "Access preserved",
    ],
  },
  {
    type: "decision-framework",
    id: "migration-path",
    title: "Migration path",
    steps: [
      { id: "inventory", label: "Inventory", short: "Sources of truth" },
      { id: "map", label: "Map", short: "Fields & owners" },
      { id: "pilot", label: "Pilot", short: "Sample book" },
      { id: "cutover", label: "Cutover", short: "Freeze & switch" },
      { id: "hygiene", label: "Hygiene", short: "Trust the board" },
    ],
    ctaHref: "/guides/financial-services-crm-implementation/",
    ctaLabel: "Implementation guide →",
  },
  {
    type: "figure",
    id: "cutover-visual",
    title: "Cutover sequence",
    src: "/guides/financial-services-crm-migration-cutover.png",
    alt: "Financial-services CRM migration cutover timeline: freeze legacy edits, final export, import, validate owners and households, open the new CRM, then hygiene.",
    caption:
      "Cutover is a short controlled sequence — not a weekend dump of every spreadsheet tab.",
  },
  {
    type: "checklist",
    id: "migration-ready",
    title: "Migration readiness checklist",
    copyable: true,
    items: [
      {
        id: "sources",
        label: "Sources of truth named",
        description: "Legacy CRM, sheets, inbox folders, portfolio tools — ranked.",
        order: 0,
      },
      {
        id: "field-map",
        label: "Field and owner map approved",
        description: "Including household/account links and stage mapping.",
        order: 1,
      },
      {
        id: "pilot-pass",
        label: "Pilot import passed",
        description: "Sample book validated by advisors and ops.",
        order: 2,
      },
      {
        id: "roles",
        label: "Roles ready before invites",
        description: "Do not widen access during import chaos.",
        order: 3,
      },
      {
        id: "freeze",
        label: "Freeze window scheduled",
        description: "Team knows when legacy edits stop.",
        order: 4,
      },
      {
        id: "hygiene-owner",
        label: "Hygiene owner named",
        description: "Duplicates, missing next steps, orphan contacts.",
        order: 5,
      },
    ],
  },
  {
    type: "step",
    id: "inventory",
    stepNumber: 1,
    heading: "Inventory every source of client truth",
    body: "List where client identity, history, and opportunity state actually live today: legacy CRM, shared sheets, advisor notebooks, email folders, and any portfolio or planning tools that staff still open for context. Rank each source as system of record, secondary, or archive-only. Decide what will not migrate.\n\nExample: a 9-person wealth team inventories Salesforce Essentials for contacts/deals, a household Google Sheet for family links, and Outlook folders for “active proposal” threads. They keep the CRM and sheet as migration inputs and treat Outlook as reference only — notes get summarized into CRM fields rather than importing ten years of email.",
    tip: "If two sources disagree on owner or stage, resolve the rule before mapping — imports amplify conflict.",
    figure: {
      src: "/guides/financial-services-crm-migration-hero.png",
      alt: "Financial services CRM migration hero: inventory, field map, pilot import, cutover, and hygiene as a five-stage path.",
      caption:
        "Migration succeeds when inventory and mapping are honest before the first full import.",
    },
    scenarios: [
      {
        title: "Primary CRM",
        body: "Contacts, accounts, open opportunities.",
      },
      {
        title: "Relationship sheet",
        body: "Household links often hide outside the CRM.",
      },
      {
        title: "Archive",
        body: "Old closed deals may stay export-only.",
      },
    ],
  },
  {
    type: "step",
    id: "map-fields",
    stepNumber: 2,
    heading: "Map fields, stages, and ownership",
    body: "Build a field map: source field → destination field → transform rule → owner of the rule. Explicitly map account/household links, contact roles, open vs closed stages, and required day-one fields (owner, next step). Drop vanity fields that no one updates.\n\nExample: the wealth team maps Sheet “Household ID” to Account external ID, maps “Primary advisor” to Owner, collapses five informal stages into Discovery / Proposal / Commitment / Closed-won / Closed-lost, and requires Next step on every open opportunity before cutover.",
    tip: "Map a reject list too — fields you will not bring over — so importers stop inventing destinations.",
    scenarios: [
      {
        title: "Identity keys",
        body: "Stable external IDs beat fuzzy name matching alone.",
      },
      {
        title: "Stage honesty",
        body: "Merge stages that staff cannot define consistently.",
      },
      {
        title: "Owner rule",
        body: "One named owner per open opportunity on day one.",
      },
    ],
  },
  {
    type: "step",
    id: "pilot-import",
    stepNumber: 3,
    heading: "Run a pilot import on a real book",
    body: "Import a bounded sample — one advisor’s book or one region — into a sandbox or clean org. Validate household links, owners, open stages, and a handful of historical notes. Have the advisor and ops walk the records together. Fix the map before scaling.\n\nExample: they pilot 42 households for Advisor Maya. Three households split incorrectly because nicknames lacked external IDs; two open deals lacked next steps. They fix the map, re-import the pilot, and only then schedule firm cutover.",
    tip: "Pilot with the messiest book you have — clean samples hide mapping failures.",
    scenarios: [
      {
        title: "Link check",
        body: "Contacts sit under the correct household/account.",
      },
      {
        title: "Owner check",
        body: "Advisor sees only what the role model intends.",
      },
      {
        title: "Pipeline check",
        body: "Open deals match reality, not legacy stage names.",
      },
    ],
  },
  {
    type: "step",
    id: "cutover",
    stepNumber: 4,
    heading: "Cut over with a freeze window",
    body: "Announce when legacy edits stop, who runs the final export, and when the new CRM becomes the only place for new notes and stages. Keep the freeze short. Validate critical counts (accounts, open deals, users) before declaring success. Keep a rollback or re-import plan written down.\n\nExample: Friday 4pm freeze on the old CRM; ops exports; Saturday morning import and validation; Monday 8am advisors open only the new CRM. A printed runbook lists who to call if household counts diverge by more than a small tolerance.",
    tip: "Do not invite every contractor during cutover week — stabilize roles first.",
    scenarios: [
      {
        title: "Freeze",
        body: "No parallel truth in two systems past the cut line.",
      },
      {
        title: "Validate",
        body: "Counts and spot-check households before go-live email.",
      },
      {
        title: "Communicate",
        body: "Advisors know where to log Monday’s client touches.",
      },
    ],
  },
  {
    type: "step",
    id: "hygiene",
    stepNumber: 5,
    heading: "Run hygiene until the board is trusted",
    body: "After cutover, schedule a hygiene week: merge duplicates, fix orphan contacts, require next steps on open deals, and confirm leavers’ seats are gone. Hold a short daily standup until advisors stop reconstructing status from email.\n\nExample: for ten business days the ops lead posts a hygiene board — duplicates remaining, deals missing next step, households without primary contact. By day ten Maya’s team runs Friday pipeline review from the CRM board alone.",
    tip: "Migration is not done at import success — it is done when weekly review no longer rebuilds reality elsewhere.",
    scenarios: [
      {
        title: "Duplicates",
        body: "Merge aggressively with a named approver.",
      },
      {
        title: "Next steps",
        body: "Empty next-step fields are migration debt.",
      },
      {
        title: "Access revisit",
        body: "Re-check roles after bulk user invites.",
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
        body: "Field-map bugs multiply across every household at once.",
      },
      {
        title: "Migrating every historical field “just in case”",
        body: "Dead fields create distrust; archive what you rarely use.",
      },
      {
        title: "Running two systems without a freeze",
        body: "Parallel edits guarantee the new CRM is wrong by Monday.",
      },
      {
        title: "Ignoring permissions during import",
        body: "Wide-open seats during cutover become the lasting access model.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How long does a financial-services CRM migration take?",
        answer:
          "Duration depends on data quality, household complexity, and team size — not a universal calendar. Plan inventory and mapping before setting a cutover date; many SMB teams need a pilot week plus a short freeze, then a hygiene period. Treat published “migrate in a weekend” claims skeptically until your pilot passes.",
      },
      {
        question: "Should we migrate closed history?",
        answer:
          "Migrate enough history for advisors to serve clients without hunting archives. Deep closed-deal archaeology can stay in an export archive if it slows cutover and nobody uses it weekly.",
      },
      {
        question: "What if the legacy CRM and our household sheet disagree?",
        answer:
          "Pick a winning rule before import (for example, sheet wins for household membership; CRM wins for open deal stage). Document the rule on the field map so importers do not invent fixes mid-flight.",
      },
      {
        question: "How do we keep security intact during migration?",
        answer:
          "Stand up roles before mass invites, limit who can export during cutover, and run an access review right after user load. See the FS CRM security guide for the access-map pattern.",
      },
      {
        question: "What should we do after cutover?",
        answer:
          "Follow the implementation guide’s hygiene and expand loop: trust the board, then add automation. Use the buyer checklist only if you are still evaluating — migration assumes a chosen system.",
      },
    ],
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
        description: "Workflows you are migrating into.",
      },
      {
        href: "/guides/financial-services-crm-implementation/",
        label: "FS CRM implementation",
        description: "Pilot and expand after cutover.",
      },
      {
        href: "/guides/financial-services-crm-security/",
        label: "FS CRM security",
        description: "Roles during and after import.",
      },
      {
        href: "/guides/financial-services-crm-requirements/",
        label: "FS CRM requirements",
        description: "Must-haves that shape the field map.",
      },
      {
        href: "/guides/financial-services-crm-features/",
        label: "FS CRM features",
        description: "Capabilities to preserve in the new system.",
      },
      {
        href: "/guides/financial-services-crm-checklist/",
        label: "FS CRM buyer checklist",
        description: "If you are still choosing a destination.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist when destination is not final.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Still choosing where to migrate?",
    body: "If the destination CRM is not final, shortlist with CRM Finder using your inventory constraints — then return to this migration path once the pilot system is clear.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const financialServicesCrmMigrationGuide: GuidePage = {
  id: "guide-financial-services-crm-migration",
  slug: "financial-services-crm-migration",
  title: "Financial Services CRM Migration: Inventory, Pilot & Cutover",
  summary:
    "Migrate financial-services CRM data with an inventory, field map, pilot import, freeze-window cutover, and hygiene week — without big-bang surprises.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "migration",
  journeyStage: "switch",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/financial-services-crm-migration-hero.png",
    alt: "Financial services CRM migration hero: inventory, field map, pilot import, cutover, and hygiene as a five-stage path.",
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
    "financial-services-crm-checklist",
  ],
  blocks: financialServicesCrmMigrationBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "inventory",
      label: "Inventory sources of truth",
      description: "Rank primary vs archive.",
      order: 0,
    },
    {
      id: "pilot",
      label: "Pass a pilot book import",
      description: "Advisor + ops validation.",
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
    seoStatus: "optimized",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title:
      "Financial Services CRM Migration: Pilot & Cutover | SoftwareGlimpse",
    description:
      "How to migrate a financial-services CRM: inventory sources, map fields, pilot import, freeze-window cutover, and hygiene — educational playbook.",
    canonicalPath: "/guides/financial-services-crm-migration/",
    indexable: true,
  },
};
