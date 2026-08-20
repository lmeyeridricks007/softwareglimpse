import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Do I need sales intelligence? — SI signals vs CRM/process-first.
 * Template: softwareglimpse-guide-template-v1
 */
const doINeedSalesIntelligenceBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "You need sales intelligence when list building, contact completeness, or outbound execution is the bottleneck — not when ownership, stages, and follow-ups are already broken in the CRM. Decision rule: if weekly pipeline fails because contacts are missing, stale, or unreachable, buy SI for that job; if weekly pipeline fails because nobody owns deals or updates stages, fix CRM and process first.",
    bullets: [
      "List building stuck",
      "CRM empty contact fields",
      "No dialer for volume",
      "Spreadsheet lists dying",
      "CRM/process may be the real problem",
      "Buy for the blocking job",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Sales intelligence is a data and execution layer",
        body: "It feeds a system of record — it does not replace ownership, stages, or follow-up discipline.",
      },
      {
        label: "Four jobs, one category",
        body: "Data, enrichment, engagement, and dialer fail for different reasons. Name the blocking job before you shortlist.",
      },
      {
        label: "Pain signals beat headcount rules",
        body: "Empty CRM fields and dying CSV lists are clearer triggers than “we should buy Apollo because competitors have it.”",
      },
      {
        label: "CRM chaos masquerades as a data problem",
        body: "If stages and owners are fiction, better contact data will not create a trustworthy pipeline board.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "need-framework",
    title: "Do you need sales intelligence? A simple path",
    steps: [
      { id: "volume", label: "Volume", short: "Lists & channels" },
      { id: "gaps", label: "Data gaps", short: "Missing fields" },
      { id: "execution", label: "Execution", short: "Sequences / dialer" },
      { id: "crm", label: "CRM health", short: "Owners & stages" },
      { id: "decide", label: "Decide", short: "SI, CRM, or wait" },
    ],
    ctaHref: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose →",
    figure: {
      src: "/guides/do-i-need-sales-intelligence-path.png",
      alt: "Do you need sales intelligence path: volume and channels, data gaps, execution gaps, CRM health, then decide SI vs fix CRM first.",
      caption:
        "Need is driven by data and execution bottlenecks — not by brand shopping. If CRM ownership is broken, fix that first.",
    },
  },
  {
    type: "figure",
    id: "signals-visual",
    title: "Signals you likely need sales intelligence",
    src: "/guides/do-i-need-sales-intelligence-signals.png",
    alt: "Four signal cards: list building stuck, CRM empty contact fields, no dialer for phone volume, and spreadsheet lists dying.",
    caption:
      "Two or more recurring signals usually mean a contact database, enrichment pass, sequencer, or dialer — not another spreadsheet tab.",
  },
  {
    type: "step",
    id: "pain-signals",
    stepNumber: 1,
    heading: "Signals that point to “yes”",
    body: "Treat these as operational evidence — not vendor pressure. If several show up weekly, you are already paying the cost of missing data or outbound tooling.\n\nExample: a three-person SDR pod at a 40-person B2B SaaS company starts every Monday without a fresh ICP list. Their CRM has accounts but title and email fields are half empty, and Friday “who did we email?” reviews rebuild from personal CSVs. Those list-building and empty-field signals mean they need sales intelligence for data (and likely enrichment) — not another CRM module.",
    tip: "Write down the last three weeks of outbound work. If “we had no list” or “emails bounced / wrong titles” appears, you have an SI-shaped problem.",
    figure: {
      src: "/guides/do-i-need-sales-intelligence-hero.png",
      alt: "Decision visual: sales intelligence signals versus CRM or process problems that should be fixed first.",
      caption:
        "SI solves missing and unreachable contacts; CRM solves shared ownership and stage truth.",
    },
    scenarios: [
      {
        title: "List building stuck",
        body: "Reps cannot start the week with verified contacts that match the ICP — search and export are the bottleneck.",
      },
      {
        title: "CRM empty fields",
        body: "Accounts exist but titles, emails, phones, or firmographics are missing or stale — enrichment is the gap.",
      },
      {
        title: "No dialer for volume",
        body: "Phone-led teams hit connect limits because calling still lives in personal phones and manual notes.",
      },
      {
        title: "Spreadsheet lists dying",
        body: "CSV buys go stale within weeks; nobody owns refresh, suppression, or push into CRM.",
      },
    ],
  },
  {
    type: "step",
    id: "crm-first",
    stepNumber: 2,
    heading: "When CRM or process is the real problem",
    body: "Buying a contact database will not fix dual ownership, missed follow-ups, or a pipeline rebuilt from inboxes. If stages and owners are already unreliable, sales intelligence will push more records into chaos.\n\nExample: a five-person agency with two sellers already fights over who owns the same prospect. Empty email fields are real — but Friday reviews still start with a 40-minute inbox rebuild. They need CRM ownership and a weekly board habit first; enrichment can wait until someone trusts the record they enrich.",
    tip: "If “we forgot” or “two people thought they owned it” appears more often than “we had no emails,” fix CRM before SI.",
    figure: {
      src: "/guides/do-i-need-sales-intelligence-crm-first.png",
      alt: "When CRM or process is the real problem: no owners, stages never updated, and inbox as system of record — fix those before buying sales intelligence.",
      caption:
        "A clean CRM with thin contact data beats a full SI export into a board nobody updates.",
    },
    scenarios: [
      {
        title: "No clear owners",
        body: "Contacts and deals lack a named owner — enrichment will create more contested records.",
      },
      {
        title: "Stages never updated",
        body: "Pipeline truth lives in Slack; better lists will not create Friday visibility.",
      },
      {
        title: "Inbox as system of record",
        body: "History and next steps live in mailboxes — adopt CRM discipline before adding a data source.",
      },
    ],
  },
  {
    type: "size-match",
    id: "fit-by-situation",
    title: "Situation → likely answer",
    tiers: [
      {
        id: "solo-light",
        label: "Solo / low volume",
        description:
          "Pay-as-you-go credits or a light list tool is often enough until weekly list building becomes a chore.",
        fitHints: ["Credit packs", "Browser lookups"],
      },
      {
        id: "sdr-pod",
        label: "SDR pod, empty lists",
        description:
          "Sales intelligence for data (and maybe engagement) is usually required when Monday starts without verified ICP contacts.",
        fitHints: ["Coverage test", "CRM push"],
      },
      {
        id: "phone-led",
        label: "Phone-led outbound",
        description:
          "A dialer-shaped SI buy fits when connect volume — not list size — is the weekly constraint.",
        fitHints: ["Local presence", "CRM call log"],
      },
      {
        id: "crm-chaos",
        label: "CRM ownership broken",
        description:
          "Fix process and CRM adoption first — SI on top of contested records multiplies duplicates.",
        fitHints: ["Owners", "Weekly board"],
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "need-checklist",
    title: "Need checklist (honest signals)",
    rows: [
      {
        feature: "Cannot build a fresh ICP list each week",
        mustHave: true,
        niceToHave: false,
        notes: "Strong SI (data) signal",
      },
      {
        feature: "CRM contacts missing emails / titles at scale",
        mustHave: true,
        niceToHave: false,
        notes: "Strong SI (enrichment) signal",
      },
      {
        feature: "Follow-up dies without sequences or dialing",
        mustHave: true,
        niceToHave: false,
        notes: "Strong SI (engagement / dialer) signal",
      },
      {
        feature: "CSV lists go stale with no refresh owner",
        mustHave: true,
        niceToHave: false,
        notes: "Strong SI signal",
      },
      {
        feature: "Deals lack owners or stages are fiction",
        mustHave: false,
        niceToHave: true,
        notes: "CRM/process first — not SI",
      },
      {
        feature: "Buying because “everyone has Apollo”",
        mustHave: false,
        niceToHave: true,
        notes: "Weak reason alone",
      },
    ],
  },
  {
    type: "checklist",
    id: "decide-checklist",
    title: "Decide this week",
    copyable: true,
    items: [
      {
        id: "name-job",
        label: "Name the blocking job",
        description: "Data, enrichment, engagement, or dialer — one sentence.",
        order: 0,
      },
      {
        id: "count-signals",
        label: "Count recurring SI signals",
        description: "List stuck, empty fields, no dialer, dying CSVs.",
        order: 1,
      },
      {
        id: "crm-health",
        label: "Check CRM ownership health",
        description: "If owners/stages fail weekly, fix CRM first.",
        order: 2,
      },
      {
        id: "next-guide",
        label: "Move to selection or wait",
        description: "If SI wins, open How to choose; if CRM wins, adopt CRM.",
        order: 3,
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Decision mistakes",
    items: [
      {
        title: "Buying SI to fix CRM chaos",
        body: "More contacts into an unowned pipeline create duplicates and distrust — not pipeline truth.",
      },
      {
        title: "Treating “all-in-one” as the need signal",
        body: "Need is a blocking job. Bundles are convenience after the job is named.",
      },
      {
        title: "Confusing database size with coverage",
        body: "Global record counts do not mean your ICP is covered. Test on your own accounts after you decide you need SI.",
      },
      {
        title: "Skipping the CRM-vs-SI fork",
        body: "Teams that skip the fork often buy a sequencer when the real gap was never updating stages.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "Do I need sales intelligence software?",
        answer:
          "Yes when list building, contact completeness, or outbound execution is the weekly bottleneck — typically when CRM fields stay empty, lists die in spreadsheets, or phone/email volume has no proper tool. If the weekly failure is ownership, stages, or follow-ups with no shared CRM discipline, fix CRM and process first.",
      },
      {
        question: "Is sales intelligence a CRM replacement?",
        answer:
          "No. Treat it as a data and execution layer that feeds your system of record. Example: the three-person SDR pod still needs HubSpot or Salesforce for owners and pipeline; Apollo, Lusha, or BookYourData-style tools fill contacts and outreach — they do not replace deal ownership.",
      },
      {
        question: "Can I stay on spreadsheet lists?",
        answer:
          "Solo operators with low volume and personal discipline sometimes can. Upgrade when lists go stale weekly, more than one person edits the same CSV, or you cannot push clean records into a CRM.",
      },
      {
        question: "What if we need both CRM and SI?",
        answer:
          "Sequence the buys: get ownership and stage habits working, then add SI for the named job. Buying both the same week without a system-of-record rule is how duplicates land at scale.",
      },
      {
        question: "What should I do next?",
        answer:
          "If signals point to yes, read How to choose sales intelligence, then compare researched options on Best Sales Intelligence Software. If CRM health fails first, start with Do I need a CRM? / How to choose a CRM.",
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
        description: "Job-first selection framework once the answer is yes.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence software",
        description: "Researched shortlist with published methodology.",
      },
      {
        href: "/guides/sales-intelligence-feature-checklist/",
        label: "SI feature checklist",
        description: "Must-have vs nice-to-have by job.",
      },
      {
        href: "/guides/sales-intelligence-pricing-guide/",
        label: "SI pricing guide",
        description: "Seats, credits, and first-90-day quotes.",
      },
      {
        href: "/guides/do-i-need-a-crm/",
        label: "Do I need a CRM?",
        description: "When shared ownership is the real gap.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Pick the system of record SI will feed.",
      },
      {
        href: "/categories/sales-intelligence/",
        label: "Sales intelligence category",
        description: "Browse the catalogue and subcategories.",
      },
      {
        href: "/software/apollo/",
        label: "Apollo.io review",
        description: "Example data + engagement platform.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "shortlist-cta",
    title: "Ready to shortlist?",
    body: "If the signals above match your week, compare researched sales intelligence options by primary job — without affiliate-ordered rankings.",
    href: "/best/sales-intelligence-software/",
    ctaLabel: "See Best Sales Intelligence Software →",
    variant: "generic",
  },
];

export const doINeedSalesIntelligenceGuide: GuidePage = {
  id: "guide-do-i-need-sales-intelligence",
  slug: "do-i-need-sales-intelligence",
  title: "Do I Need Sales Intelligence? Decision Signals That Matter",
  summary:
    "Decide whether you need sales intelligence using practical signals — stuck list building, empty CRM fields, missing dialer, dying spreadsheet lists — and when CRM or process is the real problem.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: ["apollo", "lusha", "bookyourdata", "reply", "kixie"],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/do-i-need-sales-intelligence-hero.png",
    alt: "Decision visual: sales intelligence signals versus CRM or process problems that should be fixed first.",
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
    "sales-intelligence-pricing-guide",
    "do-i-need-a-crm",
    "how-to-choose-crm",
  ],
  blocks: doINeedSalesIntelligenceBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "signals",
      label: "Count recurring SI pain signals",
      description: "Lists, empty fields, dialer gap, dying CSVs.",
      order: 0,
    },
    {
      id: "crm-fork",
      label: "Check CRM ownership health",
      description: "SI vs fix CRM/process first.",
      order: 1,
    },
    {
      id: "job",
      label: "Name the blocking job",
      description: "Data, enrichment, engagement, or dialer.",
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
    title: "Do I Need Sales Intelligence? | SoftwareGlimpse",
    description:
      "Practical signals for when you need sales intelligence — and when CRM or process is the real problem — without invented ROI claims.",
    canonicalPath: "/guides/do-i-need-sales-intelligence/",
    indexable: true,
  },
};
