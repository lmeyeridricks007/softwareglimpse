import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Do I need a CRM? — decision signals vs spreadsheet OK.
 * Template: softwareglimpse-guide-template-v1
 */
const doINeedACrmBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "You need a CRM when shared ownership, follow-ups, and pipeline truth can no longer live safely in inboxes and spreadsheets. Decision rule: if two or more people must trust the same deal status this week — or follow-ups and weekly rebuilds are already failing — choose CRM; a structured spreadsheet remains enough for a solo operator with low volume and personal discipline.",
    bullets: [
      "Missed follow-ups",
      "Dual ownership fights",
      "Weekly pipeline rebuilds",
      "Inbox as system of record",
      "Spreadsheet still OK (solo/low volume)",
      "Buy for pain, not fashion",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "CRM is a system of record decision",
        body: "The question is whether relationships and deals need shared, durable ownership — not whether a vendor demo looks impressive.",
      },
      {
        label: "Pain signals beat headcount rules",
        body: "Team size helps, but repeated operational failures are the clearer trigger.",
      },
      {
        label: "Spreadsheets are not “wrong”",
        body: "They fail when concurrency, history, and handoffs outgrow personal lists.",
      },
      {
        label: "Adoption readiness matters",
        body: "If nobody will update stages and owners, a CRM will not fix the process by existing.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "need-framework",
    title: "Do you need a CRM? A simple path",
    steps: [
      { id: "volume", label: "Volume", short: "Deals & contacts load" },
      { id: "people", label: "People", short: "Solo vs shared owners" },
      { id: "failures", label: "Failures", short: "Misses & rebuilds" },
      { id: "sor", label: "System of record", short: "Inbox / sheet / none" },
      { id: "discipline", label: "Discipline", short: "Will you maintain it?" },
      { id: "decide", label: "Decide", short: "Sheet, CRM, or wait" },
    ],
    ctaHref: "/guides/crm-vs-spreadsheet/",
    ctaLabel: "CRM vs spreadsheet →",
    figure: {
      src: "/guides/do-i-need-a-crm-path.png",
      alt: "Do you need a CRM path: volume, people, failures, system of record, decide sheet CRM or wait.",
      caption:
        "Need is driven by shared ownership and failure patterns — not by logo shopping.",
    },
  },
  {
    type: "figure",
    id: "signals-visual",
    title: "Signals you likely need a CRM",
    src: "/guides/do-i-need-a-crm-signals.png",
    alt: "Four signal cards: missed follow-ups, dual ownership, pipeline rebuilds, and inbox used as the system of record.",
    caption: "Two or more recurring signals usually mean a spreadsheet is under strain.",
  },
  {
    type: "step",
    id: "pain-signals",
    stepNumber: 1,
    heading: "Signals that point to “yes”",
    body: "Treat these as operational evidence — not vendor pressure. If several show up weekly, you are already paying the cost of a missing system of record.\n\nExample: a 5-person agency (two sellers, one founder, two delivery leads) keeps “clients.xlsx” plus Slack threads. Twice in one month, both sellers emailed the same prospect, and Friday pipeline review started with a 40-minute rebuild from inboxes. Those dual-ownership and rebuild signals mean they already need a CRM — not another spreadsheet tab.",
    tip: "Write down the last three lost deals or angry handoffs. If “we forgot” or “two people thought they owned it” appears, you have a CRM-shaped problem.",
    figure: {
      src: "/guides/do-i-need-a-crm-hero.png",
      alt: "Decision visual: when spreadsheet tracking is enough versus when a shared CRM system of record is needed.",
      caption: "Need is driven by shared ownership and failure patterns — not by logo shopping.",
    },
    scenarios: [
      {
        title: "Missed follow-ups",
        body: "Promised replies and next steps disappear because tasks live in memory or personal notes.",
      },
      {
        title: "Dual ownership",
        body: "Two people contact the same account — or nobody does — because ownership is informal.",
      },
      {
        title: "Pipeline rebuilds",
        body: "Weekly reviews start by reconstructing status from email and chat instead of reading a trusted board.",
      },
      {
        title: "Inbox as SoR",
        body: "The only complete history is someone’s mailbox; absences and handoffs break context.",
      },
    ],
  },
  {
    type: "step",
    id: "spreadsheet-ok",
    stepNumber: 2,
    heading: "When a spreadsheet is still OK",
    body: "A well-kept sheet (or lightweight list) can be enough when one person owns every deal, volume is modest, and history requirements are light. Upgrade when concurrency and handoffs appear — not because a blog said “every business needs CRM.”\n\nExample: before that agency hired the second seller, the founder’s personal sheet worked. The tipping point was concurrency — two people editing status — not row count alone.",
    tip: "If you are debating CRM vs spreadsheet, read the dedicated comparison — then return here to confirm the pain signals.",
    figure: {
      src: "/guides/do-i-need-a-crm-spreadsheet-ok.png",
      alt: "When a spreadsheet is still OK: solo owner, few open deals, short cycles, honest sheet, revisit signals later.",
      caption:
        "A clean solo sheet beats a CRM nobody updates — revisit when dual ownership or rebuilds appear.",
    },
    scenarios: [
      {
        title: "Solo operator",
        body: "You alone own follow-ups and can keep a simple stage column honest.",
      },
      {
        title: "Low concurrency",
        body: "Rarely two people edit the same account in the same week.",
      },
      {
        title: "Short cycles",
        body: "Deals close quickly enough that deep history and complex permissions are optional.",
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
          "Spreadsheet or light list is often enough until memory load or client count rises.",
        fitHints: ["Personal discipline", "Simple stages"],
      },
      {
        id: "small-shared",
        label: "2+ people sharing deals",
        description:
          "CRM becomes likely — ownership and follow-ups need a shared home.",
        fitHints: ["Clear owners", "Weekly review"],
      },
      {
        id: "scaling",
        label: "Scaling sales motion",
        description:
          "CRM is usually required for pipeline visibility, handoffs, and reporting without rebuilds.",
        fitHints: ["Managers + reps", "Handoffs"],
      },
      {
        id: "not-ready",
        label: "No willingness to update",
        description:
          "Fix process expectations first — an empty CRM is worse than an honest sheet.",
        fitHints: ["Adoption rules", "Owner habits"],
      },
    ],
  },
  {
    type: "feature-matrix",
    id: "need-checklist",
    title: "Need checklist (honest signals)",
    rows: [
      {
        feature: "More than one person touches the same deals",
        mustHave: true,
        niceToHave: false,
        notes: "Strong CRM signal",
      },
      {
        feature: "Follow-ups regularly slip",
        mustHave: true,
        niceToHave: false,
        notes: "Strong CRM signal",
      },
      {
        feature: "Pipeline rebuilt from email each week",
        mustHave: true,
        niceToHave: false,
        notes: "Strong CRM signal",
      },
      {
        feature: "Want AI insights before basic ownership",
        mustHave: false,
        niceToHave: true,
        notes: "Not a need signal",
      },
      {
        feature: "Buying because “everyone has one”",
        mustHave: false,
        niceToHave: true,
        notes: "Weak reason alone",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Decision mistakes",
    items: [
      {
        title: "Buying before naming the pain",
        body: "Without a concrete failure mode, you will evaluate features instead of fit.",
      },
      {
        title: "Assuming headcount alone decides",
        body: "A disciplined solo seller may outlast a chaotic five-person team on a sheet — until sharing breaks.",
      },
      {
        title: "Skipping adoption rules",
        body: "If nobody agrees who updates stages, CRM will mirror the same chaos digitally.",
      },
      {
        title: "Confusing CDP or marketing suites with CRM need",
        body: "Identity and campaign tools do not replace deal ownership and follow-up discipline.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "Do I need a CRM?",
        answer:
          "Yes when shared ownership, follow-ups, and pipeline truth can no longer live safely in inboxes and spreadsheets — typically when two or more people must trust the same deal status, follow-ups get missed, or you rebuild the pipeline every week. Solo operators with low volume can stay on a structured spreadsheet until concurrency appears.",
      },
      {
        question: "Do small businesses need a CRM?",
        answer:
          "When more than one person shares deals or follow-ups regularly slip — yes. Solo operators with low volume can wait and use a structured spreadsheet. Example: a 5-person agency with two sellers and conflicting status files already has a CRM-shaped problem.",
      },
      {
        question: "Is Excel or Google Sheets a CRM?",
        answer:
          "Sheets can track stages, but they are weak as a multi-user system of record with activity history, ownership rules, and handoffs. See CRM vs spreadsheet for the boundary.",
      },
      {
        question: "What if we are not ready to adopt?",
        answer:
          "Agree owners and a weekly update habit first. Installing software without those norms rarely helps.",
      },
      {
        question: "What should I do next?",
        answer:
          "If signals point to yes, read When to Adopt CRM for timing, then use CRM Finder to shortlist — or compare CRM vs spreadsheet if you are still on the fence.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related CRM resources",
    links: [
      {
        href: "/guides/crm-vs-spreadsheet/",
        label: "CRM vs spreadsheet",
        description: "When sheets stop being enough.",
      },
      {
        href: "/guides/when-to-adopt-crm/",
        label: "When to adopt CRM",
        description: "Timing: pilot, expand, avoid extremes.",
      },
      {
        href: "/guides/what-is-crm/",
        label: "What is CRM?",
        description: "Foundational definition.",
      },
      {
        href: "/guides/crm-benefits/",
        label: "CRM benefits",
        description: "What you get once you adopt.",
      },
      {
        href: "/guides/how-to-choose-crm/",
        label: "How to choose a CRM",
        description: "Buying framework once the answer is yes.",
      },
      {
        href: "/guides/crm-requirements-guide/",
        label: "CRM requirements guide",
        description: "Write must vs nice before demos.",
      },
      {
        href: "/tools/crm-finder/",
        label: "CRM Finder",
        description: "Shortlist from structured answers.",
      },
      {
        href: "/tools/crm-requirements-builder/",
        label: "Requirements Builder",
        description: "Turn pain signals into requirements.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "finder-cta",
    title: "Ready to shortlist?",
    body: "If the signals above match your week, CRM Finder maps your constraints to researched products — without affiliate-ordered rankings.",
    href: "/tools/crm-finder/",
    ctaLabel: "Find My CRM →",
    variant: "finder",
  },
];

export const doINeedACrmGuide: GuidePage = {
  id: "guide-do-i-need-a-crm",
  slug: "do-i-need-a-crm",
  title: "Do I Need a CRM? Decision Signals That Matter",
  summary:
    "Decide whether you need CRM software using practical signals — missed follow-ups, dual ownership, pipeline rebuilds, and inbox-as-system-of-record — and when a spreadsheet is still enough.",
  categorySlugs: ["crm"],
  productSlugs: [],
  topicType: "selection",
  journeyStage: "choose",
  knowledgeAreaSlug: "fundamentals",
  heroVisual: {
    src: "/guides/do-i-need-a-crm-hero.png",
    alt: "Decision visual: when spreadsheet tracking is enough versus when a shared CRM system of record is needed.",
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
    "when-to-adopt-crm",
    "crm-vs-spreadsheet",
    "how-to-choose-crm",
    "crm-requirements-guide",
    "what-is-crm",
    "crm-benefits",
    "common-crm-mistakes",
  ],
  blocks: doINeedACrmBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "signals",
      label: "Count recurring pain signals",
      description: "Follow-ups, ownership, rebuilds, inbox SoR.",
      order: 0,
    },
    {
      id: "sharing",
      label: "Confirm who shares deals",
      description: "Solo sheet vs multi-owner need.",
      order: 1,
    },
    {
      id: "adoption",
      label: "Confirm update willingness",
      description: "Who will keep stages and owners honest?",
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
    title: "Do I Need a CRM? | SoftwareGlimpse",
    description:
      "Practical signals for when you need a CRM — and when a spreadsheet is still enough — without invented ROI claims.",
    canonicalPath: "/guides/do-i-need-a-crm/",
    indexable: true,
  },
};
