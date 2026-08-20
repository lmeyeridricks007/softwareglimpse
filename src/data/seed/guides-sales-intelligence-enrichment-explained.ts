import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales intelligence enrichment explained — match rate, fields, overwrite rules.
 * Template: softwareglimpse-guide-template-v1
 * Published and indexable (editorial gate cleared 2026-08-17).
 */
const salesIntelligenceEnrichmentExplainedBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Sales intelligence enrichment completes and refreshes records you already own — it is not the same job as building net-new lists. Decision rule: buy and measure enrichment by match rate and fill quality on a sample of your CRM accounts, with written overwrite rules, not by the vendor’s total database size. If the primary job is finding people you do not have yet, you need list building — see how to choose sales intelligence.",
    bullets: [
      "Match rate on your records",
      "Fields you actually fill",
      "Overwrite rules first",
      "Write-back to CRM",
      "Not list building",
      "Hygiene after enrich",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Match rate beats catalog size",
        body: "Millions of contacts in a vendor database say nothing about how often your known accounts get a usable email or dial.",
      },
      {
        label: "Choose fields on purpose",
        body: "Enrich only the fields reps and reporting will use — every extra write-back is a hygiene risk.",
      },
      {
        label: "Overwrite rules are the product",
        body: "Fill-blanks-only vs always-refresh vs never-touch-owner-edits must be agreed before the first bulk job.",
      },
      {
        label: "Enrichment ≠ list building",
        body: "Completing owned records and searching for net-new contacts are different jobs with different success metrics.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "enrichment-path",
    title: "Enrichment operating path",
    steps: [
      { id: "sample", label: "Sample", short: "200 known accounts" },
      { id: "match", label: "Match", short: "Measure match rate" },
      { id: "fields", label: "Fields", short: "Fill list only" },
      { id: "rules", label: "Rules", short: "Overwrite policy" },
      { id: "writeback", label: "Write-back", short: "CRM sync" },
      { id: "hygiene", label: "Hygiene", short: "Weekly trust" },
    ],
    ctaHref: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose SI →",
  },
  {
    type: "figure",
    id: "enrichment-boundary",
    title: "Enrichment is not list building",
    src: "/guides/sales-intelligence-enrichment-explained-boundary.png",
    alt: "Two-column teaching diagram: enrichment completes owned CRM records via match, fill blanks, and write-back with overwrite rules; list building searches ICP filters and exports net-new contacts — different jobs, different success metrics.",
    caption:
      "Same category, different jobs: enrichment is judged by match rate and fill quality on records you own; list building is judged by usable net-new coverage on your ICP.",
  },
  {
    type: "feature-matrix",
    id: "fields-to-enrich",
    title: "Which fields to fill (typical)",
    rows: [
      {
        feature: "Work email",
        mustHave: true,
        niceToHave: false,
        notes: "Primary outbound path for most B2B teams.",
      },
      {
        feature: "Direct dial / mobile (if you call)",
        mustHave: true,
        niceToHave: false,
        notes: "Only if phone is a real channel — credits burn fast.",
      },
      {
        feature: "Current job title + company",
        mustHave: true,
        niceToHave: false,
        notes: "Stale titles poison sequences and reporting.",
      },
      {
        feature: "LinkedIn / profile URL",
        mustHave: false,
        niceToHave: true,
        notes: "Useful for multichannel; optional for email-only pods.",
      },
      {
        feature: "Firmographics (industry, size, region)",
        mustHave: false,
        niceToHave: true,
        notes: "Helpful for routing and ICP filters — not day-one for every team.",
      },
      {
        feature: "Technographics / intent signals",
        mustHave: false,
        niceToHave: true,
        notes: "After core contact fields are trusted — not the enrichment MVP.",
      },
      {
        feature: "Personal email / personal social",
        mustHave: false,
        niceToHave: false,
        notes: "Usually out of policy for B2B work outreach — confirm with your privacy owner.",
      },
    ],
  },
  {
    type: "checklist",
    id: "before-you-enrich",
    title: "Before the first bulk enrich",
    copyable: true,
    items: [
      {
        id: "sample-accounts",
        label: "200 known target accounts frozen for the match test",
        description: "Real CRM or spreadsheet rows — not vendor demo lists.",
        order: 0,
      },
      {
        id: "field-list",
        label: "Fill list written (email, dial, title, …)",
        description: "Anything not on the list stays off the sync map.",
        order: 1,
      },
      {
        id: "overwrite-policy",
        label: "Overwrite policy signed by RevOps + sales lead",
        description: "Fill blanks / refresh titles / never overwrite owner notes.",
        order: 2,
      },
      {
        id: "identity-keys",
        label: "Match keys agreed (domain, LinkedIn, email, …)",
        description: "Ambiguous matches need a human queue — not silent merges.",
        order: 3,
      },
      {
        id: "credit-cap",
        label: "Credit cap for the pilot enrich job",
        description: "Prevent a hot run from emptying the monthly budget.",
        order: 4,
      },
      {
        id: "hygiene-owner",
        label: "Hygiene owner named for post-write-back review",
        description: "Duplicates and bad overwrites get a weekly queue.",
        order: 5,
      },
    ],
  },
  {
    type: "step",
    id: "match-rate-not-catalog",
    stepNumber: 1,
    heading: "Measure match rate on your records — ignore catalog size",
    body: "Enrichment success is how often the tool correctly identifies a person or company you already have and returns usable fields. Vendor “hundreds of millions of contacts” marketing does not answer that question. Run the same sample across shortlisted tools: take ~200 known accounts or contacts from your CRM, enrich, then count matches, usable work emails, and usable phone numbers of the type you need. Spot-check a subset by hand.\n\nExample: Mira, RevOps at Contour Labs (≈18,000 CRM contacts, outbound-led SaaS), samples 500 open-opportunity contacts. Tool A returns more total “hits” in the catalog UI but fills work email on far fewer of Mira’s rows; Tool B matches fewer catalog rows overall but fills email and title on a higher share of the sample. She shortlists Tool B for enrichment — catalog size never entered the decision.",
    tip: "Write the success metric as “% of sample with usable work email after enrich,” not “database size.”",
    figure: {
      src: "/guides/sales-intelligence-enrichment-explained-hero.png",
      alt: "Sales intelligence enrichment hero: match-rate table on known CRM accounts beside a fields-to-fill panel and overwrite-rule chips for fill blanks, never overwrite owner edits, and refresh titles.",
      caption:
        "Enrichment teaching UI — match rate on your book, intentional field list, and overwrite rules before write-back.",
    },
    scenarios: [
      {
        title: "CRM backfill",
        body: "Large owned book, thin emails — enrichment is the primary job.",
      },
      {
        title: "Title refresh",
        body: "Contacts exist; titles and companies drift — scheduled refresh beats one-off imports.",
      },
      {
        title: "Mixed stack",
        body: "You already buy lists elsewhere — enrichment tools should not be judged as list builders.",
      },
    ],
  },
  {
    type: "step",
    id: "fields-and-overwrite",
    stepNumber: 2,
    heading: "Pick fields and freeze overwrite rules before sync",
    body: "Decide which fields may be written, who wins on conflict, and whether blank-only or refresh applies. Typical safe default for pilots: fill blanks for email and dial; refresh title and company on a schedule; never overwrite owner, next-step, or free-text notes. Map SI fields to CRM fields explicitly — see CRM data hygiene for the ongoing rhythm after write-back.\n\nExample: Contour Labs freezes: work email = fill blank only; mobile = fill blank only if dialer pod is on; title + company = allow refresh monthly; owner and next-step date = never touch. Mira rejects a vendor default that “always updates email” after a sales manager shows three contacts whose hand-corrected emails would have been overwritten.",
    tip: "If RevOps and sales cannot agree on overwrite rules in one sitting, pause the bulk job — silent overwrites destroy trust faster than empty fields.",
    scenarios: [
      {
        title: "Fill blanks",
        body: "Safest pilot default for contact channels.",
      },
      {
        title: "Scheduled refresh",
        body: "Titles and firmographics on a calendar — not every night.",
      },
      {
        title: "Human queue",
        body: "Ambiguous matches and conflicting emails wait for review.",
      },
    ],
  },
  {
    type: "step",
    id: "enrichment-vs-lists",
    stepNumber: 3,
    heading: "Know when enrichment is the wrong product",
    body: "If the weekly blocker is “we do not have enough net-new contacts in our ICP,” enrichment will not fix it — you need searchable list building (and possibly engagement or dialer). Enrichment shines when accounts and contacts already live in the CRM or a sheet, but emails, dials, or titles are missing or stale. Teams that buy an enrichment-strong tool to solve list scarcity usually burn credits on rematching the same thin book.\n\nExample: Contour’s SDR lead wanted “more names.” Mira runs a week of enrichment only on existing open opportunities — reply rates improve on refreshed titles, but Monday still lacks a fresh ICP list. They keep the enrichment vendor for CRM fill and separately evaluate a data / list-building primary job using the how-to-choose framework and the Best sales intelligence software shortlist.",
    tip: "One sentence test: “Do we already own the people?” Yes → enrichment. No → list building.",
    scenarios: [
      {
        title: "Owned book, thin fields",
        body: "Enrichment primary — measure match and fill.",
      },
      {
        title: "Empty pipeline top-of-funnel",
        body: "List building primary — enrichment is secondary.",
      },
      {
        title: "Both jobs real",
        body: "Treat as two decisions — do not force one weaker tool to win both.",
      },
    ],
  },
  {
    type: "step",
    id: "writeback-and-hygiene",
    stepNumber: 4,
    heading: "Write back carefully, then run hygiene",
    body: "After a pilot enrich, spot-check write-backs: correct company links, no owner overwrites, duplicate rate not spiked, credits used within budget. Only then schedule recurring enrichment. Pair with CRM data hygiene so filled fields do not decay into duplicates and conflicting sources of truth.\n\nExample: Contour’s first write-back creates 40 near-duplicate contacts from nickname mismatches. Mira pauses the schedule, tightens match keys to domain + LinkedIn URL, merges the pilot duplicates, and only then turns on a weekly blank-fill for open opportunities — not the whole 18,000-row base.",
    tip: "Recurring enrichment without a duplicate queue is how CRM trust dies in a quarter.",
    scenarios: [
      {
        title: "Pilot slice first",
        body: "Open opportunities or one segment — not the full archive.",
      },
      {
        title: "Credit guardrails",
        body: "Cap jobs; review burn in the same weekly ritual as hygiene.",
      },
      {
        title: "Expand later",
        body: "Widen the enrich set only after two clean Friday reviews.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "High-cost enrichment mistakes",
    items: [
      {
        title: "Buying on database size",
        body: "Catalog marketing is not a match-rate claim about your CRM.",
      },
      {
        title: "Enriching every field the vendor offers",
        body: "Unused fields become conflicting truth and reporting noise.",
      },
      {
        title: "No overwrite policy",
        body: "Vendor defaults that always update email will clobber human corrections.",
      },
      {
        title: "Treating enrichment as list building",
        body: "You rematch the same thin book and still start Monday without net-new coverage.",
      },
      {
        title: "Firm-wide write-back on day one",
        body: "Match-key bugs multiply across every account before you notice.",
      },
      {
        title: "Skipping hygiene after sync",
        body: "Duplicates and blank owners return — enrichment looks “done” while the board is untrusted.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is sales intelligence enrichment?",
        answer:
          "Enrichment matches people and companies you already have and fills or refreshes fields (email, phone, title, firmographics) back into your CRM or sheet. It is a data-completion job — not the same as searching a database for net-new contacts.",
      },
      {
        question: "What is match rate?",
        answer:
          "The share of your sample records the tool correctly identifies and can enrich. Measure it on your own accounts during a trial. It is not the same as the vendor’s total contact count.",
      },
      {
        question: "Which CRM fields should enrichment update?",
        answer:
          "Usually work email, dial (if you call), and current title/company. Defer technographics and intent until core contact fields are trusted. Freeze an overwrite policy before sync.",
      },
      {
        question: "When is enrichment the wrong buy?",
        answer:
          "When the blocker is lack of net-new ICP contacts. In that case shortlist list-building (data) tools first — see how to choose sales intelligence and the Best sales intelligence software page.",
      },
      {
        question: "How does enrichment relate to CRM hygiene?",
        answer:
          "Write-back without owners, duplicate rules, and a weekly review decays quickly. Use CRM data hygiene for the operating rhythm after enrichment lands.",
      },
      {
        question: "What should I do next?",
        answer:
          "Run a 200-account match test, freeze fields and overwrite rules, then compare enrichment-capable tools on the sales intelligence category and Best page. If product shape is still unclear, start with how to choose sales intelligence.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/categories/sales-intelligence/",
        label: "Sales intelligence category",
        description: "Browse the SI software category hub.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence software",
        description: "Researched shortlist by primary job.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose sales intelligence",
        description: "Data vs enrichment vs engagement vs dialer.",
      },
      {
        href: "/guides/crm-data-hygiene/",
        label: "CRM data hygiene",
        description: "Weekly rhythm after write-back.",
      },
      {
        href: "/guides/sales-intelligence-implementation-guide/",
        label: "SI implementation guide",
        description: "Week 0–4 rollout with credit budget and pilot.",
      },
      {
        href: "/guides/",
        label: "All software buying guides",
        description: "Browse the SoftwareGlimpse guide library.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "choose-cta",
    title: "Still choosing the primary job?",
    body: "Use the how-to-choose framework to confirm enrichment is the blocking job — then shortlist tools whose core product is completing owned records, not building net-new lists.",
    href: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose sales intelligence →",
    variant: "finder",
  },
];

export const salesIntelligenceEnrichmentExplainedGuide: GuidePage = {
  id: "guide-sales-intelligence-enrichment-explained",
  slug: "sales-intelligence-enrichment-explained",
  title: "Sales Intelligence Enrichment Explained",
  summary:
    "Learn how sales intelligence enrichment works: measure match rate on your CRM records, choose which fields to fill, freeze overwrite rules, and know when enrichment is not list building.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "feature-explainer",
  journeyStage: "understand",
  knowledgeAreaSlug: "features",
  heroVisual: {
    src: "/guides/sales-intelligence-enrichment-explained-hero.png",
    alt: "Sales intelligence enrichment hero: match-rate table on known CRM accounts beside a fields-to-fill panel and overwrite-rule chips for fill blanks, never overwrite owner edits, and refresh titles.",
  },
  supports: [
    {
      contentId: "content:category:sales-intelligence",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:use-case:prospecting",
      relationType: "explains-feature",
      primary: false,
    },
    {
      contentId: "content:best:sales-intelligence-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:guide:how-to-choose-sales-intelligence",
    label: "How to choose sales intelligence",
  },
  relatedGuideSlugs: [
    "how-to-choose-sales-intelligence",
    "crm-data-hygiene",
    "sales-intelligence-implementation-guide",
    "sales-intelligence-migration-guide",
  ],
  blocks: salesIntelligenceEnrichmentExplainedBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "match-sample",
      label: "Run a match-rate sample on ~200 known accounts",
      description: "Usable email/dial counts — not catalog size.",
      order: 0,
    },
    {
      id: "fields-rules",
      label: "Freeze fill fields and overwrite rules",
      description: "RevOps + sales lead agreement before sync.",
      order: 1,
    },
    {
      id: "pilot-writeback",
      label: "Pilot write-back, then hygiene",
      description: "Expand only after trusted Friday reviews.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "medium-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T07:00:00.000Z",
    publishedAt: "2026-08-17T07:00:00.000Z",
    reviewedAt: "2026-08-17T07:00:00.000Z",
    researchStatus: "complete",
    seoStatus: "draft",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Sales Intelligence Enrichment Explained | SoftwareGlimpse",
    description:
      "How sales intelligence enrichment works: match rate vs database size, which fields to fill, overwrite rules, and when enrichment is not list building.",
    canonicalPath: "/guides/sales-intelligence-enrichment-explained/",
    indexable: true,
  },
};
