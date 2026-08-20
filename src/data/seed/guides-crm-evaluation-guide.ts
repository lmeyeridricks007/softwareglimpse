import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Evaluation Guide — scorecards, trials, fair comparisons.
 * Template: softwareglimpse-guide-template-v1
 */
const crmEvaluationGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Evaluate CRM options with the same weighted criteria, the same trial script, and the same scorecard for every shortlisted tool — before anyone watches a polished vendor demo. Decision rule: if two products cannot be scored on identical tasks by a non-admin user, stop and fix the script; do not compare vibes, feature tours, or affiliate rankings.",
    bullets: [
      "Weighted criteria",
      "Same trial script",
      "Non-admin testers",
      "Scorecard discipline",
      "Avoid demo theater",
      "Decide on evidence",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Fairness is a shared script",
        body: "Identical tasks beat sequential “wow” demos that each vendor controls.",
      },
      {
        label: "Weights force tradeoffs",
        body: "Without weights, the loudest stakeholder or flashiest UI wins by default.",
      },
      {
        label: "Non-admins reveal adoption risk",
        body: "If sellers cannot complete core tasks quickly, data quality will collapse later.",
      },
      {
        label: "Score before negotiating",
        body: "Lock scores from the scripted trial; then talk pricing and terms.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "eval-path",
    title: "Fair evaluation path",
    steps: [
      { id: "criteria", label: "Criteria", short: "Weighted list" },
      { id: "script", label: "Script", short: "Same tasks" },
      { id: "trial", label: "Trial", short: "Non-admin runs" },
      { id: "score", label: "Score", short: "One card" },
      { id: "decide", label: "Decide", short: "Evidence only" },
    ],
    ctaHref: "/guides/crm-requirements-guide/",
    ctaLabel: "Requirements guide →",
    figure: {
      src: "/guides/crm-evaluation-path.png",
      alt: "Fair CRM evaluation path: weighted criteria, identical trial script, same scorers, same-day scores, decide on totals.",
      caption:
        "Freeze weights before demos — changing criteria after a favorite appears rewrites the winner.",
    },
  },
  {
    type: "size-match",
    id: "worked-trial",
    title: "Worked example: Harbor’s identical script",
    tiers: [
      {
        id: "fair",
        label: "Same tasks, two tools",
        description:
          "Worked example: Harbor’s non-admin AE creates a contact, logs a call, moves a deal, and builds a list filter in Tool A and Tool B on the same afternoon. Scores go on one card before anyone watches a vendor webinar.",
        fitHints: ["Non-admin tester", "Identical tasks", "Score the same day"],
      },
      {
        id: "theater",
        label: "When evaluation is theater",
        description:
          "Worked example: Pulse lets each vendor run a custom demo in a different week. The louder UI wins. They stop, freeze weights from the requirements sheet, and re-run one script.",
        fitHints: ["No sequential wow tours", "Weights locked first", "Affiliate links never score"],
      },
    ],
  },
  {
    type: "figure",
    id: "scorecard-visual",
    title: "Evaluation scorecard",
    src: "/guides/crm-evaluation-guide-scorecard.png",
    alt: "CRM evaluation scorecard with weighted criteria columns and space to score multiple shortlisted tools on the same script.",
    caption:
      "One scorecard, same weights, same tasks — so shortlisted tools stay comparable.",
  },
  {
    type: "step",
    id: "set-weights",
    stepNumber: 1,
    heading: "Set weighted criteria before demos",
    body: "Pull must-haves from your requirements sheet and assign weights the team agrees on. Process fit and must-have coverage usually outrank nice-to-have AI or marketplace depth.\n\nExample: a 6-person B2B team shortlists three tools and agrees weights — process fit (5), must-have coverage (5), integrations (4), usability (4), cost clarity (3), growth headroom (2). They refuse demos until the scorecard and trial script exist.",
    tip: "Freeze weights before the first vendor call. Changing weights mid-evaluation rewrites the winner.",
    figure: {
      src: "/guides/crm-evaluation-guide-hero.png",
      alt: "CRM evaluation guide hero: weighted criteria, trial script, and scorecard for fair CRM comparisons.",
      caption:
        "Criteria and script come before demos — otherwise you evaluate theater.",
    },
    scenarios: [
      {
        title: "Process fit",
        body: "Stages and fields match how you sell in the next 90 days.",
      },
      {
        title: "Must-have coverage",
        body: "Day-one features without forcing an unused enterprise tier.",
      },
      {
        title: "Usability",
        body: "Non-admins complete create-deal, log-activity, and board-view tasks.",
      },
    ],
  },
  {
    type: "step",
    id: "run-script",
    stepNumber: 2,
    heading: "Run the same trial script on every tool",
    body: "Write a short script: import or create sample contacts, create deals with owners and next steps, sync or log email/activity, pull the weekly board, and attempt one critical integration check. Every shortlisted product gets the same script and the same scorers.\n\nExample: the team scores three shortlisted tools on that script. Tool A wins the polished demo but loses on non-admin time-to-log-a-call; Tool B clears must-haves with slower UI; Tool C fails the inbox sync constraint and is dropped — all from the same card, not from memory.",
    tip: "Ban “show us the coolest feature” as the first agenda item. Run your tasks first; vendor theater second.",
    figure: {
      src: "/guides/crm-evaluation-trial-script.png",
      alt: "Same CRM trial script on every tool: sample data, owner and next step, activity log, weekly board, one integration check.",
      caption:
        "Your tasks first — vendor theater second. Same script and scorers for every shortlisted product.",
    },
    scenarios: [
      {
        title: "Demo theater",
        body: "Vendors drive happy-path clicks; your script exposes empty fields and sync gaps.",
      },
      {
        title: "Sequential bias",
        body: "The last demo feels best unless scores are written the same day as each trial.",
      },
      {
        title: "Admin-only trials",
        body: "Only power users test — sellers never touch the product until go-live.",
      },
    ],
  },
  {
    type: "scorecard",
    id: "eval-scorecard",
    title: "CRM evaluation scorecard (weights)",
    body: "Score each shortlisted tool 1–5 on the same criteria after the scripted trial. Multiply by weight; compare totals — do not invent ROI percentages.",
    criteria: [
      { id: "process-fit", label: "Sales process fit", weight: 5 },
      { id: "must-haves", label: "Must-have coverage", weight: 5 },
      { id: "integrations", label: "Integration reality", weight: 4 },
      { id: "usability", label: "Usability (non-admin)", weight: 4 },
      { id: "tco", label: "Cost clarity", weight: 3 },
      { id: "growth", label: "Growth headroom", weight: 2 },
    ],
    productSlugs: [],
  },
  {
    type: "trial-plan",
    id: "trial-plan",
    title: "Compact trial plan (same for each tool)",
    days: [
      {
        day: 1,
        focus: "Setup & sample data",
        tasks: [
          "Create or import a small contact/deal set",
          "Set stages to match your process",
          "Invite one non-admin seller",
        ],
      },
      {
        day: 2,
        focus: "Core script",
        tasks: [
          "Create deal with owner + next step",
          "Log a call/email activity",
          "Open the weekly pipeline board",
        ],
      },
      {
        day: 3,
        focus: "Constraints & score",
        tasks: [
          "Test one critical integration path",
          "Note plan gates for must-haves",
          "Fill the shared scorecard the same day",
        ],
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "fairness-checks",
    title: "Fairness checks",
    rows: [
      {
        feature: "Same tasks across all tools",
        mustHave: true,
        niceToHave: false,
        notes: "Non-negotiable",
      },
      {
        feature: "Non-admin completes core loop",
        mustHave: true,
        niceToHave: false,
        notes: "Adoption signal",
      },
      {
        feature: "Weights frozen before demos",
        mustHave: true,
        niceToHave: false,
        notes: "Stops mid-eval rewriting",
      },
      {
        feature: "Vendor-led “wow” tour first",
        mustHave: false,
        niceToHave: true,
        notes: "Optional after your script",
      },
      {
        feature: "Affiliate ranking as primary input",
        mustHave: false,
        niceToHave: true,
        notes: "Weak evaluation method",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Evaluation mistakes",
    items: [
      {
        title: "Letting demos set the agenda",
        body: "You will score storytelling instead of your 90-day outcomes.",
      },
      {
        title: "Changing criteria after a favorite appears",
        body: "Post-hoc weight changes are how teams rationalize preference.",
      },
      {
        title: "Comparing list prices only",
        body: "Must-haves often sit behind higher tiers — note gates on the scorecard.",
      },
      {
        title: "No written scores the same day",
        body: "Memory favors the last polished demo.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How do I evaluate CRM software fairly?",
        answer:
          "Agree weighted criteria and a shared trial script first, then score every shortlisted tool the same way with at least one non-admin user. Decision rule: no identical script means no fair comparison — pause demos until the scorecard exists.",
      },
      {
        question: "How many tools should we shortlist?",
        answer:
          "Usually two or three that already clear must-haves and hard constraints. More than that burns time without better evidence.",
      },
      {
        question: "What is demo theater?",
        answer:
          "A vendor-controlled happy path that skips your messy data, permissions, and integration realities. Run your script before optional feature tours.",
      },
      {
        question: "Who should score the tools?",
        answer:
          "At least one daily user and one buyer/admin. Average or discuss gaps — do not let only the executive sponsor score usability.",
      },
      {
        question: "What should I do next?",
        answer:
          "Move the top-scoring option into vendor diligence (security, exit, contract), or use CRM Finder if you still need a shortlist from constraints.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-requirements-guide/",
        label: "CRM requirements guide",
        description: "Build the sheet demos run from.",
      },
      {
        href: "/guides/crm-demo-guide/",
        label: "CRM demo guide",
        description: "Buyer-controlled demo agendas.",
      },
      {
        href: "/guides/crm-trial-evaluation/",
        label: "CRM trial evaluation",
        description: "Scripted non-admin trial week.",
      },
      {
        href: "/guides/crm-vendor-evaluation/",
        label: "CRM vendor evaluation",
        description: "Diligence beyond features.",
      },
      {
        href: "/guides/crm-vendor-questions/",
        label: "CRM vendor questions",
        description: "Probe list for demos and trials.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Full selection framework.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist from structured answers.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Weighted must-haves to score against.",
      },
      {
        href: "/tools/crm-vendor-scorecard/",
        label: "Vendor Scorecard",
        description: "Score shortlisted CRMs on your criteria.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Need a shortlist first?",
    body: "CRM Finder maps your constraints to researched products so evaluation starts with a fair shortlist — not an affiliate-ordered list.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmEvaluationGuide: GuidePage = {
  id: "guide-crm-evaluation-guide",
  slug: "crm-evaluation-guide",
  title: "CRM Evaluation Guide: Scorecards, Trials & Fair Comparisons",
  summary:
    "Evaluate CRM options fairly with weighted criteria, a shared trial script, and a scorecard — so you compare evidence instead of demo theater.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "evaluate",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/crm-evaluation-guide-hero.png",
    alt: "CRM evaluation guide hero: weighted criteria, trial script, and scorecard for fair CRM comparisons.",
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
    "crm-demo-guide",
    "crm-trial-evaluation",
    "crm-vendor-evaluation",
    "crm-vendor-questions",
    "crm-requirements-guide",
    "crm-selection-process",
    "crm-selection-mistakes",
    "how-to-choose-crm",
  ],
  blocks: crmEvaluationGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "weights",
      label: "Freeze weighted criteria",
      description: "Agree weights before any demo.",
      order: 0,
    },
    {
      id: "script",
      label: "Write one trial script",
      description: "Same tasks for every shortlisted tool.",
      order: 1,
    },
    {
      id: "score",
      label: "Score with non-admins",
      description: "Fill the shared card the same day.",
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
    title: "CRM Evaluation Guide: Scorecards & Fair Trials | SoftwareGlimpse",
    description:
      "How to evaluate CRM options with weighted criteria, shared trial scripts, and scorecards — without demo theater or affiliate rankings.",
    canonicalPath: "/guides/crm-evaluation-guide/",
    indexable: true,
  },
};
