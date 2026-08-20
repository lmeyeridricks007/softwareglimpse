import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales intelligence benefits — outcomes by role and shape (no invented ROI dollars).
 * Template: softwareglimpse-guide-template-v1
 */
const salesIntelligenceBenefitsBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Sales intelligence benefits show up as operational results: faster list building, higher match rates on known accounts, fewer wasted dials and bounces, cleaner CRM records, and outreach that uses current contact data. Decision rule: if the team will not define ICP, manage credits, and keep CRM sync rules honest, those benefits will not appear — buy process discipline first, then the tool.",
    bullets: [
      "Faster list building",
      "Higher match / fill rates",
      "Fewer bad contacts",
      "Cleaner CRM fields",
      "Prioritized outreach",
      "Less spreadsheet rebuild",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Benefits are team outcomes",
        body: "SI value shows up as fewer dead emails, faster weekly lists, and less manual research — not as a magic feature list.",
      },
      {
        label: "Shape decides which benefits you get",
        body: "Data tools improve discovery; enrichment improves completeness; engagement improves follow-through; dialers improve connect volume.",
      },
      {
        label: "Credits and hygiene unlock benefits",
        body: "An unused seat or a burned credit pool delivers no benefit. Match rate checks and overwrite rules matter as much as the vendor.",
      },
      {
        label: "No invented ROI theater",
        body: "Ignore vague “increase pipeline by X%” claims without a measurement method tied to your ICP and process.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "benefit-path",
    title: "Where sales intelligence benefits come from",
    steps: [
      { id: "define", label: "Define ICP", short: "Who you target" },
      { id: "source", label: "Source", short: "Find or enrich" },
      { id: "verify", label: "Verify", short: "Match & deliverability" },
      { id: "sync", label: "Sync", short: "CRM field rules" },
      { id: "act", label: "Act", short: "Sequence or dial" },
      { id: "improve", label: "Improve", short: "Credit & coverage review" },
    ],
    ctaHref: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose sales intelligence →",
    figure: {
      src: "/guides/sales-intelligence-benefits-path.png",
      alt: "Benefit path from ICP definition through source, verify, sync, act, and improve.",
      caption: "SI benefits show up when each step reduces manual research and dead-end outreach.",
    },
  },
  {
    type: "figure",
    id: "before-after",
    title: "Before vs after working sales intelligence",
    src: "/guides/sales-intelligence-benefits-hero.png",
    alt: "Before: stale bought lists and spreadsheet research versus after: live sales intelligence with verified contacts feeding CRM and outreach.",
    caption: "Benefits appear when the team trusts current contact data — not a one-time CSV.",
  },
  {
    type: "step",
    id: "benefits-by-role",
    stepNumber: 1,
    heading: "Sales intelligence benefits by role",
    body: "A useful SI stack helps different jobs without forcing everyone into the same workflow. The shared layer is trustworthy contact data; the benefit is less reconstruction work.\n\nExample: on a 5-person outbound team, SDR Maya builds a weekly IT-buyer list in 40 minutes instead of half a day; RevOps Priya refreshes 2,000 CRM mobiles with a match-rate report; AE Jordan dials with local presence and sees dispositions on the deal. Same category — different quiet wins.",
    tip: "Ask each role what they stop doing manually if contact data stays current — that is your benefit hypothesis.",
    scenarios: [
      {
        title: "SDRs / BDRs",
        body: "Faster list builds, clearer seniorities and titles, fewer bounces on first touch.",
      },
      {
        title: "RevOps / data owners",
        body: "Enrichment and field rules keep CRM records complete without manual CSV merges.",
      },
      {
        title: "AEs / phone teams",
        body: "Better numbers and dispositions mean less time chasing dead lines.",
      },
      {
        title: "Managers",
        body: "Coverage and activity reviews use live data instead of last week’s exported sheet.",
      },
    ],
  },
  {
    type: "step",
    id: "pain-to-outcome",
    stepNumber: 2,
    heading: "Common pains sales intelligence is meant to remove",
    body: "Most teams buy SI after a pattern of operational failures — not because a brochure promised transformation. Mapping pain → outcome keeps evaluation honest.\n\nExample: before SI, that outbound team lost two days each week to LinkedIn scraping and a stale bought list. After a data tool with ICP filters and credit tracking, weekly list time dropped and bounce rate fell — the pain (manual research + dead contacts) maps to a concrete outcome (faster lists + verified emails).",
    tip: "Benefit claims should map to a concrete operational pain you can measure in a two-week trial.",
    scenarios: [
      {
        title: "Slow list building",
        body: "Searchable ICP filters reduce half-day research rituals into a repeatable weekly job.",
      },
      {
        title: "Stale CRM fields",
        body: "Enrichment + overwrite rules refresh emails and phones without wiping owner notes.",
      },
      {
        title: "Wasted outreach",
        body: "Verification and deliverability hygiene cut bounces and dead dials before sequences run hot.",
      },
    ],
  },
  {
    type: "size-match",
    id: "when-benefits-show",
    title: "When benefits usually show up",
    tiers: [
      {
        id: "founder",
        label: "Founder-led",
        description:
          "Benefits are modest until volume rises — a light data or engagement tool may be enough.",
        fitHints: ["Small ICP", "Personal discipline"],
      },
      {
        id: "pod",
        label: "2–8 person outbound pod",
        description:
          "List speed and bounce reduction are usually the first clear wins.",
        fitHints: ["Weekly lists", "Credit owner"],
      },
      {
        id: "scaling",
        label: "Scaling RevOps",
        description:
          "Enrichment, field governance, and match-rate reporting become the high-value benefits.",
        fitHints: ["Overwrite rules", "CRM sync"],
      },
      {
        id: "phone",
        label: "Phone-led org",
        description:
          "Connect rates, local presence, and disposition logging dominate the benefit case.",
        fitHints: ["Dialer + data", "Call logging"],
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "benefit-vs-feature",
    title: "Benefit vs feature checklist",
    rows: [
      {
        feature: "Faster weekly ICP lists",
        mustHave: true,
        niceToHave: false,
        notes: "Needs searchable coverage",
      },
      {
        feature: "Higher email/phone fill rates",
        mustHave: true,
        niceToHave: false,
        notes: "Needs enrichment + match reporting",
      },
      {
        feature: "CRM stays system of record",
        mustHave: true,
        niceToHave: false,
        notes: "Needs sync + overwrite rules",
      },
      {
        feature: "AI “insights” demos",
        mustHave: false,
        niceToHave: true,
        notes: "Not a day-one benefit",
      },
      {
        feature: "Biggest global database claim",
        mustHave: false,
        niceToHave: true,
        notes: "Not proof of your ICP coverage",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Benefit traps",
    items: [
      {
        title: "Buying for aspirational benefits",
        body: "If nobody owns credits or ICP filters, coverage benefits will not appear.",
      },
      {
        title: "Confusing vendor ROI claims with your reality",
        body: "Percent-lift marketing is not evidence for your niche, region, or data quality.",
      },
      {
        title: "Ignoring deliverability cost",
        body: "Fast sequences on unverified data can burn domains — a reverse benefit.",
      },
      {
        title: "Measuring only seat cost",
        body: "Credit overages and wasted dials cost more than a slightly higher plan the team uses well.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What are the main benefits of sales intelligence software?",
        answer:
          "Operational ones: faster ICP list building, higher match and fill rates on known accounts, fewer bounces and dead dials, cleaner CRM fields via governed sync, and outreach that uses current contact data. Those only appear when credits, ICP filters, and CRM rules are maintained.",
      },
      {
        question: "What is the biggest benefit of sales intelligence?",
        answer:
          "For most outbound teams: trustworthy, current contact data on the accounts they actually sell to — so research and outreach stop reconstructing the same list every week.",
      },
      {
        question: "Will sales intelligence automatically increase revenue?",
        answer:
          "Not by itself. It can reduce wasted touches and speed list building — pipeline impact depends on ICP fit, messaging, and process. Treat vague “X% revenue lift” claims without a measurement method as marketing, not evidence.",
      },
      {
        question: "How soon should we see benefits?",
        answer:
          "List speed and bounce reduction can appear within weeks if coverage matches your ICP. CRM trust and deliverability hygiene usually take longer — after sync rules and sending setup stick.",
      },
      {
        question: "What should I read next?",
        answer:
          "Review Sales Intelligence Examples for concrete scenarios, then How to Choose Sales Intelligence — or compare researched options on Best Sales Intelligence Software.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/sales-intelligence-examples/",
        label: "Sales intelligence examples",
        description: "Concrete scenarios by team type.",
      },
      {
        href: "/guides/types-of-sales-intelligence/",
        label: "Types of sales intelligence",
        description: "Shapes behind the benefits.",
      },
      {
        href: "/guides/sales-intelligence-glossary/",
        label: "Sales intelligence glossary",
        description: "Credits, match rate, intent.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose sales intelligence",
        description: "Turn benefits into a buying brief.",
      },
      {
        href: "/guides/sales-intelligence-vs-spreadsheet/",
        label: "SI vs spreadsheet / bought lists",
        description: "When live data beats stale CSVs.",
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
    title: "Turn benefits into a shortlist",
    body: "If the benefits above match your pains, use Best Sales Intelligence Software to compare researched products — rankings ignore affiliate commissions.",
    href: "/best/sales-intelligence-software/",
    ctaLabel: "See Best Sales Intelligence →",
    variant: "finder",
  },
];

export const salesIntelligenceBenefitsGuide: GuidePage = {
  id: "guide-sales-intelligence-benefits",
  slug: "sales-intelligence-benefits",
  title: "Sales Intelligence Benefits: What Teams Actually Gain",
  summary:
    "See the practical benefits of sales intelligence for SDRs, RevOps, AEs, and managers — faster lists, higher match rates, cleaner CRM data, and fewer wasted touches — without invented ROI percentages.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "fundamental",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/sales-intelligence-benefits-hero.png",
    alt: "Before stale lists versus after live sales intelligence with verified contacts feeding CRM and outreach.",
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
    "sales-intelligence-examples",
    "sales-intelligence-glossary",
    "how-to-choose-sales-intelligence",
    "sales-intelligence-vs-spreadsheet",
    "common-sales-intelligence-mistakes",
  ],
  blocks: salesIntelligenceBenefitsBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "pains",
      label: "List top operational pains",
      description: "List speed, match rate, bounces, CRM gaps.",
      order: 0,
    },
    {
      id: "roles",
      label: "Map benefits by role",
      description: "SDR, RevOps, AE, manager.",
      order: 1,
    },
    {
      id: "discipline",
      label: "Name operating requirements",
      description: "Who owns ICP filters and credits?",
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
    title: "Sales Intelligence Benefits for Outbound Teams | SoftwareGlimpse",
    description:
      "Practical sales intelligence benefits — list speed, match rates, CRM hygiene, and fewer wasted touches — explained without invented ROI claims.",
    canonicalPath: "/guides/sales-intelligence-benefits/",
    indexable: true,
  },
};
