import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * When to Replace Sales Intelligence — optimize-in-place vs replace decision framework.
 * Template: softwareglimpse-guide-template-v1
 * Educational — no rankings, invented switch costs, or affiliate shortlists.
 */
const whenToReplaceSalesIntelligenceBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Replace a sales intelligence tool only when optimize-in-place cannot clear the blockers that make it unusable as a prospecting data layer. Decision rule: if coverage on your ICP is dead, credit burn is unpredictable, CRM sync/write rules fail, or deliverability/exit pain is blocking outbound — and a 30–60 day optimize sprint still fails — then replace; otherwise fix ownership, saved searches, write rules, and rituals first.",
    bullets: [
      "Try optimize first",
      "Coverage dead?",
      "Credit chaos?",
      "Sync / write fail?",
      "Deliverability / exit?",
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
        body: "Most “bad SI” pain is process, write-rule debt, or plan-tier credit gates — not the logo on the login screen.",
      },
      {
        label: "Four signal clusters matter",
        body: "ICP coverage dead, credit chaos, sync/write failure, and deliverability/exit pain — score them honestly.",
      },
      {
        label: "Optimize sprint before shopping",
        body: "A time-boxed fix of searches, credits, write rules, and suppression proves whether the product can still work.",
      },
      {
        label: "Shortlist after the decision",
        body: "How to Choose and Best SI come after you decide replace — this page does not rank products.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "replace-path",
    title: "Optimize vs replace path",
    steps: [
      { id: "signals", label: "Signals", short: "Score the four" },
      { id: "optimize", label: "Optimize", short: "30–60 day sprint" },
      { id: "gate", label: "Gate", short: "Pass or fail" },
      { id: "decide", label: "Decide", short: "Keep or replace" },
      { id: "shortlist", label: "Shortlist", short: "How to choose / Best" },
      { id: "migrate", label: "Migrate", short: "If switching" },
    ],
    ctaHref: "/best/sales-intelligence-software/",
    ctaLabel: "Best SI Software →",
    figure: {
      src: "/guides/when-to-replace-sales-intelligence-path.png",
      alt: "Optimize vs replace sales intelligence path: score four signals, 30–60 day optimize, gate pass or fail, keep or shortlist, migrate if switching.",
      caption:
        "Replacement starts only after an honest optimize gate fails — not after one bad week of credits.",
    },
  },
  {
    type: "figure",
    id: "replace-decision-visual",
    title: "Optimize-in-place vs replace",
    src: "/guides/when-to-replace-sales-intelligence-decision.png",
    alt: "Decision diagram: four sales intelligence replace signals feed a 30–60 day optimize sprint; pass keeps the tool, fail routes to shortlist then migration.",
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
        description: "Coverage, credits, sync/write, deliverability/exit.",
        order: 0,
      },
      {
        id: "optimize-sprint",
        label: "Optimize sprint scoped with owners",
        description: "Searches, credits, write rules, suppression — dated end.",
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
        label: "Export / exit path proved on current tool",
        description: "Sample export before you commit to leave.",
        order: 3,
      },
      {
        id: "constraints",
        label: "Must-haves + constraints frozen for shortlist",
        description: "Sheet ready before How to Choose / Best.",
        order: 4,
      },
      {
        id: "no-ranking",
        label: "No affiliate-ordered “best SI” list used as decision",
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
    body: "Write evidence for each cluster — not vibes. Coverage dead: the same 200 ICP accounts return thin usable emails/phones after refresh. Credit chaos: nobody can predict burn for a normal week; top-ups or plan gates block outbound. Sync/write fail: duplicates, overwritten owners, or impossible field mapping on a realistic plan. Deliverability/exit: test sends tank domains, suppression fails, or you cannot export usable history.\n\nExample: Northwind Outbound, an 8-person B2B pod, scored their SI tool after two failed “cleanup Mondays.” Coverage: usable email rate on their ICP sample stayed below a pre-written bar. Credits: a normal list week emptied the pool with no rollover. Sync: Owner was overwritten twice on bulk push. Exit: CSV export worked for emails but phone credits could not be re-exported. Signals were real — but they still ran an optimize sprint before shopping.",
    tip: "One loud complaint is not a signal cluster. Need evidence across the pod and a dated review.",
    figure: {
      src: "/guides/when-to-replace-sales-intelligence-hero.png",
      alt: "Sales intelligence replace decision hero: optimize-in-place path versus replace path with signal cards for coverage, credits, sync/write, and deliverability/exit.",
      caption:
        "Four signal cards decide whether you fix the current tool or earn the right to shortlist a new one.",
    },
    scenarios: [
      {
        title: "Coverage dead",
        body: "ICP sample fails usable-email/phone bar after honest refresh.",
      },
      {
        title: "Credit / sync pain",
        body: "Burn unpredictable; write rules fail on realistic plans.",
      },
      {
        title: "Deliverability / exit",
        body: "Sends unsafe, or export fails usable tests.",
      },
    ],
  },
  {
    type: "step",
    id: "optimize-sprint",
    stepNumber: 2,
    heading: "Run a 30–60 day optimize-in-place sprint",
    body: "Before any vendor bake-off, time-box a fix: freeze new modules, name R/A for credits and CRM write rules, rebuild saved searches for the true ICP, enforce suppression, push only with overwrite rules, and force Monday list review from the tool. Write pass criteria up front (for example: usable-email rate on the 200-account sample clears the bar; credit burn predictable for a normal week; Owner never overwritten on a 50-record push).\n\nExample: Northwind’s RevOps lead ran 45 days: cut unused intent widgets, rebuilt three saved searches, capped unlocks per rep, fixed match keys, and moved Monday lists off Sheets. By day 45, sync recovered — but coverage on their niche ICP still failed the bar on a realistic plan. They treated “upgrade in place vs replace” as a commercial and coverage decision, not a feature tour.",
    tip: "If leadership will not protect the sprint end date, you are not ready to replace — you will recreate the same credit chaos in a new logo.",
    figure: {
      src: "/guides/when-to-replace-sales-intelligence-optimize.png",
      alt: "30–60 day sales intelligence optimize-in-place sprint: rebuild searches, name credit owners, fix write rules and suppression, freeze expansion, written pass/fail gate.",
      caption:
        "Write pass/fail criteria before the sprint — not after you already prefer a new vendor.",
    },
    scenarios: [
      {
        title: "Pass",
        body: "Coverage and sync trusted; keep and adjust plan if needed.",
      },
      {
        title: "Partial",
        body: "Process fixed but hard coverage/plan gaps remain — decide consciously.",
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
    body: "Replace when the optimize gate fails and at least one structural blocker remains: product cannot clear ICP coverage on a realistic credit plan; CRM write rules impossible; vendor roadmap/support is a dead end; exit/export risk is already materializing; or trust is so broken that the pod will not re-engage the same system. Then freeze a requirements sheet, shortlist via How to Choose Sales Intelligence and Best Sales Intelligence Software (constraints first), and run the same two-week evaluation script on finalists.\n\nExample: after the sprint, Northwind’s pod trusted sync again — but usable coverage on their niche ICP still failed, and the qualifying credit tier sat outside budget. They froze must-haves, used the Best page methodology for a constrained shortlist (no invented ranking on this guide), and scored two finalists with the Evaluation Guide script. Catalogue names that appear in research (for example Apollo.io, Lusha, Amplemarket) are examples only — not winners declared here.",
    tip: "Link How to Choose / Best as the next step after the replace decision — never invent an ordered “best” list on this page.",
    scenarios: [
      {
        title: "Structural coverage gap",
        body: "ICP usable-rate impossible on any realistic plan.",
      },
      {
        title: "Exit / compliance gap",
        body: "Cannot prove usable export or suppression needs.",
      },
      {
        title: "Trust collapse",
        body: "Pod refuses the same system after a fair optimize try.",
      },
    ],
  },
  {
    type: "step",
    id: "keep-not-replace",
    stepNumber: 4,
    heading: "When keeping (and optimizing) is the right call",
    body: "Keep when the sprint restores coverage rituals, credit visibility, and CRM write fidelity, and remaining gaps are plan upgrades, training, or integration hygiene — not platform replacement. Replacing to escape missing ownership usually relocates the debt. Use Requirements, Evaluation, and CRM data hygiene guides to keep improving.\n\nExample: a sibling 5-person studio scored “replace” after one burned credit month. Their optimize sprint (saved searches, unlock caps, write rules) cleared Monday lists in 30 days. They bought a documented credit top-up instead of migrating. Three months later the same tool ran without a shadow Sheet — replace would have burned a quarter for no decision-quality gain.",
    tip: "If your strongest replace argument is “everyone is tired of it,” fix rituals and write rules first — fatigue is not a vendor score.",
    scenarios: [
      {
        title: "Process debt only",
        body: "Keep; run ownership + suppression fixes.",
      },
      {
        title: "Plan-tier credit gap only",
        body: "Price the qualifying plan before a full switch.",
      },
      {
        title: "Sync hygiene",
        body: "Fix match keys and overwrite rules before blaming the database.",
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
        body: "Demos feel productive; they hide whether the current tool could still clear your ICP sample.",
      },
      {
        title: "Treating seat logins as adoption",
        body: "Replace will not fix empty Monday lists or Sheet-based contact truth.",
      },
      {
        title: "Using affiliate “best SI” order as the decision",
        body: "Constraints and must-haves shortlist tools — marketing order does not.",
      },
      {
        title: "Ignoring exit proof until after signature",
        body: "Prove export on the way out of the current system and into the next.",
      },
      {
        title: "Inventing switch-cost dollar totals",
        body: "List effort categories (re-verify, remap, retrain, dual-run) — do not invent fake budgets.",
      },
      {
        title: "Replacing to escape missing credit ownership",
        body: "Without R/A for unlocks and write rules, the next tool becomes the same burn with new UI.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "When should we replace our sales intelligence tool?",
        answer:
          "After an honest optimize-in-place sprint fails and structural blockers remain — ICP coverage that will not recover, credit chaos without owners, hard sync/write failures, or deliverability/exit pain. Decision rule: no replace shortlist until the optimize gate is written and reviewed.",
      },
      {
        question: "How do we know it is process vs product?",
        answer:
          "If a 30–60 day sprint restores saved-search discipline, predictable burn, and CRM write fidelity, the pain was mostly process. If usable coverage on your ICP sample remains impossible on a realistic plan after that sprint, product/plan fit is in play.",
      },
      {
        question: "Should we replace because a competitor uses another tool?",
        answer:
          "No. Peer logos are not your ICP, credits, or admin capacity. Freeze your sheet, then shortlist — do not copy a stack for status.",
      },
      {
        question: "What comes after we decide to replace?",
        answer:
          "Freeze requirements, shortlist with How to Choose Sales Intelligence and Best Sales Intelligence Software, compare finalists with the two-week Evaluation Guide script, then plan cutover (export → re-verify sample → remap write rules → dual-run → cutover).",
      },
      {
        question: "How long should an optimize sprint last?",
        answer:
          "Long enough to change habits and prove coverage + sync — typically 30–60 days with a fixed end date and pass criteria. Shorter “cleanup weekends” rarely change Monday rituals.",
      },
      {
        question: "Can we upgrade our plan instead of replacing?",
        answer:
          "Yes when the sprint restores process and the remaining gap is a documented credit or feature gate. Price the qualifying plan against switch effort categories before you assume migration is cheaper.",
      },
      {
        question: "What should I do next?",
        answer:
          "Score the four signals, run or finish the optimize sprint, then — only if replace wins — open How to Choose Sales Intelligence with frozen constraints and the Best Sales Intelligence Software shortlist.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence optimize & switch resources",
    links: [
      {
        href: "/guides/sales-intelligence-evaluation-guide/",
        label: "SI evaluation guide",
        description: "Fair trial script after replace wins.",
      },
      {
        href: "/guides/sales-intelligence-requirements-guide/",
        label: "SI requirements guide",
        description: "Freeze the sheet before you shop.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose sales intelligence",
        description: "Selection framework after decide-to-replace.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence software",
        description: "Constrained shortlist — next step after replace.",
      },
      {
        href: "/guides/when-to-adopt-sales-intelligence/",
        label: "When to adopt sales intelligence",
        description: "Timing signals if you are still early.",
      },
      {
        href: "/guides/crm-data-hygiene/",
        label: "CRM data hygiene",
        description: "Hygiene before you blame the data tool.",
      },
      {
        href: "/compare/",
        label: "Compare tools",
        description: "Head-to-heads after shortlist.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "best-cta",
    title: "Decided to replace? Shortlist with constraints",
    body: "Use How to Choose Sales Intelligence and the Best Sales Intelligence page after your optimize gate fails — freeze must-haves and constraints first. This guide does not rank products.",
    href: "/best/sales-intelligence-software/",
    ctaLabel: "See Best SI Software →",
    variant: "finder",
  },
];

export const whenToReplaceSalesIntelligenceGuide: GuidePage = {
  id: "guide-when-to-replace-sales-intelligence",
  slug: "when-to-replace-sales-intelligence",
  title: "When to Replace Sales Intelligence: Optimize vs Switch",
  summary:
    "Decide whether to optimize your current sales intelligence tool or replace it — using coverage, credit, sync/write, and deliverability/exit signals — then shortlist with How to Choose / Best SI only after the decision.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "optimize",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/when-to-replace-sales-intelligence-hero.png",
    alt: "Sales intelligence replace decision hero: optimize-in-place path versus replace path with signal cards for coverage, credits, sync/write, and deliverability/exit.",
  },
  supports: [
    {
      contentId: "content:category:sales-intelligence",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:sales-intelligence-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:best:sales-intelligence-software",
    label: "See Best Sales Intelligence Software",
  },
  relatedGuideSlugs: [
    "sales-intelligence-evaluation-guide",
    "sales-intelligence-requirements-guide",
    "how-to-choose-sales-intelligence",
    "when-to-adopt-sales-intelligence",
    "crm-data-hygiene",
  ],
  blocks: whenToReplaceSalesIntelligenceBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "score-signals",
      label: "Score the four replace signal clusters",
      description: "Coverage, credits, sync/write, exit.",
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
      label: "If replace: freeze sheet → How to Choose / Best",
      description: "No invented product rankings.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T08:00:00.000Z",
    publishedAt: "2026-08-17T08:00:00.000Z",
    reviewedAt: "2026-08-17T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "When to Replace Sales Intelligence | SoftwareGlimpse",
    description:
      "Decision framework for replacing sales intelligence: score coverage, credits, sync/write, and exit pain; optimize in place first; shortlist with How to Choose / Best SI only after replace wins.",
    canonicalPath: "/guides/when-to-replace-sales-intelligence/",
    indexable: true,
  },
};
