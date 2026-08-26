import type { UseCaseHubProfile } from "@/domain";

type Depth = Pick<
  UseCaseHubProfile,
  | "overview"
  | "whoThisIsFor"
  | "whatMattersIntro"
  | "workedExample"
  | "workedExampleSecondary"
  | "tagline"
  | "displayTitle"
  | "badgeLabel"
  | "glance"
  | "challenges"
  | "outcomes"
  | "capabilityNeeds"
  | "workflowSteps"
  | "priorities"
  | "scenarios"
  | "buyingFramework"
  | "needsVisual"
  | "workflowVisual"
  | "heroVisual"
  | "faq"
  | "relatedUseCaseSlugs"
  | "featuredGuideHrefs"
  | "categorySlug"
  | "finderHref"
  | "catalogueHref"
  | "primaryCta"
  | "secondaryCta"
  | "buyingGuideHref"
>;

const CS_CTAS = {
  categorySlug: "customer-service" as const,
  finderHref: "/best/customer-service-software/",
  catalogueHref: "/categories/customer-service/",
  buyingGuideHref: "/guides/how-to-choose-customer-service-software/",
  primaryCta: {
    href: "/best/customer-service-software/",
    label: "Best customer service software",
  },
  secondaryCta: {
    href: "/categories/customer-service/",
    label: "Browse customer service software",
  },
};

const CS_GUIDES = [
  "/guides/what-is-customer-service-software/",
  "/guides/how-to-choose-customer-service-software/",
  "/guides/customer-service-pricing-guide/",
  "/best/customer-service-software/",
];

function csUseCase(args: {
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
  productsNote: string;
  related: string[];
  needs: Array<{
    id: string;
    title: string;
    description: string;
    priority: "must" | "nice";
  }>;
  steps: Array<{ id: string; label: string; detail: string; goal: string }>;
}): Depth {
  return {
    ...CS_CTAS,
    displayTitle: `Customer service software for ${args.title}`,
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
        id: "scatter",
        title: "Work lives in inboxes and chat",
        pain: "Leads reconstruct status every week from email and Slack.",
        crmHelps: "A shared queue keeps owners, SLAs, and next steps visible.",
      },
      {
        id: "wrong-job",
        title: "Wrong job cluster",
        pain: "A live-chat widget is forced to act like ITSM (or the reverse).",
        crmHelps: "Shortlist only tools whose primary job matches.",
      },
      {
        id: "gates",
        title: "Must-haves are plan-gated",
        pain: "Teams discover channel or macro limits after buying.",
        crmHelps: "Map must-haves to the qualifying plan before purchase.",
      },
      {
        id: "units",
        title: "Pricing units do not match volume",
        pain: "Seat tiles hide ticket-cap or AI-outcome overage.",
        crmHelps: "Model agents, conversations, and credits on one worksheet.",
      },
    ],
    outcomes: [
      {
        id: "owned",
        title: "Owned conversations",
        description: "Every open ticket or chat has a person and a next step.",
      },
      {
        id: "visible",
        title: "Visible status",
        description: "Reviews start from the queue, not from Slack archaeology.",
      },
      {
        id: "fewer-repeats",
        title: "Fewer repeat contacts",
        description: "Docs, macros, and bots deflect the questions you already solved.",
      },
      {
        id: "cleaner-handoffs",
        title: "Cleaner handoffs",
        description: "Context stays attached to the ticket, order, or incident.",
      },
    ],
    capabilityNeeds: args.needs.map((n) => ({
      ...n,
      href: `/capabilities/${n.id}/`,
    })),
    workflowSteps: args.steps,
    priorities: args.priorities.slice(0, 3).map((title, i) => ({
      id: `p-${i}`,
      title,
      description: `${title} as a buying lens for this use case.`,
      icon: "check" as const,
    })),
    scenarios: [
      {
        id: "primary",
        title: "Primary job buyer",
        bestWhen: "This use case is the blocking weekly ritual.",
      },
      {
        id: "adjacent",
        title: "Adjacent job",
        bestWhen:
          "Another customer-service cluster is primary — keep this tool on a separate shortlist.",
      },
    ],
    buyingFramework: [
      {
        step: 1,
        title: "Confirm this use case is the primary job",
        href: "/guides/how-to-choose-customer-service-software/",
      },
      {
        step: 2,
        title: "Write must-have workflows",
        href: "/guides/customer-service-requirements-guide/",
      },
      {
        step: 3,
        title: "Price the qualifying configuration",
        href: "/guides/customer-service-pricing-guide/",
      },
      {
        step: 4,
        title: "Compare researched platforms",
        href: "/best/customer-service-software/",
        ctaLabel: "Best customer service software →",
      },
    ],
    heroVisual: {
      src: `/use-cases/${args.slug}-hero.png`,
      alt: `Educational diagram for ${args.title} in customer service software.`,
      caption: `${args.title} as buyers should evaluate it — not a product endorsement.`,
    },
    needsVisual: {
      src: `/use-cases/${args.slug}-needs-v2.png`,
      alt: `Needs diagram for ${args.title}.`,
      caption: "What usually breaks — and how the right tooling helps.",
    },
    workflowVisual: {
      src: `/use-cases/${args.slug}-workflow-v2.png`,
      alt: `Workflow diagram for ${args.title}.`,
      caption: "A practical operating loop for this use case.",
    },
    faq: [
      {
        question: "Which products relate to this use case?",
        answer: `In the current customer-service catalogue wave, explore: ${args.productsNote}. Related products appear when those soft entries are seeded and tagged.`,
      },
      {
        question: "Is there one best tool for this use case?",
        answer:
          "No. Fit depends on job cluster, agent count, and plan gates. Use the Best customer service software page for methodology-based editor’s picks inside clusters — not one undifferentiated ranking.",
      },
    ],
    relatedUseCaseSlugs: args.related,
    featuredGuideHrefs: CS_GUIDES,
  };
}

