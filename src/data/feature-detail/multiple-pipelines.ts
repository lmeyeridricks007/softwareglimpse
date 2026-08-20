import {
  FeatureDetailProfileSchema,
  type FeatureDetailProfile,
} from "@/domain";
import { COMPANY_ROUTES } from "@/services/site-foundation";

/**
 * Multiple Pipelines feature detail profile.
 * Catalogue evidence slug: custom-pipelines (URL: multiple-pipelines).
 */
export function buildMultiplePipelinesFeatureProfile(): FeatureDetailProfile {
  return FeatureDetailProfileSchema.parse({
    slug: "multiple-pipelines",
    canonicalFeatureSlug: "custom-pipelines",
    name: "Multiple Pipelines",
    displayTitle: "Multiple Pipelines in CRM Software",
    eyebrow: "CRM feature",
    tagline:
      "Compare how CRM platforms support multiple sales or relationship pipelines, including availability, configuration, plan requirements and implementation differences.",
    definition:
      "A CRM with multiple-pipeline support lets a company maintain separate opportunity workflows for different teams, products, regions or sales processes instead of forcing every deal through the same stage structure.",
    notTheSameAs: [
      "Multiple views of one pipeline",
      "Filters on a single pipeline",
      "Pipelines simulated with tags or labels",
      "Custom deal fields alone",
    ],
    supportsBullets: [
      "Separate sales processes",
      "Different pipeline stages",
      "Team-specific workflows",
      "Distinct opportunity types",
      "Independent reporting where available",
    ],
    featureType: "configurable",
    featureTypeLabel: "Configuration / workflow",
    typicalBuyerNeed:
      "Different teams or sales processes require distinct pipelines",
    commonLimitation: "Availability may depend on plan",
    categorySlug: "crm",
    primaryCapabilitySlug: "pipeline-management",
    primaryCapabilityName: "Pipeline Management",
    primaryCapabilityHref:
      "/industries/financial-services/capabilities/pipeline-management/",
    relatedRequirementName: "Support Separate Sales Processes",
    relatedRequirementDescription:
      "Run separate opportunity workflows when processes differ materially.",
    relatedRequirementSlug: "separate-sales-processes",
    evaluationDimensions: [
      {
        id: "availability",
        name: "Feature availability",
        valueType: "support-status",
        source: "primary",
        importance: "critical",
      },
      {
        id: "min-plan",
        name: "Minimum plan",
        valueType: "plan",
        source: "min-plan",
        importance: "high",
      },
      {
        id: "pipeline-count",
        name: "Number of pipelines",
        valueType: "limit",
        source: "notes-limit",
        importance: "important",
      },
      {
        id: "independent-stages",
        name: "Independent stages",
        description:
          "Whether pipeline configuration can differ by process (proxied by custom-pipeline support).",
        valueType: "support-status",
        source: "primary",
        importance: "high",
      },
      {
        id: "pipeline-fields",
        name: "Pipeline-specific fields",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "custom-fields",
        importance: "important",
      },
      {
        id: "pipeline-automation",
        name: "Pipeline-specific automation",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "workflow-automation",
        importance: "high",
      },
      {
        id: "separate-reporting",
        name: "Separate reporting",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "reporting",
        importance: "important",
      },
    ],
    needGuidance: {
      needIf: [
        "Different teams use different sales stages",
        "Product lines have materially different workflows",
        "Sales and account-management processes are distinct",
        "Separate pipelines need independent reporting",
      ],
      mayNotNeedIf: [
        "Everyone follows the same process",
        "Differences can be handled with fields or filters",
        "Your sales process is intentionally simple",
      ],
    },
    requirementMappings: [
      {
        id: "distinct-processes",
        name: "Support Separate Sales Processes",
        description: "Maintain distinct stage models for different motions.",
        supportLevel: "direct",
        requirementSlug: "separate-sales-processes",
        href: "/requirements/separate-sales-processes/",
      },
      {
        id: "team-stages",
        name: "Different teams use different stages",
        description: "Allow teams to operate with their own pipeline structure.",
        supportLevel: "direct",
        requirementSlug: "separate-sales-processes",
        href: "/requirements/separate-sales-processes/",
      },
      {
        id: "separate-reporting",
        name: "Separate reporting",
        description:
          "Analyze pipelines independently — depends on reporting implementation.",
        supportLevel: "depends",
      },
      {
        id: "permissions",
        name: "Team-specific permissions",
        description:
          "Restrict pipeline access by role — depends on access controls.",
        supportLevel: "depends",
      },
    ],
    relatedFeatureSlugs: [
      "pipeline-management",
      "workflow-automation",
      "custom-fields",
      "reporting",
      "forecasting",
    ],
    relatedCapabilitySlugs: [
      "pipeline-management",
      "workflow-automation",
      "reporting",
    ],
    useCaseRelevance: [
      {
        id: "complex",
        title: "Complex sales processes",
        description:
          "Multiple stages, stakeholders, and process models often need separate pipelines.",
        relevanceLabel: "High relevance",
        href: "/industries/financial-services/use-cases/complex-sales-processes/",
        icon: "layers",
      },
      {
        id: "advisory",
        title: "Advisory & relationship management",
        description:
          "Useful when advisory and opportunity workflows differ.",
        relevanceLabel: "Medium–High",
        href: "/industries/financial-services/use-cases/advisory-relationship-management/",
        icon: "handshake",
      },
      {
        id: "simple",
        title: "Simple single-process sales",
        description:
          "One well-designed pipeline is often enough when everyone shares stages.",
        relevanceLabel: "Low / optional",
        icon: "funnel",
      },
    ],
    industryRelevance: [
      {
        industrySlug: "financial-services",
        title: "Financial Services",
        summary:
          "Useful for separate advisory, sales, or relationship processes.",
        href: "/industries/financial-services/features/multiple-pipelines/",
        icon: "building",
      },
    ],
    industryContexts: [
      {
        industrySlug: "financial-services",
        eyebrowOverride: "Financial services CRM feature",
        displayTitleOverride:
          "Multiple CRM Pipelines for Financial Services",
        taglineOverride:
          "See why multiple pipelines matter for financial-services teams — and how CRM products support separate advisory, sales, and relationship processes.",
        importanceSummary:
          "Financial-services organizations often run distinct motions (advisory, B2B sales, account management). Multiple pipelines help keep those stage models separate without collapsing them into one generic funnel.",
        tradeoffs: [
          {
            id: "process-split",
            title: "Process clarity vs complexity",
            description:
              "Separate pipelines help when processes truly differ — but too many pipelines can fragment reporting and ownership.",
          },
          {
            id: "compliance-admin",
            title: "Control vs administration",
            description:
              "Permissions and audit needs may increase as pipeline models multiply across teams.",
          },
        ],
        useCaseRelationships: [
          {
            id: "complex",
            title: "Complex sales processes",
            description:
              "High relevance when multi-stage financial-services sales need distinct models.",
            relevanceLabel: "High",
            href: "/industries/financial-services/use-cases/complex-sales-processes/",
            icon: "layers",
          },
          {
            id: "advisory",
            title: "Advisory & relationship management",
            description:
              "Relevant when advisory workflows diverge from pure sales pipelines.",
            relevanceLabel: "Medium–High",
            href: "/industries/financial-services/use-cases/advisory-relationship-management/",
            icon: "handshake",
          },
        ],
      },
    ],
    implementationThemes: [
      {
        id: "structure",
        title: "Pipeline structure",
        description:
          "Whether each pipeline can use its own stages and configuration.",
        dimensionId: "independent-stages",
        icon: "funnel",
      },
      {
        id: "automation",
        title: "Automation",
        description:
          "Whether workflows can be scoped meaningfully alongside pipelines.",
        dimensionId: "pipeline-automation",
        icon: "zap",
      },
      {
        id: "reporting",
        title: "Reporting",
        description:
          "Whether pipelines can be analyzed separately in researched reporting features.",
        dimensionId: "separate-reporting",
        icon: "chart",
      },
    ],
    tradeoffs: [
      {
        id: "plan",
        title: "Plan restrictions",
        description:
          "Multiple pipelines are often gated to higher plans even when basic pipeline views exist earlier.",
        icon: "chart",
      },
      {
        id: "complexity",
        title: "Depth vs simplicity",
        description:
          "Supporting many pipelines adds flexibility but can increase administration and reporting complexity.",
        icon: "settings",
      },
      {
        id: "implementation",
        title: "Support ≠ identical implementation",
        description:
          "Two products can both support multiple pipelines while differing in stages, automation, and reporting depth.",
        icon: "layers",
      },
    ],
    vendorQuestions: [
      "How many pipelines can we create?",
      "Can each pipeline have different stages?",
      "Can fields vary between pipelines?",
      "Can workflows be scoped to a pipeline?",
      "Can users have access to only certain pipelines?",
      "Can reporting be separated by pipeline?",
      "Does this feature require a higher plan?",
      "Are pipeline limits different by plan?",
    ],
    faq: [
      {
        question: "What are multiple pipelines in CRM?",
        answer:
          "Multiple pipelines let you maintain separate opportunity workflows — for example different teams, products, or processes — instead of forcing every deal through one stage model.",
      },
      {
        question: "Why would a business need multiple pipelines?",
        answer:
          "When sales motions differ materially (stages, ownership, reporting), separate pipelines prevent forcing incompatible processes into a single funnel.",
      },
      {
        question: "How are multiple pipelines different from pipeline stages?",
        answer:
          "Stages define steps inside a pipeline. Multiple pipelines mean you can run more than one stage model. Views, filters, and tags on one pipeline are not the same thing.",
      },
      {
        question: "Are multiple pipelines available on free CRM plans?",
        answer:
          "It depends on the product. Some include multiple pipelines earlier; others gate them to paid tiers. Check the plan availability section — unverified cases are marked Not verified.",
      },
      {
        question: "Do multiple pipelines affect CRM pricing?",
        answer:
          "Often yes, when the feature starts on a higher plan. Use the CRM Cost Calculator with researched list prices for your team size.",
      },
    ],
    screenshotMatchTerms: ["pipeline", "stage", "deal", "kanban"],
    screenshotTabs: [
      {
        id: "setup",
        label: "Pipeline setup",
        matchTerms: ["pipeline", "setup", "process"],
      },
      {
        id: "view",
        label: "Pipeline view",
        matchTerms: ["pipeline", "kanban", "board"],
      },
      {
        id: "stages",
        label: "Stage configuration",
        matchTerms: ["stage", "pipeline"],
      },
      {
        id: "automation",
        label: "Automation",
        matchTerms: ["automation", "workflow"],
      },
      {
        id: "reporting",
        label: "Reporting",
        matchTerms: ["report", "forecast"],
      },
    ],
    finderHref: "/tools/crm-finder/",
    calculatorHref: "/tools/crm-cost-calculator/",
    compareHref: "/compare/",
    methodologyHref: COMPANY_ROUTES.methodology,
    lastReviewedAt: "2026-08-15T00:00:00.000Z",
  });
}
