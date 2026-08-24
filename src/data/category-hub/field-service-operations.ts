import { CategoryHubProfileSchema, type CategoryHubProfile } from "@/domain";

export function buildFieldServiceOperationsCategoryHubProfile(): CategoryHubProfile {
  return CategoryHubProfileSchema.parse({
    categorySlug: "field-service-operations",
    shortName: "Field Service & Operations",
    displayName: "Field Service & Operations Software",
    tagline:
      "Find field service software by job — construction management, trades dispatch, or appointment-based local services.",
    definition:
      "Field service and operations software helps construction contractors, trades businesses, and appointment-led local services schedule crews, manage jobs, quote and invoice in the field, and run client booking workflows. The right tool matches the primary job — not a single list that ranks Contractor Foreman against ServiceM8 or Shore as if they were the same purchase. Generic finder tooling is deferred in favor of vertical-specific industry pages.",
    iconSlug: "field-service-operations",
    decisionCriteria: [
      "Primary field job fit",
      "Construction vs trades vs appointments",
      "Crew dispatch complexity",
      "Job costing depth",
      "Mobile / offline requirements",
      "Total cost (users + jobs)",
    ],
    popularNeeds: [
      "Construction job management",
      "Trades dispatch & scheduling",
      "Quotes & invoicing",
      "Appointment booking",
      "Crew mobile apps",
      "Client management",
    ],
    chooseGuideHref: "/guides/how-to-choose-field-service-operations-software/",
    glance: {
      whatItDoes: [
        "Schedules crews, routes, and site visits",
        "Manages construction jobs and change orders",
        "Dispatches trades jobs with mobile workflows",
        "Books appointments and sends reminders",
        "Quotes and invoices from the field",
        "Tracks clients and job history",
      ],
      bestFor: [
        "General contractors managing job costing",
        "Trades businesses dispatching field crews",
        "Salons, clinics, and local services with booking",
        "Owners replacing spreadsheets and whiteboards",
      ],
      typicalFeatures: [
        "Job scheduling",
        "Crew dispatch",
        "Job costing",
        "Quotes & invoicing",
        "Appointment booking",
        "Mobile field app",
      ],
    },
    types: [
      {
        id: "construction",
        name: "Construction management",
        description: "Job costing, schedules, and contractor workflows.",
        icon: "hard-hat",
        href: "/use-cases/construction-management/",
        ctaLabel: "Explore construction tools →",
      },
      {
        id: "trades-fsm",
        name: "Trades field service",
        description: "Dispatch, quotes, and mobile jobs for trades crews.",
        icon: "truck",
        href: "/use-cases/trades-field-service/",
        ctaLabel: "Explore trades FSM tools →",
      },
      {
        id: "appointments",
        name: "Appointment scheduling",
        description: "Booking, reminders, and local business management.",
        icon: "calendar",
        href: "/use-cases/appointment-scheduling/",
        ctaLabel: "Explore scheduling tools →",
      },
    ],
    tools: [],
    bestPageHref: "/best/field-service-operations-software/",
    guides: [
      {
        slug: "what-is-field-service-operations-software",
        title: "What is field service & operations software?",
        href: "/guides/what-is-field-service-operations-software/",
      },
      {
        slug: "how-to-choose-field-service-operations-software",
        title: "How to choose field service software",
        href: "/guides/how-to-choose-field-service-operations-software/",
      },
      {
        slug: "field-service-operations-pricing-guide",
        title: "Field service software pricing guide",
        href: "/guides/field-service-operations-pricing-guide/",
      },
      {
        slug: "field-service-operations-vs-project-management-software",
        title: "Field service vs project management software",
        href: "/guides/field-service-operations-vs-project-management-software/",
      },
    ],
  });
}
