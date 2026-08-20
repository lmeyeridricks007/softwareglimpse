import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales intelligence implementation guide — week 0–4 gated rollout.
 * Template: softwareglimpse-guide-template-v1
 * Published and indexable (editorial gate cleared 2026-08-17).
 */
const salesIntelligenceImplementationBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Implement sales intelligence as a gated four-week operating change: name owners, lock the CRM field map and overwrite rules, set a credit budget, run one pilot pod, then expand only after success metrics hold for two weekly reviews. Decision rule: do not firm-wide unlock seats or uncapped enrich jobs until the pilot proves match/fill quality, credit burn stays inside budget, and Friday pipeline work does not need a side spreadsheet of “real” contacts.",
    bullets: [
      "Owners first",
      "CRM field map",
      "Credit budget",
      "Pilot pod",
      "Success metrics",
      "Expand last",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Week ranges are gates, not guarantees",
        body: "Week 0–4 is a planning scaffold — advance only when evidence from the pilot clears each gate.",
      },
      {
        label: "Credits are a shared budget",
        body: "Without a cap and an owner, one hot campaign empties the month for everyone.",
      },
      {
        label: "Field map before seats",
        body: "Overwrite rules and CRM destinations must exist before reps click Enrich.",
      },
      {
        label: "Pilot beats big-bang",
        body: "One pod proves workflow and hygiene before you inherit every messy process.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "implementation-journey",
    title: "SI implementation journey (Week 0–4)",
    steps: [
      { id: "w0", label: "Week 0", short: "Owners & outcomes" },
      { id: "w1", label: "Week 1", short: "Map & connect" },
      { id: "w2", label: "Week 2", short: "Pilot enrich" },
      { id: "w3", label: "Week 3", short: "Review metrics" },
      { id: "w4", label: "Week 4", short: "Expand seats" },
    ],
    ctaHref: "/best/sales-intelligence-software/",
    ctaLabel: "Best SI software →",
    figure: {
      src: "/guides/sales-intelligence-implementation-guide-roadmap.png",
      alt: "Sales intelligence implementation roadmap: owners and outcomes, CRM field map and overwrite rules, credit budget, pilot enrich run, success metrics gate, then expand seats.",
      caption:
        "Gate expansion on evidence — owners, field map, credit budget, and pilot metrics before firm-wide seats.",
    },
  },
  {
    type: "figure",
    id: "rollout-board",
    title: "Week 0–4 rollout board",
    src: "/guides/sales-intelligence-implementation-guide-hero.png",
    alt: "Annotated SaaS rollout board for sales intelligence Week 0–4 with swim lanes for owners, CRM field map, credit budget, pilot pod, and success metrics, plus a prove-pilot-before-firm-wide gate.",
    caption:
      "Implementation is a gated board — credit budget and field map sit beside the pilot pod, not after go-live surprises.",
  },
  {
    type: "feature-matrix",
    id: "day-zero-vs-later",
    title: "Day-zero vs later configuration",
    rows: [
      {
        feature: "Named owners (RevOps, sales lead, pilot pod)",
        mustHave: true,
        niceToHave: false,
        notes: "Without owners, credits and fields drift immediately.",
      },
      {
        feature: "CRM field map + overwrite rules",
        mustHave: true,
        niceToHave: false,
        notes: "Written before first enrich — see enrichment explained.",
      },
      {
        feature: "Credit budget + burn alerts",
        mustHave: true,
        niceToHave: false,
        notes: "Monthly cap for pilot; expand after metrics hold.",
      },
      {
        feature: "CRM sync for the pilot segment",
        mustHave: true,
        niceToHave: false,
        notes: "Prove write-back on live records before more seats.",
      },
      {
        feature: "Firm-wide seat unlock",
        mustHave: false,
        niceToHave: true,
        notes: "After two clean weekly reviews — not week 1.",
      },
      {
        feature: "Intent / technographic add-ons",
        mustHave: false,
        niceToHave: true,
        notes: "After core contact fill and hygiene are trusted.",
      },
      {
        feature: "Uncapped enrichment of full CRM history",
        mustHave: false,
        niceToHave: false,
        notes: "Pilot open work first; archive is a later project.",
      },
    ],
  },
  {
    type: "checklist",
    id: "pre-implementation-checklist",
    title: "Before Week 0 starts",
    copyable: true,
    items: [
      {
        id: "primary-job",
        label: "Primary job frozen (enrichment, lists, engagement, dialer)",
        description: "How-to-choose decision done — do not implement the wrong shape.",
        order: 0,
      },
      {
        id: "outcomes",
        label: "Three 30-day outcomes written",
        description: "Observable in reviews — e.g. open opps have usable email.",
        order: 1,
      },
      {
        id: "owners",
        label: "RevOps admin + sales sponsor + pilot lead named",
        description: "Hours on the calendar — not “everyone owns data.”",
        order: 2,
      },
      {
        id: "pilot",
        label: "Pilot pod chosen (one team, bounded accounts)",
        description: "Large enough to feel real; small enough to fix fast.",
        order: 3,
      },
      {
        id: "credit-budget",
        label: "Credit budget and burn owner set",
        description: "What one credit buys is documented from the vendor plan.",
        order: 4,
      },
      {
        id: "success-metrics",
        label: "Success metrics + exit criteria written",
        description: "Match/fill, credit burn, hygiene signals — two clean weeks.",
        order: 5,
      },
    ],
  },
  {
    type: "step",
    id: "week-0-owners",
    stepNumber: 1,
    heading: "Week 0 — Owners, outcomes, and pilot scope",
    body: "Freeze three near-term outcomes, a simple RACI (who is Responsible / Accountable for credits, CRM fields, and training), and a pilot pod. Do not start from a vendor “week 1–12” slide as truth — use it only as a checklist of topics.\n\nExample: Northline Growth, a 14-person B2B services firm, freezes outcomes as (1) every open opportunity contact has a usable work email, (2) pilot SDRs start Monday from CRM — not a personal sheet, (3) monthly credit burn stays inside the agreed cap. RevOps lead Jordan owns admin and credits (~3 hours/week); sales manager Priya owns stage honesty and coaching; founder Sam sponsors scope. They pilot Priya’s four-person outbound pod on ~120 open-opportunity accounts.",
    tip: "If nobody can name the credit owner and the pilot exit criteria, you are still in discovery — not implementation.",
    scenarios: [
      {
        title: "Enrichment-led",
        body: "Pilot = open opportunities or one segment’s owned book.",
      },
      {
        title: "List-building-led",
        body: "Pilot = one SDR’s weekly ICP list + CRM export path.",
      },
      {
        title: "Founder-led",
        body: "Pilot = founder book + first hire — prove handoffs early.",
      },
    ],
  },
  {
    type: "step",
    id: "week-1-map",
    stepNumber: 2,
    heading: "Week 1 — CRM field map, overwrite rules, connect",
    body: "Map SI fields → CRM fields, freeze overwrite rules (fill blanks vs refresh vs never touch), connect CRM for the pilot only, and smoke-test one enrich + one export/list path. Defer marketplace add-ons and firm-wide intent feeds. Deep-dive field intent in the enrichment explained guide; keep ongoing trust with CRM data hygiene.\n\nExample: Northline maps work email and title to Contact; company domain to Account; owner and next-step stay CRM-only. Overwrite = fill blanks for email; monthly title refresh allowed; notes never touched. Jordan connects HubSpot for the pilot pod, runs ten manual enriches, and fixes two mismatched companies before anyone else gets a seat.",
    tip: "Every synced field needs an owner who will keep it accurate — otherwise remove it from the map.",
    scenarios: [
      {
        title: "Identity keys",
        body: "Domain, email, LinkedIn — ambiguous matches go to a queue.",
      },
      {
        title: "Permissions",
        body: "Pilot seats only; admin can pause enrich jobs.",
      },
      {
        title: "Compliance note",
        body: "Lawful basis for outreach is yours — loop privacy before EU/UK volume.",
      },
    ],
  },
  {
    type: "step",
    id: "week-2-pilot",
    stepNumber: 3,
    heading: "Week 2 — Pilot enrich (or list) under a credit budget",
    body: "Run the primary job on the pilot segment only. Cap credits for the week. Have ops and the pilot lead walk records together: match quality, fill quality, CRM write-back, and whether reps still keep a side sheet. Fix maps and rules before inviting more seats.\n\nExample: Northline budgets a fixed credit block for Week 2. Priya’s pod enriches open-opportunity contacts only. Three accounts rematch to the wrong legal entity; Jordan tightens domain matching and re-runs those rows. Credit burn stays under the weekly cap. Two reps still paste emails into a sheet — Priya coaches them onto the CRM view before Week 3 review.",
    tip: "Pilot the messiest shared accounts — clean AE-only samples hide sync and ownership failures.",
    scenarios: [
      {
        title: "Enrich job",
        body: "Bounded account list + credit cap + spot-check.",
      },
      {
        title: "List job",
        body: "Same ICP filters every day; count usable verified rows.",
      },
      {
        title: "Engagement add-on",
        body: "Only if primary job already clears — sequences on bad data amplify waste.",
      },
    ],
  },
  {
    type: "step",
    id: "week-3-metrics",
    stepNumber: 4,
    heading: "Week 3 — Success metrics and the hygiene gate",
    body: "Review the scorecard you froze in Week 0 — typically: match/fill on the pilot sample, credits used vs budget, % open opps with usable email, duplicate incidents from write-back, and “side sheet still required?” Hold a Friday (or Monday) review from CRM. Fail the gate if metrics miss or reps cannot work without a rebuild sheet.\n\nExample: Northline’s first Friday fails — twelve open contacts still lack email after enrich, and one duplicate cluster appeared. Jordan and Priya run two midweek hygiene huddles, merge duplicates, and re-enrich the misses under the same credit cap. Second Friday clears: board trusted, burn inside budget. Sam approves Week 4 expansion.",
    tip: "Treat empty critical fields and surprise credit spikes as incidents — not as “we’ll tune later.”",
    scenarios: [
      {
        title: "Match / fill",
        body: "Sample-based — not vendor dashboard vanity.",
      },
      {
        title: "Credit burn",
        body: "Inside budget with a named owner for exceptions.",
      },
      {
        title: "Hygiene",
        body: "Duplicates and orphan owners cleared on a schedule.",
      },
    ],
  },
  {
    type: "step",
    id: "week-4-expand",
    stepNumber: 5,
    heading: "Week 4 — Expand seats, then light automation",
    body: "After two clean weekly reviews, invite the next segment with the same field map and credit rules. Train on the pilot’s real records. Add only light automation that removes proven repetitive work (e.g. blank-email alerts). Park broad historical backfill and AI add-ons until the board stays trusted.\n\nExample: Northline clones roles for the second pod, raises the monthly credit budget with Jordan still as burn owner, and adds one alert when open opportunities lack email for seven days. Full-CRM historical enrich stays parked for a later quarter — see enrichment explained for why match-rate pilots should stay bounded.",
    tip: "Expansion is a people change — schedule training on live pilot records, not a vendor webinar alone.",
    scenarios: [
      {
        title: "Clone what worked",
        body: "Same maps, overwrite rules, and review ritual.",
      },
      {
        title: "Credit governance",
        body: "Raise caps deliberately; never “unlimited for everyone.”",
      },
      {
        title: "Ongoing hygiene",
        body: "Keep the weekly CRM hygiene ritual — enrichment does not replace it.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "High-cost implementation mistakes",
    items: [
      {
        title: "Firm-wide seats in Week 1",
        body: "You inherit every messy process and lose the ability to fix the loop quickly.",
      },
      {
        title: "No credit owner",
        body: "One campaign burns the month; trust in the tool collapses.",
      },
      {
        title: "Syncing before overwrite rules",
        body: "Vendor defaults overwrite human-corrected emails and notes.",
      },
      {
        title: "Implementing the wrong primary job",
        body: "An enrichment rollout will not fix empty top-of-funnel list scarcity.",
      },
      {
        title: "Treating vendor timelines as guarantees",
        body: "Week 0–4 is a scaffold — gate on evidence, not slide numbers.",
      },
      {
        title: "Skipping hygiene after write-back",
        body: "Duplicates and side sheets return; “implementation” looks done while the board is untrusted.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is sales intelligence implementation?",
        answer:
          "The operating change of connecting SI to your CRM, freezing field maps and credit rules, training a pilot pod, proving success metrics in weekly reviews, and expanding. It is not “turning seats on.”",
      },
      {
        question: "How long does SI implementation take?",
        answer:
          "A focused pod can prove a core loop in roughly four weeks if owners and maps are ready; multi-team rollouts take longer. Treat Week 0–4 as gated phases — not a guaranteed calendar.",
      },
      {
        question: "What should we configure on day zero?",
        answer:
          "Owners, CRM field map, overwrite rules, credit budget, CRM sync for the pilot, and a written success scorecard. Defer firm-wide seats, historical backfill, and add-on signal packs.",
      },
      {
        question: "How do we set a credit budget?",
        answer:
          "Document what one credit buys on your plan, estimate pilot volume (enrich rows or exports), set a weekly/monthly cap, and name an exception owner. Do not invent dollar totals — use the vendor’s published credit terms.",
      },
      {
        question: "Who should own SI implementation?",
        answer:
          "An executive sponsor for scope, a RevOps/admin owner for sync, fields, and credits, and a sales lead accountable for pilot adoption and honest use in reviews.",
      },
      {
        question: "What should I do next?",
        answer:
          "Confirm primary job with how to choose sales intelligence, shortlist on Best sales intelligence software, run Week 0 owners and maps, and keep CRM data hygiene on the calendar after write-back.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related implementation resources",
    links: [
      {
        href: "/categories/sales-intelligence/",
        label: "Sales intelligence category",
        description: "Category hub and product landscape.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence software",
        description: "Researched shortlist before you roll out.",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose sales intelligence",
        description: "Freeze primary job before Week 0.",
      },
      {
        href: "/guides/sales-intelligence-enrichment-explained/",
        label: "Enrichment explained",
        description: "Match rate, fields, overwrite rules.",
      },
      {
        href: "/guides/crm-data-hygiene/",
        label: "CRM data hygiene",
        description: "Weekly trust after sync.",
      },
      {
        href: "/guides/sales-intelligence-migration-guide/",
        label: "SI migration guide",
        description: "Switch vendors without losing CRM trust.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "best-cta",
    title: "Shortlist before you roll out",
    body: "Confirm the primary job, then use the researched Best sales intelligence software shortlist — implement only after coverage, credits, and CRM sync survive your pilot criteria.",
    href: "/best/sales-intelligence-software/",
    ctaLabel: "See Best SI software →",
    variant: "finder",
  },
];

export const salesIntelligenceImplementationGuide: GuidePage = {
  id: "guide-sales-intelligence-implementation-guide",
  slug: "sales-intelligence-implementation-guide",
  title: "Sales Intelligence Implementation Guide: Week 0–4",
  summary:
    "Roll out sales intelligence in a gated Week 0–4 path — owners, CRM field map, credit budget, pilot pod, and success metrics before firm-wide seats.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "implementation",
  journeyStage: "implement",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/sales-intelligence-implementation-guide-hero.png",
    alt: "Annotated SaaS rollout board for sales intelligence Week 0–4 with swim lanes for owners, CRM field map, credit budget, pilot pod, and success metrics, plus a prove-pilot-before-firm-wide gate.",
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
      relationType: "implementation-for",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:best:sales-intelligence-software",
    label: "See Best sales intelligence software",
  },
  relatedGuideSlugs: [
    "how-to-choose-sales-intelligence",
    "sales-intelligence-enrichment-explained",
    "crm-data-hygiene",
    "sales-intelligence-migration-guide",
  ],
  blocks: salesIntelligenceImplementationBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "owners-map-budget",
      label: "Freeze owners, field map, and credit budget",
      description: "Week 0–1 gates before pilot enrich.",
      order: 0,
    },
    {
      id: "pilot-metrics",
      label: "Pass pilot metrics for two weekly reviews",
      description: "Match/fill, burn, hygiene, no side sheet.",
      order: 1,
    },
    {
      id: "expand",
      label: "Expand seats with the same rules",
      description: "Then light alerts — not uncapped history.",
      order: 2,
    },
  ],
  sections: [],
  faq: [],
  freshnessClass: "medium-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T07:15:00.000Z",
    publishedAt: "2026-08-17T07:15:00.000Z",
    reviewedAt: "2026-08-17T07:15:00.000Z",
    researchStatus: "complete",
    seoStatus: "draft",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title:
      "Sales Intelligence Implementation Guide: Week 0–4 | SoftwareGlimpse",
    description:
      "Implement sales intelligence with owners, CRM field map, credit budget, pilot pod, and success metrics — a gated Week 0–4 rollout before firm-wide seats.",
    canonicalPath: "/guides/sales-intelligence-implementation-guide/",
    indexable: true,
  },
};
