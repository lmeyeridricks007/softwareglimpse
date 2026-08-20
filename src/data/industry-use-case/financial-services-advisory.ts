import {
  IndustryUseCaseProfileSchema,
  type IndustryUseCaseProfile,
} from "@/domain";
import { COMPANY_ROUTES } from "@/services/site-foundation";

/**
 * Financial services × advisory / relationship management.
 * Prioritizes relationships + security over pure sales automation.
 */
export function buildFinancialServicesAdvisoryUseCaseProfile(): IndustryUseCaseProfile {
  return IndustryUseCaseProfileSchema.parse({
    industrySlug: "financial-services",
    useCaseSlug: "advisory-relationship-management",
    hubUseCaseId: "advisory",
    displayName: "Advisory & relationship management",
    displayTitle: "CRM for Advisory & Relationship Management",
    eyebrow: "Financial services CRM use case",
    tagline:
      "Compare CRM platforms based on the capabilities and requirements that matter for relationship-focused financial-services teams.",
    decisionNuance:
      "There is no universal winner. Teams prioritizing simple relationship tracking often reach a different conclusion from organizations that need deeper customization, permissions, and multi-stage opportunity control.",
    glance: {
      typicalObjective:
        "Manage long-term client relationships and opportunities",
      teamTypes: ["Advisors", "Relationship managers", "Client service"],
      topPriorityLabels: [
        "Relationship history",
        "Follow-ups",
        "Permissions",
        "Reporting",
      ],
    },
    catalogueUseCaseSlugs: [
      "relationship-management",
      "contact-management",
      "pipeline-management",
    ],
    finderUseCaseSlug: "contact-management",
    capabilities: [
      {
        capabilitySlug: "contact-management",
        name: "Client relationship management",
        description:
          "Maintain client and contact history with ongoing relationship context.",
        importance: "critical",
        weight: 100,
        icon: "users",
        criterionSlug: "ease-of-use",
        href: "/industries/financial-services/#what-matters",
      },
      {
        capabilitySlug: "custom-fields",
        name: "Security & administration",
        description:
          "Control access to client information and administer CRM configuration.",
        importance: "critical",
        weight: 95,
        icon: "shield",
        criterionSlug: "administration-overhead",
        href: "/industries/financial-services/#security",
      },
      {
        capabilitySlug: "pipeline-management",
        name: "Pipeline management",
        description:
          "Track opportunities with clear ownership and next actions.",
        importance: "high",
        weight: 80,
        icon: "funnel",
        criterionSlug: "pipeline-management",
        href: "/industries/financial-services/capabilities/pipeline-management/",
      },
      {
        capabilitySlug: "reporting",
        name: "Reporting & forecasting",
        description:
          "Visibility into relationships, opportunities, and activity.",
        importance: "high",
        weight: 75,
        icon: "chart",
        criterionSlug: "reporting",
        href: "/industries/financial-services/#capabilities",
      },
      {
        capabilitySlug: "workflow-automation",
        name: "Workflow automation",
        description:
          "Automate repeatable follow-up and administrative workflows.",
        importance: "important",
        weight: 55,
        icon: "zap",
        criterionSlug: "sales-automation",
        href: "/industries/financial-services/capabilities/workflow-automation/",
      },
      {
        capabilitySlug: "integrations",
        name: "Integrations",
        description:
          "Connect CRM workflows with relevant business systems.",
        importance: "important",
        weight: 50,
        icon: "puzzle",
        criterionSlug: "integrations",
        href: "/industries/financial-services/#capabilities",
      },
    ],
    requirements: [
      {
        id: "contacts",
        name: "Contact and account records",
        description: "Store clients, contacts, and related account context.",
        capabilitySlug: "contact-management",
        priority: "must-have",
        featureSlug: "contact-management",
      },
      {
        id: "history",
        name: "Interaction history",
        description: "Keep notes, activities, and touchpoints on the record.",
        capabilitySlug: "contact-management",
        priority: "must-have",
        featureSlug: "email-sync",
      },
      {
        id: "custom-fields",
        name: "Custom fields",
        description: "Capture advisory-specific client attributes.",
        capabilitySlug: "contact-management",
        priority: "must-have",
        featureSlug: "custom-fields",
      },
      {
        id: "opportunities",
        name: "Opportunity tracking",
        description: "Track relationship-driven opportunities through stages.",
        capabilitySlug: "pipeline-management",
        priority: "must-have",
        featureSlug: "pipeline-management",
      },
      {
        id: "ownership",
        name: "Clear ownership",
        description: "Assign responsibility for clients and opportunities.",
        capabilitySlug: "pipeline-management",
        priority: "must-have",
        featureSlug: "deal-management",
      },
      {
        id: "follow-ups",
        name: "Follow-up activities",
        description: "Make next actions visible on every relationship.",
        capabilitySlug: "pipeline-management",
        priority: "must-have",
        featureSlug: "pipeline-management",
      },
      {
        id: "stages",
        name: "Configurable stages",
        description: "Adapt stages to advisory or relationship workflows.",
        capabilitySlug: "pipeline-management",
        priority: "important",
        featureSlug: "custom-pipelines",
        requirementSlug: "separate-sales-processes",
        href: "/requirements/separate-sales-processes/",
      },
      {
        id: "reporting",
        name: "Activity and pipeline reporting",
        description: "Report on relationships, activity, and opportunities.",
        capabilitySlug: "reporting",
        priority: "important",
        featureSlug: "reporting",
      },
      {
        id: "automation",
        name: "Workflow automation",
        description: "Automate reminders and handoffs where helpful.",
        capabilitySlug: "workflow-automation",
        priority: "advanced",
        featureSlug: "workflow-automation",
        requirementSlug: "automate-lead-follow-up",
        href: "/requirements/automate-lead-follow-up/",
      },
      {
        id: "integrations",
        name: "Integrations",
        description: "Connect to tools advisors already use.",
        capabilitySlug: "integrations",
        priority: "advanced",
        featureSlug: "integrations",
      },
    ],
    summarySlots: [
      {
        id: "overall",
        label: "Best overall fit",
        selection: "best-overall-fit",
        focusCapabilitySlugs: [
          "contact-management",
          "pipeline-management",
          "reporting",
        ],
      },
      {
        id: "simplicity",
        label: "Best for simplicity",
        selection: "best-simplicity",
        focusCapabilitySlugs: ["contact-management", "pipeline-management"],
      },
      {
        id: "complex",
        label: "Best for complex needs",
        selection: "best-complex",
        focusCapabilitySlugs: [
          "custom-fields",
          "pipeline-management",
          "integrations",
        ],
      },
      {
        id: "small",
        label: "Best for small teams",
        selection: "best-small-team",
        focusCapabilitySlugs: ["contact-management", "pipeline-management"],
      },
      {
        id: "value",
        label: "Best value",
        selection: "best-value",
        focusCapabilitySlugs: ["pipeline-management", "workflow-automation"],
      },
    ],
    scenarios: [
      {
        id: "small-advisory",
        title: "Small advisory team",
        description:
          "Straightforward relationship tracking, pipeline, and lower administration.",
        priorities: ["Simple setup", "Relationship tracking", "Lower admin"],
        focusCapabilitySlugs: ["contact-management", "pipeline-management"],
        icon: "users",
      },
      {
        id: "growing",
        title: "Growing advisory business",
        description:
          "Needs automation, reporting, and scalable processes as the team expands.",
        priorities: ["Automation", "Reporting", "Scalability"],
        focusCapabilitySlugs: [
          "workflow-automation",
          "reporting",
          "integrations",
        ],
        icon: "trending",
      },
      {
        id: "complex-org",
        title: "Complex advisory organization",
        description:
          "Customization, permissions, multiple processes, and deeper reporting.",
        priorities: ["Customization", "Permissions", "Reporting"],
        focusCapabilitySlugs: [
          "pipeline-management",
          "reporting",
          "integrations",
        ],
        icon: "layers",
      },
    ],
    tradeoffs: [
      {
        id: "simplicity",
        title: "Simplicity vs flexibility",
        description:
          "A simpler CRM can reduce administration but may provide less flexibility for complex relationship processes.",
        icon: "settings",
      },
      {
        id: "price",
        title: "Price vs depth",
        description:
          "Lower-cost products may satisfy core relationship needs while advanced capabilities can require higher plans.",
        icon: "chart",
      },
      {
        id: "sales-vs-relationship",
        title: "Sales CRM vs relationship CRM",
        description:
          "Some products emphasize opportunity execution; others emphasize broader relationship and process depth.",
        icon: "handshake",
      },
      {
        id: "config",
        title: "Configuration vs out-of-the-box",
        description:
          "Highly configurable systems can support more complex workflows but usually require more setup.",
        icon: "puzzle",
      },
    ],
    implementation: [
      {
        id: "data-model",
        title: "Client data model",
        description:
          "Define client, contact, household/company, opportunity, and relationship records.",
        icon: "database",
      },
      {
        id: "process",
        title: "Process",
        description: "Map the actual relationship and opportunity lifecycle.",
        icon: "funnel",
      },
      {
        id: "ownership",
        title: "Ownership",
        description: "Decide who owns clients, opportunities, and handoffs.",
        icon: "users",
      },
      {
        id: "security",
        title: "Security",
        description: "Define roles and information-access requirements.",
        icon: "shield",
      },
      {
        id: "reporting",
        title: "Reporting",
        description:
          "Agree what advisors, managers, and leadership need to see.",
        icon: "chart",
      },
      {
        id: "integrations",
        title: "Integrations",
        description: "Identify systems that must exchange data with CRM.",
        icon: "puzzle",
      },
    ],
    vendorQuestions: [
      {
        group: "Relationship management",
        questions: [
          "How are contacts, accounts, and relationships modeled?",
          "Can we customize client fields for advisory workflows?",
        ],
      },
      {
        group: "Pipeline",
        questions: [
          "Can we configure our own stages?",
          "Can teams use different pipelines when needed?",
        ],
      },
      {
        group: "Security",
        questions: [
          "How granular are permissions?",
          "What audit capabilities exist?",
        ],
      },
      {
        group: "Automation & reporting",
        questions: [
          "Which follow-up workflows can be automated?",
          "Can we build reports spanning relationships and opportunities?",
        ],
      },
      {
        group: "Pricing",
        questions: [
          "Which capabilities require plan upgrades?",
          "Are there implementation or onboarding costs?",
        ],
      },
    ],
    relatedUseCaseSlugs: [
      "complex-sales-processes",
      "b2b-sales",
      "high-volume-lead-management",
    ],
    relatedCapabilitySlugs: [
      "pipeline-management",
      "workflow-automation",
      "reporting",
    ],
    faq: [
      {
        question: "What is the best CRM for financial advisory teams?",
        answer:
          "There is no universal best product. Fit depends on relationship-tracking needs, process complexity, permissions, integrations, and budget. Use the short answer and scenarios on this page as a starting point, then personalize with CRM Finder.",
      },
      {
        question:
          "What CRM capabilities matter most for relationship management?",
        answer:
          "Client/contact records, interaction history, opportunity ownership, follow-ups, reporting, and appropriate access controls typically matter most for advisory teams.",
      },
      {
        question:
          "Do financial-services teams need industry-specific CRM software?",
        answer:
          "Not always. Many teams succeed with general CRM when it supports their relationship and opportunity workflows. Verify security, administration, and integration needs with shortlisted vendors.",
      },
      {
        question:
          "How important is pipeline management for advisory teams?",
        answer:
          "Often high — even relationship-led teams track opportunities and next actions. Exact importance depends on how sales-oriented the advisory process is.",
      },
      {
        question: "How much does CRM software cost for an advisory team?",
        answer:
          "Costs usually depend on seats, plan tiers, and add-ons. Use the CRM Cost Calculator for researched list-price estimates for your team size.",
      },
    ],
    matrixFeatureSlugs: [
      "contact-management",
      "email-sync",
      "custom-fields",
      "pipeline-management",
      "deal-management",
      "custom-pipelines",
      "workflow-automation",
      "reporting",
      "integrations",
    ],
    screenshotMatchTerms: [
      "contact",
      "pipeline",
      "deal",
      "relationship",
      "activity",
    ],
    finderHref: "/tools/crm-finder/",
    calculatorHref: "/tools/crm-cost-calculator/",
    compareHref: "/compare/",
    methodologyHref: COMPANY_ROUTES.methodology,
    categorySlug: "crm",
  });
}
