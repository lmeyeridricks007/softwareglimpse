import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const hrPricingGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "HR software pricing is usually per user/employee, per hiring pool, per hub, or demo/quote — plus add-ons and implementation. Decision rule: never compare the advertised starter tile; compare the total for your real headcount on the configuration that unlocks your must-have workflows.",
    bullets: [
      "Seats / users / employees",
      "Pools / hubs / locations",
      "Plan feature gates",
      "Add-ons (AI, SMS, onboard)",
      "Implementation fees",
      "Annual vs monthly",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Gates are part of the price",
        body: "A cheap free plan that blocks GPS, AI, or multi-pool hiring forces an upgrade — budget the qualifying tier.",
      },
      {
        label: "Multi-hub math stacks TCO",
        body: "Frontline suites that sell Ops, Comms, and HR hubs separately need a line-item model for every hub you will use.",
      },
      {
        label: "Opaque quotes need a worksheet",
        body: "When seat dollars are demo-only, capture implementation fees, minimums, and renewal assumptions in writing.",
      },
      {
        label: "LMS commerce prices differently",
        body: "Course enrollment fees and learner caps are not comparable to ATS pool pricing or time-clock seats on a tile alone.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "pricing-path",
    title: "Pricing path",
    steps: [
      { id: "users", label: "Users", short: "Real headcount" },
      { id: "config", label: "Config", short: "Hubs / pools" },
      { id: "gates", label: "Gates", short: "Must-have features" },
      { id: "addons", label: "Add-ons", short: "AI / SMS / onboard" },
      { id: "impl", label: "Impl", short: "Setup fees" },
      { id: "total", label: "Total", short: "Compare like for like" },
    ],
    ctaHref: "/best/hr-software/",
    ctaLabel: "See Best HR Software →",
    figure: {
      src: "/guides/hr-pricing-guide-stack.png",
      alt: "HR cost stack: users, hubs or pools, feature gates, add-ons, and implementation.",
      caption: "The starter tile is the bottom layer. Hubs, gates, and fees often decide which vendor is actually cheaper.",
    },
  },
  {
    type: "step",
    id: "build-total",
    stepNumber: 1,
    heading: "Build one comparable total per vendor",
    body: "Use one assumption set: headcount, must-have workflows, expected hubs/add-ons, and whether implementation is required. Total the qualifying configuration.\n\nWorked example: Northline Ops needs 35 frontline users with scheduling + time hubs. Vendor A’s free plan looks cheaper but scheduling unlocks on a paid hub — so the honest comparison is paid hub × configuration, not the free tile.",
    tip: "Ask for a written quote on the qualifying configuration for your headcount.",
    figure: {
      src: "/guides/hr-pricing-guide-worked-example.png",
      alt: "Worked example comparing two HR quotes at the same headcount with hub and gate effects.",
      caption: "Same team, same requirements — the cheaper tile is not always the cheaper deployment once hubs apply.",
    },
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "How much does HR software cost?",
        answer:
          "Models vary: free ATS pools, per-user time clocks, multi-hub WFM floors, and demo/quote SOP platforms. Exact floors change — confirm live vendor pricing.",
      },
      {
        question: "Should I pay annually?",
        answer:
          "Annual billing is usually discounted but locks headcount. If seasonal staffing swings, price both.",
      },
      {
        question: "Do affiliate deals change our advice?",
        answer:
          "No. SoftwareGlimpse methodology excludes affiliate economics from rankings and pricing guidance.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next",
    title: "Next steps",
    body: "Shortlist by job cluster, then confirm live commercial terms.",
    href: "/best/hr-software/",
    ctaLabel: "Best HR software →",
    variant: "finder",
  },
];

export const hrPricingGuide: GuidePage = {
  id: "guide-hr-pricing-guide",
  slug: "hr-pricing-guide",
  title: "HR Software Pricing Guide",
  summary:
    "Budget ATS, frontline WFM, time clocks, SOP training, and LMS tools by qualifying configuration — not the advertised starter tile.",
  categorySlugs: ["hr"],
  topicType: "pricing-education",
  heroVisual: {
    src: "/guides/hr-pricing-guide-hero.png",
    alt: "Educational illustration for HR Software Pricing Guide.",
  },
  supports: [
    {
      contentId: "content:category:hr",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:hr-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  journeyStage: "evaluate",
  relatedGuideSlugs: [
    "what-is-hr-software",
    "how-to-choose-hr-software",
    "hr-requirements-guide",
    "hr-evaluation-guide",
  ],
  blocks: hrPricingGuideBlocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-17T00:00:00.000Z",
    publishedAt: "2026-08-17T00:00:00.000Z",
    reviewedAt: "2026-08-17T00:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "HR Software Pricing Guide | SoftwareGlimpse",
    description:
      "How to budget HR software — seats, hubs, pools, plan gates, add-ons, and implementation fees.",
    canonicalPath: "/guides/hr-pricing-guide/",
    indexable: true,
  },
};