/**
 * Customer service use-case hub depth (`/use-cases/[slug]/`).
 * Educational — no invented prices, scores, or product endorsements.
 */
export const customerServiceUseCaseDepth: Record<string, Depth> = {
  "helpdesk-ticketing": csUseCase({
    slug: "helpdesk-ticketing",
    title: "Helpdesk / ticketing",
    badge: "Helpdesk",
    tagline:
      "Turn email into owned tickets with SLAs and macros — instead of a shared inbox nobody trusts.",
    overview:
      "Helpdesk / ticketing is the job of giving every customer request an owner, a status, and a next step the team can defend. It replaces “who has this email?” with queues, assignment, and resolution tracking.",
    who: "Support managers and agents who live in email and need SLAs, collision detection, and reporting — not just a website chat widget.",
    matters:
      "Prioritise ticketing depth, SLA/routing, and the plan that actually unlocks macros before you compare omnichannel extras.",
    example:
      "Worked example: Harbor Support moves a 6-person team off a shared Gmail label into a helpdesk. Every request has an owner and first-response clock; Monday reviews start from breaches, not from “any updates?”",
    example2:
      "Worked example: a founder-led SaaS team hires its first two agents. Tickets replace the founder’s inbox so coverage survives vacation.",
    goal: "Owned ticket queues with trusted SLAs",
    priorities: [
      "Ticket ownership",
      "SLA clocks",
      "Macros",
      "Reporting",
      "Plan gates",
    ],
    productsNote: "zendesk-suite, freshdesk, help-scout, zoho-desk",
    related: ["omnichannel-support", "knowledge-base-self-service"],
    needs: [
      {
        id: "ticketing",
        title: "Ticketing",
        description: "Email-to-ticket queues on the plan you will buy.",
        priority: "must",
      },
      {
        id: "sla-routing",
        title: "SLA & routing",
        description: "First-response and assignment rules you can report.",
        priority: "must",
      },
    ],
    steps: [
      {
        id: "capture",
        label: "Capture",
        detail: "Turn inbound email into a ticket with an owner.",
        goal: "No orphan requests.",
      },
      {
        id: "route",
        label: "Route",
        detail: "Apply SLA and skills-based assignment.",
        goal: "The right agent sees it in time.",
      },
      {
        id: "resolve",
        label: "Resolve",
        detail: "Use macros and collision detection.",
        goal: "One reply thread, one owner.",
      },
      {
        id: "review",
        label: "Review",
        detail: "Start the weekly standup from breaches and backlog.",
        goal: "Coaching from the queue, not Slack.",
      },
    ],
  }),

  "live-chat-support": csUseCase({
    slug: "live-chat-support",
    title: "Live chat support",
    badge: "Live chat",
    tagline:
      "Talk to website visitors in real time and route chats to the right agent — instead of a contact form that dies in email.",
    overview:
      "Live chat support is the job of catching high-intent visitors while they are on the page, with routing, canned replies, and visitor context. It is not a full helpdesk or an ITSM desk.",
    who: "Support and pre-sales teams that need a messenger on the site, not a ticket queue for every email.",
    matters:
      "Prioritise routing, canned replies, and honest pricing units (per-agent vs conversation caps) on the plan you will buy.",
    example:
      "Worked example: Northline Store adds live chat to product pages. Visitors asking size questions get a two-minute reply; abandoned “contact us” forms drop.",
    example2:
      "Worked example: a SaaS marketing site routes pricing chats to sales and bug chats to support without sharing one unowned widget.",
    goal: "Routed real-time visitor conversations",
    priorities: [
      "Routing",
      "Canned replies",
      "Visitor context",
      "Pricing unit",
      "Plan gates",
    ],
    productsNote: "freshchat, livechat, tidio",
    related: ["ai-customer-service", "omnichannel-support"],
    needs: [
      {
        id: "live-chat",
        title: "Live chat",
        description: "Website messenger with routing on the qualifying plan.",
        priority: "must",
      },
      {
        id: "chatbot-ai-agent",
        title: "Chatbot / AI agent",
        description: "Deflection that you can price as credits or conversations.",
        priority: "nice",
      },
    ],
    steps: [
      {
        id: "widget",
        label: "Place the widget",
        detail: "Put chat on pages where intent is high.",
        goal: "Visitors can start a conversation.",
      },
      {
        id: "route",
        label: "Route",
        detail: "Send chats to the right queue or person.",
        goal: "No orphan widget.",
      },
      {
        id: "reply",
        label: "Reply",
        detail: "Use canned replies and visitor context.",
        goal: "Fast, consistent answers.",
      },
      {
        id: "hand-off",
        label: "Hand off",
        detail: "Escalate to email/tickets when the chat cannot finish.",
        goal: "Context survives the channel change.",
      },
    ],
  }),

  "ecommerce-support": csUseCase({
    slug: "ecommerce-support",
    title: "Ecommerce support",
    badge: "Ecommerce",
    tagline:
      "Handle order, refund, and shipping questions with storefront context in the inbox — instead of tab-hopping Shopify admin.",
    overview:
      "Ecommerce support is the job of answering store questions with order, refund, and subscription context beside the conversation. Generic helpdesks can do email; ecommerce helpdesks put the order in the same thread.",
    who: "DTC and Shopify/Magento/BigCommerce support teams whose tickets are mostly “where is my order?” and refunds.",
    matters:
      "Prioritise native storefront actions and ticket/conversation pricing at your volume — per-agent tiles are the wrong unit if refunds explode at peak.",
    example:
      "Worked example: Harbor Shop processes refunds in the helpdesk thread with the order open beside it. Agents stop copying order IDs between Shopify and Gmail.",
    example2:
      "Worked example: a subscription box brand surfaces upcoming orders in chat so “skip this month” does not become a three-email thread.",
    goal: "Order-aware support in one agent workspace",
    priorities: [
      "Order context",
      "Refunds in-thread",
      "Storefront apps",
      "Ticket volume",
      "Peak overage",
    ],
    productsNote: "gorgias",
    related: ["helpdesk-ticketing", "live-chat-support"],
    needs: [
      {
        id: "ecommerce-helpdesk",
        title: "Ecommerce helpdesk",
        description: "Order/refund actions in the agent workspace.",
        priority: "must",
      },
      {
        id: "ticketing",
        title: "Ticketing",
        description: "A queue that can hold storefront conversations.",
        priority: "must",
      },
    ],
    steps: [
      {
        id: "connect",
        label: "Connect the store",
        detail: "Link Shopify or your cart with the qualifying plan.",
        goal: "Orders appear beside conversations.",
      },
      {
        id: "macros",
        label: "Build refund macros",
        detail: "Standardise WISMO and refund paths.",
        goal: "Repeat questions take seconds.",
      },
      {
        id: "resolve",
        label: "Resolve in-thread",
        detail: "Edit/refund without leaving the inbox.",
        goal: "One conversation, one order.",
      },
      {
        id: "review",
        label: "Review volume",
        detail: "Check ticket caps against peak week.",
        goal: "Overage is planned, not a surprise.",
      },
    ],
  }),

  "knowledge-base-self-service": csUseCase({
    slug: "knowledge-base-self-service",
    title: "Knowledge base / self-service",
    badge: "Self-service",
    tagline:
      "Publish help articles and portals so customers can solve issues without a ticket — instead of answering the same question daily.",
    overview:
      "Knowledge base / self-service is the job of putting trusted answers in front of customers before they write in. It is a deflection layer on top of helpdesk or chat — not a substitute for ownership when a ticket still appears.",
    who: "Support leads who see the same how-to questions every week and can assign article owners.",
    matters:
      "Prioritise search, publishing workflow, and whether Docs live on the plan you will actually buy.",
    example:
      "Worked example: Northline Support publishes ten shipping FAQs. WISMO tickets drop; remaining tickets are exceptions the queue can own.",
    example2:
      "Worked example: an SMB shared-inbox team uses Docs so new agents stop asking veterans for the same policy.",
    goal: "Deflect repeats with searchable articles",
    priorities: [
      "Search",
      "Publishing owners",
      "Portal / Docs",
      "Plan gates",
      "Ticket deflection",
    ],
    productsNote: "help-scout, zoho-desk, zendesk-suite, freshdesk",
    related: ["helpdesk-ticketing", "ai-customer-service"],
    needs: [
      {
        id: "knowledge-base",
        title: "Knowledge base",
        description: "Help center or Docs on the qualifying plan.",
        priority: "must",
      },
      {
        id: "ticketing",
        title: "Ticketing fallback",
        description: "A place for questions the article did not solve.",
        priority: "nice",
      },
    ],
    steps: [
      {
        id: "inventory",
        label: "Inventory repeats",
        detail: "List the top questions from last month’s tickets.",
        goal: "Articles match real demand.",
      },
      {
        id: "publish",
        label: "Publish",
        detail: "Assign an owner and a review date per article.",
        goal: "Docs stay true.",
      },
      {
        id: "surface",
        label: "Surface",
        detail: "Link search in the portal and in the agent composer.",
        goal: "Customers and agents find the same answer.",
      },
      {
        id: "measure",
        label: "Measure",
        detail: "Watch deflection vs still-open tickets.",
        goal: "Rewrite articles that fail.",
      },
    ],
  }),

  "omnichannel-support": csUseCase({
    slug: "omnichannel-support",
    title: "Omnichannel support",
    badge: "Omnichannel",
    tagline:
      "Handle email, chat, social, and messaging in one agent workspace — instead of five tabs and missed threads.",
    overview:
      "Omnichannel support is the job of unifying channels so a customer is one conversation, not three disconnected inboxes. It sits on a helpdesk core; a chat-only widget is not omnichannel.",
    who: "Teams already answering more than email — chat, social, or messaging — who need one agent workspace.",
    matters:
      "Prioritise which channels unlock on which plan. “Omnichannel” on a marketing page often means email + chat until you buy Suite-class packaging.",
    example:
      "Worked example: Harbor Support collapses Instagram DMs and email into one ticket. The same agent finishes the thread without asking the customer to repeat the order ID.",
    example2:
      "Worked example: a mid-market SaaS team adds messaging only after SLAs work on email — they do not buy voice they will not staff.",
    goal: "One customer, one workspace, across channels",
    priorities: [
      "Channel coverage",
      "Plan gates",
      "Shared history",
      "Routing",
      "Agent UX",
    ],
    productsNote: "zendesk-suite, freshdesk",
    related: ["helpdesk-ticketing", "live-chat-support"],
    needs: [
      {
        id: "omnichannel-inbox",
        title: "Omnichannel inbox",
        description: "Email, chat, and social on the plan you will buy.",
        priority: "must",
      },
      {
        id: "sla-routing",
        title: "SLA & routing",
        description: "The same clocks across channels.",
        priority: "must",
      },
    ],
    steps: [
      {
        id: "list",
        label: "List channels",
        detail: "Write the channels you will actually staff.",
        goal: "No unused voice SKU.",
      },
      {
        id: "gate",
        label: "Check gates",
        detail: "Map each channel to a plan tier.",
        goal: "The quote matches the inbox.",
      },
      {
        id: "unify",
        label: "Unify history",
        detail: "Confirm the same customer is one record.",
        goal: "No repeat “what’s your email?”",
      },
      {
        id: "staff",
        label: "Staff the queue",
        detail: "Assign coverage hours per channel.",
        goal: "SLAs are honest.",
      },
    ],
  }),

  "itsm-service-desk": csUseCase({
    slug: "itsm-service-desk",
    title: "ITSM / service desk",
    badge: "ITSM",
    tagline:
      "Run IT incidents, changes, and assets as an employee service desk — instead of a customer helpdesk pretending to be ITIL.",
    overview:
      "ITSM / service desk is the job of internal IT: incidents, problems, changes, and assets. It is a different purchase from SMB live chat or Shopify helpdesk even when the vendor family shares a brand.",
    who: "IT managers and internal support teams that need change control and CMDB-style asset context — not ecommerce refunds.",
    matters:
      "Prioritise incident/problem/change workflows on the qualifying ITSM plan. Do not shortlist customer-chat tools as cheaper ITSM.",
    example:
      "Worked example: Northline IT replaces a shared mailbox with an employee portal. Incidents have owners; changes need approval before Friday deploys.",
    example2:
      "Worked example: a 40-person company separates Freshservice (employees) from Freshdesk (customers) so SLAs and catalogues stay honest.",
    goal: "Owned IT incidents and changes",
    priorities: [
      "Incidents",
      "Changes",
      "Assets",
      "Employee portal",
      "Plan gates",
    ],
    productsNote: "freshservice",
    related: ["helpdesk-ticketing", "ai-customer-service"],
    needs: [
      {
        id: "itsm-service-desk",
        title: "ITSM / service desk",
        description: "Incidents, problems, changes, and assets.",
        priority: "must",
      },
      {
        id: "knowledge-base",
        title: "Employee knowledge base",
        description: "A portal for how-to and request catalogues.",
        priority: "nice",
      },
    ],
    steps: [
      {
        id: "catalogue",
        label: "Publish the catalogue",
        detail: "List request types employees can file.",
        goal: "Intake is structured.",
      },
      {
        id: "incident",
        label: "Run incidents",
        detail: "Assign owners and major-incident comms.",
        goal: "Outages have a record.",
      },
      {
        id: "change",
        label: "Control change",
        detail: "Require approval for risky deploys.",
        goal: "Friday surprises drop.",
      },
      {
        id: "assets",
        label: "Track assets",
        detail: "Tie tickets to devices where it matters.",
        goal: "Context survives handoffs.",
      },
    ],
  }),

  "ai-customer-service": csUseCase({
    slug: "ai-customer-service",
    title: "AI customer service",
    badge: "AI",
    tagline:
      "Deflect or resolve support conversations with an AI agent, plus copilot for humans — without pretending the bot replaces a helpdesk core.",
    overview:
      "AI customer service is assistance on top of chat or ticketing: resolution bots, outcome-priced agents, and copilots. Score it as a layer. A bot without a queue still leaves exceptions unowned. Gartner’s July 2026 Conversational AI Magic Quadrant maps the CAI platform market — use it for category context; SoftwareGlimpse scores products inside job clusters with dated research, not MQ placement.",
    who: "Support leads who have a working helpdesk or live-chat core and want deflection or agent assist — not a first-time inbox.",
    matters:
      "Prioritise where the bot is allowed to act, how outcomes/credits are billed, and what happens when it fails. Confirm the plan that includes the AI SKU.",
    example:
      "Worked example: Harbor Shop lets Lyro answer shipping FAQs and hands off refunds to humans. They model credit/conversation cost against peak weeks before turning the bot loose.",
    example2:
      "Worked example: a Zendesk Suite team pilots AI agents on password-reset macros first — not on billing disputes.",
    goal: "Deflect repeats; keep exceptions owned",
    priorities: [
      "Handoff rules",
      "Outcome / credit pricing",
      "Plan gates",
      "Human fallback",
      "Quality review",
    ],
    productsNote: "tidio, cometchat, zendesk-suite, freshchat; intercom is BC-primary adjacency",
    related: ["live-chat-support", "knowledge-base-self-service"],
    needs: [
      {
        id: "chatbot-ai-agent",
        title: "Chatbot / AI agent",
        description: "Deflection you can price and constrain.",
        priority: "must",
      },
      {
        id: "agent-copilot",
        title: "Agent copilot",
        description: "Suggested replies and summaries for humans.",
        priority: "nice",
      },
    ],
    steps: [
      {
        id: "scope",
        label: "Scope the bot",
        detail: "List intents it may resolve vs must escalate.",
        goal: "No unbounded automation.",
      },
      {
        id: "price",
        label: "Price outcomes",
        detail: "Model credits or resolutions at peak volume.",
        goal: "AI is a line item.",
      },
      {
        id: "handoff",
        label: "Test handoff",
        detail: "Fail a conversation on purpose and watch the queue.",
        goal: "Humans get full context.",
      },
      {
        id: "review",
        label: "Review quality",
        detail: "Sample transcripts weekly.",
        goal: "Wrong answers get turned off.",
      },
    ],
  }),
};
