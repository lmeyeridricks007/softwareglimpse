import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * CRM vs spreadsheet — when sheets are enough vs when a CRM is the system of record.
 * Template: softwareglimpse-guide-template-v1
 */
const crmVsSpreadsheetBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Stay on a spreadsheet while one person owns every deal, the list is short, and personal follow-up discipline works. Switch to a CRM when ownership is shared, deals need stages, activity must survive handoffs, or managers rebuild pipeline views every week. Decision rule: if two people need the same current status this week, the sheet is already past its job.",
    bullets: [
      "Sheets OK for solo short lists",
      "CRM for shared ownership",
      "Stages + activity history",
      "Reporting without rebuilds",
      "Switching signals",
      "Not a vendor ranking",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Sheets are a tool, not a sales OS",
        body: "Spreadsheets excel at lists and ad-hoc analysis. They struggle as multi-user systems of record for pipeline and follow-up.",
      },
      {
        label: "Shared ownership is the tipping point",
        body: "When more than one person must update and trust the same deal status, conflicting personal sheets become the failure mode.",
      },
      {
        label: "CRM value is operational, not magical",
        body: "Benefits come from owners, stages, tasks, and history — not from buying a logo. Adoption still decides outcomes.",
      },
      {
        label: "Switch when process pain is recurring",
        body: "Missed follow-ups, stale stages, and weekly sheet merges are clearer signals than “we should have a CRM someday.”",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "sheet-or-crm",
    title: "Sheet vs CRM decision path",
    steps: [
      { id: "users", label: "Who updates?", short: "Solo vs shared" },
      { id: "volume", label: "List size", short: "Short vs growing" },
      { id: "stages", label: "Stages needed?", short: "List vs pipeline" },
      { id: "history", label: "History required?", short: "Notes vs activity" },
      { id: "reporting", label: "Reporting need", short: "Ad-hoc vs weekly" },
      { id: "choose", label: "Pick the system", short: "Sheet, hybrid, CRM" },
    ],
    ctaHref: "/guides/do-i-need-a-crm/",
    ctaLabel: "Do I need a CRM? →",
    figure: {
      src: "/guides/crm-vs-spreadsheet-decision.png",
      alt: "Decision fork showing when a spreadsheet still works versus when to move to CRM.",
      caption: "Shared ownership, stages, and history are the usual tipping points into CRM.",
    },
  },
  {
    type: "figure",
    id: "boundary-visual",
    title: "Where spreadsheets stop and CRM starts",
    src: "/guides/crm-vs-spreadsheet-hero.png",
    alt: "Spreadsheet list on the left versus CRM pipeline with owners, stages, and activity history on the right.",
    caption: "Same contacts — different jobs for the system of record.",
  },
  {
    type: "step",
    id: "when-sheets-work",
    stepNumber: 1,
    heading: "When a spreadsheet is still the right call",
    body: "Many early operators overbuy CRM before they have a process worth encoding. A well-structured sheet can be enough until collaboration and stage discipline become real constraints.\n\nExample: Alex, a solo freelance consultant, tracks 40 prospects in Google Sheets with a “next step” column and calendar reminders. Nobody else edits the file. Until Alex hires help, the sheet is the right system — buying CRM early would mostly add empty fields.",
    tip: "If only you touch the list and you can answer “what’s next?” from memory or a simple column, stay on sheets until that breaks twice in the same month.",
    figure: {
      src: "/guides/crm-vs-spreadsheet-when-sheets.png",
      alt: "Four situations where a spreadsheet is still the right call, with a switch warning when ownership breaks.",
      caption: "Sheets are fine until collaboration and follow-up discipline break twice in the same month.",
    },
    scenarios: [
      {
        title: "Solo short list",
        body: "A freelancer tracking dozens of prospects with personal reminders and no shared owners.",
      },
      {
        title: "One-off campaign list",
        body: "A temporary outreach list that will not become ongoing pipeline management.",
      },
      {
        title: "Analysis sandbox",
        body: "Exporting CRM data into a sheet for a one-time analysis is still a valid spreadsheet job.",
      },
    ],
  },
  {
    type: "step",
    id: "switching-signals",
    stepNumber: 2,
    heading: "Switching signals: time for a CRM",
    body: "Treat these as operational signals, not vanity milestones. If several show up together, a CRM is usually cheaper than another “final” spreadsheet redesign.\n\nExample: Alex hires Jordan as hire #2. Within two weeks they keep conflicting copies of “pipeline.xlsx,” and a warm lead goes quiet because each thought the other followed up. That shared-ownership failure is the switch signal — not a vanity milestone like “we have 100 rows.”",
    tip: "Write down the last three pipeline mistakes caused by sheet drift — that list becomes your CRM success criteria.",
    figure: {
      src: "/guides/crm-vs-spreadsheet-example.png",
      alt: "Storyboard: solo freelancer on a spreadsheet, second hire joining, then shared CRM pipeline with owners and stages.",
      caption:
        "Hire #2 is often the moment a personal sheet stops being a safe system of record.",
    },
    scenarios: [
      {
        title: "Shared ownership pain",
        body: "Two people maintain conflicting versions; nobody trusts the “latest” file.",
      },
      {
        title: "Stage and follow-up chaos",
        body: "Deals stall because next steps live in inboxes, not attached to the record.",
      },
      {
        title: "Reporting rebuild tax",
        body: "Managers rebuild status views weekly instead of reviewing a live pipeline.",
      },
      {
        title: "Handoff amnesia",
        body: "New owners inherit a name and a guess — not activity history.",
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "job-matrix",
    title: "Spreadsheet vs CRM by job",
    figure: {
      src: "/guides/crm-vs-spreadsheet-matrix.png",
      alt: "Comparison matrix of spreadsheet versus CRM across ownership, stages, activity history, and reporting.",
      caption: "Use the job column — not feature marketing — to decide.",
    },
    rows: [
      {
        feature: "Solo contact list, light follow-up",
        mustHave: false,
        niceToHave: true,
        notes: "Spreadsheet usually enough",
      },
      {
        feature: "Shared deal ownership",
        mustHave: true,
        niceToHave: false,
        notes: "CRM system of record",
      },
      {
        feature: "Pipeline stages + next steps",
        mustHave: true,
        niceToHave: false,
        notes: "CRM strengths",
      },
      {
        feature: "Activity history across handoffs",
        mustHave: true,
        niceToHave: false,
        notes: "Hard in sheets",
      },
      {
        feature: "Weekly pipeline reviews",
        mustHave: true,
        niceToHave: false,
        notes: "CRM reporting job",
      },
      {
        feature: "One-time data analysis",
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
    figure: {
      src: "/guides/crm-vs-spreadsheet-fit-stage.png",
      alt: "Fit matrix recommending spreadsheet versus CRM by team stage from solo to hybrid.",
      caption: "Team stage changes the default — hybrid is common during cutover.",
    },
    tiers: [
      {
        id: "solo",
        label: "Solo / early",
        description:
          "Structured spreadsheet or a very light CRM — switch when memory and list size fail you.",
        fitHints: ["Personal discipline", "Short list"],
      },
      {
        id: "small-team",
        label: "2–10 person sales team",
        description:
          "CRM is usually the right system once ownership and weekly reviews matter.",
        fitHints: ["Shared owners", "Stage discipline"],
      },
      {
        id: "scaling",
        label: "Scaling org",
        description:
          "Sheets as primary pipeline create governance and forecast risk — CRM first, sheets for analysis.",
        fitHints: ["Handoffs", "Manager visibility"],
      },
      {
        id: "hybrid",
        label: "Hybrid pattern",
        description:
          "CRM as system of record; export to sheets for one-off models — never the reverse for live deals.",
        fitHints: ["SoR in CRM", "Sheets for analysis"],
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Common CRM vs spreadsheet mistakes",
    items: [
      {
        title: "Buying CRM to fix a sheet nobody updates",
        body: "If the team will not maintain records, a CRM becomes a more expensive empty spreadsheet.",
      },
      {
        title: "Keeping the sheet as the real system of record",
        body: "Dual running without a cutover date means the CRM never earns trust.",
      },
      {
        title: "Overbuilding the first CRM",
        body: "Start with contacts, owners, stages, and tasks — not every field from the old workbook.",
      },
      {
        title: "Treating vendor ROI claims as proof",
        body: "Ignore invented percentage lifts. Measure whether follow-ups and ownership actually improve.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What’s the difference between a CRM and a spreadsheet?",
        answer:
          "A spreadsheet is fine for a solo short list with personal follow-up. A CRM becomes the better system of record when ownership is shared, deals need stages, activity must survive handoffs, and managers need live reporting without rebuilding sheets every week.",
      },
      {
        question: "Is a spreadsheet a CRM?",
        answer:
          "No. A spreadsheet can store contacts and statuses, but a CRM is designed for shared ownership, activity history, workflows, and live pipeline views as a system of record.",
      },
      {
        question: "When should a solo founder switch from sheets to CRM?",
        answer:
          "When list size, follow-up load, or the need for handoff-ready history outgrows personal discipline — or when a second person must trust the same pipeline. Example: hire #2 often surfaces conflicting “latest” files within days.",
      },
      {
        question: "Can we use both CRM and spreadsheets?",
        answer:
          "Yes, with a clear rule: CRM owns live deals and activity; spreadsheets are for exports and analysis. Avoid editing the same pipeline in two places.",
      },
      {
        question: "Do we need a big suite to leave spreadsheets?",
        answer:
          "Usually not. A simple sales CRM shape is enough for most small teams. Suites add value only if you will use the extra modules.",
      },
      {
        question: "What should I read next?",
        answer:
          "Use Do I Need a CRM? to qualify timing, then How to Choose a CRM — or shortlist with CRM Finder.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/what-is-crm/",
        label: "What is CRM?",
        description: "Foundational definition.",
      },
      {
        href: "/guides/do-i-need-a-crm/",
        label: "Do I need a CRM?",
        description: "Qualify whether to adopt now.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Buying framework after you decide.",
      },
      {
        href: "/guides/when-to-adopt-crm/",
        label: "When to adopt a CRM",
        description: "Timing signals past the spreadsheet.",
      },
      {
        href: "/guides/types-of-crm/",
        label: "Types of CRM",
        description: "Which CRM shape replaces the sheet.",
      },
      {
        href: "/guides/crm-vs-erp/",
        label: "CRM vs ERP",
        description: "Another common boundary question.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist from structured answers.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Turn sheet columns into must-haves.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Ready to leave the spreadsheet?",
    body: "If shared ownership and next-step visibility are your tipping point, CRM Finder maps your answers to researched products — without affiliate-ordered rankings.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const crmVsSpreadsheetGuide: GuidePage = {
  id: "guide-crm-vs-spreadsheet",
  slug: "crm-vs-spreadsheet",
  title: "CRM vs Spreadsheet: When to Switch",
  summary:
    "Learn when a spreadsheet is enough for contacts and when a CRM becomes the system of record — shared ownership, stages, activity history, and reporting without weekly sheet rebuilds.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "comparison-education",
  journeyStage: "learn",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/crm-vs-spreadsheet-hero.png",
    alt: "Spreadsheet list versus CRM pipeline with owners, stages, and activity history.",
  },
  supports: [
    {
      contentId: "content:category:crm",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:crm-software",
      relationType: "supports-anchor",
      primary: false,
    },
    {
      contentId: "content:tool:crm-finder",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:tool:crm-finder",
    label: "Try the CRM Finder",
  },
  relatedGuideSlugs: [
    "do-i-need-a-crm",
    "what-is-crm",
    "when-to-adopt-crm",
    "crm-vs-erp",
    "crm-vs-marketing-automation",
    "crm-vs-customer-service-software",
    "types-of-crm",
    "how-to-choose-crm",
  ],
  blocks: crmVsSpreadsheetBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "owners",
      label: "Count who must update the list",
      description: "Solo is fine on sheets; shared owners favor CRM.",
      order: 0,
    },
    {
      id: "signals",
      label: "List switching signals",
      description: "Conflicts, missed follow-ups, rebuild tax, handoff gaps.",
      order: 1,
    },
    {
      id: "cutover",
      label: "Decide system of record",
      description: "Sheet, hybrid export, or CRM for live deals.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-14T08:00:00.000Z",
    publishedAt: "2026-08-14T08:00:00.000Z",
    reviewedAt: "2026-08-14T08:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "CRM vs Spreadsheet: When to Switch | SoftwareGlimpse",
    description:
      "When spreadsheets work for solo lists — and when shared ownership, stages, activity history, and reporting mean you need a CRM.",
    canonicalPath: "/guides/crm-vs-spreadsheet/",
    indexable: true,
  },
};
