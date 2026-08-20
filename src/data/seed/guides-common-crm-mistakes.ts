import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Common CRM mistakes — mistake → fix pairs (no invented ROI).
 * Template: softwareglimpse-guide-template-v1
 */
const commonCrmMistakesBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "The most common CRM mistakes are overbuying complexity, skipping ownership rules, migrating unclean data, treating the tool as set-and-forget, buying for AI hype, and ignoring change cost. Decision rule: if you cannot name owners, a clean import plan, and a weekly review ritual before go-live, fix the operating rules first — the vendor logo will not rescue a broken process.",
    bullets: [
      "Overbuying",
      "No ownership rules",
      "Unclean migration",
      "Set-and-forget",
      "AI hype buying",
      "Ignoring change cost",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Process mistakes beat product mistakes",
        body: "Most CRM failures are governance and adoption failures wearing a vendor logo.",
      },
      {
        label: "Fix pairs beat blame",
        body: "For every recurring failure mode, write the counter-behavior before you buy or re-implement.",
      },
      {
        label: "Complexity is not insurance",
        body: "Buying enterprise breadth “to grow into” often slows the pilot that would have created value.",
      },
      {
        label: "AI does not replace hygiene",
        body: "Models on top of missing owners and stale stages amplify noise — they do not create a system of record.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "avoid-path",
    title: "How to avoid CRM failure",
    steps: [
      { id: "job", label: "Job first", short: "Shape before brand" },
      { id: "owners", label: "Owners", short: "Update & decision rules" },
      { id: "clean", label: "Clean data", short: "Before migration" },
      { id: "pilot", label: "Pilot ritual", short: "Live weekly review" },
      { id: "core", label: "Core workflows", short: "Before AI extras" },
      { id: "change", label: "Change cost", short: "Training & dual-run" },
    ],
    ctaHref: "/guides/how-to-choose-crm/",
    ctaLabel: "How to choose a CRM →",
    figure: {
      src: "/guides/common-crm-mistakes-avoid-failure.png",
      alt: "How to avoid CRM failure path: job first, owners, clean data, pilot ritual, core workflows, then change cost.",
      caption:
        "Shape and owners before brand — then clean data, pilot ritual, core workflows, and budgeted change.",
    },
  },
  {
    type: "figure",
    id: "fixes-visual",
    title: "Mistake → fix map",
    src: "/guides/common-crm-mistakes-fixes.png",
    alt: "Six CRM mistake and fix pairs: overbuying, ownership, migration, set-and-forget, AI hype, and change cost.",
    caption: "Write the fix as an operating rule before you blame the vendor.",
  },
  {
    type: "step",
    id: "mistake-fix-pairs",
    stepNumber: 1,
    heading: "Mistake → fix pairs",
    body: "Use these pairs in kickoff docs and vendor evaluations. If a shortlist cannot support the fix side (simple ownership, clean import, usable weekly review), keep looking.\n\nExample: a 8-person professional-services firm imported three years of messy spreadsheet contacts without deduping, then enabled every automation on day one. Within a month, reps ignored the CRM and returned to personal sheets. The fix was not a new vendor — it was cleaning the import, naming stage owners, and running one weekly review in the board before turning automations back on.",
    tip: "Print the six fixes next to your pilot checklist — they are more predictive than feature matrices alone.",
    figure: {
      src: "/guides/common-crm-mistakes-hero.png",
      alt: "Educational overview of common CRM failure modes around overbuying, ownership, data, adoption, hype, and change cost.",
      caption: "Most expensive CRM problems are preventable operating mistakes.",
    },
    scenarios: [
      {
        title: "Overbuying → match shape to job",
        body: "Pick the simplest product shape that covers pipeline, owners, and history — expand later.",
      },
      {
        title: "No ownership rules → name them",
        body: "Who creates deals, who advances stages, who merges duplicates — written and enforced.",
      },
      {
        title: "Unclean migration → clean first",
        body: "Dedupe, archive dead rows, and map fields before bulk load — garbage in becomes permanent.",
      },
      {
        title: "Set-and-forget → weekly ritual",
        body: "Run pipeline reviews in the CRM; treat empty boards as a process incident.",
      },
      {
        title: "AI hype → core workflows first",
        body: "Validate logging, stages, and handoffs before scoring tools on demo-ware insights.",
      },
      {
        title: "Ignoring change cost → budget it",
        body: "Plan training, dual-running, and admin time; license price is not the full cost.",
      },
    ],
  },
  {
    type: "step",
    id: "early-warning",
    stepNumber: 2,
    heading: "Early warning signs after go-live",
    body: "Catch failure modes in the first review cycles while they are still cheap to reverse. Silence in the CRM is a louder signal than a glowing kickoff deck.\n\nExample: two weeks after go-live, that services firm’s manager still pasted a Google Sheet into the Monday meeting. That shadow-sheet warning meant adoption had already failed — they paused new fields and required the live board for the next four reviews before adding anything else.",
    tip: "If managers still rebuild spreadsheets for the weekly meeting, adoption has already failed — intervene before adding more fields.",
    figure: {
      src: "/guides/common-crm-mistakes-early-warnings.png",
      alt: "Early CRM warning signs after go-live: shadow sheets return, fields nobody updates, and admin bottleneck.",
      caption:
        "Silence in the CRM is louder than a glowing kickoff — intervene while reversal is still cheap.",
    },
    scenarios: [
      {
        title: "Shadow sheets return",
        body: "Teams keep personal trackers “just in case” — trust in the system of record is gone.",
      },
      {
        title: "Fields nobody updates",
        body: "Required fields piled on at launch create fake data or abandonment.",
      },
      {
        title: "Admin bottleneck",
        body: "One overloaded admin and no documented rules means every change becomes a ticket backlog.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "risk-checklist",
    title: "Risk checklist before you buy or re-implement",
    rows: [
      {
        feature: "Product shape matched to primary job",
        mustHave: true,
        niceToHave: false,
        notes: "Prevents overbuy",
      },
      {
        feature: "Written ownership & update rules",
        mustHave: true,
        niceToHave: false,
        notes: "Prevents ghost CRM",
      },
      {
        feature: "Data cleanup plan before migration",
        mustHave: true,
        niceToHave: false,
        notes: "Prevents dirty SoR",
      },
      {
        feature: "Weekly review uses the CRM",
        mustHave: true,
        niceToHave: false,
        notes: "Prevents set-and-forget",
      },
      {
        feature: "AI features as day-one must-have",
        mustHave: false,
        niceToHave: true,
        notes: "Hype risk",
      },
      {
        feature: "Training & dual-run time budgeted",
        mustHave: true,
        niceToHave: false,
        notes: "Change cost",
      },
    ],
  },
  {
    type: "size-match",
    id: "mistakes-by-stage",
    title: "Mistakes that show up by stage",
    figure: {
      src: "/guides/common-crm-mistakes-by-stage.png",
      alt: "CRM mistakes by stage: selecting overbuy, migrating unclean imports, adopting no owners, optimizing AI before core.",
      caption:
        "Each stage has a dominant failure mode — match the fix to where you actually are.",
    },
    tiers: [
      {
        id: "selecting",
        label: "Selecting",
        description:
          "Overbuying and AI-led demos dominate — insist on job fit and admin capacity.",
        fitHints: ["Shape first", "How to choose"],
      },
      {
        id: "migrating",
        label: "Migrating",
        description:
          "Unclean imports and unclear field maps create lasting distrust.",
        fitHints: ["Dedupe", "Archive dead data"],
      },
      {
        id: "adopting",
        label: "Adopting",
        description:
          "No ownership rules and no weekly ritual turn the CRM into optional software.",
        fitHints: ["Owners", "Review ritual"],
      },
      {
        id: "optimizing",
        label: "Optimizing",
        description:
          "Ignoring change cost when adding modules or re-implementing burns goodwill.",
        fitHints: ["Training", "Phased expand"],
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "The six mistakes (summary)",
    items: [
      {
        title: "Overbuying",
        body: "Paying for suite or enterprise breadth the team cannot administer — fix by matching product shape to the primary job.",
      },
      {
        title: "No ownership rules",
        body: "Deals without clear creators and stage owners become abandoned — fix with written, enforced rules.",
      },
      {
        title: "Unclean migration",
        body: "Loading duplicates and dead leads trains the team to ignore the CRM — fix by cleaning before import.",
      },
      {
        title: "Set-and-forget",
        body: "Launch without a review ritual guarantees decay — fix with a CRM-native weekly pipeline meeting.",
      },
      {
        title: "Buying for AI hype",
        body: "Demo insights on empty or dirty data waste evaluation time — fix by validating core workflows first.",
      },
      {
        title: "Ignoring change cost",
        body: "Underestimating training and dual-running sinks adoption — fix by budgeting time and admin capacity.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is the most common CRM mistake?",
        answer:
          "Skipping ownership and update rules — without them, even a well-chosen product becomes an unused database. Closely related failures: overbuying complexity, unclean migrations, and treating launch as set-and-forget. Example: an 8-person firm imported dirty spreadsheet contacts and abandoned the CRM within a month until they cleaned data and named stage owners.",
      },
      {
        question: "Can we fix a failed CRM without switching vendors?",
        answer:
          "Often yes: clean data, simplify fields, reset ownership rules, and restart a live-deal pilot with a weekly review. Switch only if the product shape truly cannot support the job.",
      },
      {
        question: "Should AI features drive the CRM purchase?",
        answer:
          "No. Treat AI as a nice-to-have after contacts, deals, ownership, and activity history work reliably.",
      },
      {
        question: "What should I read next?",
        answer:
          "Use How to Choose a CRM for evaluation criteria, When to Adopt CRM for timing, and CRM Finder when you are ready to shortlist.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Buying framework that avoids overbuy.",
      },
      {
        href: "/guides/when-to-adopt-crm/",
        label: "When to adopt CRM",
        description: "Timing and pilot discipline.",
      },
      {
        href: "/guides/do-i-need-a-crm/",
        label: "Do I need a CRM?",
        description: "Confirm need before re-implementing.",
      },
      {
        href: "/guides/crm-selection-mistakes/",
        label: "CRM selection mistakes",
        description: "Buying-stage failures, before rollout.",
      },
      {
        href: "/guides/crm-requirements-guide/",
        label: "CRM requirements guide",
        description: "The sheet most failures skipped.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist from structured answers.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Must vs nice before you commit.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Choose with fewer failure modes",
    body: "After you lock ownership rules and job fit, CRM Finder helps you shortlist products that match — without affiliate-ordered rankings.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const commonCrmMistakesGuide: GuidePage = {
  id: "guide-common-crm-mistakes",
  slug: "common-crm-mistakes",
  title: "Common CRM Mistakes (and How to Fix Them)",
  summary:
    "Avoid the CRM failure patterns that waste adoption — overbuying, missing ownership rules, unclean migration, set-and-forget, AI hype, and ignored change cost — with practical mistake → fix pairs.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "fundamental",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/common-crm-mistakes-hero.png",
    alt: "Educational overview of common CRM failure modes around overbuying, ownership, data, adoption, hype, and change cost.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:crm-software",
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
    contentId: "content:tool:crm-finder",
    label: "Try the CRM Finder",
  },
  relatedGuideSlugs: [
    "crm-selection-mistakes",
    "how-to-choose-crm",
    "when-to-adopt-crm",
    "do-i-need-a-crm",
    "crm-requirements-guide",
    "crm-selection-process",
    "types-of-crm",
  ],
  blocks: commonCrmMistakesBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "ownership",
      label: "Write ownership rules",
      description: "Create, advance, merge — named roles.",
      order: 0,
    },
    {
      id: "cleanup",
      label: "Plan data cleanup",
      description: "Dedupe and archive before migration.",
      order: 1,
    },
    {
      id: "ritual",
      label: "Schedule CRM-native reviews",
      description: "Weekly pipeline meeting in the system.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T08:00:00.000Z",
    publishedAt: "2026-08-14T08:00:00.000Z",
    reviewedAt: "2026-08-14T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Common CRM Mistakes & Fixes | SoftwareGlimpse",
    description:
      "Common CRM mistakes — overbuying, ownership, migration, set-and-forget, AI hype, change cost — with practical fixes.",
    canonicalPath: "/guides/common-crm-mistakes/",
    indexable: true,
  },
};
