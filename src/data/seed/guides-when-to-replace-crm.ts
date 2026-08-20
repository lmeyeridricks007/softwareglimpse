import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * When to Replace CRM — optimize-in-place vs replace decision framework.
 * Template: softwareglimpse-guide-template-v1
 * Educational — no rankings, invented switch costs, or affiliate shortlists.
 */
const whenToReplaceCrmBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Replace a CRM only when optimize-in-place cannot clear the blockers that make the system unusable as a system of record. Decision rule: if adoption is dead, admin debt is structural, plan gates block must-have work, or exit/export pain is already blocking operations — and a 60–90 day optimize sprint still fails — then replace; otherwise fix ownership, fields, and rituals first.",
    bullets: [
      "Try optimize first",
      "Adoption dead?",
      "Admin debt?",
      "Plan gates?",
      "Exit pain?",
      "Then shortlist",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Replace is a last-mile decision",
        body: "Most “bad CRM” pain is process, ownership, or plan-tier debt — not the logo on the login screen.",
      },
      {
        label: "Four signal clusters matter",
        body: "Adoption dead, structural admin debt, hard plan gates, and exit/export pain — score them honestly.",
      },
      {
        label: "Optimize sprint before RFP",
        body: "A time-boxed fix of core loop, roles, and hygiene proves whether the product can still work.",
      },
      {
        label: "Shortlist after the decision",
        body: "Finder and Compare come after you decide replace — this page does not rank products.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "replace-path",
    title: "Optimize vs replace path",
    steps: [
      { id: "signals", label: "Signals", short: "Score the four" },
      { id: "optimize", label: "Optimize", short: "60–90 day sprint" },
      { id: "gate", label: "Gate", short: "Pass or fail" },
      { id: "decide", label: "Decide", short: "Keep or replace" },
      { id: "shortlist", label: "Shortlist", short: "Finder next" },
      { id: "migrate", label: "Migrate", short: "If switching" },
    ],
    ctaHref: "/tools/crm-finder/",
    ctaLabel: "CRM Finder →",
    figure: {
      src: "/guides/when-to-replace-path.png",
      alt: "Optimize vs replace CRM path: score four signals, 60–90 day optimize, gate pass or fail, keep or shortlist, migrate if switching.",
      caption:
        "Replacement starts only after an honest optimize gate fails — not after one bad week.",
    },
  },
  {
    type: "figure",
    id: "replace-decision-visual",
    title: "Optimize-in-place vs replace",
    src: "/guides/when-to-replace-crm-decision.png",
    alt: "Decision diagram: four CRM replace signals feed a 60–90 day optimize sprint; pass keeps the CRM, fail routes to shortlist then vendor migration.",
    caption:
      "Replacement starts only after an honest optimize gate fails — not after one bad week or a shiny demo.",
  },
  {
    type: "checklist",
    id: "replace-readiness",
    title: "Replace-readiness checklist",
    copyable: true,
    items: [
      {
        id: "signal-score",
        label: "Four signal clusters scored in writing",
        description: "Adoption, admin debt, plan gates, exit pain.",
        order: 0,
      },
      {
        id: "optimize-sprint",
        label: "Optimize sprint scoped with owners",
        description: "Core loop, roles, hygiene — dated end.",
        order: 1,
      },
      {
        id: "evidence",
        label: "Sprint evidence reviewed",
        description: "Pass/fail against pre-written criteria.",
        order: 2,
      },
      {
        id: "exit-proved",
        label: "Export / exit path proved on current CRM",
        description: "Sample export before you commit to leave.",
        order: 3,
      },
      {
        id: "constraints",
        label: "Must-haves + constraints frozen for shortlist",
        description: "Sheet ready before Finder/Compare.",
        order: 4,
      },
      {
        id: "no-ranking",
        label: "No affiliate-ordered “best CRM” list used as decision",
        description: "Evidence over marketing order.",
        order: 5,
      },
    ],
  },
  {
    type: "step",
    id: "four-signals",
    stepNumber: 1,
    heading: "Score the four replace signals",
    body: "Write evidence for each cluster — not vibes. Adoption dead: open work lacks owners/next steps; weekly review still rebuilds in Sheets. Admin debt: nobody owns fields/roles; every change needs a consultant. Plan gates: must-have sync, reporting, or seats sit behind an unreachable tier. Exit pain: you cannot export usable history or remap users without heroic effort.\n\nExample: Northwind Services, a 22-person B2B ops firm, scored their CRM after two failed “cleanup Fridays.” Adoption: 60% of open deals had no next step; managers coached from a shared Sheet. Admin: one part-time ops lead owned 140 custom fields nobody updated. Plan gates: email sync and board filters lived one tier above budget. Exit: trial export of open deals worked, but activity notes came as opaque blobs. Signals were real — but they still ran an optimize sprint before shopping.",
    tip: "One loud complaint is not a signal cluster. Need evidence across teams and a dated review.",
    figure: {
      src: "/guides/when-to-replace-crm-hero.png",
      alt: "CRM replace decision hero: optimize-in-place path versus replace path with signal cards for adoption, admin debt, plan gates, and exit pain.",
      caption:
        "Four signal cards decide whether you fix the current CRM or earn the right to shortlist a new one.",
    },
    scenarios: [
      {
        title: "Adoption dead",
        body: "Core loop unused; coaching lives outside the CRM.",
      },
      {
        title: "Admin debt",
        body: "No RACI; field sprawl; every change is a ticket.",
      },
      {
        title: "Plan / exit pain",
        body: "Must-haves gated by tier, or export fails usable tests.",
      },
    ],
  },
  {
    type: "step",
    id: "optimize-sprint",
    stepNumber: 2,
    heading: "Run a 60–90 day optimize-in-place sprint",
    body: "Before any RFP, time-box a fix: freeze new fields, name R/A for admin, require owner + next step on open work, delete unused automations, clean duplicates on the active book, and force weekly review from the CRM board. Write pass criteria up front (for example: ≥90% open deals with next step; managers coach from CRM views; no side Sheet for pipeline).\n\nExample: Northwind’s ops lead Priya ran 75 days: cut custom fields from 140 to 28, named AE owners, required next-step dates, killed three unused sequences, and moved Friday forecast onto the CRM board. By day 75, adoption recovered for the AE pod — managers stopped the Sheet. Plan-gate pain remained (email sync still one tier up), so they treated “upgrade in place vs replace” as a commercial decision, not a feature tour.",
    tip: "If leadership will not protect the sprint end date, you are not ready to replace — you will recreate the same chaos in a new logo.",
    figure: {
      src: "/guides/when-to-replace-optimize.png",
      alt: "60–90 day CRM optimize-in-place sprint: scope core loop, name owners, hygiene and coaching, freeze expansion, written pass/fail gate.",
      caption:
        "Write pass/fail criteria before the sprint — not after you already prefer a new vendor.",
    },
    scenarios: [
      {
        title: "Pass",
        body: "Core loop trusted; keep and upgrade plan if needed.",
      },
      {
        title: "Partial",
        body: "Adoption fixed but hard product/plan gaps remain — decide consciously.",
      },
      {
        title: "Fail",
        body: "Same debt after the sprint — proceed to replace gates.",
      },
    ],
  },
  {
    type: "step",
    id: "when-replace-wins",
    stepNumber: 3,
    heading: "When replace wins — and what to do next",
    body: "Replace when the optimize gate fails and at least one structural blocker remains: product cannot support the must-have workflow even on a realistic plan; vendor roadmap/support is a dead end; exit/export risk is already materializing; or trust is so broken that the team will not re-engage the same system. Then freeze a requirements sheet, shortlist with CRM Finder (constraints first), compare finalists fairly, and only then plan vendor migration.\n\nExample: after the sprint, Northwind’s AE pod trusted the board again — but legal required activity retention the current export could not deliver in a usable form, and the qualifying plan for sync + audit still sat outside budget. They froze must-haves, used Finder for a constrained shortlist (no “best CRM” ranking), scored two finalists with the same script, and opened the vendor migration path only after a destination was chosen.",
    tip: "Link Finder/Compare as the next step after the replace decision — never invent an ordered “best” list on this page.",
    scenarios: [
      {
        title: "Structural product gap",
        body: "Must-have workflow impossible on any realistic plan.",
      },
      {
        title: "Exit / compliance gap",
        body: "Cannot prove usable export or retention needs.",
      },
      {
        title: "Trust collapse",
        body: "Team refuses the same system after a fair optimize try.",
      },
    ],
  },
  {
    type: "step",
    id: "keep-not-replace",
    stepNumber: 4,
    heading: "When keeping (and optimizing) is the right call",
    body: "Keep when the sprint restores the core loop, admin ownership is named, and remaining gaps are plan upgrades, training, or integration hygiene — not platform replacement. Replacing to escape ownership debt usually relocates the debt. Use Health Check, Adoption, Governance, and Data Quality guides to keep improving.\n\nExample: a sibling 14-person studio scored “replace” in a brainstorm after one missed quarter. Their optimize sprint (owners, next steps, field cut) cleared the board in 45 days. They upgraded one plan add-on for reporting instead of migrating. Six months later the same CRM ran Friday reviews without a side Sheet — replace would have burned a quarter for no decision-quality gain.",
    tip: "If your strongest replace argument is “everyone is tired of it,” fix rituals and fields first — fatigue is not a vendor score.",
    scenarios: [
      {
        title: "Process debt only",
        body: "Keep; run adoption + governance fixes.",
      },
      {
        title: "Plan-tier gap only",
        body: "Price the qualifying plan before a full switch.",
      },
      {
        title: "Integration hygiene",
        body: "Fix sync owners and mappings before blaming the CRM.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Replace-decision mistakes",
    items: [
      {
        title: "Shopping before an optimize sprint",
        body: "Demos feel productive; they hide whether the current CRM could still work.",
      },
      {
        title: "Treating seat logins as adoption",
        body: "Replace will not fix empty next steps or Sheet-based coaching.",
      },
      {
        title: "Using affiliate “best CRM” order as the decision",
        body: "Constraints and must-haves shortlist tools — marketing order does not.",
      },
      {
        title: "Ignoring exit proof until after signature",
        body: "Prove export on the way out of the current system and into the next.",
      },
      {
        title: "Inventing switch-cost dollar totals",
        body: "List effort categories (clean, map, train, dual-run) — do not invent fake budgets.",
      },
      {
        title: "Replacing to escape missing admin ownership",
        body: "Without R/A, the next CRM becomes the same backlog with new field names.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "When should we replace our CRM?",
        answer:
          "After an honest optimize-in-place sprint fails and structural blockers remain — adoption that will not recover, admin debt without owners, hard plan gates on must-haves, or exit/export pain. Decision rule: no replace shortlist until the optimize gate is written and reviewed.",
      },
      {
        question: "How do we know it is process vs product?",
        answer:
          "If a 60–90 day sprint restores owners, next steps, and CRM-native weekly review, the pain was mostly process. If must-have workflows remain impossible on a realistic plan after that sprint, product/plan fit is in play.",
      },
      {
        question: "Should we replace because a competitor uses another CRM?",
        answer:
          "No. Peer logos are not your constraints, data, or admin capacity. Freeze your sheet, then shortlist — do not copy a stack for status.",
      },
      {
        question: "What comes after we decide to replace?",
        answer:
          "Freeze requirements, shortlist with CRM Finder, compare finalists fairly, then plan vendor migration (inventory → clean → map → pilot → cutover). Use Compare tools for head-to-heads — not invented rankings on this page.",
      },
      {
        question: "How long should an optimize sprint last?",
        answer:
          "Long enough to change habits and prove the core loop — typically 60–90 days with a fixed end date and pass criteria. Shorter “cleanup weekends” rarely change coaching rituals.",
      },
      {
        question: "Can we upgrade our plan instead of replacing?",
        answer:
          "Yes when the sprint restores adoption and the remaining gap is a documented plan gate. Price the qualifying plan against switch effort categories before you assume migration is cheaper.",
      },
      {
        question: "What should I do next?",
        answer:
          "Score the four signals, run or finish the optimize sprint, then — only if replace wins — open CRM Finder with frozen constraints. If you are already switching vendors, continue with Migrate to Another Vendor and the Migration Planner.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM optimize & switch resources",
    links: [
      {
        href: "/guides/crm-vendor-migration/",
        label: "Migrate to another vendor",
        description: "Switch path after replace.",
      },
      {
        href: "/guides/crm-adoption/",
        label: "CRM adoption guide",
        description: "Prove the core loop first.",
      },
      {
        href: "/guides/crm-data-quality/",
        label: "CRM data quality",
        description: "Hygiene before you blame the product.",
      },
      {
        href: "/guides/crm-governance/",
        label: "CRM governance",
        description: "Admin ownership and change control.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Selection framework after decide-to-replace.",
      },
      {
        href: "/guides/crm-selection-mistakes/",
        label: "CRM selection mistakes",
        description: "Avoid repeating buy regret.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Constrained shortlist — next step after replace.",
      },
      {
        href: "/compare/",
        label: "CRM Compare",
        description: "Head-to-heads after shortlist.",
      },
      {
        href: "/tools/crm-migration-planner/",
        label: "Migration Planner",
        description: "If you proceed to switch vendors.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Decided to replace? Shortlist with constraints",
    body: "Use CRM Finder after your optimize gate fails — freeze must-haves and constraints first. This guide does not rank products; Finder builds a constrained shortlist for fair comparison.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const whenToReplaceCrmGuide: GuidePage = {
  id: "guide-when-to-replace-crm",
  slug: "when-to-replace-crm",
  title: "When to Replace a CRM: Optimize vs Switch",
  summary:
    "Decide whether to optimize your current CRM or replace it — using adoption, admin debt, plan-gate, and exit signals — then shortlist with Finder only after the decision.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "optimize",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/when-to-replace-crm-hero.png",
    alt: "CRM replace decision hero: optimize-in-place path versus replace path with signal cards for adoption, admin debt, plan gates, and exit pain.",
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
    "crm-vendor-migration",
    "crm-adoption",
    "crm-data-quality",
    "crm-governance",
    "how-to-choose-crm",
    "crm-selection-mistakes",
    "crm-data-migration",
    "common-crm-mistakes",
  ],
  blocks: whenToReplaceCrmBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "score-signals",
      label: "Score the four replace signal clusters",
      description: "Adoption, admin debt, plan gates, exit.",
      order: 0,
    },
    {
      id: "optimize-gate",
      label: "Complete optimize sprint with pass/fail criteria",
      description: "Dated end; written evidence.",
      order: 1,
    },
    {
      id: "next-step",
      label: "If replace: freeze sheet → Finder shortlist",
      description: "No invented product rankings.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T16:30:00.000Z",
    publishedAt: "2026-08-14T16:30:00.000Z",
    reviewedAt: "2026-08-14T16:30:00.000Z",
    researchStatus: "complete",
    seoStatus: "optimized",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "When to Replace a CRM: Optimize vs Switch | SoftwareGlimpse",
    description:
      "Decision framework for replacing a CRM: score adoption, admin debt, plan gates, and exit pain; optimize in place first; shortlist with Finder only after replace wins.",
    canonicalPath: "/guides/when-to-replace-crm/",
    indexable: true,
  },
};
