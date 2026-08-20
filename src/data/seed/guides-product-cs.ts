import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Short Wave-1 product what-is / is-worth-it guides for CS primaries.
 * Not the generated 5-kind product pack — keep this file small and indexable.
 */

type CsProductGuideInput = {
  slug: string;
  name: string;
  cluster: string;
  whatIs: string;
  worthIt: string;
  chooseWhen: string;
  skipWhen: string;
  pricingNote: string;
};

const CS_PRODUCTS: CsProductGuideInput[] = [
  {
    slug: "freshdesk",
    name: "Freshdesk",
    cluster: "helpdesk / ticketing",
    whatIs:
      "Freshdesk is Freshworks’ helpdesk and omnichannel ticketing platform — Growth from $19/agent/month billed annually, with a 14-day trial and no free forever plan. It is distinct from Freshchat (live chat) and Freshservice (ITSM).",
    worthIt:
      "Freshdesk is worth a shortlist when helpdesk ticketing with omnichannel inbox depth is the primary job and you want Freshworks alignment at a published mid-market floor. It is not worth forcing into live-chat-only or ITSM purchases.",
    chooseWhen:
      "SMB and mid-market teams that need owned tickets, SLAs, and a clear Growth/Pro/Enterprise per-agent ladder.",
    skipWhen:
      "Live-chat-only teams, ITIL-first ITSM buyers (Freshservice), or Shopify-native order helpdesks (Gorgias).",
    pricingNote:
      "Growth $19/agent/mo annual is the published floor — not all-in omnichannel or AI. Confirm live packaging.",
  },
  {
    slug: "zendesk-suite",
    name: "Zendesk Suite",
    cluster: "helpdesk / ticketing",
    whatIs:
      "Zendesk Suite is Zendesk’s enterprise helpdesk and omnichannel product — Support Team from $19/agent/month annual; Suite Team $55 and Suite Pro $115. Support Team is not full Suite omnichannel. Distinct from Zendesk Sell (CRM).",
    worthIt:
      "Zendesk Suite is worth it when omnichannel depth, SLA/routing, and Suite AI justify Team/Pro pricing. It is not worth it as a simple shared inbox or a CRM pipeline purchase.",
    chooseWhen:
      "Mid-market and enterprise teams that will actually use messaging, voice, and routing at Suite depth.",
    skipWhen:
      "SMB teams that want Help Scout simplicity, budget $7 Zoho Desk Express buyers, or CRM-only needs (Zendesk Sell).",
    pricingNote:
      "Model Suite Team/Pro for omnichannel — the $19 Support Team tile is a different configuration.",
  },
  {
    slug: "help-scout",
    name: "Help Scout",
    cluster: "SMB shared inbox / helpdesk",
    whatIs:
      "Help Scout is an SMB shared inbox and helpdesk with Docs-first self-service — free for up to 5 users; Standard $25, Plus $45, Pro $75 per user/month annual. AI Answers can add usage pricing.",
    worthIt:
      "Help Scout is worth it when shared-inbox simplicity and knowledge-base deflection matter more than enterprise omnichannel. It is not worth stretching into ITSM or voice-at-scale programmes.",
    chooseWhen:
      "Small support teams that live in email, will use Docs, and may start on the free 5-user tier.",
    skipWhen:
      "Enterprise omnichannel with social/voice at scale, ITSM, or ecommerce order-native inboxes (Gorgias).",
    pricingNote:
      "Free 5-user cap is real; paid is per user. Budget AI Answers separately.",
  },
  {
    slug: "gorgias",
    name: "Gorgias",
    cluster: "ecommerce helpdesk",
    whatIs:
      "Gorgias is an ecommerce-native helpdesk for Shopify, Magento, and BigCommerce with order and refund context in the agent workspace. Pricing is ticket-based: Starter $40/month for 50 tickets; Basic $77/month billed annually ($90 monthly).",
    worthIt:
      "Gorgias is worth it when storefront order context and ticket+AI packaging beat per-agent helpdesks. It is not worth it as a generic B2B helpdesk or ITSM desk.",
    chooseWhen:
      "DTC / Shopify teams that refund, edit orders, and answer shipping questions in one thread.",
    skipWhen:
      "Non-ecommerce B2B ticketing, internal ITSM, or simple per-agent SMB inboxes.",
    pricingNote:
      "Ticket caps and overage dominate TCO — not comparable to a $19/agent tile without a volume model.",
  },
  {
    slug: "tidio",
    name: "Tidio",
    cluster: "live chat support",
    whatIs:
      "Tidio is a live chat and AI messaging platform for website visitors — Starter $24.17/month annual for 100 billable conversations; Growth from $49.17. Lyro AI agent and flows handle deflection. Re-homed from CRM-primary; it is not a sales CRM.",
    worthIt:
      "Tidio is worth it when website live chat and AI visitor deflection are the job. It is not worth it as a CRM, enterprise helpdesk, or ITSM purchase.",
    chooseWhen:
      "SMB sites that want conversation-cap pricing and Lyro/flows for deflection.",
    skipWhen:
      "Teams that need full ticketing/SLAs, per-agent Freshworks chat, or CRM pipeline management.",
    pricingNote:
      "Conversation packs, not per-agent seats. Model overage at your chat volume.",
  },
];

