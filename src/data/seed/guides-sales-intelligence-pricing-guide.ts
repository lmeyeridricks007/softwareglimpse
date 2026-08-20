import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales intelligence pricing guide — seats, credits, first 90 days.
 * Template: softwareglimpse-guide-template-v1
 * Educational only — no invented list prices or dollar totals.
 */
const salesIntelligencePricingGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Sales intelligence pricing is usually a mix of seats, credits, and sometimes pay-as-you-go packs — the headline “from” seat price rarely includes the credit burn your first 90 days will need. Decision rule: do not compare tools on marketing starting prices; map must-haves to the qualifying plan, decode what one credit unlocks, then compare written quotes for the same backfill + monthly net-new + export-rights assumptions.",
    bullets: [
      "Seats vs credits",
      "Pay-as-you-go packs",
      "What a credit unlocks",
      "Export caps",
      "First-90-day quote compare",
      "No invented dollar totals",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Seat price is not the bill",
        body: "Credits, export rights, and mid-cycle top-ups often decide the commercial outcome.",
      },
      {
        label: "A credit is a product definition",
        body: "One vendor’s credit may unlock an email; another may charge separately for mobiles or exports.",
      },
      {
        label: "Compare quotes on the same 90-day volume",
        body: "Backfill, monthly net-new, and who needs export seats — same assumptions for every finalist.",
      },
      {
        label: "Bands beat fake precision",
        body: "Use vendor-written quotes and published pricing pages; never invent list prices or totals in a memo.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "pricing-path",
    title: "Pricing literacy path",
    steps: [
      { id: "model", label: "Model", short: "Seats / credits / PAYG" },
      { id: "credit", label: "Credit", short: "What one unlocks" },
      { id: "gates", label: "Gates", short: "Must → plan" },
      { id: "volume", label: "Volume", short: "90-day shape" },
      { id: "quote", label: "Quote", short: "Written compare" },
    ],
    ctaHref: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "Selection framework →",
    figure: {
      src: "/guides/sales-intelligence-pricing-guide-90-days.png",
      alt: "Compare sales intelligence quotes for first 90 days: backfill volume, monthly net-new, seats needing export, credit definition, rollover and top-ups, written quote side-by-side.",
      caption:
        "Same volume assumptions for every finalist — then read credit definitions side by side.",
    },
  },
  {
    type: "figure",
    id: "models-visual",
    title: "Common pricing models",
    src: "/guides/sales-intelligence-pricing-guide-models.png",
    alt: "Three sales intelligence pricing model cards: per-seat subscription, credit packs, and pay-as-you-go — no dollar figures.",
    caption:
      "Match the model to usage shape: ongoing pods lean seats+credits; one-off backfills often fit packs or pay-as-you-go.",
  },
  {
    type: "step",
    id: "read-models",
    stepNumber: 1,
    heading: "Recognize seats, credits, and pay-as-you-go",
    body: "Most catalogue tools combine a per-seat plan with a credit pool. Some sell credit packs or pay-as-you-go exports with little seat overhead. Feature gates (CRM sync, API, bulk export, dialer minutes) often sit above entry tiers — ask how those are licensed without claiming a specific product’s unpublished price as fact.\n\nExample: a solo RevOps owner with a one-off enrichment pass on ~18,000 records usually fits pay-as-you-go or a credit pack (BookYourData-style or similar) better than an annual multi-seat platform. A five-seat outbound pod using Apollo, Amplemarket, or Reply-style engagement week after week usually needs seats plus a predictable monthly credit budget.",
    tip: "Screenshot the exact plan name shown in demo — demos often use higher tiers than the “from” tile.",
    figure: {
      src: "/guides/sales-intelligence-pricing-guide-hero.png",
      alt: "Anatomy of sales intelligence pricing: seats, credits, export caps, mid-cycle top-ups, and adjacent tools feeding a first-90-days quote compare — no dollar amounts.",
      caption:
        "Read commercials bottom-up from credit definition and must-have gates — not top-down from the cheapest seat tile.",
    },
    scenarios: [
      {
        title: "Per-seat + credits",
        body: "Ongoing teams: seats unlock the product; credits unlock records and sometimes phones.",
      },
      {
        title: "Credit packs",
        body: "Prepaid pools for list buys or enrichment bursts — confirm expiry and rollover.",
      },
      {
        title: "Pay-as-you-go",
        body: "Buy only what you export — watch per-record quality and refund rules for bad emails.",
      },
    ],
  },
  {
    type: "step",
    id: "decode-credits",
    stepNumber: 2,
    heading: "Decode what one credit actually buys",
    body: "Ask in writing: does one credit unlock a work email, a mobile, a full contact card, or a reveal in-app only? Do emails and phones cost differently? Do credits roll over? Is there a monthly export or API cap? Can you buy top-ups mid-campaign without a plan upgrade?\n\nExample: an SDR pod comparing Lusha, RocketReach, and Closely runs the same 200-account coverage test, then asks each vendor to price the same first-90-day volume: initial backfill, monthly net-new, and three seats with export rights. The winner is the quote they understand — not the lowest “from” seat number on a homepage.",
    tip: "If a vendor will not define a credit in writing, treat commercial clarity as a failed criterion.",
    scenarios: [
      {
        title: "Reveal vs export",
        body: "In-app views can be cheaper than bulk export — confirm which you need for CRM and warehouse.",
      },
      {
        title: "Email vs phone",
        body: "Phone-led teams often burn credits faster; model dials separately from email-only plans.",
      },
      {
        title: "Mid-cycle top-ups",
        body: "Campaign spikes without top-up options force idle seats or emergency upgrades.",
      },
    ],
  },
  {
    type: "step",
    id: "compare-90-days",
    stepNumber: 3,
    heading: "Compare written quotes for the first 90 days",
    body: "Build one volume sheet and send it to every finalist: (1) backfill or initial enrichment volume, (2) expected monthly net-new contacts, (3) seats who need login vs export rights, (4) channels (email / phone / LinkedIn), (5) CRM sync and API requirements. Attach your must-have sheet so they map gates to a plan name.\n\nDo not invent totals in your business case. Paste vendor quotes, note published pricing page dates, and qualify with bands when a line is still TBD. Adjacent spend (CRM, sequencer, dialer like Kixie) stays on a separate stack line — SI rarely replaces those tools.",
    tip: "Refuse to compare a pay-as-you-go quote against an annual seat quote until both cover the same 90-day volume.",
    scenarios: [
      {
        title: "Healthy compare",
        body: "Same volume sheet + written credit definitions + plan names that unlock must-haves.",
      },
      {
        title: "Unfair compare",
        body: "Homepage “from” seats vs a full-platform quote that includes export and phones.",
      },
      {
        title: "Stack honesty",
        body: "Count CRM + sequencer + dialer you still pay for after the SI line item.",
      },
    ],
  },
  {
    type: "cost-breakdown",
    id: "price-lines",
    title: "What “price” usually includes",
    body: "Subscription and usage lines to separate before calling anything a total. SoftwareGlimpse does not invent dollar figures here — fill amounts from vendor quotes and published pages only.",
    lines: [
      {
        label: "Seats × qualifying plan",
        description:
          "Daily users on the tier that includes must-haves (sync, export, dialer minutes as needed).",
      },
      {
        label: "Credits for first 90 days",
        description:
          "Backfill + monthly net-new using the vendor’s credit definition — not a marketing average.",
      },
      {
        label: "Export / API rights",
        description:
          "Often gated; confirm before signing if CRM or warehouse sync depends on them.",
      },
      {
        label: "Mid-cycle top-ups",
        description:
          "What you pay when a campaign runs hot before renewal.",
      },
      {
        label: "Adjacent tools still needed",
        description:
          "CRM, sequencer, dialer, or enrichment API you will still pay for separately.",
      },
    ],
  },
  {
    type: "callout",
    id: "no-invented-prices",
    title: "Pricing honesty",
    tone: "warning",
    body: "SoftwareGlimpse does not invent list prices, credit unit costs, or “typical” dollar totals in this guide. Use each vendor’s published pricing page and a written quote for your volume; qualify with bands when research is incomplete.",
  },
  {
    type: "checklist",
    id: "quote-checklist",
    title: "First-90-day quote checklist",
    copyable: true,
    items: [
      {
        id: "volume-sheet",
        label: "Volume sheet written",
        description: "Backfill, monthly net-new, seats, channels.",
        order: 0,
      },
      {
        id: "credit-def",
        label: "Credit definition in writing",
        description: "Email vs phone, reveal vs export, rollover.",
        order: 1,
      },
      {
        id: "plan-map",
        label: "Must-haves mapped to plan name",
        description: "Sync, export, dialer, API gates listed.",
        order: 2,
      },
      {
        id: "top-ups",
        label: "Top-up and cap rules noted",
        description: "Monthly caps and mid-cycle purchase path.",
        order: 3,
      },
      {
        id: "stack",
        label: "Adjacent stack lines listed",
        description: "CRM / sequencer / dialer still required.",
        order: 4,
      },
    ],
  },
  {
    type: "product-shortlist",
    id: "examples",
    title: "Catalogue examples (not a ranking)",
    body: "Alphabetical catalogue examples you may ask for quotes — not a price ranking and not affiliate-ordered. Compare only after credit definitions and 90-day volumes match.",
    productSlugs: [
      "amplemarket",
      "apollo",
      "bookyourdata",
      "closely",
      "kixie",
      "lusha",
      "reply",
      "rocketreach",
    ],
    disclaimer:
      "Affiliate relationships never determine which products appear here or in what order. No prices are implied.",
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Pricing mistakes",
    items: [
      {
        title: "Comparing homepage “from” seats",
        body: "Must-haves and credits usually live on higher tiers — compare qualifying plans only.",
      },
      {
        title: "Ignoring what a credit unlocks",
        body: "Per-seat numbers look similar until mobiles or exports are priced separately.",
      },
      {
        title: "Inventing totals for the business case",
        body: "Paste quotes and published pages; use bands when a line is unknown.",
      },
      {
        title: "Forgetting adjacent tools",
        body: "A data buy rarely removes CRM, sequencer, or dialer spend — count the stack.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How does sales intelligence pricing work?",
        answer:
          "Usually per-seat plans plus credits (or credit packs / pay-as-you-go). Feature gates and export rights often sit above entry tiers. Compare written quotes for the same first-90-day volume — not marketing starting prices.",
      },
      {
        question: "What is a credit?",
        answer:
          "A vendor-defined unit that unlocks a reveal, email, phone number, or full contact export — definitions differ. Always get the definition, rollover, and caps in writing before you model cost.",
      },
      {
        question: "Should we buy annual seats or pay-as-you-go?",
        answer:
          "Ongoing pods with steady weekly volume often fit seats plus credits. One-off backfills and sporadic list buys often fit pay-as-you-go or packs. Example: the solo RevOps enrichment pass is a poor fit for a multi-seat annual platform until monthly net-new is proven.",
      },
      {
        question: "How much does sales intelligence cost?",
        answer:
          "SoftwareGlimpse does not publish invented totals. Use each vendor’s pricing page and a written quote for your backfill, monthly net-new, and export seats. See Best Sales Intelligence Software for researched options — not for fabricated price tables.",
      },
      {
        question: "What should I do next?",
        answer:
          "Freeze must-haves on the feature checklist, send the same 90-day volume sheet to finalists, then finish selection with How to choose sales intelligence and the Best page shortlist.",
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
        label: "How to choose sales intelligence",
        description: "Job-first selection and trial plan.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence software",
        description: "Researched shortlist with methodology.",
      },
      {
        href: "/guides/sales-intelligence-feature-checklist/",
        label: "SI feature checklist",
        description: "Must-haves before you ask for quotes.",
      },
      {
        href: "/guides/do-i-need-sales-intelligence/",
        label: "Do I need sales intelligence?",
        description: "Confirm need before commercial depth.",
      },
      {
        href: "/guides/crm-pricing-guide/",
        label: "CRM pricing guide",
        description: "Seat and gate literacy for the system of record.",
      },
      {
        href: "/categories/sales-intelligence/",
        label: "Sales intelligence category",
        description: "Browse the catalogue.",
      },
      {
        href: "/software/bookyourdata/",
        label: "BookYourData review",
        description: "Example pay-as-you-go list model.",
      },
      {
        href: "/software/apollo/",
        label: "Apollo.io review",
        description: "Example seat + credit platform.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "shortlist-cta",
    title: "Compare researched options",
    body: "Once credit definitions and must-haves are clear, shortlist with the published sales intelligence methodology — not affiliate-ordered price tiles.",
    href: "/best/sales-intelligence-software/",
    ctaLabel: "See Best Sales Intelligence Software →",
    variant: "generic",
  },
];

export const salesIntelligencePricingGuide: GuidePage = {
  id: "guide-sales-intelligence-pricing-guide",
  slug: "sales-intelligence-pricing-guide",
  title: "Sales Intelligence Pricing Guide: Seats, Credits & First 90 Days",
  summary:
    "Learn how sales intelligence pricing works — seats vs credits vs pay-as-you-go, what a credit unlocks, and how to compare written quotes for the first 90 days — without invented price tables.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [
    "apollo",
    "lusha",
    "rocketreach",
    "amplemarket",
    "closely",
    "bookyourdata",
    "reply",
    "kixie",
  ],
  topicType: "pricing-education",
  journeyStage: "choose",
  knowledgeAreaSlug: "selection",
  heroVisual: {
    src: "/guides/sales-intelligence-pricing-guide-hero.png",
    alt: "Sales intelligence pricing anatomy: seats, credits, export caps, top-ups, and first-90-day quote compare — no dollar totals.",
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
    "how-to-choose-sales-intelligence",
    "sales-intelligence-feature-checklist",
    "do-i-need-sales-intelligence",
    "crm-pricing-guide",
  ],
  blocks: salesIntelligencePricingGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "model",
      label: "Name the pricing model",
      description: "Seats, credits, packs, or pay-as-you-go.",
      order: 0,
    },
    {
      id: "credit",
      label: "Decode one credit in writing",
      description: "Email vs phone, reveal vs export, rollover.",
      order: 1,
    },
    {
      id: "quote",
      label: "Compare first-90-day quotes",
      description: "Same volume sheet for every finalist.",
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
    title: "Sales Intelligence Pricing Guide | SoftwareGlimpse",
    description:
      "Understand sales intelligence pricing — seats, credits, pay-as-you-go, and how to compare first-90-day quotes — without invented price tables.",
    canonicalPath: "/guides/sales-intelligence-pricing-guide/",
    indexable: true,
  },
};
