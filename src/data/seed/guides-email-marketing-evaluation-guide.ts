import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const emailMarketingEvaluationGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Evaluate email marketing options fairly with weighted criteria and a shared two-week trial — list import, one real campaign, one must-have automation, domain auth, and reporting — so you compare evidence instead of demo theater. Decision rule: freeze weights before demos; run the same script on every finalist; score with a non-admin marketer the same day each tool finishes.",
    bullets: [
      "Freeze weights first",
      "Same two-week script",
      "List import + campaign",
      "Must-have journey test",
      "Domain auth check",
      "Non-admin scorecard",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Demo theater lies",
        body: "Vendors show polished templates; your import and journey expose friction.",
      },
      {
        label: "Plan gates decide the score",
        body: "Test on the plan you will buy — not the unlimited enterprise sandbox.",
      },
      {
        label: "Non-admins must score",
        body: "If only the vendor SE can build the journey, adoption will fail.",
      },
      {
        label: "Deliverability is part of evaluation",
        body: "Domain auth and seed-send health belong on the card — not a post-purchase surprise.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "eval-path",
    title: "Evaluation path",
    steps: [
      { id: "weights", label: "Weights", short: "Agree criteria" },
      { id: "script", label: "Script", short: "Two-week plan" },
      { id: "run", label: "Run", short: "Same tasks" },
      { id: "score", label: "Score", short: "Shared card" },
      { id: "decide", label: "Decide", short: "Evidence only" },
    ],
    ctaHref: "/guides/email-marketing-requirements-guide/",
    ctaLabel: "Requirements guide →",
    figure: {
      src: "/guides/email-marketing-evaluation-guide-hero.png",
      alt: "Email marketing evaluation: weighted criteria, two-week trial script, and shared scorecard.",
      caption: "Weights first, identical script second, scorecard the same day — no memory rankings.",
    },
  },
  {
    type: "step",
    id: "freeze-weights",
    stepNumber: 1,
    heading: "Freeze weighted criteria before any demo",
    body: "Agree weights for ease of building campaigns, automation depth on the target plan, segmentation, analytics you will use weekly, integrations, deliverability setup, and value relative to contact-tier cost. Do not change weights after a charming demo.\n\nExample: Harbor Studio weights templates and multi-brand usability highest; Northline Goods weights ecommerce triggers and reporting. Same category, different cards — both legitimate if frozen early.",
    tip: "Print the weights. If someone wants to reweight mid-trial, that is a requirements change — restart the shortlist conversation.",
    scenarios: [
      {
        title: "Design-led team",
        body: "Templates and editor quality dominate weights.",
      },
      {
        title: "Automation-led team",
        body: "Workflow depth and plan gates dominate.",
      },
      {
        title: "Ecommerce team",
        body: "Store sync and journey triggers dominate.",
      },
    ],
  },
  {
    type: "step",
    id: "run-two-week-script",
    stepNumber: 2,
    heading: "Run the same two-week trial script on every ESP",
    body: "Week 1: import a sample list, authenticate sending domain, build one campaign that matches your brand basics, and log friction. Week 2: build the one must-have automation from your requirements sheet, send to a seed group, check reporting, and fill the shared scorecard the same day.\n\nExample: three shortlisted tools. Tool A wins the polished editor demo but cannot complete cart triggers on the affordable plan. Tool B clears the journey with slower design. Tool C fails DMARC setup guidance and is dropped — all from the same card. Catalogue products such as GetResponse, Campaign Monitor, or ActiveCampaign are examples of tools you might put through this script — not ranked winners on this page.",
    tip: "Ban “show us the coolest AI feature” as the first agenda item. Run import, campaign, and journey first.",
    figure: {
      src: "/guides/email-marketing-evaluation-trial-script.png",
      alt: "Same two-week email marketing trial script: list import, domain auth, campaign build, must-have journey, seed send, scorecard.",
      caption:
        "Your tasks first — vendor theater second. Same script and scorers for every shortlisted product.",
    },
  },
  {
    type: "scorecard",
    id: "eval-scorecard",
    title: "Email marketing evaluation scorecard (weights)",
    body: "Score each shortlisted tool 1–5 on the same criteria after the two-week script. Multiply by weight; compare totals — do not invent ROI percentages or affiliate-ordered rankings.",
    criteria: [
      { id: "creation", label: "Campaign / template creation", weight: 5 },
      { id: "automation", label: "Automation on target plan", weight: 5 },
      { id: "segmentation", label: "Segmentation usability", weight: 4 },
      { id: "analytics", label: "Reporting you will use weekly", weight: 3 },
      { id: "integrations", label: "CRM / shop / form integrations", weight: 4 },
      { id: "deliverability", label: "Auth & send hygiene setup", weight: 4 },
      { id: "value", label: "Value vs contact-tier fit", weight: 3 },
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
        focus: "Setup & plan freeze",
        tasks: [
          "Confirm the exact plan tier under evaluation",
          "Invite one non-admin marketer + ops observer",
          "Freeze the sample list and brand assets",
        ],
      },
      {
        day: 2,
        focus: "List import",
        tasks: [
          "Import sample subscribers with required fields",
          "Verify unsubscribe / suppression handling",
          "Note import errors and duplicates",
        ],
      },
      {
        day: 3,
        focus: "Domain authentication",
        tasks: [
          "Follow vendor SPF/DKIM/DMARC guidance",
          "Document blockers for your DNS owner",
          "Confirm sending domain status in-product",
        ],
      },
      {
        day: 4,
        focus: "Campaign build",
        tasks: [
          "Build one newsletter or promo matching brand basics",
          "Time how long a non-admin needs",
          "Screenshot editor friction",
        ],
      },
      {
        day: 5,
        focus: "Week-1 score snapshot",
        tasks: [
          "Fill creation + deliverability setup rows",
          "Do not change weights",
          "Capture plan-gate surprises",
        ],
      },
      {
        day: 8,
        focus: "Must-have journey",
        tasks: [
          "Build the one automation from the requirements sheet",
          "Confirm it runs on the target plan",
          "Log branching / trigger gaps",
        ],
      },
      {
        day: 10,
        focus: "Seed send + reporting",
        tasks: [
          "Send to a small seed group",
          "Check opens/clicks/conversion reports you will use weekly",
          "Note missing metrics",
        ],
      },
      {
        day: 14,
        focus: "Score & decide",
        tasks: [
          "Non-admin completes the shared card",
          "Compare weighted totals",
          "Advance top scorer to diligence — or revisit requirements",
        ],
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "How long should an ESP trial be?",
        answer:
          "Two weeks is enough for import, one campaign, one must-have journey, and a seed send — if you freeze the script. Longer trials without a script just extend demo theater.",
      },
      {
        question: "Should we evaluate on the free plan?",
        answer:
          "Only if free is what you will run. Otherwise evaluate on the paid tier that unlocks your must-haves — free-plan scores are not transferable.",
      },
      {
        question: "What should I do next?",
        answer:
          "Move the top-scoring option into vendor diligence, or return to How to Choose Email Marketing and Best Email Marketing Software if you still need a constrained shortlist.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related email marketing resources",
    links: [
      {
        href: "/guides/email-marketing-requirements-guide/",
        label: "Requirements guide",
        description: "Build the sheet trials run from.",
      },
      {
        href: "/guides/how-to-choose-email-marketing/",
        label: "How to choose email marketing",
        description: "Full selection framework.",
      },
      {
        href: "/best/email-marketing-software/",
        label: "Best email marketing software",
        description: "Researched shortlist.",
      },
      {
        href: "/categories/email-marketing/",
        label: "Email marketing category",
        description: "Browse the catalogue.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "best-cta",
    title: "Need a shortlist first?",
    body: "Use How to Choose Email Marketing and the Best Email Marketing Software page so evaluation starts with a methodology-based shortlist — not an affiliate-ordered list.",
    href: "/best/email-marketing-software/",
    ctaLabel: "See Best Email Marketing Software →",
    variant: "finder",
  },
];

export const emailMarketingEvaluationGuide: GuidePage = {
  id: "guide-email-marketing-evaluation-guide",
  slug: "email-marketing-evaluation-guide",
  title: "Email Marketing Evaluation Guide: Two-Week Trial Scorecard",
  summary:
    "Evaluate email marketing options fairly with weighted criteria and a shared two-week trial — list import, campaign, must-have automation, domain auth, and reporting — without demo theater.",
  categorySlugs: ["email-marketing"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "evaluate",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/email-marketing-evaluation-guide-hero.png",
    alt: "Email marketing evaluation guide hero: weighted criteria, two-week trial script, and scorecard for fair comparisons.",
  },
  supports: [
    {
      contentId: "content:category:email-marketing",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:email-marketing-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:best:email-marketing-software",
    label: "See Best Email Marketing Software",
  },
  relatedGuideSlugs: [
    "email-marketing-requirements-guide",
    "how-to-choose-email-marketing",
    "email-marketing-pricing-guide",
    "what-is-email-marketing",
  ],
  blocks: emailMarketingEvaluationGuideBlocks as GuidePage["blocks"],
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
      description: "Import, campaign, journey, auth, reporting.",
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
    updatedAt: "2026-08-17T12:00:00.000Z",
    publishedAt: "2026-08-17T12:00:00.000Z",
    reviewedAt: "2026-08-17T12:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Email Marketing Evaluation Guide | SoftwareGlimpse",
    description:
      "How to evaluate email marketing with weighted criteria and a two-week trial — list import, campaign, automation, domain auth, and reporting — without demo theater.",
    canonicalPath: "/guides/email-marketing-evaluation-guide/",
    indexable: true,
  },
};