function csRelated(p: CsProductGuideInput): GuideBlockInput {
  return {
    type: "related-content",
    id: "related",
    title: "Related",
    links: [
      {
        href: `/software/${p.slug}/`,
        label: `${p.name} review`,
        description: "Criteria, pricing notes, and cluster peers.",
      },
      {
        href: "/best/customer-service-software/",
        label: "Best customer service software",
        description: "Editor’s picks by job cluster — not one undifferentiated ranking.",
      },
      {
        href: "/guides/how-to-choose-customer-service-software/",
        label: "How to choose customer service software",
        description: "Name the job before you shortlist brands.",
      },
      {
        href: "/guides/customer-service-evaluation-guide/",
        label: "Customer service evaluation guide",
        description: "Same trial script for every finalist.",
      },
    ],
  };
}

function csScorecard(p: CsProductGuideInput): GuideBlockInput {
  return {
    type: "scorecard",
    id: "fit-scorecard",
    title: `${p.name} shortlist scorecard`,
    body: `Score ${p.name} only as ${p.cluster}. Do not compare it to a different support job. ${p.pricingNote}`,
    productSlugs: [p.slug],
    criteria: [
      { id: "job", label: "Primary job matches this cluster", weight: 3 },
      { id: "plan", label: "Qualifying plan is modelled", weight: 2 },
      { id: "skip", label: "Skip conditions do not apply", weight: 2 },
    ],
  };
}

