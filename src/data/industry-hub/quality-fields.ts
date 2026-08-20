import type { IndustryHubProfile } from "@/domain";
import { COMPANY_ROUTES } from "@/services/site-foundation";

/**
 * Quality-scored profile fields for industry hubs that already have narrative
 * depth in deep.ts but were missing priorities / use-cases / security /
 * implementation / Finder wiring (quality agent reads the profile, not UI defaults).
 *
 * Educational only — no rankings, invented prices, or product endorsements.
 */

type QualityPack = Pick<
  IndustryHubProfile,
  | "priorities"
  | "useCases"
  | "implementationConsiderations"
  | "evaluationQuestions"
  | "securityDimensions"
  | "securityDisclaimer"
  | "buyingFramework"
  | "finderHref"
  | "calculatorHref"
  | "compareHref"
  | "catalogueHref"
  | "methodologyHref"
  | "buyingGuideHref"
  | "featuredGuideHrefs"
  | "relatedIndustrySlugs"
  | "productFitGuidance"
  | "lastReviewedAt"
>;

const REVIEWED = "2026-08-15";

const SHARED_SECURITY: QualityPack["securityDimensions"] = [
  {
    id: "access",
    title: "Data access controls",
    description: "Who can see and change customer, deal, and activity records.",
    requirementSlug: "restrict-access-by-team",
  },
  {
    id: "permissions",
    title: "User permissions",
    description: "Role-based permissions so reps, managers, and admins see different fields.",
    requirementSlug: "restrict-access-by-team",
  },
  {
    id: "audit",
    title: "Auditability",
    description: "Visibility into who changed records and when.",
    requirementSlug: "audit-user-activity",
  },
  {
    id: "retention",
    title: "Data retention & export",
    description: "How you retain, export, and delete customer data when you leave.",
    requirementSlug: "retain-and-export-data",
  },
  {
    id: "sso",
    title: "Identity / SSO",
    description: "How users sign in — especially if IT requires SSO.",
    requirementSlug: "support-sso",
  },
  {
    id: "integration-security",
    title: "Integration security",
    description: "How connected tools exchange data without leaking credentials.",
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
    description: "What the vendor publishes for a security review (trust center, SOC reports).",
    requirementSlug: "review-vendor-security-docs",
  },
];

function disclaimer(vertical: string): string {
  return `Security and compliance needs for ${vertical} vary by organization, jurisdiction, and customer contracts. Verify requirements with shortlisted vendors using trust centers and certification documents — not marketing pages. This section is educational and is not legal advice.`;
}

function sharedLinks(industrySlug: string): Pick<
  QualityPack,
  | "finderHref"
  | "calculatorHref"
  | "compareHref"
  | "catalogueHref"
  | "methodologyHref"
  | "buyingGuideHref"
  | "featuredGuideHrefs"
  | "lastReviewedAt"
> {
  return {
    finderHref: "/tools/crm-finder/",
    calculatorHref: "/tools/crm-cost-calculator/",
    compareHref: "/compare/",
    catalogueHref: "/categories/crm/",
    methodologyHref: COMPANY_ROUTES.methodology,
    buyingGuideHref: "/guides/how-to-choose-crm/",
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/crm-evaluation-guide/",
      "/guides/crm-requirements-guide/",
    ],
    lastReviewedAt: REVIEWED,
  };
}

function buyingSteps(
  industrySlug: string,
  steps: Array<{ title: string; description: string; href: string; cta: string }>,
): QualityPack["buyingFramework"] {
  return steps.map((s, i) => ({
    step: i + 1,
    title: s.title,
    description: s.description,
    href: s.href,
    ctaLabel: s.cta,
  }));
}

function pack(
  industrySlug: string,
  verticalLabel: string,
  partial: Omit<
    QualityPack,
    | "finderHref"
    | "calculatorHref"
    | "compareHref"
    | "catalogueHref"
    | "methodologyHref"
    | "buyingGuideHref"
    | "featuredGuideHrefs"
    | "lastReviewedAt"
    | "securityDimensions"
    | "securityDisclaimer"
    | "productFitGuidance"
  > &
    Partial<
      Pick<
        QualityPack,
        | "securityDimensions"
        | "securityDisclaimer"
        | "productFitGuidance"
        | "featuredGuideHrefs"
        | "buyingGuideHref"
      >
    >,
): QualityPack {
  return {
    ...sharedLinks(industrySlug),
    securityDimensions: partial.securityDimensions ?? SHARED_SECURITY,
    securityDisclaimer: partial.securityDisclaimer ?? disclaimer(verticalLabel),
    priorities: partial.priorities,
    useCases: partial.useCases,
    implementationConsiderations: partial.implementationConsiderations,
    evaluationQuestions: partial.evaluationQuestions,
    buyingFramework: partial.buyingFramework,
    relatedIndustrySlugs: partial.relatedIndustrySlugs,
    productFitGuidance: partial.productFitGuidance ?? [],
    ...(partial.featuredGuideHrefs?.length
      ? { featuredGuideHrefs: partial.featuredGuideHrefs }
      : {}),
    ...(partial.buyingGuideHref
      ? { buyingGuideHref: partial.buyingGuideHref }
      : {}),
  };
}

export type { QualityPack };
export { pack as buildIndustryQualityPack, buyingSteps as buildIndustryBuyingSteps };

