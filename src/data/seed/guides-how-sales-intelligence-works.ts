import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * How sales intelligence works — operational loop from source to CRM/sequence.
 * Template: softwareglimpse-guide-template-v1
 */
const howSalesIntelligenceWorksBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Sales intelligence works as a repeatable data loop: source contacts or accounts, filter to your ICP, verify emails and dials, enrich missing fields, then push into CRM or a sequence — and refresh when titles go stale. Decision rule: if any step is skipped (especially verify and sync rules), volume only multiplies bad data; fix the loop before you buy more credits.",
    bullets: [
      "Source → filter",
      "Verify contact details",
      "Enrich firmographics",
      "Push to CRM / sequence",
      "Refresh & suppress",
      "Compliance at each hop",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "The loop beats the logo",
        body: "Every SI product implements some version of source → filter → verify → enrich → push. Features rearrange the steps; they do not erase them.",
      },
      {
        label: "Verification protects deliverability",
        body: "Unverified bulk exports burn domains and dialer time. Spot-check before you scale.",
      },
      {
        label: "CRM sync is part of the product",
        body: "Duplicate matching, field mapping, and overwrite rules decide whether SI improves or pollutes the system of record.",
      },
      {
        label: "Refresh is ongoing work",
        body: "People change jobs. Suppression lists, bounce handling, and re-enrichment keep the loop honest after week one.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "si-operating-loop",
    title: "The sales intelligence operating loop",
    steps: [
      { id: "loop-source", label: "Source", short: "Database or upload" },
      { id: "loop-filter", label: "Filter", short: "ICP match" },
      { id: "loop-verify", label: "Verify", short: "Email / dial" },
      { id: "loop-enrich", label: "Enrich", short: "Fields & signals" },
      { id: "loop-push", label: "Push", short: "CRM or cadence" },
      { id: "loop-refresh", label: "Refresh", short: "Suppress & update" },
    ],
    ctaHref: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose sales intelligence →",
    figure: {
      src: "/guides/how-sales-intelligence-works-loop.png",
      alt: "Six-step sales intelligence loop: source, filter, verify, enrich, push to CRM or sequence, then refresh.",
      caption:
        "Walk the loop in order. Skipping verify or sync rules is how teams pay for records they cannot use.",
    },
  },
  {
    type: "step",
    id: "step-source-filter",
    stepNumber: 1,
    heading: "Source and filter: find the right people",
    body: "Start from either a vendor database search or an upload of accounts you already care about. Filters should mirror how you sell — role, seniority, company size, industry, geography — not whatever the demo search highlights.\n\nExample: the Harbor Analytics SDR pod (three reps) keeps a living list of 200 target accounts. On Monday they filter for Heads of Revenue Ops and Directors of Sales Ops at those accounts only, rather than a global “VP Sales” dump. Fewer rows, higher fit — same pattern whether they use a database-led tool like Apollo or RocketReach, or a list-building workflow like BookYourData.",
    tip: "Save the exact filter recipe your team will reuse weekly. If it only works in a vendor demo, it is not your process yet.",
    scenarios: [
      {
        title: "Net-new search",
        body: "You do not own the contacts yet: search, filter, then verify.",
      },
      {
        title: "Account upload",
        body: "You own the accounts: match people at those companies, then enrich.",
      },
      {
        title: "Saved search",
        body: "Reuse the same ICP recipe weekly so every rep starts from the same definition of “good.”",
      },
    ],
  },
  {
    type: "step",
    id: "step-verify-enrich",
    stepNumber: 2,
    heading: "Verify and enrich: make records usable",
    body: "Verification checks whether an email or dial is likely to work. Enrichment fills titles, company size, industry, technographics, or other fields your CRM needs for routing and personalization. Doing export-first and verify-later is how bounce rates spike.\n\nExample: Mira at Northline Consulting samples 20 of 150 filtered contacts by hand — LinkedIn title, company site, and a known peer at two accounts. Two tools return similar counts; only one keeps titles current enough for her sequences. Match rate on her ICP, not vendor record totals, decides the week.",
    tip: "Budget credits for verification and enrichment explicitly. “Free” bulk exports that skip verify are not free if they burn your domain.",
    scenarios: [
      {
        title: "Email verify",
        body: "Confirm work emails before loading a cadence or marketing send.",
      },
      {
        title: "Dial verify",
        body: "Confirm direct dials or mobiles if phone is part of the motion.",
      },
      {
        title: "Field enrich",
        body: "Backfill title, seniority, firmographics, and any routing fields CRM automation needs.",
      },
    ],
  },
  {
    type: "step",
    id: "step-push-refresh",
    stepNumber: 3,
    heading: "Push to CRM or sequence — then refresh",
    body: "Push means writing contacts into your system of record and/or loading them into a sequencer or dialer. Agree ownership, duplicate matching, and which system wins on conflict before the first bulk sync. Refresh means suppressing hard bounces, updating job changes, and re-running enrichment on stale segments.\n\nExample: Harbor’s RevOps owner maps SI → CRM fields in a sandbox: email as unique key, title overwrite only if SI confidence is high, owner never overwritten by import. Sequences pull from CRM views, not from a parallel SI spreadsheet. Tools such as Amplemarket, Closely, Kixie, Lusha, or Reply may sit at different points in that push step — the rule is the same: one system of record for ownership.",
    tip: "If reps edit the same contacts in SI and CRM without sync rules, you have two systems of record — and neither is trustworthy.",
    figure: {
      src: "/guides/how-sales-intelligence-works-crm-push.png",
      alt: "Diagram showing verified contacts pushing into CRM ownership fields and a sequence or dialer, with a refresh and suppress loop.",
      caption: "CRM owns ownership and history; SI owns discovery and refresh of contact data.",
    },
    scenarios: [
      {
        title: "CRM sync",
        body: "Create or update contacts/companies with agreed field mapping and duplicate rules.",
      },
      {
        title: "Sequence load",
        body: "Pass verified contacts into email/LinkedIn cadences with sending limits respected.",
      },
      {
        title: "Dialer handoff",
        body: "Pass dials into a calling workflow with automatic activity logging back to CRM.",
      },
      {
        title: "Refresh & suppress",
        body: "Remove bounces, respect opt-outs, and re-enrich titles that went stale.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "loop-quality-gates",
    title: "Quality gates in the loop",
    rows: [
      {
        feature: "ICP filter saved and reusable",
        mustHave: true,
        niceToHave: false,
        notes: "Before credit spend",
      },
      {
        feature: "Spot-check verify (sample of 20)",
        mustHave: true,
        niceToHave: false,
        notes: "Every new source/recipe",
      },
      {
        feature: "Duplicate matching on push",
        mustHave: true,
        niceToHave: false,
        notes: "Email / domain / CRM ID",
      },
      {
        feature: "Overwrite policy documented",
        mustHave: true,
        niceToHave: false,
        notes: "Which side wins",
      },
      {
        feature: "Bounce & opt-out suppression",
        mustHave: true,
        niceToHave: false,
        notes: "After first sends",
      },
      {
        feature: "Intent / technographic extras",
        mustHave: false,
        niceToHave: true,
        notes: "Only if reps will use them",
      },
    ],
  },
  {
    type: "mistakes",
    id: "common-mistakes",
    title: "Common how-it-works mistakes",
    items: [
      {
        title: "Exporting before verifying",
        body: "Bulk dumps into sequences without a verify gate burn deliverability and trust.",
      },
      {
        title: "One-way sync with no owner",
        body: "If nobody owns field mapping and duplicates, SI becomes a CRM pollution engine.",
      },
      {
        title: "Treating the SI UI as the pipeline",
        body: "Deals, stages, and handoff history belong in CRM — SI is the data feeder.",
      },
      {
        title: "Never refreshing after go-live",
        body: "Titles and emails decay. Without suppress and re-enrich, week-eight lists look like week-one lists with worse bounce rates.",
      },
    ],
  },
  {
    type: "checklist",
    id: "loop-readiness",
    title: "Loop readiness checklist",
    copyable: true,
    items: [
      {
        id: "gate-icp",
        label: "ICP filter written as a reusable recipe",
        description: "Roles, size band, industry, region — same definition for every rep.",
        order: 0,
      },
      {
        id: "gate-verify",
        label: "Verification step before sequence or dial",
        description: "Sample check plus automated verify where the tool supports it.",
        order: 1,
      },
      {
        id: "gate-mapping",
        label: "CRM field map and overwrite rules agreed",
        description: "Owner, email key, title, company fields — documented before bulk push.",
        order: 2,
      },
      {
        id: "gate-suppress",
        label: "Bounce and opt-out path defined",
        description: "Who removes bad records and how they stay out of future exports.",
        order: 3,
      },
      {
        id: "gate-refresh",
        label: "Refresh cadence for stale segments",
        description: "When titles get re-checked and who triggers enrichment.",
        order: 4,
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "How does sales intelligence software work?",
        answer:
          "It runs a data loop: source contacts or accounts, filter to your ICP, verify emails and dials, enrich missing fields, push into CRM or a sequence/dialer, then refresh and suppress bad records. The product is useful when that loop is trustworthy enough to run weekly without rebuilding lists by hand.",
      },
      {
        question: "Where does CRM fit in the loop?",
        answer:
          "CRM is the system of record after the push step — ownership, deals, and activity history live there. Sales intelligence feeds and refreshes contact data; it should not become a second pipeline. See sales intelligence vs CRM for the boundary.",
      },
      {
        question: "What should I verify before buying more credits?",
        answer:
          "Confirm your ICP filter, spot-check a sample of 20 records, and run a small CRM sync with duplicate rules. Example: Mira’s Northline consultancy found match rate on 200 target accounts mattered more than any vendor’s total database claim.",
      },
      {
        question: "Do engagement and dialer tools change the loop?",
        answer:
          "They usually sit on the push step — sequences and dialers consume verified contacts and should log activity back to CRM. Catalogue examples include Amplemarket, Closely, Kixie, and Reply for engagement/dialing shapes; Apollo, BookYourData, Lusha, and RocketReach often appear earlier for data or enrichment. Job fit still decides placement — not ranking.",
      },
      {
        question: "How often should we refresh data?",
        answer:
          "As often as titles and emails go stale for your motion. Many teams re-enrich active segments on a fixed cadence and suppress bounces immediately after sends. Pick a cadence you will actually run, not a perfect theoretical schedule.",
      },
      {
        question: "What should I read next?",
        answer:
          "If you are still defining the category, start with What is sales intelligence. When you are ready to buy, use How to choose sales intelligence, then the sales intelligence category and Best sales intelligence software pages.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/what-is-sales-intelligence/",
        label: "What is sales intelligence?",
        description: "Category definition and job shapes.",
      },
      {
        href: "/guides/sales-intelligence-vs-crm/",
        label: "Sales intelligence vs CRM",
        description: "Data layer versus system of record.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose sales intelligence",
        description: "Buying framework by primary job.",
      },
      {
        href: "/categories/sales-intelligence/",
        label: "Sales intelligence category",
        description: "Browse catalogue products.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence software",
        description: "Researched shortlist and methodology.",
      },
      {
        href: "/guides/crm-data-hygiene/",
        label: "CRM data hygiene",
        description: "Keep enriched records trustworthy after import.",
      },
      {
        href: "/guides/what-is-crm/",
        label: "What is CRM?",
        description: "Where ownership and pipeline should live.",
      },
      {
        href: "/use-cases/email-outreach/",
        label: "Email outreach use case",
        description: "Sequences that consume verified contacts.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "choose-cta",
    title: "Turn the loop into a buying checklist",
    body: "Use the how-to-choose framework to test coverage, credits, CRM sync, and rep workflow against the same loop you just mapped.",
    href: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose sales intelligence →",
    variant: "generic",
  },
  {
    type: "interactive-cta",
    id: "best-cta",
    title: "See researched options",
    body: "Compare products on Best sales intelligence software — methodology-backed, never affiliate-ordered.",
    href: "/best/sales-intelligence-software/",
    ctaLabel: "Best sales intelligence software →",
    variant: "generic",
  },
];

export const howSalesIntelligenceWorksGuide: GuidePage = {
  id: "guide-how-sales-intelligence-works",
  slug: "how-sales-intelligence-works",
  title: "How Sales Intelligence Works: Source → Verify → Sync",
  summary:
    "See how sales intelligence software works in practice — the source, filter, verify, enrich, CRM/sequence push, and refresh loop that keeps outbound lists usable.",
  categorySlugs: ["sales-intelligence"],
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
  topicType: "how-it-works",
  journeyStage: "understand",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/how-sales-intelligence-works-hero.png",
    alt: "Annotated sales intelligence workflow UI showing source, filter, verify, enrich, and push into CRM or sequence steps.",
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
    {
      contentId: "content:guide:how-to-choose-sales-intelligence",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:guide:how-to-choose-sales-intelligence",
    label: "How to choose sales intelligence",
  },
  relatedGuideSlugs: [
    "what-is-sales-intelligence",
    "sales-intelligence-vs-crm",
    "how-to-choose-sales-intelligence",
    "crm-data-hygiene",
    "what-is-crm",
  ],
  blocks: howSalesIntelligenceWorksBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "map-loop",
      label: "Map your current loop",
      description: "Where source, verify, and push happen today.",
      order: 0,
    },
    {
      id: "gates",
      label: "Add verify and sync gates",
      description: "Sample checks and CRM overwrite rules before volume.",
      order: 1,
    },
    {
      id: "refresh",
      label: "Set a refresh owner",
      description: "Who suppresses bounces and re-enriches stale titles.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T08:00:00.000Z",
    publishedAt: "2026-08-16T14:00:00.000Z",
    reviewedAt: "2026-08-17T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "How Sales Intelligence Works | SoftwareGlimpse",
    description:
      "How sales intelligence software works: source and filter contacts, verify emails and dials, enrich fields, push to CRM or sequences, then refresh — without replacing your CRM.",
    canonicalPath: "/guides/how-sales-intelligence-works/",
    indexable: true,
  },
};
