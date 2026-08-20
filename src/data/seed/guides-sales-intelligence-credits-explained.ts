import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales Intelligence Credits Explained — decode units, rollover, exports.
 * Template: softwareglimpse-guide-template-v1
 * Educational only — no invented prices.
 */
const salesIntelligenceCreditsExplainedGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "A credit is whatever the vendor defines as one billable unlock — often an email reveal, phone reveal, enrichment row, or export — and those definitions are not interchangeable across products. Decision rule: do not compare “credits included” until you know what one credit buys, whether email and phone cost the same, if failed reveals still consume credits, and how rollover, monthly caps, and top-ups work for your first-90-day volume.",
    bullets: [
      "Unit definition",
      "Email vs phone",
      "Failed reveals",
      "Rollover & caps",
      "Export rights",
      "Top-ups",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Credits ≠ seats",
        body: "Seat price can look fine while credit burn decides the bill.",
      },
      {
        label: "Definitions differ by vendor",
        body: "One “credit” in Tool A may unlock less than one in Tool B.",
      },
      {
        label: "Failed unlocks still cost",
        body: "Ask whether empty or wrong numbers consume the unit.",
      },
      {
        label: "Export is often gated",
        body: "In-app view without bulk/API export changes how you use the data.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "credit-path",
    title: "Credit diligence path",
    steps: [
      { id: "define", label: "Define", short: "What 1 credit buys" },
      { id: "volume", label: "Volume", short: "90-day inputs" },
      { id: "rules", label: "Rules", short: "Rollover / caps" },
      { id: "export", label: "Export", short: "Rights & limits" },
      { id: "quote", label: "Quote", short: "Written scenario" },
    ],
    ctaHref: "/guides/sales-intelligence-total-cost-guide/",
    ctaLabel: "Total cost guide →",
    figure: {
      src: "/guides/sales-intelligence-credits-explained-map.png",
      alt: "Credit diligence path: define one credit, model 90-day volume, check rollover and caps, verify export rights, get a written quote.",
      caption:
        "Decode the unit before you compare included credit counts across vendors.",
    },
  },
  {
    type: "figure",
    id: "credit-anatomy",
    title: "Anatomy of a credit model",
    src: "/guides/sales-intelligence-credits-explained-map.png",
    alt: "Diagram of sales intelligence credit anatomy: unlock types, email vs phone pricing, failed reveal rules, rollover, monthly caps, and export gates.",
    caption:
      "Same word “credit,” different bills — map each vendor onto this anatomy before shortlisting.",
  },
  {
    type: "step",
    id: "decode-unit",
    stepNumber: 1,
    heading: "Decode what one credit unlocks",
    body: "Ask in writing: Does one credit reveal an email, a phone, both, or a full person record? Are mobile and direct dial priced differently? Does enrichment of a record you already own use the same pool as net-new search? Do sequence sends or dialer minutes use a separate meter?\n\nExample: Meridian SDR pod finds Vendor A charges one credit per email and two per mobile, while Vendor B charges one credit per “contact unlock” that includes email only — phones are add-on. Comparing “5,000 credits” without that map would have favored the wrong plan.",
    tip: "Paste the vendor’s published credit FAQ next to your must-have channels before the demo.",
    figure: {
      src: "/guides/sales-intelligence-credits-explained-hero.png",
      alt: "Sales intelligence credits hero: credit meter UI with labelled unlocks for email, phone, enrichment, and export.",
      caption:
        "Read the meter legend — what one credit buys is the real price.",
    },
    scenarios: [
      {
        title: "Search & reveal",
        body: "Net-new contacts from database search.",
      },
      {
        title: "Enrichment",
        body: "Fill fields on CRM records you already own.",
      },
      {
        title: "Export / API",
        body: "Bulk pull may burn credits differently than UI view.",
      },
    ],
  },
  {
    type: "step",
    id: "model-volume",
    stepNumber: 2,
    heading: "Model first-90-day volume as inputs — not a fake total",
    body: "List inputs: ICP accounts to cover, contacts per account you will unlock, email vs phone mix, enrichment backfill size, and expected wasted reveals (bad data). Ask each vendor to price that scenario. Do not invent a monthly dollar spend — attach their quote to the inputs.\n\nExample: Harborline models 200 target accounts × ~8 contacts, 70% email / 30% phone intent, plus a one-time 12k-record enrichment. Vendors return written credit estimates; Harborline compares shapes, not homepage “from” prices.",
    tip: "Include a “campaign runs hot” week in the scenario so top-up rules surface before signature.",
    scenarios: [
      {
        title: "Backfill-heavy",
        body: "Large one-time enrichment, then small monthly top-up.",
      },
      {
        title: "Always-on outbound",
        body: "Steady monthly net-new unlocks + sequence volume.",
      },
      {
        title: "Burst launches",
        body: "Quarterly list builds — rollover and top-ups matter most.",
      },
    ],
  },
  {
    type: "checklist",
    id: "credit-checklist",
    title: "Copyable credit diligence checklist",
    copyable: true,
    items: [
      {
        id: "unit",
        label: "What does one credit unlock?",
        description: "Email / phone / person / enrichment row — in writing.",
        order: 0,
      },
      {
        id: "fail",
        label: "Do failed or empty reveals consume credits?",
        description: "Get the refund / retry policy.",
        order: 1,
      },
      {
        id: "rollover",
        label: "Do unused credits roll over?",
        description: "Window length and expiration.",
        order: 2,
      },
      {
        id: "caps",
        label: "Monthly export or API caps?",
        description: "Separate from in-app view limits.",
        order: 3,
      },
      {
        id: "topup",
        label: "How do mid-cycle top-ups work?",
        description: "Price, minimums, plan upgrade pressure.",
        order: 4,
      },
      {
        id: "quote",
        label: "Written quote for our 90-day volume inputs",
        description: "No modeling from marketing “from $X” alone.",
        order: 5,
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Credit mistakes",
    items: [
      {
        title: "Comparing included credit counts raw",
        body: "Different unit definitions make the counts non-comparable.",
      },
      {
        title: "Ignoring failed-reveal burn",
        body: "Bad numbers can empty the pool before usable coverage arrives.",
      },
      {
        title: "Assuming export is free",
        body: "Bulk/API rights may sit on a higher tier or separate meter.",
      },
      {
        title: "No top-up plan",
        body: "Campaign pause mid-month is an adoption failure, not just a billing issue.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is a sales intelligence credit?",
        answer:
          "A vendor-defined billable unlock — commonly an email, phone, enrichment, or export action. Decision rule: get the unit definition in writing before comparing plans.",
      },
      {
        question: "Why can’t I convert credits to a dollar total here?",
        answer:
          "Unit prices and bundles change by vendor and quote. Teach the inputs and attach their pricing — do not invent a SoftwareGlimpse dollar model.",
      },
      {
        question: "Do credits replace seat pricing?",
        answer:
          "Sometimes (pay-as-you-go data). Often both apply. Map seats and credits as separate TCO lines.",
      },
      {
        question: "What should I do next?",
        answer:
          "Run the checklist with every finalist, fold answers into Total Cost and Vendor Questions, then prove burn rate in Trial Evaluation.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/sales-intelligence-total-cost-guide/",
        label: "Total cost guide",
        description: "Where credits sit in TCO.",
      },
      {
        href: "/guides/sales-intelligence-vendor-questions/",
        label: "Vendor questions",
        description: "Ask the same bank every time.",
      },
      {
        href: "/guides/sales-intelligence-trial-evaluation/",
        label: "Trial evaluation",
        description: "Prove credit burn hands-on.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose SI",
        description: "Job-first selection.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence",
        description: "Researched options context.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "choose-cta",
    title: "Decode credits before you shortlist deep",
    body: "Pick the primary job first, then use this checklist on every finalist so “credits included” means the same thing.",
    href: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose SI →",
    variant: "finder",
  },
];

export const salesIntelligenceCreditsExplainedGuide: GuidePage = {
  id: "guide-sales-intelligence-credits-explained",
  slug: "sales-intelligence-credits-explained",
  title: "Sales Intelligence Credits Explained",
  summary:
    "Decode what one credit unlocks, email vs phone pricing, failed reveals, rollover, caps, and export rights — without inventing dollar models.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "pricing-education",
  journeyStage: "evaluate",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/sales-intelligence-credits-explained-hero.png",
    alt: "Sales intelligence credits hero: credit meter with labelled unlocks for email, phone, enrichment, and export.",
  },
  supports: [
    {
      contentId: "content:category:sales-intelligence",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:sales-intelligence-software",
      relationType: "explains-pricing",
      primary: true,
    },
  ],
  nextAction: {
    contentId: "content:best:sales-intelligence-software",
    label: "See Best Sales Intelligence",
  },
  relatedGuideSlugs: [
    "sales-intelligence-total-cost-guide",
    "sales-intelligence-vendor-questions",
    "sales-intelligence-trial-evaluation",
    "how-to-choose-sales-intelligence",
  ],
  blocks: salesIntelligenceCreditsExplainedGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "unit-def",
      label: "Get unit definition in writing",
      description: "What one credit unlocks.",
      order: 0,
    },
    {
      id: "volume-inputs",
      label: "Write 90-day volume inputs",
      description: "Backfill + net-new + channel mix.",
      order: 1,
    },
    {
      id: "export-rules",
      label: "Confirm export / API / top-up rules",
      description: "Before comparing included counts.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "medium-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T08:00:00.000Z",
    publishedAt: "2026-08-17T08:00:00.000Z",
    reviewedAt: "2026-08-17T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Sales Intelligence Credits Explained | SoftwareGlimpse",
    description:
      "What SI credits unlock, email vs phone, failed reveals, rollover, caps, and export rights — buyer checklist, no invented prices.",
    canonicalPath: "/guides/sales-intelligence-credits-explained/",
    indexable: true,
  },
};