export const industryQualityBySlug: Record<string, QualityPack> = {
  saas: pack("saas", "SaaS / software companies", {
    relatedIndustrySlugs: [
      "small-business",
      "retail-ecommerce",
      "financial-services",
      "education",
    ],
    featuredGuideHrefs: [
      "/guides/how-to-choose-crm/",
      "/guides/how-to-choose-sales-intelligence/",
      "/guides/crm-evaluation-guide/",
      "/guides/crm-requirements-guide/",
    ],
    priorities: [
      {
        id: "demo-capture",
        title: "Demo & trial capture",
        description:
          "Every inbound demo or trial gets an owner and next step the same day — not a shared inbox pile.",
        icon: "zap",
        capabilitySlug: "lead-management",
      },
      {
        id: "pipeline-truth",
        title: "Honest pipeline stages",
        description:
          "Stages match how you actually sell (demo → proposal → close), so coaching and forecasts stay usable.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "email-sync",
        title: "Email & calendar sync",
        description:
          "AE and SDR activity lands on the deal without copy-paste from Gmail or Outlook.",
        icon: "mail",
        capabilitySlug: "email",
      },
      {
        id: "handoff",
        title: "Sales-to-success handoff",
        description:
          "Won deals carry stakeholders, use-case notes, and next actions into onboarding.",
        icon: "handshake",
        capabilitySlug: "relationship-management",
      },
      {
        id: "light-reporting",
        title: "Light, trusted reporting",
        description:
          "Managers see stage health and stuck deals without a BI project on week one.",
        icon: "chart",
        capabilitySlug: "reporting",
      },
      {
        id: "integrations",
        title: "GTM stack connections",
        description:
          "Product analytics, billing, and support tools can sync into one account record over time.",
        icon: "puzzle",
        capabilitySlug: "integrations",
      },
      {
        id: "sales-intelligence",
        title: "Complementary sales intelligence",
        description:
          "After CRM ownership is real, SaaS GTM teams often add contact data and sequencing tools that write into the account record — not a second CRM.",
        icon: "target",
        href: "/categories/sales-intelligence/",
      },
    ],
    useCases: [
      {
        id: "inbound",
        title: "Inbound demo pipeline",
        bestWhen: "Product-led or marketing-led demos need same-day owners.",
        icon: "users",
        useCaseSlug: "inbound-sales",
        href: "/use-cases/inbound-sales/",
      },
      {
        id: "outbound",
        title: "Outbound / SDR motion",
        bestWhen: "SDRs book meetings that AEs must inherit with full context.",
        icon: "phone",
        useCaseSlug: "outbound-sales",
        href: "/use-cases/outbound-sales/",
      },
      {
        id: "prospecting",
        title: "Prospecting lists in CRM",
        bestWhen:
          "Founder-led or SDR teams need owned target accounts before the first conversation.",
        icon: "target",
        useCaseSlug: "prospecting",
        href: "/use-cases/prospecting/",
      },
      {
        id: "sales-engagement",
        title: "Sales engagement cadences",
        bestWhen:
          "Outbound pods run multi-channel sequences that must log back to CRM.",
        icon: "zap",
        useCaseSlug: "sales-engagement",
        href: "/use-cases/sales-engagement/",
      },
      {
        id: "pipeline",
        title: "AE pipeline management",
        bestWhen: "Multi-stage B2B deals need clear next steps and forecast hygiene.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "expansion",
        title: "Expansion & renewal visibility",
        bestWhen: "CS and sales share account history after the first close.",
        icon: "trending",
        useCaseSlug: "account-management",
        href: "/use-cases/account-management/",
      },
      {
        id: "automation",
        title: "Follow-up automation",
        bestWhen: "Reps need sequences that stop on reply without spreadsheet reminders.",
        icon: "zap",
        useCaseSlug: "sales-automation",
        href: "/use-cases/sales-automation/",
      },
    ],
    implementationConsiderations: [
      {
        id: "stages",
        title: "Freeze a short stage set",
        description:
          "Example: agree five stages the whole GTM team can explain before importing historical deals.",
        icon: "layers",
      },
      {
        id: "routing",
        title: "Demo routing rules",
        description:
          "Decide who owns inbound demos (round-robin, territory, or product line) before go-live week.",
        icon: "git-branch",
      },
      {
        id: "fields",
        title: "Must-have fields only",
        description:
          "Start with owner, next step, source, and close date — add ICP fields after hygiene is real.",
        icon: "form",
      },
      {
        id: "handoff-play",
        title: "Closed-won handoff play",
        description:
          "Write what CS needs on day one (stakeholders, use case, risk notes) and make it a required stage exit.",
        icon: "clipboard",
      },
    ],
    evaluationQuestions: [
      { question: "How are inbound demos and trials assigned to an owner within a day?" },
      { question: "Can we keep a short stage set and still report week-over-week without rebuilds?" },
      { question: "How does email/calendar sync attach activity to the right deal?" },
      { question: "What happens to notes and stakeholders when a deal is marked closed-won?" },
      { question: "Which native integrations cover our product analytics, billing, and support tools?" },
      { question: "What admin work is required when we add SDRs or a second product line?" },
      { question: "Which capabilities are locked behind higher plans we would need in year one?" },
      {
        question:
          "If we add sales intelligence for lists or sequences, which fields may write into CRM — and which must never overwrite?",
      },
    ],
    buyingFramework: buyingSteps("saas", [
      {
        title: "Map your GTM motion",
        description:
          "Write how demos, trials, and outbound meetings move today — including the messy handoffs.",
        href: "/use-cases/inbound-sales/",
        cta: "Inbound sales use case",
      },
      {
        title: "Pick must-have capabilities",
        description:
          "Focus on lead capture, pipeline, email sync, and reporting before advanced AI features.",
        href: "/capabilities/pipeline-management/",
        cta: "Pipeline capability",
      },
      {
        title: "Check stack fit",
        description:
          "List the three systems that must sync in the first 90 days.",
        href: "/capabilities/integrations/",
        cta: "Integrations capability",
      },
      {
        title: "Estimate seat cost",
        description:
          "Model AE + SDR seats and plan tiers with researched list prices.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description:
          "Run CRM Finder with your team size and priorities, then trial with real demos.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
      {
        title: "Add sales intelligence for outbound GTM (optional)",
        description:
          "When list building or sequencing is the bottleneck — not CRM ownership — compare complementary sales intelligence tools that sync into your CRM.",
        href: "/best/sales-intelligence-software/",
        cta: "Best sales intelligence",
      },
    ]),
  }),

  "small-business": pack("small-business", "small businesses", {
    relatedIndustrySlugs: ["saas", "retail-ecommerce", "real-estate", "nonprofit"],
    priorities: [
      {
        id: "simple-pipeline",
        title: "A pipeline everyone will update",
        description:
          "Three to five stages a busy owner can maintain without a RevOps hire.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "follow-up",
        title: "Reliable follow-up",
        description:
          "Reminders and tasks so warm leads do not die in a personal inbox.",
        icon: "bell",
        capabilitySlug: "sales-engagement",
      },
      {
        id: "contacts",
        title: "One place for contacts",
        description:
          "Customers and prospects stop living only in phones, email, and sticky notes.",
        icon: "users",
        capabilitySlug: "contact-management",
      },
      {
        id: "fast-setup",
        title: "Fast setup",
        description:
          "You can go live in days with defaults — not a six-month implementation project.",
        icon: "zap",
        capabilitySlug: "customization",
      },
      {
        id: "affordable",
        title: "Clear, affordable pricing",
        description:
          "Seat cost and plan limits are understandable before you buy.",
        icon: "wallet",
        capabilitySlug: "administration",
      },
      {
        id: "mobile",
        title: "Works on the go",
        description:
          "Owners and sellers can log notes from a phone between jobs or visits.",
        icon: "smartphone",
        capabilitySlug: "mobile",
      },
    ],
    useCases: [
      {
        id: "owner-led",
        title: "Owner-led selling",
        bestWhen: "The founder still closes most deals and needs a simple board.",
        icon: "user",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "followups",
        title: "Customer follow-up",
        bestWhen: "Quotes and callbacks fall through when the week gets busy.",
        icon: "bell",
        useCaseSlug: "customer-follow-up",
        href: "/use-cases/customer-follow-up/",
      },
      {
        id: "contacts",
        title: "Contact management",
        bestWhen: "Customer history is scattered across email and phones.",
        icon: "users",
        useCaseSlug: "contact-management",
        href: "/use-cases/contact-management/",
      },
      {
        id: "small-team",
        title: "Small sales team coordination",
        bestWhen: "Two to ten sellers need shared visibility without heavy process.",
        icon: "users",
        useCaseSlug: "relationship-management",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "reporting",
        title: "Simple weekly reporting",
        bestWhen: "You need a Friday view of open deals, not a BI stack.",
        icon: "chart",
        useCaseSlug: "reporting",
        href: "/use-cases/reporting/",
      },
    ],
    implementationConsiderations: [
      {
        id: "import",
        title: "Start from a clean contact list",
        description:
          "Example: export email contacts, delete duplicates, then import once — do not migrate every old spreadsheet column.",
        icon: "database",
      },
      {
        id: "habits",
        title: "Pick one daily habit",
        description:
          "Agree that every call ends with a next step on the deal before the day ends.",
        icon: "check",
      },
      {
        id: "admin",
        title: "Name a part-time admin",
        description:
          "Someone owns fields and users so the system does not silently rot.",
        icon: "settings",
      },
      {
        id: "scope",
        title: "Resist over-building",
        description:
          "Skip marketing automation and custom objects until the pipeline is actually used.",
        icon: "scissors",
      },
    ],
    evaluationQuestions: [
      { question: "Can a non-technical owner set this up without a consultant?" },
      { question: "What is the true monthly cost for our seat count on the plan we need?" },
      { question: "How hard is it to import contacts from email or spreadsheets?" },
      { question: "Does mobile work well enough for notes between meetings?" },
      { question: "What happens if we outgrow the starter plan in a year?" },
      { question: "Can we export our data cleanly if we leave?" },
    ],
    buyingFramework: buyingSteps("small-business", [
      {
        title: "Write your current follow-up mess",
        description:
          "List where leads live today (inbox, phone, sheet) and what drops weekly.",
        href: "/for/small-business/",
        cta: "CRM for small business",
      },
      {
        title: "Choose a simple pipeline",
        description:
          "Limit yourself to a few stages you will actually update.",
        href: "/use-cases/pipeline-management/",
        cta: "Pipeline use case",
      },
      {
        title: "Check price for your seats",
        description:
          "Model cost before you fall in love with feature lists.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist practical tools",
        description:
          "Use Finder with small-team constraints — not enterprise checklists.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
      {
        title: "Trial with real leads",
        description:
          "Run five live opportunities through the tool before paying annually.",
        href: "/guides/crm-trial-evaluation/",
        cta: "Trial evaluation guide",
      },
    ]),
  }),

  "real-estate": pack("real-estate", "real-estate teams", {
    relatedIndustrySlugs: [
      "construction",
      "financial-services",
      "small-business",
      "hospitality",
    ],
    priorities: [
      {
        id: "lead-speed",
        title: "Speed-to-lead on inquiries",
        description:
          "Portal and web leads get a named agent response before they go cold.",
        icon: "zap",
        capabilitySlug: "lead-management",
      },
      {
        id: "listing-context",
        title: "Listing & buyer context",
        description:
          "Property interest, budget, and timeline sit on the contact — not only in chat apps.",
        icon: "home",
        capabilitySlug: "contact-management",
      },
      {
        id: "pipeline",
        title: "Deal stages that match closings",
        description:
          "Stages reflect showing → offer → under contract → closed, with clear owners.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "nurture",
        title: "Long nurture without losing touch",
        description:
          "Buyers who are 6–18 months out still get timely, relevant follow-up.",
        icon: "mail",
        capabilitySlug: "sales-engagement",
      },
      {
        id: "mobile",
        title: "Mobile between showings",
        description:
          "Agents log notes and next steps from the car without waiting for desktop.",
        icon: "smartphone",
        capabilitySlug: "mobile",
      },
      {
        id: "team-visibility",
        title: "Broker / team visibility",
        description:
          "Managers see coverage and stalled deals without chasing individual inboxes.",
        icon: "chart",
        capabilitySlug: "reporting",
      },
    ],
    useCases: [
      {
        id: "leads",
        title: "High-volume lead response",
        bestWhen: "Portal leads arrive faster than agents can triage manually.",
        icon: "users",
        useCaseSlug: "high-volume-lead-management",
        href: "/use-cases/high-volume-lead-management/",
      },
      {
        id: "pipeline",
        title: "Listing-to-close pipeline",
        bestWhen: "Transactions need stage discipline across a team.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "field",
        title: "Field / showing activity",
        bestWhen: "Most client work happens off-desk.",
        icon: "map",
        useCaseSlug: "field-sales",
        href: "/use-cases/field-sales/",
      },
      {
        id: "follow-up",
        title: "Buyer nurture follow-up",
        bestWhen: "Long buying cycles need scheduled touches.",
        icon: "bell",
        useCaseSlug: "customer-follow-up",
        href: "/use-cases/customer-follow-up/",
      },
      {
        id: "relationships",
        title: "Sphere / referral relationships",
        bestWhen: "Past clients and partners drive repeat business.",
        icon: "handshake",
        useCaseSlug: "relationship-management",
        href: "/use-cases/relationship-management/",
      },
    ],
    implementationConsiderations: [
      {
        id: "sources",
        title: "Tag every lead source",
        description:
          "Example: Zillow vs website vs referral — so you stop arguing which channel works.",
        icon: "tag",
      },
      {
        id: "sla",
        title: "Set a response SLA",
        description:
          "Agree that new portal leads get a call/SMS within a fixed window, tracked in CRM.",
        icon: "clock",
      },
      {
        id: "shared",
        title: "Decide shared vs private contacts",
        description:
          "Brokerage policy on who can see whom prevents quiet lead-poaching fights later.",
        icon: "lock",
      },
      {
        id: "mobile-first",
        title: "Train on mobile first",
        description:
          "If agents will not open a laptop between showings, desktop-only habits will fail.",
        icon: "smartphone",
      },
    ],
    evaluationQuestions: [
      { question: "How fast can a new portal lead be assigned and contacted?" },
      { question: "Can agents update deals reliably from a phone?" },
      { question: "How do we keep long-nurture buyers from disappearing?" },
      { question: "What reporting does a broker need weekly without spreadsheets?" },
      { question: "How are permissions handled across teams or offices?" },
      { question: "Which listing/portal tools must connect in the first 90 days?" },
    ],
    buyingFramework: buyingSteps("real-estate", [
      {
        title: "Map lead sources",
        description: "List where inquiries arrive and who responds today.",
        href: "/use-cases/high-volume-lead-management/",
        cta: "High-volume leads",
      },
      {
        title: "Define deal stages",
        description: "Write the stages from first inquiry to closed.",
        href: "/use-cases/pipeline-management/",
        cta: "Pipeline use case",
      },
      {
        title: "Check mobile reality",
        description: "Trial the mobile experience with two agents for a week.",
        href: "/capabilities/mobile/",
        cta: "Mobile capability",
      },
      {
        title: "Estimate seats",
        description: "Model agents + admin seats with researched list prices.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description: "Filter for lead speed, mobile, and team visibility.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
  }),

  healthcare: pack("healthcare", "healthcare organizations", {
    relatedIndustrySlugs: [
      "financial-services",
      "nonprofit",
      "education",
      "legal-services",
    ],
    priorities: [
      {
        id: "relationship",
        title: "Patient / referring-provider relationships",
        description:
          "Keep referral and relationship context without turning CRM into an EHR replacement.",
        icon: "users",
        capabilitySlug: "relationship-management",
      },
      {
        id: "pipeline",
        title: "Outreach & partnership pipelines",
        description:
          "Track BD, referrals, and institutional relationships with clear owners.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "access",
        title: "Access discipline",
        description:
          "Role-based visibility matters when relationship data sits near sensitive operational context.",
        icon: "shield",
        capabilitySlug: "security",
      },
      {
        id: "activity",
        title: "Activity & follow-up discipline",
        description:
          "Outreach tasks and next reviews are visible — not buried in individual inboxes.",
        icon: "check",
        capabilitySlug: "sales-engagement",
      },
      {
        id: "reporting",
        title: "Pipeline & activity reporting",
        description:
          "Leaders see coverage and stalled outreach without rebuilding sheets.",
        icon: "chart",
        capabilitySlug: "reporting",
      },
      {
        id: "integrations",
        title: "Careful integrations",
        description:
          "Connect only what governance allows; confirm vendor security docs before syncing.",
        icon: "puzzle",
        capabilitySlug: "integrations",
      },
    ],
    useCases: [
      {
        id: "referrals",
        title: "Referral relationship management",
        bestWhen: "Referring providers and partners need structured follow-up.",
        icon: "handshake",
        useCaseSlug: "relationship-management",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "bd",
        title: "Institutional / BD pipeline",
        bestWhen: "Partnerships and outreach run like multi-stage sales.",
        icon: "funnel",
        useCaseSlug: "complex-sales-processes",
        href: "/use-cases/complex-sales-processes/",
      },
      {
        id: "follow-up",
        title: "Coordinated follow-up",
        bestWhen: "Multiple coordinators share the same relationship book.",
        icon: "bell",
        useCaseSlug: "customer-follow-up",
        href: "/use-cases/customer-follow-up/",
      },
      {
        id: "reporting",
        title: "Leadership reporting",
        bestWhen: "Weekly visibility into outreach health is required.",
        icon: "chart",
        useCaseSlug: "reporting",
        href: "/use-cases/reporting/",
      },
      {
        id: "admin",
        title: "Governed administration",
        bestWhen: "IT/compliance must approve access and retention rules.",
        icon: "shield",
        useCaseSlug: "account-management",
        href: "/use-cases/account-management/",
      },
    ],
    implementationConsiderations: [
      {
        id: "boundary",
        title: "Draw the CRM vs EHR boundary",
        description:
          "Example: CRM holds referral outreach; clinical records stay in systems designed for care documentation.",
        icon: "layers",
      },
      {
        id: "access-review",
        title: "Plan access reviews",
        description:
          "Schedule who can see which relationship books before importing contacts.",
        icon: "lock",
      },
      {
        id: "minimum-fields",
        title: "Minimum necessary fields",
        description:
          "Collect only what outreach needs — avoid turning CRM into a shadow clinical chart.",
        icon: "form",
      },
      {
        id: "vendor-security",
        title: "Vendor security packet",
        description:
          "Request trust-center docs early; do not rely on sales decks for assurance.",
        icon: "file",
      },
    ],
    evaluationQuestions: [
      { question: "What data belongs in CRM versus clinical systems — and who decided?" },
      { question: "What access controls and audit logs are available?" },
      { question: "How do we handle retention, export, and deletion requests?" },
      { question: "Which integrations are allowed under our governance model?" },
      { question: "Can we separate relationship pipelines from sensitive operational notes?" },
      { question: "What does implementation look like with IT and compliance involved?" },
    ],
    buyingFramework: buyingSteps("healthcare", [
      {
        title: "Define CRM’s job",
        description:
          "Write what CRM will and will not store relative to clinical systems.",
        href: "/guides/crm-requirements-guide/",
        cta: "Requirements guide",
      },
      {
        title: "List must-have controls",
        description:
          "Access, audit, retention, and SSO needs before feature shopping.",
        href: "/capabilities/security/",
        cta: "Security capability",
      },
      {
        title: "Map outreach workflows",
        description:
          "Referral and partnership stages with owners and SLAs.",
        href: "/use-cases/relationship-management/",
        cta: "Relationship use case",
      },
      {
        title: "Review vendor security docs",
        description:
          "Collect trust-center materials for shortlisted vendors.",
        href: "/requirements/review-vendor-security-docs/",
        cta: "Vendor security requirement",
      },
      {
        title: "Shortlist with Finder",
        description:
          "Filter on administration and relationship needs, then trial carefully.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
  }),

  "retail-ecommerce": pack("retail-ecommerce", "retail & ecommerce teams", {
    relatedIndustrySlugs: ["saas", "hospitality", "small-business", "manufacturing"],
    priorities: [
      {
        id: "customer-context",
        title: "Customer & order context",
        description:
          "Support and sales see purchase history context without living only inside the storefront admin.",
        icon: "users",
        capabilitySlug: "contact-management",
      },
      {
        id: "lifecycle",
        title: "Lifecycle follow-up",
        description:
          "Cart, browse, and post-purchase follow-ups are owned — not random email blasts.",
        icon: "mail",
        capabilitySlug: "sales-engagement",
      },
      {
        id: "b2b",
        title: "B2B / wholesale pipeline (when needed)",
        description:
          "Wholesale or partnership deals get stages and owners separate from DTC tickets.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "integrations",
        title: "Commerce stack connections",
        description:
          "Shopify/order, helpdesk, and email tools can sync without spreadsheet glue.",
        icon: "puzzle",
        capabilitySlug: "integrations",
      },
      {
        id: "segmentation",
        title: "Practical segmentation",
        description:
          "Teams can group customers by behavior for outreach without a data-science project.",
        icon: "filter",
        capabilitySlug: "customization",
      },
      {
        id: "reporting",
        title: "Shared customer reporting",
        description:
          "Marketing, CX, and sales stop arguing from three different dashboards.",
        icon: "chart",
        capabilitySlug: "reporting",
      },
    ],
    useCases: [
      {
        id: "inbound",
        title: "Inbound customer conversations",
        bestWhen: "High-intent shoppers need owned follow-up beyond the cart email.",
        icon: "inbox",
        useCaseSlug: "inbound-sales",
        href: "/use-cases/inbound-sales/",
      },
      {
        id: "automation",
        title: "Lifecycle automation",
        bestWhen: "Repeatable post-purchase or win-back steps should run consistently.",
        icon: "zap",
        useCaseSlug: "sales-automation",
        href: "/use-cases/sales-automation/",
      },
      {
        id: "accounts",
        title: "Wholesale account management",
        bestWhen: "B2B buyers need relationship owners and renewal rhythm.",
        icon: "building",
        useCaseSlug: "account-management",
        href: "/use-cases/account-management/",
      },
      {
        id: "pipeline",
        title: "Partnership / retail pipeline",
        bestWhen: "Brand partnerships or marketplace deals need stages.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "reporting",
        title: "Cross-team reporting",
        bestWhen: "CX and growth need one customer timeline.",
        icon: "chart",
        useCaseSlug: "reporting",
        href: "/use-cases/reporting/",
      },
    ],
    implementationConsiderations: [
      {
        id: "identity",
        title: "Decide the customer identity key",
        description:
          "Example: email vs customer ID — so storefront and CRM do not create duplicate people.",
        icon: "key",
      },
      {
        id: "scope",
        title: "Start with one journey",
        description:
          "Automate post-purchase or VIP outreach first; do not rebuild every marketing flow on day one.",
        icon: "target",
      },
      {
        id: "sync",
        title: "Pick sync direction",
        description:
          "Document which system wins when order status and CRM fields disagree.",
        icon: "git-branch",
      },
      {
        id: "privacy",
        title: "Respect consent & suppression",
        description:
          "Wire unsubscribe and preference rules before launching sequences.",
        icon: "shield",
      },
    ],
    evaluationQuestions: [
      { question: "How do storefront customers match to CRM contacts without duplicates?" },
      { question: "Which commerce and helpdesk tools must sync in the first 90 days?" },
      { question: "Can we run lifecycle follow-up without a separate ESP for every message?" },
      { question: "How do wholesale or partnership deals differ from DTC support tickets?" },
      { question: "What reporting do growth and CX share weekly?" },
      { question: "How are consent and suppression lists enforced?" },
    ],
    buyingFramework: buyingSteps("retail-ecommerce", [
      {
        title: "Name the customer job",
        description:
          "DTC support context, lifecycle outreach, wholesale, or all three?",
        href: "/use-cases/contact-management/",
        cta: "Contact management",
      },
      {
        title: "List must-connect systems",
        description:
          "Storefront, email, and helpdesk come first.",
        href: "/capabilities/integrations/",
        cta: "Integrations",
      },
      {
        title: "Define one pilot journey",
        description:
          "Pick a single automated follow-up to prove hygiene.",
        href: "/use-cases/sales-automation/",
        cta: "Sales automation",
      },
      {
        title: "Estimate cost",
        description:
          "Model seats for CX + growth + sales owners.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description:
          "Filter for integrations and lifecycle needs.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
  }),

  "legal-services": pack("legal-services", "legal services firms", {
    relatedIndustrySlugs: [
      "financial-services",
      "healthcare",
      "small-business",
      "education",
    ],
    priorities: [
      {
        id: "matters",
        title: "Matter / relationship context",
        description:
          "Contacts, related parties, and open opportunities stay connected without replacing practice management.",
        icon: "briefcase",
        capabilitySlug: "relationship-management",
      },
      {
        id: "bd-pipeline",
        title: "Business-development pipeline",
        description:
          "Pitches and panel opportunities have stages, owners, and next actions.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "confidentiality",
        title: "Confidentiality-aware access",
        description:
          "Ethical walls and team boundaries can be reflected in permissions.",
        icon: "shield",
        capabilitySlug: "security",
      },
      {
        id: "activity",
        title: "BD activity discipline",
        description:
          "Partners and BD teams log follow-ups so coverage does not depend on memory.",
        icon: "check",
        capabilitySlug: "sales-engagement",
      },
      {
        id: "reporting",
        title: "Pipeline reporting for leadership",
        description:
          "Managing partners see BD health without rebuilding partner spreadsheets.",
        icon: "chart",
        capabilitySlug: "reporting",
      },
      {
        id: "integrations",
        title: "Selective integrations",
        description:
          "Connect email/calendar first; confirm any PMS or DMS links with IT and risk.",
        icon: "puzzle",
        capabilitySlug: "integrations",
      },
    ],
    useCases: [
      {
        id: "bd",
        title: "Law firm business development",
        bestWhen: "Partners need a shared pitch pipeline.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "relationships",
        title: "Client & referral relationships",
        bestWhen: "Referral sources and clients need long-term stewardship.",
        icon: "handshake",
        useCaseSlug: "relationship-management",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "complex",
        title: "Complex multi-stakeholder pursuits",
        bestWhen: "RFPs and panels involve many internal contributors.",
        icon: "layers",
        useCaseSlug: "complex-sales-processes",
        href: "/use-cases/complex-sales-processes/",
      },
      {
        id: "follow-up",
        title: "Systematic follow-up",
        bestWhen: "Warm introductions stall without reminders.",
        icon: "bell",
        useCaseSlug: "customer-follow-up",
        href: "/use-cases/customer-follow-up/",
      },
      {
        id: "reporting",
        title: "Leadership BD reporting",
        bestWhen: "Weekly BD reviews need one trusted board.",
        icon: "chart",
        useCaseSlug: "reporting",
        href: "/use-cases/reporting/",
      },
    ],
    implementationConsiderations: [
      {
        id: "boundary",
        title: "CRM vs practice management",
        description:
          "Example: CRM tracks pursuits and relationships; time/billing stays in PMS unless risk approves a sync.",
        icon: "layers",
      },
      {
        id: "walls",
        title: "Ethical wall design",
        description:
          "Document which teams must not see which relationship books before importing contacts.",
        icon: "lock",
      },
      {
        id: "partner-habits",
        title: "Partner adoption plan",
        description:
          "Start with BD coordinators updating boards; partners review, then gradually log their own next steps.",
        icon: "users",
      },
      {
        id: "fields",
        title: "Matter-safe fields only",
        description:
          "Avoid dumping privileged work product into free-text CRM notes.",
        icon: "file",
      },
    ],
    evaluationQuestions: [
      { question: "How do permissions support ethical walls or team separation?" },
      { question: "What belongs in CRM versus practice management?" },
      { question: "Can BD pipelines run without exposing sensitive matter detail?" },
      { question: "What audit logs exist for access and changes?" },
      { question: "How do we export or delete data for departing clients or laterals?" },
      { question: "Which email/calendar integrations work with our tenant policies?" },
    ],
    buyingFramework: buyingSteps("legal-services", [
      {
        title: "Separate BD from matter work",
        description:
          "Write the CRM job description so it does not become a second DMS.",
        href: "/guides/crm-requirements-guide/",
        cta: "Requirements guide",
      },
      {
        title: "Define access rules",
        description:
          "List teams, walls, and admin owners before demos.",
        href: "/capabilities/security/",
        cta: "Security capability",
      },
      {
        title: "Design the BD board",
        description:
          "Stages from introduction to engagement letter.",
        href: "/use-cases/pipeline-management/",
        cta: "Pipeline use case",
      },
      {
        title: "Cost & seats",
        description:
          "Model partners, associates, and BD ops seats.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description:
          "Filter for administration and relationship needs.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
  }),

  manufacturing: pack("manufacturing", "manufacturing companies", {
    relatedIndustrySlugs: [
      "construction",
      "transportation-logistics",
      "retail-ecommerce",
      "saas",
    ],
    priorities: [
      {
        id: "account",
        title: "Account & plant relationships",
        description:
          "Multi-site buyers and influencers stay mapped on one account record.",
        icon: "building",
        capabilitySlug: "relationship-management",
      },
      {
        id: "long-cycle",
        title: "Long-cycle opportunity tracking",
        description:
          "Quotes, samples, and approvals do not disappear between quarters.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "field",
        title: "Field / distributor activity",
        description:
          "Reps and partners log visits and next steps without waiting for HQ spreadsheets.",
        icon: "map",
        capabilitySlug: "mobile",
      },
      {
        id: "forecast",
        title: "Forecastable pipeline",
        description:
          "Operations and sales share a realistic view of what might ship.",
        icon: "chart",
        capabilitySlug: "forecasting",
      },
      {
        id: "integrations",
        title: "ERP / quoting connections (when ready)",
        description:
          "CRM does not replace ERP — but can sync account and opportunity status carefully.",
        icon: "puzzle",
        capabilitySlug: "integrations",
      },
      {
        id: "handoffs",
        title: "Sales-to-ops handoffs",
        description:
          "Won deals carry specs, contacts, and risks into fulfillment conversations.",
        icon: "clipboard",
        capabilitySlug: "deal-management",
      },
    ],
    useCases: [
      {
        id: "complex",
        title: "Complex B2B manufacturing sales",
        bestWhen: "Multiple stakeholders and long approvals are normal.",
        icon: "layers",
        useCaseSlug: "complex-sales-processes",
        href: "/use-cases/complex-sales-processes/",
      },
      {
        id: "field",
        title: "Field sales & distributor coverage",
        bestWhen: "Most selling happens at plants or with channel partners.",
        icon: "map",
        useCaseSlug: "field-sales",
        href: "/use-cases/field-sales/",
      },
      {
        id: "accounts",
        title: "Strategic account management",
        bestWhen: "Key accounts need named owners and expansion plans.",
        icon: "building",
        useCaseSlug: "account-management",
        href: "/use-cases/account-management/",
      },
      {
        id: "forecast",
        title: "Sales forecasting",
        bestWhen: "Production planning needs a cleaner demand signal.",
        icon: "chart",
        useCaseSlug: "sales-forecasting",
        href: "/use-cases/sales-forecasting/",
      },
      {
        id: "pipeline",
        title: "Quote-to-close pipeline",
        bestWhen: "Quotes stall without clear next owners.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
    ],
    implementationConsiderations: [
      {
        id: "erp-boundary",
        title: "Draw the CRM vs ERP line",
        description:
          "Example: CRM owns relationships and opportunities; ERP owns inventory and invoices unless IT designs a sync.",
        icon: "layers",
      },
      {
        id: "stages",
        title: "Encode real approval stages",
        description:
          "Include engineering, quality, or credit checkpoints your deals actually hit.",
        icon: "git-branch",
      },
      {
        id: "partners",
        title: "Distributor visibility rules",
        description:
          "Decide what channel partners can see before inviting external users.",
        icon: "lock",
      },
      {
        id: "mobile",
        title: "Field-first training",
        description:
          "Train reps on phone logging before demanding perfect desktop hygiene.",
        icon: "smartphone",
      },
    ],
    evaluationQuestions: [
      { question: "How do we track multi-site accounts and influencers?" },
      { question: "Can stages reflect engineering/quality/credit approvals?" },
      { question: "What mobile experience do field reps actually get?" },
      { question: "How might CRM connect to ERP later without a risky big-bang?" },
      { question: "What forecasting views can sales and ops share?" },
      { question: "Who administers territories and partner access?" },
    ],
    buyingFramework: buyingSteps("manufacturing", [
      {
        title: "Map the long cycle",
        description: "List stages from inquiry to purchase order.",
        href: "/use-cases/complex-sales-processes/",
        cta: "Complex sales",
      },
      {
        title: "Separate CRM from ERP jobs",
        description: "Write what each system owns.",
        href: "/guides/crm-requirements-guide/",
        cta: "Requirements guide",
      },
      {
        title: "Check field reality",
        description: "Trial mobile with two field reps.",
        href: "/capabilities/mobile/",
        cta: "Mobile capability",
      },
      {
        title: "Estimate seats",
        description: "Include inside sales, field, and managers.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description: "Filter for pipeline, mobile, and reporting needs.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
  }),

  education: pack("education", "education organizations", {
    relatedIndustrySlugs: ["nonprofit", "healthcare", "saas", "small-business"],
    priorities: [
      {
        id: "recruit",
        title: "Inquiry & recruitment pipeline",
        description:
          "Prospects and applicants move through owned stages instead of shared inboxes.",
        icon: "funnel",
        capabilitySlug: "lead-management",
      },
      {
        id: "relationships",
        title: "Family / counselor relationships",
        description:
          "Multiple contacts per household or school relationship stay connected.",
        icon: "users",
        capabilitySlug: "relationship-management",
      },
      {
        id: "nurture",
        title: "Long nurture cycles",
        description:
          "Seasonal recruitment still gets timely, relevant follow-up.",
        icon: "mail",
        capabilitySlug: "sales-engagement",
      },
      {
        id: "reporting",
        title: "Enrollment funnel reporting",
        description:
          "Leaders see where inquiries stall week to week.",
        icon: "chart",
        capabilitySlug: "reporting",
      },
      {
        id: "access",
        title: "Appropriate access",
        description:
          "Staff see only the relationship books they need.",
        icon: "shield",
        capabilitySlug: "security",
      },
      {
        id: "integrations",
        title: "SIS / marketing connections (selective)",
        description:
          "Connect carefully; CRM is not a student information system replacement.",
        icon: "puzzle",
        capabilitySlug: "integrations",
      },
    ],
    useCases: [
      {
        id: "inbound",
        title: "Inquiry management",
        bestWhen: "Web and event inquiries need fast owners.",
        icon: "inbox",
        useCaseSlug: "inbound-sales",
        href: "/use-cases/inbound-sales/",
      },
      {
        id: "pipeline",
        title: "Enrollment / admissions pipeline",
        bestWhen: "Stages from inquiry to enrolled must be visible.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "nurture",
        title: "Nurture & event follow-up",
        bestWhen: "Open days and campaigns create long follow-up lists.",
        icon: "bell",
        useCaseSlug: "customer-follow-up",
        href: "/use-cases/customer-follow-up/",
      },
      {
        id: "relationships",
        title: "Counselor / partner relationships",
        bestWhen: "Schools and counselors need stewardship over years.",
        icon: "handshake",
        useCaseSlug: "relationship-management",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "reporting",
        title: "Funnel reporting",
        bestWhen: "Leadership reviews need one trusted board.",
        icon: "chart",
        useCaseSlug: "reporting",
        href: "/use-cases/reporting/",
      },
    ],
    implementationConsiderations: [
      {
        id: "sis-boundary",
        title: "CRM vs SIS boundary",
        description:
          "Example: CRM tracks recruitment; official academic records stay in the SIS.",
        icon: "layers",
      },
      {
        id: "seasons",
        title: "Seasonal stage design",
        description:
          "Build stages that match your intake calendar, not a generic B2B template.",
        icon: "calendar",
      },
      {
        id: "privacy",
        title: "Privacy & retention rules",
        description:
          "Align with institutional policy before importing historical inquiries.",
        icon: "shield",
      },
      {
        id: "owners",
        title: "Counselor ownership",
        description:
          "Every active inquiry has a named owner before go-live week.",
        icon: "user",
      },
    ],
    evaluationQuestions: [
      { question: "How do inquiries get owners within a day during peak season?" },
      { question: "Can household or school relationships be modeled cleanly?" },
      { question: "What should never leave the SIS into CRM?" },
      { question: "Which access controls match our staffing model?" },
      { question: "What funnel metrics do leaders need weekly?" },
      { question: "How do we handle retention and deletion for prospect data?" },
    ],
    buyingFramework: buyingSteps("education", [
      {
        title: "Map the intake journey",
        description: "From first inquiry to enrolled decision.",
        href: "/use-cases/pipeline-management/",
        cta: "Pipeline use case",
      },
      {
        title: "Draw system boundaries",
        description: "CRM vs SIS vs marketing tools.",
        href: "/guides/crm-requirements-guide/",
        cta: "Requirements guide",
      },
      {
        title: "Set privacy expectations",
        description: "Access, retention, and vendor docs.",
        href: "/capabilities/security/",
        cta: "Security capability",
      },
      {
        title: "Estimate seats",
        description: "Admissions, counselors, and managers.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description: "Filter for pipeline and relationship needs.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
  }),

  nonprofit: pack("nonprofit", "nonprofit organizations", {
    relatedIndustrySlugs: ["education", "healthcare", "small-business", "hospitality"],
    priorities: [
      {
        id: "donors",
        title: "Donor & supporter relationships",
        description:
          "Giving history and next asks live with the person — not only in the email tool.",
        icon: "heart",
        capabilitySlug: "relationship-management",
      },
      {
        id: "pipeline",
        title: "Fundraising pipeline",
        description:
          "Major gifts and campaigns have stages, owners, and next steps.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "volunteers",
        title: "Volunteer / partner follow-up",
        description:
          "Engagement tasks do not disappear into personal inboxes.",
        icon: "users",
        capabilitySlug: "contact-management",
      },
      {
        id: "reporting",
        title: "Board-ready reporting",
        description:
          "Leadership sees pipeline health without rebuilding sheets before every meeting.",
        icon: "chart",
        capabilitySlug: "reporting",
      },
      {
        id: "simple",
        title: "Simple enough to adopt",
        description:
          "Small teams can run the system without a full-time RevOps hire.",
        icon: "zap",
        capabilitySlug: "customization",
      },
      {
        id: "integrations",
        title: "Donation & email connections",
        description:
          "Fundraising and email tools can sync without constant CSV uploads.",
        icon: "puzzle",
        capabilitySlug: "integrations",
      },
    ],
    useCases: [
      {
        id: "major-gifts",
        title: "Major-gift pipeline",
        bestWhen: "Cultivation needs stages and clear owners.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "relationships",
        title: "Donor relationship stewardship",
        bestWhen: "Repeat supporters need thoughtful, tracked outreach.",
        icon: "handshake",
        useCaseSlug: "relationship-management",
        href: "/use-cases/relationship-management/",
      },
      {
        id: "follow-up",
        title: "Campaign follow-up",
        bestWhen: "Appeals create surge volume that must be owned.",
        icon: "bell",
        useCaseSlug: "customer-follow-up",
        href: "/use-cases/customer-follow-up/",
      },
      {
        id: "reporting",
        title: "Leadership reporting",
        bestWhen: "Boards need trustworthy pipeline snapshots.",
        icon: "chart",
        useCaseSlug: "reporting",
        href: "/use-cases/reporting/",
      },
      {
        id: "contacts",
        title: "Supporter contact management",
        bestWhen: "Volunteers and donors are mixed across tools today.",
        icon: "users",
        useCaseSlug: "contact-management",
        href: "/use-cases/contact-management/",
      },
    ],
    implementationConsiderations: [
      {
        id: "crm-vs-donor",
        title: "CRM vs dedicated donor database",
        description:
          "Example: some orgs keep giving history in a donor system and use CRM for corporate partnerships — decide before migrating everything.",
        icon: "layers",
      },
      {
        id: "stages",
        title: "Gift stages that match reality",
        description:
          "Identify → cultivate → ask → steward — keep it short enough staff will update.",
        icon: "git-branch",
      },
      {
        id: "volunteers",
        title: "Volunteer data hygiene",
        description:
          "Separate active volunteers from lapsed contacts so outreach stays respectful.",
        icon: "filter",
      },
      {
        id: "admin",
        title: "Name a part-time system owner",
        description:
          "Someone owns fields and imports so the database does not quietly rot.",
        icon: "settings",
      },
    ],
    evaluationQuestions: [
      { question: "Will CRM replace our donor database or sit beside it?" },
      { question: "Can non-technical staff update deals after a short training?" },
      { question: "How do donation and email tools connect?" },
      { question: "What reporting does the board expect monthly?" },
      { question: "What is the true cost for our seat count?" },
      { question: "How do we export data if we change systems later?" },
    ],
    buyingFramework: buyingSteps("nonprofit", [
      {
        title: "Clarify CRM’s job",
        description: "Fundraising pipeline, corporate partnerships, or both?",
        href: "/guides/crm-requirements-guide/",
        cta: "Requirements guide",
      },
      {
        title: "Design a short gift pipeline",
        description: "Stages staff will actually use.",
        href: "/use-cases/pipeline-management/",
        cta: "Pipeline use case",
      },
      {
        title: "Check integrations",
        description: "Donation and email tools first.",
        href: "/capabilities/integrations/",
        cta: "Integrations",
      },
      {
        title: "Model nonprofit pricing",
        description: "Ask vendors about nonprofit plans; still verify list prices.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description: "Filter for simplicity and relationship needs.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
  }),

  hospitality: pack("hospitality", "hospitality businesses", {
    relatedIndustrySlugs: [
      "retail-ecommerce",
      "real-estate",
      "small-business",
      "nonprofit",
    ],
    priorities: [
      {
        id: "groups",
        title: "Group & event pipeline",
        description:
          "RFPs and group bookings have owners, stages, and next actions.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "accounts",
        title: "Account relationships",
        description:
          "Corporate and repeat bookers stay visible across properties or seasons.",
        icon: "building",
        capabilitySlug: "account-management",
      },
      {
        id: "speed",
        title: "Speed-to-lead on inquiries",
        description:
          "Website and RFP inquiries get same-day response.",
        icon: "zap",
        capabilitySlug: "lead-management",
      },
      {
        id: "handoff",
        title: "Sales-to-operations handoff",
        description:
          "Won groups carry requirements into ops without Slack archaeology.",
        icon: "clipboard",
        capabilitySlug: "deal-management",
      },
      {
        id: "reporting",
        title: "Pace & pipeline reporting",
        description:
          "Leaders see what is tentative vs definite without rebuilding sheets.",
        icon: "chart",
        capabilitySlug: "reporting",
      },
      {
        id: "integrations",
        title: "PMS / booking connections (selective)",
        description:
          "Connect carefully; CRM complements property systems rather than replacing them.",
        icon: "puzzle",
        capabilitySlug: "integrations",
      },
    ],
    useCases: [
      {
        id: "groups",
        title: "Group sales pipeline",
        bestWhen: "Events and groups need multi-stage pursuit.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "inbound",
        title: "Inbound inquiry response",
        bestWhen: "Web RFPs arrive faster than the team can triage.",
        icon: "inbox",
        useCaseSlug: "inbound-sales",
        href: "/use-cases/inbound-sales/",
      },
      {
        id: "accounts",
        title: "Corporate account management",
        bestWhen: "Repeat corporate bookers need named owners.",
        icon: "building",
        useCaseSlug: "account-management",
        href: "/use-cases/account-management/",
      },
      {
        id: "follow-up",
        title: "Proposal follow-up",
        bestWhen: "Quotes stall without reminders.",
        icon: "bell",
        useCaseSlug: "customer-follow-up",
        href: "/use-cases/customer-follow-up/",
      },
      {
        id: "reporting",
        title: "Pace reporting",
        bestWhen: "Weekly leadership needs one board.",
        icon: "chart",
        useCaseSlug: "reporting",
        href: "/use-cases/reporting/",
      },
    ],
    implementationConsiderations: [
      {
        id: "pms-boundary",
        title: "CRM vs PMS boundary",
        description:
          "Example: CRM tracks group pursuit; room inventory stays in the PMS.",
        icon: "layers",
      },
      {
        id: "sla",
        title: "Inquiry response SLA",
        description:
          "Agree who owns website RFPs within a fixed window.",
        icon: "clock",
      },
      {
        id: "handoff",
        title: "Banquet / ops handoff checklist",
        description:
          "Required fields before a deal can move to definite.",
        icon: "clipboard",
      },
      {
        id: "seasonality",
        title: "Seasonal stage hygiene",
        description:
          "Archive or re-qualify stale tentatives so pace reporting stays honest.",
        icon: "calendar",
      },
    ],
    evaluationQuestions: [
      { question: "How fast are web RFPs assigned and answered?" },
      { question: "Can group stages match how your property actually books?" },
      { question: "What must sync with the PMS — and what must not?" },
      { question: "How do multi-property teams share corporate accounts?" },
      { question: "What pace reports do leaders need weekly?" },
      { question: "What is the seat cost for sales + managers?" },
    ],
    buyingFramework: buyingSteps("hospitality", [
      {
        title: "Map group inquiry flow",
        description: "From RFP to definite booking.",
        href: "/use-cases/pipeline-management/",
        cta: "Pipeline use case",
      },
      {
        title: "Draw PMS vs CRM jobs",
        description: "Avoid duplicate inventory systems of record.",
        href: "/guides/crm-requirements-guide/",
        cta: "Requirements guide",
      },
      {
        title: "Define handoff fields",
        description: "What ops needs on a won group.",
        href: "/use-cases/account-management/",
        cta: "Account management",
      },
      {
        title: "Estimate seats",
        description: "Group sales, managers, and coordinators.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description: "Filter for pipeline speed and reporting.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
  }),

  construction: pack("construction", "construction firms", {
    relatedIndustrySlugs: [
      "real-estate",
      "manufacturing",
      "transportation-logistics",
      "small-business",
    ],
    priorities: [
      {
        id: "bid-pipeline",
        title: "Bid / estimate pipeline",
        description:
          "Opportunities move through estimate → bid → award with clear owners.",
        icon: "funnel",
        capabilitySlug: "pipeline-management",
      },
      {
        id: "accounts",
        title: "GC / owner relationships",
        description:
          "Repeat clients and influencers stay mapped across projects.",
        icon: "building",
        capabilitySlug: "relationship-management",
      },
      {
        id: "field",
        title: "Field-friendly updates",
        description:
          "Project managers and estimators can log next steps without desk time.",
        icon: "smartphone",
        capabilitySlug: "mobile",
      },
      {
        id: "handoff",
        title: "Award-to-ops handoff",
        description:
          "Won work carries contacts, scope notes, and risks into delivery.",
        icon: "clipboard",
        capabilitySlug: "deal-management",
      },
      {
        id: "forecast",
        title: "Workload foresight",
        description:
          "Leaders see likely awards without trusting verbal updates alone.",
        icon: "chart",
        capabilitySlug: "forecasting",
      },
      {
        id: "integrations",
        title: "Estimating / PM connections (later)",
        description:
          "CRM can sit beside estimating tools; sync only with clear ownership.",
        icon: "puzzle",
        capabilitySlug: "integrations",
      },
    ],
    useCases: [
      {
        id: "bids",
        title: "Bid pipeline management",
        bestWhen: "Multiple estimates compete for limited pursuit time.",
        icon: "funnel",
        useCaseSlug: "pipeline-management",
        href: "/use-cases/pipeline-management/",
      },
      {
        id: "complex",
        title: "Complex pursuit teams",
        bestWhen: "Estimating, ops, and sales share one opportunity.",
        icon: "layers",
        useCaseSlug: "complex-sales-processes",
        href: "/use-cases/complex-sales-processes/",
      },
      {
        id: "field",
        title: "Field relationship coverage",
        bestWhen: "Owners and supers meet off-desk.",
        icon: "map",
        useCaseSlug: "field-sales",
        href: "/use-cases/field-sales/",
      },
      {
        id: "accounts",
        title: "Repeat client management",
        bestWhen: "GCs and owners drive recurring work.",
        icon: "building",
        useCaseSlug: "account-management",
        href: "/use-cases/account-management/",
      },
      {
        id: "forecast",
        title: "Award forecasting",
        bestWhen: "Crew planning needs earlier signal.",
        icon: "chart",
        useCaseSlug: "sales-forecasting",
        href: "/use-cases/sales-forecasting/",
      },
    ],
    implementationConsiderations: [
      {
        id: "stages",
        title: "Bid stages that match your gate reviews",
        description:
          "Include go/no-go and estimate-complete checkpoints you already run.",
        icon: "git-branch",
      },
      {
        id: "go-no-go",
        title: "Go/no-go fields",
        description:
          "Capture why you pursue or pass so reporting improves over time.",
        icon: "form",
      },
      {
        id: "mobile",
        title: "Field logging habit",
        description:
          "Train one mobile note habit before demanding perfect desktop hygiene.",
        icon: "smartphone",
      },
      {
        id: "boundary",
        title: "CRM vs project tools",
        description:
          "Keep detailed schedules in PM software; CRM owns pursuit and relationships.",
        icon: "layers",
      },
    ],
    evaluationQuestions: [
      { question: "Can stages reflect estimate and go/no-go reviews?" },
      { question: "How do field teams update opportunities on mobile?" },
      { question: "What handoff fields are required when a bid is awarded?" },
      { question: "How do multi-office teams share GC relationships?" },
      { question: "What forecast view helps planning without false precision?" },
      { question: "Which tools must connect later (estimating, PM)?" },
    ],
    buyingFramework: buyingSteps("construction", [
      {
        title: "Map the bid lifecycle",
        description: "From lead to award.",
        href: "/use-cases/pipeline-management/",
        cta: "Pipeline use case",
      },
      {
        title: "Define go/no-go rules",
        description: "What must be true before you estimate.",
        href: "/guides/crm-requirements-guide/",
        cta: "Requirements guide",
      },
      {
        title: "Check mobile fit",
        description: "Trial with an estimator and a PM.",
        href: "/capabilities/mobile/",
        cta: "Mobile capability",
      },
      {
        title: "Estimate seats",
        description: "Estimating, sales, and managers.",
        href: "/tools/crm-cost-calculator/",
        cta: "CRM Cost Calculator",
      },
      {
        title: "Shortlist with Finder",
        description: "Filter for pipeline and field needs.",
        href: "/tools/crm-finder/",
        cta: "Start CRM Finder",
      },
    ]),
  }),

  "transportation-logistics": pack(
    "transportation-logistics",
    "transportation & logistics companies",
    {
      relatedIndustrySlugs: [
        "manufacturing",
        "retail-ecommerce",
        "construction",
        "saas",
      ],
      priorities: [
        {
          id: "accounts",
          title: "Shipper & broker relationships",
          description:
            "Accounts, contacts, and lanes stay visible across reps and shifts.",
          icon: "building",
          capabilitySlug: "account-management",
        },
        {
          id: "pipeline",
          title: "Freight / capacity opportunity pipeline",
          description:
            "New business and recurring lanes have owners and next steps.",
          icon: "funnel",
          capabilitySlug: "pipeline-management",
        },
        {
          id: "speed",
          title: "Fast inquiry response",
          description:
            "Quotes and tender responses get assigned before they go cold.",
          icon: "zap",
          capabilitySlug: "lead-management",
        },
        {
          id: "handoff",
          title: "Sales-to-ops handoff",
          description:
            "Won work carries requirements into operations cleanly.",
          icon: "clipboard",
          capabilitySlug: "deal-management",
        },
        {
          id: "reporting",
          title: "Pipeline & activity reporting",
          description:
            "Leaders see coverage and stalled quotes without spreadsheet merges.",
          icon: "chart",
          capabilitySlug: "reporting",
        },
        {
          id: "integrations",
          title: "TMS / quoting connections (selective)",
          description:
            "CRM complements TMS systems; sync only with clear field ownership.",
          icon: "puzzle",
          capabilitySlug: "integrations",
        },
      ],
      useCases: [
        {
          id: "inbound",
          title: "Inbound quote / tender response",
          bestWhen: "Inquiries arrive faster than teams can assign owners.",
          icon: "inbox",
          useCaseSlug: "inbound-sales",
          href: "/use-cases/inbound-sales/",
        },
        {
          id: "pipeline",
          title: "New freight pipeline",
          bestWhen: "Business development needs stage discipline.",
          icon: "funnel",
          useCaseSlug: "pipeline-management",
          href: "/use-cases/pipeline-management/",
        },
        {
          id: "accounts",
          title: "Shipper account management",
          bestWhen: "Key accounts need named owners and expansion plans.",
          icon: "building",
          useCaseSlug: "account-management",
          href: "/use-cases/account-management/",
        },
        {
          id: "field",
          title: "Field / regional coverage",
          bestWhen: "Reps cover regions and need mobile updates.",
          icon: "map",
          useCaseSlug: "field-sales",
          href: "/use-cases/field-sales/",
        },
        {
          id: "reporting",
          title: "Leadership reporting",
          bestWhen: "Weekly pipeline reviews need one board.",
          icon: "chart",
          useCaseSlug: "reporting",
          href: "/use-cases/reporting/",
        },
      ],
      implementationConsiderations: [
        {
          id: "tms-boundary",
          title: "CRM vs TMS boundary",
          description:
            "Example: CRM owns relationships and pursuits; execution stays in TMS unless IT designs a sync.",
          icon: "layers",
        },
        {
          id: "sla",
          title: "Quote response SLA",
          description:
            "Agree who owns inbound tenders within a fixed window.",
          icon: "clock",
        },
        {
          id: "handoff",
          title: "Ops handoff checklist",
          description:
            "Required fields before sales marks an opportunity won.",
          icon: "clipboard",
        },
        {
          id: "shifts",
          title: "Shift-friendly ownership",
          description:
            "Design assignment so after-hours inquiries do not sit orphaned.",
          icon: "users",
        },
      ],
      evaluationQuestions: [
        { question: "How are inbound quotes assigned across shifts?" },
        { question: "What belongs in CRM versus the TMS?" },
        { question: "Can regional reps update deals on mobile?" },
        { question: "What handoff fields does ops need on a win?" },
        { question: "Which integrations are realistic in the first 90 days?" },
        { question: "What pipeline reports do leaders need weekly?" },
      ],
      buyingFramework: buyingSteps("transportation-logistics", [
        {
          title: "Map inquiry-to-win",
          description: "From tender to awarded lane or account.",
          href: "/use-cases/pipeline-management/",
          cta: "Pipeline use case",
        },
        {
          title: "Separate CRM from TMS",
          description: "Write system ownership clearly.",
          href: "/guides/crm-requirements-guide/",
          cta: "Requirements guide",
        },
        {
          title: "Define response SLAs",
          description: "Who owns inbound quotes after hours.",
          href: "/use-cases/inbound-sales/",
          cta: "Inbound sales",
        },
        {
          title: "Estimate seats",
          description: "BD, account managers, and ops liaisons.",
          href: "/tools/crm-cost-calculator/",
          cta: "CRM Cost Calculator",
        },
        {
          title: "Shortlist with Finder",
          description: "Filter for speed, accounts, and reporting.",
          href: "/tools/crm-finder/",
          cta: "Start CRM Finder",
        },
      ]),
    },
  ),
};
