import { CategoryDefinitionSchema, type CategoryDefinition } from "@/domain";

/**
 * Live Chat subcategory definition v1.0 — under parent customer-service.
 * Website messenger, proactive chat, and chatbot deflection cluster.
 */
export const liveChatDefinition: CategoryDefinition = CategoryDefinitionSchema.parse({
  id: "cat-def-live-chat-v1",
  slug: "live-chat",
  name: "Live Chat",
  shortDescription:
    "Website messenger, proactive chat, and chatbot deflection — distinct from full helpdesk ticketing.",
  parentSlug: "customer-service",
  aliases: [
    "live chat software",
    "website chat",
    "website messenger",
    "customer messaging widget",
    "chatbot deflection",
  ],
  lifecycle: "active",
  configVersion: "1.0.0",
  scope: {
    definition:
      "Software whose primary job is real-time website and in-app messaging — visitor widgets, proactive triggers, routing to agents, and AI/chatbot deflection — not full helpdesk ticketing, ITSM, or ecommerce order-native helpdesks.",
    includes: [
      { id: "inc-website-messenger", label: "Website / in-app messenger widget" },
      { id: "inc-proactive-chat", label: "Proactive chat triggers and campaigns" },
      { id: "inc-chatbot-deflection", label: "Chatbot / AI agent deflection" },
      { id: "inc-agent-inbox", label: "Shared agent inbox for chat conversations" },
    ],
    excludes: [
      {
        id: "exc-helpdesk-core",
        label: "Full helpdesk ticketing as primary job",
        notes: "Zendesk/Freshdesk — parent CS helpdesk cluster",
      },
      {
        id: "exc-itsm",
        label: "ITSM / internal service desk",
        notes: "Freshservice — parent CS ITSM landscape",
      },
      {
        id: "exc-ecom-helpdesk",
        label: "Ecommerce order-native helpdesk",
        notes: "Gorgias — parent CS ecommerce cluster",
      },
      {
        id: "exc-whatsapp-bsp",
        label: "WhatsApp BSP without website messenger core",
        notes: "Wati — parent BC messaging cluster",
      },
    ],
    adjacentCategorySlugs: [
      "customer-service",
      "business-communications",
      "crm",
      "ai",
    ],
    classificationNotes: [
      "Tidio is conversation-cap + Lyro AI deflection — not a CRM or helpdesk",
      "Freshchat is Freshworks live chat — distinct from Freshdesk ticketing",
      "LiveChat is Text's established per-agent website chat layer",
      "Intercom is AI inbox editorial anchor — recategorized from BC primary",
      "Use parent CS finder with channel-primary filter — no dedicated subcategory finder",
      "Never rank per-agent chat, conversation-cap tools, and AI inbox platforms as one undifferentiated #1",
    ],
  },
  features: [
    feat(
      "website-messenger",
      "Website messenger",
      "Embeddable chat widget and in-app messenger.",
      "core",
      true,
      true,
    ),
    feat(
      "live-chat",
      "Live chat routing",
      "Agent assignment, canned replies, and chat queues.",
      "core",
      true,
      true,
    ),
    feat(
      "proactive-chat",
      "Proactive chat",
      "Triggers, campaigns, and visitor targeting.",
      "core",
      true,
      true,
    ),
    feat(
      "chatbot-ai-agent",
      "Chatbot / AI agent",
      "Bots and AI agents for deflection and resolution.",
      "core",
      true,
      true,
    ),
    feat(
      "helpdesk-integrations",
      "Helpdesk integrations",
      "Ticketing, CRM, and ecommerce connectors.",
      "important",
      true,
      true,
    ),
    feat(
      "agent-copilot",
      "Agent copilot",
      "AI assist for human agents in the inbox.",
      "important",
      true,
      true,
    ),
    feat(
      "csat-surveys",
      "CSAT / satisfaction surveys",
      "Post-chat satisfaction and feedback.",
      "important",
      true,
      true,
    ),
  ],
  researchRequirements: [
    { domain: "identity", level: "required", featureSlugs: [] },
    {
      domain: "pricing",
      level: "required",
      featureSlugs: [],
      notes: "Per-agent vs conversation-cap vs outcome-priced AI",
    },
    { domain: "plans", level: "required", featureSlugs: [] },
    {
      domain: "features",
      level: "required",
      featureSlugs: ["website-messenger", "chatbot-ai-agent"],
    },
    { domain: "integrations", level: "required", featureSlugs: [] },
    { domain: "limits", level: "required", featureSlugs: [] },
  ],
  editorialMethodology: {
    id: "methodology-live-chat-v1",
    slug: "live-chat-editorial",
    name: "Live Chat Editorial Methodology",
    version: "1.0.0",
    categorySlug: "live-chat",
    description:
      "SoftwareGlimpse evaluates live chat platforms on ease of use, messenger job fit, proactive chat, chatbot deflection, helpdesk integrations, visitor context, analytics, scalability, value, and AI assistance. Products are ranked within live-chat job clusters only.",
    criteria: [
      crit("ease-of-use", "Ease of use", "Widget setup and agent daily workflow.", 12, 0, ["features:website-messenger"]),
      crit("messenger-job-fit", "Messenger job fit", "Fit to website chat vs AI inbox vs deflection.", 14, 1, ["features:live-chat", "features:website-messenger"]),
      crit("proactive-chat", "Proactive chat", "Triggers, targeting, and campaign depth.", 10, 2, ["features:proactive-chat"]),
      crit("chatbot-deflection", "Chatbot / deflection", "Bot flows and AI resolution depth.", 12, 3, ["features:chatbot-ai-agent"]),
      crit("helpdesk-integrations", "Helpdesk integrations", "Ticketing, CRM, and stack connectors.", 10, 4, ["features:helpdesk-integrations"]),
      crit("visitor-context", "Visitor context", "Pages viewed, identity, and session data.", 8, 5, ["features:live-chat"]),
      crit("analytics", "Analytics", "Chat volume, deflection, and agent metrics.", 8, 6, ["features:live-chat"]),
      crit("scalability", "Scalability", "Agent limits, routing, and governance.", 8, 7, ["limits"]),
      crit("value-for-money", "Value for money", "Per-agent vs conversation-cap TCO.", 10, 8, ["pricing", "plans"]),
      crit("ai-capabilities", "AI capabilities", "AI agent, copilot, and outcome pricing.", 8, 9, ["features:agent-copilot", "features:chatbot-ai-agent"]),
    ],
    notes: "Weights sum to 100. Score within live-chat clusters. Affiliate economics excluded.",
  },
  comparisonCriteria: [
    cmp("starting-pricing", "Starting pricing", "factual", 0, "high"),
    cmp("pricing-unit", "Pricing unit (seat vs conversation)", "factual", 1, "high"),
    cmp("website-messenger", "Website messenger", "editorial", 2, "high", "website-messenger"),
    cmp("proactive-chat", "Proactive chat", "editorial", 3, "high", "proactive-chat"),
    cmp("chatbot-ai", "Chatbot / AI agent", "editorial", 4, "high", "chatbot-ai-agent"),
    cmp("integrations", "Integrations", "editorial", 5, "medium"),
  ],
  pricingDimensions: [
    { id: "pd-lc-seats", slug: "seats", name: "Agents / seats", enginePrimitive: "per-seat", required: true },
    { id: "pd-lc-conversations", slug: "conversations", name: "Billable conversations", enginePrimitive: "usage", required: true },
    { id: "pd-lc-plans", slug: "plans", name: "Plan tiers", enginePrimitive: "flat", required: true },
  ],
  pricingCapability: "PARTIAL",
  pricingCapabilityNotes: [
    "Per-seat and conversation-cap primitives supported; category TCO calculator not built",
  ],
  recommendationDimensions: [
    { id: "rd-lc-job", slug: "primary-job", name: "Primary job (messenger vs deflection vs AI inbox)" },
    { id: "rd-lc-team", slug: "team-size", name: "Agent count and pricing unit" },
    { id: "rd-lc-stack", slug: "helpdesk-stack", name: "Helpdesk / CRM stack" },
    { id: "rd-lc-budget", slug: "budget", name: "Budget" },
  ],
  finderReadiness: "NOT_READY",
  finderNotes: [
    "Use parent customer-service-finder with channel-primary filter — no dedicated subcategory finder UI",
    "Live-chat job routing through parent CS finder dimensions",
  ],
  useCases: [
    { slug: "live-chat-support", name: "Live chat support", pageEligibility: "content-candidate" },
    { slug: "ai-customer-service", name: "AI customer service", pageEligibility: "content-candidate" },
  ],
  audienceSlugs: ["customer-success", "operations", "sales"],
  businessSizeSlugs: ["micro", "small-business", "mid-market", "enterprise"],
  businessTypeSlugs: ["saas", "ecommerce", "agency", "startup"],
  seedProductSlugs: ["tidio", "freshchat", "livechat", "intercom"],
  queryAliases: [
    "live chat software",
    "website chat",
    "website messenger",
    "chatbot deflection",
  ],
  requiredResearchDomains: ["identity", "pricing", "plans", "features", "integrations", "limits"],
  optionalResearchDomains: ["free-trial"],
  pricingModelsSupported: ["per-seat", "usage", "flat", "credits", "hybrid"],
  notes: [
    "Tier 1 CS subcategory — July 2027 indexable sub-hub launch",
    "~4880 affiliate revenue units in expansion audit",
    "Do not invent product scores; do not auto-publish pages",
  ],
  supportingKnowledgeAreas: ["fundamentals", "selection", "pricing", "features"],
});

function feat(
  slug: string,
  name: string,
  description: string,
  importance: "core" | "important" | "optional" | "specialist",
  comparisonRelevant: boolean,
  finderRelevant: boolean,
  researchGuidance?: string,
) {
  return {
    id: `feat-lc-${slug}`,
    slug,
    name,
    description,
    importance,
    comparisonRelevant,
    finderRelevant,
    researchGuidance,
    aliases: [],
  };
}

function crit(
  slug: string,
  name: string,
  description: string,
  weight: number,
  displayOrder: number,
  evidenceRequirements: string[],
) {
  return {
    id: `crit-lc-${slug}`,
    slug,
    name,
    description,
    weight,
    evidenceRequirements,
    scoringScaleMin: 0,
    scoringScaleMax: 10,
    categorySlug: "live-chat",
    displayOrder,
  };
}

function cmp(
  slug: string,
  name: string,
  kind: "factual" | "editorial",
  displayOrder: number,
  decisionImportance: "high" | "medium" | "low",
  featureSlug?: string,
) {
  return {
    id: `cmp-lc-${slug}`,
    slug,
    name,
    kind,
    displayOrder,
    decisionImportance,
    ...(featureSlug ? { featureSlug } : {}),
  };
}
