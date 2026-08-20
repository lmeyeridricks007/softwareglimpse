import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Implementation Mistakes — failure modes with fix artifacts.
 * Template: softwareglimpse-guide-template-v1
 * Educational / operational — no invented rankings, dollar totals, or timelines.
 */
const crmImplementationMistakesBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "The highest-cost CRM implementation mistakes are big-bang cutover, migrating dirty data, over-customizing on day one, skipping training, leaving admin ownership empty, and skipping a pilot. Decision rule: if any of those six gaps is still open, pause expansion — fix the matching artifact first (pilot plan, clean+map sheet, core-loop list, role training agenda, named admin RACI, written pilot exit criteria).",
    bullets: [
      "Big-bang",
      "Dirty migrate",
      "Over-customize",
      "No training",
      "No admin",
      "Skip pilot",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Mistakes are missing artifacts",
        body: "Each failure maps to a concrete fix — not “try harder.”",
      },
      {
        label: "Pilot is a risk control",
        body: "A bounded segment lets you repair the loop before firm-wide pain.",
      },
      {
        label: "Dirty data multiplies",
        body: "Imports amplify duplicates, empty owners, and stage fiction.",
      },
      {
        label: "Automation without hygiene trains ignore",
        body: "Task spam on bad stages teaches people to leave the CRM.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "mistake-catch",
    title: "Catch mistakes before go-live",
    steps: [
      { id: "pilot", label: "Pilot", short: "Bounded segment" },
      { id: "clean", label: "Clean", short: "Before import" },
      { id: "core", label: "Core loop", short: "Defer custom" },
      { id: "admin", label: "Admin", short: "Named + hours" },
      { id: "train", label: "Train", short: "On real records" },
    ],
    ctaHref: "/tools/crm-implementation-planner/",
    ctaLabel: "Implementation Planner →",
  },
  {
    type: "figure",
    id: "mistakes-map",
    title: "Six mistakes → six fix artifacts",
    src: "/guides/crm-implementation-mistakes-map.png",
    alt: "Six CRM implementation mistake cards paired with fix artifacts: pilot plan, clean and map sheet, core loop list, training agenda, RACI admin owner, pilot exit criteria.",
    caption:
      "Each common failure maps to a concrete artifact — pause expansion until the matching fix exists.",
  },
  {
    type: "feature-matrix",
    id: "gate-musts",
    title: "Go-live gates: must vs defer",
    rows: [
      {
        feature: "Written pilot segment + exit criteria",
        mustHave: true,
        niceToHave: false,
        notes: "Before firm-wide invites",
      },
      {
        feature: "Clean + field map before full import",
        mustHave: true,
        niceToHave: false,
        notes: "See migration & cleaning guides",
      },
      {
        feature: "Named admin with hours",
        mustHave: true,
        niceToHave: false,
        notes: "Roles guide RACI",
      },
      {
        feature: "Role-based training on real records",
        mustHave: true,
        niceToHave: false,
        notes: "Not vendor webinar alone",
      },
      {
        feature: "Marketplace apps on day one",
        mustHave: false,
        niceToHave: true,
        notes: "Defer until hygiene holds",
      },
      {
        feature: "Complex multi-branch automation",
        mustHave: false,
        niceToHave: true,
        notes: "After two clean Fridays",
      },
    ],
  },
  {
    type: "checklist",
    id: "pre-expand-checklist",
    title: "Before you expand seats",
    copyable: true,
    items: [
      {
        id: "pilot-passed",
        label: "Pilot exit criteria passed",
        description: "Weekly review from the board without a side sheet.",
        order: 0,
      },
      {
        id: "data-clean",
        label: "Open items have owners + next steps",
        description: "No knowingly dirty full import.",
        order: 1,
      },
      {
        id: "core-only",
        label: "Core loop only in production config",
        description: "Custom fields and apps deferred with a triage owner.",
        order: 2,
      },
      {
        id: "admin-live",
        label: "Admin RACI live with hours",
        description: "Fields, merges, permissions have a Responsible name.",
        order: 3,
      },
      {
        id: "training-done",
        label: "Pilot cohort trained on real records",
        description: "Role agendas complete; questions logged.",
        order: 4,
      },
      {
        id: "no-big-bang",
        label: "Cutover is phased or freeze-windowed",
        description: "Not “everyone Monday with every historical field.”",
        order: 5,
      },
    ],
  },
  {
    type: "step",
    id: "big-bang-and-pilot",
    stepNumber: 1,
    heading: "Big-bang cutover and skipping the pilot",
    body: "Big-bang invites every team and every historical record on the same Monday. Skipping the pilot is the same risk in a quieter outfit: you never prove the core loop on a bounded segment. Fix artifacts: a written pilot plan (who, which records, success criteria) and an exit gate before expansion.\n\nExample: Northfield Advisory, a 22-person B2B services firm, almost flipped all sellers into a new CRM overnight. Ops paused, piloted one pod (six people, open opportunities only), and required two consecutive Friday reviews from the board. Mapping bugs and empty next steps surfaced in the pilot — not across twenty-two inboxes at once.",
    tip: "“Everyone is in” is a communication goal, not a pilot exit criterion.",
    figure: {
      src: "/guides/crm-implementation-mistakes-hero.png",
      alt: "CRM implementation mistakes hero: gated rollout path with warning pins and fix-artifact badges for six common failures.",
      caption:
        "Pause at open gates — expansion is not a substitute for pilot proof.",
    },
    scenarios: [
      {
        title: "Big-bang cutover",
        body: "Fix: freeze window + phased seats after pilot pass.",
      },
      {
        title: "Skip pilot",
        body: "Fix: one pod/territory with written exit criteria.",
      },
      {
        title: "Pilot theater",
        body: "Fix: success = trusted Friday board, not feature checklist.",
      },
    ],
  },
  {
    type: "step",
    id: "dirty-and-custom",
    stepNumber: 2,
    heading: "Migrating dirty data and over-customizing day one",
    body: "Importing duplicates, blank owners, and fictional stages teaches distrust on day one. Over-customizing — dozens of unused fields, marketplace apps, and branching automations before anyone sells — hides the core loop. Fix artifacts: a clean+map sheet (see Data Cleaning and Field Mapping) and a one-page “core loop only” list of fields and stages allowed in pilot.\n\nExample: Northfield’s first export had three contact rows per client and stages nobody could define. They ran a cleaning week (dedupe, owner, next step), collapsed stages to five honest ones, and banned new custom fields without admin triage. Only then did the Migration Planner cutover sequence get a date.",
    tip: "If a field has no Responsible updater, it does not belong in the pilot schema.",
    scenarios: [
      {
        title: "Dirty migrate",
        body: "Fix: clean → map → pilot import → validate → cutover.",
      },
      {
        title: "Day-1 customization",
        body: "Fix: core loop list; triage queue for field requests.",
      },
      {
        title: "Automate early",
        body: "Fix: hygiene first; light alerts only after clean Fridays.",
      },
    ],
  },
  {
    type: "step",
    id: "people-gaps",
    stepNumber: 3,
    heading: "No training and no admin owner",
    body: "A vendor webinar is not role training. An empty admin seat means field sprawl, unresolved duplicates, and permission drift — regardless of product quality. Fix artifacts: role agendas on real pilot records, and a named admin with qualitative hours on the calendar (see Implementation Roles).\n\nExample: Northfield’s first week failed because AEs never practiced updating next steps on their own deals. Change lead Sam ran 45-minute role sessions on the pilot board; admin Devon owned merges twice weekly. Adoption recovered when people knew which buttons mattered for Friday review — not when more apps were installed.",
    tip: "Training without an admin owner just teaches people a system that will rot.",
    scenarios: [
      {
        title: "No training",
        body: "Fix: role agenda + practice on real open deals.",
      },
      {
        title: "Admin vacuum",
        body: "Fix: RACI + hours band before configure.",
      },
      {
        title: "Already live with gaps",
        body: "Fix: stabilize core loop; pause new fields/apps.",
      },
    ],
  },
  {
    type: "step",
    id: "recovery",
    stepNumber: 4,
    heading: "If you already shipped a mistake",
    body: "Do not silently add complexity hoping it cures process debt. Re-open the missing artifact: shrink to a recovery pilot segment, clean open items, freeze custom field creation, name admin hours, and retrain on the records people actually touch.\n\nExample: eight weeks post go-live, Northfield still rebuilt pipeline in Sheets. They declared a two-week recovery: one pod “source of truth,” mandatory owner+next-step, admin triage only, no new automations. When that pod’s Fridays ran clean, they expanded the recovery pattern — treating the original big-bang as debt to repay, not as sunk cost to defend.",
    tip: "Marketplace apps rarely fix empty next steps or missing admin hours.",
    scenarios: [
      {
        title: "Early post-buy chaos",
        body: "Shrink scope; prove one pod; then re-expand.",
      },
      {
        title: "Dirty history already in",
        body: "Hygiene sprint on open items; archive inactive.",
      },
      {
        title: "Renewal looming",
        body: "Export test + admin RACI before you extend term.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "High-cost implementation mistakes",
    items: [
      {
        title: "Big-bang cutover",
        body: "Every team and every historical field on day one — fix with pilot + freeze window.",
      },
      {
        title: "Migrating dirty data",
        body: "Duplicates and empty owners become institutional truth — fix with clean+map.",
      },
      {
        title: "Over-customizing day one",
        body: "Unused fields and apps hide the core loop — fix with a core-loop list.",
      },
      {
        title: "No role training",
        body: "Generic tours do not create Friday discipline — fix with real-record agendas.",
      },
      {
        title: "No admin owner",
        body: "Hygiene and permissions drift — fix with named RACI hours.",
      },
      {
        title: "Skipping the pilot",
        body: "You learn mapping bugs firm-wide — fix with bounded exit criteria.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is the biggest CRM implementation mistake?",
        answer:
          "Usually big-bang go-live without a pilot that proves the core loop. Decision rule: do not expand seats until a bounded segment runs weekly review from the CRM board without a side spreadsheet.",
      },
      {
        question: "Should we migrate all historical data on day one?",
        answer:
          "No. Clean and map first; pilot import a sample; migrate what open work needs to trust. Archive inactive history instead of importing years of unowned notes. See the Data Migration and Data Cleaning guides.",
      },
      {
        question: "How much customization is safe at launch?",
        answer:
          "Only the core loop: people, accounts/contacts, honest stages, owner + next step, and email/calendar sync you already use. Defer marketplace apps and complex automation until hygiene holds.",
      },
      {
        question: "We already went live poorly — now what?",
        answer:
          "Treat it as recovery: shrink to a pilot pod, clean open items, freeze new fields, name an admin, retrain on real records, then re-expand on evidence.",
      },
      {
        question: "How do roles relate to these mistakes?",
        answer:
          "Admin vacuum and missing change ownership cause several of them. Use the Implementation Roles guide to name RACI seats and hours before you re-plan phases.",
      },
      {
        question: "What should I do next?",
        answer:
          "Walk the pre-expand checklist, fix any open artifacts, then sequence work in the CRM Implementation Planner. Use Migration Planner when data movement is the risk.",
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
        href: "/guides/crm-implementation-roles/",
        label: "Implementation roles",
        description: "RACI and hours bands.",
      },
      {
        href: "/guides/crm-data-migration/",
        label: "CRM data migration",
        description: "Avoid dirty big-bang imports.",
      },
      {
        href: "/guides/crm-data-cleaning/",
        label: "Clean CRM data",
        description: "Hygiene before migrate.",
      },
      {
        href: "/guides/crm-training/",
        label: "CRM training guide",
        description: "Role agendas on real records.",
      },
      {
        href: "/guides/crm-go-live/",
        label: "CRM go-live guide",
        description: "Freeze window and launch.",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "CRM Implementation Planner",
        description: "Phase plan with gates.",
      },
      {
        href: "/tools/crm-migration-planner/",
        label: "CRM Migration Planner",
        description: "When import is the risk.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "planner-cta",
    title: "Rebuild the rollout with gates",
    body: "If implementation went off-rails, rebuild phases and owners in the CRM Implementation Planner — then close each mistake with its fix artifact before you expand again.",
    href: "/tools/crm-implementation-planner/",
    ctaLabel: "Open Implementation Planner →",
    variant: "generic",
  },
];

export const crmImplementationMistakesGuide: GuidePage = {
  id: "guide-crm-implementation-mistakes",
  slug: "crm-implementation-mistakes",
  title: "CRM Implementation Mistakes: Fixes Before You Expand",
  summary:
    "The highest-cost CRM implementation mistakes — big-bang cutover, dirty migration, day-one over-customization, no training, no admin, skipped pilot — each with a concrete fix artifact.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "implementation",
  journeyStage: "implement",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/crm-implementation-mistakes-hero.png",
    alt: "CRM implementation mistakes hero: gated rollout path with warning pins and fix-artifact badges for six common failures.",
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
    "crm-implementation-roles",
    "crm-data-migration",
    "crm-data-cleaning",
    "crm-training",
    "crm-go-live",
    "crm-adoption",
    "common-crm-mistakes",
  ],
  blocks: crmImplementationMistakesBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "pilot-gate",
      label: "Confirm pilot exit criteria exist",
      description: "Bounded segment; trusted Friday board.",
      order: 0,
    },
    {
      id: "clean-gate",
      label: "Confirm clean+map before full import",
      description: "No knowingly dirty cutover.",
      order: 1,
    },
    {
      id: "admin-train",
      label: "Confirm admin + training artifacts",
      description: "RACI hours and role agendas.",
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
      "CRM Implementation Mistakes & Fix Artifacts | SoftwareGlimpse",
    description:
      "Avoid CRM implementation mistakes: big-bang cutover, dirty data, over-customizing, no training, no admin, skipped pilot — each with a concrete fix.",
    canonicalPath: "/guides/crm-implementation-mistakes/",
    indexable: true,
  },
};
