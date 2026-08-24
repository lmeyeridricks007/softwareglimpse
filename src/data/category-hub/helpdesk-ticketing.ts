import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildHelpdeskTicketingCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "helpdesk-ticketing",
    shortName: "Helpdesk & Ticketing",
    displayName: "Helpdesk & Ticketing Software",
    tagline:
      "Shared inbox, ticketing, SLA workflows, and knowledge base — distinct from live chat widgets and phone-only support.",
    definition:
      "Helpdesk and ticketing software manages customer support cases — shared inboxes, ticket workflows, SLA routing, knowledge bases, macros, and omnichannel agent workspaces. The right tool matches the helpdesk job — SMB helpdesk, ITSM service desk, ecommerce order-native support, or email-first shared inbox — not a single list that ranks Freshdesk against Gorgias as undifferentiated peers. Shortlist via the parent Customer Service Finder default path.",
    iconSlug: "helpdesk-ticketing",
    decisionCriteria: [
      "Primary helpdesk job fit",
      "SMB helpdesk vs ITSM vs ecommerce vs email-first",
      "Per-agent vs ticket-volume pricing",
      "SLA routing and automation depth",
      "Knowledge base and self-service",
      "CRM and ecommerce integrations",
    ],
    popularNeeds: [
      "Ticket workflows",
      "Shared team inbox",
      "SLA policies and routing",
      "Knowledge base self-service",
      "Macros and automation",
      "Omnichannel agent workspace",
    ],
    chooseGuideHref: "/guides/how-to-choose-helpdesk-ticketing-software/",
    glance: {
      whatItDoes: [
        "Creates and routes support tickets",
        "Unifies email and messaging in a shared inbox",
        "Enforces SLA policies and escalations",
        "Publishes knowledge base articles for self-service",
        "Automates with macros and triggers",
        "Captures CSAT after resolution",
      ],
      bestFor: [
        "SMB teams needing full helpdesk workflows",
        "IT teams running internal service desks",
        "Ecommerce brands with order-aware support",
        "Email-first teams wanting a lightweight shared inbox",
      ],
      typicalFeatures: [
        "Ticketing",
        "Shared inbox",
        "SLA & routing",
        "Knowledge base",
        "Macros & automation",
        "Omnichannel inbox",
      ],
    },
    types: [
      {
        id: "smb-helpdesk",
        name: "SMB helpdesk",
        description: "Full ticketing, shared inbox, and knowledge base for growing teams.",
        icon: "inbox",
        href: "/use-cases/helpdesk-ticketing/",
        ctaLabel: "Explore SMB helpdesk →",
      },
      {
        id: "itsm-service-desk",
        name: "IT service desk",
        description: "ITSM ticketing with asset management and internal SLAs.",
        icon: "server",
        href: "/use-cases/itsm-service-desk/",
        ctaLabel: "Explore IT service desk →",
      },
      {
        id: "ecommerce-helpdesk",
        name: "Ecommerce helpdesk",
        description: "Order-aware support with Shopify and marketplace integrations.",
        icon: "shopping-cart",
        href: "/use-cases/helpdesk-ticketing/",
        ctaLabel: "Explore ecommerce helpdesk →",
      },
      {
        id: "email-first-inbox",
        name: "Email-first shared inbox",
        description: "Lightweight shared inbox with collaborative email workflows.",
        icon: "mail",
        href: "/use-cases/shared-inbox-support/",
        ctaLabel: "Explore email-first inbox →",
      },
    ],
    tools: [
      {
        label: "CS Finder — default path",
        description:
          "Shortlist by helpdesk job fit via the parent customer service finder.",
        href: "/tools/customer-service-finder/",
        ctaLabel: "Run CS Finder →",
      },
    ],
    finderHref: "/tools/customer-service-finder/",
    bestPageHref: "/best/helpdesk-ticketing-software/",
    guides: [
      {
        slug: "what-is-helpdesk-ticketing-software",
        title: "What is helpdesk & ticketing software?",
        href: "/guides/what-is-helpdesk-ticketing-software/",
      },
      {
        slug: "how-to-choose-helpdesk-ticketing-software",
        title: "How to choose helpdesk & ticketing software",
        href: "/guides/how-to-choose-helpdesk-ticketing-software/",
      },
      {
        slug: "helpdesk-ticketing-pricing-guide",
        title: "Helpdesk & ticketing pricing guide",
        href: "/guides/helpdesk-ticketing-pricing-guide/",
      },
      {
        slug: "helpdesk-ticketing-vs-customer-service-software",
        title: "Helpdesk vs broader customer service software",
        href: "/guides/helpdesk-ticketing-vs-customer-service-software/",
      },
    ],
  });
}
