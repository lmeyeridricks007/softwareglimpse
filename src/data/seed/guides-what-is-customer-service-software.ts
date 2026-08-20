import type { GuidePage } from "@/domain";
import type { z } from "zod";
import type { GuideContentBlockSchema } from "@/domain";

type GuideBlockInput = z.input<typeof GuideContentBlockSchema>;

/**
 * Fundamental customer-service guide — softwareglimpse-guide-template-v1.
 */
const whatIsCustomerServiceSoftwareBlocks: GuideBlockInput[] = [
  {
    type: "direct-answer",
    id: "quick-answer",
    title: "Quick answer",
    body: "Customer service software helps teams queue tickets, chat with website visitors, publish help articles, or run an internal IT service desk — not CRM sales pipelines. Decision rule: if the blocking job is “we need owned tickets and SLAs,” buy a helpdesk; if it is live website conversations, buy live chat; if it is Shopify order/refund context, buy an ecommerce helpdesk; if it is ITIL incidents and changes, buy ITSM — do not force those jobs into one undifferentiated ranking.",
    bullets: [
      "Helpdesk / ticketing",
      "Live chat support",
      "Ecommerce helpdesk",
      "Knowledge base / self-service",
      "ITSM / service desk",
      "Not a CRM pipeline",
    ],
  },
  {
    type: "key-takeaways",
    id: "key-takeaways",
    title: "Key takeaways",
    items: [
      {
        label: "The category holds several jobs",
        body: "Helpdesk, live chat, ecommerce inboxes, knowledge bases, and ITSM desks fail for different reasons. Naming the job first prevents most bad shortlists.",
      },
      {
        label: "Customer service software is not a CRM",
        body: "CRMs own revenue pipeline. Support tools own conversations, tickets, and deflection — then integrate with CRM when agents need account context.",
      },
      {
        label: "Pricing units are not interchangeable",
        body: "Per-agent seats, ticket/conversation caps, and AI outcome/credit packs change TCO more than the starter tile.",
      },
      {
        label: "AI is assistance, not a substitute core",
        body: "Bots and copilots sit on top of a helpdesk or chat product. Score them as assistance — not as a reason to skip ticketing or SLAs.",
      },
    ],
  },
  {
    type: "decision-framework",
    id: "cs-building-blocks",
    title: "Customer service software building blocks",
    steps: [
      { id: "block-ticket", label: "Ticket", short: "Queues & SLAs" },
      { id: "block-chat", label: "Chat", short: "Live visitors" },
      { id: "block-docs", label: "Docs", short: "Self-service" },
      { id: "block-channels", label: "Channels", short: "Omnichannel inbox" },
      { id: "block-commerce", label: "Commerce", short: "Orders & refunds" },
      { id: "block-itsm", label: "ITSM", short: "Incidents & change" },
    ],
    ctaHref: "/guides/how-to-choose-customer-service-software/",
    ctaLabel: "How to choose customer service software →",
    figure: {
      src: "/guides/what-is-customer-service-software-building-blocks.png",
      alt: "Six customer service software building blocks: ticket, chat, docs, channels, commerce, and ITSM.",
      caption:
        "These blocks define the support core. Buy for the block that is blocking first — specialists sit beside each other, not in one peer ranking.",
    },
  },
  {
    type: "step",
    id: "how-it-works",
    stepNumber: 1,
    heading: "How does customer service software work?",
    body: "Most support platforms specialise: helpdesks turn email into owned tickets with SLAs; live-chat products route website visitors; knowledge bases deflect repeats; ecommerce helpdesks surface orders beside the conversation; ITSM desks run incidents and changes for employees.\n\nExample: Harbor Shop, a 12-person DTC brand, starts with live chat for pre-purchase questions, then adds an ecommerce helpdesk when refund tickets outgrow the messenger — without buying an ITSM suite they do not need.",
    tip: "Write the weekly outcome you need (“every email has an owner and an SLA” or “visitors get a reply in two minutes”) before you compare vendors.",
    figure: {
      src: "/guides/what-is-customer-service-software-loop.png",
      alt: "Customer service software loop across tickets, chat, docs, channels, commerce, and ITSM.",
      caption:
        "Each loop is a different purchase. Your CRM still owns pipeline; your ITSM desk is not a Shopify inbox.",
    },
    scenarios: [
      { title: "Ticket", body: "Emails become owned tickets with next steps." },
      { title: "Chat", body: "Website visitors reach a routed agent." },
      { title: "Docs", body: "Customers solve repeats without a ticket." },
      { title: "Channels", body: "Email, chat, and social share one workspace." },
      { title: "Commerce", body: "Order and refund context sits in the inbox." },
    ],
  },
  {
    type: "step",
    id: "what-it-includes",
    stepNumber: 2,
    heading: "What customer service software typically includes",
    body: "Depending on job cluster: ticketing and macros; website messengers and canned replies; help centers and portals; omnichannel inboxes; order-aware ecommerce workflows; or ITIL incidents, problems, and changes.\n\nJob clusters matter more than brand names: helpdesk peers, live-chat widgets, ecommerce inboxes, and ITSM desks rarely belong on the same undifferentiated shortlist. Catalogue examples are shapes to compare by primary job — not a ranking.",
    tip: "If a vendor markets “all-in-one support,” check which hub is actually strong before you buy for a secondary job.",
  },
  {
    type: "crm-types",
    id: "cs-shapes",
    title: "Common customer service software shapes (not rankings)",
    types: [
      {
        id: "helpdesk",
        title: "Helpdesk / ticketing",
        bestFor: "Teams that need email-to-ticket queues, SLAs, and assignment.",
        avoidWhen: "Your primary job is website live chat only, or ITIL change management.",
      },
      {
        id: "live-chat",
        title: "Live chat support",
        bestFor: "Sites that need visitor chat, routing, and canned replies in real time.",
        avoidWhen: "You need full ticketing, SLAs, or an employee ITSM desk.",
      },
      {
        id: "ecommerce",
        title: "Ecommerce helpdesk",
        bestFor: "Shopify/DTC teams that need order, refund, and shipping context in the inbox.",
        avoidWhen: "You run B2B ticketing or internal IT with no storefront.",
      },
      {
        id: "itsm",
        title: "ITSM / service desk",
        bestFor: "IT teams running incidents, problems, changes, and assets.",
        avoidWhen: "Customer ecommerce chat or SMB shared inbox is the real purchase.",
      },
    ],
  },
  {
    type: "faq",
    id: "faq",
    title: "FAQ",
    items: [
      {
        question: "Is customer service software the same as a CRM?",
        answer:
          "No. CRM systems track customers and revenue. Customer service software tracks tickets, chats, and deflection — though stacks often integrate so agents see account context.",
      },
      {
        question: "Do I need one suite or specialist tools?",
        answer:
          "Buy for the job that creates the most rework this quarter. Suites help when you will use multiple hubs weekly; specialists win when one job dominates.",
      },
      {
        question: "Where do Zendesk Suite, Freshdesk, Freshchat, and Gorgias fit?",
        answer:
          "They are Wave-1 cluster leaders or peers for helpdesk, live chat, and ecommerce helpdesk. Compare inside those jobs — see Best customer service software for methodology-based editor’s picks.",
      },
    ],
  },
  {
    type: "interactive-cta",
    id: "next-steps",
    title: "Next steps",
    body: "Name your primary job, then shortlist within that cluster — editor’s picks and landscape specialists are called out separately.",
    href: "/best/customer-service-software/",
    ctaLabel: "See Best Customer Service Software →",
    variant: "finder",
  },
];

