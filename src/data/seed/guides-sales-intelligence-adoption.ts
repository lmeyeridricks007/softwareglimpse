import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Sales Intelligence Adoption — login ≠ adoption; unlock loop; 30/60/90 gates.
 * Template: softwareglimpse-guide-template-v1
 */
const salesIntelligenceAdoptionGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Sales intelligence adoption is core-loop usage under manager coaching — search/verify/CRM/suppress — not seat logins or credits spent. Decision rule: treat adoption as healthy only when unlocks follow ICP rules, CRM stays system of record, managers coach from SI+CRM views (not side sheets), and 30/60/90 gates pass. If any fail, pause credit expansion and fix training or process — do not buy another database.",
    bullets: [
      "Login ≠ adoption",
      "Core unlock loop",
      "Coach from SI + CRM",
      "30/60/90 gates",
      "Train + mistakes",
      "Expand on evidence",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Measure the loop, not the login",
        body: "Verified unlocks landing in CRM beat vanity active-user charts.",
      },
      {
        label: "Managers are the adoption system",
        body: "If coaching still happens from private Sheets, SI is optional.",
      },
      {
        label: "Credits spent ≠ value",
        body: "Burn without meetings or CRM hygiene is waste, not adoption.",
      },
      {
        label: "Gates beat launch parties",
        body: "30/60/90 checkpoints decide expand, coach, or simplify.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "adoption-path",
    title: "Adoption path",
    steps: [
      { id: "define", label: "Define loop", short: "Verify → CRM" },
      { id: "train", label: "Train ritual", short: "Role practice" },
      { id: "coach", label: "Coach", short: "SI + CRM views" },
      { id: "gate", label: "30/60/90", short: "Pass or intervene" },
      { id: "expand", label: "Expand", short: "Only on evidence" },
    ],
    ctaHref: "/guides/sales-intelligence-training/",
    ctaLabel: "Training guide →",
    figure: {
      src: "/guides/sales-intelligence-adoption-gates.png",
      alt: "SI adoption path: define unlock loop, train, coach from SI+CRM, run 30/60/90 gates, expand only on evidence.",
      caption:
        "Adoption is gated operating change — expand credits only when the loop is proven.",
    },
  },
  {
    type: "figure",
    id: "adoption-gates-visual",
    title: "30 / 60 / 90 adoption gates",
    src: "/guides/sales-intelligence-adoption-gates.png",
    alt: "Three-column SI adoption timeline for Day 30, Day 60, and Day 90 with pass versus coach-or-simplify decision paths.",
    caption:
      "Each gate is a decision — expand, coach, or simplify — not a calendar decoration.",
  },
  {
    type: "checklist",
    id: "adoption-definition-checklist",
    title: "Define adoption before you measure it",
    copyable: true,
    items: [
      {
        id: "loop",
        label: "Write the core unlock loop in one sentence",
        description: "Search ICP → verify → CRM update → suppress honor.",
        order: 0,
      },
      {
        id: "manager-view",
        label: "Name the manager coaching views",
        description: "SI activity + CRM board — no side sheet.",
        order: 1,
      },
      {
        id: "non-signals",
        label: "List non-adoption signals",
        description: "Login-only, sheet rebuilds, credit burn without CRM.",
        order: 2,
      },
      {
        id: "gate-owners",
        label: "Assign 30/60/90 gate owners",
        description: "RevOps + sales lead jointly sign pass/fail.",
        order: 3,
      },
    ],
  },
  {
    type: "step",
    id: "login-vs-adoption",
    stepNumber: 1,
    heading: "Separate logins and credit burn from adoption",
    body: "Seat activity proves people can open the app. Credits spent prove unlocks happened. Adoption proves the system of record and outreach rules are where work lives.\n\nExample: Northwind’s week three showed strong logins and high credit burn, but Friday still rebuilt target lists in Sheets because CRM duplicates and empty next steps made SI untrustworthy. Ops redefined success as “CRM-native Friday review with verified unlocks” and stopped reporting login counts to leadership.",
    tip: "If leadership only asks “are people logging in?”, reframe before you celebrate.",
    figure: {
      src: "/guides/sales-intelligence-adoption-hero.png",
      alt: "Sales intelligence adoption hero: login and credit charts contrasted with core unlock loop and manager coaching from SI plus CRM views, plus 30/60/90 gates.",
      caption:
        "Logins and credit burn can look healthy while the unlock loop is still broken.",
    },
    scenarios: [
      {
        title: "High burn, low trust",
        body: "Unlocks never land cleanly in CRM — fix sync and coaching.",
      },
      {
        title: "Low usage, high shadow work",
        body: "Sheets still win — simplify filters and retrain the ritual.",
      },
      {
        title: "Manager bypass",
        body: "Managers accept verbal list updates — make SI+CRM the review surface.",
      },
    ],
  },
  {
    type: "step",
    id: "gates-306090",
    stepNumber: 2,
    heading: "Run 30 / 60 / 90 gates",
    body: "Day 30: loop trained, sync rules live, no uncontrolled credit spray. Day 60: managers coach from SI+CRM; bounce/duplicate signals meet team targets for two weeks; side sheets retired from review. Day 90: expand seats or credit pools only if gates passed — otherwise intervene.\n\nExample: Crestview fails Day 60 because partners still rebuild account lists for Monday. They freeze new credits, cut unused filters, and retrain verify-before-send for three weeks before retrying the gate.",
    tip: "Missing a gate is information — not a reason to add more tools.",
    scenarios: [
      {
        title: "Pass",
        body: "Expand the next pod with the same core config.",
      },
      {
        title: "Coach",
        body: "Hold budgets steady; run hygiene huddles.",
      },
      {
        title: "Simplify",
        body: "Remove unused fields/filters; rewrite the one-sentence loop.",
      },
    ],
  },
  {
    type: "mistakes",
    id: "mistakes",
    title: "Adoption mistakes",
    items: [
      {
        title: "Celebrating credit dashboards",
        body: "Spend without CRM hygiene trains leadership to ignore risk.",
      },
      {
        title: "Expanding before managers change",
        body: "More seats amplify sheet coaching and duplicate mess.",
      },
      {
        title: "Training as a one-time webinar",
        body: "Without live ICP practice and gate reviews, habits snap back.",
      },
      {
        title: "Buying another database to “fix adoption”",
        body: "Process debt rarely yields to more records.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    items: [
      {
        question: "What is sales intelligence adoption?",
        answer:
          "Adoption means the team completes the unlock loop (ICP search, verify, CRM update, suppression) and managers coach from SI+CRM views. Logins or raw credit burn alone are not adoption.",
      },
      {
        question: "How do we measure adoption without fake benchmarks?",
        answer:
          "Track team-defined signals — CRM landing rate for unlocks, bounce handling, sheet retirement, and CRM-native reviews. Intervene when they miss for two weeks. Do not invent industry adoption percentages.",
      },
      {
        question: "What should I do next?",
        answer:
          "Write the one-sentence loop, schedule the first SI+CRM manager review, and set Day 30/60/90 owners. Use Training for cert-lite and Data Quality for hygiene signals.",
      },
    ],
  },
  {
    type: "related-content",
    id: "related",
    title: "Related sales intelligence resources",
    links: [
      {
        href: "/guides/sales-intelligence-training/",
        label: "Training guide",
        description: "Role labs that stick the loop.",
      },
      {
        href: "/guides/sales-intelligence-data-quality/",
        label: "Data quality",
        description: "Hygiene that sustains adoption.",
      },
      {
        href: "/guides/sales-intelligence-selection-mistakes/",
        label: "Selection mistakes",
        description: "Process debts that show up as “adoption.”",
      },
      {
        href: "/guides/how-to-choose-sales-intelligence/",
        label: "How to choose SI",
        description: "Job fit before expand.",
      },
      {
        href: "/best/sales-intelligence-software/",
        label: "Best sales intelligence",
        description: "Shortlist context.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "choose-cta",
    title: "Plan adoption into the buy",
    body: "Name the unlock loop and gate owners before you scale credits — job-first selection first if the tool is still open.",
    href: "/guides/how-to-choose-sales-intelligence/",
    ctaLabel: "How to choose SI →",
    variant: "finder",
  },
];

export const salesIntelligenceAdoptionGuide: GuidePage = {
  id: "guide-sales-intelligence-adoption",
  slug: "sales-intelligence-adoption",
  title: "Sales Intelligence Adoption Guide: Login ≠ Adoption",
  summary:
    "Drive SI adoption with the unlock loop, manager coaching from SI+CRM, and 30/60/90 gates — not vanity logins or credit burn.",
  categorySlugs: ["sales-intelligence"],
  productSlugs: [],
  topicType: "implementation",
  journeyStage: "optimize",
  knowledgeAreaSlug: "implementation",
  heroVisual: {
    src: "/guides/sales-intelligence-adoption-hero.png",
    alt: "Sales intelligence adoption hero: login and credit charts contrasted with unlock loop and manager coaching, plus 30/60/90 gates.",
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
    label: "See Best Sales Intelligence",
  },
  relatedGuideSlugs: [
    "sales-intelligence-training",
    "sales-intelligence-data-quality",
    "sales-intelligence-selection-mistakes",
    "how-to-choose-sales-intelligence",
  ],
  blocks: salesIntelligenceAdoptionGuideBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "define-loop",
      label: "Define unlock loop + non-adoption signals",
      description: "Verify → CRM → suppress — written.",
      order: 0,
    },
    {
      id: "manager-ritual",
      label: "Schedule SI+CRM manager reviews",
      description: "No side sheet as coaching surface.",
      order: 1,
    },
    {
      id: "gates",
      label: "Run 30/60/90 pass-or-intervene gates",
      description: "Expand credits only on evidence.",
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
    title:
      "Sales Intelligence Adoption Guide: Login ≠ Adoption | SoftwareGlimpse",
    description:
      "Measure SI adoption by unlock-loop usage and manager coaching — with 30/60/90 gates and no vanity login or credit-burn metrics.",
    canonicalPath: "/guides/sales-intelligence-adoption/",
    indexable: true,
  },
};
