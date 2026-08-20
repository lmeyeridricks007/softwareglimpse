import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM Trial Evaluation — hands-on plan that beats demo memory.
 * Template: softwareglimpse-guide-template-v1
 */
const crmTrialEvaluationBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Trial evaluation means every shortlisted CRM gets the same sample data, the same task script, and non-admin scorers on one scorecard. Decision rule: if only admins touched the trial or tasks differed by vendor, the scores are not comparable — reset the script before deciding.",
    bullets: [
      "Same data",
      "Same script",
      "Non-admin runs",
      "Day plan",
      "Score same day",
      "Then diligence",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Trial proves operation",
        body: "Demos prove possibility; trials prove weekly use.",
      },
      {
        label: "Identical inputs",
        body: "Same contacts, stages, and tasks across tools.",
      },
      {
        label: "Time-box each tool",
        body: "A thin calendar beats a month of casual clicking.",
      },
      {
        label: "Export while you can",
        body: "Test exit samples before you depend on the workspace.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "trial-path",
    title: "Trial evaluation path",
    steps: [
      { id: "script", label: "Script", short: "Tasks frozen" },
      { id: "data", label: "Data", short: "Sample loaded" },
      { id: "run", label: "Run", short: "Non-admin days" },
      { id: "score", label: "Score", short: "One card" },
      { id: "diligence", label: "Diligence", short: "Exit & plan" },
    ],
    ctaHref: "/guides/crm-evaluation-guide/",
    ctaLabel: "Evaluation guide →",
    figure: {
      src: "/guides/crm-trial-path-v2.png",
      alt: "Trial evaluation path: freeze script, load sample, non-admin run, score same day, diligence after both tools.",
      caption:
        "Repeat the same week shape for each finalist — change the product, not the plan.",
    },
  },
  {
    type: "figure",
    id: "trial-week",
    title: "Compact trial week",
    src: "/guides/crm-trial-evaluation-week.png",
    alt: "Five-day CRM trial plan per tool: setup, seller core loop, reporting, integration/export, score and compare.",
    caption:
      "Repeat the same week shape for each finalist — change the product, not the plan.",
  },
  {
    type: "step",
    id: "freeze-script-data",
    stepNumber: 1,
    heading: "Freeze script and sample data before day one",
    body: "Write tasks that map to 90-day outcomes: create deals, log activities, update next steps, run the Friday board, and one integration check. Build a tiny CSV or manual set that mirrors real stages.\n\nExample: a 10-person regional SaaS sales pod (six sellers) shortlists two tools. They import 25 contacts and 12 open deals with owners. Script includes “seller without admin rights logs a call and sets next step” plus “attempt inbox sync with our Workspace accounts.”",
    tip: "Ban exploring “cool features” until the script is scored. Parking lot only.",
    figure: {
      src: "/guides/crm-trial-evaluation-hero-v2.png",
      alt: "CRM trial evaluation hero: week plan from setup to score.",
      caption:
        "A calendar with owners beats an open-ended “play with the trial.”",
    },
    scenarios: [
      {
        title: "Setup day",
        body: "Stages, fields, invites, sample import.",
      },
      {
        title: "Seller days",
        body: "Core loop under realistic permissions.",
      },
      {
        title: "Evidence day",
        body: "Board, export sample, integration check.",
      },
    ],
  },
  {
    type: "step",
    id: "run-compare",
    stepNumber: 2,
    heading: "Run, score, then diligence — in that order",
    body: "Complete the script for tool A, score the same day, then tool B. Compare totals only after both scripts finish. Use vendor evaluation for exit, support, and plan gates in writing.\n\nExample: Tool A wins seller speed; Tool B wins board clarity. The pod keeps weights frozen from the Evaluation Guide, documents the tradeoff in a decision memo, and does not re-weight to force a favorite.",
    tip: "If trial length is short, cut nice-to-haves — never cut the non-admin core loop.",
    figure: {
      src: "/guides/crm-trial-run-score.png",
      alt: "Run CRM trial, score, then diligence: finish script A, score same day, finish script B, compare with frozen weights, then diligence.",
      caption:
        "Complete and score each script before comparing totals — then diligence, not mid-trial re-weighting.",
    },
    scenarios: [
      {
        title: "Admin-only trap",
        body: "Only ops configured — sellers never logged work.",
      },
      {
        title: "Uneven scripts",
        body: "Tool B got harder tasks — void and rerun.",
      },
      {
        title: "Healthy close",
        body: "Scores locked; diligence emails sent to the leader.",
      },
    ],
  },
  {
    type: "trial-plan",
    id: "trial-plan",
    title: "Per-tool trial plan (repeat for each finalist)",
    days: [
      {
        day: 1,
        focus: "Setup & sample data",
        tasks: [
          "Match stages to your process",
          "Import or create the sample set",
          "Invite one non-admin seller",
        ],
      },
      {
        day: 2,
        focus: "Seller core loop",
        tasks: [
          "Create deal with owner + next step",
          "Log activity from real workflow",
          "Note friction timestamps",
        ],
      },
      {
        day: 3,
        focus: "Pipeline truth",
        tasks: [
          "Build or open the Friday board",
          "Filter by owner/stage",
          "Check required fields enforce process",
        ],
      },
      {
        day: 4,
        focus: "Integration & exit sample",
        tasks: [
          "Test the critical sync path",
          "Export a contact/deal/activity sample if available",
          "List plan gates discovered",
        ],
      },
      {
        day: 5,
        focus: "Score & compare",
        tasks: [
          "Fill weighted scorecard",
          "Capture open risks",
          "Decide advance / drop / diligence",
        ],
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Trial mistakes",
    items: [
      {
        title: "Treating the AE’s sandbox as your trial",
        body: "You need your users in your workspace.",
      },
      {
        title: "Different data per tool",
        body: "Destroys comparability.",
      },
      {
        title: "Scoring after a week of forgetting",
        body: "Same-day notes or it did not happen.",
      },
      {
        title: "Skipping export",
        body: "Exit pain is cheapest to learn in trial.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How long should a CRM trial be?",
        answer:
          "A compact week per finalist is enough when the script is frozen. Stretch only if a hard constraint (sync, permissions) needs a second pass — not for feature tourism.",
      },
      {
        question: "Who should score the trial?",
        answer:
          "At least one non-admin daily user plus someone holding the shared scorecard. Admin-only scores hide adoption risk.",
      },
      {
        question: "How is trial different from the Evaluation Guide?",
        answer:
          "The Evaluation Guide sets fairness rules and weights; this guide is the day-by-day hands-on calendar you repeat per tool.",
      },
      {
        question: "What if the trial plan excludes a must-have?",
        answer:
          "Do not mark it as passed. Schedule a focused follow-up or drop the vendor — assumptions are not evidence.",
      },
      {
        question: "What should I do next?",
        answer:
          "Lock scores, run Vendor Evaluation diligence, then write the decision memo from the Business Case or Selection Process guides.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-evaluation-guide/",
        label: "CRM evaluation guide",
        description: "Weights and fairness rules.",
      },
      {
        href: "/guides/crm-demo-guide/",
        label: "CRM demo guide",
        description: "Buyer-led sessions before trial.",
      },
      {
        href: "/guides/crm-vendor-evaluation/",
        label: "CRM vendor evaluation",
        description: "Diligence after scores.",
      },
      {
        href: "/guides/crm-selection-process/",
        label: "CRM selection process",
        description: "Where trial sits in gates.",
      },
      {
        href: "/guides/crm-vendor-questions/",
        label: "CRM vendor questions",
        description: "Probes for blockers you hit.",
      },
      {
        href: "/guides/crm-requirements-guide/",
        label: "CRM requirements guide",
        description: "Must-haves the trial must prove.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Finalists to trial.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Script the trial from your sheet.",
      },
      {
        href: "/tools/crm-vendor-scorecard/",
        label: "Vendor Scorecard",
        description: "Record trial scores against weighted criteria.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Trial fewer tools, more carefully",
    body: "Use CRM Finder to constrain the shortlist, then run this trial plan on each finalist with the same script.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmTrialEvaluationGuide: GuidePage = {
  id: "guide-crm-trial-evaluation",
  slug: "crm-trial-evaluation",
  title: "CRM Trial Evaluation: Hands-On Plan That Beats Demo Memory",
  summary:
    "Run a scripted CRM trial with sample data, non-admin testers, a day-by-day plan, and the same scorecard — so hands-on evidence replaces last-demo bias.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "evaluate",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/crm-trial-evaluation-hero-v2.png",
    alt: "CRM trial evaluation hero: calendar week with setup, seller tasks, integration check, and score day.",
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
    "crm-evaluation-guide",
    "crm-demo-guide",
    "crm-vendor-evaluation",
    "crm-vendor-questions",
    "crm-requirements-guide",
    "crm-selection-process",
    "how-to-choose-crm",
  ],
  blocks: crmTrialEvaluationBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "sample-data",
      label: "Load the same sample dataset",
      description: "Contacts/deals mirror your process.",
      order: 0,
    },
    {
      id: "non-admin",
      label: "Run core tasks as non-admin",
      description: "At least one seller scorer.",
      order: 1,
    },
    {
      id: "score-same-day",
      label: "Fill the scorecard the same day",
      description: "Per tool, before the next trial.",
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
    title: "CRM Trial Evaluation: Hands-On Fair Trial Plan | SoftwareGlimpse",
    description:
      "Scripted CRM trial plan: sample data, non-admin tasks, day-by-day focus, and fair scoring.",
    canonicalPath: "/guides/crm-trial-evaluation/",
    indexable: true,
  },
};
