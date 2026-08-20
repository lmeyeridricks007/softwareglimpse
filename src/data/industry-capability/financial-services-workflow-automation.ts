import {
  IndustryCapabilityProfileSchema,
  type IndustryCapabilityProfile,
} from "@/domain";
import { COMPANY_ROUTES } from "@/services/site-foundation";

/**
 * Financial services × workflow automation capability profile.
 * Proves the template is not pipeline-specific.
 */
export function buildFinancialServicesWorkflowAutomationProfile(): IndustryCapabilityProfile {
  return IndustryCapabilityProfileSchema.parse({
    industrySlug: "financial-services",
    capabilitySlug: "workflow-automation",
    displayName: "Workflow automation",
    displayTitle: "Workflow Automation for Financial Services",
    eyebrow: "Financial services CRM capability",
    tagline:
      "Evaluate CRM platforms based on how well they automate repetitive follow-ups, stage changes, and process consistency for financial-services teams.",
    whyItMatters: [
      "Financial-services teams often repeat the same follow-ups, reminders, and handoffs across opportunities. Automation reduces manual busywork when the underlying process is clear.",
      "Automation only helps after ownership and stages are defined. Compare products on what can be automated, which plans include it, and how much configuration your team can sustain.",
      "Use automation to reinforce a consistent process — not to paper over an unclear one.",
    ],
    weakProcessRisks: [
      "Manual busywork",
      "Inconsistent follow-ups",
      "Broken handoffs",
      "Over-automation without ownership",
    ],
    glance: {
      importanceLabel: "High",
      coreObjective:
        "Standardize repetitive CRM work without losing control",
      importantRequirementLabels: [
        "Triggers",
        "Tasks",
        "Stage actions",
        "Controls",
      ],
    },
    evaluationDimensions: [
      "Trigger conditions",
      "Task creation",
      "Stage-based actions",
      "Sequences / follow-ups",
      "Notifications",
      "Plan limits",
      "Admin controls",
    ],
    requirements: [
      {
        id: "triggers",
        name: "Trigger conditions",
        description:
          "Start automations from stage changes, field updates, or activity events.",
        priority: "core",
        featureSlug: "workflow-automation",
        requirementSlug: "automate-lead-follow-up",
        icon: "zap",
        href: "/requirements/automate-lead-follow-up/",
      },
      {
        id: "tasks",
        name: "Automated tasks",
        description:
          "Create assigned next actions so follow-ups are not forgotten.",
        priority: "core",
        featureSlug: "workflow-automation",
        requirementSlug: "automate-lead-follow-up",
        icon: "check",
        href: "/requirements/automate-lead-follow-up/",
      },
      {
        id: "sequences",
        name: "Sequences / follow-ups",
        description:
          "Support structured outreach or reminder sequences where researched.",
        priority: "core",
        featureSlug: "email-sequences",
        icon: "users",
      },
      {
        id: "sales-automation",
        name: "Sales automation",
        description:
          "Automate repetitive sales activity beyond a single task rule.",
        priority: "advanced",
        featureSlug: "sales-automation",
        icon: "funnel",
      },
      {
        id: "ai",
        name: "AI assistance",
        description:
          "Optional assistance for prompts, summaries, or suggested actions when evidenced.",
        priority: "advanced",
        featureSlug: "ai-assistance",
        icon: "sparkles",
      },
      {
        id: "reporting",
        name: "Automation visibility",
        description:
          "Understand what ran and whether process outcomes improved.",
        priority: "advanced",
        featureSlug: "reporting",
        icon: "chart",
      },
    ],
    matrixFeatureSlugs: [
      "workflow-automation",
      "sales-automation",
      "email-sequences",
      "email-tracking",
      "lead-scoring",
      "ai-assistance",
      "pipeline-management",
      "reporting",
    ],
    criterionSlug: "sales-automation",
    relatedCapabilitySlugs: [
      "pipeline-management",
      "reporting",
      "lead-management",
      "email-sequences",
      "integrations",
    ],
    useCaseFits: [
      {
        id: "high-volume",
        title: "High-volume lead management",
        description:
          "Automation helps when teams handle large inbound or outbound volumes.",
        importanceLabel: "High",
        icon: "users",
        href: "/industries/financial-services/#use-cases",
      },
      {
        id: "b2b-sales",
        title: "B2B financial services sales",
        description:
          "Useful for consistent follow-ups across opportunity stages.",
        importanceLabel: "High",
        icon: "funnel",
        href: "/industries/financial-services/#use-cases",
      },
      {
        id: "complex",
        title: "Complex sales processes",
        description:
          "Stage-based automation supports multi-step financial-services sales.",
        importanceLabel: "High",
        icon: "layers",
        useCaseSlug: "complex-sales-processes",
        href: "/industries/financial-services/use-cases/complex-sales-processes/",
      },
      {
        id: "advisory",
        title: "Advisory / relationship management",
        description:
          "Helps when follow-ups and reminders sit alongside client relationships.",
        importanceLabel: "Medium",
        icon: "handshake",
        useCaseSlug: "advisory-relationship-management",
        href: "/industries/financial-services/use-cases/advisory-relationship-management/",
      },
      {
        id: "growing",
        title: "Growing teams",
        description:
          "Reduces process drift as more people join the workflow.",
        importanceLabel: "High",
        icon: "trending",
        href: "/industries/financial-services/#use-cases",
      },
    ],
    tradeoffs: [
      {
        id: "control",
        title: "Automation vs control",
        description:
          "More automation improves consistency but needs clear ownership and review.",
        icon: "zap",
      },
      {
        id: "complexity",
        title: "Power vs maintainability",
        description:
          "Complex automations can break when processes change.",
        icon: "settings",
      },
      {
        id: "plan",
        title: "Capability vs plan tier",
        description:
          "Useful automation often sits on higher plans — verify before you buy.",
        icon: "chart",
      },
      {
        id: "native",
        title: "Native vs integrated automation",
        description:
          "Some teams automate in CRM; others orchestrate via connected tools.",
        icon: "puzzle",
      },
    ],
    outcomes: [
      { id: "repeat", label: "Reduce repetitive follow-up work" },
      { id: "consistent", label: "Standardize handoffs between stages" },
      { id: "remind", label: "Surface overdue or missing next actions" },
      { id: "scale", label: "Scale process as the team grows" },
      { id: "visibility", label: "Keep managers informed without chase email" },
    ],
    vendorQuestions: [
      "Which events can trigger automations?",
      "Can automations create and assign tasks?",
      "Which automation features require higher-tier plans?",
      "Can we limit who edits automation rules?",
      "How do we audit what automations have run?",
      "Can automations differ by team or pipeline?",
      "What happens when an automation fails?",
      "Can we export or document automation logic?",
    ],
    implementation: [
      {
        id: "process",
        title: "Stabilize the process first",
        description: "Automate only after stages and ownership are clear.",
        icon: "funnel",
      },
      {
        id: "scope",
        title: "Start narrow",
        description: "Automate one high-volume, low-risk workflow first.",
        icon: "zap",
      },
      {
        id: "owners",
        title: "Name automation owners",
        description: "Decide who maintains rules as the team changes.",
        icon: "users",
      },
      {
        id: "review",
        title: "Review outcomes",
        description: "Check whether automation improved follow-up quality.",
        icon: "chart",
      },
    ],
    faq: [
      {
        question: "What is CRM workflow automation?",
        answer:
          "Workflow automation uses rules or sequences to create tasks, updates, or follow-ups when CRM records change — reducing repetitive manual work.",
      },
      {
        question:
          "Why does workflow automation matter for financial services?",
        answer:
          "It helps keep follow-ups and handoffs consistent across advisors, sales, and relationship teams — especially as volume grows.",
      },
      {
        question: "Should I automate before designing my pipeline?",
        answer:
          "No. Define stages, ownership, and next actions first. Automation should reinforce a clear process.",
      },
      {
        question: "Does automation always require a higher CRM plan?",
        answer:
          "Often advanced automation is plan-gated. Verify with researched pricing and vendor documentation for your shortlist.",
      },
      {
        question: "Which CRM is best for workflow automation?",
        answer:
          "There is no universal best product. Fit depends on the workflows you need, plan limits, administration capacity, and budget.",
      },
    ],
    screenshotMatchTerms: [
      "automation",
      "workflow",
      "sequence",
      "assistant",
      "rules",
    ],
    finderHref: "/tools/crm-finder/",
    calculatorHref: "/tools/crm-cost-calculator/",
    compareHref: "/compare/",
    methodologyHref: COMPANY_ROUTES.methodology,
    categorySlug: "crm",
  });
}
