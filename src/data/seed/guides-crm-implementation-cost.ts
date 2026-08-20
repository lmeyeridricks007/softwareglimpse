import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Implementation Cost — categories and decision rules, no invented totals.
 * Template: softwareglimpse-guide-template-v1
 */
const crmImplementationCostBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "CRM implementation cost is more than seats — it is qualifying subscription plus one-time change work (cleanup, migration, configuration, training) plus ongoing admin capacity and optional add-ons. Decision rule: never present a dollar “implementation total” without listing those categories with owners; quantify subscription via Cost/TCO calculators and keep services qualitative unless you have a real quote.",
    bullets: [
      "Subscription band",
      "Admin time",
      "Migration cleanup",
      "Training",
      "Add-ons",
      "No fake totals",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Time is a cost line",
        body: "Admin hours and seller learning show up as capacity, not invoices.",
      },
      {
        label: "One-time ≠ ongoing",
        body: "Separate migrate/configure/train from monthly seats and hygiene.",
      },
      {
        label: "Cheap seats, expensive sprawl",
        body: "Complex tools burn admin hours even on “affordable” tiers.",
      },
      {
        label: "Calculators beat invention",
        body: "Use Cost and TCO tools for researched bands — never invent totals.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "cost-path",
    title: "Implementation cost mapping path",
    steps: [
      { id: "sub", label: "Subscription", short: "Qualifying plan" },
      { id: "change", label: "Change", short: "Migrate & configure" },
      { id: "people", label: "People", short: "Admin & training" },
      { id: "addons", label: "Add-ons", short: "Optional later" },
      { id: "memo", label: "Memo", short: "Categories owned" },
    ],
    ctaHref: "/tools/crm-tco-calculator/",
    ctaLabel: "TCO Calculator →",
  },
  {
    type: "figure",
    id: "cost-buckets",
    title: "Implementation cost buckets",
    src: "/guides/crm-implementation-cost-map.png",
    alt: "CRM implementation cost teaching diagram: subscription band, one-time change costs (cleanup, migration, configure, train), ongoing admin capacity, and optional add-ons — with no invented dollar totals.",
    caption:
      "List buckets with owners first — quantify only with calculators or real quotes.",
  },
  {
    type: "feature-matrix",
    id: "cost-category-matrix",
    title: "Which cost categories you must list",
    rows: [
      {
        feature: "Qualifying subscription (seats × plan with must-haves)",
        mustHave: true,
        niceToHave: false,
        notes: "Use Cost Calculator — not homepage “from” tiles.",
      },
      {
        feature: "Admin / RevOps hours during rollout",
        mustHave: true,
        niceToHave: false,
        notes: "Calendar capacity, not heroic nights.",
      },
      {
        feature: "Data cleanup and migration effort",
        mustHave: true,
        niceToHave: false,
        notes: "One-time; variance is high — keep qualitative without quotes.",
      },
      {
        feature: "Training and enablement time",
        mustHave: true,
        niceToHave: false,
        notes: "Pilot huddles + manager coaching time.",
      },
      {
        feature: "Paid add-ons / support tiers",
        mustHave: false,
        niceToHave: true,
        notes: "Confirm in writing; defer until must-have proven.",
      },
      {
        feature: "External implementer / partner fees",
        mustHave: false,
        niceToHave: true,
        notes: "Only with a real quote — never invent vendor fees.",
      },
      {
        feature: "Single invented “total implementation cost”",
        mustHave: false,
        niceToHave: false,
        notes: "Reject — categories + owners only without quotes.",
      },
    ],
  },
  {
    type: "checklist",
    id: "cost-memo-checklist",
    title: "Sponsor cost memo checklist",
    copyable: true,
    items: [
      {
        id: "qualifying-plan",
        label: "Qualifying plan identified",
        description: "Must-haves mapped to a plan tier — then Calculator band.",
        order: 0,
      },
      {
        id: "admin-hours",
        label: "Admin hours/week named",
        description: "Owner + protected calendar time for rollout.",
        order: 1,
      },
      {
        id: "change-work",
        label: "Change-work categories listed",
        description: "Cleanup, migration, configure, train — owners each.",
        order: 2,
      },
      {
        id: "addons-parked",
        label: "Optional add-ons parked",
        description: "Not on critical path or day-zero budget pressure.",
        order: 3,
      },
      {
        id: "no-fake-total",
        label: "No invented dollar total in the memo",
        description: "Link Cost/TCO calculators; attach real quotes only.",
        order: 4,
      },
      {
        id: "ongoing-vs-one-time",
        label: "One-time vs ongoing separated",
        description: "Sponsor sees both horizons.",
        order: 5,
      },
    ],
  },
  {
    type: "step",
    id: "map-subscription",
    stepNumber: 1,
    heading: "Map qualifying subscription before seat-shopping",
    body: "List must-have capabilities, map them to the plan tier that actually includes them, then estimate with the Cost Calculator. Comparing homepage starting prices is not an implementation cost model.\n\nExample: Harbor Desk, an 8-person boutique agency (3 sellers, 3 delivery, founder, ops), needs email sync, multiple pipelines, and shared reporting. Ops lead Riley maps those must-haves to the qualifying plan, runs the Cost Calculator for the seat mix, and refuses to “save money” on a tier that lacks reporting the Monday review requires.",
    tip: "A low seat band on the wrong tier is deferred upgrade cost — not savings.",
    figure: {
      src: "/guides/crm-implementation-cost-hero.png",
      alt: "CRM implementation cost hero: SaaS cost workspace showing category buckets for subscription, change work, admin time, and add-ons without dollar totals.",
      caption:
        "Teach categories and owners — never a fake grand-total badge.",
    },
    scenarios: [
      {
        title: "Plan gates",
        body: "Must-haves live on mid/upper tiers — confirm before comparing.",
      },
      {
        title: "Seat mix",
        body: "Count who needs login vs view-only carefully.",
      },
      {
        title: "Annual vs monthly",
        body: "Note flexibility vs discount — still not “total cost.”",
      },
    ],
  },
  {
    type: "step",
    id: "list-change-costs",
    stepNumber: 2,
    heading: "List one-time change costs with owners",
    body: "Capture cleanup, field mapping, import/test/cutover, initial configuration, and pilot training as separate lines. Prefer effort descriptions (who, roughly how long) over invented dollars. Use the Migration Planner when history moves from another system.\n\nExample: Harbor Desk lists: Riley ~1 week equivalent for configure + dedupe; two half-day pilot huddles for sellers; founder Sam reviews stage definitions in two sessions. They attach no partner fee because they have no quote — and they do not invent one.",
    tip: "If a change line has no owner, it will still consume someone’s week — name them.",
    scenarios: [
      {
        title: "Spreadsheet exit",
        body: "Cleanup + import dominate; archive stays parallel.",
      },
      {
        title: "Tool-to-tool",
        body: "Mapping + test cutover; validate before go-live.",
      },
      {
        title: "Greenfield",
        body: "Lower migrate cost; still budget training and admin.",
      },
    ],
  },
  {
    type: "step",
    id: "price-admin-capacity",
    stepNumber: 3,
    heading: "Put admin capacity on the memo as ongoing cost",
    body: "Implementation does not end at go-live — fields, users, duplicates, and permission exceptions need weekly hours. Write the ongoing band (even if qualitative) so sponsors do not treat CRM as “set and forget.”\n\nExample: Harbor Desk protects ~2–3 hours/week for Riley after expand. When a seller asks for five vanity fields, Riley’s triage rule is: no owner who will keep it accurate → reject. That capacity line is treated as real cost in the sponsor memo beside subscription.",
    tip: "Enterprise-shaped configuration without admin hours becomes spreadsheet cost in disguise.",
    scenarios: [
      {
        title: "Part-time ops",
        body: "Widen timeline bands; keep scope minimal.",
      },
      {
        title: "Shared admin",
        body: "Document hours so other projects cannot silently steal them.",
      },
      {
        title: "No admin",
        body: "No-go for complex tools — fix capacity first.",
      },
    ],
  },
  {
    type: "step",
    id: "park-addons",
    stepNumber: 4,
    heading: "Park add-ons and partner fees until evidence exists",
    body: "Marketplace apps, AI packs, premium support, and external implementers can be useful — they are optional until the core loop is trusted. Only put numbers on the memo when you have written quotes; otherwise list as “optional / TBD quote.”\n\nExample: Harbor Desk parks a dialer and an AI writing add-on until two clean Monday reviews. A boutique implementer’s proposal is attached as a quote appendix — SoftwareGlimpse content never invents that fee. Light automation (missing next-step reminder) is built in-product after hygiene holds.",
    tip: "Buying add-ons to “force adoption” usually buys task spam.",
    scenarios: [
      {
        title: "Defer",
        body: "Nice-to-have apps after expand.",
      },
      {
        title: "Quote-backed",
        body: "Partner scope in writing; compare to in-house admin hours.",
      },
      {
        title: "Reject",
        body: "Add-ons that duplicate unfinished core-loop work.",
      },
    ],
  },
  {
    type: "step",
    id: "write-sponsor-memo",
    stepNumber: 5,
    heading: "Write the sponsor memo without fake totals",
    body: "Structure: qualifying subscription (Calculator link), one-time change lines with owners, ongoing admin capacity, optional/TBD quotes, and risks (dirty data, missing hours). Link TCO Calculator for ownership categories. Explicitly state what is not included.\n\nExample: Sam receives a one-page Harbor Desk memo: Calculator band for qualifying seats; Riley’s change-work and ongoing hours; training huddles; parked add-ons; Migration Planner note that archive import is out of pilot scope. No single “implementation will cost $X” claim appears — because they refuse to invent one.",
    tip: "If leadership demands a single number, give a range of categories plus quotes — not a fabricated sum.",
    scenarios: [
      {
        title: "Approve",
        body: "Categories owned; hours protected; Calculator attached.",
      },
      {
        title: "Conditional",
        body: "Need quote for partner or plan confirmation in writing.",
      },
      {
        title: "Rework",
        body: "Seat tile used instead of qualifying plan — rebuild memo.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Implementation cost mistakes",
    items: [
      {
        title: "Using homepage “from” prices as implementation cost",
        body: "Must-haves often live on another tier.",
      },
      {
        title: "Ignoring admin time",
        body: "The CRM “fails” when nobody has hours to keep it honest.",
      },
      {
        title: "Inventing partner or total dollar figures",
        body: "Editorial content and memos should not fabricate fees.",
      },
      {
        title: "Budgeting add-ons on day zero",
        body: "You pay for complexity before trust exists.",
      },
      {
        title: "Mixing one-time and ongoing in one blob",
        body: "Sponsors cannot see what stops after pilot.",
      },
      {
        title: "Skipping migration effort because “we’ll just import”",
        body: "Cleanup is the expensive part — plan it as a category.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How much does CRM implementation cost?",
        answer:
          "There is no universal dollar answer. List categories — qualifying subscription, admin time, migration/cleanup, training, add-ons, optional partner quotes — and quantify only with calculators or real quotes. Decision rule: reject any single invented total.",
      },
      {
        question: "What is the difference between Cost Calculator and TCO Calculator?",
        answer:
          "Cost Calculator focuses on researched subscription/plan bands. TCO Calculator helps structure broader ownership categories (time, change, risk). Use both; neither invents a full services bill for you.",
      },
      {
        question: "Should we hire an implementation partner?",
        answer:
          "Only when internal admin capacity or migration complexity exceeds what you can protect on the calendar. Compare a real quote to in-house hours — do not invent partner fees in planning docs.",
      },
      {
        question: "How do we cost admin time without payroll math?",
        answer:
          "At minimum state hours/week and whose capacity. Advanced finance teams may translate hours internally; SoftwareGlimpse guides keep that qualitative unless you supply your own figures.",
      },
      {
        question: "Are training costs one-time or ongoing?",
        answer:
          "Pilot enablement is mostly one-time; coaching and new-hire onboarding are ongoing. Separate them on the memo so expand waves are visible.",
      },
      {
        question: "How does cost relate to timeline?",
        answer:
          "Thin admin capacity widens week ranges. Dirty data increases one-time change cost and slips gates. See the Timeline guide for sequencing; do not buy speed by skipping hygiene.",
      },
      {
        question: "What should I do next?",
        answer:
          "Run the Cost Calculator for qualifying seats, structure categories in the TCO Calculator, and keep the Implementation Planner aligned to what you can actually staff.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related cost resources",
    links: [
      {
        href: "/guides/crm-implementation/",
        label: "CRM implementation guide",
        description: "Journey pillar for rollout.",
      },
      {
        href: "/guides/crm-implementation-planning/",
        label: "Plan CRM implementation",
        description: "Artifacts before spending.",
      },
      {
        href: "/guides/crm-implementation-timeline/",
        label: "Implementation timeline",
        description: "Ranges that absorb cost risk.",
      },
      {
        href: "/guides/crm-total-cost-guide/",
        label: "CRM total cost guide",
        description: "Ownership beyond seats.",
      },
      {
        href: "/guides/crm-pricing-guide/",
        label: "CRM pricing guide",
        description: "Plan gates and pricing patterns.",
      },
      {
        href: "/guides/crm-data-migration/",
        label: "CRM data migration",
        description: "Change-work that dominates variance.",
      },
      {
        href: "/tools/crm-cost-calculator/",
        label: "CRM Cost Calculator",
        description: "Qualifying subscription bands.",
      },
      {
        href: "/tools/crm-tco-calculator/",
        label: "CRM TCO Calculator",
        description: "Broader ownership categories.",
      },
      {
        href: "/tools/crm-implementation-planner/",
        label: "CRM Implementation Planner",
        description: "Staff phases you can afford.",
      },
      {
        href: "/tools/crm-migration-planner/",
        label: "CRM Migration Planner",
        description: "Scope change-work honestly.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist before costing finalists.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "tco-cta",
    title: "Map categories before you invent a total",
    body: "Use the CRM TCO Calculator and Cost Calculator to structure subscription and ownership categories — then staff the Implementation Planner with hours you can actually protect.",
    href: "/tools/crm-tco-calculator/",
    ctaLabel: "Open TCO Calculator →",
    variant: "finder",
  },
];

export const crmImplementationCostGuide: GuidePage = {
  id: "guide-crm-implementation-cost",
  slug: "crm-implementation-cost",
  title: "CRM Implementation Cost: Categories & Decision Rules",
  summary:
    "Estimate CRM implementation cost as categories — qualifying subscription, change work, admin capacity, training, and optional add-ons — without inventing dollar totals.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "implementation",
  journeyStage: "implement",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/crm-implementation-cost-hero.png",
    alt: "CRM implementation cost hero: SaaS cost workspace showing category buckets for subscription, change work, admin time, and add-ons without dollar totals.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:tool:crm-tco-calculator",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:tool:crm-cost-calculator",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:tool:crm-implementation-planner",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:tool:crm-tco-calculator",
    label: "Map TCO categories",
  },
  relatedGuideSlugs: [
    "crm-implementation",
    "crm-implementation-planning",
    "crm-implementation-timeline",
    "crm-total-cost-guide",
    "crm-pricing-guide",
    "crm-data-migration",
    "crm-implementation-roles",
    "crm-business-case",
  ],
  blocks: crmImplementationCostBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "qualifying-sub",
      label: "Map must-haves → qualifying plan → Calculator",
      description: "No homepage “from” price as the model.",
      order: 0,
    },
    {
      id: "change-admin",
      label: "List change-work and admin hours with owners",
      description: "One-time vs ongoing separated.",
      order: 1,
    },
    {
      id: "memo",
      label: "Ship sponsor memo without invented totals",
      description: "Link calculators; attach real quotes only.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T10:45:00.000Z",
    publishedAt: "2026-08-14T10:45:00.000Z",
    reviewedAt: "2026-08-14T10:45:00.000Z",
    researchStatus: "complete",
    seoStatus: "optimized",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title:
      "CRM Implementation Cost: Categories & Decision Rules | SoftwareGlimpse",
    description:
      "CRM implementation cost as categories — subscription, change work, admin time, training, add-ons — with calculators, not invented dollar totals.",
    canonicalPath: "/guides/crm-implementation-cost/",
    indexable: true,
  },
};
