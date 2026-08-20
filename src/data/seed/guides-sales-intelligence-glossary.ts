import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales intelligence glossary — terminology for buyers and operators.
 * Template: softwareglimpse-guide-template-v1
 */
const salesIntelligenceGlossaryBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Sales intelligence terminology describes how you find and refresh contact data (coverage, match rate, waterfall enrichment), how you pay for it (credits, unlocks, exports), how you act on it (sequences, dialer, dispositions), and how you stay deliverable and compliant (verification, warm-up, lawful basis). Decision rule: if you can map a real outbound sentence onto those terms, vendor pitches stop sounding more different than they are.",
    bullets: [
      "Credits & unlocks",
      "Match rate",
      "Waterfall enrichment",
      "Intent data",
      "Deliverability",
      "CRM sync / overwrite",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Credits are the real unit of cost",
        body: "Ask what one credit buys (email, mobile, export) and whether unused credits roll over.",
      },
      {
        label: "Match rate is local",
        body: "A vendor’s global fill percentage means little until you test your own account list.",
      },
      {
        label: "Waterfall ≠ magic",
        body: "Chaining providers can raise fill rates — and also raise cost, latency, and compliance complexity.",
      },
      {
        label: "Vendors rename the same ideas",
        body: "Credits, points, unlocks, and “lookups” may map to the same consumption model — ask for the unit economics.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "term-map",
    title: "Glossary map",
    steps: [
      { id: "find", label: "Find", short: "Coverage / ICP filters" },
      { id: "fill", label: "Fill", short: "Enrich / match rate" },
      { id: "pay", label: "Pay", short: "Credits / unlocks" },
      { id: "signal", label: "Signal", short: "Intent data" },
      { id: "send", label: "Send", short: "Deliverability" },
      { id: "govern", label: "Govern", short: "Sync & compliance" },
    ],
    ctaHref: "/guides/types-of-sales-intelligence/",
    ctaLabel: "Types of sales intelligence →",
    figure: {
      src: "/guides/sales-intelligence-glossary-term-map.png",
      alt: "Glossary map linking find, fill, pay, signal, send, and govern sales intelligence terms.",
      caption: "Learn terms as a connected map — not an alphabetical dump.",
    },
  },
  {
    type: "figure",
    id: "entity-map",
    title: "How the core terms connect",
    src: "/guides/sales-intelligence-glossary-hero.png",
    alt: "Illustrated sales intelligence glossary with cards for credits, match rate, waterfall enrichment, intent data, deliverability, and CRM sync.",
    caption: "Learn relationships once — then vendor labels are easier to translate.",
  },
  {
    type: "step",
    id: "data-terms",
    stepNumber: 1,
    heading: "Data, enrichment, and coverage terms",
    body: "These terms describe how you find people and complete records.\n\nExample: “We searched 200 of our mid-market IT accounts and got a 62% email match rate, then ran waterfall enrichment on the misses” maps to Coverage sample → Match rate → Waterfall enrichment — not three unrelated buzzwords.",
    tip: "Always ask for match rate on your sample — never accept a global “accuracy” slide as proof.",
    scenarios: [
      {
        title: "Coverage",
        body: "How well a database represents your ICP (titles, regions, company sizes) — not total global records.",
      },
      {
        title: "Match rate",
        body: "Share of your input accounts or contacts that return a usable email, phone, or firmographic field.",
      },
      {
        title: "Waterfall enrichment",
        body: "Querying multiple data providers in sequence until a field is filled — higher fill, higher complexity.",
      },
      {
        title: "Verification",
        body: "Checking whether an email or phone is likely valid before you send or dial.",
      },
    ],
  },
  {
    type: "step",
    id: "credit-intent-terms",
    stepNumber: 2,
    heading: "Credits, intent, and outreach vocabulary",
    body: "Buying and acting language is where product pitches get noisy. Keep definitions boring and precise.\n\nExample: “We burned 3,000 credits unlocking mobiles, then used intent spikes to prioritize the sequence” maps to Credits = consumption unit, Unlock = reveal contact field, Intent data = buying-signal layer — not a single mysterious AI score.",
    scenarios: [
      {
        title: "Credit / unlock",
        body: "The unit you spend to reveal or export a contact field. Confirm email vs mobile pricing separately.",
      },
      {
        title: "Intent data",
        body: "Signals that an account may be researching a topic — useful for prioritization, not a substitute for a real ICP.",
      },
      {
        title: "Sequence / cadence",
        body: "A multistep outreach plan (email, LinkedIn, call) with exit rules when someone replies.",
      },
      {
        title: "Disposition",
        body: "The logged outcome of a call attempt (connected, voicemail, wrong number) — critical for dialer coaching.",
      },
    ],
  },
  {
    type: "step",
    id: "deliverability-governance",
    stepNumber: 3,
    heading: "Deliverability, sync, and compliance terms",
    body: "These terms describe how outreach stays healthy and how data lands in the CRM without destroying trust.\n\nExample: after a bounce spike, the team paused sequences, checked warm-up and SPF/DKIM, tightened verification, and set CRM overwrite rules so enrichment could not wipe owner notes — deliverability and governance, not “buy more credits.”",
    tip: "Name a compliance owner before prospecting in regulated regions — vendor terms are not your lawful basis.",
    scenarios: [
      {
        title: "Deliverability",
        body: "Whether your emails reach inboxes — domain reputation, authentication, warm-up, and list quality all contribute.",
      },
      {
        title: "CRM sync / overwrite rules",
        body: "How fields flow into the CRM and which source wins when values conflict — decide before bulk enrich.",
      },
      {
        title: "Lawful basis / opt-out",
        body: "Your legal ground for processing and contacting people, plus how unsubscribes and suppressions are honored.",
      },
      {
        title: "Suppression list",
        body: "Contacts who must not be emailed or dialed — customers, competitors, do-not-contact, and opt-outs.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "confused-pairs",
    title: "Often-confused term pairs",
    rows: [
      {
        feature: "Coverage vs database size",
        mustHave: true,
        niceToHave: false,
        notes: "Your ICP vs global count",
      },
      {
        feature: "Credit vs seat price",
        mustHave: true,
        niceToHave: false,
        notes: "Consumption vs access",
      },
      {
        feature: "Match rate vs “accuracy” slide",
        mustHave: true,
        niceToHave: false,
        notes: "Your sample vs marketing claim",
      },
      {
        feature: "Intent vs ICP",
        mustHave: false,
        niceToHave: true,
        notes: "Signal vs who you sell to",
      },
      {
        feature: "Enrichment vs CRM system of record",
        mustHave: true,
        niceToHave: false,
        notes: "Feed vs overwrite carefully",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Glossary mistakes in buying conversations",
    items: [
      {
        title: "Assuming identical labels mean identical credit models",
        body: "Ask what object a credit unlocks — email, mobile, or full export — and whether verification costs extra.",
      },
      {
        title: "Treating “AI” as a noun with no object",
        body: "Ask which fields or recommendations change, and who verifies them before outreach.",
      },
      {
        title: "Ignoring overwrite vocabulary",
        body: "Sync without field-level rules can wipe owner notes and custom CRM data.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What do the main sales intelligence terms mean?",
        answer:
          "Coverage and match rate describe how well data fits your accounts; credits and unlocks describe how you pay to reveal fields; waterfall enrichment chains providers to fill gaps; intent prioritizes accounts; deliverability and CRM sync keep outreach and records healthy. Map real outbound talk onto those terms and demos get clearer.",
      },
      {
        question: "What is a credit in sales intelligence software?",
        answer:
          "A credit is usually the unit spent to unlock or export a contact field (often email or mobile). Confirm what one credit buys, whether mobiles cost more, and whether unused credits roll over.",
      },
      {
        question: "What is waterfall enrichment?",
        answer:
          "Waterfall enrichment queries multiple data sources in order until a field is filled. It can raise match rates but also cost, latency, and compliance complexity — test fill rate and cost on your sample.",
      },
      {
        question: "What is intent data?",
        answer:
          "Intent data are signals that an account may be researching a topic. Use it to prioritize outreach within your ICP — not as a substitute for knowing who you sell to.",
      },
      {
        question: "What should I read next?",
        answer:
          "Types of Sales Intelligence shows how these terms map to product shapes; How to Choose Sales Intelligence applies them in evaluation.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/types-of-sales-intelligence/",
        label: "Types of sales intelligence",
        description: "Product shapes explained.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose sales intelligence",
        description: "Buying framework using this vocabulary.",
      },
      {
        href: "/guides/sales-intelligence-benefits/",
        label: "Sales intelligence benefits",
        description: "Why the vocabulary matters.",
      },
      {
        href: "/guides/sales-intelligence-examples/",
        label: "Sales intelligence examples",
        description: "Terms in real team scenarios.",
      },
      {
        href: "/guides/common-sales-intelligence-mistakes/",
        label: "Common SI mistakes",
        description: "Where definitions get ignored.",
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
    title: "Use the vocabulary when you shortlist",
    body: "Best Sales Intelligence Software uses researched criteria — credits, coverage, sync — without affiliate-ordered rankings.",
    href: "/best/sales-intelligence-software/",
    ctaLabel: "See Best Sales Intelligence →",
    variant: "finder",
  },
];

export const salesIntelligenceGlossaryGuide: GuidePage = {
  id: "guide-sales-intelligence-glossary",
  slug: "sales-intelligence-glossary",
  title: "Sales Intelligence Glossary: Credits, Match Rate, Intent & More",
  summary:
    "A plain-language sales intelligence glossary covering credits, match rate, waterfall enrichment, intent data, deliverability, CRM sync, and compliance terms buyers actually need.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "fundamental",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/sales-intelligence-glossary-hero.png",
    alt: "Illustrated sales intelligence glossary with cards for credits, match rate, waterfall enrichment, intent, deliverability, and CRM sync.",
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
    "types-of-sales-intelligence",
    "how-to-choose-sales-intelligence",
    "sales-intelligence-benefits",
    "sales-intelligence-examples",
    "common-sales-intelligence-mistakes",
    "sales-intelligence-vs-spreadsheet",
  ],
  blocks: salesIntelligenceGlossaryBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "credits",
      label: "Know credit / unlock terms",
      description: "What one credit buys; email vs mobile.",
      order: 0,
    },
    {
      id: "match",
      label: "Define match rate on your sample",
      description: "Your accounts — not a global slide.",
      order: 1,
    },
    {
      id: "govern",
      label: "Learn sync & compliance terms",
      description: "Overwrite rules, deliverability, lawful basis.",
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
    title: "Sales Intelligence Glossary: Key Terms Explained | SoftwareGlimpse",
    description:
      "Sales intelligence glossary for buyers — credits, match rate, waterfall enrichment, intent data, deliverability, and CRM sync in plain language.",
    canonicalPath: "/guides/sales-intelligence-glossary/",
    indexable: true,
  },
};
