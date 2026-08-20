import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Common sales intelligence mistakes — mistake → fix pairs (no invented ROI).
 * Template: softwareglimpse-guide-template-v1
 */
const commonSalesIntelligenceMistakesBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "The most common sales intelligence mistakes are buying all-in-one without a primary job, ignoring credit economics, overwriting CRM fields without rules, skipping a compliance owner, testing global database size instead of ICP coverage, and sending before deliverability is ready. Decision rule: if you cannot name the primary job, a credit owner, overwrite rules, and a compliance contact before go-live, fix the operating rules first — the vendor logo will not rescue a burned domain or a trashed CRM.",
    bullets: [
      "Buying all-in-one",
      "Ignoring credits",
      "Overwrite CRM blindly",
      "No compliance owner",
      "Database size vanity",
      "Send before deliverability",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Process mistakes beat product mistakes",
        body: "Most SI failures are credit, sync, and compliance failures wearing a vendor logo.",
      },
      {
        label: "Fix pairs beat blame",
        body: "For every recurring failure mode, write the counter-behavior before you buy or expand seats.",
      },
      {
        label: "All-in-one is not insurance",
        body: "Buying breadth “to grow into” often skips the coverage and credit tests that would have created value.",
      },
      {
        label: "CRM is still the system of record",
        body: "SI should feed the CRM with governed field rules — not compete with it or wipe owner notes.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "avoid-path",
    title: "How to avoid sales intelligence failure",
    steps: [
      { id: "job", label: "Job first", short: "Shape before brand" },
      { id: "credits", label: "Credits", short: "Owner + unit economics" },
      { id: "sample", label: "ICP sample", short: "Match rate on your list" },
      { id: "sync", label: "Sync rules", short: "Overwrite map first" },
      { id: "compliance", label: "Compliance", short: "Named owner" },
      { id: "deliverability", label: "Deliverability", short: "Before volume send" },
    ],
    ctaHref: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose sales intelligence →",
    figure: {
      src: "/guides/common-sales-intelligence-mistakes-avoid-failure.png",
      alt: "How to avoid sales intelligence failure path: job first, credits, ICP sample, sync rules, compliance owner, then deliverability.",
      caption:
        "Shape and credits before brand — then sample coverage, sync rules, compliance, and deliverability.",
    },
  },
  {
    type: "figure",
    id: "fixes-visual",
    title: "Mistake → fix map",
    src: "/guides/common-sales-intelligence-mistakes-hero.png",
    alt: "Six sales intelligence mistake and fix pairs: all-in-one buy, credits, CRM overwrite, compliance, vanity database size, and deliverability.",
    caption: "Write the fix as an operating rule before you blame the vendor.",
  },
  {
    type: "step",
    id: "mistake-fix-pairs",
    stepNumber: 1,
    heading: "Mistake → fix pairs",
    body: "Use these pairs in kickoff docs and vendor evaluations. If a shortlist cannot support the fix side (primary-job excellence, clear credits, governed sync, named compliance owner), keep looking.\n\nExample: an 8-person outbound firm bought an all-in-one, turned on bulk enrich with default overwrite, and burned credits unlocking mobiles they never dialed. Within a month, CRM notes were wiped and the domain reputation dipped. The fix was not a new vendor first — it was naming a credit owner, mapping overwrite rules, pausing send until warm-up and verification were set, and re-testing the primary job (list coverage) alone.",
    tip: "Print the six fixes next to your trial checklist — they are more predictive than feature matrices alone.",
    scenarios: [
      {
        title: "Buying all-in-one → pick primary job",
        body: "Shortlist by data, enrichment, engagement, or dialer first — accept hybrids only after the core job wins.",
      },
      {
        title: "Ignoring credits → name an owner",
        body: "Document what one credit buys, email vs mobile, rollover, and who approves bulk unlocks.",
      },
      {
        title: "Overwrite CRM → map fields first",
        body: "Decide which fields SI may update and which stay human-owned before the first bulk enrich.",
      },
      {
        title: "No compliance owner → appoint one",
        body: "Lawful basis, opt-out handling, and sourcing review are yours — not the vendor’s marketing page.",
      },
      {
        title: "Database size vanity → sample your ICP",
        body: "Test match rate on 200 of your accounts — ignore global record-count slides.",
      },
      {
        title: "Send before deliverability → warm up first",
        body: "Authenticate domains, verify lists, and ramp volume — do not burn reputation in week one.",
      },
    ],
  },
  {
    type: "step",
    id: "early-warning",
    stepNumber: 2,
    heading: "Early warning signs after go-live",
    body: "Catch failure modes in the first review cycles while they are still cheap to reverse. Credit cliffs and bounce spikes are louder than a glowing kickoff deck.\n\nExample: two weeks after go-live, that outbound firm’s manager still pasted a Google Sheet of “good emails” into Slack because CRM enrich had overwritten titles. That shadow-sheet warning meant sync trust had already failed — they paused enrich, restored field rules, and required live SI + CRM for the next four list builds before expanding seats.",
    tip: "If teams keep a shadow CSV of “safe contacts,” adoption has already failed — intervene before buying more credits.",
    scenarios: [
      {
        title: "Shadow CSVs return",
        body: "Teams keep personal “safe contact” sheets — trust in live SI and CRM is gone.",
      },
      {
        title: "Credit cliff mid-month",
        body: "Nobody owns consumption; campaigns stop when unlocks run out without a forecast.",
      },
      {
        title: "Bounce or complain spike",
        body: "Volume send on unverified data burns domains — pause and fix hygiene before more seats.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "risk-checklist",
    title: "Risk checklist before you buy or expand",
    rows: [
      {
        feature: "Primary job named (data / enrich / engage / dial)",
        mustHave: true,
        niceToHave: false,
        notes: "Prevents all-in-one overbuy",
      },
      {
        feature: "Credit owner + unit economics documented",
        mustHave: true,
        niceToHave: false,
        notes: "Prevents surprise burn",
      },
      {
        feature: "ICP sample match-rate test planned",
        mustHave: true,
        niceToHave: false,
        notes: "Prevents vanity size buy",
      },
      {
        feature: "CRM overwrite / field map written",
        mustHave: true,
        niceToHave: false,
        notes: "Prevents CRM wipe",
      },
      {
        feature: "Named compliance / privacy owner",
        mustHave: true,
        niceToHave: false,
        notes: "Prevents orphaned risk",
      },
      {
        feature: "Deliverability setup before volume",
        mustHave: true,
        niceToHave: false,
        notes: "Prevents domain burn",
      },
    ],
  },
  {
    type: "size-match",
    id: "mistakes-by-stage",
    title: "Mistakes that show up by stage",
    tiers: [
      {
        id: "selecting",
        label: "Selecting",
        description:
          "All-in-one demos and vanity database size dominate — insist on primary job and ICP sample.",
        fitHints: ["Shape first", "How to choose"],
      },
      {
        id: "piloting",
        label: "Piloting",
        description:
          "Ignoring credits and skipping match-rate tests create false confidence.",
        fitHints: ["Credit owner", "200-account sample"],
      },
      {
        id: "syncing",
        label: "Syncing to CRM",
        description:
          "Blind overwrite and missing field maps create lasting distrust.",
        fitHints: ["Overwrite rules", "Source fields"],
      },
      {
        id: "scaling",
        label: "Scaling send/dial",
        description:
          "No compliance owner and send-before-deliverability burn goodwill and domains.",
        fitHints: ["Compliance owner", "Warm-up"],
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "The six mistakes (summary)",
    items: [
      {
        title: "Buying all-in-one",
        body: "Paying for breadth without a primary-job win — fix by shortlisting data, enrichment, engagement, or dialer first.",
      },
      {
        title: "Ignoring credits",
        body: "Seat price looks fine until mobile unlocks and export caps decide real cost — fix with a named credit owner and unit economics.",
      },
      {
        title: "Overwrite CRM blindly",
        body: "Default sync wiping notes and custom fields trains the team to ignore the CRM — fix with a field map before bulk enrich.",
      },
      {
        title: "No compliance owner",
        body: "Assuming the vendor “handles GDPR” is not a program — fix by appointing a privacy/compliance owner for outreach regions.",
      },
      {
        title: "Database size vanity",
        body: "Global record counts do not prove ICP coverage — fix by testing match rate on your own accounts.",
      },
      {
        title: "Send before deliverability",
        body: "Volume on unverified lists burns domains — fix with verification, authentication, and warm-up first.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is the most common sales intelligence mistake?",
        answer:
          "Buying an all-in-one without proving the primary job — closely followed by ignoring credits, overwriting CRM without rules, and having no compliance owner. Example: an 8-person firm enabled default overwrite and burned mobile credits they never used until they mapped fields and named a credit owner.",
      },
      {
        question: "Can we fix a failed SI rollout without switching vendors?",
        answer:
          "Often yes: pause bulk enrich, write overwrite rules, reset credit ownership, sample ICP coverage again, and fix deliverability before expanding seats. Switch only if the product shape truly cannot support the primary job.",
      },
      {
        question: "Should AI features drive the SI purchase?",
        answer:
          "No. Treat AI as a nice-to-have after coverage on your ICP, credit clarity, CRM sync, and deliverability work reliably.",
      },
      {
        question: "What should I read next?",
        answer:
          "Use How to Choose Sales Intelligence for evaluation criteria, Types of Sales Intelligence for shapes, and Best Sales Intelligence Software when you are ready to compare researched products.",
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
        description: "Buying framework that avoids overbuy.",
      },
      {
        href: "/guides/types-of-sales-intelligence/",
        label: "Types of sales intelligence",
        description: "Shape before brand.",
      },
      {
        href: "/guides/sales-intelligence-glossary/",
        label: "Sales intelligence glossary",
        description: "Credits, match rate, compliance terms.",
      },
      {
        href: "/guides/sales-intelligence-vs-spreadsheet/",
        label: "SI vs spreadsheet / bought lists",
        description: "Cutover without dual-source chaos.",
      },
      {
        href: "/guides/sales-intelligence-examples/",
        label: "Sales intelligence examples",
        description: "Scenarios with healthier operating rules.",
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
    title: "Choose with fewer failure modes",
    body: "After you lock primary job, credits, and sync rules, Best Sales Intelligence Software helps you compare researched products — without affiliate-ordered rankings.",
    href: "/best/sales-intelligence-software/",
    ctaLabel: "See Best Sales Intelligence →",
    variant: "finder",
  },
];

export const commonSalesIntelligenceMistakesGuide: GuidePage = {
  id: "guide-common-sales-intelligence-mistakes",
  slug: "common-sales-intelligence-mistakes",
  title: "Common Sales Intelligence Mistakes (and How to Fix Them)",
  summary:
    "Avoid the sales intelligence failure patterns that waste credits and CRM trust — buying all-in-one, ignoring credits, overwriting CRM, no compliance owner, vanity database size, and send-before-deliverability — with practical mistake → fix pairs.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "fundamental",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/common-sales-intelligence-mistakes-hero.png",
    alt: "Educational overview of common sales intelligence failure modes around all-in-one buys, credits, CRM overwrite, compliance, vanity size, and deliverability.",
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
    "types-of-sales-intelligence",
    "sales-intelligence-glossary",
    "sales-intelligence-vs-spreadsheet",
    "sales-intelligence-examples",
    "sales-intelligence-benefits",
  ],
  blocks: commonSalesIntelligenceMistakesBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name the primary job",
      description: "Data, enrich, engage, or dial — before all-in-one.",
      order: 0,
    },
    {
      id: "credits-sync",
      label: "Assign credit + sync owners",
      description: "Unit economics and overwrite map written.",
      order: 1,
    },
    {
      id: "compliance",
      label: "Name a compliance owner",
      description: "Before prospecting in regulated regions.",
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
    title: "Common Sales Intelligence Mistakes & Fixes | SoftwareGlimpse",
    description:
      "Common sales intelligence mistakes — all-in-one buys, credits, CRM overwrite, compliance, vanity database size, deliverability — with practical fixes.",
    canonicalPath: "/guides/common-sales-intelligence-mistakes/",
    indexable: true,
  },
};
