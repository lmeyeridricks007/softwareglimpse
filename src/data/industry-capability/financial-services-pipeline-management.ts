import {
  IndustryCapabilityProfileSchema,
  type IndustryCapabilityProfile,
} from "@/domain";
import { COMPANY_ROUTES } from "@/services/site-foundation";

/**
 * Financial services × pipeline management capability profile.
 * Editorial/decision framework only — product evidence comes from enrichment.
 */
export function buildFinancialServicesPipelineManagementProfile(): IndustryCapabilityProfile {
  return IndustryCapabilityProfileSchema.parse({
    industrySlug: "financial-services",
    capabilitySlug: "pipeline-management",
    displayName: "Pipeline management",
    displayTitle: "Pipeline Management for Financial Services",
    eyebrow: "Financial services CRM capability",
    tagline:
      "Evaluate CRM platforms based on how well they support opportunity stages, ownership, follow-ups, visibility and workflow requirements for financial-services teams.",
    whyItMatters: [
      "Financial-services teams often manage multi-stage opportunities that involve advisors, sales, relationship managers, and other stakeholders. A clear pipeline keeps ownership and next actions visible as opportunities progress.",
      "Without structured stages and follow-up discipline, opportunities stall, handoffs break down, and managers lose visibility into pipeline health. CRM pipeline management is the operational layer that makes those workflows consistent.",
      "The right pipeline setup reflects how your organization actually sells and advises — not a generic stage template. Compare products on stage flexibility, ownership, activities, visibility, and reporting before you commit.",
    ],
    weakProcessRisks: [
      "Unclear ownership",
      "Missed follow-ups",
      "Poor visibility",
      "Inconsistent process",
    ],
    glance: {
      importanceLabel: "High",
      coreObjective:
        "Track client opportunities through structured workflows",
      importantRequirementLabels: [
        "Stages",
        "Ownership",
        "Follow-ups",
        "Visibility",
      ],
    },
    evaluationDimensions: [
      "Opportunity stages",
      "Custom pipelines",
      "Deal ownership",
      "Follow-up activities",
      "Pipeline visibility",
      "Forecasting signals",
      "Workflow automation",
    ],
    requirements: [
      {
        id: "custom-stages",
        name: "Custom pipeline stages",
        description:
          "Adapt opportunity stages to the real sales or advisory workflow.",
        priority: "core",
        featureSlug: "custom-pipelines",
        icon: "funnel",
      },
      {
        id: "ownership",
        name: "Deal ownership",
        description:
          "Assign clear responsibility so every opportunity has an owner.",
        priority: "core",
        featureSlug: "deal-management",
        icon: "users",
      },
      {
        id: "follow-ups",
        name: "Activity / follow-up tracking",
        description:
          "Keep next actions visible and assigned on every opportunity.",
        priority: "core",
        featureSlug: "pipeline-management",
        icon: "check",
      },
      {
        id: "multiple-pipelines",
        name: "Multiple pipelines",
        description:
          "Support distinct sales or relationship processes where needed.",
        priority: "advanced",
        featureSlug: "custom-pipelines",
        requirementSlug: "separate-sales-processes",
        icon: "layers",
        href: "/requirements/separate-sales-processes/",
      },
      {
        id: "forecasting",
        name: "Forecasting",
        description:
          "Use pipeline data to support management visibility and planning.",
        priority: "advanced",
        featureSlug: "forecasting",
        icon: "chart",
      },
      {
        id: "automation",
        name: "Workflow automation",
        description:
          "Trigger tasks or actions as opportunities move between stages.",
        priority: "advanced",
        featureSlug: "workflow-automation",
        requirementSlug: "automate-lead-follow-up",
        icon: "zap",
        href: "/requirements/automate-lead-follow-up/",
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
    ],
    criterionSlug: "pipeline-management",
    relatedCapabilitySlugs: [
      "workflow-automation",
      "reporting",
      "contact-management",
      "integrations",
      "forecasting",
    ],
    useCaseFits: [
      {
        id: "advisory",
        title: "Advisory / relationship management",
        description:
          "Useful when opportunities sit alongside ongoing client relationships.",
        importanceLabel: "Medium–High",
        icon: "handshake",
        useCaseSlug: "advisory-relationship-management",
        href: "/industries/financial-services/use-cases/advisory-relationship-management/",
      },
      {
        id: "b2b-sales",
        title: "B2B financial services sales",
        description:
          "Central when opportunity stages and sales activity drive revenue.",
        importanceLabel: "High",
        icon: "funnel",
        href: "/industries/financial-services/#use-cases",
      },
      {
        id: "high-volume",
        title: "High-volume lead management",
        description:
          "Helps when large prospect volumes need structured progression.",
        importanceLabel: "High",
        icon: "users",
        href: "/industries/financial-services/#use-cases",
      },
      {
        id: "complex",
        title: "Complex sales processes",
        description:
          "Critical when multiple stages, stakeholders, and approvals are involved.",
        importanceLabel: "Very high",
        icon: "layers",
        useCaseSlug: "complex-sales-processes",
        href: "/industries/financial-services/use-cases/complex-sales-processes/",
      },
      {
        id: "growing",
        title: "Growing teams",
        description:
          "Supports consistent process as more people touch the pipeline.",
        importanceLabel: "High",
        icon: "trending",
        href: "/industries/financial-services/#use-cases",
      },
    ],
    tradeoffs: [
      {
        id: "simplicity",
        title: "Simplicity vs customization",
        description:
          "Highly configurable CRM may support complex processes but require more administration.",
        icon: "settings",
      },
      {
        id: "native",
        title: "Native functionality vs integrations",
        description:
          "Some teams prefer built-in workflow capability; others integrate specialist tools.",
        icon: "puzzle",
      },
      {
        id: "adoption",
        title: "Ease of adoption vs process depth",
        description:
          "Simple pipeline UX can be easier to adopt but may not support complex workflows.",
        icon: "users",
      },
      {
        id: "automation",
        title: "Automation vs control",
        description:
          "More automation can improve consistency but needs careful configuration and ownership.",
        icon: "zap",
      },
    ],
    outcomes: [
      { id: "active", label: "Know which opportunities are active" },
      { id: "owner", label: "Understand who owns each opportunity" },
      { id: "next", label: "See the next action" },
      { id: "stalled", label: "Identify stalled opportunities" },
      { id: "stages", label: "Move deals through consistent stages" },
      { id: "report", label: "Report on pipeline status" },
    ],
    vendorQuestions: [
      "Can we configure pipeline stages ourselves?",
      "Can different teams use different pipelines?",
      "Can ownership rules be configured?",
      "Can workflows trigger activities automatically?",
      "Can we report on pipeline movement?",
      "Can we identify stalled opportunities?",
      "Can permissions differ by team or role?",
      "Can pipeline data be exported?",
      "Which pipeline features require higher-tier plans?",
    ],
    implementation: [
      {
        id: "design",
        title: "Design the process",
        description: "Define stages before configuring software.",
        icon: "funnel",
      },
      {
        id: "ownership",
        title: "Ownership",
        description: "Decide who owns opportunities and handoffs.",
        icon: "users",
      },
      {
        id: "data",
        title: "Data",
        description: "Define required fields and data quality rules.",
        icon: "database",
      },
      {
        id: "reporting",
        title: "Reporting",
        description: "Agree what management needs to see.",
        icon: "chart",
      },
      {
        id: "automation",
        title: "Automation",
        description: "Automate only after the process is understood.",
        icon: "zap",
      },
    ],
    faq: [
      {
        question: "What is CRM pipeline management?",
        answer:
          "Pipeline management is how a CRM tracks opportunities through stages — with ownership, activities, and visibility — so teams can progress and report on work consistently.",
      },
      {
        question:
          "Why is pipeline management important for financial services?",
        answer:
          "Financial-services opportunities often involve multiple stages and stakeholders. Structured pipelines help keep ownership, follow-ups, and management visibility clear.",
      },
      {
        question: "What CRM features support pipeline management?",
        answer:
          "Look for stage configuration, deal or opportunity records, ownership, activity tracking, pipeline views, and — when needed — multiple pipelines, automation, forecasting, and reporting.",
      },
      {
        question: "Do I need multiple pipelines?",
        answer:
          "Only if distinct processes need separate stage models (for example advisory vs sales). Many teams start with one well-designed pipeline.",
      },
      {
        question:
          "What is the difference between pipeline management and workflow automation?",
        answer:
          "Pipeline management structures opportunity stages and ownership. Workflow automation triggers tasks or updates as records change — often across those stages.",
      },
      {
        question: "How should I compare CRM pipeline functionality?",
        answer:
          "Compare on the requirements your process needs, then check evidence of support, plan limits, screenshots, and total cost. Use side-by-side comparisons and CRM Finder for a shortlist.",
      },
      {
        question: "Does advanced pipeline functionality cost more?",
        answer:
          "Sometimes — multiple pipelines, automation, or forecasting may sit on higher plans. Verify plan limits with vendors and use the CRM Cost Calculator for researched list prices.",
      },
      {
        question: "Which CRM is best for pipeline management?",
        answer:
          "There is no universal best product for every financial-services team. Fit depends on your workflow, must-have capabilities, integrations, and budget.",
      },
    ],
    screenshotMatchTerms: [
      "pipeline",
      "deal board",
      "opportunity",
      "kanban",
      "stages",
    ],
    finderHref: "/tools/crm-finder/",
    calculatorHref: "/tools/crm-cost-calculator/",
    compareHref: "/compare/",
    methodologyHref: COMPANY_ROUTES.methodology,
    categorySlug: "crm",
  });
}
