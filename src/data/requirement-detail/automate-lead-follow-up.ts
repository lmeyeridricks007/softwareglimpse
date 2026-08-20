import {
  RequirementDetailProfileSchema,
  type RequirementDetailProfile,
} from "@/domain";
import { COMPANY_ROUTES } from "@/services/site-foundation";

/**
 * Buyer requirement: automate lead follow-up.
 * Materially different from separate-sales-processes — automation-centric.
 */
export function buildAutomateLeadFollowUpRequirementProfile(): RequirementDetailProfile {
  return RequirementDetailProfileSchema.parse({
    slug: "automate-lead-follow-up",
    name: "Automate Lead Follow-Up",
    displayTitle: "Automate Lead Follow-Up",
    eyebrow: "CRM requirement",
    tagline:
      "Compare how CRM platforms automate lead follow-up — including workflows, sequences, task triggers, plan gating and researched limitations.",
    shortAnswer:
      "If leads stall without consistent follow-up, your CRM should trigger reminders, tasks or sequences when conditions occur. Workflow automation is usually the foundation; email sequences and sales automation determine how complete the follow-up experience is.",
    buyerNeedDescription:
      "Ensure leads receive timely, consistent follow-up without relying only on manual discipline.",
    requirementType: "automation",
    requirementTypeLabel: "Automation / process",
    typicalImportanceLabel: "High for inbound or high-volume teams",
    categorySlug: "crm",
    primaryCapabilitySlug: "workflow-automation",
    primaryCapabilityName: "Workflow Automation",
    primaryCapabilityHref:
      "/industries/financial-services/capabilities/workflow-automation/",
    featureLinks: [
      {
        featureSlug: "workflow-automation",
        featurePageSlug: "workflow-automation",
        name: "Workflow Automation",
        relationship: "required",
        rationale:
          "Triggers tasks, updates and notifications when follow-up conditions occur.",
        icon: "zap",
      },
      {
        featureSlug: "sales-automation",
        name: "Sales Automation",
        relationship: "required",
        rationale:
          "Supports sales-specific automation patterns around leads and opportunities.",
        icon: "funnel",
      },
      {
        featureSlug: "email-sequences",
        name: "Email Sequences",
        relationship: "strongly-supporting",
        rationale:
          "Enables multi-step outreach when email follow-up is part of the process.",
        icon: "sparkles",
      },
      {
        featureSlug: "lead-management",
        name: "Lead Management",
        relationship: "supporting",
        rationale:
          "Provides the lead records and lifecycle context automation acts on.",
        icon: "users",
      },
      {
        featureSlug: "reporting",
        name: "Activity Reporting",
        relationship: "supporting",
        rationale:
          "Helps managers see whether follow-up automation is working.",
        icon: "chart",
      },
    ],
    evaluationCriteria: [
      {
        id: "triggers",
        name: "Follow-up triggers",
        description:
          "Can inactivity, stage changes or lead events start follow-up actions?",
        featureSlugs: ["workflow-automation"],
        importance: "required",
        icon: "zap",
      },
      {
        id: "sales-auto",
        name: "Sales automation depth",
        description:
          "Is sales-oriented automation researched as available?",
        featureSlugs: ["sales-automation"],
        importance: "required",
        icon: "funnel",
      },
      {
        id: "sequences",
        name: "Multi-step sequences",
        description:
          "Can multi-step email/outreach sequences support follow-up?",
        featureSlugs: ["email-sequences"],
        importance: "important",
        icon: "sparkles",
      },
      {
        id: "lead-context",
        name: "Lead context",
        description:
          "Are lead records available for automation to act on?",
        featureSlugs: ["lead-management"],
        importance: "important",
        icon: "users",
      },
      {
        id: "visibility",
        name: "Follow-up visibility",
        description:
          "Can teams report on activity and follow-up outcomes?",
        featureSlugs: ["reporting"],
        importance: "supporting",
        icon: "chart",
      },
    ],
    needGuidance: {
      needIf: [
        "Leads go cold without system reminders",
        "Inbound volume makes manual follow-up unreliable",
        "Managers need consistent SLA-style follow-up",
        "Stage changes should create next actions automatically",
      ],
      mayNotNeedIf: [
        "Volume is low and manual follow-up is reliable",
        "You first need a clearer lead process definition",
        "Automation would create more noise than value",
      ],
    },
    whyItMatters: [
      {
        id: "consistency",
        title: "Consistency",
        description:
          "Follow-up happens even when reps are busy or away.",
        icon: "check",
      },
      {
        id: "speed",
        title: "Response speed",
        description:
          "Inbound leads can get faster first touches where automation is configured.",
        icon: "zap",
      },
      {
        id: "scale",
        title: "Scale",
        description:
          "Higher lead volume becomes manageable without proportional headcount.",
        icon: "trending",
      },
      {
        id: "visibility",
        title: "Visibility",
        description:
          "Managers can see whether follow-up commitments are being met.",
        icon: "chart",
      },
    ],
    summarySlots: [
      { id: "overall", label: "Strongest overall fit", selection: "best-overall" },
      {
        id: "simple",
        label: "Best for simple automation",
        selection: "best-simplicity",
      },
      {
        id: "complex",
        label: "Best for complex automation",
        selection: "best-complex",
      },
      { id: "value", label: "Best value", selection: "best-value" },
    ],
    scenarios: [
      {
        id: "inbound",
        title: "Inbound lead response",
        description:
          "Needs fast first-touch automation on new leads.",
        priorities: ["Speed", "Sequences", "Simple setup"],
        focusCriterionSlug: "ease-of-use",
        icon: "zap",
      },
      {
        id: "high-volume",
        title: "High-volume follow-up",
        description:
          "Needs durable workflows and activity visibility.",
        priorities: ["Automation depth", "Reporting", "Scale"],
        focusCriterionSlug: "sales-automation",
        icon: "users",
      },
      {
        id: "sales-ops",
        title: "Sales-ops standardized process",
        description:
          "Needs configurable rules and administration control.",
        priorities: ["Customization", "Administration", "Automation"],
        focusCriterionSlug: "customization",
        icon: "settings",
      },
    ],
    useCaseLinks: [
      {
        id: "high-volume",
        title: "High-volume lead management",
        description:
          "Automation is often critical when prospect volume is high.",
        importanceLabel: "Critical",
        href: "/industries/financial-services/#use-cases",
        icon: "users",
      },
      {
        id: "complex",
        title: "Complex sales processes",
        description:
          "Stage-triggered follow-up helps keep multi-step processes moving.",
        importanceLabel: "High",
        href: "/industries/financial-services/use-cases/complex-sales-processes/",
        icon: "layers",
      },
      {
        id: "advisory",
        title: "Advisory & relationship management",
        description:
          "Useful for reminders; less central than relationship history.",
        importanceLabel: "Medium",
        href: "/industries/financial-services/use-cases/advisory-relationship-management/",
        icon: "handshake",
      },
    ],
    industryContexts: [
      {
        industrySlug: "financial-services",
        title: "Financial Services",
        summary:
          "Helps standardize follow-ups across advisory and sales teams handling inbound or nurture leads.",
        href: "/industries/financial-services/requirements/automate-lead-follow-up/",
        importanceSummary:
          "Financial-services teams often lose opportunities when follow-up depends only on individual discipline. Automation helps after the lead process is clear.",
        eyebrowOverride: "Financial services CRM requirement",
        displayTitleOverride:
          "Automate Lead Follow-Up for Financial Services CRM",
        taglineOverride:
          "Compare CRM automation for financial-services lead follow-up — workflows, sequences, plan gating and evidence.",
        useCaseRelationships: [
          {
            id: "complex",
            title: "Complex sales processes",
            description:
              "Stage-based follow-up supports multi-step financial-services sales.",
            importanceLabel: "High",
            href: "/industries/financial-services/use-cases/complex-sales-processes/",
            icon: "layers",
          },
        ],
        tradeoffs: [
          {
            id: "noise",
            title: "Consistency vs alert noise",
            description:
              "Over-automation can create task noise if ownership rules are unclear.",
          },
        ],
      },
    ],
    relatedRequirementSlugs: ["separate-sales-processes"],
    relatedCapabilitySlugs: [
      "workflow-automation",
      "pipeline-management",
      "reporting",
    ],
    tradeoffs: [
      {
        id: "plan-gating",
        title: "Plan gating",
        description:
          "Meaningful automation and sequences are frequently limited to higher plans.",
        icon: "chart",
      },
      {
        id: "process-first",
        title: "Automate after clarity",
        description:
          "Automating an unclear lead process amplifies inconsistency.",
        icon: "settings",
      },
      {
        id: "maintenance",
        title: "Rules maintenance",
        description:
          "Automations need owners and review when processes change.",
        icon: "layers",
      },
    ],
    vendorQuestions: [
      "Which events can trigger lead follow-up workflows?",
      "Can tasks be created automatically when a lead goes inactive?",
      "Which automation features require higher-tier plans?",
      "Are there monthly automation or sequence usage limits?",
      "Can sequences and workflows work together?",
      "How do we audit or debug failed automations?",
      "Can managers report on follow-up SLA performance?",
    ],
    faq: [
      {
        question: "What does automate lead follow-up mean?",
        answer:
          "It means the CRM can trigger reminders, tasks, updates or multi-step outreach when lead conditions occur — instead of relying only on manual memory.",
      },
      {
        question: "Is workflow automation enough on its own?",
        answer:
          "It is usually the foundation. Email sequences and sales automation often complete the follow-up experience. We evaluate those as related supporting features.",
      },
      {
        question: "Do free CRM plans include follow-up automation?",
        answer:
          "Often not, or only in limited form. Check plan impact — unverified products are marked Not verified.",
      },
      {
        question: "Can automation differ by pipeline or team?",
        answer:
          "It depends on the product. Ask vendors and verify with current evidence on the related Workflow Automation feature page.",
      },
    ],
    screenshotMatchTerms: ["automation", "workflow", "sequence", "lead"],
    matrixFeatureSlugs: [
      "workflow-automation",
      "sales-automation",
      "email-sequences",
      "lead-management",
      "reporting",
    ],
    finderHref: "/tools/crm-finder/",
    calculatorHref: "/tools/crm-cost-calculator/",
    compareHref: "/compare/",
    methodologyHref: COMPANY_ROUTES.methodology,
  });
}
