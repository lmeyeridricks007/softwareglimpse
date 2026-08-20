import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales Intelligence Vendor Questions — ask once, compare every finalist.
 * Template: softwareglimpse-guide-template-v1
 */
const salesIntelligenceVendorQuestionsGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Vendor questions for sales intelligence are a shared list covering credit units, coverage on your ICP, CRM sync, export rights, deliverability/sending limits, sourcing/compliance docs, support, and exit — asked identically to every finalist. Decision rule: if a critical answer is only verbal, treat it as open until written; do not sign on demo confidence alone.",
    bullets: [
      "Same list",
      "Credits & export",
      "Coverage",
      "CRM sync",
      "Sourcing docs",
      "Exit",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Questions ≠ theater",
        body: "Short, testable asks beat hundred-item RFPs for most teams.",
      },
      {
        label: "Credit definition is non-optional",
        body: "What one credit buys — in writing.",
      },
      {
        label: "Category examples are not claims",
        body: "Ask how sync/export are licensed — do not assert unverified support.",
      },
      {
        label: "Compliance docs ≠ legal clearance",
        body: "Collect sourcing terms for counsel — this is not legal advice.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "questions-path",
    title: "When to ask what",
    steps: [
      { id: "pre-demo", label: "Pre-demo", short: "Agenda + musts" },
      { id: "live", label: "Live", short: "Credits & sync" },
      { id: "trial", label: "Trial", short: "Coverage sample" },
      { id: "diligence", label: "Diligence", short: "Sourcing / exit" },
      { id: "memo", label: "Memo", short: "Written file" },
    ],
    ctaHref: "/guides/sales-intelligence-trial-evaluation/",
    ctaLabel: "Trial evaluation →",
    figure: {
      src: "/guides/sales-intelligence-vendor-questions-map.png",
      alt: "When to ask SI vendor questions: pre-demo agenda, live credits and sync, trial coverage sample, diligence sourcing/exit, memo file.",
      caption:
        "Use one category ring for every finalist — swap products, not the list.",
    },
  },
  {
    type: "figure",
    id: "question-map",
    title: "Question categories",
    src: "/guides/sales-intelligence-vendor-questions-map.png",
    alt: "Six SI vendor question categories around a shared scorecard: credits, coverage, CRM sync, export, sourcing/compliance, exit.",
    caption:
      "Identical asks create comparable diligence files.",
  },
  {
    type: "step",
    id: "core-bank",
    stepNumber: 1,
    heading: "Use this core question bank",
    body: "Credits: What does one credit unlock? Email vs phone? Failed reveals? Rollover, caps, top-ups?\nCoverage: How should we sample our ICP accounts in trial?\nCRM sync: Direction, match keys, field mapping limits on our plan?\nExport: CSV/API rights and monthly caps?\nDeliverability: Sending limits, warmup guidance, bounce handling?\nSourcing/compliance: Where do processing/sourcing docs live? (For counsel — not a green light.)\nSupport & exit: Channels/hours; how we export and cancel.\n\nExample: an 8-person outbound pod emails this bank to three finalists. One clarifies phones cost two credits; another admits export sits on a higher tier than demoed.",
    tip: "Ask category questions without claiming a named product supports them.",
    figure: {
      src: "/guides/sales-intelligence-vendor-questions-hero.png",
      alt: "Sales intelligence vendor questions hero: shared checklist with speech bubbles to three generic vendors.",
      caption: "Identical asks create comparable diligence files.",
    },
    scenarios: [
      {
        title: "Demo live",
        body: "Credit unit + sync edge clicks.",
      },
      {
        title: "Email follow-up",
        body: "Sourcing docs location + export path.",
      },
      {
        title: "Trial proof",
        body: "ICP sample + non-admin CRM push.",
      },
    ],
  },
  {
    type: "checklist",
    id: "copyable-questions",
    title: "Copyable shortlist (send as-is)",
    copyable: true,
    items: [
      {
        id: "q1",
        label: "What does one credit unlock on the proposed plan?",
        description: "Email / phone / enrichment / export — written.",
        order: 0,
      },
      {
        id: "q2",
        label: "Do failed or empty reveals consume credits?",
        description: "Refund / retry policy.",
        order: 1,
      },
      {
        id: "q3",
        label: "Show CRM sync direction, match keys, and plan gates",
        description: "Native vs add-on.",
        order: 2,
      },
      {
        id: "q4",
        label: "How do we export contacts and what are monthly caps?",
        description: "Formats + who initiates.",
        order: 3,
      },
      {
        id: "q5",
        label: "Where are data sourcing and processing documents?",
        description: "For privacy counsel review — not legal advice.",
        order: 4,
      },
      {
        id: "q6",
        label: "Support channels/hours and cancellation / data deletion steps?",
        description: "Exit clarity.",
        order: 5,
      },
    ],
  },
  {
    type: "step",
    id: "score-answers",
    stepNumber: 2,
    heading: "Score answers for clarity, not charm",
    body: "Mark each reply Clear / Partial / Missing. Partial answers become trial tasks or blockers. Do not convert vague enthusiasm into a high diligence score.\n\nExample: “We’ll handle CRM sync in onboarding” without match keys stays Partial until a concrete mapping story appears.",
    tip: "Store answers next to the decision memo — same source of truth.",
    scenarios: [
      {
        title: "Clear",
        body: "Plan name + credit unit + doc links.",
      },
      {
        title: "Partial",
        body: "Directional answer, needs proof.",
      },
      {
        title: "Missing",
        body: "No reply on export or sourcing docs.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How many questions should I ask?",
        answer:
          "A short bank of must-have diligence questions beats a novel. Expand only for real compliance needs with counsel.",
      },
      {
        question: "Should questions differ by vendor?",
        answer:
          "Keep the core identical. Add product-specific probes only after the shared list.",
      },
      {
        question: "Is collecting sourcing docs legal clearance?",
        answer:
          "No. Docs are inputs for your privacy owner and counsel. This guide is not legal advice.",
      },
      {
        question: "What should I do next?",
        answer:
          "Paste replies into trial tasks and the decision memo; finish Trial Evaluation and Selection Process gates.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/sales-intelligence-trial-evaluation/",
        label: "Trial evaluation",
        description: "Prove answers hands-on.",
      },
      {
        href: "/guides/sales-intelligence-credits-explained/",
        label: "Credits explained",
        description: "Context for commercial questions.",
      },
      {
        href: "/guides/sales-intelligence-compliance-basics/",
        label: "Compliance basics",
        description: "Educational buyer framing.",
      },
      {
        href: "/guides/sales-intelligence-selection-process/",
        label: "Selection process",
        description: "Where diligence sits.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose SI",
        description: "Job-first frame.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence",
        description: "Who receives the list.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "choose-cta",
    title: "Ask fewer vendors, better questions",
    body: "Shortlist by primary job, then send this same question bank to every finalist.",
    href: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose SI →",
    variant: "finder",
  },
];

export const salesIntelligenceVendorQuestionsGuide: GuidePage = {
  id: "guide-sales-intelligence-vendor-questions",
  slug: "sales-intelligence-vendor-questions",
  title: "Sales Intelligence Vendor Questions",
  summary:
    "Copyable SI vendor questions for demos, trials, and diligence — credits, coverage, CRM sync, export, sourcing docs, and exit — without product score claims.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "evaluate",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/sales-intelligence-vendor-questions-hero.png",
    alt: "Sales intelligence vendor questions hero: checklist of question categories with speech bubbles to three generic vendors.",
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
    "sales-intelligence-trial-evaluation",
    "sales-intelligence-credits-explained",
    "sales-intelligence-compliance-basics",
    "sales-intelligence-selection-process",
    "how-to-choose-sales-intelligence",
  ],
  blocks: salesIntelligenceVendorQuestionsGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "same-list",
      label: "Send the same question list to all finalists",
      description: "Comparable answers.",
      order: 0,
    },
    {
      id: "writing",
      label: "Prefer answers in writing",
      description: "Email or brief reply.",
      order: 1,
    },
    {
      id: "attach",
      label: "Attach replies to the decision memo",
      description: "Before signature.",
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
    title: "Sales Intelligence Vendor Questions | SoftwareGlimpse",
    description:
      "SI vendor question bank for credits, coverage, CRM sync, export, sourcing docs, and exit — same list for every finalist.",
    canonicalPath: "/guides/sales-intelligence-vendor-questions/",
    indexable: true,
  },
};
