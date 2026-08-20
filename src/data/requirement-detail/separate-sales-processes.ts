import {
  RequirementDetailProfileSchema,
  type RequirementDetailProfile,
} from "@/domain";
import { COMPANY_ROUTES } from "@/services/site-foundation";

/**
 * Buyer requirement: support separate sales / relationship processes.
 * Satisfied primarily via multiple pipelines + stage configuration.
 */
export function buildSeparateSalesProcessesRequirementProfile(): RequirementDetailProfile {
  return RequirementDetailProfileSchema.parse({
    slug: "separate-sales-processes",
    name: "Support Separate Sales Processes",
    displayTitle: "Support Separate Sales Processes",
    eyebrow: "CRM requirement",
    tagline:
      "Compare how CRM platforms support teams that need different sales or relationship processes, including pipeline structure, stage configuration, permissions, automation and reporting.",
    shortAnswer:
      "If different teams, products or opportunity types follow materially different sales processes, your CRM should let you model those processes separately. Multiple pipelines are usually the foundation, but pipeline-specific stages, permissions, automation and reporting determine how well the requirement is actually satisfied.",
    buyerNeedDescription:
      "Allow teams, products or workflows to follow distinct processes without forcing everything through one shared pipeline.",
    requirementType: "workflow-configuration",
    requirementTypeLabel: "Workflow / configuration",
    typicalImportanceLabel: "High (context-dependent)",
    categorySlug: "crm",
    primaryCapabilitySlug: "pipeline-management",
    primaryCapabilityName: "Pipeline Management",
    primaryCapabilityHref:
      "/industries/financial-services/capabilities/pipeline-management/",
    featureLinks: [
      {
        featureSlug: "custom-pipelines",
        featurePageSlug: "multiple-pipelines",
        name: "Multiple Pipelines",
        relationship: "required",
        rationale:
          "Provides separate process containers for distinct sales motions.",
        icon: "layers",
      },
      {
        featureSlug: "pipeline-management",
        name: "Pipeline Management",
        relationship: "required",
        rationale:
          "Core opportunity workflow support that multiple pipelines build on.",
        icon: "funnel",
      },
      {
        featureSlug: "custom-fields",
        name: "Custom Fields",
        relationship: "strongly-supporting",
        rationale:
          "Helps capture process-specific data when pipelines differ.",
        icon: "settings",
      },
      {
        featureSlug: "workflow-automation",
        featurePageSlug: "workflow-automation",
        name: "Workflow Automation",
        relationship: "supporting",
        rationale:
          "Lets process-specific actions trigger as opportunities progress.",
        icon: "zap",
      },
      {
        featureSlug: "reporting",
        name: "Pipeline Reporting",
        relationship: "supporting",
        rationale:
          "Supports measuring processes independently where implemented.",
        icon: "chart",
      },
    ],
    evaluationCriteria: [
      {
        id: "separate-structure",
        name: "Separate process structure",
        description:
          "Can materially different processes exist independently?",
        featureSlugs: ["custom-pipelines"],
        importance: "required",
        icon: "layers",
      },
      {
        id: "independent-stages",
        name: "Independent stages",
        description:
          "Can each process use its own stage structure?",
        featureSlugs: ["custom-pipelines", "pipeline-management"],
        importance: "required",
        icon: "funnel",
      },
      {
        id: "access-control",
        name: "Access control",
        description:
          "Can teams be restricted to relevant processes where needed?",
        featureSlugs: ["custom-fields"],
        importance: "important",
        icon: "shield",
      },
      {
        id: "automation",
        name: "Process-specific automation",
        description:
          "Can automation behave differently by process?",
        featureSlugs: ["workflow-automation"],
        importance: "important",
        icon: "zap",
      },
      {
        id: "reporting",
        name: "Separate reporting",
        description:
          "Can each process be measured independently?",
        featureSlugs: ["reporting"],
        importance: "supporting",
        icon: "chart",
      },
      {
        id: "administration",
        name: "Administrability",
        description:
          "Can administrators maintain configuration without excessive work?",
        featureSlugs: ["pipeline-management"],
        importance: "supporting",
        icon: "settings",
      },
    ],
    needGuidance: {
      needIf: [
        "Different teams follow different sales stages",
        "You sell products/services using materially different processes",
        "Sales and account management need separate workflows",
        "Different regions have different processes",
        "Different deal types require different automation",
        "Reporting must separate different pipelines/processes",
      ],
      mayNotNeedIf: [
        "Everyone follows one standardized sales process",
        "Differences can be represented with fields or filters",
        "Your organization deliberately uses one shared workflow",
        "You have a very simple sales motion",
      ],
    },
    whyItMatters: [
      {
        id: "process-fit",
        title: "Process fit",
        description:
          "Avoid forcing fundamentally different workflows into the same stage structure.",
        icon: "funnel",
      },
      {
        id: "adoption",
        title: "Team adoption",
        description:
          "Users see a workflow that reflects how their team actually works.",
        icon: "users",
      },
      {
        id: "automation",
        title: "Automation",
        description:
          "Different processes can trigger different actions where supported.",
        icon: "zap",
      },
      {
        id: "reporting",
        title: "Reporting",
        description:
          "Separate processes can potentially be measured independently.",
        icon: "chart",
      },
    ],
    summarySlots: [
      { id: "overall", label: "Strongest overall fit", selection: "best-overall" },
      {
        id: "simple",
        label: "Best for simple needs",
        selection: "best-simplicity",
      },
      {
        id: "complex",
        label: "Best for complex needs",
        selection: "best-complex",
      },
      { id: "value", label: "Best value at scale", selection: "best-value" },
    ],
    scenarios: [
      {
        id: "two-processes",
        title: "Small team with two sales processes",
        description:
          "Needs clear separation without heavy administration.",
        priorities: ["Simple setup", "Affordable plan access", "Clear stages"],
        focusCriterionSlug: "ease-of-use",
        icon: "users",
      },
      {
        id: "multi-team",
        title: "Multiple sales teams",
        description:
          "Permissions, independent automation, and reporting matter more.",
        priorities: ["Permissions", "Automation", "Reporting"],
        focusCriterionSlug: "sales-automation",
        icon: "layers",
      },
      {
        id: "enterprise",
        title: "Complex enterprise process",
        description:
          "Customization, administration, and reporting depth dominate.",
        priorities: ["Customization", "Administration", "Reporting"],
        focusCriterionSlug: "customization",
        icon: "settings",
      },
    ],
    useCaseLinks: [
      {
        id: "complex",
        title: "Complex sales processes",
        description:
          "Multi-stage, multi-stakeholder sales often need distinct process models.",
        importanceLabel: "Critical",
        href: "/industries/financial-services/use-cases/complex-sales-processes/",
        icon: "layers",
      },
      {
        id: "advisory",
        title: "Advisory & relationship management",
        description:
          "Relevant when advisory and opportunity workflows diverge.",
        importanceLabel: "High",
        href: "/industries/financial-services/use-cases/advisory-relationship-management/",
        icon: "handshake",
      },
      {
        id: "simple",
        title: "Simple single-process sales",
        description:
          "Often optional when one shared pipeline is enough.",
        importanceLabel: "Optional",
        icon: "funnel",
      },
    ],
    industryContexts: [
      {
        industrySlug: "financial-services",
        title: "Financial Services",
        summary:
          "Different advisory, relationship and sales workflows may need distinct process structures.",
        href: "/industries/financial-services/requirements/separate-sales-processes/",
        importanceSummary:
          "Financial-services organizations often run advisory, B2B sales, and account-management motions side by side. Separate process support helps keep those stage models distinct.",
        eyebrowOverride: "Financial services CRM requirement",
        displayTitleOverride:
          "Separate Sales Processes for Financial Services CRM",
        taglineOverride:
          "See how CRM platforms support distinct advisory, sales, and relationship processes in financial services — with researched features, plans and evidence.",
        useCaseRelationships: [
          {
            id: "complex",
            title: "Complex sales processes",
            description:
              "High relevance for multi-stage financial-services sales.",
            importanceLabel: "Critical",
            href: "/industries/financial-services/use-cases/complex-sales-processes/",
            icon: "layers",
          },
          {
            id: "advisory",
            title: "Advisory & relationship management",
            description:
              "Useful when advisory workflows differ from pure sales pipelines.",
            importanceLabel: "High",
            href: "/industries/financial-services/use-cases/advisory-relationship-management/",
            icon: "handshake",
          },
        ],
        tradeoffs: [
          {
            id: "fragmentation",
            title: "Clarity vs fragmentation",
            description:
              "Too many process models can fragment reporting and ownership across financial-services teams.",
          },
        ],
      },
    ],
    relatedRequirementSlugs: ["automate-lead-follow-up"],
    relatedCapabilitySlugs: [
      "pipeline-management",
      "workflow-automation",
      "reporting",
    ],
    tradeoffs: [
      {
        id: "plan",
        title: "Plan impact",
        description:
          "Multiple pipelines and deeper process controls are often gated to higher plans.",
        icon: "chart",
      },
      {
        id: "complexity",
        title: "Flexibility vs administration",
        description:
          "More process models improve fit but increase configuration and reporting complexity.",
        icon: "settings",
      },
      {
        id: "depth",
        title: "Support ≠ identical depth",
        description:
          "Products can satisfy the requirement differently across stages, permissions, automation and reporting.",
        icon: "layers",
      },
    ],
    vendorQuestions: [
      "Can we create a separate pipeline for each sales process?",
      "Can each pipeline use different stages?",
      "Are there limits on the number of pipelines?",
      "Which plan enables multiple pipelines?",
      "Can access be restricted by team or pipeline?",
      "Can automation rules differ by pipeline?",
      "Can each pipeline be reported independently?",
      "Can reports compare multiple pipelines?",
      "What happens if we later consolidate or split pipelines?",
    ],
    faq: [
      {
        question: "What does supporting separate sales processes mean?",
        answer:
          "It means the CRM can model materially different opportunity workflows — typically via multiple pipelines with independent stages — instead of forcing every deal through one shared stage model.",
      },
      {
        question: "Do I need multiple CRM pipelines?",
        answer:
          "Usually yes when processes differ materially. If differences are minor, fields or filters on one pipeline may be enough.",
      },
      {
        question:
          "What is the difference between a requirement and a CRM feature?",
        answer:
          "A requirement is a buyer need (what the software must allow you to do). A feature is concrete product functionality that helps satisfy that need — for example Multiple Pipelines supporting separate sales processes.",
      },
      {
        question: "Does this requirement require a more expensive CRM plan?",
        answer:
          "Often it can — multiple pipelines and related controls may sit on higher plans. Check the plan impact section; unverified cases are marked Not verified.",
      },
      {
        question: "Which CRM is best for multiple sales processes?",
        answer:
          "There is no universal best product. Fit depends on process complexity, permissions, automation, reporting needs and budget. Use the short answer and scorecard as a starting point, then personalize in CRM Finder.",
      },
    ],
    screenshotMatchTerms: ["pipeline", "stage", "process", "deal"],
    matrixFeatureSlugs: [
      "custom-pipelines",
      "pipeline-management",
      "custom-fields",
      "workflow-automation",
      "reporting",
    ],
    finderHref: "/tools/crm-finder/",
    calculatorHref: "/tools/crm-cost-calculator/",
    compareHref: "/compare/",
    methodologyHref: COMPANY_ROUTES.methodology,
  });
}
