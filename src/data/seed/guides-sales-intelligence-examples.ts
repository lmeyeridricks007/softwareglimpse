import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales intelligence examples — concrete scenarios (illustrative, not case studies with invented metrics).
 * Template: softwareglimpse-guide-template-v1
 */
const salesIntelligenceExamplesBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Sales intelligence examples are easiest to understand as named team scenarios: an SDR pod building weekly lists, a RevOps owner enriching CRM records, a phone-led dialer team, or a founder running light outbound. Decision rule: pick the scenario that matches your week, then compare tools against that primary job — not against a generic “sales intelligence” brochure.",
    bullets: [
      "SDR pod / list building",
      "RevOps enrichment",
      "Phone / dialer team",
      "Founder-led outbound",
      "What good logging looks like",
      "Not vendor rankings",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Examples reveal job fit",
        body: "The right SI shape depends on whether your week looks like list building, enrichment, dialing, or light founder outreach.",
      },
      {
        label: "Same category, different emphasis",
        body: "All examples need trustworthy contacts — but coverage, credits, sync, and dialer features differ.",
      },
      {
        label: "Illustrative ≠ endorsement",
        body: "These scenarios explain patterns. They are not ranked vendor case studies or invented ROI results.",
      },
      {
        label: "Map your scenario before demos",
        body: "Bring your ICP sample and credit questions to demos so vendors cannot redefine your job mid-pitch.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "pick-your-scenario",
    title: "Find your closest scenario",
    steps: [
      { id: "job", label: "Primary job", short: "List / enrich / dial / light" },
      { id: "volume", label: "Weekly volume", short: "Contacts touched" },
      { id: "crm", label: "CRM state", short: "Empty vs incomplete" },
      { id: "channel", label: "Channel", short: "Email / phone / mixed" },
      { id: "admin", label: "Admin owner", short: "Who runs credits?" },
      { id: "shape", label: "SI shape", short: "Data / enrich / engage / dial" },
    ],
    ctaHref: "/guides/types-of-sales-intelligence/",
    ctaLabel: "Types of sales intelligence →",
    figure: {
      src: "/guides/sales-intelligence-examples-scenario-path.png",
      alt: "Four sales intelligence scenario tiles: SDR pod, RevOps enrichment, phone team, and founder-led outbound.",
      caption: "Match the scenario to your week before you compare product shapes.",
    },
  },
  {
    type: "figure",
    id: "scenario-cards",
    title: "Four common sales intelligence example setups",
    src: "/guides/sales-intelligence-examples-hero.png",
    alt: "Four sales intelligence scenario cards: SDR pod list building, RevOps enrichment, phone dialer team, and founder-led outbound.",
    caption: "Start with the scenario that matches your week — then compare tools.",
  },
  {
    type: "step",
    id: "example-sdr-pod",
    stepNumber: 1,
    heading: "Example: SDR pod list building",
    body: "A three-person SDR pod sells to mid-market IT buyers. Their weekly job is net-new lists with verified emails — not enterprise enrichment governance on day one.\n\nExample: at Harbor Outbound, SDR Maya filters for VP IT / Director IT at 200–2,000 employee companies in the US, unlocks emails with credit tracking, verifies before sequence enroll, and syncs only new contacts into CRM with a source field — Friday review looks at meetings booked, not vanity database size.",
    tip: "Keep the primary job narrow: searchable ICP coverage + credit transparency + verification before send.",
    scenarios: [
      {
        title: "Filter",
        body: "ICP title, size, and region filters produce a weekly account list.",
      },
      {
        title: "Unlock & verify",
        body: "Credits reveal emails; verification drops obvious bad addresses before sequences.",
      },
      {
        title: "Sync",
        body: "New contacts land in CRM with owner and source — not a competing spreadsheet SoR.",
      },
      {
        title: "Review",
        body: "Managers coach on meetings and reply quality — not raw unlocks alone.",
      },
    ],
  },
  {
    type: "step",
    id: "example-revops",
    stepNumber: 2,
    heading: "Example: RevOps enrichment",
    body: "A solo RevOps owner inherits a CRM full of incomplete records. The SI job is fill rate and governed overwrite — not building net-new lists from scratch.\n\nExample: at Pulse Metrics, Priya exports 18,000 contacts missing mobile or email, runs enrichment with a match-rate report, maps fields so enrichment cannot wipe owner notes, and schedules a quarterly refresh — SDRs stop pasting LinkedIn URLs into Slack for “quick lookups.”",
    tip: "Write overwrite rules before the first bulk enrich. Match rate on your sample is the go/no-go metric.",
    scenarios: [
      {
        title: "Sample",
        body: "Test match rate on a slice of real CRM accounts before full spend.",
      },
      {
        title: "Map fields",
        body: "Decide which fields enrichment may update and which stay human-owned.",
      },
      {
        title: "Refresh",
        body: "Schedule re-enrichment so stale phones and titles do not silently decay.",
      },
    ],
  },
  {
    type: "step",
    id: "example-phone-team",
    stepNumber: 3,
    heading: "Example: phone / dialer team",
    body: "An eight-rep phone-led team lives on connect volume and dispositions. Data still feeds the dialer, but the product shape that decides the quarter is dialer + logging.\n\nExample: at Brightline Phone, reps dial with local presence; wrong-number dispositions trigger a credit-efficient re-enrich; every connected call writes back to the CRM deal — managers coach on conversations, not raw dials alone.",
    tip: "Clarify whether dialer and data are one product or two — both can work if CRM remains the system of record.",
    scenarios: [
      {
        title: "Dial",
        body: "Local presence and power dialing increase connect attempts per hour.",
      },
      {
        title: "Disposition",
        body: "Wrong number / voicemail / connected outcomes feed coaching and re-enrich triggers.",
      },
      {
        title: "Log",
        body: "Call notes attach to the CRM record the pipeline already uses.",
      },
    ],
  },
  {
    type: "step",
    id: "example-founder",
    stepNumber: 4,
    heading: "Example: founder-led outbound",
    body: "A founder runs light outbound between product and fundraising work. They need a small, current list — not a dialer stack or enterprise enrichment program.\n\nExample: at Meridian Labs, founder Lena keeps a 60-account ICP list, unlocks emails for the week’s 15 touches, personalizes from the company record, and logs replies in CRM. A bought CSV from last year sits unused — live SI replaced the stale sheet for active outreach only.",
    tip: "Prioritize simple coverage and credit clarity over suite breadth until volume forces a pod motion.",
    scenarios: [
      {
        title: "Small ICP list",
        body: "Dozens of accounts, not thousands — quality and personalization beat volume.",
      },
      {
        title: "Weekly unlocks",
        body: "Credits spent only on this week’s touches — no bulk burn “just in case.”",
      },
      {
        title: "Light logging",
        body: "Replies and next steps live in CRM so a future hire inherits history.",
      },
    ],
  },
  {
    type: "size-match",
    id: "example-fit",
    title: "Which example is closest?",
    tiers: [
      {
        id: "sdr",
        label: "SDR pod",
        description: "Contact data shape; emphasize ICP filters, credits, and verification.",
        fitHints: ["Weekly lists", "Sequence-ready"],
      },
      {
        id: "revops",
        label: "RevOps enrichment",
        description: "Enrichment shape; match rate and overwrite rules first.",
        fitHints: ["Incomplete CRM", "Field governance"],
      },
      {
        id: "phone",
        label: "Phone team",
        description: "Dialer-heavy tooling with data feeding numbers and CRM logging.",
        fitHints: ["Connect volume", "Dispositions"],
      },
      {
        id: "founder",
        label: "Founder-led",
        description: "Light data or engagement; avoid overbuying dialer suites.",
        fitHints: ["Small ICP", "Low admin"],
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Example pitfalls",
    items: [
      {
        title: "Copying another company’s stack",
        body: "Borrow patterns, then rewrite the primary job to match your real bottleneck.",
      },
      {
        title: "Treating vendor “customer stories” as proof",
        body: "Ask what ICP sample and credit model produced the outcome — not just the logo slide.",
      },
      {
        title: "Optimizing for demo wow",
        body: "A flashy sequence demo does not help a RevOps owner who needed governed enrichment.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "Can you give sales intelligence examples for small teams?",
        answer:
          "Yes — the founder-led and small SDR pod scenarios above are the most common early patterns: searchable ICP contacts, careful credit use, verification before send, and CRM as system of record.",
      },
      {
        question: "Are these real customer case studies?",
        answer:
          "No. They are illustrative scenarios for education. SoftwareGlimpse does not invent metrics or attribute outcomes to unpaid endorsements here.",
      },
      {
        question: "How do I turn an example into a shortlist?",
        answer:
          "Identify your motion and SI shape (Types of Sales Intelligence), then use How to Choose Sales Intelligence and Best Sales Intelligence Software with those constraints.",
      },
      {
        question: "Where do product examples live?",
        answer:
          "Product-specific walkthroughs belong on software review hubs and comparisons — this guide stays scenario-focused.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/sales-intelligence-benefits/",
        label: "Sales intelligence benefits",
        description: "Outcomes these scenarios aim for.",
      },
      {
        href: "/guides/types-of-sales-intelligence/",
        label: "Types of sales intelligence",
        description: "Match scenario → product shape.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose sales intelligence",
        description: "Buying framework after you pick a scenario.",
      },
      {
        href: "/guides/sales-intelligence-glossary/",
        label: "Sales intelligence glossary",
        description: "Credits, match rate, intent.",
      },
      {
        href: "/guides/common-sales-intelligence-mistakes/",
        label: "Common SI mistakes",
        description: "Failure modes these scenarios avoid.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence software",
        description: "Research-backed rankings when available.",
      },
      {
        href: "/categories/sales-intelligence/",
        label: "Sales intelligence category",
        description: "Browse the catalogue.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "best-cta",
    title: "Match your scenario to products",
    body: "Best Sales Intelligence Software turns researched criteria about job, coverage, and credits into product comparisons — without affiliate-ordered rankings.",
    href: "/best/sales-intelligence-software/",
    ctaLabel: "See Best Sales Intelligence →",
    variant: "finder",
  },
];

export const salesIntelligenceExamplesGuide: GuidePage = {
  id: "guide-sales-intelligence-examples",
  slug: "sales-intelligence-examples",
  title: "Sales Intelligence Examples: SDR, RevOps, Phone & Founder Scenarios",
  summary:
    "Concrete sales intelligence examples for SDR pods, RevOps enrichment, phone teams, and founder-led outbound — illustrative scenarios that clarify fit without invented case-study metrics.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "fundamental",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/sales-intelligence-examples-hero.png",
    alt: "Four sales intelligence scenario cards for SDR pods, RevOps enrichment, phone teams, and founder-led outbound.",
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
    "sales-intelligence-benefits",
    "types-of-sales-intelligence",
    "how-to-choose-sales-intelligence",
    "sales-intelligence-glossary",
    "sales-intelligence-vs-spreadsheet",
    "common-sales-intelligence-mistakes",
  ],
  blocks: salesIntelligenceExamplesBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "scenario",
      label: "Pick your closest scenario",
      description: "SDR, RevOps, phone, or founder.",
      order: 0,
    },
    {
      id: "job",
      label: "Name the primary job",
      description: "List, enrich, dial, or light outreach.",
      order: 1,
    },
    {
      id: "shape",
      label: "Choose an SI shape",
      description: "Then shortlist with Best page criteria.",
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
    title: "Sales Intelligence Examples & Scenarios | SoftwareGlimpse",
    description:
      "Sales intelligence examples for SDR pods, RevOps enrichment, phone teams, and founder-led outbound — practical scenarios without invented metrics.",
    canonicalPath: "/guides/sales-intelligence-examples/",
    indexable: true,
  },
};