export const whatIsCustomerServiceSoftwareGuide: GuidePage = {
  id: "guide-what-is-customer-service-software",
  slug: "what-is-customer-service-software",
  title: "What Is Customer Service Software?",
  summary:
    "A clear definition of helpdesk, live chat, ecommerce helpdesk, knowledge bases, and ITSM — and how they differ from CRM.",
  categorySlugs: ["customer-service"],
  topicType: "fundamental",
  heroVisual: {
    src: "/guides/what-is-customer-service-software-hero.png",
    alt: "Educational SaaS mockup of customer service software spanning tickets, live chat, and a help center.",
  },
  supports: [
    {
      contentId: "content:category:customer-service",
      relationType: "supports-anchor",
      primary: true,
    },
    {
      contentId: "content:best:customer-service-software",
      relationType: "supports-anchor",
      primary: false,
    },
  ],
  nextAction: {
    contentId: "content:guide:how-to-choose-customer-service-software",
    label: "How to choose customer service software",
  },
  relatedGuideSlugs: [
    "how-to-choose-customer-service-software",
    "customer-service-pricing-guide",
    "customer-service-requirements-guide",
    "customer-service-evaluation-guide",
  ],
  blocks: whatIsCustomerServiceSoftwareBlocks as GuidePage["blocks"],
  checklist: [
    {
      id: "job",
      label: "Name the primary job",
      description:
        "Helpdesk, live chat, ecommerce helpdesk, knowledge base, or ITSM — one sentence.",
      order: 0,
    },
    {
      id: "users",
      label: "List who must use it weekly",
      description: "Agents, team leads, and anyone who must see ticket or chat status.",
      order: 1,
    },
    {
      id: "workflows",
      label: "Note must-have workflows",
      description:
        "SLAs, live chat, Shopify refunds, or change management — map to plan gates later.",
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
    title: "What Is Customer Service Software? | SoftwareGlimpse",
    description:
      "What is customer service software? A clear definition of helpdesk, live chat, ecommerce helpdesk, knowledge bases, and ITSM — and how they differ from CRM.",
    canonicalPath: "/guides/what-is-customer-service-software/",
    indexable: true,
  },
};
