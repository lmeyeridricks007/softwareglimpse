import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Fundamental Ecommerce guide — softwareglimpse-guide-template-v1.
 */
const whatIsEcommerceSoftwareBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Ecommerce software helps merchants run an online store, manage catalog and orders, sell across channels, or — in a separate job — automate dropshipping imports. Decision rule: if you need a hosted storefront and checkout, shortlist SaaS platforms (Shopify, BigCommerce) or open-source (WooCommerce); if you already run Square POS, evaluate Square Online; if the store exists and you only need supplier inventory, shortlist Spocket or AliDrop — never rank sourcing apps against full platforms.",
    bullets: [
      "Hosted SaaS platform",
      "Open-source cart",
      "Omnichannel POS + online",
      "Dropshipping sourcing",
      "Not an ESP or CRM",
      "Not 3PL logistics",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "The category holds several jobs",
        body: "Hosted platforms, WordPress carts, POS + online bundles, and dropshipping import apps fail for different reasons. Naming the job first prevents most bad shortlists.",
      },
      {
        label: "Ecommerce software is not a CRM",
        body: "CRMs own customer pipeline. Ecommerce tools own storefront, catalog, checkout, and fulfillment — then integrate with ads, email, and warehouse systems when needed.",
      },
      {
        label: "Subscription is not the whole bill",
        body: "Payment processing, apps, themes, hosting (open-source), and GMV overages often matter more than the starter tile.",
      },
      {
        label: "Sourcing apps are a different purchase",
        body: "Spocket and AliDrop import supplier catalogs into an existing store. They should not be ranked as if they were Shopify or WooCommerce peers.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "ecom-building-blocks",
    title: "Ecommerce software building blocks",
    steps: [
      { id: "block-storefront", label: "Storefront", short: "Theme & catalog" },
      { id: "block-checkout", label: "Checkout", short: "Cart & payments" },
      { id: "block-orders", label: "Orders", short: "Fulfillment & shipping" },
      { id: "block-channels", label: "Channels", short: "Marketplaces & social" },
      { id: "block-pos", label: "POS", short: "In-store + online" },
      { id: "block-sourcing", label: "Sourcing", short: "Dropship imports" },
    ],
    ctaHref: "/guides/how-to-choose-ecommerce-software/",
    ctaLabel: "How to choose ecommerce software →",
    figure: {
      src: "/guides/what-is-ecommerce-software-building-blocks.png",
      alt: "Six ecommerce software building blocks: storefront, checkout, orders, channels, POS, and sourcing.",
      caption:
        "These blocks define the ecommerce core. Buy for the block that is blocking first — a sourcing app sits beside a storefront, not in the same peer ranking.",
    },
  },
  {
    type: "step",
    id: "how-it-works",
    stepNumber: 1,
    heading: "How does ecommerce software work?",
    body: "Most ecommerce products specialise: hosted SaaS platforms publish a branded store with checkout and channels; open-source carts run on hosting you control; omnichannel bundles unify POS inventory with an online catalog; dropshipping apps import supplier SKUs and route orders without you holding stock.\n\nExample: Harbor Studio, a 12-SKU DTC brand, starts on a hosted SaaS storefront so checkout is live in a week — then adds a sourcing app only if they later test dropship SKUs. They do not buy Square Online unless they also run in-person retail.",
    tip: "Write the weekly outcome you need (“a customer can buy from our domain” or “POS inventory matches the website”) before you compare vendors.",
    figure: {
      src: "/guides/what-is-ecommerce-software-loop.png",
      alt: "Ecommerce software loop across storefront, catalog, checkout, fulfillment, and channels.",
      caption:
        "Each loop is a different purchase. Your CRM still owns customers; your ESP still owns email campaigns.",
    },
    scenarios: [
      { title: "Storefront", body: "A branded catalog is live on your domain." },
      { title: "Checkout", body: "Buyers pay with cards, wallets, and express options." },
      { title: "Orders", body: "Fulfillment routes pick, pack, and ship without a spreadsheet." },
      { title: "Channels", body: "Marketplaces and social shops reuse the same catalog." },
      { title: "Sourcing", body: "Supplier SKUs import and orders push back to vendors." },
    ],
  },
  {
    type: "step",
    id: "what-it-includes",
    stepNumber: 2,
    heading: "What ecommerce software typically includes",
    body: "Depending on job cluster: themes and product pages; variants and collections; checkout and payment processing; order and inventory management; POS and pickup; marketplace/social channels; B2B price lists; or supplier import automation.\n\nJob clusters matter more than brand names: SaaS platforms, open-source carts, omnichannel POS, and dropshipping sourcing rarely belong on the same undifferentiated shortlist. Catalogue examples are shapes to compare by primary job — not a ranking.",
    tip: "If a vendor markets “all-in-one commerce,” check whether POS, B2B, or apps are actually on the plan you will buy.",
  },
  {
    type: "crm-types",
    id: "ecom-shapes",
    title: "Common ecommerce software shapes (not rankings)",
    types: [
      {
        id: "saas-platform",
        title: "Hosted SaaS platform",
        bestFor: "Brands that want a managed storefront, checkout, apps, and channels without running servers.",
        avoidWhen: "You already own a WordPress stack you intend to keep, or you only need supplier imports.",
      },
      {
        id: "open-source",
        title: "Open-source cart",
        bestFor: "Merchants who want plugin control on hosting they operate (typically WordPress + WooCommerce).",
        avoidWhen: "You need a fully hosted admin and do not want to own security, backups, or extension TCO.",
      },
      {
        id: "omnichannel",
        title: "Omnichannel POS + online",
        bestFor: "Retailers who already run in-person payments and need one catalog for stores and the website.",
        avoidWhen: "You are online-only and do not need POS hardware or in-store inventory.",
      },
      {
        id: "dropshipping",
        title: "Dropshipping sourcing",
        bestFor: "Stores that already exist and need US/EU or AliExpress-class supplier imports.",
        avoidWhen: "You still need a storefront and checkout — sourcing apps are not platforms.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Is ecommerce software the same as a CRM?",
        answer:
          "No. CRM systems track customers and revenue pipeline. Ecommerce software runs the store — catalog, checkout, orders — though stacks often integrate.",
      },
      {
        question: "Do I need one suite or specialist tools?",
        answer:
          "Buy for the job that creates the most rework this quarter. Hosted platforms help when you need storefront + checkout together; specialists win when POS or sourcing is the only gap.",
      },
      {
        question: "Where do Shopify, WooCommerce, Square Online, and Spocket fit?",
        answer:
          "They are Wave-1 cluster leaders for hosted SaaS, open-source, omnichannel POS, and dropshipping sourcing respectively. Compare inside those jobs — see Best ecommerce software for methodology-based editor’s picks.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Name your primary job, then shortlist within that cluster — editor’s picks and landscape specialists are called out separately.",
    href: "/best/ecommerce-software/",
    ctaLabel: "See Best Ecommerce Software →",
    variant: "finder",
  },
];

export const whatIsEcommerceSoftwareGuide: GuidePage = {
  id: "guide-what-is-ecommerce-software",
  slug: "what-is-ecommerce-software",
  title: "What Is Ecommerce Software?",
  summary:
    "A clear definition of hosted storefronts, open-source carts, omnichannel POS, and dropshipping sourcing — and how they differ from CRM.",
  categorySlugs: ["ecommerce"],
  topicType: "fundamental",
  heroVisual: {
    src: "/guides/what-is-ecommerce-software-hero.png",
    alt: "Educational SaaS mockup of ecommerce software spanning storefront, catalog, checkout, and channels.",
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
  nextAction: {
    contentId: "content:guide:how-to-choose-ecommerce-software",
    label: "How to choose ecommerce software",
  },
  relatedGuideSlugs: [
    "how-to-choose-ecommerce-software",
    "ecommerce-pricing-guide",
  ],
  blocks: whatIsEcommerceSoftwareBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name the primary job",
      description: "SaaS storefront, open-source cart, omnichannel POS, or sourcing app — one sentence.",
      order: 0,
    },
    {
      id: "users",
      label: "List who must use it weekly",
      description: "Founder, merchandiser, warehouse, or store staff.",
      order: 1,
    },
    {
      id: "workflows",
      label: "Note must-have workflows",
      description: "Checkout, POS sync, B2B lists, supplier import — map to plan gates later.",
      order: 2,
    },
  ],
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
    title: "What Is Ecommerce Software? | SoftwareGlimpse",
    description:
      "What ecommerce software is — storefront platforms, open-source carts, omnichannel POS, and dropshipping sourcing — and how to pick the right job first.",
    canonicalPath: "/guides/what-is-ecommerce-software/",
    indexable: true,
  },
};