function whatIsBlocks(p: CsProductGuideInput): GuideBlockInput[] {
  return [
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: `${p.whatIs} Decision rule: shortlist ${p.name} only when ${p.cluster} is the primary job.`,
      bullets: [p.cluster, "Published pricing — confirm live", "Not a CRM pipeline tool"],
    },
    {
      type: "key-takeaways",
      id: "kt",
      title: "Key takeaways",
      items: [
        { label: "Primary job", body: p.chooseWhen },
        { label: "Skip when", body: p.skipWhen },
        { label: "Pricing unit", body: p.pricingNote },
      ],
    },
    {
      type: "decision-framework",
      id: "framework",
      title: `When ${p.name} belongs on a shortlist`,
      steps: [
        { id: "job", label: "Name the job", short: p.cluster },
        { id: "fit", label: "Match the weekly ritual", short: "Choose vs skip" },
        { id: "plan", label: "Price the qualifying plan", short: "Not the teaser tile" },
        { id: "trial", label: "Trial one real workflow", short: "Same script as peers" },
      ],
      ctaHref: "/tools/customer-service-finder/",
      ctaLabel: "Customer service Finder →",
    },
    {
      type: "size-match",
      id: "fit-example",
      title: `Who ${p.name} is for`,
      tiers: [
        {
          id: "choose",
          label: "Shortlist",
          description: p.chooseWhen,
          fitHints: [p.cluster, "Confirm live packaging"],
        },
        {
          id: "skip",
          label: "Skip",
          description: p.skipWhen,
          fitHints: ["Wrong job cluster", "Do not stretch the product"],
        },
      ],
    },
    csScorecard(p),
    {
      type: "step",
      id: "worked",
      stepNumber: 1,
      heading: `What ${p.name} is (and is not)`,
      body: `${p.whatIs}\n\nWorked example: a support lead writes the weekly outcome first, then checks whether ${p.name}’s cluster matches — instead of buying on brand familiarity.`,
      tip: "Compare inside the same job cluster. See Best customer service software for editor’s picks.",
    },
    {
      type: "checklist",
      id: "shortlist-checks",
      title: "Before you shortlist",
      copyable: true,
      items: [
        {
          id: "job-match",
          label: `${p.cluster} is the primary job`,
          description: p.chooseWhen,
        },
        {
          id: "skip-test",
          label: "Skip conditions do not apply",
          description: p.skipWhen,
        },
        {
          id: "price-unit",
          label: "Qualifying plan is modelled",
          description: p.pricingNote,
        },
      ],
    },
    {
      type: "faq",
      id: "faq",
      title: "FAQ",
      items: [
        {
          question: `Is ${p.name} a CRM?`,
          answer: `No. ${p.name} is evaluated as customer-service ${p.cluster} on SoftwareGlimpse — not as sales pipeline CRM.`,
        },
        {
          question: `Is ${p.name} worth it?`,
          answer: p.worthIt,
        },
      ],
    },
    csRelated(p),
    {
      type: "interactive-cta",
      id: "next",
      title: "Next steps",
      body: "Read the review, then see cluster editor’s picks. Confirm live commercial terms.",
      href: `/software/${p.slug}/`,
      ctaLabel: `${p.name} review →`,
      variant: "generic",
    },
  ];
}

function worthItBlocks(p: CsProductGuideInput): GuideBlockInput[] {
  return [
    {
      type: "direct-answer",
      id: "quick-answer",
      title: "Quick answer",
      body: p.worthIt,
      bullets: ["Job-cluster fit first", p.pricingNote, "Affiliate economics excluded"],
    },
    {
      type: "key-takeaways",
      id: "kt",
      title: "Key takeaways",
      items: [
        { label: "Choose when", body: p.chooseWhen },
        { label: "Skip when", body: p.skipWhen },
        {
          label: "How we decide",
          body: "customer-service-editorial v1.0.0 — research-grounded, handsOnTesting=false. No affiliate ranking.",
        },
      ],
    },
    {
      type: "decision-framework",
      id: "worth-framework",
      title: `Is ${p.name} worth it?`,
      steps: [
        { id: "job", label: "Confirm the job", short: p.cluster },
        { id: "skip", label: "Apply skip rules", short: "Wrong cluster = no" },
        { id: "plan", label: "Model the qualifying SKU", short: "Seats vs tickets vs AI" },
        { id: "prove", label: "Prove it in a trial week", short: "Real macros / SLAs / orders" },
      ],
      ctaHref: "/tools/customer-service-finder/",
      ctaLabel: "Customer service Finder →",
    },
    {
      type: "size-match",
      id: "worth-fit",
      title: "Choose vs skip",
      tiers: [
        {
          id: "choose",
          label: "Worth a shortlist",
          description: p.chooseWhen,
          fitHints: [p.cluster],
        },
        {
          id: "skip",
          label: "Not worth stretching",
          description: p.skipWhen,
          fitHints: ["Different job", "Different cost unit"],
        },
      ],
    },
    csScorecard(p),
    {
      type: "step",
      id: "trial",
      stepNumber: 1,
      heading: "Prove it on the qualifying plan",
      body: `Run one week of real ${p.cluster} work on the plan that unlocks your must-haves. ${p.pricingNote}\n\nWorked example: if the trial hides macros, SLAs, or AI behind a higher tier than the quote, ${p.name} is not “worth it” at the advertised tile.`,
      tip: "Use the evaluation guide script so every finalist gets the same test.",
    },
    {
      type: "checklist",
      id: "worth-checks",
      title: "Worth-it gates",
      copyable: true,
      items: [
        {
          id: "cluster",
          label: "Job cluster matches",
          description: p.chooseWhen,
        },
        {
          id: "not-skip",
          label: "Skip rules fail",
          description: p.skipWhen,
        },
        {
          id: "sku",
          label: "Qualifying plan is priced",
          description: p.pricingNote,
        },
      ],
    },
    {
      type: "faq",
      id: "faq",
      title: "FAQ",
      items: [
        {
          question: "Does commission change this verdict?",
          answer:
            "No. SoftwareGlimpse excludes affiliate economics from scores and from worth-it guidance.",
        },
        {
          question: "Have you tested it hands-on?",
          answer:
            "No. This is research-grounded editorial judgment from vendor documentation and published pricing as of 2026-08-18.",
        },
      ],
    },
    csRelated(p),
    {
      type: "interactive-cta",
      id: "next",
      title: "Shortlist with the Finder",
      href: "/tools/customer-service-finder/",
      ctaLabel: "Customer service Finder →",
      variant: "finder",
      body: `See where ${p.name} sits inside its job cluster — not on one undifferentiated ranking.`,
    },
  ];
}

