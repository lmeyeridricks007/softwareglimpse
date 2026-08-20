import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const businessCommunicationsRequirementsGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Write business communications requirements from the primary job, the numbers you must have, the routing rules your team actually needs, and the systems calls must log into — not from a feature list copied off vendor sites. Decision rule: if a capability would disqualify the platform when missing, it is a must-have and needs a pass/fail test you can run in a trial; everything else stays a nice-to-have until the shortlist is frozen.",
    bullets: [
      "Primary job + outcomes",
      "Numbers & countries",
      "Routing rules",
      "Must vs nice with tests",
      "CRM / helpdesk logging",
      "Demo-ready sheet",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Outcomes before features",
        body: "“No inbound call goes unanswered during business hours” beats a forty-row feature matrix nobody will score.",
      },
      {
        label: "Number coverage is a hard gate",
        body: "Put required countries and number types at the top of the sheet. A missing country ends the evaluation regardless of features.",
      },
      {
        label: "Every must-have needs a test",
        body: "Write the pass/fail check you will run in a trial — “IVR routes to the right queue after hours,” not “has IVR.”",
      },
      {
        label: "Name the system of record",
        body: "Decide which system owns customer history and what the phone platform is allowed to write into it, before integrations get configured.",
      },
      {
        label: "Freeze the sheet before demos",
        body: "Vendors will expand scope. A written sheet keeps three demos comparable.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "req-path",
    title: "Requirements path",
    steps: [
      { id: "job", label: "Job", short: "Primary outcome" },
      { id: "numbers", label: "Numbers", short: "Countries & types" },
      { id: "routing", label: "Routing", short: "Who answers what" },
      { id: "must", label: "Must", short: "Pass/fail tests" },
      { id: "stack", label: "Stack", short: "CRM logging" },
      { id: "sheet", label: "Sheet", short: "Demo-ready" },
    ],
    ctaHref: "/guides/business-communications-evaluation-guide/",
    ctaLabel: "Evaluation guide →",
    figure: {
      src: "/guides/business-communications-requirements-guide-path.png",
      alt: "Business communications requirements path: primary job, numbers, routing, must-haves, CRM logging, demo-ready sheet.",
      caption: "A frozen sheet makes demos fair — feature-wishlist shopping does not.",
    },
  },
  {
    type: "step",
    id: "job-outcomes",
    stepNumber: 1,
    heading: "Name the primary job and three observable outcomes",
    body: "Write the job in one sentence, then three outcomes visible in a weekly review — for example: every inbound call reaches a named queue during business hours; missed calls appear in a shared list with an owner; every customer call is logged against the right record without manual entry.\n\nExample: Harbor Clinic's job is “patients reach the right site on the first call.” Outcomes: an IVR with three site options live; after-hours calls routed to a single voicemail box that is checked each morning; call volume per site visible without exporting anything.\n\nKeep clusters explicit on the sheet: cloud phone / UCaaS (RingCentral, Dialpad, Zoom Phone, Nextiva, Aircall class), customer messaging (Wati class), and team collab (Slack, Microsoft Teams) fail different must-have tests — do not merge them into one undifferentiated wishlist.",
    tip: "If an outcome cannot be observed within 30 days of go-live, it is a strategy hope — not a requirements line.",
    scenarios: [
      {
        title: "Phone job",
        body: "Number coverage, routing rules, and call logging tests — UCaaS and cloud-phone shapes.",
      },
      {
        title: "Outbound sales job",
        body: "Dialer availability on the target tier, call disposition, and CRM write-back.",
      },
      {
        title: "Messaging / collab job",
        body: "Shared inbox or team channels — not the same sheet as a phone shortlist.",
      },
    ],
  },
  {
    type: "step",
    id: "must-nice",
    stepNumber: 2,
    heading: "Split must vs nice and freeze the logging rules",
    body: "List must-haves with pass/fail tests: provision a number in each required country, build the routing rule, place an inbound and outbound call, confirm the CRM record shows the call without cleanup. Keep nice-to-haves on a separate list so a demo cannot silently redefine scope.\n\nThen freeze integration rules: which system is the customer record of truth, which fields the phone platform may write, who owns recordings and for how long, and what happens to call data if you change vendors. Example: Northline Retail marks IVR routing and CRM call logging as must; AI call summaries as nice. The phone platform may create activity records but never edits customer contact details.",
    tip: "Keep must-haves under about ten. A thirty-must list means the prioritisation has not happened yet.",
  },
  {
    type: "feature-matrix",
    id: "must-nice-matrix",
    title: "Must-have vs nice-to-have (starter by job)",
    rows: [
      {
        feature: "Business numbers in required countries",
        mustHave: true,
        niceToHave: false,
        notes: "Feasibility gate",
      },
      {
        feature: "Inbound and outbound calling",
        mustHave: true,
        niceToHave: false,
        notes: "Core phone job",
      },
      {
        feature: "Call routing / IVR",
        mustHave: true,
        niceToHave: false,
        notes: "Must if more than one person answers",
      },
      {
        feature: "CRM or helpdesk call logging",
        mustHave: true,
        niceToHave: false,
        notes: "Prevents duplicate admin",
      },
      {
        feature: "Call recording",
        mustHave: false,
        niceToHave: true,
        notes: "Must where compliance or coaching requires it",
      },
      {
        feature: "Power dialer",
        mustHave: false,
        niceToHave: true,
        notes: "Must only if outbound volume is the job",
      },
      {
        feature: "WhatsApp Business messaging",
        mustHave: false,
        niceToHave: true,
        notes: "Must only if messaging is the job — usually a separate platform",
      },
      {
        feature: "Shared team inbox",
        mustHave: false,
        niceToHave: true,
        notes: "Must for multi-agent messaging",
      },
      {
        feature: "Analytics & queue reporting",
        mustHave: false,
        niceToHave: true,
        notes: "Must for support operations with service levels",
      },
      {
        feature: "AI transcription / summaries",
        mustHave: false,
        niceToHave: true,
        notes: "Should not drive the buy",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "How many must-haves should we have?",
        answer:
          "Prefer a short list you can genuinely test in a trial. If everything is a must-have, you are collecting features rather than writing requirements.",
      },
      {
        question: "Should compliance sit on the requirements sheet?",
        answer:
          "Yes. Call recording consent, retention periods, and any regional rules for recording or messaging belong on the sheet before the first call — not in a legal thread after go-live.",
      },
      {
        question: "Do we need number porting on day one?",
        answer:
          "If customers already call an existing number, treat porting as a must-have with its own test: confirm the vendor supports porting for that number type and country, and get the timeline in writing.",
      },
      {
        question: "What should I do next?",
        answer:
          "Run the evaluation guide's trial script against the frozen sheet, then shortlist on Best Business Communications Software.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related business communications resources",
    links: [
      {
        href: "/guides/business-communications-evaluation-guide/",
        label: "Evaluation guide",
        description: "Two-week trial scorecard.",
      },
      {
        href: "/guides/how-to-choose-business-communications-software/",
        label: "How to choose",
        description: "Job-first framework.",
      },
      {
        href: "/guides/business-communications-pricing-guide/",
        label: "Pricing guide",
        description: "Price the tier your must-haves need.",
      },
      {
        href: "/best/business-communications-software/",
        label: "Best business communications software",
        description: "Methodology shortlist.",
      },
      {
        href: "/categories/business-communications/",
        label: "Business communications category",
        description: "Browse the catalogue.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "best-cta",
    title: "Turn the sheet into a shortlist",
    body: "Once outcomes, numbers, routing, and logging rules are on the sheet, use How to Choose Business Communications Software and the Best Business Communications page — methodology-first, not affiliate-ordered.",
    href: "/best/business-communications-software/",
    ctaLabel: "See Best Business Communications Software →",
    variant: "finder",
  },
];

export const businessCommunicationsRequirementsGuide: GuidePage = {
  id: "guide-business-communications-requirements-guide",
  slug: "business-communications-requirements-guide",
  title:
    "Business Communications Requirements Guide: Numbers, Routing & Must-Haves",
  summary:
    "Write demo-ready business communications requirements from the primary job, number coverage, routing rules, must vs nice features, and CRM logging — without feature-wishlist shopping.",
  categorySlugs: ["business-communications"],
  productSlugs: [
    "ringcentral",
    "dialpad",
    "zoom",
    "nextiva",
    "aircall",
    "slack",
    "microsoft-teams",
    "wati",
  ],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/business-communications-requirements-guide-hero.png",
    alt: "Business communications requirements guide hero: job, numbers, routing, and CRM logging feeding a demo-ready sheet.",
  },
  supports: [
    {
      contentId: "content:category:business-communications",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:business-communications-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:best:business-communications-software",
    label: "See Best Business Communications Software",
  },
  relatedGuideSlugs: [
    "how-to-choose-business-communications-software",
    "business-communications-evaluation-guide",
    "business-communications-pricing-guide",
    "what-is-business-communications-software",
  ],
  blocks: businessCommunicationsRequirementsGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name primary job + three outcomes",
      description: "Observable in weekly reviews.",
      order: 0,
    },
    {
      id: "numbers",
      label: "List required countries and number types",
      description: "Feasibility gate before features.",
      order: 1,
    },
    {
      id: "must-nice",
      label: "Split must vs nice with tests",
      description: "Pass/fail checks for each must-have.",
      order: 2,
    },
    {
      id: "logging",
      label: "Freeze logging and retention rules",
      description: "System of record, fields, recordings.",
      order: 3,
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
    title: "Business Communications Requirements Guide | SoftwareGlimpse",
    description:
      "How to write business communications requirements: primary job, number coverage, routing rules, must vs nice, and CRM logging — ready for fair demos and trials.",
    canonicalPath: "/guides/business-communications-requirements-guide/",
    indexable: true,
  },
};
