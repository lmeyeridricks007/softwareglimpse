import type { CapabilityHubProfile } from "@/domain";

type Depth = Pick<
  CapabilityHubProfile,
  | "displayTitle"
  | "badgeLabel"
  | "tagline"
  | "overview"
  | "whoThisIsFor"
  | "whatMattersIntro"
  | "workedExample"
  | "workedExampleSecondary"
  | "glance"
  | "challenges"
  | "outcomes"
  | "capabilityNeeds"
  | "workflowSteps"
  | "priorities"
  | "scenarios"
  | "buyingFramework"
  | "buyingGuideHref"
  | "faq"
  | "heroVisual"
  | "needsVisual"
  | "workflowVisual"
  | "relatedCapabilitySlugs"
  | "relatedUseCaseSlugs"
  | "relatedRequirementSlugs"
  | "relatedFeatureSlugs"
  | "featuredGuideHrefs"
  | "categorySlug"
>;

const NO_UNIVERSAL =
  "No. Fit depends on your primary support job (helpdesk vs live chat vs ecommerce vs ITSM), team size, and which channels are must-haves. Use Best customer service software rather than a single ranking.";

const CS_META = {
  categorySlug: "customer-service" as const,
  buyingGuideHref: "/guides/how-to-choose-customer-service-software/",
};

function csCap(args: {
  slug: string;
  title: string;
  badge: string;
  tagline: string;
  overview: string;
  who: string;
  matters: string;
  example: string;
  example2: string;
  goal: string;
  priorities: string[];
  relatedCaps: string[];
  relatedUse: string[];
  featureSlug: string;
}): Depth {
  return {
    ...CS_META,
    displayTitle: `Customer service ${args.title} capability`,
    badgeLabel: args.badge,
    tagline: args.tagline,
    overview: args.overview,
    whoThisIsFor: args.who,
    whatMattersIntro: args.matters,
    workedExample: args.example,
    workedExampleSecondary: args.example2,
    glance: {
      primaryGoal: args.goal,
      typicalTeam: "Support agents, team leads, and CX ops",
      commonPriorities: args.priorities,
    },
    challenges: [
      {
        id: "missing",
        title: "Capability missing or gated",
        pain: "Teams discover the feature only after buying the wrong plan.",
        crmHelps: "Map must-haves to the qualifying plan before purchase.",
      },
      {
        id: "wrong-job",
        title: "Wrong job cluster",
        pain: "A live-chat tool is scored as if it were ITSM, or a helpdesk is forced into Shopify refunds.",
        crmHelps: "Name the weekly ritual first — tickets, chat, orders, or incidents.",
      },
    ],
    outcomes: [
      {
        id: "owned",
        title: "Owned work",
        description: "Every conversation has an owner, status, and next action.",
      },
      {
        id: "deflect",
        title: "Fewer repeats",
        description: "Self-service and bots take the questions agents already answered.",
      },
    ],
    capabilityNeeds: [
      {
        id: "core",
        title: args.title,
        description: args.tagline,
        priority: "must",
      },
    ],
    workflowSteps: [
      {
        id: "intake",
        label: "Intake",
        detail: "Channel creates a ticket or chat with enough context.",
        goal: "No lost requests",
      },
      {
        id: "route",
        label: "Route",
        detail: "Assignment, SLA, or skills send it to the right queue.",
        goal: "Right owner",
      },
      {
        id: "resolve",
        label: "Resolve",
        detail: "Macros, order actions, or AI assist close the loop.",
        goal: "Done in the tool",
      },
    ],
    priorities: args.priorities.slice(0, 3).map((title, i) => ({
      id: `p-${i}`,
      title,
      description: `${title} as a buying lens for this capability.`,
    })),
    scenarios: [
      {
        id: "fit",
        title: "When this capability is the buy",
        bestWhen: args.example,
      },
      {
        id: "skip",
        title: "When another cluster is primary",
        bestWhen:
          "Keep this on a secondary shortlist if a different support job (helpdesk, chat, ecommerce, or ITSM) is the weekly ritual.",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Confirm this is the blocking job",
        href: "/guides/what-is-customer-service-software/",
      },
      {
        step: 2,
        title: "Map it to seats, tickets, or AI outcomes",
        href: "/guides/customer-service-pricing-guide/",
      },
      {
        step: 3,
        title: "Test it in a shared trial",
        href: "/guides/customer-service-evaluation-guide/",
      },
      {
        step: 4,
        title: "Compare researched platforms",
        href: "/best/customer-service-software/",
        ctaLabel: "Best customer service software →",
      },
    ],
    faq: [
      {
        question: `Is there one best platform for ${args.title.toLowerCase()}?`,
        answer: NO_UNIVERSAL,
      },
      {
        question: "How does this relate to CRM?",
        answer:
          "CRM stores customer and deal records. This capability handles support conversations — tickets, chat, or incidents — and should integrate with CRM rather than replace it.",
      },
    ],
    relatedCapabilitySlugs: args.relatedCaps,
    relatedUseCaseSlugs: args.relatedUse,
    relatedRequirementSlugs: [],
    relatedFeatureSlugs: [args.featureSlug],
    featuredGuideHrefs: [
      "/guides/how-to-choose-customer-service-software/",
      "/guides/what-is-customer-service-software/",
      "/best/customer-service-software/",
      "/categories/customer-service/",
    ],
    heroVisual: {
      src: `/capabilities/${args.slug}-hero.png`,
      alt: `Educational diagram of customer service ${args.title.toLowerCase()} capability.`,
      caption: `${args.title} as buyers should evaluate it in a support stack — not a product endorsement.`,
    },
    needsVisual: {
      src: `/capabilities/${args.slug}-needs-v2.png`,
      alt: `Diagram mapping ${args.title.toLowerCase()} pains to support-software fixes.`,
      caption: `What usually breaks around ${args.title.toLowerCase()} — and how this capability helps.`,
    },
    workflowVisual: {
      src: `/capabilities/${args.slug}-workflow-v2.png`,
      alt: `Workflow diagram for using ${args.title.toLowerCase()} in customer service.`,
      caption: `A practical operating loop for ${args.title.toLowerCase()}.`,
    },
  };
}

