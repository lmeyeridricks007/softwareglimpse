import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const howToChooseBusinessCommunicationsBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Choose business communications software by the job that is blocking work — business phone, inbound support routing, outbound sales calling, WhatsApp customer messaging, or internal team chat — then confirm the numbers you need exist, the licence minimum fits your headcount, and the CRM integration you rely on is native rather than a Zapier bridge. Shortlist only tools whose core product is your job; a WhatsApp platform and an IVR-driven phone system are different purchases even when both live in this category.",
    bullets: [
      "Primary job to be done",
      "Seats vs licence minimum",
      "Country / number coverage",
      "Routing depth needed",
      "Native CRM or helpdesk CTI",
      "Usage costs beyond the seat",
      "Trial with real calls",
    ],
  },
  {
    type: "key-takeaways",
    id: "takeaways",
    title: "What matters most",
    items: [
      {
        label: "“Business communications” is several products",
        body: "Cloud phone, contact-centre routing, WhatsApp messaging, and team chat fail for different reasons. Pick the shape before you pick a brand.",
      },
      {
        label: "Licence minimums change the real price",
        body: "A $30 seat with a three-licence minimum costs more than a $18 seat with a two-user minimum, whatever the pricing tile says.",
      },
      {
        label: "Recording and IVR often sit a tier up",
        body: "Entry plans frequently exclude call recording, IVR, or analytics. Map must-have features to the qualifying plan before the demo convinces you.",
      },
      {
        label: "Number coverage is a feasibility gate",
        body: "If you need a local number in a country the vendor does not serve, no other feature matters. Check coverage per country, per plan.",
      },
      {
        label: "Native CTI beats connector counts",
        body: "Click-to-dial, screen pops, and automatic logging in your actual CRM save more time than a directory of hundreds of shallow integrations.",
      },
    ],
  },
  {
    type: "figure",
    id: "worked-examples",
    title: "Four worked examples",
    src: "/guides/how-to-choose-business-communications-software-needs.png",
    alt: "Four worked examples of business communications buying: mid-market sales CTI, SMB outbound dialing, inbound support queue, and WhatsApp customer messaging.",
    caption:
      "Four teams, one category, four different shortlists. The job decides the tool — not the brand.",
  },
  {
    type: "selection-checklist",
    id: "interactive-checklist",
    title: "Interactive business communications selection checklist",
    dimensions: [
      {
        id: "primary-job",
        label: "Primary job",
        options: [
          "Business phone lines",
          "Inbound support routing",
          "Outbound sales calling",
          "WhatsApp / customer messaging",
          "Internal team chat",
        ],
      },
      {
        id: "team-size",
        label: "Users needing a licence",
        options: ["1–2", "3–10", "11–50", "50+"],
      },
      {
        id: "coverage",
        label: "Number coverage needed",
        options: [
          "One country",
          "Two or three countries",
          "Many countries",
          "Toll-free numbers required",
        ],
      },
      {
        id: "stack",
        label: "Must integrate with",
        options: [
          "CRM",
          "Helpdesk",
          "Both CRM and helpdesk",
          "Minimal integrations",
        ],
      },
      {
        id: "budget",
        label: "Budget posture",
        options: [
          "Need a free or near-free start",
          "Under $20 per user per month",
          "Mid-market pricing acceptable",
        ],
      },
    ],
  },
  {
    type: "decision-framework",
    id: "roadmap",
    title: "Selection workflow",
    steps: [
      { id: "step-job", label: "Primary job" },
      { id: "step-seats", label: "Seats & minimum" },
      { id: "step-numbers", label: "Numbers" },
      { id: "step-routing", label: "Routing" },
      { id: "step-cti", label: "CTI" },
      { id: "step-trial", label: "Trial" },
    ],
    ctaHref: "/best/business-communications-software/",
    ctaLabel: "See Best Business Communications Software →",
    figure: {
      src: "/guides/how-to-choose-business-communications-software-roadmap.png",
      alt: "Business communications selection roadmap: job, seats, numbers, routing, CTI, trial.",
      caption:
        "Freeze the job, seat count, and country list before demos — then run the same call-and-route trial on every finalist.",
    },
  },
  {
    type: "step",
    id: "name-the-job",
    stepNumber: 1,
    heading: "Name the primary job before you name a vendor",
    body: "Write one sentence: “We are blocked because we cannot ___ this quarter.” Examples: give every rep a business number that logs calls to the CRM; route inbound support calls to the right site instead of one voicemail; run 80 outbound dials a day without hand-typing numbers; answer WhatsApp messages as a team instead of on one person's phone.\n\nExample: Harbor Studio (eight-person agency) needs shared client numbers and call logging more than dialer throughput. Northline Retail needs an IVR that routes to three stores. Same category — different shortlists. Keep clusters separate: cloud phone / UCaaS (RingCentral, Dialpad, Zoom Phone, Nextiva, Aircall class), team messaging / collab (Slack, Microsoft Teams), and WhatsApp / customer messaging (Wati class). Catalogue names such as CallHippo, KrispCall, and Freshcaller illustrate the phone landscape further — shapes to compare by job, not ranked winners on this page.",
    tip: "If two jobs are truly equal, treat them as two purchases and price both — a phone system with a bolt-on WhatsApp add-on rarely satisfies a serious messaging team.",
    scenarios: [
      {
        title: "Phone job",
        body: "Numbers, routing, and call logging beat dialer throughput and chatbots.",
      },
      {
        title: "Outbound sales job",
        body: "Power dialer availability on the tier you will buy is the deciding gate.",
      },
      {
        title: "Messaging job",
        body: "Shared inbox, templates, and conversation fees matter more than IVR depth.",
      },
    ],
  },
  {
    type: "step",
    id: "seats-numbers-gates",
    stepNumber: 2,
    heading: "Map seats, licence minimums, numbers, and feature gates",
    body: "Count the people who genuinely need a licence, then check the vendor's minimum — some require three licences, some two, some none. Confirm each country where you need a number is available on the plan you intend to buy, and note which tier unlocks call recording, IVR, analytics, and AI features.\n\nThen add usage. Calling minutes may be bundled, metered, or fully pay-as-you-go; phone numbers are often billed separately; WhatsApp platforms add Meta per-conversation charges the vendor does not control. Do not invent totals — collect the vendor's own written figures for the same seat count and compare like for like.",
    tip: "Screenshot the exact plan shown in a demo. Demo environments routinely run on a higher tier than the one you were quoted.",
  },
  {
    type: "step",
    id: "trial-script",
    stepNumber: 3,
    heading: "Run the same trial script on every shortlisted platform",
    body: "Provision a number, build the routing rule your team actually needs, connect the CRM or helpdesk, place real calls in both directions, and check that they log correctly without manual cleanup. Have a non-admin do the daily tasks, and score every tool on the same card the same day.\n\nWorked example: Harbor Studio trials three platforms. Tool A wins the interface demo but its IVR builder is gated one tier above quote. Tool B routes correctly but logs calls to the wrong CRM object until a field is remapped. Tool C cannot provide a local number in one of their two markets and is dropped on day two — a feasibility failure no feature list would have surfaced.",
    tip: "Test call quality from the network your team really uses, including home connections, before you commit to a contract.",
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Should we start on a free tier?",
        answer:
          "Free tiers are useful for learning the interface, but scores from a free plan rarely transfer. If your must-haves — recording, IVR, dialer — unlock on a paid tier, evaluate on that tier or you are testing a different product.",
      },
      {
        question: "How many vendors should we trial?",
        answer:
          "Three is usually enough if your requirements are frozen. More finalists tend to extend demo theatre rather than sharpen the decision.",
      },
      {
        question: "Is the cheapest per-seat price the best value?",
        answer:
          "Not automatically. Add the licence minimum, per-number charges, and usage billing before comparing. A cheaper seat with fully metered calling can cost more than a bundled plan for a high-volume team.",
      },
      {
        question: "What should I do next?",
        answer:
          "Freeze must-haves with the requirements guide, run a fair trial with the evaluation guide, then shortlist on Best Business Communications Software.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related business communications resources",
    links: [
      {
        href: "/guides/what-is-business-communications-software/",
        label: "What is business communications software?",
        description: "Category fundamentals.",
      },
      {
        href: "/guides/business-communications-requirements-guide/",
        label: "Requirements guide",
        description: "Must vs nice sheet.",
      },
      {
        href: "/guides/business-communications-evaluation-guide/",
        label: "Evaluation guide",
        description: "Two-week trial scorecard.",
      },
      {
        href: "/guides/business-communications-pricing-guide/",
        label: "Pricing guide",
        description: "Seats, minimums, minutes, and message fees.",
      },
      {
        href: "/best/business-communications-software/",
        label: "Best business communications software",
        description: "Methodology-based shortlist.",
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
    title: "Compare researched options",
    body: "Open the Best Business Communications Software shortlist once your job, seat count, and country list are frozen — rankings follow published criteria, not commissions.",
    href: "/best/business-communications-software/",
    ctaLabel: "See Best Business Communications Software →",
    variant: "finder",
  },
];

export const howToChooseBusinessCommunicationsSoftwareGuide: GuidePage = {
  id: "guide-how-to-choose-business-communications-software",
  slug: "how-to-choose-business-communications-software",
  title: "How to Choose Business Communications Software: Job-First Framework",
  summary:
    "Choose business communications software by primary job — business phone, support routing, outbound calling, or customer messaging — then map seats, number coverage, feature gates, and a shared trial script.",
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
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/how-to-choose-business-communications-software-hero.png",
    alt: "How to choose business communications software: primary job, seats and minimums, number coverage, routing depth, CTI, and a shared trial scorecard.",
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
    "what-is-business-communications-software",
    "business-communications-requirements-guide",
    "business-communications-evaluation-guide",
    "business-communications-pricing-guide",
  ],
  blocks: howToChooseBusinessCommunicationsBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Freeze primary job",
      description: "One blocking outcome this quarter.",
      order: 0,
    },
    {
      id: "seats",
      label: "Count seats against licence minimums",
      description: "Same seat assumption for every quote.",
      order: 1,
    },
    {
      id: "coverage",
      label: "Verify number coverage per country",
      description: "Feasibility gate before feature comparison.",
      order: 2,
    },
    {
      id: "trial",
      label: "Run shared trial script",
      description: "Real calls, real routing, real CRM logging.",
      order: 3,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "medium-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T12:00:00.000Z",
    publishedAt: "2026-08-17T12:00:00.000Z",
    reviewedAt: "2026-08-17T12:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "How to Choose Business Communications Software | SoftwareGlimpse",
    description:
      "Job-first framework for choosing business communications software — phone, routing, messaging, seat minimums, number coverage, and a fair trial script.",
    canonicalPath: "/guides/how-to-choose-business-communications-software/",
    indexable: true,
  },
};
