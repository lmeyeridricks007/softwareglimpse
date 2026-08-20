import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

const ecommercePricingGuideBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Ecommerce pricing is subscription + payment processing + apps — not a single headline monthly fee. Hosted SaaS platforms (Shopify, BigCommerce) publish plan tiers with annual discounts; open-source (WooCommerce) is free at the core but needs hosting and extensions; omnichannel (Square) bundles processing spreads with Plus/Premium; dropshipping apps (Spocket, AliDrop) charge per imported product cap. Decision rule: model TCO at your order volume before comparing starter tiles.",
    bullets: [
      "Platform subscription",
      "Payment processing spreads",
      "GMV / overage fees",
      "Apps & themes",
      "Hosting (open-source)",
      "Product import caps (sourcing)",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "Gates are part of the price",
        body: "A cheap free plan that blocks custom domains, reports, or POS forces an upgrade — budget the qualifying tier.",
      },
      {
        label: "Processing often dwarfs the subscription",
        body: "Card rates and third-party gateway fees at real GMV can exceed the monthly plan. Compare spreads on the plan you will actually buy.",
      },
      {
        label: "Open-source is not $0 TCO",
        body: "WooCommerce core is free; hosting, SSL, paid extensions, and developer time are the real bill.",
      },
      {
        label: "Sourcing apps price by import caps",
        body: "Product limits on Starter vs Professional are not comparable to a Shopify Basic tile. Pair the app TCO with the storefront you already run.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "pricing-path",
    title: "Pricing path",
    steps: [
      { id: "volume", label: "Volume", short: "Orders / GMV" },
      { id: "plan", label: "Plan", short: "Qualifying tier" },
      { id: "processing", label: "Processing", short: "Card spreads" },
      { id: "apps", label: "Apps", short: "Themes & add-ons" },
      { id: "hosting", label: "Hosting", short: "If open-source" },
      { id: "total", label: "Total", short: "Compare like for like" },
    ],
    ctaHref: "/best/ecommerce-software/",
    ctaLabel: "See Best Ecommerce Software →",
    figure: {
      src: "/guides/ecommerce-pricing-guide-stack.png",
      alt: "Ecommerce cost stack: subscription, processing, apps, hosting, and import caps.",
      caption: "The starter tile is the bottom layer. Processing and apps often decide which vendor is actually cheaper.",
    },
  },
  {
    type: "step",
    id: "build-total",
    stepNumber: 1,
    heading: "Build one comparable total per vendor",
    body: "Use one assumption set: monthly GMV, must-have workflows, expected apps, and whether you need POS or hosting. Total the qualifying configuration.\n\nWorked example: Harbor Studio expects $25k GMV/month. Vendor A’s $29/mo annual plan looks cheaper than Vendor B, but Vendor A’s card rate is 0.4 points higher — at that GMV the processing gap exceeds the subscription savings.",
    tip: "Ask for a written quote on the qualifying configuration at your GMV — including processing and required apps.",
    figure: {
      src: "/guides/ecommerce-pricing-guide-worked-example.png",
      alt: "Worked example comparing two ecommerce quotes at the same GMV with processing and app effects.",
      caption: "Same brand, same volume — the cheaper tile is not always the cheaper deployment once processing applies.",
    },
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "How much does ecommerce software cost?",
        answer:
          "Models vary: hosted SaaS from published monthly/annual tiles (plus processing), free WooCommerce core plus hosting, Square Free/Plus/Premium per location, and dropshipping apps by product cap. Exact floors change — confirm live vendor pricing.",
      },
      {
        question: "Should I pay annually?",
        answer:
          "Annual billing is usually discounted on Shopify and BigCommerce but locks the plan. If you are still validating product-market fit, price monthly until volume is stable.",
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
    href: "/best/ecommerce-software/",
    ctaLabel: "Best ecommerce software →",
    variant: "finder",
  },
];

export const ecommercePricingGuide: GuidePage = {
  id: "guide-ecommerce-pricing-guide",
  slug: "ecommerce-pricing-guide",
  title: "Ecommerce Software Pricing Guide",
  summary:
    "Budget hosted platforms, open-source carts, omnichannel POS, and dropshipping apps by qualifying configuration — not the advertised starter tile.",
  categorySlugs: ["ecommerce"],
  topicType: "pricing-education",
  heroVisual: {
    src: "/guides/ecommerce-pricing-guide-hero.png",
    alt: "Educational illustration for Ecommerce Software Pricing Guide.",
  },
  supports: [
    {
      contentId: "content:category:ecommerce",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:ecommerce-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  journeyStage: "evaluate",
  relatedGuideSlugs: [
    "what-is-ecommerce-software",
    "how-to-choose-ecommerce-software",
  ],
  blocks: ecommercePricingGuideBlocks as GuidePage["blocks"],
  checklist: [],
  sections: [],
  faq: [],
  freshnessClass: "slow-moving",
  metadata: {
    status: "published",
    updatedAt: "2026-08-18T00:00:00.000Z",
    publishedAt: "2026-08-18T00:00:00.000Z",
    reviewedAt: "2026-08-18T00:00:00.000Z",
    researchStatus: "complete",
    author: "author-lee-meyeridricks",
  },
  seo: {
    title: "Ecommerce Software Pricing Guide | SoftwareGlimpse",
    description:
      "How to budget ecommerce software — subscription, payment processing, GMV overages, apps, hosting, and import caps.",
    canonicalPath: "/guides/ecommerce-pricing-guide/",
    indexable: true,
  },
};
