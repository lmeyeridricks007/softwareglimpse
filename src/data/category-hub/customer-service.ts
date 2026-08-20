import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";
import { COMPANY_ROUTES } from "@/services/site-foundation";

/**
 * Customer Service Category Hub presentation profile.
 * Teaching visuals: `/public/categories/customer-service-hero.png`,
 * `customer-service-needs.png`, `customer-service-workflow.png`.
 */
export function buildCustomerServiceCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "customer-service",
    shortName: "Customer Service",
    displayName: "Customer Service Software",
    tagline:
      "Find customer service software that fits the job — helpdesk ticketing, live chat, ecommerce support, knowledge-base self-service, omnichannel inbox, ITSM, or AI agents.",
    definition:
      "Customer service software helps teams queue tickets, chat with visitors, publish help articles, unify channels, run an IT service desk, or deflect with AI. The right tool matches the primary job — not a generic “best helpdesk” list that ranks Zendesk Suite against Gorgias, Tidio, and Freshservice as if they were the same purchase.",
    iconSlug: "customer-service",
    decisionCriteria: [
      "Primary job fit",
      "Workflow depth (tickets / chat / SLAs)",
      "Omnichannel coverage",
      "Self-service / knowledge base",
      "Integrations (CRM / ecommerce)",
      "Total cost (seats, tickets, AI outcomes)",
    ],
    popularNeeds: [
      "Ticketing",
      "Live chat",
      "Knowledge base",
      "Omnichannel inbox",
      "SLA & routing",
      "Ecommerce order context",
      "AI deflection",
    ],
    chooseGuideHref: "/guides/how-to-choose-customer-service-software/",
    glance: {
      whatItDoes: [
        "Turns email and portal requests into owned tickets",
        "Routes live chat to available agents",
        "Publishes searchable help-center articles",
        "Unifies email, chat, social, and messaging in one inbox",
        "Puts Shopify/Magento order context next to the thread",
        "Runs ITIL-style incidents, changes, and assets (ITSM)",
        "Deflects repetitive questions with an AI agent or copilot",
      ],
      bestFor: [
        "Support teams replacing a shared inbox",
        "Website / in-app live chat owners",
        "DTC brands answering WISMO and refunds",
        "IT teams running an employee service desk",
        "Ops leaders modelling AI outcome pricing",
      ],
      typicalFeatures: [
        "Ticketing",
        "Shared inbox",
        "Live chat",
        "Knowledge base",
        "Omnichannel inbox",
        "SLA & routing",
        "Macros & automation",
        "Helpdesk reporting",
      ],
    },
    types: [
      {
        id: "helpdesk",
        name: "Helpdesk / ticketing",
        description:
          "Email-to-ticket queues, SLAs, macros, and agent assignment.",
        icon: "inbox",
        href: "/use-cases/helpdesk-ticketing/",
        ctaLabel: "Explore helpdesk →",
      },
      {
        id: "live-chat",
        name: "Live chat",
        description:
          "Website messengers, routing, canned replies, and visitor context.",
        icon: "message",
        href: "/use-cases/live-chat-support/",
        ctaLabel: "Explore live chat →",
      },
      {
        id: "ecommerce",
        name: "Ecommerce support",
        description:
          "Order, refund, and shipping context inside the agent workspace.",
        icon: "shopping",
        href: "/use-cases/ecommerce-support/",
        ctaLabel: "Explore ecommerce support →",
      },
      {
        id: "self-service",
        name: "Knowledge base / self-service",
        description:
          "Help centers and portals that deflect tickets before an agent.",
        icon: "book",
        href: "/use-cases/knowledge-base-self-service/",
        ctaLabel: "Explore self-service →",
      },
      {
        id: "omnichannel",
        name: "Omnichannel support",
        description:
          "One agent workspace across email, chat, social, and messaging.",
        icon: "layers",
        href: "/use-cases/omnichannel-support/",
        ctaLabel: "Explore omnichannel →",
      },
      {
        id: "itsm",
        name: "ITSM / service desk",
        description:
          "Incidents, changes, and assets — not an SMB live-chat peer.",
        icon: "server",
        href: "/use-cases/itsm-service-desk/",
        ctaLabel: "Explore ITSM →",
      },
      {
        id: "ai-cs",
        name: "AI customer service",
        description:
          "Resolution bots and agent copilots — scored as assistance, not a substitute for a helpdesk core.",
        icon: "spark",
        href: "/use-cases/ai-customer-service/",
        ctaLabel: "Explore AI support →",
      },
    ],
    explorePaths: [
      {
        id: "best",
        title: "Best Customer Service Software",
        description:
          "See editor’s picks by job cluster and how we evaluate support tools.",
        href: "/best/customer-service-software/",
        ctaLabel: "View Best Customer Service",
        tone: "gold",
        icon: "star",
      },
      {
        id: "guides",
        title: "Customer Service Guides",
        description:
          "What it is, how to choose, pricing units, requirements, and evaluation.",
        href: "/guides/what-is-customer-service-software/",
        ctaLabel: "Read the fundamentals",
        tone: "blue",
        icon: "book",
      },
      {
        id: "use-cases",
        title: "Support use cases",
        description:
          "Helpdesk, live chat, ecommerce, self-service, omnichannel, ITSM, AI.",
        href: "/use-cases/",
        ctaLabel: "Browse use cases",
        tone: "green",
        icon: "target",
      },
      {
        id: "finder",
        title: "Customer Service Finder",
        description: "Answer a few questions for fit-based helpdesk and support shortlists.",
        href: "/tools/customer-service-finder/",
        ctaLabel: "Start Finder",
        tone: "teal",
        icon: "target",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Name the primary job",
        description:
          "Helpdesk, live chat, ecommerce helpdesk, ITSM, or AI deflection — one sentence.",
      },
      {
        step: 2,
        title: "Write must-have workflows",
        description: "Ticket SLAs, chat routing, order refunds, or change management.",
      },
      {
        step: 3,
        title: "Map the pricing unit",
        description:
          "Per-agent seats, conversation/ticket caps, or AI resolution outcomes.",
      },
      {
        step: 4,
        title: "Check integrations",
        description: "CRM, Shopify/Magento, messaging, and identity — prefer native depth.",
      },
      {
        step: 5,
        title: "Model total cost",
        description: "Seats plus overage plus Copilot/AI add-ons on the qualifying plan.",
      },
      {
        step: 6,
        title: "Test a real ritual",
        description:
          "One refund, one SLA breach, or one chat handoff on the plan you will buy.",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-customer-service-software/",
    faq: [
      {
        question: "What is customer service software?",
        answer:
          "It covers helpdesk ticketing, live chat, ecommerce support, knowledge bases, omnichannel inboxes, ITSM service desks, and AI agents — different jobs that should not share one undifferentiated ranking.",
      },
      {
        question: "Is Zendesk Sell the same as Zendesk Suite?",
        answer:
          "No. The `zendesk` slug on SoftwareGlimpse is Zendesk Sell (CRM). Customer-service Zendesk is `zendesk-suite`.",
      },
      {
        question: "How is customer service software priced?",
        answer:
          "Models vary: per-agent seats, ticket/conversation packs, and AI per-resolution outcomes. Confirm live vendor pricing — we do not invent market averages.",
      },
      {
        question: "Is there one best customer service tool?",
        answer:
          "No. Shortlist inside the job cluster that matches your blocking weekly ritual. See Best customer service software for editor’s picks by cluster.",
      },
      {
        question: "How is this different from CRM or business phone?",
        answer:
          "CRM is the system of record for customers and deals. Cloud phones are a communications job. Helpdesks own tickets, SLAs, and resolution — stacks often integrate but the purchase jobs differ.",
      },
    ],
    finderHref: "/tools/customer-service-finder/",
    finderExample: {
      requirements: [
        "Ticketing",
        "Knowledge base",
        "Under 15 agents",
        "Published per-agent pricing",
      ],
      matchSlugs: ["freshdesk", "help-scout", "zoho-desk"],
      disclaimer: "Example illustration — not a live Finder match.",
    },
    pricingModel: {
      summary:
        "Customer service pricing is typically per agent, per ticket/conversation pack, or per AI resolution — plus add-ons. Total cost depends on the configuration that unlocks your must-haves.",
      seatExamples: [
        {
          label: "Small team",
          seats: 5,
          note: "Per-agent floor × qualifying plan (or conversation pack)",
        },
        {
          label: "Growing support",
          seats: 15,
          note: "Model Suite/Pro omnichannel and AI add-ons honestly",
        },
        {
          label: "High-volume ecommerce",
          seats: 8,
          note: "Ticket caps and AI automated-interaction overage dominate TCO",
        },
      ],
      guideHref: "/guides/customer-service-pricing-guide/",
    },
    methodologyHref: COMPANY_ROUTES.methodology,
    featuredFeatureSlugs: [
      "ticketing",
      "live-chat",
      "knowledge-base",
      "omnichannel-inbox",
      "sla-routing",
      "ecommerce-helpdesk",
      "itsm-service-desk",
      "chatbot-ai-agent",
    ],
    matrixFeatureSlugs: [
      "ticketing",
      "live-chat",
      "knowledge-base",
      "omnichannel-inbox",
      "sla-routing",
      "chatbot-ai-agent",
    ],
    relatedCategorySlugs: [
      "business-communications",
      "crm",
      "ecommerce",
      "it-development",
    ],
    lastReviewedAt: "2026-08-18T00:00:00.000Z",
  });
}
