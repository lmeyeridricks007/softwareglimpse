import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales Intelligence Evaluation Guide — 2-week trial scorecard (coverage, credits, sync, deliverability).
 * Template: softwareglimpse-guide-template-v1
 */
const salesIntelligenceEvaluationGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Evaluate sales intelligence options with the same weighted criteria, the same two-week trial script, and the same scorecard for every shortlisted tool — covering an ICP coverage sample, credit burn, CRM sync, and deliverability. Decision rule: if two products cannot be scored on identical tasks by a non-admin rep, stop and fix the script; do not compare vibes, feature tours, or affiliate rankings.",
    bullets: [
      "Weighted criteria",
      "Same 2-week script",
      "Coverage sample",
      "Credit burn",
      "CRM sync",
      "Deliverability",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Fairness is a shared script",
        body: "Identical ICP samples and tasks beat sequential “wow” demos each vendor controls.",
      },
      {
        label: "Credits and coverage decide the bill",
        body: "Without measuring burn and usable records on your accounts, seat price is theater.",
      },
      {
        label: "Sync and deliverability are day-two risks",
        body: "Duplicates, overwrite failures, and mailbox hits sink tools that looked fine in a search demo.",
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
      { id: "script", label: "2-week script", short: "Same tasks" },
      { id: "sample", label: "Coverage", short: "ICP sample" },
      { id: "credits", label: "Credits", short: "Burn log" },
      { id: "sync", label: "Sync + send", short: "CRM & deliverability" },
      { id: "score", label: "Score", short: "One card" },
    ],
    ctaHref: "/guides/sales-intelligence-requirements-guide/",
    ctaLabel: "Requirements guide →",
    figure: {
      src: "/guides/sales-intelligence-evaluation-path.png",
      alt: "Fair sales intelligence evaluation path: weighted criteria, two-week script, coverage sample, credit burn, CRM sync and deliverability, same-day scores.",
      caption:
        "Freeze weights before demos — changing criteria after a favorite appears rewrites the winner.",
    },
  },
  {
    type: "figure",
    id: "scorecard-visual",
    title: "Two-week evaluation scorecard",
    src: "/guides/sales-intelligence-evaluation-scorecard.png",
    alt: "Sales intelligence evaluation scorecard with weighted criteria for coverage, credit burn, CRM sync, deliverability, and usability across shortlisted tools.",
    caption:
      "One scorecard, same weights, same two-week tasks — so shortlisted tools stay comparable.",
  },
  {
    type: "step",
    id: "set-weights",
    stepNumber: 1,
    heading: "Set weighted criteria before demos",
    body: "Pull must-haves from your requirements sheet and assign weights the team agrees on. Coverage on your ICP and credit clarity usually outrank nice-to-have AI or intent widgets.\n\nExample: a 4-person SDR pod shortlists three tools and agrees weights — ICP coverage (5), credit/export clarity (5), CRM sync reality (4), deliverability / sending hygiene (4), non-admin usability (4), growth headroom (2). They refuse demos until the scorecard and two-week script exist.",
    tip: "Freeze weights before the first vendor call. Changing weights mid-evaluation rewrites the winner.",
    figure: {
      src: "/guides/sales-intelligence-evaluation-guide-hero.png",
      alt: "Sales intelligence evaluation guide hero: weighted criteria, two-week trial script, and scorecard for fair comparisons.",
      caption:
        "Criteria and script come before demos — otherwise you evaluate theater.",
    },
    scenarios: [
      {
        title: "ICP coverage",
        body: "Usable emails and phones on your real target accounts.",
      },
      {
        title: "Credit burn",
        body: "You can predict cost for a normal outbound week.",
      },
      {
        title: "Sync + deliverability",
        body: "CRM write rules hold; test sends do not tank domains.",
      },
    ],
  },
  {
    type: "step",
    id: "run-two-week-script",
    stepNumber: 2,
    heading: "Run the same two-week trial script on every tool",
    body: "Week 1 focuses on data truth: load or search the same 200 ICP accounts, count usable emails/phones, spot-check 20, push 50 to CRM with your write rules, and log credits spent. Week 2 focuses on motion: one non-admin runs a light cadence or dial block, notes deliverability signals, and fills the shared scorecard the same day each tool finishes.\n\nExample: the SDR pod scores three shortlisted tools. Tool A wins the polished search demo but burns credits fast and overwrites Owner on sync. Tool B clears coverage with slower UI. Tool C fails mailbox warm-up constraints and is dropped — all from the same card, not from memory. Catalogue products such as Apollo.io, BookYourData, or Reply.io are examples of tools you might put through this script — not ranked winners on this page.",
    tip: "Ban “show us the coolest AI feature” as the first agenda item. Run coverage and sync first; vendor theater second.",
    figure: {
      src: "/guides/sales-intelligence-evaluation-trial-script.png",
      alt: "Same two-week sales intelligence trial script: ICP coverage sample, credit burn log, CRM sync of 50 records, deliverability check, non-admin day, scorecard.",
      caption:
        "Your tasks first — vendor theater second. Same script and scorers for every shortlisted product.",
    },
    scenarios: [
      {
        title: "Demo theater",
        body: "Vendors search their strongest markets; your ICP sample exposes thin coverage.",
      },
      {
        title: "Credit surprise",
        body: "Seat price looked fine until a normal list week emptied the pool.",
      },
      {
        title: "Sync / deliverability miss",
        body: "Duplicates or bounced test sends kill trust before go-live.",
      },
    ],
  },
  {
    type: "scorecard",
    id: "eval-scorecard",
    title: "Sales intelligence evaluation scorecard (weights)",
    body: "Score each shortlisted tool 1–5 on the same criteria after the two-week script. Multiply by weight; compare totals — do not invent ROI percentages or affiliate-ordered rankings.",
    criteria: [
      { id: "coverage", label: "ICP coverage (usable records)", weight: 5 },
      { id: "credits", label: "Credit & export clarity", weight: 5 },
      { id: "sync", label: "CRM sync / write-rule fidelity", weight: 4 },
      { id: "deliverability", label: "Deliverability & sending hygiene", weight: 4 },
      { id: "usability", label: "Usability (non-admin)", weight: 4 },
      { id: "growth", label: "Growth headroom", weight: 2 },
    ],
    productSlugs: [],
  },
  {
    type: "trial-plan",
    id: "trial-plan",
    title: "Two-week trial plan (same for each tool)",
    days: [
      {
        day: 1,
        focus: "Setup & ICP freeze",
        tasks: [
          "Freeze the same 200 target accounts for every tool",
          "Invite one non-admin rep + RevOps observer",
          "Confirm credit balance and what one credit unlocks",
        ],
      },
      {
        day: 2,
        focus: "Coverage sample",
        tasks: [
          "Search the two roles you sell to on those 200 accounts",
          "Count records found, usable work emails, needed phone types",
          "Spot-check 20 records by hand",
        ],
      },
      {
        day: 3,
        focus: "Credit burn log",
        tasks: [
          "Build one week’s normal list volume",
          "Log credits for email vs phone unlocks",
          "Note export / API caps hit",
        ],
      },
      {
        day: 4,
        focus: "CRM sync (50 records)",
        tasks: [
          "Push 50 contacts with written write/overwrite rules",
          "Verify owners and never-overwrite fields",
          "Check duplicate match behavior",
        ],
      },
      {
        day: 5,
        focus: "Week-1 score snapshot",
        tasks: [
          "Fill coverage + credits + sync rows on the shared card",
          "Capture screenshots of credit UI and sync errors",
          "Do not change weights",
        ],
      },
      {
        day: 8,
        focus: "Non-admin workflow day",
        tasks: [
          "Rep builds a 50-contact list without admin help",
          "Runs one cadence step or dial block",
          "Times list → push → first touch",
        ],
      },
      {
        day: 10,
        focus: "Deliverability check",
        tasks: [
          "Send a small controlled test from warmed domains only",
          "Note bounce/spam signals and tool warnings",
          "Confirm suppression list is honored",
        ],
      },
      {
        day: 14,
        focus: "Final score & decide",
        tasks: [
          "Complete remaining scorecard rows the same day",
          "Discuss gaps with buyer + daily user",
          "Negotiate only after totals are locked",
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
        feature: "Same 200-account ICP sample across tools",
        mustHave: true,
        niceToHave: false,
        notes: "Non-negotiable",
      },
      {
        feature: "Credit burn logged for a normal week",
        mustHave: true,
        niceToHave: false,
        notes: "Real price signal",
      },
      {
        feature: "50-record CRM push with write rules",
        mustHave: true,
        niceToHave: false,
        notes: "Adoption / data quality",
      },
      {
        feature: "Deliverability / suppression check",
        mustHave: true,
        niceToHave: false,
        notes: "If you will send",
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
        body: "You will score storytelling instead of coverage on your ICP.",
      },
      {
        title: "Skipping credit burn measurement",
        body: "Seat price without a normal-week burn log is not a cost decision.",
      },
      {
        title: "Bulk-pushing before write rules",
        body: "Duplicates and overwritten owners are cheap at 50 and expensive at 5,000.",
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
        question: "How do I evaluate sales intelligence software fairly?",
        answer:
          "Agree weighted criteria and a shared two-week trial script first, then score every shortlisted tool the same way on coverage sample, credit burn, CRM sync, and deliverability with at least one non-admin rep. Decision rule: no identical script means no fair comparison.",
      },
      {
        question: "How many tools should we shortlist?",
        answer:
          "Usually two or three that already clear must-haves and hard constraints. More than that burns credits and time without better evidence.",
      },
      {
        question: "What belongs in the coverage sample?",
        answer:
          "The same ~200 real target accounts, the two roles you sell to, counts for usable work email and needed phone type, plus a 20-record hand spot-check — on every tool.",
      },
      {
        question: "Who should score the tools?",
        answer:
          "At least one daily rep and one buyer/RevOps owner. Average or discuss gaps — do not let only the executive sponsor score usability.",
      },
      {
        question: "What should I do next?",
        answer:
          "Move the top-scoring option into vendor diligence (sourcing docs, exit, contract), or return to How to Choose Sales Intelligence and the Best Sales Intelligence Software page if you still need a constrained shortlist.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/sales-intelligence-requirements-guide/",
        label: "SI requirements guide",
        description: "Build the sheet trials run from.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose sales intelligence",
        description: "Full selection framework.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence software",
        description: "Researched shortlist with methodology.",
      },
      {
        href: "/guides/sales-intelligence-vs-sales-engagement/",
        label: "SI vs sales engagement",
        description: "Clarify data vs sequencing before you score.",
      },
      {
        href: "/guides/when-to-replace-sales-intelligence/",
        label: "When to replace sales intelligence",
        description: "Optimize vs switch after a failed trial.",
      },
      {
        href: "/software/lusha/",
        label: "Lusha (catalogue example)",
        description: "Data + engage example — not a ranking.",
      },
      {
        href: "/software/amplemarket/",
        label: "Amplemarket (catalogue example)",
        description: "Outbound platform example — not a ranking.",
      },
      {
        href: "/guides/crm-data-hygiene/",
        label: "CRM data hygiene",
        description: "Protect the system of record after sync tests.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "best-cta",
    title: "Need a shortlist first?",
    body: "Use How to Choose Sales Intelligence and the Best Sales Intelligence Software page so evaluation starts with a methodology-based shortlist — not an affiliate-ordered list.",
    href: "/best/sales-intelligence-software/",
    ctaLabel: "See Best SI Software →",
    variant: "finder",
  },
];

export const salesIntelligenceEvaluationGuide: GuidePage = {
  id: "guide-sales-intelligence-evaluation-guide",
  slug: "sales-intelligence-evaluation-guide",
  title:
    "Sales Intelligence Evaluation Guide: Two-Week Trial Scorecard",
  summary:
    "Evaluate sales intelligence options fairly with weighted criteria and a shared two-week trial — coverage sample, credit burn, CRM sync, and deliverability — so you compare evidence instead of demo theater.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "evaluate",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/sales-intelligence-evaluation-guide-hero.png",
    alt: "Sales intelligence evaluation guide hero: weighted criteria, two-week trial script, and scorecard for fair comparisons.",
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
    "sales-intelligence-requirements-guide",
    "how-to-choose-sales-intelligence",
    "sales-intelligence-vs-sales-engagement",
    "when-to-replace-sales-intelligence",
    "crm-data-hygiene",
  ],
  blocks: salesIntelligenceEvaluationGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "weights",
      label: "Freeze weighted criteria",
      description: "Agree weights before any demo.",
      order: 0,
    },
    {
      id: "script",
      label: "Write one two-week trial script",
      description: "Coverage, credits, sync, deliverability.",
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
    updatedAt: "2026-08-17T08:00:00.000Z",
    publishedAt: "2026-08-17T08:00:00.000Z",
    reviewedAt: "2026-08-17T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Sales Intelligence Evaluation Guide | SoftwareGlimpse",
    description:
      "How to evaluate sales intelligence with weighted criteria and a two-week trial — coverage sample, credit burn, CRM sync, and deliverability — without demo theater.",
    canonicalPath: "/guides/sales-intelligence-evaluation-guide/",
    indexable: true,
  },
};
