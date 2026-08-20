import {
  FeatureDetailProfileSchema,
  type FeatureDetailProfile,
} from "@/domain";
import { COMPANY_ROUTES } from "@/services/site-foundation";

/**
 * Workflow Automation feature detail profile.
 * Materially different from multiple-pipelines: more tiered / plan-gated.
 */
export function buildWorkflowAutomationFeatureProfile(): FeatureDetailProfile {
  return FeatureDetailProfileSchema.parse({
    slug: "workflow-automation",
    canonicalFeatureSlug: "workflow-automation",
    name: "Workflow Automation",
    displayTitle: "Workflow Automation in CRM Software",
    eyebrow: "CRM feature",
    tagline:
      "Compare how CRM platforms automate follow-ups, stage changes, and administrative workflows — including plan gating, depth, and researched limitations.",
    definition:
      "Workflow automation in CRM lets teams trigger tasks, updates, notifications, or sequences when defined conditions occur — reducing repetitive follow-up work and standardizing process steps.",
    notTheSameAs: [
      "One-off manual task reminders",
      "Email templates without triggers",
      "Reporting dashboards",
      "Integrations alone without CRM-side rules",
    ],
    supportsBullets: [
      "Trigger-based task creation",
      "Stage-change actions",
      "Follow-up reminders",
      "Notification workflows",
      "Repeatable process standardization",
    ],
    featureType: "tiered",
    featureTypeLabel: "Tiered / plan-dependent automation",
    typicalBuyerNeed:
      "Teams want consistent follow-ups without relying only on manual discipline",
    commonLimitation:
      "Deeper automation is often limited to higher plans or usage caps",
    categorySlug: "crm",
    primaryCapabilitySlug: "workflow-automation",
    primaryCapabilityName: "Workflow Automation",
    primaryCapabilityHref:
      "/industries/financial-services/capabilities/workflow-automation/",
    relatedRequirementName: "Automate Lead Follow-Up",
    relatedRequirementSlug: "automate-lead-follow-up",
    relatedRequirementDescription:
      "Reduce manual follow-up work with reliable, configurable automation.",
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
        importance: "critical",
      },
      {
        id: "usage-limits",
        name: "Usage / plan limits",
        valueType: "limit",
        source: "notes-limit",
        importance: "high",
      },
      {
        id: "sales-automation",
        name: "Sales automation depth",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "sales-automation",
        importance: "high",
      },
      {
        id: "sequences",
        name: "Email sequences",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "email-sequences",
        importance: "important",
      },
      {
        id: "reporting",
        name: "Automation / activity reporting",
        valueType: "support-status",
        source: "related-feature",
        relatedFeatureSlug: "reporting",
        importance: "important",
      },
    ],
    needGuidance: {
      needIf: [
        "Follow-ups are missed without system prompts",
        "Stage changes should create consistent next actions",
        "Managers need process standardization across reps",
        "Volume makes manual admin unsustainable",
      ],
      mayNotNeedIf: [
        "Teams are small and process is simple",
        "Automation would add more noise than value",
        "You first need clearer process definitions",
      ],
    },
    requirementMappings: [
      {
        id: "follow-ups",
        name: "Automate Lead Follow-Up",
        description: "Trigger reminders and tasks when conditions are met.",
        supportLevel: "direct",
        requirementSlug: "automate-lead-follow-up",
        href: "/requirements/automate-lead-follow-up/",
      },
      {
        id: "stage-actions",
        name: "Stage-based process steps",
        description: "Advance process actions when opportunities move stages.",
        supportLevel: "direct",
        requirementSlug: "automate-lead-follow-up",
        href: "/requirements/automate-lead-follow-up/",
      },
      {
        id: "sequences",
        name: "Multi-step outreach sequences",
        description:
          "Related — often a separate email-sequence capability.",
        supportLevel: "partial",
      },
    ],
    relatedFeatureSlugs: [
      "sales-automation",
      "email-sequences",
      "pipeline-management",
      "reporting",
      "custom-pipelines",
    ],
    relatedCapabilitySlugs: [
      "workflow-automation",
      "pipeline-management",
      "reporting",
    ],
    useCaseRelevance: [
      {
        id: "complex",
        title: "Complex sales processes",
        description:
          "Stage-based automation helps keep multi-step processes consistent.",
        relevanceLabel: "High relevance",
        href: "/industries/financial-services/use-cases/complex-sales-processes/",
        icon: "layers",
      },
      {
        id: "high-volume",
        title: "High-volume lead management",
        description:
          "Automation reduces manual follow-up load at higher volumes.",
        relevanceLabel: "High relevance",
        href: "/industries/financial-services/#use-cases",
        icon: "users",
      },
      {
        id: "advisory",
        title: "Advisory & relationship management",
        description:
          "Useful for reminders and handoffs; less central than relationship history.",
        relevanceLabel: "Medium",
        href: "/industries/financial-services/use-cases/advisory-relationship-management/",
        icon: "handshake",
      },
    ],
    industryRelevance: [
      {
        industrySlug: "financial-services",
        title: "Financial Services",
        summary:
          "Helps standardize follow-ups and stage actions across advisory and sales teams.",
        href: "/industries/financial-services/capabilities/workflow-automation/",
        icon: "building",
      },
    ],
    industryContexts: [
      {
        industrySlug: "financial-services",
        eyebrowOverride: "Financial services CRM feature",
        displayTitleOverride:
          "CRM Workflow Automation for Financial Services",
        taglineOverride:
          "Compare CRM workflow automation for financial-services teams — including plan gating, related sales automation, and researched limitations.",
        importanceSummary:
          "Financial-services teams often need reliable follow-ups and handoffs. Automation helps only after the underlying advisory or sales process is clear.",
        tradeoffs: [
          {
            id: "noise",
            title: "Consistency vs alert noise",
            description:
              "Over-automation can create task noise if ownership and exceptions are unclear.",
          },
        ],
        useCaseRelationships: [
          {
            id: "complex",
            title: "Complex sales processes",
            description:
              "High relevance for stage-triggered handoffs and approvals.",
            relevanceLabel: "High",
            href: "/industries/financial-services/use-cases/complex-sales-processes/",
            icon: "layers",
          },
        ],
      },
    ],
    implementationThemes: [
      {
        id: "triggers",
        title: "Triggers & actions",
        description:
          "What events can start automations and what actions are researched.",
        dimensionId: "availability",
        icon: "zap",
      },
      {
        id: "plan-depth",
        title: "Plan depth",
        description:
          "How plan tiers gate automation availability.",
        dimensionId: "min-plan",
        icon: "chart",
      },
      {
        id: "sales-auto",
        title: "Sales automation adjacency",
        description:
          "Related sales-automation support beyond basic workflows.",
        dimensionId: "sales-automation",
        icon: "funnel",
      },
    ],
    tradeoffs: [
      {
        id: "plan-gating",
        title: "Capability vs plan tier",
        description:
          "Meaningful automation is frequently plan-gated or usage-limited.",
        icon: "chart",
      },
      {
        id: "process-first",
        title: "Automate after process clarity",
        description:
          "Automating a broken process amplifies inconsistency instead of fixing it.",
        icon: "settings",
      },
      {
        id: "maintenance",
        title: "Power vs maintainability",
        description:
          "Complex automations need owners and review when processes change.",
        icon: "layers",
      },
    ],
    vendorQuestions: [
      "Which events can trigger workflows?",
      "Which actions are available without professional services?",
      "Which automation features require higher-tier plans?",
      "Are there monthly automation or workflow usage limits?",
      "Can automations be scoped to pipelines or teams?",
      "How do we audit or debug failed automations?",
      "Can sequences and workflows work together?",
    ],
    faq: [
      {
        question: "What is workflow automation in CRM?",
        answer:
          "It is rule-based automation that creates tasks, updates records, or sends notifications when conditions occur — such as a stage change or inactivity.",
      },
      {
        question: "Is workflow automation the same as sales automation?",
        answer:
          "Related but not identical. Workflow automation is the broader rules engine; sales automation often refers to sales-specific sequences and process automation. We evaluate both using researched feature support.",
      },
      {
        question: "Do free CRM plans include workflow automation?",
        answer:
          "Often not, or only in limited form. Check the plan availability table — unverified products are marked Not verified.",
      },
      {
        question: "Can automation differ by pipeline?",
        answer:
          "It depends on the product. Some support pipeline-scoped rules; others apply more globally. Ask vendors and verify with current evidence.",
      },
    ],
    screenshotMatchTerms: ["automation", "workflow", "sequence", "trigger"],
    screenshotTabs: [
      {
        id: "automation",
        label: "Automation builder",
        matchTerms: ["automation", "workflow"],
      },
      {
        id: "sequences",
        label: "Sequences",
        matchTerms: ["sequence", "email"],
      },
      {
        id: "pipeline",
        label: "Pipeline triggers",
        matchTerms: ["pipeline", "stage"],
      },
    ],
    finderHref: "/tools/crm-finder/",
    calculatorHref: "/tools/crm-cost-calculator/",
    compareHref: "/compare/",
    methodologyHref: COMPANY_ROUTES.methodology,
    lastReviewedAt: "2026-08-15T00:00:00.000Z",
  });
}
