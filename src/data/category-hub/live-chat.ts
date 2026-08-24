import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildLiveChatCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "live-chat",
    shortName: "Live Chat",
    displayName: "Live Chat Software",
    tagline:
      "Website messenger, proactive chat, and chatbot deflection — distinct from full helpdesk ticketing.",
    definition:
      "Live chat software embeds a messenger on your site or app, routes visitors to agents, runs proactive triggers, and deflects repeat questions with bots or AI agents. The right tool matches the messaging job — per-agent website chat, conversation-cap deflection, or AI-first inbox — not a single list that ranks Freshchat against Tidio as undifferentiated peers. Shortlist via the parent Customer Service Finder with channel as the primary filter.",
    iconSlug: "live-chat",
    decisionCriteria: [
      "Primary messenger job fit",
      "Per-agent vs conversation-cap pricing",
      "Proactive chat and triggers",
      "Chatbot / AI deflection depth",
      "Helpdesk and CRM integrations",
      "Visitor context and routing",
    ],
    popularNeeds: [
      "Website chat widget",
      "Proactive visitor triggers",
      "AI chatbot deflection",
      "Agent routing and canned replies",
      "Helpdesk handoff",
      "CSAT after chat",
    ],
    chooseGuideHref: "/guides/how-to-choose-live-chat-software/",
    glance: {
      whatItDoes: [
        "Embeds a messenger on websites and in apps",
        "Routes chats to available agents",
        "Runs proactive triggers and campaigns",
        "Deflects with bots and AI agents",
        "Hands off to helpdesk tickets when needed",
        "Captures visitor context and CSAT",
      ],
      bestFor: [
        "SMB sites needing website live chat",
        "Freshworks teams wanting chat-first purchase",
        "High-traffic sites with AI deflection goals",
        "SaaS teams standardising on AI inbox + Fin",
      ],
      typicalFeatures: [
        "Website messenger",
        "Live chat routing",
        "Proactive chat",
        "Chatbot / AI agent",
        "Helpdesk integrations",
        "Agent copilot",
      ],
    },
    types: [
      {
        id: "website-messenger",
        name: "Website messenger",
        description: "Per-agent live chat widget with routing and canned replies.",
        icon: "message-circle",
        href: "/use-cases/live-chat-support/",
        ctaLabel: "Explore website messenger →",
      },
      {
        id: "proactive-chat",
        name: "Proactive chat",
        description: "Triggers, targeting rules, and visitor campaigns.",
        icon: "zap",
        href: "/use-cases/live-chat-support/",
        ctaLabel: "Explore proactive chat →",
      },
      {
        id: "chatbot-deflection",
        name: "Chatbot deflection",
        description: "Conversation-cap pricing with flows and AI agents.",
        icon: "bot",
        href: "/use-cases/ai-customer-service/",
        ctaLabel: "Explore chatbot deflection →",
      },
      {
        id: "ai-inbox",
        name: "AI-first inbox",
        description: "Shared inbox with outcome-priced AI agent resolutions.",
        icon: "sparkles",
        href: "/use-cases/ai-customer-service/",
        ctaLabel: "Explore AI inbox →",
      },
    ],
    tools: [
      {
        label: "CS Finder — channel primary",
        description:
          "Shortlist by live-chat vs helpdesk job fit via the parent customer service finder.",
        href: "/tools/customer-service-finder/",
        ctaLabel: "Run CS Finder →",
      },
    ],
    finderHref: "/tools/customer-service-finder/",
    bestPageHref: "/best/live-chat-software/",
    guides: [
      {
        slug: "what-is-live-chat-software",
        title: "What is live chat software?",
        href: "/guides/what-is-live-chat-software/",
      },
      {
        slug: "how-to-choose-live-chat-software",
        title: "How to choose live chat software",
        href: "/guides/how-to-choose-live-chat-software/",
      },
      {
        slug: "live-chat-pricing-guide",
        title: "Live chat pricing guide",
        href: "/guides/live-chat-pricing-guide/",
      },
      {
        slug: "live-chat-vs-customer-service-software",
        title: "Live chat vs broader customer service software",
        href: "/guides/live-chat-vs-customer-service-software/",
      },
    ],
  });
}
