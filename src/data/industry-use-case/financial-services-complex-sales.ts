import {
  IndustryUseCaseProfileSchema,
  type IndustryUseCaseProfile,
} from "@/domain";
import { COMPANY_ROUTES } from "@/services/site-foundation";

/**
 * Financial services × complex sales processes.
 * Prioritizes pipeline depth, automation, customization — materially different
 * from advisory/relationship management.
 */
export function buildFinancialServicesComplexSalesUseCaseProfile(): IndustryUseCaseProfile {
  return IndustryUseCaseProfileSchema.parse({
    industrySlug: "financial-services",
    useCaseSlug: "complex-sales-processes",
    hubUseCaseId: "complex",
    displayName: "Complex sales processes",
    displayTitle: "CRM for Complex Sales Processes",
    eyebrow: "Financial services CRM use case",
    tagline:
      "Compare CRM platforms for multi-stage financial-services sales involving multiple stakeholders, approvals, and process customization.",
    decisionNuance:
      "There is no universal winner. Teams that need deep customization and multi-pipeline control often shortlist different products than teams optimizing for speed of adoption on a single sales motion.",
    glance: {
      typicalObjective:
        "Run multi-stage opportunities with clear ownership, approvals, and visibility",
      teamTypes: ["B2B sales", "Deal desks", "Sales operations"],
      topPriorityLabels: [
        "Custom stages",
        "Multiple pipelines",
        "Automation",
        "Forecasting",
      ],
    },
    catalogueUseCaseSlugs: [
      "pipeline-management",
      "sales-automation",
      "sales-engagement",
    ],
    finderUseCaseSlug: "pipeline-management",
    capabilities: [
      {
        capabilitySlug: "pipeline-management",
        name: "Pipeline management",
        description:
          "Configure stages, ownership, and multi-step opportunity workflows.",
        importance: "critical",
        weight: 100,
        icon: "funnel",
        criterionSlug: "pipeline-management",
        href: "/industries/financial-services/capabilities/pipeline-management/",
      },
      {
        capabilitySlug: "workflow-automation",
        name: "Workflow automation",
        description:
          "Trigger tasks and process steps as opportunities advance.",
        importance: "critical",
        weight: 90,
        icon: "zap",
        criterionSlug: "sales-automation",
        href: "/industries/financial-services/capabilities/workflow-automation/",
      },
      {
        capabilitySlug: "custom-pipelines",
        name: "Customization",
        description:
          "Support distinct processes, fields, and pipeline models.",
        importance: "high",
        weight: 85,
        icon: "settings",
        criterionSlug: "customization",
        href: "/industries/financial-services/capabilities/pipeline-management/",
      },
      {
        capabilitySlug: "forecasting",
        name: "Reporting & forecasting",
        description:
          "Forecast and report across complex opportunity structures.",
        importance: "high",
        weight: 80,
        icon: "chart",
        criterionSlug: "reporting",
        href: "/industries/financial-services/#capabilities",
      },
      {
        capabilitySlug: "integrations",
        name: "Integrations",
        description:
          "Connect CRM to sales, finance, and operational systems.",
        importance: "high",
        weight: 70,
        icon: "puzzle",
        criterionSlug: "integrations",
        href: "/industries/financial-services/#capabilities",
      },
      {
        capabilitySlug: "contact-management",
        name: "Client relationship management",
        description:
          "Keep stakeholder and account context alongside opportunities.",
        importance: "important",
        weight: 55,
        icon: "users",
        criterionSlug: "ease-of-use",
        href: "/industries/financial-services/#what-matters",
      },
    ],
    requirements: [
      {
        id: "stages",
        name: "Custom opportunity stages",
        description: "Model real multi-stage sales processes.",
        capabilitySlug: "pipeline-management",
        priority: "must-have",
        featureSlug: "custom-pipelines",
      },
      {
        id: "multiple-pipelines",
        name: "Multiple pipelines",
        description: "Run distinct sales motions when needed.",
        capabilitySlug: "pipeline-management",
        priority: "must-have",
        featureSlug: "custom-pipelines",
        requirementSlug: "separate-sales-processes",
        href: "/requirements/separate-sales-processes/",
      },
      {
        id: "ownership",
        name: "Deal ownership and handoffs",
        description: "Assign clear owners across stakeholders.",
        capabilitySlug: "pipeline-management",
        priority: "must-have",
        featureSlug: "deal-management",
      },
      {
        id: "automation",
        name: "Stage-based automation",
        description: "Trigger tasks and updates as deals progress.",
        capabilitySlug: "workflow-automation",
        priority: "must-have",
        featureSlug: "workflow-automation",
        requirementSlug: "automate-lead-follow-up",
        href: "/requirements/automate-lead-follow-up/",
      },
      {
        id: "sales-automation",
        name: "Sales automation",
        description: "Support broader sales process automation.",
        capabilitySlug: "workflow-automation",
        priority: "important",
        featureSlug: "sales-automation",
      },
      {
        id: "forecasting",
        name: "Forecasting",
        description: "Use pipeline data for management forecasts.",
        capabilitySlug: "forecasting",
        priority: "important",
        featureSlug: "forecasting",
      },
      {
        id: "reporting",
        name: "Custom reporting",
        description: "Report across pipelines, stages, and teams.",
        capabilitySlug: "forecasting",
        priority: "important",
        featureSlug: "reporting",
      },
      {
        id: "custom-fields",
        name: "Custom fields",
        description: "Capture process-specific opportunity data.",
        capabilitySlug: "custom-pipelines",
        priority: "important",
        featureSlug: "custom-fields",
      },
      {
        id: "integrations",
        name: "Integrations",
        description: "Connect CRM to the wider sales and ops stack.",
        capabilitySlug: "integrations",
        priority: "advanced",
        featureSlug: "integrations",
      },
      {
        id: "lead-management",
        name: "Lead management",
        description: "Bring inbound/outbound leads into the process.",
        capabilitySlug: "pipeline-management",
        priority: "advanced",
        featureSlug: "lead-management",
      },
    ],
    summarySlots: [
      {
        id: "overall",
        label: "Best overall fit",
        selection: "best-overall-fit",
        focusCapabilitySlugs: [
          "pipeline-management",
          "workflow-automation",
          "custom-pipelines",
        ],
      },
      {
        id: "simplicity",
        label: "Best for simpler complex sales",
        selection: "best-simplicity",
        focusCapabilitySlugs: ["pipeline-management", "workflow-automation"],
      },
      {
        id: "complex",
        label: "Best for complex customization",
        selection: "best-complex",
        focusCapabilitySlugs: [
          "pipeline-management",
          "custom-pipelines",
          "integrations",
        ],
      },
      {
        id: "small",
        label: "Best for focused sales teams",
        selection: "best-small-team",
        focusCapabilitySlugs: ["pipeline-management", "workflow-automation"],
      },
      {
        id: "value",
        label: "Best value",
        selection: "best-value",
        focusCapabilitySlugs: ["pipeline-management", "sales-automation"],
      },
    ],
    scenarios: [
      {
        id: "multi-stage",
        title: "Multi-stage B2B sales",
        description:
          "Long cycles with multiple stakeholders and explicit stage discipline.",
        priorities: ["Custom stages", "Ownership", "Visibility"],
        focusCapabilitySlugs: ["pipeline-management", "forecasting"],
        icon: "funnel",
      },
      {
        id: "multi-pipeline",
        title: "Multiple sales motions",
        description:
          "Distinct pipelines for different products, segments, or regions.",
        priorities: ["Multiple pipelines", "Customization", "Reporting"],
        focusCapabilitySlugs: ["custom-pipelines", "reporting"],
        icon: "layers",
      },
      {
        id: "automation-heavy",
        title: "Automation-heavy sales ops",
        description:
          "Sales operations teams that standardize handoffs with automation.",
        priorities: ["Automation", "Integrations", "Administration"],
        focusCapabilitySlugs: ["workflow-automation", "integrations"],
        icon: "zap",
      },
    ],
    tradeoffs: [
      {
        id: "depth",
        title: "Process depth vs adoption speed",
        description:
          "Deeper process control can slow initial adoption if configuration is heavy.",
        icon: "settings",
      },
      {
        id: "automation",
        title: "Automation vs control",
        description:
          "More automation improves consistency but needs careful ownership of rules.",
        icon: "zap",
      },
      {
        id: "plan",
        title: "Capability vs plan tier",
        description:
          "Multiple pipelines, forecasting, and advanced automation are often plan-gated.",
        icon: "chart",
      },
      {
        id: "suite",
        title: "Focused CRM vs platform suite",
        description:
          "Platforms may offer more customization while focused CRMs can be faster to operationalize.",
        icon: "layers",
      },
    ],
    implementation: [
      {
        id: "stages",
        title: "Design stages first",
        description:
          "Document stages, exit criteria, and approvals before configuring software.",
        icon: "funnel",
      },
      {
        id: "pipelines",
        title: "Decide pipeline count",
        description:
          "Only create multiple pipelines when processes truly differ.",
        icon: "layers",
      },
      {
        id: "ownership",
        title: "Ownership & handoffs",
        description: "Define who owns deals at each stage and after handoff.",
        icon: "users",
      },
      {
        id: "automation",
        title: "Automate after process clarity",
        description: "Automate stage actions once the process is stable.",
        icon: "zap",
      },
      {
        id: "forecast",
        title: "Forecast definitions",
        description: "Align on forecast categories and reporting cadence.",
        icon: "chart",
      },
      {
        id: "integrations",
        title: "Integration map",
        description: "List systems that must sync opportunities or accounts.",
        icon: "puzzle",
      },
    ],
    vendorQuestions: [
      {
        group: "Pipeline",
        questions: [
          "Can we configure custom stages and exit criteria?",
          "Can different teams use different pipelines?",
          "How do ownership and handoffs work across stakeholders?",
        ],
      },
      {
        group: "Automation",
        questions: [
          "Which stage changes can trigger automations?",
          "Which automation features require higher-tier plans?",
        ],
      },
      {
        group: "Forecasting & reporting",
        questions: [
          "Can forecasts span multiple pipelines?",
          "Can we build custom opportunity reports?",
        ],
      },
      {
        group: "Customization & pricing",
        questions: [
          "What customization is available without professional services?",
          "Which complex-sales capabilities require plan upgrades?",
        ],
      },
    ],
    relatedUseCaseSlugs: [
      "advisory-relationship-management",
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
        question: "What CRM capabilities matter most for complex sales?",
        answer:
          "Custom stages, multiple pipelines where needed, ownership/handoffs, workflow automation, forecasting, and reporting typically matter most — along with enough customization to match the process.",
      },
      {
        question: "Do I need multiple pipelines?",
        answer:
          "Only if distinct sales motions need different stage models. Many teams start with one well-designed pipeline and split later.",
      },
      {
        question: "How is this different from advisory CRM needs?",
        answer:
          "Complex sales pages prioritize pipeline depth, automation, and process customization. Advisory pages prioritize relationship history, permissions, and ongoing client context.",
      },
      {
        question: "Which CRM is best for complex financial-services sales?",
        answer:
          "There is no universal best product. Fit depends on process complexity, customization needs, integrations, administration capacity, and budget.",
      },
      {
        question: "Does advanced pipeline functionality cost more?",
        answer:
          "Often yes — multiple pipelines, forecasting, and automation may sit on higher plans. Verify with researched pricing and the CRM Cost Calculator.",
      },
    ],
    matrixFeatureSlugs: [
      "pipeline-management",
      "custom-pipelines",
      "deal-management",
      "lead-management",
      "workflow-automation",
      "sales-automation",
      "forecasting",
      "reporting",
      "custom-fields",
      "integrations",
    ],
    screenshotMatchTerms: [
      "pipeline",
      "automation",
      "forecast",
      "deal",
      "workflow",
    ],
    finderHref: "/tools/crm-finder/",
    calculatorHref: "/tools/crm-cost-calculator/",
    compareHref: "/compare/",
    methodologyHref: COMPANY_ROUTES.methodology,
    categorySlug: "crm",
  });
}
