import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildItsmCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "itsm",
    shortName: "ITSM",
    displayName: "ITSM Software",
    tagline:
      "Internal service desk, incident management, and ITIL workflows — distinct from customer-facing helpdesk and observability suites.",
    definition:
      "ITSM software runs internal employee service desks — incident management, change/problem workflows, service catalogs, and ITIL-aligned operations for IT teams. The right tool matches the ITSM job — SMB internal desk, enterprise ITSM, or customer-facing hybrid — not a single list that ranks Freshservice against Freshdesk as undifferentiated peers. Shortlist via the parent IT & Development Finder, scoping customer-facing vs internal ITSM.",
    iconSlug: "itsm",
    decisionCriteria: [
      "Primary ITSM job fit",
      "Internal vs customer-facing scope",
      "SMB ITSM vs enterprise ITIL depth",
      "Per-agent vs IT-user pricing",
      "Change and problem workflow depth",
      "Service catalog and asset management",
    ],
    popularNeeds: [
      "Internal IT ticketing",
      "Incident management",
      "Change & problem workflows",
      "Employee service catalog",
      "Asset management / CMDB",
      "SLA policies and escalations",
    ],
    chooseGuideHref: "/guides/how-to-choose-itsm-software/",
    glance: {
      whatItDoes: [
        "Manages internal IT support tickets",
        "Tracks incidents from intake to resolution",
        "Runs change, problem, and release workflows",
        "Publishes employee service request catalogs",
        "Maintains asset inventory and CMDB records",
        "Enforces internal SLA policies",
      ],
      bestFor: [
        "IT teams replacing email for internal support",
        "Mid-market orgs needing ITIL-aligned workflows",
        "Enterprises running formal service desks",
        "Teams separating internal IT from customer helpdesk",
      ],
      typicalFeatures: [
        "Incident management",
        "Change & problem management",
        "Service catalog",
        "Asset management / CMDB",
        "ITSM AI assistance",
        "Enterprise security & SSO",
      ],
    },
    types: [
      {
        id: "smb-itsm",
        name: "SMB IT service desk",
        description: "Lightweight internal ticketing and service catalog for growing IT teams.",
        icon: "inbox",
        href: "/use-cases/itsm-service-desk/",
        ctaLabel: "Explore SMB ITSM →",
      },
      {
        id: "enterprise-itsm",
        name: "Enterprise ITSM",
        description: "Full ITIL change, problem, and asset management for large orgs.",
        icon: "building",
        href: "/use-cases/itsm-service-desk/",
        ctaLabel: "Explore enterprise ITSM →",
      },
      {
        id: "internal-desk",
        name: "Internal service desk",
        description: "Employee-facing IT support — distinct from customer helpdesk.",
        icon: "users",
        href: "/use-cases/internal-it-support/",
        ctaLabel: "Explore internal desk →",
      },
      {
        id: "customer-hybrid",
        name: "Customer-facing hybrid",
        description: "Platforms straddling internal ITSM and customer support jobs.",
        icon: "layers",
        href: "/use-cases/itsm-service-desk/",
        ctaLabel: "Explore hybrid ITSM →",
      },
    ],
    tools: [
      {
        label: "IT Finder — internal vs customer scope",
        description:
          "Shortlist by ITSM job fit via the parent IT finder — scope customer-facing vs internal ITSM.",
        href: "/tools/it-development-finder/",
        ctaLabel: "Run IT Finder →",
      },
    ],
    finderHref: "/tools/it-development-finder/",
    bestPageHref: "/best/itsm-software/",
    guides: [
      {
        slug: "what-is-itsm-software",
        title: "What is ITSM software?",
        href: "/guides/what-is-itsm-software/",
      },
      {
        slug: "how-to-choose-itsm-software",
        title: "How to choose ITSM software",
        href: "/guides/how-to-choose-itsm-software/",
      },
      {
        slug: "itsm-pricing-guide",
        title: "ITSM pricing guide",
        href: "/guides/itsm-pricing-guide/",
      },
      {
        slug: "itsm-vs-it-development-software",
        title: "ITSM vs broader IT & development software",
        href: "/guides/itsm-vs-it-development-software/",
      },
    ],
  });
}
