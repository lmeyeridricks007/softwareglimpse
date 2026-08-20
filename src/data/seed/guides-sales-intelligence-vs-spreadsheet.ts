import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales intelligence vs spreadsheet / bought lists — when static CSVs fail vs live SI.
 * Template: softwareglimpse-guide-template-v1
 */
const salesIntelligenceVsSpreadsheetBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Stay on a spreadsheet or a one-time bought list while the ICP is tiny, one person owns every touch, and personal research still works. Switch to live sales intelligence when lists go stale between campaigns, multiple people need current emails and phones, credits and verification matter, or managers rebuild outreach sheets every week. Decision rule: if last quarter’s CSV is already wrong for this week’s touches, the static list is past its job.",
    bullets: [
      "Sheets OK for tiny solo lists",
      "Bought lists go stale fast",
      "Live SI for current contacts",
      "Credits + verification",
      "CRM as system of record",
      "Not a vendor ranking",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Bought lists are a snapshot",
        body: "A CSV is frozen at purchase. People change jobs; emails break; phones churn. Live SI refreshes on demand.",
      },
      {
        label: "Sheets are a tool, not a prospecting OS",
        body: "Spreadsheets excel at tracking and analysis. They struggle as multi-user sources of current contact data.",
      },
      {
        label: "SI value is operational, not magical",
        body: "Benefits come from coverage on your ICP, credits, verification, and CRM sync — not from buying a logo.",
      },
      {
        label: "Switch when staleness is recurring",
        body: "Bounce spikes, wrong numbers, and weekly sheet merges are clearer signals than “we should buy data someday.”",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "sheet-or-si",
    title: "Sheet / bought list vs live SI decision path",
    steps: [
      { id: "users", label: "Who needs data?", short: "Solo vs shared" },
      { id: "freshness", label: "Freshness need", short: "One-off vs ongoing" },
      { id: "volume", label: "Weekly volume", short: "Tiny vs growing" },
      { id: "verify", label: "Verification?", short: "Manual vs product" },
      { id: "crm", label: "CRM sync?", short: "Paste vs governed" },
      { id: "choose", label: "Pick the system", short: "Sheet, hybrid, live SI" },
    ],
    ctaHref: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose sales intelligence →",
    figure: {
      src: "/guides/sales-intelligence-vs-spreadsheet-decision.png",
      alt: "Decision fork showing when a spreadsheet or bought list still works versus when to move to live sales intelligence.",
      caption: "Shared need for current contacts and recurring staleness are the usual tipping points into live SI.",
    },
  },
  {
    type: "figure",
    id: "boundary-visual",
    title: "Where static lists stop and live SI starts",
    src: "/guides/sales-intelligence-vs-spreadsheet-hero.png",
    alt: "Stale bought-list spreadsheet on the left versus live sales intelligence with searchable ICP, credits, verification, and CRM sync on the right.",
    caption: "Same ICP — different jobs for the contact data system.",
  },
  {
    type: "step",
    id: "when-sheets-work",
    stepNumber: 1,
    heading: "When a spreadsheet or one-time list is still the right call",
    body: "Many early operators overbuy sales intelligence before they have a repeatable outbound motion. A well-structured sheet — or a carefully scoped one-time purchase — can be enough until staleness and collaboration become real constraints.\n\nExample: Alex, a solo founder, tracks 40 target accounts in Google Sheets with emails found manually. Nobody else edits the file, and weekly touches stay under fifteen. Until Alex hires an SDR or scales volume, the sheet is fine — buying a full SI seat early would mostly burn unused credits.",
    tip: "If only you touch a tiny list and bounce rate stays low, stay on sheets until staleness or hire #2 breaks that twice in the same month.",
    scenarios: [
      {
        title: "Solo tiny ICP",
        body: "A founder tracking dozens of accounts with personal research and no shared owners.",
      },
      {
        title: "One-off event list",
        body: "A conference attendee CSV that will not become ongoing prospecting infrastructure.",
      },
      {
        title: "Analysis sandbox",
        body: "Exporting SI or CRM data into a sheet for a one-time model is still a valid spreadsheet job.",
      },
    ],
  },
  {
    type: "step",
    id: "switching-signals",
    stepNumber: 2,
    heading: "Switching signals: time for live sales intelligence",
    body: "Treat these as operational signals, not vanity milestones. If several show up together, live SI is usually cheaper than another “final” bought-list refresh.\n\nExample: Alex hires Jordan as SDR #1. Within two weeks they discover last year’s bought CSV has a high bounce rate, and each keeps a conflicting “targets.xlsx.” That staleness + shared-ownership failure is the switch signal — not a vanity milestone like “we have 5,000 rows.”",
    tip: "Write down the last three outreach failures caused by bad emails or phones — that list becomes your SI success criteria.",
    scenarios: [
      {
        title: "Stale bought list",
        body: "Bounce rates and wrong numbers climb because the CSV has not been refreshed since purchase.",
      },
      {
        title: "Shared ownership pain",
        body: "Two people maintain conflicting target sheets; nobody trusts the “latest” file.",
      },
      {
        title: "Weekly rebuild tax",
        body: "Managers or SDRs rebuild outreach lists every week instead of searching a live ICP filter.",
      },
      {
        title: "CRM paste chaos",
        body: "Contacts are pasted into CRM without source, owner, or overwrite rules — duplicates explode.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "job-matrix",
    title: "Spreadsheet / bought list vs live SI by job",
    rows: [
      {
        feature: "Solo tiny list, light research",
        mustHave: false,
        niceToHave: true,
        notes: "Spreadsheet usually enough",
      },
      {
        feature: "Ongoing need for current emails/phones",
        mustHave: true,
        niceToHave: false,
        notes: "Live SI strength",
      },
      {
        feature: "Shared ICP list across SDRs",
        mustHave: true,
        niceToHave: false,
        notes: "Live SI + CRM SoR",
      },
      {
        feature: "Verification before send/dial",
        mustHave: true,
        niceToHave: false,
        notes: "Hard with static CSVs",
      },
      {
        feature: "Governed CRM enrichment",
        mustHave: true,
        niceToHave: false,
        notes: "Live SI + overwrite rules",
      },
      {
        feature: "One-time analysis export",
        mustHave: false,
        niceToHave: true,
        notes: "Spreadsheet still useful",
      },
    ],
  },
  {
    type: "size-match",
    id: "fit-by-stage",
    title: "Fit by team stage",
    tiers: [
      {
        id: "solo",
        label: "Solo / early",
        description:
          "Structured spreadsheet or light SI — switch when bounce rate or volume outgrows personal research.",
        fitHints: ["Tiny ICP", "Personal discipline"],
      },
      {
        id: "pod",
        label: "2–10 person outbound pod",
        description:
          "Live SI is usually the right contact source once lists must stay current weekly.",
        fitHints: ["Shared lists", "Credit owner"],
      },
      {
        id: "scaling",
        label: "Scaling org",
        description:
          "Bought lists as primary source create deliverability and CRM risk — live SI first, sheets for analysis.",
        fitHints: ["Enrichment", "Governed sync"],
      },
      {
        id: "hybrid",
        label: "Hybrid pattern",
        description:
          "Live SI + CRM as systems of record; sheets for exports and models — never the reverse for active outreach.",
        fitHints: ["SoR in CRM", "Sheets for analysis"],
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Common SI vs spreadsheet mistakes",
    items: [
      {
        title: "Buying SI to fix a list nobody maintains",
        body: "If the team will not define ICP filters or own credits, live SI becomes a more expensive empty spreadsheet.",
      },
      {
        title: "Keeping the bought CSV as the real source of truth",
        body: "Dual running without a cutover date means the SI tool never earns trust.",
      },
      {
        title: "Pasting SI exports without CRM rules",
        body: "Bulk paste without owners, source, and overwrite rules creates duplicates and distrust.",
      },
      {
        title: "Treating vendor ROI claims as proof",
        body: "Ignore invented percentage lifts. Measure bounce rate, match rate on your sample, and list build time.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What’s the difference between sales intelligence and a spreadsheet?",
        answer:
          "A spreadsheet or bought CSV is fine for a solo tiny list with personal research. Live sales intelligence becomes the better contact source when lists must stay current, multiple people need shared ICP data, verification matters, and CRM sync needs governance — without rebuilding sheets every week.",
      },
      {
        question: "Are bought email lists the same as sales intelligence?",
        answer:
          "No. A bought list is a static snapshot. Sales intelligence tools search and refresh contact data on demand, usually with credits, verification, and CRM integrations. Example: last year’s CSV will not catch job changes that a live lookup can.",
      },
      {
        question: "When should a solo founder switch from sheets to SI?",
        answer:
          "When bounce rate, list rebuild time, or the need for a second person’s current contacts outgrows personal research — or when a first SDR must trust the same ICP list. Example: hire #1 often surfaces conflicting “latest” CSVs within days.",
      },
      {
        question: "Can we use both SI and spreadsheets?",
        answer:
          "Yes, with a clear rule: live SI (and CRM) own active contact data; spreadsheets are for exports and analysis. Avoid editing the same outreach list in two places.",
      },
      {
        question: "Do we need an all-in-one suite to leave bought lists?",
        answer:
          "Usually not. Pick the SI shape that matches your primary job (data, enrichment, engagement, or dialer). Suites add value only if you will use the extra modules.",
      },
      {
        question: "What should I read next?",
        answer:
          "Use Types of Sales Intelligence to pick a shape, then How to Choose Sales Intelligence — or compare researched options on Best Sales Intelligence Software.",
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
        description: "Which SI shape replaces the sheet.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose sales intelligence",
        description: "Buying framework after you decide.",
      },
      {
        href: "/guides/sales-intelligence-benefits/",
        label: "Sales intelligence benefits",
        description: "What live data is meant to improve.",
      },
      {
        href: "/guides/sales-intelligence-examples/",
        label: "Sales intelligence examples",
        description: "Scenarios past the spreadsheet.",
      },
      {
        href: "/guides/common-sales-intelligence-mistakes/",
        label: "Common SI mistakes",
        description: "Failure modes during cutover.",
      },
      {
        href: "/guides/sales-intelligence-glossary/",
        label: "Sales intelligence glossary",
        description: "Credits, match rate, deliverability.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence software",
        description: "Research-backed rankings when available.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "best-cta",
    title: "Ready to leave the stale list?",
    body: "If current contacts and shared ICP lists are your tipping point, Best Sales Intelligence Software maps researched products to criteria — without affiliate-ordered rankings.",
    href: "/best/sales-intelligence-software/",
    ctaLabel: "See Best Sales Intelligence →",
    variant: "finder",
  },
];

export const salesIntelligenceVsSpreadsheetGuide: GuidePage = {
  id: "guide-sales-intelligence-vs-spreadsheet",
  slug: "sales-intelligence-vs-spreadsheet",
  title: "Sales Intelligence vs Spreadsheet & Bought Lists: When to Switch",
  summary:
    "Learn when a spreadsheet or bought CSV is enough for contacts — and when live sales intelligence becomes the better source for current emails, phones, verification, and CRM sync.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "comparison-education",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/sales-intelligence-vs-spreadsheet-hero.png",
    alt: "Stale bought-list spreadsheet versus live sales intelligence with ICP search, credits, verification, and CRM sync.",
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
    "sales-intelligence-glossary",
  ],
  blocks: salesIntelligenceVsSpreadsheetBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "freshness",
      label: "Check list freshness",
      description: "Is last quarter’s CSV still accurate this week?",
      order: 0,
    },
    {
      id: "signals",
      label: "List switching signals",
      description: "Bounces, conflicts, rebuild tax, CRM paste chaos.",
      order: 1,
    },
    {
      id: "cutover",
      label: "Decide contact source of truth",
      description: "Sheet, hybrid export, or live SI + CRM.",
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
    title: "Sales Intelligence vs Spreadsheet & Bought Lists | SoftwareGlimpse",
    description:
      "When spreadsheets and bought CSVs work for solo lists — and when stale data, shared ownership, and verification mean you need live sales intelligence.",
    canonicalPath: "/guides/sales-intelligence-vs-spreadsheet/",
    indexable: true,
  },
};
