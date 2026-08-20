import { IndustryHubProfileSchema, type IndustryHubProfile } from "@/domain";
import { COMPANY_ROUTES } from "@/services/site-foundation";

/**
 * Financial services industry hub presentation profile.
 * Educational / decision-framework content only — product claims come from
 * the CRM catalogue and enrichment at build time.
 */
export function buildFinancialServicesIndustryHubProfile(): IndustryHubProfile {
  return IndustryHubProfileSchema.parse({
    industrySlug: "financial-services",
    displayTitle: "CRM software for Financial services",
    badgeLabel: "Financial services",
    tagline:
      "Compare CRM platforms for financial-services teams based on the capabilities that matter to your workflow, client relationships and sales process.",
    overview:
      "CRM requirements vary considerably between financial institutions. Evaluate workflow fit, relationship context, and administration needs — not popularity alone.",
    whatMattersIntro:
      "CRM requirements vary considerably between financial institutions. Buyers should evaluate workflow requirements rather than simply choosing the most popular CRM.",
    glance: {
      primaryGoal: "Manage client relationships and opportunities",
      commonPriorities: [
        "Pipeline",
        "Automation",
        "Reporting",
        "Integrations",
        "Security",
      ],
      teamTypes: ["Advisory", "Sales", "Relationship management"],
    },
    priorities: [
      {
        id: "client-relationships",
        title: "Client relationship management",
        description:
          "Maintain account and contact history with relationship context over time.",
        icon: "users",
        capabilitySlug: "contact-management",
      },
      {
        id: "pipeline",
        title: "Pipeline & opportunity management",
        description:
          "Track opportunities, stages, ownership, and next actions clearly.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "automation",
        title: "Workflow automation",
        description:
          "Reduce repetitive administrative work and standardize processes.",
        icon: "zap",
        capabilitySlug: "workflow-automation",
      },
      {
        id: "reporting",
        title: "Reporting & forecasting",
        description:
          "Understand pipeline health, activity, and expected outcomes.",
        icon: "chart",
        capabilitySlug: "reporting",
      },
      {
        id: "integrations",
        title: "Integrations",
        description:
          "Connect CRM with the rest of the organization’s software stack.",
        icon: "puzzle",
        capabilitySlug: "integrations",
      },
      {
        id: "security",
        title: "Security & administration",
        description:
          "Evaluate permissions, controls, and administration requirements.",
        icon: "shield",
        capabilitySlug: "security-administration",
      },
    ],
    useCases: [
      {
        id: "advisory",
        title: "Financial advisory / relationship management",
        bestWhen:
          "Client relationships and ongoing account context are central.",
        icon: "handshake",
        useCaseSlug: "advisory-relationship-management",
      },
      {
        id: "b2b-sales",
        title: "B2B financial services sales",
        bestWhen: "Opportunity pipelines and sales activity are central.",
        icon: "funnel",
        useCaseSlug: "pipeline-led-sales",
      },
      {
        id: "high-volume",
        title: "High-volume lead management",
        bestWhen:
          "Teams handle large numbers of inbound or outbound prospects.",
        icon: "users",
        useCaseSlug: "high-volume-lead-management",
      },
      {
        id: "complex",
        title: "Complex sales processes",
        bestWhen:
          "Multiple stages, stakeholders, and approvals are involved.",
        icon: "layers",
        useCaseSlug: "complex-sales-processes",
      },
      {
        id: "growing",
        title: "Growing financial-services team",
        bestWhen:
          "Ease of adoption and scalable processes are priorities.",
        icon: "trending",
        useCaseSlug: "growing-teams",
      },
    ],
    snapshotFeatureSlugs: [
      "pipeline-management",
      "workflow-automation",
      "reporting",
      "integrations",
    ],
    capabilityGroups: [
      {
        id: "customer",
        title: "Customer & relationship management",
        featureSlugs: [
          "contact-management",
          "lead-management",
          "email-sync",
          "custom-fields",
        ],
      },
      {
        id: "sales",
        title: "Sales workflow",
        featureSlugs: [
          "pipeline-management",
          "deal-management",
          "workflow-automation",
          "sales-automation",
        ],
      },
      {
        id: "communication",
        title: "Communication",
        featureSlugs: [
          "email-sync",
          "email-sequences",
          "email-tracking",
          "call-functionality",
        ],
      },
      {
        id: "reporting",
        title: "Reporting",
        featureSlugs: ["reporting", "forecasting", "analytics"],
      },
      {
        id: "platform",
        title: "Platform",
        featureSlugs: [
          "integrations",
          "custom-fields",
          "custom-pipelines",
          "mobile-app",
        ],
      },
    ],
    implementationConsiderations: [
      {
        id: "migration",
        title: "Data migration",
        description:
          "What customer and account information needs to move into the new CRM?",
        icon: "database",
      },
      {
        id: "integrations",
        title: "Integrations",
        description:
          "Which systems must connect to the CRM for day-to-day work?",
        icon: "puzzle",
      },
      {
        id: "adoption",
        title: "User adoption",
        description:
          "How will teams actually use the CRM in their daily workflows?",
        icon: "users",
      },
      {
        id: "admin",
        title: "Administration",
        description:
          "Who owns configuration, permissions, and ongoing data quality?",
        icon: "settings",
      },
    ],
    evaluationQuestions: [
      {
        question:
          "How does your CRM manage account and contact relationships?",
      },
      {
        question: "What permission and access-control options are available?",
      },
      {
        question:
          "What reporting and forecasting capabilities are included?",
      },
      {
        question:
          "Which integrations are available for our existing stack?",
      },
      {
        question: "How is customer data exported or migrated?",
      },
      {
        question: "What administration is required as the team grows?",
      },
      {
        question: "What does implementation typically involve?",
      },
      {
        question: "What functionality requires higher-priced plans?",
      },
    ],
    securityDimensions: [
      {
        id: "access",
        title: "Data access controls",
        description: "Who can see and change client and opportunity records.",
        requirementSlug: "restrict-access-by-team",
      },
      {
        id: "permissions",
        title: "User permissions",
        description: "Role-based permissions and admin boundaries.",
        requirementSlug: "restrict-access-by-team",
      },
      {
        id: "audit",
        title: "Auditability",
        description: "Visibility into changes and access over time.",
        requirementSlug: "audit-user-activity",
      },
      {
        id: "retention",
        title: "Data retention & export",
        description: "How data is retained, exported, and deleted.",
        requirementSlug: "retain-and-export-data",
      },
      {
        id: "sso",
        title: "Identity / SSO",
        description: "How users authenticate into the platform.",
        requirementSlug: "support-sso",
      },
      {
        id: "integration-security",
        title: "Integration security",
        description: "How connected systems exchange data safely.",
        requirementSlug: "manage-integrations",
      },
      {
        id: "residency",
        title: "Data residency",
        description: "Where customer data is stored and processed.",
        requirementSlug: "control-data-residency",
      },
      {
        id: "vendor-docs",
        title: "Vendor security documentation",
        description: "What the vendor publishes for security review.",
        requirementSlug: "review-vendor-security-docs",
      },
    ],
    securityDisclaimer:
      "Requirements vary by organization, jurisdiction and regulatory environment. Verify regulatory and security requirements directly with shortlisted vendors using trust centers, certification documents, and security documentation — not marketing videos. This section is educational and is not legal advice.",
    buyingFramework: [
      {
        step: 1,
        title: "Define your workflow",
        description:
          "Map how advisory, sales, or relationship teams actually work today.",
        href: "/industries/financial-services/use-cases/advisory-relationship-management/",
        ctaLabel: "Explore advisory use case",
      },
      {
        step: 2,
        title: "Identify must-have capabilities",
        description:
          "Focus on relationship context, pipeline, automation, and reporting needs.",
        href: "/industries/financial-services/capabilities/pipeline-management/",
        ctaLabel: "Explore pipeline capability",
      },
      {
        step: 3,
        title: "Check integrations and administration",
        description:
          "Confirm stack connections, permissions, and ownership before you buy.",
        href: "/industries/financial-services/capabilities/workflow-automation/",
        ctaLabel: "Explore automation capability",
      },
      {
        step: 4,
        title: "Compare total cost",
        description:
          "Estimate seats, plan tiers, and add-ons with researched list prices.",
        href: "/tools/crm-cost-calculator/",
        ctaLabel: "CRM Cost Calculator",
      },
      {
        step: 5,
        title: "Test shortlisted products",
        description:
          "Trial the shortlist with real workflows before committing.",
        href: "/tools/crm-finder/",
        ctaLabel: "Start CRM Finder",
      },
    ],
    buyingGuideHref: "/guides/how-to-choose-crm/",
    faq: [
      {
        question: "What is CRM software for financial services?",
        answer:
          "CRM software helps financial-services teams manage client and prospect relationships, opportunities, activities, and follow-ups in one place. The right fit depends on workflow — advisory relationships, sales pipelines, or high-volume lead handling — not a single industry label.",
      },
      {
        question:
          "What should financial-services teams look for in a CRM?",
        answer:
          "Start with relationship context, pipeline visibility, automation for repetitive work, reporting, integrations with your stack, and administration controls. Security and governance needs vary by organization — verify requirements with vendors.",
      },
      {
        question: "How much does CRM software cost?",
        answer:
          "CRM pricing usually depends on seats, plan tiers, and add-ons. Use the CRM Cost Calculator for researched list-price estimates. We do not invent market averages.",
      },
      {
        question:
          "Can CRM software integrate with existing financial systems?",
        answer:
          "Many CRM platforms offer native connectors, APIs, or third-party integrations. Confirm the specific systems you need with shortlisted vendors — integration depth varies by product and plan.",
      },
      {
        question: "How should I compare CRM platforms?",
        answer:
          "Compare on shared capabilities that match your workflow, then check pricing, administration, and implementation effort. Use side-by-side comparisons and CRM Finder for a structured shortlist.",
      },
      {
        question:
          "Is there one best CRM for every financial-services company?",
        answer:
          "No. Needs differ across advisory, sales, and operations teams. Industry-specific rankings publish only when dedicated research supports them — until then, compare using broader CRM research.",
      },
      {
        question: "How does SoftwareGlimpse evaluate CRM software?",
        answer:
          "We tie capabilities and pricing to recorded evidence, compare products with consistent category criteria, and keep affiliate relationships from determining rankings or recommendations.",
      },
    ],
    relatedIndustrySlugs: [
      "real-estate",
      "healthcare",
      "retail-ecommerce",
      "small-business",
      "legal-services",
      "saas",
    ],
    featuredComparisonSlugs: [
      "freshsales-vs-pipedrive",
      "capsule-vs-close",
      "close-vs-freshsales",
      "hubspot-vs-pipedrive",
      "close-vs-hubspot",
      "close-vs-pipedrive",
    ],
    featuredGuideHrefs: [
      "/guides/financial-services-crm/",
      "/guides/financial-services-crm-requirements/",
      "/guides/financial-services-crm-features/",
      "/guides/financial-services-crm-implementation/",
      "/guides/financial-services-crm-security/",
      "/guides/financial-services-crm-migration/",
      "/guides/financial-services-crm-checklist/",
      "/guides/how-to-choose-crm/",
    ],
    finderHref: "/tools/crm-finder/",
    calculatorHref: "/tools/crm-cost-calculator/",
    compareHref: "/compare/",
    catalogueHref: "/categories/crm/",
    methodologyHref: COMPANY_ROUTES.methodology,
    categorySlug: "crm",
  });
}
