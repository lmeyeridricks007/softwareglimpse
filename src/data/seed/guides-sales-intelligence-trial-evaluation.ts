import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales Intelligence Trial Evaluation — ICP sample, same script, non-admin scorers.
 * Template: softwareglimpse-guide-template-v1
 */
const salesIntelligenceTrialEvaluationGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Trial evaluation means every shortlisted SI tool gets the same ICP account sample, the same task script, and non-admin scorers on one scorecard. Decision rule: if only admins touched the trial, ICP lists differed by vendor, or credit burn was not logged, the scores are not comparable — reset the script before deciding.",
    bullets: [
      "Same ICP sample",
      "Same script",
      "Non-admin runs",
      "Credit log",
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
        body: "Demos prove possibility; trials prove weekly prospecting.",
      },
      {
        label: "Coverage is local",
        body: "Your accounts beat global record-count slides.",
      },
      {
        label: "Log credit burn",
        body: "Unit consumption is part of the scorecard evidence.",
      },
      {
        label: "Export and sync while you can",
        body: "Exit and CRM proof are cheapest in trial.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "trial-path",
    title: "Trial evaluation path",
    steps: [
      { id: "script", label: "Script", short: "Tasks frozen" },
      { id: "icp", label: "ICP sample", short: "Same accounts" },
      { id: "run", label: "Run", short: "Non-admin days" },
      { id: "score", label: "Score", short: "One card" },
      { id: "diligence", label: "Diligence", short: "Credits & exit" },
    ],
    ctaHref: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose →",
    figure: {
      src: "/guides/sales-intelligence-trial-evaluation-week.png",
      alt: "Trial evaluation path: freeze script, load ICP sample, non-admin run, score same day, diligence after both tools.",
      caption:
        "Repeat the same week shape for each finalist — change the product, not the plan.",
    },
  },
  {
    type: "figure",
    id: "trial-week",
    title: "Compact trial week",
    src: "/guides/sales-intelligence-trial-evaluation-week.png",
    alt: "Five-day SI trial plan per tool: setup, ICP coverage, CRM sync, credits/export, score and compare.",
    caption:
      "Repeat the same week shape for each finalist — change the product, not the plan.",
  },
  {
    type: "step",
    id: "freeze-script-data",
    stepNumber: 1,
    heading: "Freeze script and ICP sample before day one",
    body: "Write tasks that map to outcomes: search 50–200 target accounts, unlock a fixed contact set, verify, push to CRM, attempt suppression honor, and log credits consumed. Use the same account list for every vendor.\n\nExample: a 6-SDR regional SaaS pod shortlists two tools. They freeze 150 ICP domains, require “non-admin unlocks 20 contacts and CRM-updates 10,” plus “export a CSV sample if the plan allows.”",
    tip: "Ban exploring “cool intent filters” until the script is scored. Parking lot only.",
    figure: {
      src: "/guides/sales-intelligence-trial-evaluation-hero.png",
      alt: "Sales intelligence trial evaluation hero: week plan from ICP setup to score day with credit log.",
      caption:
        "A calendar with owners beats an open-ended “play with the trial.”",
    },
    scenarios: [
      {
        title: "Setup day",
        body: "Seats, CRM connect, ICP list loaded.",
      },
      {
        title: "Coverage days",
        body: "Same accounts; log hit rates and credit burn.",
      },
      {
        title: "Evidence day",
        body: "Sync sample, export sample, scorecard.",
      },
    ],
  },
  {
    type: "step",
    id: "run-compare",
    stepNumber: 2,
    heading: "Run, score, then diligence — in that order",
    body: "Complete the script for tool A, score the same day, then tool B. Compare totals only after both scripts finish. Use Vendor Questions for credit, sourcing, and exit answers in writing.\n\nExample: Tool A wins coverage on ICP; Tool B wins CRM sync clarity. The pod keeps weights frozen, documents the tradeoff, and does not re-weight to force a favorite.",
    tip: "If trial length is short, cut nice-to-haves — never cut ICP sample or non-admin CRM push.",
    scenarios: [
      {
        title: "Admin-only trap",
        body: "Only RevOps configured — SDRs never unlocked.",
      },
      {
        title: "Uneven ICP lists",
        body: "Tool B got easier accounts — void and rerun.",
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
        focus: "Setup & CRM connect",
        tasks: [
          "Invite one non-admin SDR",
          "Connect CRM sandbox or pilot org",
          "Load the frozen ICP account list",
        ],
      },
      {
        day: 2,
        focus: "ICP coverage sample",
        tasks: [
          "Search the same accounts in each tool",
          "Unlock the scripted contact count",
          "Log credits consumed and empty reveals",
        ],
      },
      {
        day: 3,
        focus: "Verify + outreach motion",
        tasks: [
          "Run verification path if in scope",
          "Place contacts into a test sequence or dial list",
          "Note friction timestamps",
        ],
      },
      {
        day: 4,
        focus: "CRM sync & export",
        tasks: [
          "Push/update sample contacts per mapping rules",
          "Export a sample if available",
          "List plan gates discovered",
        ],
      },
      {
        day: 5,
        focus: "Score & compare",
        tasks: [
          "Fill weighted scorecard same day",
          "Capture open risks (credits, sync, compliance docs)",
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
        title: "Treating the AE sandbox as your trial",
        body: "You need your users and your ICP list.",
      },
      {
        title: "Different accounts per tool",
        body: "Destroys coverage comparability.",
      },
      {
        title: "Ignoring credit burn",
        body: "Coverage without unit cost evidence misleads finance.",
      },
      {
        title: "Skipping export / sync",
        body: "Exit and CRM pain are cheapest to learn in trial.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How long should an SI trial be?",
        answer:
          "A compact week per finalist is enough when the script and ICP sample are frozen. Stretch only if sync or credit rules need a second pass — not for feature tourism.",
      },
      {
        question: "Who should score the trial?",
        answer:
          "At least one non-admin SDR plus someone holding the shared scorecard. Admin-only scores hide adoption risk.",
      },
      {
        question: "What should I do next?",
        answer:
          "Lock scores, finish Vendor Questions diligence, then write the decision memo from the Selection Process guide.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose SI",
        description: "Weights and job-first frame.",
      },
      {
        href: "/guides/sales-intelligence-vendor-questions/",
        label: "Vendor questions",
        description: "Probes for blockers you hit.",
      },
      {
        href: "/guides/sales-intelligence-credits-explained/",
        label: "Credits explained",
        description: "Log burn against unit definition.",
      },
      {
        href: "/guides/sales-intelligence-crm-sync-explained/",
        label: "CRM sync explained",
        description: "What day-4 must prove.",
      },
      {
        href: "/guides/sales-intelligence-selection-process/",
        label: "Selection process",
        description: "Where trial sits in gates.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence",
        description: "Finalists to trial.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "choose-cta",
    title: "Trial fewer tools, more carefully",
    body: "Constrain the shortlist by primary job, then run this trial plan on each finalist with the same ICP sample.",
    href: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose SI →",
    variant: "finder",
  },
];

export const salesIntelligenceTrialEvaluationGuide: GuidePage = {
  id: "guide-sales-intelligence-trial-evaluation",
  slug: "sales-intelligence-trial-evaluation",
  title: "Sales Intelligence Trial Evaluation",
  summary:
    "Run a scripted SI trial with a frozen ICP sample, non-admin testers, credit logging, and the same scorecard — so hands-on evidence replaces last-demo bias.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "evaluate",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/sales-intelligence-trial-evaluation-hero.png",
    alt: "Sales intelligence trial evaluation hero: calendar week with ICP coverage, CRM sync, credit log, and score day.",
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
    label: "See Best Sales Intelligence",
  },
  relatedGuideSlugs: [
    "how-to-choose-sales-intelligence",
    "sales-intelligence-vendor-questions",
    "sales-intelligence-credits-explained",
    "sales-intelligence-crm-sync-explained",
    "sales-intelligence-selection-process",
  ],
  blocks: salesIntelligenceTrialEvaluationGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "icp-sample",
      label: "Freeze the same ICP account sample",
      description: "Used for every finalist.",
      order: 0,
    },
    {
      id: "non-admin",
      label: "Run core tasks as non-admin",
      description: "At least one SDR scorer.",
      order: 1,
    },
    {
      id: "score-same-day",
      label: "Fill the scorecard the same day",
      description: "Include credit burn notes.",
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
    title: "Sales Intelligence Trial Evaluation | SoftwareGlimpse",
    description:
      "Scripted SI trial plan: ICP sample, non-admin tasks, credit logging, day-by-day focus, and fair scoring.",
    canonicalPath: "/guides/sales-intelligence-trial-evaluation/",
    indexable: true,
  },
};
