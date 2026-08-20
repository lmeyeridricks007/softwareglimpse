import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const marketingPricingGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Marketing software pricing is usually per channel, per seat, per contact or profile, per mention volume, or quote-led modules — plus AI credits and add-ons. Decision rule: never compare the advertised starter tile; compare the total for your real channels, contacts, or mention load on the configuration that unlocks your must-have workflows.",
    bullets: [
      "Channels / profiles / seats",
      "Contact or lead tiers",
      "Mention / coverage volume",
      "Plan feature gates",
      "AI credits and add-ons",
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
        body: "A cheap free plan that blocks approvals, branching journeys, or mention history forces an upgrade — budget the qualifying tier.",
      },
      {
        label: "Volume units are not interchangeable",
        body: "Social channel counts, MAP contacts, and listening mentions cannot be compared on a single “from” tile.",
      },
      {
        label: "Opaque quotes need a worksheet",
        body: "When MAP or listening dollars are demo-only, capture modules, minimums, and renewal assumptions in writing.",
      },
      {
        label: "Webinar and QR tools price differently",
        body: "Attendee caps and scan volumes are not comparable to Hootsuite seats or Marketo contacts on a tile alone.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "pricing-path",
    title: "Pricing path",
    steps: [
      { id: "unit", label: "Unit", short: "Seat / contact / mention" },
      { id: "volume", label: "Volume", short: "Real usage" },
      { id: "plan", label: "Plan", short: "Qualifying tier" },
      { id: "addons", label: "Add-ons", short: "AI / extra hubs" },
      { id: "term", label: "Term", short: "Monthly vs annual" },
      { id: "total", label: "Total", short: "Compare like for like" },
    ],
    ctaHref: "/best/marketing-software/",
    ctaLabel: "See Best Marketing Software →",
    figure: {
      src: "/guides/marketing-software-pricing-guide-stack.png",
      alt: "Marketing cost stack: volume unit, qualifying plan, add-ons, and term.",
      caption:
        "The starter tile is the bottom layer. Volume bands and add-ons often decide which vendor is actually cheaper.",
    },
  },
  {
    type: "step",
    id: "build-total",
    stepNumber: 1,
    heading: "Build one comparable total per vendor",
    body: "Use one assumption set: channels or contacts, must-have workflows, expected add-ons, and whether you will pay annually. Total the qualifying configuration.\n\nWorked example: Harbor Creative schedules three networks for two publishers. Vendor A’s $15/mo tile looks cheaper than Vendor B, but Vendor A bills per extra channel and the third network exceeds the savings — confirm live vendor packaging rather than inventing a market average.",
    tip: "Ask for a written quote on the qualifying configuration at your volume — including AI credits and required add-ons.",
    figure: {
      src: "/guides/marketing-software-pricing-guide-worked-example.png",
      alt: "Worked example comparing two marketing quotes at the same channel and contact assumptions.",
      caption:
        "Same brand, same volume — the cheaper tile is not always the cheaper deployment once gates apply.",
    },
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "How much does marketing software cost?",
        answer:
          "Models vary: per-channel schedulers, contact-tier MAP, mention-based listening, and attendee-capped webinars. Exact floors change — confirm live vendor pricing.",
      },
      {
        question: "Should I pay annually?",
        answer:
          "Annual billing is often discounted but locks volume. If campaigns or headcount still swing, price monthly until usage is stable.",
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
    href: "/best/marketing-software/",
    ctaLabel: "Best marketing software →",
    variant: "finder",
  },
];

export const marketingSoftwarePricingGuide: GuidePage = {
  id: "guide-marketing-software-pricing-guide",
  slug: "marketing-software-pricing-guide",
  title: "Marketing Software Pricing Guide",
  summary:
    "Budget schedulers, funnel builders, MAP platforms, listening tools, and webinars by qualifying configuration — not the advertised starter tile.",
  categorySlugs: ["marketing"],
  topicType: "pricing-education",
  heroVisual: {
    src: "/guides/marketing-software-pricing-guide-hero.png",
    alt: "Educational illustration for Marketing Software Pricing Guide.",
  },
  supports: [
    {
      contentId: "content:category:marketing",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:marketing-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  journeyStage: "evaluate",
  relatedGuideSlugs: [
    "what-is-marketing-software",
    "how-to-choose-marketing-software",
    "marketing-software-requirements-guide",
  ],
  blocks: marketingPricingGuideBlocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-18T12:00:00.000Z",
    publishedAt: "2026-08-18T12:00:00.000Z",
    reviewedAt: "2026-08-18T12:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Marketing Software Pricing Guide | SoftwareGlimpse",
    description:
      "How to budget marketing software — seats, channels, contacts, mention volumes, plan gates, and add-ons.",
    canonicalPath: "/guides/marketing-software-pricing-guide/",
    indexable: true,
  },
};
