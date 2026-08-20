import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const businessCommunicationsEvaluationGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Evaluate business communications platforms with weighted criteria and a shared two-week trial — provision a number, build the routing rule, connect the CRM, place real calls in both directions, and check the logs — so you compare evidence instead of demo theatre. Decision rule: freeze the weights before any demo, run the identical script on every finalist, and have a non-admin score each tool the same day it finishes.",
    bullets: [
      "Freeze weights first",
      "Same two-week script",
      "Real number provisioning",
      "Routing rule test",
      "CRM logging check",
      "Non-admin scorecard",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Demo theatre lies",
        body: "Vendors demo a clean IVR on an unlimited tier. Your own number provisioning and CRM mapping expose the friction.",
      },
      {
        label: "Test on the tier you will buy",
        body: "Recording, IVR, and analytics often sit above the quoted plan. A trial on the enterprise sandbox scores a product you are not purchasing.",
      },
      {
        label: "Call quality is measured on your network",
        body: "Test from the connections your team really uses — office, home, and mobile — not only a demo call from the vendor.",
      },
      {
        label: "Non-admins must score",
        body: "If only the vendor's engineer can build the routing rule, your team will not maintain it.",
      },
      {
        label: "Number availability can end an evaluation",
        body: "Check coverage in week one. A missing country is a feasibility failure, not a scoring deduction.",
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
    ctaHref: "/guides/business-communications-requirements-guide/",
    ctaLabel: "Requirements guide →",
    figure: {
      src: "/guides/business-communications-evaluation-guide-path.png",
      alt: "Business communications evaluation: weighted criteria, two-week trial script, and shared scorecard.",
      caption:
        "Weights first, identical script second, scorecard the same day — no ranking from memory.",
    },
  },
  {
    type: "step",
    id: "freeze-weights",
    stepNumber: 1,
    heading: "Freeze weighted criteria before any demo",
    body: "Agree weights for call and message quality, routing depth on the target tier, CRM or helpdesk integration, analytics you will genuinely use, outbound tooling if relevant, ease of daily use, and value at your seat count. Do not reweight after a persuasive demo.\n\nExample: Harbor Clinic weights routing and call quality highest because patients must reach the right site. Northline Sales weights dialer throughput and CRM write-back highest. Same category, different cards — both legitimate if frozen early.",
    tip: "Print the weights. If someone wants to reweight mid-trial, that is a requirements change — reopen the shortlist conversation rather than quietly editing the card.",
    scenarios: [
      {
        title: "Support-led team",
        body: "Routing, queues, and queue reporting dominate the weights.",
      },
      {
        title: "Outbound sales team",
        body: "Dialer throughput and CRM logging dominate.",
      },
      {
        title: "Messaging-led team",
        body: "Shared inbox assignment and template workflow dominate.",
      },
    ],
  },
  {
    type: "step",
    id: "run-two-week-script",
    stepNumber: 2,
    heading: "Run the same two-week trial script on every platform",
    body: "Week 1: provision a number in each required country, connect the CRM or helpdesk, place inbound and outbound test calls, and confirm they log correctly. Week 2: build the routing rule or shared-inbox workflow from your requirements sheet, run it with real traffic, check the reports you would review weekly, and fill the shared scorecard the same day.\n\nExample: three shortlisted platforms. Tool A wins the interface demo but the IVR builder is gated one tier above the quote. Tool B routes correctly but writes calls to the wrong CRM object until a field is remapped — recoverable, and worth a note rather than elimination. Tool C cannot supply a number in one required country and is dropped on day two. Run this script inside one job cluster only — phone against phone (RingCentral, Dialpad, Zoom Phone, Nextiva, Aircall, CallHippo, KrispCall, Freshcaller class), messaging against messaging (Wati class), collab against collab (Slack, Microsoft Teams). Catalogue names illustrate shapes; they are not ranked winners on this page.",
    tip: "Ban “show us the AI features” as the first agenda item. Provision, route, call, and log first.",
    figure: {
      src: "/guides/business-communications-evaluation-trial-script.png",
      alt: "Two-week business communications trial script: number provisioning, CRM connection, test calls, routing build, live traffic, scorecard.",
      caption:
        "Your tasks first, vendor theatre second. Same script and same scorers for every shortlisted platform.",
    },
  },
  {
    type: "scorecard",
    id: "eval-scorecard",
    title: "Business communications evaluation scorecard (weights)",
    body: "Score each shortlisted platform 1–5 on the same criteria after the two-week script. Multiply by weight and compare totals — do not invent ROI percentages or affiliate-ordered rankings.",
    criteria: [
      { id: "quality", label: "Call / message quality on your network", weight: 5 },
      { id: "routing", label: "Routing and workflow build on target tier", weight: 5 },
      { id: "integrations", label: "CRM / helpdesk logging accuracy", weight: 5 },
      { id: "ease", label: "Ease of daily use for non-admins", weight: 4 },
      { id: "outbound", label: "Outbound tooling (if outbound is the job)", weight: 3 },
      { id: "analytics", label: "Reporting you will use weekly", weight: 3 },
      { id: "value", label: "Value at your seat count and usage", weight: 4 },
    ],
    productSlugs: [],
  },
  {
    type: "trial-plan",
    id: "trial-plan",
    title: "Two-week trial plan (same for each platform)",
    days: [
      {
        day: 1,
        focus: "Setup & tier freeze",
        tasks: [
          "Confirm the exact plan tier under evaluation",
          "Invite one non-admin agent plus an ops observer",
          "Freeze the seat count and country list",
        ],
      },
      {
        day: 2,
        focus: "Number provisioning",
        tasks: [
          "Provision a number in each required country",
          "Confirm porting support and timeline for existing numbers",
          "Record any country the vendor cannot serve",
        ],
      },
      {
        day: 3,
        focus: "CRM / helpdesk connection",
        tasks: [
          "Connect the integration you will use daily",
          "Place one call and inspect the logged record",
          "Note fields that need remapping",
        ],
      },
      {
        day: 4,
        focus: "Call quality",
        tasks: [
          "Place inbound and outbound calls from office, home, and mobile networks",
          "Log any dropped audio or latency",
          "Test the softphone and mobile app",
        ],
      },
      {
        day: 5,
        focus: "Week-1 score snapshot",
        tasks: [
          "Fill quality and integration rows",
          "Do not change weights",
          "Capture tier-gate surprises",
        ],
      },
      {
        day: 8,
        focus: "Routing build",
        tasks: [
          "Build the IVR, queue, or shared-inbox rule from the requirements sheet",
          "Confirm it works on the target tier",
          "Time how long a non-admin needs",
        ],
      },
      {
        day: 10,
        focus: "Live traffic & reporting",
        tasks: [
          "Route a day of real calls or messages through the rule",
          "Check missed-call handling and after-hours behaviour",
          "Review the reports you would read weekly",
        ],
      },
      {
        day: 14,
        focus: "Score & decide",
        tasks: [
          "Non-admin completes the shared card",
          "Compare weighted totals",
          "Advance the top scorer to diligence — or revisit requirements",
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
        question: "How long should a phone system trial be?",
        answer:
          "Two weeks is enough for provisioning, integration, a routing build, and live traffic — if the script is frozen. Longer trials without a script mostly extend demo theatre.",
      },
      {
        question: "Should we evaluate on a free tier?",
        answer:
          "Only if free is what you intend to run. If your must-haves unlock on a paid tier, evaluate there; free-tier scores do not transfer to the plan you would buy.",
      },
      {
        question: "How do we test call quality fairly?",
        answer:
          "Place calls from every network your team actually uses, at different times of day, and record any dropped audio or latency in the same log for each vendor. One clean demo call proves very little.",
      },
      {
        question: "What should I do next?",
        answer:
          "Move the top-scoring platform into vendor diligence, or return to How to Choose Business Communications Software and the Best Business Communications shortlist if you still need a constrained list.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related business communications resources",
    links: [
      {
        href: "/guides/business-communications-requirements-guide/",
        label: "Requirements guide",
        description: "Build the sheet trials run from.",
      },
      {
        href: "/guides/how-to-choose-business-communications-software/",
        label: "How to choose business communications software",
        description: "Full selection framework.",
      },
      {
        href: "/guides/business-communications-pricing-guide/",
        label: "Pricing guide",
        description: "Seats, minimums, minutes, and message fees.",
      },
      {
        href: "/best/business-communications-software/",
        label: "Best business communications software",
        description: "Researched shortlist.",
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
    title: "Need a shortlist first?",
    body: "Use How to Choose Business Communications Software and the Best Business Communications page so evaluation starts from a methodology-based shortlist — not an affiliate-ordered list.",
    href: "/best/business-communications-software/",
    ctaLabel: "See Best Business Communications Software →",
    variant: "finder",
  },
];

export const businessCommunicationsEvaluationGuide: GuidePage = {
  id: "guide-business-communications-evaluation-guide",
  slug: "business-communications-evaluation-guide",
  title: "Business Communications Evaluation Guide: Two-Week Trial Scorecard",
  summary:
    "Evaluate business communications platforms fairly with weighted criteria and a shared two-week trial — number provisioning, CRM logging, call quality, and a routing build — without demo theatre.",
  categorySlugs: ["business-communications"],
  productSlugs: [
    "ringcentral",
    "dialpad",
    "zoom",
    "nextiva",
    "aircall",
    "callhippo",
    "slack",
    "microsoft-teams",
    "wati",
  ],
  topicType: "selection",
  journeyStage: "evaluate",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/business-communications-evaluation-guide-hero.png",
    alt: "Business communications evaluation guide hero: weighted criteria, two-week trial script, and scorecard for fair comparisons.",
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
    "business-communications-requirements-guide",
    "how-to-choose-business-communications-software",
    "business-communications-pricing-guide",
    "what-is-business-communications-software",
  ],
  blocks: businessCommunicationsEvaluationGuideBlocks as GuidePage["blocks"],
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
      description: "Provision, connect, call, route, report.",
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
    title: "Business Communications Evaluation Guide | SoftwareGlimpse",
    description:
      "How to evaluate business communications software with weighted criteria and a two-week trial — number provisioning, CRM logging, call quality, and routing builds.",
    canonicalPath: "/guides/business-communications-evaluation-guide/",
    indexable: true,
  },
};