/**
 * Customer-service capability hub depth.
 * Does **not** include `shared-inbox` (BC owns) or generic `ai-assistance` (CRM owns).
 */
export const customerServiceCapabilityDepth: Record<string, Depth> = {
  ticketing: csCap({
    slug: "ticketing",
    title: "Ticketing",
    badge: "Ticketing",
    tagline: "Queues, statuses, assignment, and resolution workflows for support teams.",
    overview:
      "Ticketing is the helpdesk core that turns inbound email and portal requests into owned work with status and history.",
    who: "Support agents and leads who cannot run on a shared mailbox.",
    matters: "Evaluate channels that create tickets and any volume or agent gates on the plan you will buy.",
    example:
      "Worked example: Harbor Support converts support@ into tickets with collision detection instead of a Gmail pile.",
    example2:
      "Worked example: a SaaS team tracks reopen-on-reply so bugs do not vanish after first close.",
    goal: "Owned ticket queues",
    priorities: ["Queues", "Assignment", "Statuses", "History", "Plan gates"],
    relatedCaps: ["sla-routing", "macros-automation", "helpdesk-reporting"],
    relatedUse: ["helpdesk-ticketing"],
    featureSlug: "ticketing",
  }),
  "live-chat": csCap({
    slug: "live-chat",
    title: "Live chat",
    badge: "Live chat",
    tagline: "Website or in-app chat with routing, canned replies, and visitor context.",
    overview:
      "Live chat is real-time visitor conversation with routing and handoff — distinct from a full omnichannel helpdesk.",
    who: "Website and product teams answering questions while the visitor is still on the page.",
    matters: "Evaluate operating hours, routing, and conversation-pack vs per-agent pricing.",
    example:
      "Worked example: a Shopify store uses chat for size questions during business hours only.",
    example2:
      "Worked example: a SaaS marketing site routes high-intent visitors to a human, not a broadcast bot.",
    goal: "Real-time visitor help",
    priorities: ["Routing", "Visitor context", "Hours", "Handoff", "Conversation caps"],
    relatedCaps: ["chatbot-ai-agent", "omnichannel-inbox"],
    relatedUse: ["live-chat-support"],
    featureSlug: "live-chat",
  }),
  "knowledge-base": csCap({
    slug: "knowledge-base",
    title: "Knowledge base",
    badge: "Knowledge base",
    tagline: "Customer-facing help center articles, categories, and search.",
    overview:
      "A knowledge base publishes answers so customers can self-serve before opening a ticket.",
    who: "CX writers and support leads measuring deflection.",
    matters: "Evaluate article limits, branding, and whether the bot can cite the same content.",
    example:
      "Worked example: Help Scout Docs answers password-reset questions before they hit the inbox.",
    example2:
      "Worked example: a SaaS team localizes the top 40 articles instead of hiring night-shift agents.",
    goal: "Searchable self-service answers",
    priorities: ["Search", "Categories", "Branding", "Limits", "Bot citation"],
    relatedCaps: ["self-service-portal", "chatbot-ai-agent"],
    relatedUse: ["knowledge-base-self-service"],
    featureSlug: "knowledge-base",
  }),
  "omnichannel-inbox": csCap({
    slug: "omnichannel-inbox",
    title: "Omnichannel inbox",
    badge: "Omnichannel inbox",
    tagline: "Unified agent workspace across email, chat, social, messaging, and voice.",
    overview:
      "Omnichannel inbox is one agent view of every customer thread — not five logins.",
    who: "Support orgs that already run more than email.",
    matters: "List native channels vs add-on or usage-priced channels on the plan you will buy.",
    example:
      "Worked example: Zendesk Suite Team unifies messaging and voice that Support Team does not include.",
    example2:
      "Worked example: Freshdesk Pro adds multilingual routing across email and chat.",
    goal: "One workspace, all channels",
    priorities: ["Native channels", "Add-on gates", "Routing", "History", "TCO"],
    relatedCaps: ["ticketing", "live-chat", "phone-support"],
    relatedUse: ["omnichannel-support"],
    featureSlug: "omnichannel-inbox",
  }),
  "sla-routing": csCap({
    slug: "sla-routing",
    title: "SLA & routing",
    badge: "SLA & routing",
    tagline: "SLA timers, priority, skills-based routing, and business-hours policies.",
    overview:
      "SLA and routing decide who owns a conversation and when it is late — the difference between a mailbox and a helpdesk.",
    who: "Team leads accountable for first-response and resolution targets.",
    matters: "Count how many SLA policies ship on Standard vs Pro, and whether skills routing is gated.",
    example:
      "Worked example: Harbor Support routes VIP accounts to a skills queue with a 1-hour first response.",
    example2:
      "Worked example: Help Scout Plus adds advanced SLA policies the Free plan does not have.",
    goal: "Targets that actually fire",
    priorities: ["SLA count", "Skills", "Hours", "Escalation", "Plan gates"],
    relatedCaps: ["ticketing", "helpdesk-reporting"],
    relatedUse: ["helpdesk-ticketing", "omnichannel-support"],
    featureSlug: "sla-routing",
  }),
  "ecommerce-helpdesk": csCap({
    slug: "ecommerce-helpdesk",
    title: "Ecommerce helpdesk",
    badge: "Ecommerce helpdesk",
    tagline: "Order, refund, and Shopify/Magento context inside the agent workspace.",
    overview:
      "Ecommerce helpdesk is order-aware support — refunds and tracking beside the thread, not a generic ticket tool.",
    who: "DTC and Shopify teams answering WISMO, returns, and subscription changes.",
    matters: "Do not rank this capability against ITSM or generic live chat. Model ticket caps, not just seats.",
    example:
      "Worked example: Gorgias lets an agent cancel an order in Shopify without leaving the conversation.",
    example2:
      "Worked example: a Magento brand needs Pro-tier store connectors, not Starter.",
    goal: "Order actions in the inbox",
    priorities: ["Storefront", "Refunds", "WISMO", "Ticket caps", "AI actions"],
    relatedCaps: ["ticketing", "chatbot-ai-agent"],
    relatedUse: ["ecommerce-support"],
    featureSlug: "ecommerce-helpdesk",
  }),
  "itsm-service-desk": csCap({
    slug: "itsm-service-desk",
    title: "ITSM / service desk",
    badge: "ITSM / service desk",
    tagline: "ITIL-style incidents, problems, changes, and asset/CMDB workflows.",
    overview:
      "ITSM is an internal or employee service desk — not an SMB live-chat or ecommerce helpdesk peer.",
    who: "IT and enterprise service teams running incidents and changes.",
    matters: "Problem/change/release depth is typically Pro-gated. Do not score against Freshdesk or Tidio.",
    example:
      "Worked example: Freshservice Pro adds problem and change management that Starter does not include.",
    example2:
      "Worked example: an MSP uses multiple portals rather than a public Shopify inbox.",
    goal: "ITIL work in one desk",
    priorities: ["Incidents", "Changes", "CMDB", "Catalog", "Plan gates"],
    relatedCaps: ["ticketing", "self-service-portal"],
    relatedUse: ["itsm-service-desk"],
    featureSlug: "itsm-service-desk",
  }),
  "chatbot-ai-agent": csCap({
    slug: "chatbot-ai-agent",
    title: "Chatbot / AI agent",
    badge: "AI agent",
    tagline: "A bot that deflects or resolves conversations before a human agent.",
    overview:
      "AI agents resolve or deflect repetitive questions. Price is often per resolution or session pack — not included in the seat tile.",
    who: "CX ops modelling deflection without hiding the human path.",
    matters: "Record outcome pricing, credit packs, and which plans include the bot. Do not treat marketing fluff as coverage.",
    example:
      "Worked example: Help Scout AI Answers bills $0.75 per unassisted resolution with a monthly cap.",
    example2:
      "Worked example: Freshdesk includes a Freddy session pack, then $49/100 extra sessions.",
    goal: "Deflection you can audit",
    priorities: ["Resolution definition", "Handoff", "Knowledge sources", "Caps", "TCO"],
    relatedCaps: ["agent-copilot", "knowledge-base"],
    relatedUse: ["ai-customer-service"],
    featureSlug: "chatbot-ai-agent",
  }),
};