function csGuide(args: {
  kind: "what-is" | "worth-it";
  product: CsProductGuideInput;
}): GuidePage {
  const { product, kind } = args;
  const slug =
    kind === "what-is"
      ? `what-is-${product.slug}`
      : `is-${product.slug}-worth-it`;
  const title =
    kind === "what-is"
      ? `What Is ${product.name}?`
      : `Is ${product.name} Worth It?`;
  const summary =
    kind === "what-is"
      ? `${product.name} as ${product.cluster} software — what it is, who it is for, and how it differs from CRM.`
      : `${product.worthIt}`;

  return {
    id: `guide-${slug}`,
    slug,
    title,
    summary,
    categorySlugs: ["customer-service"],
    productSlugs: [product.slug],
    topicType: kind === "what-is" ? "fundamental" : "buying-guide",
    journeyStage: kind === "what-is" ? "learn" : "evaluate",
    heroVisual: {
      src: `/guides/${slug}-hero.png`,
      alt: `Educational illustration for ${title}.`,
    },
    supports: [
      {
        contentId: `content:software:${product.slug}`,
        relationType: "supports-anchor",
        primary: true,
      },
      {
        contentId: "content:best:customer-service-software",
        relationType: "supports-anchor",
        primary: false,
      },
      {
        contentId: "content:tool:customer-service-finder",
        relationType: "supports-anchor",
        primary: false,
      },
    ],
    nextAction: {
      contentId:
        kind === "what-is"
          ? `content:software:${product.slug}`
          : "content:best:customer-service-software",
      label:
        kind === "what-is"
          ? `Read the ${product.name} review`
          : "Best customer service software",
    },
    relatedGuideSlugs: [
      kind === "what-is"
        ? `is-${product.slug}-worth-it`
        : `what-is-${product.slug}`,
      "what-is-customer-service-software",
      "how-to-choose-customer-service-software",
      "customer-service-evaluation-guide",
    ],
    blocks: (kind === "what-is"
      ? whatIsBlocks(product)
      : worthItBlocks(product)) as GuidePage["blocks"],
    checklist: [
      {
        id: "job-cluster",
        label: `${product.cluster} is the primary job`,
        description: product.chooseWhen,
        order: 0,
      },
      {
        id: "skip-when",
        label: "Skip conditions do not apply",
        description: product.skipWhen,
        order: 1,
      },
      {
        id: "qualifying-plan",
        label: "Qualifying plan is modelled",
        description: product.pricingNote,
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
      title: `${title} | SoftwareGlimpse`,
      description: summary.slice(0, 160),
      canonicalPath: `/guides/${slug}/`,
      indexable: true,
    },
  };
}

export const csProductGuides: GuidePage[] = CS_PRODUCTS.flatMap((product) => [
  csGuide({ kind: "what-is", product }),
  csGuide({ kind: "worth-it", product }),
]);
